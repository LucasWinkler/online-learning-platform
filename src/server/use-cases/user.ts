import type { RegisterUser } from "~/types/user";

import { type Prisma } from "@prisma/client";
import { hashSync } from "bcrypt-edge";

import { getPasswordResetTokenByToken } from "~/server/data-access/password-reset-token";
import { verifyUserEmailTransaction } from "~/server/data-access/transactions";
import {
  createUser,
  deleteUserById,
  doesUserExistById,
  findUserByEmail,
  isUserEmailTaken,
  updateUser,
} from "~/server/data-access/user";
import { getVerificationTokenByToken } from "~/server/data-access/verification-token";

export const hashPassword = async (password: string) => {
  return hashSync(password, 10);
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

export const updateUserProfile = async (
  userId: string,
  data: Pick<
    Prisma.UserUpdateInput,
    "name" | "image" | "isTwoFactorEnabled" | "password" | "email"
  >,
) => {
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined),
  );

  if (Object.keys(updateData).length === 0) {
    throw new Error("No updated data provided for user profile");
  }

  return await updateUser(userId, data);
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  const hashedPassword = await hashPassword(newPassword);

  return await updateUser(userId, { password: hashedPassword });
};

export const resetUserPasswordWithToken = async (
  newPassword: string,
  token: string,
) => {
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasTokenExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasTokenExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await findUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "User not found" };
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateUser(existingUser.id, { password: hashedPassword });

  return { success: "Password successfully changed" };
};

export const updateUserEmailVerified = async (userId: string) => {
  const user = await doesUserExistById(userId);
  if (!user) {
    return { error: "User does not exist" };
  }

  return await updateUser(userId, { emailVerified: new Date() });
};

export const verifyUserEmail = async (
  token: string,
): Promise<{ error?: string } | undefined> => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await findUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "Invalid email address" };
  }

  return await verifyUserEmailTransaction(
    existingUser.id,
    existingUser.email,
    existingToken.token,
  );
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
