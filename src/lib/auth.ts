import { Role } from "@prisma/client";

import { DEFAULT_LOGIN_REDIRECT, instructorRoutePrefix } from "~/routes";
import { auth } from "~/server/auth";

type DefaultLoginRedirectOptions = {
  role?: Role;
};

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const getLoginRedirectUrl = ({
  role = Role.USER,
}: DefaultLoginRedirectOptions): string => {
  let redirectUrl = DEFAULT_LOGIN_REDIRECT;

  if (role === Role.ADMIN) {
    redirectUrl = instructorRoutePrefix;
  }

  return redirectUrl;
};
