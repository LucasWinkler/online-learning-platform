import { db } from "../db";

export async function getEnrollmentCount(
  courseId: number,
): Promise<number | null> {
  try {
    const count = await db.courseEnrollment.count({
      where: {
        courseId: courseId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching enrollment count", error);
    return null;
  }
}
