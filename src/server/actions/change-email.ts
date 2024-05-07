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
      error: "Invalid email",
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await currentUser();
    if (!user) {
      return {
        error: "You are not authenticated",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return {
        error: "You are not authorized",
      };
    }

    const doesAccountExist = await doesAccountExistByUserId(user.id);
    if (doesAccountExist) {
      return {
        error: "You signed up with a third-party account provider",
      };
    }

    if (existingUser.email === email) {
      return {
        error: "Email is the same",
      };
    }

    const existingUserWithEmail = await findUserByEmail(email);
    if (existingUserWithEmail && existingUserWithEmail.id !== existingUser.id) {
      return {
        error: "Email is already taken",
      };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return { success: "Verification email sent" };
  } catch (error) {
    return {
      error: "Unable to update email",
    };
  }
};
