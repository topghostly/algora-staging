import React, { useState, useEffect, useRef } from "react";
import { T } from "../../../components/constants";
import { allRows, newBatchRows, TableBox, Arrow } from "./incremental-shared";

export function IntroSlide() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        padding: "20px 0",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🐢</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#f1f5f9",
            margin: 0,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Your dbt model is getting slow.
        </h2>
        <p
          style={{
            color: "#94a3b8",
            marginTop: 8,
            maxWidth: 480,
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Every time it runs, it reads{" "}
          <strong style={{ color: "#fb923c" }}>millions of rows</strong> from
          scratch — even though only a handful are new. There's a smarter way.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Big table */}
        <div
          style={{
            background: "rgba(251,146,60,0.07)",
            border: "1px solid rgba(251,146,60,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "center",
            transition: "all 0.6s",
            opacity: show ? 1 : 0,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 4 }}>🗄️</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fb923c",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Source Table
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            500 million rows
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {[..."████████"].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: i < 7 ? "#374151" : "#fb923c",
                  width: `${60 + i * 8}px`,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#fb923c", marginTop: 6 }}>
            ↑ only 3 new rows today
          </div>
        </div>

        <Arrow label="full scan every run" color="#ef4444" pulse />

        <div
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "center",
            transition: "all 0.6s",
            opacity: show ? 1 : 0,
            transitionDelay: "0.2s",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 4 }}>⏱️</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ef4444",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Wasted Compute
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            Re-processing 499,999,997
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            rows you already have
          </div>
          <div style={{ fontSize: 28, marginTop: 8 }}>💸</div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(74,222,128,0.08)",
          border: "1px solid rgba(74,222,128,0.25)",
          borderRadius: 10,
          padding: "12px 20px",
          maxWidth: 460,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#4ade80" }}>
          💡 <strong>Incremental models</strong> solve this by only processing{" "}
          <em>new or changed</em> data.
        </span>
      </div>
    </div>
  );
}

export function FullRefreshSlide() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);

  const run = () => {
    setRunning(true);
    setDone(false);
    setTick(0);
    let t = 0;
    const iv = setInterval(() => {
      t++;
      setTick(t);
      if (t >= 8) {
        clearInterval(iv);
        setRunning(false);
        setDone(true);
      }
    }, 200);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.6,
          fontSize: 14,
          margin: 0,
        }}
      >
        A{" "}
        <code
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "1px 6px",
            borderRadius: 4,
            color: "#fb923c",
          }}
        >
          materialized='table'
        </code>{" "}
        model <strong style={{ color: "#f1f5f9" }}>drops and rebuilds</strong>{" "}
        the entire table on every run. Great for small datasets — painful for
        large ones.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TableBox title="raw.events" rows={allRows} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Arrow
            label={running ? "reading ALL rows..." : "reads ALL rows"}
            color={running ? "#ef4444" : "#94a3b8"}
            pulse={running}
          />
          <div
            style={{
              fontSize: 9,
              color: "#475569",
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: "center",
            }}
          >
            DROP TABLE
            <br />
            CREATE TABLE
          </div>
        </div>
        <TableBox
          title="mart.events"
          rows={done ? allRows : allRows.slice(0, tick)}
          animate={running}
        />
      </div>

      <button
        onClick={run}
        disabled={running}
        style={{
          padding: "10px 28px",
          borderRadius: 8,
          border: "1px solid rgba(251,146,60,0.4)",
          background: running ? "rgba(251,146,60,0.1)" : "rgba(251,146,60,0.2)",
          color: "#fb923c",
          fontWeight: 700,
          cursor: running ? "not-allowed" : "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: 0.5,
          transition: "all 0.2s",
        }}
      >
        {running
          ? "⚙️  Running..."
          : done
            ? "▶  Run Again"
            : "▶  Run dbt model"}
      </button>

      {done && (
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 12,
            color: "#fca5a5",
            textAlign: "center",
          }}
        >
          ⚠️ Processed <strong>all 8 rows</strong> — even the 5 you already had.
          Imagine this with 500M rows.
        </div>
      )}
    </div>
  );
}

