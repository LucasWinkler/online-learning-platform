"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  ChangeLessonDescriptionSchema,
  ChangeLessonOrderSchema,
  ChangeLessonTitleSchema,
  CreateLessonSchema,
  DeleteLessonSchema,
} from "~/schemas/lesson";
import { auth } from "~/server/auth";
import {
  countCourseEnrollments,
  findCourseWithChaptersAndLessonsById,
} from "~/server/data-access/course";
import {
  deleteLessonById,
  doesLessonExistOnChapter,
  findLessonByIdWithCourseAndChapters,
  updateLesson,
  updateLessonOrders,
} from "~/server/data-access/lesson";

import { isAuthorizedForCourseManagement } from "../use-cases/authorization";
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

export const deleteLesson = async (
  values: z.infer<typeof DeleteLessonSchema>,
) => {
  try {
    const validatedFields = DeleteLessonSchema.safeParse(values);
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
      return { error: "Lesson not found" };
    }

    if (title.toLowerCase() !== lesson.title.toLowerCase()) {
      return { error: "Invalid lesson title" };
    }

    const courseId = lesson.course.id;
    const courseSlug = lesson.course.slug;

    const authorized = await isAuthorizedForCourseManagement(courseId, user.id);
    if (!authorized) {
      return { error: "You are not authorized" };
    }

    const enrollmentCount = await countCourseEnrollments(courseId);
    if (enrollmentCount > 0) {
      return {
        error:
          "You can not delete a lesson with students. You may unpublish the lesson instead, but those students will still have access to the course.",
      };
    }

    await deleteLessonById(id);
    revalidatePath(`/manage/courses/${courseSlug}/chapter/${lesson.chapterId}`);

    return {
      success: `${lesson.title} has been successfully deleted.`,
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
