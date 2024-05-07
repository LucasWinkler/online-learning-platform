"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";

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
import { logout } from "~/server/actions/logout";

type ForgotPasswordButtonProps = ButtonProps & {
  redirectTo?: string;
  disabled?: boolean;
};

export const ForgotPasswordButton = React.forwardRef(
  (
    { children, redirectTo, disabled }: ForgotPasswordButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const handleActionClick = async () => {
      await logout({ redirectTo });
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabled}
            ref={ref}
            className="text-foreground"
            variant="link"
            size="none"
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
