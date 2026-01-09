import jwt from "jsonwebtoken";

const PASSWORD_RESET_SECRET =
  process.env.PASSWORD_RESET_SECRET || "fallback-secret-do-not-use-in-prod";
const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET ||
  "fallback-email-secret-do-not-use-in-prod";

interface ResetTokenPayload {
  userId: string;
  purpose: "password-reset";
}

interface VerificationTokenPayload {
  email: string;
  purpose: "email-verification";
}

export function generatePasswordResetToken(userId: string): string {
  const payload: ResetTokenPayload = {
    userId,
    purpose: "password-reset",
  };

  return jwt.sign(payload, PASSWORD_RESET_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyPasswordResetToken(token: string): string | null {
  try {
    const decoded = jwt.verify(
      token,
      PASSWORD_RESET_SECRET
    ) as ResetTokenPayload;

    if (decoded.purpose !== "password-reset") {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export function generateVerificationToken(email: string): string {
  const payload: VerificationTokenPayload = {
    email,
    purpose: "email-verification",
  };

  return jwt.sign(payload, EMAIL_VERIFICATION_SECRET, {
    expiresIn: "24h",
  });
}

export function verifyVerificationToken(token: string): string | null {
  try {
    const decoded = jwt.verify(
      token,
      EMAIL_VERIFICATION_SECRET
    ) as VerificationTokenPayload;

    if (decoded.purpose !== "email-verification") {
      return null;
    }

    return decoded.email;
  } catch (error) {
    return null;
  }
}
