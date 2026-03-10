import React, { useState } from "react";
import { T } from "./constants";
import {
  IntroSlide,
  FullRefreshSlide,
  IncrementalSlide,
} from "./incremental/IntroSlides";
import { MacroSlide, StrategiesSlide } from "./incremental/StrategySlides";
import { SchemaChangeSlide } from "./incremental/SchemaSlides";
import { QuizSlide } from "./incremental/QuizSlide";

const INCREMENTAL_STEPS = [
  { id: "intro", title: "What's the Problem?" },
  { id: "fullrefresh", title: "Full Refresh" },
  { id: "incremental", title: "Incremental Models" },
  { id: "macro", title: "The is_incremental() Macro" },
  { id: "strategies", title: "Strategies" },
  { id: "schema", title: "Handling Schema Changes" },
  { id: "quiz", title: "Test Your Knowledge" },
];

export function IncrementalCourse() {
  const [step, setStep] = useState(0);

  const slides = [
    IntroSlide,
    FullRefreshSlide,
    IncrementalSlide,
    MacroSlide,
    StrategiesSlide,
    SchemaChangeSlide,
    QuizSlide,
  ];

  const SlideComponent = slides[step];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Tab strip */}
      <div
        style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}
      >
        {INCREMENTAL_STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.18s",
              border: `1px solid ${step === i ? T.orange : "rgba(255,255,255,0.08)"}`,
              background: step === i ? `${T.orange}18` : "transparent",
              color: step === i ? T.orange : T.grey,
            }}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* active slide */}
      <div>
        <SlideComponent />
      </div>

      {/* Navigation buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          paddingTop: 16,
        }}
      >
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: "7px 18px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: step === 0 ? T.slate : T.grey,
            cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            setStep((s) => Math.min(INCREMENTAL_STEPS.length - 1, s + 1))
          }
          disabled={step === INCREMENTAL_STEPS.length - 1}
          style={{
            padding: "7px 20px",
            borderRadius: 8,
            border: `1px solid ${T.orange}44`,
            background:
              step === INCREMENTAL_STEPS.length - 1
                ? "transparent"
                : `${T.orange}14`,
            color: step === INCREMENTAL_STEPS.length - 1 ? T.slate : T.orange,
            cursor:
              step === INCREMENTAL_STEPS.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {step === INCREMENTAL_STEPS.length - 1 ? "End House" : "Next →"}
        </button>
      </div>
    </div>
  );
}
