"use client";

import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import ActiveLink from "~/components/active-link";
import { isInstructorPage } from "~/lib/utils";

const studentLinks = [
  { label: "Overview", href: "/" },
  { label: "All Courses", href: "/courses" },
  { label: "My Courses", href: "/my-courses" },
];

const instructorOnlyLinks = [
  { label: "Overview", href: "/manage" },
  { label: "Courses", href: "/manage/courses" },
  { label: "Students", href: "/manage/students" },
];

export const DashboardSidebarLinks = () => {
  const pathname = usePathname();
  const links = isInstructorPage(pathname) ? instructorOnlyLinks : studentLinks;

  return (
    <ul className="flex flex-col">
      {links.map((item, index) => (
        <li className="" key={index}>
          <ActiveLink
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
            activeClassName="bg-secondary"
            href={item.href}
          >
            <HomeIcon className="size-4" />
            {item.label}
          </ActiveLink>
        </li>
      ))}
    </ul>
  );
};
