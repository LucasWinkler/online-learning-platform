import type { ButtonProps } from "~/components/ui/button";
import type {
  SocialListLayoutType,
  SocialListProvidersType,
} from "~/types/auth";

import { ChevronRightIcon } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";

type SocialButtonProps = {
  layoutType: SocialListLayoutType;
  social: SocialListProvidersType;
  className?: string;
} & ButtonProps;

export const SocialButton = ({
  layoutType,
  social,
  className,
  ...props
}: SocialButtonProps) => {
  const classNames = {
    "icon-full-text": "w-full flex gap-2 group",
    "icon-name-only": "w-full flex items-center justify-center gap-2",
    "icon-only": "w-full",
  };
  return (
    <Button
      key={social.provider}
      variant="outline"
      size="lg"
      className={cn(classNames[layoutType], className)}
      onClick={() =>
        signIn(social.provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
      }
      {...props}
    >
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
    </Button>
  );
};
