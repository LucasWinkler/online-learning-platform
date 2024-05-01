"use server";

import type { z } from "zod";

import { compareSync } from "bcrypt-edge";
import { AuthError } from "next-auth";

import { sendTwoFactorTokenEmail, sendVerificationEmail } from "~/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { LoginSchema } from "~/schemas/auth";
import { signIn } from "~/server/auth";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "~/server/data-access/2fa-confirmation";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "~/server/data-access/2fa-token";
import { findUserByEmail } from "~/server/data-access/user";
import { generateTwoFactorToken } from "~/server/use-cases/2fa-token";
import { generateVerificationToken } from "~/server/use-cases/verification-token";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password, code } = validatedFields.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser?.email || !existingUser?.password) {
      return { error: "Invalid email or password." };
    }

    const isPasswordCorrect = compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return { error: "Invalid email or password." };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      );

      await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token,
      );

      return { success: "Confirmation email sent." };
    }

    if (existingUser.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        );
        if (!twoFactorToken) {
          return { error: "Invalid 2FA code." };
        }

        if (twoFactorToken.token !== code) {
          return { error: "Invalid 2FA code." };
        }

        const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();
        if (hasExpired) {
          return { error: "2FA Code has expired." };
        }

        await deleteTwoFactorToken(existingUser.email, twoFactorToken.token);

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );
        if (existingConfirmation) {
          await deleteTwoFactorConfirmation(existingConfirmation.id);
        }

        await createTwoFactorConfirmation(existingUser.id);
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return { twoFactor: true };
      }
    }

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