function AnimatedSourceRow({
  row,
  state,
  delay,
}: {
  row: any;
  state: string;
  delay: number;
}) {
  const [current, setCurrent] = useState("idle");
  useEffect(() => {
    if (state === "idle") {
      setCurrent("idle");
      return;
    }
    const t = setTimeout(() => setCurrent(state), delay);
    return () => clearTimeout(t);
  }, [state, delay]);

  const colors: Record<string, string> = {
    idle: "#334155",
    scanning: "#facc15",
    skipped: "#1e293b",
    passing: "#fb923c",
    done: "#4ade80",
  };
  const textColors: Record<string, string> = {
    idle: "#64748b",
    scanning: "#fef08a",
    skipped: "#334155",
    passing: "#fb923c",
    done: "#4ade80",
  };
  const icons: Record<string, string> = {
    idle: "",
    scanning: "→",
    skipped: "✕",
    passing: "✓",
    done: "✓",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        marginBottom: 3,
        border: `1px solid ${colors[current]}55`,
        background:
          current === "skipped"
            ? "rgba(15,23,42,0.4)"
            : current === "passing"
              ? "rgba(251,146,60,0.1)"
              : current === "done"
                ? "rgba(74,222,128,0.07)"
                : current === "scanning"
                  ? "rgba(250,204,21,0.06)"
                  : "rgba(255,255,255,0.03)",
        transition: "all 0.35s ease",
        opacity: current === "skipped" ? 0.25 : 1,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: "#475569",
          minWidth: 12,
        }}
      >
        {row.id}
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: textColors[current],
          minWidth: 72,
        }}
      >
        {row.event}
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: textColors[current],
          minWidth: 44,
        }}
      >
        {row.user}
      </span>
      <span
        style={{
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          color: colors[current],
          minWidth: 32,
        }}
      >
        {row.ts}
      </span>
      <span
        style={{
          fontSize: 10,
          marginLeft: "auto",
          color: colors[current],
          fontWeight: 700,
          minWidth: 12,
        }}
      >
        {icons[current]}
      </span>
    </div>
  );
}

function TargetRow({
  row,
  isNew,
  animate,
}: {
  row: any;
  isNew: boolean;
  animate: boolean;
}) {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    } else setVisible(true);
  }, [animate]);
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "4px 6px",
        borderRadius: 5,
        marginBottom: 3,
        border: isNew ? "1px solid #fb923c55" : "1px solid #4ade8022",
        background: isNew ? "rgba(251,146,60,0.09)" : "rgba(74,222,128,0.05)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(12px)",
        transition: "all 0.4s ease",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: "#475569",
          minWidth: 12,
        }}
      >
        {row.id}
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: isNew ? "#fb923c" : "#4ade80",
          minWidth: 72,
        }}
      >
        {row.event}
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: "#e2e8f0",
          minWidth: 44,
        }}
      >
        {row.user}
      </span>
      <span
        style={{
          fontSize: 10,
          fontFamily: "monospace",
          color: isNew ? "#fb923c77" : "#4ade8066",
        }}
      >
        {row.ts}
      </span>
    </div>
  );
}

