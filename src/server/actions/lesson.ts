"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  ChangeLessonDescriptionSchema,
  ChangeLessonOrderSchema,
  ChangeLessonTitleSchema,
  CreateLessonSchema,
} from "~/schemas/lesson";
import { auth } from "~/server/auth";
import { findCourseWithChaptersAndLessonsById } from "~/server/data-access/course";
import {
  doesLessonExistOnChapter,
  findLessonByIdWithCourseAndChapters,
  updateLesson,
  updateLessonOrders,
} from "~/server/data-access/lesson";

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

export const changeLessonTitle = async (
  values: z.infer<typeof ChangeLessonTitleSchema>,
) => {
  try {
    const validatedFields = ChangeLessonTitleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id, title } = validatedFields.data;

    const lesson = await findLessonByIdWithCourseAndChapters(id);
    if (!lesson) {
      return {
        error: "Chapter not found",
      };
    }

    if (lesson.title === title) {
      return {
        error: "Title is the same as the current one",
      };
    }

    const doesLessonExistWithTitle = await doesLessonExistOnChapter(
      title,
      lesson.course.id,
    );
    if (doesLessonExistWithTitle) {
      return {
        error: "Lesson with the same title already exists in this chapter",
      };
    }

    const updatedLesson = await updateLesson(id, {
      title,
    });

    revalidatePath(
      `/manage/courses/${lesson.course.slug}/chapter/${updatedLesson.chapterId}/lesson/${updatedLesson.id}`,
    );

    return {
      success: "Title has successfully been changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your title.",
    };
  }
};

export const changeLessonDescription = async (
  values: z.infer<typeof ChangeLessonDescriptionSchema>,
) => {
  try {
    const validatedFields = ChangeLessonDescriptionSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid description" };
    }

    const user = (await auth())?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id, description } = validatedFields.data;

    const lesson = await findLessonByIdWithCourseAndChapters(id);

    if (lesson?.course.instructorId !== user.id) {
      return {
        error: "You are not authorized",
      };
    }

    if (lesson.description === description) {
      return {
        error: "Description is the same as the current one",
      };
    }

    await updateLesson(id, {
      description,
    });

    revalidatePath(
      `/manage/courses/${lesson.course.slug}/chapter/${lesson.chapterId}/lesson/${lesson.id}`,
    );

    return {
      success: "Description has successfully been changed.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while changing your description.",
    };
  }
};
