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
      error: "An unknown error occurred while changing your 2FA settings.",
    };
  }

  const { isTwoFactorEnabled, code } = validatedFields.data;

  try {
    const user = await currentUser();
    if (!user) {
      return {
        showCodeInput: !!code,
        error: "You are not authenticated.",
      };
    }

    const existingUser = await findUserById(user.id);
    if (!existingUser) {
      return {
        showCodeInput: !!code,
        error: "You are not authenticated.",
      };
    }

    const doesUserHaveOAuthAccount = await doesAccountExistByUserId(
      existingUser.id,
    );
    if (doesUserHaveOAuthAccount || user.isOAuth) {
      return {
        showCodeInput: !!code,
        error: "Your 2FA is handled by your third-party social account.",
      };
    }

    if (!code) {
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!existingToken || existingToken.expiresAt < new Date()) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return {
          showCodeInput: true,
          message: "A 2FA code has been successfully sent to your email.",
        };
      }

      return {
        showCodeInput: true,
        message:
          "A 2FA code has already been sent to your email. You can request a new code in 5 minutes.",
      };
    } else {
      const existingToken = await getTwoFactorTokenByToken(code);
      if (!existingToken) {
        return { showCodeInput: true, error: "Invalid 2FA code." };
      }

      if (existingToken.expiresAt < new Date()) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return {
          showCodeInput: true,
          message:
            "Your 2FA code has expired. A new one has been sent to your email.",
        };
      }

      if (existingToken.token !== code) {
        return { showCodeInput: true, error: "Invalid 2FA code." };
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
      error: "An unknown error occurred while changing your 2FA settings.",
    };
  }

  return {
    isTwoFactorEnabled: isTwoFactorEnabled,
    showCodeInput: false,
    success: `2FA has been successfully ${isTwoFactorEnabled ? "enabled" : "disabled"} on your account.`,
  };
};
