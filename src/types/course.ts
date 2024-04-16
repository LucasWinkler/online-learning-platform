import type { CourseSelectForCoursesPage } from "~/lib/prisma/validators";

import { type Prisma } from "@prisma/client";

export type CreateCourseInput = Prisma.CourseGetPayload<{
  select: {
    title: true;
    slug: true;
    instructorId: true;
  };
}>;

export type CoursesPagePayload = Prisma.CourseGetPayload<{
  select: typeof CourseSelectForCoursesPage;
}> & {
  _count: { courseEnrollments: number };
  lengthInSeconds: number;
  numberOfLessons: number;
};
