import React, { useState } from "react";
import { T } from "../../constants";

export const schemaOptions = [
  {
    id: "ignore",
    label: "ignore",
    color: "#94a3b8",
    emoji: "🙈",
    isDefault: true,
    desc: "New columns in the source are silently ignored. The target schema stays frozen as-is.",
    behavior:
      "device_type added to source → NOT added to mart_events. Old rows and new rows both miss the column.",
    when: "Your source schema is tightly controlled and rarely changes. You want no surprises in production.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='ignore'  -- default
) }}`,
    dbtAction:
      "dbt detects the schema diff but takes no action. Runs normally.",
    snowflakeSql:
      "-- No ALTER TABLE\nINSERT INTO mart_events (event_id, loan_id, event_type, created_at)\nSELECT event_id, loan_id, event_type, created_at FROM staging\n-- device_type is silently dropped from the SELECT",
  },
  {
    id: "fail",
    label: "fail",
    color: "#ef4444",
    emoji: "🚨",
    isDefault: false,
    desc: "dbt raises a hard error and aborts the run the moment it detects any schema difference.",
    behavior:
      "device_type added to source → dbt run fails immediately with a clear error. Nothing is written.",
    when: "Any schema change should be a conscious decision. Forces the team to review and run --full-refresh deliberately.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='fail'
) }}`,
    dbtAction:
      "Schema mismatch detected → RuntimeError raised → run aborted. No data written.",
    snowflakeSql:
      "-- dbt raises:\n-- RuntimeError: detected column additions/removals\n-- Run aborted. Use --full-refresh to rebuild.",
  },
  {
    id: "append_new_columns",
    label: "append_new_columns",
    color: "#fb923c",
    emoji: "➕",
    isDefault: false,
    desc: "Automatically ALTERs the target table to add new columns. Existing rows get NULL for those columns.",
    behavior:
      "device_type added to source → ALTER TABLE adds it to mart_events. New rows have values. Old rows get NULL.",
    when: "Additive schema changes are expected and safe. You're OK with NULLs in historical rows.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='append_new_columns'
) }}`,
    dbtAction:
      "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR → then proceeds with normal INSERT.",
    snowflakeSql:
      "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR;\nINSERT INTO mart_events\nSELECT event_id, loan_id, event_type, created_at, device_type\nFROM staging;",
  },
  {
    id: "sync_all_columns",
    label: "sync_all_columns",
    color: "#4ade80",
    emoji: "🔄",
    isDefault: false,
    desc: "Full column sync — adds new columns AND drops removed ones. Target mirrors source exactly.",
    behavior:
      "device_type added + created_at removed from source → both changes reflected in mart_events.",
    when: "Source schema is the single source of truth. You want target to always mirror it exactly. Destructive — use carefully.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='sync_all_columns'
) }}`,
    dbtAction:
      "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR; ALTER TABLE mart_events DROP COLUMN created_at;",
    snowflakeSql:
      "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR;\nALTER TABLE mart_events DROP COLUMN created_at;\nINSERT INTO mart_events\nSELECT event_id, loan_id, event_type, device_type FROM staging;",
  },
];

const ROWS_BEFORE = [
  {
    event_id: "EVT-001",
    loan_id: "LN-100",
    event_type: "disbursed",
    created_at: "2024-01-01",
  },
  {
    event_id: "EVT-002",
    loan_id: "LN-101",
    event_type: "repayment",
    created_at: "2024-01-02",
  },
  {
    event_id: "EVT-003",
    loan_id: "LN-102",
    event_type: "defaulted",
    created_at: "2024-01-03",
  },
];
const ROWS_NEW = [
  {
    event_id: "EVT-004",
    loan_id: "LN-103",
    event_type: "disbursed",
    created_at: "2024-01-04",
    device_type: "smartphone",
  },
  {
    event_id: "EVT-005",
    loan_id: "LN-104",
    event_type: "repayment",
    created_at: "2024-01-05",
    device_type: "feature_phone",
  },
];

