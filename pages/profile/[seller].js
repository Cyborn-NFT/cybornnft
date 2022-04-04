import { ethers } from 'ethers'
import { useEffect, useState } from "react"
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import Image from 'next/image'
import CybornHeader from "/components/CybornHeader"
import CybornFooter from "/components/CybornFooter"
import Head from "next/head";
import { supabase } from '/client'
import { useRouter } from 'next/router'
import Avatar from "../Avatar"
import { TelegramShareButton, TelegramIcon } from "next-share";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { FaTelegramPlane, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { WhatsappShareButton, WhatsappButton} from "next-share";
import { CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI, AUCTION_NFT_ABI, AUCTION_NFT_ADDRESS} from '/constants'
import React from "react";
export default function Seller() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [userSettingModal, setUserSettingModal] = React.useState(false);
  const [loadingState, setLoadingState] = useState('not-loaded')

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  const [session, setSession] = useState(null)


  useEffect(() => {
    loadNFTs()
  }, [])
  const router = useRouter()

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

  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(CYBORN_NFT_ADDRESS, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
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
      <div className="p-16 bg-background">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                <p style={{ height: '40px' }} className="text-sm text-white font-semibold">Seller: {nft.seller}</p>
                <br />
                </div>
                <div className="p-4 bg-blue-400">
                  <p className="text-xl font-medium text-black">Price - {nft.price} ETH</p>
                </div>
                <br />
                <div className="grid grid-cols-3 gap-2 items-center bg-cybornheader p-8">
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
                <div className="lg:grid grid-cols-1 gap-4">
                  <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
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
                      Start Auction
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



        {userSettingModal ? (
          <>
            <div
              className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cybornheader outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold text-white">
                      User Profile
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setUserSettingModal(false)}
                    >
                      <span className="bg-black text-white h-6 w-6 text-3xl block">
                        ×
                      </span>
                    </button>
                  </div>

                <div className="form-widget">
                  <div>
                  <br />
                    <Avatar
                       url={avatar_url}
                       size={150}
                       onUpload={(url) => {
                         setAvatarUrl(url)
                         updateProfile({ username, website, avatar_url: url })
                       }}
                     />
                  </div>
                  <div>
                  <br />
                    <label className="text-white" htmlFor="email">Email</label>
                    <input id="email" type="text" className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={session.user.email} disabled />
                  </div>
                  <br />
                  <div>
                    <label className="text-white" htmlFor="username">Name</label>
                    <input
                      id="username"
                      type="text"
                      className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      value={username || ''}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                  <br />
                    <label className="text-white" htmlFor="website">Website</label>

                    <input
                      id="website"
                      className="mt-8 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      type="website"
                      value={website || ''}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <button
                      className="button block primary block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring"
                      onClick={() => updateProfile({ username, website, avatar_url })}
                      disabled={loading}
                    >
                      {loading ? 'Loading ...' : 'Update'}
                    </button>
                  </div>
                </div>
                <br />
                  </div>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 bg-blue-500 rounded font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setUserSettingModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        <CybornFooter />
    </div>
  )
}
