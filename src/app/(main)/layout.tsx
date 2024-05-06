import { DashboardHeader } from "./_components/navigation/dashboard-header";
import { DashboardSidebar } from "./_components/navigation/dashboard-sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:right-0 focus:top-0 focus:z-[20] focus:w-full focus:bg-primary focus:px-3 focus:py-1 focus:text-center focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <DashboardSidebar />
      <DashboardHeader />
      <main
        id="main"
        className="mt-[calc(var(--header-height)_+_1rem)] px-[1rem] md:ml-[15rem] lg:ml-[17.5rem] lg:mt-[calc(var(--header-height)_+_1.5rem)] lg:px-[1.5rem]"
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
