"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import ActivityTable, { type ActivityRow } from "./ActivityTable";

interface Stats {
  userCount: number;
  trackCount: number;
  lessonCount: number;
  recentActivities: {
    id: string;
    action: string;
    entityType: string | null;
    entityId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    user: { name: string | null; email: string } | null;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-page min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <p className="text-muted flex items-center gap-2">
          <Loader size={16} className="animate-spin" style={{ marginRight: "0.4rem" }} />
          Loading dashboard…
        </p>
      </div>
    );
  }

  const activityRows: ActivityRow[] = (stats?.recentActivities ?? []).map((a) => ({
    id: a.id,
    action: a.action,
    userName: a.user?.name ?? null,
    userEmail: a.user?.email ?? null,
    entityType: a.entityType ?? null,
    entityId: a.entityId ?? null,
    metadata: a.metadata ?? null,
    createdAt: new Date(a.createdAt),
  }));

  return (
    <div className="px-page flex flex-col gap-10">
      <p className="text-muted mb-0 md:mb-6">Admin Dashboard </p>
      <h1
        style={{
          marginBottom: "0.5rem",
        }}
        className="font-light"
      >
        Hello, <br /> <span className="font-medium">Admin User</span>
      </h1>

      {!stats ? (
        <div className="">
          <ErrorState message="We couldn't load the dashboard stats. Please try again later." />
        </div>
      ) : (
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="card flex items-center gap-4 p-6 max-w-full ">
              <div className="w-full">
                <p className="text-sm text-muted">Total Users</p>
                <p className="text-6xl w-full flex justify-end">
                  {stats.userCount}
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 p-6 w-full">
              <div className="w-full">
                <p className="text-sm text-muted">Active Tracks</p>
                <p className="text-6xl w-full flex justify-end">
                  {stats.trackCount}
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 p-6 w-full">
              <div className="w-full">
                <p className="text-sm text-muted">Total Lessons</p>
                <p className="text-6xl w-full flex justify-end">
                  {stats.lessonCount}
                </p>
              </div>
            </div>
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
              marginBottom: "1.5rem",
            }}
          >
            Recent Activity
          </h2>
          <div className="">
            <ActivityTable rows={activityRows} />
          </div>
        </div>
      )}
    </div>
  );
}
