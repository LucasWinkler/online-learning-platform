"use client";

import { type HTMLAttributeAnchorTarget, type PropsWithChildren } from "react";

import ActiveLink from "~/components/active-link";
import { cn } from "~/lib/utils";

type NavItemProps = {
  href: string;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
};

const NavItem: React.FC<PropsWithChildren<NavItemProps>> = ({
  href = "",
  className,
  target,
  children,
}) => {
  return (
    <ActiveLink
      href={href}
      className={cn("p-2 hover:underline hover:underline-offset-2", className)}
      activeClassName="bg-primary text-primary-foreground"
      target={target}
    >
      <span className="text-lg">{children}</span>
      {(href.startsWith("http") || target === "_blank") && "^"}
    </ActiveLink>
  );
};
export default NavItem;
