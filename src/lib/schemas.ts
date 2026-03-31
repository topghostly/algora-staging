import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50).optional(),
  // We explicitly DO NOT include role here to prevent privilege escalation
});

const ALLOWED_IMAGE_HOSTNAMES = [
  "algora-user-profiles-bucket.s3.us-east-1.amazonaws.com",
  "lh3.googleusercontent.com",
  "avatar.iran.liara.run",
  "images.unsplash.com",
];

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        if (val.startsWith("data:image/")) return true;
        try {
          const { hostname } = new URL(val);
          return ALLOWED_IMAGE_HOSTNAMES.includes(hostname);
        } catch {
          return false;
        }
      },
      { message: "Image must be a base64 data URL or a URL from an allowed host" },
    ),
});

export const progressSchema = z.object({
  lessonId: z.string().cuid(),
  completed: z.boolean(),
});
