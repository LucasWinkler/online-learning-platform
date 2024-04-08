import { type AppType } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      {/* <main> */}
      <Component {...pageProps} />
      {/* </main> */}
    </UserProvider>
  );
};

export default MyApp;
