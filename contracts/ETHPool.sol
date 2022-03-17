// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "prb-math/contracts/PRBMathSD59x18.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

contract ETHPool is AccessControl {
    using PRBMathUD60x18 for uint256;
    using PRBMathSD59x18 for int256;

    bytes32 public constant ROLE_TEAM = keccak256("ROLE_TEAM");
    bytes32 public constant ROLE_USER = keccak256("ROLE_USER");
    uint256 public reward_pool = 0;
    uint256 public total_pool = 0;
    uint256 public total_users = 0;
    mapping(address => uint256) users_pool;
    mapping(uint256 => address) private holders;
    mapping(address => uint256) private shares;

    constructor() {
        _grantRole(ROLE_TEAM, msg.sender);
    }

    function deposit() public payable {
        require(hasRole(ROLE_USER, msg.sender), "Only user can deposit");
        require(msg.value > 0, "Amount should be higher than 0");
        if (users_pool[msg.sender] == 0) {
            holders[total_users] = msg.sender;
            users_pool[holders[total_users]] = msg.value;
            total_users = total_users + 1;
        } else {
            users_pool[msg.sender] = users_pool[msg.sender] + msg.value;
        }
        total_pool = total_pool + msg.value;
    }

    function withdraw() public {
        require(hasRole(ROLE_USER, msg.sender), "Only user can withdrwa");
        require(users_pool[msg.sender] > 0, "The user dont have balance");

        total_users = total_users - 1;
        total_pool = total_pool - users_pool[msg.sender];
        payable(msg.sender).transfer(users_pool[msg.sender]);
        users_pool[msg.sender] = 0;
    }

    function balance() public view returns (uint256) {
        return users_pool[msg.sender];
    }

    function depositReward() public payable {
        require(hasRole(ROLE_TEAM, msg.sender), "Only team can deposit reward");
        require(msg.value > 0, "Amount should be higher than 0");
        require(total_users > 0, "Cannot split reward without users");

        reward_pool = reward_pool + msg.value;
        uint256 new_total = 0;

        for (uint256 i = 0; i < total_users; i++) {
            uint256 user_pool = users_pool[holders[i]];
            uint256 share = user_pool.div(total_pool);
            users_pool[holders[i]] = user_pool + reward_pool.mul(share);
            new_total = new_total + user_pool + reward_pool.mul(share);
        }

        total_pool = new_total;
        reward_pool = 0;
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
