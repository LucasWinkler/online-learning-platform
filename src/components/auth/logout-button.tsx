"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type LogoutButtonProps = ButtonProps;

export const LogoutButton = React.forwardRef(
  (
    { children, className, ...props }: LogoutButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const handleClick = () => {
      void signOut({ redirect: true, callbackUrl: "/" });
    };

    return (
      <Button
        {...props}
        className={cn(className)}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

LogoutButton.displayName = "LogoutButton";
