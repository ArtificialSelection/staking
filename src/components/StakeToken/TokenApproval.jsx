import { useState, useEffect, useRef, useContext } from "react";
import { ethers } from "ethers";
import Button from "../Wallet/Button/Button";
import Web3Context from "../../context/Web3Context";
import "./StakeToken.css";

const TokenApproval = () => {
  const { stakeTokenContract, stakingContract, provider } =
    useContext(Web3Context);
  const approvedTokenRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");

  const approveToken = async (e) => {
    e.preventDefault();
    const amount = approvedTokenRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToSend = ethers.parseUnits(amount, 18).toString();
    console.log(amountToSend);
    setTransactionStatus("Transaction is in pending...");
    //const transObj = await provider.getTransaction(transaction.hash);
    const receipt = await Transaction.wait();
    if (receipt.status === 1) {
      setTransactionStatus("Transaction is Successful");
      setTimeout(() => {
        setTransactionStatus("");
      }, 5000);
      approvedTokenRef.current.value = "";
    } else {
      setTransactionStatus("Transaction failed");
    }

    try {
      const transaction = await stakeTokenContract.approve(
        stakingContract.target,
        amountToSend
      );
    } catch (error) {
      console.error("Token Approval failed", error.message);
    }
  };
  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={approveToken} className="token-amount-form">
        <label className="token-input-label"> Token Approval: </label>
        <input type="text" ref={approvedTokenRef}></input>
        <Button onClick={approveToken} type="submit" label="Token Approve" />
      </form>
    </div>
  );
};

export default TokenApproval;
