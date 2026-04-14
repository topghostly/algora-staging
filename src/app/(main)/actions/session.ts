"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SessionType } from "@prisma/client";

export async function createSession(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user ||
    (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as SessionType;
  const date = formData.get("date") as string;
  const startTimeStr = formData.get("startTime") as string;
  const durationStr = formData.get("duration") as string;
  const meetingLink = formData.get("meetingLink") as string;

  if (!title || !type || !date || !startTimeStr || !durationStr) {
    throw new Error("Missing required fields");
  }

  // Combine date and time (using explicit +01:00 offset for Lagos timezone to avoid Vercel UTC misparsing)
  const startDateTime = new Date(`${date}T${startTimeStr}:00+01:00`);
  const duration = parseInt(durationStr);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  await prisma.tutorSession.create({
    data: {
      title,
      type,
      startTime: startDateTime,
      endTime: endDateTime,
      meetingLink,
      tutorId: session.user.id,
    },
  });

  revalidatePath("/tutor/sessions");
  redirect("/tutor/sessions");
}
