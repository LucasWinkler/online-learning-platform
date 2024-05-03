"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type LoginButtonProps = {
  mode?: "modal" | "redirect";
  asChild?: boolean;
} & ButtonProps;

export const LoginButton = React.forwardRef(
  (
    {
      children,
      mode = "redirect",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild,
      className,
      ...props
    }: LoginButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const router = useRouter();

    const onClick = () => {
      router.push("/auth/login");
    };

    if (mode === "modal") {
      return <span>TODO: Implement modal</span>;
    }

    return (
      <Button className={cn(className)} ref={ref} {...props} onClick={onClick}>
        {children}
      </Button>
    );
  },
);

LoginButton.displayName = "LoginButton";
