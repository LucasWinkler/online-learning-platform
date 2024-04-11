import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "~/server/db";
import { type Course } from "@prisma/client";
import { handleInvalidMethod } from "~/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Course | { message: string }>,
) {
  try {
    handleInvalidMethod(req, res, "GET");

    const courseId = req.query.id as string;

    const course = await db.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: `Not Found: No course found with id: ${courseId}` });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
