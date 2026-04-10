import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronAuth } from "@/lib/cron-auth";
import { generateAttendanceToken } from "@/lib/session-token";
import { logActivity } from "@/lib/activity-log";
import { sendEmail } from "@/lib/email";
import { SessionAttendanceEmail } from "@/components/emails/SessionAttendanceEmail";
import React from "react";

// Small scheduling variance buffer — catches sessions the cron may have slightly missed
const WINDOW_MINUTES = 15;

export async function GET(req: Request) {
  if (!verifyCronAuth(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXTAUTH_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXTAUTH_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_MINUTES * 60 * 1000);

    // Sessions that ended within the last WINDOW_MINUTES and are still PENDING
    const sessions = await prisma.tutorSession.findMany({
      where: {
        status: "PENDING",
        endTime: {
          gte: windowStart,
          lt: now,
        },
      },
      include: {
        tutor: { select: { id: true, name: true, email: true } },
      },
    });

    if (sessions.length === 0) {
      return NextResponse.json({ success: true, emailsSent: 0 });
    }

    const results = await Promise.allSettled(
      sessions.map(async (session) => {
        const { tutor } = session;

        const token = generateAttendanceToken(session.id, tutor.id);
        const confirmUrl = `${appUrl}/session/confirm-attendance?id=${session.id}&token=${token}`;

        const sessionDate = session.startTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const sessionTime = session.startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        await sendEmail({
          to: tutor.email,
          subject: `Did your session "${session.title}" take place?`,
          react: React.createElement(SessionAttendanceEmail, {
            tutorName: tutor.name ?? "Tutor",
            sessionTitle: session.title,
            date: sessionDate,
            time: sessionTime,
            confirmUrl,
          }),
        });

        await logActivity({
          userId: tutor.id,
          action: "SESSION_ATTENDANCE_EMAIL_SENT",
          entityType: "SESSION",
          entityId: session.id,
          metadata: { sessionTitle: session.title, tutorEmail: tutor.email },
        });
      }),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ success: true, emailsSent: succeeded, failed });
  } catch (error) {
    console.error("[session/expire] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
