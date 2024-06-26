import type { Prisma } from "@prisma/client";

import { db } from "~/server/db";

export const createPasswordResetToken = async (
  email: string,
  token: string,
  expiresAt: Date,
): Promise<Prisma.PasswordResetTokenCreateInput> => {
  return await db.passwordResetToken.create({
    data: {
      identifier: email,
      token,
      expiresAt,
    },
  });
};

export const getPasswordResetToken = async (email: string, token: string) => {
  return await db.passwordResetToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });
};

export const getPasswordResetTokenByToken = async (token: string) => {
  return await db.passwordResetToken.findFirst({
    where: {
      token,
    },
  });
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  return await db.passwordResetToken.findFirst({
    where: { identifier: email },
  });
};

export const deletePasswordResetToken = async (
  email: string,
  token: string,
) => {
  return await db.passwordResetToken.delete({
    where: { identifier_token: { identifier: email, token } },
  });
};
