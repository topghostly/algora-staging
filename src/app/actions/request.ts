"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSessionRequest(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const studentId = session.user.id;
  const title = formData.get("title") as string;
  const tutorId = formData.get("tutorId") as string;
  const preferredDate = formData.get("preferredDate") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const message = formData.get("message") as string;

  if (!title || !tutorId || !preferredDate || !preferredTime) {
    throw new Error("Missing required fields");
  }

  // Check student credits
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { credits1on1: true },
  });

  if (!student || student.credits1on1 < 1) {
    throw new Error("Insufficient credits");
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

  redirect("/dashboard/sessions");
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

  if (status === "REJECTED" && request.status !== "REJECTED") {
    await prisma.$transaction([
      prisma.sessionRequest.update({
        where: { id: requestId },
        data: { status },
      }),
      prisma.user.update({
        where: { id: request.studentId },
        data: { credits1on1: { increment: 1 } },
      }),
    ]);
  } else {
    await prisma.sessionRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  revalidatePath("/tutor/request");
  revalidatePath("/dashboard/sessions");
}
