import type { Course } from "@prisma/client";
import type { CreateCourseInput } from "~/types/course";

import { db } from "../db";

export const createCourse = async ({
  title,
  slug,
  instructorId,
}: CreateCourseInput): Promise<Course | null> => {
  try {
    const course = await db.course.create({
      data: {
        title,
        slug,
        instructorId,
      },
    });

    return course;
  } catch (error) {
    console.error("Error while creating course:", error);
    return null;
  }
};
