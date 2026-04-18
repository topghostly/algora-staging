import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { modules: true, enrollments: true },
      },
    },
  });

  return NextResponse.json(tracks);
}
