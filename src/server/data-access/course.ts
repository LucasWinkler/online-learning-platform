import type { Prisma } from "@prisma/client";
import type {
  CourseCreationParams,
  DashboardCoursesParams,
  DataAccessFilteredCoursesParams,
  UserPurchasedCoursesParams,
} from "~/types/course";

import { db } from "~/server/db";

export const findCourses = async () => {
  return await db.course.findMany();
};

export const findCourseById = async (id: string) => {
  return await db.course.findUnique({ where: { id: id } });
};

export const findCourseBySlug = async (slug: string) => {
  return await db.course.findUnique({ where: { slug: slug } });
};

export const createCourse = async ({
  title,
  slug,
  instructorId,
}: CourseCreationParams) => {
  return await db.course.create({
    data: {
      title,
      slug,
      instructorId,
    },
  });
};

export const updateCourse = async (
  id: string,
  updatedCourseData: Prisma.CourseUpdateInput,
) => {
  return await db.course.update({
    where: { id: id },
    data: updatedCourseData,
  });
};

export const deleteCourseById = async (id: string) => {
  return await db.course.delete({ where: { id: id } });
};

export const deleteCourseBySlug = async (slug: string) => {
  return await db.course.delete({ where: { slug: slug } });
};

export const findCourseSlugs = async () => {
  return db.course.findMany({
    select: { slug: true },
  });
};

export const findCourseWithChaptersBySlug = async (slug: string) => {
  return db.course.findUnique({
    where: { slug: slug },
    include: { chapters: true },
  });
};

export const findPublishedCourses = async (select?: Prisma.CourseSelect) => {
  return db.course.findMany({
    where: {
      publishedAt: { not: null },
      chapters: {
        some: {
          publishedAt: { not: null },
          lessons: { some: { publishedAt: { not: null } } },
        },
      },
    },
    select: select,
  });
};

export const findFilteredPublishedCourses = async ({
  search = "",
  sort = "popularity",
  order = "desc",
  page = 1,
  limit = 10,
  select,
}: DataAccessFilteredCoursesParams) => {
  const skip = (page - 1) * limit;
  const sortBy = {
    newest: { publishedAt: order },
    recent: { updatedAt: order },
    popularity: { courseEnrollments: { _count: order } },
  };

  return db.course.findMany({
    where: {
      publishedAt: {
        not: null,
      },
      chapters: {
        some: {
          publishedAt: {
            not: null,
          },
          lessons: {
            some: {
              publishedAt: {
                not: null,
              },
            },
          },
        },
      },
      title: {
        contains: search,
        mode: "insensitive",
      },
      instructor: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    orderBy: sortBy[sort],
    skip,
    take: limit,
    select,
  });
};

export const findUserPurchasedCourses = async ({
  userId,
  search = "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sort = "recent",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  order = "desc",
  page = 1,
  limit = 10,
}: UserPurchasedCoursesParams) => {
  const skip = (page - 1) * limit;

  return db.courseEnrollment.findMany({
    where: {
      studentId: userId,
      course: {
        title: { contains: search, mode: "insensitive" },
      },
    },
    include: {
      course: true, // Adjust according to needed course fields
    },
    // orderBy: { course: { [sort]: order } },
    skip,
    take: limit,
  });
};

export const findDashboardCourses = async ({
  sort = "createdAt",
  order = "desc",
  page = 1,
  limit = 10,
}: DashboardCoursesParams) => {
  const skip = (page - 1) * limit;

  return db.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      publishedAt: true,
      _count: { select: { courseEnrollments: true } },
    },
    orderBy: { [sort]: order },
    skip,
    take: limit,
  });
};

export const doesCourseExistBySlug = async (slug: string) => {
  return (await db.course.count({ where: { slug: slug } })) > 0;
};

export const doesCourseExistByInstructor = async (
  courseId: string,
  instructorId: string,
) => {
  return (await db.course.count({ where: { id: courseId, instructorId } })) > 0;
};

export const countCourseEnrollments = async (courseId: string) => {
  return db.courseEnrollment.count({
    where: { courseId },
  });
};

export const countPublishedLessonsInPublishedChapters = async (
  courseId: string,
) => {
  type ChapterWithLessonCount = {
    _count: {
      lessons: number;
    };
  };

  const chapters: ChapterWithLessonCount[] = await db.chapter.findMany({
    where: {
      courseId: courseId,
      publishedAt: { not: null },
    },
    select: {
      _count: {
        select: {
          lessons: {
            where: {
              publishedAt: { not: null },
            },
          },
        },
      },
    },
  });

  return chapters.reduce((total, chapter) => total + chapter._count.lessons, 0);
};

export const calculateTotalCourseLength = async (courseId: string) => {
  const lessons = await db.lesson.findMany({
    where: {
      chapter: {
        courseId: courseId,
        publishedAt: { not: null },
      },
      publishedAt: { not: null },
    },
    select: {
      length: true,
    },
  });

  return lessons.reduce((total, lesson) => total + (lesson.length ?? 0), 0);
};
