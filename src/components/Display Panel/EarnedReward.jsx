import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Web3Context from "../../context/Web3Context";
import "./DisplayPanel.css";

const EarnedReward = () => {
  const { stakingContract, selectedAccount } = useContext(Web3Context);
  const [rewardVal, setRewardVal] = useState("0");

  useEffect(() => {
    const fetchStakeRewardInfo = async () => {
      try {
        const rewardValueWei = await stakingContract.earned(selectedAccount);
        const rewardValueEth = ethers.formatUnits(
          rewardValueWei.toString(),
          18
        );
        const roundedReward = parseFloat(rewardValueEth).toFixed(2);
        setRewardVal(roundedReward);
        //console.log(rewardRateWei);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    const interval = setInterval(() => {
      stakingContract && fetchStakeRewardInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [stakingContract, selectedAccount]);

  return (
    <div className="earned-reward">
      <p>Earned Reward:</p>
      <span>{rewardVal}</span>
    </div>
  );
};
export default EarnedReward;
