import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionTier: string;
      emailVerified: boolean;
      calendarConnected: boolean;
      hasCompletedOnboarding: boolean;
      specialties: string[];
      tutorBio: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    subscriptionTier: string;
    emailVerified: boolean;
    calendarConnected: boolean;
    hasCompletedOnboarding: boolean;
    specialties: string[];
    tutorBio: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    subscriptionTier: string;
    emailVerified: boolean;
    calendarConnected: boolean;
    hasCompletedOnboarding: boolean;
    specialties: string[];
    tutorBio: string | null;
  }
}
