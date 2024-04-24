import { db } from "../db";
import { getLessonLengthInSeconds } from "./lesson";

export async function getChapterTotalLengthInSeconds(
  chapterId: string,
): Promise<number | null> {
  try {
    const lessons = await db.lesson.findMany({
      where: {
        chapterId: chapterId,
      },
      select: {
        id: true,
      },
    });

    let totalLength = 0;

    for (const lesson of lessons) {
      const length = await getLessonLengthInSeconds(lesson.id);

      if (length !== null) {
        totalLength += length;
      }
    }

    return totalLength;
  } catch (error) {
    console.error("Error fetching chapter total length:", error);
    return null;
  }
}
