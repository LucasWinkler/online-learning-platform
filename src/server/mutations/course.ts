import { db } from "../db";
import type { Course } from "@prisma/client";
import type { CreateCourseInput } from "~/types";

export const createCourse = async ({
  title,
  description,
  price,
  slug,
  thumbnail,
  instructorId,
}: CreateCourseInput): Promise<Course | null> => {
  try {
    const course = await db.course.create({
      data: {
        title,
        description,
        price,
        slug,
        thumbnail,
        instructorId,
      },
    });

    return course;
  } catch (error) {
    console.error("Error while creating course:", error);
    return null;
  }
};
