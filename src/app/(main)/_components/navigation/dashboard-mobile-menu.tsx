import { MenuIcon } from "lucide-react";

import { LogoLink } from "~/components/logo-link";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";
import auth from "~/lib/auth";

import { DashboardSidebarActions } from "./dashboard-sidebar-actions";
import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

export const DashboardMobileMenu = async () => {
  const session = await auth();
  const user = session?.user;

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
          <DashboardSidebarLinks user={user} withSheetClose />
        </nav>
        <div className="mt-auto border-t border-border p-4 lg:p-6">
          <DashboardSidebarActions user={user} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
