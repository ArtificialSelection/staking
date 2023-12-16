import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
//import StakingContext from "../../context/stakingContext";
import { ethers } from "ethers";
import "./DisplayPanel.css";

const StakedAmount = () => {
  const { stakingContract, selectedAccount } = useContext(Web3Context);
  const [stakedAmount, setStakedAmount] = useState("0");
  //const { isReload } = useContext(StakingContext);

  useEffect(() => {
    const fetchStakedBalance = async () => {
      try {
        const amountStakedWei = await stakingContract.stakedBalance(
          selectedAccount
        );
        const amountStakedEth = ethers.formatUnits(
          amountStakedWei.toString(),
          18
        );
        //console.log(amountStakedEth);
        setStakedAmount(amountStakedEth);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    stakingContract && fetchStakedBalance();
  }, [stakingContract, selectedAccount]);

  return (
    <div className="staked-amount">
      <p>Staked Amount: </p> <span>{stakedAmount}</span>
    </div>
  );
};
export default StakedAmount;
