import { PowerIcon } from "lucide-react";

import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";
import { LogoLink } from "~/components/logo-link";
import { currentUser } from "~/lib/auth";

import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

export const DashboardSidebar = async () => {
  const user = await currentUser();

  return (
    <aside className="fixed left-0 top-0 z-[15] hidden h-full max-w-[13.75rem] flex-col border-r border-border bg-background md:flex md:w-full md:max-w-[15rem] lg:max-w-[17.5rem]">
      <div className="flex h-header-height shrink-0 items-center justify-start border-b border-border px-4 lg:px-6">
        <LogoLink logoType="short" />
      </div>
      <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
        <DashboardSidebarLinks />
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
    </aside>
  );
};
