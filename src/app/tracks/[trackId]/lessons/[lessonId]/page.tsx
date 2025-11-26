import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, PlayCircle, FileText } from "lucide-react";
import LessonCompleteButton from "@/components/LessonCompleteButton";

export const dynamic = "force-dynamic";

interface LessonPageProps {
    params: Promise<{
        trackId: string;
        lessonId: string;
    }>;
}

async function getLessonData(trackId: string, lessonId: string, userId: string) {
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

    const allLessons = track.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);

    if (currentIndex !== -1) {
        currentLesson = allLessons[currentIndex];
        prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
        nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
    }

    return { track, currentLesson, nextLesson, prevLesson };
}

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

    return (
        <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
            {/* Sidebar */}
            <aside style={{
                width: "300px",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--background)",
                overflow: "hidden"
            }}>
                <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <Link href={`/tracks/${track.id}`} style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "0.5rem", display: "block" }}>
                        ← Back to Overview
                    </Link>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3 }}>{track.title}</h2>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {track.modules.map((module) => (
                        <div key={module.id} style={{ borderBottom: "1px solid var(--border)" }}>
                            <div style={{
                                padding: "1rem 1.5rem",
                                backgroundColor: "var(--muted-light)",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "var(--foreground)"
                            }}>
                                {module.title}
                            </div>
                            <div>
                                {module.lessons.map((lesson) => {
                                    const isActive = lesson.id === currentLesson.id;
                                    const isCompleted = lesson.progress.length > 0;

                                    return (
                                        <Link
                                            key={lesson.id}
                                            href={`/tracks/${track.id}/lessons/${lesson.id}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                padding: "0.75rem 1.5rem",
                                                borderLeft: isActive ? "4px solid var(--primary)" : "4px solid transparent",
                                                backgroundColor: isActive ? "rgba(var(--primary-rgb), 0.05)" : "transparent",
                                                color: isActive ? "var(--primary)" : "var(--foreground)",
                                                textDecoration: "none",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle size={16} color="var(--primary)" />
                                            ) : (
                                                <Circle size={16} color="var(--muted)" />
                                            )}
                                            <span style={{ flex: 1 }}>{lesson.title}</span>
                                            {lesson.type === "VIDEO" ? <PlayCircle size={14} color="var(--muted)" /> : <FileText size={14} color="var(--muted)" />}
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{currentLesson.title}</h1>
                        <LessonCompleteButton
                            lessonId={currentLesson.id}
                            isCompleted={currentLesson.progress.length > 0}
                        />
                    </div>

                    {/* Content Viewer */}
                    <div style={{ marginBottom: "3rem" }}>
                        {currentLesson.type === "VIDEO" && currentLesson.contentUrl && (
                            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "var(--radius)", backgroundColor: "#000" }}>
                                <iframe
                                    src={currentLesson.contentUrl}
                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                    allowFullScreen
                                    title={currentLesson.title}
                                />
                            </div>
                        )}

                        {currentLesson.type === "TEXT" && currentLesson.textContent && (
                            <div className="prose" style={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                                {/* We'll need a markdown renderer later, for now just displaying text */}
                                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{currentLesson.textContent}</pre>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
                        {prevLesson ? (
                            <Link href={`/tracks/${track.id}/lessons/${prevLesson.id}`} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <ChevronLeft size={16} /> Previous: {prevLesson.title}
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextLesson ? (
                            <Link href={`/tracks/${track.id}/lessons/${nextLesson.id}`} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                Next: {nextLesson.title} <ChevronRight size={16} />
                            </Link>
                        ) : (
                            <Link href="/dashboard" className="btn btn-primary">
                                Complete Track <CheckCircle size={16} style={{ marginLeft: "0.5rem" }} />
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
