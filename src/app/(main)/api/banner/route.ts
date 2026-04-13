import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    const banner = await prisma.siteBanner.findFirst({
      where: {
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: { id: true, message: true, href: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!banner) {
      return NextResponse.json(null);
    }

    return NextResponse.json(banner, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(null);
  }
}
