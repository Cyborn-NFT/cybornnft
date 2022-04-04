import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import { useRouter } from "next/router";
import Image from 'next/image'
import CybornHeader from "/components/CybornHeader"
import CybornFooter from "/components/CybornFooter"
import Head from "next/head";
import { supabase } from '../client'
import { CYBORN_NFT_ADDRESS, CYBORN_MARKET_ADDRESS, CYBORN_MARKET_ABI, CYBORN_NFT_ABI} from '/constants'
import { TelegramShareButton, TelegramIcon } from "next-share";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { FaTelegramPlane, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { WhatsappShareButton, WhatsappButton} from "next-share";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";


export default function Home() {
  const router = useRouter();
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

  const MySwal = withReactContent(Swal);
  const open = () => {
    MySwal.fire({
      title: 'You have successfully bought this NFT',
      text: 'Check your inventory & Share it with your audience',
      background:'#04111d',
      icon: 'success',
    });
  };


  const useCopyToClipboard = (text) => {
    const copyToClipboard = (str) => {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      const success = document.execCommand("copy");
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
    const [copied, copy] = useCopyToClipboard("");
    return (
      <div>
        <button
          onClick={copy}
          className="bg-white p-4 flex items-center shadow-glow"
        >
          <div className="mr-2" />
          <span>mint.kleoverse.com/nft</span>
        </button>
        <div className="text-white mt-1">
          {copied && "💡 Link Copied! "}
        </div>
      </div>
    );
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
    open();
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<div><CybornHeader /><h1 className="px-20 py-10 text-3xl">No items in marketplace</h1><CybornFooter /></div>)
  return (
    <div className="bg-background">
    <Head>
      <title>Cyborn</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <CybornHeader />
    <hr />
    <br />
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1200px' }}>
        <div id="items" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4 bg-black">
                  <p style={{ height: '40px' }} className="text-2xl text-white font-semibold">{nft.name}</p>
                  <p style={{ height: '40px' }} className="text-white font-light">{nft.description}</p>
                </div>
                <div className="p-4 bg-cybornheader">
                <p style={{ height: '40px' }} className="text-xs text-white font-light">Seller: {nft.seller}</p>
                <p style={{ height: '40px' }} className="text-xs text-white font-light">Owner: {nft.owner}</p>
                <p style={{ height: '40px' }} className="text-xs text-white font-light">Link: {`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}</p>
                  <div className="grid grid-cols-3 gap-2 items-center ">
                    <div className="bg-blue-300 transition-all rounded-full hover:bg-blue-500  h-14 w-14 group ">
                      <div className="">
                        <TelegramShareButton
                           url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                           title={"Here's my NFT Link, if you are interested you can buy it through this link"}
                        >
                        <FaTelegramPlane className="w-6 h-6 m-4 text-white hover:text-black"></FaTelegramPlane>

                        </TelegramShareButton>
                      </div>
                    </div>

                    <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                      <div className="">
                        <TwitterShareButton
                          url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                          title={"Here's my NFT Link, if you are interested you can buy it through this link"}
                          >
                            <FaTwitter className="w-6 h-6 m-4 text-white hover:text-black"></FaTwitter>

                        </TwitterShareButton>
                      </div>
                    </div>

                    <div className="bg-blue-300 rounded-full transition-all hover:bg-blue-500 h-14 w-14 group  ">
                      <div className="">
                      <WhatsappShareButton
                        url={`https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}`}
                        title={"Here's my NFT Link, if you are interested you can buy it through this link"}
                      >
                      <FaWhatsapp className="w-6 h-6 m-4 text-white hover:text-black"></FaWhatsapp>
                      </WhatsappShareButton>
                      </div>
                    </div>
                  </div>


                  <p className="text-xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="w-full bg-blue-400 text-black font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <br />
    <CybornFooter />
    </div>
  )
}
