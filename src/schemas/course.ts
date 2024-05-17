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

// Accepts both string and number to handle empty input as 0.
const priceSchema = z
  .union([z.string(), z.number()])
  .transform((value) => {
    if (value === "") return 0;
    const parsed = parseFloat(value.toString());
    return isNaN(parsed) ? value : parsed;
  })
  .refine((value) => typeof value === "number" && value >= 0, {
    message: "Price must be a non-negative number",
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

export const ChangeCoursePriceSchema = z.object({
  id: z.string(),
  price: priceSchema,
});
