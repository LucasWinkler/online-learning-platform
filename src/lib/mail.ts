import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${env.VERCEL_URL ?? "http://localhost:3000"}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Online Learning Platform <noreply@lucaswinkler.dev>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email by clicking this link: <a target="_blank" href="${confirmationLink}">${confirmationLink}</a></p>`,
  });
};
