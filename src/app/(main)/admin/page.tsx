import { prisma } from "@/lib/prisma";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Users, BookOpen, PlayCircle, DollarSign } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  const [userCount, trackCount, lessonCount, recentActivities] =
    await Promise.all([
      prisma.user.count(),
      prisma.track.count(),
      prisma.lesson.count(),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

  return {
    userCount,
    trackCount,
    lessonCount,
    recentActivities,
  };
}

export default async function AdminDashboardPage() {
  let stats = null;
  try {
    stats = await getAdminStats();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  }

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "2rem" }}>
        Dashboard
      </h1>

      {!stats ? (
        <div className="card p-12">
          <ErrorState message="We couldn't load the dashboard stats. Please try again later." />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <div
              className="card"
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                  color: "var(--primary)",
                }}
              >
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Total Users
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>
                  {stats.userCount}
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "#e0f2fe",
                  color: "#0284c7",
                }}
              >
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Active Tracks
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>
                  {stats.trackCount}
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                }}
              >
                <PlayCircle size={24} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Total Lessons
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>
                  {stats.lessonCount}
                </div>
              </div>
            </div>

            {/* <div
              className="card"
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "#fef9c3",
                  color: "#ca8a04",
                }}
              >
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Revenue
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>$0.00</div>
              </div>
            </div> */}
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
          <div className="card overflow-x-auto" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--muted-light)",
                  }}
                >
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Action
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Entity
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--muted)",
                      }}
                    >
                      No recent activity found.
                    </td>
                  </tr>
                ) : (
                  stats.recentActivities.map((activity: any) => (
                    <tr
                      key={activity.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {formatAction(activity.action)}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontSize: "0.9rem" }}>
                            {activity.user?.name || "System"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--muted)",
                            }}
                          >
                            {activity.user?.email || ""}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{ fontSize: "0.85rem", color: "var(--muted)" }}
                        >
                          {activity.entityType}:{" "}
                          {activity.entityId?.slice(0, 8)}...
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "right",
                          fontSize: "0.85rem",
                          color: "var(--muted)",
                        }}
                      >
                        {new Date(activity.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
