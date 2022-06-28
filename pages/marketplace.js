import { ethers} from 'ethers';
import React, {  useEffect,  useState} from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Link from 'next/link';
import {  useRouter} from 'next/router';
import Image from 'next/image';
import CybornFooter from '/components/CybornFooter';
import Head from 'next/head';
import {  supabase} from '../client';
import {  CYBORN_NFT_ADDRESS,  CYBORN_MARKET_ADDRESS,  AUCTION_MARKET_ABI,  AUCTION_MARKET_ADDRESS,  CYBORN_MARKET_ABI,  CYBORN_NFT_ABI,  AUCTION_TOKEN_ABI,  AUCTION_TOKEN_ADDRESS,} from '/constants';
import {  TelegramShareButton,  TelegramIcon} from 'next-share';
import {  TwitterShareButton,  TwitterIcon} from 'next-share';
import {  FaTelegramPlane,  FaTwitter,  FaWhatsapp} from 'react-icons/fa';
import {  WhatsappShareButton,  WhatsappButton} from 'next-share';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Marketplace() {
  const router = useRouter();
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  const [nftz, setNftz] = useState([]);
  const [loadingStatez, setLoadingStatez] = useState('not-loaded');
  useEffect(() => {
    loadAuction();
  }, []);

  const MySwal = withReactContent(Swal);
  const open = () => {
    MySwal.fire({
      title: 'You have successfully bought this NFT',
      text: 'Check your inventory & Share it with your audience',
      background: '#04111d',
      icon: 'success',
    });
  };

  const mintOpen = () => {
    MySwal.fire({
      title: 'Do not refresh or close this transaction',
      text: 'Please wait until this transaction approved on-chain',
      background: '#04111d',
      icon: 'success',
      timer: 4500,
    });
  };

  const useCopyToClipboard = (text) => {
    const copyToClipboard = (str) => {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0 ?
        document.getSelection().getRangeAt(0) :
        false;
      el.select();
      const success = document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      return success;
    };

    const [copied, setCopied] = React.useState(false);

    const copy = React.useCallback(() => {
      if (!copied) setCopied(copyToClipboard(text));
    }, [text]);
    React.useEffect(() => () => setCopied(false), [text]);

    return [copied, copy];
  };

  const TextCopy = (props) => {
    const [copied, copy] = useCopyToClipboard('');
    return ( <
      div >
      <
      button onClick = {
        copy
      }
      className = 'bg-white p-4 flex items-center shadow-glow' >
      <
      div className = 'mr-2' / >
      <
      span > cybornnft.com / nft < /span> < /
      button > <
      div className = 'text-white mt-1' > {
        copied && '💡 Link Copied! '
      } < /div> < /
      div >
    );
  };

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

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/1c632cde3b864975a1d2f123cf5b7ec9'
    );
    const tokenContract = new ethers.Contract(
      CYBORN_NFT_ADDRESS,
      CYBORN_NFT_ABI,
      provider
    );
    const marketContract = new ethers.Contract(
      CYBORN_MARKET_ADDRESS,
      CYBORN_MARKET_ABI,
      provider
    );
    const data = await marketContract.fetchMarketItems();

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
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
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
      nft.tokenId, {
        value: price,
      }
    );
    mintOpen();
    await transaction.wait();
    open();
    loadNFTs();
  }

  async function loadAuction() {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/1c632cde3b864975a1d2f123cf5b7ec9'
    );
    const tokenContract = new ethers.Contract(
      AUCTION_TOKEN_ADDRESS,
      AUCTION_TOKEN_ABI,
      provider
    );
    const marketContract = new ethers.Contract(
      AUCTION_MARKET_ADDRESS,
      AUCTION_MARKET_ABI,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const meta = await axios.get(tokenUri);
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNftz(items);
    setLoadingStatez('loaded');
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (
      <div >
      <h1 className = 'px-20 py-10 text-3xl' > No items in marketplace < /h1>
      < /div >
    );
  return (
    <div className = '' >
    <br />
    <br />
    <br />
      <div>
      <div className="grid grid-cols-2 sm:grid grid-2 lg:grid grid-cols-4 gap-4">
      <h1 className='text-blue-400 lg:ml-36 text-5xl text-left sm:text-md'>
        Collections
      </h1>
      <div>
      </div>
      <div>
      </div>
      <div>
      <button className='block py-3 p-8 text-sm font-medium text-white rounded shadow bg-blue-400 sm:w-auto focus:outline-none focus:ring'>
        View More
      </button>
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3  lg:p-32">
      <div class="max-w-sm lg card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
        <div class="p-8">
          <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Collection 1</h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Tomb Raider NFT Collection.</p>
        </div>
        <div className="lg:grid grid-cols-3">
          <a href="#">
            <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
          </a>
          <a href="#">
            <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
          </a>
          <a href="#">
            <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
          </a>
          </div>
        </div>


    <div class="max-w-sm lg card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
      <div class="p-8">
          <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Collection Page 2</h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Spiderman NFT</p>
        </div>
      <div className="lg:grid grid-cols-3">
        <a href="#">
          <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
        </a>
        <a href="#">
          <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
        </a>
        <a href="#">
          <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
        </a>
        </div>
      </div>



  <div class="max-w-sm lg card rounded-lg border border-gray-200 shadow-md  dark:border-gray-700">
    <div class="p-8">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Collection Page 3</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Hulk NFT</p>
      </div>
    <div className="lg:grid grid-cols-3">
      <a href="#">
        <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
      </a>
      <a href="#">
        <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
      </a>
      <a href="#">
        <img class="rounded-t-lg repeat" src="/avatar.png" alt="" />
      </a>
      </div>
    </div>

    </div>
  </div>





  <div>
  <br />
  <div className="grid grid-cols-2 sm:grid grid-2 lg:grid grid-cols-4 gap-4">
  <h1 className='text-blue-400 text-5xl lg:ml-32 sm:text-md'>
    Creators
  </h1>
  <div>
  </div>
  <div>
  </div>
  <div>
  <button className='block py-3 p-8 text-sm font-medium text-white rounded shadow bg-blue-400 sm:w-auto focus:outline-none focus:ring'>
    View More
  </button>
  </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 lg:p-32">
  <div class="max-w-sm card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
    <div class="flex justify-end px-4 pt-4">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" class="hidden sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
        </button>
        <div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
            <ul class="py-1" aria-labelledby="dropdownButton">
            <li>
                <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
            </li>
            <li>
                <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
            </li>
            <li>
                <a href="#" class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
            </li>
            </ul>
        </div>
    </div>
    <div class="flex flex-col items-center pb-10">
        <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="/avatar.png" alt="Bonnie image"/>
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Profile 1</h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">Cyborn#1</span>
        <div className = 'grid grid-cols-3 gap-2 items-center ' >
        <div className = 'bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
        <div className = ''>
        <TelegramShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
          <FaTelegramPlane className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaTelegramPlane>
        < /TelegramShareButton >
        </div>
        </div >

        <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
        <div className = ''>
        <TwitterShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
          <FaTwitter className = 'w-6 h-6 m-4 text-white hover:text-black'> </FaTwitter>
        </TwitterShareButton >
        </div>
        </div>

        <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
        <div className = ''>
        <WhatsappShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"} >
        <FaWhatsapp className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaWhatsapp>
        </WhatsappShareButton>
        </div>
        </div >
        </div>
        <div className='card-link w-full'>
            <br />
          <button
            className='button-card py-2 p-4'
          >
            View Profile
          </button>
        </div>
    </div>
    </div>


    <div class="max-w-sm card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
      <div class="flex justify-end px-4 pt-4">
          <button id="dropdownButton" data-dropdown-toggle="dropdown" class="hidden sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
          </button>
          <div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <ul class="py-1" aria-labelledby="dropdownButton">
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
              </li>
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
              </li>
              <li>
                  <a href="#" class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
              </li>
              </ul>
          </div>
      </div>
      <div class="flex flex-col items-center pb-10">
          <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="/avatar.png" alt="Bonnie image"/>
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Profile 1</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">Cyborn#1</span>
          <div className = 'grid grid-cols-3 gap-2 items-center ' >
          <div className = 'bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
          <div className = ''>
          <TelegramShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
            <FaTelegramPlane className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaTelegramPlane>
          < /TelegramShareButton >
          </div>
          </div >

          <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
          <div className = ''>
          <TwitterShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
            <FaTwitter className = 'w-6 h-6 m-4 text-white hover:text-black'> </FaTwitter>
          </TwitterShareButton >
          </div>
          </div>

          <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
          <div className = ''>
          <WhatsappShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"} >
          <FaWhatsapp className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaWhatsapp>
          </WhatsappShareButton>
          </div>
          </div >
          </div>
          <div className='card-link w-full'>
              <br />
            <button
              className='button-card py-2 p-4'
            >
              View Profile
            </button>
          </div>
      </div>
      </div>


      <div class="max-w-sm card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
        <div class="flex justify-end px-4 pt-4">
            <button id="dropdownButton" data-dropdown-toggle="dropdown" class="hidden sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
            </button>
            <div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                <ul class="py-1" aria-labelledby="dropdownButton">
                <li>
                    <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                </li>
                <li>
                    <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                </li>
                <li>
                    <a href="#" class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col items-center pb-10">
            <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="/avatar.png" alt="Bonnie image"/>
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Profile 1</h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">Cyborn#1</span>
            <div className = 'grid grid-cols-3 gap-2 items-center ' >
            <div className = 'bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
            <div className = ''>
            <TelegramShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
              <FaTelegramPlane className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaTelegramPlane>
            < /TelegramShareButton >
            </div>
            </div >

            <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
            <div className = ''>
            <TwitterShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
              <FaTwitter className = 'w-6 h-6 m-4 text-white hover:text-black'> </FaTwitter>
            </TwitterShareButton >
            </div>
            </div>

            <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
            <div className = ''>
            <WhatsappShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"} >
            <FaWhatsapp className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaWhatsapp>
            </WhatsappShareButton>
            </div>
            </div >
            </div>
            <div className='card-link w-full'>
                <br />

              <button
                className='button-card py-2 p-4'
              >
                View Profile
              </button>
            </div>
        </div>
        </div>

        <div class="max-w-sm card rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
          <div class="flex justify-end px-4 pt-4">
              <button id="dropdownButton" data-dropdown-toggle="dropdown" class="hidden sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
              </button>
              <div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                  <ul class="py-1" aria-labelledby="dropdownButton">
                  <li>
                      <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                  </li>
                  <li>
                      <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                  </li>
                  <li>
                      <a href="#" class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                  </li>
                  </ul>
              </div>
          </div>
          <div class="flex flex-col items-center">
              <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="/avatar.png" alt="Bonnie image"/>
              <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Profile 1</h5>
              <span class="text-sm text-gray-500 dark:text-gray-400">Cyborn#1</span>
              <div className = 'grid grid-cols-3 gap-2 items-center ' >
              <div className = 'bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
              <div className = ''>
              <TelegramShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
                <FaTelegramPlane className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaTelegramPlane>
              < /TelegramShareButton >
              </div>
              </div >

              <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
              <div className = ''>
              <TwitterShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
                <FaTwitter className = 'w-6 h-6 m-4 text-white hover:text-black'> </FaTwitter>
              </TwitterShareButton >
              </div>
              </div>

              <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
              <div className = ''>
              <WhatsappShareButton url = {`https://cybornnft.vercel.app/`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"} >
              <FaWhatsapp className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaWhatsapp>
              </WhatsappShareButton>
              </div>
              </div >
              </div>

              <div className='card-link w-full'>
                  <br />
                <button
                  className='button-card py-2 p-4'
                >
                  View Profile
                </button>
              </div>
          </div>
          </div>



      </div>
      </div>



      <div className = 'flex justify-center' >
        <div className = 'px-4 container-default' >
        <br />
        <div className="grid grid-cols-2 sm:grid grid-2 lg:grid grid-cols-4 gap-4">
        <h1 className='text-blue-400 text-5xl lg:ml-32 sm:text-md'>
          Assets
        </h1>
        <div>
        </div>
        <div>
        </div>
        <div>
        <button className='block py-3 p-8 text-sm font-medium text-white rounded shadow bg-blue-400 sm:w-auto focus:outline-none focus:ring'>
          View More
        </button>
        </div>
        </div>
          <div id = 'items' className = 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 lg:p-16' >
     {
      nfts.map((nft, i) => (
        <div key = {i} className = 'card overflow-hidden' >
        <div className = 'card-image-wrapper px-4 pt-6 pb-1' >
        <Link href = {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`} >
        <a>
        <img src = { nft.image } alt = { nft.name } title = { nft.name } />
        </a>
        </Link>
        </div>
        <div className = 'px-4 card-content' >
        <div className = 'grid grid-cols-2' >
        <div className = 'card-title' >
        <Link href = {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`} >
        <a>
        <p className = 'font-bold' > { nft.name } < /p>
        </a>
        </Link>
        <p className = 'font-light text-xs' > { nft.description } < /p>
        </div>
        <div className = 'card-share text-right' >
        <button className = 'button button-link text-white p-0' >
        <svg viewBox = '0 0 14 4'
        fill = 'none'
        width = '16'
        height = '16'
        xlmns = 'http://www.w3.org/2000/svg'
        className = 'inline-block' >
        <path fillRule = 'evenodd'
        clipRule = 'evenodd'
        d = 'M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM8.5 2C8.5 2.82843 7.82843 3.5 7 3.5C6.17157 3.5 5.5 2.82843 5.5 2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2ZM11.999 3.5C12.8274 3.5 13.499 2.82843 13.499 2C13.499 1.17157 12.8274 0.5 11.999 0.5C11.1706 0.5 10.499 1.17157 10.499 2C10.499 2.82843 11.1706 3.5 11.999 3.5Z'
        fill = 'currentColor' >
        </path>
        < /svg >
        </button>
        </div>
        </div>
        <div className = 'grid grid-flow-col auto-cols-max card-profile my-2'>
        <div className = 'card-profile-image mr-3'>
        <img className = 'rounded-full' src = './avatar.png' / >
        </div>
        <div className = 'card-profile-desc'>
        <p className = 'font-bold' > Created b </p>
        <p> Creator Name </p>
        </div>
        </div>
        <div className = 'grid grid-cols-2 mb-3 card-price'>
        <div className = 'font-bold' >
        <p > Price </p>
        </div >
        <div className = 'text-right font-light'>
        <img src = '/ethereum.svg' alt = 'ETH' title = 'ETH' className = 'eth-logo inline-block' />
        {
          ' '
        } {
          nft.price
        }
        ETH <
        /div> < /
        div > <
        /div>

        <div className = 'grid grid-cols-3 gap-2 items-center ' >
        <div className = 'bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group '>
        <div className = ''>
        <TelegramShareButton url = {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
          <FaTelegramPlane className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaTelegramPlane>
        < /TelegramShareButton >
        </div>
        </div >

        <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
        <div className = ''>
        <TwitterShareButton url = {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"}>
          <FaTwitter className = 'w-6 h-6 m-4 text-white hover:text-black'> </FaTwitter>
        </TwitterShareButton >
        </div>
        </div>

        <div className = 'bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group'>
        <div className = ''>
        <WhatsappShareButton url = {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`} title = {"Here's my NFT Link, if you are interested you can buy it through this link"} >
        <FaWhatsapp className = 'w-6 h-6 m-4 text-white hover:text-black' > </FaWhatsapp>
        </WhatsappShareButton>
        </div>
        </div >
        </div>
        <div className = 'card-link' >
        <button className = 'button-card py-2' onClick = {() => buyNft(nft)}>Buy Now </button>
        </div >
        </div>
      ))
    }
    </div>
    </div>
    </div>
    <br />
    <br />
    </div>

  );
}

const mapDipatchToProps = (dispatch) => {
  return {
    getMarketPlaceNFT: (params) => dispatch(actions.getMarketPlaceNFT(params)),
    getMoreMarketPlaceNFT: (params) =>
      dispatch(actions.getMoreMarketPlaceNFT(params)),
    getCategories: () => dispatch(actions.fetchCategories()),
    clearMarketPlaceNFT: () =>
      dispatch({
        type: 'FETCHED_MARKETPLACE',
        data: []
      }),
    clearPagination: () => dispatch({
      type: 'FETCHED_PAGINATION',
      data: []
    }),
    clearMoreMarketPlaceNFT: () =>
      dispatch({
        type: 'FETCHED_MORE_MARKETPLACE',
        data: []
      }),
  };
};
const mapStateToProps = (state) => {
  return {
    NFTs: state.fetchMarketPlaceNFT,
    pagination: state.fetchPagination,
    moreNFTs: state.fetchMoreMarketPlaceNFT,
    categories: state.fetchCategory,
  };
};

export default Marketplace;
