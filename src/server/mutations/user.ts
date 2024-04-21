import { db } from "../db";

// Currently always upserts user, but may change in the future
// to allow changing certain fields from a settings page.
// Right now this allows a user to go through their provider
// to change their picture or name etc...
export const createUserFromAuth0 = async (
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
        isEmailVerified: email_verified,
      },
      update: {
        name,
        image: picture,
        isEmailVerified: email_verified,
      },
      where: { email },
    });

    return user;
  } catch (error: unknown) {
    console.error("Error creating user", error);
    throw new Error("Failed to create user");
  }
};
