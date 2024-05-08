"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "~/components/auth/login-form";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type LoginButtonProps = {
  mode?: "modal" | "redirect";
  asChild?: boolean;
} & ButtonProps;

export const LoginButton = React.forwardRef(
  (
    { children, mode = "redirect", asChild, ...props }: LoginButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const router = useRouter();

    const handleClick = () => {
      router.push("/auth/login");
    };

    if (mode === "modal") {
      return (
        <Dialog>
          <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
          <DialogContent className="rounded-none py-0 xs:rounded-xl xs:py-6">
            <LoginForm />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Button {...props} ref={ref} onClick={handleClick}>
        {children}
      </Button>
    );
  },
);

LoginButton.displayName = "LoginButton";
