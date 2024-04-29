import type { Metadata } from "next";

import "~/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme",
    default: "Acme",
  },
  description: "Online Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <SessionProvider>
          <NextTopLoader />
          {children}
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
