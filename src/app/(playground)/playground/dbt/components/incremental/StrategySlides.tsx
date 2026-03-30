import React, { useState, useEffect, useRef } from "react";
import { T } from "../../../components/constants";

export const macroCode = `-- models/mart_events.sql

{{ config(materialized='incremental') }}

SELECT
    event_id,
    user_id,
    event_type,
    created_at
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}

  -- This filter ONLY applies on incremental runs
  -- On the first run, is_incremental() = false → full load
  WHERE created_at > (
    SELECT MAX(created_at) FROM {{ this }}
  )

{% endif %}`;

export function MacroSlide() {
  const [highlight, setHighlight] = useState<string | null>(null);

  const annotations: Record<string, any> = {
    config: {
      lines: [3],
      color: "#a78bfa",
      label: "config()",
      text: "Sets this model to incremental mode. dbt will no longer DROP the table on every run — it will INSERT or MERGE instead.",
    },
    macro: {
      lines: [12, 20],
      color: "#fb923c",
      label: "is_incremental()",
      text: "Returns TRUE when the target table already exists AND you're not running dbt run --full-refresh. On the very first run it returns FALSE, so all rows load.",
    },
    filter: {
      lines: [16, 17, 18],
      color: "#4ade80",
      label: "WHERE filter",
      text: "This block only runs when is_incremental() is TRUE. It filters the source to only rows newer than what's already in the target — so you never reprocess old data.",
    },
    this: {
      lines: [17],
      color: "#38bdf8",
      label: "{{ this }}",
      text: "A special dbt Jinja variable that resolves to the current model's fully-qualified table name in Snowflake, e.g. ANALYTICS.MART.MART_EVENTS.",
    },
  };

  const lineToKey: Record<number, string> = {};
  Object.entries(annotations).forEach(([key, ann]) => {
    ann.lines.forEach((l: number) => {
      lineToKey[l] = key;
    });
  });

  const lines = macroCode.split("\n");

  const lineBaseColor = (line: string, lineNum: number) => {
    const key = lineToKey[lineNum];
    if (key) return annotations[key].color;
    if (line.trim().startsWith("--")) return "#475569";
    if (line.startsWith("SELECT") || line.startsWith("FROM")) return "#7dd3fc";
    if (line.trim().startsWith("SELECT") || line.trim().startsWith("WHERE"))
      return "#7dd3fc";
    return "#e2e8f0";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 520,
          lineHeight: 1.6,
          fontSize: 14,
          margin: 0,
        }}
      >
        The magic is in the{" "}
        <code
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "1px 6px",
            borderRadius: 4,
            color: "#fb923c",
          }}
        >
          is_incremental()
        </code>{" "}
        macro.{" "}
        <strong style={{ color: "#f1f5f9" }}>Click any highlighted line</strong>{" "}
        or a card on the right to learn what it does.
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        {/* ── CODE PANEL ── */}
        <div
          style={{
            background: "rgba(8, 15, 30, 0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "14px 16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            lineHeight: 1.85,
            minWidth: 320,
          }}
        >
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const key = lineToKey[lineNum];
            const ann = key ? annotations[key] : null;
            const isActive = key && highlight === key;
            const dimmed = highlight && !isActive;

            return (
              <div
                key={lineNum}
                onClick={() =>
                  key && setHighlight(highlight === key ? null : key)
                }
                title={ann ? `Click to learn about ${ann.label}` : ""}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "2px 8px",
                  borderRadius: 5,
                  cursor: key ? "pointer" : "default",
                  background: isActive ? `${ann.color}1a` : "transparent",
                  borderLeft: `3px solid ${key ? ann.color : "transparent"}`,
                  opacity: dimmed ? 0.35 : 1,
                  transition: "all 0.2s",
                  outline: isActive ? `1px solid ${ann.color}44` : "none",
                }}
              >
                <span
                  style={{
                    color: "#2d3f55",
                    minWidth: 20,
                    textAlign: "right",
                    userSelect: "none",
                    fontSize: 10,
                    paddingTop: 1,
                  }}
                >
                  {lineNum}
                </span>
                <span
                  style={{
                    color: key ? ann.color : lineBaseColor(line, lineNum),
                    fontWeight: isActive ? 600 : 400,
                    transition: "color 0.2s",
                    whiteSpace: "pre",
                  }}
                >
                  {line || " "}
                </span>
                {key && !isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 9,
                      color: ann.color + "66",
                      alignSelf: "center",
                    }}
                  >
                    ↖
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── ANNOTATION CARDS ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 210,
            maxWidth: 250,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#334155",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            CLICK TO EXPLORE
          </div>
          {Object.entries(annotations).map(([key, ann]) => {
            const isActive = highlight === key;
            return (
              <div
                key={key}
                onClick={() => setHighlight(isActive ? null : key)}
                style={{
                  background: isActive
                    ? `${ann.color}15`
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isActive ? ann.color + "66" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                  boxShadow: isActive ? `0 0 12px ${ann.color}22` : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: isActive ? 6 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: ann.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: ann.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {ann.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      color: isActive ? ann.color : "#334155",
                    }}
                  >
                    {isActive ? "▾" : "▸"}
                  </span>
                </div>
                {isActive && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      lineHeight: 1.6,
                      marginTop: 4,
                    }}
                  >
                    {ann.text}
                    <div
                      style={{
                        marginTop: 6,
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {ann.lines.map((l: number) => (
                        <span
                          key={l}
                          style={{
                            fontSize: 9,
                            background: `${ann.color}22`,
                            color: ann.color,
                            padding: "1px 6px",
                            borderRadius: 10,
                            fontFamily: "monospace",
                          }}
                        >
                          line {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnimRow({
  row,
  visible,
  flash,
  highlight,
  dim,
  strikethrough,
  badge,
  delay = 0,
}: any) {
  const [show, setShow] = useState(visible || false);
  const [flashing, setFlashing] = useState(false);
  const timers = useRef<any[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (visible && !show) {
      const t = setTimeout(() => setShow(true), delay);
      timers.current.push(t);
    } else if (!visible) {
      setShow(false);
    }
  }, [visible, delay]);

  useEffect(() => {
    if (flash) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 600);
      timers.current.push(t);
    }
  }, [flash]);

  if (!show) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        marginBottom: 3,
        border: `1px solid ${highlight ? row.color : dim ? "#1e293b" : row.color + "44"}`,
        background: flashing
          ? row.color + "33"
          : highlight
            ? row.color + "18"
            : dim
              ? "rgba(255,255,255,0.02)"
              : row.color + "0d",
        opacity: dim ? 0.3 : 1,
        transition: "all 0.35s ease",
        animation: show ? "slideIn 0.3s ease" : "none",
        textDecoration: strikethrough ? "line-through" : "none",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontFamily: "'JetBrains Mono',monospace",
          color: dim ? "#334155" : row.color,
          flex: 1,
        }}
      >
        {row.label}
      </span>
      {badge && (
        <span
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            padding: "1px 6px",
            borderRadius: 8,
            background: badge.bg,
            color: badge.text,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {badge.label}
        </span>
      )}
    </div>
  );
}

// Visualizations moved inside the file to avoid passing complex render functions
const STRAT_ANIMATIONS: Record<string, any> = {
  append: {
    title: "➕ APPEND: New rows are inserted. Existing rows are never touched.",
    steps: [
      {
        label: "Initial state",
        note: "Target table has 3 existing rows. Source has 2 new rows arriving.",
      },
      {
        label: "Read new rows",
        note: "WHERE clause filters source to only rows newer than MAX(created_at) in target.",
      },
      {
        label: "INSERT new rows",
        note: "dbt runs INSERT INTO target — the 2 new rows are added at the bottom.",
      },
      {
        label: "Done ✓",
        note: "Target now has 5 rows. The original 3 rows were never touched or re-read.",
      },
    ],
    render: (step: number, color: string) => {
      const existingRows = [
        { id: 1, label: "EVT-001  page_view  Jan 1", color: "#4ade80" },
        { id: 2, label: "EVT-002  purchase   Jan 2", color: "#4ade80" },
        { id: 3, label: "EVT-003  logout     Jan 3", color: "#4ade80" },
      ];
      const newRows = [
        { id: 4, label: "EVT-004  click      Jan 4", color },
        { id: 5, label: "EVT-005  signup     Jan 5", color },
      ];
      return (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ minWidth: 200 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              SOURCE (new batch)
            </div>
            {newRows.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={step >= 1}
                delay={i * 100}
                highlight={step === 1}
                badge={
                  step >= 1
                    ? { label: "NEW", bg: color + "22", text: color }
                    : null
                }
              />
            ))}
          </div>
          <div
            style={{
              paddingTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: step >= 2 ? color : "#1e293b",
                fontFamily: "monospace",
                transition: "color 0.4s",
                whiteSpace: "nowrap",
              }}
            >
              INSERT INTO
            </div>
            <div
              style={{
                width: 32,
                height: 2,
                background: step >= 2 ? color : "#1e293b",
                transition: "background 0.4s",
                boxShadow: step >= 2 ? `0 0 6px ${color}` : "",
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                borderLeft: `6px solid ${step >= 2 ? color : "#1e293b"}`,
                transition: "border-left-color 0.4s",
              }}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              TARGET (mart_events)
            </div>
            {existingRows.map((r) => (
              <AnimRow key={r.id} row={r} visible={true} />
            ))}
            {step >= 2 && (
              <div
                style={{
                  borderTop: "1px dashed rgba(255,255,255,0.1)",
                  margin: "3px 0",
                  fontSize: 8,
                  color: color + "88",
                  fontFamily: "monospace",
                }}
              >
                ↓ appended
              </div>
            )}
            {newRows.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={step >= 2}
                delay={i * 150}
                highlight={step === 2}
                badge={
                  step >= 3
                    ? { label: "INSERTED", bg: color + "18", text: color }
                    : null
                }
              />
            ))}
          </div>
        </div>
      );
    },
  },
  merge: {
    title:
      "🔀 MERGE: Matched rows UPDATE. Unmatched rows INSERT. Nothing is deleted.",
    steps: [
      {
        label: "Initial state",
        note: "Target has 3 rows. Source has 2 rows: one matches an existing key (order_id=2), one is new (order_id=4).",
      },
      {
        label: "Compare keys",
        note: "dbt checks each source row against the target using unique_key. order_id=2 matches, order_id=4 doesn't.",
      },
      {
        label: "UPDATE matched",
        note: "order_id=2 already exists — its status column is updated in-place.",
      },
      {
        label: "INSERT new",
        note: "order_id=4 has no match in target — it's inserted as a brand new row.",
      },
      {
        label: "Done ✓",
        note: "Original rows were untouched. No deletions happened. Target has 4 rows.",
      },
    ],
    render: (step: number, color: string) => {
      const targetRows = [
        { id: 1, label: "order_id=1  status=pending", color: "#4ade80" },
        {
          id: 2,
          label: "order_id=2  status=pending",
          color: step >= 2 ? color : "#4ade80",
        },
        { id: 3, label: "order_id=3  status=shipped", color: "#4ade80" },
      ];
      const sourceRows = [
        { id: 2, label: "order_id=2  status=delivered", color },
        { id: 4, label: "order_id=4  status=pending", color },
      ];
      return (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ minWidth: 210 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              SOURCE (new batch)
            </div>
            {sourceRows.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={true}
                highlight={step >= 1 && r.id === 2}
                badge={
                  step >= 1 && r.id === 2
                    ? { label: "MATCH → UPDATE", bg: color + "22", text: color }
                    : step >= 1 && r.id === 4
                      ? {
                          label: "NO MATCH → INSERT",
                          bg: "#4ade8022",
                          text: "#4ade80",
                        }
                      : null
                }
              />
            ))}
          </div>
          <div
            style={{
              paddingTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: step >= 2 ? color : "#1e293b",
                fontFamily: "monospace",
                transition: "color 0.4s",
              }}
            >
              MERGE
            </div>
            <div
              style={{
                width: 32,
                height: 2,
                background: step >= 2 ? color : "#1e293b",
                transition: "background 0.4s",
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                borderLeft: `6px solid ${step >= 2 ? color : "#1e293b"}`,
                transition: "border-left-color 0.4s",
              }}
            />
          </div>
          <div style={{ minWidth: 220 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              TARGET (orders table)
            </div>
            <AnimRow key={1} row={targetRows[0]} visible={true} />
            <AnimRow
              key={2}
              row={{
                ...targetRows[1],
                label:
                  step >= 2
                    ? "order_id=2  status=delivered"
                    : "order_id=2  status=pending",
                color: step >= 2 ? color : "#4ade80",
              }}
              visible={true}
              highlight={step === 2}
              flash={step === 2}
              badge={
                step >= 2
                  ? { label: "UPDATED ✓", bg: color + "22", text: color }
                  : null
              }
            />
            <AnimRow key={3} row={targetRows[2]} visible={true} />
            <AnimRow
              key={4}
              row={{ id: 4, label: "order_id=4  status=pending", color }}
              visible={step >= 3}
              delay={0}
              badge={{ label: "INSERTED ✓", bg: "#4ade8022", text: "#4ade80" }}
            />
          </div>
        </div>
      );
    },
  },
  delete_insert: {
    title:
      "🔄 DELETE+INSERT: Target partition is deleted first, then re-inserted from source.",
    steps: [
      {
        label: "Initial state",
        note: "Target has data for Jan 3 and Jan 4. Source will re-deliver all Jan 4 data.",
      },
      {
        label: "Identify partition",
        note: "dbt finds the partition to replace: all rows WHERE date_day = '2024-01-04'.",
      },
      {
        label: "DELETE partition",
        note: "All Jan 4 rows in the target are deleted. Jan 3 rows are untouched.",
      },
      {
        label: "INSERT from source",
        note: "Source data for Jan 4 is re-inserted fresh. This may include corrected rows.",
      },
      {
        label: "Done ✓",
        note: "Jan 4 partition replaced atomically. Jan 3 data unchanged.",
      },
    ],
    render: (step: number, color: string) => {
      const jan3 = [
        { id: 1, label: "2024-01-03  EVT-001  pageview", color: "#4ade80" },
        { id: 2, label: "2024-01-03  EVT-002  click", color: "#4ade80" },
        { id: 3, label: "2024-01-03  EVT-003  signup", color: "#4ade80" },
      ];
      const jan4old = [
        { id: 4, label: "2024-01-04  EVT-004  pageview", color: "#facc15" },
        { id: 5, label: "2024-01-04  EVT-005  click", color: "#facc15" },
      ];
      const jan4new = [
        { id: 4, label: "2024-01-04  EVT-004  pageview", color },
        { id: 5, label: "2024-01-04  EVT-005  click", color },
        { id: 6, label: "2024-01-04  EVT-006  purchase (corrected)", color },
      ];
      return (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ minWidth: 230 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              SOURCE (date partition)
            </div>
            {jan3.map((r) => (
              <AnimRow key={r.id} row={r} visible={true} dim />
            ))}
            <div
              style={{
                fontSize: 8,
                color: color,
                fontFamily: "monospace",
                margin: "5px 0 3px",
              }}
            >
              Jan 4 — re-delivering
            </div>
            {jan4new.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={step >= 1}
                delay={i * 80}
                badge={
                  r.id === 6
                    ? { label: "corrected", bg: color + "22", text: color }
                    : null
                }
              />
            ))}
          </div>
          <div
            style={{
              paddingTop: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: step >= 2 ? "#ef4444" : "#1e293b",
                fontFamily: "monospace",
                transition: "color 0.4s",
                whiteSpace: "nowrap",
              }}
            >
              {step < 2 ? "" : "step 1: DELETE"}
            </div>
            <div
              style={{
                width: 32,
                height: 2,
                background:
                  step >= 2 ? "#ef4444" : step >= 3 ? color : "#1e293b",
                transition: "background 0.4s",
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: `6px solid ${step >= 2 ? "#ef4444" : step >= 3 ? color : "#1e293b"}`,
                transition: "border-left-color 0.4s",
              }}
            />
            {step >= 3 && (
              <div
                style={{
                  fontSize: 8,
                  color: color,
                  fontFamily: "monospace",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                step 2: INSERT
              </div>
            )}
          </div>
          <div style={{ minWidth: 240 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              TARGET (events table)
            </div>
            {jan3.map((r) => (
              <AnimRow key={r.id} row={r} visible={true} />
            ))}
            <div
              style={{
                fontSize: 8,
                color:
                  step >= 2 ? "#ef4444" : step >= 1 ? "#facc15" : "#334155",
                fontFamily: "monospace",
                margin: "5px 0 3px",
                transition: "color 0.4s",
              }}
            >
              Jan 4 —{" "}
              {step < 1
                ? "old partition"
                : step < 2
                  ? "target partition"
                  : step < 3
                    ? "← DELETED"
                    : "← REPLACED"}
            </div>
            {jan4old.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={step < 3}
                dim={step >= 2}
                strikethrough={step >= 2}
                badge={
                  step >= 2 && step < 3
                    ? {
                        label: "DELETING...",
                        bg: "rgba(248,113,113,0.15)",
                        text: "#ef4444",
                      }
                    : null
                }
              />
            ))}
            {jan4new.map((r, i) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={step >= 3}
                delay={i * 100}
                highlight={step === 3}
                badge={
                  step >= 4
                    ? { label: "INSERTED ✓", bg: color + "18", text: color }
                    : null
                }
              />
            ))}
          </div>
        </div>
      );
    },
  },
  insert_overwrite: {
    title:
      "🔁 INSERT OVERWRITE: Entire partition is atomically replaced in one step.",
    steps: [
      {
        label: "Initial state",
        note: "Target has 3 date partitions. Source has fresh data for the Jan 2024 partition.",
      },
      {
        label: "Select partition",
        note: "dbt identifies which partition to overwrite based on partition_by config.",
      },
      {
        label: "INSERT OVERWRITE",
        note: "Warehouse replaces the entire Jan 2024 partition atomically — no separate DELETE step.",
      },
      {
        label: "Done ✓",
        note: "Partition replaced in one atomic operation. Dec and Nov partitions are completely untouched.",
      },
    ],
    render: (step: number, color: string) => {
      const partitions = [
        {
          id: "nov",
          label: "partition: 2023-11  (34k rows)",
          color: "#4ade80",
          month: "Nov",
        },
        {
          id: "dec",
          label: "partition: 2023-12  (41k rows)",
          color: "#4ade80",
          month: "Dec",
        },
        {
          id: "jan",
          label: "partition: 2024-01  (28k rows)",
          color: "#facc15",
          month: "Jan",
        },
      ];
      return (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ minWidth: 210 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              SOURCE (new data)
            </div>
            <AnimRow
              row={{
                id: "jan_src",
                label: "partition: 2024-01  (31k rows, corrected)",
                color,
              }}
              visible={true}
              highlight={step >= 1}
              badge={
                step >= 1
                  ? { label: "INSERT OVERWRITE", bg: color + "22", text: color }
                  : null
              }
            />
          </div>
          <div
            style={{
              paddingTop: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: step >= 2 ? color : "#1e293b",
                fontFamily: "monospace",
                transition: "color 0.4s",
                whiteSpace: "nowrap",
              }}
            >
              overwrite partition
            </div>
            <div
              style={{
                width: 32,
                height: 2,
                background: step >= 2 ? color : "#1e293b",
                transition: "background 0.4s",
                boxShadow: step >= 2 ? `0 0 6px ${color}` : "",
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                borderLeft: `6px solid ${step >= 2 ? color : "#1e293b"}`,
                transition: "border-left-color 0.4s",
              }}
            />
          </div>
          <div style={{ minWidth: 220 }}>
            <div
              style={{
                fontSize: 9,
                color: "#475569",
                fontFamily: "monospace",
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            >
              TARGET (partitioned table)
            </div>
            {partitions.slice(0, 2).map((r) => (
              <AnimRow
                key={r.id}
                row={r}
                visible={true}
                badge={{
                  label: `${r.month} — untouched`,
                  bg: "rgba(74,222,128,0.07)",
                  text: "rgba(74,222,128,0.5)",
                }}
              />
            ))}
            {step < 2 && (
              <AnimRow
                row={partitions[2]}
                visible={true}
                highlight={step === 1}
                badge={
                  step >= 1
                    ? {
                        label: "← will be overwritten",
                        bg: "rgba(250,204,21,0.14)",
                        text: "#facc15",
                      }
                    : null
                }
              />
            )}
            {step >= 2 && (
              <AnimRow
                row={{
                  id: "jan_new",
                  label: "partition: 2024-01  (31k rows)",
                  color,
                }}
                visible={true}
                highlight={step === 2}
                flash={step === 2}
                badge={{
                  label: "OVERWRITTEN ✓",
                  bg: color + "22",
                  text: color,
                }}
              />
            )}
          </div>
        </div>
      );
    },
  },
  microbatch: {
    title:
      "⚡ MICROBATCH: Large table processed in small time-window queries (batches).",
    steps: [
      {
        label: "Initial state",
        note: "Large events table. Last run was 3 days ago. dbt will process each day as a separate batch.",
      },
      {
        label: "Batch 1: Jan 13",
        note: "dbt runs first query: WHERE event_time >= '2024-01-13' AND < '2024-01-14'. Inserts results.",
      },
      {
        label: "Batch 2: Jan 14",
        note: "Second query runs: WHERE event_time >= '2024-01-14' AND < '2024-01-15'. Each batch is independent.",
      },
      {
        label: "Batch 3: Jan 15",
        note: "Third query runs for the most recent day. If any batch fails, only that batch is retried.",
      },
      {
        label: "Done ✓",
        note: "3 days of data processed in 3 separate queries. If Batch 2 failed, dbt retries only that one batch.",
      },
    ],
    render: (step: number, color: string) => {
      const batches = [
        {
          id: 1,
          label: "2024-01-13  batch (42k events)",
          color,
          date: "Jan 13",
        },
        {
          id: 2,
          label: "2024-01-14  batch (38k events)",
          color,
          date: "Jan 14",
        },
        {
          id: 3,
          label: "2024-01-15  batch (21k events)",
          color,
          date: "Jan 15",
        },
      ];
      const filters = [
        "event_time >= '2024-01-13' AND < '2024-01-14'",
        "event_time >= '2024-01-14' AND < '2024-01-15'",
        "event_time >= '2024-01-15' AND < '2024-01-16'",
      ];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 180 }}>
              <div
                style={{
                  fontSize: 9,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  letterSpacing: 0.5,
                }}
              >
                batch_size: 'day'
              </div>
              {batches.map((b, i) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 6,
                    marginBottom: 3,
                    border: `1px solid ${step > i ? color + "55" : "rgba(255,255,255,0.07)"}`,
                    background:
                      step === i + 1
                        ? `${color}18`
                        : step > i
                          ? `${color}0d`
                          : "transparent",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background:
                        step > i ? color : step === i + 1 ? color : "#334155",
                      transition: "background 0.3s",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      color:
                        step > i ? color : step === i + 1 ? color : "#334155",
                      transition: "color 0.3s",
                    }}
                  >
                    {b.date}
                  </span>
                  {step > i && (
                    <span
                      style={{
                        fontSize: 8,
                        color: "#4ade80",
                        marginLeft: "auto",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {step === i + 1 && (
                    <span
                      style={{ fontSize: 8, color: color, marginLeft: "auto" }}
                    >
                      running...
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ minWidth: 240, maxWidth: 300 }}>
              <div
                style={{
                  fontSize: 9,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  letterSpacing: 0.5,
                }}
              >
                GENERATED QUERIES
              </div>
              {batches.map((b, i) => (
                <div
                  key={b.id}
                  style={{
                    marginBottom: 6,
                    opacity: step >= i + 1 ? 1 : 0.2,
                    transition: "opacity 0.4s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      color:
                        step === i + 1
                          ? color
                          : step > i
                            ? "#4ade80"
                            : "#334155",
                      fontFamily: "monospace",
                      marginBottom: 2,
                      transition: "color 0.3s",
                    }}
                  >
                    {step === i + 1
                      ? "▶ Query " + (i + 1) + " running"
                      : step > i
                        ? "✓ Query " + (i + 1) + " done"
                        : "○ Query " + (i + 1) + " waiting"}
                  </div>
                  <div
                    style={{
                      background: "rgba(4,9,20,0.8)",
                      borderRadius: 5,
                      padding: "4px 8px",
                      border: `1px solid ${step === i + 1 ? color + "44" : "rgba(255,255,255,0.05)"}`,
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        fontFamily: "'JetBrains Mono',monospace",
                        color: "#475569",
                      }}
                    >
                      WHERE
                    </div>
                    <div
                      style={{
                        fontSize: 8,
                        fontFamily: "'JetBrains Mono',monospace",
                        color: step >= i + 1 ? color : "#334155",
                      }}
                    >
                      {filters[i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {step >= 4 && (
            <div
              style={{
                background: `${color}09`,
                border: `1px solid ${color}28`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 10,
                color: "#94a3b8",
                fontFamily: "monospace",
                animation: "popIn 0.3s ease",
              }}
            >
              💡 If Batch 2 (Jan 14) had failed, dbt would retry{" "}
              <strong style={{ color }}>only that batch</strong> — not
              re-process Jan 13 or Jan 15.
            </div>
          )}
        </div>
      );
    },
  },
};

function StrategyViz({ type, color }: { type: string; color: string }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<any[]>([]);

  const anim = STRAT_ANIMATIONS[type];
  if (!anim) return null;

  const totalSteps = anim.steps.length - 1;

  const play = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setRunning(true);
    anim.steps.forEach((_: any, i: number) => {
      if (i === 0) return;
      const t = setTimeout(() => {
        setStep(i);
        if (i === totalSteps) setRunning(false);
      }, i * 1000);
      timers.current.push(t);
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setRunning(false);
  };

  return (
    <div
      style={{
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 9,
          color: color,
          fontFamily: "monospace",
          letterSpacing: 0.5,
          fontWeight: 700,
        }}
      >
        🎬 ANIMATED ILLUSTRATION
      </div>

      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {anim.steps.map((s: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              reset();
              setStep(i);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              padding: "3px 8px",
              borderRadius: 14,
              fontSize: 9,
              fontFamily: "monospace",
              border: `1px solid ${step === i ? color : "rgba(255,255,255,0.07)"}`,
              background:
                step === i
                  ? `${color}18`
                  : step > i
                    ? "rgba(255,255,255,0.04)"
                    : "transparent",
              color: step === i ? color : step > i ? "#475569" : "#1e293b",
              transition: "all 0.2s",
            }}
          >
            {step > i ? "✓" : i + 1}. {s.label}
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid rgba(255,255,255,0.06)`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          color: "#94a3b8",
          lineHeight: 1.6,
          minHeight: 36,
        }}
      >
        {anim.steps[step].note}
      </div>

      {/* The animation frame */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${color}22`,
          borderRadius: 10,
          padding: "14px 12px",
          minHeight: 100,
        }}
      >
        {anim.render(step, color)}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={play}
          disabled={running}
          style={{
            padding: "6px 18px",
            borderRadius: 8,
            fontSize: 10,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            transition: "all 0.2s",
            border: `1px solid ${color}55`,
            background: running ? `${color}08` : `${color}18`,
            color: running ? "#475569" : color,
          }}
        >
          {running
            ? "⚙️  Playing..."
            : step === totalSteps
              ? "↩ Replay"
              : "▶  Play animation"}
        </button>
        <button
          onClick={reset}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            color: T.grey,
          }}
        >
          Reset
        </button>
        {step < totalSteps && (
          <button
            onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
            disabled={running}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 10,
              cursor: running ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              border: `1px solid rgba(255,255,255,0.1)`,
              background: "rgba(255,255,255,0.04)",
              color: T.grey,
            }}
          >
            Step →
          </button>
        )}
      </div>
    </div>
  );
}

function StrategyCard({ s, expanded, onToggle }: any) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${expanded ? s.color + "44" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.2s",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: expanded ? `rgba(15,23,42,0.95)` : "rgba(15,23,42,0.5)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: s.color,
            fontFamily: "'Syne', sans-serif",
            flexShrink: 0,
          }}
        >
          {s.name}
        </span>
        {s.isDefault && (
          <span
            style={{
              fontSize: 8,
              background: s.color,
              color: "#000",
              fontWeight: 800,
              padding: "1px 6px",
              borderRadius: 10,
              fontFamily: "monospace",
              letterSpacing: 0.5,
              flexShrink: 0,
            }}
          >
            DEFAULT
          </span>
        )}
        <span
          style={{
            fontSize: 12,
            color: "#475569",
            flex: 1,
            lineHeight: 1.4,
            paddingLeft: 4,
          }}
        >
          {s.desc}
        </span>
        <span
          style={{
            fontSize: 12,
            color: expanded ? s.color : "#334155",
            flexShrink: 0,
            transition: "color 0.2s",
            marginLeft: 8,
          }}
        >
          {expanded ? "▾" : "▸"}
        </span>
      </div>

      {expanded && (
        <div
          style={{
            padding: "14px 16px 16px",
            background: "rgba(8,14,28,0.9)",
            borderTop: `1px solid ${s.color}22`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(41,182,246,0.07)",
              border: "1px solid rgba(41,182,246,0.2)",
              borderRadius: 6,
              padding: "3px 10px",
              marginBottom: 12,
            }}
          >
            <span
              style={{ fontSize: 9, color: "#7dd3fc", fontFamily: "monospace" }}
            >
              🗄️ {(s.warehouseSql || s.snowflakeSql || "").split("\n")[0]}
            </span>
          </div>

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
                background: "rgba(74,222,128,0.06)",
                border: "1px solid rgba(74,222,128,0.14)",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#4ade80",
                  fontFamily: "monospace",
                  marginBottom: 3,
                  letterSpacing: 0.5,
                }}
              >
                ✅ BEST FOR
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
                {s.when}
              </div>
            </div>
            <div
              style={{
                background: "rgba(251,146,60,0.06)",
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
                  letterSpacing: 0.5,
                }}
              >
                ⚠️ WATCH OUT
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
                {s.caution}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 9,
                color: "#334155",
                fontFamily: "monospace",
                marginBottom: 4,
                letterSpacing: 0.5,
              }}
            >
              DBT CONFIG
            </div>
            <div
              style={{
                background: "rgba(4,9,20,0.95)",
                borderRadius: 8,
                padding: "8px 12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                overflowX: "auto",
              }}
            >
              {(s.sql as string).split("\n").map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: line.trim().startsWith("--")
                      ? "#334155"
                      : line.includes("'incremental'")
                        ? "#4ade80"
                        : line.includes("strategy")
                          ? s.color
                          : line.includes("unique_key") ||
                              line.includes("merge_update")
                            ? "#38bdf8"
                            : line.startsWith("SELECT") ||
                                line.startsWith("FROM") ||
                                line.startsWith("WHERE") ||
                                line.startsWith("GROUP")
                              ? "#7dd3fc"
                              : "#e2e8f0",
                    whiteSpace: "pre",
                  }}
                >
                  {line || " "}
                </div>
              ))}
            </div>
          </div>

          <StrategyViz type={s.viz} color={s.color} />
        </div>
      )}
    </div>
  );
}

