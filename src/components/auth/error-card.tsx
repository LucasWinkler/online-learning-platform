import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { AuthCard } from "~/components/auth/auth-card";

export const ErrorCard = () => {
  return (
      <AuthCard
        title="Uh oh..."
        description="An error has occurred. Please try again or contact us if the problem persists."
        altActionHref="/auth/login"
        altActionText="Back to:"
        altActionLinkText="login"
      >
        <ExclamationTriangleIcon className="mx-auto size-10 animate-shake text-destructive" />
      </AuthCard>
  );
};
