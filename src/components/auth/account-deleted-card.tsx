import { BadgeCheckIcon } from "lucide-react";

import { AuthCard } from "~/components/auth/auth-card";

export const AccountDeletedCard = () => {
  return (
    <AuthCard
      title="Account deleted"
      description="We're sad to see you go. Your account has been successfully deleted."
      altActionHref="/auth/register"
      altActionLinkText="Feel free to create a new one anytime."
    >
      <BadgeCheckIcon className="mx-auto size-10 text-emerald-500" />
    </AuthCard>
  );
};
