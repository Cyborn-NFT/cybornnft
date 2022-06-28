import React from "react";
import Link from "next/link";
import web3Modal from "web3modal";
import {providers, Contract} from "ethers";
import {useEffect, useRef, useState} from "react";
import { BiWalletAlt } from "react-icons/bi";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { supabase } from '../client'


function IndexHeader(){
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
    <nav className="navbar flex items-center py-2 px-10 flex-wrap top-0 left-0 right-0 z-5">
      <Link href="/">
        <a className='inline-flex items-center p-1 mr-4 navbar-logo'>
          <img src="/ark.png" title="Cyborn" alt="Cyborn" />
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
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      <div className="nav-item w-2/4">
          <input placeholder="Search" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
      </div>
        <ul className="nav-menu lg:text-base lg:inline-flex md:space-x-0 md:mt-0 md:text-sm lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto">
        <li className="nav-item">
          <Link href="/">
            <a className="nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center">Home</a>
          </Link>
        </li>
          <li className="nav-item">
            <Link href="/marketplace">
              <a className="nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center">Marketplace</a>
            </Link>
            <button onClick={()=>router.push("/create")} className="button button-primary button-md mx-4"> Create </button>
          </li>

          {
            authenticatedState === 'not-authenticated' && (
              <li className="nav-item">
                <Link className="lg:text-base lg:inline-flex md:space-x-0 md:mt-0 md:text-sm lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto" href="/register">
                  <a className="nav-link lg:inline-flex lg:w-auto w-full px-3 py-2 items-center justify-center">Register</a>
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    </nav>
  )
}

export default IndexHeader;
