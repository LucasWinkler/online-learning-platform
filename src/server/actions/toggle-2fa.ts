"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { ToggleTwoFactorAuthenticationSchema } from "~/schemas/auth";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserById } from "~/server/data-access/user";
import { updateUserProfile } from "~/server/use-cases/user";

export const toggleTwoFactorAuthentication = async (
  values: z.infer<typeof ToggleTwoFactorAuthenticationSchema>,
) => {
  const validatedFields = ToggleTwoFactorAuthenticationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Unable to update 2FA" };
  }

  const { isTwoFactorEnabled } = validatedFields.data;

  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You are not authenticated" };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return { error: "User not found" };
    }

    const doesUserHaveOAuthAccount = await doesAccountExistByUserId(
      existingUser.id,
    );
    if (doesUserHaveOAuthAccount) {
      return { error: "Your authentication is handled by your login provider" };
    }

    await updateUserProfile(existingUser.id, {
      isTwoFactorEnabled: isTwoFactorEnabled,
    });
  } catch (error) {
    return {
      error: `Unable to ${isTwoFactorEnabled ? "disable" : "enable"} 2FA`,
    };
  }

  return {
    success: `2FA has been ${isTwoFactorEnabled ? "enabled" : "disabled"} on your account`,
  };
};
