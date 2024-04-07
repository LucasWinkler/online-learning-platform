import { db } from "../db";

export const createUser = async (
  email: string,
  name: string,
  picture: string,
) => {
  const user = await db.user.upsert({
    create: { email, name, image: picture },
    update: {},
    where: { email },
  });

  return user;
};
