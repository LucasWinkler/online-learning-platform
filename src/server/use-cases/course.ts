import type {
  CourseCreationParams,
  FilteredPublishedCoursesParams,
} from "~/types/course";

import { FilteredPublishedCoursesSelect } from "~/lib/validators";
import {
  calculateTotalCourseLength,
  countCourseEnrollments,
  countPublishedLessonsInPublishedChapters,
  createCourse,
  deleteCourse,
  doesCourseExistBySlug,
  findFilteredPublishedCourses,
} from "~/server/data-access/course";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";

export const createNewCourse = async ({
  title,
  slug,
  instructorId,
}: CourseCreationParams) => {
  const exists = await doesCourseExistBySlug(slug);

  if (exists) {
    throw new Error(`Course already exists with the slug: ${slug}`);
  }

  return await createCourse({ title, slug, instructorId });
};

export const deleteCourseIfAuthorized = async (
  courseId: string,
  userId: string,
) => {
  const authorized = await isAuthorizedForCourseManagement(courseId, userId);
  if (!authorized) {
    throw new Error("Unauthorized access");
  }

  return await deleteCourse(courseId);
};

export const getFilteredPublishedCourses = async (
  params: FilteredPublishedCoursesParams,
) => {
  const courses = await findFilteredPublishedCourses({
    ...params,
    ...FilteredPublishedCoursesSelect,
  });

  const enhancedCourses = await Promise.all(
    courses.map(async (course) => {
      const enrollmentCount = await countCourseEnrollments(course.id);
      const lessonsCount = await countPublishedLessonsInPublishedChapters(
        course.id,
      );
      const totalLength = await calculateTotalCourseLength(course.id);

      return {
        ...course,
        enrollmentCount,
        lessonsCount,
        totalLength,
      };
    }),
  );

  return { courses: enhancedCourses, total: enhancedCourses.length };
};

// export const getUserPurchasedCourses = async (userId: string) => {
//   const courses = await findFilteredPublishedCourses(params);

//   return courses;
// };
