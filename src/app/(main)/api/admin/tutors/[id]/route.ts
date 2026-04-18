import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { AccountDisabledEmail } from "@/components/emails/AccountDisabledEmail";
import { TutorApprovedEmail } from "@/components/emails/TutorApprovedEmail";
import { TutorRejectedEmail } from "@/components/emails/TutorRejectedEmail";
import React from "react";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("reject") }),
  z.object({ action: z.literal("disable") }),
  z.object({ action: z.literal("enable") }),
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { action } = parsed.data;

    const tutor = await prisma.user.findUnique({
      where: { id, role: "TUTOR" },
      select: { id: true, email: true, name: true, disabled: true, tutorStatus: true },
    });

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.user.update({
        where: { id },
        data: { tutorStatus: "APPROVED" },
      });

      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      await sendEmail({
        to: tutor.email,
        subject: "Your Algora tutor application has been approved!",
        react: React.createElement(TutorApprovedEmail, {
          tutorName: tutor.name ?? "Tutor",
          dashboardUrl: `${baseUrl}/tutor`,
        }),
      });

      await logActivity({
        userId: session.user.id,
        action: "TUTOR_APPROVED",
        entityType: "USER",
        entityId: id,
        metadata: { tutorEmail: tutor.email },
      });

      return NextResponse.json({ success: true, tutorStatus: "APPROVED" });
    }

    if (action === "reject") {
      await prisma.user.update({
        where: { id },
        data: { tutorStatus: "REJECTED" },
      });

      await sendEmail({
        to: tutor.email,
        subject: "Update on your Algora tutor application",
        react: React.createElement(TutorRejectedEmail, {
          tutorName: tutor.name ?? "Tutor",
        }),
      });

      await logActivity({
        userId: session.user.id,
        action: "TUTOR_REJECTED",
        entityType: "USER",
        entityId: id,
        metadata: { tutorEmail: tutor.email },
      });

      return NextResponse.json({ success: true, tutorStatus: "REJECTED" });
    }

    if (action === "disable") {
      await prisma.user.update({
        where: { id },
        data: { disabled: true },
      });

      await sendEmail({
        to: tutor.email,
        subject: "Your Algora account has been disabled",
        react: React.createElement(AccountDisabledEmail, {
          name: tutor.name ?? "User",
        }),
      });

      await logActivity({
        userId: session.user.id,
        action: "USER_DISABLED",
        entityType: "USER",
        entityId: id,
        metadata: { tutorEmail: tutor.email },
      });

      return NextResponse.json({ success: true, disabled: true });
    }

    if (action === "enable") {
      await prisma.user.update({
        where: { id },
        data: { disabled: false },
      });

      await logActivity({
        userId: session.user.id,
        action: "USER_ENABLED",
        entityType: "USER",
        entityId: id,
        metadata: { tutorEmail: tutor.email },
      });

      return NextResponse.json({ success: true, disabled: false });
    }
  } catch (error) {
    console.error("Admin tutor action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