export function IncrementalSlide() {
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [rowStates, setRowStates] = useState<Record<string | number, string>>(
    {},
  );
  const [targetRows, setTargetRows] = useState<any[]>([]);
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const timersRef = useRef<any[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const sched = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const switchPhase = (p: number) => {
    clearTimers();
    setRunning(false);
    setRowStates({});
    setStatusMsg("");
    setPhase(p);
  };

  const runFirstRun = () => {
    clearTimers();
    setRunning(true);
    setTargetRows([]);
    setRowStates({});
    setStatusMsg(
      "⚙️  is_incremental() → FALSE — target doesn't exist yet. Loading ALL 8 rows...",
    );

    allRows.forEach((r, i) => {
      sched(
        () => setRowStates((prev) => ({ ...prev, [r.id]: "scanning" })),
        i * 150,
      );
      sched(
        () => {
          setRowStates((prev) => ({ ...prev, [r.id]: "done" }));
          setTargetRows((prev) => [
            ...prev.filter((x) => x.id !== r.id),
            { ...r, isNew: false },
          ]);
        },
        i * 150 + 380,
      );
    });

    sched(
      () => {
        setStatusMsg(
          `✅  First run complete — 8 rows written. mart.events now exists. Click "Incremental run" ③ to continue.`,
        );
        setRunning(false);
        setFirstRunDone(true);
      },
      allRows.length * 150 + 650,
    );
  };

  const runIncremental = () => {
    clearTimers();
    setRunning(true);
    setRowStates({});
    setStatusMsg(
      "⚙️  is_incremental() → TRUE — mart.events exists. Applying WHERE created_at > MAX(created_at)...",
    );

    allRows.forEach((r, i) => {
      sched(
        () => setRowStates((prev) => ({ ...prev, [r.id]: "scanning" })),
        i * 120,
      );
      sched(
        () => setRowStates((prev) => ({ ...prev, [r.id]: "skipped" })),
        i * 120 + 300,
      );
    });

    const skipDone = allRows.length * 120 + 450;
    sched(
      () =>
        setStatusMsg(
          "🔍  Rows 1–8 already in mart.events — WHERE filter eliminates them. Scanning new rows...",
        ),
      skipDone,
    );

    newBatchRows.forEach((r, i) => {
      sched(
        () => setRowStates((prev) => ({ ...prev, [r.id]: "scanning" })),
        skipDone + 300 + i * 220,
      );
      sched(
        () => {
          setRowStates((prev) => ({ ...prev, [r.id]: "passing" }));
          setTargetRows((prev) => [
            ...prev.filter((x) => x.id !== r.id),
            { ...r, isNew: true },
          ]);
        },
        skipDone + 300 + i * 220 + 420,
      );
    });

    const total = skipDone + 300 + newBatchRows.length * 220 + 600;
    sched(() => {
      setStatusMsg(
        "✅  Incremental run complete — only 3 new rows inserted. Rows 1–8 untouched.",
      );
      setRunning(false);
    }, total);
  };

  const phaseConfig = [
    { label: "① Initial state", color: "#64748b" },
    { label: "② First run", color: "#4ade80" },
    { label: "③ Incremental run", color: "#fb923c" },
  ];

  const firstRunRows = targetRows.filter((r) => !r.isNew);
  const incrementalRows = targetRows.filter((r) => r.isNew);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 0,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 24,
          padding: 3,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {phaseConfig.map((p, i) => (
          <button
            key={i}
            onClick={() => switchPhase(i)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: phase === i ? `${p.color}22` : "transparent",
              color: phase === i ? p.color : "#475569",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
              outline: phase === i ? `1px solid ${p.color}55` : "none",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {phase === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            padding: "6px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                raw.events (source)
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                {allRows.map((r) => (
                  <AnimatedSourceRow
                    key={r.id}
                    row={r}
                    state="idle"
                    delay={0}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 56,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px dashed #1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                ?
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#334155",
                  fontFamily: "monospace",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                no run yet
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                mart.events (target)
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.5)",
                  border: "2px dashed #1e293b",
                  borderRadius: 10,
                  padding: "12px 14px",
                  minWidth: 220,
                  minHeight: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>📭</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#334155",
                      fontFamily: "monospace",
                    }}
                  >
                    does not exist yet
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.18)",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            👆 Click <strong style={{ color: "#4ade80" }}>② First run</strong>{" "}
            to build the table for the first time.
          </div>
        </div>
      )}

      {phase === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 8,
              padding: "7px 14px",
              width: "100%",
              maxWidth: 580,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#4ade80",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {statusMsg ||
                "is_incremental() checks if mart.events exists. First time → FALSE → full load."}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                raw.events — 8 rows (all scanned)
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                {allRows.map((r) => (
                  <AnimatedSourceRow
                    key={r.id}
                    row={r}
                    state={rowStates[r.id] || "idle"}
                    delay={0}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                paddingTop: 52,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: running ? "#4ade80" : "#1e3a2a",
                  fontFamily: "monospace",
                  transition: "color 0.3s",
                }}
              >
                CREATE TABLE
              </div>
              <div style={{ position: "relative", width: 44 }}>
                <div
                  style={{
                    height: 2,
                    background: running ? "#4ade80" : "#1e293b",
                    transition: "background 0.3s",
                    boxShadow: running ? "0 0 8px #4ade80" : "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -4,
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: `8px solid ${running ? "#4ade80" : "#1e293b"}`,
                    transition: "all 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#1e3a2a",
                  fontFamily: "monospace",
                }}
              >
                INSERT ALL
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                mart.events — {firstRunRows.length} / 8 rows written
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: `1px solid ${firstRunRows.length > 0 ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  minWidth: 220,
                  minHeight: 60,
                  transition: "border-color 0.4s",
                }}
              >
                {firstRunRows.length === 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#1e293b",
                      fontFamily: "monospace",
                      padding: "12px 0",
                      textAlign: "center",
                    }}
                  >
                    waiting...
                  </div>
                )}
                {firstRunRows.map((r) => (
                  <TargetRow key={r.id} row={r} isNew={false} animate={false} />
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                color: "#fca5a5",
                fontFamily: "monospace",
              }}
            >
              Rows scanned: <strong>{firstRunRows.length} / 8</strong>
            </div>
            <div
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                color: "#fca5a5",
                fontFamily: "monospace",
              }}
            >
              SQL: <strong>CREATE TABLE → INSERT ALL</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={runFirstRun}
              disabled={running}
              style={{
                padding: "8px 22px",
                borderRadius: 8,
                border: "1px solid rgba(74,222,128,0.4)",
                background: running
                  ? "rgba(74,222,128,0.04)"
                  : "rgba(74,222,128,0.14)",
                color: running ? "#475569" : "#4ade80",
                fontWeight: 700,
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                transition: "all 0.2s",
              }}
            >
              {running
                ? "⚙️ Running..."
                : firstRunDone
                  ? "↩ Rerun first run"
                  : "▶ Run first run"}
            </button>
            {firstRunDone && !running && (
              <button
                onClick={() => switchPhase(2)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 8,
                  border: "1px solid rgba(251,146,60,0.4)",
                  background: "rgba(251,146,60,0.12)",
                  color: "#fb923c",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                }}
              >
                Next → Incremental run ❯
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
        >
          {!firstRunDone && (
            <div
              style={{
                background: "rgba(251,146,60,0.08)",
                border: "1px solid rgba(251,146,60,0.25)",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 12,
                color: "#fdba74",
                textAlign: "center",
              }}
            >
              ⚠️ Run <strong>② First run</strong> first so mart.events has the
              initial 8 rows — then come back here.
            </div>
          )}
          <div
            style={{
              background: "rgba(251,146,60,0.07)",
              border: "1px solid rgba(251,146,60,0.2)",
              borderRadius: 8,
              padding: "7px 14px",
              width: "100%",
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#fb923c",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {statusMsg ||
                "is_incremental() → TRUE — mart.events already has 8 rows. 3 new rows arrived in source."}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                raw.events — 11 rows (8 old + 3 new)
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                {allRows.map((r) => (
                  <AnimatedSourceRow
                    key={r.id}
                    row={r}
                    state={rowStates[r.id] || "idle"}
                    delay={0}
                  />
                ))}
                <div
                  style={{
                    borderTop: "1px dashed #fb923c33",
                    margin: "5px 0 5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      color: "#fb923c55",
                      fontFamily: "monospace",
                    }}
                  >
                    ↓ new today
                  </span>
                </div>
                {newBatchRows.map((r) => (
                  <AnimatedSourceRow
                    key={r.id}
                    row={r}
                    state={rowStates[r.id] || "idle"}
                    delay={0}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 5,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  ["#facc15", "scanning"],
                  ["rgba(30,41,59,0.9)", "✕ filtered out"],
                  ["#fb923c", "✓ passes"],
                ].map(([c, label]) => (
                  <div
                    key={label}
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 2,
                        background: c,
                        border: "1px solid #334155",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "#475569",
                        fontFamily: "monospace",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                paddingTop: 64,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: running ? "#fb923c" : "#1e293b",
                  fontFamily: "monospace",
                  transition: "color 0.3s",
                }}
              >
                INSERT INTO
              </div>
              <div style={{ position: "relative", width: 44 }}>
                <div
                  style={{
                    height: 2,
                    background: running ? "#fb923c" : "#1e293b",
                    transition: "background 0.3s",
                    boxShadow: running ? "0 0 8px #fb923c" : "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -4,
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: `8px solid ${running ? "#fb923c" : "#1e293b"}`,
                    transition: "all 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#1e293b",
                  fontFamily: "monospace",
                }}
              >
                3 rows only
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontFamily: "monospace",
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                mart.events — {firstRunRows.length + incrementalRows.length}{" "}
                rows total
              </div>
              <div
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: `1px solid ${incrementalRows.length > 0 ? "rgba(251,146,60,0.35)" : "rgba(74,222,128,0.2)"}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  minWidth: 220,
                  transition: "border-color 0.4s",
                }}
              >
                {firstRunRows.map((r) => (
                  <TargetRow key={r.id} row={r} isNew={false} animate={false} />
                ))}
                {incrementalRows.length > 0 && (
                  <div
                    style={{
                      borderTop: "1px dashed #fb923c55",
                      margin: "5px 0 4px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 8,
                        color: "#fb923c77",
                        fontFamily: "monospace",
                      }}
                    >
                      ↓ inserted this run
                    </span>
                  </div>
                )}
                {incrementalRows.map((r) => (
                  <TargetRow key={r.id} row={r} isNew={true} animate={true} />
                ))}
                {firstRunRows.length === 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#1e293b",
                      fontFamily: "monospace",
                      padding: "12px 0",
                      textAlign: "center",
                    }}
                  >
                    run ② first
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.18)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                color: "#86efac",
                fontFamily: "monospace",
              }}
            >
              Rows scanned: <strong>11</strong> &nbsp;·&nbsp; Inserted:{" "}
              <strong>{incrementalRows.length} / 3</strong>
            </div>
            <div
              style={{
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.18)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                color: "#86efac",
                fontFamily: "monospace",
              }}
            >
              SQL: <strong>INSERT INTO</strong> (no DROP!)
            </div>
          </div>
          <button
            onClick={runIncremental}
            disabled={running || !firstRunDone}
            style={{
              padding: "8px 22px",
              borderRadius: 8,
              border: `1px solid ${firstRunDone ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.07)"}`,
              background: !firstRunDone
                ? "transparent"
                : running
                  ? "rgba(251,146,60,0.04)"
                  : "rgba(251,146,60,0.14)",
              color: !firstRunDone
                ? "#334155"
                : running
                  ? "#475569"
                  : "#fb923c",
              fontWeight: 700,
              cursor: running || !firstRunDone ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              transition: "all 0.2s",
            }}
          >
            {running ? "⚙️ Running..." : "▶ Run incremental run"}
          </button>
        </div>
      )}
      <style>{`@keyframes slideIn { from { opacity:0; transform: translateX(10px); } to { opacity:1; transform: translateX(0); } }`}</style>
    </div>
  );
}
