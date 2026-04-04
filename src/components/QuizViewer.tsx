"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  ArrowRight,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

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
      <div style={{ padding: "2rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <Loader size={18} className="animate-spin" />
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
    <div className="max-w-[800px] mx-auto flex justify-center items-center h-full">
      {!submitted ? (
        <div className="flex flex-col gap-8 mt-10">
          {questions.map((q, index) => (
            <div key={q.id} className="" style={{ padding: "1.5rem" }}>
              <div className="grid grid-cols-[30px_1fr]">
                <h4>
                  <span
                    style={{ color: "var(--muted)", marginRight: "0.5rem" }}
                  >
                    {index + 1}.
                  </span>
                </h4>
                <h4 className="mb-4 leading-tight">{q.text}</h4>
              </div>
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

          <Button
            onClick={handleSubmit}
            variant={"outline"}
            className="w-fit"
            disabled={
              Object.keys(answers).length < questions.length || submitting
            }
          >
            {submitting && <RefreshCw size={18} className="animate-spin" />}
            Submit Quiz
          </Button>
        </div>
      ) : (
        <QuizResultsView
          score={score}
          passed={passed}
          handleRetry={handleRetry}
        />
      )}
    </div>
  );
}

function QuizResultsView({
  score,
  passed,
  handleRetry,
}: {
  score: number;
  passed: boolean;
  handleRetry: () => void;
}) {
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const maxDash = circumference * 0.75;

  return (
    <div className="w-full flex w-full flex-col pt-8">
      <div className="w-full max-w-3xl mx-auto mb-16 px-8">
        <h2 className="text-gray-500 font-sans tracking-tight">Quiz Results</h2>
      </div>

      <div className="relative flex justify-center items-center w-full max-w-[600px] mx-auto min-h-[400px]">
        {/* SVG UI */}
        <svg width="450" height="350" className="absolute top-0">
          <defs>
            <pattern
              id="diagonalHatch"
              width="4"
              height="4"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke="#d1d5db"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* Background circle arc */}
          <circle
            cx="225"
            cy="175"
            r="140"
            fill="transparent"
            stroke="url(#diagonalHatch)"
            strokeWidth="1.5"
            strokeDasharray={`${maxDash} ${circumference}`}
            transform="rotate(135 225 175)"
            strokeLinecap="round"
          />

          {/* Foreground animated circle arc */}
          <motion.circle
            cx="225"
            cy="175"
            r="140"
            fill="transparent"
            stroke="#263238"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${maxDash} ${circumference}`}
            initial={{ strokeDashoffset: maxDash }}
            animate={{ strokeDashoffset: maxDash - (score / 100) * maxDash }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            transform="rotate(135 225 175)"
          />

          {/* Dot travelling at end of stroke */}
          <motion.circle
            cx="225"
            cy="175"
            r="140"
            fill="transparent"
            stroke="#263238"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`0 ${circumference * 2}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -((score / 100) * maxDash) }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            transform="rotate(135 225 175)"
          />

          {/* Label pointer for passing */}
          <polyline
            points="338,93 355,75 390,75"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <text
            x="395"
            y="70"
            fontSize="10"
            letterSpacing="1"
            fontWeight="bold"
            fill="#111827"
          >
            PASSING
          </text>
          <text x="395" y="85" fontSize="10" fill="#9ca3af">
            70%
          </text>
        </svg>

        {/* Center Text and Checkmark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center top-[-25px]">
          <motion.div
            className="text-[13px] font-bold text-[#263238] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Your score {score}%
          </motion.div>
          {passed ? (
            <motion.svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              <motion.path
                d="M4 12 l5 5 l11 -11"
                fill="transparent"
                stroke="#263238"
                strokeWidth="3.5"
                strokeLinecap="square"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              />
            </motion.svg>
          ) : (
            <motion.svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              <motion.path
                d="M6 6 l12 12 M6 18 l12 -12"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="square"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              />
            </motion.svg>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-[-10px] pb-10">
        <div className="w-20 h-[1px] bg-gray-200 mb-6"></div>
        <button
          onClick={handleRetry}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <span className="text-[11px] font-bold tracking-widest text-[#111827] uppercase mb-4 title-font">
            Take Again
          </span>
          <RefreshCw
            size={26}
            strokeWidth={1.5}
            className="text-[#111827] group-hover:-rotate-180 transition-transform duration-700 ease-in-out"
          />
        </button>
      </div>
    </div>
  );
}
