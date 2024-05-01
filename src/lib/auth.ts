import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export const currentUser = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return session.user;
};
