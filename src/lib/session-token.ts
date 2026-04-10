import { createHmac, timingSafeEqual } from "crypto";

const SCOPE = "attendance";

/**
 * Generates an HMAC-SHA256 token scoped to a specific session + tutor pair.
 * Used in attendance confirmation links so the token cannot be reused across sessions.
 */
export function generateAttendanceToken(sessionId: string, tutorId: string): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");

  return createHmac("sha256", secret)
    .update(`${SCOPE}:${sessionId}:${tutorId}`)
    .digest("hex");
}

/**
 * Timing-safe verification of an attendance confirmation token.
 */
export function verifyAttendanceToken(
  sessionId: string,
  tutorId: string,
  token: string,
): boolean {
  try {
    const expected = generateAttendanceToken(sessionId, tutorId);
    const expectedBuf = Buffer.from(expected, "hex");
    const providedBuf = Buffer.from(token, "hex");

    if (expectedBuf.byteLength !== providedBuf.byteLength) return false;

    return timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}
