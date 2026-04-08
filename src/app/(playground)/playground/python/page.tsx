"use client";

import React, { useState } from "react";
import { T, LEVEL_STYLE } from "./components/python-constants";
import Module01 from "./components/modules/Module01";
import Module02 from "./components/modules/Module02";
import Module03 from "./components/modules/Module03";
import Module04 from "./components/modules/Module04";
import Module05 from "./components/modules/Module05";
import Module06 from "./components/modules/Module06";
import Module07 from "./components/modules/Module07";
import Module08 from "./components/modules/Module08";
import Module09 from "./components/modules/Module09";
import Module10 from "./components/modules/Module10";
import Module11 from "./components/modules/Module11";
import Module12 from "./components/modules/Module12";
import Module13 from "./components/modules/Module13";
import Module14 from "./components/modules/Module14";
import Module15 from "./components/modules/Module15";
import Module16 from "./components/modules/Module16";
import Module17 from "./components/modules/Module17";
import Module18 from "./components/modules/Module18";
import Module19 from "./components/modules/Module19";
import { GLOBAL_STYLES } from "../components/constants";
import PlaygroundTopHeader from "../components/palyground-top-header";

const MODULES = [
  {
    id: "01",
    title: "Variables & Types",
    icon: "🔢",
    level: "easy",
    desc: "9 types with live type explorer, f-strings, mutability, and LEGB scope",
    color: T.blue,
    component: Module01,
  },
  {
    id: "02",
    title: "Lists & Loops",
    icon: "📋",
    level: "easy",
    desc: "List operations, loop animator, comprehension builder, zip & enumerate",
    color: T.purple,
    component: Module02,
  },
  {
    id: "03",
    title: "Dictionaries",
    icon: "🗂️",
    level: "easy",
    desc: "Live dict explorer, defaultdict, Counter, nested dicts, power patterns",
    color: T.orange,
    component: Module03,
  },
  {
    id: "04",
    title: "Functions",
    icon: "⚙️",
    level: "easy",
    desc: "Function tracer, all arg types, closures, decorators, common mistakes",
    color: T.purple,
    component: Module04,
  },
  {
    id: "05",
    title: "DataFrames",
    icon: "🐼",
    level: "mid",
    desc: "TABLE/.info()/.describe() explorer, creating dfs, index & alignment",
    color: T.cyan,
    component: Module05,
  },
  {
    id: "06",
    title: "Filtering",
    icon: "🎯",
    level: "mid",
    desc: "Filter builder, .loc vs .iloc, multiple conditions, isin & between",
    color: T.blue,
    component: Module06,
  },
  {
    id: "07",
    title: "GroupBy",
    icon: "📊",
    level: "mid",
    desc: "4-phase journey, .agg() vs .transform(), named aggregations",
    color: T.cyan,
    component: Module07,
  },
  {
    id: "08",
    title: "Merging",
    icon: "🔗",
    level: "mid",
    desc: "Merge animator (INNER/LEFT/RIGHT/OUTER), pd.concat axis=0 & 1",
    color: T.green,
    component: Module08,
  },
  {
    id: "09",
    title: "Data Cleaning",
    icon: "🧹",
    level: "mid",
    desc: "Null heatmap, dtype fixer, outlier detection, duplicates",
    color: T.yellow,
    component: Module09,
  },
  {
    id: "10",
    title: "String Operations",
    icon: "📝",
    level: "mid",
    desc: "Live str method explorer, .str accessor, regex in pandas",
    color: T.green,
    component: Module10,
  },
  {
    id: "11",
    title: "Dates & Times",
    icon: "📅",
    level: "mid",
    desc: "Datetime explorer, tenure calculator, resample & time periods",
    color: T.blue,
    component: Module11,
  },
  {
    id: "12",
    title: "Visualisation",
    icon: "📈",
    level: "mid",
    desc: "6-chart builder, choosing the right chart, subplots & saving",
    color: T.blue,
    component: Module12,
  },
  {
    id: "13",
    title: "Lambda & Apply",
    icon: "⚡",
    level: "hard",
    desc: "Row-by-row apply animator, vectorised alternatives, map vs transform",
    color: T.purple,
    component: Module13,
  },
  {
    id: "14",
    title: "NumPy",
    icon: "🔢",
    level: "hard",
    desc: "Array creation, vectorised math, statistics, boolean masking",
    color: T.orange,
    component: Module14,
  },
  {
    id: "15",
    title: "Error Handling",
    icon: "🛡️",
    level: "hard",
    desc: "try/except explorer, common exceptions, custom errors, context managers",
    color: T.red,
    component: Module15,
  },
  {
    id: "16",
    title: "File I/O",
    icon: "📁",
    level: "mid",
    desc: "read_csv() mastery, CSV/Excel/JSON/Parquet/SQL, writing output",
    color: T.cyan,
    component: Module16,
  },
  {
    id: "17",
    title: "Regular Expressions",
    icon: "🔍",
    level: "hard",
    desc: "Live regex builder with highlighting, cheatsheet, pandas regex patterns",
    color: T.green,
    component: Module17,
  },
  {
    id: "18",
    title: "APIs & JSON",
    icon: "🌐",
    level: "hard",
    desc: "JSON navigator, calling APIs with requests, flatten with json_normalize",
    color: T.cyan,
    component: Module18,
  },
  {
    id: "19",
    title: "Full Pipeline",
    icon: "🚀",
    level: "hard",
    desc: "6-step production pipeline: Load→Inspect→Clean→Transform→Visualise→Output",
    color: T.blue,
    component: Module19,
  },
];

