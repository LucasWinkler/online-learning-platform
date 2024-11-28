import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const isEnrolledInCourse = async (
  courseId: string,
): Promise<boolean> => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return false;
    }

    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId,
        },
      },
    });

    return !!enrollment;
  } catch (error) {
    return false;
  }
};
