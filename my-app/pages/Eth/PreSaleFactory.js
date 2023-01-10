import { ethers } from 'ethers';
import provider from './provider';
const Token = require('./artifacts/Token.json');
const FactoryPreSale = require('./artifacts/FactoryPreSale.json');
const preSale = require('./artifacts/PreSale.json');

const contractAddress = "0x7d07771b4CB3D69980132f1Ef668193db307A3a5";

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
    console.log({amount, al})
    console.log({vesting})

  //  if (vesting === true) {
  //    amount = balance;
 //   } else {
  //    amount = ethers.utils.parseUnits(amount, decimals);
  //  }

    const tx = await IPresaleFactory
      .connect(signer)
      .createPreSale(
        [enabled, dexRate, liquidity, lockUpTime],
        [
          false,
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
    return { dex, sale, preSale, preSaleAddress };
  } catch (err) {
    console.log(err);
  }
};
const buyToken = async (preSaleAddress, amount) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    console.log({preSaleAddress, amount});
    const tx = await pre
      .connect(signer)
      .buyTokens([],{ value: ethers.utils.parseEther(amount.toString()) });
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};
export {
  creatingPreSale,
  getPreSale,
  buyToken
};
