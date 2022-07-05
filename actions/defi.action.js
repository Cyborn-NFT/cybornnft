import { services } from "../services";

function setData(data, type) {
  return {
    type: type,
    data: data,
  };
}

function addNFT(data) {
  return (dispatch) => {
    const url = "nft/addNft";
    let params = JSON.stringify(data);
    const response = services.post(url, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(setData(promise.data.data, "ADD_NFT"));
      } else {
        // console.log('erroer');
      }
    });
  };
}
function authLogin(nonce, signature) {
  return (dispatch) => {
    const url = "user/login";
    let params = JSON.stringify({
      nonce: nonce,
      signature: signature,
    });
    const response = services.post(url, params);
    response.then(async (promise) => {
      if (promise.status === 200) {
        localStorage.setItem("cybornToken", promise.data.data.token);
        dispatch(
          setData(
            { data: promise.data.data.details, status: true },
            "AUTH_LOGIN"
          )
        );
        if (promise.data.data.token) {
          const newresp = await services.getWeb3();
          localStorage.setItem("userAddress", newresp.accounts[0]);
          newresp.isLoggedIn = true;
          dispatch(setData(newresp, "FETCH_WEB3_DATA"));
        }

        // navigate("/");
      } else {
        localStorage.setItem("cybornToken", "");
      }
    });
  };
}
function generateNonce(address) {
  return async (dispatch) => {
    const url = `user/genrateNonce/${address}`;
    const response = services.get(url);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(setData(promise.data.data.nonce, "GENERATE_NONCE"));
      } else {
        // console.log("erroer");
      }
    });
  };
}
function getCategoryList() {
  return async (dispatch) => {
    const url = `category/list`;
    const response = services.get(url);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(setData(promise.data.data, "CATEGORY_LIST"));
      } else {
        // console.log("erroer");
      }
    });
  };
}
function getCollectionList() {
  return async (dispatch) => {
    const url = `nft/listCollection`;
    const response = services.get(url, true);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(setData(promise.data.data, "COLLECTION_LIST"));
      } else {
        // console.log("erroer");
      }
    });
  };
}
// function authenticateUser() {
//   return (dispatch) => {
//     const response = services.getWeb3(true);
//     response.then((promise) => {
//       if (promise.accounts[0]) {
//         dispatch(setDispatchData(promise, "FETCH_WEB3_DATA"));
//       } else {
//         // console.log('errorrrr in actions');
//       }
//     });
//   };
// }
function getUserDetails() {
  return (dispatch) => {
    const response = services.get("user/userDetails", true);
    response.then(async (promise) => {
      if (promise.status === 200) {
        if (promise.data.data) {
          const newresp = await services.getWeb3();
          localStorage.setItem("userAddress", newresp.accounts[0]);
          newresp.isLoggedIn = true;
          dispatch(setData(newresp, "FETCH_WEB3_DATA"));
        }
        dispatch(setData(promise.data, "AUTH_LOGIN"));
      } else {
        localStorage.setItem("cybornToken", "");
        if (!promise.response && promise.response?.status === 401) {
          dispatch(setData(promise.response, "AUTH_LOGIN_ERROR"));
        }
      }
    });
  };
}

function getUserProfile(id) {
  return async (dispatch) => {
    const response = services.get(`user/getSingleUser/${id}`);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(setData(promise.data.data, "FETCHED_USER_PROFILE"));
      } else {
        // console.log("error");
      }
    });
  };
}

function updateNFT(data) {
  return (dispatch) => {
    const url = `nft/updateNft/${data.id}`;
    const response = services.put(url, data).then((response) => {
      if (response.status === 200) {
        dispatch(setData(response.data, "UPDATE_NFT"));
      }
      if (response.response && response.response.status === 403) {
        dispatch(setData(response.response.data, "UPDATE_NFT"));
      }
      if (response.response && response.response.status === 400) {
        dispatch(setData(response.response.data, "UPDATE_NFT"));
      }
    });
  };
}

export const defiActions = {
  addNFT,
  authLogin,
  generateNonce,
  getCategoryList,
  getCollectionList,
  getUserDetails,
  getUserProfile,
  updateNFT,
};
