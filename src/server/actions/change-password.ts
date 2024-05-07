"use server";

import type { z } from "zod";

import bcrypt from "bcryptjs";

import { currentUser } from "~/lib/auth";
import { ChangePasswordSchema } from "~/schemas/auth";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserById } from "~/server/data-access/user";
import { updateUserPassword } from "~/server/use-cases/user";

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
) => {
  const validatedFields = ChangePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid passwords",
    };
  }

  const { currentPassword, newPassword, confirmNewPassword } =
    validatedFields.data;

  if (newPassword != confirmNewPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  if (currentPassword == newPassword) {
    return {
      error: "New password cannot be the same as the current password",
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return {
        error: "You are not authenticated",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return {
        error: "User not found",
      };
    }

    const doesUserHaveOAuthAccount = await doesAccountExistByUserId(
      existingUser.id,
    );
    if (!existingUser.password || doesUserHaveOAuthAccount) {
      return {
        error:
          "Your password can only be changed through your third-party account provider.",
      };
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return { error: "Invalid password." };
    }

    await updateUserPassword(existingUser.id, newPassword);

    return {
      success: "Password has been changed",
    };
  } catch (error) {
    return {
      error: "Unable to change password",
    };
  }
};
