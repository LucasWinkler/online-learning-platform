import { db } from "../db";

export async function getLessonLengthInSeconds(
  lessonId: string,
): Promise<number | null> {
  try {
    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        length: true,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return lesson.length;
  } catch (error) {
    console.error("Error fetching lesson length:", error);
    return null;
  }
}

/**
 * TODO: Create a function that grabs the next incomplete
 * lesson for the user to view at the end of a lesson or
 * when they load up the course.
 *
 * Idea:
 *  - getNextLessonForUser
 *     - getCompletedLessons
 *     - getNextIncompleteLessonInCurrentChapter
 *
 *     - if has nextIncompleteLessonInCurrentChapter
 *        - return lesson
 *     - else
 *        - getNextChapterWithIncompleteLessons
 *        - if has nextChapterWithIncompleteLessons
 *           - return firstIncompleteLessonInNextChapter
 *        - else
 *           - return null
 */
