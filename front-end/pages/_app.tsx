
import { CartProvider } from "../context/cartContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";


const App = ({ Component, pageProps }: AppProps) => {
  return (
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
  );
}

export default appWithTranslation(App);