export const strategies = [
  {
    id: "append",
    name: "append",
    emoji: "➕",
    color: "#4ade80",
    isDefault: false,
    desc: "Simply inserts new rows into the Snowflake table. Never touches existing rows — no MERGE, no DELETE.",
    when: "Immutable event logs, click streams, audit trails — data where each row is a permanent fact that never changes.",
    caution:
      "No deduplication happens. If Snowflake receives the same row twice, you'll get duplicates in the target.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='append'
  -- No unique_key needed
) }}

SELECT event_id, user_id, event_type, created_at
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  WHERE created_at > (
    SELECT MAX(created_at) FROM {{ this }}
  )
{% endif %}`,
    viz: "append",
    snowflakeSql: "INSERT INTO target SELECT ... FROM staging",
  },
  {
    id: "merge",
    name: "merge",
    emoji: "🔀",
    color: "#29b6f6",
    isDefault: true,
    desc: "Snowflake's default strategy. Uses SQL MERGE to UPDATE rows that match on a key and INSERT rows that are brand new.",
    when: "Records that can change over time — order statuses, user profiles, loan states. The go-to for most Snowflake dbt models.",
    caution:
      "Snowflake's MERGE locks the target table during execution. On very wide tables, consider merge_update_columns.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='merge',  -- default on Snowflake
  unique_key='order_id',
  merge_update_columns=['status', 'updated_at']
) }}

SELECT order_id, customer_id, status, updated_at
FROM {{ source('raw', 'orders') }}

{% if is_incremental() %}
  WHERE updated_at > (
    SELECT MAX(updated_at) FROM {{ this }}
  )
{% endif %}`,
    viz: "merge",
    snowflakeSql:
      "MERGE INTO target USING staging\n  ON target.order_id = staging.order_id\n  WHEN MATCHED THEN UPDATE ...\n  WHEN NOT MATCHED THEN INSERT ...",
  },
  {
    id: "delete_insert",
    name: "delete+insert",
    emoji: "🔄",
    color: "#fb923c",
    isDefault: false,
    desc: "Deletes all rows matching a unique_key from the target, then re-inserts the full batch from source.",
    when: "Date-partitioned loads where an entire day or hour can be re-delivered (e.g. late-arriving facts, daily snapshots).",
    caution:
      "More compute than append but safer than merge for partition-level reloads.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='delete+insert',
  unique_key='date_day'
) }}

