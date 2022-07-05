import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "../client";
import CybornFooter from "/components/CybornFooter";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { actions } from "../actions";
import { web3 } from "../web3";
// import { useNavigate } from "react-router-dom";
import { withRouter } from "react-router";
import Router from "next/router";
// import { NextResponse, NextRequest } from "next/server";

function SignIn(props) {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);
  const [genNonce, setGenNonce] = useState(false);
  const [error, setError] = useState({ isError: false, msg: "", code: 0 });
  const {
    web3Data,
    generateNonce,
    enableMetamask,
    authLogin,
    toggle,
    nonce,
    authData,
    enabledWalletConnect,
  } = props;
  console.log("none", authData);
  useEffect(() => {
    props.getWeb3();
  }, []);
  useEffect(() => {
    if (web3Data.error)
      return setError({ isError: true, msg: "User denied sign in..", code: 1 });
    if (web3Data.accounts[0] && genNonce) {
      setLoader(true);
      if (web3Data.accounts[0] && !nonce) {
        console.log("nonce is ", nonce, web3Data);
        signatureRequest(undefined, true);
      } else if (!web3Data.accounts[0])
        setError({ isError: true, msg: "User denied sign in..", code: 1 });
    }
    if (web3Data.accounts[0] && nonce && !authData)
      signatureRequest(nonce, false);
  }, [web3Data, nonce]);
  useEffect(() => {
    if (authData) {
      const { pathname } = Router;
      console.log(pathname);
      if (pathname === "/signin") Router.push("/");
    }
  }, [authData]);

  useEffect(() => {
    if (authData?.status === 401) {
      setLoader(false);
      setError({ isError: true, msg: authData.data.message, code: 1 });
    } else if (authData) {
      refreshStates(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData]);
  // async function signIn() {
  //   const { error, data } = await supabase.auth.signIn({
  //     email,
  //   });
  //   if (error) {
  //     console.log({ error });
  //   } else {
  //     setSubmitted(true);
  //   }
  // }
  // if (submitted) {
  //   return (
  //     <div className={styles.container}>
  //       <h1>Please check your email to sign in</h1>
  //     </div>
  //   );
  // }
  const connectToWallet = (isWalletConnect) => {
    setGenNonce(true);
    setLoader(true);
    if (web3Data.accounts[0]) {
      return checkAuthentication(web3Data);
    }

    if (isWalletConnect) return enabledWalletConnect();
    else {
      if (typeof global.window.web3 !== "undefined") {
        console.log("1");
        enableMetamask();
      } else {
        setLoader(false);
        let msg = "Please download metamask";
        setError({ isError: true, msg: msg, code: 2 });
      }
    }
  };

  const checkAuthentication = (web3Data) => {
    if (
      !localStorage.getItem("cybornAuthToken") ||
      web3Data.accounts[0] !== localStorage.getItem("userAddress")
    ) {
      console.log("inside");
      signatureRequest(undefined, true);
    }
  };
  const signatureRequest = async (nonce, stepOne) => {
    if (stepOne) {
      generateNonce(web3Data.accounts[0]);
      setGenNonce(false);
    } else {
      console.log("nonce", nonce);
      try {
        console.log(web3);
        const signature = await web3.eth.personal.sign(
          web3.utils.utf8ToHex(nonce),
          web3Data.accounts[0]
        );
        await authLogin(nonce, signature);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const refreshStates = (clearStorage) => {
    if (!clearStorage) {
      global.localStorage.clear();
      props.web3Logout();
    }
    // setError({ isError: false, msg: '', code: 0 });
    setLoader(false);
    // toggle(4);
  };

  // const signatureRequest = async (nonce, stepOne) => {
  //   if (stepOne) {
  //     generateNonce(web3Data.accounts[0]);
  //   } else {
  //     console.log("nonce", nonce);
  //     try {
  //       console.log(web3);
  //       const signature = await web3.eth.personal.sign(
  //         web3.utils.utf8ToHex(nonce),
  //         web3Data.accounts[0]
  //       );
  //       await authLogin(nonce, signature);
  //       return;

  //       if (!web3Data.isLoggedIn) {
  //         const chainId = await web3.eth.net.getId();
  //         console.log(chainId);
  //         if (chainId !== 56 && chainId !== "0x38") {
  //           // MetaMask injects the global API into window.ethereum
  //           try {
  //             const signature = await web3.eth.personal.sign(
  //               web3.utils.utf8ToHex(nonce),
  //               web3Data.accounts[0]
  //             );
  //             await authLogin(nonce, signature);
  //             return;
  //             if (window.web3) {
  //               await window.ethereum.request({
  //                 method: "wallet_addEthereumChain",
  //                 params: [
  //                   {
  //                     chainId: "0x38",
  //                     chainName: "Binance Smart Chain",
  //                     nativeCurrency: {
  //                       name: "Binance Chain Token",
  //                       symbol: "BNB",
  //                       decimals: 18,
  //                     },
  //                     rpcUrls: ["https://bsc-dataseed2.binance.org/"],
  //                   },
  //                 ],
  //               });
  //               // console.log("here");
  //               // check if the chain to connect to is installed
  //               // const changeRequest = await window.ethereum.request({
  //               //   method: "wallet_switchEthereumChain",
  //               //   params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
  //               // });
  //               // console.log(changeRequest);
  //               const signature = await web3.eth.personal.sign(
  //                 web3.utils.utf8ToHex(nonce),
  //                 web3Data.accounts[0]
  //               );
  //               await authLogin(nonce, signature);
  //               refreshStates(true);
  //             } else {
  //               setLoader(false);
  //               setError({
  //                 isError: true,
  //                 msg: "Wrong Network, please select the correct network",
  //                 code: 0,
  //               });
  //             }
  //           } catch (error) {
  //             console.log("error ", error);
  //             // This error code indicates that the chain has not been added to MetaMask
  //             // if it is not, then install it into the user MetaMask
  //             // if (error.code === 4902) {
  //             //   try {
  //             //     await window.ethereum.request({
  //             //       method: "wallet_addEthereumChain",
  //             //       params: [
  //             //         {
  //             //           chainId: "0x38",
  //             //           chainName: "Binance Smart Chain",
  //             //           nativeCurrency: {
  //             //             name: "Binance Chain Token",
  //             //             symbol: "BNB",
  //             //             decimals: 18,
  //             //           },
  //             //           rpcUrls: ["https://bsc-dataseed2.binance.org/"],
  //             //         },
  //             //       ],
  //             //     });
  //             //   } catch (addError) {
  //             //     setLoader(false);
  //             //     setError({ isError: true, msg: addError.message, code: 1 });
  //             //   }
  //             // }

  //             if (error.code === 4001) {
  //               setLoader(false);
  //               setError({ isError: true, msg: error.message, code: 1 });
  //             }
  //             // console.error(error);
  //           }
  //         } else {
  //           global.window.localStorage.removeItem(
  //             "WALLETCONNECT_DEEPLINK_CHOICE"
  //           );
  //           const signature = await web3.eth.personal.sign(
  //             web3.utils.utf8ToHex(nonce),
  //             web3Data.accounts[0]
  //           );
  //           await authLogin(nonce, signature);
  //           refreshStates(true);
  //         }
  //       }
  //     } catch (error) {
  //       setLoader(false);
  //       setError({ isError: true, msg: error.message, code: 1 });
  //     }
  //   }
  // };

  return (
    <div>
      <Head>
        <title>Cyborn</title>
        <meta name="description" content="Cyborn Blockchain" />
        <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
      </Head>
      <br />
      <section className="relative">
        <div className="hidden sm:block sm:inset-0 sm:absolute"></div>

        <div className="relative lg:grid grid-cols-2 gap-4 max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
          <div className="max-w-xl text-center sm:text-left">
            <h1 className="text-3xl text-headtext font-extrabold sm:text-5xl">
              Log In
            </h1>

            <p className="max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl">
              Connect your wallet
            </p>
            <br />
            <div className="lg:grid grid-cols-2 gap-4">
              <button
                onClick={() => connectToWallet()}
                className="bg-white rounded button-lg text-black"
              >
                {" "}
                Metamask{" "}
              </button>
              <button
                onClick={() => connectToWallet(true)}
                className="bg-white rounded button-lg text-black"
              >
                {" "}
                Wallet Connect{" "}
              </button>
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="lg:grid grid-cols-1 gap-4">
              <button
                onClick={() => router.push("/register")}
                className="bg-white rounded button-lg text-black"
              >
                {" "}
                Continue with Twitter{" "}
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-white rounded button-lg text-black"
              >
                {" "}
                Continue with Facebook{" "}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8 text-left">
            <p className="text-white text-5xl font-extrabold text-center sm:text-md">
              Log In With Your Email
            </p>
            <p className="text-white font-light text-xl">
              Type your password and email below
            </p>
            <br />
            <br />
            <br />

            <div className="lg:grid grid-cols-2 gap-4">
              <p className="max-w-lg mt-4 text-white  sm:leading-relaxed sm:text-xl">
                Email
              </p>
              <input
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                className="form-control block w-48 px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div className="lg:grid lg:grid-cols-2 gap-4">
              <p className="max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl">
                Password
              </p>
              <input
                placeholder="Enter Your Password"
                className="form-control block w-48 px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />

              <div>
                <br />
                <button
                  onClick={() => router.push("/register")}
                  className="button button-primary button-md flex justify-end"
                >
                  {" "}
                  Log-In{" "}
                </button>
              </div>
            </div>
            <p className="font-extralight mt-4 text-white sm:leading-relaxed sm:text-xl">
              New here?{" "}
              <a className="underline" href="/register">
                Create an account
              </a>
            </p>
            <br />
          </div>
        </div>
      </section>
    </div>
  );
}

const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: () => dispatch(actions.getWeb3()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    enabledWalletConnect: () => dispatch(actions.enabledWalletConnect()),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    authLogin: (nonce, signature) =>
      dispatch(actions.authLogin(nonce, signature)),
    authenticateUser: () => dispatch(actions.authenticateUser()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
    authLogout: () => dispatch({ type: "AUTH_LOGOUT", data: null }),
    web3Logout: () =>
      dispatch({
        type: "FETCH_WEB3_DATA",
        data: { isLoggedIn: false, accounts: [] },
      }),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    networkId: state.fetchNetworkId,
    isMetamaskEnabled: state.fetchMetamask,
    nonce: state.fetchNonce,
    authData: state.fetchAuthData,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(SignIn);
