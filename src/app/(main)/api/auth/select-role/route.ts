import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";

const selectRoleSchema = z.object({
  role: z.enum(["LEARNER", "TUTOR"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = selectRoleSchema.parse(body);

    // Only allow updating if the role is currently null or empty
    // Security: This prevents users from switching roles once set
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role) {
      return NextResponse.json(
        { error: "Role already assigned" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });

    // Log the role selection
    await logActivity({
      userId: updatedUser.id,
      action: "ROLE_SELECTED",
      entityType: "USER",
      entityId: updatedUser.id,
      metadata: { role },
    });

    return NextResponse.json({ success: true, role: updatedUser.role });
  } catch (error) {
    console.error("Role selection error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
