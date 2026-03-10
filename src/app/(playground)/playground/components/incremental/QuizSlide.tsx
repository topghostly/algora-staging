import React, { useState } from "react";
import { T } from "../../constants";

export const questions = [
  {
    q: "What does is_incremental() return on the very first run of a model?",
    options: [
      "TRUE — it always filters for new rows",
      "FALSE — it loads all rows",
      "An error",
      "NULL",
    ],
    answer: 1,
    explain:
      "On the first run the target table doesn't exist yet, so is_incremental() returns FALSE and dbt does a full load.",
  },
  {
    q: "You have an orders table on Snowflake where order_status can change (e.g. pending → shipped). Which strategy is most appropriate?",
    options: ["append", "delete+insert", "merge", "insert_overwrite"],
    answer: 2,
    explain:
      "merge is the right call — and it's Snowflake's default when unique_key is set. It uses a SQL MERGE statement to UPDATE matching rows and INSERT new ones.",
  },
  {
    q: "What does {{ this }} refer to in a dbt model?",
    options: [
      "The source table",
      "The current model's target table",
      "The dbt project",
      "The Jinja context",
    ],
    answer: 1,
    explain:
      "{{ this }} resolves to the fully-qualified name of the model being built.",
  },
  {
    q: "Which command forces a full rebuild of an incremental model?",
    options: [
      "dbt run --reload",
      "dbt run --full-refresh",
      "dbt rebuild",
      "dbt run --drop-table",
    ],
    answer: 1,
    explain:
      "--full-refresh makes is_incremental() return FALSE, so the model drops and rebuilds the whole table.",
  },
];

export function QuizSlide() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      {!submitted ? (
        <>
          {questions.map((q, qi) => (
            <div
              key={qi}
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: "#475569",
                    fontFamily: "monospace",
                    marginRight: 6,
                  }}
                >
                  Q{qi + 1}.
                </span>
                {q.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${answers[qi] === oi ? "#4ade8055" : "transparent"}`,
                      background:
                        answers[qi] === oi
                          ? "rgba(74,222,128,0.08)"
                          : "rgba(255,255,255,0.02)",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => setAnswers({ ...answers, [qi]: oi })}
                      style={{ accentColor: "#4ade80" }}
                    />
                    <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            style={{
              padding: "12px",
              borderRadius: 8,
              border: "1px solid rgba(74,222,128,0.4)",
              background:
                Object.keys(answers).length < questions.length
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(74,222,128,0.15)",
              color:
                Object.keys(answers).length < questions.length
                  ? "#475569"
                  : "#4ade80",
              fontWeight: 700,
              cursor:
                Object.keys(answers).length < questions.length
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              transition: "all 0.2s",
            }}
          >
            {Object.keys(answers).length < questions.length
              ? `Answer all questions (${Object.keys(answers).length}/${questions.length})`
              : "Submit Answers →"}
          </button>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {score === 4
                ? "🏆"
                : score !== null && score >= 3
                  ? "🎉"
                  : score !== null && score >= 2
                    ? "📚"
                    : "🔄"}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#f1f5f9",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {score}/4 correct
            </div>
          </div>
          {questions.map((q, qi) => {
            const correct = answers[qi] === q.answer;
            return (
              <div
                key={qi}
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: `1px solid ${correct ? "#4ade8033" : "#ef444433"}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: correct ? "#4ade80" : "#f87171",
                    fontFamily: "monospace",
                    marginBottom: 4,
                  }}
                >
                  {correct ? "✓ Correct" : "✗ Incorrect"} — Q{qi + 1}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {q.explain}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
            }}
          >
            ↩ Try Again
          </button>
        </div>
      )}
    </div>
  );
}
