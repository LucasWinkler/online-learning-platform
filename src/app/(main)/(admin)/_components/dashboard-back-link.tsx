import { ArrowLeft } from "lucide-react";

import { Link } from "~/components/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type DashboardBackLinkProps = {
  href: string;
  title?: string;
};

export const DashboardBackLink = ({ href, title }: DashboardBackLinkProps) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "link", size: "none" }),
        "mb-4 lg:mb-6",
      )}
      href={href}
      aria-label={title ? `Back to ${title}` : "Go back"}
    >
      <ArrowLeft className="size-4" />
      <span className="ml-1 font-semibold">
        {title ? `Back to ${title}` : "Back"}
      </span>
    </Link>
  );
};
