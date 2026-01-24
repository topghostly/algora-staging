import crypto from "crypto";

const algorithm = "aes-256-gcm";

// Take ANY length secret and derive a real 32-byte key from it
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_SECRET) {
  throw new Error("Missing ENCRYPTION_KEY in environment variables");
}

// scrypt always returns a buffer of the exact length we request
const key = crypto.scryptSync(ENCRYPTION_SECRET, "livermore-duckwald", 32);

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12); // 12 bytes is recommended for GCM
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(payload: string) {
  const [ivHex, authTagHex, encrypted] = payload.split(":");

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
