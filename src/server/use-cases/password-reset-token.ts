import { createId } from "@paralleldrive/cuid2";

import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from "~/server/data-access/password-reset-token";

export const generatePasswordResetToken = async (email: string) => {
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    const { identifier, token } = existingToken;
    await deletePasswordResetToken(identifier, token);
  }

  const token = createId();
  const expiresIn20Minutes = new Date(Date.now() + 20 * 60 * 1000);

  return await createPasswordResetToken(email, token, expiresIn20Minutes);
};
