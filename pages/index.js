import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../client'
import { useRouter } from 'next/router'
import Head from "next/head";
import IndexHeader from "/components/IndexHeader"
import CybornFooter from "/components/CybornFooter"
import { CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI} from '/constants'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import { ethers } from 'ethers';
import { createClient } from "urql";

const getApiDetails = async() =>{
try{
const result = await axios.post(
'https://api.studio.thegraph.com/query/24428/cybornnft-rinkeby/v0.0.1',
{
  query: `
  {
    marketItemCreateds
     {
       id
       itemId
       nftContract
       tokenId
       seller
     },
  }`
})
console.log(result.data)
return result
}catch(error)
{
console.error(error);
}
}



function Home() {

  const [results, setResults] = useState([])
  useEffect(()=>{
  const respone = async() =>{
  const {data} =  await getApiDetails()
  console.log("Total data",data)
  setResults(data.data.marketItemCreateds)
  }
  if(results){
  respone()
  }
  },[])

  const router = useRouter()


 function handleChange(value) {
   router.push(`${value}`);
 }

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/1c632cde3b864975a1d2f123cf5b7ec9")
    const tokenContract = new ethers.Contract(CYBORN_NFT_ADDRESS, CYBORN_NFT_ABI, provider)
    const marketContract = new ethers.Contract(CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, provider)
    const data = await marketContract.fetchMarketItems()


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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }

  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated')
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated')
        router.push('/home')
      }
      if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated')
      }
    })
    checkUser()
    return () => {
      authListener.unsubscribe()
    }
  }, [])
  async function checkUser() {
    const user = await supabase.auth.user()
    if (user) {
      setAuthenticatedState('authenticated')
    }
  }
  async function handleAuthChange(event, session) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  }

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  async function signIn() {
    const { error, data } = await supabase.auth.signIn({
      email
    })
    if (error) {
      console.log({ error })
    } else {
      setSubmitted(true)
    }
  }
  if (submitted) {
    return (
      <div>
      <Head>
        <title>Cyborn</title>
        <meta name="description" content="Cyborn Blockchain" />
        <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
      </Head>
      <IndexHeader />
      <div className="section home-hero flex h-screen items-center">
        <div className="home-hero-content container-default mx-auto">
          <h1 className="title home-hero gradient-text">Create and collect your favourite NFTs</h1>
          <p className="paragraph home-hero mt-4">Cyborn is the NFT community for creators and collectors of unique Asian digital content</p>
          <div className="button-wrapper flex spac-x-2 justify-center mt-8">
            <a href="/home" className="button button-gradient button-lg mx-4">Explore</a>
            <a href="/register" className="button button-primary button-lg mx-4">Create</a>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28">
            <div className="w-full lg:w-1/2">
                <img className="hidden rounded-lg lg:block" src="/mail.gif" />
                <img className="hidden rounded-lg md:block lg:hidden" src="/mail.gif" />
                <img className="md:hidden rounded-lg" src="/mail.gif" />
            </div>
            <div className="w-full lg:w-1/2">
                <h1 className="py-4 text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">Looks like you&apos;ve found the doorway to our NFT Market</h1>
                <p className="py-4 text-base text-gray-800 dark:text-white">Please Check Your Email For Access</p>
                <button className="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={()=> router.push("/signin")}>Go back to Homepage</button>
            </div>
        </div>
        <hr />
        <CybornFooter />
        </div>
    )
  }
  return (
    <div>
    <Head>
      <title>Cyborn</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <IndexHeader />
    <div className="section home-hero flex h-screen items-center">
      <div className="home-hero-content container-default mx-auto">
        <h1 className="title home-hero gradient-text">Create and collect your favourite NFTs</h1>
        <p className="paragraph home-hero mt-4">Cyborn is the NFT community for creators and collectors of unique Asian digital content</p>
        <div className="button-wrapper flex spac-x-2 justify-center mt-8">
          <a href="/home" className="button button-gradient button-lg mx-4">Explore</a>
          <a href="/register" className="button button-primary button-lg mx-4">Create</a>
        </div>
      </div>
    </div>
    <section className="relative">
      <div className="container-default mx-auto">
        <div className="hidden sm:block sm:inset-0 sm:absolute"></div>
        <div className="relative max-w-screen-xl px-8 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
          <div className="max-w-xl text-center sm:text-left">
            <h2 className="title text-3xl text-white sm:text-5xl">
              Explore our NFT Market
              <strong className="title text-3xl sm:text-5xl text-white sm:block">
                Want to list and sell your NFT?
              </strong>
            </h2>
            <p className="max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl">
              Create, Manage, and List your NFT in our market with low gas fee.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 text-center">
              <input placeholder="Enter Your Email" className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={e => setEmail(e.target.value)}
                style={{ margin: 10 }}
              />
              <button onClick={() => signIn()} className="w-full block button button-lg button-gradient">
                Sign In
              </button >
            </div>
          </div>
        </div>
      </div>
    </section>
    <div className="section home-explore flex items-center">
      <div className="home-explore-content container-default mx-auto">
        <h2 className="title home-explore text-center my-10 text-3xl sm:text-5xl">Explore NFTs</h2>
        <div className="lg:grid grid-cols-3 gap-6 my-5">
          <input type="search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="">Search List</option>
            <option value="Buy">Buy</option>
            <option value="Auction">Auction</option>
          </select>
          <select onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="">Search Protocol</option>
            <option value="/">ETH</option>
            <option value="/polygon">Matic</option>
          </select>
        </div>
        <div id="items" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="card-image-wrapper p-4">
                  <img src={nft.image} alt={nft.name} title={nft.name} />
                </div>
                <div className="p-4 card-content">
                  <div className="grid grid-cols-2">
                    <div className="card-title">
                      <p className="nft-name">{nft.name}</p>
                      <p className="nft-description">{nft.description}</p>
                    </div>
                    <div className="nft-price text-right">
                      <span className="text-right">
                        <img src="/ethereum.svg" alt="ETH" title="ETH" className="eth-logo inline-block" /> {nft.price} ETH
                      </span>
                    </div>
                  </div>
                  <button className="w-full button button-primary mt-5" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <div className="section home-explore flex items-center">
      <div className="home-explore-content container-default mx-auto">
        <h2 className="title text-center my-10 text-3xl sm:text-5xl">Featured Collections</h2>
        <div id="items" className="relative max-w-screen-xl mx-auto lg:items-center lg:flex lg:grid grid-cols-4 gap-4">
          {results.map((item, index)=>{
            return(
              <div className="block p-8 max-w-sm rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-cybornheader dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                  <div className="px-2 py-4">
                    <div key={index} className="font-light text-md mb-2">
                      <img className="rounded-full" src="./ark.png" />
                      <p className="text-white text-sm">{item.seller}</p>
                    </div>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <button onClick={()=>router.push(`https://cybornnft.vercel.app/${item.seller}`)} className="w-full button button-primary button-lg">Visit</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    <CybornFooter />
  </div>
  )
}


export default Home;
