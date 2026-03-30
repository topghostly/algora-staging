import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
} from "../../components/shared-ui";

// ── Shared mini component: animated file icon ───────────────────────────
function ManifestFile({
  label,
  glow = false,
  color = T.yellow,
}: {
  label: string;
  glow?: boolean;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "10px 14px",
        borderRadius: 10,
        background: glow ? `${color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${glow ? color + "55" : "rgba(255,255,255,0.08)"}`,
        boxShadow: glow ? `0 0 16px ${color}22` : "none",
        transition: "all 0.35s",
      }}
    >
      <span style={{ fontSize: 22 }}>📄</span>
      <span
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: glow ? color : T.grey,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Step 1: What is the manifest? ───────────────────────────────────────
function ManifestExplainer() {
  const [phase, setPhase] = useState(0);

  const phases = [
    {
      label: "Before dbt run",
      desc: "You have SQL model files on disk. dbt hasn't run yet. No manifest exists.",
    },
    {
      label: "dbt run starts",
      desc: "dbt compiles all your Jinja, resolves all ref() calls, and builds a complete picture of your project.",
    },
    {
      label: "manifest.json written",
      desc: "After compilation, dbt writes manifest.json to target/. It contains a fingerprint (hash) of every model's compiled SQL.",
    },
    {
      label: "Next PR opens",
      desc: "Your PR changes stg_loans.sql. dbt compiles the PR branch — and compares the new hashes against the saved manifest.",
    },
    {
      label: "State diff found!",
      desc: "dbt knows exactly which models changed. It can now run only those models + anything downstream.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Before understanding state, you need to understand{" "}
        <code style={{ color: T.yellow }}>manifest.json</code>. Think of it as a{" "}
        <strong style={{ color: T.yellow }}>
          fingerprint of your entire dbt project
        </strong>
        . dbt produces it on any command that parses your project —{" "}
        <code style={{ color: T.yellow }}>dbt run</code>,{" "}
        <code style={{ color: T.yellow }}>dbt build</code>,{" "}
        <code style={{ color: T.yellow }}>dbt compile</code>,{" "}
        <code style={{ color: T.yellow }}>dbt ls</code>, and more. Click through
        each phase to see how it powers state detection.
      </BeginnerNote>

      {/* Phase stepper */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {phases.map((p, i) => (
          <button
            key={i}
            onClick={() => setPhase(i)}
            style={{
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.18s",
              border: `1px solid ${phase === i ? T.yellow : "rgba(255,255,255,0.08)"}`,
              background: phase === i ? `${T.yellow}18` : "transparent",
              color: phase === i ? T.yellow : T.grey,
            }}
          >
            {i + 1}. {p.label}
          </button>
        ))}
      </div>

      {/* Visual */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "20px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            minHeight: 90,
          }}
        >
          {/* SQL files */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {[
                "stg_loans.sql",
                "int_payments.sql",
                "fct_disbursements.sql",
              ].map((f, i) => (
                <div
                  key={f}
                  style={{
                    padding: "5px 8px",
                    borderRadius: 6,
                    fontSize: 8,
                    fontFamily: "monospace",
                    border: `1px solid ${T.slate}`,
                    background:
                      phase >= 1
                        ? "rgba(74,222,128,0.08)"
                        : "rgba(255,255,255,0.03)",
                    color: phase >= 1 ? T.green : T.greyDark,
                    transition: "all 0.3s",
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
            <span
              style={{
                fontSize: 9,
                color: T.greyDark,
                fontFamily: "monospace",
              }}
            >
              your .sql files
            </span>
          </div>

          {/* Arrow 1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: phase >= 1 ? T.green : T.slate,
                fontFamily: "monospace",
                transition: "color 0.3s",
              }}
            >
              dbt compile
            </div>
            <div
              style={{
                fontSize: 16,
                color: phase >= 1 ? T.green : T.slate,
                transition: "color 0.3s",
              }}
            >
              →
            </div>
          </div>

          {/* Manifest */}
          <ManifestFile
            label="manifest.json"
            glow={phase >= 2}
            color={T.yellow}
          />

          {/* Arrow 2 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: phase >= 3 ? T.orange : T.slate,
                fontFamily: "monospace",
                transition: "color 0.3s",
              }}
            >
              PR branch
            </div>
            <div
              style={{
                fontSize: 16,
                color: phase >= 3 ? T.orange : T.slate,
                transition: "color 0.3s",
              }}
            >
              →
            </div>
          </div>

          {/* New manifest */}
          <ManifestFile
            label="manifest.json (PR)"
            glow={phase >= 3}
            color={T.orange}
          />

          {/* Diff result */}
          {phase >= 4 && (
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: `${T.teal}12`,
                border: `1px solid ${T.teal}44`,
                fontSize: 10,
                fontFamily: "monospace",
                color: T.teal,
                animation: "popIn 0.3s ease",
              }}
            >
              stg_loans.sql changed!
              <br />
              <span style={{ color: T.grey, fontSize: 9 }}>
                hash: a3f1... → c8d2...
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 12,
            color: T.greyLight,
            lineHeight: 1.6,
            maxWidth: 500,
            margin: "14px auto 0",
          }}
        >
          {phases[phase].desc}
        </div>
      </div>

      {/* What's inside the manifest */}
      <SectionTitle>WHAT manifest.json ACTUALLY CONTAINS</SectionTitle>
      <CodeBlock
        code={`# target/manifest.json (simplified)
{
  "nodes": {
    "model.my_project.stg_loans": {
      "compiled_sql": "SELECT loan_id, ...",
      "fqn": ["my_project", "staging", "stg_loans"],
      "depends_on": {
        "nodes": ["source.my_project.core_banking.loans"]
      },
      "checksum": {
        "name": "sha256",
        "checksum": "a3f1c8d2..."  # ← hash of compiled SQL
        # This is what dbt compares to detect changes
      }
    },
    "model.my_project.int_payments": { ... },
    "model.my_project.fct_disbursements": { ... }
  }
}`}
        small
      />
    </div>
  );
}

// ── Step 2: The --defer flag ─────────────────────────────────────────────
function DeferExplainer() {
  const [showDefer, setShowDefer] = useState(false);

  const models = [
    { id: "stg_loans", label: "stg_loans", changed: false, layer: "staging" },
    {
      id: "stg_customers",
      label: "stg_customers",
      changed: false,
      layer: "staging",
    },
    {
      id: "stg_payments",
      label: "stg_payments",
      changed: true,
      layer: "staging",
    },
    {
      id: "int_payments",
      label: "int_payments",
      changed: false,
      layer: "intermediate",
      deps: ["stg_payments"],
    },
    {
      id: "fct_loans",
      label: "fct_disbursements",
      changed: false,
      layer: "mart",
      deps: ["stg_loans", "stg_customers", "int_payments"],
    },
    {
      id: "fct_repayments",
      label: "fct_repayments",
      changed: false,
      layer: "mart",
      deps: ["int_payments"],
    },
  ];

  const modifiedSet = new Set(["stg_payments"]);
  const selectedWithDefer = new Set(modifiedSet);
  let changed = true;
  while (changed) {
    changed = false;
    models.forEach((m) => {
      if (
        !selectedWithDefer.has(m.id) &&
        m.deps?.some((d: any) => selectedWithDefer.has(d))
      ) {
        selectedWithDefer.add(m.id);
        changed = true;
      }
    });
  }

  const getStatus = (m: any) => {
    if (!showDefer) return "rebuild"; // without defer, rebuild all
    if (selectedWithDefer.has(m.id))
      return m.changed ? "modified" : "downstream";
    return "deferred"; // use prod table
  };

  const STATUS: Record<string, any> = {
    rebuild: { color: T.red, label: "REBUILD", bg: "rgba(248,113,113,0.1)" },
    modified: {
      color: T.orange,
      label: "MODIFIED",
      bg: "rgba(251,146,60,0.1)",
    },
    downstream: {
      color: T.yellow,
      label: "DOWNSTREAM",
      bg: "rgba(250,204,21,0.08)",
    },
    deferred: { color: T.teal, label: "USE PROD", bg: `${T.teal}0d` },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        <strong style={{ color: T.teal }}>--defer</strong> is dbt's way of
        saying: "For any upstream model I'm NOT rebuilding today, just use the
        version that's already in production." Without it, dbt would error on
        missing upstream tables in your CI schema.
      </BeginnerNote>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: T.grey }}>
          stg_payments.sql was changed. Show how dbt handles the rest:
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setShowDefer(false)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              border: `1px solid ${!showDefer ? T.red : "rgba(255,255,255,0.08)"}`,
              background: !showDefer ? "rgba(248,113,113,0.12)" : "transparent",
              color: !showDefer ? T.red : T.grey,
            }}
          >
            Without --defer
          </button>
          <button
            onClick={() => setShowDefer(true)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              border: `1px solid ${showDefer ? T.teal : "rgba(255,255,255,0.08)"}`,
              background: showDefer ? `${T.teal}12` : "transparent",
              color: showDefer ? T.teal : T.grey,
            }}
          >
            With --defer
          </button>
        </div>
      </div>

      {/* Model grid */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "16px",
        }}
      >
        {[
          {
            label: "Staging",
            ids: ["stg_loans", "stg_customers", "stg_payments"],
          },
          { label: "Intermediate", ids: ["int_payments"] },
          { label: "Marts", ids: ["fct_loans", "fct_repayments"] },
        ].map((row) => (
          <div key={row.label} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {row.label.toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {row.ids.map((id) => {
                const m = models.find((x) => x.id === id);
                if (!m) return null;
                const status = getStatus(m);
                const s = STATUS[status];
                return (
                  <div
                    key={id}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 8,
                      border: `1px solid ${s.color}55`,
                      background: s.bg,
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: s.color,
                      transition: "all 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <span>{m.label}</span>
                    <span style={{ fontSize: 8, opacity: 0.8 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div
          style={{
            background: "rgba(248,113,113,0.07)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.red,
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            WITHOUT --defer
          </div>
          <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>
            dbt errors: "Table stg_loans does not exist in ci schema." You must
            rebuild ALL upstream models even if you didn't change them.
          </div>
        </div>
        <div
          style={{
            background: `${T.teal}09`,
            border: T.tealBorder,
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.teal,
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            WITH --defer
          </div>
          <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>
            dbt uses prod versions of stg_loans and stg_customers. Only rebuilds
            what actually changed and its downstream. Fast, cheap, correct.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Interactive DAG ──────────────────────────────────────────────
function StateInteractive() {
  const models = [
    { id: "stg_loans", layer: "staging", deps: [], label: "stg_loans" },
    { id: "stg_customers", layer: "staging", deps: [], label: "stg_customers" },
    { id: "stg_payments", layer: "staging", deps: [], label: "stg_payments" },
    {
      id: "int_payments",
      layer: "intermediate",
      deps: ["stg_payments"],
      label: "int_payments_pivoted",
    },
    {
      id: "fct_loans",
      layer: "mart",
      deps: ["stg_loans", "stg_customers", "int_payments"],
      label: "fct_disbursements",
    },
    {
      id: "fct_repayments",
      layer: "mart",
      deps: ["int_payments"],
      label: "fct_repayments",
    },
    {
      id: "dim_customers",
      layer: "mart",
      deps: ["stg_customers"],
      label: "dim_customers",
    },
  ];

  const [modified, setModified] = useState(new Set<string>());
  const toggle = (id: string) =>
    setModified((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectedModified = new Set(modified);
  const selectedModifiedPlus = new Set(modified);
  let ch = true;
  while (ch) {
    ch = false;
    models.forEach((m) => {
      if (
        !selectedModifiedPlus.has(m.id) &&
        m.deps?.some((d) => selectedModifiedPlus.has(d))
      ) {
        selectedModifiedPlus.add(m.id);
        ch = true;
      }
    });
  }

  const [selector, setSelector] = useState("modified+");
  const activeSet =
    selector === "modified"
      ? selectedModified
      : selector === "modified+"
        ? selectedModifiedPlus
        : new Set(
            models
              .filter(
                (m) => !modified.has(m.id) && !selectedModifiedPlus.has(m.id),
              )
              .map((m) => m.id),
          );

  const LAYER_LABEL: Record<string, string> = {
    staging: "Staging",
    intermediate: "Intermediate",
    mart: "Marts",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        <strong style={{ color: T.yellow }}>Click model nodes</strong> to mark
        them as changed. Then switch between selectors to see exactly which
        models each one targets. This is how dbt decides what to run in CI.
      </BeginnerNote>

      {/* Selector picker */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>
          Selector:
        </span>
        {[
          ["modified", T.orange, "Only the changed models themselves"],
          ["modified+", T.yellow, "Changed + all downstream descendants"],
          ["deferred", T.teal, "Unchanged models (uses prod via --defer)"],
        ].map(([sel, c, desc]: any) => (
          <button
            key={sel}
            onClick={() => setSelector(sel)}
            style={{
              padding: "4px 11px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.18s",
              border: `1px solid ${selector === sel ? c : "rgba(255,255,255,0.08)"}`,
              background: selector === sel ? `${c}18` : "transparent",
              color: selector === sel ? c : T.grey,
            }}
          >
            state:{sel}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          [T.orange, "Modified (you changed this)"],
          [T.yellow, "Downstream (depends on modified)"],
          [T.teal, "Deferred (uses prod table)"],
          [T.greyDark, "Unchanged (not selected)"],
        ].map(([c, l]: any) => (
          <div
            key={l}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{ width: 7, height: 7, borderRadius: 2, background: c }}
            />
            <span
              style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}
            >
              {l}
            </span>
          </div>
        ))}
      </div>

      {/* DAG */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        {["staging", "intermediate", "mart"].map((layer) => (
          <div key={layer} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {LAYER_LABEL[layer].toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {models
                .filter((m) => m.layer === layer)
                .map((m) => {
                  const isModified = modified.has(m.id);
                  const isDownstream =
                    !isModified && selectedModifiedPlus.has(m.id);
                  const isDeferred = !selectedModifiedPlus.has(m.id);
                  const isInActive = activeSet.has(m.id);
                  const c = isModified
                    ? T.orange
                    : isDownstream
                      ? T.yellow
                      : isDeferred
                        ? T.teal
                        : T.greyDark;
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggle(m.id)}
                      style={{
                        padding: "7px 13px",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: `1px solid ${isInActive ? c : "rgba(255,255,255,0.06)"}`,
                        background: isInActive
                          ? `${c}15`
                          : "rgba(255,255,255,0.02)",
                        transition: "all 0.2s",
                        fontSize: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isInActive ? c : T.greyDark,
                        fontWeight: isInActive ? 700 : 400,
                        opacity: isInActive || modified.size === 0 ? 1 : 0.45,
                      }}
                    >
                      {m.label}
                      {isModified && (
                        <span style={{ marginLeft: 5, fontSize: 9 }}>✎</span>
                      )}
                      {isDownstream && (
                        <span style={{ marginLeft: 5, fontSize: 9 }}>↓</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Command preview */}
      <div
        style={{
          background: `${T.yellow}09`,
          border: `1px solid ${T.yellow}28`,
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: T.yellow,
            fontFamily: "monospace",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          COMMAND THAT RUNS IN CI
        </div>
        <code
          style={{ fontSize: 11, fontFamily: "monospace", color: "#e2e8f0" }}
        >
          dbt build --select state:{selector} --defer --state ./prod-manifest
        </code>
        {modified.size > 0 ? (
          <div style={{ marginTop: 6, fontSize: 11, color: T.greyLight }}>
            Runs <strong style={{ color: T.yellow }}>{activeSet.size}</strong>{" "}
            of {models.length} models
            {selector === "modified+" &&
              ` (${modified.size} modified + ${activeSet.size - modified.size} downstream)`}
            {selector === "modified" &&
              ` (only the ${modified.size} directly changed)`}
            {selector === "deferred" &&
              ` (reads ${activeSet.size} unchanged models from production)`}
          </div>
        ) : (
          <div style={{ marginTop: 6, fontSize: 11, color: T.greyDark }}>
            ← click model nodes above to see the selection
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 4: Full Slim CI pipeline ────────────────────────────────────────
function SlimCIPipeline() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const pipelineSteps = [
    {
      id: "pr",
      num: "1",
      icon: "🔀",
      label: "PR opened",
      color: T.purple,
      desc: "An engineer opens a Pull Request changing stg_payments.sql and int_payments_pivoted.sql.",
      detail:
        "The PR triggers your CI workflow (GitHub Actions, GitLab CI, dbt Cloud webhooks, etc.).",
    },
    {
      id: "manifest",
      num: "2",
      icon: "📦",
      label: "Download prod manifest",
      color: T.yellow,
      desc: "The CI job downloads manifest.json from the last successful production run.",
      detail: `# Download artifact from dbt Cloud job:
dbt-cloud artifact download \\
  --job-id $PROD_JOB_ID \\
  --run-id latest \\
  --path ./prod-manifest/
# OR: pull from S3/GCS where you stored it`,
    },
    {
      id: "compile",
      num: "3",
      icon: "🔍",
      label: "Detect changes",
      color: T.orange,
      desc: "dbt compares the PR branch manifest against prod manifest. It identifies stg_payments and int_payments as modified.",
      detail: `# dbt does this internally when you pass --state:
# It hashes your compiled SQL for each model
# and compares it to the stored manifest.
# Changed hash = modified model`,
    },
    {
      id: "build",
      num: "4",
      icon: "⚙️",
      label: "Build changed models",
      color: T.teal,
      desc: "dbt builds only modified models + downstream. Unchanged upstream models are deferred to production.",
      detail: `dbt build \\
  --select state:modified+ \\
  --defer \\
  --state ./prod-manifest/ \\
  --target ci
# Result: builds stg_payments, int_payments,
# fct_disbursements, fct_repayments — not the other 396`,
    },
    {
      id: "test",
      num: "5",
      icon: "✅",
      label: "Tests pass",
      color: T.green,
      desc: "All data tests run against the rebuilt models. If tests fail, the PR is blocked from merging.",
      detail: `# dbt build runs tests automatically.
# But you can also run explicitly:
dbt test --select state:modified+
# Tests only models that were rebuilt — fast.`,
    },
    {
      id: "merge",
      num: "6",
      icon: "🚀",
      label: "Merge → prod",
      color: T.green,
      desc: "PR merges. Production job runs the full dbt build and stores a new manifest.json for the next CI run.",
      detail: `# After merge, prod job runs:
dbt build   # full build in prod

# dbt Cloud stores manifest.json automatically.
# Self-hosted: copy target/manifest.json to S3/GCS
# so the next CI run can download it.`,
    },
  ];

  const active = pipelineSteps.find((s) => s.id === activeStep);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Slim CI is the combination of everything you've learned: state
        detection, modified+ selector, and --defer. Click each step to see
        exactly what happens inside your CI pipeline.
      </BeginnerNote>

      {/* Pipeline flow */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0,
            justifyContent: "center",
          }}
        >
          {pipelineSteps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => setActiveStep(activeStep === s.id ? null : s.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 10px",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    activeStep === s.id
                      ? `${s.color}18`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeStep === s.id ? s.color + "55" : "rgba(255,255,255,0.06)"}`,
                  minWidth: 72,
                  transform: activeStep === s.id ? "translateY(-2px)" : "none",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: `${s.color}22`,
                    border: `1px solid ${s.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: s.color,
                    fontWeight: 800,
                  }}
                >
                  {s.num}
                </div>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: 8,
                    fontFamily: "monospace",
                    color: activeStep === s.id ? s.color : T.greyDark,
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div
                  style={{
                    width: 12,
                    height: 1,
                    background: T.slate,
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {active && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${active.color}44`,
            borderRadius: 12,
            padding: "14px 16px",
            animation: "popIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>{active.icon}</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: active.color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Step {active.num}: {active.label}
            </span>
          </div>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: 13,
              lineHeight: 1.7,
              margin: "0 0 10px",
            }}
          >
            {active.desc}
          </p>
          {active.detail.includes("\n") ? (
            <CodeBlock code={active.detail} small />
          ) : (
            <div
              style={{
                fontSize: 11,
                color: T.grey,
                fontFamily: "monospace",
                background: "rgba(4,9,20,0.8)",
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              {active.detail}
            </div>
          )}
        </div>
      )}

      {!activeStep && (
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: T.greyDark,
            fontFamily: "monospace",
          }}
        >
          ↑ click any pipeline step to see what happens inside
        </div>
      )}
    </div>
  );
}

// ── Step 5: Common pitfalls ──────────────────────────────────────────────
function StatePitfalls() {
  const pitfalls = [
    {
      color: T.red,
      icon: "❌",
      title: "Stale manifest = wrong diff",
      problem:
        "If you pass an old manifest.json (e.g. from 3 days ago), dbt compares against stale state. Models changed between then and now will be missed.",
      fix: "Always download the manifest from the latest successful production run. In dbt Cloud CI jobs, deferral is configured automatically — you just set the deferred environment in the job settings.",
      code: `# ❌ Wrong: using a stale or old cached manifest
dbt build --select state:modified+ --state ./old-manifest/

# ✅ Self-hosted: always pull the latest production manifest
dbt-cloud artifact download --run-id latest

# ✅ dbt Cloud CI: set the deferred environment in job settings
# dbt Cloud automatically supplies --defer and --state
# Your CI command is simply:
dbt build --select state:modified+`,
    },
    {
      color: T.orange,
      icon: "⚠️",
      title: "env_var() and var() in model bodies are not tracked",
      problem:
        "If your model uses {{ var('my_var') }} or {{ env_var('MY_VAR') }} inline in its SQL body (not just in config), dbt cannot detect that lineage. Changing the variable value won't cause the model to appear in state:modified.",
      fix: "When a var/env_var change affects logic, trigger a full run for that model explicitly. Use --select to target it by name rather than relying on state detection.",
      code: `# ❌ Won't detect this change:
# my_var changed from 30 to 60 in dbt_project.yml
# but model body has: WHERE days_back < {{ var('my_var') }}
dbt build --select state:modified+  # model not selected!

# ✅ Target the model directly when vars change:
dbt build --select my_model_name`,
    },
    {
      color: T.yellow,
      icon: "⚠️",
      title: "Forgetting --defer in CI",
      problem:
        "If you run state:modified+ without --defer, dbt will error on any upstream model that doesn't exist in your CI schema. Your CI schema is blank — only rebuilt models exist there.",
      fix: "Always pair state:modified+ with --defer and --state in CI. They're a package deal.",
      code: `# ❌ Will error: stg_loans not in ci schema
dbt build --select state:modified+ --state ./manifest/

# ✅ Correct: defer fills missing upstream from prod
dbt build --select state:modified+ \\
  --defer --state ./manifest/`,
    },
    {
      color: T.red,
      icon: "❌",
      title: "--state and --target-path must NOT be the same directory",
      problem:
        "dbt overwrites manifest.json at the start of every run. If --state and --target-path point to the same directory (target/), dbt overwrites the manifest before it can be read for comparison — state detection silently fails.",
      fix: "Always save your reference manifest to a different directory from your --target-path. Copy the prod manifest to ./prod-manifest/ and never set --state target/.",
      code: `# ❌ WRONG: --state and output dir are the same
dbt build --select state:modified+ --state target/
# dbt overwrites target/manifest.json before reading it
# No changes will be detected!

# ✅ CORRECT: use a separate directory for the reference manifest
cp target/manifest.json ./prod-manifest/manifest.json
dbt build --select state:modified+ --state ./prod-manifest/`,
    },
    {
      color: T.purple,
      icon: "💡",
      title: "No manifest = first run problem",
      problem:
        "Brand new project or first CI run — there's no production manifest to compare against. state:modified+ will fail or select nothing.",
      fix: "On the first run, do a full dbt build with no state selection. After it succeeds, save the manifest. Subsequent runs can use state.",
      code: `# First run — no manifest exists yet:
dbt build   # full build, no --select needed

# Save manifest for future CI runs:
cp target/manifest.json ./artifacts/

# All subsequent CI runs:
dbt build --select state:modified+ --defer \\
  --state ./artifacts/`,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        State management is powerful but has sharp edges. These are the mistakes
        every team makes their first time — knowing them upfront will save you
        hours of debugging.
      </BeginnerNote>

      {pitfalls.map((item) => (
        <div
          key={item.title}
          style={{
            background: `${item.color}08`,
            border: `1px solid ${item.color}28`,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: item.color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {item.title}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: T.red,
                  fontFamily: "monospace",
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}
              >
                THE PROBLEM
              </div>
              <div
                style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}
              >
                {item.problem}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: T.green,
                  fontFamily: "monospace",
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}
              >
                THE FIX
              </div>
              <div
                style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}
              >
                {item.fix}
              </div>
            </div>
          </div>
          <CodeBlock code={item.code} small />
        </div>
      ))}
    </div>
  );
}

export function StateSlides() {
  const steps = [
    { title: "What is the manifest?", content: () => <ManifestExplainer /> },
    { title: "The --defer flag", content: () => <DeferExplainer /> },
    {
      title: "Interactive: State Selectors",
      content: () => <StateInteractive />,
    },
    { title: "Slim CI: Full Pipeline", content: () => <SlimCIPipeline /> },
    { title: "Common Pitfalls", content: () => <StatePitfalls /> },
  ];
  return <GenericCourse steps={steps} color={T.yellow} />;
}
