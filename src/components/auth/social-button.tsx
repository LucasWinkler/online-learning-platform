"use client";

import type { ButtonProps } from "~/components/ui/button";
import type {
  SocialListLayoutType,
  SocialListProvidersType,
} from "~/types/auth";

import { useState } from "react";
import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { DEFAULT_REDIRECT } from "~/routes";

type SocialButtonProps = {
  layoutType: SocialListLayoutType;
  social: SocialListProvidersType;
} & ButtonProps;

export const SocialButton = ({
  layoutType,
  social,
  className,
  disabled,
  ...props
}: SocialButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const classNames = {
    "icon-full-text": "w-full flex gap-2 group",
    "icon-name-only": "w-full flex items-center justify-center gap-2",
    "icon-only": "w-full",
  };

  const handleSignIn = () => {
    setIsPending(true);
    void signIn(social.provider, {
      callbackUrl: callbackUrl ?? DEFAULT_REDIRECT,
    });
  };

  return (
    <Button
      {...props}
      disabled={disabled ?? isPending}
      variant="outline"
      className={cn(
        "relative h-10 py-5 text-base xs:text-sm",
        classNames[layoutType],
        className,
      )}
      onClick={handleSignIn}
    >
      {isPending && (
        <>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="sr-only">Signing in...</span>
            <Loader2Icon className="size-6 animate-spin xs:size-5" />
          </div>
        </>
      )}
      <social.icon className="size-6 shrink-0 xs:size-5" />
      {layoutType !== "icon-only" && (
        <span>
          {layoutType === "icon-name-only"
            ? social.title
            : `Continue with ${social.title}`}
        </span>
      )}
      {layoutType === "icon-full-text" && (
        <ChevronRightIcon className="hidden size-6 shrink-0 transition-all duration-150 group-hover:translate-x-1 xxs:[display:unset] xs:size-5" />
      )}
    </Button>
  );
};
