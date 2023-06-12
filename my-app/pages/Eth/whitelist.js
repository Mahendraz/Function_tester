import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
const artifact = require('./artifacts/PreSale.json');
import provider from './provider';

const { ethers } = require('ethers');
//adding tree
const addresses = 
[
["0x9baaF17A6Feb9aC5C02cdA9248f3c934d4BCc526",43],
["0x395FF92FEf0831974545EB930d203649c91B0A1E",231],
["0x87e37b656961Be03d5F352D169fbBE4F55A6c570",231],
["0x8d7862aE50c7A31C998b6eEf54213242e655a094",231],
["0x5dDFdA623207D322517dB5080522Ed29E99eC22f",231],
["0x9E7E28f1387F7d86B1F2D11a0cAc69F76C1B866e",231],
["0x85171333bFC71c67B14E2E9aF92c2EeA534D2Dcf",231],
["0xc940Df017B80a4E483F789088Df202BCD2614568",231],
["0xc6eE24A90a7877A83460aAbf5455c501D65e3785",231],
["0x46Bc9D1C6Bc2b1808E6f825dF9155CaE539677E2",231],
["0x656fC60bC8AcFeC261E9D30ed6cFa8e32199517B",231],
["0xBCa756Fbbb3Ae52Da818f0B47A1Ef9787A3E669c",231],
["0x29B325443F887B53D7e2C893AC6e6587A3CE2b4D",231],
["0x81666621f3C4f3d8871abEC4B03b77d1e338673A",22562]
];

const merkleTree = StandardMerkleTree.of(addresses,["address", "uint256"]);

const setWhitelist = async (preSaleAddress, whitelist) => {
  try {
    const preSale = new ethers.Contract(preSaleAddress, artifact.abi, provider);
    const signer = provider.getSigner();
    await preSale.connect(signer).setWhitelist(whitelist);
  } catch (err) {
    console.log(err);
  }
};
const checkWhitelist = async (preSaleAddress, proof) => {
  try {
    const preSale = new ethers.Contract(preSaleAddress, artifact.abi, provider);
    const signer = provider.getSigner();
    console.log({proof})
    const tx = await preSale.checkWhitelist(proof,await signer.getAddress());
    console.log(tx);
  } catch (err) {
    console.log(err);
  }
};

const createWhitelist = async (preSaleAddress) => {
  try {
    const preSale = new ethers.Contract(preSaleAddress, artifact.abi, provider);
    const signer = provider.getSigner();
    const root = merkleTree.root;
    console.log(root);
    const tx = await preSale.connect(signer).editRoot(root);
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};
const getProof = async () => {
  try {
    const signer = provider.getSigner();
    const profaddress = await signer.getAddress();
    let proof;
    let value;
    
    for (const [i, v] of merkleTree.entries()) {
      if (v[0] === profaddress) {
        const c = merkleTree.getProof(i);
        proof = c;
        value = v[1]; // Retrieve the int256 value
      }
    }
    
    return { proof, value }; // Return both the proof and the int256 value
  } catch (err) {
    console.log(err);
  }
};


export { createWhitelist, setWhitelist, getProof, checkWhitelist };
