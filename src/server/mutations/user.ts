import { db } from "../db";

export const createUser = async (
  email: string,
  name: string,
  picture: string,
  email_verified: boolean,
) => {
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
};
