import {useContext} from "react"
import Web3Context from "../../context/Web3Context"
import "./Navigation.css";

const ConnectedAccount = () => {
    const {selectedAccount} = useContext(Web3Context);
    return (
        <p className="connected-ac"> Connected Account:{selectedAccount}</p>
    )
}

export default ConnectedAccount