// ─── Catalog ──────────────────────────────────────────────────────────────────
function Catalog({ onSelect }: { onSelect: (m: any) => void }) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? MODULES : MODULES.filter((m) => m.level === filter);

  return (
    <>
      <PlaygroundTopHeader />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px" }}>
        <div
          style={{
            padding: "56px 32px 40px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: "clamp(30px,5vw,50px)",
              fontWeight: 800,
              margin: "0 0 14px",
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            <span
              style={{
                background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Python
            </span>{" "}
            Playground
          </h1>
          <div
            style={{
              fontSize: 13,
              color: T.grey,
              marginTop: 6,
              fontFamily: "'Onest',sans-serif",
            }}
          >
            19 interactive modules · visual-first · data science & engineering
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 14,
            }}
          >
            {["all", "easy", "mid", "hard"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 16,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontWeight: 700,
                  transition: "all .18s",
                  border: `1px solid ${filter === f ? (f === "all" ? T.yellow : LEVEL_STYLE[f].text) : "rgba(255,255,255,.1)"}`,
                  background:
                    filter === f
                      ? f === "all"
                        ? "rgba(250,204,21,.1)"
                        : LEVEL_STYLE[f].bg
                      : "transparent",
                  color:
                    filter === f
                      ? f === "all"
                        ? T.yellow
                        : LEVEL_STYLE[f].text
                      : T.grey,
                }}
              >
                {f === "all" ? "All levels" : LEVEL_STYLE[f].label}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: "16px 0 60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))",
            gap: 12,
          }}
        >
          {filtered.map((m, i) => (
            <div
              key={m.id}
              onClick={() => onSelect(m)}
              style={{
                border: `1px solid ${T.slate}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
                background: T.surface,
                transition: "all .18s",
                animation: `fadeUp .4s ease ${i * 35}ms both`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `1px solid ${m.color}44`;
                e.currentTarget.style.background = `${m.color}0a`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = `1px solid ${T.slate}`;
                e.currentTarget.style.background = T.surface;
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at top left,${m.color}08 0%,transparent 60%)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 22 }}>{m.icon}</div>
                <span
                  style={{
                    fontSize: 8,
                    padding: "2px 7px",
                    borderRadius: 8,
                    background: LEVEL_STYLE[m.level].bg,
                    color: LEVEL_STYLE[m.level].text,
                    fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 700,
                  }}
                >
                  {LEVEL_STYLE[m.level].label}
                </span>
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: m.color,
                  fontFamily: "'JetBrains Mono',monospace",
                  marginBottom: 3,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                MODULE {m.id}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.white,
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.grey,
                  lineHeight: 1.5,
                  fontFamily: "'Onest',sans-serif",
                }}
              >
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── ModuleShell ──────────────────────────────────────────────────────────────
function ModuleShell({
  module,
  onBack,
}: {
  module: any;
  onBack: (m?: any) => void;
}) {
  const Comp = module.component;
  const idx = MODULES.findIndex((m) => m.id === module.id);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  return (
    <div>
      <PlaygroundTopHeader onBack={() => onBack()} backText="All Modules">
        <div style={{ width: 1, height: 16, background: T.slate }} />
        <span style={{ fontSize: 16 }}>{module.icon}</span>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: T.white,
              fontFamily: "'Bricolage Grotesque',sans-serif",
            }}
          >
            {module.title}
          </div>
          <div
            style={{
              fontSize: 9,
              color: T.grey,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            Module {module.id} of {MODULES.length}
          </div>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 8,
            padding: "2px 8px",
            borderRadius: 8,
            background: LEVEL_STYLE[module.level].bg,
            color: LEVEL_STYLE[module.level].text,
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
          }}
        >
          {LEVEL_STYLE[module.level].label}
        </span>
      </PlaygroundTopHeader>

      <div
        style={{
          textAlign: "center",
          padding: "24px 20px 12px",
          borderBottom: `1px solid ${T.slate}30`,
          background: `linear-gradient(to bottom, ${module.color}08, transparent)`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: 30,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
            color: "#f1f5f9",
          }}
        >
          {module.title}
        </h1>
        <div
          style={{
            fontSize: 13,
            color: T.grey,
            marginTop: 4,
            fontFamily: "'Onest',sans-serif",
          }}
        >
          {module.desc}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        <Comp />
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 20px 32px",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {prev ? (
          <button
            onClick={() => onBack(prev)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1px solid ${T.slate}`,
              background: T.surface,
              color: T.grey,
              fontSize: 10,
              fontFamily: "'JetBrains Mono',monospace",
              textAlign: "left",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${prev.color}44`;
              e.currentTarget.style.color = prev.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = `1px solid ${T.slate}`;
              e.currentTarget.style.color = T.grey;
            }}
          >
            <span>←</span>
            <div>
              <div style={{ fontSize: 8, color: T.greyDark, marginBottom: 1 }}>
                Previous
              </div>
              {prev.icon} {prev.title}
            </div>
          </button>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {next && (
          <button
            onClick={() => onBack(next)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1px solid ${T.slate}`,
              background: T.surface,
              color: T.grey,
              fontSize: 10,
              fontFamily: "'JetBrains Mono',monospace",
              textAlign: "right",
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${next.color}44`;
              e.currentTarget.style.color = next.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = `1px solid ${T.slate}`;
              e.currentTarget.style.color = T.grey;
            }}
          >
            <div>
              <div style={{ fontSize: 8, color: T.greyDark, marginBottom: 1 }}>
                Next
              </div>
              {next.icon} {next.title}
            </div>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PythonPlayground() {
  const [current, setCurrent] = useState<any>(null);

  const handleBack = (mod?: any) => {
    if (mod && mod.id) setCurrent(mod);
    else setCurrent(null);
  };

  return (
    <div
      style={{
        fontFamily: "'Onest',sans-serif",
        minHeight: "100vh",
        color: T.white,
      }}
    >
      <style>{GLOBAL_STYLES}</style>
      {!current ? (
        <Catalog onSelect={(m) => setCurrent(m)} />
      ) : (
        <ModuleShell module={current} onBack={handleBack} />
      )}
    </div>
  );
}
