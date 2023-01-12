import { ethers } from 'ethers';
import provider from './provider';
const Token = require('./artifacts/Token.json');
const FactoryPreSale = require('./artifacts/FactoryPreSale.json');
const preSale = require('./artifacts/PreSale.json');

const contractAddress = "0xcd7b124976f0Cde2c2573BB89eCF66f5a26063f0";

const getInstance = (contractAddress) => {
  return new ethers.Contract(contractAddress, Token.abi, provider);
};

const IPresaleFactory = new ethers.Contract(
  contractAddress, 
  FactoryPreSale.abi, 
  provider
);

const creatingPreSale = async (
  tokenAddress,
  whitelist,
  enabled, //target_dex
  dexRate, //uniswap_listing_rate
  liquidity, //uniswap_liquidity_percent
  lockUpTime,
  rate, //sale_rate
  amount, //amount
  startTime,
  endTime,
  minVal,
  maxVal,
  softCap,
  hardCap,
  vesStartTime, //tge_date
  startPercent, //tge_percent
  cliffTime, //cycle
  cliffPercent, //cycle_release_percent
  vesting //true
) => {
  try {
    const signer = provider.getSigner();
    const token = getInstance(tokenAddress);
    const decimals = await token.decimals();
    let al = await token.allowance(await signer.getAddress(), contractAddress);
    al = ethers.utils.formatEther(al.toString());
    if (vesting === true) {
      amount = balance;
    } else {
      amount = ethers.utils.parseUnits(amount, decimals);
    }
    const tx = await IPresaleFactory
      .connect(signer)
      .createPreSale(
        [enabled, dexRate, liquidity, lockUpTime],
        [
          whitelist,
          rate,
          amount,
          startTime,
          endTime,
          ethers.utils.parseEther(minVal.toString()),
          ethers.utils.parseEther(maxVal.toString()),
          ethers.utils.parseEther(softCap.toString()),
          ethers.utils.parseEther(hardCap.toString()),
        ],
        [vesStartTime, startPercent, cliffTime, cliffPercent],
        tokenAddress,
        vesting
      );
    await tx.wait();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const getPreSale = async (tokenAddress) => {
  try {
    const preSaleAddress = await IPresaleFactory.preSale(tokenAddress);
    //console.log(preSaleAddress);
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    const dex = await pre.autoDex();
    const sale = await pre.sale();
    const token = await getInstance(tokenAddress);
    let balanceOf = await token.balanceOf(await preSaleAddress);
    balanceOf = ethers.utils.formatEther(balanceOf.toString());
    return { dex, sale, preSale, preSaleAddress, balanceOf };
  } catch (err) {
    console.log(err);
  }
};

export {
  creatingPreSale,
  getPreSale
};
