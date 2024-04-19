import { getSession } from "@auth0/nextjs-auth0";
import { Role } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { validateRequestMethod } from "~/lib/api";
import { db } from "~/server/db";

const bodySchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string(),
  thumbnail: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    validateRequestMethod(req, res, "PUT");

    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to access this resource",
      });
    }

    const sessionUserEmail = session.user.email as string;
    const user = await db.user.findUnique({
      where: {
        email: sessionUserEmail,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: "Forbidden: User is not an admin" });
    }

    const requestBody = await bodySchema.safeParseAsync(req.body);
    if (!requestBody.success) {
      const { errors } = requestBody.error;
      return res.status(400).json({ message: "Invalid request", errors });
    }

    const courseId = req.query.id as string;
    const existingCourse = await db.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
      select: {
        id: true,
      },
    });

    if (!existingCourse) {
      return res
        .status(404)
        .json({ message: `Not Found: No Course with id: ${courseId}` });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: existingCourse.id,
      },
      data: {
        ...requestBody.data,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
