"use client";

import { Role } from "@prisma/client";
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { LoginButton } from "~/components/auth/login-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { logout } from "~/server/actions/logout";

import { Logo } from "./logo";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type UserMenuProps = {
  fullName: string;
  email: string;
  avatarImage?: string;
  role: Role;
};

const UserMenu = ({ fullName, email, role, avatarImage }: UserMenuProps) => {
  const roleText = role === Role.USER ? "Student" : "Instructor";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-1 md:gap-2">
        <Avatar className="size-8">
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="bg-neutral-500 text-neutral-50">
            <UserRoundIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="max-w-[105px] truncate text-sm font-medium">
            {fullName}
          </span>
          <span className="text-xs font-normal text-neutral-500">
            {roleText}
          </span>
        </div>
        <span className="hidden self-center justify-self-end rounded-md p-2 transition-all duration-300 group-hover:bg-neutral-100 md:block">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{fullName}</span>
          <span className="text-xs font-normal text-neutral-500">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/courses">Courses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await logout();
            }}
          >
            <button type="submit">Log out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;

  return (
    <header className="fixed inset-y-0 z-[10] flex h-[80px] w-full items-center justify-between border-b border-border bg-background px-6">
      <Button className="md:hidden" variant="ghost" size="icon">
        <MenuIcon className="h-6 w-6" />
      </Button>
      <Link className="md:mr-auto" href="/">
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
      {status === "loading" ? (
        <>
          <Skeleton className="h-9 w-44" />
        </>
      ) : (
        <div className="flex items-center justify-end gap-2">
          {isAuthenticated ? (
            <UserMenu
              fullName={session.user.name}
              email={session.user.email}
              avatarImage={session.user.image}
              role={session.user.role}
            />
          ) : (
            <>
              <LoginButton type="redirect">Learn</LoginButton>
              {/* <RegisterButton type="redirect">Sign up</RegisterButton> */}
            </>
          )}
        </div>
      )}
    </header>
  );
};
