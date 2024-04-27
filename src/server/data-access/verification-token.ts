import { createId } from "@paralleldrive/cuid2";

import { db } from "~/server/db";

export const createVerificationToken = async (email: string) => {
  const expiresIn24Hours = new Date(Date.now() + 3600 * 1000 * 24);

  return await db.verificationToken.create({
    data: {
      identifier: email,
      token: createId(),
      expires: expiresIn24Hours,
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
