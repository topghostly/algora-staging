"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import TutorDashboardClient from "./TutorDashboardClient";
import { ErrorState } from "@/components/ErrorState";

export default function TutorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/auth/signin");
      return;
    }

    if (session.user.role !== "TUTOR") {
      router.replace("/auth/redirect");
      return;
    }

    if (!session.user.hasCompletedOnboarding) {
      router.replace("/tutor/onboarding");
      return;
    }

    fetch("/api/tutor/sessions")
      .then((res) => res.json())
      .then((data) =>
        setSessions(
          data.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime).toISOString(),
            endTime: new Date(s.endTime).toISOString(),
          })),
        ),
      )
      .catch(() => setSessions(null))
      .finally(() => setFetchLoading(false));
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && fetchLoading)) {
    return (
      <div className="px-page min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <p className="text-muted flex items-center gap-2">
          <Loader size={16} className="animate-spin" style={{ marginRight: "0.4rem" }} />
          Loading dashboard…
        </p>
      </div>
    );
  }

  if (!sessions) {
    return (
      <div className="px-page py-20">
        <ErrorState message="We couldn't load your dashboard right now. Please try again." />
      </div>
    );
  }

  return (
    <div className="px-page">
      <TutorDashboardClient initialSessions={sessions} user={session!.user} />
    </div>
  );
}
