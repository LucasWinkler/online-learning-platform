import { UserProvider } from "@auth0/nextjs-auth0/client";

import Footer from "./_components/footer";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </UserProvider>
  );
}
