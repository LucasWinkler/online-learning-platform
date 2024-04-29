import { db } from "~/server/db";

export const createTwoFactorConfirmation = async (userId: string) => {
  return await db.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });
};

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  return await db.twoFactorConfirmation.findUnique({
    where: {
      userId,
    },
  });
};

export const deleteTwoFactorConfirmation = async (userId: string) => {
  return await db.twoFactorConfirmation.delete({
    where: {
      userId,
    },
  });
};
