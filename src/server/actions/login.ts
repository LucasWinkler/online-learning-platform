"use server";

import type { z } from "zod";

// import { compareSync } from "bcrypt-edge";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { sendTwoFactorTokenEmail, sendVerificationEmail } from "~/lib/mail";
import { DEFAULT_REDIRECT } from "~/routes";
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

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string,
) => {
  try {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid email or password." };
    }

    const { email, password, code } = validatedFields.data;

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

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      );

      await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token,
      );

      return { success: "Verification email has been sent to your email." };
    }

    if (existingUser.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        );
        if (!twoFactorToken) {
          return { error: "That 2FA code is invalid." };
        }

        if (twoFactorToken.token !== code) {
          return { error: "That 2FA code is invalid." };
        }

        const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();
        if (hasExpired) {
          return { error: "That 2FA code has expired." };
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

          return {
            twoFactor: true,
            success: "A 2FA code has been sent to your email.",
          };
        }

        return {
          twoFactor: true,
          warning:
            "A 2FA code has already been sent. If you did not receive it, please try again in 5 minutes.",
        };
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? DEFAULT_REDIRECT,
    });

    return { success: "You have been successfully logged in." };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "An unknown error occurred while logging in." };
      }
    }

    throw error;
  }
};
