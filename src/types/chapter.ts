import type { Chapter } from "@prisma/client";

export type ChapterCreationParams = Pick<
  Chapter,
  "title" | "courseId" | "order"
>;
