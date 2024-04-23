import type { Metadata } from "next";

import LoginButton from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
};

const Home = () => {
  return (
    <section className="mx-auto mb-12 max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6">
      <h1 className="my-6 text-base font-bold xs:text-lg md:text-2xl">
        Work in progress
      </h1>
      <LoginButton>
        <Button variant="default" size="lg">
          Login
        </Button>
      </LoginButton>
    </section>
  );
};

export default Home;
