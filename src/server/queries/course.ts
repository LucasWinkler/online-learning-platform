import { db } from "../db";
import { getChapterTotalLengthInSeconds } from "./chapter";

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
