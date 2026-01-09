import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyVerificationToken } from "./tokens";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.token) {
          const email = verifyVerificationToken(credentials.token);
          if (!email) {
            return null;
          }
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            subscriptionTier: user.subscriptionTier,
            emailVerified: (user as any).emailVerified,
          };
        }
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
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
          emailVerified: (user as any).emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
    async jwt({ token, user, session }) {
      // On login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
        token.emailVerified = (user as any).emailVerified;
      }

      // On session update OR forced refresh
      if (session) {
        const userId = (token.id || token.sub) as string;

        if (userId) {
          const freshUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (freshUser) {
            token.emailVerified = (freshUser as any).emailVerified;
            token.role = freshUser.role;
            token.subscriptionTier = freshUser.subscriptionTier;
            token.name = freshUser.name;
            token.email = freshUser.email;
          }
        }
      }

      return token;
    },
  },
};
