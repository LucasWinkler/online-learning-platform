"use client";

import type { ButtonProps } from "~/components/ui/button";

import React from "react";
import { useRouter } from "next/navigation";

import { RegisterForm } from "~/components/auth/register-form";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type RegisterButtonProps = {
  mode?: "modal" | "redirect";
  asChild?: boolean;
} & ButtonProps;

export const RegisterButton = React.forwardRef(
  (
    { children, mode = "redirect", asChild, ...props }: RegisterButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const router = useRouter();

    const handleClick = () => {
      router.push("/auth/register");
    };

    if (mode === "modal") {
      return (
        <Dialog modal>
          <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
          <DialogContent className="w-full border-none bg-transparent p-0">
            <RegisterForm />
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

RegisterButton.displayName = "RegisterButton";
