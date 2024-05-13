"use server";

import type { z } from "zod";

import bcrypt from "bcryptjs";

import { ChangePasswordSchema } from "~/schemas/auth";
import { auth } from "~/server/auth";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserById } from "~/server/data-access/user";
import { updateUserPassword } from "~/server/use-cases/user";

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
) => {
  const validatedFields = ChangePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid password input.",
    };
  }

  const { currentPassword, newPassword, confirmNewPassword } =
    validatedFields.data;

  if (newPassword != confirmNewPassword) {
    return {
      error: "New passwords do not match.",
    };
  }

  if (currentPassword == newPassword) {
    return {
      error: "New password cannot be the same as the current password.",
    };
  }

  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return {
        error: "You are not authenticated.",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return {
        error: "You are not authenticated.",
      };
    }

    const doesUserHaveOAuthAccount = await doesAccountExistByUserId(
      existingUser.id,
    );
    if (!existingUser.password || doesUserHaveOAuthAccount || user.isOAuth) {
      return {
        error:
          "Your password can only be changed through your third-party social account.",
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
      success: "Your password has been successfully changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your password.",
    };
  }
};
