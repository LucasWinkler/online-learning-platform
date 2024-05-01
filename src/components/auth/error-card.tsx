import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { AuthWrapper } from "~/components/auth/auth-wrapper";

export const ErrorCard = () => {
  return (
    <>
      <AuthWrapper
        title="Uh oh..."
        description="An error has occurred. Please try again or contact us if the problem persists."
        altActionHref="/auth/login"
        altActionText="Back to:"
        altActionLinkText="login"
      >
        <ExclamationTriangleIcon className="mx-auto size-10 animate-shake text-destructive" />
      </AuthWrapper>
    </>
  );
};
