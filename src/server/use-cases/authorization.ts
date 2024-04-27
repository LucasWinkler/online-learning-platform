import { doesCourseExistByInstructor } from "~/server/data-access/course";

export const isAuthorizedForCourseManagement = async (
  courseId: string,
  instructorId: string,
) => {
  return await doesCourseExistByInstructor(courseId, instructorId);
};
