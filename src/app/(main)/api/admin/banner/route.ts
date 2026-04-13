import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const banner = await prisma.siteBanner.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(banner);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, href, startsAt, endsAt } = body as Record<string, unknown>;

  if (
    typeof message !== "string" ||
    !message.trim() ||
    typeof startsAt !== "string" ||
    typeof endsAt !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (message.trim().length > 300) {
    return NextResponse.json(
      { error: "Message must be 300 characters or fewer" },
      { status: 400 },
    );
  }

  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  if (end <= start) {
    return NextResponse.json(
      { error: "End time must be after start time" },
      { status: 400 },
    );
  }

  const cleanHref =
    typeof href === "string" && href.trim() ? href.trim() : null;

  // Delete any existing banner before creating a fresh one so the new ID
  // is never matched by a user's previously dismissed localStorage key.
  await prisma.siteBanner.deleteMany();

  const banner = await prisma.siteBanner.create({
    data: {
      message: message.trim(),
      href: cleanHref,
      startsAt: start,
      endsAt: end,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "BANNER_CREATED",
    entityType: "BANNER",
    entityId: banner.id,
    metadata: { message: banner.message, startsAt, endsAt },
  });

  return NextResponse.json(banner);
}

export async function DELETE() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.siteBanner.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!existing) {
    return NextResponse.json({ error: "No banner found" }, { status: 404 });
  }

  await prisma.siteBanner.delete({ where: { id: existing.id } });

  await logActivity({
    userId: session.user.id,
    action: "BANNER_DELETED",
    entityType: "BANNER",
    entityId: existing.id,
    metadata: { message: existing.message },
  });

  return NextResponse.json({ success: true });
}
