import { ethers } from 'ethers';
import provider from './provider';
import home from '../index.tsx';
const Token = require('./artifacts/Token.json');

let ERC20;

const getToken = async (contractAddress) => {
  try{
  ERC20 = new ethers.Contract(
    contractAddress, 
    Token.abi, 
    provider
  );
  } catch (err) {
    console.log(err);
  }
}

const approve = async (address, val) => {
  try {
    const signer = provider.getSigner();
    let balanceOf = await ERC20.balanceOf(await signer.getAddress());
    balanceOf = ethers.utils.formatEther(balanceOf.toString());
    console.log(balanceOf);
    console.log(val);
    if (balanceOf >= val){
      val = ethers.utils.parseEther(val.toString());
      ERC20.connect(signer).approve(address, val);
    }
    return {balanceOf};
  } catch (err) {
    console.log(err);
  }
}

const getBalance = async () => {
    try {
      const signer = provider.getSigner();
      let balanceOf = await ERC20.balanceOf(await signer.getAddress());
      balanceOf = ethers.utils.formatEther(balanceOf.toString());
      return {balanceOf};
    } catch (err) {
      console.log(err);
    }
  };


export {
  getBalance,
  getToken,
  approve
};
