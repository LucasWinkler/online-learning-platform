import type { AdapterUser } from "@auth/core/adapters";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-edge";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "~/schemas/auth";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "~/server/data-access/2fa-confirmation";
import { findUserByEmail, findUserById } from "~/server/data-access/user";
import { db } from "~/server/db";
import { updateUserEmailVerified } from "~/server/use-cases/user";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db),
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
    async jwt({
      token,
      trigger,
      user,
      session,
    }: {
      token: JWT;
      user: User | AdapterUser;
      trigger?: "update" | "signIn" | "signUp" | undefined;
      session?: Session;
    }) {
      if (!token.sub) {
        return token;
      }

      if (user) {
        token.role = user.role;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        token.picture = user.image;
      }

      if (trigger === "update" && session) {
        token = {
          ...token,
          picture: session.user.image,
          name: session.user.name,
          isTwoFactorEnabled: session.user.isTwoFactorEnabled,
        };
      }

      return token;
    },
    async session({ token, session }) {
      if (!token.sub) {
        return session;
      }

      session.user = {
        ...session.user,
        id: token.sub,
        role: token.role,
        isTwoFactorEnabled: token.isTwoFactorEnabled,
        image: token.picture,
        name: token.name ?? token.email!,
      };

      return session;
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
