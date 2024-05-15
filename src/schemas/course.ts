import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Title is required",
    })
    .max(60, {
      message: "Title must be less than 60 characters",
    }),
});

export const DeleteCourseSchema = z.object({
  id: z.string(),
  slug: z.string().trim().min(1, {
    message: "Course Slug is required",
  }),
});
