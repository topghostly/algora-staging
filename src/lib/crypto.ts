import crypto from "crypto";

const algorithm = "aes-256-gcm";

function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("ENCRYPTION_KEY is not configured");
  }

  return crypto.scryptSync(secret, "livermore-duckwald", 32);
}

export function encrypt(text: string) {
  const key = getEncryptionKey();

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(payload: string) {
  const key = getEncryptionKey();

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
