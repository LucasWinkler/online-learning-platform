"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { logout } from "~/server/actions/logout";

type LogoutButtonProps = ButtonProps;

export const LogoutButton = React.forwardRef(
  (
    { children, className, ...props }: LogoutButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const onClick = async () => {
      await logout({ redirect: true, redirectTo: "/" });
    };

    return (
      <Button className={cn(className)} ref={ref} {...props} onClick={onClick}>
        {children}
      </Button>
    );
  },
);

LogoutButton.displayName = "LogoutButton";
