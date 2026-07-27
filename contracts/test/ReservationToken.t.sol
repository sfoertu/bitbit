// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/ReservationToken.sol";

contract ReservationTokenTest is Test {
    ReservationToken public token;

    address public owner = makeAddr("owner");
    address public minter = makeAddr("minter");
    address public recipient = makeAddr("recipient");
    address public attacker = makeAddr("attacker");

    function setUp() public {
        token = new ReservationToken(owner);
        vm.prank(owner);
        token.setMinter(minter);
    }

    // ─── Mint Tests ───────────────────────────────────────────────────

    function test_mint_success() public {
        bytes32 hash = keccak256(abi.encodePacked("reservation-1"));
        string memory uri = "ipfs://Qm123";

        vm.prank(minter);
        uint256 tokenId = token.mint(recipient, hash, uri);

        assertEq(tokenId, 0);
        assertEq(token.ownerOf(0), recipient);
        assertEq(token.tokenURI(0), uri);
    }

    function test_mint_onlyByMinter() public {
        bytes32 hash = keccak256(abi.encodePacked("reservation-2"));

        vm.prank(attacker);
        vm.expectRevert(ReservationToken.OnlyMinter.selector);
        token.mint(recipient, hash, "ipfs://Qm456");
    }

    function test_mint_zeroAddressReverts() public {
        bytes32 hash = keccak256(abi.encodePacked("reservation-3"));

        vm.prank(minter);
        vm.expectRevert(ReservationToken.InvalidRecipient.selector);
        token.mint(address(0), hash, "ipfs://Qm789");
    }

    function test_mint_zeroHashReverts() public {
        vm.prank(minter);
        vm.expectRevert(ReservationToken.InvalidReservationHash.selector);
        token.mint(recipient, bytes32(0), "ipfs://Qm000");
    }

    function test_mint_sequentialTokens() public {
        bytes32 hash1 = keccak256(abi.encodePacked("hash-1"));
        bytes32 hash2 = keccak256(abi.encodePacked("hash-2"));

        vm.startPrank(minter);
        uint256 t1 = token.mint(recipient, hash1, "uri-1");
        uint256 t2 = token.mint(recipient, hash2, "uri-2");
        vm.stopPrank();

        assertEq(t1, 0);
        assertEq(t2, 1);
    }

    // ─── setMinter Tests ──────────────────────────────────────────────

    function test_setMinter_success() public {
        ReservationToken newToken = new ReservationToken(owner);
        vm.prank(owner);
        newToken.setMinter(minter);
        assertEq(newToken.minter(), minter);
        assertTrue(newToken.minterSet());
    }

    function test_setMinter_onlyOnce() public {
        // Minter already set in setUp — calling again should revert
        vm.prank(owner);
        vm.expectRevert(ReservationToken.MinterAlreadySet.selector);
        token.setMinter(attacker);
    }

    function test_setMinter_onlyOwner() public {
        ReservationToken newToken = new ReservationToken(owner);

        vm.prank(attacker);
        vm.expectRevert();
        newToken.setMinter(minter);
    }

    function test_setMinter_zeroAddressReverts() public {
        ReservationToken newToken = new ReservationToken(owner);

        vm.prank(owner);
        vm.expectRevert(ReservationToken.InvalidRecipient.selector);
        newToken.setMinter(address(0));
    }

    // ─── supportsInterface Tests ──────────────────────────────────────

    function test_supportsInterface_ERC721() public view {
        // ERC721 interfaceId = 0x80ac58cd
        assertTrue(token.supportsInterface(0x80ac58cd));
    }

    function test_supportsInterface_ERC165() public view {
        // ERC165 interfaceId = 0x01ffc9a7
        assertTrue(token.supportsInterface(0x01ffc9a7));
    }

    function test_supportsInterface_ERC721Metadata() public view {
        // ERC721Metadata interfaceId = 0x5b5e139f
        assertTrue(token.supportsInterface(0x5b5e139f));
    }

    function test_supportsInterface_unsupported() public view {
        // Random interface that's not supported
        assertFalse(token.supportsInterface(0xffffffff));
    }
}
