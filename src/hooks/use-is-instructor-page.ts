import { usePathname } from "next/navigation";

import { isInstructorPage } from "~/lib/utils";

export const useIsInstructorPage = () => {
  const pathname = usePathname();

  return isInstructorPage(pathname);
};
