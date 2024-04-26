import type { RegisterUser } from "~/types/user";

import bcrypt from "bcryptjs";

import {
  createUser,
  deleteUserById,
  doesUserExistById,
  isUserEmailTaken,
  updateUser,
} from "~/server/data-access/user";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const registerUser = async (data: RegisterUser) => {
  const userExists = await isUserEmailTaken(data.email);
  if (userExists) {
    throw new Error(
      `Registration failed: Email (${data.email}) is already in use.`,
    );
  }

  data.password = await hashPassword(data.password);
  return await createUser(data);
};

// TODO: Allow user to upload image and add new email which must be verified
export const updateUserProfile = async (
  userId: string,
  data: { name?: string },
) => {
  if (!data.name) {
    return null;
  }

  return await updateUser(userId, data);
};

export const changeUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  const hashedPassword = await hashPassword(newPassword);

  return await updateUser(userId, { password: hashedPassword });
};

export const verifyEmailOnAccountLink = async (
  userId: string,
  emailVerified: Date,
) => {
  const user = await doesUserExistById(userId);
  if (!user) {
    throw new Error(
      "linkAccount email verification failed: User does not exist",
    );
  }

  return await updateUser(userId, { emailVerified });
};

export const deleteOwnAccount = async (
  userId: string,
  userToDeleteId: string,
) => {
  if (userId !== userToDeleteId) {
    throw new Error("Unauthorized: You can only delete your own account");
  }

  await deleteUserById(userId);
  return { message: "User deleted successfully." };
};
