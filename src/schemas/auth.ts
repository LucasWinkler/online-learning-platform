import * as z from "zod";

import { DELETE_ACCOUNT_PHRASE } from "~/constants";

const email = z
  .string()
  .trim()
  .min(1, {
    message: "Email is required",
  })
  .max(254, {
    message: "Email must be at most 254 characters",
  })
  .email({
    message: "Invalid email format",
  });

const password = z
  .string()
  .trim()
  .min(8, {
    message: "Password must be at least 8 characters",
  })
  .max(128, {
    message: "Password must be at most 128 characters",
  });

const newPassword = z
  .string()
  .trim()
  .min(8, {
    message: "New Password must be at least 8 characters",
  })
  .max(128, {
    message: "New Password must be at most 128 characters",
  });

const confirmPassword = z.string().trim().min(1, {
  message: "Confirm Password is required",
});

const confirmNewPassword = z.string().trim().min(1, {
  message: "Confirm New Password is required",
});

const name = z
  .string()
  .trim()
  .min(1, {
    message: "Name is required",
  })
  .max(70, {
    message: "Name must be at most 70 characters",
  });

const twoFactorCode = z.string().length(6, {
  message: "Code must be 6 digits",
});

export const LoginSchema = z.object({
  email: email,
  password: password,
  code: twoFactorCode,
});

export const RegisterSchema = z
  .object({
    name: name,
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
  confirmationPhrase: z
    .string()
    .min(1, {
      message: "You must enter the phrase",
    })
    .refine(
      (value) => value.toLowerCase() === DELETE_ACCOUNT_PHRASE.toLowerCase(),
      {
        message: "Incorrect phrase",
      },
    ),
});

export const ToggleTwoFactorAuthenticationSchema = z.object({
  code: z.union([twoFactorCode, z.literal("")]),
});

export const ChangeNameSchema = z.object({
  name: name,
});

export const ChangeEmailSchema = z.object({
  email: email,
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: password,
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword,
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "New Password cannot be the same as the Current Password",
    path: ["newPassword"],
  });
