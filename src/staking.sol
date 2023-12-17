//SPDX-License-Identifer: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Staking is ReentrancyGuard{
    using SafeMath for uint256;
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint256 public constant REWARD_RATE = 1e18;
    uint256 private totalStakedTokens;
    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateTime;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenPaid;

    event Staked(address indexed user, uint256 indexed amount);
    event withdrawn(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    constructor(address stakingToken, address rewardToken) {
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
    }

    function rewardPerToken() public view returns(uint){
        if(totalStakedTokens == 0) {
            return rewardPerTokenStored;
        }
        uint256 totalTime = block.timestamp-lastUpdateTime;
        uint256 totalRewards = REWARD_RATE * totalTime;
        return (rewardPerTokenStored + (totalRewards.mul(1e18))/totalStakedTokens);      
    }

    function earned(address account) public view returns(uint256) {
         return (stakedBalance[account]) * (rewardPerToken()-userRewardPerTokenPaid[account]);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] =  rewardPerTokenStored;
        _;
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender){
    require(amount > 0, "Amount must be greater than zero");
    totalStakedTokens += amount;
    stakedBalance[msg.sender] += amount;
    emit Staked(msg.sender, amount);

    bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
    require(success, "Transfer Failed");
    }

    function withdrawStakedTokens(uint256 amount) external nonReentrant updateReward(msg.sender) {
    require(amount > 0, "Amount must be greater than zero");
    require(stakedBalance[msg.sender] >= amount,"Staked amount not enough");
    totalStakedTokens -= amount;
    stakedBalance[msg.sender] -= amount;
    emit withdrawn(msg.sender, amount);

    bool success = s_stakingToken.transfer(msg.sender, amount);
    require(success, "Transfer Failed");
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
    uint reward = rewards[msg.sender];
    require(reward > 0, "No rewards to claim");
    rewards[msg.sender] = 0;

    emit RewardsClaimed(msg.sender, reward);

    bool success = s_rewardToken.transfer(msg.sender, reward);
    require(success, "Transfer Failed");
    }

}


//rewardToken address - 0xa1F3740d3135Bf00725F475dDD4f2C8529E89cf9
//stakeToken address - 0xC46301145a930A5d310F405e40B208403AE6dC0A
//staking address - 0x851D4499121d458D5D26c8c0bAc799fb432b74Ed