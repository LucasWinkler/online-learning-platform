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
