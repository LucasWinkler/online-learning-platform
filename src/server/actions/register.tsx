"use server";

import { type z } from "zod";

import { RegisterSchema } from "~/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields. Please check and try again." };
  }

  return { success: "Account created" };
};
