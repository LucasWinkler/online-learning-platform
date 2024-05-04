"use server";

import type { z } from "zod";

import { compareSync } from "bcrypt-edge";
import { AuthError } from "next-auth";

import { sendTwoFactorTokenEmail, sendVerificationEmail } from "~/lib/mail";
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

    // check if exists like 2fa
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      );

      await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token,
      );

      return { success: "Verification email sent." };
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
        const existingToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        );

        if (!existingToken || existingToken.expiresAt < new Date()) {
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email,
          );
          await sendTwoFactorTokenEmail(
            existingUser.email,
            twoFactorToken.token,
          );

          return { twoFactor: true, success: "A 2FA Code has been sent." };
        }

        return {
          twoFactor: true,
          warning:
            "A valid 2FA Code has already been sent. If you did not receive it, please wait 5 minutes and try again.",
        };
      }
    }

    await signIn("credentials", {
      email,
      password,
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
