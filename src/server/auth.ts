import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "~/auth.config";
import { findUserById } from "~/server/data-access/user";
import { db } from "~/server/db";

import { verifyEmailOnAccountLink } from "./use-cases/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    async linkAccount({ user }) {
      await verifyEmailOnAccountLink(user.id!, new Date());
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await findUserById(token.sub);
      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
