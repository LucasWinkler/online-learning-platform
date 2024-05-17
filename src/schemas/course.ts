import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(1, {
    message: "Title is required",
  })
  .max(60, {
    message: "Title must be less than 60 characters",
  });

export const CreateCourseSchema = z.object({
  title: title,
});

export const DeleteCourseSchema = z.object({
  id: z.string(),
  slug: z.string().trim().min(1, {
    message: "Course Slug is required",
  }),
});

export const ChangeCourseTitleSchema = z.object({
  id: z.string(),
  title: title,
});
