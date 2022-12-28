import { ethers } from "ethers";
import { getAddress, isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {approve, getBalance, getToken} from "./Eth/Function.js";

export default function Home() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [account, setAccount] = useState(String);
  const [signer, setSigner] = useState(undefined);

  const [tokenAddress, settokenAddress] = useState();
  const [senderAddress, setsenderAddresse] = useState();
  const [userbalance, setuserbalance] = useState();
  const [value, setvalue] = useState();
  
  function inputtokenAddress(text) {
    settokenAddress(text);
  }
  function inputsenderAddress(text) {
    setsenderAddresse(text);
  }
  function inputvalue(text) {
    setvalue(text);
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const address = await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        setAccount(address[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(await provider.getSigner());
        
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function fetchBalance() {
    try {
      const bal = await getBalance();
      setuserbalance(bal.balanceOf); 
     // console.log(userbalance);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {hasMetamask ? (
        isConnected ? (
          account + " Connected! "
        ) : (
          <button onClick={() => connect()}>Connect</button>
        )
      ) : (
        "Please install metamask"
      )}
      <p>Token Addresss: <input onChange={(e) => inputtokenAddress(e.target.value)} /></p>
      {isConnected ? <button onClick={() => getToken(tokenAddress)}>fecthToken</button> : ""}
      {isConnected ? <button onClick={() => fetchBalance()}>fetchbalance</button> : ""}
      <p>balance, {userbalance}</p>

      <p>Approve</p>
      <p>Sender Addresss: <input onChange={(e) => inputsenderAddress(e.target.value)} /></p>
      <p>Value: <input onChange={(e) => inputvalue(e.target.value)} /></p>
      {isConnected ? <button onClick={() => approve(senderAddress, value)}>Approve</button> : ""}

    </div>
  )

}
