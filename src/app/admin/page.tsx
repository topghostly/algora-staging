import { prisma } from "@/lib/prisma";
import { Users, BookOpen, PlayCircle, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  const [userCount, trackCount, lessonCount] = await Promise.all([
    prisma.user.count(),
    prisma.track.count(),
    prisma.lesson.count(),
  ]);

  return {
    userCount,
    trackCount,
    lessonCount,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "2rem" }}>
        Dashboard
      </h1>

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
        </div>
      </div>

      <div
        className="card"
        style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}
      >
        <p>Recent activity will appear here...</p>
      </div>
    </div>
  );
}
