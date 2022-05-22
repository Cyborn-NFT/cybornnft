import '../styles/globals.css';
import nProgress from 'nprogress';
import { useEffect } from 'react';
import Router from 'next/router';
import '../styles/progress.css';
import Layout from './layout';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
