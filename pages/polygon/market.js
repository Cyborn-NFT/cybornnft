import React from "react"
import PolygonHeader from "/components/PolygonHeader"
import CybornFooter from "/components/CybornFooter"
import { useRouter } from "next/router";
import Head from "next/head";
function Market(){
  const router = useRouter();
  return(
    <div>
    <Head>
      <title>Cyborn</title>
      <meta name="description" content="Cyborn Blockchain" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/ark.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ark.png" />
    </Head>
    <PolygonHeader />
    <section className="relative bg-background">
  <img
    className="absolute inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full"
    src="/market.jpg"
  />

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
        <button onClick={()=>router.push("/nft/create")} className="block w-full px-12 py-3 text-sm font-medium text-black rounded shadow bg-blue-400 sm:w-auto active:bg-lime-100 hover:bg-lime-300 focus:outline-none focus:ring">
          Create
        </button >

        <button onClick={()=>router.push("/nft/home")}  className="block w-full px-12 py-3 text-sm font-medium bg-white rounded shadow text-black sm:w-auto focus:outline-none focus:ring">
          Explore & Buy NFTs
        </button >
      </div>
    </div>
  </div>
</section>
<CybornFooter />
</div>
  )
}

export default Market;
