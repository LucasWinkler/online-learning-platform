"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import slug from "slug";

import { CreateCourseSchema } from "~/schemas/course";
import { auth } from "~/server/auth";
import { createNewCourse } from "~/server/use-cases/course";

export const createCourse = async (
  values: z.infer<typeof CreateCourseSchema>,
) => {
  try {
    const validatedFields = CreateCourseSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid title or slug" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { title } = validatedFields.data;
    const generatedSlug = slug(title);

    await createNewCourse({
      title,
      slug: generatedSlug,
      instructorId: user.id,
    });

    return {
      success: "Course has been created successfully.",
      slug: generatedSlug,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "CourseExistsError") {
        return {
          error: error.message,
        };
      }
    }

    throw error;
  }
};
