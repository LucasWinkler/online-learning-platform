import { LogoLink } from "~/components/logo-link";
import auth from "~/lib/auth";

import { DashboardSidebarActions } from "./dashboard-sidebar-actions";
import { DashboardSidebarLinks } from "./dashboard-sidebar-links";

export const DashboardSidebar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <aside className="fixed left-0 top-0 z-[15] hidden h-full max-w-[13.75rem] flex-col border-r border-border bg-background md:flex md:w-full md:max-w-[15rem] lg:max-w-[17.5rem]">
      <div className="flex h-header-height shrink-0 items-center justify-start border-b border-border px-4 lg:px-6">
        <LogoLink logoType="short" user={user} />
      </div>
      <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
        <DashboardSidebarLinks user={user} />
      </nav>
      <div className="mt-auto border-t border-border p-4 lg:p-6">
        <DashboardSidebarActions user={user} />
      </div>
    </aside>
  );
};
