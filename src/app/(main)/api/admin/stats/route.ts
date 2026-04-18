import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [userCount, trackCount, lessonCount, recentActivities] =
    await Promise.all([
      prisma.user.count(),
      prisma.track.count(),
      prisma.lesson.count(),
      prisma.activityLog.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

  return NextResponse.json({ userCount, trackCount, lessonCount, recentActivities });
}
