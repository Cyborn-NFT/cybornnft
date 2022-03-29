import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../client'
import { useRouter } from 'next/router'
import Head from "next/head";
import IndexHeader from "/components/IndexHeader"
import CybornFooter from "/components/CybornFooter"


function Home() {
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
      <IndexHeader />
      <hr />
      <div class="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28">
            <div class="w-full lg:w-1/2">
                <img class="hidden rounded-lg lg:block" src="/mail.gif" />
                <img class="hidden rounded-lg md:block lg:hidden" src="/mail.gif" />
                <img class="md:hidden rounded-lg" src="/mail.gif" />
            </div>
            <div class="w-full lg:w-1/2">
                <h1 class="py-4 text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">Looks like you've found the doorway to our NFT Market</h1>
                <p class="py-4 text-base text-gray-800 dark:text-white">Please Check Your Email For Access</p>
                <button class="w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={()=> router.push("/signin")}>Go back to Homepage</button>
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
      <title>Cyborn Web3</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <IndexHeader />
    <hr />
    <section className="relative bg-background">


  <div className="hidden sm:block sm:inset-0 sm:absolute"></div>

  <div className="relative max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
    <div className="max-w-xl text-center sm:text-left">
      <h1 className="text-3xl text-white font-extrabold sm:text-5xl">
        Explore our NFT Market
        <strong className="font-extrabold text-white sm:block">
          Want to list and sell your NFT?
        </strong>
      </h1>

      <p className="max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl">
        Create, Manage, and List your NFT in our market with low gas fee.
      </p>

      <div className="flex flex-wrap gap-4 mt-8 text-center">
        <input placeholder="Enter Your Email" className="mt-2 border rounded p-4 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"

          onChange={e => setEmail(e.target.value)}
          style={{ margin: 10 }}
        />

        <button onClick={() => signIn()} className="block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring">
          SignIn
        </button >


      </div>
    </div>
  </div>
</section>
<CybornFooter />


    </div>
  )
}

const navStyle = {
  margin: 20
}
const linkStyle = {
  marginRight: 10
}

export default Home;
