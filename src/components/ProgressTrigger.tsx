"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProgressTriggerProps {
  lessonId: string;
  isCompleted: boolean;
  lessonType: string;
  children: React.ReactNode;
}

export default function ProgressTrigger({
  lessonId,
  isCompleted,
  lessonType,
  children,
}: ProgressTriggerProps) {
  const router = useRouter();
  const ref = useRef(null);
  // Using 0.5 threshold means once half of the navigation block is visible
  const isInView = useInView(ref, { amount: 0, once: true });

  useEffect(() => {
    if (isInView && lessonType === "TEXT" && !isCompleted) {
      const updateProgress = async () => {
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId, completed: true }),
          });

          if (res.ok) {
            router.refresh();
          }
        } catch (error) {
          console.error("Progress update error:", error);
        }
      };

      updateProgress();
    }
  }, [isInView, lessonId, isCompleted, lessonType, router]);

  return (
    <div ref={ref} className="w-full">
      {children}
    </div>
  );
}
