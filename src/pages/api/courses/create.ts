import { getSession } from "@auth0/nextjs-auth0";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { db } from "~/server/db";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string(),
  thumbnail: z.string(),
  instructorId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const requestBody = await schema.safeParseAsync(req.body);

  if (!requestBody.success) {
    const { errors } = requestBody.error;
    return res.status(400).json({ message: "Invalid request", errors });
  }

  const sessionUserId = session.user.id as number;
  const { instructorId } = requestBody.data;

  if (sessionUserId !== instructorId) {
    return res
      .status(403)
      .json({ message: "Forbidden: User can only create their own course" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: sessionUserId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden: User is not an admin" });
    }
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const { method } = req;

  if (req.method !== "POST") {
    return res.status(405).json({
      message: `Method ${method} Not Allowed on path ${req.url}`,
    });
  }

  try {
    await db.course.create({ data: requestBody.data });
    console.log("Course created successfully");

    return res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
