"use client";

import { Link } from "~/components/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AltActionLinkProps = {
  href?: string;
  text?: string;
  linkText?: string;
};

export const AltActionLink = ({ href, text, linkText }: AltActionLinkProps) => {
  if (!href && !text && !linkText) {
    return null;
  }

  if (!href && !linkText) {
    return null;
  }

  return (
    <p className="w-full space-x-1 text-center">
      {text && <span className="text-xs font-medium">{text}</span>}
      {href && linkText && (
        <Link
          className={cn(
            buttonVariants({ variant: "link", size: "xs" }),
            "font-normal",
          )}
          href={href}
        >
          {linkText}
        </Link>
      )}
    </p>
  );
};
