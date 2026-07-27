// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/BitbitAccessControl.sol";

contract AccessControlTest is Test {
    BitbitAccessControl public ac;

    address public owner1 = makeAddr("owner1");
    address public owner2 = makeAddr("owner2");
    address public owner3 = makeAddr("owner3");
    address public nonOwner = makeAddr("nonOwner");

    uint256 constant INITIAL_DELAY = 48 hours;

    function setUp() public {
        ac = new BitbitAccessControl(
            [owner1, owner2, owner3],
            INITIAL_DELAY
        );
    }

    // ─── Constructor Tests ────────────────────────────────────────────

    function test_constructor_setsOwners() public view {
        address[3] memory owners = ac.getOwners();
        assertEq(owners[0], owner1);
        assertEq(owners[1], owner2);
        assertEq(owners[2], owner3);
    }

    function test_constructor_revertsWithDuplicateOwners() public {
        vm.expectRevert(BitbitAccessControl.InvalidOwner.selector);
        new BitbitAccessControl(
            [owner1, owner1, owner3],
            INITIAL_DELAY
        );
    }

    function test_constructor_revertsWithZeroOwner() public {
        vm.expectRevert(BitbitAccessControl.InvalidOwner.selector);
        new BitbitAccessControl(
            [owner1, address(0), owner3],
            INITIAL_DELAY
        );
    }

    function test_constructor_revertsWithInvalidDelay() public {
        vm.expectRevert(BitbitAccessControl.InvalidDelay.selector);
        new BitbitAccessControl(
            [owner1, owner2, owner3],
            1 // 1 saniye — MIN_DELAY altı
        );
    }

    // ─── Pause Tests ──────────────────────────────────────────────────

    function test_pause_twoSignaturesPauses() public {
        vm.prank(owner1);
        ac.requestPause();

        vm.prank(owner2);
        ac.requestPause();

        assertTrue(ac.paused());
    }

    function test_pause_oneSignatureNotPaused() public {
        vm.prank(owner1);
        ac.requestPause();

        assertFalse(ac.paused());
    }

    function test_pause_onlyOwnerCanSign() public {
        vm.prank(nonOwner);
        vm.expectRevert(BitbitAccessControl.NotOwner.selector);
        ac.requestPause();
    }

    function test_pause_doubleSignReverts() public {
        vm.startPrank(owner1);
        ac.requestPause();
        vm.expectRevert(BitbitAccessControl.AlreadySigned.selector);
        ac.requestPause();
        vm.stopPrank();
    }

    function test_pause_cannotPauseWhenPaused() public {
        vm.prank(owner1);
        ac.requestPause();
        vm.prank(owner2);
        ac.requestPause();

        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.AlreadyPaused.selector);
        ac.requestPause();
    }

    function test_pause_twoSignersFromSameOwner() public {
        // owner1 imzalasın, owner2 de imzalasın
        vm.prank(owner1);
        ac.requestPause();

        vm.prank(owner2);
        ac.requestPause();

        assertTrue(ac.paused());
    }

    // ─── Unpause Tests ────────────────────────────────────────────────

    function test_unpause_ownerCanUnpause() public {
        // Pause et
        vm.prank(owner1);
        ac.requestPause();
        vm.prank(owner2);
        ac.requestPause();

        assertTrue(ac.paused());

        // Unpause et
        vm.prank(owner3);
        ac.unpause();

        assertFalse(ac.paused());
    }

    function test_unpause_revertsWhenNotPaused() public {
        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.NotPaused.selector);
        ac.unpause();
    }

    // ─── Timelock Tests ───────────────────────────────────────────────

    function test_timelock_requestAndExecute() public {
        bytes32 txHash = keccak256(abi.encodePacked("commission-change"));

        vm.prank(owner1);
        ac.requestTimelockChange(txHash, "Commission change to 3%");

        assertTrue(ac.timelockExists(txHash));
        assertFalse(ac.isTimelockReady(txHash));

        // Timelock_DELAY kadar bekle
        vm.warp(block.timestamp + 48 hours + 1);

        assertTrue(ac.isTimelockReady(txHash));

        vm.prank(owner2);
        ac.executeTimelockChange(txHash);

        assertFalse(ac.timelockExists(txHash));
    }

    function test_timelock_cannotExecuteEarly() public {
        bytes32 txHash = keccak256(abi.encodePacked("early-execute"));

        vm.prank(owner1);
        ac.requestTimelockChange(txHash, "Early execute test");

        // 1 saat bekle (48h delay var)
        vm.warp(block.timestamp + 1 hours);

        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.TimelockNotReady.selector);
        ac.executeTimelockChange(txHash);
    }

    function test_timelock_onlyOwnerCanRequest() public {
        bytes32 txHash = keccak256(abi.encodePacked("non-owner-request"));

        vm.prank(nonOwner);
        vm.expectRevert(BitbitAccessControl.NotOwner.selector);
        ac.requestTimelockChange(txHash, "Non-owner request");
    }

    function test_timelock_cannotRequestTwice() public {
        bytes32 txHash = keccak256(abi.encodePacked("double-request"));

        vm.prank(owner1);
        ac.requestTimelockChange(txHash, "First request");

        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.TxAlreadyExecuted.selector);
        ac.requestTimelockChange(txHash, "Second request");
    }

    function test_timelock_cannotExecuteUnqueued() public {
        bytes32 txHash = keccak256(abi.encodePacked("not-queued"));

        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.TimelockNotQueued.selector);
        ac.executeTimelockChange(txHash);
    }

    // ─── Delay Update Tests ───────────────────────────────────────────

    function test_delayUpdate_valid() public {
        vm.prank(owner1);
        ac.updateDelay(24 hours);

        assertEq(ac.timelockDelay(), 24 hours);
    }

    function test_delayUpdate_revertsBelowMinimum() public {
        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.InvalidDelay.selector);
        ac.updateDelay(1);
    }

    function test_delayUpdate_revertsAboveMaximum() public {
        vm.prank(owner1);
        vm.expectRevert(BitbitAccessControl.InvalidDelay.selector);
        ac.updateDelay(73 hours);
    }
}
