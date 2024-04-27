"use server";

import type { z } from "zod";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { sendVerificationEmail } from "~/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { LoginSchema } from "~/schemas/auth";
import { signIn } from "~/server/auth";
import { findUserByEmail } from "~/server/data-access/user";
import { generateVerificationToken } from "~/server/use-cases/verification-token";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await findUserByEmail(email);
  if (!existingUser?.email || !existingUser?.password) {
    return { error: "Invalid email or password." };
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    return { error: "Invalid email or password." };
  }

  if (!existingUser?.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return { success: "Confirmation email sent." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "An error occurred. Please try again." };
      }
    }

    throw error;
  }

  return { success: "Login successful" };
};
