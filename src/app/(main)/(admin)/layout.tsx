import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <DashboardBreadcrumb />
      {children}
    </>
  );
};

export default AdminLayout;
