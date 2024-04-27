import type { Course, Prisma } from "@prisma/client";
import type {
  findDashboardCourses,
  findFilteredPublishedCourses,
  findUserPurchasedCourses,
} from "~/server/data-access/course";

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
