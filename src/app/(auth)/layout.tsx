import Link from "next/link";

import { Logo } from "~/components/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <header className="flex w-full items-center justify-center bg-background p-2 xs:border-b xs:border-border">
        <Link href="/">
          <Logo type="full" />
        </Link>
      </header>
      <section className="flex h-full min-h-screen flex-col items-center bg-background xxs:px-3 xs:bg-inherit xs:px-6 xs:pt-6">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
