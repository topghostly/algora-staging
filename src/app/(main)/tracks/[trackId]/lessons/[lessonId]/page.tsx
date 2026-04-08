import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import LessonCompleteButton from "@/components/LessonCompleteButton";
import { ErrorState } from "@/components/ErrorState";
import LessonLayout from "@/components/LessonLayout";
import TextLessonContent from "@/components/TextLessonContent";
import QuizViewer from "@/components/QuizViewer";
import LessonTransitionWrapper from "@/components/LessonTransitionWrapper";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{
    trackId: string;
    lessonId: string;
  }>;
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
      <LessonTransitionWrapper
        prevUrl={
          prevLesson
            ? `/tracks/${track.id}/lessons/${prevLesson.id}`
            : undefined
        }
        prevTitle={prevLesson?.title}
        nextUrl={
          nextLesson
            ? `/tracks/${track.id}/lessons/${nextLesson.id}`
            : undefined
        }
        nextTitle={nextLesson?.title}
        lessonId={currentLesson.id}
        isCompleted={isCompleted}
        lessonType={currentLesson.type}
      >
        {currentLesson.type !== "QUIZ" && (
          <div className="mb-8 bg-white md:bg-secondary from-zinc-500 via-stone-600 to-zinc-900 py-8 md:py-18">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-black md:text-white">
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
        )}

        {/* Content Viewer */}
        <div className="mb-12 max-w-6xl w-full bg-red mx-auto">
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
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black w-full shadow-xl">
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
      </LessonTransitionWrapper>
    </LessonLayout>
  );
}
