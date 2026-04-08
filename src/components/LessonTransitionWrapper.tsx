"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import ProgressTrigger from "@/components/ProgressTrigger";

const STORAGE_KEY = "lesson-nav-dir";

interface LessonTransitionWrapperProps {
  prevUrl?: string;
  prevTitle?: string;
  nextUrl?: string;
  nextTitle?: string;
  lessonId: string;
  isCompleted: boolean;
  lessonType: string;
  children: React.ReactNode;
}

export default function LessonTransitionWrapper({
  prevUrl,
  prevTitle,
  nextUrl,
  nextTitle,
  lessonId,
  isCompleted,
  lessonType,
  children,
}: LessonTransitionWrapperProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [navigating, setNavigating] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Entrance animation — runs once on mount
  useEffect(() => {
    const dir = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    // "no-entrance": placeholder handled the incoming animation; just reveal content instantly
    if (!dir || dir === "no-entrance") return;

    const el = contentRef.current;
    if (!el) return;

    // "prev" clicked on previous page → we are the earlier lesson → enter from top
    // "next" clicked on previous page → we are the later lesson → enter from bottom
    const startY = dir === "prev" ? "-100%" : "100%";

    el.style.transition = "none";
    el.style.transform = `translateY(${startY})`;
    el.style.opacity = "0";

    el.getBoundingClientRect();

    el.style.transition =
      "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease";
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  }, []);

  function navigate(url: string, dir: "prev" | "next") {
    if (navigating) return;
    const el = contentRef.current;
    if (!el) {
      router.push(url);
      return;
    }

    setNavigating(true);

    const exitY = dir === "prev" ? "100%" : "-100%";
    const enterY = dir === "prev" ? "-100%" : "100%";

    // 1. Slide the current lesson content (+ nav) out
    el.style.transition =
      "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
    el.style.transform = `translateY(${exitY})`;
    el.style.opacity = "0";

    // 2. Mount the placeholder off-screen, then animate it in simultaneously
    setShowPlaceholder(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ph = placeholderRef.current;
        if (!ph) return;
        // Position it off-screen (no transition yet to avoid flash)
        ph.style.transition = "none";
        ph.style.transform = `translateY(${enterY})`;
        ph.style.opacity = "1";
        ph.getBoundingClientRect(); // force layout
        // Slide in
        ph.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        ph.style.transform = "translateY(0)";
      });
    });

    // 3. Tell the incoming page to skip its entrance animation —
    //    it will just populate the already-settled layout instantly
    sessionStorage.setItem(STORAGE_KEY, "no-entrance");

    // 4. Kick off navigation immediately so the server fetch runs in parallel
    //    with the animation. The placeholder stays visible until Next.js swaps
    //    the page in.
    router.push(url);
  }

  return (
    // overflow-hidden clips the sliding panels; relative anchors the placeholder
    <div className="flex flex-col min-h-[calc(100vh-116px)] overflow-hidden relative">
      {/* ── Animated unit: prev nav + lesson content + next nav ── */}
      <div ref={contentRef} className="flex flex-col flex-1">
        {prevUrl && (
          <button
            onClick={() => navigate(prevUrl, "prev")}
            disabled={navigating}
            className="w-full py-2 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
          >
            <ChevronUp color="white" size={20} />
            <p className="text-sm underline text-white">{prevTitle}</p>
          </button>
        )}

        <div className="flex-1">{children}</div>

        <ProgressTrigger
          lessonId={lessonId}
          isCompleted={isCompleted}
          lessonType={lessonType}
        >
          {nextUrl ? (
            <button
              onClick={() => navigate(nextUrl, "next")}
              disabled={navigating}
              className="w-full py-2 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
            >
              <p className="text-sm underline text-white">{nextTitle}</p>
              <ChevronDown color="white" size={20} />
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard", "next")}
              disabled={navigating}
              className="w-full py-4 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
            >
              <p className="text-sm underline text-white">Complete Track</p>
            </button>
          )}
        </ProgressTrigger>
      </div>

      {/* ── Skeleton placeholder ── slides in from the opposite direction,
           waits in place until the new page's lesson content is ready,
           then the new page mounts over it with no entrance animation.    ── */}
      {showPlaceholder && (
        <div
          ref={placeholderRef}
          className="absolute inset-0 flex flex-col bg-background"
          style={{ opacity: 0 }} // JS animates opacity to 1 once positioned
        >
          {/* Mimic prev nav button — py-2 + chevron (20px) + text-sm ≈ same height */}
          <div className="w-full shrink-0 bg-secondary flex flex-col gap-0 items-center justify-center py-2">
            <div className="h-5 w-5 rounded bg-accent/50 animate-pulse" />
            <div className="mt-0.5 h-3.5 w-28 rounded bg-accent/50 animate-pulse" />
          </div>

          {/* Mimic lesson header band: full-width bg-secondary, py-8 md:py-18 */}
          <div className="w-full shrink-0 bg-secondary py-8 md:py-18 md:block hidden ">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
              {/* Title */}
              <div className="h-14 w-2/5 rounded-lg bg-accent animate-pulse" />
              {/* Complete button placeholder */}
              <div className="h-9 w-30 rounded-lg bg-accent/40 animate-pulse hidden md:block" />
            </div>
          </div>

          {/* Mimic content area: mb-12 max-w-6xl mx-auto */}
          {/* <div className="flex-1 overflow-hidden">
            <div className="mb-12 max-w-6xl w-full mx-auto px-4 pt-6 space-y-4">
              Main block — video aspect-video / text body
              <div className="w-full aspect-video rounded-2xl bg-muted animate-pulse" />
              Body text lines
              <div className="space-y-2.5 pt-2">
                <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-11/12 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-4/5 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div> */}

          {/* Mimic next nav button — py-2 + text-sm + chevron ≈ same height */}
          <div className="w-full shrink-0 bg-secondary flex mt-auto flex-col gap-0 items-center justify-center py-2">
            <div className="h-3.5 w-36 rounded bg-accent/50 animate-pulse" />
            <div className="mt-0.5 h-5 w-5 rounded bg-accent/50 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
