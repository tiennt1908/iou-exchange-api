import "../assets/css/bootstrap.min.css";
import "../assets/css/icons.min.css";
import "../assets/css/app.min.css";
import "../assets/css/custom.min.css";

import type { AppProps } from "next/app";
import Layout from "../layouts/layout";
import { Provider, useDispatch } from "react-redux";
import { RootState, store } from "../store";
import { useEffect } from "react";
import { actAsyncGetChains } from "../store/chainSlice";

function MyApp({ Component, pageProps }: AppProps) {
  //save data on db php
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
