import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyVerificationToken } from "./tokens";
import { encrypt } from "./crypto";
import { sendEmail } from "./email";
import React from "react";
import { TutorApplicationEmail } from "@/components/emails/TutorApplicationEmail";

const ADMIN_NOTIFICATION_EMAILS = [
  "temitopeabolaji0327@gmail.com",
  "topghostly@gmail.com",
  "joinalgoraio@gmail.com",
];

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
            image: user.image,
            subscriptionTier: user.subscriptionTier,
            emailVerified: user.emailVerified as any,
            calendarConnected: user.calendarConnected,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            specialties: user.specialties,
            tutorBio: user.tutorBio,
            tutorStatus: user.tutorStatus,
            resumeLink: user.resumeLink,
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

        if (user.disabled) {
          throw new Error("AccountDisabled");
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
          image: user.image,
          subscriptionTier: user.subscriptionTier,
          emailVerified: user.emailVerified as any,
          calendarConnected: user.calendarConnected,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          specialties: user.specialties,
          tutorBio: user.tutorBio,
          tutorStatus: user.tutorStatus,
          resumeLink: user.resumeLink,
        };
      },
    }),
  ],

  callbacks: {
    // ─────────────────────────────────────────
    // JWT CALLBACK
    // ─────────────────────────────────────────
    async jwt({ token, user, account, trigger, session }) {
      // Initial login - runs after user is created/linked by adapter
      if (user && account) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
        token.subscriptionTier = user.subscriptionTier;
        token.emailVerified = user.emailVerified as any;
        token.calendarConnected = user.calendarConnected;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
        token.specialties = user.specialties;
        token.tutorBio = user.tutorBio;
        token.tutorStatus = (user as any).tutorStatus ?? null;
        token.resumeLink = (user as any).resumeLink ?? null;

        if (account.provider === "google") {
          token.provider = "google";

          const dataToUpdate: any = {
            emailVerified: new Date(),
          };
          token.emailVerified = dataToUpdate.emailVerified;

          // Leave role as NULL — middleware will redirect to /auth/select-role

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

          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate,
            select: {
              id: true,
              role: true,
              tutorStatus: true,
              resumeLink: true,
              specialties: true,
              tutorBio: true,
              name: true,
              email: true,
            },
          });

          token.tutorStatus = updatedUser.tutorStatus ?? null;
          token.resumeLink = updatedUser.resumeLink ?? null;

          // Send admin notification when a PENDING tutor completes calendar onboarding
          if (
            account.scope?.includes("calendar") &&
            updatedUser.role === "TUTOR" &&
            updatedUser.tutorStatus === "PENDING"
          ) {
            const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
            const adminUrl = `${baseUrl}/admin/tutors/${updatedUser.id}`;

            // Fire-and-forget — do not block the login flow
            Promise.all(
              ADMIN_NOTIFICATION_EMAILS.map((email) =>
                sendEmail({
                  to: email,
                  subject: `New tutor application: ${updatedUser.name ?? updatedUser.email}`,
                  react: React.createElement(TutorApplicationEmail, {
                    tutorName: updatedUser.name ?? "Unknown",
                    tutorEmail: updatedUser.email,
                    specialties: updatedUser.specialties,
                    bio: updatedUser.tutorBio ?? "",
                    resumeLink: updatedUser.resumeLink,
                    adminUrl,
                  }),
                }),
              ),
            ).catch((err) =>
              console.error("Admin notification email failed:", err),
            );
          }
        }
      }

      // Credentials login
      if (account?.provider === "credentials") {
        token.provider = "credentials";
      }

      // ─────────────────────────────────────────
      // SESSION UPDATE (From useSession().update())
      // ─────────────────────────────────────────
      if (trigger === "update" || (trigger === undefined && session)) {
        const userId = (token.id || token.sub) as string;

        if (userId) {
          let freshUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!freshUser || freshUser.disabled || freshUser.suspended) {
            console.warn(
              "Session Invalidation: User is inactive or not found",
              userId,
            );
            return {} as any;
          }

          if (freshUser) {
            // Lazy Downgrade Logic
            if (
              freshUser.cancelAtPeriodEnd &&
              freshUser.subscriptionPeriodEnd &&
              new Date() > freshUser.subscriptionPeriodEnd &&
              freshUser.subscriptionTier !== "FREE"
            ) {
              console.log("Lazy Downgrade: Period ended for user", userId);
              freshUser = await prisma.user.update({
                where: { id: userId },
                data: {
                  subscriptionTier: "FREE",
                  subscriptionId: null,
                  cancelAtPeriodEnd: false,
                },
              });
            }

            token.emailVerified = freshUser.emailVerified as any;
            token.calendarConnected = freshUser.calendarConnected;
            token.role = freshUser.role;
            token.image = freshUser.image;
            token.subscriptionTier = freshUser.subscriptionTier;
            token.name = freshUser.name;
            token.email = freshUser.email;
            token.hasCompletedOnboarding = freshUser.hasCompletedOnboarding;
            token.specialties = freshUser.specialties;
            token.tutorBio = freshUser.tutorBio;
            token.tutorStatus = freshUser.tutorStatus ?? null;
            token.resumeLink = freshUser.resumeLink ?? null;
            token.subscriptionPeriodEnd = freshUser.subscriptionPeriodEnd;
            token.cancelAtPeriodEnd = freshUser.cancelAtPeriodEnd;
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
        session.user.tutorStatus = token.tutorStatus ?? null;
        session.user.resumeLink = token.resumeLink ?? null;
        session.user.subscriptionPeriodEnd =
          token.subscriptionPeriodEnd as Date | null;
        session.user.cancelAtPeriodEnd = token.cancelAtPeriodEnd as
          | boolean
          | null;
        (session.user as any).provider = token.provider;
      }

      return session;
    },

    async signIn({ user }) {
      if (!user?.id) return true;
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { disabled: true },
      });
      if (dbUser?.disabled) {
        return "/auth/signin?error=AccountDisabled";
      }
      return true;
    },
  },
};
