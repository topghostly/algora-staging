import React, { useState, useRef } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  Callout,
} from "../../components/shared-ui";

export function RetrySimulator() {
  const models = [
    { id: "stg_loans", label: "stg_loans", group: 0 },
    { id: "stg_payments", label: "stg_payments", group: 0 },
    { id: "int_payments", label: "int_payments_pivoted", group: 1 },
    { id: "fct_loans", label: "fct_disbursements", group: 2 },
    { id: "fct_repayments", label: "fct_repayments", group: 2 },
    { id: "dim_customers", label: "dim_customers", group: 2 },
  ];
  // int_payments will fail
  const FAIL_ID = "int_payments";

  const [phase, setPhase] = useState("idle"); // idle | running | failed | fixed | retrying | done
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const timers = useRef<any[]>([]);

  const sched = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const runInitial = () => {
    clearAll();
    setPhase("running");
    setStatuses({});
    const ordered = [
      "stg_loans",
      "stg_payments",
      "int_payments",
      "fct_loans",
      "fct_repayments",
      "dim_customers",
    ];
    ordered.forEach((id, i) => {
      sched(() => setStatuses((p) => ({ ...p, [id]: "running" })), i * 400);
      if (id === FAIL_ID) {
        sched(
          () => setStatuses((p) => ({ ...p, [id]: "error" })),
          i * 400 + 500,
        );
        ["fct_loans", "fct_repayments", "dim_customers"].forEach((sid, j) => {
          sched(
            () => setStatuses((p) => ({ ...p, [sid]: "skipped" })),
            i * 400 + 600 + j * 100,
          );
        });
        sched(() => setPhase("failed"), i * 400 + 900);
      } else if (
        !["fct_loans", "fct_repayments", "dim_customers"].includes(id)
      ) {
        sched(
          () => setStatuses((p) => ({ ...p, [id]: "success" })),
          i * 400 + 500,
        );
      }
    });
  };

  const runRetry = () => {
    clearAll();
    setPhase("retrying");
    // Only retry error + skipped
    const toRetry = [
      "int_payments",
      "fct_loans",
      "fct_repayments",
      "dim_customers",
    ];
    toRetry.forEach((id, i) => {
      sched(() => setStatuses((p) => ({ ...p, [id]: "running" })), i * 450);
      sched(
        () => setStatuses((p) => ({ ...p, [id]: "success" })),
        i * 450 + 500,
      );
    });
    sched(() => setPhase("done"), toRetry.length * 450 + 600);
  };

  const reset = () => {
    clearAll();
    setPhase("idle");
    setStatuses({});
  };

  const STATUS_STYLE: Record<string, any> = {
    idle: {
      color: T.greyDark,
      bg: "rgba(255,255,255,0.03)",
      border: "rgba(255,255,255,0.06)",
      label: "",
    },
    running: {
      color: T.yellow,
      bg: `${T.yellow}10`,
      border: `${T.yellow}44`,
      label: "⚙️",
    },
    success: {
      color: T.green,
      bg: `${T.green}0d`,
      border: `${T.green}44`,
      label: "✓",
    },
    error: {
      color: T.red,
      bg: "rgba(248,113,113,0.12)",
      border: "rgba(248,113,113,0.4)",
      label: "✕",
    },
    skipped: {
      color: T.grey,
      bg: "rgba(255,255,255,0.02)",
      border: "rgba(255,255,255,0.06)",
      label: "⏭",
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Watch a full dbt run fail mid-way, then see how{" "}
        <strong style={{ color: T.orange }}>dbt retry</strong> recovers only the
        failed and skipped models — not the ones that already succeeded.
      </BeginnerNote>

      {/* Model pipeline */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "16px",
        }}
      >
        {[0, 1, 2].map((grp) => (
          <div key={grp} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {grp === 0 ? "STAGING" : grp === 1 ? "INTERMEDIATE" : "MARTS"}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {models
                .filter((m) => m.group === grp)
                .map((m) => {
                  const s = statuses[m.id] || "idle";
                  const st = STATUS_STYLE[s];
                  return (
                    <div
                      key={m.id}
                      style={{
                        padding: "7px 12px",
                        borderRadius: 8,
                        fontSize: 10,
                        fontFamily: "'JetBrains Mono',monospace",
                        border: `1px solid ${st.border}`,
                        background: st.bg,
                        color: st.color,
                        transition: "all 0.3s",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight:
                          s === "error" || s === "running" ? 700 : 400,
                      }}
                    >
                      {st.label && <span>{st.label}</span>}
                      {m.label}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Status message */}
      {phase !== "idle" && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 11,
            fontFamily: "monospace",
            background:
              phase === "failed"
                ? "rgba(248,113,113,0.08)"
                : phase === "done"
                  ? `${T.green}09`
                  : `${T.yellow}09`,
            border: `1px solid ${phase === "failed" ? T.red : phase === "done" ? T.green : T.yellow}33`,
            color:
              phase === "failed"
                ? T.red
                : phase === "done"
                  ? T.green
                  : T.yellow,
          }}
        >
          {phase === "running" && "⚙️  dbt run — processing all 6 models..."}
          {phase === "failed" &&
            "❌ Run failed at int_payments_pivoted. Models fct_disbursements, fct_repayments, dim_customers were skipped."}
          {phase === "fixed" &&
            "🔧 Bug fixed. Ready to retry — only 4 models need to run."}
          {phase === "retrying" &&
            "⚙️  dbt retry — running only failed + skipped models (4 of 6)..."}
          {phase === "done" &&
            "✅ All models succeeded. stg_loans and stg_payments were NOT re-run — they passed first time."}
        </div>
      )}

      {/* target/run_results.json preview */}
      {(phase === "failed" || phase === "fixed") && (
        <div>
          <SectionTitle>
            target/run_results.json — what dbt retry reads
          </SectionTitle>
          <CodeBlock
            code={`{
  "results": [
    { "unique_id": "model.stg_loans",      "status": "success" },
    { "unique_id": "model.stg_payments",   "status": "success" },
    { "unique_id": "model.int_payments",   "status": "error"   },  // ← retry this
    { "unique_id": "model.fct_disbursements", "status": "skipped" },  // ← retry this
    { "unique_id": "model.fct_repayments", "status": "skipped" },  // ← retry this
    { "unique_id": "model.dim_customers",  "status": "skipped" }   // ← retry this
  ]
}`}
            small
          />
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {phase === "idle" && (
          <button
            onClick={runInitial}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: `1px solid ${T.orange}44`,
              background: `${T.orange}14`,
              color: T.orange,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 700,
            }}
          >
            ▶ Run dbt run (will fail)
          </button>
        )}
        {phase === "failed" && (
          <button
            onClick={() => setPhase("fixed")}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: `1px solid ${T.yellow}44`,
              background: `${T.yellow}10`,
              color: T.yellow,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 700,
            }}
          >
            🔧 Fix the bug
          </button>
        )}
        {phase === "fixed" && (
          <button
            onClick={runRetry}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: `1px solid ${T.green}44`,
              background: `${T.green}10`,
              color: T.green,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 700,
            }}
          >
            ▶ dbt retry
          </button>
        )}
        {(phase === "failed" || phase === "done" || phase === "fixed") && (
          <button
            onClick={reset}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
              background: "transparent",
              color: T.grey,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            ↩ Reset
          </button>
        )}
      </div>
    </div>
  );
}

