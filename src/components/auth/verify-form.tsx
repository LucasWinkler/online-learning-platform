"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { AuthWrapper } from "~/components/auth/auth-wrapper";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { verifyEmail } from "~/server/actions/verify-email";

export const VerifyForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const handleEmailVerification = useCallback(() => {
    if (!token) {
      setError("No token provided");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => {
        setError("An error occurred while verifying your email address.");
      });
  }, [token]);

  useEffect(() => {
    handleEmailVerification();
  }, [handleEmailVerification]);

  return (
    <AuthWrapper
      title={
        success
          ? "Email Verified"
          : error
            ? "Error Verifying Email"
            : "Verifying Email"
      }
      description={
        success
          ? "Your email address has been verified."
          : error
            ? "An error occurred while verifying your email. Please login again and check your email."
            : "Your email address is being verified."
      }
      altActionHref={!success && !error ? undefined : "/login"}
      altActionText={
        success
          ? "You're all set to:"
          : error
            ? "Please go back to:"
            : "Back to:"
      }
      altActionLinkText={success ? "Login" : "Login"}
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && (
          <Loader2Icon className="h-10 w-10 animate-spin" />
        )}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthWrapper>
  );
};
