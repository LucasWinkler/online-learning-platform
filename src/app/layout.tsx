import type { Metadata } from "next";

import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "~/components/ui/sonner";
import { authApiRoutePrefix } from "~/routes";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme",
    default: "Acme",
  },
  description: "Online Learning Platform",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await auth();

  return (
    <html
      lang="en"
      className="font-inter supports-[font-variation-settings:normal]:font-interVariable"
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="flex h-full min-h-screen flex-col bg-neutral-50 leading-relaxed text-foreground antialiased">
        <SessionProvider session={session} basePath={authApiRoutePrefix}>
          <NextTopLoader />
          {children}
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
