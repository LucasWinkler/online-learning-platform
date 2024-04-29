import { Prisma } from "@prisma/client";

// select type for courses that will be used in the public /courses route and /app/courses route
export const FilteredPublishedCoursesSelect =
  Prisma.validator<Prisma.CourseSelect>()({
    title: true,
    description: true,
    price: true,
    slug: true,
    image: true,
    imageBlurData: true,
    createdAt: true,
    updatedAt: true,
    instructor: {
      select: {
        name: true,
      },
    },
    lessons: {
      where: {
        publishedAt: {
          not: null,
        },
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
