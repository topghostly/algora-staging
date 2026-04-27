import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string | null;
      subscriptionTier: string;
      emailVerified: boolean;
      calendarConnected: boolean;
      hasCompletedOnboarding: boolean;
      image: string | null;
      specialties: string[];
      tutorBio: string | null;
      tutorStatus: string | null;
      resumeLink: string | null;
      subscriptionPeriodEnd?: Date | string | null;
      cancelAtPeriodEnd?: boolean | null;
      paymentChannel?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string | null;
    subscriptionTier: string;
    emailVerified: boolean;
    calendarConnected: boolean;
    image: string | null;
    hasCompletedOnboarding: boolean;
    specialties: string[];
    tutorBio: string | null;
    tutorStatus: string | null;
    resumeLink: string | null;
    subscriptionPeriodEnd?: Date | string | null;
    cancelAtPeriodEnd?: boolean | null;
    paymentChannel?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string | null;
    subscriptionTier: string;
    emailVerified: boolean;
    calendarConnected: boolean;
    hasCompletedOnboarding: boolean;
    specialties: string[];
    tutorBio: string | null;
    tutorStatus: string | null;
    resumeLink: string | null;
    subscriptionPeriodEnd?: Date | string | null;
    cancelAtPeriodEnd?: boolean | null;
    paymentChannel?: string | null;
  }
}
