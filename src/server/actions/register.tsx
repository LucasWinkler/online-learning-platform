"use server";

import { type z } from "zod";

import { sendVerificationEmail } from "~/lib/mail";
import { RegisterSchema } from "~/schemas/auth";
import { registerUser } from "~/server/use-cases/user";
import { generateVerificationToken } from "~/server/use-cases/verification-token";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields. Please check and try again." };
  }

  const { name, email, password } = validatedFields.data;
  const registrationData = { name, email, password };

  try {
    await registerUser(registrationData);
  } catch (error) {
    return {
      error: "Error creating account. Please check your details and try again.",
    };
  }

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token,
  );

  return { success: "Confirmation email sent." };
};
