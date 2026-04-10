import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAttendanceToken } from "@/lib/session-token";
import { logActivity } from "@/lib/activity-log";

// GET /api/session/confirm-attendance?id=<sessionId>&token=<token>
// Returns session info so the confirmation page can render details.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const session = await prisma.tutorSession.findUnique({
    where: { id },
    include: { tutor: { select: { id: true } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!verifyAttendanceToken(session.id, session.tutor.id, token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  return NextResponse.json({
    session: {
      id: session.id,
      title: session.title,
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
    },
  });
}

// POST /api/session/confirm-attendance
// Body: { id: string; token: string; attended: boolean }
export async function POST(req: Request) {
  let body: { id?: string; token?: string; attended?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, token, attended } = body;

  if (!id || !token || typeof attended !== "boolean") {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const session = await prisma.tutorSession.findUnique({
    where: { id },
    include: { tutor: { select: { id: true } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!verifyAttendanceToken(session.id, session.tutor.id, token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  if (session.status !== "PENDING") {
    return NextResponse.json({
      alreadyProcessed: true,
      status: session.status,
    });
  }

  const newStatus = attended ? "COMPLETED" : "CANCELLED";
  const now = new Date();

  await prisma.tutorSession.update({
    where: { id },
    data: { status: newStatus, updatedAt: now },
  });

  await logActivity({
    userId: session.tutor.id,
    action: attended ? "SESSION_COMPLETED" : "SESSION_CANCELLED",
    entityType: "SESSION",
    entityId: session.id,
    metadata: {
      sessionTitle: session.title,
      confirmedAt: now.toISOString(),
      confirmedBy: "tutor_attendance_link",
    },
  });

  return NextResponse.json({ success: true, status: newStatus });
}