SELECT
  DATE_TRUNC('day', created_at) AS date_day,
  COUNT(*) AS event_count
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  WHERE date_day >= (
    SELECT MAX(date_day) FROM {{ this }}
  )
{% endif %}

GROUP BY 1`,
    viz: "delete_insert",
    snowflakeSql:
      "DELETE FROM target WHERE date_day IN (...)\nINSERT INTO target SELECT ... FROM staging",
  },
  {
    id: "insert_overwrite",
    name: "insert_overwrite",
    emoji: "🔁",
    color: "#a78bfa",
    isDefault: false,
    desc: "Overwrites entire partitions of the target table. Operates on partitions, not individual rows.",
    when: "BigQuery, Spark, and Databricks partitioned tables. Ideal when you want to fully replace a date partition each run.",
    caution:
      "Not supported on Snowflake or Postgres. Requires a partitioned table. Replaces the entire partition.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='insert_overwrite',
  partition_by={
    "field": "created_date",
    "data_type": "date"
  }
) }}

SELECT event_id, created_date, event_type
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  -- Overwrite only recent partitions
  WHERE created_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
{% endif %}`,
    viz: "insert_overwrite",
    warehouseSql:
      "INSERT OVERWRITE partition(created_date)\nSELECT ... FROM staging",
  },
  {
    id: "microbatch",
    name: "microbatch",
    emoji: "⚡",
    color: "#f472b6",
    isDefault: false,
    desc: "Processes large time-series datasets in multiple small queries ('batches') based on an event_time column.",
    when: "Very large event tables where a single incremental query is too slow or risky. dbt Core v1.9+.",
    caution:
      "Requires dbt Core v1.9+ and event_time config. Not all adapters support it.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='microbatch',
  event_time='event_timestamp',
  begin='2024-01-01',
  batch_size='day'
) }}

