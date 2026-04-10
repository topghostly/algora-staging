import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronAuth } from "@/lib/cron-auth";
import { generateAttendanceToken } from "@/lib/session-token";
import { logActivity } from "@/lib/activity-log";
import { sendEmail } from "@/lib/email";
import { SessionAttendanceEmail } from "@/components/emails/SessionAttendanceEmail";
import React from "react";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const FOUR_DAYS_MS = 4 * ONE_DAY_MS;

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
    const oneDayAgo = new Date(now.getTime() - ONE_DAY_MS);
    const fourDaysAgo = new Date(now.getTime() - FOUR_DAYS_MS);

    // --- Auto-cancel: ended > 4 days ago, still PENDING ---
    const toCancel = await prisma.tutorSession.findMany({
      where: {
        status: "PENDING",
        endTime: { lt: fourDaysAgo },
      },
      select: { id: true, title: true, tutorId: true },
    });

    if (toCancel.length > 0) {
      await prisma.tutorSession.updateMany({
        where: { id: { in: toCancel.map((s) => s.id) } },
        data: { status: "CANCELLED", updatedAt: now },
      });

      await Promise.allSettled(
        toCancel.map((session) =>
          logActivity({
            userId: session.tutorId,
            action: "SESSION_CANCELLED",
            entityType: "SESSION",
            entityId: session.id,
            metadata: {
              reason: "No attendance confirmation after 4 days",
              sessionTitle: session.title,
            },
          }),
        ),
      );
    }

    // --- Reminder: ended > 1 day ago but < 4 days ago, still PENDING ---
    const toRemind = await prisma.tutorSession.findMany({
      where: {
        status: "PENDING",
        endTime: {
          gte: fourDaysAgo,
          lt: oneDayAgo,
        },
      },
      include: {
        tutor: { select: { id: true, name: true, email: true } },
      },
    });

    const reminderResults = await Promise.allSettled(
      toRemind.map(async (session) => {
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
          subject: `Reminder: Did your session "${session.title}" take place?`,
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
          action: "SESSION_ATTENDANCE_REMINDER_SENT",
          entityType: "SESSION",
          entityId: session.id,
          metadata: { sessionTitle: session.title, tutorEmail: tutor.email },
        });
      }),
    );

    const remindersSucceeded = reminderResults.filter(
      (r) => r.status === "fulfilled",
    ).length;

    return NextResponse.json({
      success: true,
      autoCancelled: toCancel.length,
      remindersSent: remindersSucceeded,
    });
  } catch (error) {
    console.error("[session/daily-check] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
