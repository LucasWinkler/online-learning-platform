"use client";

import React from "react";
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

/**
 * Renders breadcrumbs for the instructor dashboard.
 * If the pathname is "/manage", the breadcrumb will not be rendered
 * as the home page should not have a breadcrumb.
 * It will also only display as long as there is more than one pathname.
 */
export const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const pathNames = pathname
    .split("/")
    .filter((path) => path && path !== "manage")
    .map((path) =>
      path.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    );

  if (pathNames.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4 sm:mb-5 sm:mt-1 lg:mb-6">
      <BreadcrumbList>
        {pathNames.map((path, index) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
              {index !== pathNames.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={`/${path.toLowerCase()}`}>{path}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{path}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== pathNames.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
