import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { disabled: true },
    }),
    prisma.activityLog.create({
      data: {
        userId,
        action: "ACCOUNT_DELETION_REQUESTED",
        entityType: "USER",
        entityId: userId,
        metadata: {
          requestedAt: new Date().toISOString(),
          reason: "User-initiated account deletion request",
        },
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
