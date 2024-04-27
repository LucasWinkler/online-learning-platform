import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { AuthWrapper } from "~/components/auth/auth-wrapper";

export const ErrorCard = () => {
  return (
    <>
      <AuthWrapper
        title="Uh oh..."
        description="An has error occurred"
        altActionHref="/auth/login"
        altActionText="Back to login"
      >
        <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
      </AuthWrapper>
    </>
  );
};
