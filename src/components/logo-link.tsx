"use client";

import type { LogoType } from "~/components/logo";

import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { useIsInstructorPage } from "~/hooks/use-is-instructor-page";
import { cn } from "~/lib/utils";
import { instructorRoutePrefix } from "~/routes";

type LogoLinkProps = {
  className?: string;
  logoType?: LogoType;
};

export const LogoLink = ({ className, logoType }: LogoLinkProps) => {
  const isInstructorPage = useIsInstructorPage();
  const href = isInstructorPage ? instructorRoutePrefix : "/";

  return (
    <Link className={cn("", className)} href={href}>
      <Logo type={logoType} />
    </Link>
  );
};
