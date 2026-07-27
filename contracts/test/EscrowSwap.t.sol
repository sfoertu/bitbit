// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/BitbitAccessControl.sol";
import "../src/ReservationToken.sol";
import "../src/EscrowSwap.sol";

contract EscrowSwapTest is Test {
    EscrowSwap public escrow;
    MockERC20 public usdc;
    BitbitAccessControl public accessControl;
    ReservationToken public reservationToken;

    address public platformAdmin1 = makeAddr("admin1");
    address public platformAdmin2 = makeAddr("admin2");
    address public platformAdmin3 = makeAddr("admin3");
    address public buyer = makeAddr("buyer");
    address public seller = makeAddr("seller");
    address public attacker = makeAddr("attacker");

    uint256 constant INITIAL_DELAY = 48 hours;

    function setUp() public {
        // Deploy all contracts
        usdc = new MockERC20("USD Coin", "USDC", 6);

        accessControl = new BitbitAccessControl(
            [platformAdmin1, platformAdmin2, platformAdmin3],
            INITIAL_DELAY
        );

        // Deployment order (no circular dependency with setMinter):
        // 1. Deploy ReservationToken (no minter yet)
        // 2. Deploy EscrowSwap (with token address)
        // 3. Set token's minter to escrow
        reservationToken = new ReservationToken(platformAdmin1);

        escrow = new EscrowSwap(
            address(usdc),
            address(accessControl),
            address(reservationToken),
            500
        );

        // Set the minter (one-time, by owner)
        vm.prank(platformAdmin1);
        reservationToken.setMinter(address(escrow));

        // Mint test USDC'leri
        usdc.mint(buyer, 1_000_000e6);
    }

    // ─── Helper ───────────────────────────────────────────────────────

    function _depositAsBuyer(
        uint256 amount,
        bytes32 hash,
        string memory uri,
        bytes32 key
    ) internal returns (uint256) {
        vm.startPrank(buyer);
        usdc.approve(address(escrow), amount);
        uint256 swapId = escrow.deposit(seller, amount, hash, uri, key);
        vm.stopPrank();
        return swapId;
    }

    // ─── Deposit Tests ────────────────────────────────────────────────

    function test_deposit_success() public {
        uint256 amount = 150_000e6;
        bytes32 hash = keccak256(abi.encodePacked("reservation-001"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://metadata",
            keccak256(abi.encodePacked("key-1"))
        );

        assertEq(swapId, 0);
        assertEq(usdc.balanceOf(address(escrow)), amount);

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(swap.buyer, buyer);
        assertEq(swap.seller, seller);
        assertEq(swap.totalUsdc, amount);
        assertEq(uint256(swap.status), uint256(EscrowSwap.SwapStatus.Active));
    }

    function test_deposit_commissionCalculation() public {
        uint256 amount = 100_000e6;
        bytes32 hash = keccak256(abi.encodePacked("reservation-002"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://meta",
            keccak256(abi.encodePacked("key-2"))
        );

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        // %5 komisyon: seller = 95000e6, platform = 5000e6
        assertEq(swap.sellerAmount, 95_000e6);
        assertEq(swap.platformAmount, 5_000e6);
    }

    function test_deposit_zeroAmountReverts() public {
        bytes32 hash = keccak256(abi.encodePacked("res-003"));

        vm.startPrank(buyer);
        usdc.approve(address(escrow), 0);
        vm.expectRevert(EscrowSwap.ZeroAmount.selector);
        escrow.deposit(
            seller,
            0,
            hash,
            "ipfs://meta",
            keccak256(abi.encodePacked("key-3"))
        );
        vm.stopPrank();
    }

    function test_deposit_zeroSellerReverts() public {
        vm.startPrank(buyer);
        usdc.approve(address(escrow), 100e6);
        vm.expectRevert(EscrowSwap.InvalidAddress.selector);
        escrow.deposit(
            address(0),
            100e6,
            keccak256(abi.encodePacked("res")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key"))
        );
        vm.stopPrank();
    }

    function test_deposit_selfSellReverts() public {
        vm.startPrank(buyer);
        usdc.approve(address(escrow), 100e6);
        vm.expectRevert(EscrowSwap.InvalidAddress.selector);
        escrow.deposit(
            buyer,
            100e6,
            keccak256(abi.encodePacked("res")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key"))
        );
        vm.stopPrank();
    }

    function test_deposit_duplicateKeyReverts() public {
        bytes32 key = keccak256(abi.encodePacked("unique-key"));
        bytes32 hash = keccak256(abi.encodePacked("res"));

        _depositAsBuyer(100e6, hash, "ipfs://meta", key);

        vm.startPrank(buyer);
        usdc.approve(address(escrow), 100e6);
        vm.expectRevert(EscrowSwap.DuplicateKey.selector);
        escrow.deposit(seller, 100e6, hash, "ipfs://meta", key);
        vm.stopPrank();
    }

    function test_deposit_zeroHashAllowed() public {
        // Zero hash is allowed — set later via setTokenHash
        uint256 swapId = _depositAsBuyer(
            100e6,
            bytes32(0),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-zero-hash"))
        );

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(swap.reservationHash, bytes32(0));
    }

    // ─── executeSwap Tests ────────────────────────────────────────────

    function test_executeSwap_success() public {
        uint256 amount = 150_000e6;
        bytes32 hash = keccak256(abi.encodePacked("reservation-swap-1"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://swap-meta",
            keccak256(abi.encodePacked("swap-key-1"))
        );

        uint256 sellerBalBefore = usdc.balanceOf(seller);

        // Platform admin execute etsin
        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        // Token mint edildi mi?
        assertEq(reservationToken.ownerOf(0), buyer);

        // Doğru adreslere transfer edildi mi?
        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(usdc.balanceOf(seller), sellerBalBefore + swap.sellerAmount);
        assertEq(usdc.balanceOf(platformAdmin1), swap.platformAmount);

        // Status
        assertEq(uint256(swap.status), uint256(EscrowSwap.SwapStatus.Completed));
    }

    function test_executeSwap_revertsWhenNotActive() public {
        uint256 swapId = _depositAsBuyer(
            100e6,
            keccak256(abi.encodePacked("res")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key"))
        );

        // İlk execute et
        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        // Tekrar execute et — revert
        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.SwapNotActive.selector);
        escrow.executeSwap(swapId);
    }

    function test_executeSwap_revertsWhenTokenHashNotSet() public {
        // Deposit with zero hash — executeSwap should revert (hash required for mint)
        uint256 swapId = _depositAsBuyer(
            100e6,
            bytes32(0),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-no-hash"))
        );

        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.InvalidHash.selector);
        escrow.executeSwap(swapId);
    }

    function test_executeSwap_atomicity() public {
        uint256 amount = 200_000e6;
        bytes32 hash = keccak256(abi.encodePacked("atomic-test"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://atomic",
            keccak256(abi.encodePacked("atomic-key"))
        );

        uint256 buyerBalBefore = usdc.balanceOf(buyer);
        uint256 sellerBalBefore = usdc.balanceOf(seller);

        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        // Tüm transferler başarılı — atomic
        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(
            usdc.balanceOf(buyer),
            buyerBalBefore // Buyer bakiyesi değişmedi (önceden approve etmişti)
        );
        assertEq(
            usdc.balanceOf(seller),
            sellerBalBefore + swap.sellerAmount
        );
        assertEq(reservationToken.ownerOf(0), buyer);
    }

    // ─── refundIfFailed Tests ─────────────────────────────────────────

    function test_refund_platformCanRefund() public {
        uint256 amount = 100_000e6;
        bytes32 hash = keccak256(abi.encodePacked("refund-1"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://refund",
            keccak256(abi.encodePacked("refund-key-1"))
        );

        uint256 buyerBalBefore = usdc.balanceOf(buyer);

        vm.prank(platformAdmin1);
        escrow.refundIfFailed(swapId);

        assertEq(usdc.balanceOf(buyer), buyerBalBefore + amount);

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(uint256(swap.status), uint256(EscrowSwap.SwapStatus.Refunded));
    }

    function test_refund_buyerCanRefund() public {
        uint256 amount = 100_000e6;
        bytes32 hash = keccak256(abi.encodePacked("refund-2"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://refund",
            keccak256(abi.encodePacked("refund-key-2"))
        );

        uint256 buyerBalBefore = usdc.balanceOf(buyer);

        vm.prank(buyer);
        escrow.refundIfFailed(swapId);

        assertEq(usdc.balanceOf(buyer), buyerBalBefore + amount);
    }

    function test_refund_attackerCannotRefund() public {
        uint256 amount = 100_000e6;
        bytes32 hash = keccak256(abi.encodePacked("refund-3"));

        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://refund",
            keccak256(abi.encodePacked("refund-key-3"))
        );

        vm.prank(attacker);
        vm.expectRevert(EscrowSwap.NotPlatformOrBuyer.selector);
        escrow.refundIfFailed(swapId);
    }

    function test_refund_revertsWhenCompleted() public {
        uint256 swapId = _depositAsBuyer(
            100e6,
            keccak256(abi.encodePacked("res")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key"))
        );

        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.SwapNotActive.selector);
        escrow.refundIfFailed(swapId);
    }

    function test_refund_revertsWhenAlreadyRefunded() public {
        uint256 swapId = _depositAsBuyer(
            100e6,
            keccak256(abi.encodePacked("res")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key"))
        );

        vm.prank(platformAdmin1);
        escrow.refundIfFailed(swapId);

        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.SwapNotActive.selector);
        escrow.refundIfFailed(swapId);
    }

    // ─── Admin Tests ──────────────────────────────────────────────────

    function test_setCommissionBps() public {
        vm.prank(platformAdmin1);
        escrow.setCommissionBps(300); // %3

        assertEq(escrow.getCommissionBps(), 300);
    }

    function test_setCommissionBps_revertsAboveMax() public {
        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.InvalidCommission.selector);
        escrow.setCommissionBps(10001);
    }

    function test_setCommissionBps_nonOwnerReverts() public {
        vm.prank(attacker);
        vm.expectRevert(EscrowSwap.NotPlatformOrBuyer.selector);
        escrow.setCommissionBps(300);
    }

    function test_setTokenHash() public {
        // Deposit with zero hash, then set real hash
        uint256 swapId = _depositAsBuyer(
            100e6,
            bytes32(0),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-hash"))
        );

        bytes32 realHash = keccak256(abi.encodePacked("real-hash"));
        vm.prank(platformAdmin1);
        escrow.setTokenHash(swapId, realHash);

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(swap.reservationHash, realHash);
    }

    function test_setTokenHash_revertsIfAlreadySet() public {
        // Deposit with a non-zero hash — setTokenHash should revert
        uint256 swapId = _depositAsBuyer(
            100e6,
            keccak256(abi.encodePacked("already-set")),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-already"))
        );

        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.TokenHashAlreadySet.selector);
        escrow.setTokenHash(
            swapId,
            keccak256(abi.encodePacked("new-hash"))
        );
    }

    // ─── Fuzz Tests ───────────────────────────────────────────────────

    function testFuzz_depositAndExecuteSwap(uint256 amount) public {
        // Bound: 1 USDC ile 1M USDC arası
        amount = bound(amount, 1e6, 1_000_000e6);

        usdc.mint(buyer, amount);

        bytes32 hash = keccak256(abi.encodePacked("fuzz", amount));
        bytes32 key = keccak256(abi.encodePacked("fuzz-key", amount));

        uint256 swapId = _depositAsBuyer(amount, hash, "ipfs://fuzz", key);

        uint256 sellerBalBefore = usdc.balanceOf(seller);

        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(usdc.balanceOf(seller), sellerBalBefore + swap.sellerAmount);

        // Commission = totalUsdc - sellerAmount
        assertEq(
            swap.platformAmount,
            amount - swap.sellerAmount
        );
    }

    function testFuzz_refundReturnsExactAmount(uint256 amount) public {
        amount = bound(amount, 1e6, 1_000_000e6);

        usdc.mint(buyer, amount);

        bytes32 hash = keccak256(abi.encodePacked("fuzz-refund", amount));
        bytes32 key = keccak256(abi.encodePacked("fuzz-refund-key", amount));

        uint256 swapId = _depositAsBuyer(amount, hash, "ipfs://fuzz", key);

        uint256 buyerBalBefore = usdc.balanceOf(buyer);

        vm.prank(platformAdmin1);
        escrow.refundIfFailed(swapId);

        assertEq(usdc.balanceOf(buyer), buyerBalBefore + amount);
    }

    function testFuzz_commissionNeverExceedsTotal(
        uint256 amount,
        uint256 bps
    ) public {
        amount = bound(amount, 1e6, 1_000_000e6);
        bps = bound(bps, 0, 10000);

        // Yeni escrow — farklı komisyon ile
        EscrowSwap newEscrow = new EscrowSwap(
            address(usdc),
            address(accessControl),
            address(reservationToken),
            bps
        );

        usdc.mint(buyer, amount);

        vm.startPrank(buyer);
        usdc.approve(address(newEscrow), amount);
        uint256 swapId = newEscrow.deposit(
            seller,
            amount,
            keccak256(abi.encodePacked("fuzz-comm", amount)),
            "ipfs://fuzz",
            keccak256(abi.encodePacked("fuzz-comm-key", amount, bps))
        );
        vm.stopPrank();

        EscrowSwap.Swap memory swap = newEscrow.getSwap(swapId);

        // seller + platform = totalUsdc (her zaman)
        assertEq(
            swap.sellerAmount + swap.platformAmount,
            swap.totalUsdc
        );

        // Herhangi bir negatif yok
        assertTrue(swap.sellerAmount <= swap.totalUsdc);
        assertTrue(swap.platformAmount <= swap.totalUsdc);
    }

    // ─── Integration Test ─────────────────────────────────────────────

    function test_fullSwapFlow() public {
        // 1. Deposit
        uint256 amount = 150_000e6;
        bytes32 hash = keccak256(abi.encodePacked("integration-res-1"));
        uint256 swapId = _depositAsBuyer(
            amount,
            hash,
            "ipfs://integration",
            keccak256(abi.encodePacked("integ-key-1"))
        );

        // 2. Execute
        vm.prank(platformAdmin1);
        escrow.executeSwap(swapId);

        // 3. Verify
        EscrowSwap.Swap memory swap = escrow.getSwap(swapId);
        assertEq(uint256(swap.status), uint256(EscrowSwap.SwapStatus.Completed));
        assertEq(reservationToken.ownerOf(0), buyer);

        // 4. Seller got USDC
        assertTrue(usdc.balanceOf(seller) > 0);

        // 5. Platform got commission
        assertTrue(usdc.balanceOf(platformAdmin1) > 0);
    }

    // ─── Constructor Validation Tests ─────────────────────────────────

    function test_constructor_revertsOnZeroUsdc() public {
        vm.expectRevert(EscrowSwap.InvalidAddress.selector);
        new EscrowSwap(
            address(0),
            address(accessControl),
            address(reservationToken),
            500
        );
    }

    function test_constructor_revertsOnZeroAccessControl() public {
        vm.expectRevert(EscrowSwap.InvalidAddress.selector);
        new EscrowSwap(
            address(usdc),
            address(0),
            address(reservationToken),
            500
        );
    }

    function test_constructor_revertsOnZeroToken() public {
        vm.expectRevert(EscrowSwap.InvalidAddress.selector);
        new EscrowSwap(
            address(usdc),
            address(accessControl),
            address(0),
            500
        );
    }

    function test_constructor_revertsOnCommissionTooHigh() public {
        vm.expectRevert(EscrowSwap.InvalidCommission.selector);
        new EscrowSwap(
            address(usdc),
            address(accessControl),
            address(reservationToken),
            10001
        );
    }

    // ─── validSwap Modifier Tests ─────────────────────────────────────

    function test_executeSwap_revertsOnNonExistentSwap() public {
        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.SwapNotFound.selector);
        escrow.executeSwap(999);
    }

    function test_refund_revertsOnNonExistentSwap() public {
        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.SwapNotFound.selector);
        escrow.refundIfFailed(999);
    }

    function test_setTokenHash_revertsOnZeroHash() public {
        uint256 swapId = _depositAsBuyer(
            100e6,
            bytes32(0),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-zero-hash-test"))
        );

        vm.prank(platformAdmin1);
        vm.expectRevert(EscrowSwap.InvalidHash.selector);
        escrow.setTokenHash(swapId, bytes32(0));
    }

    function test_setTokenHash_revertsForNonOwner() public {
        uint256 swapId = _depositAsBuyer(
            100e6,
            bytes32(0),
            "ipfs://meta",
            keccak256(abi.encodePacked("key-nonowner-hash"))
        );

        vm.prank(attacker);
        vm.expectRevert(EscrowSwap.NotPlatformOrBuyer.selector);
        escrow.setTokenHash(
            swapId,
            keccak256(abi.encodePacked("hash"))
        );
    }
}
