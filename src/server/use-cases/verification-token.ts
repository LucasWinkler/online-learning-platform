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

  return await createVerificationToken(email);
};
