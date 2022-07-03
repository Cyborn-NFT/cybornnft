import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Link from 'next/link';
import Image from 'next/image';
import CybornFooter from '/components/CybornFooter';
import Head from 'next/head';
import { supabase } from '../client';
import Router, { useRouter } from 'next/router';
import Marketplace from "./marketplace";
import Account from "./account"
import Activity from "./activity"
import {
  CYBORN_NFT_ADDRESS,
  CYBORN_MARKET_ADDRESS,
  CYBORN_MARKET_ABI,
  CYBORN_NFT_ABI,
  AUCTION_NFT_ABI,
  AUCTION_NFT_ADDRESS,
} from '/constants';
import React from 'react';
import { TelegramShareButton, TelegramIcon } from 'next-share';
import { TwitterShareButton, TwitterIcon } from 'next-share';
import { FaTelegramPlane, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { WhatsappShareButton, WhatsappButton } from 'next-share';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import nProgress from 'nprogress';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');



export default function Inventory() {
  const [isShown, setIsShown] = useState(false)
  const [isShownCollection, setIsShownCollection] = useState(false)
  const [isShownActivity, setIsShownActivity] = useState(false)
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const MySwal = withReactContent(Swal);

  const handleClick = event =>{
    setIsShown(current => !current);
  }

  const handleCollectionClick = event =>{
    setIsShownCollection(collectionCurrent => !collectionCurrent);
  }

  const handleActivityClick = event =>{
    setIsShownActivity(activityCurrent => !activityCurrent);
  }

  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetchProfile();
  }, []);
  async function fetchProfile() {
    const profileData = await supabase.auth.user();
    if (!profileData) {
      router.push('/signin');
    } else {
      setProfile(profileData);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    router.push('/signin');
  }
  if (!profile) return null;

  const open = () => {
    MySwal.fire({
      title: 'Successfully Listed Your NFT To Auction Platform',
      imageUrl: '{fileUrl}',
      text: 'Share with your audience',
      background: '#04111d',
      icon: 'success',
    });
  };

  const mintOpen = () => {
    MySwal.fire({
      title: 'Successfully minted Your NFT',
      text: 'Proceed to list your NFT asset in the market',
      background: '#04111d',
      icon: 'success',
      timer: 2500,
    });
  };

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  async function createAuction() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createTrade(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createTrade(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      AUCTION_NFT_ADDRESS,
      AUCTION_NFT_ABI,
      signer
    );
    let transaction = await contract.SimpleAuction(
      1547,
      '0xD0388ceC17c6a0D2D43e5FE8De0Bafb1d36CAFb3'
    );
    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    let tx = await transaction.wait();
    Router.events.on('routeChangeComplete', nProgress.done);
    let event = tx.events[0];
    open();
    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    Router.events.on('routeChangeComplete', nProgress.done);
    router.push('/marketplace');
  }

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
  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CYBORN_MARKET_ADDRESS,
      CYBORN_MARKET_ABI,
      signer
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(
      CYBORN_NFT_ADDRESS,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === 'loaded' && !nfts.length)
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <p className='text-white text-center text-6xl'>
          No NFTs Created By You
        </p>
        <br />
        <br />
        <br />
        <br />

      </div>
    );
  return (
    <div className="lg:p-20">
      <div className="w-6/6 p-24 rounded-full profilez">
        <div className="lg:grid grid-cols-7 gap-2">
          <img className="rounded-full lg:mt-0" src="/avatar.png" />
          <div>
          &nbsp;
            <h1>Nezuko</h1>
            &nbsp;
            <p className="card">Wallet Address</p>
            <p className="font-extralight lg:mt-4">Creator: 0x12se5ed2s</p>
          </div>
          <div>
          </div>
          &nbsp;
          <button onClick={()=>router.push("/edit")} className='font-extralight rounded-md px-1 lg:h-2/6 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
            Edit
          </button>
          <button onClick={()=>router.push("/create")} className='font-extralight rounded-md px-1 lg:h-2/6 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
            Create
          </button>
        </div>
      </div>
      <div>
      <br />
      <br />
      <br />
      <br />
        <ul class="flex">
          <li class="text-center flex-1">
            <button onClick={handleClick} class="text-center  rounded hover:border-white text-blue-500 py-2 px-4" href="#">Assets</button>
            <hr className="hover: bg-gray-500" />
          </li>
          <li class="text-center flex-1">
            <button onClick={handleCollectionClick} class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Created</button>
            <hr />
          </li>
          <li class="text-center flex-1">
            <button onClick={handleClick} class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Offers</button>
            <hr />
          </li>
          <li class="text-center flex-1">
            <button onClick={handleActivityClick} class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Activity</button>
            <hr />
          </li>
        </ul>
        <br />
        <br />
        <ul class="flex">
          <li class="text-center flex-1">
          <input placeholder="Search" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          </li>
          <li class="text-center flex-1">
            <button class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">All</button>
          </li>
          <li class="text-center flex-1">
            <button class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Art</button>
          </li>
          <li class="text-center flex-1">
            <button class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Video</button>
          </li>
          <li class="text-center flex-1">
            <button class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Music</button>
          </li>
          <li class="text-center flex-1">
            <button class="text-center rounded hover:border-white text-blue-500 py-2 px-4" href="#">Sort By</button>
          </li>
          <li class="text-center flex-1">
          <select placeholder="dropdown" className="form-control block w-full px-3 py-1.5 text-base font-normal focus:text-black bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:bg-white focus:border-blue-600 focus:outline-none">
            <option> Latest </option>
          </select>
          </li>
        </ul>
        <br />
        <br />
        <div>
        {isShown && <Marketplace />}
        </div>
        <div>
        {isShownCollection && <Inventory />}
        </div>
        <div>
        {isShownActivity && <Activity />}
        </div>

        <br />
        <div className='section home-explore flex items-center'>
          <div className='home-explore-content container-default mx-auto'>
            <h2 className='title home-explore text-center my-10 text-3xl sm:text-5xl gradient-text'>
              Featured Collections
            </h2>

            <div
              id='items'
              className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'
            >
              {nfts.map((nft, i) => (
                <div key={i} className='card overflow-hidden'>
                  <div className='card-image-wrapper px-4 pt-6 pb-1'>
                    <Link
                      href={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                    >
                      <a>
                        <img src={nft.image} alt={nft.name} title={nft.name} />
                      </a>
                    </Link>
                  </div>
                  <div className='px-4 card-content'>
                    <div className='grid grid-cols-2'>
                      <div className='card-title'>
                        <Link
                          href={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                        >
                          <a>
                            <p className='font-bold'>{nft.name}</p>
                          </a>
                        </Link>
                        <p className='font-light text-xs'>{nft.description}</p>
                      </div>
                      <div className='card-share text-right'>
                        <button className='button button-link text-white p-0'>
                          <svg
                            viewBox='0 0 14 4'
                            fill='none'
                            width='16'
                            height='16'
                            xlmns='http://www.w3.org/2000/svg'
                            className='inline-block'
                          >
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM8.5 2C8.5 2.82843 7.82843 3.5 7 3.5C6.17157 3.5 5.5 2.82843 5.5 2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2ZM11.999 3.5C12.8274 3.5 13.499 2.82843 13.499 2C13.499 1.17157 12.8274 0.5 11.999 0.5C11.1706 0.5 10.499 1.17157 10.499 2C10.499 2.82843 11.1706 3.5 11.999 3.5Z'
                              fill='currentColor'
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className='grid grid-flow-col auto-cols-max card-profile my-2'>
                      <div className='card-profile-image mr-3'>
                        <img className='rounded-full' src='./avatar.png' />
                      </div>
                      <div className='card-profile-desc'>
                        <p className='font-bold'>Created by</p>
                        <p>Creator Name</p>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 mb-3 card-price'>
                      <div className='font-bold'>
                        <p>Price</p>
                      </div>
                      <div className='text-right font-light'>
                        <img
                          src='/ethereum.svg'
                          alt='ETH'
                          title='ETH'
                          className='eth-logo inline-block'
                        />{' '}
                        {nft.price} ETH
                      </div>
                    </div>
                  </div>
                  <div className='card-link'>
                    <button
                      className='button-card py-2'
                      onClick={() => buyNft(nft)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='bg-IndexHeader'>
        <div className='px-4'>
          {Boolean(sold.length) && (
            <div>
              <br />
              <h2 className='text-6xl text-white py-2 text-center'>
                Sold List
              </h2>
              <br />
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {sold.map((nft, i) => (
                  <div
                    key={i}
                    className='border shadow rounded-xl overflow-hidden'
                  >
                    <img src={nft.image} className='rounded' />
                    <div className='p-4 bg-black'>
                      <p
                        style={{ height: '40px' }}
                        className='text-sm text-white font-semibold'
                      >
                        Seller: {nft.seller}
                      </p>
                      <br />
                      <p
                        style={{ height: '40px' }}
                        className='text-sm text-white font-light'
                      >
                        Owner: {nft.owner}
                      </p>
                      <br />
                      <p
                        style={{ height: '40px' }}
                        className='text-white font-light'
                      >
                        Sold: Yes
                      </p>
                    </div>
                    <div className='p-4 bg-black'>
                      <p className='text-2xl font-light text-white'>
                        Price - {nft.price} ETH
                      </p>
                    </div>
                    <br />
                    <div className='grid grid-cols-3 ml-10 gap-2 items-center'>
                      <div className='bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
                        <div className=''>
                          <TelegramShareButton
                            url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                            title={
                              "Here's my NFT that I have bought from Cyborn NFT Marketplace"
                            }
                          >
                            <FaTelegramPlane className='w-6 h-6 m-4 text-white hover:text-black'></FaTelegramPlane>
                          </TelegramShareButton>
                        </div>
                      </div>

                      <div className='bg-blue-300 transition-all rounded-full hover:bg-blue-500 h-14 w-14 group  '>
                        <div className=''>
                          <TwitterShareButton
                            url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                            title={
                              "Here's my NFT that I have bought from Cyborn NFT Marketplace"
                            }
                          >
                            <FaTwitter className='w-6 h-6 m-4 text-white hover:text-black'></FaTwitter>
                          </TwitterShareButton>
                        </div>
                      </div>

                      <div className='bg-blue-300 transition-all rounded-full hover:bg-blue-500 h-14 w-14 group  '>
                        <div className=''>
                          <WhatsappShareButton
                            url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                            title={
                              "Here's my NFT that I have bought from Cyborn NFT Marketplace"
                            }
                          >
                            <FaWhatsapp className='w-6 h-6 m-4 text-white hover:text-black'></FaWhatsapp>
                          </WhatsappShareButton>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          )}
          <br />
          <br />
        </div>
        <div></div>
        {showModal ? (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-IndexHeader outline-none focus:outline-none'>
                  <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                    <h3 className='text-3xl font-semibold text-white'>
                      Start Auction
                    </h3>
                    <button
                      className='p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                      onClick={() => setShowModal(false)}
                    >
                      <span className='bg-black text-white h-6 w-6 text-3xl block'>
                        ×
                      </span>
                    </button>
                  </div>

                  <div className='relative p-6 flex-auto'>
                    <input
                      placeholder='Asset Name'
                      className='mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                      onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                      }
                    />
                    <br />

                    <label className='text-white'> Auction End Time </label>
                    <div class='relative'>
                      <div class='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <svg
                          class='w-5 h-5 text-gray-500 dark:text-gray-400'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fill-rule='evenodd'
                            d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                            clip-rule='evenodd'
                          ></path>
                        </svg>
                      </div>

                      <input
                        datepicker
                        type='time'
                        class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='Select Auction Start date'
                      />
                    </div>
                    <br />
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                      Upload file
                    </label>
                    <input
                      name='Asset'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      onChange={onChange}
                      type='file'
                    />
                    <div
                      className='mt-1 text-sm text-gray-500 dark:text-gray-300'
                      id='user_avatar_help'
                    >
                      Your Uploaded will be shown below*
                    </div>
                    <br />
                    <button
                      onClick={createTrade}
                      className='block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring'
                    >
                      Start Auction
                    </button>
                  </div>

                  <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                    <button
                      className='text-black rounded bg-white font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className='flex-1 shrink-0'>
                    <div className='flex-1 shrink-0 h-full w-full object-cover md:h-full'>
                      {fileUrl && (
                        <div>
                          <img
                            className='rounded mt-4'
                            width='500'
                            height='500'
                            src={fileUrl}
                          />
                          <video
                            autoPlay
                            loop
                            className='rounded mt-4'
                            width='500'
                            height='500'
                          >
                            <source src={fileUrl} />
                          </video>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        ) : null}

        {showTransferModal ? (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-IndexHeader outline-none focus:outline-none'>
                  <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                    <h3 className='text-3xl font-semibold text-white'>
                      Transfer NFT
                    </h3>
                    <button
                      className='p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                      onClick={() => setShowTransferModal(false)}
                    >
                      <span className='bg-black text-white h-6 w-6 text-3xl block'>
                        ×
                      </span>
                    </button>
                  </div>

                  <div className='relative p-6 flex-auto'>
                    <input
                      placeholder='Enter Receiver Wallet Address'
                      className='mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                    />
                    <br />
                    <button className='block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring'>
                      Transfer
                    </button>
                  </div>

                  <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setShowTransferModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setShowTransferModal(false)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        ) : null}
      </div>
    </div>
  );
}
