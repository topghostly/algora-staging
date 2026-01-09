import jwt from "jsonwebtoken";

const PASSWORD_RESET_SECRET =
  process.env.PASSWORD_RESET_SECRET || "fallback-secret-do-not-use-in-prod";

interface ResetTokenPayload {
  userId: string;
  purpose: "password-reset";
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
