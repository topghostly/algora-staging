import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { VerifyEmail } from "@/components/emails/VerifyEmail";
import { generateVerificationToken } from "@/lib/tokens";
import { registerSchema } from "@/lib/schemas";
import { ZodError } from "zod";

import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod - this explicitly ignores any 'role' field passed in the body
    const { email, password, name } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
      },
    });

    // Log registration
    await logActivity({
      userId: user.id,
      action: "USER_REGISTERED",
      entityType: "USER",
      entityId: user.id,
      metadata: { email: user.email },
    });

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    // Generate verification token
    const verificationToken = generateVerificationToken(email);
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    // Send Verification Email
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      react: VerifyEmail({ verificationLink }) as any,
    });

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
