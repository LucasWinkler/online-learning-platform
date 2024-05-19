import type { Prisma } from "@prisma/client";
import type { ChapterCreationParams } from "~/types/chapter";

import { type z } from "zod";

import { type ChangeChapterOrderSchema } from "~/schemas/chapter";
import { db } from "~/server/db";

export const findChapters = async () => {
  return await db.course.findMany();
};

export const findChaptersByCourseId = async (courseId: string) => {
  return await db.chapter.findMany({ where: { courseId: courseId } });
};

export const findChaptersByCourseSlug = async (slug: string) => {
  return await db.chapter.findMany({ where: { course: { slug: slug } } });
};

export const findChapterById = async (id: string) => {
  return await db.course.findUnique({ where: { id: id } });
};

export const createChapter = async ({
  title,
  courseId,
  order,
}: ChapterCreationParams) => {
  return await db.chapter.create({
    data: {
      title: title,
      courseId: courseId,
      order: order,
    },
  });
};

export const updateChapter = async (
  id: string,
  updatedChapterData: Prisma.ChapterUpdateInput,
) => {
  return await db.chapter.update({
    where: { id: id },
    data: updatedChapterData,
  });
};

export const deleteChapterById = async (id: string) => {
  return await db.course.delete({ where: { id: id } });
};

export const findLastChapter = async (courseId: string) => {
  return await db.chapter.findFirst({
    where: { courseId: courseId },
    orderBy: { order: "desc" },
  });
};

export const findCoursesForInstructor = async (instructorId: string) => {
  return db.course.findMany({
    where: {
      instructorId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      publishedAt: true,
      _count: { select: { courseEnrollments: true } },
    },
  });
};

export const doesChapterExistById = async (id: string) => {
  return (await db.chapter.count({ where: { id: id } })) > 0;
};

export const doesChapterExistOnCourse = async (
  title: string,
  courseId: string,
) => {
  return (
    (await db.chapter.count({ where: { title: title, courseId: courseId } })) >
    0
  );
};

export const updateChapterOrders = async (
  chapters: z.infer<typeof ChangeChapterOrderSchema>["chapterOrderUpdates"],
) => {
  return await db.$transaction(
    chapters.map((chapter) =>
      db.chapter.update({
        where: { id: chapter.id },
        data: { order: chapter.order },
      }),
    ),
  );
};
