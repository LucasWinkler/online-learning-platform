import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </Head>
      <body className="min-h-screen bg-background leading-relaxed text-foreground antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
