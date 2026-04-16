"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import ProgressTrigger from "@/components/ProgressTrigger";
import { Button } from "./ui/button";

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
        <div className="flex-1">{children}</div>

        <div className="flex justify-center fixed bottom-0 right-0 bg-background w-full lg:w-[calc(100%-300px)] py-4 mt-auto border-t border-input">
          <div className="flex gap-4">
            {prevUrl && (
              <Button
                onClick={() => navigate(prevUrl, "prev")}
                variant={"outline"}
                disabled={navigating}
                // className="w-fit py-3 px-8 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
              >
                <ChevronUp size={20} />
                <p className="underline text-sm">{prevTitle && prevTitle.length > 15 ? prevTitle.slice(0, 15) + "…" : prevTitle}</p>
              </Button>
            )}
            <ProgressTrigger
              lessonId={lessonId}
              isCompleted={isCompleted}
              lessonType={lessonType}
            >
              {nextUrl ? (
                <Button
                  onClick={() => navigate(nextUrl, "next")}
                  variant={"outline"}
                  disabled={navigating}
                  // className="w-fit py-2 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
                >
                  <p className="underline text-sm">{nextTitle && nextTitle.length > 15 ? nextTitle.slice(0, 15) + "…" : nextTitle}</p>
                  <ChevronDown size={20} />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/dashboard", "next")}
                  variant={"outline"}
                  disabled={navigating}
                  // className="w-full py-4 bg-secondary flex flex-col gap-0 justify-center items-center cursor-pointer disabled:opacity-60 shrink-0"
                >
                  <p className="underline text-sm">Complete Track</p>
                </Button>
              )}
            </ProgressTrigger>
          </div>
        </div>
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
          {/* <div className="w-full shrink-0 bg-secondary flex flex-col gap-0 items-center justify-center py-2">
            <div className="h-5 w-5 rounded bg-accent/50 animate-pulse" />
            <div className="mt-0.5 h-3.5 w-28 rounded bg-accent/50 animate-pulse" />
          </div> */}

          {/* Mimic lesson header band: full-width bg-secondary, py-8 md:py-18 */}
          <div className="w-full shrink-0 bg-secondary py-6 md:py-10 md:block hidden ">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
              {/* Title */}
              <div className="h-9 w-2/5 rounded-lg bg-accent animate-pulse" />
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
          <div className="w-full h-15 fixed bottom-0 right-0 bg-background border-t border-input flex mt-auto flex-row gap-4 items-center justify-center py-2">
            <div className="h-10 w-30 rounded bg-accent/50 animate-pulse" />
            <div className="mt-0.5 h-10 w-30 rounded bg-accent/50 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
