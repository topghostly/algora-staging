"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { SessionEnrollmentConfirmation } from "@/components/emails/SessionEnrollmentConfirmation";

export async function bookSession(sessionId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // 1. Get session details
  const targetSession = await prisma.tutorSession.findUnique({
    where: { id: sessionId },
    include: {
      sessionEnrollments: true,
      tutor: { select: { name: true } },
    },
  });

  if (!targetSession) {
    throw new Error("Session not found");
  }

  // 2. Check availability
  if (
    targetSession.type === "ONE_ON_ONE" &&
    targetSession.sessionEnrollments.length >= 1
  ) {
    throw new Error("Session is already booked");
  }

  // 3. Check if already enrolled
  const existingEnrollment = await prisma.sessionEnrollment.findUnique({
    where: {
      userId_sessionId: {
        userId,
        sessionId,
      },
    },
  });

  if (existingEnrollment) {
    throw new Error("You are already enrolled in this session");
  }

  // 4. Check permissions and credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      credits1on1: true,
      subscriptionTier: true,
      email: true,
      name: true,
    },
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

  // 5. Create enrollment
  const enrollment = await prisma.sessionEnrollment.create({
    data: {
      userId,
      sessionId,
    },
  });

  // Send Enrollment Confirmation Email
  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: "Enrollment Confirmed: " + targetSession.title,
      react: SessionEnrollmentConfirmation({
        userName: user.name || "Learner",
        sessionTitle: targetSession.title,
        tutorName: targetSession.tutor.name || "Tutor",
        date: targetSession.startTime.toLocaleDateString(),
        time: `${targetSession.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${targetSession.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        meetingLink: targetSession.meetingLink || "",
      }) as any,
    });
  }

  revalidatePath("/dashboard/sessions");
  revalidatePath("/dashboard/sessions/browse");
  revalidatePath("/tutor/sessions");

  redirect("/dashboard/sessions");
}
