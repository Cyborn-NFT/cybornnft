import React from 'react';
import Link from 'next/link';
import { providers, Contract, utils } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { BiWalletAlt } from 'react-icons/bi';
import Web3Modal from 'web3modal';
import { supabase } from '../client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { connect } from 'react-redux';
import { actions } from '../actions';
import { web3 } from '../web3';

function CybornHeader(props) {
  const { generateNonce, nonce, authLogin } = props;
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [loadingState, setLoadingState] = useState('not-loaded');
  const web3ModalRef = useRef();

  useEffect(() => {
    console.log(nonce, userAddress);
    if (nonce && userAddress) signatureRequest(nonce);
  }, [nonce]);

  const signatureRequest = async (nonce) => {
    const signature = await web3.eth.personal.sign(
      web3.utils.utf8ToHex(nonce),
      userAddress
    );
    // const provider = await web3ModalRef.current.connect();
    // const web3Provider = new providers.Web3Provider(provider);
    // const signer = web3Provider.getSigner();
    // const signature = await signer.signMessage(utils.hashMessage(nonce));
    // const signature = await web3.eth.personal.sign(
    //   web3.utils.utf8ToHex(nonce),
    //   web3Data.accounts[0]
    // );
    await authLogin(nonce, signature);
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const addr = await signer.getAddress();
    setUserAddress(addr.toString());

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert('Change Network To Rinkeby Test Network');
      throw new Error('Change Network to Rinkeby Test Network');
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      setUserAddress(addr.toString());
      return signer;
    }
    generateNonce(addr);
    console.log(signer, addr, chainId, needSigner, web3Provider);
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button
          onClick={connectWallet}
          className='w-72 h-16 text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 flex items-center p-4'
        >
          <BiWalletAlt className='mr-2' />
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Cyborn</title>
        <meta name='description' content='Cyborn Blockchain' />
        <link rel='apple-touch-icon' sizes='180x180' href='/ark.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/ark.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/ark.png' />
      </Head>
      <nav className='navbar flex items-center py-2 px-10 flex-wrap top-0 left-0 right-0 z-50'>
        <Link href='/'>
          <a className='inline-flex items-center p-1 mr-4 navbar-logo'>
            <Image
              width={95}
              height={60}
              src='/ark.png'
              title='Cyborn'
              alt='Cyborn'
            />
          </a>
        </Link>
        <button
          className=' inline-flex p-3 hover:bg-background rounded lg:hidden text-white ml-auto hover:text-white outline-none'
          onClick={() => handleClick()}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <div
          className={`${
            active ? '' : 'hidden'
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <ul className='nav-menu lg:text-base lg:inline-flex md:space-x-0 md:mt-0 md:text-sm lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto'>
            <li className='nav-item'>
              <Link href='/home'>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  Explore NFT
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/create'>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  List NFT
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/Auction'>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  Auction
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/inventory'>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  Inventory
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/account'>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  Account
                </a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href={'/seller'}>
                <a className='nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center'>
                  Profile
                </a>
              </Link>
            </li>

            <p>
              <p className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:text-white'>
                Wallet: {userAddress}
              </p>
            </p>
          </ul>
          <button
            type='button'
            onClick={() => signOut()}
            className='text-white bg-blue-400 font-medium rounded-lg text-sm px-2 py-2 mt-0 text-center inline-flex items-center'
          >
            Logout
          </button>
          &nbsp;&nbsp;
          <button
            type='button'
            onClick={() => router.push('/polygon/home')}
            className='text-white bg-blue-400 font-medium rounded-lg text-sm px-2 py-2 mt-0 text-center inline-flex items-center'
          >
            Switch To Polygon
          </button>
          &nbsp;&nbsp;
          <button
            type='button'
            onClick={() => connectWallet()}
            className='text-white bg-blue-400 font-medium rounded-lg text-sm px-2 py-2 mt-0 text-center inline-flex items-center'
          >
            <Image width={22} height={22} src='/metamask.svg' alt='metamask' />{' '}
            &nbsp; Connect with MetaMask
          </button>
        </div>
      </nav>
    </>
  );
}

const mapDipatchToProps = (dispatch) => {
  return {
    authLogin: (nonce, signature) =>
      dispatch(actions.authLogin(nonce, signature)),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    getMarketPlaceNFT: (params) => dispatch(actions.getMarketPlaceNFT(params)),
    getMoreMarketPlaceNFT: (params) =>
      dispatch(actions.getMoreMarketPlaceNFT(params)),
    getCategories: () => dispatch(actions.fetchCategories()),
    clearMarketPlaceNFT: () =>
      dispatch({ type: 'FETCHED_MARKETPLACE', data: [] }),
    clearPagination: () => dispatch({ type: 'FETCHED_PAGINATION', data: [] }),
    clearMoreMarketPlaceNFT: () =>
      dispatch({ type: 'FETCHED_MORE_MARKETPLACE', data: [] }),
  };
};
const mapStateToProps = (state) => {
  return {
    NFTs: state.fetchMarketPlaceNFT,
    pagination: state.fetchPagination,
    moreNFTs: state.fetchMoreMarketPlaceNFT,
    categories: state.fetchCategory,
    nonce: state.fetchNonce,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(CybornHeader);
