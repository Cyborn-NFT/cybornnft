export function fetchNetworkId(state = null, action) {
  switch (action.type) {
    case 'FETCH_NETWORK_ID':
      return action.data;
    default:
      return state;
  }
}
export function fetchNFTContractInstance(state = null, action) {
  switch (action.type) {
    case 'NFT_CONTRACT_INSTANCE':
      return action.data;
    default:
      return state;
  }
}

function getToken() {
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    const item = window.localStorage.getItem('cybornToken') ? true : false;
    return item;
  }
  return false;
}

export function fetchWeb3Data(
  state = {
    isLoggedIn: getToken(),
    accounts: [],
  },
  action
) {
  switch (action.type) {
    case 'FETCH_WEB3_DATA':
      return action.data;
    case 'FETCH_WEB3_DATA_ERROR':
      return action.data;
    default:
      return state;
  }
}
