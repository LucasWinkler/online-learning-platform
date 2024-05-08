"use client";

import type { ComponentPropsWithoutRef } from "react";

import { usePathname } from "next/navigation";

import { Link } from "~/components/link";
import { cn } from "~/lib/utils";

type ActiveLinkProps = {
  activeClassName?: string;
  target?: string;
} & ComponentPropsWithoutRef<typeof Link>;

const ActiveLink: React.FC<ActiveLinkProps> = ({
  href = "",
  className,
  activeClassName = "",
  children,
  ...props
}) => {
  const pathname = usePathname();
  const classNames = cn(
    className,
    href.toString() === pathname && activeClassName,
  );

  return (
    <Link {...props} className={classNames} href={href}>
      {children}
    </Link>
  );
};

export default ActiveLink;
