import type { ComponentPropsWithoutRef } from "react";

import { usePathname } from "next/navigation";

import Link from "~/components/link";
import { cn } from "~/lib/utils";

type ActiveLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  activeClassName?: string;
};

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
    <Link className={classNames} href={href} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
