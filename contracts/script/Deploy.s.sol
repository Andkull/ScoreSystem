// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ScoreSystem} from "../src/ScoreSystem.sol";

contract DeployScoreSystem is Script {
    function run() external returns (ScoreSystem game) {
        vm.startBroadcast();
        game = new ScoreSystem();
        vm.stopBroadcast();

        console.log("ScoreSystem deployed at:", address(game));
        console.log("Admin:", msg.sender);
    }
}
