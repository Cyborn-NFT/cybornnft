import React from "react";
import Link from "next/link";
import web3Modal from "web3modal";
import {providers, Contract} from "ethers";
import {useEffect, useRef, useState} from "react";
import { BiWalletAlt } from "react-icons/bi";
import Web3Modal from "web3modal";



function CybornHeader(){
    const [active, setActive] = useState(false);

    const handleClick = () => {
      setActive(!active);
    };

  const[walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const web3ModalRef = useRef();

  const getProviderOrSigner = async(needSigner = false) =>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const addr = await signer.getAddress();
    setUserAddress(addr.toString());

    const {chainId} = await web3Provider.getNetwork();
    if(chainId !== 4){
      window.alert("Change Network To Polygon Main Network");
      throw new Error("Change Network to Polygon Main Network");
    }

    if(needSigner){
      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      setUserAddress(addr.toString());
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async() =>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "matic",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
    }, [walletConnected]);

    const renderButton = () => {
      if (!walletConnected) {
        return (
          <button
            onClick={connectWallet}
            className="w-72 h-16 text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 flex items-center p-4"
          >
            <BiWalletAlt className="mr-2" />
            Connect your wallet
          </button>
        );
      }
    }

  return(
    <nav className='flex items-center p-3 flex-wrap bg-black'>

       <Link href='/'>
         <a className='inline-flex items-center p-1 mr-4 '>
          <img src="/ark.png" width={250} height={250} className="rounded" />
         </a>
       </Link>
       <button
         className=' inline-flex p-3 hover:bg-background rounded lg:hidden text-white ml-auto hover:text-white outline-none'
         onClick={handleClick}
       >
         <svg
           className='w-6 h-6'
           fill='none'
           stroke='currentColor'
           viewBox='0 0 24 24'
           xmlns='http://www.w3.org/2000/svg'
         >
           <path
             strokeLinecap='round'
             strokeLinejoin='round'
             strokeWidth={2}
             d='M4 6h16M4 12h16M4 18h16'
           />
         </svg>
       </button>
       <div
         className={`${
           active ? '' : 'hidden'
         }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
       >
         <div className="lg:text-base lg:inline-flex md:space-x-0 md:mt-0 md:text-sm lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto">
           <Link href="/">
             <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white ">
               Explore NFT
             </a>
           </Link>
           <Link href="/create">
             <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white">
               List NFT
             </a>
           </Link>
           <Link href="/inventory">
             <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white">
               Inventory
             </a>
           </Link>
           <Link href="/account">
             <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white">
               Account
             </a>
           </Link>
            <p>
             <p className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:text-white">
               Account: {userAddress}
             </p>
           </p>
         </div>
         <button type="button" onClick={connectWallet} className="text-white bg-blue-400 font-medium rounded-lg text-sm px-2 py-2 mt-0 text-center inline-flex items-center">
           <img width={18} height={18} src="/metamask.svg" /> &nbsp; Connect with MetaMask
         </button>
       </div>
     </nav>
  )
}

export default CybornHeader;
