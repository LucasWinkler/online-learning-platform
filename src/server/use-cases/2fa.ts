import crypto from "crypto";

import { sendTwoFactorTokenEmail } from "~/lib/mail";
import { auth } from "~/server/auth";
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
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return {
      showCodeInput: !!code,
      error: "You are not authenticated.",
    };
  }

  const doesUserHaveOAuthAccount = await doesAccountExistByUserId(user.id);
  if (doesUserHaveOAuthAccount || user.isOAuth) {
    return {
      showCodeInput: !!code,
      error: "Your 2FA is handled by your third-party social account.",
    };
  }

  if (!code) {
    const existingToken = await getTwoFactorTokenByEmail(user.email);

    if (!existingToken || existingToken.expiresAt < new Date()) {
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendTwoFactorTokenEmail(user.email, twoFactorToken.token);

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
    const twoFactorToken = await generateTwoFactorToken(user.email);
    await sendTwoFactorTokenEmail(user.email, twoFactorToken.token);

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

  await deleteTwoFactorToken(user.email, existingToken.token);

  const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id);
  if (existingConfirmation) {
    await deleteTwoFactorConfirmation(user.id);
  }

  await createTwoFactorConfirmation(user.id);

  const newIsTwoFactorEnabled = !user.isTwoFactorEnabled;
  await updateUserProfile(user.id, {
    isTwoFactorEnabled: newIsTwoFactorEnabled,
  });

  return {
    isTwoFactorEnabled: newIsTwoFactorEnabled,
    showCodeInput: false,
    success: `2FA has been successfully ${newIsTwoFactorEnabled ? "enabled" : "disabled"} on your account.`,
  };
};
