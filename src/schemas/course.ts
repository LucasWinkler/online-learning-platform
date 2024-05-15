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
  // slug: z
  //   .string()
  //   .trim()
  //   .min(1, {
  //     message: "Slug is required",
  //   })
  //   .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  //     message:
  //       "Slug should be lowercase, no special characters, and spaces replaced with hyphens.",
  //   }),
});
