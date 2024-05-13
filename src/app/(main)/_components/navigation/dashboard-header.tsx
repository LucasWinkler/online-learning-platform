import { DashboardHeaderItems } from "./dashboard-header-items";
import { DashboardMobileMenu } from "./dashboard-mobile-menu";

export const DashboardHeader = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-[10] h-header-height border-b border-border bg-background md:left-[15rem] lg:left-[17.5rem]">
      <div className="flex h-full w-full items-center justify-between gap-2 px-4 lg:px-6">
        <DashboardMobileMenu />
        <DashboardHeaderItems />
      </div>
    </header>
  );
};
