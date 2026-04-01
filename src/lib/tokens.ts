// import jwt from "jsonwebtoken";
// import { prisma } from "./prisma";
// import crypto from "crypto";

// if (!process.env.EMAIL_VERIFICATION_SECRET) {
//   throw new Error(
//     "Missing required environment variable: EMAIL_VERIFICATION_SECRET must be set",
//   );
// }

// const EMAIL_VERIFICATION_SECRET = process.env
//   .EMAIL_VERIFICATION_SECRET as string;

// interface ResetTokenPayload {
//   userId: string;
//   purpose: "password-reset";
// }

// interface VerificationTokenPayload {
//   email: string;
//   purpose: "email-verification";
// }

// export async function generatePasswordResetToken(
//   email: string,
// ): Promise<string> {
//   const token = crypto.randomBytes(32).toString("hex");
//   const expires = new Date(Date.now() + 15 * 60 * 1000);

//   // Delete any existing tokens for this email
//   await prisma.passwordResetToken.deleteMany({
//     where: { email },
//   });

//   await prisma.passwordResetToken.create({
//     data: {
//       email,
//       token,
//       expires,
//     },
//   });

//   return token;
// }

// export async function verifyPasswordResetToken(
//   token: string,
// ): Promise<string | null> {
//   const passwordResetToken = await prisma.passwordResetToken.findUnique({
//     where: { token },
//   });

//   if (!passwordResetToken || passwordResetToken.expires < new Date()) {
//     return null;
//   }

//   return passwordResetToken.email;
// }

// export function generateVerificationToken(email: string): string {
//   const payload: VerificationTokenPayload = {
//     email,
//     purpose: "email-verification",
//   };

//   return jwt.sign(payload, EMAIL_VERIFICATION_SECRET, {
//     expiresIn: "24h",
//   });
// }

// export function verifyVerificationToken(token: string): string | null {
//   try {
//     const decoded = jwt.verify(
//       token,
//       EMAIL_VERIFICATION_SECRET,
//     ) as VerificationTokenPayload;

//     if (decoded.purpose !== "email-verification") {
//       return null;
//     }

//     return decoded.email;
//   } catch (error) {
//     return null;
//   }
// }

import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import crypto from "crypto";

function getEmailSecret(): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;

  if (!secret) {
    throw new Error(
      "EMAIL_VERIFICATION_SECRET is not configured in environment variables",
    );
  }

  return secret;
}

interface ResetTokenPayload {
  userId: string;
  purpose: "password-reset";
}

interface VerificationTokenPayload {
  email: string;
  purpose: "email-verification";
}

export async function generatePasswordResetToken(
  email: string,
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(
  token: string,
): Promise<string | null> {
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!passwordResetToken || passwordResetToken.expires < new Date()) {
    return null;
  }

  return passwordResetToken.email;
}

export function generateVerificationToken(email: string): string {
  const secret = getEmailSecret();

  const payload: VerificationTokenPayload = {
    email,
    purpose: "email-verification",
  };

  return jwt.sign(payload, secret, {
    expiresIn: "24h",
  });
}

export function verifyVerificationToken(token: string): string | null {
  try {
    const secret = getEmailSecret();

    const decoded = jwt.verify(token, secret) as VerificationTokenPayload;

    if (decoded.purpose !== "email-verification") {
      return null;
    }

    return decoded.email;
  } catch {
    return null;
  }
}
