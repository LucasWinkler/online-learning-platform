"use server";

import type { z } from "zod";

import { currentUser } from "~/lib/auth";
import { ChangeNameSchema } from "~/schemas/auth";
import { updateUserProfile } from "~/server/use-cases/user";

export const changeName = async (values: z.infer<typeof ChangeNameSchema>) => {
  const validatedFields = ChangeNameSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid name input.",
    };
  }

  const { name } = validatedFields.data;

  try {
    const user = await currentUser();
    if (!user) {
      return {
        error: "You are not authenticated.",
      };
    }

    if (user.name === name) {
      return {
        error: "You are already using that name.",
      };
    }

    await updateUserProfile(user.id, {
      name,
    });

    return {
      success: "Your name has been successfully changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your name.",
    };
  }
};
