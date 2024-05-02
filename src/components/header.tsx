"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { LoginButton } from "~/components/auth/login-button";
import { UserMenu } from "~/components/auth/user-menu";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCurrentUser } from "~/hooks/use-current-user";

export const Header = () => {
  const { user } = useCurrentUser();

  return (
    <header className="fixed inset-y-0 z-[10] flex h-[80px] w-full items-center justify-between border-b border-border bg-background px-6">
      <Button className="md:hidden" variant="ghost" size="icon">
        <MenuIcon className="h-6 w-6" />
      </Button>
      <Link className="mb-0.5 md:mb-1.5 md:mr-auto" href="/">
        <Logo />
      </Link>
      <form className="mr-auto hidden w-full max-w-[280px] md:flex lg:max-w-[500px]">
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
      <div className="flex items-center justify-end gap-2">
        {user ? (
          <UserMenu
            fullName={user.name}
            email={user.email}
            avatarImage={user.image}
            role={user.role}
          />
        ) : (
          <>
            <LoginButton type="redirect">Sign in</LoginButton>
          </>
        )}
      </div>
    </header>
  );
};
