"use client";

import { Link } from "~/components/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AltActionLinkProps = {
  href?: string;
  text?: string;
  linkText?: string;
  onClick?: () => void;
};

export const AltActionLink = ({
  href,
  text,
  linkText,
  onClick,
}: AltActionLinkProps) => {
  if (!linkText && !href && !onClick) {
    return null;
  }

  if (linkText && !href && !onClick) {
    return null;
  }

  return (
    <p className="w-full space-x-1 text-center">
      {text && (
        <span className="text-wrap text-base font-medium xs:text-sm">
          {text}
        </span>
      )}
      {href ? (
        <Link
          className={cn(
            buttonVariants({ variant: "link", size: "xs" }),
            "text-wrap text-base font-normal xs:text-sm",
          )}
          href={href}
          onClick={onClick}
        >
          {linkText}
        </Link>
      ) : (
        <button
          className={cn(
            buttonVariants({ variant: "link", size: "xs" }),
            "text-wrap text-base font-normal xs:text-sm",
          )}
          onClick={onClick}
        >
          {linkText}
        </button>
      )}
    </p>
  );
};
