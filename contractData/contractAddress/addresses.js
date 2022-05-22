import { services } from "../../services";
let networkId = 1;
async function fetchNetworkId() {
  networkId = await services.getNetworkId();
}
fetchNetworkId();

function getContractAddresses() {
  if (networkId === "0x4" || +networkId === 4)
    return {
      nftContractAddress: "0xED6a0d87B5E2cC7502d0075eC78939A8437cAea9",
      escrowContractAddres: "0x52f94Ac6A4C878e7597893D43452F4B41d4A8464",
    };
  else if (+networkId === 1 || networkId === "0x1")
    return {
      nftContractAddress: "0xED6a0d87B5E2cC7502d0075eC78939A8437cAea9",
      escrowContractAddres: "0x52f94Ac6A4C878e7597893D43452F4B41d4A8464",
    };
  else
    return {
      nftContractAddress: "0xED6a0d87B5E2cC7502d0075eC78939A8437cAea9",
      escrowContractAddres: "0x52f94Ac6A4C878e7597893D43452F4B41d4A8464",
    };
}
export default getContractAddresses;
