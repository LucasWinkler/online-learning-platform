import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    AUTH_REDIRECT_PROXY_URL: z.preprocess(
      (str) => str,
      process.env.VERCEL_ENV === "preview"
        ? z.string().url()
        : z.string().optional(),
    ),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    VERCEL_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().optional(),
    ),
    UPLOADTHING_SECRET: z.string(),
    MUX_TOKEN_ID: z.string(),
    MUX_TOKEN_SECRET: z.string(),
    VERCEL_ENV: z.preprocess(
      (str) => process.env.VERCEL_ENV ?? str,
      process.env.VERCEL ? z.string() : z.string().optional(),
    ),
    PRODUCTION_URL: z.preprocess(
      (str) => process.env.PRODUCTION_URL ?? str,
      process.env.VERCEL_ENV === "production"
        ? z.string()
        : z.string().optional(),
    ),
  },
  client: {
    NEXT_PUBLIC_VERCEL_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().optional(),
    ),
    NEXT_PUBLIC_VERCEL_ENV: z.preprocess(
      (str) => process.env.VERCEL_ENV ?? str,
      process.env.VERCEL ? z.string() : z.string().optional(),
    ),
    NEXT_PUBLIC_PRODUCTION_URL: z.preprocess(
      (str) => process.env.PRODUCTION_URL ?? str,
      process.env.VERCEL_ENV === "production"
        ? z.string()
        : z.string().optional(),
    ),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_REDIRECT_PROXY_URL: process.env.AUTH_REDIRECT_PROXY_URL,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    NEXT_PUBLIC_PRODUCTION_URL: process.env.NEXT_PUBLIC_PRODUCTION_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
