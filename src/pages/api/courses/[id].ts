import { getSession } from "@auth0/nextjs-auth0";
import { type Course } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

import { validateRequestMethod } from "~/lib/api";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Course | { message: string }>,
) {
  try {
    validateRequestMethod(req, res, "GET");

    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to access this resource",
      });
    }

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
