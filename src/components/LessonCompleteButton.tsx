"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, CircleAlert, Loader2 } from "lucide-react";

interface LessonCompleteButtonProps {
  lessonId: string;
  initialCompleted: boolean;
}

export default function LessonCompleteButton({
  lessonId,
  initialCompleted,
}: LessonCompleteButtonProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const toggleCompletion = async () => {
    setLoading(true);
    const newState = !completed;

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: newState }),
      });

      if (res.ok) {
        setCompleted(newState);
        router.refresh(); // Refresh server components to update sidebar
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      // onClick={toggleCompletion}
      disabled={loading}
      className={`btn btn-outline rounded-lg`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "white",
      }}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : completed ? (
        <CheckCircle size={18} color="var(--primary)" />
      ) : (
        <CircleAlert size={18} color="var(--error)" />
      )}
      {completed ? "Completed" : "Not Complete"}
      {/* {completed ? "Completed" : "Mark as Complete"} */}
    </button>
  );
}
