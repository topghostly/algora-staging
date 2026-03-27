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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import LessonCompleteButton from "@/components/LessonCompleteButton";
import { ErrorState } from "@/components/ErrorState";
import LessonLayout from "@/components/LessonLayout";
import TextLessonContent from "@/components/TextLessonContent";
import QuizViewer from "@/components/QuizViewer";
import ProgressTrigger from "@/components/ProgressTrigger";

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
      <div>
        {prevLesson && (
          <Link href={`/tracks/${track.id}/lessons/${prevLesson.id}`}>
            <div className="py-2 bg-linear-to-r from-gray-500 via-green-500 to-emerald-400 flex flex-col gap-0 justify-center items-center cursor-pointer">
              <ChevronUp color="white" />
              <p
                className="text-md underline"
                style={{
                  color: "white",
                }}
              >
                {/* <span className="hidden sm:inline">Previous:</span>{" "} */}
                {prevLesson.title}
              </p>
            </div>
          </Link>
        )}

        <div className="mb-8 bg-white md:bg-linear-to-r from-zinc-500 via-stone-600 to-zinc-900 py-8 md:py-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1
              className="text-black md:text-white"
              style={{
                fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
              }}
            >
              {currentLesson.title}
            </h1>
            {hasAccess && currentLesson.type !== "QUIZ" && isCompleted && (
              <LessonCompleteButton
                lessonId={currentLesson.id}
                initialCompleted={isCompleted}
              />
            )}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="mb-12 max-w-6xl min-h-[60vh] mx-auto">
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

              {currentLesson.type === "TEXT" && (
                <TextLessonContent
                  lessonId={currentLesson.id}
                  isCompleted={isCompleted}
                  contentUrl={currentLesson.contentUrl}
                  textContent={currentLesson.textContent}
                  title={currentLesson.title}
                />
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

        <ProgressTrigger
          lessonId={currentLesson.id}
          isCompleted={isCompleted}
          lessonType={currentLesson.type}
        >
          <div>
            {nextLesson ? (
              <Link href={`/tracks/${track.id}/lessons/${nextLesson.id}`}>
                <div className="py-2 bg-linear-to-r from-gray-500 via-green-500 to-emerald-400 flex flex-col gap-0 justify-center items-center cursor-pointer">
                  <p
                    className="text-md underline"
                    style={{
                      color: "white",
                    }}
                  >
                    {nextLesson.title}
                  </p>
                  <ChevronDown color="white" />
                </div>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                // className="btn btn-primary flex items-center gap-2"
              >
                <div className="py-4 bg-linear-to-r from-gray-500 via-green-500 to-emerald-400 flex flex-col gap-0 justify-center items-center cursor-pointer">
                  <p
                    className="text-md underline"
                    style={{
                      color: "white",
                    }}
                  >
                    Complete Track
                  </p>
                  {/* <CheckCircle color="white" /> */}
                </div>
              </Link>
            )}
          </div>
        </ProgressTrigger>
      </div>
    </LessonLayout>
  );
}
