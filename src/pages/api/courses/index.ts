import { getSession } from "@auth0/nextjs-auth0";
import { type NextApiRequest, type NextApiResponse } from "next/types";

import { handleInvalidMethod } from "~/lib/api";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  handleInvalidMethod(req, res, "GET");

  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({
      message: "Unauthorized: Please log in to access this resource",
    });
  }

  try {
    const courses = await db.course.findMany();
    console.log("Fetched courses:", courses);

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
