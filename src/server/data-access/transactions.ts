import { db } from "~/server/db";

export const verifyUserEmailTransaction = async (
  userId: string,
  email: string,
  token: string,
) => {
  return await db.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { 
        emailVerified: new Date(), 
        email
       },
    });

    if (!updatedUser) {
      return { error: "Failed to verify email" };
    }

    await tx.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });
  });
};
