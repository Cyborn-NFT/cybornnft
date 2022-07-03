import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../client';
import CybornFooter from '/components/CybornFooter';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  async function signIn() {
    const { error, data } = await supabase.auth.signIn({
      email,
    });
    if (error) {
      console.log({ error });
    } else {
      setSubmitted(true);
    }
  }
  if (submitted) {
    return (
      <div className={styles.container}>
        <h1>Please check your email to sign in</h1>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Cyborn</title>
        <meta name='description' content='Cyborn Blockchain' />
        <link rel='apple-touch-icon' sizes='180x180' href='/ark.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/ark.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/ark.png' />
      </Head>
      <br />
      <section className='relative'>
        <div className='hidden sm:block sm:inset-0 sm:absolute'></div>

        <div className='relative lg:grid grid-cols-2 gap-4 max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex'>
          <div className='max-w-xl text-center sm:text-left'>
            <h1 className='text-3xl text-headtext font-extrabold sm:text-5xl'>
              Log In
            </h1>

            <p className='max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl'>
              Connect your wallet
            </p>
            <br />
            <div className="lg:grid grid-cols-2 gap-4">
            <button onClick={()=>router.push("/register")} className="bg-white rounded button-lg text-black"> Metamask </button>
            <button onClick={()=>router.push("/register")} className="bg-white rounded button-lg text-black"> Wallet Connect </button>

            </div>
            <div class="relative flex py-5 items-center">
            <div class="flex-grow border-t border-gray-400"></div>
            <span class="flex-shrink mx-4 text-gray-400">or</span>
            <div class="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="lg:grid grid-cols-1 gap-4">
            <button onClick={()=>router.push("/register")} className="bg-white rounded button-lg text-black"> Continue with Twitter </button>
            <button onClick={()=>router.push("/register")} className="bg-white rounded button-lg text-black"> Continue with Facebook </button>

            </div>


          </div>
          <div className='flex flex-wrap gap-4 mt-8 text-left'>
          <p className='text-white text-5xl font-extrabold text-center sm:text-md'>
            Log In With Your Email

          </p>
          <p className='text-white font-light text-xl'>
            Type your password and email below
          </p>
            <br />
              <br />
                <br />

            <div className="lg:grid grid-cols-2 gap-4">
            <p className='max-w-lg mt-4 text-white  sm:leading-relaxed sm:text-xl'>
              Email
            </p>
            <input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} className="form-control block w-48 px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
            </div>
            <div className="lg:grid lg:grid-cols-2 gap-4">
            <p className='max-w-lg mt-4 text-white sm:leading-relaxed sm:text-xl'>
              Password
            </p>
            <input placeholder='Enter Your Password' className="form-control block w-48 px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

            <div>
            <br />
            <button onClick={()=>router.push("/register")} className="button button-primary button-md flex justify-end"> Log-In </button>
            </div>

            </div>
            <p className="font-extralight mt-4 text-white sm:leading-relaxed sm:text-xl">
              New here? <a className="underline" href="/register">Create an account</a>
            </p>
            <br />
          </div>

        </div>
      </section>
    </div>
  );
}
