import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Basic security check for Vercel Cron
    // In production, you should also set a CRON_SECRET environment variable
    const authHeader = req.headers.get("authorization");
    // if (
    //   process.env.NODE_ENV === "production" &&
    //   authHeader !== `Bearer ${process.env.CRON_SECRET}`
    // ) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const now = new Date();

    const result = await prisma.tutorSession.updateMany({
      where: {
        status: "PENDING",
        endTime: {
          lt: now,
        },
      },
      data: {
        status: "COMPLETED",
        updatedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
      message: `Updated ${result.count} sessions to COMPLETED`,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
