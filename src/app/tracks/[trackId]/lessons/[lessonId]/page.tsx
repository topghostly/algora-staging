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
import { ErrorState } from "@/components/ErrorState";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import QuizViewer from "@/components/QuizViewer";
import LessonLayout from "@/components/LessonLayout";

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
  let data = null;
  try {
    data = await getLessonData(trackId, lessonId, session.user.id);
  } catch (error) {
    console.error("Error fetching lesson data:", error);
  }

  if (!data || !data.currentLesson) {
    if (data === null) {
      return (
        <div className="container py-20">
          <ErrorState message="We couldn't load the lesson content. Please try again." />
        </div>
      );
    }
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
    <LessonLayout track={track} currentLesson={currentLesson}>
      <div className="p-0 md:p-10 max-w-5xl mx-auto py-16">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: track.title, href: `/tracks/${track.id}` },
            { label: currentLesson.title },
          ]}
          className="mb-6"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2>{currentLesson.title}</h2>
          {hasAccess && currentLesson.type !== "QUIZ" && isCompleted && (
            <LessonCompleteButton
              lessonId={currentLesson.id}
              initialCompleted={isCompleted}
            />
          )}
        </div>

        {/* Content Viewer */}
        <div className="mb-12">
          {!hasAccess ? (
            <div className="p-8 md:p-12 border border-border rounded-2xl text-center bg-muted/30">
              <div className="mb-6">
                <PlayCircle
                  size={48}
                  className="text-muted-foreground mx-auto"
                />
              </div>
              <h2 className="text-2xl font-medium mb-3">
                Monthly Limit Reached
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You have reached your limit of 3 free videos this month. Upgrade
                to Basic for unlimited access to all content.
              </p>
              <Link href="/pricing" className="btn btn-primary px-8">
                Upgrade to Basic
              </Link>
            </div>
          ) : (
            <>
              {currentLesson.type === "VIDEO" && currentLesson.contentUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl">
                  <VideoPlayer
                    videoId={currentLesson.contentUrl}
                    lessonId={currentLesson.id}
                    isCompleted={isCompleted}
                    trackId={track.id}
                  />
                </div>
              )}

              {currentLesson.type === "TEXT" && currentLesson.textContent && (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
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
        <div className="flex flex-wrap justify-between gap-4 mt-12 pt-8 border-t border-border">
          {prevLesson ? (
            <Link
              href={`/tracks/${track.id}/lessons/${prevLesson.id}`}
              className="btn btn-outline flex items-center text-xs gap-2"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline text-xs">Previous:</span>{" "}
              {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/tracks/${track.id}/lessons/${nextLesson.id}`}
              className="btn btn-primary flex items-center text-xs gap-2"
            >
              <span className="hidden sm:inline text-xs">Next:</span>{" "}
              {nextLesson.title}
              <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="btn btn-primary flex items-center gap-2"
            >
              Complete Track
              <CheckCircle size={16} />
            </Link>
          )}
        </div>
      </div>
    </LessonLayout>
  );
}
