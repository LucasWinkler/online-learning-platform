import crypto from "crypto";

import {
  createTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "~/server/data-access/2fa-token";

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    const { identifier, token } = existingToken;
    await deleteTwoFactorToken(identifier, token);
  }

  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expiresIn20Minutes = new Date(Date.now() + 20 * 60 * 1000);

  return await createTwoFactorToken(email, token, expiresIn20Minutes);
};
