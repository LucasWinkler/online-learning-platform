type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="h-full xxs:flex xxs:flex-col xxs:items-center xxs:justify-center xxs:px-6">
      {children}
    </section>
  );
};

export default AuthLayout;
