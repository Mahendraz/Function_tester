import { ethers } from "ethers";
import { getAddress, isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {approve, getBalance, getToken} from "./Eth/Token.js";
import {mintEvents, mintToken} from "./Eth/E20Factory";

export default function Home() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [account, setAccount] = useState(String);
  const [signer, setSigner] = useState(undefined);

  const [tokenAddress, settokenAddress] = useState();
  const [senderAddress, setsenderAddresse] = useState();
  const [userbalance, setuserbalance] = useState();
  const [value, setvalue] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [mintValue, setMintValue] = useState();
  const [decimals, setDecimals] = useState();
  const [deployedContractAddress, setDeployedContractAddress] = useState();

  
  function inputtokenAddress(text) {
    settokenAddress(text);
  }
  function inputsenderAddress(text) {
    setsenderAddresse(text);
  }
  function inputvalue(text) {
    setvalue(text);
  }
  function inputName(text) {
    setName(text);
  }
  function inputSymbol(text) {
    setSymbol(text);
  }
  function inputMintValue(text) {
    setMintValue(text);
  }
  function inputDecimals(text) {
    setDecimals(text);
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
      const tx = await getBalance();
      setuserbalance(tx?.balanceOf); 
    } catch (e) {
      console.log(e);
    }
  }
  async function mint() {
    try {
      await mintToken(name, symbol, mintValue, decimals);

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
      
      <p>Minting new Token</p>
      <p>Name: <input onChange={(e) => inputName(e.target.value)} /></p>
      <p>Symbol: <input onChange={(e) => inputSymbol(e.target.value)} /></p>
      <p>Mint Value: <input onChange={(e) => inputMintValue(e.target.value)} /></p>
      <p>Decimals: <input onChange={(e) => inputDecimals(e.target.value)} /></p>
      {isConnected ? <button onClick={() => mint()}>MintToken</button> : ""}
      {deployedContractAddress ? <p>deployed Contract Address:, {deployedContractAddress}</p>:""}
    </div>
  )

}
