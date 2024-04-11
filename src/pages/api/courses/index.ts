import { type NextApiRequest, type NextApiResponse } from "next/types";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (req.method !== "GET") {
    return res.status(405).json({
      message: `Method ${method} Not Allowed on path ${req.url}`,
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
