import React, { useState, useRef } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  InfoCard,
} from "../../components/shared-ui";

export function CloneComparison() {
  const [mode, setMode] = useState<string | null>(null); // null | "rebuild" | "clone"
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<any[]>([]);

  const REBUILD_MODELS = [
    "stg_loans",
    "stg_customers",
    "stg_payments",
    "stg_accounts",
    "int_payments",
    "int_loan_metrics",
    "fct_disbursements",
    "fct_repayments",
    "dim_customers",
    "rpt_portfolio",
  ];

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const simulate = (m: string) => {
    clearAll();
    setMode(m);
    setProgress(0);
    setDone(false);
    if (m === "rebuild") {
      // Slow — one model at a time, 600ms each
      REBUILD_MODELS.forEach((_, i) => {
        const t = setTimeout(
          () => {
            setProgress(i + 1);
            if (i === REBUILD_MODELS.length - 1) setDone(true);
          },
          (i + 1) * 600,
        );
        timers.current.push(t);
      });
    } else {
      // Clone — nearly instant, all at once
      const t1 = setTimeout(() => setProgress(3), 200);
      const t2 = setTimeout(() => setProgress(7), 400);
      const t3 = setTimeout(() => setProgress(10), 600);
      const t4 = setTimeout(() => setDone(true), 700);
      timers.current.push(t1, t2, t3, t4);
    }
  };

  const reset = () => {
    clearAll();
    setMode(null);
    setProgress(0);
    setDone(false);
  };

  const totalModels = REBUILD_MODELS.length;
  const isRebuild = mode === "rebuild";
  const isClone = mode === "clone";
  const color = isRebuild ? T.red : "#67e8f9";
  const pct = Math.round((progress / totalModels) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        A new analyst joins your team. They need a dev environment with data to
        work against. Compare two approaches:{" "}
        <strong style={{ color: T.red }}>rebuild from scratch</strong> vs{" "}
        <strong style={{ color: "#67e8f9" }}>dbt clone</strong>.
      </BeginnerNote>

      {/* Buttons */}
      {!mode && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div
            style={{
              background: "rgba(248,113,113,0.07)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 10,
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.red,
                fontFamily: "'Bricolage Grotesque',sans-serif",
              }}
            >
              🐢 Rebuild from scratch
            </div>
            <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.5 }}>
              Run dbt run --target dev. Rebuilds ALL {totalModels} production
              models by processing every row from source.
            </div>
            <button
              onClick={() => simulate("rebuild")}
              style={{
                padding: "7px",
                borderRadius: 7,
                border: `1px solid ${T.red}44`,
                background: `${T.red}12`,
                color: T.red,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 700,
              }}
            >
              ▶ Simulate rebuild
            </button>
          </div>
          <div
            style={{
              background: "rgba(103,232,249,0.07)",
              border: "1px solid rgba(103,232,249,0.2)",
              borderRadius: 10,
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#67e8f9",
                fontFamily: "'Bricolage Grotesque',sans-serif",
              }}
            >
              ⚡ dbt clone
            </div>
            <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.5 }}>
              Run dbt clone --state ./prod-manifest. Creates zero-copy table
              objects pointing to prod storage — no data moved.
            </div>
            <button
              onClick={() => simulate("clone")}
              style={{
                padding: "7px",
                borderRadius: 7,
                border: "1px solid rgba(103,232,249,0.44)",
                background: "rgba(103,232,249,0.12)",
                color: "#67e8f9",
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 700,
              }}
            >
              ▶ Simulate clone
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {mode && (
        <div
          style={{
            background: "rgba(4,9,20,0.9)",
            border: `1px solid ${color}33`,
            borderRadius: 12,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color,
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {isRebuild
                ? "dbt run --target dev"
                : "dbt clone --state ./prod-manifest"}
            </span>
            <span
              style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}
            >
              {progress}/{totalModels} models
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 8,
              background: T.slate,
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: color,
                borderRadius: 4,
                transition: "width 0.4s ease",
                boxShadow: `0 0 8px ${color}66`,
              }}
            />
          </div>

          {/* Model list */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {REBUILD_MODELS.map((m, i) => {
              const complete = progress > i;
              return (
                <div
                  key={m}
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    padding: "3px 8px",
                    borderRadius: 5,
                    border: `1px solid ${complete ? color + "55" : "rgba(255,255,255,0.06)"}`,
                    background: complete
                      ? `${color}12`
                      : "rgba(255,255,255,0.02)",
                    color: complete ? color : T.greyDark,
                    transition: "all 0.3s",
                    transitionDelay: isRebuild ? `${i * 50}ms` : "0ms",
                  }}
                >
                  {complete && (isClone ? "🪞" : "✓")} {m}
                </div>
              );
            })}
          </div>

          {/* Done message */}
          {done && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 8,
                background: `${color}09`,
                border: `1px solid ${color}33`,
                animation: "popIn 0.2s ease",
              }}
            >
              {isRebuild ? (
                <div style={{ fontSize: 11, color: T.greyLight }}>
                  ⏱️ <strong style={{ color: T.red }}>Rebuild complete</strong>{" "}
                  — Took ~{totalModels * 0.6}s in this simulation. In reality:{" "}
                  <strong style={{ color: T.red }}>1-4 hours</strong> for a full
                  warehouse with large models.
                </div>
              ) : (
                <div style={{ fontSize: 11, color: T.greyLight }}>
                  ⚡{" "}
                  <strong style={{ color: "#67e8f9" }}>Clone complete</strong> —
                  Took ~0.7s in this simulation. In reality:{" "}
                  <strong style={{ color: "#67e8f9" }}>2-10 seconds</strong>{" "}
                  regardless of table size. Zero data moved.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode && (
        <button
          onClick={reset}
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            border: `1px solid ${T.slate}`,
            background: "transparent",
            color: T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            alignSelf: "flex-start",
          }}
        >
          ↩ Compare again
        </button>
      )}
    </div>
  );
}

export function CloneSlides() {
  const steps = [
    {
      title: "dbt clone",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Every developer on your team needs a dev environment with data to
            work against. Traditionally this meant rebuilding production tables
            from scratch — a multi-hour process.{" "}
            <strong style={{ color: "#67e8f9" }}>dbt clone</strong> does it in
            seconds by creating lightweight table objects that point to
            production data without copying it.
          </BeginnerNote>
          <SectionTitle>COMMANDS</SectionTitle>
          <CodeBlock
            code={`# Clone ALL prod models into your dev schema:
dbt clone --state ./prod-manifest

# Clone specific models only:
dbt clone --select fct_disbursements fct_repayments

# Clone a model + all its upstream deps (+):
dbt clone --select +fct_disbursements

# On supported warehouses (e.g. Snowflake):
# CREATE OR REPLACE TABLE dbt_damilare.fct_disbursements
#   CLONE analytics.fct_disbursements;
# ← zero data moved, instant`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <InfoCard
              icon="🪞"
              title="Zero-copy on supported warehouses"
              body="On Snowflake, BigQuery, and Databricks, dbt creates table objects that share underlying storage with production. No data is copied until you write to the clone."
              color="#67e8f9"
            />
            <InfoCard
              icon="🔄"
              title="Fallback on other warehouses"
              body="On warehouses without native cloning, dbt falls back to CREATE TABLE AS SELECT — a full copy. Still useful for workflows, just slower."
              color="#67e8f9"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Rebuild vs Clone",
      content: () => <CloneComparison />,
    },
  ];
  return <GenericCourse steps={steps} color="#67e8f9" />;
}
