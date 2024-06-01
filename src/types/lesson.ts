import type { Lesson } from "@prisma/client";

export type LessonCreationParams = Pick<
  Lesson,
  "title" | "order" | "chapterId" | "courseId"
>;
