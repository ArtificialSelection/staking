import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import { ethers } from "ethers";
import "./DisplayPanel.css";

const RewardRate = () => {
  const { stakingContract, selectedAccount } = useContext(Web3Context);
  const [RewardRate, setRewardRate] = useState("0");

  useEffect(() => {
    const fetchRewardRate = async () => {
      try {
        const rewardRateWei = await stakingContract.REWARD_RATE();
        const rewardRateEth = ethers.formatUnits(rewardRateWei.toString(), 18);
        setRewardRate(rewardRateEth);
        //console.log(rewardRateWei);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    stakingContract && fetchRewardRate();
  }, [stakingContract, selectedAccount]);

  return (
    <div className="reward-rate">
      <p>Reward Rate:</p>
      <span>{RewardRate} token/sec </span>
    </div>
  );
};
export default RewardRate;
