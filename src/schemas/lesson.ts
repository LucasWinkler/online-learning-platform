import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(3, {
    message: "Title must be at least 3 characters",
  })
  .max(60, {
    message: "Title must be less than 60 characters",
  });

export const CreateLessonSchema = z.object({
  courseId: z.string(),
  chapterId: z.string(),
  title: title,
});

export const ChangeLessonOrderSchema = z.object({
  courseId: z.string(),
  chapterId: z.string(),
  lessonOrderUpdates: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
});
