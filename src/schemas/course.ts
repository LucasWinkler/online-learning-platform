import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(10, {
    message: "Title must be at least 10 characters",
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

export const ChangeCourseDescriptionSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .trim()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .max(250, {
      message: "Description must be less than 250 characters",
    }),
});
