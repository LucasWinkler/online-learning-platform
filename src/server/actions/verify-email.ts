"use server";

import { verifyUserEmail } from "~/server/use-cases/user";

export const verifyEmail = async (
  token: string,
): Promise<{ error?: string; success?: string }> => {
  const response = await verifyUserEmail(token);
  if (response?.error) {
    return { error: response.error };
  }

  return { success: "Your email has been successfully verified." };
};
