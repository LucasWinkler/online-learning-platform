import { HomeIcon, MenuIcon } from "lucide-react";

import ActiveLink from "~/components/active-link";
import { LoginButton } from "~/components/auth/login-button";
import { UserMenu } from "~/components/auth/user-menu";
import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { currentUser } from "~/lib/auth";

import { CommandMenu } from "./_components/command-menu";

type MainLayoutProps = {
  children: React.ReactNode;
};

const temp = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "All Courses",
    href: "/courses",
  },
  {
    label: "My Courses",
    href: "/my-courses",
  },
  {
    label: "Example",
    href: "/example",
  },
  {
    label: "Example 2",
    href: "/example-2",
  },
  {
    label: "Example 3",
    href: "/example-3",
  },
];

const MainLayout = async ({ children }: MainLayoutProps) => {
  const user = await currentUser();

  return (
    <div className="grid h-full min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
      <aside className="hidden h-full max-h-screen flex-col gap-2 border-r border-border bg-background md:flex">
        <div className="h-header flex items-center justify-start border-b border-border px-4 lg:px-6">
          <Link className="" href="/">
            <Logo type="short" />
          </Link>
        </div>
        <nav className="flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
          <ul className="flex flex-col">
            {temp.map((item, index) => (
              <li className="" key={index}>
                <ActiveLink
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
                  activeClassName="bg-secondary"
                  href={item.href}
                >
                  <HomeIcon className="size-4" />
                  {item.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto p-4 lg:p-6">
          <Button className="w-full" variant="secondary">
            Sign out
          </Button>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="h-header flex items-center justify-between gap-2 border-b border-border bg-background px-4 lg:px-6">
          <Button className="md:hidden" variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <CommandMenu className="w-full px-1 md:max-w-[200px]" />
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <UserMenu
                fullName={user?.name}
                email={user?.email}
                avatarImage={user?.image}
                role={user?.role}
              />
            ) : (
              <>
                <LoginButton type="redirect">Join us</LoginButton>
              </>
            )}
          </div>
        </header>
        <main className="px-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
