import { services } from "../../services";
let networkId = 1;
async function fetchNetworkId() {
  networkId = await services.getNetworkId();
}
fetchNetworkId();

function getContractAddresses() {
  if (networkId === "0x4" || +networkId === 4)
    return {
      nftContractAddress: "0x1877cfd76DE1855917538Caaa2DA17C9296F572b",
      escrowContractAddres: "0x0F7122718068e173f49b6e297c4cF236F64D181A",
    };
  else if (+networkId === 1 || networkId === "0x1")
    return {
      nftContractAddress: "0x1877cfd76DE1855917538Caaa2DA17C9296F572b",
      escrowContractAddres: "0x0F7122718068e173f49b6e297c4cF236F64D181A",
    };
  else
    return {
      nftContractAddress: "0x1877cfd76DE1855917538Caaa2DA17C9296F572b",
      escrowContractAddres: "0x0F7122718068e173f49b6e297c4cF236F64D181A",
    };
}
export default getContractAddresses;
