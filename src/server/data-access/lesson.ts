import type { ChangeLessonOrderSchema } from "~/schemas/lesson";
import type { LessonCreationParams } from "~/types/lesson";
import type { z } from "zod";

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
