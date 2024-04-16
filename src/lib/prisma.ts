import { Prisma } from "@prisma/client";

export const CourseSelectForCoursesPage =
  Prisma.validator<Prisma.CourseSelect>()({
    title: true,
    description: true,
    price: true,
    slug: true,
    imageUrl: true,
    imageBlurDataUrl: true,
    instructor: {
      select: {
        name: true,
        image: true,
      },
    },
    discount: {
      select: {
        percentage: true,
      },
    },
  });
