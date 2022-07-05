import axios from '../config';
// import { web3 } from '../web3';
// import userBalancesContract from "../contracts/userBalances/userBalances";
// import tokens from "../tokens.json";
// import { param } from "jquery";

export const backendServices = {
  get,
  post,
  put,
};

async function post(url, params) {
  const token = localStorage.getItem('cybornToken');
  const header = token
    ? { 'content-type': 'application/json', 'x-auth-token': token }
    : {
        'content-type': 'application/json',
      };
  // console.log("this", header);
  try {
    const response = await axios.post(url, params, { headers: header });
    return response;
  } catch (error) {
    // console.log("new", error.response);
    return error;
  }
}

async function get(url, isAuthenticated) {
  const token = localStorage.getItem('cybornToken');
  const header = isAuthenticated
    ? { 'x-auth-token': token, 'content-type': 'application/json' }
    : {
        'content-type': 'application/json',
      };
  try {
    const response = await axios.get(url, { headers: header });
    return response;
  } catch (error) {
    return error;
  }
}

async function put(url, parameters) {
  const token = localStorage.getItem('cybornToken');
  const header = token
    ? { 'x-auth-token': token }
    : {
        'content-type': 'application/json',
      };
  try {
    const response = await axios.put(url, parameters, { headers: header });
    return response;
  } catch (error) {
    return error;
  }
}

let web3Data = {
  isLoggedIn: false,
  accounts: [],
};

// async function getWeb3(val) {
//   if (web3) {
//     try {
//       let web3Data = {
//         isLoggedIn: false,
//         accounts: [],
//       };
//       const responseData = await web3.eth.getAccounts();

//       if (responseData.length) {
//         web3Data.isLoggedIn = true;
//         web3Data.accounts = responseData;
//         return web3Data;
//       } else {
//         return web3Data;
//       }
//     } catch {
//       return web3Data;
//     }
//   }
// }
