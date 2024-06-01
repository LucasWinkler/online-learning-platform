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
  title: z.string().trim().min(1, {
    message: "Chapter Title is required",
  }),
});

export const ChangeChapterTitleSchema = z.object({
  courseId: z.string(),
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

export const ToggleChapterPublishSchema = z.object({
  id: z.string(),
});
