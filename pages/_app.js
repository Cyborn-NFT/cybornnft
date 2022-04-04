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
      <div>
      <Component {...pageProps} />
     </div>
   )
}

export default MyApp
