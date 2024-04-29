import type { Metadata } from "next";

import { SearchIcon } from "lucide-react";

import { Link } from "~/components/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth, signOut } from "~/server/auth";

export const metadata: Metadata = {
  title: "Overview",
};

const HomePage = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <section className="space-y-4">
      <form className="mr-auto flex w-full max-w-[280px] md:hidden">
        <Input
          className="w-full rounded-none rounded-l-md border-r-0 bg-background"
          placeholder="Search courses..."
        />
        <Button
          className="rounded-none rounded-r-md p-4"
          variant="default"
          size="icon"
        >
          <SearchIcon className="h-5 w-5 shrink-0" />
        </Button>
      </form>
      {isLoggedIn ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">sign out</button>
        </form>
      ) : (
        <>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Register</Link>
        </>
      )}
    </section>
  );
};

export default HomePage;
