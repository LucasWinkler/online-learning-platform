"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";

import { Link } from "~/components/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { toTitleCase } from "~/lib/utils";

export const DashboardBreadcrumb = () => {
  const pathname = usePathname();

  const { displayPaths, pathNames } = useMemo(() => {
    const pathNames = pathname.split("/").filter(Boolean);
    const displayPaths = pathNames.slice(1);

    return { displayPaths, pathNames };
  }, [pathname]);

  if (displayPaths.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4 sm:mb-5 sm:mt-1 lg:mb-6">
      <BreadcrumbList>
        {displayPaths.map((path, index) => {
          const titleCasedPath = toTitleCase(path).replace(/-/g, " ");
          const isLast = index === displayPaths.length - 1;
          const href = `/${pathNames.slice(0, index + 2).join("/")}`;

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{titleCasedPath}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{titleCasedPath}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
