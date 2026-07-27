// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BitbitAccessControl.sol";
import "./ReservationToken.sol";

/// @title EscrowSwap — Atomik takas (USDC ↔ Rezervasyon Token)
/// @notice Deposit → ExecuteSwap → (RefundIfFailed) akışını yönetir
/// @dev Atomic swap prensibi: para ve hak aynı transaction'da (all-or-nothing)
contract EscrowSwap is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Enums & Structs ─────────────────────────────────────────────

    enum SwapStatus {
        Active,
        Completed,
        Refunded
    }

    struct Swap {
        address buyer;
        address seller;
        uint256 totalUsdc;
        uint256 sellerAmount;
        uint256 platformAmount;
        bytes32 reservationHash;
        string metadataURI;
        SwapStatus status;
    }

    // ─── State ────────────────────────────────────────────────────────

    IERC20 public immutable usdc;
    BitbitAccessControl public immutable accessControl;
    ReservationToken public immutable reservationToken;

    uint256 public commissionBps; // Örn: 500 = %5
    uint256 public constant MAX_BPS = 10000;

    uint256 public nextSwapId;
    mapping(uint256 => Swap) public swaps;
    mapping(bytes32 => bool) public idempotencyKeys;

    // ─── Events ───────────────────────────────────────────────────────

    event Deposit(
        uint256 indexed swapId,
        address indexed buyer,
        address indexed seller,
        uint256 totalUsdc,
        bytes32 reservationHash,
        string metadataURI,
        bytes32 idempotencyKey
    );

    event SwapExecuted(
        uint256 indexed swapId,
        address indexed buyer,
        address indexed seller,
        uint256 sellerAmount,
        uint256 platformAmount,
        uint256 tokenId
    );

    event SwapRefunded(
        uint256 indexed swapId,
        address indexed buyer,
        uint256 amount
    );

    event CommissionUpdated(uint256 oldBps, uint256 newBps);

    // ─── Errors ───────────────────────────────────────────────────────

    error ZeroAmount();
    error DuplicateKey();
    error SwapNotFound();
    error SwapNotActive();
    error NotBuyer();
    error NotPlatformOrBuyer();
    error InvalidHash();
    error TokenHashAlreadySet();
    error InvalidAddress();
    error InvalidCommission();

    // ─── Modifiers ────────────────────────────────────────────────────

    modifier onlyPlatform() {
        if (!accessControl.isOwner(msg.sender)) revert NotPlatformOrBuyer();
        _;
    }

    modifier validSwap(uint256 swapId) {
        if (swaps[swapId].buyer == address(0)) revert SwapNotFound();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────

    constructor(
        address _usdc,
        address _accessControl,
        address _reservationToken,
        uint256 _commissionBps
    ) {
        if (_usdc == address(0) || _accessControl == address(0) || _reservationToken == address(0)) {
            revert InvalidAddress();
        }
        if (_commissionBps > MAX_BPS) {
            revert InvalidCommission();
        }

        usdc = IERC20(_usdc);
        accessControl = BitbitAccessControl(_accessControl);
        reservationToken = ReservationToken(_reservationToken);
        commissionBps = _commissionBps;
    }

    // ─── Core Functions ───────────────────────────────────────────────

    /// @notice Alıcının USDC'sini escrow'a kilitler
    /// @dev Checks-Effects-Interactions: state önce güncellenir, transfer sonra yapılır
    function deposit(
        address seller,
        uint256 totalUsdc,
        bytes32 reservationHash,
        string calldata metadataURI,
        bytes32 idempotencyKey
    ) external nonReentrant returns (uint256 swapId) {
        if (totalUsdc == 0) revert ZeroAmount();
        if (seller == address(0)) revert InvalidAddress();
        if (seller == msg.sender) revert InvalidAddress();
        if (idempotencyKeys[idempotencyKey]) revert DuplicateKey();

        // Idempotency: aynı key tekrar kullanılamaz
        idempotencyKeys[idempotencyKey] = true;

        // Komisyon hesapla
        uint256 sellerAmount = (totalUsdc * (MAX_BPS - commissionBps)) / MAX_BPS;
        uint256 platformAmount = totalUsdc - sellerAmount;

        // Effects — state güncelle
        swapId = nextSwapId++;
        swaps[swapId] = Swap({
            buyer: msg.sender,
            seller: seller,
            totalUsdc: totalUsdc,
            sellerAmount: sellerAmount,
            platformAmount: platformAmount,
            reservationHash: reservationHash,
            metadataURI: metadataURI,
            status: SwapStatus.Active
        });

        // Interaction — USDC transfer (effects之后)
        // SafeERC20 ile transferFrom: buyer → escrow
        usdc.safeTransferFrom(msg.sender, address(this), totalUsdc);

        emit Deposit(
            swapId,
            msg.sender,
            seller,
            totalUsdc,
            reservationHash,
            metadataURI,
            idempotencyKey
        );
    }

    /// @notice Atomic swap: USDC'yi satıcıya + platforma böler, token'ı alıcıya devreder
    /// @dev Tek transaction — all-or-nothing
    function executeSwap(
        uint256 swapId
    ) external nonReentrant validSwap(swapId) {
        Swap storage swap = swaps[swapId];

        if (swap.status != SwapStatus.Active) revert SwapNotActive();
        if (swap.reservationHash == bytes32(0)) revert InvalidHash();

        // Effects — state güncelle (interaction'lardan önce)
        swap.status = SwapStatus.Completed;

        // Interaction — USDC transferleri
        // 1. Satıcıya USDC
        usdc.safeTransfer(swap.seller, swap.sellerAmount);

        // 2. Platforma komisyon
        usdc.safeTransfer(msg.sender, swap.platformAmount);

        // 3. ReservationToken mint — alıcıya (atomikliğin parçası)
        uint256 tokenId = reservationToken.mint(
            swap.buyer,
            swap.reservationHash,
            swap.metadataURI
        );

        emit SwapExecuted(
            swapId,
            swap.buyer,
            swap.seller,
            swap.sellerAmount,
            swap.platformAmount,
            tokenId
        );
    }

    /// @notice PMS senkronizasyonu başarısızsa geri ödeme
    /// @dev Buyer veya platform tarafından çağrılabilir
    function refundIfFailed(
        uint256 swapId
    ) external nonReentrant validSwap(swapId) {
        Swap storage swap = swaps[swapId];

        if (swap.status != SwapStatus.Active) revert SwapNotActive();

        // Buyer veya platform (owner) çağırabilir
        if (msg.sender != swap.buyer && !accessControl.isOwner(msg.sender)) {
            revert NotPlatformOrBuyer();
        }

        // Effects
        swap.status = SwapStatus.Refunded;

        // Interaction — buyer'a USDC geri gönder
        usdc.safeTransfer(swap.buyer, swap.totalUsdc);

        emit SwapRefunded(swapId, swap.buyer, swap.totalUsdc);
    }

    // ─── Admin Functions ──────────────────────────────────────────────

    /// @notice Komisyon oranını güncelle (sadece platform owner)
    function setCommissionBps(
        uint256 newBps
    ) external onlyPlatform {
        if (newBps > MAX_BPS) revert InvalidCommission();

        uint256 oldBps = commissionBps;
        commissionBps = newBps;

        emit CommissionUpdated(oldBps, newBps);
    }

    /// @notice Seller'ın token hash'ini set et (platform onayıyla)
    function setTokenHash(
        uint256 swapId,
        bytes32 reservationHash
    ) external onlyPlatform validSwap(swapId) {
        if (reservationHash == bytes32(0)) revert InvalidHash();

        Swap storage swap = swaps[swapId];
        if (swap.reservationHash != bytes32(0)) revert TokenHashAlreadySet();

        swap.reservationHash = reservationHash;
    }

    // ─── View Functions ───────────────────────────────────────────────

    function getSwap(
        uint256 swapId
    ) external view returns (Swap memory) {
        return swaps[swapId];
    }

    function getCommissionBps() external view returns (uint256) {
        return commissionBps;
    }
}
