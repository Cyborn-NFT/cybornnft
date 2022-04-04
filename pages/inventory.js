import { ethers } from 'ethers'
import { useEffect, useState } from "react"
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import Image from 'next/image'
import CybornHeader from "/components/CybornHeader"
import CybornFooter from "/components/CybornFooter"
import Head from "next/head";
import { supabase } from '../client'
import { useRouter } from 'next/router'
import { CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI, AUCTION_NFT_ABI, AUCTION_NFT_ADDRESS} from '/constants'
import React from "react";
import { TelegramShareButton, TelegramIcon } from "next-share";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { FaTelegramPlane, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { WhatsappShareButton, WhatsappButton} from "next-share";


export default function Inventory() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [showTransferModal, setShowTransferModal] = React.useState(false);

  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  const router = useRouter()
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

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, signer)
    const tokenContract = new ethers.Contract(CYBORN_NFT_ADDRESS, CYBORN_NFT_ABI, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')
  }
  if (loadingState === 'loaded' && !nfts.length) return (<div className="bg-background "><Head>
    <title>Cyborn Web3</title>
    <meta name="description" content="Cyborn Blockchain" />
    <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
  </Head><CybornHeader /><hr /><br /><br /><br /><br /><p className="text-white text-center text-6xl">No NFTs Created By You</p><br /><br /><br /><br /><hr /><CybornFooter /></div>)
  return (
    <div>
    <Head>
      <title>Cyborn</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <CybornHeader />
    <hr />
      <div className="p-4 bg-background">
        <h2 className="text-6xl text-white py-2">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                <p style={{ height: '40px' }} className="text-sm text-white font-semibold">Seller: {nft.seller}</p>
                <br />
                <p style={{ height: '40px' }} className="text-sm text-white font-light">Owner: {nft.owner}</p>
                <br />
                <p style={{ height: '40px' }} className="text-white font-light">Sold: {nft.sold}</p>
                </div>
                <div className="p-4 bg-blue-400">
                  <p className="text-xl font-medium text-black">Price - {nft.price} ETH</p>
                </div>
                <br />
                <div className="grid grid-cols-3 gap-2 items-center ">
                  <div className="bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group ">
                    <div className="">
                      <TelegramShareButton
                         url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                         title={"Here's my NFT Link"}
                      >
                      <FaTelegramPlane className="w-6 h-6 m-4 text-white hover:text-black"></FaTelegramPlane>

                      </TelegramShareButton>
                    </div>
                  </div>

                  <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                    <div className="">
                      <TwitterShareButton
                        url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                        title={"Here's my NFT Link"}
                        >
                          <FaTwitter className="w-6 h-6 m-4 text-white hover:text-black"></FaTwitter>

                      </TwitterShareButton>
                    </div>
                  </div>

                  <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                    <div className="">
                    <WhatsappShareButton
                      url={'https://github.com/next-share'}
                      title={'next-share is a social share buttons for your next React apps.'}
                    >
                    <FaWhatsapp className="w-6 h-6 m-4 text-white hover:text-black"></FaWhatsapp>
                    </WhatsappShareButton>
                    </div>
                  </div>
                </div>
                <div className="lg:grid grid-cols-2 gap-4">
                  <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={() => setShowModal(true)}>Auction</button>
                  <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={() => setShowTransferModal(true)}>Transfer</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
        <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-2xl py-2">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p style={{ height: '40px' }} className="text-sm text-white font-semibold">Seller: {nft.seller}</p>
                        <br />
                        <p style={{ height: '40px' }} className="text-sm text-white font-light">Owner: {nft.owner}</p>
                        <br />
                        <p style={{ height: '40px' }} className="text-white font-light">Sold: Yes</p>
                      </div>
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-light text-white">Price - {nft.price} ETH</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center ">
                        <div className="bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group ">
                          <div className="">
                            <TelegramShareButton
                               url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                               title={"Here's my NFT that I have bought from Cyborn NFT Marketplace"}
                            >
                            <FaTelegramPlane className="w-6 h-6 m-4 text-white hover:text-black"></FaTelegramPlane>

                            </TelegramShareButton>
                          </div>
                        </div>

                        <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                          <div className="">
                            <TwitterShareButton
                              url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                              title={"Here's my NFT that I have bought from Cyborn NFT Marketplace"}
                              >
                                <FaTwitter className="w-6 h-6 m-4 text-white hover:text-black"></FaTwitter>

                            </TwitterShareButton>
                          </div>
                        </div>

                        <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                          <div className="">
                          <WhatsappShareButton
                            url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                            title={"Here's my NFT that I have bought from Cyborn NFT Marketplace"}
                          >
                          <FaWhatsapp className="w-6 h-6 m-4 text-white hover:text-black"></FaWhatsapp>
                          </WhatsappShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        <br />
        <br />
        </div>
        <div>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cybornheader outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold text-white">
                      Start Auction
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-black text-white h-6 w-6 text-3xl block">
                        ×
                      </span>
                    </button>
                  </div>

                  <div className="relative p-6 flex-auto">
                    <input
                      placeholder="Auction Asset Name"
                      className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                      <br />
                    <textarea
                      placeholder="Start Auction Price"
                      className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                      <br />
                    <input
                      placeholder="End Auction Price"
                      className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <br />
                    <div class="relative">
                      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                      </div>
                      <input datepicker type="date" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select Auction Start date" />
                    </div>
                    <br />
                    <div class="relative">
                      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                      </div>
                      <input datepicker type="date" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select Auction End date" />
                    </div>
                    <br />
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Upload file</label>
                      <input name="Asset" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="file" />
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">Your Uploaded will be shown below*</div>
                      <br />
                    <button className="block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring">
                      Create NFT
                    </button>
                  </div>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {showTransferModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cybornheader outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold text-white">
                      Transfer NFT
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowTransferModal(false)}
                    >
                      <span className="bg-black text-white h-6 w-6 text-3xl block">
                        ×
                      </span>
                    </button>
                  </div>

                  <div className="relative p-6 flex-auto">
                    <input
                      placeholder="Enter Receiver Wallet Address"
                      className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <br />
                    <button className="block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring">
                      Transfer
                    </button>
                  </div>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowTransferModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowTransferModal(false)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        </div>
        <CybornFooter />
    </div>
  )
}
