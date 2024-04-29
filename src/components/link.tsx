"use client";

import type { LinkProps as NextLinkProps } from "next/link";

import { default as NextLink } from "next/link";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
} & NextLinkProps;

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  target = "_blank",
  className,
  ...props
}) => {
  if (!href || href.startsWith("http")) {
    return (
      <a className={className} href={href} target={target} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink className={className} href={href} {...props}>
      {children}
    </NextLink>
  );
};
