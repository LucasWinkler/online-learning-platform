"use server";

import type { z } from "zod";

import { sendPasswordResetEmail } from "~/lib/mail";
import { ResetSchema } from "~/schemas/auth";
import { createPasswordResetToken } from "~/server/data-access/password-reset-token";
import { findUserByEmail } from "~/server/data-access/user";

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return { error: "Email not found" };
    }

    const passwordResetToken = await createPasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.identifier,
      passwordResetToken.token,
    );
  } catch (error: unknown) {
    return { error: "Error sending password reset email" };
  }

  return { success: "Password reset has been sent" };
};
