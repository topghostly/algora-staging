import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tutors = await prisma.user.findMany({
    where: { role: "TUTOR" },
    orderBy: [{ tutorStatus: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      specialties: true,
      tutorStatus: true,
      calendarConnected: true,
      resumeLink: true,
      createdAt: true,
      disabled: true,
    },
  });

  return NextResponse.json(tutors);
}
