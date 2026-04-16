import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";
import { refreshGoogleAccessToken } from "@/lib/refreshGooglAccessToken";
import { revalidatePath, revalidateTag } from "next/cache";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user ||
    session.user.role !== "TUTOR" ||
    session.user.tutorStatus !== "APPROVED"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let calendarDisconnected = false;

  try {
    const tutorSession = await prisma.tutorSession.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        type: true,
        googleEventId: true,
        tutorId: true,
        status: true,
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

    if (tutorSession.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Session is already cancelled" },
        { status: 409 },
      );
    }

    // Attempt to remove the Google Calendar event — non-fatal if it fails
    if (tutorSession.googleEventId) {
      const tutor = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiresAt: true,
        },
      });

      if (tutor?.googleAccessToken) {
        try {
          let accessToken = decrypt(tutor.googleAccessToken);

          const EXPIRATION_BUFFER = 300;
          if (
            tutor.googleTokenExpiresAt &&
            tutor.googleRefreshToken &&
            tutor.googleTokenExpiresAt * 1000 <
              Date.now() + EXPIRATION_BUFFER * 1000
          ) {
            try {
              const refreshed = await refreshGoogleAccessToken(
                decrypt(tutor.googleRefreshToken),
              );

              await prisma.user.update({
                where: { id: session.user.id },
                data: {
                  googleAccessToken: encrypt(refreshed.access_token),
                  googleTokenExpiresAt: refreshed.expires_at,
                },
              });

              accessToken = refreshed.access_token;
            } catch (refreshError: any) {
              console.error(
                "Token refresh error during cancellation:",
                refreshError,
              );

              if (
                refreshError.error === "invalid_grant" ||
                refreshError.message?.includes("invalid_grant")
              ) {
                await prisma.user.update({
                  where: { id: session.user.id },
                  data: {
                    calendarConnected: false,
                    calendarConnectedAt: null,
                    googleAccessToken: null,
                    googleRefreshToken: null,
                    googleTokenExpiresAt: null,
                  },
                });

                revalidatePath("/tutor");
                revalidatePath("/tutor", "layout");
                calendarDisconnected = true;
              } else {
                throw refreshError;
              }
            }
          }

          if (!calendarDisconnected) {
            const res = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/primary/events/${tutorSession.googleEventId}?sendUpdates=all`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!res.ok && res.status === 401) {
              await prisma.user.update({
                where: { id: session.user.id },
                data: {
                  calendarConnected: false,
                  calendarConnectedAt: null,
                  googleAccessToken: null,
                  googleRefreshToken: null,
                  googleTokenExpiresAt: null,
                },
              });
              revalidatePath("/tutor");
              revalidatePath("/tutor", "layout");
              calendarDisconnected = true;
            } else if (!res.ok) {
              console.error(
                "Google Calendar event removal failed:",
                await res.text(),
              );
            }
          }
        } catch (calendarError) {
          // Calendar errors are non-fatal — we still cancel the session locally
          console.error("Calendar removal error (continuing):", calendarError);
        }
      }
    }

    // Build the cancellation transaction
    const enrolledStudentId =
      tutorSession.type === "ONE_ON_ONE" &&
      tutorSession.sessionEnrollments.length > 0
        ? tutorSession.sessionEnrollments[0].userId
        : null;

    await prisma.$transaction([
      // Mark the session as cancelled — bookings and enrollments are preserved
      prisma.tutorSession.update({
        where: { id },
        data: { status: "CANCELLED" },
      }),

      // Refund the student's credit if this was a booked 1-on-1
      ...(enrolledStudentId
        ? [
            prisma.user.update({
              where: { id: enrolledStudentId },
              data: { credits1on1: { increment: 1 } },
            }),
            // Mark the accepted request back to REJECTED so the student can rebook
            prisma.sessionRequest.updateMany({
              where: {
                tutorId: tutorSession.tutorId,
                studentId: enrolledStudentId,
                status: "ACCEPTED",
              },
              data: { status: "REJECTED" },
            }),
          ]
        : []),
    ]);

    // Fire-and-forget — must not block the response
    void logActivity({
      userId: session.user.id,
      action: "SESSION_CANCELLED",
      entityType: "SESSION",
      entityId: id,
      metadata: {
        title: tutorSession.title,
        type: tutorSession.type,
        ...(enrolledStudentId && { refundedStudentId: enrolledStudentId }),
      },
    });

    // @ts-ignore
    revalidateTag(`tutor-sessions-${session.user.id}`);
    revalidatePath("/tutor/sessions");

    return NextResponse.json({
      message: "Session cancelled successfully",
      calendarDisconnected,
    });
  } catch (error) {
    console.error("Session cancellation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
