"use server";

import type { z } from "zod";

import { createId } from "@paralleldrive/cuid2";

import { sendPasswordResetEmail } from "~/lib/mail";
import { ForgotPasswordSchema } from "~/schemas/auth";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { createPasswordResetToken } from "~/server/data-access/password-reset-token";
import { findUserByEmail } from "~/server/data-access/user";

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>,
) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email input." };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return { error: "Account with that email was not found." };
    }

    const doesAccountExist = await doesAccountExistByUserId(existingUser.id);
    if (!doesAccountExist) {
      return {
        error:
          "You signed in with a third-party social provider. If you need to reset your password please do it through them.",
      };
    }

    const token = createId();
    const expiresIn20Minutes = new Date(Date.now() + 20 * 60 * 1000);

    const passwordResetToken = await createPasswordResetToken(
      email,
      token,
      expiresIn20Minutes,
    );
    await sendPasswordResetEmail(
      passwordResetToken.identifier,
      passwordResetToken.token,
    );
  } catch (error: unknown) {
    return {
      error:
        "An unknown error occurred while sending the password reset email.",
    };
  }

  return {
    success: "Password reset has been successfully sent to your email.",
  };
};
