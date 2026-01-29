import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyVerificationToken } from "./tokens";
import { encrypt } from "./crypto";

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
            googleId: (user as any).googleId,
            emailVerified: (user as any).emailVerified,
            calendarConnected: user.calendarConnected,
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
          googleId: (user as any).googleId,
          emailVerified: (user as any).emailVerified,
          calendarConnected: user.calendarConnected,
        };
      },
    }),
  ],

  callbacks: {
    // ─────────────────────────────────────────
    // JWT CALLBACK
    // ─────────────────────────────────────────
    async jwt({ token, user, account, session }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.googleId = (user as any).googleId;
        token.emailVerified = (user as any).emailVerified;
        token.calendarConnected = (user as any).calendarConnected;
      }

      // Google login
      if (account?.provider === "google" && user?.email) {
        token.provider = "google";

        if (account.refresh_token) {
          await prisma.user.updateMany({
            where: { email: user.email },
            data: {
              googleId: account.providerAccountId,
              googleRefreshToken: encrypt(account.refresh_token),
              googleTokenExpiresAt: account.expires_at,
              googleRefreshTokenExpiresIn: (account as any)
                .refresh_token_expires_in,
            },
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
            token.emailVerified = (freshUser as any).emailVerified;
            token.calendarConnected = freshUser.calendarConnected;
            token.googleId = (freshUser as any).googleId;
            token.role = freshUser.role;
            token.subscriptionTier = freshUser.subscriptionTier;
            token.name = freshUser.name;
            token.email = freshUser.email;
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).googleId = token.googleId as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
        (session.user as any).calendarConnected =
          token.calendarConnected as boolean;
        (session.user as any).provider = token.provider as string;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (
        account?.provider === "google" &&
        account.scope?.includes("calendar")
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            calendarConnected: true,
            googleAccessToken: encrypt(account.access_token!),
            googleRefreshToken: encrypt(account.refresh_token!),
            googleTokenExpiresAt: account.expires_at,
            googleRefreshTokenExpiresIn: (account as any)
              .refresh_token_expires_in,
            calendarConnectedAt: new Date(),
          },
        });
      }
      return true;
    },
  },
};
