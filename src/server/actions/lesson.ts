"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { ChangeLessonOrderSchema, CreateLessonSchema } from "~/schemas/lesson";
import { auth } from "~/server/auth";
import { findCourseWithChaptersAndLessonsById } from "~/server/data-access/course";
import { updateLessonOrders } from "~/server/data-access/lesson";

import { createNewLesson } from "../use-cases/lesson";

export const createLesson = async (
  values: z.infer<typeof CreateLessonSchema>,
) => {
  try {
    const validatedFields = CreateLessonSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, chapterId, title } = validatedFields.data;

    const course = await findCourseWithChaptersAndLessonsById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    await createNewLesson(title, courseId, chapterId);
    revalidatePath(`/manage/courses/${course.slug}/chapter/${chapterId}`);

    return {
      success: "Lesson has been created successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "LessonExistsError") {
        return {
          error: error.message,
        };
      }
    }

    throw error;
  }
};

export const updateLessonOrder = async (
  values: z.infer<typeof ChangeLessonOrderSchema>,
) => {
  try {
    const validatedFields = ChangeLessonOrderSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, chapterId, lessonOrderUpdates } = validatedFields.data;

    const course = await findCourseWithChaptersAndLessonsById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    if (course.instructorId !== user.id) {
      return { error: "You are not authorized" };
    }

    if (course.chapters.length === 0) {
      return { error: "Course does not have any chapters" };
    }

    const lessonIds = lessonOrderUpdates.map((lesson) => lesson.id);

    const lessonsExist = lessonIds.every((lessonId) =>
      course.chapters.some((chapter) =>
        chapter.lessons.some((lesson) => lesson.id === lessonId),
      ),
    );

    if (!lessonsExist) {
      return {
        error:
          "One or more lessons do not exist in the specified course chapters",
      };
    }

    await updateLessonOrders(lessonOrderUpdates);
    revalidatePath(`/manage/courses/${course.slug}/chapter/${chapterId}`);

    return {
      success: "Lesson order has been successfully updated.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while updating lesson order.",
    };
  }
};
