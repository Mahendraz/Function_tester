import { ethers } from 'ethers';
import provider from './provider';
const E20Factory = require('./artifacts/E20Factory.json');

const contractAddress = "0x9c215E9a1f66aA84D9537A0199654703FD9fD85D";

const IE20Factory = new ethers.Contract(
  contractAddress, 
  E20Factory.abi, 
  provider
);

const mintToken = async (_name, _symbol, _supply, _decimals) => {
  try{
    const signer = provider.getSigner();

    const tx = await IE20Factory.connect(signer)
        .deployToken(_name, _symbol, _supply, _decimals, {
        value: ethers.utils.parseEther("0.001") })
    mintEvents();
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
}
const mintEvents = async() => {
try{
  IE20Factory.on("TokenDeployed", (tokenAddress) => {
    console.log("TokenDeployed event emited");
    console.log(tokenAddress);
  });
} catch (err) {
  console.log(err);
}
}

export {
  mintToken,
  mintEvents
};
