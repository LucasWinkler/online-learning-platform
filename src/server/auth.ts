import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-edge";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { authApiRoutePrefix } from "~/routes";
import { LoginSchema } from "~/schemas/auth";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "~/server/data-access/2fa-confirmation";
import { findUserByEmail, findUserById } from "~/server/data-access/user";
import { db } from "~/server/db";
import { updateUserEmailVerified } from "~/server/use-cases/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  basePath: authApiRoutePrefix,
  providers: [
    Google,
    GitHub,
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

            const isPasswordCorrect = compareSync(password, user.password);
            if (isPasswordCorrect) {
              return user;
            }
          } catch (error) {
            console.error("Error authorizing user credentials:", error);
            throw new Error("Error authorizing user credentials");
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await findUserById(user.id!);
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id!,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await deleteTwoFactorConfirmation(user.id!);
      }

      return true;
    },
    async session({ token, session }) {
      if (!token.sub) {
        return session;
      }

      if (session.user) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role,
          isTwoFactorEnabled: token.isTwoFactorEnabled,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) {
        return token;
      }

      if (user) {
        token = {
          ...token,
          role: user.role,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        };
      }

      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await updateUserEmailVerified(user.id!);
    },
  },
  // debug: env.NODE_ENV !== "production",
});
