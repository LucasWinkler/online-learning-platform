"use client";

import React from "react";

import { cn } from "~/lib/utils";
import { logout } from "~/server/actions/logout";

type LogoutButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export const LogoutButton = React.forwardRef(
  (
    { children, className, ...props }: LogoutButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const onClick = async () => {
      await logout({ redirect: true, redirectTo: "/" });
    };

    return (
      <button
        className={cn("cursor-pointer", className)}
        ref={ref}
        {...props}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

LogoutButton.displayName = "LogoutButton";
