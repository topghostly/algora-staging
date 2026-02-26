import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Lock,
  MoveLeft,
} from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ErrorState } from "@/components/ErrorState";

export const dynamic = "force-dynamic";

interface TrackOverviewPageProps {
  params: {
    trackId: string;
  };
}

async function getTrackData(trackId: string, userId?: string) {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: { userId: userId || "no-user" },
              },
            },
          },
        },
      },
      enrollments: {
        where: { userId: userId || "no-user" },
      },
    },
  });

  return track;
}

export default async function TrackOverviewPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { trackId } = await params;
  let track;

  try {
    track = await getTrackData(trackId, userId);
  } catch (error) {
    console.error("Error fetching track data:", error);
    return (
      <main className="container py-20">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Track Details" },
          ]}
          className="mb-8"
        />
        <ErrorState message="We couldn't load the track details. Please try again." />
      </main>
    );
  }

  if (!track) {
    notFound();
  }

  const isEnrolled = track.enrollments.length > 0;

  // Calculate progress stats
  const totalLessons = track.modules.reduce(
    (acc: number, m: any) => acc + m.lessons.length,
    0,
  );
  const completedLessons = track.modules.reduce((acc: number, m: any) => {
    return acc + m.lessons.filter((l: any) => l.progress.length > 0).length;
  }, 0);
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find first incomplete lesson to continue
  let firstLessonUrl = "";
  if (track.modules.length > 0 && track.modules[0].lessons.length > 0) {
    // Default to first lesson
    firstLessonUrl = `/tracks/${track.id}/lessons/${track.modules[0].lessons[0].id}`;

    // Try to find first incomplete
    for (const module of track.modules) {
      const lesson = module.lessons.find((l: any) => l.progress.length === 0);
      if (lesson) {
        firstLessonUrl = `/tracks/${track.id}/lessons/${lesson.id}`;
        break;
      }
    }
  }

  return (
    <main className="container" style={{ padding: "4rem 0" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <BreadcrumbNav
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: track.title },
              ]}
              className="mb-4"
            />
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: 500,
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              {track.title}
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: 780,
              }}
            >
              {track.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: "2rem",
                color: "var(--muted)",
                fontSize: "0.95rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <BookOpen size={18} />
                <span>{track.modules.length} Modules</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FileText size={18} />
                <span>{totalLessons} Lessons</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Clock size={18} />
                <span>Self-paced</span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div
            className="card"
            style={{ width: "100%", maxWidth: "350px", padding: "2rem" }}
          >
            {isEnrolled ? (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    <span>Your Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      backgroundColor: "var(--muted-light)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPercentage}%`,
                        backgroundColor: "var(--primary)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
                <Link
                  href={firstLessonUrl}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {progressPercentage > 0
                    ? "Continue Learning"
                    : "Start Learning"}
                </Link>
              </>
            ) : (
              <>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    marginBottom: "1rem",
                  }}
                >
                  Ready to start?
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Enroll now to get full access to this track and track your
                  progress.
                </p>
                <EnrollButton trackId={track.id} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div style={{ maxWidth: "800px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "2rem" }}>
          Curriculum
        </h2>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {track.modules.map((module, index) => (
            <div
              key={module.id}
              className="card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "var(--muted-light)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 500, margin: 0 }}>
                  <span
                    style={{ color: "var(--muted)", marginRight: "0.75rem" }}
                  >
                    Module {index + 1}:
                  </span>
                  {module.title}
                </h3>
              </div>
              <div>
                {module.lessons.map((lesson) => {
                  const isCompleted = lesson.progress.length > 0;
                  // If not enrolled, content is locked (visually)
                  const isLocked = !isEnrolled;

                  return (
                    <div
                      key={lesson.id}
                      style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        color: isLocked ? "var(--muted)" : "var(--foreground)",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} color="var(--primary)" />
                      ) : isLocked ? (
                        <Lock size={20} />
                      ) : lesson.type === "VIDEO" ? (
                        <PlayCircle size={20} />
                      ) : (
                        <FileText size={20} />
                      )}

                      <span style={{ flex: 1, fontWeight: 500 }}>
                        {lesson.title}
                      </span>

                      {isEnrolled && (
                        <Link
                          href={`/tracks/${track.id}/lessons/${lesson.id}`}
                          className="btn btn-outline"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.25rem 0.75rem",
                          }}
                        >
                          {isCompleted ? "Review" : "Start"}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
