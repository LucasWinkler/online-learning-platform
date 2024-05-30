import type { ChangeLessonOrderSchema } from "~/schemas/lesson";
import type { LessonCreationParams } from "~/types/lesson";
import type { z } from "zod";

import { type Prisma } from "@prisma/client";

import { db } from "~/server/db";

export const createLesson = async ({
  title,
  order,
  courseId,
  chapterId,
}: LessonCreationParams) => {
  return await db.lesson.create({
    data: {
      title: title,
      order: order,
      chapterId: chapterId,
      courseId: courseId,
    },
  });
};

export const findLastLesson = async (chapterId: string) => {
  return await db.lesson.findFirst({
    where: { chapterId: chapterId },
    orderBy: { order: "desc" },
  });
};

export const findLessonById = async (id: string) => {
  return await db.lesson.findUnique({ where: { id: id } });
};

export const findLessonIds = async () => {
  return await db.lesson.findMany({ select: { id: true } });
};

export const doesLessonExistOnChapter = async (
  title: string,
  chapterId: string,
) => {
  return (
    (await db.lesson.count({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
        chapterId: chapterId,
      },
    })) > 0
  );
};

export const updateLesson = async (
  id: string,
  updatedLessonData: Prisma.LessonUpdateInput,
) => {
  return await db.lesson.update({
    where: { id: id },
    data: updatedLessonData,
  });
};

export const updateLessonOrders = async (
  lessons: z.infer<typeof ChangeLessonOrderSchema>["lessonOrderUpdates"],
) => {
  return await db.$transaction(
    lessons.map((lesson) =>
      db.lesson.update({
        where: { id: lesson.id },
        data: { order: lesson.order },
      }),
    ),
  );
};

export const findLessonByIdWithCourseAndChapters = async (id: string) => {
  return await db.lesson.findUnique({
    where: { id: id },
    include: { course: true, chapter: true },
  });
};
