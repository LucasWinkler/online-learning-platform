import type { User } from "next-auth";

import { PowerIcon } from "lucide-react";

import { LoginButton } from "~/components/auth/login-button";
import { LogoutButton } from "~/components/auth/logout-button";

type DashboardSidebarActionsProps = {
  user?: User;
};

export const DashboardSidebarActions = ({
  user,
}: DashboardSidebarActionsProps) => {
  return (
    <>
      {user ? (
        <LogoutButton
          className="flex w-full items-center gap-2"
          variant="secondary"
        >
          <PowerIcon className="size-4 shrink-0" />
          Sign out
        </LogoutButton>
      ) : (
        <LoginButton className="w-full">Start Learning</LoginButton>
      )}
    </>
  );
};
