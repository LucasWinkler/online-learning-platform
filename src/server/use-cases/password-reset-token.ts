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

  return await createPasswordResetToken(email);
};
