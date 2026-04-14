import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateRequestStatus } from "@/app/(main)/actions/request";
import { decrypt, encrypt } from "@/lib/crypto";
import { refreshGoogleAccessToken } from "@/lib/refreshGooglAccessToken";
import { sendEmail } from "@/lib/email";
import SessionConfirmationEmail from "@/components/emails/SessionConfirmationEmail";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      studentEmail = "td.bolaji@gmail.com",
      startTime,
      endTime,
      type,
      title = "Algora 1-on-1 session",
      description = "Private learning session on Algora",
      requestId,
    } = await req.json();

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (type === "ONE_ON_ONE" && !studentEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        calendarConnected: true,
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiresAt: true,
      },
    });

    if (
      !account ||
      !account.googleAccessToken ||
      !account.googleRefreshToken ||
      !account.googleTokenExpiresAt
    ) {
      // If we thought it was connected but tokens are missing, sync the DB
      if (account?.calendarConnected) {
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
      }

      revalidatePath("/tutor");
      revalidatePath("/tutor", "layout");

      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 401 },
      );
    }

    let accessToken = decrypt(account.googleAccessToken);

    // Refresh token if it's expired or about to expire (5 min buffer)
    const EXPIRATION_BUFFER = 300; // 5 minutes
    if (
      account.googleTokenExpiresAt * 1000 <
      Date.now() + EXPIRATION_BUFFER * 1000
    ) {
      try {
        const refreshed = await refreshGoogleAccessToken(
          decrypt(account.googleRefreshToken),
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
        console.error("Token refresh error:", refreshError);

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

          return NextResponse.json(
            {
              error:
                "Google Calendar connection expired. Please re-connect your calendar.",
            },
            { status: 401 },
          );
        }

        throw refreshError; // Re-throw other errors to be caught by the outer catch
      }
    }

    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
    });

    if (!student && type === "ONE_ON_ONE") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const event: {
      summary: string;
      description: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      conferenceData: { createRequest: { requestId: string } };
      attendees?: { email: string }[];
    } = {
      summary: title,
      description,
      start: {
        dateTime: startTime,
        timeZone: "Africa/Lagos",
      },
      end: {
        dateTime: endTime,
        timeZone: "Africa/Lagos",
      },
      conferenceData: {
        createRequest: {
          requestId: `algora-${type.toLowerCase()}-${crypto.randomUUID()}`,
        },
      },
    };

    switch (type) {
      case "ONE_ON_ONE":
        event.attendees = [{ email: studentEmail }];
        break;

      case "GROUP":
        break;

      default:
        break;
    }

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
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

        return NextResponse.json(
          {
            error:
              "Google Calendar connection expired. Please reconnect your calendar manually.",
          },
          { status: 401 },
        );
      }

      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();

    const newSession = await prisma.tutorSession.create({
      data: {
        tutorId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetingLink: data.hangoutLink,
        googleEventId: data.id,
        title,
        type,
      },
    });

    if (requestId) {
      await updateRequestStatus(requestId, "ACCEPTED");

      // Auto-enroll the student
      if (student) {
        await prisma.sessionEnrollment.create({
          data: {
            userId: student.id,
            sessionId: newSession.id,
          },
        });
      }
    }

    await prisma.booking.create({
      data: {
        userId: session.user.id,
        tutorSessionId: newSession.id,
      },
    });

    // Send confirmation email to tutor
    const tutorName = session.user.name || "Tutor";
    const sessionDate = new Date(startTime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const sessionTime = `${new Date(startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${new Date(endTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    await sendEmail({
      to: session.user.email!,
      subject: `Session Confirmed: ${title}`,
      react: (
        <SessionConfirmationEmail
          tutorName={tutorName}
          sessionTitle={title}
          date={sessionDate}
          time={sessionTime}
          meetingLink={data.hangoutLink}
        />
      ),
    });

    void logActivity({
      userId: session.user.id,
      action: "SESSION_CREATED",
      entityType: "SESSION",
      entityId: newSession.id,
      metadata: {
        title,
        type,
        startTime,
        endTime,
        ...(type === "ONE_ON_ONE" && { studentEmail }),
      },
    });

    revalidatePath("/tutor/sessions");
    revalidatePath("/tutor");

    return NextResponse.json(
      {
        success: true,
        session: {
          id: newSession.id,
          title: newSession.title,
          meetingLink: newSession.meetingLink,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Session creation error details:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
