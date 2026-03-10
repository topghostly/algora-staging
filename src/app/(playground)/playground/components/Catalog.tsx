import React, { useState } from "react";
import { T, DIFF_COLOR } from "./constants";
import { Course } from "./types";

export const COURSES: Course[] = [
  {
    id: "fundamentals",
    num: "01",
    title: "dbt Fundamentals",
    subtitle: "Modeling, sources, tests & docs",
    icon: "🏗️",
    color: T.purple,
    difficulty: "Beginner",
    duration: "45 min",
    topics: [
      "Warehouse connection",
      "Project structure",
      "Modeling",
      "Sources",
      "Testing",
      "Documentation",
      "Deployment",
    ],
  },
  {
    id: "jinja",
    num: "02",
    title: "Jinja, Macros & Packages",
    subtitle: "Extend dbt with dynamic SQL",
    icon: "🧩",
    color: T.pink,
    difficulty: "Intermediate",
    duration: "35 min",
    topics: [
      "Jinja templating",
      "ref() & source()",
      "Custom macros",
      "dbt-utils",
      "Packages",
    ],
  },
  {
    id: "incremental",
    num: "03",
    title: "Incremental Models",
    subtitle: "Process only new or changed data",
    icon: "🧱",
    color: T.orange,
    difficulty: "Intermediate",
    duration: "40 min",
    topics: [
      "Full refresh vs incremental",
      "is_incremental()",
      "Strategies",
      "Schema changes",
      "Warehouse strategies",
    ],
    fullyBuilt: true,
  },
  {
    id: "snapshots",
    num: "04",
    title: "Snapshots",
    subtitle: "Track historical records over time",
    icon: "📸",
    color: T.teal,
    difficulty: "Intermediate",
    duration: "30 min",
    topics: [
      "SCD Type 2",
      "dbt_valid_from/to",
      "check strategy",
      "timestamp strategy",
      "History queries",
    ],
  },
  {
    id: "seeds",
    num: "05",
    title: "Analyses & Seeds",
    subtitle: "Ad hoc queries and CSV data",
    icon: "🌱",
    color: "#a3e635",
    difficulty: "Beginner",
    duration: "20 min",
    topics: [
      "Seeds overview",
      "CSV versioning",
      "Analyses",
      "Ad hoc queries",
      "ref() in analyses",
    ],
  },
  {
    id: "exposures",
    num: "06",
    title: "Exposures",
    subtitle: "Downstream dependency visibility",
    icon: "🔭",
    color: T.blue,
    difficulty: "Beginner",
    duration: "20 min",
    topics: [
      "Exposure config",
      "YAML definition",
      "DAG visibility",
      "Dependency tracking",
      "Freshness",
    ],
  },
  {
    id: "state",
    num: "07",
    title: "State Management",
    subtitle: "Run only what changed",
    icon: "⚡",
    color: T.yellow,
    difficulty: "Advanced",
    duration: "25 min",
    topics: [
      "dbt state",
      "Slim CI",
      "modified selector",
      "Artifacts",
      "Deferred runs",
    ],
  },
  {
    id: "retry",
    num: "08",
    title: "dbt Retry",
    subtitle: "Efficiently rebuild failed pipelines",
    icon: "🔁",
    color: T.orange,
    difficulty: "Beginner",
    duration: "15 min",
    topics: [
      "dbt retry command",
      "run_results.json",
      "Error recovery",
      "CI patterns",
      "Best practices",
    ],
  },
  {
    id: "mesh",
    num: "09",
    title: "dbt Mesh",
    subtitle: "Cross-project data products at scale",
    icon: "🕸️",
    color: "#c084fc",
    difficulty: "Advanced",
    duration: "40 min",
    topics: [
      "Projects & contracts",
      "Public models",
      "Cross-project refs",
      "Governance",
      "Producer/consumer",
    ],
  },
  {
    id: "testing",
    num: "10",
    title: "Advanced Testing",
    subtitle: "Custom tests, packages & config",
    icon: "🧪",
    color: T.teal,
    difficulty: "Advanced",
    duration: "35 min",
    topics: [
      "Generic tests",
      "Custom tests",
      "dbt-expectations",
      "Test severity",
      "Test configs",
    ],
  },
  {
    id: "deployment",
    num: "11",
    title: "Advanced Deployment",
    subtitle: "CI, orchestration & environments",
    icon: "🚀",
    color: T.red,
    difficulty: "Advanced",
    duration: "35 min",
    topics: [
      "Continuous integration",
      "Conflicting jobs",
      "Environment configs",
      "dbt Cloud jobs",
      "Slim CI",
    ],
  },
  {
    id: "clone",
    num: "12",
    title: "dbt Clone",
    subtitle: "Zero-copy dev & test environments",
    icon: "🪞",
    color: "#67e8f9",
    difficulty: "Intermediate",
    duration: "20 min",
    topics: [
      "dbt clone command",
      "Zero-copy cloning",
      "Warehouse clones",
      "Dev workflows",
      "Cost savings",
    ],
  },
  {
    id: "grants",
    num: "13",
    title: "Grants",
    subtitle: "Fine-grained permission control",
    icon: "🔐",
    color: "#86efac",
    difficulty: "Intermediate",
    duration: "20 min",
    topics: [
      "Grant config",
      "Models & seeds",
      "Snapshots grants",
      "Role-based access",
      "Auto-grants",
    ],
  },
  {
    id: "python",
    num: "14",
    title: "Python dbt Models",
    subtitle: "ML & statistics beyond SQL",
    icon: "🐍",
    color: T.yellow,
    difficulty: "Advanced",
    duration: "35 min",
    topics: [
      "Python models",
      "Pandas & PySpark",
      "ML use cases",
      "SQL + Python hybrid",
      "Packages",
    ],
  },
];

