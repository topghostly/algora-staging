import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  MoveLeft,
} from "lucide-react";
import LessonCompleteButton from "@/components/LessonCompleteButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import QuizViewer from "@/components/QuizViewer";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{
    trackId: string;
    lessonId: string;
  }>;
}

function getEmbedUrl(url: string) {
  if (!url) return "";

  // Handle standard YouTube links (youtube.com/watch?v=...)
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle short YouTube links (youtu.be/...)
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

async function getLessonData(
  trackId: string,
  lessonId: string,
  userId: string,
) {
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
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!track) return null;

  // Find the current lesson
  let currentLesson = null;
  let nextLesson = null;
  let prevLesson = null;

  const allLessons = track.modules.flatMap((m: any) => m.lessons);
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId);

  if (currentIndex !== -1) {
    currentLesson = allLessons[currentIndex];
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;
  }

  return { track, currentLesson, nextLesson, prevLesson };
}

import { canAccessLesson } from "@/lib/access-control";
import VideoPlayer from "@/components/ui/video-palyer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

// ... existing imports

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const { trackId, lessonId } = await params;
  const data = await getLessonData(trackId, lessonId, session.user.id);

  if (!data || !data.currentLesson) {
    notFound();
  }

  const { track, currentLesson, nextLesson, prevLesson } = data;
  const isCompleted = currentLesson.progress.length > 0;

  // Access Control Check
  const hasAccess =
    isCompleted ||
    (await canAccessLesson(
      session.user.id,
      currentLesson.type as "VIDEO" | "TEXT" | "QUIZ",
      session.user.subscriptionTier as
        | "FREE"
        | "BASIC"
        | "PRO_LITE"
        | "PRO_PLUS",
    ));

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "300px",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--background)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 500, lineHeight: 1.3 }}>
            {track.title}
          </h2>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {track.modules.map((module: any) => (
            <div
              key={module.id}
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "var(--muted-light)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--foreground)",
                }}
              >
                {module.title}
              </div>
              <div>
                {module.lessons.map((lesson: any) => {
                  const isActive = lesson.id === currentLesson.id;
                  const isLessonCompleted = lesson.progress.length > 0;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/tracks/${track.id}/lessons/${lesson.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1.5rem",
                        borderLeft: isActive
                          ? "4px solid var(--primary)"
                          : "4px solid transparent",
                        backgroundColor: isActive
                          ? "rgba(var(--primary-rgb), 0.05)"
                          : "transparent",
                        color: isActive
                          ? "var(--primary)"
                          : "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      {isLessonCompleted ? (
                        <CheckCircle size={16} color="var(--primary)" />
                      ) : (
                        <Circle size={16} color="var(--muted)" />
                      )}
                      <span style={{ flex: 1 }}>{lesson.title}</span>
                      {lesson.type === "VIDEO" ? (
                        <PlayCircle size={14} color="var(--muted)" />
                      ) : (
                        <FileText size={14} color="var(--muted)" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "2rem 4rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <BreadcrumbNav
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: track.title, href: `/tracks/${track.id}` },
              { label: currentLesson.title },
            ]}
            className="mb-4"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>
              {currentLesson.title}
            </h1>
            {hasAccess && currentLesson.type !== "QUIZ" && isCompleted && (
              <LessonCompleteButton
                lessonId={currentLesson.id}
                initialCompleted={isCompleted}
              />
            )}
          </div>

          {/* Content Viewer */}
          <div style={{ marginBottom: "3rem" }}>
            {!hasAccess ? (
              <div
                style={{
                  padding: "3rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  textAlign: "center",
                  backgroundColor: "var(--muted-light)",
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <PlayCircle
                    size={48}
                    color="var(--muted)"
                    style={{ margin: "0 auto" }}
                  />
                </div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    marginBottom: "1rem",
                  }}
                >
                  Monthly Limit Reached
                </h2>
                <p
                  style={{
                    color: "var(--muted)",
                    marginBottom: "2rem",
                    maxWidth: "400px",
                    margin: "0 auto 2rem",
                  }}
                >
                  You have reached your limit of 3 free videos this month.
                  Upgrade to Basic for unlimited access to all content.
                </p>
                <Link href="/pricing" className="btn btn-primary">
                  Upgrade to Basic
                </Link>
              </div>
            ) : (
              <>
                {currentLesson.type === "VIDEO" && currentLesson.contentUrl && (
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                      borderRadius: "var(--radius)",
                      backgroundColor: "#000",
                    }}
                  >
                    {/* <iframe
                      src={getEmbedUrl(currentLesson.contentUrl)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      allowFullScreen
                      title={currentLesson.title}
                    /> */}
                    <VideoPlayer
                      videoId={currentLesson.contentUrl}
                      lessonId={currentLesson.id}
                      isCompleted={isCompleted}
                      trackId={track.id}
                    />
                  </div>
                )}

                {currentLesson.type === "TEXT" && currentLesson.textContent && (
                  <div
                    className="prose"
                    style={{
                      lineHeight: 1.8,
                      fontSize: "1.1rem",
                      maxWidth: "none",
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentLesson.textContent}
                    </ReactMarkdown>
                  </div>
                )}

                {currentLesson.type === "QUIZ" && (
                  <QuizViewer
                    lessonId={currentLesson.id}
                    initialCompleted={isCompleted}
                    trackId={track.id}
                    allLessons={track.modules.flatMap((m: any) =>
                      m.lessons.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        completed: l.progress.length > 0,
                      })),
                    )}
                  />
                )}
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "2rem",
            }}
          >
            {prevLesson ? (
              <Link
                href={`/tracks/${track.id}/lessons/${prevLesson.id}`}
                className="btn btn-outline"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <ChevronLeft size={16} /> Previous: {prevLesson.title}
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/tracks/${track.id}/lessons/${nextLesson.id}`}
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                Next: {nextLesson.title} <ChevronRight size={16} />
              </Link>
            ) : (
              <Link href="/dashboard" className="btn btn-primary">
                Complete Track{" "}
                <CheckCircle size={16} style={{ marginLeft: "0.5rem" }} />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
