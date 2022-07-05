import React from 'react';
import Head from 'next/head';
import CybornFooter from '/components/CybornFooter';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import Link from 'next/link';
import Image from 'next/image';
import nProgress from 'nprogress';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { supabase } from '../client';
import withReactContent from 'sweetalert2-react-content';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import {
  CYBORN_NFT_ADDRESS,
  CYBORN_MARKET_ADDRESS,
  CYBORN_MARKET_ABI,
  CYBORN_NFT_ABI,
} from '/constants';

function Create({mint}) {


  const [nftMint, setNftMint] = useState([]);
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState("");
  const [supply, setSupply] = useState("");
  const [protocol, setProtocol] = useState("");
  const [image, setImage] = useState(null);
  const [dbLoad, setDbLoad] = useState(false);

  const onChangePicture = e =>{
    console.log("Picture", e.target.file);
    setImage(e.target.file[0]);
  }

  useEffect(() => {
    setNftMint(mint);;
    setAssetName(mint);
    setCategory(mint);
    setDescription(mint);
    setProperties(mint);
    setSupply(mint);
    setProtocol(mint);
    setImage(mint);
  }, [mint]);

  let pushToDb = async (e) => {
    setDbLoad(true);
    e.preventDefault();
    let res = await fetch("http://localhost:3000/api/mint", {
      method: "POST",
      body: JSON.stringify({
        assetName: assetName,
        category: category,
        description: description,
        properties: properties,
        supply: supply,
        protocol: protocol,
        image: image,
      }),
    });

    res = await res.json();
    setNftMint([...nftMint, res]);
    setAssetName("");
    setCategory("");
    setDescription("");
    setProperties("");
    setSupply("");
    setProtocol("");
    setImage([]);
    setDbLoad(false);
    }


  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const open = () => {
    MySwal.fire({
      title: 'Successfully Listed Your NFT',
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
  async function createMarket() {
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
      createSale(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      CYBORN_NFT_ADDRESS,
      CYBORN_NFT_ABI,
      signer
    );
    let transaction = await contract.createToken(url);
    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    let tx = await transaction.wait();
    Router.events.on('routeChangeComplete', nProgress.done);
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    mintOpen();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    contract = new ethers.Contract(
      CYBORN_MARKET_ADDRESS,
      CYBORN_MARKET_ABI,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      CYBORN_NFT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );
    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    await transaction.wait();
    Router.events.on('routeChangeComplete', nProgress.done);
    open();
    router.push('/inventory');
  }
  return (
    <div>
      <div className='h-screen font-Ubuntu w-screen antialiased'>
        <ToastContainer
          position='top-left'
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Head>
          <title>Cyborn</title>
          <meta name='description' content='Cyborn Blockchain' />
          <link rel='apple-touch-icon' sizes='180x180' href='/ark.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/ark.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/ark.png' />
        </Head>

        <div className='flex h-full flex-col md:flex-row lg:p-16 lg:mt-40'>

          <div className='p-10 flex-1 flex flex-col justify-center '>
            <div className='flex-col md:items-start'>
              <form onSubmit={pushToDb}>
              <br />
              <br />

              <h1 className="text-blue-400 text-7xl text-extrabold">
                Create New Item
              </h1>
              <br />
              <p className="font-extralight">* Required fields </p>
              <br />
              <p>Image, Video or Audio file*</p>
              <br />

              <p className="font-extralight">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV. Max Size: 100MB</p>
              <br />
              <br />
              <div class="flex justify-center items-center w-full">
                <label for="dropzone" class="flex flex-col justify-center items-center w-full h-64 bg-transparent rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-white/25 dark:bg-transparent hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input name="image" value={image} id="dropzone" onChange={onChange} type="file" class="hidden" />
                </label>
              </div>
              <br />
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Name</p>
              <input
                placeholder='Asset Name'
                name="assetName"
                value={assetName}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  updateFormInput({ ...formInput, name: e.target.value })
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Category</p>
              <input
                placeholder='Asset Category'
                name="category"
                value={category}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'

              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Description</p>
              <textarea
                placeholder='Asset Description'
                name="description"
                value={description}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  updateFormInput({ ...formInput, description: e.target.value })
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Properties</p>
              <input
                placeholder='Asset Properties'
                name="properties"
                value={properties}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  updateFormInput({ ...formInput, price: e.target.value })
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Supply</p>
              <input
                placeholder='Token Supply'
                name="supply"
                value={supply}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                min='0'
                max='3'
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Protocol</p>
              <input type="text" placeholder="Select Protocol"
                id='protocols'
                name="protocol"
                value={protocol}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
              >
              </input>
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Freeze Metadata</p>
              <p>Freezing your metadata will allow you to permanently lock and store of this item’s content in decentralized files storage.</p>
              </div>
              <br />
              <div className="grid grid-cols-2 gap-4">
              <p>List Item for Sale </p>
              <div class="flex lg:ml-10">
                <div class="form-check form-switch">
                  <input class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked />
                  <label class="form-check-label inline-block" for="flexSwitchCheckChecked">Toggle for selection</label>
                </div>
              </div>
              </div>
              <br />
              <button
                onClick={createMarket}
                className='block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring'
              >
                Create NFT
              </button>
              </form>
            </div>
          </div>




          <div className='p-10 flex-1 flex flex-col justify-center '>
            <div className='flex-col md:items-start'>
              <form onSubmit={pushToDb}>
              <br />
              <br />

              <h1 className="text-blue-400 text-7xl text-extrabold">
                Create New Item
              </h1>
              <br />
              <p className="font-extralight">* Required fields </p>
              <br />
              <p>Image, Video or Audio file*</p>
              <br />

              <p className="font-extralight">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV. Max Size: 100MB</p>
              <br />
              <br />
              <div class="flex justify-center items-center w-full">
                <label for="dropzone" class="flex flex-col justify-center items-center w-full h-64 bg-transparent rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-white/25 dark:bg-transparent hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input name="image" value={image} id="dropzone" onChange={onChangePicture} type="file" class="hidden" />
                </label>
              </div>
              <br />
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Name</p>
              <input
                placeholder='Asset Name'
                name="assetName"
                value={assetName}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  setAssetName(e.target.value)
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Category</p>
              <input
                placeholder='Asset Category'
                name="category"
                value={category}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e)=>setCategory(e.target.value)}
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Description</p>
              <textarea
                placeholder='Asset Description'
                name="description"
                value={description}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Properties</p>
              <input
                placeholder='Asset Properties'
                name="properties"
                value={properties}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                onChange={(e) =>
                  setProperties(e.target.value)
                }
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Supply</p>
              <input
                placeholder='Token Supply'
                name="supply"
                value={supply}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                min='0'
                max='3'
                onChange={(e)=> e.target.value}
              />
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Protocol</p>
              <input type="text" placeholder="Select Protocol"
                id='protocols'
                name="protocol"
                value={protocol}
                onChange={(e)=>setProtocol(e.target.value)}
                className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
              >
              </input>
              </div>
              <br />
              <div className="lg:grid grid-cols-2 gap-4">
              <p>Freeze Metadata</p>
              <p>Freezing your metadata will allow you to permanently lock and store of this item’s content in decentralized files storage.</p>
              </div>
              <br />
              <div className="grid grid-cols-2 gap-4">
              <p>List Item for Sale </p>
              <div class="flex lg:ml-10">
                <div class="form-check form-switch">
                  <input class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked />
                  <label class="form-check-label inline-block" for="flexSwitchCheckChecked">Toggle for selection</label>
                </div>
              </div>
              </div>
              <br />
              <button
                type="submit"
                disabled={dbLoad ? true : false}
                className='block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring'
              >
                Create NFT
              </button>
              </form>
            </div>
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
      <br />
      <br />
      <br />
    </div>
  );
}



export default Create;
