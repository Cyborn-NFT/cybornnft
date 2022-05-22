import React from 'react';
import Link from 'next/link';
import web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { BiWalletAlt } from 'react-icons/bi';
import Web3Modal from 'web3modal';
import { supabase } from '../client';
import { useRouter } from 'next/router';
import Head from 'next/head';

function CybornHeader() {
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

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  const web3ModalRef = useRef();

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

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'rinkeby',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      CYBORN_MARKET_ADDRESS,
      CYBORN_MARKET_ABI,
      signer
    );
    const tokenContract = new ethers.Contract(
      CYBORN_NFT_ADDRESS,
      CYBORN_NFT_ABI,
      provider
    );
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState('loaded');
  }

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
            <img src='/ark.png' title='Cyborn' alt='Cyborn' />
          </a>
        </Link>
        <button
          className=' inline-flex p-3 hover:bg-background rounded lg:hidden text-white ml-auto hover:text-white outline-none'
          onClick={handleClick}
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
            onClick={signOut}
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
            onClick={connectWallet}
            className='text-white bg-blue-400 font-medium rounded-lg text-sm px-2 py-2 mt-0 text-center inline-flex items-center'
          >
            <img width={18} height={18} src='/metamask.svg' /> &nbsp; Connect
            with MetaMask
          </button>
        </div>
      </nav>
    </>
  );
}

export default CybornHeader;
