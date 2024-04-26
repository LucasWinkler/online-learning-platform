import type { NextAuthConfig } from "next-auth";

import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "~/env";
import { LoginSchema } from "~/schemas/auth";

import { findUserByEmail } from "./server/data-access/user";

export default {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          try {
            const user = await findUserByEmail(email);
            if (!user?.password) {
              return null;
            }

            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password,
            );

            if (isPasswordCorrect) {
              return user;
            }
          } catch (error) {
            console.log("Error authorizing user credentials:", error);
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
