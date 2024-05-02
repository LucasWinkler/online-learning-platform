import * as z from "zod";
import { DELETE_ACCOUNT_PHRASE } from '~/constants';

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

export const ForgotPasswordSchema = z.object({
  email,
});

export const ResetPasswordSchema = z
  .object({
    password: password,
    confirmPassword: confirmPassword,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const DeleteAccountSchema = z.object({
  confirmationPhrase: z.string().min(1, {
      message: "You must enter the phrase",
    })
    .refine((value) => value.toLowerCase() === DELETE_ACCOUNT_PHRASE.toLowerCase(), {
      message: "Incorrect phrase",
    }),
});