function DataTable({ title, cols, rows, borderColor }: any) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          fontSize: 9,
          color: "#475569",
          fontFamily: "monospace",
          marginBottom: 5,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "rgba(4,9,20,0.95)",
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${borderColor || "rgba(255,255,255,0.08)"}`,
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "5px 10px",
            gap: 0,
          }}
        >
          {cols.map((c: any) => (
            <span
              key={c.key}
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: c.isNew
                  ? "#4ade80"
                  : c.isDropped
                    ? "#ef4444"
                    : "#334155",
                flex: c.flex || 1,
                minWidth: c.minW || 60,
                textDecoration: c.isDropped ? "line-through" : "none",
              }}
            >
              {c.label}
              {c.isNew ? " ✦" : ""}
            </span>
          ))}
        </div>
        {rows.map((row: any, ri: number) => (
          <div
            key={ri}
            style={{
              display: "flex",
              padding: "5px 10px",
              gap: 0,
              borderBottom:
                ri < rows.length - 1
                  ? "1px solid rgba(255,255,255,0.03)"
                  : "none",
              background: row._isNew ? "rgba(74,222,128,0.04)" : "transparent",
            }}
          >
            {cols.map((c: any) => {
              const val = row[c.key];
              const isNull = val === null || val === undefined;
              const isNewCol = c.isNew;
              const isDropped = c.isDropped;
              return (
                <span
                  key={c.key}
                  style={{
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isNull
                      ? "rgba(74,222,128,0.3)"
                      : isNewCol && !isNull
                        ? "#4ade80"
                        : isDropped
                          ? "#ef444466"
                          : row._isNew
                            ? "#94a3b8"
                            : "#475569",
                    flex: c.flex || 1,
                    minWidth: c.minW || 60,
                    fontStyle: isNull ? "italic" : "normal",
                  }}
                >
                  {isNull ? "NULL" : val}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemaExampleViz({ option }: { option: string }) {
  const BASE_COLS = [
    { key: "event_id", label: "event_id", minW: 70, flex: 1 },
    { key: "loan_id", label: "loan_id", minW: 60, flex: 1 },
    { key: "event_type", label: "event_type", minW: 72, flex: 1 },
    { key: "created_at", label: "created_at", minW: 68, flex: 1 },
  ];

  const srcCols =
    option === "sync_all_columns"
      ? [
          ...BASE_COLS.filter((c) => c.key !== "created_at"),
          {
            key: "device_type",
            label: "device_type",
            minW: 80,
            flex: 1,
            isNew: true,
          },
        ]
      : [
          ...BASE_COLS,
          {
            key: "device_type",
            label: "device_type",
            minW: 80,
            flex: 1,
            isNew: true,
          },
        ];

  const srcRows = [
    ...ROWS_BEFORE.map((r) =>
      option === "sync_all_columns"
        ? { ...r, created_at: undefined, device_type: "smartphone" }
        : { ...r, device_type: "smartphone" },
    ),
    ...ROWS_NEW.map((r) => ({
      ...r,
      _isNew: true,
      ...(option === "sync_all_columns" ? { created_at: undefined } : {}),
    })),
  ];

  let targetCols, targetRows, borderColor, actionLabel;

  if (option === "ignore") {
    targetCols = BASE_COLS;
    targetRows = [
      ...ROWS_BEFORE,
      ...ROWS_NEW.map((r) => ({
        event_id: r.event_id,
        loan_id: r.loan_id,
        event_type: r.event_type,
        created_at: r.created_at,
        _isNew: true,
      })),
    ];
    borderColor = "rgba(148,163,184,0.2)";
    actionLabel =
      "device_type silently dropped from INSERT — column never appears in target";
  } else if (option === "fail") {
    targetCols = BASE_COLS;
    targetRows = ROWS_BEFORE;
    borderColor = "rgba(239,68,68,0.3)";
    actionLabel = null;
  } else if (option === "append_new_columns") {
    targetCols = [
      ...BASE_COLS,
      {
        key: "device_type",
        label: "device_type",
        minW: 80,
        flex: 1,
        isNew: true,
      },
    ];
    targetRows = [
      ...ROWS_BEFORE.map((r) => ({ ...r, device_type: null })),
      ...ROWS_NEW.map((r) => ({ ...r, _isNew: true })),
    ];
    borderColor = "rgba(251,146,60,0.3)";
    actionLabel =
      "ALTER TABLE adds device_type → old rows backfilled with NULL";
  } else {
    // sync_all_columns
    targetCols = [
      ...BASE_COLS.map((c) =>
        c.key === "created_at" ? { ...c, isDropped: true } : c,
      ),
      {
        key: "device_type",
        label: "device_type",
        minW: 80,
        flex: 1,
        isNew: true,
      },
    ];
    targetRows = [
      ...ROWS_BEFORE.map((r) => ({
        ...r,
        created_at: undefined,
        device_type: null,
      })),
      ...ROWS_NEW.map((r) => ({ ...r, _isNew: true, created_at: undefined })),
    ];
    borderColor = "rgba(74,222,128,0.3)";
    actionLabel =
      "ALTER TABLE adds device_type + DROP COLUMN created_at — historical data lost!";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 10,
      }}
    >
      <DataTable
        title="RAW.EVENTS — source (5 rows)"
        cols={srcCols}
        rows={srcRows}
        borderColor="rgba(255,255,255,0.08)"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 4px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              option === "fail"
                ? "rgba(239,68,68,0.2)"
                : "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color:
              option === "fail"
                ? "#ef4444"
                : option === "append_new_columns"
                  ? "#fb923c"
                  : option === "sync_all_columns"
                    ? "#4ade80"
                    : "#475569",
            textAlign: "center",
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          {option === "fail"
            ? "💥 RuntimeError: Schema mismatch detected. Run aborted."
            : `⚙️ ${actionLabel}`}
        </div>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              option === "fail"
                ? "rgba(239,68,68,0.2)"
                : "rgba(255,255,255,0.06)",
          }}
        />
      </div>
      {option === "fail" ? (
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 8,
            padding: "12px 14px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, marginBottom: 6 }}>🚫</div>
          <div
            style={{ fontSize: 12, color: "#fca5a5", fontFamily: "monospace" }}
          >
            dbt run FAILED — no data written
          </div>
        </div>
      ) : (
        <DataTable
          title={`MART.EVENTS — after run (${targetRows.length} rows)`}
          cols={targetCols}
          rows={targetRows}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}

export function SchemaChangeSlide() {
  const [selected, setSelected] = useState("ignore");
  const opt = schemaOptions.find((o) => o.id === selected)!;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 560,
          lineHeight: 1.6,
          fontSize: 13,
          margin: 0,
        }}
      >
        What happens when a column is added? By default dbt{" "}
        <strong style={{ color: "#fb923c" }}>silently ignores it</strong>.
      </p>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {schemaOptions.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelected(o.id)}
            style={{
              padding: "6px 13px",
              borderRadius: 8,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
              border: `1px solid ${selected === o.id ? o.color : "rgba(255,255,255,0.1)"}`,
              background: selected === o.id ? `${o.color}18` : "transparent",
              color: selected === o.id ? o.color : "#475569",
            }}
          >
            {o.emoji} {o.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "rgba(12,18,36,0.95)",
          border: `1px solid ${opt.color}33`,
          borderRadius: 12,
          padding: "16px 18px",
          width: "100%",
          maxWidth: 700,
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
          <span style={{ fontSize: 18 }}>{opt.emoji}</span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: opt.color,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {opt.label}
          </span>
        </div>
        <p
          style={{
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.6,
            margin: "0 0 12px",
          }}
        >
          {opt.desc}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              background: "rgba(41,182,246,0.05)",
              border: "1px solid rgba(41,182,246,0.14)",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#29b6f6",
                fontFamily: "monospace",
                marginBottom: 3,
              }}
            >
              📐 WHAT HAPPENS
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              {opt.behavior}
            </div>
          </div>
          <div
            style={{
              background: "rgba(251,146,60,0.05)",
              border: "1px solid rgba(251,146,60,0.14)",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#fb923c",
                fontFamily: "monospace",
                marginBottom: 3,
              }}
            >
              🧠 WHEN TO USE
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              {opt.when}
            </div>
          </div>
        </div>
        <SchemaExampleViz option={opt.id} />
      </div>
    </div>
  );
}
