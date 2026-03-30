"use client";

import React, { useState } from "react";
import { T, PLAT } from "./components/sql-constants";
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
import { GLOBAL_STYLES } from "../components/constants";
import PlaygroundTopHeader from "../components/palyground-top-header";

// const GS = `
// @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
// *{box-sizing:border-box;margin:0;padding:0;}
// body{background:#07090f;color:#f1f5f9;font-family:'DM Sans',sans-serif;}
// @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
// @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
// @keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
// @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
// @keyframes rowFlash{0%{background:rgba(250,204,21,.25)}100%{background:transparent}}
// @keyframes rowAppear{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
// @keyframes collapse{from{max-height:300px}to{max-height:36px}}
// ::-webkit-scrollbar{width:4px;height:4px}
// ::-webkit-scrollbar-track{background:transparent}
// ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
// `;

const MODULES = [
  {
    id: "01",
    title: "SELECT & FROM",
    icon: "🔍",
    level: "easy",
    desc: "Choose columns, filter rows, sort results",
    color: T.cyan,
    component: Module01,
  },
  {
    id: "02",
    title: "WHERE",
    icon: "🎯",
    level: "easy",
    desc: "Filter rows with conditions and predicates",
    color: T.blue,
    component: Module02,
  },
  {
    id: "03",
    title: "GROUP BY",
    icon: "📊",
    level: "mid",
    desc: "Aggregate and summarise your data",
    color: T.green,
    component: Module03,
  },
  {
    id: "04",
    title: "JOINs",
    icon: "🔗",
    level: "mid",
    desc: "Combine rows from multiple tables",
    color: T.yellow,
    component: Module04,
  },
  {
    id: "05",
    title: "Subqueries & CTEs",
    icon: "🪆",
    level: "mid",
    desc: "Nested queries and named query expressions",
    color: T.orange,
    component: Module05,
  },
  {
    id: "06",
    title: "CASE",
    icon: "🌿",
    level: "mid",
    desc: "Conditional logic and if-then-else in SQL",
    color: T.teal,
    component: Module06,
  },
  {
    id: "07",
    title: "Window Functions",
    icon: "🪟",
    level: "hard",
    desc: "Row-by-row calculations over ordered sets",
    color: T.purple,
    component: Module07,
  },
  {
    id: "08",
    title: "Set Operations",
    icon: "♾️",
    level: "mid",
    desc: "UNION, INTERSECT, EXCEPT across result sets",
    color: T.indigo,
    component: Module08,
  },
  {
    id: "09",
    title: "NULL Handling",
    icon: "❔",
    level: "easy",
    desc: "Understanding and working with NULLs",
    color: T.orange,
    component: Module09,
  },
  {
    id: "10",
    title: "Views",
    icon: "🔭",
    level: "mid",
    desc: "Virtual tables and reusable query logic",
    color: T.cyan,
    component: Module10,
  },
  {
    id: "11",
    title: "DML",
    icon: "✏️",
    level: "mid",
    desc: "INSERT, UPDATE, DELETE — modifying data",
    color: T.blue,
    component: Module11,
  },
  {
    id: "12",
    title: "String & Dates",
    icon: "📅",
    level: "mid",
    desc: "Text manipulation and date arithmetic",
    color: T.green,
    component: Module12,
  },
  {
    id: "13",
    title: "Transactions",
    icon: "⚡",
    level: "hard",
    desc: "ACID, BEGIN, COMMIT, ROLLBACK, SAVEPOINT",
    color: T.yellow,
    component: Module13,
  },
  {
    id: "14",
    title: "Indexes",
    icon: "⚡",
    level: "hard",
    desc: "Speed up queries with B-tree indexing",
    color: T.red,
    component: Module14,
  },
];

const LEVEL_STYLE: Record<string, any> = {
  easy: { label: "Beginner", bg: "rgba(74,222,128,.1)", text: T.green },
  mid: { label: "Intermediate", bg: "rgba(250,204,21,.1)", text: T.yellow },
  hard: { label: "Advanced", bg: "rgba(248,113,113,.1)", text: T.red },
};

