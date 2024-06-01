import {
  createLesson,
  doesLessonExistOnChapter,
  findLastLesson,
} from "~/server/data-access/lesson";

export const createNewLesson = async (
  title: string,
  courseId: string,
  chapterId: string,
) => {
  const exists = await doesLessonExistOnChapter(title, chapterId);
  if (exists) {
    const error = new Error("Lesson already exists with that title.");
    error.name = "LessonExistsError";
    throw error;
  }

  const lastLesson = await findLastLesson(chapterId);
  const nextOrderNumber = lastLesson ? lastLesson.order + 1 : 0;

  return await createLesson({
    title,
    order: nextOrderNumber,
    courseId,
    chapterId,
  });
};

// export const deleteChapterIfAuthorized = async (
//   courseId: string,
//   chapterId: string,
//   userId: string,
// ) => {
//   const authorized = await isAuthorizedForCourseManagement(courseId, userId);
//   if (!authorized) {
//     const error = new Error("Unauthorized access");
//     error.name = "UnauthorizedError";
//     throw error;
//   }

//   return await deleteChapterById(chapterId);
// };
