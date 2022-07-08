import getContractAddresses from "../contractData/contractAddress/addresses";
import { web3 } from "../web3";
import nftAbi from "../contractData/abis/nft.json";
import marketPlaceABI from "../contractData/abis/escrow.json";

const abis = { nft: nftAbi, marketPlace: marketPlaceABI };
export function getContractInstance(contract) {
  const addresses = getContractAddresses();
  let currentaddress = addresses[contract];
  const currentABI = abis[contract];

  try {
    if (web3) {
      const contractInstance = new web3.eth.Contract(
        currentABI,
        currentaddress
      );
      return contractInstance;
    }
  } catch (error) {
    // console.log(error);
  }
}
