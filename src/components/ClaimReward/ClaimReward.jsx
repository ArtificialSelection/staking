import { useState, useEffect, useRef, useContext } from "react";
import { ethers } from "ethers";
import Button from "../Wallet/Button/Button";
import Web3Context from "../../context/Web3Context";
import "./ClaimReward.css";

const ClaimReward = () => {
  const { stakingContract } = useContext(Web3Context);
  const withdrawStakeAmountRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");

  const claimReward = async () => {
    try {
      const transaction = await stakingContract.getReward();
      const receipt = await transaction.wait();
      setTransactionStatus("Transaction is in pending...");
      if (receipt.status === 1) {
        setTransactionStatus("Transaction is Successful");
        setTimeout(() => {
          setTransactionStatus("");
        }, 5000);
      } else {
        setTransactionStatus("Transaction failed");
      }
    } catch (error) {
      console.error("Staking failed", error.message);
    }
  };
  return (
    <div className="claim-reward">
      {transactionStatus && <div>{transactionStatus}</div>}
      <Button
        onClick={claimReward}
        type="button"
        label="Withdraw Stake Token"
      />
    </div>
  );
};

export default ClaimReward;
