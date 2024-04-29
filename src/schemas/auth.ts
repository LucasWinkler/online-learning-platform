import * as z from "zod";

const email = z
  .string()
  .trim()
  .min(1, {
    message: "Email is required",
  })
  .email({
    message: "Invalid email format",
  });

const password = z.string().trim().min(8, {
  message: "Password must be at least 8 characters",
});

const confirmPassword = z.string().trim().min(1, {
  message: "Confirm password is required",
});

export const LoginSchema = z.object({
  email: email,
  password: password,
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email,
});

export const NewPasswordSchema = z
  .object({
    password: password,
    confirmPassword: confirmPassword,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
