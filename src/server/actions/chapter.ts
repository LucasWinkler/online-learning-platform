"use server";

import type { z } from "zod";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  ChangeChapterOrderSchema,
  CreateChapterSchema,
} from "~/schemas/chapter";
import { auth } from "~/server/auth";
import { updateChapterOrders } from "~/server/data-access/chapter";
import { findCourseById } from "~/server/data-access/course";
import { createNewChapter } from "~/server/use-cases/chapter";

export const createChapter = async (
  values: z.infer<typeof CreateChapterSchema>,
) => {
  try {
    const validatedFields = CreateChapterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid title" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, title } = validatedFields.data;

    const course = await findCourseById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    await createNewChapter(title, course.id);

    revalidatePath(`/manage/courses/${course.slug}`);

    return {
      success: "Chapter has been created successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ChapterExistsError") {
        return {
          error: error.message,
        };
      }
    }

    throw error;
  }
};

export const updateChapterOrder = async (
  values: z.infer<typeof ChangeChapterOrderSchema>,
) => {
  try {
    const validatedFields = ChangeChapterOrderSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input" };
    }

    const session = await auth();
    const user = session?.user;

    if (user?.role !== Role.ADMIN) {
      return { error: "You are not authorized" };
    }

    const { courseId, chapterOrderUpdates } = validatedFields.data;

    const course = await findCourseById(courseId);
    if (!course) {
      return { error: "Course not found" };
    }

    if (course.instructorId !== user.id) {
      return { error: "You are not authorized" };
    }

    await updateChapterOrders(chapterOrderUpdates);
    revalidatePath(`/manage/courses/${courseId}`);

    return {
      success: "Chapter order has been successfully updated.",
    };
  } catch (error) {
    return {
      error: "An unknown error occurred while updating chapter order.",
    };
  }
};

// export const deleteCourse = async (
//   values: z.infer<typeof DeleteCourseSchema>,
// ) => {
//   try {
//     const validatedFields = DeleteCourseSchema.safeParse(values);
//     if (!validatedFields.success) {
//       return { error: "Invalid course slug" };
//     }

//     const session = await auth();
//     const user = session?.user;

//     if (user?.role !== Role.ADMIN) {
//       return { error: "You are not authorized" };
//     }

//     const { id } = validatedFields.data;
//     const authorized = await isAuthorizedForCourseManagement(id, user.id);

//     if (!authorized) {
//       return { error: "You are not authorized" };
//     }

//     const enrollmentCount = await countCourseEnrollments(id);
//     if (enrollmentCount > 0) {
//       return {
//         error:
//           "You can not delete a course with students. You may unpublish the course instead, but those students will still have access to the course.",
//       };
//     }

//     const deletedCourse = await deleteCourseById(id);

//     revalidatePath("/manage/courses");

//     return {
//       success: `${deletedCourse.title} has been successfully deleted.`,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       if (error.name === "CourseNotFoundError") {
//         return {
//           error: error.message,
//         };
//       }
//     }

//     throw error;
//   }
// };

// export const changeCourseTitle = async (
//   values: z.infer<typeof ChangeCourseTitleSchema>,
// ) => {
//   try {
//     const validatedFields = ChangeCourseTitleSchema.safeParse(values);
//     if (!validatedFields.success) {
//       return { error: "Invalid title" };
//     }

//     const session = await auth();
//     const user = session?.user;

//     if (user?.role !== Role.ADMIN) {
//       return { error: "You are not authorized" };
//     }

//     const { id, title } = validatedFields.data;
//     const course = await findCourseById(id);

//     if (course?.instructorId !== user.id) {
//       return {
//         error: "You are not authorized",
//       };
//     }

//     if (course.title === title) {
//       return {
//         error: "Title is the same as the current one",
//       };
//     }

//     const updatedCourse = await updateCourse(id, {
//       title,
//     });

//     revalidatePath(`/manage/courses/${updatedCourse.slug}`);

//     return {
//       success: "Title has successfully been changed.",
//     };
//   } catch (error) {
//     return {
//       error: "An unknown error occurred while changing your title.",
//     };
//   }
// };
