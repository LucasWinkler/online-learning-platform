import { getSession } from "@auth0/nextjs-auth0";
import { Role } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next/types";

import { validateRequestMethod } from "~/lib/api";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    validateRequestMethod(req, res, "DELETE");

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

    const courseId = req.query.id as string;
    const course = await db.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: `Course with id ${courseId} not found` });
    }

    await db.course.delete({
      where: {
        id: parseInt(courseId),
      },
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
