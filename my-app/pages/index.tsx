import { ethers } from "ethers";
//import { getAddress, isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {approve, getBalance, getToken} from "./Eth/Token.js";
import {mintToken} from "./Eth/E20Factory.js";
import {creatingPreSale, getPreSale} from "./Eth/PreSaleFactory.js";
import {buyToken, withdrawETH, withdrawToken, addLiquidity, withdrawLiquidity} from "./Eth/PreSale.js";
import {checkWhitelist, createWhitelist, getProof} from "./Eth/whitelist.js";

export default function Home() {

  let proof=[];
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

  const [whitelist, setWhitelist] = useState();
  const [setedWhitelist, setSetedWhitelist] = useState();
  const [autoDex, setAutoDex] = useState();
  const [dexRate, setDexRate] = useState();
  const [liquidity, setLiquidity] = useState();
  const [lockUpTime, setLockUpTime] = useState();
  const [rate, setRate] = useState();
  const [amount, setAmount] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [minVal, setMinVal] = useState();
  const [maxVal, setMaxVal] = useState();
  const [softCap, setSoftCap] = useState();
  const [hardCap, setHardcap] = useState();
  const [vesStartTime, setVesStartTime] = useState();
  const [startPercent, setStartPercent] = useState();
  const [cliffTime, setCliffTime] = useState();
  const [cliffPercent, setCliffPrecent] = useState();
  const [vesting, setVesting] = useState();
  const [buyValue, setBuyValue] = useState();
  const [presaleAddress, setPresaleAddress] = useState();
  const [presaleBalance, setPresaleBalance] = useState();

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
  function inputwhitelist(text) {
    setWhitelist(text);
  }
  function inputautoDex(text) {
    setAutoDex(text);
  }
  function inputdexRate(text) {
    setDexRate(text);
  }
  function inputliquidity(text) {
    setLiquidity(text);
  }
  function inputlockUpTime(text) {
    setLockUpTime(text);
  }
  function inputrate(text) {
    setRate(text);
  }
  function inputamount(text) {
    setAmount(text);
  }
  function inputstartTime(text) {
    setStartTime(text);
  }
  function inputendTime(text) {
    setEndTime(text);
  }
  function inputminVal(text) {
    setMinVal(text);
  }
  function inputmaxVal(text) {
    setMaxVal(text);
  }
  function inputsoftCap(text) {
    setSoftCap(text);
  }
  function inputhardCap(text) {
    setHardcap(text);
  }
  function inputvesStartTime(text) {
    setVesStartTime(text);
  }
  function inputstartPercent(text) {
    setStartPercent(text);
  }
  function inputcliffTime(text) {
    setCliffTime(text);
  }
  function inputcliffPercent(text) {
    setCliffPrecent(text);
  }
  function inputvesting(text) {
    setVesting(text);
  }
  function inputBuyValue(text) {
    setBuyValue(text);
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
  async function getingproof() {
    try {
      const tx = await getProof();
      proof = tx;
      console.log(proof);
    } catch (e) {
      console.log(e);
    }
  }
  function unixHumanTime(unix_timestamp){
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
  }
  async function getPreSaleInstance() {
    try {
      const presale = await getPreSale(tokenAddress);
      let startTime = (presale?.sale.startTime).toString();
      let endTime = (presale?.sale.endTime).toString();
      startTime = await unixHumanTime(startTime);
      endTime = await unixHumanTime(endTime);
      let price = (presale?.sale.rate).toString();
      price = price + " per Ether";
      const minBuy = ethers.utils.formatEther((presale?.sale.minVal).toString());
      const maxBuy = ethers.utils.formatEther((presale?.sale.maxVal).toString());
      setPresaleAddress(presale?.preSaleAddress);
      setPresaleBalance(presale?.balanceOf);
      setSetedWhitelist(presale?.sale.whitelist);
      console.log({startTime, endTime});
      console.log({price});
      console.log({minBuy, maxBuy});
      console.log(setedWhitelist);
    } catch (e) {
      console.log(e);
    }
  }
  async function createPreSale() {
    try {
      await creatingPreSale(
        tokenAddress,
        whitelist, 
        autoDex, 
        dexRate, 
        liquidity, 
        lockUpTime,
        rate,
        amount,
        startTime,
        endTime,
        minVal,
        maxVal,
        softCap,
        hardCap,
        vesStartTime,
        startPercent,
        cliffTime,
        cliffPercent,
        vesting
        );
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

      <p>Creating new Presale address: 0xcd7b124976f0Cde2c2573BB89eCF66f5a26063f0</p>
      <p>tokenAddress: <input onChange={(e) => inputtokenAddress(e.target.value)} /></p>
      <p>whitelist: <input onChange={(e) => inputwhitelist(e.target.value)} /></p>
      <p>autoDex: <input onChange={(e) => inputautoDex(e.target.value)} /></p>
      <p>dexRate: <input onChange={(e) => inputdexRate(e.target.value)} /></p>
      <p>liquidity percentage: <input onChange={(e) => inputliquidity(e.target.value)} /></p>
      <p>lockUpTime: <input onChange={(e) => inputlockUpTime(e.target.value)} /></p>
      <p>rate: <input onChange={(e) => inputrate(e.target.value)} /></p>
      <p>amount: <input onChange={(e) => inputamount(e.target.value)} /></p>
      <p>startTime: <input onChange={(e) => inputstartTime(e.target.value)} /></p>
      <p>endTime: <input onChange={(e) => inputendTime(e.target.value)} /></p>
      <p>minVal: <input onChange={(e) => inputminVal(e.target.value)} /></p>
      <p>maxVal: <input onChange={(e) => inputmaxVal(e.target.value)} /></p>
      <p>softCap: <input onChange={(e) => inputsoftCap(e.target.value)} /></p>
      <p>hardCap: <input onChange={(e) => inputhardCap(e.target.value)} /></p>
      <p>vesStartTime: <input onChange={(e) => inputvesStartTime(e.target.value)} /></p>
      <p>startPercent: <input onChange={(e) => inputstartPercent(e.target.value)} /></p>
      <p>cliffTime: <input onChange={(e) => inputcliffTime(e.target.value)} /></p>
      <p>cliffPercent: <input onChange={(e) => inputcliffPercent(e.target.value)} /></p>
      <p>vesting: <input onChange={(e) => inputvesting(e.target.value)} /></p>
      {isConnected ? <button onClick={() => createPreSale()}>Create Presale</button> : ""}
      {isConnected ? <button onClick={() => getPreSaleInstance()}>getPresale</button> : ""}
      <p>presaleAddress, {presaleAddress}</p>
      <p>presaleBalance, {presaleBalance}</p>
      <p>Buy Token: <input onChange={(e) => inputBuyValue(e.target.value) }/></p>
      {isConnected ? <button onClick={() => buyToken(presaleAddress, buyValue, setedWhitelist, proof)}>Buy Token</button> : ""}
      {isConnected ? <button onClick={() => addLiquidity(presaleAddress)}>addLiquidity</button> : ""}
      {isConnected ? <button onClick={() => withdrawLiquidity(presaleAddress)}>withdrawLiquidity</button> : ""}
      {isConnected ? <button onClick={() => withdrawETH(presaleAddress)}>withdrawETH</button> : ""}
      {isConnected ? <button onClick={() => withdrawToken(presaleAddress)}>withdrawToken</button> : ""}
      <p>Whitelist, active: {setedWhitelist}</p>
      {isConnected ? <button onClick={() => createWhitelist(presaleAddress)}>setRoot</button> : ""}
      {isConnected ? <button onClick={() => getingproof()}>getProof</button> : ""}
      {isConnected ? <button onClick={() => checkWhitelist(presaleAddress, proof)}>checkWhitelist</button> : ""}

    </div>
  )

}
