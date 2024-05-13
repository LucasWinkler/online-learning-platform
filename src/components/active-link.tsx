"use client";

import type { ComponentPropsWithoutRef } from "react";

import { usePathname } from "next/navigation";

import { Link } from "~/components/link";
import { cn } from "~/lib/utils";
import { INSTRUCTOR_ROUTE_PREFIX } from "~/routes";

type ActiveLinkProps = {
  activeClassName?: string;
  target?: string;
} & ComponentPropsWithoutRef<typeof Link>;

const ActiveLink: React.FC<ActiveLinkProps> = ({
  href = "",
  activeClassName = "",
  className,
  children,
  ...props
}) => {
  const pathname = usePathname();
  const isActive =
    href === "/" || href === INSTRUCTOR_ROUTE_PREFIX
      ? pathname === href
      : pathname.startsWith(href);
  const classNames = cn(className, isActive && activeClassName);

  return (
    <Link {...props} className={classNames} href={href}>
      {children}
    </Link>
  );
};

export default ActiveLink;
