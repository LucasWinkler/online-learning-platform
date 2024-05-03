"use client";

import ActiveLink from "~/components/active-link";
import { useIsInstructorPage } from "~/hooks/use-is-instructor-page";
import { instructorDashboardLinks, studentDashboardLinks } from "~/lib/links";

export const DashboardSidebarLinks = () => {
  const isInstructorPage = useIsInstructorPage();
  const links = isInstructorPage
    ? instructorDashboardLinks
    : studentDashboardLinks;

  return (
    <ul className="flex flex-col">
      {links.map((item, index) => (
        <li className="" key={index}>
          <ActiveLink
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
            activeClassName="bg-secondary"
            href={item.href}
          >
            <item.Icon className="size-4" />
            {item.title}
          </ActiveLink>
        </li>
      ))}
    </ul>
  );
};
