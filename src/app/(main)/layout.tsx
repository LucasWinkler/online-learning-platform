import { BellIcon, HomeIcon, MenuIcon } from "lucide-react";

import ActiveLink from "~/components/active-link";
import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";
import { UserMenu } from "~/components/auth/user-menu";
import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
    <>
      <aside className="fixed left-0 top-0 z-[15] hidden h-full max-w-[13.75rem] flex-col border-r border-border bg-background md:flex md:w-full md:max-w-[15rem] lg:max-w-[17.5rem]">
        <div className="h-header-height flex shrink-0 items-center justify-start border-b border-border px-4 lg:px-6">
          <Link className="" href="/">
            <Logo type="short" />
          </Link>
        </div>
        <nav className="mt-2 flex-1 flex-col items-start overflow-y-auto px-2 text-sm font-medium lg:px-4">
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
        <div className="mt-auto border-t border-border p-4 lg:p-6">
          {user ? (
            <LogoutButton className="w-full" variant="secondary">
              Sign out
            </LogoutButton>
          ) : (
            <LoginButton className="w-full">Join us</LoginButton>
          )}
        </div>
      </aside>
      <header className="h-header-height fixed left-0 right-0 top-0 z-[10] border-b border-border bg-background md:left-[15rem] lg:left-[17.5rem]">
        <div className="flex h-full w-full items-center justify-between gap-2 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="shrink-0 md:hidden"
                variant="outline"
                size="icon"
              >
                <span className="sr-only">Toggle navigation menu</span>
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Acme</SheetTitle>
                <SheetDescription>Links...</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <CommandMenu className="w-full flex-1 shrink px-1 md:max-w-[15.625rem] lg:max-w-[20.3125rem] xl:max-w-[23.4375rem]" />
          <div className="flex items-center justify-end gap-2">
            {user && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="shrink-0" variant="outline" size="icon">
                      <BellIcon className="size-4" />
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="grid w-[17.5rem] gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Notifications
                      </h4>
                    </div>
                    <Separator />
                    <div className="grid gap-2">
                      <p className="text-sm">No notifications at this time</p>
                    </div>
                  </PopoverContent>
                </Popover>
                <UserMenu
                  fullName={user?.name}
                  email={user?.email}
                  avatarImage={user?.image}
                  role={user?.role}
                />
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mt-[calc(var(--header-height)_+_1rem)] px-[1rem] md:ml-[15rem] lg:ml-[17.5rem] lg:mt-[calc(var(--header-height)_+_1.5rem)] lg:px-[1.5rem]">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
