"use server";

import { type z } from "zod";

import { ResetPasswordSchema } from "~/schemas/auth";
import { resetUserPasswordWithToken } from "~/server/use-cases/user";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null,
): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
    }
> => {
  if (!token) {
    return { error: "No token provided" };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid password" };
  }

  const { password } = validatedFields.data;

  try {
    return await resetUserPasswordWithToken(password, token);
  } catch (error: unknown) {
    return { error: "Error while creating new password" };
  }
};
