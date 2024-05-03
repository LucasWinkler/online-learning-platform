"use client";

import { useSession } from "next-auth/react";

import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";
import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { Skeleton } from "~/components/ui/skeleton";

import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

export const DashboardSidebar = () => {
  const { status } = useSession();

  return (
    <aside className="fixed left-0 top-0 z-[15] hidden h-full max-w-[13.75rem] flex-col border-r border-border bg-background md:flex md:w-full md:max-w-[15rem] lg:max-w-[17.5rem]">
      <div className="flex h-header-height shrink-0 items-center justify-start border-b border-border px-4 lg:px-6">
        <Link className="" href="/">
          <Logo type="short" />
        </Link>
      </div>
      <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
        <DashboardSidebarLinks />
      </nav>
      <div className="mt-auto border-t border-border p-4 lg:p-6">
        {status === "loading" ? (
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-10" />
          </div>
        ) : status === "authenticated" ? (
          <LogoutButton className="w-full" variant="secondary">
            Sign out
          </LogoutButton>
        ) : (
          <LoginButton className="w-full">Start learning</LoginButton>
        )}
      </div>
    </aside>
  );
};
