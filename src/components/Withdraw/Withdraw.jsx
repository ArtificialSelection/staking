import { useState, useEffect, useRef, useContext } from "react";
import { ethers } from "ethers";
import Button from "../Wallet/Button/Button";
import Web3Context from "../../context/Web3Context";
import "./Withdraw.css";
//import StakingContext from "../../context/stakingContext";

const WithdrawStakeAmount = () => {
  const { stakingContract, provider } = useContext(Web3Context);
  const withdrawStakeAmountRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");
  //const {isReload, setIsReload}=useContext(StakingContext)

  const withdrawStakeToken = async (e) => {
    e.preventDefault();
    const amount = withdrawStakeAmountRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToWithdraw = ethers.parseUnits(amount, 18).toString();
    //console.log(amountToStake);
    try {
      const transaction = await stakingContract.withdrawStakedTokens(
        amountToWithdraw
      );
      setTransactionStatus("Transaction is in pending...");
      //setIsReload(!isReload)
      //const transObj = await provider.getTransaction(transaction.hash);
      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        setTransactionStatus("Transaction is Successful");
        setTimeout(() => {
          setTransactionStatus("");
        }, 5000);
        withdrawStakeAmountRef.current.value = "";
      } else {
        setTransactionStatus("Transaction failed");
      }
    } catch (error) {
      console.error("Staking failed", error.message);
    }
  };
  return (
    <div className="withdraw-form">
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={withdrawStakeToken}>
        <label> Amount to Withdraw: </label>
        <input type="text" ref={withdrawStakeAmountRef}></input>
        <Button
          onClick={withdrawStakeToken}
          type="submit"
          label="Withdraw Stake Token"
        />
      </form>
    </div>
  );
};

export default WithdrawStakeAmount;
