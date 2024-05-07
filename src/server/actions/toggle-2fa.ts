"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { sendTwoFactorTokenEmail } from "~/lib/mail";
import { ToggleTwoFactorAuthenticationSchema } from "~/schemas/auth";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "~/server/data-access/2fa-confirmation";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
} from "~/server/data-access/2fa-token";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserById } from "~/server/data-access/user";
import { generateTwoFactorToken } from "~/server/use-cases/2fa-token";
import { updateUserProfile } from "~/server/use-cases/user";

export const toggleTwoFactorAuthentication = async (
  values: z.infer<typeof ToggleTwoFactorAuthenticationSchema>,
) => {
  const validatedFields = ToggleTwoFactorAuthenticationSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      showCodeInput: false,
      error: "Unable to update 2FA",
    };
  }

  const { isTwoFactorEnabled, code } = validatedFields.data;

  try {
    const user = await currentUser();
    if (!user) {
      return {
        showCodeInput: !!code,
        error: "You are not authenticated",
      };
    }

    if (user.isOAuth) {
      return {
        showCodeInput: !!code,
        error:
          "Your account can only manage 2FA through your third-party account provider.",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return {
        showCodeInput: !!code,
        error: "User not found",
      };
    }

    const doesUserHaveOAuthAccount = await doesAccountExistByUserId(
      existingUser.id,
    );
    if (doesUserHaveOAuthAccount) {
      return {
        showCodeInput: !!code,
        error: "Your authentication is handled by your login provider",
      };
    }

    if (!code) {
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!existingToken || existingToken.expiresAt < new Date()) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return {
          showCodeInput: true,
          message: "A 2FA Code has been sent.",
        };
      }

      return {
        showCodeInput: true,
        message:
          "A 2FA Code has already been sent. If you do not have one please try again in 5 minutes.",
      };
    } else {
      const existingToken = await getTwoFactorTokenByToken(code);
      if (!existingToken) {
        return { showCodeInput: true, error: "Invalid 2FA Code" };
      }

      if (existingToken.expiresAt < new Date()) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return {
          showCodeInput: true,
          message: "The code expired. A new one has been sent.",
        };
      }

      if (existingToken.token !== code) {
        return { showCodeInput: true, error: "Invalid 2FA Code" };
      }

      await deleteTwoFactorToken(existingUser.email, existingToken.token);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );
      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingUser.id);
      }

      await createTwoFactorConfirmation(existingUser.id);
    }

    await updateUserProfile(existingUser.id, {
      isTwoFactorEnabled: isTwoFactorEnabled,
    });
  } catch (error) {
    return {
      showCodeInput: false,
      error: `Unable to ${isTwoFactorEnabled ? "disable" : "enable"} 2FA`,
    };
  }

  return {
    isTwoFactorEnabled: isTwoFactorEnabled,
    showCodeInput: false,
    success: `2FA has been ${isTwoFactorEnabled ? "enabled" : "disabled"} on your account`,
  };
};