export function CourseCatalog({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All" ? COURSES : COURSES.filter((c) => c.difficulty === filter);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at 15% 0%, #0a1628 0%, ${T.ink} 65%)`,
        color: "#f1f5f9",
        fontFamily: "'Onest',sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          padding: "56px 32px 40px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* teal glow behind hero */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background: `radial-gradient(ellipse, ${T.teal}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.tealBg,
            border: T.tealBorder,
            borderRadius: 20,
            padding: "5px 16px",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.teal,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: T.teal,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 0.5,
            }}
          >
            dbt Learning Platform · Interactive
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: "clamp(30px,5vw,50px)",
            fontWeight: 800,
            margin: "0 0 14px",
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
          className=""
        >
          Learn{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            dbt
          </span>{" "}
          from scratch
        </h1>
        <p
          style={{
            color: T.grey,
            fontSize: 14,
            maxWidth: 500,
            margin: "0 auto 28px",
            lineHeight: 1.75,
          }}
        >
          14 interactive courses covering everything from fundamentals to Python
          models — built for analysts and engineers who are brand new to dbt.
        </p>
        <div
          style={{
            display: "flex",
            gap: 28,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            ["14", "Courses"],
            ["4h+", "Content"],
            ["🌐", "Any Warehouse"],
            ["✦", "Interactive"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  letterSpacing: 0.5,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 7,
          padding: "18px 32px 4px",
          flexWrap: "wrap",
        }}
      >
        {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${filter === d ? DIFF_COLOR[d] || T.teal : "rgba(255,255,255,0.08)"}`,
              background:
                filter === d ? `${DIFF_COLOR[d] || T.teal}15` : "transparent",
              color: filter === d ? DIFF_COLOR[d] || T.teal : T.grey,
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
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
        {filtered.map((c, i) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === c.id ? "rgba(15,23,42,0.98)" : T.surface,
              border: `1px solid ${hovered === c.id ? c.color + "44" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14,
              padding: "16px 16px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
              transform:
                hovered === c.id ? "translateY(-3px)" : "translateY(0)",
              boxShadow: hovered === c.id ? `0 10px 32px ${c.color}14` : "none",
              animation: `fadeUp 0.4s ease both`,
              animationDelay: `${i * 28}ms`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: `${c.color}15`,
                  border: `1px solid ${c.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: T.greyDark,
                      fontFamily: "monospace",
                    }}
                  >
                    {c.num}
                  </span>
                  {c.fullyBuilt && (
                    <span
                      style={{
                        fontSize: 8,
                        background: "#4ade8020",
                        color: T.green,
                        border: "1px solid #4ade8033",
                        padding: "1px 5px",
                        borderRadius: 10,
                        fontFamily: "monospace",
                      }}
                    >
                      COMPLETE
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f1f5f9",
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: T.grey, marginTop: 2 }}>
                  {c.subtitle}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {c.topics.slice(0, 4).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    padding: "2px 6px",
                    borderRadius: 5,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: T.greyDark,
                  }}
                >
                  {t}
                </span>
              ))}
              {c.topics.length > 4 && (
                <span
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  +{c.topics.length - 4}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: "auto",
                paddingTop: 6,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 7px",
                  borderRadius: 10,
                  background: DIFF_COLOR[c.difficulty] + "14",
                  color: DIFF_COLOR[c.difficulty],
                  border: `1px solid ${DIFF_COLOR[c.difficulty]}33`,
                  fontFamily: "monospace",
                }}
              >
                {c.difficulty}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  marginLeft: "auto",
                }}
              >
                ⏱ {c.duration}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: hovered === c.id ? c.color : T.greyDark,
                  transition: "color 0.2s",
                }}
              >
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
