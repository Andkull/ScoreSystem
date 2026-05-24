// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ScoreSystem} from "../src/ScoreSystem.sol";

contract ScoreSystemTest is Test {
    ScoreSystem public game;

    address public admin;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        admin = address(this);
        game = new ScoreSystem();
    }

    function test_Register() public {
        vm.prank(user1);
        game.register();

        (uint256 score, bool isMember, bool wonTshirt, ) = game.getPlayerData(user1);
        assertTrue(isMember);
        assertEq(score, 0);
        assertFalse(wonTshirt);
    }

    function test_AdminGivePoints() public {
        vm.prank(user1);
        game.register();

        game.adminGivePoints(user1, 100);

        (uint256 score,,,) = game.getPlayerData(user1);
        assertEq(score, 100);
    }

    function test_RevertIfUserGivesPoints() public {
        vm.prank(user1);
        game.register();

        vm.prank(user1);

        vm.expectRevert("Only the admin can do this");
        game.adminGivePoints(user1, 1000);
    }

    function test_TransferPoints() public {
        vm.startPrank(user1);
        game.register();
        vm.stopPrank();

        game.adminGivePoints(user1, 100);

        vm.prank(user2);
        game.register();

        vm.prank(user1);
        game.transferPoints(user2, 40);

        (uint256 score1,,,) = game.getPlayerData(user1);
        (uint256 score2,,,) = game.getPlayerData(user2);

        assertEq(score1, 60);
        assertEq(score2, 40);
    }

    function test_BuyTshirt() public {
        vm.prank(user1);
        game.register();

        game.adminGivePoints(user1, 50);

        vm.prank(user1);
        game.buyTshirt();

        (uint256 score,, bool wonTshirt,) = game.getPlayerData(user1);

        assertTrue(wonTshirt);
        assertEq(score, 0);
    }

    function test_RevertIfInsufficientPoints() public {
        vm.prank(user1);
        game.register();
        vm.prank(user2);
        game.register();

        game.adminGivePoints(user1, 10);

        vm.prank(user1);
        vm.expectRevert("Not enough points");
        game.transferPoints(user2, 20);
    }

    function test_RevertIfAlreadyRegistered() public {
        vm.startPrank(user1);

        game.register();

        vm.expectRevert("You are already registered");
        game.register();

        vm.stopPrank();
    }

    function test_PlayGame() public {
        vm.prank(user1);
        game.register();

        vm.prank(user1);
        game.playGame(1);
    }

    function test_RevertIfInvalidGuess() public {
        vm.prank(user1);
        game.register();

        vm.prank(user1);

        vm.expectRevert("Guess must be 1, 2, or 3");
        game.playGame(4);
    }

    function test_RevertIfCooldownActive() public {
        vm.prank(user1);
        game.register();

        vm.prank(user1);
        game.playGame(1);

        vm.prank(user1);
        vm.expectRevert("Cooldown active: You can only play once every 24 hours");
        game.playGame(2);
    }

    function test_PlayGameAfterCooldownPasses() public {
        vm.prank(user1);
        game.register();

        vm.prank(user1);
        game.playGame(1);

        vm.warp(block.timestamp + 1 days);

        vm.prank(user1);
        game.playGame(2);
    }
}