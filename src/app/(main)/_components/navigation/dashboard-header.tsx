import { BellIcon } from "lucide-react";

import { LoginButton } from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { UserMenu } from "~/components/user-menu";
import { currentUser } from "~/lib/auth";

import { CommandMenu } from "./command-menu";
import { DashboardMobileMenu } from "./dashboard-mobile-menu";

export const DashboardHeader = async () => {
  const user = await currentUser();

  return (
    <header className="fixed left-0 right-0 top-0 z-[10] h-header-height border-b border-border bg-background md:left-[15rem] lg:left-[17.5rem]">
      <div className="flex h-full w-full items-center justify-between gap-2 px-4 lg:px-6">
        <DashboardMobileMenu user={user} />
        <CommandMenu
          user={user}
          className="hidden w-full flex-1 shrink px-1 xxs:inline-flex md:max-w-[15.625rem] lg:max-w-[20.3125rem] xl:max-w-[23.4375rem]"
        />
        <div className="flex items-center justify-end gap-2">
          {user ? (
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
                    <h4 className="font-medium leading-none">Notifications</h4>
                  </div>
                  <Separator />
                  <div className="grid gap-2">
                    <p className="text-sm">No notifications at this time</p>
                  </div>
                </PopoverContent>
              </Popover>
              <UserMenu
                fullName={user.name}
                email={user.email}
                avatarImage={user.image}
                role={user.role}
              />
            </>
          ) : (
            <LoginButton>Start learning</LoginButton>
          )}
        </div>
      </div>
    </header>
  );
};
