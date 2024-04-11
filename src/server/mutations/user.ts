import { db } from "../db";

export const createUser = async (
  email: string,
  name: string,
  picture: string,
  email_verified: boolean,
) => {
  try {
    const user = await db.user.upsert({
      create: {
        email,
        name,
        image: picture,
        isVerified: email_verified,
      },
      update: {},
      where: { email },
    });

    return user;
  } catch (error: unknown) {
    console.error("Error creating user", error);
    throw new Error("Failed to create user");
  }
};
