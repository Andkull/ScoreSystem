// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract ScoreSystem {
    struct Player {
        uint256 score;
        bool registered;
        bool wonTshirt;
    }

    address private admin;
    uint256 public constant TSHIRT_COST = 50;

    mapping(address => Player) private players;

    event MemberRegistered(address indexed member);
    event GamePlayed(address indexed player, bool won, uint256 guessedNumber, uint256 correctNumber);
    event PointsTransferred(address indexed from, address indexed to, uint256 amount);
    event TshirtWon(address indexed member);
    event PointsDistributed(address indexed to, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can do this");
        _;
    }

    modifier onlyMember() {
        require(players[msg.sender].registered, "You must register first");
        _;
    }

    function register() external {
        require(!players[msg.sender].registered, "You are already registered");

        players[msg.sender].registered = true;
        players[msg.sender].score = 0;
        players[msg.sender].wonTshirt = false;

        emit MemberRegistered(msg.sender);
    }

    function playGame(uint256 guess) external onlyMember {
        require(guess >= 1 && guess <= 3, "Guess must be 1, 2, or 3");

        uint256 result = (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3) + 1;

        if (guess == result) {
            players[msg.sender].score += 10;
            emit GamePlayed(msg.sender, true, guess, result);
        } else {
            emit GamePlayed(msg.sender, false, guess, result);
        }
    }

    function transferPoints(address to, uint256 amount) external onlyMember {
        require(players[to].registered, "Receiver is not a member");
        require(players[msg.sender].score >= amount, "Not enough points");

        players[msg.sender].score -= amount;
        players[to].score += amount;

        emit PointsTransferred(msg.sender, to, amount);
    }

    function buyTshirt() external onlyMember {
        require(players[msg.sender].score >= TSHIRT_COST, "You do not have enough points for a T-shirt");
        require(!players[msg.sender].wonTshirt, "You already have a T-shirt!");

        players[msg.sender].score -= TSHIRT_COST;
        players[msg.sender].wonTshirt = true;

        emit TshirtWon(msg.sender);
    }

    function adminGivePoints(address to, uint256 amount) external onlyAdmin {
        require(players[to].registered, "User must be registered");
        players[to].score += amount;
        emit PointsDistributed(to, amount);
    }

    function getPlayerData(address user) external view returns (uint256, bool, bool) {
        Player memory p = players[user];
        return (p.score, p.registered, p.wonTshirt);
    }
}
