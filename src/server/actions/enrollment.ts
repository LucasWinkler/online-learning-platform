"use server";

import { revalidatePath } from "next/cache";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

import { findCourseById } from "../data-access/course";

export const enrollInCourse = async (courseId: string) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return { error: "You must be logged in to enroll in a course" };
    }

    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { error: "You are already enrolled in this course" };
    }

    await db.courseEnrollment.create({
      data: {
        studentId: user.id,
        courseId: courseId,
      },
    });

    const course = await findCourseById(courseId);

    if (!course) {
      return { error: "Course not found" };
    }

    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/dashboard");

    return {
      success: "Successfully enrolled in course",
    };
  } catch (error) {
    return {
      error: "Something went wrong while enrolling in the course",
    };
  }
};
