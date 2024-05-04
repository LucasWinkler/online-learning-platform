import { DashboardHeader } from "./_components/navigation/dashboard-header";
import { DashboardSidebar } from "./_components/navigation/dashboard-sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <DashboardSidebar />
      <DashboardHeader />
      <main className="mt-[calc(var(--header-height)_+_1rem)] px-[1rem] md:ml-[15rem] lg:ml-[17.5rem] lg:mt-[calc(var(--header-height)_+_1.5rem)] lg:px-[1.5rem]">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
