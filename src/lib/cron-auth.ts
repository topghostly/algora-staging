import { timingSafeEqual } from "crypto";

/**
 * Verifies the Authorization header for cron endpoints using a timing-safe
 * comparison to prevent timing-based secret extraction attacks.
 */
export function verifyCronAuth(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !authHeader) return false;

  const prefix = "Bearer ";
  if (!authHeader.startsWith(prefix)) return false;

  const provided = authHeader.slice(prefix.length);

  try {
    // Both buffers must be the same byte length for timingSafeEqual
    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(secret);

    if (providedBuf.byteLength !== expectedBuf.byteLength) return false;

    return timingSafeEqual(providedBuf, expectedBuf);
  } catch {
    return false;
  }
}
