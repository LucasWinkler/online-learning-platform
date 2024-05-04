import type { User } from "next-auth";

import { Button } from "~/components/ui/button";

type TwoFactorAuthenticationFormProps = {
  user?: User;
};

export const TwoFactorAuthenticationForm = ({
  user,
}: TwoFactorAuthenticationFormProps) => {
  {
    /* TODO: Open modal asking for a code to enable/disable */
  }
  return (
    <Button
      disabled
      variant={user?.isTwoFactorEnabled ? "destructive" : "default"}
      size="sm"
    >
      {user?.isTwoFactorEnabled ? "Disable" : "Enable"} 2FA
    </Button>
  );
};
