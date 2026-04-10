import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCachedTutorSessions } from "@/lib/tutor-cache";
import TutorDashboardClient from "./TutorDashboardClient";

export default async function TutorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "TUTOR") {
    redirect("/auth/redirect");
  }

  if (!session.user.hasCompletedOnboarding) {
    redirect("/tutor/onboarding");
  }

  const rawSessions = await getCachedTutorSessions(session.user.id);

  // Map to the format expected by the client component
  // to avoid serialization issues with Date objects
  const sessions = rawSessions.map((s) => ({
    id: s.id,
    title: s.title,
    // @ts-ignore
    type: s.type,
    // @ts-ignore
    status: s.status,
    startTime: new Date(s.startTime as any).toISOString(),
    endTime: new Date(s.endTime as any).toISOString(),
    meetingLink: s.meetingLink,
    _count: { bookings: s.bookings.length },
  }));

  return (
    <div className="px-page">
      <TutorDashboardClient initialSessions={sessions} user={session.user} />
    </div>
  );
}