SELECT event_id, event_timestamp, event_type
FROM {{ source('raw', 'events') }}
-- dbt automatically adds the batch window filter:
-- WHERE event_timestamp >= '2024-01-15'
--   AND event_timestamp < '2024-01-16'`,
    viz: "microbatch",
    warehouseSql:
      "-- One query per time window:\nINSERT INTO target\nSELECT ... WHERE event_timestamp BETWEEN batch_start AND batch_end",
  },
];

export function StrategiesSlide() {
  const [expanded, setExpanded] = useState<string | null>("merge");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(41,182,246,0.07)",
          border: "1px solid rgba(41,182,246,0.22)",
          borderRadius: 20,
          padding: "5px 14px",
        }}
      >
        <span style={{ fontSize: 13 }}>❄️</span>
        <span
          style={{
            fontSize: 11,
            color: "#29b6f6",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          5 incremental strategies per the dbt docs. Click each to expand.
        </span>
      </div>
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 540,
          lineHeight: 1.6,
          fontSize: 13,
          margin: 0,
        }}
      >
        dbt supports 5 incremental strategies.{" "}
        <strong style={{ color: "#29b6f6" }}>merge is the default</strong> when
        a{" "}
        <code
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "1px 5px",
            borderRadius: 4,
            color: "#fb923c",
          }}
        >
          unique_key
        </code>{" "}
        is set.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          width: "100%",
        }}
      >
        {strategies.map((s) => (
          <StrategyCard
            key={s.id}
            s={s}
            expanded={expanded === s.id}
            onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
          />
        ))}
      </div>

      <div
        style={{
          width: "100%",
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "#334155",
            fontFamily: "monospace",
            letterSpacing: 1,
            padding: "8px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          QUICK COMPARISON
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "",
                  "➕ append",
                  "🔀 merge",
                  "🔄 delete+insert",
                  "🔁 insert_overwrite",
                  "⚡ microbatch",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "8px 12px",
                      textAlign: i === 0 ? "left" : "center",
                      color:
                        i === 0
                          ? "#334155"
                          : ([
                              null,
                              "#4ade80",
                              "#29b6f6",
                              "#fb923c",
                              "#a78bfa",
                              "#f472b6",
                            ][i] as any),
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "unique_key required?",
                  "✕ No",
                  "✓ Yes",
                  "✓ Yes (partition col)",
                  "✕ No (partition_by)",
                  "✕ No (event_time)",
                ],
                [
                  "Handles row updates?",
                  "✕ No",
                  "✓ Yes (MERGE)",
                  "✓ Yes (re-partition)",
                  "✓ Yes (partition)",
                  "✓ Yes (batch)",
                ],
                [
                  "Handles duplicates?",
                  "✕ No",
                  "✓ Yes",
                  "✓ Yes",
                  "✓ Yes (partition)",
                  "✓ Yes (batch)",
                ],
                [
                  "Compute cost",
                  "Cheapest",
                  "Expensive",
                  "Mid",
                  "Mid",
                  "Efficient at scale",
                ],
                [
                  "Warehouse SQL",
                  "INSERT",
                  "MERGE INTO",
                  "DELETE + INSERT",
                  "INSERT OVERWRITE",
                  "Batch INSERTs",
                ],
              ].map(([label, ...vals]) => (
                <tr
                  key={label}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    style={{
                      padding: "7px 12px",
                      color: "#475569",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </td>
                  {vals.map((v, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "7px 12px",
                        textAlign: "center",
                        color: v.startsWith("✓")
                          ? "#4ade80"
                          : v.startsWith("✕")
                            ? "#475569"
                            : "#94a3b8",
                        fontSize: 10,
                      }}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
