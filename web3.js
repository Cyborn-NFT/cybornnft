// import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import detectEthereumProvider from "@metamask/detect-provider";
console.log(global.window);
// var metamaskProvider;
// var walletConnectProvider;
let web3 = null;
// const walletConnectProvider = new WalletConnectProvider({
//   rpc: {
//     0x38: "https://speedy-nodes-nyc.moralis.io/e280a1853045f7d20dcb71e1/bsc/mainnet", // BSC Mainnet chainId - 56
//     // 0x61: 'https://data-seed-prebsc-1-s1.binance.org:8545/', // BSC Testnet chainId - 97
//     0x89: "https://speedy-nodes-nyc.moralis.io/e280a1853045f7d20dcb71e1/polygon/mainnet",
//     0x1: "https://speedy-nodes-nyc.moralis.io/e280a1853045f7d20dcb71e1/eth/mainnet",
//     "0xA86A":
//       "https://speedy-nodes-nyc.moralis.io/e280a1853045f7d20dcb71e1/avalanche/mainnet",
//   },
//   qrcode: false,
// });

const metamaskConnectInit = () => {
  // Check if Web3 has been injected by the browser (Mist/MetaMask).
  return new Promise(async (resolve, reject) => {
    if (typeof global.window?.web3 !== "undefined") {
      console.log("caled");
      // Use Mist/MetaMask's provider.
      web3 = new Web3(global.window.web3.currentProvider);
      localStorage.setItem("walletConnect", 0);

      if (window.web3.__isMetaMaskShim__) {
        web3 = new Web3(window.web3.currentProvider);
        const provider = await detectEthereumProvider();
        console.log(provider);
        console.log(web3);
        web3 = new Web3(provider);
        console.log(web3);

        resolve(true);
      } else {
        // if(window.web3. )
        // Use Mist/MetaMask's provider.
        const provider = await detectEthereumProvider();
        web3 = new Web3(provider);
        resolve(true);
      }
    } else {
      // Handle the case where the user doesn't have web3. Probably
      // show them a message telling them to install Metamask in
      // order to use the app.
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://bsc-dataseed2.binance.org/"
          // 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        )
      );
      reject(false);
    }
  });
};

// const walletConnectInit = () => {
//   // Check if WalleConnect has been conected by the website
//   return new Promise((resolve, reject) => {
//     if (!walletConnectProvider.connector.connected) {
//       metamaskConnectInit();
//       reject(false);
//     } else {
//       // Use WalletConnect provider.
//       walletConnectProvider.enable();
//       web3 = new Web3(walletConnectProvider);
//       resolve(true);
//     }
//   });
// };

// const walletConnectModalInit = () => {
//   return new Promise((resolve, reject) => {
//     localStorage.setItem("walletConnect", 1);
//     walletConnectProvider.enable();
//     web3 = new Web3(walletConnectProvider);
//     // Wallet Connect Provider Events
//     walletConnectProvider.connector.on("display_uri", (err, payload) => {
//       const uri = payload.params[0];
//       WalletConnectQRCodeModal.open(uri);
//     });
//     walletConnectProvider.on("connect", () => {
//       WalletConnectQRCodeModal.close(); // close the QR scanner modal
//     });
//     walletConnectProvider.on("disconnect", (code, reason) => {
//       console.log("wallet connect disconnected", code, reason);
//       localStorage.clear();
//     });
//     resolve(true);
//   });
// };

if (!web3) {
  // if (Number(localStorage.getItem("walletConnect")) === 1) {
  //   walletConnectInit();
  // } else
  metamaskConnectInit();
}

export {
  web3,
  // walletConnectProvider,
  // walletConnectInit,
  metamaskConnectInit,
  // walletConnectModalInit,
  // mathWalletConnectInit,
};