function Catalog({
  onSelect,
  platform,
}: {
  onSelect: (m: any) => void;
  platform: string;
}) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? MODULES : MODULES.filter((m) => m.level === filter);

  return (
    <>
      <PlaygroundTopHeader />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
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
              SQL{" "}
            </span>{" "}
            Playground
          </h1>
          <div style={{ fontSize: 13, color: T.grey, marginTop: 6 }}>
            14 interactive modules · visual-first · three SQL dialects
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
                  fontFamily: "monospace",
                  fontWeight: 700,
                  transition: "all .18s",
                  border: `1px solid ${filter === f ? (f === "all" ? T.cyan : LEVEL_STYLE[f].text) : "rgba(255,255,255,.1)"}`,
                  background:
                    filter === f
                      ? f === "all"
                        ? "rgba(34,211,238,.1)"
                        : LEVEL_STYLE[f].bg
                      : "transparent",
                  color:
                    filter === f
                      ? f === "all"
                        ? T.cyan
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
            padding: "16px 24px 60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))",
            gap: 12,
            maxWidth: 1160,
            margin: "0 auto",
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
                animation: `fadeUp .4s ease ${i * 40}ms both`,
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
                    fontFamily: "monospace",
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
                  fontFamily: "monospace",
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
                  fontFamily: "'Syne',sans-serif",
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                {m.title}
              </div>
              <div style={{ fontSize: 10, color: T.grey, lineHeight: 1.5 }}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ModuleShell({
  module,
  onBack,
  platform,
  setPlatform,
}: {
  module: any;
  onBack: (m?: any) => void;
  platform: string;
  setPlatform: (p: string) => void;
}) {
  const Comp = module.component;
  const idx = MODULES.findIndex((m) => m.id === module.id);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  return (
    <div>
      <PlaygroundTopHeader onBack={() => onBack()} backText="All Courses">
        <div style={{ width: 1, height: 16, background: T.slate }} />
        <span style={{ fontSize: 16 }}>{module.icon}</span>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: T.white,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {module.title}
          </div>
          <div style={{ fontSize: 9, color: T.grey }}>
            Module {module.id} of {MODULES.length}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 3,
            background: T.card,
            padding: 5,
            borderRadius: 10,
            border: `1px solid ${T.slate}`,
          }}
        >
          {Object.values(PLAT).map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              style={{
                padding: "6px 11px",
                borderRadius: 7,
                border: "none",
                background: platform === p.id ? p.bg : "transparent",
                color: platform === p.id ? p.color : T.grey,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
                transition: "all .15s",
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </PlaygroundTopHeader>

      <div
        style={{
          textAlign: "center",
          padding: "24px 20px 12px",
          borderBottom: `1px solid ${T.slate}30`,
          background: `linear-gradient(to bottom, ${module?.color}08, transparent)`,
        }}
      >
        {/* <div style={{ fontSize: 22, marginBottom: 6 }}>{module?.icon}</div> */}
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
          {module?.title}
        </h1>
        <div style={{ fontSize: 13, color: T.grey, marginTop: 4 }}>
          {module?.subtitle}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        <Comp platform={platform} />
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
              fontFamily: "monospace",
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
              fontFamily: "monospace",
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

export default function SQLPlayground() {
  const [platform, setPlatform] = useState("mysql");
  const [current, setCurrent] = useState<any>(null);

  const handleBack = (mod?: any) => {
    if (mod && mod.id) setCurrent(mod);
    else setCurrent(null);
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        // background: T.bg,
        minHeight: "100vh",
        color: T.white,
      }}
    >
      <style>{GLOBAL_STYLES}</style>
      {!current ? (
        <Catalog onSelect={(m) => setCurrent(m)} platform={platform} />
      ) : (
        <ModuleShell
          module={current}
          onBack={handleBack}
          platform={platform}
          setPlatform={setPlatform}
        />
      )}
    </div>
  );
}
