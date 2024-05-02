import { BadgeCheckIcon } from "lucide-react";

import { AuthWrapper } from "~/components/auth/auth-wrapper";

export const AccountDeletedCard = () => {
  return (
    <AuthWrapper
      title="Account deleted"
      description="We're sad to see you go. Your account has been successfully deleted."
      altActionHref="/auth/register"
      altActionLinkText="Feel free to create a new one anytime."
    >
      <BadgeCheckIcon className="mx-auto size-10 text-emerald-500" />
    </AuthWrapper>
  );
};
