"use server";

import type { z } from "zod";

import { createId } from "@paralleldrive/cuid2";

import { sendPasswordResetEmail } from "~/lib/mail";
import { ForgotPasswordSchema } from "~/schemas/auth";
import { createPasswordResetToken } from "~/server/data-access/password-reset-token";
import { findUserByEmail } from "~/server/data-access/user";

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>,
) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return { error: "Email not found" };
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
    return { error: "Error sending password reset email" };
  }

  return { success: "Password reset has been sent" };
};
