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
import auth from "~/lib/auth";

import { CommandMenu } from "./command-menu";

export const DashboardHeaderItems = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <CommandMenu
        user={user}
        className="hidden h-9 w-full flex-1 shrink px-1 xxs:inline-flex md:max-w-[15.625rem] lg:max-w-[20.3125rem] xl:max-w-[23.4375rem]"
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
            <UserMenu user={user} />
          </>
        ) : (
          <LoginButton>Start Learning</LoginButton>
        )}
      </div>
    </>
  );
};
