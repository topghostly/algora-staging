import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";
import { refreshGoogleAccessToken } from "@/lib/refreshGooglAccessToken";
import { sendEmail } from "@/lib/email";
import SessionConfirmationEmail from "@/components/emails/SessionConfirmationEmail";

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
      title = "Algora 1-on-1 session",
      description = "Private learning session on Algora",
    } = await req.json();

    if (!studentEmail || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
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
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 401 },
      );
    }

    let accessToken = decrypt(account.googleAccessToken);

    if (account.googleTokenExpiresAt * 1000 < Date.now()) {
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
    }

    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const event = {
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
      attendees: [{ email: studentEmail }],
      conferenceData: {
        createRequest: {
          requestId: `algora-1on1-${crypto.randomUUID()}`,
        },
      },
    };

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
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();

    // Note: TutorSession schema currently lacks studentId and description.
    // We'll create the session and assume a booking will link the student.
    const newSession = await prisma.tutorSession.create({
      data: {
        tutorId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetingLink: data.hangoutLink,
        googleEventId: data.id,
        title,
        type: "ONE_ON_ONE",
      },
    });

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

    revalidatePath("/tutor/sessions");

    return NextResponse.json(
      { session: newSession, accessToken },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Session creation error details:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
