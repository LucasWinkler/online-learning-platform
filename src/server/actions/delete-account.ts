"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { DeleteAccountSchema } from "~/schemas/auth";
import { deleteOwnAccount } from "~/server/use-cases/user";

export const deleteAccount = async (
  values: z.infer<typeof DeleteAccountSchema>,
) => {
  const validatedFields = DeleteAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Incorrect confirmation phrase." };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You are not authenticated." };
    }

    await deleteOwnAccount(user.id);
  } catch (error) {
    return { error: "An unknown error occurred while deleting your account." };
  }

  return { success: "Your account has been successfully deleted." };
};
