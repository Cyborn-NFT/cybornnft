import '../styles/globals.css'
import nProgress from "nprogress";
import { useEffect } from "react";
import Router from "next/router";
import "../styles/progress.css"

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);


function MyApp({ Component, pageProps }) {
  return(
    <Component {...pageProps} />
   )
}

export default MyApp
