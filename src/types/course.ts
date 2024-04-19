import type { CourseSelectForHome } from "~/lib/validators";

import { type Prisma } from "@prisma/client";

export type CreateCourseInput = Prisma.CourseGetPayload<{
  select: {
    title: true;
    slug: true;
    instructorId: true;
  };
}>;

export type CourseForHome = Prisma.CourseGetPayload<{
  select: typeof CourseSelectForHome;
}> & {
  lengthInSeconds: number;
  numberOfLessons: number;
};
