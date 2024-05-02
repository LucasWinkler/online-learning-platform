"use server";

import { signOut } from "~/server/auth";

type LogoutProps = Parameters<typeof signOut>[0];

export const logout = async (options: LogoutProps) => {
  await signOut(options);
};
