import React from "react";
import Link from "next/link";
import web3Modal from "web3modal";
import {providers, Contract} from "ethers";
import {useEffect, useRef, useState} from "react";
import { BiWalletAlt } from "react-icons/bi";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { supabase } from '../client'

function CybornHeader(){
    const [active, setActive] = useState(false);

    const handleClick = () => {
      setActive(!active);
    };

    const router = useRouter()
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
           <Link href="/home">
             <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white ">
               Go To NFT Market
             </a>
           </Link>
           {
             authenticatedState === 'not-authenticated' && (
               <Link className="lg:text-base lg:inline-flex md:space-x-0 md:mt-0 md:text-sm lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto" href="/register">
                 <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white items-center justify-center hover:bg-background hover:text-white">Register</a>
               </Link>
             )
           }
         </div>
       </div>
     </nav>
  )
}

export default CybornHeader;
