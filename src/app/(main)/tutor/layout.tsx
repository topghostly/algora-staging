import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TUTOR") {
    redirect("/");
  }

  // Fetch the latest calendar connection status from the DB
  // to ensure UI updates immediately after a redirection from route.tsx
  let isCalendarConnected = false;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { calendarConnected: true },
    });
    isCalendarConnected = user?.calendarConnected || false;
  } catch (error) {
    console.error("Error fetching user calendar status:", error);
    // Default to false if DB is down
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 mt-8">{children}</div>
    </div>
  );
}
