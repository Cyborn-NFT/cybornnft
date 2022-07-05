import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../client";
import { useRouter } from "next/router";
import Head from "next/head";
import CybornFooter from "/components/CybornFooter";
import {
    CYBORN_NFT_ADDRESS,
    CYBORN_MARKET_ADDRESS,
    CYBORN_MARKET_ABI,
    CYBORN_NFT_ABI,
} from "/constants";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import { ethers } from "ethers";
import { createClient } from "urql";

const getApiDetails = async() => {
    try {
        const result = await axios.post(
            "https://api.studio.thegraph.com/query/24428/cybornnft-rinkeby/v0.0.1", {
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
  }`,
            }
        );
        console.log("this", result, result.data);
        return result;
    } catch (error) {
        console.error(error);
    }
};

function Home() {
    const [results, setResults] = useState([]);
    useEffect(() => {
        const respone = async() => {
            const { data } = await getApiDetails();
            console.log("Total data", data);
            setResults(data.data.marketItemCreateds);
        };
        if (results) {
            respone();
        }
    }, []);

    const router = useRouter();

    function handleChange(value) {
        router.push(`${value}`);
    }

    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    useEffect(() => {
        loadNFTs();
    }, []);
    async function loadNFTs() {
        const provider = new ethers.providers.JsonRpcProvider(
            "https://rinkeby.infura.io/v3/1c632cde3b864975a1d2f123cf5b7ec9"
        );
        const tokenContract = new ethers.Contract(
            CYBORN_NFT_ADDRESS,
            CYBORN_NFT_ABI,
            provider
        );
        const marketContract = new ethers.Contract(
            CYBORN_MARKET_ADDRESS,
            CYBORN_MARKET_ABI,
            provider
        );
        const data = await marketContract.fetchMarketItems();

        const items = await Promise.all(
            data.map(async(i) => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);
                let price = ethers.utils.formatUnits(i.price.toString(), "ether");
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                };
                return item;
            })
        );
        setNfts(items);
        setLoadingState("loaded");
    }

    const [authenticatedState, setAuthenticatedState] =
    useState("not-authenticated");
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                handleAuthChange(event, session);
                if (event === "SIGNED_IN") {
                    setAuthenticatedState("authenticated");
                    router.push("/marketplace");
                }
                if (event === "SIGNED_OUT") {
                    setAuthenticatedState("not-authenticated");
                }
            }
        );
        checkUser();
        return () => {
            authListener.unsubscribe();
        };
    }, []);
    async function checkUser() {
        const user = await supabase.auth.user();
        if (user) {
            setAuthenticatedState("authenticated");
        }
    }
    async function handleAuthChange(event, session) {
        await fetch("/api/auth", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ event, session }),
        });
    }

    async function buyNft(nft) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CYBORN_MARKET_ADDRESS,
            CYBORN_MARKET_ABI,
            signer
        );
        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        const transaction = await contract.createMarketSale(
            CYBORN_NFT_ADDRESS,
            nft.tokenId, {
                value: price,
            }
        );
        await transaction.wait();
        loadNFTs();
    }

    const [email, setEmail] = useState("");
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
        return ( <
            div >
            <
            Head >
            <
            title > Cyborn < /title> <
            meta name = "description"
            content = "Cyborn Blockchain" / >
            <
            link rel = "apple-touch-icon"
            sizes = "180x180"
            href = "/ark.png" / >
            <
            link rel = "icon"
            type = "image/png"
            sizes = "32x32"
            href = "/ark.png" / >
            <
            link rel = "icon"
            type = "image/png"
            sizes = "16x16"
            href = "/ark.png" / >
            <
            /Head> <
            div className = "section home-hero flex h-screen items-center" >
            <
            div className = "home-hero-content container-default mx-auto" >
            <
            h1 className = "title home-hero gradient-text" >
            Create and collect your favourite NFTs <
            /h1> <
            p className = "paragraph home-hero mt-4" >
            Cyborn is the NFT community
            for creators and collectors of unique Asian digital content <
            /p> <
            div className = "button-wrapper flex spac-x-2 justify-center mt-8" >
            <
            a href = "/"
            className = "button button-gradient button-lg mx-4" >
            Explore <
            /a> <
            a href = "/register"
            className = "button button-primary button-lg mx-4" >
            Create <
            /a> <
            /div> <
            /div> <
            /div> <
            hr / >
            <
            div className = "flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28" >
            <
            div className = "w-full lg:w-1/2" >
            <
            img className = "hidden rounded-lg lg:block"
            src = "/mail.gif" / >
            <
            img className = "hidden rounded-lg md:block lg:hidden"
            src = "/mail.gif" /
            >
            <
            img className = "md:hidden rounded-lg"
            src = "/mail.gif" / >
            <
            /div> <
            div className = "w-full lg:w-1/2" >
            <
            h1 className = "py-4 text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white" >
            Looks like you & apos; ve found the doorway to our NFT Market <
            /h1> <
            p className = "py-4 text-base text-gray-800 dark:text-white" >
            Please Check Your Email For Access <
            /p> <
            button className = "w-full lg:w-auto my-4 rounded-md px-1 sm:px-16 py-5 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
            onClick = {
                () => router.push("/signin") } >
            Go back to Homepage <
            /button> <
            /div> <
            /div> <
            hr / >
            <
            /div>
        );
    }
    return ( <
        div >
        <
        Head >
        <
        title > Cyborn < /title> <
        meta name = "description"
        content = "Cyborn Blockchain" / >
        <
        link rel = "apple-touch-icon"
        sizes = "180x180"
        href = "/ark.png" / >
        <
        link rel = "icon"
        type = "image/png"
        sizes = "32x32"
        href = "/ark.png" / >
        <
        link rel = "icon"
        type = "image/png"
        sizes = "16x16"
        href = "/ark.png" / >
        <
        /Head> <
        div className = "section home-hero flex h-screen items-center" >
        <
        div className = "home-hero-content container-default mx-auto" >
        <
        h1 className = "title home-hero gradient-text" >
        Create and collect your favourite NFTs <
        /h1> <
        p className = "paragraph home-hero mt-4" >
        Cyborn is the NFT community
        for creators and collectors of unique Asian digital content <
        /p> <
        div className = "button-wrapper flex spac-x-2 justify-center mt-8" >
        <
        a href = "/marketplace"
        className = "button button-gradient button-lg mx-4" >
        Explore <
        /a> <
        a href = "/register"
        className = "button button-primary button-lg mx-4" >
        Create <
        /a> <
        /div> <
        /div> <
        /div> <
        section className = "relative" >
        <
        div className = "container-default mx-auto" >
        <
        div className = "hidden sm:block sm:inset-0 sm:absolute" > < /div> <
        /div> <
        /section> <
        div className = "section home-explore flex items-center" >
        <
        div className = "home-explore-content container-default mx-auto" >
        <
        h2 className = "title home-explore text-center my-10 text-3xl sm:text-5xl gradient-text" >
        Featured Collections <
        /h2>

        <
        div id = "items"
        className = "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 lg:p-16" >
        {
            nfts.map((nft, i) => ( <
                div key = { i }
                className = "card overflow-hidden" >
                <
                div className = "card-image-wrapper px-4 pt-6 pb-1" >
                <
                Link href = { `https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}` } >
                <
                a >
                <
                img src = { nft.image }
                alt = { nft.name }
                title = { nft.name }
                /> <
                /a> <
                /Link> <
                /div> <
                div className = "px-4 card-content" >
                <
                div className = "grid grid-cols-2" >
                <
                div className = "card-title" >
                <
                Link href = { `https://cybornnft.vercel.app/${nft.seller}/${nft.tokenId}` } >
                <
                a >
                <
                p className = "font-bold" > { nft.name } < /p> <
                /a> <
                /Link> <
                p className = "font-light text-xs" > { nft.description } < /p> <
                /div> <
                div className = "card-share text-right" >
                <
                button className = "button button-link text-white p-0" >
                <
                svg viewBox = "0 0 14 4"
                fill = "none"
                width = "16"
                height = "16"
                xlmns = "http://www.w3.org/2000/svg"
                className = "inline-block" >
                <
                path fillRule = "evenodd"
                clipRule = "evenodd"
                d = "M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM8.5 2C8.5 2.82843 7.82843 3.5 7 3.5C6.17157 3.5 5.5 2.82843 5.5 2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2ZM11.999 3.5C12.8274 3.5 13.499 2.82843 13.499 2C13.499 1.17157 12.8274 0.5 11.999 0.5C11.1706 0.5 10.499 1.17157 10.499 2C10.499 2.82843 11.1706 3.5 11.999 3.5Z"
                fill = "currentColor" >
                < /path> <
                /svg> <
                /button> <
                /div> <
                /div> <
                div className = "grid grid-flow-col auto-cols-max card-profile my-2" >
                <
                div className = "card-profile-image mr-3" >
                <
                img className = "rounded-full"
                src = "./avatar.png" / >
                <
                /div> <
                div className = "card-profile-desc" >
                <
                p className = "font-bold" > Created by < /p> <
                p > Creator Name < /p> <
                /div> <
                /div> <
                div className = "grid grid-cols-2 mb-3 card-price" >
                <
                div className = "font-bold" >
                <
                p > Price < /p> <
                /div> <
                div className = "text-right font-light" >
                <
                img src = "/ethereum.svg"
                alt = "ETH"
                title = "ETH"
                className = "eth-logo inline-block" /
                > { " " } { nft.price }
                ETH <
                /div> <
                /div> <
                /div> <
                div className = "card-link" >
                <
                button className = "button-card py-2"
                onClick = {
                    () => buyNft(nft) } >
                Buy Now <
                /button> <
                /div> <
                /div>
            ))
        } <
        /div> <
        /div> <
        /div>

        <
        div className = "section home-explore flex-items-center" >
        <
        div className = "home-explore-content container-default mx-auto" >
        <
        h2 className = "title text-center my-20 text-5xl sm-text-3xl gradient-text" >
        Explore NFT <
        /h2> <
        div className = "grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4" >
        <
        div className = "card over-flow-hidden text-center p-10" >
        <
        img src = "./collections-icon.svg"
        className = "mx-auto my-5" / >
        <
        h2 className = "my-5" > Collections < /h2> <
        p className = "font-light mb-8" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lectus nulla amet egestas donec lacus augue luctus. <
        /p> <
        button className = "button button-primary" >
        View Collections <
        /button> <
        /div> <
        div className = "card over-flow-hidden text-center p-10" >
        <
        img src = "./all-works-icon.svg"
        className = "mx-auto my-5" / >
        <
        h2 className = "my-5" > All Works < /h2> <
        p className = "font-light mb-8" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lectus nulla amet egestas donec lacus augue luctus. <
        /p> <
        button className = "button button-primary" >
        View Collections <
        /button> <
        /div> <
        div className = "card over-flow-hidden text-center p-10" >
        <
        img src = "./creators-icon.svg"
        className = "mx-auto my-5" / >
        <
        h2 className = "my-5" > Creators < /h2> <
        p className = "font-light mb-8" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lectus nulla amet egestas donec lacus augue luctus. <
        /p> <
        button className = "button button-primary" >
        View Collections <
        /button> <
        /div> <
        /div> <
        /div> <
        /div> <
        /div>
    );
}

export default Home;