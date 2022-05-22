import { services } from '../services';
import nftABI from '../contractData/abis/nft.json';
import contractAddresses from '../contractData/contractAddress/addresses';

function fetchUserBalances(data) {
  return {
    type: 'FETCH_USER_BALANCES', // dispatch user login event
    data: data,
  };
}

function setDispatchData(data, type) {
  return { data: data, type: type };
}

// get defi categories
function getNetworkId() {
  return (dispatch) => {
    const response = services.getNetworkId();
    response.then((promise) => {
      dispatch(setDispatchData(promise, 'FETCH_NETWORK_ID'));
    });
  };
}

function getWeb3(val) {
  if (val) {
    return (dispatch) => {
      dispatch(setDispatchData(null, 'FETCH_WEB3_DATA'));
    };
  } else
    return (dispatch) => {
      const response = services.getWeb3();
      response.then((promise) => {
        if (promise?.accounts[0]) {
          dispatch(setDispatchData(promise, 'FETCH_WEB3_DATA'));
        } else {
          localStorage.clear();
          // console.log('errorrrr in actions');
        }
      });
    };
}

function enabledWalletConnect() {
  return (dispatch) => {
    const response = services.enabledWalletConnect();
    response.then((promise) => {
      if (promise) {
        dispatch(setDispatchData(promise, 'FETCH_WEB3_DATA'));
      } else {
        // console.log('error in actions');
      }
    });
  };
}
function enableMetamask() {
  return (dispatch) => {
    const response = services.enableMetamask();
    response.then((promise) => {
      // console.log("present");
      if (!promise.error) {
        // console.log("this is new actions", promise);
        dispatch(setDispatchData(promise, 'FETCH_WEB3_DATA'));
      } else {
        // console.log("i am in error", promise);
        dispatch(setDispatchData(promise, 'FETCH_WEB3_DATA_ERROR'));
      }
    });
  };
}
function getUserBalances(userAddress) {
  return (dispatch) => {
    const response = services.getUserBalances(userAddress);
    response.then((promise) => {
      if (promise) {
        dispatch(fetchUserBalances(promise));
      } else {
        // console.log('error in actions');
      }
    });
  };
}

function getNFTContractInstance() {
  const { nftContractAddress } = contractAddresses();
  return (dispatch) => {
    const response = services.getContractInstance(nftABI, nftContractAddress);
    response.then((promise) => {
      // console.log(promise);
      if (promise) {
        dispatch(setDispatchData(promise, 'NFT_CONTRACT_INSTANCE'));
      } else {
        // console.log('error in actions');
      }
    });
  };
}

export const web3Actions = {
  getNetworkId,
  getWeb3,
  enableMetamask,
  getUserBalances,
  getNFTContractInstance,
  enabledWalletConnect,
};
