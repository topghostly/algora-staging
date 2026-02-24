"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  order: number;
  options: Option[];
}

interface QuizEditorProps {
  lessonId: string;
}

export default function QuizEditor({ lessonId }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  async function fetchQuestions() {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/quiz`);
      if (res.ok) {
        const data = await res.json();
        // Map DB format to UI format if needed, but it should match mostly
        // We might need to ensure options exist
        const formatted = data.map((q: any) => ({
          text: q.text,
          order: q.order,
          options: q.options.map((o: any) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        }));
        setQuestions(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/quiz`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save quiz");
      }
      toast.success("Quiz saved successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Error saving quiz: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        text: "New Question",
        order: questions.length,
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
        ],
      },
    ]);
  }

  function removeQuestion(index: number) {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  }

  function updateQuestion(index: number, field: string, value: any) {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  }

  function addOption(qIndex: number) {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "New Option", isCorrect: false });
    setQuestions(newQuestions);
  }

  function removeOption(qIndex: number, oIndex: number) {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  }

  function updateOption(
    qIndex: number,
    oIndex: number,
    field: string,
    value: any,
  ) {
    const newQuestions = [...questions];
    (newQuestions[qIndex].options[oIndex] as any)[field] = value;
    setQuestions(newQuestions);
  }

  if (isLoading) return <div>Loading quiz...</div>;

  return (
    <div
      style={{
        marginTop: "2rem",
        borderTop: "1px solid var(--border)",
        paddingTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 500 }}>Quiz Questions</h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? "Saving..." : "Save Quiz"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="card"
            style={{ padding: "1.5rem", border: "1px solid var(--border)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <label className="label">Question {qIndex + 1}</label>
                <input
                  className="input"
                  style={{ width: "100%" }}
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, "text", e.target.value)
                  }
                />
              </div>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="btn-icon"
                style={{
                  color: "var(--error)",
                  marginLeft: "1rem",
                  alignSelf: "center",
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div style={{ paddingLeft: "1rem" }}>
              <label className="label" style={{ fontSize: "0.9rem" }}>
                Options
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {q.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        // Uncheck others
                        const newQuestions = [...questions];
                        newQuestions[qIndex].options.forEach(
                          (o) => (o.isCorrect = false),
                        );
                        newQuestions[qIndex].options[oIndex].isCorrect = true;
                        setQuestions(newQuestions);
                      }}
                      style={{ width: "1.2rem", height: "1.2rem" }}
                    />
                    <input
                      className="input"
                      style={{ flex: 1 }}
                      value={option.text}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, "text", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="btn-icon"
                      style={{ color: "var(--muted)" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className="btn btn-sm btn-outline"
                  style={{ width: "fit-content", marginTop: "0.5rem" }}
                >
                  <Plus size={14} style={{ marginRight: "0.25rem" }} /> Add
                  Option
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="btn btn-outline"
          style={{ padding: "1rem", borderStyle: "dashed" }}
        >
          <Plus size={18} style={{ marginRight: "0.5rem" }} /> Add Question
        </button>
      </div>
    </div>
  );
}
