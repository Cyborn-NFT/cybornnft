import '../styles/globals.css';
import nProgress from 'nprogress';
import { useEffect } from 'react';
import Router from 'next/router';
import '../styles/progress.css';
import Layout from './layout';
import { Provider } from 'react-redux';
import store from './../store';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
