import { createId } from "@paralleldrive/cuid2";

import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "~/server/data-access/verification-token";

export const generateVerificationToken = async (email: string) => {
  const existingVerificationToken = await getVerificationTokenByEmail(email);
  if (existingVerificationToken) {
    const { identifier, token } = existingVerificationToken;
    await deleteVerificationToken(identifier, token);
  }

  const token = createId();
  const expiresIn24Hours = new Date(Date.now() + 3600 * 1000 * 24);

  return await createVerificationToken(email, token, expiresIn24Hours);
};
