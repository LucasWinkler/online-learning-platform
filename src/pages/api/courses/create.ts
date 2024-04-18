import { getSession } from "@auth0/nextjs-auth0";
import { Role } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { z } from "zod";

import { handleInvalidMethod } from "~/lib/api";
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
    handleInvalidMethod(req, res, "POST");

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
      return res
        .status(404)
        .json({ message: "Not Found: User does not exist" });
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

    await db.course.create({
      data: {
        ...requestBody.data,
        instructorId: user.id,
      },
    });

    return res.status(201).json({ message: "Course created successfully" });
  } catch (error: unknown) {
    console.error("Error creating course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
