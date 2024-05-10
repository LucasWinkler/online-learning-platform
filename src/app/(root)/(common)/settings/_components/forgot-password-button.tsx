"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";
import { signOut } from "next-auth/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";

type ForgotPasswordButtonProps = ButtonProps & {
  redirectTo?: string;
  disabled?: boolean;
};

export const ForgotPasswordButton = React.forwardRef(
  (
    { children, redirectTo, disabled }: ForgotPasswordButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const handleActionClick = () => {
      void signOut({ callbackUrl: redirectTo });
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="text-foreground"
            variant="link"
            size="none"
            disabled={disabled}
            ref={ref}
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sign out and reset your password?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Clicking &apos;Reset&apos; will sign you out immediately, and you
              will be redirected to the forgot password page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "warning" })}
              onClick={handleActionClick}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ForgotPasswordButton.displayName = "ForgotPasswordButton";
