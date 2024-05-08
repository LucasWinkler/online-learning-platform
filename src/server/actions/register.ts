"use server";

import type { z } from "zod";

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "UserExistsError") {
        return {
          error: error.message,
        };
      }
    }

    console.error(
      "An unknown error occurred while creating your account:",
      error,
    );
    return {
      error: "An unknown error occurred while creating your account.",
    };
  }

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token,
  );

  return {
    success: "A verification email has been successfully sent to your email.",
  };
};
