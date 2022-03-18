// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "prb-math/contracts/PRBMathSD59x18.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

contract ETHPool is AccessControl {
    using PRBMathUD60x18 for uint256;
    using PRBMathSD59x18 for int256;

    struct userDeposit {
        uint256 deposit;
        uint256 dateDeposit;
    }

    bytes32 public constant ROLE_TEAM = keccak256("ROLE_TEAM");
    bytes32 public constant ROLE_USER = keccak256("ROLE_USER");
    uint256 public reward_pool = 0;
    uint256 public total_pool = 0;
    uint256 public lastRewardDate;

    mapping(address => userDeposit) users_pool;

    constructor() {
        lastRewardDate = block.timestamp;
        _grantRole(ROLE_TEAM, msg.sender);
    }

    function deposit() public payable {
        require(hasRole(ROLE_USER, msg.sender), "Only user can deposit");
        require(msg.value > 0, "Amount should be higher than 0");

        users_pool[msg.sender].deposit = msg.value;
        users_pool[msg.sender].dateDeposit = block.timestamp;

        total_pool = total_pool + msg.value;
    }

    function withdraw() public {
        require(hasRole(ROLE_USER, msg.sender), "Only user can withdrwa");
        require(
            users_pool[msg.sender].deposit > 0,
            "The user dont have balance"
        );

        if (users_pool[msg.sender].dateDeposit < lastRewardDate) {
            uint256 user_pool_deposit = users_pool[msg.sender].deposit;
            uint256 share = user_pool_deposit.div(total_pool);
            uint256 total_withdraw = user_pool_deposit + reward_pool.mul(share);
            payable(msg.sender).transfer(total_withdraw);
            total_pool = total_pool - user_pool_deposit;
            reward_pool = reward_pool - reward_pool.mul(share);
        } else {
            payable(msg.sender).transfer(users_pool[msg.sender].deposit);
        }

        users_pool[msg.sender].deposit = 0;
    }

    function balance() public view returns (uint256) {
        require(hasRole(ROLE_USER, msg.sender), "Only user can have balance");
        if (users_pool[msg.sender].dateDeposit < lastRewardDate) {
            uint256 user_pool_deposit = users_pool[msg.sender].deposit;
            uint256 share = user_pool_deposit.div(total_pool);
            uint256 total_withdraw = user_pool_deposit + reward_pool.mul(share);
            return total_withdraw;
        } else {
            return users_pool[msg.sender].deposit;
        }
    }

    function depositReward() public payable {
        require(hasRole(ROLE_TEAM, msg.sender), "Only team can deposit reward");
        require(msg.value > 0, "Amount should be higher than 0");

        reward_pool = reward_pool + msg.value;
        lastRewardDate = block.timestamp;
    }

    function balanceReward() public view returns (uint256) {
        require(hasRole(ROLE_TEAM, msg.sender), "Only team can deposit reward");
        return reward_pool;
    }

    function addRole(bytes32 role, address account) public {
        require(hasRole(ROLE_TEAM, msg.sender), "Only team can asign roles");
        _grantRole(role, account);
    }

    function addUserRole(address account) public {
        require(hasRole(ROLE_TEAM, msg.sender), "Only team can asign roles");
        _grantRole(ROLE_USER, account);
    }
}
