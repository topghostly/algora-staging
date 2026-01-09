import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionTier: string;
      emailVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    subscriptionTier: string;
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    subscriptionTier: string;
    emailVerified: boolean;
  }
}
