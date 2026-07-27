// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ReservationToken — Rezervasyon hakkını temsil eden ERC-721 token
/// @notice Mint yalnızca yetkili minter (EscrowSwap) tarafından tetiklenebilir
/// @dev Minter, owner tarafından bir kez set edilebilir (circular dependency çözümü)
contract ReservationToken is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    address public minter;
    bool public minterSet;

    event ReservationMinted(
        uint256 indexed tokenId,
        address indexed to,
        bytes32 indexed reservationHash,
        string metadataURI
    );

    event MinterSet(address indexed minter);

    error OnlyMinter();
    error InvalidRecipient();
    error InvalidReservationHash();
    error MinterAlreadySet();

    modifier onlyMinter() {
        if (msg.sender != minter) revert OnlyMinter();
        _;
    }

    constructor(address _initialOwner) ERC721("BITBIT Reservation Token", "BRT") Ownable(_initialOwner) {
        // Minter is set later via setMinter() to resolve circular dependency
    }

    /// @notice Minter adresini bir kez set eder (owner tarafından)
    /// @dev Circular dependency çözümü: token deploy → escrow deploy → minter set
    function setMinter(address _minter) external onlyOwner {
        if (minterSet) revert MinterAlreadySet();
        if (_minter == address(0)) revert InvalidRecipient();

        minter = _minter;
        minterSet = true;

        emit MinterSet(_minter);
    }

    /// @notice Yeni bir rezervasyon token'ı mint eder
    /// @param to Token'ın gönderileceği adres
    /// @param reservationHash Anonim hash (hiçbir PMS kodu veya PII içermez)
    /// @param metadataURI Token metadata URI'si
    /// @return tokenId Mint edilen token'ın ID'si
    function mint(
        address to,
        bytes32 reservationHash,
        string calldata metadataURI
    ) external onlyMinter returns (uint256 tokenId) {
        if (to == address(0)) revert InvalidRecipient();
        if (reservationHash == bytes32(0)) revert InvalidReservationHash();

        tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit ReservationMinted(tokenId, to, reservationHash, metadataURI);
    }

    /// @dev ERC721 ve ERC721URIStorage için override'lar
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
