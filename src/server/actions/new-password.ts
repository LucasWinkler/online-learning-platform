"use server";

import { type z } from "zod";

import { NewPasswordSchema } from "~/schemas/auth";
import { updateUserPasswordWithToken } from "~/server/use-cases/user";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
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

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid password" };
  }

  const { password } = validatedFields.data;

  try {
    return await updateUserPasswordWithToken(password, token);
  } catch (error: unknown) {
    return { error: "Error while creating new password" };
  }
};
