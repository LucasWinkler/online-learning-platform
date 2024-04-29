import { db } from "~/server/db";

export const createVerificationToken = async (
  email: string,
  token: string,
  expiresAt: Date,
) => {
  return await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expiresAt,
    },
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  return await db.verificationToken.findFirst({
    where: {
      identifier: email,
    },
  });
};

export const getVerificationTokenByToken = async (token: string) => {
  return await db.verificationToken.findFirst({
    where: {
      token,
    },
  });
};

export const deleteVerificationToken = async (
  identifier: string,
  token: string,
) => {
  return await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  });
};
