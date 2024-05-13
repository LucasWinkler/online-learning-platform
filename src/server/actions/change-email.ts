"use server";

import type { z } from "zod";

import { sendVerificationEmail } from "~/lib/mail";
import { ChangeEmailSchema } from "~/schemas/auth";
import { auth } from "~/server/auth";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserByEmail } from "~/server/data-access/user";
import { generateVerificationToken } from "~/server/use-cases/verification-token";

export const changeEmail = async (
  values: z.infer<typeof ChangeEmailSchema>,
) => {
  const validatedFields = ChangeEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid email input.",
    };
  }

  const { email } = validatedFields.data;

  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return {
        error: "You are not authenticated.",
      };
    }

    const doesAccountExist = await doesAccountExistByUserId(user.id);
    if (doesAccountExist || user.isOAuth) {
      return {
        error:
          "You can not change your email because you signed up with a third-party social account.",
      };
    }

    if (user.email === email) {
      return {
        error: "You are already using that email.",
      };
    }

    const existingUserWithEmail = await findUserByEmail(email);
    if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
      return {
        error: "That email is already in use.",
      };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return {
      success: "A verification link has been successfully sent to your email.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your email.",
    };
  }
};
