"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import slug from "slug";

import {
  ChangeCourseDescriptionSchema,
  ChangeCourseTitleSchema,
  CreateCourseSchema,
  DeleteCourseSchema,
} from "~/schemas/course";
import { auth } from "~/server/auth";
import {
  countCourseEnrollments,
  deleteCourseById,
  findCourseById,
  updateCourse,
} from "~/server/data-access/course";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
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

    revalidatePath("/manage/courses");

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

    revalidatePath("/manage/courses");

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

export const changeCourseTitle = async (
  values: z.infer<typeof ChangeCourseTitleSchema>,
) => {
  try {
    const validatedFields = ChangeCourseTitleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid title" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id, title } = validatedFields.data;
    const course = await findCourseById(id);

    if (course?.instructorId !== user.id) {
      return {
        error: "You are not authorized",
      };
    }

    if (course.title === title) {
      return {
        error: "Title is the same as the current one",
      };
    }

    const updatedCourse = await updateCourse(id, {
      title,
    });

    revalidatePath(`/manage/courses/${updatedCourse.slug}`);

    return {
      success: "Title has successfully been changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your title.",
    };
  }
};

export const changeCourseDescription = async (
  values: z.infer<typeof ChangeCourseDescriptionSchema>,
) => {
  try {
    const validatedFields = ChangeCourseDescriptionSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid title" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id, description } = validatedFields.data;
    const course = await findCourseById(id);

    if (course?.instructorId !== user.id) {
      return {
        error: "You are not authorized",
      };
    }

    if (course.description === description) {
      return {
        error: "Description is the same as the current one",
      };
    }

    const updatedCourse = await updateCourse(id, {
      description,
    });

    revalidatePath(`/manage/courses/${updatedCourse.slug}`);

    return {
      success: "Description has successfully been changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your description.",
    };
  }
};
