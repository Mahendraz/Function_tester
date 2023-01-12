import { ethers } from 'ethers';
import provider from './provider';
const Token = require('./artifacts/Token.json');
const preSale = require('./artifacts/PreSale.json');

const getInstance = (contractAddress) => {
  return new ethers.Contract(contractAddress, Token.abi, provider);
};

const buyToken = async (preSaleAddress, amount, whitelist, proof) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    if (whitelist){
    const tx = await pre
      .connect(signer)
      .buyTokens(proof,{ value: ethers.utils.parseEther(amount.toString()) });
    await tx.wait();
    }else
    {
    const tx = await pre
      .connect(signer)
      .buyTokens([],{ value: ethers.utils.parseEther(amount.toString()) });
    await tx.wait();  
    }
  } catch (err) {
    console.log(err);
  }
};
const withdrawETH = async (preSaleAddress) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    const tx = await pre.connect(signer).withdrawETH();
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};

const withdrawToken = async (preSaleAddress) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    const tx = await pre.connect(signer).withdrawToken();
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};

const addLiquidity = async (preSaleAddress) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    const tx = await pre.connect(signer).addLiquidity();
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};

const withdrawLiquidity = async (preSaleAddress) => {
  try {
    const signer = provider.getSigner();
    const pre = new ethers.Contract(
      preSaleAddress,
      preSale.abi,
      provider
    );
    const tx = await pre.connect(signer).withdrawLiquidity();
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};


export {
  buyToken,
  withdrawETH,
  withdrawToken,
  addLiquidity,
  withdrawLiquidity
};
