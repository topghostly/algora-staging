import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCachedTutorSessions } from "@/lib/tutor-cache";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await getCachedTutorSessions(session.user.id);

    return NextResponse.json(
      sessions.map((s) => ({
        ...s,
        _count: { bookings: s.bookings.length },
        bookings: undefined,
      })),
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
