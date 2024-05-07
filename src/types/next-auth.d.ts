import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      email: string;
      name: string;
      image?: string | null;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    isTwoFactorEnabled: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: Role;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}
