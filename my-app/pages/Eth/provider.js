//@ts-nocheck
import { ethers } from 'ethers';

let provider;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
 // provider = new ethers.providers.JsonRpcProvider(process.env.RPC_NODE);
}

export default provider;
