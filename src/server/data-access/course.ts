import { type Prisma } from "@prisma/client";

import { db } from "~/server/db";

export const getCourses = async () => {
  const courses = await db.course.findMany();

  return courses;
};

export const getCourseById = async (id: number) => {
  const course = await db.course.findUnique({ where: { id } });

  return course;
};

export const getCourseBySlug = async (slug: string) => {
  const course = await db.course.findUnique({ where: { slug } });

  return course;
};

export const getPublishedCourses = async () => {
  return db.course.findMany({
    where: { isPublished: true },
  });
};

export const findEnrolledCourses = async (userId: number) => {
  return db.courseEnrollment.findMany({
    where: { studentId: userId },
    include: { course: true },
  });
};

export const createCourse = async (data: Prisma.CourseCreateInput) => {
  const course = await db.course.create({ data });

  return course;
};
