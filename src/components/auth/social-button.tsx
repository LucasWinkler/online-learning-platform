"use client";

import type { ButtonProps } from "~/components/ui/button";
import type {
  SocialListLayoutType,
  SocialListProvidersType,
} from "~/types/auth";

import { useState } from "react";
import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";

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

  const classNames = {
    "icon-full-text": "w-full flex gap-2 group",
    "icon-name-only": "w-full flex items-center justify-center gap-2",
    "icon-only": "w-full",
  };

  const handleSignIn = async () => {
    setIsPending(true);
    await signIn(social.provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    setIsPending(false);
  };

  return (
    <Button
      disabled={disabled ?? isPending}
      key={social.provider}
      variant="outline"
      className={cn("relative", classNames[layoutType], className)}
      onClick={handleSignIn}
      {...props}
    >
      {isPending ? (
        <>
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="sr-only">Signing in...</span>
        </>
      ) : (
        <>
          <social.Icon className="h-5 w-5 shrink-0" />
          {layoutType !== "icon-only" && (
            <span>
              {layoutType === "icon-name-only"
                ? social.displayName
                : `Continue with ${social.displayName}`}
            </span>
          )}
          {layoutType === "icon-full-text" && (
            <ChevronRightIcon className="hidden h-5 w-5 shrink-0 transition-all duration-150 group-hover:translate-x-1 xxs:[display:unset]" />
          )}
        </>
      )}
    </Button>
  );
};
