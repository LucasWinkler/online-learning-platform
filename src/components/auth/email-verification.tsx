"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { AuthCard } from "~/components/auth/auth-card";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { verifyEmail } from "~/server/actions/verify-email";

export const EmailVerification = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleEmailVerification = useCallback(() => {
    if (!token) {
      setError("No token provided");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("An error occurred while verifying your email address.");
      });
  }, [token]);

  useEffect(() => {
    handleEmailVerification();
  }, [handleEmailVerification]);

  return (
    <AuthCard
      title={
        success
          ? "Email Verified"
          : error
            ? "Unable to Verify"
            : "Verifying Email"
      }
      description={
        success
          ? "Your email address has been verified."
          : error
            ? "An error occurred while verifying your email. Please login again and check your email."
            : "Your email address is being verified."
      }
      altActionHref={!success && !error ? "/login" : "/login"}
      altActionText={
        success ? "You're all set to!" : error ? undefined : "Taking too long?"
      }
      altActionLinkText={"Back to login"}
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && (
          <Loader2Icon className="h-10 w-10 animate-spin" />
        )}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
