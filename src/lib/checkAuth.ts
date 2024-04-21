import { getSession } from "@auth0/nextjs-auth0";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "~/server/db";

export async function checkAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (user?.role === Role.ADMIN) {
    return;
  }

  return redirect("/unauthorized");
}

export default checkAuth;
