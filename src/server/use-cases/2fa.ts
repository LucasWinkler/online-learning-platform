import crypto from "crypto";

import { currentUser } from "~/lib/auth";
import { sendTwoFactorTokenEmail } from "~/lib/mail";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "~/server/data-access/2fa-confirmation";
import {
  createTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
} from "~/server/data-access/2fa-token";
import { doesAccountExistByUserId } from "~/server/data-access/account";
import { findUserById } from "~/server/data-access/user";
import { updateUserProfile } from "~/server/use-cases/user";

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    const { identifier, token } = existingToken;
    await deleteTwoFactorToken(identifier, token);
  }

  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expiresIn5Minutes = new Date(Date.now() + 5 * 60 * 1000);

  return await createTwoFactorToken(email, token, expiresIn5Minutes);
};

export const toggleTwoFactor = async (code?: string) => {
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

  console.log("existingUser 2fa", existingUser.isTwoFactorEnabled);

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
  }

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
    return {
      showCodeInput: true,
      error: "Invalid 2FA code.",
    };
  }

  await deleteTwoFactorToken(existingUser.email, existingToken.token);

  const existingConfirmation = await getTwoFactorConfirmationByUserId(
    existingUser.id,
  );
  if (existingConfirmation) {
    await deleteTwoFactorConfirmation(existingUser.id);
  }

  await createTwoFactorConfirmation(existingUser.id);

  const newIsTwoFactorEnabled = !existingUser.isTwoFactorEnabled;
  await updateUserProfile(existingUser.id, {
    isTwoFactorEnabled: newIsTwoFactorEnabled,
  });

  return {
    isTwoFactorEnabled: newIsTwoFactorEnabled,
    showCodeInput: false,
    success: `2FA has been successfully ${newIsTwoFactorEnabled ? "enabled" : "disabled"} on your account.`,
  };
};
