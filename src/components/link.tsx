"use client";

import type { AriaAttributes } from "react";
import type { LinkProps as NextLinkProps } from "next/link";

import React from "react";
import { default as NextLink } from "next/link";

import { cn } from "~/lib/utils";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
} & AriaAttributes &
  NextLinkProps;

export const Link = React.forwardRef(
  (
    { children, href, target = "_blank", className, ...props }: LinkProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    if (!href || href.startsWith("http")) {
      return (
        <a
          {...props}
          ref={ref}
          className={cn("cursor-pointer", className)}
          href={href}
          target={target}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        {...props}
        ref={ref}
        className={cn("cursor-pointer", className)}
        href={href}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = "Link";
