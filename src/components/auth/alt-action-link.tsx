"use client";

import { Link } from "~/components/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AltActionLinkProps = {
  href: string;
  text: string;
};

export const AltActionLink = ({ href, text }: AltActionLinkProps) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "w-full font-normal",
      )}
      href={href}
    >
      {text}
    </Link>
  );
};
