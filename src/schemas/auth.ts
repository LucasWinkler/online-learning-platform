import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Invalid email format",
    }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: z
      .string()
      .trim()
      .min(1, {
        message: "Email is required",
      })
      .email({
        message: "Invalid email format",
      }),
    password: z.string().trim().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().trim().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
