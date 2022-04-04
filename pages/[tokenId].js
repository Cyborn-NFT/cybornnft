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

export default function tokenId(){

  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [showTransferModal, setShowTransferModal] = React.useState(false);

  const [loadingState, setLoadingState] = useState('not-loaded')
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

  return(
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
          <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
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
                <div className="lg:grid grid-cols-1 gap-4">
                  <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )

}
