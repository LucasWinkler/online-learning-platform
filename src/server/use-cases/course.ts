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
    const error = new Error(`Course already exists with the title: ${title}.`);
    error.name = "CourseExistsError";
    throw error;
  }

  return await createCourse({ title, slug, instructorId });
};

// TODO: Get 5 featured courses for home page if no user is logged in
// Most likely will be the 5 most popular courses
// No pagination or filters/sorting
export const getFeaturedCourses = async () => {
  return [];
};

// TODO: Get 5 most recently accessed courses
// Uses the user id to get the courses
// No pagination or filters/sorting
export const getUserRecentCourses = async () => {
  return [];
};

// TODO: Get 10 of the users enrolled courses
// Uses the user id to get the courses
// Has pagination and filters/sorting
export const getUserEnrolledCourses = async () => {
  return [];
};

// TODO: Get 10 published courses
// Has pagination and filters/sorting
export const getPublishedCourses = async () => {
  return [];
};

// TODO: Replace this function with getPublishedCourses
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
