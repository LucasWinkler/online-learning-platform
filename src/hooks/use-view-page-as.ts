import { Role } from "@prisma/client";
import { usePathname } from "next/navigation";

type ViewPageAs = "instructor" | "student";

/**
 * Determine what the page should be viewed as based on the role and the pathname.
 * This is used mainly to dynamically render links ast he instructor is able to
 * view the app as a student, and vice versa.
 * @param role The role of the user.
 * @returns "instructor" or "student"
 */
export const useViewPageAs = (role: Role = Role.USER): ViewPageAs => {
  const pathname = usePathname();

  if (pathname.startsWith("/manage")) {
    return "instructor";
  } else if (pathname.startsWith("/settings")) {
    return role === Role.ADMIN ? "instructor" : "student";
  }

  return "student";
};
