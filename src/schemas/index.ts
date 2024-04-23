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
