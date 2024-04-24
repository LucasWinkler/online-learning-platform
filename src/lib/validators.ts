import { Prisma } from "@prisma/client";

export const CourseSelectForHome = Prisma.validator<Prisma.CourseSelect>()({
  title: true,
  description: true,
  price: true,
  slug: true,
  imageUrl: true,
  imageBlurDataUrl: true,
  createdAt: true,
  updatedAt: true,
  instructor: {
    select: {
      name: true,
    },
  },
  lessons: {
    where: {
      isPublished: true,
    },
    select: {
      length: true,
    },
  },
  _count: {
    select: {
      courseEnrollments: true,
    },
  },
});
