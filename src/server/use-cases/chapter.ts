import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";

import {
  createChapter,
  deleteChapterById,
  doesChapterExistOnCourse,
  findLastChapter,
} from "../data-access/chapter";

export const createNewChapter = async (title: string, courseId: string) => {
  const exists = await doesChapterExistOnCourse(title, courseId);
  if (exists) {
    const error = new Error("Chapter already exists with that title.");
    error.name = "ChapterExistsError";
    throw error;
  }

  const lastChapter = await findLastChapter(courseId);
  const nextOrderNumber = lastChapter ? lastChapter.order + 1 : 0;

  return await createChapter({ title, courseId, order: nextOrderNumber });
};

export const deleteChapterIfAuthorized = async (
  courseId: string,
  chapterId: string,
  userId: string,
) => {
  const authorized = await isAuthorizedForCourseManagement(courseId, userId);
  if (!authorized) {
    const error = new Error("Unauthorized access");
    error.name = "UnauthorizedError";
    throw error;
  }

  return await deleteChapterById(chapterId);
};
