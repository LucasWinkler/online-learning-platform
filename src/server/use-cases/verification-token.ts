import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "~/server/data-access/verification-token";

export const generateVerificationToken = async (email: string) => {
  const existingVerificationToken = await getVerificationTokenByEmail(email);
  if (existingVerificationToken) {
    await deleteVerificationToken(existingVerificationToken.id);
  }

  return await createVerificationToken(email);
};
