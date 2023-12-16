import { useContext } from "react";
import Web3Context from "../../context/Web3Context";
import "./Navigation.css";

const ConnectedNetwork = () => {
  const { chainId } = useContext(Web3Context);
  if (chainId == 11155111) {
    return <p className="network"> Connected Network: Sepolia</p>;
  } else {
    return <p className="network"> Connected Network: Unsupported</p>;
  }
};

export default ConnectedNetwork;
