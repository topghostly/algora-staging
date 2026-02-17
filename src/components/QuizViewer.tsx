"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface QuizViewerProps {
  lessonId: string;
  initialCompleted: boolean;
  trackId: string;
  allLessons: { id: string; title: string; completed: boolean }[];
}

export default function QuizViewer({
  lessonId,
  initialCompleted,
  trackId,
  allLessons,
}: QuizViewerProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(initialCompleted);
  const [submitting, setSubmitting] = useState(false);

  // Find current lesson index to check prerequisites
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const previousLessons = allLessons.slice(0, currentIndex);
  const firstIncompleteLesson = previousLessons.find((l) => !l.completed);

  useEffect(() => {
    if (!firstIncompleteLesson) {
      fetchQuiz();
    } else {
      setLoading(false);
    }
  }, [lessonId, firstIncompleteLesson]);

  async function fetchQuiz() {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/quiz`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Failed to load quiz", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectOption(questionId: string, optionId: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    let correctCount = 0;
    questions.forEach((q) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (correctOption && correctOption.id === selectedOptionId) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    const isPassed = calculatedScore >= 70; // 70% passing grade
    setPassed(isPassed);

    if (isPassed && !initialCompleted) {
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
        console.error("Error updating progress on quiz pass:", error);
      }
    }
    setSubmitting(false);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setPassed(false);
  }

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading quiz...
      </div>
    );

  if (firstIncompleteLesson) {
    return (
      <div
        className="card"
        style={{
          padding: "3rem",
          textAlign: "center",
          backgroundColor: "var(--muted-light)",
        }}
      >
        <Lock
          size={48}
          color="var(--muted)"
          style={{ margin: "0 auto", marginBottom: "1.5rem" }}
        />
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          Prerequisites Not Met
        </h2>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "2rem",
            maxWidth: "400px",
            margin: "0 auto 2rem",
          }}
        >
          You must complete all previous lessons before you can take this quiz.
        </p>
        <Link
          href={`/tracks/${trackId}/lessons/${firstIncompleteLesson.id}`}
          className="btn btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Complete: {firstIncompleteLesson.title} <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  if (questions.length === 0)
    return (
      <div
        style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}
      >
        No questions in this quiz yet.
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {!submitted ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {questions.map((q, index) => (
            <div key={q.id} className="card" style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                <span style={{ color: "var(--muted)", marginRight: "0.5rem" }}>
                  {index + 1}.
                </span>
                {q.text}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {q.options.map((option) => (
                  <label
                    key={option.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      border:
                        answers[q.id] === option.id
                          ? "1px solid var(--primary)"
                          : "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      backgroundColor:
                        answers[q.id] === option.id
                          ? "rgba(var(--primary-rgb), 0.05)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === option.id}
                      onChange={() => handleSelectOption(q.id, option.id)}
                      style={{
                        width: "1.1rem",
                        height: "1.1rem",
                        accentColor: "var(--primary)",
                      }}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={
              Object.keys(answers).length < questions.length || submitting
            }
            className="btn btn-primary"
            style={{
              alignSelf: "flex-start",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {submitting && <RefreshCw size={18} className="animate-spin" />}
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            {passed ? (
              <CheckCircle
                size={64}
                color="#16a34a"
                style={{ margin: "0 auto", marginBottom: "1rem" }}
              />
            ) : (
              <XCircle
                size={64}
                color="#ef4444"
                style={{ margin: "0 auto", marginBottom: "1rem" }}
              />
            )}
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              {passed ? "Quiz Passed!" : "Quiz Failed"}
            </h2>
            <p style={{ fontSize: "1.2rem", color: "var(--muted)" }}>
              You scored{" "}
              <span style={{ fontWeight: 500, color: "var(--foreground)" }}>
                {score}%
              </span>
            </p>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            {!passed ? (
              <button onClick={handleRetry} className="btn btn-primary">
                <RefreshCw size={18} style={{ marginRight: "0.5rem" }} /> Retry
                Quiz
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <p style={{ color: "var(--muted)" }}>
                  Great job! You have completed this lesson.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
