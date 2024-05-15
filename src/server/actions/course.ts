"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import slug from "slug";

import { CreateCourseSchema, DeleteCourseSchema } from "~/schemas/course";
import { auth } from "~/server/auth";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
import { createNewCourse } from "~/server/use-cases/course";

import {
  countCourseEnrollments,
  deleteCourseById,
} from "../data-access/course";

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

export const deleteCourse = async (
  values: z.infer<typeof DeleteCourseSchema>,
) => {
  try {
    const validatedFields = DeleteCourseSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid course slug" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id } = validatedFields.data;
    const authorized = await isAuthorizedForCourseManagement(id, user.id);

    if (!authorized) {
      return { error: "You are not authorized" };
    }

    const enrollmentCount = await countCourseEnrollments(id);
    if (enrollmentCount > 0) {
      return {
        error:
          "Can not delete course with enrolled students. You may unpublish the course instead.",
      };
    }

    const deletedCourse = await deleteCourseById(id);

    return {
      success: `${deletedCourse.title} has been successfully deleted.`,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "CourseNotFoundError") {
        return {
          error: error.message,
        };
      }
    }

    throw error;
  }
};
