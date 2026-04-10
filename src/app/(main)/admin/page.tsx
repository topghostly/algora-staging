import { prisma } from "@/lib/prisma";
import { Users, BookOpen, PlayCircle } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import ActivityTable, { type ActivityRow } from "./ActivityTable";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  const [userCount, trackCount, lessonCount, recentActivities] =
    await Promise.all([
      prisma.user.count(),
      prisma.track.count(),
      prisma.lesson.count(),
      prisma.activityLog.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

  return { userCount, trackCount, lessonCount, recentActivities };
}

export default async function AdminDashboardPage() {
  let stats = null;
  try {
    stats = await getAdminStats();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  }

  const activityRows: ActivityRow[] = (stats?.recentActivities ?? []).map(
    (a) => ({
      id: a.id,
      action: a.action,
      userName: a.user?.name ?? null,
      userEmail: a.user?.email ?? null,
      entityType: a.entityType ?? null,
      entityId: a.entityId ?? null,
      metadata: (a.metadata as Record<string, unknown>) ?? null,
      createdAt: a.createdAt,
    }),
  );

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
