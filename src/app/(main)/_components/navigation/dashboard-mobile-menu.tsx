import type { User } from "next-auth";

import { MenuIcon, PowerIcon } from "lucide-react";

import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";
import { LogoLink } from "~/components/logo-link";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";

import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

type DashboardMobileMenuProps = {
  user?: User;
};

export const DashboardMobileMenu = ({ user }: DashboardMobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="shrink-0 md:hidden" variant="outline" size="icon">
          <span className="sr-only">Toggle navigation menu</span>
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col bg-background p-3 xxs:p-6"
        side="left"
      >
        <div className="flex h-header-height shrink-0 items-center justify-start border-b border-border px-4 lg:px-6">
          <SheetClose asChild>
            <LogoLink logoType="short" />
          </SheetClose>
        </div>
        <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
          <DashboardSidebarLinks withSheetClose />
        </nav>
        <div className="mt-auto border-t border-border p-4 lg:p-6">
          {user ? (
            <LogoutButton
              className="flex w-full items-center gap-2"
              variant="secondary"
            >
              <PowerIcon className="size-4 shrink-0" />
              Sign out
            </LogoutButton>
          ) : (
            <LoginButton className="w-full">Start Learning</LoginButton>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
