import { cache } from "react";

import { auth as nextAuth } from "~/server/auth";

/**
 * Deduplicate the auth() request from the same route
 */
export const auth = cache(nextAuth);

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};
