import type { Metadata } from "next";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import "~/styles/globals.css";

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
      <body className="min-h-screen bg-background leading-relaxed text-foreground antialiased">
        <UserProvider>{children}</UserProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
