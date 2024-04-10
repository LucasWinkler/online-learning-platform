import { db } from "../db";

export async function getLessonLengthInSeconds(
  lessonId: number,
): Promise<number | null> {
  try {
    const lessonContent = await db.lessonContent.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        text: true,
        video: true,
      },
    });

    if (!lessonContent) {
      throw new Error("Lesson content not found");
    }

    const { text, video } = lessonContent;

    return text?.length ?? video?.length ?? null;
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
