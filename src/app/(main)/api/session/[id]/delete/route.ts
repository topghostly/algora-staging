import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";
import { refreshGoogleAccessToken } from "@/lib/refreshGooglAccessToken";
import { revalidatePath, revalidateTag } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let calendarDisconnected = false;

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
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiresAt: true,
      },
    });

    if (tutorSession.googleEventId && tutor?.googleAccessToken) {
      try {
        let accessToken = decrypt(tutor.googleAccessToken);

        // Refresh token if it's expired or about to expire (5 min buffer)
        const EXPIRATION_BUFFER = 300; // 5 minutes
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
            console.error("Token refresh error during deletion:", refreshError);

            // If the refresh token is revoked or invalid, disconnect the calendar
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
              // Continue with local deletion even if calendar fails
            } else {
              throw refreshError;
            }
          }
        }

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
          if (res.status === 401) {
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
          }
          const errorText = await res.text();
          console.error("Google Calendar event deletion failed:", errorText);
          // Don't throw here to allow local session deletion to proceed
        }
      } catch (externalError) {
        console.error(
          "External deletion error (continuing locally):",
          externalError,
        );
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
    // @ts-ignore
    revalidateTag(`tutor-sessions-${session.user.id}`);
    revalidatePath("/tutor/sessions");
    return NextResponse.json({ message: "Session deleted successfully", calendarDisconnected });
  } catch (error: any) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
