import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const tutorSession = await prisma.tutorSession.findUnique({
      where: { id },
      select: {
        id: true,
        googleEventId: true,
        tutorId: true,
        type: true,
        sessionEnrollments: {
          select: { userId: true },
        },
      },
    });

    if (!tutorSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (tutorSession.tutorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutor = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { googleAccessToken: true },
    });

    if (tutorSession.googleEventId && tutor?.googleAccessToken) {
      const accessToken = decrypt(tutor.googleAccessToken);

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${tutorSession.googleEventId}?sendUpdates=all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
    }

    const operations = [
      prisma.booking.deleteMany({
        where: { tutorSessionId: id },
      }),
      prisma.sessionEnrollment.deleteMany({
        where: { sessionId: id },
      }),
      prisma.tutorSession.delete({
        where: { id },
      }),
    ];

    if (
      tutorSession.type === "ONE_ON_ONE" &&
      tutorSession.sessionEnrollments.length > 0
    ) {
      const studentId = tutorSession.sessionEnrollments[0].userId;
      operations.push(
        prisma.user.update({
          where: { id: studentId },
          data: { credits1on1: { increment: 1 } },
        }) as any,
      );
      operations.push(
        prisma.sessionRequest.updateMany({
          where: {
            tutorId: tutorSession.tutorId,
            studentId,
            status: "ACCEPTED",
          },
          data: { status: "REJECTED" },
        }) as any,
      );
    }

    await prisma.$transaction(operations);
    revalidatePath("/tutor/sessions");
    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error: any) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
