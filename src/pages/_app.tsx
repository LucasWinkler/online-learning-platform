import { UserProvider } from "@auth0/nextjs-auth0/client";
import { type AppType } from "next/app";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Online Learning Platform</title>
        <meta name="description" content="Online Learning Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
};

export default MyApp;
