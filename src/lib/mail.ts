import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${env.VERCEL_URL ? "https://" : ""}${env.VERCEL_URL ?? "http://localhost:3000"}/auth/email-verification?token=${token}`;

  await resend.emails.send({
    from: "Online Learning Platform <noreply@lucaswinkler.dev>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email by clicking this link: <a target="_blank" href="${confirmationLink}">${confirmationLink}</a></p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${env.VERCEL_URL ? "https://" : ""}${env.VERCEL_URL ?? "http://localhost:3000"}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Online Learning Platform <noreply@lucaswinkler.dev>",
    to: email,
    subject: "Reset your password",
    html: `<p>Please reset your password by clicking this link: <a target="_blank" href="${resetLink}">${resetLink}</a></p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Online Learning Platform <noreply@lucaswinkler.dev>",
    to: email,
    subject: "Your 2FA token",
    html: `<p>Your 2FA token is: ${token}</p>`,
  });
};
