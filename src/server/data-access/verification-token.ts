import { createId } from "@paralleldrive/cuid2";

import { db } from "~/server/db";

export const createVerificationToken = async (email: string) => {
  return await db.verificationToken.create({
    data: {
      email,
      token: createId(),
      expires: new Date(Date.now() + 3600 * 1000),
    },
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const deleteVerificationToken = async (id: string) => {
  return await db.verificationToken.delete({
    where: {
      id,
    },
  });
};
