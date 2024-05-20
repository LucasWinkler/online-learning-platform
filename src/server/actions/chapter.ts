"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  ChangeChapterOrderSchema,
  ChangeChapterTitleSchema,
  CreateChapterSchema,
  DeleteChapterSchema,
} from "~/schemas/chapter";
import { auth } from "~/server/auth";
import {
  deleteChapterById,
  doesChapterExistOnCourse,
  findChapterById,
  findChapterWithLessonsAndCourseById,
  updateChapter,
  updateChapterOrders,
} from "~/server/data-access/chapter";
import {
  countCourseEnrollments,
  findCourseById,
} from "~/server/data-access/course";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
import { createNewChapter } from "~/server/use-cases/chapter";

export const createChapter = async (
  values: z.infer<typeof CreateChapterSchema>,
) => {
  try {
    const validatedFields = CreateChapterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid title" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, title } = validatedFields.data;

    const course = await findCourseById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    await createNewChapter(title, course.id);

    revalidatePath(`/manage/courses/${course.slug}`);

    return {
      success: "Chapter has been created successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ChapterExistsError") {
        return {
          error: error.message,
        };
      }
    }

    throw error;
  }
};

export const updateChapterOrder = async (
  values: z.infer<typeof ChangeChapterOrderSchema>,
) => {
  try {
    const validatedFields = ChangeChapterOrderSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, chapterOrderUpdates } = validatedFields.data;

    const course = await findCourseById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    if (course.instructorId !== user.id) {
      return { error: "You are not authorized" };
    }

    await updateChapterOrders(chapterOrderUpdates);
    revalidatePath(`/manage/courses/${course.slug}`);

    return {
      success: "Chapter order has been successfully updated.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while updating chapter order.",
    };
  }
};

export const deleteChapter = async (
  values: z.infer<typeof DeleteChapterSchema>,
) => {
  try {
    const validatedFields = DeleteChapterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { id, title } = validatedFields.data;
    const chapter = await findChapterWithLessonsAndCourseById(id);
    if (!chapter) {
      return { error: "Chapter not found" };
    }

    if (title.toLowerCase() !== chapter.title.toLowerCase()) {
      return { error: "Invalid chapter title" };
    }

    const courseId = chapter.courseId;
    const courseSlug = chapter.course.slug;

    const authorized = await isAuthorizedForCourseManagement(courseId, user.id);
    if (!authorized) {
      return { error: "You are not authorized" };
    }

    const enrollmentCount = await countCourseEnrollments(courseId);
    if (enrollmentCount > 0) {
      return {
        error:
          "You can not delete a chapter with students. You may unpublish the chapter instead, but those students will still have access to the chapter.",
      };
    }

    await deleteChapterById(id);
    revalidatePath(`/manage/courses/${courseSlug}`);

    return {
      success: `${chapter.title} has been successfully deleted.`,
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

export const changeChapterTitle = async (
  values: z.infer<typeof ChangeChapterTitleSchema>,
) => {
  try {
    const validatedFields = ChangeChapterTitleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, id, title } = validatedFields.data;

    const course = await findCourseById(courseId);
    if (course?.instructorId !== user.id) {
      return {
        error: "You are not authorized",
      };
    }

    const chapter = await findChapterById(id);
    if (!chapter) {
      return {
        error: "Chapter not found",
      };
    }

    if (chapter.title === title) {
      return {
        error: "Title is the same as the current one",
      };
    }

    const doesChapterExistWithTitle = await doesChapterExistOnCourse(
      title,
      course.id,
    );
    if (doesChapterExistWithTitle) {
      return {
        error: "Chapter with the same title already exists",
      };
    }

    const updatedChapter = await updateChapter(id, {
      title,
    });

    revalidatePath(
      `/manage/courses/${course.slug}/chapter/${updatedChapter.id}`,
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
