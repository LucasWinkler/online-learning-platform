"use client";

import React from "react";

import ActiveLink from "~/components/active-link";
import { SheetClose } from "~/components/ui/sheet";
import { useIsInstructorPage } from "~/hooks/use-is-instructor-page";
import { instructorDashboardLinks, studentDashboardLinks } from "~/lib/links";

type DashboardSidebarLinksProps = {
  withSheetClose?: boolean;
};

export const DashboardSidebarLinks = ({
  withSheetClose,
}: DashboardSidebarLinksProps) => {
  const isInstructorPage = useIsInstructorPage();
  const links = isInstructorPage
    ? instructorDashboardLinks
    : studentDashboardLinks;

  const [SheetCloseWrapper, shetCloseWrapperProps] = withSheetClose
    ? [SheetClose, { asChild: true }]
    : [React.Fragment, {}];

  return (
    <ul className="flex flex-col gap-1">
      {links.map((item) => (
        <li key={item.href}>
          <SheetCloseWrapper {...shetCloseWrapperProps}>
            <ActiveLink
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
              activeClassName="bg-secondary"
              href={item.href}
            >
              <item.icon className="size-4 shrink-0" />
              {item.title}
            </ActiveLink>
          </SheetCloseWrapper>
        </li>
      ))}
    </ul>
  );
};
