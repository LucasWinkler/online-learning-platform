import type { Course } from "@prisma/client";
import type {
  findCoursesForInstructor,
  findDashboardCourses,
  findFilteredPublishedCourses,
  findUserPurchasedCourses,
} from "~/server/data-access/course";

import { Prisma } from "@prisma/client";

export type CourseCreationParams = Pick<
  Course,
  "title" | "slug" | "instructorId"
>;

export type FilteredPublishedCoursesParams = {
  search?: string;
  sort?: "popularity" | "newest" | "recent";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type DataAccessFilteredCoursesParams = FilteredPublishedCoursesParams & {
  select?: Prisma.CourseSelect;
};

export const CourseSelectForInstructor =
  Prisma.validator<Prisma.CourseSelect>()({
    id: true,
    title: true,
    slug: true,
    description: true,
    price: true,
    publishedAt: true,
    _count: { select: { courseEnrollments: true } },
  });

export type CourseForInstructor = Prisma.CourseGetPayload<{
  select: typeof CourseSelectForInstructor;
}>;

export type CoursesForInstructorResult = Prisma.PromiseReturnType<
  typeof findCoursesForInstructor
>;

export type FilteredPublishedCoursesResult = Prisma.PromiseReturnType<
  typeof findFilteredPublishedCourses
>;

export type UserPurchasedCoursesParams = {
  userId: string;
  search?: string;
  sort?: "recent";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type UserPurchasedCoursesResult = Prisma.PromiseReturnType<
  typeof findUserPurchasedCourses
>;

export type DashboardCoursesParams = {
  sort?: "createdAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type DashboardCoursesResult = Prisma.PromiseReturnType<
  typeof findDashboardCourses
>;

export type GetPublishedCoursesResult = FilteredPublishedCoursesResult;

export type GetUsersPurchasedCoursesResult = UserPurchasedCoursesResult;

export type GetDashboardCoursesResult = DashboardCoursesResult;
