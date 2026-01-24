"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { BookingConfirmationEmail } from "@/components/emails/BookingConfirmationEmail";

export async function bookSession(sessionId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // 1. Get session details
  const targetSession = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { bookings: true },
  });

  if (!targetSession) {
    throw new Error("Session not found");
  }

  // 2. Check availability
  if (
    targetSession.type === "ONE_ON_ONE" &&
    targetSession.bookings.length >= 1
  ) {
    throw new Error("Session is already booked");
  }

  // 3. Check if already booked
  const existingBooking = await prisma.booking.findUnique({
    where: {
      userId_sessionId: {
        userId,
        sessionId,
      },
    },
  });

  if (existingBooking) {
    throw new Error("You have already booked this session");
  }

  // 4. Check permissions and credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits1on1: true, subscriptionTier: true },
  });

  if (!user) throw new Error("User not found");

  // Block Free users from Group sessions
  if (targetSession.type === "GROUP" && user.subscriptionTier === "FREE") {
    throw new Error("Upgrade to Basic to join Group Sessions");
  }

  // Check credits for 1-on-1
  if (targetSession.type === "ONE_ON_ONE") {
    if (user.credits1on1 < 1) {
      throw new Error("Insufficient credits");
    }

    // Deduct credit
    await prisma.user.update({
      where: { id: userId },
      data: { credits1on1: { decrement: 1 } },
    });
  }

  // 5. Create booking
  const booking = await prisma.booking.create({
    data: {
      userId,
      sessionId,
    },
    include: {
      session: {
        include: {
          tutor: { select: { name: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
  });

  // Send Booking Confirmation Email
  if (booking.user.email) {
    await sendEmail({
      to: booking.user.email,
      subject: "Booking Confirmed: " + booking.session.title,
      react: BookingConfirmationEmail({
        userName: booking.user.name || "Learner",
        sessionTitle: booking.session.title,
        tutorName: booking.session.tutor.name || "Tutor",
        startTime: booking.session.startTime,
        meetingLink: booking.session.meetingLink,
      }) as any,
    });
  }

  revalidatePath("/dashboard/sessions");
  revalidatePath("/tutor/sessions");
}
