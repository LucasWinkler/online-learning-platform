import { db } from "~/server/db";

export const doesAccountExistByUserId = async (userId: string) => {
  return !!(await db.account.count({
    where: {
      userId,
    },
  }));
};
