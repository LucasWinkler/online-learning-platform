import { Link } from "~/components/link";
import { Logo } from "~/components/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center bg-background xxs:px-3 xs:bg-inherit xs:px-6">
      <div className="flex w-full items-center justify-center border-b border-border p-2 xs:border-none">
        <Link href="/" className="p-3">
          <Logo />
        </Link>
      </div>
      {children}
    </section>
  );
};

export default AuthLayout;
