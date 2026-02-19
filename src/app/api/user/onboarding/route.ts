import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { specialties, hasCompletedOnboarding } = await req.json();

    const updateData: any = {};
    if (specialties !== undefined) updateData.specialties = specialties;
    if (hasCompletedOnboarding !== undefined)
      updateData.hasCompletedOnboarding = hasCompletedOnboarding;

    const updatedUser = (await prisma.user.update({
      where: { email: session.user.email! },
      data: updateData,
    })) as any;

    return NextResponse.json({
      success: true,
      user: {
        specialties: updatedUser.specialties,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
