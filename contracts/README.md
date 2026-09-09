# ScoreSystem Smart Contract

A decentralized guessing game built with Solidity and the [Foundry](https://book.getfoundry.sh/) development framework. This project was built to demonstrate core smart contract mechanics including state management, access control, time-based restrictions (cooldowns), and comprehensive unit testing.

## 🎮 Features

- **User Registration:** Players must register before interacting with the game.
- **Daily Guessing Game:** Players guess a number between 1 and 3. A correct guess rewards the player with 10 points. Includes a strict 24-hour cooldown preventing spam.
- **Point Economy:** Players can securely transfer their earned points to other registered members.
- **Rewards Store:** Players who accumulate 50 points can redeem them for a virtual T-Shirt.
- **Admin Controls:** The contract deployer retains administrative rights to distribute points manually.

> **Note on Randomness:** For simplicity and local demonstration purposes, this project uses `block.timestamp` alongside `msg.sender` to generate pseudo-random numbers. In a mainnet production environment, a verifiable randomness oracle (such as Chainlink VRF) would be implemented to prevent validator manipulation.

## 🛠️ Prerequisites

You will need to have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed on your machine.

## 🚀 Quick Start

1. Install Dependencies

Make sure you have the standard Foundry testing libraries installed:
```shell
forge install
```

2. Build the Project

Compile the smart contracts to ensure everything is structurally sound:
```shell
forge build
```

3. Run Tests

The project includes a robust test suite testing access controls, point transfers, and time-manipulation for the 24-hour cooldown logic. Run the tests via:
```shell
forge test
```
To see a detailed trace of the tests (including gas usage and specific function calls), run:
```shell
forge test -vvv
```

4. Local Deployment & Testing

To interact with the contract locally, you can start Foundry's local Ethereum node:
```shell
anvil
```
Once Anvil is running, you can connect tools like Remix IDE to your local node to manually interact with the contract's functions, or use Foundry's built-in cast CLI.