"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { sendVerificationEmail } from "~/lib/mail";
import { ChangeEmailSchema } from "~/schemas/auth";
import { findUserByEmail, findUserById } from "~/server/data-access/user";
import { generateVerificationToken } from "~/server/use-cases/verification-token";

import { doesAccountExistByUserId } from "../data-access/account";

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
    const user = await currentUser();
    if (!user) {
      return {
        error: "You are not authenticated.",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
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

    if (existingUser.email === email) {
      return {
        error: "You are already using that email.",
      };
    }

    const existingUserWithEmail = await findUserByEmail(email);
    if (existingUserWithEmail && existingUserWithEmail.id !== existingUser.id) {
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
