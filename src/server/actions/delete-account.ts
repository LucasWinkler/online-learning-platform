"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { DeleteAccountSchema } from "~/schemas/auth";
import { findUserById } from "~/server/data-access/user";
import { deleteOwnAccount } from "~/server/use-cases/user";

export const deleteAccount = async (
  values: z.infer<typeof DeleteAccountSchema>,
) => {
  const validatedFields = DeleteAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Incorrect phrase" };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unable to delete account" };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return { error: "Unable to delete account" };
    }

    await deleteOwnAccount(user.id, existingUser.id);
  } catch (error) {
    return { error: "Unable to delete account" };
  }

  return { success: "Account deleted" };
};
