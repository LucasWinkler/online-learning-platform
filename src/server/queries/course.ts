import { CourseSelectForHome } from "~/lib/validators";

import { db } from "../db";
import { getChapterTotalLengthInSeconds } from "./chapter";

/**
 * Find all published courses that have at least one published
 * chapter that also has at least one published lesson.
 *
 * Select required fields for the frontend including custom
 * fields such as the number of enrollments, number of
 * lessons and the total length of the course in seconds.
 * @returns courses
 */
export const getCoursesForHome = async () => {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
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
    orderBy: [
      {
        courseEnrollments: {
          _count: "desc",
        },
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return courses.map((course) => ({
    ...course,
    numberOfLessons: course.lessons.length,
    lengthInSeconds: course.lessons.reduce(
      (acc, lesson) => acc + (lesson.length ?? 0),
      0,
    ),
  }));
};

export async function getEnrollmentCount(
  courseId: number,
): Promise<number | null> {
  try {
    const count = await db.courseEnrollment.count({
      where: {
        courseId: courseId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching enrollment count", error);
    return null;
  }
}

export async function getCourseTotalLengthInSeconds(
  courseId: number,
): Promise<number | null> {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    let totalLength = 0;

    for (const chapter of course.chapters) {
      const chapterLength = await getChapterTotalLengthInSeconds(chapter.id);

      if (chapterLength !== null) {
        totalLength += chapterLength;
      }
    }

    return totalLength;
  } catch (error) {
    console.error("Error fetching total length of course in seconds:", error);
    return null;
  }
}
