import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  Callout,
} from "../../components/shared-ui";

export function SnapshotTimeline() {
  // Simulate a loan status changing over time
  const timeline = [
    {
      date: "2024-01-15",
      event: "Loan LN-001 created",
      status: "active",
      amount: 5000,
    },
    {
      date: "2024-03-01",
      event: "LN-001 missed first payment",
      status: "delinquent",
      amount: 5000,
    },
    {
      date: "2024-04-10",
      event: "LN-001 fully repaid",
      status: "repaid",
      amount: 5000,
    },
  ];

  const [step, setStep] = useState(0);

  // Build the snapshot table up to current step
  const snapshotRows: any[] = [];
  for (let i = 0; i <= step && i < timeline.length; i++) {
    const t = timeline[i];
    // Close previous row
    if (snapshotRows.length > 0) {
      snapshotRows[snapshotRows.length - 1].valid_to = t.date;
      snapshotRows[snapshotRows.length - 1].is_current = false;
    }
    snapshotRows.push({
      loan_id: "LN-001",
      status: t.status,
      amount: t.amount,
      valid_from: t.date,
      valid_to: null,
      is_current: true,
    });
  }

  const STATUS_COLOR: Record<string, string> = {
    active: "#4ade80",
    delinquent: "#facc15",
    repaid: "#38bdf8",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Without snapshots, your warehouse only stores the <em>current</em> state
        of a record. If a loan changes from{" "}
        <strong style={{ color: "#4ade80" }}>active</strong> to{" "}
        <strong style={{ color: "#facc15" }}>delinquent</strong>, the previous
        state is gone forever. Snapshots capture every version of every record
        over time.{" "}
        <strong style={{ color: T.teal }}>
          Click "Advance time →" to simulate changes and watch the snapshot
          table grow.
        </strong>
      </BeginnerNote>

      {/* Timeline progress */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          background: "rgba(4,9,20,0.8)",
          borderRadius: 10,
          padding: "14px 16px",
          border: `1px solid ${T.slate}`,
        }}
      >
        {timeline.map((t, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", flex: 1 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `2px solid ${i <= step ? STATUS_COLOR[t.status] : T.slate}`,
                  background:
                    i <= step ? `${STATUS_COLOR[t.status]}18` : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  transition: "all 0.3s",
                }}
              >
                {i <= step ? "✓" : i + 1}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: i <= step ? STATUS_COLOR[t.status] : T.greyDark,
                  fontFamily: "monospace",
                  textAlign: "center",
                  lineHeight: 1.4,
                  maxWidth: 80,
                }}
              >
                {t.date}
                <br />
                <span style={{ color: i <= step ? "#f1f5f9" : T.greyDark }}>
                  {t.event}
                </span>
              </div>
            </div>
            {i < timeline.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: i < step ? T.teal : T.slate,
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current loan record */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <SectionTitle>WHAT raw.loans SHOWS RIGHT NOW</SectionTitle>
          <div
            style={{
              background: "rgba(4,9,20,0.9)",
              border: `1px solid ${T.slate}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "5px 10px",
                gap: 0,
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              {["loan_id", "status", "amount"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: T.greyDark,
                    flex: 1,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", padding: "7px 10px", gap: 0 }}>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: T.grey,
                  flex: 1,
                }}
              >
                LN-001
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color:
                    step < timeline.length
                      ? STATUS_COLOR[timeline[step].status]
                      : T.grey,
                  flex: 1,
                  transition: "color 0.3s",
                }}
              >
                {step < timeline.length ? timeline[step].status : "repaid"}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: T.grey,
                  flex: 1,
                }}
              >
                $5,000
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              color: T.red,
              fontFamily: "monospace",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            ⚠️ Only current state. Previous statuses lost forever.
          </div>
        </div>

        <div>
          <SectionTitle color={T.teal}>
            snapshots.snap_loans — HISTORY PRESERVED
          </SectionTitle>
          <div
            style={{
              background: "rgba(4,9,20,0.9)",
              border: `1px solid ${T.teal}33`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "5px 8px",
                gap: 0,
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              {["loan_id", "status", "valid_from", "valid_to", "current?"].map(
                (h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: T.greyDark,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {h}
                  </span>
                ),
              )}
            </div>
            {snapshotRows.length === 0 && (
              <div
                style={{
                  padding: "12px 10px",
                  fontSize: 10,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              >
                Run dbt snapshot to capture first row →
              </div>
            )}
            {snapshotRows.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "5px 8px",
                  gap: 0,
                  borderBottom:
                    i < snapshotRows.length - 1
                      ? `1px solid ${T.slate}`
                      : "none",
                  background: r.is_current ? `${T.teal}08` : "transparent",
                  animation:
                    i === snapshotRows.length - 1 && i > 0
                      ? "popIn 0.3s ease"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: T.grey,
                    flex: 1,
                  }}
                >
                  LN-001
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: STATUS_COLOR[r.status],
                    flex: 1,
                  }}
                >
                  {r.status}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: T.grey,
                    flex: 1,
                  }}
                >
                  {r.valid_from}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: r.valid_to ? T.grey : T.teal,
                    flex: 1,
                    fontStyle: r.valid_to ? "normal" : "italic",
                  }}
                >
                  {r.valid_to || "NULL"}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: r.is_current ? T.green : T.greyDark,
                    flex: 1,
                  }}
                >
                  {r.is_current ? "✓ yes" : "no"}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              color: T.teal,
              fontFamily: "monospace",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            ✓ Full history. NULL valid_to = current row.
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => setStep(0)}
          style={{
            padding: "7px 18px",
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
        <button
          onClick={() => setStep((s) => Math.min(timeline.length - 1, s + 1))}
          disabled={step >= timeline.length - 1}
          style={{
            padding: "7px 22px",
            borderRadius: 8,
            border: `1px solid ${T.teal}55`,
            background:
              step >= timeline.length - 1 ? "transparent" : `${T.teal}18`,
            color: step >= timeline.length - 1 ? T.slate : T.teal,
            fontSize: 11,
            cursor: step >= timeline.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
          }}
        >
          {step >= timeline.length - 1
            ? "✓ All changes captured"
            : "Advance time → (dbt snapshot)"}
        </button>
      </div>
    </div>
  );
}

export function SnapshotsSlides() {
  const steps = [
    {
      title: "The Problem Snapshots Solve",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Most database tables only store the{" "}
            <strong style={{ color: T.teal }}>current state</strong> of a
            record. When a loan status changes from "active" to "repaid", the
            old "active" row is overwritten and gone. But what if Finance asks:{" "}
            <em>"How many loans were delinquent in March 2024?"</em> — you'd
            have no way to answer.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.red,
                  fontFamily: "monospace",
                  marginBottom: 8,
                }}
              >
                ❌ WITHOUT SNAPSHOTS
              </div>
              <div
                style={{
                  background: "rgba(4,9,20,0.8)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    borderBottom: `1px solid ${T.slate}`,
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  raw.loans — today
                </div>
                {[
                  ["LN-001", "repaid"],
                  ["LN-002", "active"],
                  ["LN-003", "defaulted"],
                ].map(([id, s], i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 10px",
                      borderBottom: i < 2 ? `1px solid ${T.slate}` : "none",
                      fontSize: 10,
                      fontFamily: "monospace",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: T.grey }}>{id}</span>
                    <span
                      style={{
                        color:
                          s === "active"
                            ? "#4ade80"
                            : s === "repaid"
                              ? "#38bdf8"
                              : "#f87171",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: T.greyLight,
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                You can only answer questions about <em>today's</em> state.
                Historical questions are impossible.
              </p>
            </div>
            <div
              style={{
                background: `${T.teal}09`,
                border: T.tealBorder,
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.teal,
                  fontFamily: "monospace",
                  marginBottom: 8,
                }}
              >
                ✅ WITH SNAPSHOTS
              </div>
              <div
                style={{
                  background: "rgba(4,9,20,0.8)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    borderBottom: `1px solid ${T.slate}`,
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  snapshots.snap_loans
                </div>
                {[
                  ["LN-001", "active", "Jan 15", "Mar 01"],
                  ["LN-001", "delinquent", "Mar 01", "Apr 10"],
                  ["LN-001", "repaid", "Apr 10", "NULL"],
                ].map(([id, s, from, to], i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderBottom: i < 2 ? `1px solid ${T.slate}` : "none",
                      fontSize: 9,
                      fontFamily: "monospace",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: T.grey, minWidth: 40 }}>{id}</span>
                    <span
                      style={{
                        color:
                          s === "active"
                            ? "#4ade80"
                            : s === "delinquent"
                              ? "#facc15"
                              : "#38bdf8",
                        minWidth: 70,
                      }}
                    >
                      {s}
                    </span>
                    <span style={{ color: T.greyDark }}>
                      {from}→{to}
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: T.greyLight,
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                Full history preserved. Answer any point-in-time question.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Watch Snapshots Work",
      content: () => <SnapshotTimeline />,
    },
    {
      title: "Snapshot Strategies",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            dbt needs to know <em>when</em> a record changed. There are two
            strategies: <strong style={{ color: T.teal }}>timestamp</strong>{" "}
            (recommended — uses{" "}
            <code style={{ color: T.teal }}>updated_at</code>) and{" "}
            <strong style={{ color: T.teal }}>check</strong> (compares specific
            columns). The official docs strongly recommend timestamp wherever
            possible.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle color={T.teal}>
                TIMESTAMP STRATEGY — recommended ✓
              </SectionTitle>
              <CodeBlock
                code={`-- YAML config (dbt Core v1.9+ — current standard)
-- snapshots/snap_loans.yml
snapshots:
  - name: snap_loans
    relation: source('core_banking', 'loans')
    config:
      schema: snapshots
      unique_key: loan_id
      strategy: timestamp
      updated_at: updated_at

-- Legacy block syntax (still valid, older projects):
-- {% snapshot snap_loans %}
--   {{ config(strategy='timestamp', unique_key='loan_id',
--     target_schema='snapshots', updated_at='updated_at') }}
--   SELECT loan_id, status, updated_at
--   FROM {{ source('core_banking','loans') }}
-- {% endsnapshot %}`}
                small
              />
              <p
                style={{
                  fontSize: 11,
                  color: T.greyLight,
                  marginTop: 8,
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: T.teal }}>Why recommended:</strong>{" "}
                tracks only one column, handles schema evolution (add/remove
                columns) gracefully, and is more efficient.
              </p>
            </div>
            <div>
              <SectionTitle color={T.yellow}>
                CHECK STRATEGY — fallback only
              </SectionTitle>
              <CodeBlock
                code={`-- snapshots/snap_loans_check.yml
snapshots:
  - name: snap_loans_check
    relation: source('core_banking', 'loans')
    config:
      schema: snapshots
      unique_key: loan_id
      strategy: check
      check_cols:
        - status
        - amount
      # Check every column:
      # check_cols: all

# ⚠️ If you add/remove columns from check_cols
# you must update this config file.
# Timestamp strategy avoids this entirely.`}
                small
              />
              <p
                style={{
                  fontSize: 11,
                  color: T.greyLight,
                  marginTop: 8,
                  lineHeight: 1.55,
                }}
              >
                Use only when your source has no{" "}
                <code style={{ color: T.yellow }}>updated_at</code> column. More
                brittle — schema changes require config updates.
              </p>
            </div>
          </div>

          <Callout
            icon="💡"
            title="dbt_valid_to_current (dbt Core v1.9+)"
            color={T.teal}
          >
            By default, current records have{" "}
            <code style={{ color: T.teal }}>dbt_valid_to = NULL</code>. Set{" "}
            <code style={{ color: T.teal }}>
              dbt_valid_to_current: "9999-12-31"
            </code>{" "}
            in config so all records have a real date — makes BETWEEN range
            queries simpler and avoids NULL handling everywhere.
          </Callout>

          <SectionTitle>QUERYING SNAPSHOT HISTORY</SectionTitle>
          <CodeBlock
            code={`-- All loans that were delinquent during Q1 2024:
SELECT loan_id, status, dbt_valid_from, dbt_valid_to
FROM {{ ref('snap_loans') }}
WHERE status = 'delinquent'
  AND dbt_valid_from < '2024-04-01'
  AND (dbt_valid_to > '2024-01-01' OR dbt_valid_to IS NULL)

-- With dbt_valid_to_current='9999-12-31' — simpler BETWEEN:
SELECT loan_id, status
FROM {{ ref('snap_loans') }}
WHERE '2024-03-01' BETWEEN dbt_valid_from AND dbt_valid_to`}
          />

          <Callout
            icon="⚠️"
            title="NEVER RUN --full-refresh ON A SNAPSHOT IN PRODUCTION"
            color={T.red}
          >
            <code style={{ color: T.red }}>dbt snapshot --full-refresh</code>{" "}
            permanently wipes all history. There is no undo. Development only.
            The entire purpose of a snapshot is to preserve history — destroying
            it defeats the point.
          </Callout>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.teal} />;
}
