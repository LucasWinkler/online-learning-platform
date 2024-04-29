import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { AuthWrapper } from "~/components/auth/auth-wrapper";

export const ErrorCard = () => {
  return (
    <>
      <AuthWrapper
        title="Uh oh..."
        description="An has error occurred"
        altActionHref="/auth/login"
        altActionText="Back to:"
        altActionLinkText="login"
      >
        <ExclamationTriangleIcon className="animate-shake mx-auto size-8 text-destructive" />
      </AuthWrapper>
    </>
  );
};
