import { db } from "~/server/db";

export const createTwoFactorToken = async (
  email: string,
  token: string,
  expiresAt: Date,
) => {
  return await db.twoFactorToken.create({
    data: {
      identifier: email,
      token,
      expiresAt,
    },
  });
};

export const getTwoFactorTokenByToken = async (token: string) => {
  return await db.twoFactorToken.findFirst({
    where: {
      token,
    },
  });
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  return await db.twoFactorToken.findFirst({
    where: {
      identifier: email,
    },
  });
};

export const deleteTwoFactorToken = async (email: string, token: string) => {
  return await db.twoFactorToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });
};
