import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyVerificationToken } from "./tokens";
import { encrypt } from "./crypto";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
  },

  providers: [
    // ─────────────────────────────────────────
    // GOOGLE OAUTH (Calendar-ready)
    // ─────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
    }),

    // ─────────────────────────────────────────
    // EMAIL + PASSWORD / TOKEN LOGIN
    // ─────────────────────────────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },

      async authorize(credentials) {
        // Magic-link / verification-token login
        if (credentials?.token) {
          const email = verifyVerificationToken(credentials.token);
          if (!email) return null;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            subscriptionTier: user.subscriptionTier,
            emailVerified: user.emailVerified as any,
            calendarConnected: user.calendarConnected,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            specialties: user.specialties,
            tutorBio: user.tutorBio,
          };
        }

        // Email + password login
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          emailVerified: user.emailVerified as any,
          calendarConnected: user.calendarConnected,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          specialties: user.specialties,
          tutorBio: user.tutorBio,
        };
      },
    }),
  ],

  callbacks: {
    // ─────────────────────────────────────────
    // JWT CALLBACK
    // ─────────────────────────────────────────
    async jwt({ token, user, account, session }) {
      // Initial login - runs after user is created/linked by adapter
      if (user && account) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.emailVerified = user.emailVerified as any;
        token.calendarConnected = user.calendarConnected;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
        token.specialties = user.specialties;
        token.tutorBio = user.tutorBio;

        if (account.provider === "google") {
          token.provider = "google";

          const cookieStore = await cookies();
          const pendingRole = cookieStore.get("pending_role")?.value;

          const dataToUpdate: any = {
            emailVerified: new Date(),
          };

          if (pendingRole === "TUTOR") {
            dataToUpdate.role = "TUTOR";
            token.role = "TUTOR";
          }

          if (account.refresh_token) {
            dataToUpdate.googleId = account.providerAccountId;
            dataToUpdate.googleRefreshToken = encrypt(account.refresh_token);
            dataToUpdate.googleTokenExpiresAt = account.expires_at;
            dataToUpdate.googleRefreshTokenExpiresIn = (
              account as any
            ).refresh_token_expires_in;
          }

          if (account.scope?.includes("calendar")) {
            dataToUpdate.calendarConnected = true;
            dataToUpdate.calendarConnectedAt = new Date();

            if (account.access_token) {
              dataToUpdate.googleAccessToken = encrypt(account.access_token);
            }

            if (account.refresh_token) {
              dataToUpdate.googleRefreshToken = encrypt(account.refresh_token);
            }

            if (account.expires_at) {
              dataToUpdate.googleTokenExpiresAt = account.expires_at;
            }

            if ((account as any).refresh_token_expires_in) {
              dataToUpdate.googleRefreshTokenExpiresIn = (
                account as any
              ).refresh_token_expires_in;
            }

            token.calendarConnected = true;
            token.hasCompletedOnboarding = true;
            dataToUpdate.hasCompletedOnboarding = true;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate,
          });
        }
      }

      // Credentials login
      if (account?.provider === "credentials") {
        token.provider = "credentials";
      }

      // Forced refresh / session update
      if (session) {
        const userId = (token.id || token.sub) as string;

        if (userId) {
          const freshUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (freshUser) {
            token.emailVerified = freshUser.emailVerified as any;
            token.calendarConnected = freshUser.calendarConnected;
            token.role = freshUser.role;
            token.subscriptionTier = freshUser.subscriptionTier;
            token.name = freshUser.name;
            token.email = freshUser.email;
            token.hasCompletedOnboarding = freshUser.hasCompletedOnboarding;
            token.specialties = freshUser.specialties;
            token.tutorBio = freshUser.tutorBio;
          }
        }
      }

      return token;
    },

    // ─────────────────────────────────────────
    // SESSION CALLBACK
    // ─────────────────────────────────────────
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscriptionTier = token.subscriptionTier;
        session.user.emailVerified = token.emailVerified as any;
        session.user.calendarConnected = token.calendarConnected;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
        session.user.specialties = token.specialties;
        session.user.tutorBio = token.tutorBio;
        (session.user as any).provider = token.provider;
      }

      return session;
    },
    async signIn({ user, account }) {
      return true;
    },
  },
};
