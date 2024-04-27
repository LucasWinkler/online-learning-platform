"use client";

import type { ComponentPropsWithoutRef } from "react";

import { default as NextLink } from "next/link";

type LinkProps = Omit<ComponentPropsWithoutRef<typeof NextLink>, "href"> & {
  href?: string;
};

export const Link: React.FC<LinkProps> = ({ children, href, ...props }) => {
  if (!href || href.toString().startsWith("http")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href?.toString()} {...props}>
      {children}
    </NextLink>
  );
};