export function RetrySlides() {
  const steps = [
    {
      title: "dbt retry",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Your dbt run has 200 models. Model #150 fails because of a warehouse
            timeout. Without <code style={{ color: T.orange }}>dbt retry</code>,
            you'd rerun all 200. With retry, you rerun only the failed and
            skipped ones.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle color={T.red}>WITHOUT RETRY</SectionTitle>
              <CodeBlock
                code={`dbt run   # 200 models
# ✅ Models 1-149: SUCCESS
# ❌ Model 150: FAILED
# ⏭️ Models 151-200: SKIPPED

# Fix the bug, then:
dbt run   # reruns ALL 200 again 😩
# Even the 149 that passed!`}
                small
              />
            </div>
            <div>
              <SectionTitle color={T.green}>WITH RETRY</SectionTitle>
              <CodeBlock
                code={`dbt run   # 200 models
# ✅ Models 1-149: SUCCESS
# ❌ Model 150: FAILED
# ⏭️ Models 151-200: SKIPPED

# Fix the bug, then:
dbt retry  # reruns only 51 models 🎉
# (1 error + 50 skipped)`}
                small
              />
            </div>
          </div>
          <Callout icon="⚠️" title="IMPORTANT GOTCHA" color={T.orange}>
            <code style={{ color: T.orange }}>dbt retry</code> uses the same
            command flags as the original run. It won't pick up{" "}
            <code style={{ color: T.orange }}>dbt_project.yml</code> changes. If
            you changed project config, run{" "}
            <code style={{ color: T.orange }}>dbt run</code> fresh.
          </Callout>
        </div>
      ),
    },
    {
      title: "Interactive: Watch Retry Work",
      content: () => <RetrySimulator />,
    },
  ];
  return <GenericCourse steps={steps} color={T.orange} />;
}
