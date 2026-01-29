import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId } = await req.json();

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 },
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_trackId: {
          userId: session.user.id,
          trackId: trackId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: "Already enrolled" },
        { status: 200 },
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        trackId: trackId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    console.error("Enrollment error details:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
