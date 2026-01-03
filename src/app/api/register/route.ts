import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: "LEARNER", // Default role
      },
    });

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    // Send Welcome Email
    await sendEmail({
      to: email,
      subject: "Welcome to Algora",
      react: WelcomeEmail({ name: name || "Learner" }) as any,
    });

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error:
          "Internal server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
