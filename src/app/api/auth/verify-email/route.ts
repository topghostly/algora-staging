import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyVerificationToken } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const { token, googleMail, role } = await req.json();

    if (!token && !googleMail) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const email = verifyVerificationToken(token);

    if (!email && !googleMail) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    console.log(email, googleMail);

    const user = await prisma.user.findUnique({
      where: { email: email ? email : googleMail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const dataToUpdate: any = {
      emailVerified: new Date(),
    };

    if (role) {
      dataToUpdate.role = role;
    }

    await prisma.user.update({
      where: { email: email ? email : googleMail },
      data: dataToUpdate,
    });

    return NextResponse.json(
      { message: "Email verified successfully", email },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
