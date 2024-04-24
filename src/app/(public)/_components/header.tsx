"use client";

import { useSession } from "next-auth/react";

import LoginButton from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";

import Navbar from "./navigation/navbar";

const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  return (
    <header className="flex justify-between gap-x-2">
      {/* <MobileNav /> */}
      <Navbar />
      <div className="flex gap-x-2">
        {status === "unauthenticated" && (
          <LoginButton>
            <Button variant="default" size="lg">
              Login
            </Button>
          </LoginButton>
        )}
        {/* <LoginButton>
          <Button variant="default" size="lg">
            Register
          </Button>
        </LoginButton>
        <LoginButton>
          <Button variant="default" size="lg">
            Logout
          </Button>
        </LoginButton> */}
      </div>
    </header>
  );
};

export default Header;
