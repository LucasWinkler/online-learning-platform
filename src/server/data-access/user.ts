import type { RegisterUser } from "~/types/user";

import { type Prisma } from "@prisma/client";

import { db } from "~/server/db";

export const createUser = async (data: RegisterUser) => {
  return await db.user.create({
    data,
  });
};

export const findUsers = async (
  filter: { name?: string; email?: string },
  page: number,
  limit: number,
) => {
  return db.user.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
  });
};

export const findUserById = async (id: string) => {
  return await db.user.findUnique({ where: { id } });
};

export const findUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return await db.user.update({ where: { id }, data });
};

export const deleteUserById = async (id: string) => {
  return await db.user.delete({ where: { id } });
};

export const doesUserExistById = async (id: string) => {
  return (await db.user.count({ where: { id } })) > 0;
};

export const isUserEmailTaken = async (email: string) => {
  return (await db.user.count({ where: { email } })) > 0;
};
