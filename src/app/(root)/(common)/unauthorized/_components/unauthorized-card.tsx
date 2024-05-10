import { LockKeyholeIcon } from "lucide-react";

import { AuthCard } from "~/components/auth/auth-card";

export const UnauthorizedCard = () => {
  return (
    <AuthCard
      title="401 Unauthorized"
      description="You are not authorized to access this page."
      altActionHref="/"
      altActionLinkText="Back to home"
    >
      <LockKeyholeIcon className="mx-auto size-10 animate-shake text-destructive" />
    </AuthCard>
  );
};
