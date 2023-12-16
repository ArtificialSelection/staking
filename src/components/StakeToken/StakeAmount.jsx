import { useState, useEffect, useRef, useContext } from "react";
import { ethers } from "ethers";
import Button from "../Wallet/Button/Button";
import Web3Context from "../../context/Web3Context";
import { toast } from "react-hot-toast";
import "./StakeToken.css";
//import StakingContext from "../../context/stakingContext";

const StakeAmount = () => {
  const { stakingContract, provider } = useContext(Web3Context);
  const stakeAmountRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");
  //const [isReload, setIsReload] = useContext(StakingContext);

  const stakeToken = async (e) => {
    e.preventDefault();
    const amount = stakeAmountRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToStake = ethers.parseUnits(amount, 18).toString();
    //console.log(amountToStake);
    try {
      const transaction = await stakingContract.stake(amountToStake);
      //setTransactionStatus("Transaction is in pending...");
      //const transObj = await provider.getTransaction(transaction.hash);
      //const receipt = await transaction.wait();
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending...",
        success: "Transaction successful",
        error: "Transaction failed",
      });
      // if (receipt.status === 1) {
      //   setTransactionStatus("Transaction is Successful");
      //   //setIsReload(!isReload);
      //   setTimeout(() => {
      //     setTransactionStatus("");
      //   }, 5000);
      //   stakeAmountRef.current.value = "";
      // } else {
      //   setTransactionStatus("Transaction failed");
      // }
    } catch (error) {
      console.error("Staking failed", error.message);
    }
  };
  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={stakeToken} className="stake-amount-form">
        <label className="stake-input-label"> Amount to Stake: </label>
        <input type="text" ref={stakeAmountRef}></input>
        <Button onClick={stakeToken} type="submit" label="Stake" />
      </form>
    </div>
  );
};

export default StakeAmount;
