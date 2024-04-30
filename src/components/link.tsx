"use client";

import type { LinkProps as NextLinkProps } from "next/link";

import React from "react";
import { default as NextLink } from "next/link";

import { cn } from "~/lib/utils";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
} & NextLinkProps;

export const Link = React.forwardRef(
  (
    { children, href, target = "_blank", className, ...props }: LinkProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    if (!href || href.startsWith("http")) {
      return (
        <a
          ref={ref}
          className={cn("cursor-pointer", className)}
          href={href}
          target={target}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        className={cn("cursor-pointer", className)}
        href={href}
        {...props}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = "Link";
