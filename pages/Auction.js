import React from "react"
import Head from 'next/head'
import CybornHeader from "/components/CybornHeader"
import CybornFooter from "/components/CybornFooter"
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Link from 'next/link'
import Image from 'next/image'
import nProgress from "nprogress";
import Router from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { supabase } from '../client'
import withReactContent from "sweetalert2-react-content";
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


import { AUCTION_TOKEN_ABI, AUCTION_TOKEN_ADDRESS, AUCTION_MARKET_ABI, AUCTION_MARKET_ADDRESS, CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI, AUCTION_NFT_ABI, AUCTION_NFT_ADDRESS} from '/constants'



function Auction(){
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  const MySwal = withReactContent(Swal);

  const open = () => {
    MySwal.fire({
      title: 'Successfully Listed Your NFT',
      imageUrl: '{fileUrl}',
      text: 'Share with your audience',
      background:'#04111d',
      icon: 'success',
    });
  };

  const mintOpen = () => {
    MySwal.fire({
      title: 'Please Wait For Transaction To Approve',
      text: 'Do not close the transaction or refresh the page',
      background:'#04111d',
      icon: 'success',
      timer: 2500
    });
  };

  const [profile, setProfile] = useState(null)
  useEffect(() => {
    fetchProfile()
  }, [])
  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      router.push('/signin')
    } else {
      setProfile(profileData)
    }
  }
  async function signOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }
  if (!profile) return null

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function createMarket() {
    const { name, description, time } = formInput
    if (!name || !description || !time || !fileUrl) return
    const data = JSON.stringify({
      name, description, time, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(AUCTION_TOKEN_ADDRESS, AUCTION_TOKEN_ABI, signer)
    let transaction = await contract.createToken(url)
      mintOpen();
    Router.events.on("routeChangeStart", nProgress.start);
    Router.events.on("routeChangeError", nProgress.done);
    let tx = await transaction.wait()

    Router.events.on("routeChangeComplete", nProgress.done);
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    contract = new ethers.Contract(AUCTION_MARKET_ADDRESS, AUCTION_MARKET_ABI, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(AUCTION_TOKEN_ADDRESS, tokenId, price, { value: listingPrice })
    Router.events.on("routeChangeStart", nProgress.start);
    Router.events.on("routeChangeError", nProgress.done);
    await transaction.wait()
    Router.events.on("routeChangeComplete", nProgress.done);
    open();


    contract = new ethers.Contract(AUCTION_NFT_ADDRESS, AUCTION_NFT_ABI, signer)
    transaction = await contract.SimpleAuction(1547, "0xD0388ceC17c6a0D2D43e5FE8De0Bafb1d36CAFb3")
    Router.events.on("routeChangeStart", nProgress.start);
    Router.events.on("routeChangeError", nProgress.done);
    await transaction.wait()
    Router.events.on("routeChangeComplete", nProgress.done);
    open();
    router.push("/home")
  }
  return(
    <div>
    <CybornHeader />
    <hr />
    <div className="h-screen font-Ubuntu w-screen antialiased">
      <ToastContainer position="top-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
      <Head>
        <title>Cyborn</title>
        <meta name="description" content="Cyborn Blockchain" />
        <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
      </Head>
      <div className="bg-background flex h-full flex-col md:flex-row">
        <div className="p-10 flex-1 flex flex-col justify-center md:p-20">
          <div className="flex flex-col items-center md:items-start">
              <h1 className="text-white text-7xl text-extrabold"> Start Your NFT Auction </h1>
              <input
                placeholder="Asset Name"
                className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}

              />
                <br />
              <textarea
                placeholder="Asset Description"
                className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}

              />
                <br />
                <input
                  placeholder="Star Bid Price in ETH"
                  className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}

                />
                <br />
              <label htmlFor="protocol" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select your protocol</label>
              <select id="protocol" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>Ethereum</option>
              </select>
              <br />
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Upload file</label>
                <input name="Asset" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={onChange} type="file" />
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">Your Uploaded will be shown below*</div>
                <br />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Auction End Time</label>

                <input datepicker type="time" onChange={e => updateFormInput({ ...formInput, time: e.target.value })} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select Auction Start date" />
                <br />
              <button onClick={createMarket} className="block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring">
                Start Auction
              </button>

          </div>
        </div>
        <div className="flex-1 shrink-0">
          <div className="flex-1 shrink-0 h-full w-full object-cover md:h-full">


          {
            fileUrl && (
              <div>
              <img className="rounded mt-4" width="500" height="500" src={fileUrl} />
              <video autoPlay loop className="rounded mt-4" width="500" height="500">
                <source src={fileUrl} />
              </video>
              </div>
            )
          }
          </div>
        </div>
      </div>
    </div>
    <CybornFooter />
    </div>
  )
}

export default Auction;
