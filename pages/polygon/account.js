import { ethers } from 'ethers'
import { useEffect, useState } from "react"
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import Head from "next/head";
import Image from 'next/image'
import PolygonHeader from "/components/PolygonHeader"
import CybornFooter from "/components/CybornFooter"
import { supabase } from '/client'
import { useRouter } from 'next/router'
import { CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI} from '/polygon'



export default function Account() {
  const [nfts, setNfts] = useState([])
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
      router.push('/polygon/signin')
    } else {
      setProfile(profileData)
    }
  }
  async function signOut() {
    await supabase.auth.signOut()
    router.push('/polygon/signin')
  }
  if (!profile) return null

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, signer)
    const tokenContract = new ethers.Contract(CYBORN_NFT_ADDRESS, CYBORN_NFT_ABI, provider)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  if (loadingState === 'loaded' && !nfts.length) return (<div className="bg-background "><Head>
    <title>Cyborn</title>
    <meta name="description" content="Cyborn Blockchain" />
    <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
  </Head><PolygonHeader /><hr /><br /><br /><br /><br /><p className="text-white text-center text-6xl">No NFTs Owned By You</p><br /><br /><br /><br /><hr /><CybornFooter /></div>)
  return (
    <div>
    <Head>
      <title>Cyborn</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <PolygonHeader />
    <div className="flex justify-center bg-background">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white bg-gradient-to-l from-indigo-500 to-bg-purple-400">Price - {nft.price} Matic</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <CybornFooter />
    </div>
  )
}
