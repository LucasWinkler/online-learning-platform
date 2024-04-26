const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="mx-auto mb-12 h-full max-w-7xl px-3 xs:flex xs:flex-col xs:items-center xs:justify-center sm:px-4 md:px-5 lg:px-6">
      {children}
    </section>
  );
};

export default AuthLayout;
