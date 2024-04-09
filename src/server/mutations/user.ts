import { db } from "../db";

export const createUser = async (
  email: string,
  name: string,
  picture: string,
  email_verified: boolean,
) => {
  // Choosing to update on each login since it's a small app
  // with low db calls and I want to keep their data up-to-date.
  const user = await db.user.upsert({
    create: {
      email,
      name,
      image: picture,
      isVerified: email_verified,
    },
    update: {
      email,
      name,
      image: picture,
      isVerified: email_verified,
    },
    where: { email },
  });

  return user;
};
