import { Role } from "@prisma/client";

import { DEFAULT_LOGIN_REDIRECT, instructorRoutePrefix } from "~/routes";
import { auth } from "~/server/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const getLoginRedirectUrl = ({
  role = Role.USER,
}: {
  role?: Role;
}): string => {
  let redirectUrl = DEFAULT_LOGIN_REDIRECT;

  if (role === Role.ADMIN) {
    redirectUrl = instructorRoutePrefix;
  }

  return redirectUrl;
};
