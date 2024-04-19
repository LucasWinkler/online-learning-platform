"use server";

import { CourseSelectForHome } from "~/lib/validators";
import { db } from "~/server/db";
import { type CourseForHome } from "~/types/course";

export type CourseSortCriteria = "popular" | "newest" | "recent";
export type CourseSortOrder = "asc" | "desc";

export type CourseListForHome = {
  courses: CourseForHome[];
  total: number;
  page: number;
  limit: number;
};

export type CourseSearchParams = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  sort?: CourseSortCriteria;
  order?: CourseSortOrder;
};

export default async function GetCoursesForHome({
  search,
  page = 1,
  limit = 10,
  sort = "popular",
  order = "desc",
}: CourseSearchParams) {
  const pageNumber = page;
  const limitNumber = limit;
  const skipNumber = (pageNumber - 1) * limitNumber;

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      title: {
        contains: search,
        mode: "insensitive",
      },
      chapters: {
        some: {
          isPublished: true,
          lessons: {
            some: {
              isPublished: true,
            },
          },
        },
      },
    },
    select: {
      ...CourseSelectForHome,
    },
    orderBy:
      sort === "popular"
        ? {
            courseEnrollments: {
              _count: order,
            },
          }
        : sort === "newest"
          ? {
              createdAt: order,
            }
          : {
              updatedAt: order,
            },
    skip: skipNumber,
    take: limitNumber,
  });

  const totalCourses = await db.course.count({
    where: {
      isPublished: true,
      title: {
        contains: search!,
        mode: "insensitive",
      },
      chapters: {
        some: {
          isPublished: true,
          lessons: {
            some: {
              isPublished: true,
            },
          },
        },
      },
    },
  });

  return {
    courses: courses.map((course) => ({
      ...course,
      numberOfLessons: course.lessons.length,
      lengthInSeconds: course.lessons.reduce(
        (acc, lesson) => acc + (lesson.length ?? 0),
        0,
      ),
    })),
    total: totalCourses,
    page: pageNumber,
    limit: limitNumber,
  };
}
