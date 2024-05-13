"use client";

import type { LogoType } from "~/components/logo";

import { type User } from "next-auth";

import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { useViewPageAs } from "~/hooks/use-view-page-as";
import { INSTRUCTOR_ROUTE_PREFIX } from "~/routes";

type LogoLinkProps = {
  className?: string;
  logoType?: LogoType;
  user?: User;
};

export const LogoLink = ({ className, logoType, user }: LogoLinkProps) => {
  const viewPageAs = useViewPageAs(user?.role);
  const href = viewPageAs === "instructor" ? INSTRUCTOR_ROUTE_PREFIX : "/";

  return (
    <Link className={className} href={href}>
      <Logo type={logoType} />
    </Link>
  );
};
