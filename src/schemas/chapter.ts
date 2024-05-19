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

export const CreateChapterSchema = z.object({
  courseId: z.string(),
  title: title,
});

export const DeleteChapterSchema = z.object({
  id: z.string(),
  slug: z.string().trim().min(1, {
    message: "Course Slug is required",
  }),
});

export const ChangeChapterTitleSchema = z.object({
  id: z.string(),
  title: title,
});

export const ChangeChapterOrderSchema = z.object({
  courseId: z.string(),
  chapterOrderUpdates: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
});