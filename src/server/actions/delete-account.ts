"use server";

import type { z } from "zod";

import { DeleteAccountSchema } from "~/schemas/auth";
import { auth } from "~/server/auth";
import { deleteOwnAccount } from "~/server/use-cases/user";

export const deleteAccount = async (
  values: z.infer<typeof DeleteAccountSchema>,
) => {
  const validatedFields = DeleteAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Incorrect confirmation phrase." };
  }

  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return { error: "You are not authenticated." };
    }

    await deleteOwnAccount(user.id);
  } catch (error) {
    return { error: "An unknown error occurred while deleting your account." };
  }

  return { success: "Your account has been successfully deleted." };
};
