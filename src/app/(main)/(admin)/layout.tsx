type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <section className="mx-auto h-full w-full max-w-5xl">{children}</section>
  );
};

export default AdminLayout;
