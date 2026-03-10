import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { AccountDisabledEmail } from "@/components/emails/AccountDisabledEmail";
import React from "react";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, role } = body;

    if (action === "update-role") {
      if (!role || !["LEARNER", "TUTOR"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, role: true, name: true },
      });

      return NextResponse.json(updatedUser);
    }

    if (action === "disable") {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { disabled: true },
        select: { id: true, email: true, disabled: true },
      });

      // Send email notification
      await sendEmail({
        to: user.email,
        subject: "Your Algora account has been disabled",
        react: React.createElement(AccountDisabledEmail, {
          name: user.name || "User",
        }),
      });

      return NextResponse.json(updatedUser);
    }

    if (action === "suspend") {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { suspended: true },
        select: { id: true, email: true, suspended: true },
      });
      return NextResponse.json(updatedUser);
    }

    if (action === "unsuspend") {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { suspended: false },
        select: { id: true, email: true, suspended: true },
      });
      return NextResponse.json(updatedUser);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
