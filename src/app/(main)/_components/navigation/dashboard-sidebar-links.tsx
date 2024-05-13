"use client";

import type { User } from "next-auth";

import React from "react";

import ActiveLink from "~/components/active-link";
import { SheetClose } from "~/components/ui/sheet";
import { useViewPageAs } from "~/hooks/use-view-page-as";
import { instructorDashboardLinks, studentDashboardLinks } from "~/lib/links";

type DashboardSidebarLinksProps = {
  withSheetClose?: boolean;
  user?: User;
};

export const DashboardSidebarLinks = ({
  withSheetClose,
  user,
}: DashboardSidebarLinksProps) => {
  const viewPageAs = useViewPageAs(user?.role);
  const links =
    viewPageAs === "instructor"
      ? instructorDashboardLinks
      : studentDashboardLinks;

  const [SheetCloseWrapper, sheetCloseWrapperProps] = withSheetClose
    ? [SheetClose, { asChild: true }]
    : [React.Fragment, {}];

  return (
    <ul className="flex flex-col gap-1">
      {links.map((item) => (
        <li key={item.href}>
          <SheetCloseWrapper {...sheetCloseWrapperProps}>
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
