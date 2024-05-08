import type { Metadata } from "next";

import "~/styles/globals.css";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "~/components/ui/sonner";

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

const RootLayout = ({ children }: RootLayoutProps) => {
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
      <body className="flex h-full min-h-screen flex-col bg-gray-50 leading-relaxed text-foreground antialiased">
        <NextTopLoader showSpinner={false} />
        {children}
        <Toaster closeButton pauseWhenPageIsHidden richColors />
      </body>
    </html>
  );
};

export default RootLayout;
