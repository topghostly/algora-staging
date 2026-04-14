"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity-log";

export async function createSessionRequest(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  const studentId = session.user.id;
  const title = formData.get("title") as string;
  const tutorId = formData.get("tutorId") as string;
  const preferredDate = formData.get("preferredDate") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const message = formData.get("message") as string;

  if (!title || !tutorId || !preferredDate || !preferredTime) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // Check student credits
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { credits1on1: true },
    });

    if (!student || student.credits1on1 < 1) {
      return { success: false, error: "Insufficient credits" };
    }

    await prisma.$transaction([
      prisma.sessionRequest.create({
        data: {
          title,
          studentId,
          tutorId,
          preferredDate,
          preferredTime,
          message,
          status: "PENDING",
        },
      }),
      prisma.user.update({
        where: { id: studentId },
        data: { credits1on1: { decrement: 1 } },
      }),
    ]);

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/sessions/request");

    return { success: true };
  } catch (error) {
    console.error("Failed to create session request:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateRequestStatus(
  requestId: string,
  status: "ACCEPTED" | "REJECTED",
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.sessionRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.tutorId !== session.user.id) {
    throw new Error("Unauthorized or request not found");
  }

  if (status === "REJECTED") {
    const startTime = new Date(
      `${request.preferredDate}T${request.preferredTime}:00`,
    );
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      const cancelledSession = await tx.tutorSession.create({
        data: {
          title: request.title,
          tutorId: request.tutorId,
          startTime,
          endTime,
          type: "ONE_ON_ONE",
          status: "CANCELLED",
        },
      });

      await tx.sessionEnrollment.create({
        data: {
          userId: request.studentId,
          sessionId: cancelledSession.id,
        },
      });

      await tx.user.update({
        where: { id: request.studentId },
        data: { credits1on1: { increment: 1 } },
      });

      await tx.sessionRequest.delete({
        where: { id: requestId },
      });
    });

    void logActivity({
      userId: session.user.id,
      action: "SESSION_REQUEST_REJECTED",
      entityType: "SESSION_REQUEST",
      entityId: requestId,
      metadata: {
        title: request.title,
        studentId: request.studentId,
        preferredDate: request.preferredDate,
        preferredTime: request.preferredTime,
      },
    });
  } else {
    // ACCEPTED: TutorSession + SessionEnrollment already created by /api/session/create
    await prisma.sessionRequest.delete({
      where: { id: requestId },
    });
  }

  revalidatePath("/tutor/request");
  revalidatePath("/dashboard/sessions");
}
