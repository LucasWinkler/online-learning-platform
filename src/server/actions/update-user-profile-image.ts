"use server";

import { revalidatePath } from "next/cache";

import { unstable_update } from "~/server/auth";

export const updateUserProfileImage = async (image: string) => {
  await unstable_update({ user: { image: image } });
  revalidatePath("/", "layout");
};
