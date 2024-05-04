import { MenuIcon, PowerIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";
import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";

import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

export const DashboardMobileMenu = () => {
  const { status } = useSession();

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
            <Link href="/">
              <Logo type="short" />
            </Link>
          </SheetClose>
        </div>
        <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
          <DashboardSidebarLinks withSheetClose />
        </nav>
        <div className="mt-auto border-t border-border p-4 lg:p-6">
          {status === "loading" ? (
            <div className="flex items-center justify-center">
              <Skeleton className="h-4 w-10" />
            </div>
          ) : status === "authenticated" ? (
            <LogoutButton
              className="flex w-full items-center gap-2"
              variant="secondary"
            >
              <PowerIcon className="size-4 shrink-0" />
              Sign out
            </LogoutButton>
          ) : (
            <LoginButton className="w-full">Start learning</LoginButton>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
