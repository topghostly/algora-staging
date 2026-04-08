"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg: "#07090f",
  surface: "#0d1220",
  card: "#111827",
  raised: "#141d2e",
  slate: "#1e293b",
  slateLight: "#273548",
  greyDark: "#334155",
  grey: "#64748b",
  greyLight: "#94a3b8",
  white: "#f1f5f9",
  green: "#4ade80",
  yellow: "#facc15",
  orange: "#fb923c",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#c084fc",
  pink: "#f472b6",
  teal: "#2dd4bf",
  cyan: "#22d3ee",
  indigo: "#818cf8",
};

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#07090f;color:#f1f5f9;font-family:'DM Sans',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes rowAppear{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 14px 3px rgba(96,165,250,.3)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
`;

const DF_EMPLOYEES = [
  {
    id: 1,
    name: "Amara Osei",
    dept: "Engineering",
    salary: 85000,
    hired: "2021-03-15",
    active: true,
    score: null,
  },
  {
    id: 2,
    name: "Bola Adeyemi",
    dept: "Analytics",
    salary: 72000,
    hired: "2020-07-22",
    active: true,
    score: 88.5,
  },
  {
    id: 3,
    name: "Chidi Nwosu",
    dept: "Engineering",
    salary: 91000,
    hired: "2019-11-01",
    active: true,
    score: 92.0,
  },
  {
    id: 4,
    name: "Dami Afolabi",
    dept: "Product",
    salary: 68000,
    hired: "2022-01-10",
    active: false,
    score: null,
  },
  {
    id: 5,
    name: "Efe Okonkwo",
    dept: "Analytics",
    salary: 75000,
    hired: "2021-06-30",
    active: true,
    score: 79.5,
  },
  {
    id: 6,
    name: "Funke Balogun",
    dept: "Engineering",
    salary: 88000,
    hired: "2020-04-18",
    active: true,
    score: 95.0,
  },
  {
    id: 7,
    name: "Grace Mensah",
    dept: "Product",
    salary: 71000,
    hired: "2022-09-05",
    active: true,
    score: 83.0,
  },
  {
    id: 8,
    name: "Henry Eze",
    dept: "Analytics",
    salary: 69000,
    hired: "2023-02-14",
    active: true,
    score: 77.0,
  },
  {
    id: 9,
    name: "Ifeoma Nwosu",
    dept: "Engineering",
    salary: 93000,
    hired: "2018-08-20",
    active: true,
    score: 98.5,
  },
  {
    id: 10,
    name: "Jide Okafor",
    dept: "Product",
    salary: 65000,
    hired: "2023-05-11",
    active: true,
    score: null,
  },
];
const DEPT_COLORS = {
  Engineering: {
    bg: "rgba(96,165,250,.1)",
    border: "rgba(96,165,250,.3)",
    text: T.blue,
  },
  Analytics: {
    bg: "rgba(74,222,128,.08)",
    border: "rgba(74,222,128,.3)",
    text: T.green,
  },
  Product: {
    bg: "rgba(192,132,252,.08)",
    border: "rgba(192,132,252,.3)",
    text: T.purple,
  },
};
const dc = (d) =>
  DEPT_COLORS[d] || {
    bg: "rgba(255,255,255,.03)",
    border: "rgba(255,255,255,.12)",
    text: T.greyLight,
  };

// ── SHARED UI ──────────────────────────────────────────────────────────────────
function PyBlock({ code, label }) {
  const kws = [
    "import",
    "from",
    "as",
    "def",
    "return",
    "class",
    "if",
    "elif",
    "else",
    "for",
    "in",
    "while",
    "and",
    "or",
    "not",
    "True",
    "False",
    "None",
    "lambda",
    "with",
    "try",
    "except",
    "finally",
    "raise",
    "pass",
    "break",
    "continue",
    "yield",
    "global",
    "nonlocal",
    "async",
    "await",
  ];
  const builtins = [
    "print",
    "len",
    "range",
    "type",
    "int",
    "float",
    "str",
    "list",
    "dict",
    "set",
    "tuple",
    "bool",
    "sorted",
    "reversed",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sum",
    "min",
    "max",
    "abs",
    "round",
    "isinstance",
    "pd",
    "np",
    "df",
    "plt",
    "sns",
    "re",
    "json",
    "open",
    "requests",
  ];
  return (
    <div
      style={{
        background: "rgba(4,9,20,.95)",
        border: "1px solid rgba(96,165,250,.18)",
        borderRadius: 8,
        padding: "10px 14px",
        overflowX: "auto",
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 8,
            color: T.blue,
            fontFamily: "monospace",
            marginBottom: 5,
            letterSpacing: 0.5,
          }}
        >
          🐍 {label}
        </div>
      )}
      <pre
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 11,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {(code || "").split("\n").map((line, i) => {
          if (line.trim().startsWith("#"))
            return (
              <div key={i} style={{ color: "#4b5563" }}>
                {line || " "}
              </div>
            );
          const parts = line.split(/\b/);
          return (
            <div key={i}>
              {parts.map((p, j) => {
                const pu = p.trim();
                if (kws.includes(pu))
                  return (
                    <span key={j} style={{ color: T.purple }}>
                      {p}
                    </span>
                  );
                if (builtins.includes(pu))
                  return (
                    <span key={j} style={{ color: T.cyan }}>
                      {p}
                    </span>
                  );
                if (/^["'].*["']$/.test(p))
                  return (
                    <span key={j} style={{ color: T.green }}>
                      {p}
                    </span>
                  );
                if (/^\d+(\.\d+)?$/.test(p))
                  return (
                    <span key={j} style={{ color: T.orange }}>
                      {p}
                    </span>
                  );
                return (
                  <span key={j} style={{ color: T.white }}>
                    {p}
                  </span>
                );
              })}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
function OutBlock({ children, label = "Output", err }) {
  return (
    <div
      style={{
        background: "rgba(4,9,20,.8)",
        border: `1px solid ${err ? "rgba(248,113,113,.3)" : "rgba(74,222,128,.2)"}`,
        borderRadius: 8,
        padding: "8px 14px",
      }}
    >
      <div
        style={{
          fontSize: 8,
          color: err ? T.red : T.green,
          fontFamily: "monospace",
          marginBottom: 4,
          letterSpacing: 0.5,
        }}
      >
        {err ? "❌ ERROR" : "▶ " + label}
      </div>
      <pre
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 11,
          lineHeight: 1.7,
          color: err ? T.red : T.greyLight,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
function Note({ c = T.cyan, children }) {
  return (
    <div
      style={{
        background: `${c}10`,
        border: `1px solid ${c}28`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: T.greyLight,
        lineHeight: 1.75,
      }}
    >
      {children}
    </div>
  );
}
function Hint({ children, icon = "👆" }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "7px 12px",
        borderRadius: 8,
        background: "rgba(255,255,255,.04)",
        border: "1px dashed rgba(255,255,255,.13)",
        fontSize: 11,
        color: T.greyLight,
        alignItems: "flex-start",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ lineHeight: 1.55 }}>{children}</span>
    </div>
  );
}
function Tip({ icon = "💡", title, children, c = T.yellow }) {
  return (
    <div
      style={{
        background: `${c}09`,
        border: `1px solid ${c}25`,
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: c,
          fontFamily: "monospace",
          marginBottom: 5,
          letterSpacing: 0.5,
        }}
      >
        {icon} {title}
      </div>
      <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
function Warn({ children }) {
  return (
    <div
      style={{
        background: "rgba(248,113,113,.07)",
        border: "1px solid rgba(248,113,113,.22)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: T.greyLight,
        lineHeight: 1.7,
      }}
    >
      <span style={{ color: T.red, fontWeight: 700, marginRight: 6 }}>⚠️</span>
      {children}
    </div>
  );
}
function SL({ children, c = T.greyDark }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono',monospace",
        color: c,
        letterSpacing: 1.2,
        fontWeight: 700,
        textTransform: "uppercase",
        marginBottom: 7,
      }}
    >
      {children}
    </div>
  );
}
function Badge({ children, c = T.blue }) {
  return (
    <span
      style={{
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 8,
        background: `${c}15`,
        color: c,
        fontFamily: "monospace",
        fontWeight: 700,
        border: `1px solid ${c}28`,
      }}
    >
      {children}
    </span>
  );
}
function Tag({ children, c = T.greyDark }) {
  return (
    <span
      style={{
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 6,
        background: `${c}18`,
        color: c,
        fontFamily: "monospace",
        border: `1px solid ${c}30`,
      }}
    >
      {children}
    </span>
  );
}

function CM({ mistakes }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Note c={T.red}>
        <strong style={{ color: T.red }}>Common Mistakes</strong> — click each
        bug to see what went wrong and how to fix it.
      </Note>
      {mistakes.map((m, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${open === i ? "rgba(248,113,113,.4)" : T.slate}`,
            borderRadius: 9,
            overflow: "hidden",
            transition: "border .2s",
          }}
        >
          <div
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              padding: "10px 14px",
              display: "flex",
              gap: 10,
              cursor: "pointer",
              background: open === i ? "rgba(248,113,113,.05)" : T.surface,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13 }}>🐛</span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: T.white, flex: 1 }}
            >
              {m.title}
            </span>
            <span
              style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}
            >
              {open === i ? "▾" : "▸"}
            </span>
          </div>
          {open === i && (
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(4,9,20,.7)",
                borderTop: `1px solid ${T.slate}44`,
                animation: "fadeUp .2s ease",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <SL c={T.red}>❌ Wrong</SL>
                  <PyBlock code={m.wrong} />
                </div>
                <div>
                  <SL c={T.green}>✅ Fix</SL>
                  <PyBlock code={m.right} />
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.greyLight,
                  lineHeight: 1.7,
                  background: `${T.orange}09`,
                  border: `1px solid ${T.orange}22`,
                  borderRadius: 7,
                  padding: "8px 12px",
                }}
              >
                <strong style={{ color: T.orange }}>Why: </strong>
                {m.why}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Quiz({ questions, c = T.blue }) {
  const [ans, setAns] = useState({});
  const [sub, setSub] = useState(false);
  const [score, setScore] = useState(null);
  const submit = () => {
    let n = 0;
    questions.forEach((q, i) => {
      if (ans[i] === q.correct) n++;
    });
    setScore(n);
    setSub(true);
  };
  const reset = () => {
    setAns({});
    setSub(false);
    setScore(null);
  };
  const all = questions.every((_, i) => ans[i] !== undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Note c={c}>
        <strong style={{ color: c }}>Knowledge check</strong> —{" "}
        {questions.length} questions. Full explanations after submitting.
      </Note>
      {questions.map((q, qi) => {
        const cor = ans[qi] === q.correct;
        return (
          <div
            key={qi}
            style={{
              background: T.surface,
              border: `1px solid ${sub ? (cor ? "rgba(74,222,128,.4)" : "rgba(248,113,113,.35)") : T.slate}`,
              borderRadius: 10,
              padding: "14px 16px",
              transition: "border .3s",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: sub ? (cor ? T.green : T.red) : T.greyDark,
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}
              >
                Q{qi + 1}
              </span>
              {q.type === "bug" && <Badge c={T.red}>spot the bug</Badge>}
              {q.type === "output" && (
                <Badge c={T.orange}>predict output</Badge>
              )}
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.6 }}>
                {q.question}
              </div>
            </div>
            {q.code && (
              <div style={{ marginBottom: 10 }}>
                <PyBlock code={q.code} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {q.options.map((opt, oi) => {
                let bc = T.slate,
                  bg = "rgba(255,255,255,.02)",
                  tc = T.greyLight;
                if (sub) {
                  if (oi === q.correct) {
                    bc = "rgba(74,222,128,.5)";
                    bg = "rgba(74,222,128,.1)";
                    tc = T.green;
                  } else if (ans[qi] === oi) {
                    bc = "rgba(248,113,113,.5)";
                    bg = "rgba(248,113,113,.1)";
                    tc = T.red;
                  }
                } else if (ans[qi] === oi) {
                  bc = `${c}66`;
                  bg = `${c}12`;
                  tc = c;
                }
                return (
                  <div
                    key={oi}
                    onClick={() => !sub && setAns((p) => ({ ...p, [qi]: oi }))}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${bc}`,
                      background: bg,
                      cursor: sub ? "default" : "pointer",
                      transition: "all .2s",
                    }}
                  >
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        border: `2px solid ${bc}`,
                        background:
                          ans[qi] === oi && !sub
                            ? c
                            : oi === q.correct && sub
                              ? T.green
                              : ans[qi] === oi && sub
                                ? T.red
                                : "transparent",
                        flexShrink: 0,
                        marginTop: 2,
                        transition: "all .2s",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: tc,
                        lineHeight: 1.55,
                        fontFamily: "monospace",
                      }}
                    >
                      {opt}
                    </span>
                    {sub && oi === q.correct && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: T.green,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {sub && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: cor
                    ? "rgba(74,222,128,.06)"
                    : "rgba(248,113,113,.06)",
                  border: `1px solid ${cor ? T.green : T.red}22`,
                  fontSize: 11,
                  color: T.greyLight,
                  lineHeight: 1.65,
                  animation: "popIn .25s ease",
                }}
              >
                <strong style={{ color: cor ? T.green : T.orange }}>
                  {cor ? "✓ Correct!" : "✗ Not quite."}
                </strong>{" "}
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
      {!sub ? (
        <button
          onClick={submit}
          disabled={!all}
          style={{
            padding: "9px 22px",
            borderRadius: 9,
            border: `1px solid ${all ? c : T.slate}44`,
            background: all ? `${c}14` : "transparent",
            color: all ? c : T.greyDark,
            fontSize: 11,
            cursor: all ? "pointer" : "not-allowed",
            fontFamily: "monospace",
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          {all ? "Submit answers →" : "Answer all questions first"}
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            animation: "popIn .3s ease",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: `${score === questions.length ? T.green : score >= questions.length / 2 ? T.yellow : T.red}12`,
              border: `1px solid ${score === questions.length ? T.green : score >= questions.length / 2 ? T.yellow : T.red}33`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color:
                  score === questions.length
                    ? T.green
                    : score >= questions.length / 2
                      ? T.yellow
                      : T.red,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {score}/{questions.length}
            </div>
            <div
              style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}
            >
              {score === questions.length ? "PERFECT" : "SCORE"}
            </div>
          </div>
          <button
            onClick={reset}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
              background: "transparent",
              color: T.grey,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            ↩ Retry
          </button>
        </div>
      )}
    </div>
  );
}

function Course({ steps, c, intro }) {
  const [s, setS] = useState(0);
  const pct = Math.round(((s + 1) / steps.length) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {intro && (
        <div
          style={{
            border: `1px solid ${c}28`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              background: `${c}13`,
              padding: "8px 16px",
              borderBottom: `1px solid ${c}20`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: c,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 9,
                color: c,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              WHAT IS THIS?
            </span>
          </div>
          <div style={{ background: `${c}07`, padding: "16px" }}>
            <div
              style={{
                fontSize: 13,
                color: T.white,
                lineHeight: 1.85,
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              {intro.explain}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: intro.why ? 12 : 0,
              }}
            >
              <div
                style={{
                  background: "rgba(4,9,20,.5)",
                  border: `1px solid ${T.slate}`,
                  borderRadius: 9,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    marginBottom: 7,
                  }}
                >
                  YOU'LL LEARN TO
                </div>
                {intro.learn.map((pt, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 7,
                      marginBottom: 5,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: c,
                        fontSize: 9,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      ▸
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.greyLight,
                        lineHeight: 1.5,
                      }}
                    >
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "rgba(4,9,20,.5)",
                  border: `1px solid ${T.slate}`,
                  borderRadius: 9,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    marginBottom: 7,
                  }}
                >
                  KEY CONCEPTS
                </div>
                {intro.concepts.map((pt, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 7,
                      marginBottom: 5,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: T.yellow,
                        fontSize: 9,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      ◆
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.greyLight,
                        lineHeight: 1.5,
                      }}
                    >
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {intro.why && (
              <div
                style={{
                  background: `${c}0c`,
                  border: `1px solid ${c}25`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 11,
                  color: T.greyLight,
                  lineHeight: 1.65,
                }}
              >
                <span style={{ color: c, fontWeight: 700, marginRight: 6 }}>
                  In practice:
                </span>
                {intro.why}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {steps.map((st, i) => (
          <button
            key={i}
            onClick={() => setS(i)}
            style={{
              padding: "4px 10px",
              borderRadius: 16,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              transition: "all .18s",
              border: `1px solid ${s === i ? c : "rgba(255,255,255,.07)"}`,
              background:
                s === i ? `${c}18` : s > i ? `${c}06` : "rgba(255,255,255,.02)",
              color: s === i ? c : s > i ? `${c}88` : T.grey,
              fontWeight: s === i ? 700 : 400,
            }}
          >
            {s > i && <span style={{ marginRight: 3, fontSize: 8 }}>✓</span>}
            {i + 1}. {st.title}
          </button>
        ))}
        <div
          style={{
            marginLeft: "auto",
            fontSize: 9,
            color: T.greyDark,
            fontFamily: "monospace",
          }}
        >
          {pct}%
        </div>
      </div>
      <div
        style={{
          height: 2,
          background: T.slate,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: c,
            borderRadius: 2,
            transition: "width .3s",
          }}
        />
      </div>
      <div key={s} style={{ animation: "fadeUp .3s ease" }}>
        {steps[s].desc && (
          <div
            style={{
              background: `${c}08`,
              border: `1px solid ${c}20`,
              borderRadius: 10,
              padding: "11px 14px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: c,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 0.8,
                marginBottom: 5,
              }}
            >
              ABOUT THIS STEP
            </div>
            <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.8 }}>
              {steps[s].desc}
            </div>
          </div>
        )}
        {steps[s].content()}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={() => setS((p) => Math.max(0, p - 1))}
          disabled={s === 0}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 10,
            cursor: s === 0 ? "not-allowed" : "pointer",
            fontFamily: "monospace",
            border: `1px solid ${T.slate}`,
            background: "transparent",
            color: s === 0 ? T.greyDark : T.grey,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setS((p) => Math.min(steps.length - 1, p + 1))}
          disabled={s === steps.length - 1}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 10,
            cursor: s === steps.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "monospace",
            border: `1px solid ${s === steps.length - 1 ? T.slate : c}44`,
            background: s === steps.length - 1 ? "transparent" : `${c}14`,
            color: s === steps.length - 1 ? T.greyDark : c,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── MODULE 01: VARIABLES & DATA TYPES ───────────────────────────────────────
function TypeExplorer() {
  const TYPES = [
    {
      label: "42",
      pyType: "int",
      c: T.blue,
      icon: "🔢",
      props: {
        value: 42,
        "unlimited precision": "True",
        "is_bool subclass": "False",
      },
      convs: { float: "42.0", str: '"42"', bool: "True" },
      ops: ["+ - * / // % **", "abs() round()", "bin() hex() oct()"],
      note: "Python 3 ints have no size limit — no overflow.",
    },
    {
      label: "3.14",
      pyType: "float",
      c: T.cyan,
      icon: "🔣",
      props: { value: 3.14, "IEEE 754": "64-bit", precision: "~15 digits" },
      convs: { int: "3 (truncates)", str: '"3.14"', bool: "True" },
      ops: [
        "math.floor() math.ceil()",
        "round(x, n)",
        "math.isnan() math.isinf()",
      ],
      note: "0.1 + 0.2 ≠ 0.3 due to binary floating point. Use Decimal for money.",
    },
    {
      label: '"Lagos"',
      pyType: "str",
      c: T.green,
      icon: "📝",
      props: { immutable: "True", indexable: "True", iterable: "True" },
      convs: {
        int: "ValueError",
        float: "ValueError",
        list: '["L","a","g","o","s"]',
      },
      ops: [
        "s[0] s[-1] s[1:3]",
        ".upper() .lower() .strip()",
        ".split() .join() .replace()",
      ],
      note: "Immutable sequence. s[0]='L' raises TypeError.",
    },
    {
      label: "True",
      pyType: "bool",
      c: T.yellow,
      icon: "✅",
      props: { value: 1, "subclass of int": "True", "False == 0": "True" },
      convs: { int: "1", float: "1.0", str: '"True"' },
      ops: ["and or not", "True + True → 2", "sum([True, False, True]) → 2"],
      note: "bool is a subclass of int. True == 1, False == 0.",
    },
    {
      label: "None",
      pyType: "NoneType",
      c: T.red,
      icon: "❌",
      props: { singleton: "True", falsy: "True", "is None": "use this" },
      convs: { bool: "False", str: '"None"', int: "TypeError" },
      ops: ["x is None", "x is not None", "x or default_val"],
      note: "Singleton — only one None exists. Always use 'is None', never '== None'.",
    },
    {
      label: "[1,2,3]",
      pyType: "list",
      c: T.purple,
      icon: "📋",
      props: { mutable: "True", ordered: "True", allows_dupes: "True" },
      convs: { tuple: "(1,2,3)", set: "{1,2,3}", dict: "zip required" },
      ops: [
        ".append() .pop() .insert()",
        ".sort() .reverse() .copy()",
        "sorted() len() min() max()",
      ],
      note: "Most versatile structure. O(1) append, O(n) insert at index.",
    },
    {
      label: '{"a":1}',
      pyType: "dict",
      c: T.orange,
      icon: "🗂️",
      props: { mutable: "True", "ordered (3.7+)": "True", keys_unique: "True" },
      convs: {
        keys: "dict_keys view",
        values: "dict_values view",
        items: "dict_items view",
      },
      ops: [".get(k, default)", ".update() | merge", ".pop() .setdefault()"],
      note: "O(1) key lookup. Keys must be hashable (str, int, tuple — not list).",
    },
    {
      label: "(1,2,3)",
      pyType: "tuple",
      c: T.pink,
      icon: "📦",
      props: {
        immutable: "True",
        ordered: "True",
        hashable: "True (if items are)",
      },
      convs: { list: "[1,2,3]", set: "{1,2,3}", str: "str((1,2,3))" },
      ops: [
        "t[0] t[-1] t[1:]",
        "len() in count() index()",
        "unpacking: a,b,c = t",
      ],
      note: "Immutable list. Use as dict keys, for multiple return values, for fixed records.",
    },
    {
      label: "{1,2,3}",
      pyType: "set",
      c: T.teal,
      icon: "🔵",
      props: { mutable: "True", unordered: "True", unique_only: "True" },
      convs: {
        list: "[1,2,3]",
        tuple: "(1,2,3)",
        frozenset: "frozenset({1,2,3})",
      },
      ops: [
        "| union & intersect - diff",
        "^ symmetric_diff",
        ".add() .discard() .remove()",
      ],
      note: "O(1) membership test. No duplicates. Unordered — no indexing.",
    },
  ];
  const [sel, setSel] = useState(0);
  const t = TYPES[sel];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Click any value below to explore its type — see properties, operations,
        and how it converts to other types.
      </Hint>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {TYPES.map((tp, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 9,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              border: `1px solid ${sel === i ? tp.c : "rgba(255,255,255,.08)"}`,
              background: sel === i ? `${tp.c}15` : "rgba(255,255,255,.02)",
              color: sel === i ? tp.c : T.grey,
              transition: "all .18s",
              fontWeight: sel === i ? 700 : 400,
            }}
          >
            {tp.label}
          </button>
        ))}
      </div>
      <div
        key={sel}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          animation: "popIn .22s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              border: `1px solid ${t.c}44`,
              borderRadius: 12,
              padding: "14px",
              background: `${t.c}08`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 26 }}>{t.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: t.c,
                    fontFamily: "'Syne',sans-serif",
                  }}
                >
                  {t.pyType}
                </div>
                <div style={{ fontSize: 10, color: T.grey, lineHeight: 1.4 }}>
                  {t.note}
                </div>
              </div>
            </div>
            <PyBlock
              code={`x = ${t.label}\ntype(x)   # <class '${t.pyType}'>\nprint(x)  # ${String(t.props.value || t.label)}`}
            />
          </div>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 10,
              padding: "12px",
            }}
          >
            <SL c={t.c}>PROPERTIES</SL>
            {Object.entries(t.props).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                  borderBottom: `1px solid ${T.slate}33`,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: T.grey,
                    fontFamily: "monospace",
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: T.white,
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  {String(v)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 10,
              padding: "12px",
            }}
          >
            <SL c={T.green}>TYPE CONVERSIONS</SL>
            {Object.entries(t.convs).map(([to, result]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}
                >
                  {t.pyType} → {to}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    background: "rgba(4,9,20,.7)",
                    borderRadius: 6,
                    padding: "5px 8px",
                  }}
                >
                  <code
                    style={{
                      fontSize: 10,
                      color: t.c,
                      fontFamily: "monospace",
                    }}
                  >
                    {t.label}
                  </code>
                  <span style={{ fontSize: 10, color: T.greyDark }}>→</span>
                  <code
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: result.includes("Error") ? "#f87171" : T.green,
                      fontWeight: 700,
                    }}
                  >
                    {result}
                  </code>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 10,
              padding: "12px",
            }}
          >
            <SL c={T.purple}>COMMON OPERATIONS</SL>
            {t.ops.map((op, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 7, padding: "4px 0" }}
              >
                <span style={{ color: T.purple, fontSize: 10, flexShrink: 0 }}>
                  ▸
                </span>
                <code
                  style={{
                    fontSize: 10,
                    color: T.greyLight,
                    fontFamily: "monospace",
                  }}
                >
                  {op}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FStringBuilder() {
  const [name, setName] = useState("Amara");
  const [salary, setSalary] = useState(85000);
  const [score, setScore] = useState(92.5);
  const [dept, setDept] = useState("Engineering");
  const TEMPLATES = [
    {
      label: "Basic",
      code: (n, s, sc, d) => `f"Hello, {n}!"`,
      result: (n) => `Hello, ${n}!`,
    },
    {
      label: "Number format",
      code: (n, s) => `f"Salary: {s:,}"`,
      result: (n, s) => `Salary: ${s.toLocaleString()}`,
    },
    {
      label: "Float precision",
      code: (n, s, sc) => `f"Score: {sc:.1f}%"`,
      result: (n, s, sc) => `Score: ${sc.toFixed(1)}%`,
    },
    {
      label: "Padding",
      code: (n) => `f"{n:<15} |done|"`,
      result: (n) => `${n.padEnd(15)} |done|`,
    },
    {
      label: "Expression",
      code: (n, s) => `f"Tax: {s*0.15:,.0f}"`,
      result: (n, s) => `Tax: ${Math.round(s * 0.15).toLocaleString()}`,
    },
    {
      label: "Conditional",
      code: (n, s, sc, d) => `f"{n} is {'senior' if s>80000 else 'junior'}"`,
      result: (n, s) => `${n} is ${s > 80000 ? "senior" : "junior"}`,
    },
    {
      label: "Multi-line",
      code: (n, s, sc, d) =>
        `f"""\nName:  {n}\nDept:  {d}\nSal:   ${"{"}s:,{"}"}\n"""`,
      result: (n, s, sc, d) =>
        `\nName:  ${n}\nDept:  ${d}\nSal:   ${s.toLocaleString()}\n`,
    },
  ];
  const [sel, setSel] = useState(0);
  const tm = TEMPLATES[sel];
  let result;
  try {
    if (sel === 0) result = `Hello, ${name}!`;
    else if (sel === 1) result = `Salary: ${salary.toLocaleString()}`;
    else if (sel === 2) result = `Score: ${score.toFixed(1)}%`;
    else if (sel === 3) result = `${name.padEnd(15)} |done|`;
    else if (sel === 4)
      result = `Tax: ${Math.round(salary * 0.15).toLocaleString()}`;
    else if (sel === 5)
      result = `${name} is ${salary > 80000 ? "senior" : "junior"}`;
    else
      result = `\nName:  ${name}\nDept:  ${dept}\nSal:   ${salary.toLocaleString()}\n`;
  } catch {
    result = "error";
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Edit the variables on the left. Choose an f-string template on the
        right. The output updates as you type.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>VARIABLES</SL>
          {[
            { k: "name", v: name, set: setName, type: "text", c: T.green },
            {
              k: "salary",
              v: salary,
              set: (e) => setSalary(Number(e)),
              type: "number",
              c: T.blue,
            },
            {
              k: "score",
              v: score,
              set: (e) => setScore(Number(e)),
              type: "number",
              step: 0.1,
              c: T.orange,
            },
            { k: "dept", v: dept, set: setDept, type: "text", c: T.purple },
          ].map((f) => (
            <div
              key={f.k}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <code
                style={{
                  fontSize: 10,
                  color: f.c,
                  fontFamily: "monospace",
                  minWidth: 52,
                }}
              >
                {f.k}
              </code>
              <span style={{ color: T.greyDark, fontSize: 12 }}>=</span>
              <input
                value={f.v}
                onChange={(e) => f.set(e.target.value)}
                type={f.type}
                step={f.step}
                style={{
                  flex: 1,
                  padding: "5px 9px",
                  borderRadius: 7,
                  border: `1px solid ${f.c}44`,
                  background: T.bg,
                  color: f.c,
                  fontSize: 11,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>TEMPLATE</SL>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {TEMPLATES.map((tmpl, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                style={{
                  padding: "4px 9px",
                  borderRadius: 7,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`,
                  background:
                    sel === i ? "rgba(34,211,238,.12)" : "transparent",
                  color: sel === i ? T.cyan : T.grey,
                  fontWeight: sel === i ? 700 : 400,
                }}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
          <PyBlock code={tm.code(name, salary, score, dept)} />
          <div
            style={{
              background: "rgba(4,9,20,.9)",
              border: "1px solid rgba(74,222,128,.25)",
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: T.green,
                fontFamily: "monospace",
                marginBottom: 4,
              }}
            >
              ▶ OUTPUT
            </div>
            <pre
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                color: T.white,
                lineHeight: 1.6,
              }}
            >
              {result}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function MutabilityVisual() {
  const [cities, setCities] = useState(["Lagos", "Accra", "Nairobi"]);
  const [newCity, setNewCity] = useState("");
  const [lastOp, setLastOp] = useState(null);
  const [strInput, setStrInput] = useState("Lagos");
  const [strAttempt, setStrAttempt] = useState(false);
  const ops = [
    {
      label: ".append('Cairo')",
      c: T.green,
      fn: () => {
        setCities((p) => [...p, "Cairo"]);
        setLastOp({ op: "append('Cairo')", res: [...cities, "Cairo"] });
      },
    },
    {
      label: ".pop()",
      c: T.red,
      fn: () => {
        if (cities.length) {
          const n = [...cities];
          n.pop();
          setCities(n);
          setLastOp({ op: "pop()", res: n });
        }
      },
    },
    {
      label: ".pop(0)",
      c: T.orange,
      fn: () => {
        if (cities.length) {
          const n = cities.slice(1);
          setCities(n);
          setLastOp({ op: "pop(0)", res: n });
        }
      },
    },
    {
      label: ".sort()",
      c: T.blue,
      fn: () => {
        const n = [...cities].sort();
        setCities(n);
        setLastOp({ op: "sort()", res: n });
      },
    },
    {
      label: ".reverse()",
      c: T.purple,
      fn: () => {
        const n = [...cities].reverse();
        setCities(n);
        setLastOp({ op: "reverse()", res: n });
      },
    },
    {
      label: ".clear()",
      c: T.red,
      fn: () => {
        setCities([]);
        setLastOp({ op: "clear()", res: [] });
      },
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Lists are mutable — click operations below to modify the list in place.
        Try to change the string — watch it refuse.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 6,
              alignItems: "center",
            }}
          >
            <SL c={T.green}>MUTABLE — list</SL>
            <Badge c={T.green}>modifies in place</Badge>
          </div>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              border: "1px solid rgba(74,222,128,.25)",
              borderRadius: 10,
              padding: "10px",
              minHeight: 120,
              marginBottom: 8,
            }}
          >
            {cities.length === 0 && (
              <div
                style={{
                  fontSize: 10,
                  color: T.greyDark,
                  textAlign: "center",
                  padding: "16px",
                  fontFamily: "monospace",
                }}
              >
                [] — empty list
              </div>
            )}
            {cities.map((c, i) => (
              <div
                key={`${c}-${i}`}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  padding: "4px 6px",
                  borderRadius: 6,
                  background: "rgba(74,222,128,.08)",
                  border: "1px solid rgba(74,222,128,.15)",
                  marginBottom: 3,
                  animation: "slideIn .2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    minWidth: 20,
                  }}
                >
                  [{i}]
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: T.green,
                    fontFamily: "monospace",
                    flex: 1,
                  }}
                >
                  "{c}"
                </span>
                <button
                  onClick={() => {
                    setCities((p) => p.filter((_, j) => j !== i));
                    setLastOp({
                      op: `remove index ${i}`,
                      res: cities.filter((_, j) => j !== i),
                    });
                  }}
                  style={{
                    fontSize: 9,
                    color: T.red,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.5,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            <input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                newCity.trim() &&
                (ops[0].fn(), setNewCity(""))
              }
              placeholder="New city..."
              style={{
                flex: 1,
                padding: "5px 9px",
                borderRadius: 6,
                border: "1px solid rgba(74,222,128,.3)",
                background: T.bg,
                color: T.green,
                fontSize: 10,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
            <button
              onClick={() => {
                if (newCity.trim()) {
                  setCities((p) => [...p, newCity.trim()]);
                  setLastOp({
                    op: `append("${newCity.trim()}")`,
                    res: [...cities, newCity.trim()],
                  });
                  setNewCity("");
                }
              }}
              style={{
                padding: "5px 11px",
                borderRadius: 6,
                border: "1px solid rgba(74,222,128,.4)",
                background: "rgba(74,222,128,.1)",
                color: T.green,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              append()
            </button>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}
          >
            {ops.slice(1).map((op, i) => (
              <button
                key={i}
                onClick={op.fn}
                style={{
                  padding: "5px",
                  borderRadius: 7,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  border: `1px solid ${op.c}44`,
                  background: `${op.c}0c`,
                  color: op.c,
                }}
              >
                {op.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setCities(["Lagos", "Accra", "Nairobi"]);
              setLastOp(null);
            }}
            style={{
              marginTop: 6,
              padding: "4px",
              width: "100%",
              borderRadius: 7,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${T.slate}`,
              background: "transparent",
              color: T.greyDark,
            }}
          >
            ↩ Reset
          </button>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 6,
              alignItems: "center",
            }}
          >
            <SL c={T.red}>IMMUTABLE — str</SL>
            <Badge c={T.red}>cannot change in place</Badge>
          </div>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              border: "1px solid rgba(248,113,113,.25)",
              borderRadius: 10,
              padding: "12px",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
              {"Lagos".split("").map((ch, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "6px 4px",
                    background: "rgba(248,113,113,.12)",
                    border: "1px solid rgba(248,113,113,.3)",
                    borderRadius: 5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: T.red,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {ch}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      color: T.greyDark,
                      fontFamily: "monospace",
                    }}
                  >
                    [{i}]
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStrAttempt(true)}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: 7,
                border: "1px solid rgba(248,113,113,.4)",
                background: "rgba(248,113,113,.08)",
                color: T.red,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              Try: city[0] = "l"
            </button>
            {strAttempt && (
              <div style={{ marginTop: 8, animation: "popIn .2s ease" }}>
                <OutBlock err>
                  TypeError: 'str' object does not support item assignment
                </OutBlock>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 10,
                    color: T.greyLight,
                    fontFamily: "monospace",
                    lineHeight: 1.6,
                  }}
                >
                  To "modify" a string, create a{" "}
                  <strong style={{ color: T.green }}>new</strong> one:
                  <br />
                  <code style={{ color: T.cyan }}>
                    city = "l" + city[1:] # "lagos"
                  </code>
                </div>
              </div>
            )}
          </div>
          {lastOp && (
            <div style={{ animation: "popIn .2s ease" }}>
              <SL c={T.green}>LAST OPERATION</SL>
              <PyBlock
                code={`cities.${lastOp.op}\n# Result: ${JSON.stringify(lastOp.res)}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScopeVisual() {
  const ZONES = [
    {
      label: "Built-in (B)",
      c: T.greyDark,
      vars: ["len", "print", "range", "type", "int", "str", "list", "dict"],
      desc: "Always available. Python's built-in namespace.",
    },
    {
      label: "Global (G)",
      c: T.blue,
      vars: ["RATE = 0.15", "employees = [...]", "BASE_SALARY = 50000"],
      desc: "Module-level variables. Accessible anywhere in the file.",
    },
    {
      label: "Enclosing (E)",
      c: T.cyan,
      vars: ["tax_year = 2024", "region = 'Lagos'"],
      desc: "Only in nested functions — the outer function's scope.",
    },
    {
      label: "Local (L)",
      c: T.green,
      vars: ["name = 'Amara'", "salary = 85000", "result = None"],
      desc: "Variables created inside the current function.",
    },
  ];
  const [active, setActive] = useState(3);
  const [showError, setShowError] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Python searches for names in L → E → G → B order (LEGB). Click each
        scope to see what's available. The innermost scope wins.
      </Hint>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[...ZONES].reverse().map((z, i) => {
          const ri = ZONES.length - 1 - i;
          return (
            <div
              key={z.label}
              onClick={() => setActive(ri)}
              style={{
                border: `2px solid ${active === ri ? z.c : z.c + "44"}`,
                borderRadius: 12,
                padding: "10px 14px",
                cursor: "pointer",
                background: active === ri ? `${z.c}0d` : "transparent",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: z.c,
                    fontFamily: "monospace",
                  }}
                >
                  {z.label}
                </span>
                <span style={{ fontSize: 10, color: T.grey }}>{z.desc}</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {z.vars.map((v, j) => (
                  <code
                    key={j}
                    style={{
                      fontSize: 9,
                      padding: "2px 7px",
                      borderRadius: 5,
                      background: `${z.c}18`,
                      color: z.c,
                      fontFamily: "monospace",
                      border: `1px solid ${z.c}30`,
                    }}
                  >
                    {v}
                  </code>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <PyBlock
        label="LEGB in action"
        code={`RATE = 0.15  # Global\n\ndef calc_tax(salary):  # salary is Local\n    tax = salary * RATE  # uses Global RATE\n    return tax\n\ndef outer():\n    year = 2024  # Enclosing\n    def inner():\n        print(year)  # finds in Enclosing scope ✓\n    inner()\n\n# global keyword — modify global from inside function:\ncount = 0\ndef increment():\n    global count  # without this, creates local 'count'\n    count += 1`}
      />
      <Warn>
        Avoid mutable globals. Passing data through function arguments is
        cleaner and more testable than relying on global state.
      </Warn>
    </div>
  );
}

function Module01() {
  return (
    <Course
      intro={{
        explain:
          "In Python, every piece of data is an object — a number, a word, a list, even True or False. Variables are just names that point to those objects. Unlike languages like Java or C, you do not declare a type upfront. Python figures it out at runtime. This means you need to understand what type you are working with to avoid bugs — passing a string where a number is expected will not be caught until the code runs.",
        learn: [
          "Identify all 9 built-in Python types and when to use each",
          "Use f-strings to format output clearly with expressions and number formatting",
          "Understand why some types can be changed in-place (mutable) and others cannot",
          "Write functions that find variables using Python's scope (LEGB) rules",
        ],
        concepts: [
          "int and float for numbers; str for text; bool for True/False; None for no value",
          "list, dict, set, tuple are collections — each with different rules",
          "Mutable types (list, dict, set) can be modified after creation; immutable ones (str, tuple, int) cannot",
          "y = x for a list does NOT copy — both names point to the same object in memory",
        ],
        why: "Type confusion causes more beginner bugs than almost anything else. Knowing your types is the foundation every other concept in this course builds on.",
      }}
      c={T.blue}
      steps={[
        {
          title: "9 types explored",
          desc: "Python has 9 built-in types you will use constantly. A type defines what kind of data a variable holds and what operations are allowed on it. For example, you can multiply two ints but not two strings. Click each value in the explorer to see its type, properties, how it converts to other types, and the operations it supports.",
          content: () => <TypeExplorer />,
        },
        {
          title: "f-strings builder",
          desc: "An f-string (formatted string literal) lets you embed Python expressions directly inside a string. You write f\"...\" and put any variable or expression inside curly braces {}. Python evaluates the expression and inserts the result into the string. For example: name = 'Amara' then f'Hello, {name}!' produces 'Hello, Amara!'. F-strings also support number formatting like {salary:,} to add comma separators. Edit the variables on the left and watch every template update instantly.",
          content: () => <FStringBuilder />,
        },
        {
          title: "Mutable vs immutable",
          desc: "Mutable means changeable in place — a list can have items added, removed, or reordered after it is created. Immutable means the value cannot be changed — a string cannot have individual characters reassigned. This distinction matters because when you pass a mutable object to a function and modify it, the original is also changed. Understanding mutability prevents a whole class of hard-to-find bugs.",
          content: () => <MutabilityVisual />,
        },
        {
          title: "LEGB scope",
          desc: "Scope controls where Python looks for the value of a name. When you write x, Python searches four scopes in order: Local (inside the current function), Enclosing (outer function if nested), Global (module level), Built-in (Python's own names like len and print). This is called the LEGB rule. If you define x = 5 at the top of a file and also x = 10 inside a function, the function uses its own local x — the global one is untouched.",
          content: () => <ScopeVisual />,
        },
        {
          title: "Type checking",
          desc: "Checking types at runtime lets you write defensive code that handles unexpected inputs gracefully. Python provides two tools: type(x) returns the exact type of x, while isinstance(x, T) checks if x is an instance of type T or any of its subclasses. isinstance is almost always the right choice because it handles inheritance correctly — for example isinstance(True, int) returns True because bool is a subclass of int.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>
                Python is dynamically typed — variables hold references, not
                typed containers. Use{" "}
                <code style={{ color: T.cyan }}>type()</code>,{" "}
                <code style={{ color: T.cyan }}>isinstance()</code>, and
                annotations for clarity.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <PyBlock
                  label="Type checking"
                  code={`x = 42\ntype(x)              # <class 'int'>\ntype(x) == int       # True\n\n# isinstance — preferred, handles subclasses:\nisinstance(x, int)           # True\nisinstance(True, int)        # True (bool IS int)\nisinstance(x, (int, float))  # True — checks multiple\n\n# Type annotations (Python 3.5+):\ndef greet(name: str) -> str:\n    return f"Hello, {name}"\n\n# Runtime: annotations are just hints, not enforced\ngreet(42)  # works (but shouldn't)\n\n# Use dataclasses for structured data:\nfrom dataclasses import dataclass\n@dataclass\nclass Employee:\n    name: str\n    salary: float\n    active: bool = True`}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <OutBlock label="type() vs isinstance()">{`type(True) == int   → False\ntype(True) == bool  → True\n\nisinstance(True, int)   → True\nisinstance(True, bool)  → True\n\n# bool is a SUBCLASS of int\n# isinstance handles this correctly\n# type() checks exact type only`}</OutBlock>
                  <Tip icon="📏" title="WHEN TO USE EACH" c={T.blue}>
                    Use <strong>isinstance()</strong> in production code — it
                    handles inheritance. Use <strong>type(x) == T</strong> only
                    when you explicitly want to exclude subclasses.
                  </Tip>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "Using == None instead of is None",
                  wrong: `if result == None:\n    print("empty")`,
                  right: `if result is None:\n    print("empty")`,
                  why: "None is a singleton. 'is None' checks identity (same object). '== None' calls __eq__ which can be overridden. PEP 8 mandates 'is None'.",
                },
                {
                  title: "Mutable default argument",
                  wrong: `def add_tag(item, tags=[]):\n    tags.append(item)\n    return tags\n\nadd_tag("a")  # ['a']\nadd_tag("b")  # ['a', 'b'] ← shared!`,
                  right: `def add_tag(item, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(item)\n    return tags`,
                  why: "Default values are created ONCE when the function is defined, not per call. Mutable defaults (lists, dicts) persist between calls. Use None and create inside.",
                },
                {
                  title: "Modifying a list while iterating",
                  wrong: `for item in my_list:\n    if condition(item):\n        my_list.remove(item)  # skips items!`,
                  right: `my_list = [x for x in my_list\n           if not condition(x)]\n# or:\nfor item in my_list[:]:  # iterate a copy\n    if condition(item):\n        my_list.remove(item)`,
                  why: "Removing items shifts indices mid-iteration, causing items to be skipped. Use a list comprehension to create a filtered copy, or iterate over a copy with my_list[:].",
                },
                {
                  title: "Integer division vs float division",
                  wrong: `ratio = 7 / 2   # 3.5 (Python 3)\n# Expected 3? Use // instead\nwrong = 7 // 2  # 3 — this is floor division`,
                  right: `# Python 3: / always returns float\n7 / 2    # 3.5\n7 // 2   # 3  (floor division)\n7 % 2    # 1  (remainder)\ndivmod(7, 2)  # (3, 1)`,
                  why: "Python 3 made / always return float. Use // for integer division and % for the remainder. In Python 2, 7/2 returned 3 — this is a common source of bugs when migrating.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.blue}
              questions={[
                {
                  question: "What does type(True) return?",
                  options: [
                    "<class 'bool'>",
                    "<class 'int'>",
                    "<class 'boolean'>",
                    "True",
                  ],
                  correct: 0,
                  explanation:
                    "type(True) returns <class 'bool'>. But isinstance(True, int) is also True because bool is a subclass of int in Python.",
                },
                {
                  type: "output",
                  question: "What does this print?",
                  code: `print(True + True + False)`,
                  options: ["Error", "True", "2", "TrueTrue"],
                  correct: 2,
                  explanation:
                    "bool is a subclass of int. True==1, False==0. So True + True + False = 1 + 1 + 0 = 2.",
                },
                {
                  type: "bug",
                  question: "What's wrong?",
                  code: `if result == None:\n    print("missing")`,
                  options: [
                    "Should be 'result is None'",
                    "== is fine here",
                    "None should be 'null'",
                    "Missing parentheses",
                  ],
                  correct: 0,
                  explanation:
                    "Use 'is None' not '== None'. PEP 8 mandates this. 'is' checks identity (same object in memory) — since None is a singleton, 'is None' is both correct and faster.",
                },
                {
                  question: "What does 'Lagos'[-1] return?",
                  options: ["Error", "'L'", "'s'", "5"],
                  correct: 2,
                  explanation:
                    "Negative indexing counts from the end. [-1] is the last character 's'. [-2] is 'o'. Python strings support negative indexing just like lists.",
                },
                {
                  type: "output",
                  question: "What does this return?",
                  code: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)`,
                  options: ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "[4]"],
                  correct: 1,
                  explanation:
                    "y = x doesn't copy the list — both y and x point to the SAME list object in memory. Appending to y also modifies x. Use x.copy() or list(x) or x[:] to get an independent copy.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 02: LISTS & LOOPS ─────────────────────────────────────────────────
function ListOpsVisual() {
  const [items, setItems] = useState([
    "Lagos",
    "Accra",
    "Nairobi",
    "Cairo",
    "Abuja",
  ]);
  const [input, setInput] = useState("");
  const [insertAt, setInsertAt] = useState(0);
  const [sliceA, setSliceA] = useState(1);
  const [sliceB, setSliceB] = useState(4);
  const [lastOp, setLastOp] = useState(null);
  const op = (label, fn) => {
    fn();
    setLastOp(label);
  };
  const sliced = items.slice(sliceA, sliceB);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Use every button to see list operations live. The slicing section lets
        you drag start and end to highlight what Python returns.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <SL c={T.purple}>LIST — {items.length} items</SL>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              border: "1px solid rgba(192,132,252,.2)",
              borderRadius: 10,
              padding: "8px",
              minHeight: 160,
              marginBottom: 8,
            }}
          >
            {items.length === 0 && (
              <div
                style={{
                  fontSize: 10,
                  color: T.greyDark,
                  textAlign: "center",
                  padding: "20px",
                  fontFamily: "monospace",
                }}
              >
                [] — empty
              </div>
            )}
            {items.map((item, i) => (
              <div
                key={`${item}-${i}`}
                style={{
                  display: "flex",
                  gap: 6,
                  padding: "4px 6px",
                  borderRadius: 6,
                  background: "rgba(192,132,252,.07)",
                  border: "1px solid rgba(192,132,252,.14)",
                  marginBottom: 3,
                  animation: "slideIn .2s ease",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    minWidth: 22,
                  }}
                >
                  [{i}]
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: T.purple,
                    fontFamily: "monospace",
                    flex: 1,
                  }}
                >
                  "{item}"
                </span>
                <button
                  onClick={() =>
                    op(`remove [${i}]`, () =>
                      setItems((p) => p.filter((_, j) => j !== i)),
                    )
                  }
                  style={{
                    fontSize: 9,
                    color: T.red,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.5,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                input.trim() &&
                op(`append("${input.trim()}")`, () => {
                  setItems((p) => [...p, input.trim()]);
                  setInput("");
                })
              }
              placeholder="New item..."
              style={{
                flex: 1,
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid rgba(192,132,252,.3)",
                background: T.bg,
                color: T.purple,
                fontSize: 10,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
            <button
              onClick={() =>
                input.trim() &&
                op(`append("${input.trim()}")`, () => {
                  setItems((p) => [...p, input.trim()]);
                  setInput("");
                })
              }
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid rgba(192,132,252,.4)",
                background: "rgba(192,132,252,.1)",
                color: T.purple,
                fontSize: 9,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              append
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 6,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: T.greyDark,
                fontFamily: "monospace",
              }}
            >
              insert at [{insertAt}]:
            </span>
            <input
              type="range"
              min={0}
              max={items.length}
              value={insertAt}
              onChange={(e) => setInsertAt(Number(e.target.value))}
              style={{ flex: 1, accentColor: T.cyan }}
            />
            <button
              onClick={() =>
                input.trim() &&
                op(`insert(${insertAt},"${input.trim()}")`, () => {
                  setItems((p) => {
                    const n = [...p];
                    n.splice(insertAt, 0, input.trim());
                    return n;
                  });
                  setInput("");
                })
              }
              style={{
                padding: "4px 9px",
                borderRadius: 6,
                border: "1px solid rgba(34,211,238,.4)",
                background: "rgba(34,211,238,.08)",
                color: T.cyan,
                fontSize: 9,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              insert()
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              marginBottom: 5,
            }}
          >
            {[
              [".sort()", "asc", T.green, () => setItems((p) => [...p].sort())],
              [
                ".sort(rev)",
                "desc",
                T.yellow,
                () => setItems((p) => [...p].sort().reverse()),
              ],
              [
                ".reverse()",
                "flip",
                T.orange,
                () => setItems((p) => [...p].reverse()),
              ],
              [
                ".pop()",
                "remove last",
                T.red,
                () =>
                  setItems((p) => {
                    const n = [...p];
                    n.pop();
                    return n;
                  }),
              ],
              [
                ".pop(0)",
                "remove first",
                T.pink,
                () => setItems((p) => p.slice(1)),
              ],
              [".clear()", "empty", T.red, () => setItems([])],
            ].map(([op2, lbl, c, fn]) => (
              <button
                key={lbl}
                onClick={() => op(op2, fn)}
                style={{
                  padding: "5px",
                  borderRadius: 7,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  border: `1px solid ${c}44`,
                  background: `${c}0c`,
                  color: c,
                }}
              >
                {op2}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setItems(["Lagos", "Accra", "Nairobi", "Cairo", "Abuja"]);
              setLastOp(null);
            }}
            style={{
              width: "100%",
              padding: "4px",
              borderRadius: 6,
              border: `1px solid ${T.slate}`,
              background: "transparent",
              color: T.greyDark,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            ↩ Reset
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lastOp && (
            <div style={{ animation: "popIn .2s ease" }}>
              <SL c={T.green}>LAST OP</SL>
              <PyBlock
                code={`cities.${lastOp}\n# → ${JSON.stringify(items)}`}
              />
            </div>
          )}
          <div>
            <SL c={T.blue}>
              SLICING — [{sliceA}:{sliceB}]
            </SL>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}
                >
                  start [{sliceA}]
                </div>
                <input
                  type="range"
                  min={0}
                  max={items.length}
                  value={sliceA}
                  onChange={(e) => setSliceA(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.blue }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}
                >
                  stop [{sliceB}]
                </div>
                <input
                  type="range"
                  min={0}
                  max={items.length}
                  value={sliceB}
                  onChange={(e) => setSliceB(Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.cyan }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              {items.map((item, i) => (
                <span
                  key={i}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 5,
                    fontSize: 9,
                    fontFamily: "monospace",
                    border: `1px solid ${i >= sliceA && i < sliceB ? "rgba(96,165,250,.5)" : "rgba(255,255,255,.06)"}`,
                    background:
                      i >= sliceA && i < sliceB
                        ? "rgba(96,165,250,.14)"
                        : "transparent",
                    color: i >= sliceA && i < sliceB ? T.blue : T.greyDark,
                    transition: "all .2s",
                  }}
                >
                  [{i}]"{item}"
                </span>
              ))}
            </div>
            <PyBlock
              code={`cities[${sliceA}:${sliceB}]\n# ${JSON.stringify(sliced)}\n\n# Negative indexing:\ncities[-1]   # last → "${items[items.length - 1] || "?"}"\ncities[-3:]  # last 3\ncities[::-1] # reversed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoopVisual() {
  const [items] = useState(["Lagos", "Accra", "Nairobi", "Cairo", "Abuja"]);
  const [mode, setMode] = useState("for");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const [condition, setCondition] = useState(5);
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(-1);
    setRunning(true);
    let i = -1;
    timer.current = setInterval(() => {
      i++;
      setStep(i);
      if (i >= items.length - 1) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 600);
  };
  const MODES = {
    for: {
      code: `for city in cities:\n    print(city)`,
      rows: items.map((c) => c),
    },
    enumerate: {
      code: `for i, city in enumerate(cities):\n    print(f"{i}: {city}")`,
      rows: items.map((c, i) => `${i}: ${c}`),
    },
    zip: {
      code: `salaries = [85000,72000,91000,68000,75000]\nfor city, sal in zip(cities, salaries):\n    print(f"{city}: {sal:,}")`,
      rows: items.map(
        (c, i) =>
          `${c}: ${[85000, 72000, 91000, 68000, 75000][i].toLocaleString()}`,
      ),
    },
    while: {
      code: `i = 0\nwhile i < len(cities):\n    print(cities[i])\n    i += 1`,
      rows: items.map((c) => c),
    },
    comprehension: {
      code: `upper = [c.upper() for c in cities\n         if len(c) > 4]\n# ${JSON.stringify(items.filter((c) => c.length > 4).map((c) => c.toUpperCase()))}`,
      rows: items
        .map((c) => (c.length > 4 ? `"${c}" → "${c.toUpperCase()}"` : null))
        .filter(Boolean),
    },
  };
  const m = MODES[mode];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">
        Pick a loop type, then click Animate to step through each iteration.
        Completed rows turn green.
      </Hint>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Object.keys(MODES).map((k) => (
          <button
            key={k}
            onClick={() => {
              setMode(k);
              setStep(-1);
              setRunning(false);
              if (timer.current) clearInterval(timer.current);
            }}
            style={{
              padding: "5px 11px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${mode === k ? T.cyan : "rgba(255,255,255,.08)"}`,
              background: mode === k ? "rgba(34,211,238,.12)" : "transparent",
              color: mode === k ? T.cyan : T.grey,
              fontWeight: mode === k ? 700 : 400,
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <PyBlock code={m.code} label="Python" />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={play}
              disabled={running}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 10,
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
                border: "1px solid rgba(34,211,238,.4)",
                background: running ? "transparent" : "rgba(34,211,238,.12)",
                color: running ? T.grey : T.cyan,
              }}
            >
              {running ? "⚙️ Running..." : "▶ Animate"}
            </button>
            <button
              onClick={() => {
                if (timer.current) clearInterval(timer.current);
                setStep(-1);
                setRunning(false);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "monospace",
                border: `1px solid ${T.slate}`,
                background: "transparent",
                color: T.grey,
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div>
          <SL c={T.cyan}>ITERATIONS</SL>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              borderRadius: 10,
              border: "1px solid rgba(34,211,238,.15)",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {m.rows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "5px 8px",
                  borderRadius: 6,
                  background:
                    step === i
                      ? "rgba(34,211,238,.14)"
                      : step > i
                        ? "rgba(74,222,128,.06)"
                        : "transparent",
                  border: `1px solid ${step === i ? "rgba(34,211,238,.4)" : step > i ? "rgba(74,222,128,.2)" : "transparent"}`,
                  transition: "all .2s",
                  animation: step === i ? "glow .6s ease" : "none",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    minWidth: 18,
                    flexShrink: 0,
                  }}
                >
                  #{i}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color:
                      step === i ? T.cyan : step > i ? T.green : T.greyLight,
                    fontWeight: step === i ? 700 : 400,
                    flex: 1,
                    transition: "color .2s",
                  }}
                >
                  {row}
                </span>
                {step === i && (
                  <span style={{ fontSize: 8, color: T.cyan }}>← now</span>
                )}
                {step > i && (
                  <span style={{ fontSize: 8, color: T.green }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComprehensionBuilder() {
  const DATA = [...DF_EMPLOYEES];
  const [expr, setExpr] = useState("e['salary']");
  const [cond, setCond] = useState("e['salary'] > 75000");
  const [useCond, setUseCond] = useState(true);
  let result = [],
    error = null;
  try {
    result = DATA.filter((e) =>
      useCond ? eval(cond.replace(/e\[/g, "e[").replace(/'/g, "'")) : true,
    ).map((e) => eval(expr.replace(/e\[/g, "e[").replace(/'/g, "'")));
  } catch (err) {
    error = err.message;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Edit the expression and (optional) condition. The comprehension
        evaluates live against the real employee data.
      </Hint>
      <div
        style={{
          background: `${T.purple}09`,
          border: `1px solid ${T.purple}28`,
          borderRadius: 12,
          padding: "14px",
        }}
      >
        <SL c={T.purple}>BUILD YOUR COMPREHENSION</SL>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
          }}
        >
          <span style={{ color: T.greyDark }}>[</span>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            style={{
              padding: "4px 9px",
              borderRadius: 6,
              border: `1px solid ${T.green}44`,
              background: T.bg,
              color: T.green,
              fontSize: 11,
              fontFamily: "monospace",
              width: 160,
              outline: "none",
            }}
          />
          <span style={{ color: T.purple, fontWeight: 700 }}>
            for e in employees
          </span>
          {useCond && (
            <>
              <span style={{ color: T.purple, fontWeight: 700 }}>if</span>
              <input
                value={cond}
                onChange={(e) => setCond(e.target.value)}
                style={{
                  padding: "4px 9px",
                  borderRadius: 6,
                  border: `1px solid ${T.yellow}44`,
                  background: T.bg,
                  color: T.yellow,
                  fontSize: 11,
                  fontFamily: "monospace",
                  width: 190,
                  outline: "none",
                }}
              />
            </>
          )}
          <span style={{ color: T.greyDark }}>]</span>
          <button
            onClick={() => setUseCond(!useCond)}
            style={{
              padding: "3px 9px",
              borderRadius: 6,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${T.cyan}44`,
              background: "transparent",
              color: T.cyan,
            }}
          >
            {useCond ? "remove if" : "+ add if"}
          </button>
        </div>
      </div>
      {error ? (
        <OutBlock err>{error}</OutBlock>
      ) : (
        <div>
          <SL c={T.green}>RESULT — {result.length} items</SL>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              border: "1px solid rgba(74,222,128,.2)",
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <pre
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: T.green,
                lineHeight: 1.7,
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Names of active staff", "e['name']", "e['active']"],
          ["Salaries > 80k", "e['salary']", "e['salary'] > 80000"],
          ["Depts of engineers", "e['dept']", "e['dept'] == 'Engineering'"],
          ["Scores, no nulls", "e['score']", "e['score'] is not None"],
        ].map(([label, ex, co]) => (
          <button
            key={label}
            onClick={() => {
              setExpr(ex);
              setCond(co);
              setUseCond(true);
            }}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
              textAlign: "left",
              border: `1px solid ${T.slate}`,
              background: "rgba(255,255,255,.02)",
              color: T.greyLight,
            }}
          >
            <div style={{ color: T.purple, fontWeight: 700, marginBottom: 2 }}>
              {label}
            </div>
            <code style={{ color: T.grey }}>
              [{ex} for e in ... if {co}]
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}

function Module02() {
  return (
    <Course
      intro={{
        explain:
          "A list is an ordered, changeable collection of items. It can hold any mix of data types and you can add, remove, sort, or rearrange its contents at any time. Loops let you process each item in a collection one by one. Together, lists and loops form the backbone of almost all data processing: reading through rows, filtering results, transforming values, and building summaries.",
        learn: [
          "Add, remove, sort, slice, and index items in a list",
          "Use for, while, enumerate, and zip in the right situations",
          "Write list comprehensions to filter or transform a list in one readable line",
          "Understand why zip(), map(), and filter() return lazy iterators, not lists",
        ],
        concepts: [
          "Lists use zero-based indexing: list[0] is first, list[-1] is the last item",
          "Slicing list[a:b] returns from index a up to but not including b",
          "[expr for item in iterable if cond] is a list comprehension — equivalent to a for loop with append",
          "enumerate() gives both index and value — cleaner than range(len(list))",
        ],
        why: "In data work you loop through rows, filter records, and build transformed lists constantly. Comprehensions appear in nearly every pandas codebase and reduce multi-line loops to one clear expression.",
      }}
      c={T.purple}
      steps={[
        {
          title: "List operations",
          desc: "A list is created with square brackets: cities = ['Lagos', 'Accra']. Python gives you a rich set of built-in methods to modify it. .append(x) adds x to the end. .insert(i, x) adds x at position i. .pop() removes and returns the last item. .sort() reorders in place. .reverse() flips the order. Slicing with list[a:b] returns a new list from index a up to (not including) b. All of these run in place on the same list — they do not create a new one.",
          content: () => <ListOpsVisual />,
        },
        {
          title: "Loops animator",
          desc: "A for loop iterates over every item in a sequence one by one. for city in cities: gives you each city in turn. enumerate(cities) gives both the index and the value — use this instead of range(len(cities)) whenever you need the position. zip(list1, list2) pairs up items from two lists simultaneously. A while loop keeps running as long as a condition is True — useful when you do not know in advance how many iterations you need. Hit Animate to watch Python step through each iteration.",
          content: () => <LoopVisual />,
        },
        {
          title: "Comprehension builder",
          desc: "A list comprehension is a compact way to build a list from another sequence, optionally filtering items. The pattern is: [expression for item in iterable if condition]. It is equivalent to writing a for loop with an if statement and .append(), but in one readable line. For example: [e['name'] for e in employees if e['salary'] > 75000] builds a list of names for high earners. Edit the expression and condition below — they evaluate live against real employee data.",
          content: () => <ComprehensionBuilder />,
        },
        {
          title: "zip & enumerate",
          desc: "enumerate() and zip() are two of the most useful built-in functions for loops. enumerate(iterable, start=0) adds a counter to any iterable so you get both the index and the value without using range(len()). zip(list1, list2) pairs items from multiple iterables together — on each iteration you get one item from each. zip stops at the shorter list; use itertools.zip_longest to include all items from longer lists.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.purple}>
                Two of the most useful built-ins for loops.{" "}
                <code style={{ color: T.cyan }}>enumerate()</code> gives index +
                value. <code style={{ color: T.cyan }}>zip()</code> pairs
                multiple iterables.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <SL>enumerate()</SL>
                  <PyBlock
                    code={`cities = ["Lagos", "Accra", "Nairobi"]\n\n# Without enumerate (bad):\nfor i in range(len(cities)):\n    print(i, cities[i])\n\n# With enumerate (Pythonic):\nfor i, city in enumerate(cities):\n    print(i, city)\n\n# Start from 1:\nfor i, city in enumerate(cities, start=1):\n    print(f"{i}. {city}")\n\n# Output:\n# 1. Lagos\n# 2. Accra\n# 3. Nairobi`}
                  />
                </div>
                <div>
                  <SL>zip()</SL>
                  <PyBlock
                    code={`cities  = ["Lagos", "Accra", "Nairobi"]\ncountry = ["Nigeria", "Ghana", "Kenya"]\npop_m   = [15.3, 2.3, 4.4]\n\nfor city, country, pop in zip(cities, country, pop_m):\n    print(f"{city} ({country}): {pop}M")\n\n# zip stops at shortest:\nlist(zip([1,2,3], ["a","b"]))  # [(1,'a'),(2,'b')]\n\n# Use zip_longest for full length:\nfrom itertools import zip_longest\nlist(zip_longest([1,2,3], ["a","b"], fillvalue=None))\n# [(1,'a'),(2,'b'),(3,None)]`}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "range(len(list)) instead of enumerate",
                  wrong: `cities = ["Lagos", "Accra"]\nfor i in range(len(cities)):\n    print(i, cities[i])`,
                  right: `for i, city in enumerate(cities):\n    print(i, city)`,
                  why: "range(len()) is verbose and error-prone. enumerate() is idiomatic Python — it's cleaner, faster, and harder to get wrong.",
                },
                {
                  title: "Forgetting list() on zip/map/filter",
                  wrong: `result = zip(names, salaries)\nprint(result)  # <zip object at 0x...>\n\nfirst = result[0]  # TypeError!`,
                  right: `result = list(zip(names, salaries))\nprint(result)  # [('Amara', 85000), ...]\n\n# or iterate directly:\nfor name, sal in zip(names, salaries):\n    print(name, sal)`,
                  why: "zip(), map(), filter() return lazy iterators — not lists. You can only iterate them ONCE. Wrap in list() if you need to index, reuse, or measure length.",
                },
                {
                  title: "Nesting comprehensions too deeply",
                  wrong: `result = [[cell for cell in row]\n          for row in matrix\n          if sum(row) > 10\n          if all(c > 0 for c in row)]`,
                  right: `# Break it into steps:\nvalid_rows = [row for row in matrix\n              if sum(row) > 10 and all(c > 0 for c in row)]\nresult = [[cell for cell in row] for row in valid_rows]`,
                  why: "Comprehensions with 2+ conditions and a nested expression become hard to read and debug. Readability matters. A for loop or intermediate variable is cleaner.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.purple}
              questions={[
                {
                  type: "output",
                  question: "What does this print?",
                  code: `print(list(zip([1,2,3], ['a','b'])))`,
                  options: [
                    "[(1,'a'),(2,'b'),(3,None)]",
                    "[(1,'a'),(2,'b')]",
                    "Error",
                    "[(1,'a'),(2,'b'),(3,'')]",
                  ],
                  correct: 1,
                  explanation:
                    "zip() stops at the shortest iterable. [1,2,3] has 3 items but ['a','b'] only has 2, so zip produces only 2 pairs. Use itertools.zip_longest() to include all items with a fill value.",
                },
                {
                  type: "bug",
                  question: "This list comprehension has a bug:",
                  code: `evens = [x for x in range(10) if x % 2 = 0]`,
                  options: [
                    "range(10) should be range(1,11)",
                    "= is assignment; == is comparison",
                    "Missing return keyword",
                    "x % 2 doesn't work for even numbers",
                  ],
                  correct: 1,
                  explanation:
                    "= is assignment (SyntaxError inside an expression). Use == for comparison. The correct code is: [x for x in range(10) if x % 2 == 0].",
                },
                {
                  question:
                    "What does cities[-2:] return if cities = ['Lagos','Accra','Nairobi','Cairo']?",
                  options: [
                    "['Lagos','Accra']",
                    "['Nairobi','Cairo']",
                    "['Cairo']",
                    "Error",
                  ],
                  correct: 1,
                  explanation:
                    "Negative slicing: [-2:] starts 2 from the end and goes to the end. So ['Nairobi', 'Cairo']. [-2] alone returns just 'Nairobi'.",
                },
                {
                  type: "output",
                  question: "What prints?",
                  code: `for i, v in enumerate(['a','b','c'], start=1):\n    print(i, v)\n# What is the first line printed?`,
                  options: ["0 a", "1 a", "(1, 'a')", "a 1"],
                  correct: 1,
                  explanation:
                    "enumerate(iterable, start=1) starts the counter at 1 instead of 0. The format is 'i v' so it prints '1 a' on the first iteration.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 03: DICTIONARIES ─────────────────────────────────────────────────
function DictExplorer() {
  const [d, setD] = useState({
    name: "Amara Osei",
    dept: "Engineering",
    salary: 85000,
    active: true,
    score: null,
  });
  const [k, setK] = useState("");
  const [v, setV] = useState("");
  const [lk, setLk] = useState("");
  const [lr, setLr] = useState(null);
  const [lastOp, setLastOp] = useState(null);
  const parseVal = (s) =>
    s === "true"
      ? true
      : s === "false"
        ? false
        : s === "None" || s === "null"
          ? null
          : !isNaN(s) && s !== ""
            ? Number(s)
            : s;
  const add = () => {
    if (k.trim()) {
      const n = { ...d, [k.trim()]: parseVal(v) };
      setD(n);
      setLastOp(`d["${k.trim()}"] = ${v}`);
      setK("");
      setV("");
    }
  };
  const del = (key) => {
    const n = { ...d };
    delete n[key];
    setD(n);
    setLastOp(`del d["${key}"]`);
  };
  const lookup = () => {
    if (lk.trim()) {
      setLr(
        lk.trim() in d ? { found: true, val: d[lk.trim()] } : { found: false },
      );
      setLastOp(`d.get("${lk.trim()}")`);
    }
  };
  const tc = (v) =>
    v === null
      ? T.red
      : typeof v === "boolean"
        ? T.yellow
        : typeof v === "number"
          ? T.orange
          : T.green;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Add key-value pairs, delete keys, or look up a key safely with .get().
        Watch the dict and Python code update in real time.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div
            style={{
              border: "1px solid rgba(251,146,60,.3)",
              borderRadius: 10,
              background: "rgba(251,146,60,.04)",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                padding: "7px 12px",
                borderBottom: "1px solid rgba(251,146,60,.2)",
                fontSize: 9,
                color: T.orange,
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              🗂️ dict ({Object.keys(d).length} keys)
            </div>
            {Object.entries(d).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr auto",
                  padding: "6px 12px",
                  borderBottom: `1px solid ${T.slate}22`,
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <code
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: T.cyan,
                  }}
                >
                  "{key}"
                </code>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <code
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: tc(val),
                      fontWeight: 700,
                    }}
                  >
                    {val === null
                      ? "None"
                      : typeof val === "string"
                        ? `"${val}"`
                        : String(val)}
                  </code>
                  <Tag
                    c={
                      typeof val === "object" && val === null ? T.red : tc(val)
                    }
                  >
                    {val === null ? "NoneType" : typeof val}
                  </Tag>
                </div>
                <button
                  onClick={() => del(key)}
                  style={{
                    fontSize: 9,
                    color: T.red,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.5,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                value={k}
                onChange={(e) => setK(e.target.value)}
                placeholder="key (str)"
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(34,211,238,.3)",
                  background: T.bg,
                  color: T.cyan,
                  fontSize: 10,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
              <span
                style={{ color: T.greyDark, fontSize: 16, alignSelf: "center" }}
              >
                :
              </span>
              <input
                value={v}
                onChange={(e) => setV(e.target.value)}
                placeholder="value"
                style={{
                  flex: 1.2,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(251,146,60,.3)",
                  background: T.bg,
                  color: T.orange,
                  fontSize: 10,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
              <button
                onClick={add}
                style={{
                  padding: "5px 9px",
                  borderRadius: 6,
                  border: "1px solid rgba(251,146,60,.4)",
                  background: "rgba(251,146,60,.1)",
                  color: T.orange,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                add
              </button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                value={lk}
                onChange={(e) => setLk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
                placeholder="lookup key..."
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(192,132,252,.3)",
                  background: T.bg,
                  color: T.purple,
                  fontSize: 10,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
              <button
                onClick={lookup}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(192,132,252,.4)",
                  background: "rgba(192,132,252,.1)",
                  color: T.purple,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                d.get()
              </button>
            </div>
            {lr !== null && (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 7,
                  background: lr.found
                    ? "rgba(74,222,128,.08)"
                    : "rgba(248,113,113,.08)",
                  border: `1px solid ${lr.found ? T.green : T.red}33`,
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: lr.found ? T.green : T.red,
                  animation: "popIn .2s ease",
                }}
              >
                {lr.found
                  ? `✓ d["${lk}"] = ${JSON.stringify(lr.val)}`
                  : `✗ "${lk}" not found → None (no KeyError)`}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lastOp && (
            <div style={{ animation: "popIn .2s ease" }}>
              <SL c={T.green}>LAST OP</SL>
              <PyBlock code={lastOp} />
            </div>
          )}
          <PyBlock
            label="Iterating a dict"
            code={`emp = ${JSON.stringify(d, null, 2)}\n\n# Keys only:\nfor key in emp:\n    print(key)\n\n# Values only:\nfor val in emp.values():\n    print(val)\n\n# Both (most common):\nfor key, val in emp.items():\n    print(f"{key}: {val}")`}
          />
        </div>
      </div>
    </div>
  );
}

function DictPatternsVisual() {
  const [pattern, setPattern] = useState("comprehension");
  const PATTERNS = {
    comprehension: {
      label: "Dict comprehension",
      code: `employees = [{"name":"Amara","salary":85000},{"name":"Bola","salary":72000},...]\n\n# Map name → salary:\nsal_map = {e["name"]: e["salary"] for e in employees}\n# {"Amara Osei": 85000, "Bola Adeyemi": 72000, ...}\n\n# Filter AND transform:\nhigh_earners = {\n    e["name"]: e["salary"]\n    for e in employees\n    if e["salary"] > 80000\n}\n\n# Invert a dict:\noriginal = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in original.items()}\n# {1: "a", 2: "b", 3: "c"}`,
      result: "sal_map = {name: salary for each employee}",
    },
    defaultdict: {
      label: "defaultdict",
      code: `from collections import defaultdict\n\n# Group employees by department:\nby_dept = defaultdict(list)\nfor emp in employees:\n    by_dept[emp["dept"]].append(emp["name"])\n\n# {"Engineering": ["Amara","Chidi","Funke","Ifeoma"],\n#  "Analytics":   ["Bola","Efe","Henry"],\n#  "Product":     ["Dami","Grace","Jide"]}\n\n# defaultdict(int) — counting:\nword_count = defaultdict(int)\nfor word in text.split():\n    word_count[word] += 1  # no KeyError on first access!`,
      result:
        "by_dept = defaultdict(list) — group without checking if key exists",
    },
    counter: {
      label: "Counter",
      code: `from collections import Counter\n\ndepts = [e["dept"] for e in employees]\ncounts = Counter(depts)\n# Counter({"Engineering":4, "Analytics":3, "Product":3})\n\ncounts.most_common(2)  # [("Engineering",4), ...]\ncounts["Engineering"]   # 4\ncounts["Unknown"]       # 0 (no KeyError!)\n\n# Count words:\ntext = "data engineering data analytics data"\nCounter(text.split())\n# Counter({"data":3, "engineering":1, "analytics":1})`,
      result: "Counter — automatic counting, most_common(), no KeyError",
    },
    merge: {
      label: "Merge dicts",
      code: `defaults = {"active": True, "score": None, "region": "WA"}\noverride = {"name": "Amara", "score": 88.5}\n\n# Python 3.9+ — | operator:\nmerged = defaults | override\n# {"active":True, "score":88.5, "region":"WA", "name":"Amara"}\n\n# Earlier Python — ** unpacking:\nmerged = {**defaults, **override}\n\n# In-place update:\ndefaults.update(override)  # modifies defaults\n\n# Dict.get() with default:\nval = d.get("missing_key", "default_value")`,
      result: "| operator (3.9+) or {**a, **b} to merge dicts",
    },
  };
  const p = PATTERNS[pattern];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>
        Click a pattern to see the full code. These cover 80% of dict usage in
        real data work.
      </Hint>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {Object.entries(PATTERNS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setPattern(k)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${pattern === k ? T.orange : "rgba(255,255,255,.08)"}`,
              background:
                pattern === k
                  ? "rgba(251,146,60,.12)"
                  : "rgba(255,255,255,.02)",
              color: pattern === k ? T.orange : T.grey,
              fontWeight: pattern === k ? 700 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: `${T.orange}09`,
          border: `1px solid ${T.orange}25`,
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: 11,
          color: T.greyLight,
        }}
      >
        <strong style={{ color: T.orange }}>{p.label}:</strong> {p.result}
      </div>
      <PyBlock code={p.code} label="Python" />
    </div>
  );
}

function Module03() {
  return (
    <Course
      intro={{
        explain:
          "A dictionary stores data as key-value pairs — like a real dictionary where you look up a word (key) and get its definition (value). Lookup is instant regardless of how many items are stored, because Python uses a hash table under the hood. In data work, dicts appear everywhere: JSON API responses are dicts, grouping records produces dicts, and mapping one set of values to another is done with dicts.",
        learn: [
          "Create, read, update, and delete dictionary entries",
          "Use .get() to safely access a key that might not exist",
          "Use dict comprehensions, defaultdict, and Counter for grouping and counting",
          "Navigate and flatten nested dicts from real-world API responses",
        ],
        concepts: [
          "d['key'] raises KeyError if missing; d.get('key', default) returns the default instead",
          "Keys must be hashable — strings, ints, and tuples work; lists do not",
          "Iterate with d.items() to get both key and value at once in a for loop",
          "defaultdict(list) creates an empty list automatically for new keys — great for grouping",
        ],
        why: "JSON APIs return dicts. Pandas groupby produces dicts. Counting, grouping, and mapping values all rely on dicts. Understanding them deeply is what makes the jump from beginner to practitioner.",
      }}
      c={T.orange}
      steps={[
        {
          title: "Dict explorer",
          desc: "A dictionary is created with curly braces: emp = {'name': 'Amara', 'salary': 85000}. You read values with emp['name'] or safely with emp.get('name', default). You add or update a key with emp['dept'] = 'Engineering'. You delete a key with del emp['dept'] or emp.pop('dept'). You iterate over keys with for k in emp, over values with emp.values(), or over both with emp.items(). Add, remove, and look up keys in the explorer below to see the live Python code.",
          content: () => <DictExplorer />,
        },
        {
          title: "Power patterns",
          desc: "Four patterns cover almost all advanced dict usage in data work. A dict comprehension builds a dict from an iterable in one line: {key: value for item in iterable}. defaultdict from the collections module creates a default value automatically for any missing key — perfect for grouping. Counter counts occurrences automatically and has useful methods like .most_common(). The | operator (Python 3.9+) or {**d1, **d2} merges two dicts, with the right dict overriding duplicates.",
          content: () => <DictPatternsVisual />,
        },
        {
          title: "Nested dicts",
          desc: "Nested dicts are dicts that contain other dicts as values. JSON API responses almost always look like this. You navigate them by chaining bracket lookups: data['employee']['address']['city']. The safe way to navigate potentially missing keys is to chain .get() calls: data.get('employee', {}).get('address', {}).get('city'). .setdefault(key, default) adds the key with a default value if it does not exist, and returns the value — useful for building nested structures incrementally.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.orange}>
                Real-world data (APIs, JSON, configs) is almost always nested.
                Know how to traverse, update, and flatten.
              </Note>
              <PyBlock
                label="Nested dicts"
                code={`# API-style nested response:\nemployee = {\n    "id": 1,\n    "name": "Amara Osei",\n    "contact": {\n        "email": "amara@company.com",\n        "phone": "+234-800-0000"\n    },\n    "role": {\n        "title": "Senior Engineer",\n        "dept": "Engineering",\n        "reports_to": {"id": 5, "name": "Manager"}\n    }\n}\n\n# Safe deep access:\nemail = employee["contact"]["email"]\ntitle = employee.get("role", {}).get("title", "Unknown")\n\n# Update nested:\nemployee["contact"]["phone"] = "+234-900-0000"\n\n# Flatten with dict comprehension:\nflat = {f"{k}_{ik}": iv\n        for k, outer in employee.items()\n        if isinstance(outer, dict)\n        for ik, iv in outer.items()}\n\n# setdefault — add if missing:\nemployee.setdefault("tags", []).append("senior")`}
              />
              <Warn>
                Deep nesting (&gt;3 levels) is a code smell. Consider flattening
                or using dataclasses for complex structures.
              </Warn>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "KeyError on missing key — use .get()",
                  wrong: `# Direct access raises KeyError:\nval = d["missing_key"]  # KeyError!`,
                  right: `# .get() returns None or your default:\nval = d.get("missing_key")         # None\nval = d.get("missing_key", 0)      # 0\nval = d.get("missing_key", [])     # []`,
                  why: ".get() is safe — it returns None (or a default) instead of raising KeyError. Use it whenever a key might not exist, which is almost always in real-world data.",
                },
                {
                  title: "Using a list as a dict key",
                  wrong: `# Lists are not hashable:\nd = {[1,2,3]: "value"}  # TypeError: unhashable type: 'list'`,
                  right: `# Use a tuple instead:\nd = {(1,2,3): "value"}  # ✓ tuples are hashable\n\n# Or convert to string:\nd = {str([1,2,3]): "value"}`,
                  why: "Dict keys must be hashable (immutable). Lists are mutable and unhashable. Use tuples, strings, ints, or frozensets as keys.",
                },
                {
                  title: "Modifying a dict while iterating",
                  wrong: `for key in my_dict:\n    if some_condition(key):\n        del my_dict[key]  # RuntimeError!`,
                  right: `# Iterate over a copy of keys:\nfor key in list(my_dict.keys()):\n    if some_condition(key):\n        del my_dict[key]\n\n# Or build a new dict:\nmy_dict = {k: v for k, v in my_dict.items()\n           if not some_condition(k)}`,
                  why: "Modifying a dict while iterating it raises RuntimeError. Create a list of keys first with list(d.keys()), or build a new dict with a comprehension.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.orange}
              questions={[
                {
                  question:
                    "What does d.get('missing', 'default') return if 'missing' isn't in d?",
                  options: ["KeyError", "None", "'default'", "False"],
                  correct: 2,
                  explanation:
                    ".get(key, default) returns the default value (second argument) if the key doesn't exist. Without a default, it returns None. This is much safer than d['key'] which raises KeyError.",
                },
                {
                  type: "output",
                  question: "What does this print?",
                  code: `from collections import Counter\nc = Counter("banana")\nprint(c["z"])`,
                  options: ["KeyError", "None", "0", "1"],
                  correct: 2,
                  explanation:
                    "Counter subclasses dict but returns 0 for missing keys instead of raising KeyError. This makes it safe to count things without checking if the key exists first.",
                },
                {
                  type: "bug",
                  question: "What's wrong with this grouping code?",
                  code: `by_dept = {}\nfor emp in employees:\n    by_dept[emp["dept"]].append(emp["name"])`,
                  options: [
                    ".append() doesn't work on dict values",
                    "First time accessing a new dept, the key doesn't exist — KeyError",
                    "Should iterate over dept keys",
                    "employees should be a dict",
                  ],
                  correct: 1,
                  explanation:
                    "On the first encounter of a department, by_dept[emp['dept']] raises KeyError because the key doesn't exist yet. Fix: use defaultdict(list), or add by_dept.setdefault(emp['dept'], []).append(emp['name']).",
                },
                {
                  question: "How do you merge two dicts in Python 3.9+?",
                  options: [
                    "{**d1, **d2}",
                    "d1.merge(d2)",
                    "d1 | d2",
                    "d1 + d2",
                  ],
                  correct: 2,
                  explanation:
                    "Python 3.9 introduced the | operator for merging dicts. d1 | d2 creates a new dict with d2's values overriding d1's. For in-place merging, use |=. Before 3.9, use {**d1, **d2}.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 04: FUNCTIONS ─────────────────────────────────────────────────────
function FunctionPipeline() {
  const [salary, setSalary] = useState(85000);
  const classify = (s) =>
    s >= 90000
      ? "Senior"
      : s >= 75000
        ? "Mid-level"
        : s >= 65000
          ? "Junior"
          : "Trainee";
  const result = classify(salary);
  const resC = {
    Senior: T.green,
    "Mid-level": T.blue,
    Junior: T.yellow,
    Trainee: T.orange,
  }[result];
  const conditions = [
    {
      cond: "salary >= 90000",
      pass: salary >= 90000,
      ret: "Senior",
      c: T.green,
    },
    {
      cond: "salary >= 75000",
      pass: salary >= 75000 && salary < 90000,
      ret: "Mid-level",
      c: T.blue,
    },
    {
      cond: "salary >= 65000",
      pass: salary >= 65000 && salary < 75000,
      ret: "Junior",
      c: T.yellow,
    },
    { cond: "else", pass: salary < 65000, ret: "Trainee", c: T.orange },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="🎛️">
        Drag the salary slider. The trace shows each condition evaluated top to
        bottom — the first True wins.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PyBlock
            code={`def classify_salary(salary):\n    if salary >= 90000:\n        return "Senior"\n    elif salary >= 75000:\n        return "Mid-level"\n    elif salary >= 65000:\n        return "Junior"\n    else:\n        return "Trainee"`}
          />
          <div>
            <SL c={T.purple}>Input: salary</SL>
            <input
              type="range"
              min={40000}
              max={105000}
              step={1000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              style={{ width: "100%", accentColor: T.purple, marginBottom: 4 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                fontFamily: "monospace",
                color: T.greyDark,
              }}
            >
              <span>40k</span>
              <span style={{ color: T.purple, fontWeight: 700 }}>
                {salary.toLocaleString()}
              </span>
              <span>105k</span>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              border: `1px solid ${resC}44`,
              borderRadius: 10,
              background: `${resC}09`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: T.greyDark,
                fontFamily: "monospace",
                marginBottom: 4,
              }}
            >
              classify_salary({salary.toLocaleString()}) →
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: resC,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              "{result}"
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.purple}>CONDITION TRACE</SL>
          {conditions.map((c, i) => {
            const tested =
              i === 0 || conditions.slice(0, i).every((x) => !x.pass);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "7px 10px",
                  borderRadius: 7,
                  border: `1px solid ${c.pass ? c.c : T.slate}`,
                  background: c.pass ? `${c.c}12` : "rgba(255,255,255,.02)",
                  opacity: !tested && !c.pass ? 0.25 : 1,
                  transition: "all .25s",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.pass ? c.c : tested ? T.red : T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  {c.pass ? "✓" : tested ? "✗" : "·"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: T.greyLight,
                    flex: 1,
                  }}
                >
                  {c.cond}
                </span>
                {c.pass && (
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: c.c,
                      fontWeight: 700,
                    }}
                  >
                    → "{c.ret}"
                  </span>
                )}
              </div>
            );
          })}
          <SL c={T.greyDark} style={{ marginTop: 8 }}>
            APPLY TO ALL EMPLOYEES
          </SL>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {DF_EMPLOYEES.slice(0, 7).map((emp, i) => {
              const r = classify(emp.salary);
              const rc = {
                Senior: T.green,
                "Mid-level": T.blue,
                Junior: T.yellow,
                Trainee: T.orange,
              }[r];
              return (
                <div
                  key={emp.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1fr 1fr",
                    padding: "5px 10px",
                    borderBottom: i < 6 ? `1px solid ${T.slate}33` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: T.greyLight,
                    }}
                  >
                    {emp.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: T.greyDark,
                    }}
                  >
                    {emp.salary.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: rc,
                      fontWeight: 700,
                    }}
                  >
                    {r}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArgsKwargsVisual() {
  const [mode, setMode] = useState("positional");
  const MODES = {
    positional: {
      label: "Positional",
      code: `def greet(name, greeting, punct):\n    return f"{greeting}, {name}{punct}"\n\ngreet("Amara", "Hello", "!")  # positional\n# "Hello, Amara!"\n\ngreet("Hello", "Amara", "!")  # wrong order!\n# "Amara, Hello!" ← swapped meaning`,
      result: '"Hello, Amara!"',
    },
    keyword: {
      label: "Keyword",
      code: `def greet(name, greeting="Hello", punct="!"):\n    return f"{greeting}, {name}{punct}"\n\ngreet("Amara")                    # "Hello, Amara!"\ngreet("Amara", greeting="Hey")    # "Hey, Amara!"\ngreet("Amara", punct=".")          # "Hello, Amara."\ngreet(name="Amara", greeting="Hi") # explicit`,
      result: '"Hello, Amara!" or customised',
    },
    args: {
      label: "*args",
      code: `def total(*amounts):\n    return sum(amounts)\n\ntotal(100)                 # 100\ntotal(100, 200)            # 300\ntotal(100, 200, 300, 400)  # 1000\n\n# *args captures as a tuple:\ndef show(*args):\n    print(type(args))  # <class 'tuple'>\n    print(args)        # (100, 200, 300)`,
      result: "Accepts any number of positional args",
    },
    kwargs: {
      label: "**kwargs",
      code: `def create_employee(**details):\n    return details\n\ncreate_employee(name="Amara", dept="Eng", salary=85000)\n# {"name":"Amara","dept":"Eng","salary":85000}\n\n# **kwargs captures as a dict:\ndef log(**kwargs):\n    for k, v in kwargs.items():\n        print(f"{k}: {v}")\n\n# Common: pass config dicts to functions:\nconfig = {"threshold": 0.5, "max_iter": 100}\nrun_model(**config)  # unpacks to keyword args`,
      result: "Accepts any keyword arguments as a dict",
    },
    combined: {
      label: "All together",
      code: `def pipeline(data, method="mean",\n             *transforms, verbose=False,\n             **options):\n    pass\n\n# Full signature order rule:\n# def f(pos, pos_default=val, *args, kw_only, **kwargs)\n\n# Practical example:\ndef read_data(path, encoding="utf-8", *,\n             na_values=None, parse_dates=False):\n    # * forces na_values and parse_dates to be keyword-only\n    pass\n\nread_data("file.csv", parse_dates=True)`,
      result: "Order: positional → default → *args → kwonly → **kwargs",
    },
  };
  const m = MODES[mode];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>
        Explore how Python handles different argument types. The order of the
        signatures matters.
      </Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {Object.entries(MODES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            style={{
              padding: "5px 11px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${mode === k ? T.purple : "rgba(255,255,255,.08)"}`,
              background: mode === k ? "rgba(192,132,252,.12)" : "transparent",
              color: mode === k ? T.purple : T.grey,
              fontWeight: mode === k ? 700 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <PyBlock code={m.code} label="Python — function arguments" />
      <div
        style={{
          background: `${T.purple}09`,
          border: `1px solid ${T.purple}25`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          color: T.greyLight,
        }}
      >
        <strong style={{ color: T.purple }}>{m.label}: </strong>
        {m.result}
      </div>
    </div>
  );
}

function Module04() {
  return (
    <Course
      intro={{
        explain:
          "A function is a named, reusable block of code that takes inputs (parameters), does something, and returns an output. You define it once and call it as many times as you need. Good functions do one thing clearly and can be tested in isolation. In Python, functions are first-class objects — you can pass them as arguments, return them from other functions, and store them in variables, which enables powerful patterns like closures and decorators.",
        learn: [
          "Define functions with positional, default, *args, and **kwargs arguments",
          "Understand the LEGB rule — how Python finds the value of any variable name",
          "Write closures that remember variables from their surrounding scope",
          "Use and understand decorators, which wrap a function to add behaviour without changing its code",
        ],
        concepts: [
          "Default arguments are evaluated ONCE at function definition — use None as default for mutable types",
          "*args captures extra positional arguments as a tuple; **kwargs captures keyword arguments as a dict",
          "A closure is a function that remembers variables from the scope where it was defined",
          "@decorator is shorthand for: my_function = decorator(my_function)",
        ],
        why: "Every real Python project is built from functions. Writing clean, well-scoped functions is the single biggest factor in whether code is readable, testable, and maintainable.",
      }}
      c={T.purple}
      steps={[
        {
          title: "Function tracer",
          desc: "A function is defined with the def keyword, a name, parentheses containing parameters, and a colon. The body is indented. The return statement sends a value back to the caller. If a function has no return statement it returns None. When you call classify_salary(85000), Python executes the function body with salary = 85000, evaluates each condition from top to bottom, and returns the first matching result. Drag the slider to see exactly which condition fires for each salary value.",
          content: () => <FunctionPipeline />,
        },
        {
          title: "Args & kwargs",
          desc: "Python functions support four kinds of parameters. Positional arguments are matched by order. Keyword arguments have default values and can be passed by name. *args collects any extra positional arguments into a tuple — useful when you do not know how many will be passed. **kwargs collects any extra keyword arguments into a dict. The order in a function signature must always be: positional, defaults, *args, keyword-only, **kwargs. Click each mode to see the syntax and behaviour of each.",
          content: () => <ArgsKwargsVisual />,
        },
        {
          title: "Closures & decorators",
          desc: "A closure is a function defined inside another function that remembers variables from its enclosing scope even after the outer function has finished running. This lets you create factory functions that produce customised functions. A decorator is a closure pattern specifically for wrapping other functions — it takes a function as input and returns a new function that adds behaviour (logging, timing, caching) before or after the original runs. The @syntax is shorthand: @timer above a function is identical to writing function = timer(function).",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.purple}>
                A closure is a function that remembers values from its enclosing
                scope. Decorators are closures that wrap other functions to add
                behaviour.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <SL>CLOSURE</SL>
                  <PyBlock
                    code={`def make_multiplier(factor):\n    # 'factor' is captured in closure:\n    def multiply(x):\n        return x * factor\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\n\ndouble(5)  # 10\ntriple(5)  # 15\ndouble(salary)  # salary * 2`}
                  />
                </div>
                <div>
                  <SL>DECORATOR</SL>
                  <PyBlock
                    code={`import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"{func.__name__} took {end-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef process_employees(df):\n    return df.groupby("dept")["salary"].mean()\n\n# @timer is syntactic sugar for:\n# process_employees = timer(process_employees)`}
                  />
                </div>
              </div>
              <Tip
                icon="🏗️"
                title="COMMON DECORATORS IN DATA WORK"
                c={T.purple}
              >
                <code>@functools.lru_cache</code> — cache expensive computations
                · <code>@staticmethod</code> — utility methods on classes ·{" "}
                <code>@property</code> — computed attributes ·{" "}
                <code>@dataclass</code> — auto-generate __init__, __repr__
              </Tip>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "Mutable default argument",
                  wrong: `def add_city(city, result=[]):\n    result.append(city)\n    return result\n\nadd_city("Lagos")   # ['Lagos']\nadd_city("Accra")   # ['Lagos','Accra'] ← SHARED!`,
                  right: `def add_city(city, result=None):\n    if result is None:\n        result = []\n    result.append(city)\n    return result`,
                  why: "Default values are evaluated ONCE when def is executed. Lists, dicts, and sets as defaults are shared across all calls. Use None and create the mutable inside the function body.",
                },
                {
                  title: "Forgetting to return a value",
                  wrong: `def add_salary(emp, raise_pct):\n    emp["salary"] *= (1 + raise_pct)\n    # forgot return!\n\nresult = add_salary(emp, 0.1)\nprint(result)  # None`,
                  right: `def add_salary(emp, raise_pct):\n    emp["salary"] *= (1 + raise_pct)\n    return emp  # ← explicit return`,
                  why: "Functions without return statements return None. This is a common source of bugs — the caller expects the modified value but gets None. Always be explicit about what your function returns.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.purple}
              questions={[
                {
                  type: "output",
                  question: "What does this print?",
                  code: `def f(a, b=2, *args, **kwargs):\n    print(a, b, args, kwargs)\n\nf(1, 3, 4, 5, x=6)`,
                  options: [
                    "1 2 (3,4,5) {'x':6}",
                    "1 3 (4,5) {'x':6}",
                    "Error",
                    "1 3 4 5 6",
                  ],
                  correct: 1,
                  explanation:
                    "a=1 (positional), b=3 (overrides default of 2), args=(4,5) (remaining positional), kwargs={'x':6} (keyword args). The default for b is overridden by the value 3.",
                },
                {
                  type: "bug",
                  question: "What's the issue?",
                  code: `def get_tags(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\nprint(get_tags("python"))  # ['python']\nprint(get_tags("data"))    # ???`,
                  options: [
                    "tags=[] should be tags=list()",
                    "Default mutable argument — both calls share the same list",
                    ".append() returns None",
                    "Missing return tags",
                  ],
                  correct: 1,
                  explanation:
                    "tags=[] is created ONCE when def runs. Both calls share the same list, so the second call returns ['python', 'data']. Use tags=None and create tags=[] inside the function.",
                },
                {
                  question: "What does @timer above a function definition do?",
                  options: [
                    "Imports timer module",
                    "Equivalent to: function = timer(function)",
                    "Makes the function run in a timer loop",
                    "Adds timing to Python's scheduler",
                  ],
                  correct: 1,
                  explanation:
                    "@timer is syntactic sugar (syntax shortcut) for: function = timer(function). The decorator is called with the function as its argument, and the returned value replaces the original function.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 05: PANDAS DATAFRAMES ─────────────────────────────────────────────
function DataFrameExplorer() {
  const [view, setView] = useState("table");
  const cols = ["id", "name", "dept", "salary", "hired", "active", "score"];
  const nullCt = (c) => DF_EMPLOYEES.filter((r) => r[c] === null).length;
  const dtypes = {
    id: "int64",
    name: "object",
    dept: "object",
    salary: "int64",
    hired: "object",
    active: "bool",
    score: "float64",
  };
  const dtC = {
    int64: T.blue,
    float64: T.cyan,
    object: T.green,
    bool: T.yellow,
  };
  const stats = {
    salary: {
      count: 10,
      mean: 79700,
      std: 9873,
      min: 65000,
      q25: 70750,
      q50: 78500,
      q75: 89000,
      max: 93000,
    },
    score: {
      count: 7,
      mean: 87.6,
      std: 7.8,
      min: 77,
      q25: 79.5,
      q50: 88.5,
      q75: 93.5,
      max: 98.5,
    },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Click TABLE, .info(), and .describe() to see three different views of
        the same DataFrame — exactly as you'd explore in Jupyter.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "3px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        {["table", ".info()", ".describe()"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "5px 14px",
              borderRadius: 7,
              border: "none",
              background: view === v ? "rgba(34,211,238,.14)" : "transparent",
              color: view === v ? T.cyan : T.grey,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: view === v ? 700 : 400,
              transition: "all .15s",
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {view === "table" && (
        <div style={{ animation: "fadeUp .25s ease" }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            <Badge c={T.cyan}>
              {DF_EMPLOYEES.length} rows × {cols.length} cols
            </Badge>
            <Badge c={T.green}>pd.DataFrame</Badge>
            {cols
              .filter((c) => nullCt(c) > 0)
              .map((c) => (
                <Badge key={c} c={T.red}>
                  {c}: {nullCt(c)} NaN
                </Badge>
              ))}
          </div>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    #
                  </th>
                  {cols.map((c) => (
                    <th
                      key={c}
                      style={{ padding: "5px 8px", textAlign: "left" }}
                    >
                      <div style={{ fontSize: 9, color: T.cyan }}>{c}</div>
                      <div
                        style={{
                          fontSize: 7,
                          color: dtC[dtypes[c]] || T.greyDark,
                        }}
                      >
                        {dtypes[c]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((row, ri) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom:
                        ri < DF_EMPLOYEES.length - 1
                          ? `1px solid ${T.slate}22`
                          : "none",
                      background:
                        ri % 2 === 0 ? "rgba(255,255,255,.01)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "4px 8px",
                        fontSize: 9,
                        color: T.greyDark,
                      }}
                    >
                      {ri}
                    </td>
                    {cols.map((c) => (
                      <td
                        key={c}
                        style={{
                          padding: "4px 8px",
                          fontSize: 10,
                          color:
                            row[c] === null
                              ? T.greyDark
                              : c === "dept"
                                ? dc(row[c]).text
                                : T.greyLight,
                          fontStyle: row[c] === null ? "italic" : "normal",
                        }}
                      >
                        {row[c] === null
                          ? "NaN"
                          : c === "salary"
                            ? row[c].toLocaleString()
                            : String(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {view === ".info()" && (
        <div
          style={{
            animation: "fadeUp .25s ease",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <OutBlock label="df.info()">{`<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 10 entries, 0 to 9\nData columns (total 7 columns):\n #   Column   Non-Null Count  Dtype  \n---  ------   --------------  -----  \n 0   id       10 non-null     int64  \n 1   name     10 non-null     object \n 2   dept     10 non-null     object \n 3   salary   10 non-null     int64  \n 4   hired    10 non-null     object \n 5   active   10 non-null     bool   \n 6   score     7 non-null     float64\ndtypes: bool(1), float64(1), int64(2), object(3)\nmemory usage: 688+ bytes`}</OutBlock>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <Tip icon="🔍" title="WHAT TO LOOK FOR IN .info()" c={T.cyan}>
              Non-null counts reveal missing data. Column dtypes matter — object
              columns can't be averaged. Unexpected 'object' type on a numeric
              column means there's dirty data.
            </Tip>
            <div>
              <SL c={T.red}>⚠️ COLUMNS WITH NULLS</SL>
              {cols
                .filter((c) => nullCt(c) > 0)
                .map((c) => (
                  <div
                    key={c}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: "rgba(248,113,113,.07)",
                      border: "1px solid rgba(248,113,113,.2)",
                      marginBottom: 4,
                      fontSize: 10,
                      color: T.greyLight,
                      fontFamily: "monospace",
                    }}
                  >
                    <span style={{ color: T.red, fontWeight: 700 }}>{c}</span> —{" "}
                    {nullCt(c)}/10 missing ({Math.round((nullCt(c) / 10) * 100)}
                    %)
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {view === ".describe()" && (
        <div style={{ animation: "fadeUp .25s ease" }}>
          <SL c={T.cyan}>df.describe() — numeric columns only</SL>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  <th
                    style={{
                      padding: "6px 10px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    stat
                  </th>
                  <th
                    style={{
                      padding: "6px 10px",
                      textAlign: "right",
                      fontSize: 9,
                      color: T.blue,
                    }}
                  >
                    salary
                  </th>
                  <th
                    style={{
                      padding: "6px 10px",
                      textAlign: "right",
                      fontSize: 9,
                      color: T.cyan,
                    }}
                  >
                    score
                  </th>
                  <th
                    style={{
                      padding: "6px 10px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.grey,
                      maxWidth: 180,
                    }}
                  >
                    what it means
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["count", "10", "7", "non-null row count"],
                  ["mean", "79,700", "87.6", "arithmetic average"],
                  ["std", "9,873", "7.8", "spread of values"],
                  ["min", "65,000", "77.0", "smallest value"],
                  ["25%", "70,750", "79.5", "1st quartile"],
                  ["50%", "78,500", "88.5", "median"],
                  ["75%", "89,000", "93.5", "3rd quartile"],
                  ["max", "93,000", "98.5", "largest value"],
                ].map(([s, sal, sc, m], i) => (
                  <tr
                    key={s}
                    style={{
                      borderBottom: i < 7 ? `1px solid ${T.slate}33` : "none",
                      background: ["min", "max"].includes(s)
                        ? `${T.blue}05`
                        : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "5px 10px",
                        fontSize: 10,
                        color: T.greyDark,
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      {s}
                    </td>
                    <td
                      style={{
                        padding: "5px 10px",
                        fontSize: 10,
                        color: T.blue,
                        textAlign: "right",
                      }}
                    >
                      {sal}
                    </td>
                    <td
                      style={{
                        padding: "5px 10px",
                        fontSize: 10,
                        color: T.cyan,
                        textAlign: "right",
                      }}
                    >
                      {sc}
                    </td>
                    <td
                      style={{
                        padding: "5px 10px",
                        fontSize: 9,
                        color: T.greyDark,
                      }}
                    >
                      {m}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note c={T.cyan} style={{ marginTop: 8 }}>
            score has <strong>count=7 not 10</strong> — .describe() excludes
            NaN. The 3 missing score values don't affect count here.
          </Note>
        </div>
      )}
    </div>
  );
}

function Module05() {
  return (
    <Course
      intro={{
        explain:
          "A DataFrame is the central data structure in pandas — a two-dimensional table with labelled rows and columns, similar to a spreadsheet or a database table. Each column is a Series: a one-dimensional labelled array. DataFrames are the starting point for every data analysis in Python: you load your raw data into one, then clean, filter, transform, aggregate, and visualise it from there. Almost everything else in this course operates on DataFrames.",
        learn: [
          "Create DataFrames from CSV files, lists of dicts, and dicts of lists",
          "Use .info(), .describe(), .head(), and .shape to understand any new dataset instantly",
          "Understand the difference between selecting a column as a Series vs as a DataFrame",
          "Understand what the index is and why pandas aligns operations on index values",
        ],
        concepts: [
          "df.shape returns (rows, cols) — the first thing to check on any new dataset",
          "df['col'] returns a Series (1D); df[['col']] returns a DataFrame (2D) — double brackets matter",
          "df.dtypes shows the type of each column — object means string, which cannot be averaged",
          "df.isnull().sum() counts missing values per column — always run this before analysis",
        ],
        why: "Everything else in this course — filtering, groupby, merging, cleaning, visualising — operates on DataFrames. Loading data correctly and understanding its structure prevents hours of confusion downstream.",
      }}
      c={T.cyan}
      steps={[
        {
          title: "DataFrame views",
          desc: "The first three things you should do with any new DataFrame are: call .info() to see column names, non-null counts, and data types; call .describe() to see statistics for numeric columns; and call .head() to see the actual values. These three commands tell you the shape of your data, what types pandas has inferred, where the missing values are, and whether the values look sensible. Click TABLE, .info(), and .describe() tabs to see all three views of the employee dataset.",
          content: () => <DataFrameExplorer />,
        },
        {
          title: "Creating DataFrames",
          desc: "You create DataFrames in three common ways. From a CSV file using pd.read_csv() — the most common in practice. From a list of dicts where each dict is a row and the keys become column names — useful when building data programmatically. From a dict of lists where each key is a column name and each value is a list of column values. Once created, key attributes to know: df.shape gives dimensions, df.columns lists column names, df.dtypes shows the type of each column, and df.index shows the row labels.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                A DataFrame is a 2D table with labelled axes. Every column is a
                Series. Every row has an integer index by default.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <SL>3 WAYS TO CREATE</SL>
                  <PyBlock
                    code={`import pandas as pd\n\n# 1. From list of dicts (most common):\ndata = [\n    {"name": "Amara", "salary": 85000},\n    {"name": "Bola",  "salary": 72000},\n]\ndf = pd.DataFrame(data)\n\n# 2. From CSV (real world):\ndf = pd.read_csv("employees.csv")\ndf = pd.read_csv("data.csv",\n    parse_dates=["hired"],\n    dtype={"id": int},\n    na_values=["N/A", "null", ""],\n)\n\n# 3. From dict of lists:\ndf = pd.DataFrame({\n    "name":   ["Amara", "Bola"],\n    "salary": [85000, 72000]\n})`}
                  />
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <SL>KEY ATTRIBUTES</SL>
                  <PyBlock
                    code={`df.shape      # (10, 7) — rows, cols\ndf.columns    # Index(['id','name',...])\ndf.dtypes     # id: int64, name: object...\ndf.index      # RangeIndex(start=0, stop=10)\ndf.values     # numpy array of all values\n\n# Head and tail:\ndf.head()     # first 5 rows\ndf.head(3)    # first 3 rows\ndf.tail(2)    # last 2 rows\n\n# Random sample:\ndf.sample(3)  # 3 random rows\ndf.sample(frac=0.2)  # 20% of rows`}
                  />
                  <Tip icon="🧠" title="SERIES vs DATAFRAME" c={T.cyan}>
                    <code>df["salary"]</code> → <strong>Series</strong> (1D)
                    <br />
                    <code>df[["salary"]]</code> → <strong>DataFrame</strong>{" "}
                    (2D, 1 col)
                    <br />
                    Double brackets force a DataFrame — critical for many
                    operations.
                  </Tip>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Index & alignment",
          desc: "Every DataFrame has an index — a set of row labels. By default it is 0, 1, 2... (a RangeIndex). You can set any column as the index with df.set_index('col'). The index matters because pandas aligns operations on index values, not positions. When you add two Series with different indexes, pandas matches values by index label and produces NaN where labels do not appear in both. After operations like groupby or merge, always check df.index — unexpected index values cause subtle bugs.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                The index is a powerful feature — pandas aligns operations on
                index, not position. Misaligned indexes cause silent NaN bugs.
              </Note>
              <PyBlock
                label="Index operations"
                code={`# Default integer index:\ndf.index  # RangeIndex(start=0, stop=10, step=1)\n\n# Set a column as index:\ndf = df.set_index("id")\ndf.index  # Int64Index([1,2,3,...,10])\n\n# Access by index label:\ndf.loc[1]   # employee with id=1\n\n# Reset to default integer index:\ndf = df.reset_index()\n\n# Index alignment (automatic):\ns1 = pd.Series([10, 20, 30], index=["a","b","c"])\ns2 = pd.Series([1, 2, 3], index=["b","c","d"])\ns1 + s2\n# a    NaN  (a not in s2)\n# b    22   (20 + 2)\n# c    33   (30 + 3)\n# d    NaN  (d not in s1)`}
              />
              <Warn>
                After merges or groupby().reset_index(), your index may contain
                unexpected values. Always check df.index after complex
                operations.
              </Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.cyan}
              questions={[
                {
                  question: "What does df.shape return?",
                  options: [
                    "A list of column names",
                    "A tuple (rows, columns)",
                    "The number of cells",
                    "A dict of dtypes",
                  ],
                  correct: 1,
                  explanation:
                    "df.shape returns a tuple like (10, 7). df.shape[0] is row count, df.shape[1] is column count. len(df) also returns row count.",
                },
                {
                  type: "bug",
                  question: "A developer wants a DataFrame not a Series:",
                  code: `col = df["salary"]  # got a Series, wanted DataFrame`,
                  options: [
                    "Use df.salary",
                    "Use df[['salary']] (double brackets)",
                    "Use df.to_frame('salary')",
                    "Use df.loc[:,'salary']",
                  ],
                  correct: 1,
                  explanation:
                    "df['salary'] returns a Series. df[['salary']] (list with one element) returns a single-column DataFrame. The outer brackets select columns, the inner list specifies which ones.",
                },
                {
                  type: "output",
                  question:
                    "df.describe() on score (7 non-null out of 10). What is 'count'?",
                  options: ["10", "7", "8.5", "NaN"],
                  correct: 1,
                  explanation:
                    ".describe() operates on non-null values only. If 3 values are NaN, count=7. The NaN rows are excluded from all statistics. This is why nulls must be handled before analysis.",
                },
                {
                  question:
                    "What's the difference between df.head() and df.sample()?",
                  options: [
                    "No difference",
                    "head() returns first N rows, sample() returns random N rows",
                    "head() is faster",
                    "sample() sorts the data first",
                  ],
                  correct: 1,
                  explanation:
                    "df.head(n) always returns the first n rows (default 5). df.sample(n) returns n random rows. Use sample() for quick exploratory checks on large datasets to avoid always seeing only the first rows.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 06: FILTERING & SELECTION ────────────────────────────────────────
function FilterBuilder() {
  const [col, setCol] = useState("dept");
  const [op, setOp] = useState("==");
  const [val, setVal] = useState("Engineering");
  const [mode, setMode] = useState("boolean");
  const ops = ["==", "!=", ">", ">=", "<", "<="];
  const evalRow = (r) => {
    const v = r[col];
    if (v === null) return false;
    const n = isNaN(val) ? val : Number(val);
    switch (op) {
      case "==":
        return String(v) === String(n);
      case "!=":
        return String(v) !== String(n);
      case ">":
        return Number(v) > Number(n);
      case ">=":
        return Number(v) >= Number(n);
      case "<":
        return Number(v) < Number(n);
      case "<=":
        return Number(v) <= Number(n);
    }
    return false;
  };
  const passing = DF_EMPLOYEES.filter(evalRow);
  const codes = {
    boolean: `df[df["${col}"] ${op} "${isNaN(val) ? val : val}"]\n# ${passing.length} rows pass`,
    loc: `df.loc[\n    df["${col}"] ${op} "${isNaN(val) ? val : val}",\n    ["name","dept","salary"]\n]`,
    query: `df.query('${col} ${op} "${val}"')`,
    isin: `df[df["dept"].isin(["Engineering","Analytics"])]\n# Multiple values — cleaner than OR chains`,
    between: `df[df["salary"].between(70000, 85000)]\n# Both ends inclusive by default`,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Build a filter condition using the controls. Watch rows dim/glow as they
        evaluate to True or False. Switch filter styles to compare syntax.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        {Object.keys(codes).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "4px 11px",
              borderRadius: 7,
              border: "none",
              background: mode === m ? "rgba(96,165,250,.14)" : "transparent",
              color: mode === m ? T.blue : T.grey,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: T.surface,
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ fontSize: 11, color: T.greyDark, fontFamily: "monospace" }}
        >
          df[ df["
        </span>
        <select
          value={col}
          onChange={(e) => setCol(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            border: `1px solid ${T.slate}`,
            background: T.bg,
            color: T.blue,
            fontSize: 10,
            fontFamily: "monospace",
            outline: "none",
          }}
        >
          {["id", "name", "dept", "salary", "hired", "active"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span
          style={{ fontSize: 11, color: T.greyDark, fontFamily: "monospace" }}
        >
          "]
        </span>
        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            border: `1px solid ${T.slate}`,
            background: T.bg,
            color: T.cyan,
            fontSize: 10,
            fontFamily: "monospace",
            outline: "none",
          }}
        >
          {ops.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          style={{
            padding: "4px 9px",
            borderRadius: 6,
            border: "1px solid rgba(96,165,250,.4)",
            background: T.bg,
            color: T.blue,
            fontSize: 10,
            fontFamily: "monospace",
            width: 100,
            outline: "none",
          }}
        />
        <span
          style={{ fontSize: 11, color: T.greyDark, fontFamily: "monospace" }}
        >
          ]
        </span>
        <span
          style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace" }}
        >
          <span style={{ color: T.green }}>✓ {passing.length}</span>{" "}
          <span style={{ color: T.greyDark }}>
            ✗ {DF_EMPLOYEES.length - passing.length}
          </span>
        </span>
      </div>
      <PyBlock code={codes[mode]} label="pandas" />
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: `1px solid ${T.slate}`,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(4,9,20,.9)",
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              {["name", "dept", "salary", "verdict"].map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "6px 10px",
                    textAlign: "left",
                    fontSize: 9,
                    color: c === "verdict" ? T.blue : T.greyDark,
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DF_EMPLOYEES.map((row, ri) => {
              const p = evalRow(row);
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom:
                      ri < DF_EMPLOYEES.length - 1
                        ? `1px solid ${T.slate}22`
                        : "none",
                    background: p ? "rgba(74,222,128,.05)" : "transparent",
                    opacity: p ? 1 : 0.2,
                    transition: "all .25s",
                  }}
                >
                  <td
                    style={{
                      padding: "5px 10px",
                      fontSize: 10,
                      color: T.greyLight,
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    style={{
                      padding: "5px 10px",
                      fontSize: 10,
                      color: dc(row.dept).text,
                    }}
                  >
                    {row.dept}
                  </td>
                  <td
                    style={{
                      padding: "5px 10px",
                      fontSize: 10,
                      color: T.greyLight,
                    }}
                  >
                    {row.salary.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "5px 10px",
                      fontSize: 11,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: p ? T.green : T.greyDark,
                    }}
                  >
                    {p ? "True" : "False"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LocIlocVisual() {
  const [mode, setMode] = useState("loc");
  const [rowA, setRowA] = useState(1);
  const [rowB, setRowB] = useState(4);
  const [cols, setCols] = useState(["name", "salary", "dept"]);
  const ALL = ["id", "name", "dept", "salary", "hired", "active", "score"];
  const tog = (c) =>
    setCols((p) =>
      p.includes(c) ? (p.length > 1 ? p.filter((x) => x !== c) : p) : [...p, c],
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Toggle between .loc and .iloc. Drag row sliders to select a range.
        Toggle columns. Note the important difference between
        inclusive/exclusive ends.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        {["loc", "iloc"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "4px 14px",
              borderRadius: 7,
              border: "none",
              background: mode === m ? "rgba(250,204,21,.14)" : "transparent",
              color: mode === m ? T.yellow : T.grey,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: mode === m ? 700 : 400,
            }}
          >
            df.{m}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL>ROW RANGE</SL>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}
                >
                  start: {rowA}
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={rowA}
                  onChange={(e) =>
                    setRowA(Math.min(Number(e.target.value), rowB))
                  }
                  style={{ width: "100%", accentColor: T.yellow }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 8,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}
                >
                  end: {rowB}
                </div>
                <input
                  type="range"
                  min={1}
                  max={9}
                  value={rowB}
                  onChange={(e) =>
                    setRowB(Math.max(Number(e.target.value), rowA))
                  }
                  style={{ width: "100%", accentColor: T.yellow }}
                />
              </div>
            </div>
          </div>
          <div>
            <SL>COLUMNS</SL>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {ALL.map((c) => (
                <button
                  key={c}
                  onClick={() => tog(c)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 7,
                    fontSize: 9,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    border: `1px solid ${cols.includes(c) ? T.yellow : "rgba(255,255,255,.08)"}`,
                    background: cols.includes(c)
                      ? "rgba(250,204,21,.1)"
                      : "transparent",
                    color: cols.includes(c) ? T.yellow : T.grey,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <PyBlock
            label="pandas"
            code={
              mode === "loc"
                ? `# .loc — LABEL based, END INCLUSIVE:\ndf.loc[${rowA}:${rowB}, ${JSON.stringify(cols)}]\n# Rows with INDEX LABELS ${rowA} through ${rowB}\n# i.e. ${rowB - rowA + 1} rows`
                : `# .iloc — POSITION based, END EXCLUSIVE:\ndf.iloc[${rowA}:${rowB + 1}, [${cols.map((c) => ALL.indexOf(c)).join(",")}]]\n# Rows at positions ${rowA} to ${rowB}\n# i.e. ${rowB - rowA + 1} rows (${rowB + 1} exclusive)`
            }
          />
          <div
            style={{
              background: `${T.yellow}09`,
              border: `1px solid ${T.yellow}28`,
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                fontSize: 10,
                color: T.greyLight,
              }}
            >
              <div>
                <strong style={{ color: T.yellow }}>.loc[a:b]</strong>
                <br />→ includes BOTH a and b<br />
                <span style={{ color: T.greyDark }}>like SQL BETWEEN</span>
              </div>
              <div>
                <strong style={{ color: T.yellow }}>.iloc[a:b]</strong>
                <br />→ excludes b (like Python slicing)
                <br />
                <span style={{ color: T.greyDark }}>like Python list[a:b]</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SL c={T.yellow}>
            SELECTED — {rowB - rowA + 1} rows × {cols.length} cols
          </SL>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    #
                  </th>
                  {cols.map((c) => (
                    <th
                      key={c}
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.yellow,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((row, ri) => {
                  const sel = ri >= rowA && ri <= rowB;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom:
                          ri < DF_EMPLOYEES.length - 1
                            ? `1px solid ${T.slate}22`
                            : "none",
                        background: sel
                          ? "rgba(250,204,21,.06)"
                          : "transparent",
                        opacity: sel ? 1 : 0.15,
                        transition: "all .25s",
                      }}
                    >
                      <td
                        style={{
                          padding: "4px 8px",
                          fontSize: 9,
                          color: sel ? T.yellow : T.greyDark,
                        }}
                      >
                        {ri}
                      </td>
                      {cols.map((c) => (
                        <td
                          key={c}
                          style={{
                            padding: "4px 8px",
                            fontSize: 10,
                            color: T.greyLight,
                          }}
                        >
                          {row[c] === null ? "NaN" : String(row[c])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Module06() {
  return (
    <Course
      intro={{
        explain:
          "Filtering selects only the rows that satisfy a condition. In pandas you create a boolean mask — a Series of True/False values the same length as your DataFrame — and use it to index the DataFrame. Rows where the mask is True are kept, the rest are excluded. This is the pandas equivalent of SQL's WHERE clause and it is one of the most-used operations in all of data analysis.",
        learn: [
          "Write boolean filters using comparison operators and combine them with & (AND), | (OR), and ~ (NOT)",
          "Use .loc[] to select rows and columns by label, and .iloc[] to select by integer position",
          "Use .isin() to match a list of values and .between() for numeric ranges",
          ".query() for readable string-based filtering on complex conditions",
        ],
        concepts: [
          "Boolean mask: df[df['col'] > value] — creates True/False for every row, returns matching rows",
          "Use & and | operators, not Python's and/or — and/or cannot work element-wise on a Series",
          "Always wrap each condition in parentheses: (cond1) & (cond2) — operator precedence will cause wrong results otherwise",
          ".loc[a:b] is INCLUSIVE on both ends; .iloc[a:b] EXCLUDES b — exactly like Python list slicing",
        ],
        why: "You will filter DataFrames in every single analysis. Getting the syntax right — especially parentheses and & vs and — is the difference between writing filters that work and spending 30 minutes debugging.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Filter builder",
          desc: "Boolean filtering works in two steps. First you write a condition like df['salary'] > 75000 — this creates a Series of True and False values, one for each row. Then you pass that Series back into the DataFrame as an index: df[df['salary'] > 75000] — this returns only the rows where the condition is True. The filter builder below lets you configure the column, operator, and value live. Notice how the table rows dim or glow as the condition changes.",
          content: () => <FilterBuilder />,
        },
        {
          title: ".loc vs .iloc",
          desc: ".loc and .iloc are the two primary ways to select specific rows and columns from a DataFrame. .loc is label-based — you refer to rows and columns by their names or index labels. .iloc is position-based — you use integer positions like a Python list. The critical difference: .loc[a:b] is inclusive on both ends, meaning it includes both row a and row b. .iloc[a:b] is exclusive on the right end, meaning it includes a but not b — exactly like Python list slicing. Use .loc when you know the label; use .iloc when you need a specific position.",
          content: () => <LocIlocVisual />,
        },
        {
          title: "Multiple conditions",
          desc: "To combine multiple filter conditions in pandas you must use & for AND, | for OR, and ~ for NOT. You cannot use Python's built-in and/or keywords because they cannot work element-wise on a Series of True/False values — they would raise a ValueError or return a single boolean. You must also wrap every individual condition in its own parentheses because & and | have higher precedence than comparison operators like > and ==. Missing parentheses leads to results that are silently wrong.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Warn>
                Use <code>&</code> (not <code>and</code>) and <code>|</code>{" "}
                (not <code>or</code>) in pandas. Always wrap each condition in
                parentheses.
              </Warn>
              <PyBlock
                label="pandas — combining conditions"
                code={`# AND — use & with parentheses:\nhigh_active = df[(df["salary"] > 75000) & (df["active"] == True)]\n\n# OR — use |:\ntech = df[(df["dept"] == "Engineering") | (df["dept"] == "Analytics")]\n\n# NOT — use ~:\nnot_active = df[~df["active"]]\n\n# isin() — cleaner than chained OR:\ndepts = ["Engineering", "Analytics"]\ntech2 = df[df["dept"].isin(depts)]\n\n# between() — inclusive by default:\nmid_salary = df[df["salary"].between(70000, 85000)]\n\n# .query() string — readable for complex filters:\nresult = df.query('salary > 75000 and dept == "Engineering"')\n\n# Combine isin + condition:\nresult = df[df["dept"].isin(depts) & (df["salary"] > 72000)]`}
              />
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: 8,
                  border: `1px solid ${T.slate}`,
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  df[(df["salary"] &gt; 75000) &amp; (df["active"] == True)] —{" "}
                  {
                    DF_EMPLOYEES.filter((r) => r.salary > 75000 && r.active)
                      .length
                  }{" "}
                  results
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                      {["name", "dept", "salary", "active"].map((c) => (
                        <th
                          key={c}
                          style={{
                            padding: "5px 10px",
                            textAlign: "left",
                            fontSize: 9,
                            color: T.greyDark,
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DF_EMPLOYEES.filter(
                      (r) => r.salary > 75000 && r.active,
                    ).map((r, i, a) => (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom:
                            i < a.length - 1
                              ? `1px solid ${T.slate}33`
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "5px 10px",
                            fontSize: 10,
                            color: T.greyLight,
                          }}
                        >
                          {r.name}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            fontSize: 10,
                            color: dc(r.dept).text,
                          }}
                        >
                          {r.dept}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            fontSize: 10,
                            color: T.green,
                            fontWeight: 700,
                          }}
                        >
                          {r.salary.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            fontSize: 10,
                            color: T.green,
                          }}
                        >
                          True
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "Using 'and' instead of '&' in pandas",
                  wrong: `result = df[df["salary"] > 75000 and df["active"]]  # ValueError`,
                  right: `result = df[(df["salary"] > 75000) & (df["active"])]  # ✓`,
                  why: "Python's 'and'/'or' work on single booleans. Pandas Series are arrays of booleans — you need element-wise operators: & (and), | (or), ~ (not). Always wrap each condition in parentheses.",
                },
                {
                  title: "Missing parentheses around conditions",
                  wrong: `result = df[df["salary"] > 75000 & df["active"]]  # Wrong! & binds tighter`,
                  right: `result = df[(df["salary"] > 75000) & (df["active"])]  # ✓ explicit grouping`,
                  why: "Operator precedence: & binds tighter than > and <. Without parentheses, df['salary'] > 75000 & df['active'] is parsed as df['salary'] > (75000 & df['active']) — completely wrong.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.blue}
              questions={[
                {
                  type: "bug",
                  question: "What's wrong?",
                  code: `result = df[df["salary"] > 75000 and df["active"] == True]`,
                  options: [
                    "and is fine here",
                    "Should use & with parentheses around each condition",
                    "Should use df.query()",
                    "active needs to be quoted",
                  ],
                  correct: 1,
                  explanation:
                    "Python's 'and' can't work element-wise on Series — it raises ValueError. Use & for AND and | for OR. Always wrap each condition in parentheses: df[(df['salary'] > 75000) & (df['active'] == True)].",
                },
                {
                  question: "What does .loc[1:3] return vs .iloc[1:3]?",
                  options: [
                    "Same thing",
                    "loc[1:3] includes rows with labels 1,2,3 (inclusive). iloc[1:3] includes positions 1,2 only (exclusive end)",
                    "loc is always faster",
                    "iloc only works with integer indexes",
                  ],
                  correct: 1,
                  explanation:
                    ".loc end is INCLUSIVE: loc[1:3] returns labels 1,2,3. .iloc end is EXCLUSIVE like Python slicing: iloc[1:3] returns positions 1,2. This matters when the index isn't the default RangeIndex.",
                },
                {
                  question:
                    "Which is cleaner for 'dept is either Engineering or Analytics'?",
                  options: [
                    "df[(df['dept']=='Engineering')|(df['dept']=='Analytics')]",
                    "df[df['dept'].isin(['Engineering','Analytics'])]",
                    "df.query(\"dept == 'Engineering' or dept == 'Analytics'\")",
                    "All are equivalent — pick any",
                  ],
                  correct: 1,
                  explanation:
                    "All three work, but .isin() is cleanest for multi-value OR conditions. It scales well — just add more values to the list. The chained | approach gets unwieldy with 5+ values.",
                },
                {
                  type: "output",
                  question: "How many rows does this return?",
                  code: `df[df["salary"].between(70000, 85000)]`,
                  options: [
                    "Rows where 70000 < salary < 85000 (exclusive)",
                    "Rows where 70000 <= salary <= 85000 (inclusive)",
                    "Rows where salary == 70000 or salary == 85000",
                    "Depends on the data",
                  ],
                  correct: 1,
                  explanation:
                    ".between() is INCLUSIVE on both ends by default. .between(a, b) is equivalent to (df['col'] >= a) & (df['col'] <= b). Use inclusive='left' or 'right' to change this.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 07: GROUPBY ───────────────────────────────────────────────────────
function GroupByJourney() {
  const [grpCol, setGrpCol] = useState("dept");
  const [aggFn, setAggFn] = useState("mean");
  const [aggCol, setAggCol] = useState("salary");
  const [phase, setPhase] = useState(0);
  useEffect(() => setPhase(0), [grpCol, aggFn, aggCol]);
  const keys = [...new Set(DF_EMPLOYEES.map((r) => String(r[grpCol])))].sort();
  const grouped = Object.fromEntries(
    keys.map((k) => [k, DF_EMPLOYEES.filter((r) => String(r[grpCol]) === k)]),
  );
  const agg = (rows) => {
    const v = rows.map((r) => r[aggCol]).filter((x) => x !== null);
    if (aggFn === "count") return rows.length;
    if (aggFn === "mean")
      return Math.round(
        v.reduce((s, x) => s + x, 0) / v.length,
      ).toLocaleString();
    if (aggFn === "sum") return v.reduce((s, x) => s + x, 0).toLocaleString();
    if (aggFn === "min") return Math.min(...v).toLocaleString();
    if (aggFn === "max") return Math.max(...v).toLocaleString();
    return "—";
  };
  const PHASES = ["Raw df", "groupby()", "Groups", "Aggregate"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Configure groupby + aggregation, then step through all 4 phases. See{" "}
        {DF_EMPLOYEES.length} rows collapse into {keys.length} group summaries.
      </Hint>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          background: T.surface,
          border: `1px solid ${T.slate}`,
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div>
          <SL>groupby()</SL>
          <div style={{ display: "flex", gap: 4 }}>
            {["dept", "active"].map((c) => (
              <button
                key={c}
                onClick={() => setGrpCol(c)}
                style={{
                  padding: "4px 9px",
                  borderRadius: 8,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  border: `1px solid ${grpCol === c ? T.cyan : "rgba(255,255,255,.08)"}`,
                  background:
                    grpCol === c ? "rgba(34,211,238,.12)" : "transparent",
                  color: grpCol === c ? T.cyan : T.grey,
                  fontWeight: grpCol === c ? 700 : 400,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SL c={T.cyan}>Agg function</SL>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {["mean", "sum", "count", "min", "max"].map((f) => (
              <button
                key={f}
                onClick={() => setAggFn(f)}
                style={{
                  padding: "3px 7px",
                  borderRadius: 7,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  border: `1px solid ${aggFn === f ? T.cyan : "rgba(255,255,255,.08)"}`,
                  background:
                    aggFn === f ? "rgba(34,211,238,.12)" : "transparent",
                  color: aggFn === f ? T.cyan : T.grey,
                }}
              >
                .{f}()
              </button>
            ))}
          </div>
        </div>
        <div>
          <SL>Column</SL>
          <div style={{ display: "flex", gap: 4 }}>
            {["salary", "score", "id"].map((c) => (
              <button
                key={c}
                onClick={() => setAggCol(c)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  border: `1px solid ${aggCol === c ? T.cyan : "rgba(255,255,255,.08)"}`,
                  background:
                    aggCol === c ? "rgba(34,211,238,.12)" : "transparent",
                  color: aggCol === c ? T.cyan : T.grey,
                  fontWeight: aggCol === c ? 700 : 400,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 0,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${T.slate}`,
        }}
      >
        {PHASES.map((p, i) => (
          <button
            key={i}
            onClick={() => setPhase(i)}
            style={{
              flex: 1,
              padding: "9px 4px",
              border: "none",
              cursor: "pointer",
              background:
                phase === i
                  ? "rgba(34,211,238,.13)"
                  : phase > i
                    ? "rgba(34,211,238,.05)"
                    : "transparent",
              borderRight: i < 3 ? `1px solid ${T.slate}` : "none",
              transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 13 }}>{"📋🎨📦⚡"[i]}</div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: phase >= i ? T.cyan : T.greyDark,
                fontFamily: "monospace",
                marginTop: 2,
              }}
            >
              {p}
            </div>
          </button>
        ))}
      </div>
      {phase === 0 && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          <PyBlock
            code={`df.groupby("${grpCol}")["${aggCol}"].${aggFn}()\n# ${DF_EMPLOYEES.length} rows → ${keys.length} rows`}
            label="pandas"
          />
          <div
            style={{
              marginTop: 8,
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  {["name", "dept", "salary", "score"].map((c) => (
                    <th
                      key={c}
                      style={{
                        padding: "5px 10px",
                        textAlign: "left",
                        fontSize: 9,
                        color: c === grpCol ? T.yellow : T.greyDark,
                      }}
                    >
                      {c}
                      {c === grpCol ? " ← group key" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((r, ri) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom:
                        ri < DF_EMPLOYEES.length - 1
                          ? `1px solid ${T.slate}22`
                          : "none",
                    }}
                  >
                    {["name", "dept", "salary", "score"].map((c) => (
                      <td
                        key={c}
                        style={{
                          padding: "5px 10px",
                          fontSize: 10,
                          color: T.greyLight,
                        }}
                      >
                        {r[c] === null
                          ? "NaN"
                          : c === "salary"
                            ? r[c].toLocaleString()
                            : String(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {phase === 1 && (
        <div
          style={{
            animation: "fadeUp .3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            {keys.map((k) => (
              <span
                key={k}
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 14,
                  background: dc(k).bg,
                  border: `1px solid ${dc(k).border}`,
                  color: dc(k).text,
                  fontFamily: "monospace",
                }}
              >
                {grpCol}="{k}" ({grouped[k].length})
              </span>
            ))}
          </div>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  {["name", "dept", "salary", "score"].map((c) => (
                    <th
                      key={c}
                      style={{
                        padding: "5px 10px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.greyDark,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((r, ri) => {
                  const col = dc(String(r[grpCol]));
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom:
                          ri < DF_EMPLOYEES.length - 1
                            ? `1px solid ${T.slate}22`
                            : "none",
                        background: col.bg,
                      }}
                    >
                      {["name", "dept", "salary", "score"].map((c) => (
                        <td
                          key={c}
                          style={{
                            padding: "5px 10px",
                            fontSize: 10,
                            color: c === grpCol ? col.text : T.greyLight,
                            fontWeight: c === grpCol ? 700 : 400,
                          }}
                        >
                          {r[c] === null
                            ? "NaN"
                            : c === "salary"
                              ? r[c].toLocaleString()
                              : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {phase === 2 && (
        <div
          style={{
            animation: "fadeUp .3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {keys.map((k, gi) => {
            const col = dc(k);
            return (
              <div
                key={k}
                style={{
                  border: `1px solid ${col.border}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  animation: `fadeUp .4s ease ${gi * 80}ms both`,
                }}
              >
                <div
                  style={{
                    padding: "6px 12px",
                    background: col.bg,
                    borderBottom: `1px solid ${col.border}`,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: col.text,
                      fontFamily: "monospace",
                    }}
                  >
                    Group: "{k}"
                  </span>
                  <span style={{ fontSize: 9, color: col.text, opacity: 0.7 }}>
                    {grouped[k].length} rows
                  </span>
                </div>
                {grouped[k].map((row, ri) => (
                  <div
                    key={row.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1fr 0.7fr",
                      padding: "4px 12px",
                      borderBottom:
                        ri < grouped[k].length - 1
                          ? `1px solid ${col.border}22`
                          : "none",
                      background: "rgba(4,9,20,.6)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: T.greyLight,
                      }}
                    >
                      {row.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: col.text,
                      }}
                    >
                      {row[aggCol] === null
                        ? "NaN"
                        : typeof row[aggCol] === "number"
                          ? row[aggCol].toLocaleString()
                          : String(row[aggCol])}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: T.greyDark,
                      }}
                    >
                      {aggCol}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {phase === 3 && (
        <div
          style={{
            animation: "fadeUp .3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div>
              <SL>BEFORE — {DF_EMPLOYEES.length} rows</SL>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {keys.map((k, gi) => {
                  const col = dc(k);
                  const v = agg(grouped[k]);
                  return (
                    <div
                      key={k}
                      style={{
                        border: `1px solid ${col.border}`,
                        borderRadius: 8,
                        overflow: "hidden",
                        animation: `fadeUp .3s ease ${gi * 50}ms both`,
                      }}
                    >
                      <div
                        style={{
                          padding: "4px 10px",
                          background: col.bg,
                          fontSize: 9,
                          color: col.text,
                          fontFamily: "monospace",
                          fontWeight: 700,
                        }}
                      >
                        {k} ({grouped[k].length} rows)
                      </div>
                      <div
                        style={{
                          padding: "5px 10px",
                          background: "rgba(4,9,20,.5)",
                          fontSize: 9,
                          color: T.greyDark,
                          fontFamily: "monospace",
                        }}
                      >
                        → .{aggFn}("{aggCol}") = {v}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                paddingTop: 20,
                fontSize: 16,
                color: T.cyan,
                textAlign: "center",
              }}
            >
              →
              <div
                style={{
                  fontSize: 7,
                  color: T.greyDark,
                  fontFamily: "monospace",
                }}
              >
                collapse
              </div>
            </div>
            <div>
              <SL c={T.cyan}>AFTER — {keys.length} rows</SL>
              <div
                style={{
                  border: `1px solid ${T.slate}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    padding: "5px 10px",
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: T.greyDark,
                      fontFamily: "monospace",
                    }}
                  >
                    {grpCol}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: T.cyan,
                      fontFamily: "monospace",
                    }}
                  >
                    {aggCol}_{aggFn}
                  </span>
                </div>
                {keys.map((k, gi) => {
                  const col = dc(k);
                  const v = agg(grouped[k]);
                  return (
                    <div
                      key={k}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        padding: "8px 10px",
                        borderBottom:
                          gi < keys.length - 1
                            ? `1px solid ${T.slate}44`
                            : "none",
                        background: col.bg,
                        animation: `popIn .4s ease ${gi * 80}ms both`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: col.text,
                          fontWeight: 700,
                        }}
                      >
                        {k}
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          fontFamily: "monospace",
                          color: col.text,
                          fontWeight: 800,
                        }}
                      >
                        {String(v)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 9,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              >
                {DF_EMPLOYEES.length} rows → {keys.length} rows
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AggTransformVisual() {
  const [mode, setMode] = useState("agg");
  const mean =
    DF_EMPLOYEES.reduce((s, r) => s + r.salary, 0) / DF_EMPLOYEES.length;
  const deptMean = Object.fromEntries(
    [...new Set(DF_EMPLOYEES.map((r) => r.dept))].map((d) => [
      d,
      Math.round(
        DF_EMPLOYEES.filter((r) => r.dept === d).reduce(
          (s, r) => s + r.salary,
          0,
        ) / DF_EMPLOYEES.filter((r) => r.dept === d).length,
      ),
    ]),
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Compare .agg() (collapses rows) vs .transform() (keeps original shape).
        This is one of the most important GroupBy distinctions.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        {["agg", "transform"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "5px 14px",
              borderRadius: 7,
              border: "none",
              background: mode === m ? "rgba(96,165,250,.14)" : "transparent",
              color: mode === m ? T.blue : T.grey,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: mode === m ? 700 : 400,
            }}
          >
            .{m}()
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <PyBlock
          code={
            mode === "agg"
              ? `# .agg() — COLLAPSES rows:\n# Input: 10 rows\n# Output: N rows (one per group)\n\nresult = df.groupby("dept")["salary"].agg(["mean","min","max"])\n#              mean    min    max\n# dept\n# Analytics   72000  69000  75000\n# Engineering 89250  85000  93000\n# Product     68000  65000  71000\n\n# Named aggregations:\ndf.groupby("dept").agg(\n    avg_sal = ("salary", "mean"),\n    headcount = ("id", "count"),\n)`
              : `# .transform() — KEEPS original shape:\n# Input: 10 rows\n# Output: 10 rows (same index)\n\n# Great for adding a column based on group stats:\ndf["dept_avg"] = df.groupby("dept")["salary"].transform("mean")\n\n# Now calculate deviation from dept average:\ndf["vs_dept_avg"] = df["salary"] - df["dept_avg"]\n\n# Use case: normalise within groups,\n# flag outliers, compute % of dept total`
          }
          label="pandas"
        />
        <div>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    name
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    dept
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      fontSize: 9,
                      color: T.greyDark,
                    }}
                  >
                    salary
                  </th>
                  {mode === "transform" && (
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.cyan,
                      }}
                    >
                      dept_avg
                    </th>
                  )}
                  {mode === "transform" && (
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.green,
                      }}
                    >
                      vs_avg
                    </th>
                  )}
                  {mode === "agg" && (
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.greyDark,
                      }}
                    >
                      →
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {mode === "agg"
                  ? Object.entries(deptMean)
                      .sort()
                      .map(([d, m], i) => (
                        <tr
                          key={d}
                          style={{
                            borderBottom:
                              i < 2 ? `1px solid ${T.slate}33` : "none",
                            background: dc(d).bg,
                          }}
                        >
                          <td
                            colSpan={3}
                            style={{
                              padding: "5px 8px",
                              fontSize: 10,
                              color: dc(d).text,
                              fontWeight: 700,
                            }}
                          >
                            {d}
                          </td>
                          <td
                            style={{
                              padding: "5px 8px",
                              fontSize: 10,
                              color: T.cyan,
                              fontWeight: 700,
                            }}
                          >
                            {m.toLocaleString()}
                          </td>
                        </tr>
                      ))
                  : DF_EMPLOYEES.slice(0, 8).map((r, i) => {
                      const dAvg = deptMean[r.dept];
                      const diff = r.salary - dAvg;
                      return (
                        <tr
                          key={r.id}
                          style={{
                            borderBottom:
                              i < 7 ? `1px solid ${T.slate}22` : "none",
                          }}
                        >
                          <td
                            style={{
                              padding: "4px 8px",
                              fontSize: 9,
                              color: T.greyLight,
                            }}
                          >
                            {r.name.split(" ")[0]}
                          </td>
                          <td
                            style={{
                              padding: "4px 8px",
                              fontSize: 9,
                              color: dc(r.dept).text,
                            }}
                          >
                            {r.dept.slice(0, 3)}
                          </td>
                          <td
                            style={{
                              padding: "4px 8px",
                              fontSize: 9,
                              color: T.greyLight,
                            }}
                          >
                            {r.salary.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "4px 8px",
                              fontSize: 9,
                              color: T.cyan,
                              fontWeight: 700,
                            }}
                          >
                            {dAvg.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "4px 8px",
                              fontSize: 9,
                              color: diff > 0 ? T.green : T.red,
                              fontWeight: 700,
                            }}
                          >
                            {diff > 0 ? "+" : ""}
                            {diff.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "7px 10px",
              borderRadius: 8,
              background: `${T.blue}09`,
              border: `1px solid ${T.blue}25`,
              fontSize: 10,
              color: T.greyLight,
            }}
          >
            <strong style={{ color: T.blue }}>
              {mode === "agg" ? "agg()" : "transform()"}:{" "}
            </strong>
            {mode === "agg"
              ? "3 rows out — one per department."
              : "Still 10 rows — but each row now knows its dept average."}
          </div>
        </div>
      </div>
    </div>
  );
}

function Module07() {
  return (
    <Course
      intro={{
        explain:
          "GroupBy implements the split-apply-combine pattern: split your data into groups based on the values in one or more columns, apply a function to each group independently, then combine the results into a single summary table. This maps directly to SQL's GROUP BY. It transforms a table of individual records into a summary — headcount by department, average salary by team, total revenue by month — and is the core operation in most reporting work.",
        learn: [
          "Group a DataFrame by one or more columns and apply aggregation functions",
          "Use named aggregations to produce clean, readable output column names",
          "Understand the difference between .agg() which collapses rows and .transform() which keeps the original shape",
          "Chain groupby with sorting and filtering to answer business questions directly",
        ],
        concepts: [
          "groupby('dept')['salary'].mean() — the result has dept as the INDEX, not a column",
          "Add .reset_index() to turn the group key back into a regular column after groupby",
          ".agg() reduces N rows to 1 per group — use for summaries",
          ".transform() broadcasts the group result back to every original row — use to add a dept average to each employee row",
        ],
        why: "Aggregation is the core of most reporting and analysis. Understanding why your row count changes, what reset_index() does, and when to use transform() vs agg() are the skills that separate junior analysts from experienced ones.",
      }}
      c={T.cyan}
      steps={[
        {
          title: "GroupBy journey",
          desc: "GroupBy works in three phases. First, split: pandas divides the DataFrame into groups based on the unique values in the groupby column — all Engineering rows form one group, all Analytics rows another. Second, apply: a function (mean, sum, count, etc.) runs independently on each group. Third, combine: the results are assembled into a new DataFrame, one row per group. Step through all four phases below to see this process play out visually on the employee data.",
          content: () => <GroupByJourney />,
        },
        {
          title: ".agg() vs .transform()",
          desc: ".agg() and .transform() are both used after groupby but they do fundamentally different things. .agg() collapses each group into a single summary row — if you have 10 employees in 3 departments, .agg() gives you 3 rows back. .transform() keeps the original shape — it returns a value for every original row, broadcasting the group result back. Use .agg() to build a summary table. Use .transform() when you want to add a group statistic (like department average salary) as a new column on the original DataFrame.",
          content: () => <AggTransformVisual />,
        },
        {
          title: ".agg() patterns",
          desc: "Named aggregations are the cleanest way to use .agg(). Instead of passing a list of function names, you pass keyword arguments where the keyword becomes the output column name and the value is a tuple of (source_column, function). This gives you full control over output column names without renaming afterwards. You can also apply custom lambda functions as aggregators — for example computing the salary range within each department as lambda x: x.max() - x.min().",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                .agg() is the most flexible aggregation tool. Learn to name your
                output columns and apply multiple functions at once.
              </Note>
              <PyBlock
                label="pandas — agg() mastery"
                code={`# Multiple functions on one column:\ndf.groupby("dept")["salary"].agg(["mean","min","max","count","std"])\n\n# Named aggregations (clean output column names):\nresult = df.groupby("dept").agg(\n    headcount    = ("id",     "count"),\n    avg_salary   = ("salary", "mean"),\n    salary_range = ("salary", lambda x: x.max() - x.min()),\n    avg_score    = ("score",  "mean"),\n    active_count = ("active", "sum"),  # True counts as 1\n).round(1)\n\n# pivot_table — GroupBy with tabular output:\npd.pivot_table(\n    df,\n    values="salary",\n    index="dept",\n    aggfunc=["mean","count"]\n)\n\n# Multi-level groupby:\ndf.groupby(["dept","active"])["salary"].mean()`}
              />
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM
              mistakes={[
                {
                  title: "Forgetting .reset_index() after groupby",
                  wrong: `result = df.groupby("dept")["salary"].mean()\nresult["dept"]  # KeyError! dept is the INDEX, not a column`,
                  right: `result = df.groupby("dept")["salary"].mean().reset_index()\nresult["dept"]  # ✓ now it's a column`,
                  why: "After groupby().agg(), the group column becomes the DataFrame index, not a column. Add .reset_index() to promote it back to a regular column — required for most downstream operations.",
                },
                {
                  title: "Using .agg() when you want .transform()",
                  wrong: `# Trying to add dept avg to original df:\ndf["dept_avg"] = df.groupby("dept")["salary"].agg("mean")\n# ValueError: wrong shape!`,
                  right: `# .transform() keeps the original shape:\ndf["dept_avg"] = df.groupby("dept")["salary"].transform("mean")\n# ✓ broadcasts group value to each row`,
                  why: ".agg() collapses to one row per group. .transform() returns a Series with the same length as the input, broadcasting the group statistic to every row in that group.",
                },
              ]}
            />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.cyan}
              questions={[
                {
                  question: "df.groupby('dept')['salary'].mean() returns what?",
                  options: [
                    "A DataFrame with dept as a column",
                    "A Series with dept as the index",
                    "A list of mean salaries",
                    "A dict",
                  ],
                  correct: 1,
                  explanation:
                    "groupby().mean() returns a Series where the group key (dept) is the index, not a column. Add .reset_index() to turn it into a DataFrame with dept as a regular column.",
                },
                {
                  type: "bug",
                  question: "What's wrong?",
                  code: `df["dept_avg"] = df.groupby("dept")["salary"].agg("mean")`,
                  options: [
                    "agg should be transform",
                    "mean is wrong function",
                    "groupby needs reset_index",
                    "Nothing is wrong",
                  ],
                  correct: 0,
                  explanation:
                    ".agg('mean') reduces 10 rows to 3 (one per dept). You can't assign that back to a 10-row DataFrame — shapes don't match. Use .transform('mean') which returns 10 values, broadcasting each dept's mean to all its rows.",
                },
                {
                  type: "output",
                  question: "What does this produce?",
                  code: `df.groupby("dept").agg(\n    n = ("id", "count"),\n    avg = ("salary", "mean")\n)`,
                  options: [
                    "A Series",
                    "A DataFrame with dept as index, n and avg as columns",
                    "A dict",
                    "An error",
                  ],
                  correct: 1,
                  explanation:
                    "Named aggregations with .agg() return a DataFrame. The group column (dept) becomes the index. n and avg become the column names. Add .reset_index() to get dept as a column.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 08: MERGING ───────────────────────────────────────────────────────
function MergeAnimator() {
  const [how, setHow] = useState("inner");
  const [phase, setPhase] = useState(0);
  const timer = useRef(null);
  const LEFT = [
    { emp_id: 1, name: "Amara", dept_id: 10 },
    { emp_id: 2, name: "Bola", dept_id: 20 },
    { emp_id: 3, name: "Chidi", dept_id: 10 },
    { emp_id: 4, name: "Dami", dept_id: 99 },
  ];
  const RIGHT = [
    { dept_id: 10, dept_name: "Engineering", budget: 500000 },
    { dept_id: 20, dept_name: "Analytics", budget: 300000 },
    { dept_id: 30, dept_name: "Product", budget: 250000 },
  ];
  const HOW = {
    inner: { c: T.blue, desc: "Only rows with dept_id in BOTH tables" },
    left: {
      c: T.green,
      desc: "ALL left rows + matching right (NaN if no right match)",
    },
    right: {
      c: T.orange,
      desc: "ALL right rows + matching left (NaN if no left match)",
    },
    outer: {
      c: T.purple,
      desc: "ALL rows from both tables — NaN where no match",
    },
  };
  const h = HOW[how];
  const getResult = () => {
    if (how === "inner")
      return LEFT.filter((l) => RIGHT.some((r) => r.dept_id === l.dept_id)).map(
        (l) => {
          const r = RIGHT.find((r) => r.dept_id === l.dept_id);
          return {
            emp_id: l.emp_id,
            name: l.name,
            dept_id: l.dept_id,
            dept_name: r.dept_name,
            budget: r.budget,
          };
        },
      );
    if (how === "left")
      return LEFT.map((l) => {
        const r = RIGHT.find((r) => r.dept_id === l.dept_id);
        return {
          emp_id: l.emp_id,
          name: l.name,
          dept_id: l.dept_id,
          dept_name: r?.dept_name ?? null,
          budget: r?.budget ?? null,
        };
      });
    if (how === "right") {
      const matched = RIGHT.map((r) => {
        const ls = LEFT.filter((l) => l.dept_id === r.dept_id);
        return ls.length
          ? ls.map((l) => ({
              emp_id: l.emp_id,
              name: l.name,
              dept_id: r.dept_id,
              dept_name: r.dept_name,
              budget: r.budget,
            }))
          : [];
      }).flat();
      const unmatched = RIGHT.filter(
        (r) => !LEFT.some((l) => l.dept_id === r.dept_id),
      ).map((r) => ({
        emp_id: null,
        name: null,
        dept_id: r.dept_id,
        dept_name: r.dept_name,
        budget: r.budget,
      }));
      return [...matched, ...unmatched];
    }
    if (how === "outer") {
      const l_res = LEFT.map((l) => {
        const r = RIGHT.find((r) => r.dept_id === l.dept_id);
        return {
          emp_id: l.emp_id,
          name: l.name,
          dept_id: l.dept_id,
          dept_name: r?.dept_name ?? null,
          budget: r?.budget ?? null,
        };
      });
      const r_only = RIGHT.filter(
        (r) => !LEFT.some((l) => l.dept_id === r.dept_id),
      ).map((r) => ({
        emp_id: null,
        name: null,
        dept_id: r.dept_id,
        dept_name: r.dept_name,
        budget: r.budget,
      }));
      return [...l_res, ...r_only];
    }
    return [];
  };
  const result = getResult();
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setPhase(0);
    let p = 0;
    timer.current = setInterval(() => {
      p++;
      setPhase(p);
      if (p >= 2) clearInterval(timer.current);
    }, 700);
  };
  const lSurvives = (l) =>
    how === "right" ? RIGHT.some((r) => r.dept_id === l.dept_id) : true;
  const rSurvives = (r) =>
    how === "left"
      ? LEFT.some((l) => l.dept_id === r.dept_id)
      : how === "inner"
        ? LEFT.some((l) => l.dept_id === r.dept_id)
        : true;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">
        Select a merge type, then click Animate. Rows that don't find a match
        dim out — the result shows what survives.
      </Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {Object.entries(HOW).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setHow(k);
              setPhase(0);
              if (timer.current) clearInterval(timer.current);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: 700,
              border: `1px solid ${how === k ? v.c : "rgba(255,255,255,.07)"}`,
              background: how === k ? `${v.c}12` : "rgba(255,255,255,.02)",
              color: how === k ? v.c : T.grey,
              transition: "all .2s",
            }}
          >
            how="{k}"
          </button>
        ))}
      </div>
      <div
        style={{
          background: `${h.c}09`,
          border: `1px solid ${h.c}25`,
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: 11,
          color: T.greyLight,
        }}
      >
        <strong style={{ color: h.c }}>"{how}" merge:</strong> {h.desc}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <div>
          <SL c={T.blue}>LEFT: employees</SL>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              borderRadius: 8,
              border: "1px solid rgba(96,165,250,.2)",
              overflow: "hidden",
            }}
          >
            {LEFT.map((r, i) => {
              const s = lSurvives(r);
              return (
                <div
                  key={i}
                  style={{
                    padding: "7px 10px",
                    borderBottom:
                      i < LEFT.length - 1 ? `1px solid ${T.slate}33` : "none",
                    display: "flex",
                    gap: 8,
                    background:
                      phase > 0 && s ? "rgba(96,165,250,.08)" : "transparent",
                    opacity: phase > 0 ? (s ? 1 : 0.2) : 1,
                    transition: "all .4s",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: T.greyDark,
                      fontFamily: "monospace",
                    }}
                  >
                    #{r.emp_id}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: T.blue,
                      flex: 1,
                    }}
                  >
                    {r.name}
                  </span>
                  <Badge c={s ? T.cyan : T.greyDark}>dept:{r.dept_id}</Badge>
                  {phase > 0 && (
                    <span
                      style={{ fontSize: 8, color: s ? T.green : T.greyDark }}
                    >
                      {s ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            paddingTop: 22,
            textAlign: "center",
            fontSize: 14,
            color: h.c,
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          pd.merge
          <div style={{ fontSize: 7, color: T.greyDark, marginTop: 2 }}>
            on="dept_id"
          </div>
        </div>
        <div>
          <SL c={T.green}>RIGHT: departments</SL>
          <div
            style={{
              background: "rgba(4,9,20,.85)",
              borderRadius: 8,
              border: "1px solid rgba(74,222,128,.2)",
              overflow: "hidden",
            }}
          >
            {RIGHT.map((r, i) => {
              const s = rSurvives(r);
              return (
                <div
                  key={i}
                  style={{
                    padding: "7px 10px",
                    borderBottom:
                      i < RIGHT.length - 1 ? `1px solid ${T.slate}33` : "none",
                    display: "flex",
                    gap: 8,
                    background:
                      phase > 1 && s ? "rgba(74,222,128,.07)" : "transparent",
                    opacity: phase > 1 ? (s ? 1 : 0.2) : 1,
                    transition: "all .4s",
                    alignItems: "center",
                  }}
                >
                  <Badge c={s ? T.cyan : T.greyDark}>id:{r.dept_id}</Badge>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: T.green,
                      flex: 1,
                    }}
                  >
                    {r.dept_name}
                  </span>
                  {phase > 1 && (
                    <span
                      style={{ fontSize: 8, color: s ? T.green : T.greyDark }}
                    >
                      {s ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={play}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 700,
            border: `1px solid ${h.c}55`,
            background: `${h.c}12`,
            color: h.c,
          }}
        >
          ▶ Animate
        </button>
        <button
          onClick={() => {
            if (timer.current) clearInterval(timer.current);
            setPhase(0);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            border: `1px solid ${T.slate}`,
            background: "transparent",
            color: T.grey,
          }}
        >
          Reset
        </button>
      </div>
      {phase >= 1 && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          <SL c={h.c}>RESULT — {result.length} rows</SL>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(4,9,20,.9)",
                    borderBottom: `1px solid ${T.slate}`,
                  }}
                >
                  {Object.keys(result[0] || {}).map((c) => (
                    <th
                      key={c}
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        fontSize: 9,
                        color: T.greyDark,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{
                      borderBottom:
                        ri < result.length - 1
                          ? `1px solid ${T.slate}33`
                          : "none",
                      animation: `rowAppear .3s ease ${ri * 50}ms both`,
                    }}
                  >
                    {Object.values(row).map((v, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "5px 8px",
                          fontSize: 10,
                          color: v === null ? T.red : T.greyLight,
                          fontStyle: v === null ? "italic" : "normal",
                        }}
                      >
                        {v === null ? "NaN" : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PyBlock
            code={`employees.merge(departments, on="dept_id", how="${how}")\n# ${result.length} rows returned`}
            label="pandas"
          />
        </div>
      )}
    </div>
  );
}

function ConcatVisual() {
  const [axis, setAxis] = useState(0);
  const DF1 = [
    { id: 1, name: "Amara", dept: "Engineering" },
    { id: 2, name: "Bola", dept: "Analytics" },
  ];
  const DF2 = [
    { id: 11, name: "Kwame", dept: "Engineering" },
    { id: 12, name: "Nana", dept: "Product" },
  ];
  const SCORES = [{ score: 88 }, { score: 72 }];
  const resultAxis0 = [...DF1, ...DF2];
  const resultAxis1 = DF1.map((r, i) => ({ ...r, ...SCORES[i] }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Switch between axis=0 (stack rows) and axis=1 (add columns). These are
        fundamentally different operations.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        <button
          onClick={() => setAxis(0)}
          style={{
            padding: "5px 14px",
            borderRadius: 7,
            border: "none",
            background: axis === 0 ? "rgba(34,211,238,.14)" : "transparent",
            color: axis === 0 ? T.cyan : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: axis === 0 ? 700 : 400,
          }}
        >
          axis=0 (rows)
        </button>
        <button
          onClick={() => setAxis(1)}
          style={{
            padding: "5px 14px",
            borderRadius: 7,
            border: "none",
            background: axis === 1 ? "rgba(34,211,238,.14)" : "transparent",
            color: axis === 1 ? T.cyan : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: axis === 1 ? 700 : 400,
          }}
        >
          axis=1 (columns)
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <SL c={axis === 0 ? T.cyan : T.blue}>
            {"df1" + (axis === 1 ? " + scores" : "")}
          </SL>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {(axis === 0
              ? DF1
              : DF1.map((r, i) => ({ ...r, ...SCORES[i] }))
            ).map((r, i, a) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 6,
                  padding: "5px 10px",
                  borderBottom:
                    i < a.length - 1 ? `1px solid ${T.slate}33` : "none",
                  background: "rgba(96,165,250,.05)",
                }}
              >
                {Object.entries(
                  axis === 0 ? r : { id: r.id, name: r.name, dept: r.dept },
                ).map(([k, v]) => (
                  <span
                    key={k}
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: T.blue,
                      flex: 1,
                    }}
                  >
                    {k}:{String(v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {axis === 1 && (
            <div style={{ marginTop: 6 }}>
              <SL c={T.green}>+ scores</SL>
              <div
                style={{
                  border: `1px solid ${T.slate}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {SCORES.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 10px",
                      borderBottom: i < 1 ? `1px solid ${T.slate}33` : "none",
                      background: "rgba(74,222,128,.04)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: T.green,
                      }}
                    >
                      score:{r.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {axis === 0 && (
            <div style={{ marginTop: 6 }}>
              <SL c={T.green}>df2</SL>
              <div
                style={{
                  border: `1px solid ${T.slate}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {DF2.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 6,
                      padding: "5px 10px",
                      borderBottom:
                        i < DF2.length - 1 ? `1px solid ${T.slate}33` : "none",
                      background: "rgba(74,222,128,.04)",
                    }}
                  >
                    {Object.entries(r).map(([k, v]) => (
                      <span
                        key={k}
                        style={{
                          fontSize: 9,
                          fontFamily: "monospace",
                          color: T.green,
                          flex: 1,
                        }}
                      >
                        {k}:{String(v)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", fontSize: 16, color: T.cyan }}>
          →
          <div
            style={{ fontSize: 7, color: T.greyDark, fontFamily: "monospace" }}
          >
            concat
          </div>
        </div>
        <div>
          <SL c={T.cyan}>RESULT</SL>
          <div
            style={{
              border: `1px solid ${T.cyan}44`,
              borderRadius: 8,
              overflow: "hidden",
              background: "rgba(34,211,238,.04)",
            }}
          >
            {(axis === 0 ? resultAxis0 : resultAxis1).map((r, i, a) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 6,
                  padding: "5px 10px",
                  borderBottom:
                    i < a.length - 1 ? `1px solid ${T.slate}33` : "none",
                  animation: `rowAppear .3s ease ${i * 60}ms both`,
                }}
              >
                {Object.entries(r).map(([k, v]) => (
                  <span
                    key={k}
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: T.cyan,
                      flex: 1,
                    }}
                  >
                    {k}:{String(v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <PyBlock
        code={
          axis === 0
            ? `# axis=0 — stack rows (same columns):\nresult = pd.concat([df1, df2], ignore_index=True)\n# ignore_index=True resets the index: 0,1,2,3...\n\n# Without ignore_index:\nresult = pd.concat([df1, df2])\n# Index may have duplicates from original dfs`
            : `# axis=1 — add columns (same rows):\nresult = pd.concat([df1, scores], axis=1)\n# df1 and scores must have same number of rows\n# or matching index values`
        }
        label="pandas — pd.concat"
      />
    </div>
  );
}

function Module08() {
  return (
    <Course
      intro={{
        explain:
          "Merging (joining) combines two DataFrames by matching rows on shared key column values — exactly like SQL JOINs. The join type controls which rows survive. An inner join keeps only rows that exist in both tables. A left join keeps every row from the left table and fills NaN for any columns from the right table where no match was found. Getting the join type wrong is a silent bug — no error, just wrong counts or missing data.",
        learn: [
          "Perform inner, left, right, and outer merges and understand what rows each produces",
          "Use pd.concat() to stack DataFrames vertically (more rows) or horizontally (more columns)",
          "Handle mismatched key column names using left_on= and right_on=",
          "Use validate= to detect unexpected many-to-many relationships that would inflate your row count",
        ],
        concepts: [
          "merge() joins on column values — the pandas version of a SQL JOIN",
          "pd.concat([df1, df2]) stacks DataFrames — axis=0 adds rows, axis=1 adds columns",
          "Left join: all left rows are kept; right columns become NaN where no match is found",
          "A many-to-many join multiplies rows — always check result.shape after a merge",
        ],
        why: "Data lives in multiple tables. Merging them correctly is unavoidable. A wrong join type silently drops rows or inflates counts, producing analysis that looks correct but gives wrong answers.",
      }}
      c={T.green}
      steps={[
        {
          title: "Merge animator",
          desc: "A merge (join) combines two DataFrames by finding rows where a key column has matching values. The syntax is left.merge(right, on='key', how='type'). The how parameter is the most important choice. inner returns only rows where the key exists in both tables. left returns all rows from the left table; right columns are NaN where no match exists. right is the reverse. outer returns every row from both tables; missing values on either side become NaN. Select a join type and hit Animate to see which rows survive.",
          content: () => <MergeAnimator />,
        },
        {
          title: "pd.concat",
          desc: "pd.concat() is not a join — it does not match on keys. It simply glues DataFrames together. With axis=0 (the default) it stacks DataFrames vertically, adding more rows — all DataFrames must have the same columns. With axis=1 it adds columns side by side — both DataFrames must have the same number of rows or matching index values. Always pass ignore_index=True when stacking rows if you want a clean 0, 1, 2... index instead of duplicated index values from the originals.",
          content: () => <ConcatVisual />,
        },
        {
          title: "Merge patterns",
          desc: "Real merges involve a few common complications. If the key columns have different names in each DataFrame, use left_on= and right_on= instead of on=. For composite keys (matching on multiple columns at once), pass a list to on=. The validate= parameter catches data quality issues: validate='many_to_one' raises an error if any key in the left DataFrame matches more than one row in the right — a check that prevents silent row multiplication. When merged columns have the same name, pandas appends _x and _y by default; use suffixes= to control those names.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.green}>
                Real merges often involve different column names, multiple keys,
                or needing to detect mismatches.
              </Note>
              <PyBlock
                label="pandas — merge patterns"
                code={`# Different column names:\nemployees.merge(departments,\n    left_on="dept_id",\n    right_on="department_id"\n)\n\n# Multiple keys:\ndf.merge(other, on=["year","month","dept"])\n\n# Detect merge mismatches (validate):\ndf.merge(lookup, on="id", validate="many_to_one")\n# Raises if any id in df maps to multiple rows in lookup\n# Options: "one_to_one","one_to_many","many_to_one","many_to_many"\n\n# Suffixes for overlapping column names:\ndf.merge(other, on="id",\n    suffixes=("_emp","_dept")\n)\n# salary_emp, salary_dept instead of salary_x, salary_y\n\n# Merge on index:\ndf.merge(other, left_index=True, right_index=True)`}
              />
              <Warn>
                Many-to-many merges create explosive row counts. Always check{" "}
                <code>result.shape</code> after a merge to catch unexpected row
                multiplication.
              </Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.green}
              questions={[
                {
                  question:
                    "how='left' — what happens to left rows with no match?",
                  options: [
                    "They are dropped",
                    "They appear with NaN in right columns",
                    "MergeError is raised",
                    "They get duplicated",
                  ],
                  correct: 1,
                  explanation:
                    "With how='left', ALL rows from the left DataFrame are kept. For rows with no match in the right DataFrame, the columns that came from the right are filled with NaN.",
                },
                {
                  type: "bug",
                  question:
                    "A developer wants to stack two DataFrames. What's wrong?",
                  code: `combined = df_2023.merge(df_2024)`,
                  options: [
                    "merge needs on= parameter",
                    "pd.concat should be used to stack rows",
                    "Should use df.join()",
                    "axis=0 is missing",
                  ],
                  correct: 1,
                  explanation:
                    "merge() joins on shared key columns — it's for widening a table. To stack DataFrames with the same columns (add rows), use pd.concat([df1, df2], ignore_index=True).",
                },
                {
                  type: "output",
                  question:
                    "left has 5 rows, right has 3 rows. how='inner'. Max possible output rows?",
                  options: ["5", "3", "15", "8"],
                  correct: 1,
                  explanation:
                    "An inner merge only keeps matching rows. The maximum is limited by the smaller side (3). But if there are multiple matches (many-to-many), you could get more rows than either side.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 09: DATA CLEANING ─────────────────────────────────────────────────
function NullHeatmap() {
  const [showFix, setShowFix] = useState(false);
  const cols = ["id", "name", "dept", "salary", "hired", "active", "score"];
  const nullMap = Object.fromEntries(
    cols.map((c) => [c, DF_EMPLOYEES.map((r) => r[c] === null)]),
  );
  const nullCt = (c) => nullMap[c].filter(Boolean).length;
  const totalNulls = cols.reduce((s, c) => s + nullCt(c), 0);
  const meanScore =
    DF_EMPLOYEES.filter((r) => r.score !== null).reduce(
      (s, r) => s + r.score,
      0,
    ) / DF_EMPLOYEES.filter((r) => r.score !== null).length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Red cells = NaN. See which columns have nulls. Click "Show fix" to see
        each null filled with the column mean.
      </Hint>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge c={totalNulls > 0 ? T.red : T.green}>
          {totalNulls} NaN values
        </Badge>
        <button
          onClick={() => setShowFix(!showFix)}
          style={{
            padding: "4px 12px",
            borderRadius: 8,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            border: `1px solid ${T.green}44`,
            background: showFix ? `${T.green}14` : "transparent",
            color: T.green,
            fontWeight: 700,
          }}
        >
          {showFix ? "← Raw" : "Show fix →"}
        </button>
      </div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: `1px solid ${T.slate}`,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(4,9,20,.9)",
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              <th
                style={{
                  padding: "5px 8px",
                  textAlign: "left",
                  fontSize: 9,
                  color: T.greyDark,
                }}
              >
                #
              </th>
              {cols.map((c) => (
                <th key={c} style={{ padding: "5px 8px", textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: nullCt(c) > 0 ? T.red : T.greyDark,
                    }}
                  >
                    {c}
                  </div>
                  {nullCt(c) > 0 && (
                    <div style={{ fontSize: 7, color: T.red }}>
                      ({nullCt(c)} NaN)
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DF_EMPLOYEES.map((row, ri) => (
              <tr
                key={row.id}
                style={{
                  borderBottom:
                    ri < DF_EMPLOYEES.length - 1
                      ? `1px solid ${T.slate}22`
                      : "none",
                }}
              >
                <td
                  style={{ padding: "3px 8px", fontSize: 9, color: T.greyDark }}
                >
                  {ri}
                </td>
                {cols.map((c) => {
                  const isNull = row[c] === null;
                  const fixedVal =
                    showFix && isNull && c === "score"
                      ? meanScore.toFixed(1) + " (mean)"
                      : null;
                  return (
                    <td
                      key={c}
                      style={{
                        padding: "3px 8px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        background:
                          isNull && !showFix
                            ? "rgba(248,113,113,.15)"
                            : isNull && showFix
                              ? "rgba(74,222,128,.1)"
                              : "transparent",
                        color:
                          isNull && !showFix
                            ? T.red
                            : isNull && showFix
                              ? T.green
                              : T.greyLight,
                        fontStyle: isNull && !showFix ? "italic" : "normal",
                        transition: "all .3s",
                      }}
                    >
                      {isNull && !showFix
                        ? "NaN"
                        : isNull && showFix
                          ? fixedVal || "filled"
                          : c === "salary"
                            ? row[c].toLocaleString()
                            : String(row[c])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFix && (
        <PyBlock
          label="pandas — handling NaN"
          code={`# Detect:\ndf.isnull().sum()        # count per column\ndf.isnull().sum() / len(df) * 100  # % missing\n\n# Fill strategies:\ndf["score"] = df["score"].fillna(df["score"].mean())   # mean\ndf["score"] = df["score"].fillna(df["score"].median()) # median (robust to outliers)\ndf["score"] = df["score"].fillna(method="ffill")       # forward fill (time series)\ndf["score"] = df["score"].fillna(0)                    # constant\n\n# Drop rows:\ndf.dropna()                          # any null in any column\ndf.dropna(subset=["score","salary"]) # only if these are null\ndf.dropna(thresh=5)                  # keep rows with >= 5 non-null values`}
        />
      )}
    </div>
  );
}

function DtypeFixerVisual() {
  const MESSY = [
    {
      id: 1,
      salary: "85,000",
      hired: "March 15, 2021",
      active: "Yes",
      score: "88.5",
    },
    {
      id: 2,
      salary: "72000",
      hired: "2020-07-22",
      active: "true",
      score: "72",
    },
    {
      id: 3,
      salary: "$91,000",
      hired: "Nov 1st 2019",
      active: "1",
      score: "92.0",
    },
    { id: 4, salary: "68k", hired: "01/10/2022", active: "No", score: "N/A" },
  ];
  const [showFixed, setShowFixed] = useState(false);
  const FIXED = [
    { id: 1, salary: 85000, hired: "2021-03-15", active: true, score: 88.5 },
    { id: 2, salary: 72000, hired: "2020-07-22", active: true, score: 72.0 },
    { id: 3, salary: 91000, hired: "2019-11-01", active: true, score: 92.0 },
    { id: 4, salary: 68000, hired: "2022-01-10", active: false, score: null },
  ];
  const DTYPE_FIXES = [
    {
      col: "salary",
      problem: "Commas, $, k suffix",
      fix: `df["salary"] = df["salary"].str.replace(r"[^0-9]","",regex=True).astype(int)`,
    },
    {
      col: "hired",
      problem: "Mixed date formats",
      fix: `df["hired"] = pd.to_datetime(df["hired"])`,
    },
    {
      col: "active",
      problem: "Yes/No/1/true strings",
      fix: `df["active"] = df["active"].map({"Yes":True,"No":False,"true":True,"1":True,"false":False,"0":False})`,
    },
    {
      col: "score",
      problem: "N/A string",
      fix: `df["score"] = pd.to_numeric(df["score"], errors="coerce")`,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>
        Toggle "Show cleaned" to see messy real-world data transformed into
        correct Python types. This is what data cleaning actually looks like.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        <button
          onClick={() => setShowFixed(false)}
          style={{
            padding: "4px 14px",
            borderRadius: 7,
            border: "none",
            background: !showFixed ? "rgba(248,113,113,.14)" : "transparent",
            color: !showFixed ? T.red : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: !showFixed ? 700 : 400,
          }}
        >
          😬 Raw (messy)
        </button>
        <button
          onClick={() => setShowFixed(true)}
          style={{
            padding: "4px 14px",
            borderRadius: 7,
            border: "none",
            background: showFixed ? "rgba(74,222,128,.14)" : "transparent",
            color: showFixed ? T.green : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: showFixed ? 700 : 400,
          }}
        >
          ✅ Cleaned
        </button>
      </div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: `1px solid ${showFixed ? T.green : T.red}44`,
          transition: "border .3s",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(4,9,20,.9)",
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              {Object.keys(MESSY[0]).map((c) => (
                <th key={c} style={{ padding: "5px 10px", textAlign: "left" }}>
                  <div
                    style={{ fontSize: 9, color: showFixed ? T.green : T.red }}
                  >
                    {c}
                  </div>
                  {!showFixed && (
                    <div style={{ fontSize: 7, color: T.greyDark }}>
                      object (str)
                    </div>
                  )}
                  {showFixed && (
                    <div style={{ fontSize: 7, color: T.green }}>
                      {c === "salary"
                        ? "int64"
                        : c === "active"
                          ? "bool"
                          : c === "score"
                            ? "float64"
                            : c === "id"
                              ? "int64"
                              : "datetime64"}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(showFixed ? FIXED : MESSY).map((row, ri) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: ri < 3 ? `1px solid ${T.slate}33` : "none",
                  animation: "rowAppear .25s ease",
                }}
              >
                {Object.values(row).map((v, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "5px 10px",
                      fontSize: 10,
                      color:
                        v === null
                          ? T.red
                          : showFixed && ci > 0
                            ? T.green
                            : ci > 0
                              ? T.orange
                              : T.greyLight,
                      fontWeight: showFixed && ci > 0 ? 700 : 400,
                    }}
                  >
                    {v === null ? "NaN" : String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFixed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <SL c={T.green}>FIXES APPLIED</SL>
          {DTYPE_FIXES.map((fix, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${T.slate}`,
                borderRadius: 8,
                padding: "8px 12px",
                background: "rgba(4,9,20,.7)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 4,
                  alignItems: "center",
                }}
              >
                <Badge c={T.green}>{fix.col}</Badge>
                <span style={{ fontSize: 9, color: T.grey }}>
                  {fix.problem}
                </span>
              </div>
              <code
                style={{ fontSize: 9, color: T.cyan, fontFamily: "monospace" }}
              >
                {fix.fix}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Module09() {
  return (
    <Course
      intro={{
        explain:
          "Data cleaning fixes problems in your data before you analyse it. Problems fall into four main categories: missing values (NaN — a cell has no value), wrong data types (a salary column stored as text instead of a number), duplicate rows (the same record appearing twice), and outliers (extreme values that distort statistics like the mean). Skipping cleaning means every analysis downstream is built on a broken foundation.",
        learn: [
          "Detect missing values and choose the right strategy — fill or drop, and with what value",
          "Convert columns to their correct data types at load time or during a cleaning step",
          "Find and remove duplicate rows, keeping the right occurrence when duplicates exist",
          "Identify and cap or remove outliers using the industry-standard IQR method",
        ],
        concepts: [
          "df.isnull().sum() counts nulls per column — always run this before writing any analysis",
          "pd.to_numeric(col, errors='coerce') converts strings to numbers; unparseable values become NaN instead of raising an error",
          "fillna(df['col'].median()) — median is more robust than mean when outliers are present",
          "df.drop_duplicates(subset=['id']) — deduplicate on the key column, not all columns",
        ],
        why: "Real data is always messy — nulls from system migrations, mixed formats from different teams, duplicates from flawed ETL. No analysis is trustworthy without cleaning first. Experienced practitioners check dtypes and nulls before writing a single analysis line.",
      }}
      c={T.yellow}
      steps={[
        {
          title: "Null heatmap",
          desc: "NaN (Not a Number) is how pandas represents a missing value. A cell is NaN when data was not collected, failed to load, or could not be parsed. NaN values propagate silently — adding NaN to any number gives NaN — so an undetected null can corrupt an entire column of calculations. The first step in any cleaning workflow is df.isnull().sum() to count nulls per column. Then you decide: fill them (fillna), drop the rows (dropna), or flag them. The right choice depends on why the data is missing.",
          content: () => <NullHeatmap />,
        },
        {
          title: "Dtype fixer",
          desc: "When pandas loads a CSV it infers column types. If a numeric column contains any non-numeric value like N/A or $85,000 it falls back to object (string) dtype. A string column cannot be averaged, sorted numerically, or used in arithmetic — operations silently fail or raise errors. Fixing dtypes is always one of the first cleaning steps. pd.to_numeric(col, errors='coerce') converts a column to numbers and turns any unparseable value into NaN instead of raising an error. pd.to_datetime() does the same for dates.",
          content: () => <DtypeFixerVisual />,
        },
        {
          title: "Outliers & duplicates",
          desc: "An outlier is a value so extreme it distorts aggregate statistics. A salary of 5,000,000 in a dataset of employees earning 60-90k would make the mean useless. The IQR (Interquartile Range) method defines outliers as values more than 1.5 times the IQR below Q1 or above Q3 — the same definition used by box plots. A duplicate row is a record that appears more than once, inflating counts and totals. df.duplicated() identifies them; df.drop_duplicates() removes them, keeping the first occurrence by default.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.yellow}>
                Outliers silently corrupt averages. Duplicates inflate counts.
                Both are invisible without explicit checks.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <SL>OUTLIER DETECTION</SL>
                  <PyBlock
                    code={`# Z-score method:\nfrom scipy import stats\nz = stats.zscore(df["salary"])\noutliers = df[abs(z) > 3]\n\n# IQR method (robust):\nQ1 = df["salary"].quantile(0.25)\nQ3 = df["salary"].quantile(0.75)\nIQR = Q3 - Q1\noutliers = df[\n    (df["salary"] < Q1 - 1.5*IQR) |\n    (df["salary"] > Q3 + 1.5*IQR)\n]\n\n# Cap outliers instead of dropping:\ndf["salary"] = df["salary"].clip(\n    lower=Q1 - 1.5*IQR,\n    upper=Q3 + 1.5*IQR\n)`}
                  />
                </div>
                <div>
                  <SL>DUPLICATES</SL>
                  <PyBlock
                    code={`# Check:\ndf.duplicated().sum()           # count\ndf[df.duplicated(keep=False)]   # show all copies\n\n# Drop — keep first occurrence:\ndf.drop_duplicates(inplace=True)\n\n# Drop on specific columns:\ndf.drop_duplicates(subset=["name","dept"])\n\n# Keep most recent (last):\ndf.sort_values("hired", ascending=False)\n  .drop_duplicates(subset=["name"], keep="first")\n\n# Full cleaning pipeline:\ndf = (\n    pd.read_csv("employees.csv")\n    .drop_duplicates(subset=["id"])\n    .dropna(subset=["salary"])\n    .reset_index(drop=True)\n)`}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.yellow}
              questions={[
                {
                  question:
                    "pd.to_numeric(df['col'], errors='coerce') — what happens to 'N/A' values?",
                  options: [
                    "ValueError is raised",
                    "'N/A' stays as a string",
                    "'N/A' becomes NaN",
                    "Row is dropped",
                  ],
                  correct: 2,
                  explanation:
                    "errors='coerce' converts unparseable values to NaN instead of raising an error. This is the standard approach for messy numeric columns with text like 'N/A', 'unknown', or '#VALUE!'.",
                },
                {
                  type: "bug",
                  question: "What's wrong with this deduplication?",
                  code: `df.drop_duplicates()`,
                  options: [
                    "Missing inplace=True or assignment",
                    "This removes rows where ALL columns match — may not be what you want",
                    "drop_duplicates doesn't exist",
                    "Should use .unique() instead",
                  ],
                  correct: 1,
                  explanation:
                    "Without subset=, drop_duplicates checks ALL columns. Two rows are only considered duplicates if every column matches. Usually you want to dedup on a key column: df.drop_duplicates(subset=['emp_id']).",
                },
                {
                  question:
                    "Why use .median() for filling nulls instead of .mean()?",
                  options: [
                    "Median is always more accurate",
                    "Mean is affected by outliers; median is more robust to extreme values",
                    "Median is faster to compute",
                    "No difference",
                  ],
                  correct: 1,
                  explanation:
                    "If a column has outliers (e.g., one salary of 5M among employees earning 70-90k), the mean is pulled high. The median (middle value) is unaffected by outliers — it's a better central tendency for skewed distributions.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 10: STRING OPERATIONS ─────────────────────────────────────────────
function StrAccessorVisual() {
  const [input, setInput] = useState("  Amara Osei - Engineering  ");
  const OPS = [
    {
      fn: ".strip()",
      fn2: (s) => s.trim(),
      c: T.cyan,
      desc: "Remove whitespace from both ends",
    },
    {
      fn: ".upper()",
      fn2: (s) => s.toUpperCase(),
      c: T.blue,
      desc: "All uppercase",
    },
    {
      fn: ".lower()",
      fn2: (s) => s.toLowerCase(),
      c: T.green,
      desc: "All lowercase",
    },
    {
      fn: ".title()",
      fn2: (s) =>
        s.replace(
          /\w\S*/g,
          (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
        ),
      c: T.yellow,
      desc: "Capitalise each word",
    },
    {
      fn: ".split('-')",
      fn2: (s) => JSON.stringify(s.split("-").map((x) => x.trim())),
      c: T.purple,
      desc: "Split on delimiter",
    },
    {
      fn: ".replace('-',' ')",
      fn2: (s) => s.replace(/-/g, " "),
      c: T.orange,
      desc: "Replace substring",
    },
    { fn: "len()", fn2: (s) => s.length, c: T.red, desc: "Character count" },
    {
      fn: ".strip().split()",
      fn2: (s) => JSON.stringify(s.trim().split(/\s+/)),
      c: T.pink,
      desc: "Strip then split on whitespace",
    },
  ];
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Type any text in the input. Hover each .str method card to see it
        applied to your text instantly.
      </Hint>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            fontSize: 11,
            color: T.green,
            fontFamily: "monospace",
            flexShrink: 0,
          }}
        >
          s =
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid rgba(74,222,128,.35)",
            background: T.bg,
            color: T.green,
            fontSize: 11,
            fontFamily: "monospace",
            outline: "none",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
        }}
      >
        {OPS.map((op) => {
          let res;
          try {
            res = op.fn2(input);
          } catch {
            res = "error";
          }
          return (
            <div
              key={op.fn}
              onMouseEnter={() => setHover(op.fn)}
              onMouseLeave={() => setHover(null)}
              style={{
                border: `1px solid ${hover === op.fn ? op.c : T.slate}`,
                borderRadius: 9,
                padding: "10px 12px",
                cursor: "default",
                background:
                  hover === op.fn ? `${op.c}0d` : "rgba(255,255,255,.02)",
                transition: "all .2s",
              }}
            >
              <code
                style={{
                  fontSize: 11,
                  color: op.c,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 3,
                }}
              >
                str{op.fn}
              </code>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.white,
                  fontFamily: "'JetBrains Mono',monospace",
                  marginBottom: 3,
                  wordBreak: "break-all",
                  lineHeight: 1.3,
                }}
              >
                {String(res)}
              </div>
              <div style={{ fontSize: 9, color: T.greyDark }}>{op.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Module10() {
  return (
    <Course
      intro={{
        explain:
          "String operations let you clean, extract, and transform text columns. In pandas, every string method on a column goes through the .str accessor — it applies the method to every cell in the column at once, with no loop. This covers basic cleaning like removing whitespace and changing case, splitting composite fields like full name into first and last name, extracting data from messy strings, and filtering rows based on text patterns.",
        learn: [
          "Use .str accessor methods to clean an entire text column in one line",
          "Split a full name column into separate first and last name columns",
          "Filter rows using .str.contains() with plain strings or regex patterns",
          "Extract structured data from messy strings using .str.extract() with a regex capture group",
        ],
        concepts: [
          "Always call .str before any string method on a Series — without it you get AttributeError",
          "str.strip() removes leading and trailing whitespace — apply to every text column on load",
          "str.split().str[0] extracts the first word — you can chain .str calls to navigate into split results",
          "str.contains('pattern') returns a boolean mask that you use inside df[...] to filter rows",
        ],
        why: "Messy text is one of the most common real-world data problems. Names with extra spaces, mixed case categories, composite fields. The .str accessor turns what would be a 20-line loop into a single readable operation across the whole column.",
      }}
      c={T.green}
      steps={[
        {
          title: "String methods live",
          desc: "Python strings have many built-in methods. .strip() removes whitespace from both ends — call this on any user-input or CSV-loaded text column. .upper() and .lower() normalise case. .split(delimiter) breaks a string into a list of parts. .replace(old, new) substitutes substrings. len(s) returns the character count. In pandas these all go through the .str accessor: df['name'].str.upper() applies .upper() to every cell in the column. Type any text in the input and hover each method card to see it applied instantly.",
          content: () => <StrAccessorVisual />,
        },
        {
          title: "Pandas .str accessor",
          desc: "The .str accessor is what makes string operations in pandas fast and readable. Without it, you would need a loop or .apply(). With it, df['name'].str.strip() cleans an entire column in one line. You can chain .str operations: df['name'].str.split().str[0] splits every name on whitespace and then picks the first element — giving you a first name column. df['name'].str[0] takes the first character of every string. Any method that works on a Python string can be called through .str on a pandas Series.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.green}>
                Pandas exposes string methods through{" "}
                <code style={{ color: T.green }}>Series.str</code> — applies to
                the entire column at once. No loops needed.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <PyBlock
                  label="Common .str operations"
                  code={`df["name"].str.upper()\ndf["name"].str.len()\ndf["name"].str.split()\ndf["name"].str[0]          # first char\ndf["name"].str.strip()\ndf["name"].str.startswith("A")\ndf["dept"].str.contains("Eng")\ndf["name"].str.replace("Nwosu","N.")\n\n# Split and access parts:\ndf["first"] = df["name"].str.split().str[0]\ndf["last"]  = df["name"].str.split().str[-1]\n\n# Regex extract:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")`}
                />
                <div>
                  <div
                    style={{
                      overflowX: "auto",
                      borderRadius: 8,
                      border: `1px solid ${T.slate}`,
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 10px",
                        background: "rgba(4,9,20,.9)",
                        borderBottom: `1px solid ${T.slate}`,
                        fontSize: 9,
                        color: T.greyDark,
                        fontFamily: "monospace",
                      }}
                    >
                      df["name"].str.split().str[0] → first_name
                    </div>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                          {["name", "first", "last"].map((c) => (
                            <th
                              key={c}
                              style={{
                                padding: "5px 8px",
                                textAlign: "left",
                                fontSize: 9,
                                color: T.greyDark,
                              }}
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DF_EMPLOYEES.slice(0, 5).map((r, i) => (
                          <tr
                            key={r.id}
                            style={{
                              borderBottom:
                                i < 4 ? `1px solid ${T.slate}33` : "none",
                            }}
                          >
                            <td
                              style={{
                                padding: "4px 8px",
                                fontSize: 10,
                                color: T.greyLight,
                              }}
                            >
                              {r.name}
                            </td>
                            <td
                              style={{
                                padding: "4px 8px",
                                fontSize: 10,
                                color: T.green,
                                fontWeight: 700,
                              }}
                            >
                              {r.name.split(" ")[0]}
                            </td>
                            <td
                              style={{
                                padding: "4px 8px",
                                fontSize: 10,
                                color: T.green,
                              }}
                            >
                              {r.name.split(" ").slice(-1)[0]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Regex in pandas",
          desc: "pandas integrates regex through the .str accessor so you can apply patterns to entire columns without loops. str.contains(r'pattern') returns a boolean Series for filtering — use it inside df[...]. str.extract(r'(group)') creates a new column containing the first match of the capture group in each cell — cells with no match become NaN. str.replace(r'pattern', '', regex=True) removes all matches. str.extractall() finds all matches per cell. Always pass regex=True explicitly when the pattern is a regex, not a literal string.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.teal}>
                Regular expressions let you match patterns in text — essential
                for cleaning messy data. The .str accessor supports regex
                natively.
              </Note>
              <PyBlock
                label="pandas regex patterns"
                code={`# contains() — filter rows by pattern:\ndf[df["name"].str.contains(r"Nwosu|Osei")]  # OR\ndf[df["email"].str.contains(r"@company\\.com")]\n\n# extract() — pull matching groups:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")\ndf["first_name"] = df["name"].str.extract(r"^(\\w+)")\n\n# replace() with regex:\ndf["salary_clean"] = df["salary_raw"].str.replace(\n    r"[^0-9]", "", regex=True\n).astype(int)\n\n# extractall() — multiple matches per row:\ndf["phone"].str.extractall(r"(\\d{3}-\\d{4})")\n\n# Useful patterns:\n# r"\\d+"     — one or more digits\n# r"\\w+"     — one or more word chars\n# r"^\\s+"    — leading whitespace\n# r"\\s+$"    — trailing whitespace\n# r"[A-Z]+"  — uppercase letters only`}
              />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.green}
              questions={[
                {
                  question:
                    "How do you check if each name in df['name'] contains 'Nwosu'?",
                  options: [
                    "'Nwosu' in df['name']",
                    "df['name'] == 'Nwosu'",
                    "df['name'].str.contains('Nwosu')",
                    "df['name'].contains('Nwosu')",
                  ],
                  correct: 2,
                  explanation:
                    "The .str accessor gives vectorised string operations. df['name'].str.contains('Nwosu') returns a boolean Series. Without .str, you'd get AttributeError — 'Series' object has no attribute 'contains'.",
                },
                {
                  type: "bug",
                  question: "What's wrong?",
                  code: `df["first"] = df["name"].split().str[0]`,
                  options: [
                    "str[0] should be str[-1]",
                    "Need .str before .split(): df['name'].str.split().str[0]",
                    "Should use .extract() instead",
                    "Nothing is wrong",
                  ],
                  correct: 1,
                  explanation:
                    "On a Series, string methods must go through the .str accessor: df['name'].str.split(). Without .str, Python tries to call .split() directly on the Series object, which raises AttributeError.",
                },
                {
                  question:
                    "What does df['salary_raw'].str.replace(r'[^0-9]', '', regex=True) do?",
                  options: [
                    "Removes all characters",
                    "Removes all non-numeric characters (keeps only digits)",
                    "Replaces 0-9 with empty string",
                    "Removes spaces only",
                  ],
                  correct: 1,
                  explanation:
                    "[^0-9] in regex means 'any character that is NOT a digit'. Replacing it with '' (empty string) removes all non-digits. So '$85,000' becomes '85000'. Then .astype(int) converts to integer.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 11: DATES & TIMES ─────────────────────────────────────────────────
function DatetimeExplorer() {
  const [dateStr, setDateStr] = useState("2024-03-15");
  const [offset, setOffset] = useState(45);
  let d,
    valid = true;
  try {
    d = new Date(dateStr);
    valid = !isNaN(d.getTime());
  } catch {
    valid = false;
  }
  const future = valid ? new Date(d.getTime() + offset * 86400000) : null;
  const PARTS = valid
    ? [
        { fn: ".year", val: d.getFullYear(), c: T.blue },
        { fn: ".month", val: d.getMonth() + 1, c: T.cyan },
        { fn: ".day", val: d.getDate(), c: T.green },
        { fn: ".weekday()", val: d.getDay(), c: T.yellow },
        {
          fn: ".day_name()",
          val: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
          c: T.orange,
        },
        { fn: ".quarter", val: Math.ceil((d.getMonth() + 1) / 3), c: T.purple },
        { fn: ".week", val: Math.ceil(d.getDate() / 7), c: T.pink },
        {
          fn: ".dayofyear",
          val: Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000),
          c: T.teal,
        },
      ]
    : [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Type any date below. All extractions and date arithmetic update
        instantly.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL c={T.blue}>INPUT DATE</SL>
            <input
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="YYYY-MM-DD"
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 8,
                border: `1px solid ${valid ? "rgba(96,165,250,.35)" : "rgba(248,113,113,.35)"}`,
                background: T.bg,
                color: valid ? T.blue : T.red,
                fontSize: 12,
                fontFamily: "'JetBrains Mono',monospace",
                outline: "none",
              }}
            />
            {!valid && (
              <div
                style={{
                  fontSize: 9,
                  color: T.red,
                  marginTop: 3,
                  fontFamily: "monospace",
                }}
              >
                Invalid date — try YYYY-MM-DD
              </div>
            )}
          </div>
          {valid && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                animation: "popIn .2s ease",
              }}
            >
              {PARTS.map((p) => (
                <div
                  key={p.fn}
                  style={{
                    border: `1px solid ${p.c}33`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    background: `${p.c}08`,
                  }}
                >
                  <code
                    style={{
                      fontSize: 9,
                      color: p.c,
                      fontFamily: "monospace",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    dt{p.fn}
                  </code>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: T.white,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {String(p.val)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL c={T.green}>
              DATE ARITHMETIC — {offset > 0 ? "+" : ""}
              {offset} days
            </SL>
            <input
              type="range"
              min={-365}
              max={365}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              style={{ width: "100%", accentColor: T.green, marginBottom: 4 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 9,
                fontFamily: "monospace",
                color: T.greyDark,
              }}
            >
              <span>-365</span>
              <span style={{ color: T.green, fontWeight: 700 }}>
                {offset > 0 ? "+" : ""}
                {offset} days
              </span>
              <span>+365</span>
            </div>
          </div>
          {valid && future && (
            <div
              style={{
                border: "1px solid rgba(74,222,128,.3)",
                borderRadius: 10,
                padding: "12px",
                background: "rgba(74,222,128,.06)",
                animation: "popIn .2s ease",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  marginBottom: 4,
                }}
              >
                {dateStr} {offset > 0 ? "+" : ""}
                {offset} days =
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: T.green,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {future.toISOString().slice(0, 10)}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  marginTop: 2,
                }}
              >
                {
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    future.getDay()
                  ]
                }
              </div>
            </div>
          )}
          {valid && (
            <PyBlock
              label="pandas"
              code={`from datetime import date\nimport pandas as pd\n\ndt = pd.to_datetime("${dateStr}")\n\ndt.year    # ${d.getFullYear()}\ndt.month   # ${d.getMonth() + 1}\ndt.day     # ${d.getDate()}\ndt.day_name()  # "${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()]}"\n\ndt + pd.Timedelta(days=${offset})\n# → ${future?.toISOString().slice(0, 10) || "NaT"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TenureCalculator() {
  const now = new Date("2024-12-01");
  const withTenure = DF_EMPLOYEES.map((e) => {
    const hired = new Date(e.hired);
    const days = Math.floor((now - hired) / 86400000);
    return {
      ...e,
      hired_dt: e.hired,
      tenure_days: days,
      tenure_years: Math.round((days / 365.25) * 10) / 10,
    };
  }).sort((a, b) => b.tenure_days - a.tenure_days);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        This shows a real tenure calculation on all 10 employees — the most
        common datetime operation in HR/people analytics.
      </Hint>
      <PyBlock
        label="pandas — tenure calculation"
        code={`df["hired"] = pd.to_datetime(df["hired"])\ntoday = pd.Timestamp("now")\n\n# Tenure in days:\ndf["tenure_days"] = (today - df["hired"]).dt.days\n\n# Tenure in years (accounting for leap years):\ndf["tenure_years"] = (df["tenure_days"] / 365.25).round(1)\n\n# Year, month, quarter of hire:\ndf["hire_year"]    = df["hired"].dt.year\ndf["hire_quarter"] = df["hired"].dt.quarter\ndf["hire_month"]   = df["hired"].dt.month_name()\n\n# Filter: hired in last 2 years:\ncutoff = today - pd.Timedelta(days=730)\nrecent = df[df["hired"] >= cutoff]`}
      />
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: `1px solid ${T.slate}`,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(4,9,20,.9)",
                borderBottom: `1px solid ${T.slate}`,
              }}
            >
              {["name", "dept", "hired", "tenure_days", "tenure_years"].map(
                (c) => (
                  <th
                    key={c}
                    style={{
                      padding: "5px 10px",
                      textAlign: "left",
                      fontSize: 9,
                      color: ["tenure_days", "tenure_years"].includes(c)
                        ? T.cyan
                        : T.greyDark,
                    }}
                  >
                    {c}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {withTenure.map((r, i) => (
              <tr
                key={r.id}
                style={{
                  borderBottom:
                    i < withTenure.length - 1
                      ? `1px solid ${T.slate}22`
                      : "none",
                  background:
                    r.tenure_years > 4 ? "rgba(74,222,128,.04)" : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "5px 10px",
                    fontSize: 10,
                    color: T.greyLight,
                  }}
                >
                  {r.name}
                </td>
                <td
                  style={{
                    padding: "5px 10px",
                    fontSize: 10,
                    color: dc(r.dept).text,
                  }}
                >
                  {r.dept}
                </td>
                <td
                  style={{
                    padding: "5px 10px",
                    fontSize: 10,
                    color: T.greyDark,
                  }}
                >
                  {r.hired_dt}
                </td>
                <td
                  style={{
                    padding: "5px 10px",
                    fontSize: 10,
                    color: T.cyan,
                    fontWeight: 700,
                  }}
                >
                  {r.tenure_days.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "5px 10px",
                    fontSize: 10,
                    color: T.cyan,
                    fontWeight: 700,
                  }}
                >
                  {r.tenure_years}y
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Module11() {
  return (
    <Course
      intro={{
        explain:
          "Dates come in dozens of formats and carry hidden complexity — arithmetic must account for varying month lengths and leap years, and components like year, quarter, and weekday are only accessible once Python knows the column is a date, not a plain string. The key first step is always converting string date columns to datetime64 dtype with pd.to_datetime(). After that, the .dt accessor unlocks every date operation you need.",
        learn: [
          "Convert string date columns to datetime64 dtype using pd.to_datetime()",
          "Extract year, month, quarter, weekday, and other parts using the .dt accessor",
          "Calculate durations between two dates to get tenure, invoice age, or days overdue",
          "Resample a time series into monthly or quarterly summaries using .resample()",
        ],
        concepts: [
          "If df['hired'].dtype shows as object (string), none of the .dt operations will work — always convert first",
          "pd.to_datetime(df['hired']) converts the column in place; parse_dates=['hired'] in read_csv() converts at load time",
          "Subtracting two Timestamps returns a Timedelta object — access .dt.days to get an integer",
          "resample('ME').size() counts events per calendar month — like groupby but built for time periods",
        ],
        why: "HR, finance, and product analytics all depend on date operations. Tenure, churn timing, monthly revenue trends, seasonality. Analysts who cannot handle dates are blocked on a large proportion of real business questions.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Datetime explorer",
          desc: "Before you can do anything with a date column, pandas needs to know it is a date and not a string. pd.to_datetime(df['col']) converts it. Once converted, the .dt accessor unlocks all date components. dt.year, dt.month, dt.day extract the obvious parts. dt.day_name() gives Monday, Tuesday etc. dt.quarter gives 1-4. dt.dayofyear gives the day number within the year (1-365). You can also do arithmetic: adding a pd.Timedelta(days=30) shifts every date forward by 30 days. Type any date below to see all extractions update live.",
          content: () => <DatetimeExplorer />,
        },
        {
          title: "Tenure calculator",
          desc: "The most common datetime operation in HR and people analytics is calculating how long something has been running — employee tenure, account age, days since last purchase. The pattern is: convert to datetime, subtract the earlier date from the later date, which gives a Timedelta, then access .dt.days for the integer number of days. Dividing by 365.25 gives years (accounting for leap years). The table below shows this calculation applied to every employee, sorted by longest tenure.",
          content: () => <TenureCalculator />,
        },
        {
          title: "Resample & periods",
          desc: "Resampling is groupby for time series. Instead of grouping by a category like department, you group by a time period — every month, every quarter, every week. df.resample('ME', on='date').size() counts rows per month. You can use any aggregation: .sum(), .mean(), .first(). The period alias string controls the bucket size: 'ME' for month end, 'QE' for quarter end, 'W' for week, 'D' for day. Note: pandas 2.2 changed the aliases from M and Q to ME and QE — the old ones still work but show a deprecation warning.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>
                <code style={{ color: T.cyan }}>resample()</code> is groupby for
                time series — group rows into time buckets (monthly, quarterly,
                etc.).
              </Note>
              <PyBlock
                label="pandas — time series"
                code={`df["hired"] = pd.to_datetime(df["hired"])\n\n# Resample = group by time period:\nhires_by_month = df.resample("ME", on="hired").size()\nhires_by_quarter = df.resample("QE", on="hired").size()\nhires_by_year = df.resample("YE", on="hired").size()\n\n# Period aliases (new in pandas 2.2):\n# "ME" = month end,  "QE" = quarter end\n# "YE" = year end,   "W"  = weekly\n# "D"  = daily,      "h"  = hourly\n\n# Rolling windows:\ndf["salary_3mo_avg"] = df.set_index("hired")["salary"].rolling("90D").mean()\n\n# Date ranges:\npd.date_range("2023-01-01", periods=12, freq="ME")\n# DatetimeIndex(['2023-01-31', '2023-02-28', ...])`}
              />
              <Warn>
                The resample() period alias changed in pandas 2.2: use{" "}
                <code>ME</code> instead of <code>M</code>, <code>QE</code>{" "}
                instead of <code>Q</code>. The old aliases are deprecated.
              </Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.blue}
              questions={[
                {
                  question:
                    "After df['hired'] = pd.to_datetime(...), how do you get the year from each date?",
                  options: [
                    "df['hired'].year",
                    "df['hired'].dt.year",
                    "df['hired'].str.year",
                    "df.year('hired')",
                  ],
                  correct: 1,
                  explanation:
                    "Once a column is datetime dtype, use the .dt accessor: .dt.year, .dt.month, .dt.day_name(), .dt.quarter. Without .dt you get AttributeError.",
                },
                {
                  type: "output",
                  question: "What does this calculate?",
                  code: `(pd.Timestamp("2024-12-01") - pd.Timestamp("2022-03-15")).days`,
                  options: [
                    "Days between the dates (an integer)",
                    "A Timedelta object",
                    "A DateOffset",
                    "ValueError",
                  ],
                  correct: 0,
                  explanation:
                    "Subtracting two Timestamps returns a Timedelta. Accessing .days on a Timedelta gives the integer number of days between the dates. Here it's approximately 991 days.",
                },
                {
                  type: "bug",
                  question: "Why might this give wrong results?",
                  code: `df["tenure"] = df["hired"].dt.year - 2024`,
                  options: [
                    "Should be pd.Timestamp.now().year",
                    "dt.year gives month, not year",
                    "2024 should be a string",
                    "Missing .days",
                  ],
                  correct: 0,
                  explanation:
                    "Hardcoding 2024 means the calculation is frozen in time — in 2025 this code gives wrong results. Use pd.Timestamp.now().year or (pd.Timestamp.now() - df['hired']).dt.days / 365.25 for a living calculation.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 12: VISUALISATION ─────────────────────────────────────────────────
function ChartBuilder() {
  const [ct, setCt] = useState("bar");
  const CHARTS = [
    { id: "bar", icon: "📊", label: "Bar", desc: "Compare categories" },
    {
      id: "hist",
      icon: "📈",
      label: "Histogram",
      desc: "Distribution of numeric",
    },
    { id: "scatter", icon: "⭕", label: "Scatter", desc: "Two variables" },
    { id: "line", icon: "📉", label: "Line", desc: "Trend over time" },
    {
      id: "box",
      icon: "📦",
      label: "Box Plot",
      desc: "Distribution + outliers",
    },
    { id: "heatmap", icon: "🌡️", label: "Heatmap", desc: "Correlation matrix" },
  ];
  const DEPT_COUNTS = { Engineering: 4, Analytics: 3, Product: 3 };
  const SALARY_BINS = [
    [65000, 70000, 2],
    [70000, 75000, 2],
    [75000, 80000, 1],
    [80000, 85000, 2],
    [85000, 90000, 1],
    [90000, 95000, 2],
  ];
  const SCATTER = DF_EMPLOYEES.filter((r) => r.score !== null);
  const LINE = [
    [2018, 1],
    [2019, 1],
    [2020, 2],
    [2021, 2],
    [2022, 2],
    [2023, 2],
  ];
  const CODE = {
    bar: `import matplotlib.pyplot as plt\n\ncounts = df["dept"].value_counts()\ncolors = ["#60a5fa","#4ade80","#c084fc"]\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.bar(counts.index, counts.values, color=colors)\nax.set_title("Employees by Department")\nax.set_xlabel("Department")\nax.set_ylabel("Count")\nfor i, v in enumerate(counts.values):\n    ax.text(i, v+0.05, str(v), ha="center")\nplt.tight_layout()\nplt.show()`,
    hist: `import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.hist(df["salary"], bins=8, color="#60a5fa",\n        edgecolor="white", alpha=0.8)\nax.set_title("Salary Distribution")\nax.set_xlabel("Salary")\nax.set_ylabel("Frequency")\n\n# Add mean line:\nmean = df["salary"].mean()\nax.axvline(mean, color="#f87171", ls="--",\n           label=f"Mean: {mean:,.0f}")\nax.legend()\nplt.tight_layout()`,
    scatter: `import matplotlib.pyplot as plt\n\ncolor_map = {"Engineering":"#60a5fa",\n             "Analytics":"#4ade80",\n             "Product":"#c084fc"}\ncolors = df["dept"].map(color_map)\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.scatter(df["salary"], df["score"],\n           c=colors, s=100, alpha=0.7)\nfor _, row in df.dropna().iterrows():\n    ax.annotate(row["name"].split()[0],\n                (row["salary"], row["score"]),\n                fontsize=7, alpha=0.7)\nax.set_title("Salary vs Score")\nplt.tight_layout()`,
    line: `import matplotlib.pyplot as plt\n\nhires = df.groupby(\n    df["hired"].dt.year\n).size().reset_index()\nhires.columns = ["year","count"]\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.plot(hires["year"], hires["count"],\n        marker="o", color="#4ade80", lw=2)\nax.fill_between(hires["year"],hires["count"],\n                alpha=0.1, color="#4ade80")\nax.set_title("Hires Per Year")\nplt.grid(alpha=0.3)\nplt.tight_layout()`,
    box: `import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8,5))\ngroups = [df[df["dept"]==d]["salary"].values\n          for d in df["dept"].unique()]\nlabels = df["dept"].unique()\nax.boxplot(groups, labels=labels)\nax.set_title("Salary Distribution by Dept")\nax.set_ylabel("Salary")\n\n# Shows: median, IQR, whiskers, outliers\nplt.tight_layout()`,
    heatmap: `import seaborn as sns\nimport matplotlib.pyplot as plt\n\n# Correlation matrix:\nnumeric = df[["salary","score","id"]]\ncorr = numeric.corr()\n\nfig, ax = plt.subplots(figsize=(6,5))\nsns.heatmap(corr, annot=True, fmt=".2f",\n            cmap="coolwarm", center=0,\n            ax=ax)\nax.set_title("Correlation Heatmap")\nplt.tight_layout()`,
  };
  const barMax = Math.max(...Object.values(DEPT_COUNTS));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Click a chart type to see a live preview of the data and the full
        matplotlib code.
      </Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {CHARTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCt(c.id)}
            style={{
              padding: "5px 11px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${ct === c.id ? T.blue : "rgba(255,255,255,.07)"}`,
              background:
                ct === c.id ? "rgba(96,165,250,.12)" : "rgba(255,255,255,.02)",
              color: ct === c.id ? T.blue : T.grey,
              fontWeight: ct === c.id ? 700 : 400,
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div
          style={{
            background: "rgba(4,9,20,.7)",
            border: `1px solid ${T.slate}`,
            borderRadius: 10,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.white,
              textAlign: "center",
            }}
          >
            {CHARTS.find((c) => c.id === ct)?.desc}
          </div>
          {ct === "bar" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 7,
                marginTop: 4,
              }}
            >
              {Object.entries(DEPT_COUNTS).map(([dept, count]) => (
                <div
                  key={dept}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: dc(dept).text,
                      fontFamily: "monospace",
                      width: 88,
                      flexShrink: 0,
                    }}
                  >
                    {dept}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 20,
                      background: "rgba(255,255,255,.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(count / barMax) * 100}%`,
                        background: dc(dept).text,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          color: "rgba(4,9,20,.9)",
                          fontWeight: 700,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {ct === "hist" && (
            <div
              style={{
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                height: 90,
                marginTop: 4,
              }}
            >
              {SALARY_BINS.map(([lo, hi, n]) => (
                <div
                  key={lo}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 7, color: T.greyDark }}>{n}</span>
                  <div
                    style={{
                      width: "100%",
                      height: `${(n / 2) * 70}px`,
                      background: T.blue,
                      borderRadius: "3px 3px 0 0",
                      opacity: 0.8,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 6,
                      color: T.greyDark,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(lo / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          )}
          {ct === "scatter" && (
            <div style={{ position: "relative", height: 110, marginTop: 4 }}>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: T.slate,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: T.slate,
                }}
              />
              {SCATTER.map((p, i) => {
                const x = ((p.salary - 64000) / (94000 - 64000)) * 88;
                const y = ((p.score - 75) / (100 - 75)) * 90;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${x}%`,
                      bottom: `${y}%`,
                      transform: "translate(-50%,50%)",
                    }}
                  >
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: dc(p.dept).text,
                        opacity: 0.8,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 6,
                        color: T.greyDark,
                        textAlign: "center",
                        fontFamily: "monospace",
                      }}
                    >
                      {p.name.split(" ")[0][0]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {ct === "line" && (
            <div style={{ height: 90, marginTop: 4 }}>
              <svg width="100%" height="90" viewBox="0 0 200 75">
                <polyline
                  points={LINE.map(
                    ([y, v], i) => `${(i / 5) * 180 + 10},${75 - v * 28}`,
                  ).join(" ")}
                  fill="none"
                  stroke={T.green}
                  strokeWidth={2}
                />
                {LINE.map(([y, v], i) => (
                  <g key={y}>
                    <circle
                      cx={(i / 5) * 180 + 10}
                      cy={75 - v * 28}
                      r={3}
                      fill={T.green}
                    />
                    <text
                      x={(i / 5) * 180 + 10}
                      y={73}
                      textAnchor="middle"
                      fontSize={6}
                      fill={T.greyDark}
                    >
                      {y}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
          {ct === "box" && (
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 8,
                alignItems: "flex-end",
              }}
            >
              {Object.entries({
                Engineering: [85, 88, 89.25, 91, 93],
                Analytics: [69, 72, 72, 75, 75],
                Product: [65, 68, 71, 71, 71],
              }).map(([d, v]) => {
                const [mn, q1, med, q3, mx] = v;
                const range = mx - mn;
                const total = 40;
                return (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 24,
                        height: total + 8,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: dc(d).border,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: `${((mx - q3) / range) * total}px`,
                          height: `${((q3 - q1) / range) * total}px`,
                          background: dc(d).bg,
                          border: `1px solid ${dc(d).border}`,
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: `${((mx - med) / range) * total}px`,
                          height: 2,
                          background: dc(d).text,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 7,
                        color: dc(d).text,
                        fontFamily: "monospace",
                      }}
                    >
                      {d.slice(0, 3)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {ct === "heatmap" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 2,
                marginTop: 8,
              }}
            >
              {[
                ["1.00", "0.32", "0.45"],
                ["0.32", "1.00", "0.21"],
                ["0.45", "0.21", "1.00"],
              ].map((row, ri) =>
                row.map((v, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    style={{
                      padding: "6px",
                      textAlign: "center",
                      borderRadius: 4,
                      background: `rgba(96,165,250,${parseFloat(v) * 0.4})`,
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: T.white,
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </div>
                )),
              )}
            </div>
          )}
        </div>
        <PyBlock label="matplotlib" code={CODE[ct]} />
      </div>
    </div>
  );
}

function Module12() {
  return (
    <Course
      intro={{
        explain:
          "matplotlib is Python's core plotting library — when you call df.plot() in pandas, matplotlib runs under the hood. Learning it directly gives you full control over every element of a chart: axes, colours, fonts, annotations, tick marks, and multi-chart layouts. A clear, well-labelled chart communicates a finding in seconds. A chart missing labels or using the wrong type for the data confuses the audience even when the underlying analysis is correct.",
        learn: [
          "Build bar charts, histograms, scatter plots, line charts, and box plots for the right situations",
          "Add titles, axis labels, legends, annotations, and reference lines to any chart",
          "Create multi-panel figures with subplots for side-by-side comparisons",
          "Save charts to file at the correct resolution without labels being cut off",
        ],
        concepts: [
          "fig, ax = plt.subplots() — fig is the whole figure canvas, ax is the set of axes where you draw",
          "ax.set_title(), ax.set_xlabel(), ax.set_ylabel() — always label every axis on every chart",
          "ax.axvline(mean, color='red', ls='--') adds a vertical reference line — useful for showing mean or median",
          "plt.tight_layout() prevents text from being cut off; savefig(..., bbox_inches='tight') for saving to file",
        ],
        why: "Every analysis ends with communication. Stakeholders read charts, not tables of numbers. Producing clear, correctly-labelled visuals quickly is a core part of every analyst, scientist, and engineer's daily work.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Chart builder",
          desc: "matplotlib works through a figure and axes model. plt.subplots() creates a Figure (the entire canvas) and one or more Axes (a single plot area with its own x and y axis). You call methods on the Axes object to draw: ax.bar() for bars, ax.hist() for histogram, ax.scatter() for scatter plot. Always set a title and axis labels — unlabelled charts are almost always misread. Click each chart type to see a preview of the employee data rendered in that form, along with the full code.",
          content: () => <ChartBuilder />,
        },
        {
          title: "Choosing the right chart",
          desc: "Chart choice communicates intent. A bar chart compares categories — department counts, regional revenue. A histogram shows the distribution of a single numeric column — salary range, score spread. A scatter plot reveals the relationship between two numeric variables — does higher salary correlate with higher score? A line chart shows change over time — hires per year. A box plot shows the distribution and spread within groups, including outliers. Choosing the wrong chart makes a correct finding look wrong, or hides a real pattern entirely.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>
                Chart choice communicates intent. Wrong chart = confused
                audience.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    icon: "📊",
                    name: "Bar",
                    when: "Compare categories",
                    avoid: "When you have >10 categories",
                    code: `df["dept"].value_counts().plot(kind="bar")`,
                  },
                  {
                    icon: "📈",
                    name: "Histogram",
                    when: "Distribution of a single numeric column",
                    avoid: "Comparing multiple groups",
                    code: `df["salary"].plot(kind="hist",bins=10)`,
                  },
                  {
                    icon: "⭕",
                    name: "Scatter",
                    when: "Relationship between two numeric columns",
                    avoid: "Categorical data",
                    code: `df.plot.scatter(x="salary",y="score")`,
                  },
                  {
                    icon: "📉",
                    name: "Line",
                    when: "Continuous change over time",
                    avoid: "Non-time categorical data",
                    code: `hires_by_year.plot(kind="line",marker="o")`,
                  },
                  {
                    icon: "📦",
                    name: "Box",
                    when: "Distribution + outliers by group",
                    avoid: "Small datasets (<15 points)",
                    code: `df.boxplot(col="salary",by="dept")`,
                  },
                  {
                    icon: "🥧",
                    name: "Pie",
                    when: "Parts of a whole (max 5 slices)",
                    avoid: "Comparison — bars are almost always better",
                    code: `df["dept"].value_counts().plot(kind="pie")`,
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    style={{
                      border: `1px solid ${T.slate}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      background: T.surface,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{c.icon}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.white,
                        }}
                      >
                        {c.name}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 10, color: T.grey, marginBottom: 2 }}
                    >
                      ✓ {c.when}
                    </div>
                    <div style={{ fontSize: 9, color: T.red, marginBottom: 5 }}>
                      ✗ {c.avoid}
                    </div>
                    <code
                      style={{
                        fontSize: 9,
                        color: T.cyan,
                        fontFamily: "monospace",
                      }}
                    >
                      {c.code}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Subplots & formatting",
          desc: "plt.subplots(1, 2) creates a figure with two side-by-side Axes — axes is then an array you index as axes[0] and axes[1]. plt.suptitle() sets a title for the whole figure, not just one subplot. plt.tight_layout() automatically adjusts spacing so titles and labels do not overlap. plt.savefig('file.png', dpi=150, bbox_inches='tight') saves to disk at print quality. dpi=150 is a good default for slides; dpi=300 for print. bbox_inches='tight' prevents the figure from being cropped at the edges.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>
                Professional charts need titles, labels, and tight_layout.
                Subplots let you show multiple charts in one figure.
              </Note>
              <PyBlock
                label="matplotlib — pro patterns"
                code={`fig, axes = plt.subplots(1, 2, figsize=(12, 4))\n\n# Chart 1 — salary distribution:\naxes[0].hist(df["salary"], bins=8, color="#60a5fa")\naxes[0].set_title("Salary Distribution")\naxes[0].set_xlabel("Salary")\naxes[0].axvline(df["salary"].mean(),\n               color="#f87171", ls="--",\n               label=f\"Mean: {df['salary'].mean():,.0f}\")\naxes[0].legend()\n\n# Chart 2 — scores by department:\nfor dept, grp in df.groupby("dept"):\n    axes[1].scatter(grp["salary"], grp["score"],\n                   label=dept, s=80)\naxes[1].set_title("Salary vs Score by Dept")\naxes[1].legend()\n\nplt.suptitle("Employee Analytics", fontsize=14)\nplt.tight_layout()\nplt.savefig("charts.png", dpi=150, bbox_inches="tight")\nplt.show()`}
              />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.blue}
              questions={[
                {
                  question:
                    "You want to show how employee count is distributed across departments. Best chart?",
                  options: [
                    "Histogram — numeric distribution",
                    "Bar chart — compare category counts",
                    "Scatter — two variables",
                    "Line — over time",
                  ],
                  correct: 1,
                  explanation:
                    "Bar charts compare values across categories. Department is a category, count is numeric — bar chart is the right choice. Histogram is for the distribution of a SINGLE numeric column (like salary range).",
                },
                {
                  question:
                    "df['salary'].plot(kind='hist', bins=10) — what does 'bins=10' control?",
                  options: [
                    "The number of bars (buckets) to group values into",
                    "The x-axis range",
                    "The height of the tallest bar",
                    "The number of data points shown",
                  ],
                  correct: 0,
                  explanation:
                    "bins= controls how many equal-width intervals (buckets) the data is divided into. More bins = finer detail. Fewer bins = broader overview. Default is usually 10.",
                },
                {
                  type: "bug",
                  question: "A chart is cut off when saved. Fix:",
                  code: `plt.savefig("chart.png")`,
                  options: [
                    "Use plt.show() first",
                    "Add bbox_inches='tight' to savefig",
                    "Use fig.save() instead",
                    "Set dpi=72",
                  ],
                  correct: 1,
                  explanation:
                    "Without bbox_inches='tight', matplotlib clips the figure at the canvas boundary, cutting off labels and titles. plt.savefig('chart.png', bbox_inches='tight') ensures the full figure is captured.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 13: LAMBDA & APPLY ────────────────────────────────────────────────
function ApplyAnimator() {
  const [fn, setFn] = useState("tier");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const FNS = {
    tier: {
      label: "classify_tier",
      fn: (r) =>
        r.salary >= 90000
          ? "Senior"
          : r.salary >= 75000
            ? "Mid"
            : r.salary >= 65000
              ? "Junior"
              : "Trainee",
      c: T.purple,
      code: `df["tier"] = df["salary"].apply(\n    lambda s:\n        "Senior" if s >= 90000 else\n        "Mid"    if s >= 75000 else\n        "Junior" if s >= 65000 else "Trainee"\n)\n# axis=0 (default) — one column at a time`,
    },
    bonus: {
      label: "calc_bonus (multi-col)",
      fn: (r) =>
        Math.round(r.salary * (r.score ? (r.score / 100) * 0.1 : 0.05)),
      c: T.green,
      code: `def calc_bonus(row):\n    rate = (row["score"] / 100 * 0.10\n            if pd.notna(row["score"])\n            else 0.05)  # 5% if no score\n    return round(row["salary"] * rate)\n\n# axis=1 for row-wise (multi-column):\ndf["bonus"] = df.apply(calc_bonus, axis=1)`,
    },
    tenure: {
      label: "years_tenure",
      fn: (r) => {
        const y = parseInt(r.hired.slice(0, 4));
        return 2024 - y;
      },
      c: T.orange,
      code: `df["tenure"] = df["hired"].apply(\n    lambda d: 2024 - int(d[:4])\n)\n\n# Better: use datetime:\ndf["tenure"] = (pd.Timestamp("now")\n               - df["hired"]).dt.days // 365`,
    },
  };
  const active = FNS[fn];
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(-1);
    setRunning(true);
    let i = -1;
    timer.current = setInterval(() => {
      i++;
      setStep(i);
      if (i >= DF_EMPLOYEES.length - 1) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 350);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">
        Select a function type, then Animate to watch .apply() work row by row.
        Each row lights up as the function executes on it.
      </Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {Object.entries(FNS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setFn(k);
              setStep(-1);
              setRunning(false);
              if (timer.current) clearInterval(timer.current);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${fn === k ? v.c : "rgba(255,255,255,.07)"}`,
              background: fn === k ? `${v.c}12` : "rgba(255,255,255,.02)",
              color: fn === k ? v.c : T.grey,
              fontWeight: fn === k ? 700 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PyBlock code={active.code} label="pandas — .apply()" />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={play}
              disabled={running}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 10,
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
                border: `1px solid ${active.c}55`,
                background: running ? `${active.c}06` : `${active.c}12`,
                color: running ? T.grey : active.c,
              }}
            >
              {running ? "⚙️ Running..." : "▶ Animate"}
            </button>
            <button
              onClick={() => {
                if (timer.current) clearInterval(timer.current);
                setStep(-1);
                setRunning(false);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "monospace",
                border: `1px solid ${T.slate}`,
                background: "transparent",
                color: T.grey,
              }}
            >
              Reset
            </button>
          </div>
          <Tip icon="⚡" title="PERFORMANCE RULE" c={T.yellow}>
            .apply() has Python-level overhead per row. For &gt;100k rows,
            prefer: <strong>arithmetic</strong> (df*2), <strong>.str</strong>{" "}
            methods, <strong>np.where()</strong>, or <strong>pd.cut()</strong>.
            Use .apply() only when the logic needs multiple columns or complex
            conditionals.
          </Tip>
        </div>
        <div>
          <SL c={active.c}>ROW-BY-ROW</SL>
          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${T.slate}`,
              overflow: "hidden",
            }}
          >
            {DF_EMPLOYEES.map((row, ri) => {
              const res = active.fn(row);
              const done = step >= ri;
              const curr = step === ri;
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr 0.9fr",
                    padding: "5px 10px",
                    borderBottom:
                      ri < DF_EMPLOYEES.length - 1
                        ? `1px solid ${T.slate}33`
                        : "none",
                    background: curr
                      ? `${active.c}18`
                      : done
                        ? `${active.c}07`
                        : "transparent",
                    transition: "all .2s",
                    animation: curr ? "glow .35s ease" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: T.greyLight,
                    }}
                  >
                    {row.name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: T.greyDark,
                    }}
                  >
                    {fn === "bonus"
                      ? `${row.salary.toLocaleString()} / ${row.score || "null"}`
                      : fn === "tenure"
                        ? row.hired.slice(0, 4)
                        : row.salary.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: done ? active.c : T.greyDark,
                      fontWeight: done ? 700 : 400,
                      transition: "color .2s",
                    }}
                  >
                    {done
                      ? String(
                          typeof res === "number" ? res.toLocaleString() : res,
                        )
                      : "—"}
                    {curr && (
                      <span
                        style={{ fontSize: 7, color: active.c, marginLeft: 3 }}
                      >
                        ←
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function VectorisedVisual() {
  const [mode, setMode] = useState("slow");
  const PAIRS = [
    {
      slow: `df["salary"].apply(lambda x: x * 1.1)`,
      fast: `df["salary"] * 1.1`,
      label: "Arithmetic",
      why: "Vectorised NumPy operation — C speed",
    },
    {
      slow: `df["name"].apply(lambda x: x.upper())`,
      fast: `df["name"].str.upper()`,
      label: "String ops",
      why: ".str accessor is vectorised",
    },
    {
      slow: `df["salary"].apply(lambda x: x > 75000)`,
      fast: `df["salary"] > 75000`,
      label: "Comparison",
      why: "Direct comparison on Series",
    },
    {
      slow: `df["salary"].apply(lambda x:\n    "high" if x>80000 else "low")`,
      fast: `import numpy as np\nnp.where(df["salary"]>80000,"high","low")`,
      label: "If/else",
      why: "np.where() vectorised conditional",
    },
    {
      slow: `df["salary"].apply(lambda x:\n    pd.cut([x],[0,70000,80000,95000],\n           labels=["J","M","S"])[0])`,
      fast: `pd.cut(df["salary"],\n       bins=[0,70000,80000,95000],\n       labels=["Junior","Mid","Senior"])`,
      label: "Binning",
      why: "pd.cut() operates on the whole column",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>
        Click SLOW then FAST to see the slower .apply() vs the faster vectorised
        equivalent for each operation type.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: T.surface,
          padding: 3,
          borderRadius: 10,
          border: `1px solid ${T.slate}`,
          alignSelf: "flex-start",
        }}
      >
        <button
          onClick={() => setMode("slow")}
          style={{
            padding: "5px 14px",
            borderRadius: 7,
            border: "none",
            background:
              mode === "slow" ? "rgba(248,113,113,.14)" : "transparent",
            color: mode === "slow" ? T.red : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: mode === "slow" ? 700 : 400,
          }}
        >
          🐌 SLOW (.apply())
        </button>
        <button
          onClick={() => setMode("fast")}
          style={{
            padding: "5px 14px",
            borderRadius: 7,
            border: "none",
            background:
              mode === "fast" ? "rgba(74,222,128,.14)" : "transparent",
            color: mode === "fast" ? T.green : T.grey,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: mode === "fast" ? 700 : 400,
          }}
        >
          ⚡ FAST (vectorised)
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PAIRS.map((p, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${mode === "fast" ? T.green : T.red}33`,
              borderRadius: 9,
              padding: "10px 12px",
              background:
                mode === "fast"
                  ? "rgba(74,222,128,.04)"
                  : "rgba(248,113,113,.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 6,
                alignItems: "center",
              }}
            >
              <Badge c={mode === "fast" ? T.green : T.red}>{p.label}</Badge>
              {mode === "fast" && (
                <span style={{ fontSize: 9, color: T.green }}>{p.why}</span>
              )}
            </div>
            <PyBlock code={mode === "fast" ? p.fast : p.slow} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Module13() {
  return (
    <Course
      intro={{
        explain:
          ".apply() is pandas' escape hatch — it runs any Python function across every element, row, or column of a DataFrame. It is flexible enough to express any logic, but it comes with a real cost: it processes one Python object at a time, losing the compiled speed of vectorised pandas. On 10 rows this does not matter. On 1 million rows it can be 100 times slower than the vectorised equivalent. Knowing when to use it — and when to replace it — is a mark of mature pandas code.",
        learn: [
          "Use .apply() with a lambda or named function on a Series or row-wise on a DataFrame",
          "Use .map() to substitute values in a column using a dictionary",
          "Identify common cases where .apply() can be replaced with np.where(), pd.cut(), or arithmetic",
          "Understand the performance difference between apply and vectorised operations",
        ],
        concepts: [
          "Series.apply(func) passes each scalar value to func — like a Python for loop but on a column",
          "df.apply(func, axis=1) passes each row as a Series — access row['col'] inside the function",
          "lambda x: expression is an anonymous one-line function — suitable for simple transforms",
          "np.where(condition, a, b) is 10-100x faster than apply(lambda x: a if condition else b)",
        ],
        why: "You will reach for .apply() when logic involves multiple columns or complex conditionals that have no direct pandas equivalent. But using it everywhere is a common performance mistake. Knowing the faster alternatives is what separates good pandas code from slow pandas code.",
      }}
      c={T.purple}
      steps={[
        {
          title: "Apply animator",
          desc: ".apply() runs a Python function on every element (Series) or every row or column (DataFrame). For a Series, Series.apply(func) passes each scalar value to func and collects the results. For a DataFrame, df.apply(func, axis=1) passes each row as a Series — inside the function you access values by column name with row['salary']. This is how you write logic that depends on multiple columns at once. Hit Animate to watch the function process each employee row one by one.",
          content: () => <ApplyAnimator />,
        },
        {
          title: "Vectorised alternatives",
          desc: ".apply() runs a Python for loop under the hood — it processes one element at a time in pure Python. Vectorised operations pass the entire array to compiled C code which processes all elements simultaneously. The difference on large datasets is dramatic — 10 to 100 times faster. For most common tasks there is a vectorised equivalent: arithmetic for scaling, .str methods for strings, np.where() for if/else logic, pd.cut() for binning. Switch between SLOW and FAST to see the simpler, faster version of each pattern.",
          content: () => <VectorisedVisual />,
        },
        {
          title: "map() & transform()",
          desc: ".map(), .apply(), and .transform() all transform values but in different ways. .map() on a Series substitutes values using a dict or function — if a key is missing from the dict the result is NaN, which differs from .replace() which leaves unmatched values unchanged. .apply() runs any function — more flexible but slower. .transform() is the group-aware version — it runs inside a groupby and returns a result the same length as the original DataFrame, letting you add group statistics back to every row.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.purple}>
                Three similar methods with different purposes:{" "}
                <code>.map()</code> for Series element substitution,{" "}
                <code>.apply()</code> for custom functions,{" "}
                <code>.transform()</code> for group-preserving operations.
              </Note>
              <PyBlock
                label="pandas — map vs apply vs transform"
                code={`# .map() — substitute values (Series only):\ncolor_map = {"Engineering":"blue","Analytics":"green","Product":"purple"}\ndf["dept_color"] = df["dept"].map(color_map)\n# Rows not in map → NaN\n\n# .replace() — like map but keeps unmapped values:\ndf["dept"].replace({"Engineering": "Eng"})  # others unchanged\n\n# .apply() — custom function, more flexible:\ndf["tier"] = df["salary"].apply(lambda s: "High" if s>80000 else "Low")\ndf["info"] = df.apply(lambda r: f"{r['name']} ({r['dept']})", axis=1)\n\n# .transform() — group-aware, keeps shape:\ndf["dept_avg_salary"] = df.groupby("dept")["salary"].transform("mean")\ndf["pct_of_dept"] = df["salary"] / df["dept_avg_salary"] * 100`}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    fn: ".map(dict)",
                    use: "Lookup / encode categorical",
                    when: "Map one Series to another",
                    ex: "dept → color code",
                  },
                  {
                    fn: ".apply(func)",
                    use: "Custom per-row/col logic",
                    when: "Complex logic, multi-col",
                    ex: "Calculate bonus from salary+score",
                  },
                  {
                    fn: ".transform(fn)",
                    use: "Group-aware, same shape",
                    when: "Add group stats to original df",
                    ex: "Add dept mean salary to every row",
                  },
                ].map((m) => (
                  <div
                    key={m.fn}
                    style={{
                      border: `1px solid ${T.slate}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      background: T.surface,
                    }}
                  >
                    <code
                      style={{
                        fontSize: 11,
                        color: T.purple,
                        fontFamily: "monospace",
                        display: "block",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {m.fn}
                    </code>
                    <div
                      style={{ fontSize: 10, color: T.grey, marginBottom: 3 }}
                    >
                      {m.use}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: T.greyDark,
                        marginBottom: 4,
                      }}
                    >
                      When: {m["when"]}
                    </div>
                    <code
                      style={{
                        fontSize: 9,
                        color: T.cyan,
                        fontFamily: "monospace",
                      }}
                    >
                      {m.ex}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.purple}
              questions={[
                {
                  question:
                    "When should you use .apply(axis=1) vs .apply() (default)?",
                  options: [
                    "When the DataFrame has more than 1000 rows",
                    "When the function needs values from multiple columns in the same row",
                    "When using lambda functions",
                    "When the column has NaN values",
                  ],
                  correct: 1,
                  explanation:
                    "axis=1 applies the function to each ROW, giving access to multiple columns at once (like row['salary'] and row['score']). Default axis=0 applies to each column as a Series. Use axis=1 for multi-column logic.",
                },
                {
                  type: "bug",
                  question: "What's the issue here?",
                  code: `df["upper_name"] = df["name"].apply(str.upper)`,
                  options: [
                    "Should be .str.upper()",
                    "apply(str.upper) doesn't work",
                    "Nothing — this is valid and works",
                    "Missing axis=1",
                  ],
                  correct: 0,
                  explanation:
                    "This actually WORKS — apply(str.upper) passes each value to str.upper. But df['name'].str.upper() is faster (vectorised) and more idiomatic pandas. Prefer .str accessor for string operations.",
                },
                {
                  question:
                    "df['dept'].map({'Engineering':'Eng'}) — what happens to 'Analytics' and 'Product'?",
                  options: [
                    "They stay unchanged",
                    "They become NaN",
                    "KeyError is raised",
                    "They become empty string",
                  ],
                  correct: 1,
                  explanation:
                    ".map() with a dict substitutes matched values and converts unmatched values to NaN. If you want to keep unmapped values unchanged, use .replace() instead.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 14: NUMPY ─────────────────────────────────────────────────────────
function NumpyVisual() {
  const [op, setOp] = useState("create");
  const ARR = [
    85000, 72000, 91000, 68000, 75000, 88000, 71000, 69000, 93000, 65000,
  ];
  const mean = Math.round(ARR.reduce((s, v) => s + v, 0) / ARR.length);
  const std = Math.round(
    Math.sqrt(ARR.reduce((s, v) => s + (v - mean) ** 2, 0) / ARR.length),
  );
  const OPS = {
    create: {
      label: "Create arrays",
      code: `import numpy as np\n\n# From a list:\narr = np.array([85000,72000,91000,68000,75000])\ntype(arr)  # numpy.ndarray\narr.dtype  # int64\narr.shape  # (5,)\n\n# Pre-filled arrays:\nnp.zeros(5)          # [0. 0. 0. 0. 0.]\nnp.ones(5)           # [1. 1. 1. 1. 1.]\nnp.full(5, 42)       # [42 42 42 42 42]\nnp.arange(0,10,2)    # [0 2 4 6 8]\nnp.linspace(0,1,5)   # [0. 0.25 0.5 0.75 1.]\n\n# 2D array:\nmatrix = np.array([[1,2,3],[4,5,6]])\nmatrix.shape  # (2, 3)\nmatrix[0,1]   # 2  (row 0, col 1)`,
    },
    math: {
      label: "Vectorised math",
      code: `salaries = np.array([85000,72000,91000,68000,75000])\n\n# ALL operations apply to every element:\nsalaries * 1.1          # 10% raise\nsalaries + 5000         # flat raise\nsalaries / 1000         # in thousands\n\n# No loop needed — runs at C speed!\n\n# Broadcasting:\nraised = salaries + np.array([5000,3000,0,7000,2000])\n# adds each employee's specific raise\n\n# Element-wise operations between arrays:\nscores = np.array([88.5,None,92.0,None,79.5])\nweighted = salaries * 0.7 + np.nan_to_num(scores) * 0.3`,
    },
    stats: {
      label: "Statistics",
      code: `salaries = np.array([85000,72000,91000,68000,75000,\n                     88000,71000,69000,93000,65000])\n\nnp.mean(salaries)    # ${mean}\nnp.median(salaries)  # 73500\nnp.std(salaries)     # ${std}\nnp.var(salaries)     # ${std ** 2}\nnp.min(salaries)     # 65000\nnp.max(salaries)     # 93000\nnp.percentile(salaries, 75)  # 87250  (Q3)\nnp.sum(salaries)     # 797000\n\n# Axis-wise on 2D:\nmatrix = np.array([[85,72,91],[88,69,93]])\nmatrix.mean(axis=0)  # mean per column → [86.5, 70.5, 92.0]\nmatrix.mean(axis=1)  # mean per row → [82.7, 83.3]`,
    },
    mask: {
      label: "Boolean masking",
      code: `salaries = np.array([85000,72000,91000,68000,75000])\n\n# Boolean mask — same concept as pandas filtering:\nmask = salaries > 75000\n# array([True, False, True, False, False])\n\n# Apply mask to get matching values:\nsalaries[mask]          # array([85000, 91000])\n\n# Combined conditions:\nhigh_and_active = (salaries > 75000) & (salaries < 95000)\nsalaries[high_and_active]  # [85000, 91000]\n\n# np.where — conditional assignment:\nnp.where(salaries > 80000, "Senior", "Standard")\n# ["Senior","Standard","Senior","Standard","Standard"]`,
    },
  };
  const m = OPS[op];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        NumPy is the engine under pandas. Understanding it explains why pandas
        is fast. Click each topic to explore the core operations.
      </Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {Object.entries(OPS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setOp(k)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${op === k ? T.orange : "rgba(255,255,255,.08)"}`,
              background:
                op === k ? "rgba(251,146,60,.12)" : "rgba(255,255,255,.02)",
              color: op === k ? T.orange : T.grey,
              fontWeight: op === k ? 700 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <PyBlock code={m.code} label="NumPy" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {op === "math" && (
            <>
              <SL c={T.orange}>10% RAISE — vectorised</SL>
              <div
                style={{
                  border: `1px solid ${T.slate}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {ARR.slice(0, 5).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 10px",
                      borderBottom: i < 4 ? `1px solid ${T.slate}33` : "none",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: T.greyLight,
                        flex: 1,
                      }}
                    >
                      {s.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 9, color: T.greyDark }}>×1.1</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: T.orange,
                        fontWeight: 700,
                      }}
                    >
                      {Math.round(s * 1.1).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <Tip icon="⚡" title="WHY NUMPY IS FAST" c={T.orange}>
                Python loops process one element at a time. NumPy calls compiled
                C code that operates on entire arrays at once — SIMD
                instructions process multiple values per CPU cycle.
              </Tip>
            </>
          )}
          {op === "stats" && (
            <>
              <SL c={T.orange}>SALARY STATS — all 10 employees</SL>
              {[
                ["mean", mean],
                ["std", std],
                ["min", 65000],
                ["max", 93000],
                ["range", 93000 - 65000],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 10px",
                    border: `1px solid ${T.slate}33`,
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: T.greyDark,
                      fontFamily: "monospace",
                    }}
                  >
                    np.{k}()
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.orange,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {v.toLocaleString()}
                  </span>
                </div>
              ))}
            </>
          )}
          {op === "mask" && (
            <>
              <SL c={T.orange}>BOOLEAN MASK — salary &gt; 75k</SL>
              <div
                style={{
                  border: `1px solid ${T.slate}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {ARR.slice(0, 5).map((s, i) => {
                  const pass = s > 75000;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        padding: "5px 10px",
                        borderBottom: i < 4 ? `1px solid ${T.slate}33` : "none",
                        background: pass
                          ? "rgba(74,222,128,.06)"
                          : "transparent",
                        opacity: pass ? 1 : 0.3,
                        transition: "all .2s",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "monospace",
                          color: T.greyLight,
                          flex: 1,
                        }}
                      >
                        {s.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: pass ? T.green : T.red,
                          fontWeight: 700,
                        }}
                      >
                        {pass ? "True" : "False"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {op === "create" && (
            <Note c={T.orange}>
              pandas Series and DataFrames are built on top of NumPy arrays.{" "}
              <code>df.values</code> or <code>df.to_numpy()</code> returns the
              underlying NumPy array. Knowing NumPy makes pandas debugging much
              easier.
            </Note>
          )}
        </div>
      </div>
    </div>
  );
}

function Module14() {
  return (
    <Course
      intro={{
        explain:
          "NumPy (Numerical Python) provides the ndarray — a fast, typed, fixed-size array. Every pandas Series and DataFrame column is backed by a NumPy array. Operations on NumPy arrays call compiled C code and process entire arrays at once, making them 10-100 times faster than equivalent Python loops. Understanding NumPy explains why pandas is fast, and using it directly unlocks cleaner, faster code for purely numerical operations that pandas handles more awkwardly.",
        learn: [
          "Create NumPy arrays from lists and pre-filled patterns like zeros, ones, and arange",
          "Perform vectorised arithmetic — operations that apply to every element simultaneously with no loop",
          "Use Boolean masking to filter array values exactly like pandas row filtering",
          "Use np.where() as a fast vectorised conditional — the array version of if/else",
        ],
        concepts: [
          "All elements in an ndarray must be the same dtype — int64, float64, etc. — unlike Python lists",
          "array * 2 doubles every element at once with no loop — this is vectorised operation",
          "Boolean mask: arr[arr > 0] returns only the positive values — same pattern as pandas filtering",
          "np.where(condition, val_if_true, val_if_false) creates a new array based on a condition — no loop",
        ],
        why: "When you understand that df['salary'] * 1.1 is a NumPy operation under the hood, you understand why pandas is fast. NumPy also handles matrix operations and numerical tasks more cleanly and efficiently than pandas alone.",
      }}
      c={T.orange}
      steps={[
        {
          title: "NumPy explorer",
          desc: "A NumPy ndarray is a typed, fixed-size array stored in a contiguous block of memory. All elements must be the same data type — int64, float64, etc. When you write np.array([85000, 72000, 91000]) and then multiply by 1.1, NumPy does not loop in Python — it calls a compiled C routine that processes the entire array at once using CPU-level SIMD instructions. This is why operations on a 1-million-element array take milliseconds, not seconds.",
          content: () => <NumpyVisual />,
        },
        {
          title: "ndarray vs list vs Series",
          desc: "Each data structure has a different purpose. A Python list is flexible — it holds mixed types and is easy to use, but math operations require explicit loops. A NumPy ndarray is optimised for typed numerical data — arithmetic is 10-100x faster and memory usage is much lower. A pandas Series is a NumPy array with an index (labels for each element) and a rich API including .str, .dt, and groupby support. Choose based on what you need: flexibility (list), raw numerical speed (ndarray), or labelled data analysis (Series / DataFrame).",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.orange}>
                Understanding when to use each structure is a mark of a mature
                Python data practitioner.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    name: "Python list",
                    c: T.greyLight,
                    pros: [
                      "Flexible — mixed types",
                      "Built-in — no import",
                      "Easy to understand",
                    ],
                    cons: ["Slow for math", "No dtype", "No axis operations"],
                    use: "General purpose collections",
                  },
                  {
                    name: "NumPy ndarray",
                    c: T.orange,
                    pros: [
                      "C speed for math",
                      "Vectorised operations",
                      "Memory efficient",
                    ],
                    cons: [
                      "Single dtype only",
                      "No labels",
                      "Less intuitive API",
                    ],
                    use: "Numerical computing, matrices",
                  },
                  {
                    name: "pandas Series",
                    c: T.cyan,
                    pros: [
                      "Labelled (index)",
                      "Rich API (.str, .dt)",
                      "NaN-safe operations",
                    ],
                    cons: [
                      "Slower than ndarray",
                      "Overhead for simple math",
                      "Larger memory",
                    ],
                    use: "Single-column data analysis",
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    style={{
                      border: `1px solid ${s.c}33`,
                      borderRadius: 10,
                      padding: "12px",
                      background: `${s.c}06`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: s.c,
                        marginBottom: 8,
                        fontFamily: "'Syne',sans-serif",
                      }}
                    >
                      {s.name}
                    </div>
                    {s.pros.map((p, i) => (
                      <div
                        key={i}
                        style={{ fontSize: 9, color: T.green, marginBottom: 2 }}
                      >
                        ✓ {p}
                      </div>
                    ))}
                    {s.cons.map((p, i) => (
                      <div
                        key={i}
                        style={{ fontSize: 9, color: T.red, marginBottom: 2 }}
                      >
                        ✗ {p}
                      </div>
                    ))}
                    <div
                      style={{
                        fontSize: 9,
                        color: s.c,
                        marginTop: 6,
                        fontWeight: 700,
                      }}
                    >
                      Use for: {s.use}
                    </div>
                  </div>
                ))}
              </div>
              <PyBlock
                code={`# Python list — slow:\n[x * 1.1 for x in salaries_list]  # Python loop\n\n# NumPy array — fast:\nnp.array(salaries_list) * 1.1      # C code\n\n# pandas Series — feature-rich:\ndf["salary"] * 1.1                 # also NumPy under the hood\n\n# Convert between them:\narr = df["salary"].to_numpy()      # Series → ndarray\ndf["salary"] = pd.Series(arr)      # ndarray → Series\npy_list = arr.tolist()             # ndarray → list`}
              />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.orange}
              questions={[
                {
                  question:
                    "What is the key advantage of NumPy arrays over Python lists for math?",
                  options: [
                    "NumPy has more functions",
                    "NumPy operations are vectorised — they run compiled C code on entire arrays",
                    "NumPy is easier to read",
                    "NumPy handles strings better",
                  ],
                  correct: 1,
                  explanation:
                    "NumPy's power is vectorisation — operations like array * 1.1 call compiled C/Fortran code that operates on all elements at once using CPU SIMD instructions. Python for loops run at interpreted speed, which is ~100x slower.",
                },
                {
                  type: "output",
                  question:
                    "What does np.where(arr > 80000, 'High', 'Low') return?",
                  code: `arr = np.array([85000, 72000, 91000])`,
                  options: [
                    "A single True/False",
                    "An array ['High','Low','High']",
                    "An integer index",
                    "An error",
                  ],
                  correct: 1,
                  explanation:
                    "np.where(condition, true_val, false_val) returns an array the same shape as the input, with true_val where condition is True and false_val where it's False. Very useful as a vectorised if/else.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 15: ERROR HANDLING ────────────────────────────────────────────────
function TryExceptVisual() {
  const [scenario, setScenario] = useState("div");
  const [input, setInput] = useState("0");
  const SCENARIOS = {
    div: {
      label: "Division by zero",
      fn: (v) => {
        const n = Number(v);
        if (n === 0) throw new Error("ZeroDivisionError: division by zero");
        return 100 / n;
      },
      code: `def safe_divide(a, b):\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        print("Cannot divide by zero!")\n        return None\n\nsafe_divide(100, 5)   # 20.0\nsafe_divide(100, 0)   # Cannot divide by zero! → None`,
    },
    key: {
      label: "Missing dict key",
      fn: (v) => {
        const d = { Amara: 85000, Bola: 72000, Chidi: 91000 };
        if (!(v in d)) throw new Error(`KeyError: '${v}'`);
        return d[v];
      },
      code: `def get_salary(name):\n    try:\n        return salaries[name]\n    except KeyError:\n        return f"Employee '{name}' not found"\n\nget_salary("Amara")   # 85000\nget_salary("Zara")    # "Employee 'Zara' not found"`,
    },
    type: {
      label: "Type conversion",
      fn: (v) => {
        const n = Number(v);
        if (isNaN(n) && v !== "")
          throw new Error(`ValueError: could not convert '${v}' to float`);
        if (v === "") throw new Error("ValueError: empty string");
        return n;
      },
      code: `def parse_salary(raw):\n    try:\n        return float(raw)\n    except ValueError as e:\n        print(f"Bad data: {e}")\n        return None\n    except TypeError:\n        print("Expected a string, got None")\n        return None\n\nparse_salary("85000")  # 85000.0\nparse_salary("N/A")    # Bad data: ... → None`,
    },
  };
  const sc = SCENARIOS[scenario];
  let result = null,
    err = null;
  try {
    result = sc.fn(input);
  } catch (e) {
    err = e.message;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Select an error type, type a value, and watch whether it succeeds or
        triggers the except block.
      </Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {Object.entries(SCENARIOS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setScenario(k)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${scenario === k ? T.red : "rgba(255,255,255,.08)"}`,
              background:
                scenario === k
                  ? "rgba(248,113,113,.12)"
                  : "rgba(255,255,255,.02)",
              color: scenario === k ? T.red : T.grey,
              fontWeight: scenario === k ? 700 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PyBlock code={sc.code} label="Python — try/except" />
          <div>
            <SL>TEST INPUT</SL>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a value..."
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 8,
                border: `1px solid ${err ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.3)"}`,
                background: T.bg,
                color: err ? T.red : T.green,
                fontSize: 12,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
          {err ? (
            <OutBlock err>
              {err}
              <br />
              <br />→ except block runs → returns None
            </OutBlock>
          ) : (
            <OutBlock
              label={`try block succeeds`}
            >{`result = ${JSON.stringify(result)}`}</OutBlock>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              border: `1px solid ${T.slate}`,
              borderRadius: 10,
              padding: "12px",
              background: T.surface,
            }}
          >
            <SL c={T.red}>EXCEPTION HIERARCHY</SL>
            <PyBlock
              code={`# Most specific first:\ntry:\n    do_something()\nexcept FileNotFoundError:  # specific\n    print("File missing")\nexcept IOError:            # broader\n    print("IO problem")\nexcept Exception as e:     # catch-all\n    print(f"Unexpected: {e}")\nelse:\n    print("No exception raised")\nfinally:\n    print("Always runs — cleanup here")`}
            />
          </div>
          <Warn>
            Never use bare <code>except:</code> — it catches everything
            including KeyboardInterrupt and SystemExit. Always catch specific
            exceptions.
          </Warn>
        </div>
      </div>
    </div>
  );
}

function Module15() {
  return (
    <Course
      intro={{
        explain:
          "In Python, when something goes wrong at runtime — a file does not exist, a value cannot be converted, a key is missing from a dict — Python raises an exception and your program stops unless you handle it. try/except lets you intercept that exception and decide what to do: log it, return a default value, skip the row, or raise a clearer error. This is what separates a script that works once from a pipeline that runs reliably every night.",
        learn: [
          "Write try/except blocks that catch specific exception types rather than everything",
          "Use else (runs if no error occurred) and finally (always runs) in the right places",
          "Create custom exception classes that describe exactly what went wrong in your system",
          "Use context managers — the with statement — to safely open files and database connections",
        ],
        concepts: [
          "Never use bare except: — it catches everything including Ctrl+C and system exits; always name the exception",
          "The else block runs only if the try block completed with no exception — good for the success path",
          "finally always runs even if there is a return statement inside the try block — use it for cleanup",
          "with open('file') as f: guarantees the file is closed even if an error occurs inside the block",
        ],
        why: "Real pipelines encounter unexpected inputs constantly — missing files, API timeouts, malformed rows. Code without error handling crashes and leaves data in an inconsistent state. Robust error handling is what you need to sleep well when pipelines run unattended.",
      }}
      c={T.red}
      steps={[
        {
          title: "try/except explorer",
          desc: "A try/except block has a clear structure. Python attempts to run the code inside try. If a specific exception is raised, execution jumps immediately to the matching except block — the rest of the try block is skipped. You name the exception type you want to catch: except ZeroDivisionError, except KeyError, except ValueError. Catching only the exception you expect means unexpected errors still propagate and alert you — they are not silently swallowed. Select a scenario, type a value, and watch whether the try or except block runs.",
          content: () => <TryExceptVisual />,
        },
        {
          title: "Common exceptions",
          desc: "Python has a hierarchy of built-in exceptions. Knowing the most common ones by name means you know exactly which except clause to write. KeyError: a dict key does not exist. IndexError: a list index is out of range. ValueError: the right type but wrong value, like int('N/A'). TypeError: the wrong type entirely, like adding a string to an int. AttributeError: the object does not have that method, like calling .strip() on None. FileNotFoundError: the file path does not exist. Each has a specific, informative fix.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.red}>
                Knowing which exception to expect makes code more robust. These
                are the ones you'll see most in data work.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    name: "KeyError",
                    when: "Dict key doesn't exist",
                    ex: `d["missing"]`,
                    fix: `.get("key",default)`,
                  },
                  {
                    name: "IndexError",
                    when: "List index out of range",
                    ex: `lst[999]`,
                    fix: `lst[-1] or len check`,
                  },
                  {
                    name: "ValueError",
                    when: "Wrong type of value",
                    ex: `int("N/A")`,
                    fix: `try/except or pd.to_numeric(errors='coerce')`,
                  },
                  {
                    name: "TypeError",
                    when: "Wrong type for operation",
                    ex: `"age" + 5`,
                    fix: `str(5) or type check`,
                  },
                  {
                    name: "AttributeError",
                    when: "Object doesn't have that attribute",
                    ex: `None.strip()`,
                    fix: `Check for None first`,
                  },
                  {
                    name: "FileNotFoundError",
                    when: "File path doesn't exist",
                    ex: `open("missing.csv")`,
                    fix: `os.path.exists() first`,
                  },
                  {
                    name: "ZeroDivisionError",
                    when: "Dividing by zero",
                    ex: `total / count`,
                    fix: `if count != 0: ...`,
                  },
                  {
                    name: "ImportError",
                    when: "Module not installed/misspelled",
                    ex: `import panads`,
                    fix: `pip install pandas`,
                  },
                ].map((e) => (
                  <div
                    key={e.name}
                    style={{
                      border: `1px solid ${T.slate}`,
                      borderRadius: 8,
                      padding: "9px 12px",
                      background: T.surface,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.red,
                        fontFamily: "monospace",
                        marginBottom: 4,
                      }}
                    >
                      {e.name}
                    </div>
                    <div
                      style={{ fontSize: 10, color: T.grey, marginBottom: 3 }}
                    >
                      {e.when}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <code
                        style={{
                          fontSize: 9,
                          color: T.orange,
                          fontFamily: "monospace",
                          flex: 1,
                        }}
                      >
                        ❌ {e.ex}
                      </code>
                      <code
                        style={{
                          fontSize: 9,
                          color: T.green,
                          fontFamily: "monospace",
                          flex: 1,
                        }}
                      >
                        ✓ {e.fix}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Custom exceptions & context managers",
          desc: "Custom exceptions make your errors self-documenting. Instead of raising ValueError('bad data') you raise SalaryOutOfRangeError(salary) — the name and the attached data tell the reader exactly what failed. Create one by subclassing Exception. Context managers, written with the with statement, are the correct way to handle resources that must be cleaned up — files, database connections, locks. The with statement guarantees the cleanup code runs even if an error occurs inside the block, which is something a bare try/finally achieves but with more code.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.red}>
                Custom exceptions make errors descriptive. Context managers
                (with statement) ensure cleanup always runs — files close,
                connections close.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <SL>CUSTOM EXCEPTIONS</SL>
                  <PyBlock
                    code={`class DataValidationError(Exception):\n    """Raised when data fails validation."""\n    pass\n\nclass SalaryOutOfRangeError(DataValidationError):\n    def __init__(self, salary, min_val=0, max_val=500000):\n        self.salary = salary\n        msg = f"Salary {salary} not in [{min_val},{max_val}]"\n        super().__init__(msg)\n\ndef validate_salary(salary):\n    if not isinstance(salary, (int, float)):\n        raise TypeError(f"Expected number, got {type(salary)}")\n    if salary < 0 or salary > 500000:\n        raise SalaryOutOfRangeError(salary)\n    return salary\n\ntry:\n    validate_salary(-5000)\nexcept SalaryOutOfRangeError as e:\n    print(f"Validation failed: {e}")`}
                  />
                </div>
                <div>
                  <SL>CONTEXT MANAGERS — with</SL>
                  <PyBlock
                    code={`# File handling — always closes even on error:\nwith open("data.csv", "r") as f:\n    content = f.read()\n# file is guaranteed closed here\n\n# Database connection:\nimport sqlite3\nwith sqlite3.connect("db.sqlite") as conn:\n    df = pd.read_sql("SELECT * FROM emp", conn)\n# connection closed automatically\n\n# Multiple context managers:\nwith open("input.csv") as fin, \\\n     open("output.csv", "w") as fout:\n    fout.write(fin.read())\n\n# Why it matters:\nf = open("data.csv")  # BAD — won't close on error\nf.read()\nf.close()  # never reached if error above!`}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.red}
              questions={[
                {
                  type: "bug",
                  question: "What's wrong with this exception handler?",
                  code: `try:\n    result = risky_function()\nexcept:\n    print("Something went wrong")`,
                  options: [
                    "except needs parentheses",
                    "Bare except catches EVERYTHING including SystemExit — use except Exception",
                    "Missing finally block",
                    "Should use if/else instead",
                  ],
                  correct: 1,
                  explanation:
                    "Bare except: catches all exceptions including SystemExit, KeyboardInterrupt, and GeneratorExit — things Python uses internally. Always catch specific exceptions or at minimum use 'except Exception' which excludes system exceptions.",
                },
                {
                  question:
                    "What does the 'finally' block do in try/except/finally?",
                  options: [
                    "Only runs if no exception occurred",
                    "Only runs if an exception occurred",
                    "Always runs — even if there's a return or exception",
                    "Catches any remaining exceptions",
                  ],
                  correct: 2,
                  explanation:
                    "finally always executes — whether the try block succeeds, fails, or even has a return statement. It's for cleanup: closing files, releasing locks, closing database connections.",
                },
                {
                  type: "output",
                  question: "What does this print?",
                  code: `try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("caught")\nelse:\n    print("no error")\nfinally:\n    print("done")`,
                  options: ["caught, done", "caught", "no error, done", "done"],
                  correct: 0,
                  explanation:
                    "ZeroDivisionError is raised → caught by except → prints 'caught'. The else block only runs if NO exception occurred. finally always runs → prints 'done'. Output: caught\\ndone.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 16: FILE I/O ─────────────────────────────────────────────────────
function ReadCsvOptionsVisual() {
  const OPTIONS = [
    {
      opt: "Basic read",
      code: `df = pd.read_csv("employees.csv")\n# Assumes: comma delimiter, first row = header`,
      result: "All defaults. Works on clean CSVs.",
    },
    {
      opt: "Parse dates",
      code: `df = pd.read_csv("employees.csv",\n    parse_dates=["hired"]\n)\n# hired column → datetime64 automatically`,
      result: "hired: datetime64 instead of object string",
    },
    {
      opt: "Custom delimiter",
      code: `# Semicolons instead of commas:\ndf = pd.read_csv("data.csv", sep=";")\n\n# Tab-separated:\ndf = pd.read_csv("data.tsv", sep="\\t")\n\n# Auto-detect:\ndf = pd.read_csv("data.csv", sep=None,\n                 engine="python")`,
      result: "Handles non-comma delimiters",
    },
    {
      opt: "Handle nulls",
      code: `df = pd.read_csv("data.csv",\n    na_values=["N/A","null","","none","#VALUE!"]\n)\n# These strings → NaN in the DataFrame`,
      result: "Custom null value recognition",
    },
    {
      opt: "Select columns",
      code: `df = pd.read_csv("data.csv",\n    usecols=["id","name","salary","dept"]\n)\n# Only loads these 4 columns\n# Saves memory on large files`,
      result: "Only 4 columns loaded — rest ignored",
    },
    {
      opt: "Chunk large files",
      code: `# Process 100k-row CSV without loading all:\nchunks = pd.read_csv("big_file.csv",\n                      chunksize=10000)\nresults = []\nfor chunk in chunks:\n    summary = chunk.groupby("dept")["salary"].sum()\n    results.append(summary)\n\nfinal = pd.concat(results).groupby(level=0).sum()`,
      result: "Process massive files without running out of memory",
    },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        pd.read_csv() has 50+ parameters. These 6 cover 90% of real-world use
        cases. Click each to see the option and when to use it.
      </Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {OPTIONS.map((o, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            style={{
              padding: "5px 10px",
              borderRadius: 8,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`,
              background:
                sel === i ? "rgba(34,211,238,.12)" : "rgba(255,255,255,.02)",
              color: sel === i ? T.cyan : T.grey,
              fontWeight: sel === i ? 700 : 400,
            }}
          >
            {o.opt}
          </button>
        ))}
      </div>
      <PyBlock code={OPTIONS[sel].code} label="pandas — read_csv()" />
      <div
        style={{
          background: `${T.cyan}09`,
          border: `1px solid ${T.cyan}25`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          color: T.greyLight,
        }}
      >
        <strong style={{ color: T.cyan }}>Effect: </strong>
        {OPTIONS[sel].result}
      </div>
    </div>
  );
}

function Module16() {
  return (
    <Course
      intro={{
        explain:
          "pd.read_csv() is likely the most frequently called function in all of data analysis. But real files are messy — dates stored as plain text, custom null values like N/A or #VALUE!, semicolons instead of commas as delimiters, files too large to load into memory at once. Knowing the right parameters handles all of this at load time and saves you extra cleaning steps. Beyond CSV you will also encounter Excel, JSON, Parquet, and SQL databases in real projects.",
        learn: [
          "Use the key pd.read_csv() parameters: sep, parse_dates, na_values, usecols, and dtype",
          "Read and write Excel files including multi-sheet workbooks with pd.read_excel()",
          "Load and save JSON, and flatten nested structures with pd.json_normalize()",
          "Understand when Parquet is a better choice than CSV for production pipelines",
        ],
        concepts: [
          "parse_dates=['col'] converts a string date column to datetime64 at load time — no extra step needed",
          "na_values=['N/A','null','','#VALUE!'] — tell pandas exactly which strings should become NaN",
          "usecols=['id','name','salary'] loads only those columns — critical for memory efficiency on large files",
          "Parquet preserves dtypes, compresses roughly 5x better than CSV, and reads significantly faster",
        ],
        why: "Loading data correctly sets the foundation for everything downstream. Wrong types at load time cascade into cleaning bugs. Not knowing about chunksize means running out of memory on large files. These are essential daily production skills.",
      }}
      c={T.cyan}
      steps={[
        {
          title: "read_csv() options",
          desc: "pd.read_csv() has over 50 parameters, but you only need to know about 8 to handle 95% of real files. The most important: sep sets the delimiter (default is comma). parse_dates takes a list of column names and converts them to datetime automatically. na_values takes a list of strings that should be treated as NaN. usecols limits which columns are loaded — essential for wide files. dtype lets you specify the type of any column explicitly at load time. chunksize enables processing files that are too large to fit in memory.",
          content: () => <ReadCsvOptionsVisual />,
        },
        {
          title: "Other file formats",
          desc: "CSV is universal but not always the best choice. Excel files (.xlsx) are how business stakeholders share data — pd.read_excel() reads them, and ExcelWriter lets you write multiple sheets. JSON is the format of API responses — pd.read_json() for simple structures, pd.json_normalize() for nested ones. Parquet is the format of production data pipelines — it stores column data types, compresses 4-5 times better than CSV, and reads dramatically faster because it is columnar. SQL databases are accessed via pd.read_sql() with a connection object.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                CSV is the most common, but real pipelines use JSON, Excel,
                Parquet, and databases. Each has the right use case.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <PyBlock
                  label="Reading"
                  code={`# CSV:\ndf = pd.read_csv("data.csv")\n\n# Excel:\ndf = pd.read_excel("data.xlsx",\n    sheet_name="Sheet1")\n\n# JSON:\ndf = pd.read_json("data.json")\n# or load manually:\nimport json\nwith open("data.json") as f:\n    data = json.load(f)\ndf = pd.DataFrame(data)\n\n# Parquet (fast, compressed, typed):\ndf = pd.read_parquet("data.parquet")\n\n# SQL database:\nimport sqlite3\nwith sqlite3.connect("db.sqlite") as conn:\n    df = pd.read_sql("SELECT * FROM emp", conn)`}
                />
                <PyBlock
                  label="Writing"
                  code={`# CSV:\ndf.to_csv("output.csv", index=False)\n# index=False — don't write the row numbers\n\n# Excel:\ndf.to_excel("output.xlsx",\n    sheet_name="Employees", index=False)\n\n# Multiple sheets:\nwith pd.ExcelWriter("report.xlsx") as writer:\n    df.to_excel(writer, sheet_name="Data")\n    summary.to_excel(writer, sheet_name="Summary")\n\n# JSON:\ndf.to_json("output.json", orient="records")\n\n# Parquet — best for large datasets:\ndf.to_parquet("data.parquet", index=False)\n# Preserves dtypes, ~5x compression vs CSV`}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    fmt: "CSV",
                    when: "Sharing data, simple pipeline",
                    pro: "Universal, human-readable",
                    con: "No dtype info, large size",
                  },
                  {
                    fmt: "Excel",
                    when: "Business stakeholders",
                    pro: "Rich formatting, multiple sheets",
                    con: "Slow, bad for large data",
                  },
                  {
                    fmt: "Parquet",
                    when: "Production data pipelines",
                    pro: "Typed, compressed, columnar",
                    con: "Not human-readable",
                  },
                ].map((f) => (
                  <div
                    key={f.fmt}
                    style={{
                      border: `1px solid ${T.slate}`,
                      borderRadius: 8,
                      padding: "9px 12px",
                      background: T.surface,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.cyan,
                        marginBottom: 4,
                      }}
                    >
                      .{f.fmt.toLowerCase()}
                    </div>
                    <div
                      style={{ fontSize: 9, color: T.grey, marginBottom: 3 }}
                    >
                      {f.when}
                    </div>
                    <div style={{ fontSize: 9, color: T.green }}>✓ {f.pro}</div>
                    <div style={{ fontSize: 9, color: T.red }}>✗ {f.con}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.cyan}
              questions={[
                {
                  question:
                    "pd.read_csv() with no arguments — what does it assume about the file?",
                  options: [
                    "Semicolons, no header",
                    "Commas, first row = header, system encoding",
                    "Tabs, second row = header",
                    "Spaces, last row = header",
                  ],
                  correct: 1,
                  explanation:
                    "read_csv() defaults: sep=',' (comma), header=0 (first row), encoding='utf-8'. These work for most clean CSVs. Override any default with explicit parameters when needed.",
                },
                {
                  type: "bug",
                  question:
                    "A developer saves a DataFrame and then notices an extra column '0' in the file:",
                  code: `df.to_csv("output.csv")`,
                  options: [
                    "Should use to_excel() instead",
                    "Missing index=False — the index is being written as a column",
                    "Should specify column names",
                    "Missing encoding parameter",
                  ],
                  correct: 1,
                  explanation:
                    "By default, to_csv() writes the DataFrame's index (0,1,2...) as the first column. Use index=False to exclude it. When re-reading the file, you'd get an unwanted 'Unnamed: 0' column.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 17: REGEX ─────────────────────────────────────────────────────────
function RegexBuilder() {
  const [pattern, setPattern] = useState("\d+");
  const [text, setText] = useState(
    "Amara earns 85000 and Bola earns 72000 per year",
  );
  const [flags, setFlags] = useState("g");
  let matches = [],
    error = null;
  try {
    const re = new RegExp(pattern, flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ val: m[0], idx: m.index });
      if (!flags.includes("g")) break;
    }
  } catch (e) {
    error = e.message;
  }
  const PRESETS = [
    { label: "Digits", pat: `\\d+`, desc: "One or more digits" },
    {
      label: "Word",
      pat: `\\w+`,
      desc: "Word characters (letters, digits, _)",
    },
    {
      label: "Email",
      pat: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`,
      desc: "Email address",
    },
    {
      label: "Date (YYYY-MM-DD)",
      pat: `\\d{4}-\\d{2}-\\d{2}`,
      desc: "ISO date format",
    },
    {
      label: "Phone",
      pat: `\\+?\\d[\\d\\s-]{7,}\\d`,
      desc: "Phone number pattern",
    },
    {
      label: "Capitalized word",
      pat: `[A-Z][a-z]+`,
      desc: "Words starting with capital",
    },
  ];
  const highlighted = error
    ? text
    : text.split("").map((ch, i) => {
        const inMatch = matches.some(
          (m) => i >= m.idx && i < m.idx + m.val.length,
        );
        return { ch, hi: inMatch };
      });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">
        Type a regex pattern or click a preset. The matching text highlights in
        real time. All matches are listed below.
      </Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setPattern(p.pat);
            }}
            style={{
              padding: "4px 9px",
              borderRadius: 7,
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1px solid ${pattern === p.pat ? T.green : "rgba(255,255,255,.08)"}`,
              background:
                pattern === p.pat
                  ? "rgba(74,222,128,.12)"
                  : "rgba(255,255,255,.02)",
              color: pattern === p.pat ? T.green : T.grey,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <SL c={T.green}>PATTERN</SL>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  color: T.greyDark,
                  fontFamily: "monospace",
                  fontSize: 14,
                }}
              >
                /
              </span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  borderRadius: 7,
                  border: `1px solid ${error ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.35)"}`,
                  background: T.bg,
                  color: T.green,
                  fontSize: 11,
                  fontFamily: "monospace",
                  outline: "none",
                }}
              />
              <span
                style={{
                  color: T.greyDark,
                  fontFamily: "monospace",
                  fontSize: 14,
                }}
              >
                /g
              </span>
            </div>
            {error && (
              <div
                style={{
                  fontSize: 9,
                  color: T.red,
                  marginTop: 3,
                  fontFamily: "monospace",
                }}
              >
                {error}
              </div>
            )}
          </div>
          <div>
            <SL>TEST STRING</SL>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: `1px solid ${T.slate}`,
                background: T.bg,
                color: T.white,
                fontSize: 11,
                fontFamily: "monospace",
                outline: "none",
                resize: "vertical",
                minHeight: 60,
              }}
            />
          </div>
          {!error && (
            <div>
              <SL c={T.green}>HIGHLIGHTED</SL>
              <div
                style={{
                  background: "rgba(4,9,20,.85)",
                  border: "1px solid rgba(74,222,128,.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontFamily: "monospace",
                  lineHeight: 1.8,
                  wordBreak: "break-word",
                }}
              >
                {Array.isArray(highlighted)
                  ? highlighted.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          background: c.hi
                            ? "rgba(74,222,128,.3)"
                            : "transparent",
                          color: c.hi ? T.green : T.white,
                          borderRadius: c.hi ? 2 : 0,
                        }}
                      >
                        {c.ch}
                      </span>
                    ))
                  : text}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!error && (
            <div>
              <SL c={T.green}>
                {matches.length} MATCH{matches.length !== 1 ? "ES" : ""}
              </SL>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {matches.length === 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: T.greyDark,
                      fontFamily: "monospace",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    No matches
                  </div>
                )}
                {matches.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: "rgba(74,222,128,.08)",
                      border: "1px solid rgba(74,222,128,.2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        color: T.greyDark,
                        fontFamily: "monospace",
                        minWidth: 55,
                      }}
                    >
                      idx {m.idx}
                    </span>
                    <code
                      style={{
                        fontSize: 11,
                        color: T.green,
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      "{m.val}"
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PyBlock
            label="Python — re module"
            code={`import re\n\ntext = "${text.slice(0, 40)}..."\npattern = r"${pattern}"\n\n# Find all matches:\nmatches = re.findall(pattern, text)\n# ${JSON.stringify(matches.map((m) => m.val).slice(0, 3))}...\n\n# Find with positions:\nfor m in re.finditer(pattern, text):\n    print(m.group(), m.start(), m.end())\n\n# Replace:\ncleaned = re.sub(r"\\d+", "[NUM]", text)`}
          />
        </div>
      </div>
    </div>
  );
}

function Module17() {
  return (
    <Course
      intro={{
        explain:
          "A regular expression is a pattern that describes a set of strings. \\d+ means one or more digits. [A-Z][a-z]+ means a capital letter followed by one or more lowercase letters. You use regex to find, validate, extract, and replace text that follows a pattern — phone numbers, email addresses, product codes, dates embedded in free text. In pandas, regex integrates directly into the .str accessor so it applies to entire columns at once.",
        learn: [
          "Read and write basic regex patterns using the 15 most common tokens",
          "Use Python's re module: re.findall(), re.sub(), re.search(), and re.compile()",
          "Filter DataFrame rows using .str.contains() with a regex pattern",
          "Extract structured values from messy columns using .str.extract() with capture groups",
        ],
        concepts: [
          "\\d matches a digit, \\w matches a word character, \\s matches whitespace, . matches any character",
          "+ means one or more, * means zero or more, ? means optional, {n} means exactly n times",
          "Always write regex as raw strings: r'\\d+' not '\\d+' — backslashes are literal in raw strings",
          "Capture groups: str.extract(r'(\\d{4})') pulls out the 4-digit match into a new column",
        ],
        why: "Phone numbers, postal codes, product IDs, dates in free text — all follow patterns. Regex is how you validate and extract them at scale across millions of rows. The same 15 tokens cover 90 percent of practical use cases.",
      }}
      c={T.green}
      steps={[
        {
          title: "Regex builder",
          desc: "A regular expression is a string that describes a pattern. \\d means any single digit. + means one or more of the preceding. So \\d+ means one or more digits. [A-Z] means any uppercase letter. ^ anchors to the start of the string; $ anchors to the end. Parentheses () create a capture group — the part you want to extract. In Python you always write regex patterns as raw strings: r'\\d+' not '\\d+'. The r prefix means backslashes are literal characters, not Python escape sequences. Type a pattern below to see it match in real time.",
          content: () => <RegexBuilder />,
        },
        {
          title: "Regex cheatsheet",
          desc: "Regex looks intimidating because the syntax is dense, but only about 15 tokens cover nearly all practical use cases. The character classes (\\d, \\w, \\s) match categories of characters. Quantifiers (+, *, ?, {n}) say how many times the preceding element must match. Anchors (^, $) lock the match to the start or end of the string. Character sets ([abc], [^abc]) match specific or excluded characters. Alternation (a|b) matches either a or b. Capture groups (a) extract the matched text.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.green}>
                Regex patterns look cryptic but follow a small set of rules.
                Master these 15 patterns and you can handle 90% of text cleaning
                tasks.
              </Note>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {[
                  ["\\d", "Digit (0-9)"],
                  ["\\w", "Word char (a-z, A-Z, 0-9, _)"],
                  ["\\s", "Whitespace (space, tab, newline)"],
                  ["\\D", "NOT digit"],
                  ["\\W", "NOT word char"],
                  ["\\S", "NOT whitespace"],
                  [".", "Any character (except newline)"],
                  ["+", "One or more of preceding"],
                  ["*", "Zero or more of preceding"],
                  ["?", "Zero or one of preceding"],
                  ["^", "Start of string"],
                  ["$", "End of string"],
                  ["{n}", "Exactly n times"],
                  ["{n,m}", "Between n and m times"],
                  ["[abc]", "Any of: a, b, or c"],
                  ["[^abc]", "NOT a, b, or c"],
                  ["(group)", "Capture group"],
                  ["a|b", "a OR b"],
                ].map(([p, d]) => (
                  <div
                    key={p}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 8px",
                      borderRadius: 6,
                      background: "rgba(74,222,128,.04)",
                      border: "1px solid rgba(74,222,128,.1)",
                    }}
                  >
                    <code
                      style={{
                        fontSize: 11,
                        color: T.green,
                        fontFamily: "monospace",
                        minWidth: 60,
                        fontWeight: 700,
                      }}
                    >
                      {p}
                    </code>
                    <span style={{ fontSize: 10, color: T.greyLight }}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>
              <Tip icon="🔑" title="ALWAYS USE RAW STRINGS" c={T.green}>
                In Python, write regex as <code>r"\d+"</code> not{" "}
                <code>"\d+"</code>. Raw strings treat backslashes literally.
                Without r, <code>"\d"</code> is just "d" and <code>"\n"</code>{" "}
                is a newline.
              </Tip>
            </div>
          ),
        },
        {
          title: "Regex in pandas",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.green}>
                pandas .str accessor accepts regex in most string methods. This
                is how you clean messy text columns at scale.
              </Note>
              <PyBlock
                label="pandas regex patterns"
                code={`# Filter rows by regex pattern:\ndf[df["name"].str.contains(r"Nwosu|Osei")]\ndf[df["email"].str.match(r"^\\w+@company\\.com$")]\n\n# Extract groups:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")\ndf["first"] = df["name"].str.extract(r"^(\\w+)")\ndf["last"]  = df["name"].str.extract(r"(\\w+)$")\n\n# Replace with regex:\ndf["salary_int"] = (\n    df["salary_raw"]\n    .str.replace(r"[^\\d]", "", regex=True)\n    .astype(int)\n)\n\n# Split on regex:\ndf["parts"] = df["full_name"].str.split(r"\\s+-\\s+")\n\n# extractall — multiple matches per row:\ndf["phone"].str.extractall(r"(\\d{3}-\\d{4})")`}
              />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.green}
              questions={[
                {
                  question: "What does r'\\d+' mean in Python?",
                  options: [
                    "A raw string containing \\d+ (matches one or more digits)",
                    "A string containing a newline and 'd+'",
                    "A regular expression for 'digit'",
                    "An error — invalid syntax",
                  ],
                  correct: 0,
                  explanation:
                    "r'' is a raw string literal — backslashes are treated literally, not as escape sequences. r'\\d+' contains the two characters \\ and d followed by +. In regex, \\d matches any digit and + means 'one or more'. Without r, Python would try to interpret \\d as an escape sequence.",
                },
                {
                  type: "bug",
                  question: "What's wrong with this email filter?",
                  code: `df[df["email"].str.contains("@company.com")]`,
                  options: [
                    "Missing regex=True flag",
                    "The dot . in regex matches ANY character — should escape it as \\\\.",
                    ".str.contains needs re import",
                    "Nothing — this is correct",
                  ],
                  correct: 1,
                  explanation:
                    "In regex, . matches any character. '@company.com' would match '@companyXcom' too. Escape the dot: str.contains(r'@company\\.com') or str.contains('@company.com', regex=False) for literal matching.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 18: APIS & JSON ───────────────────────────────────────────────────
function JsonExplorer() {
  const JSON_DATA = {
    employees: [
      {
        id: 1,
        name: "Amara Osei",
        dept: "Engineering",
        salary: 85000,
        scores: { q1: 88, q2: 92 },
        tags: ["senior", "remote"],
      },
      {
        id: 2,
        name: "Bola Adeyemi",
        dept: "Analytics",
        salary: 72000,
        scores: { q1: 79, q2: 85 },
        tags: ["mid-level"],
      },
    ],
    meta: { total: 10, page: 1, currency: "NGN" },
  };
  const [path, setPath] = useState('data["employees"][0]["name"]');
  const PATHS = [
    {
      label: "First employee",
      expr: `data["employees"][0]`,
      result: `{"id":1,"name":"Amara Osei","dept":"Engineering",...}`,
    },
    {
      label: "Employee name",
      expr: `data["employees"][0]["name"]`,
      result: `"Amara Osei"`,
    },
    {
      label: "All names",
      expr: `[e["name"] for e in data["employees"]]`,
      result: `["Amara Osei","Bola Adeyemi"]`,
    },
    {
      label: "Nested score",
      expr: `data["employees"][0]["scores"]["q1"]`,
      result: `88`,
    },
    { label: "Meta total", expr: `data["meta"]["total"]`, result: `10` },
    {
      label: "All salaries",
      expr: `[e["salary"] for e in data["employees"]]`,
      result: `[85000, 72000]`,
    },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Click a path to see how to navigate nested JSON. This is the exact
        pattern for parsing API responses.
      </Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>JSON STRUCTURE</SL>
          <div
            style={{
              background: "rgba(4,9,20,.9)",
              border: "1px solid rgba(34,211,238,.2)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 10,
              fontFamily: "monospace",
              lineHeight: 1.7,
              overflowY: "auto",
              maxHeight: 280,
            }}
          >
            <pre style={{ color: T.white, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(JSON_DATA, null, 2)
                .split("\n")
                .map((line, i) => {
                  const hasKey = line.match(/^(\s*)"([^"]+)":/);
                  const hasStr = line.match(/"([^"]+)"(?!:)/);
                  if (hasKey)
                    return (
                      <div key={i}>
                        {line.slice(0, line.indexOf('"'))}
                        <span style={{ color: T.cyan }}>"{hasKey[2]}"</span>
                        {line.slice(line.indexOf(":"))}
                      </div>
                    );
                  return (
                    <div
                      key={i}
                      style={{
                        color:
                          typeof line.trim() === "string" &&
                          (line.trim().startsWith('"') ||
                            line.trim().startsWith("["))
                            ? T.green
                            : T.orange,
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
            </pre>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.cyan}>NAVIGATE THE DATA</SL>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {PATHS.map((p, i) => (
              <button
                key={i}
                onClick={() => setSel(i)}
                style={{
                  padding: "4px 9px",
                  borderRadius: 7,
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`,
                  background:
                    sel === i
                      ? "rgba(34,211,238,.12)"
                      : "rgba(255,255,255,.02)",
                  color: sel === i ? T.cyan : T.grey,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <PyBlock
            code={`import json\n\nwith open("data.json") as f:\n    data = json.load(f)\n\n# Access:\n${PATHS[sel].expr}`}
          />
          <OutBlock label="Result">{PATHS[sel].result}</OutBlock>
        </div>
      </div>
    </div>
  );
}

function Module18() {
  return (
    <Course
      intro={{
        explain:
          "An API (Application Programming Interface) lets programs communicate over the internet. You send an HTTP request to a URL, the server processes it and sends back a response — almost always in JSON format, which maps directly to nested Python dicts and lists. In Python, the requests library handles the HTTP request, and pandas handles the data. This is how you pull live data from financial services, HR systems, CRMs, analytics platforms, and any modern business tool.",
        learn: [
          "Make HTTP GET requests with requests.get() and inspect the status and body",
          "Check the status code and parse the JSON response body into Python objects",
          "Navigate nested JSON safely to reach the fields you actually need",
          "Flatten a nested list of JSON records into a flat DataFrame using pd.json_normalize()",
        ],
        concepts: [
          "response.status_code == 200 means success — always check this before processing the body",
          "response.json() parses the JSON response body into Python dicts and lists automatically",
          "Nested access: data['employees'][0]['scores']['q1'] — chain brackets to navigate the structure",
          "pd.json_normalize(data) flattens nested keys into columns — 'scores.q1' becomes a column name",
        ],
        why: "Most live business data is served through APIs. CRMs, payroll systems, analytics tools, financial data providers. Being able to pull, parse, and load API data into pandas is one of the most in-demand practical skills in data work today.",
      }}
      c={T.cyan}
      steps={[
        {
          title: "JSON explorer",
          desc: "JSON (JavaScript Object Notation) is a text format that represents data as nested objects (like Python dicts) and arrays (like Python lists). When an API sends you a response and you call response.json(), Python parses that text into actual dict and list objects. You navigate the structure using bracket notation: data['employees'][0]['name'] means: take the employees key, take the first item in that list (index 0), then take the name key. Click the path buttons to see each navigation pattern with its code and result.",
          content: () => <JsonExplorer />,
        },
        {
          title: "Calling APIs",
          desc: "The requests library is the standard way to make HTTP requests in Python. requests.get(url) sends a GET request to the URL. The response object has two key attributes: .status_code (200 means OK, 404 means not found, 500 means server error) and .json() which parses the response body from JSON into Python objects. Always check the status code before processing. Use headers= to pass authentication tokens. Use params= to pass query parameters — requests builds the URL string for you.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                APIs return JSON. The pattern is always: make request → check
                status → parse JSON → extract data → load to DataFrame.
              </Note>
              <PyBlock
                label="Python — requests + pandas"
                code={`import requests\nimport pandas as pd\n\n# Basic GET request:\nurl = "https://api.example.com/employees"\nresponse = requests.get(url)\n\n# Always check the status:\nif response.status_code == 200:\n    data = response.json()  # dict/list\nelse:\n    print(f"Error: {response.status_code}")\n\n# With auth headers:\nheaders = {"Authorization": "Bearer YOUR_TOKEN"}\nresponse = requests.get(url, headers=headers)\n\n# With query parameters:\nparams = {"dept": "Engineering", "active": True}\nresponse = requests.get(url, params=params)\n# → /employees?dept=Engineering&active=True\n\n# Response to DataFrame:\ndata = response.json()\ndf = pd.DataFrame(data["employees"])\n\n# Handle errors safely:\ntry:\n    response = requests.get(url, timeout=10)\n    response.raise_for_status()  # raises on 4xx/5xx\n    df = pd.DataFrame(response.json())\nexcept requests.exceptions.Timeout:\n    print("Request timed out")\nexcept requests.exceptions.HTTPError as e:\n    print(f"HTTP error: {e}")`}
              />
            </div>
          ),
        },
        {
          title: "Flatten nested JSON",
          desc: "API responses are almost always nested — a list of employee records where each record has nested address, scores, and contact objects. pd.DataFrame(data) only flattens one level. pd.json_normalize(data) goes deeper — it finds nested dicts and promotes their keys into columns using dot notation: 'scores.q1' becomes a column. For very deep nesting, use the record_path and meta parameters to specify exactly which nested array to expand and which top-level keys to include as metadata columns alongside it.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.cyan}>
                API responses are often deeply nested.{" "}
                <code>pd.json_normalize()</code> is the key tool for flattening
                them into a flat DataFrame.
              </Note>
              <PyBlock
                label="pandas — json_normalize"
                code={`import json\nimport pandas as pd\n\ndata = [\n    {"id":1,"name":"Amara","scores":{"q1":88,"q2":92},\n     "address":{"city":"Lagos","country":"Nigeria"}},\n    {"id":2,"name":"Bola","scores":{"q1":79,"q2":85},\n     "address":{"city":"Accra","country":"Ghana"}},\n]\n\n# pd.json_normalize — flattens nested structure:\ndf = pd.json_normalize(data)\n#    id   name  scores.q1  scores.q2  address.city  address.country\n# 0   1  Amara         88         92         Lagos          Nigeria\n# 1   2   Bola         79         85         Accra            Ghana\n\n# Rename the dot-separated columns:\ndf.columns = df.columns.str.replace(".", "_", regex=False)\n\n# For paginated APIs:\nall_pages = []\nfor page in range(1, total_pages+1):\n    r = requests.get(url, params={"page": page})\n    all_pages.extend(r.json()["data"])\ndf = pd.json_normalize(all_pages)`}
              />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz
              c={T.cyan}
              questions={[
                {
                  question:
                    "response.json() after a requests.get() call returns what?",
                  options: [
                    "A JSON string",
                    "A Python dict or list (parsed from the JSON response body)",
                    "A bytes object",
                    "A DataFrame",
                  ],
                  correct: 1,
                  explanation:
                    ".json() parses the response body as JSON and returns the equivalent Python object — usually a dict or list. It's equivalent to json.loads(response.text). Call .json() only after confirming response.status_code == 200.",
                },
                {
                  question: "What does response.raise_for_status() do?",
                  options: [
                    "Returns the status code",
                    "Raises an HTTPError exception if status code is 4xx or 5xx",
                    "Logs the status to stderr",
                    "Always raises an exception",
                  ],
                  correct: 1,
                  explanation:
                    ".raise_for_status() raises requests.exceptions.HTTPError for 4xx (client errors) and 5xx (server errors). For 2xx responses it does nothing. It's a clean pattern to crash-early on API failures rather than silently processing empty or error responses.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

// ─── MODULE 19: FULL PIPELINE ─────────────────────────────────────────────────
function PipelineVisual() {
  const [step, setStep] = useState(0);
  const STEPS = [
    {
      label: "Load",
      icon: "📂",
      desc: "Read data into a DataFrame",
      code: `import pandas as pd\nimport numpy as np\n\n# Load from CSV:\ndf = pd.read_csv("employees.csv",\n    parse_dates=["hired"],\n    na_values=["N/A","null",""]\n)\nprint(f"Loaded: {df.shape}")\ndf.head()`,
    },
    {
      label: "Inspect",
      icon: "🔍",
      desc: "Understand what you have",
      code: `# Shape, types, nulls:\ndf.info()\ndf.describe()\ndf.isnull().sum()\n\n# Unique values per column:\nfor col in df.columns:\n    nunique = df[col].nunique()\n    nulls = df[col].isnull().sum()\n    print(f"{col}: {nunique} unique, {nulls} nulls")\n\n# Spot numeric columns stored as strings:\ndf.dtypes[df.dtypes == "object"]`,
    },
    {
      label: "Clean",
      icon: "🧹",
      desc: "Fix types, nulls, duplicates",
      code: `# 1. Fix dtypes:\ndf["salary"] = pd.to_numeric(df["salary"],\n    errors="coerce")\n# hired already parsed_dates in read_csv\n\n# 2. Handle nulls:\ndf["score"].fillna(df["score"].median(),\n    inplace=True)\ndf.dropna(subset=["salary"], inplace=True)\n\n# 3. Remove duplicates:\ndf.drop_duplicates(subset=["id"],\n    inplace=True)\n\n# 4. Validate:\nassert df["salary"].min() > 0\nassert df.duplicated().sum() == 0`,
    },
    {
      label: "Transform",
      icon: "⚙️",
      desc: "Derive new columns",
      code: `# Tenure in years:\ndf["tenure_yrs"] = (\n    (pd.Timestamp.now() - df["hired"])\n    .dt.days / 365.25\n).round(1)\n\n# Salary tier:\ndf["tier"] = pd.cut(\n    df["salary"],\n    bins=[0, 70000, 82000, float("inf")],\n    labels=["Junior", "Mid", "Senior"]\n)\n\n# Group summary:\nsummary = df.groupby("dept").agg(\n    headcount = ("id",     "count"),\n    avg_salary = ("salary", "mean"),\n    avg_tenure = ("tenure_yrs", "mean"),\n).round(1)`,
    },
    {
      label: "Visualise",
      icon: "📊",
      desc: "Communicate findings",
      code: `import matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 2, figsize=(12,4))\n\n# Chart 1: Headcount by dept\nsummary["headcount"].plot(\n    kind="bar", ax=axes[0],\n    title="Headcount by Dept",\n    color=["#60a5fa","#4ade80","#c084fc"]\n)\n\n# Chart 2: Avg salary vs avg tenure\naxes[1].scatter(\n    summary["avg_salary"],\n    summary["avg_tenure"],\n    s=summary["headcount"]*80\n)\nfor dept in summary.index:\n    axes[1].annotate(dept,\n        (summary.loc[dept,"avg_salary"],\n         summary.loc[dept,"avg_tenure"]))\n\nplt.tight_layout()\nplt.savefig("report.png", bbox_inches="tight")`,
    },
    {
      label: "Output",
      icon: "✅",
      desc: "Export results",
      code: `# Save cleaned data:\ndf.to_csv("employees_clean.csv", index=False)\n\n# Save summary as Excel with formatting:\nwith pd.ExcelWriter("report.xlsx") as writer:\n    df.to_excel(writer, sheet_name="Data",\n                index=False)\n    summary.to_excel(writer,\n                     sheet_name="Summary")\n\n# Print key stats:\nprint(f"\\n{'='*40}")\nprint(f"EMPLOYEES REPORT — {pd.Timestamp.now().date()}")\nprint(f"{'='*40}")\nprint(f"Total employees: {len(df)}")\nprint(f"Avg salary: {df['salary'].mean():,.0f}")\nprint(summary.to_string())`,
    },
  ];
  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>
        Step through a complete data pipeline. This is the workflow you'll
        follow on every real project.
      </Hint>
      <div
        style={{
          display: "flex",
          gap: 0,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${T.slate}`,
        }}
      >
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              flex: 1,
              padding: "9px 4px",
              border: "none",
              cursor: "pointer",
              background:
                step === i
                  ? "rgba(96,165,250,.13)"
                  : step > i
                    ? "rgba(96,165,250,.05)"
                    : "transparent",
              borderRight: i < 5 ? `1px solid ${T.slate}` : "none",
              transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 14 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: step >= i ? T.blue : T.greyDark,
                fontFamily: "monospace",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </button>
        ))}
      </div>
      <div
        style={{
          height: 2,
          background: T.slate,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: T.blue,
            borderRadius: 2,
            transition: "width .3s",
          }}
        />
      </div>
      <div
        style={{
          background: `${T.blue}09`,
          border: `1px solid ${T.blue}25`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          color: T.greyLight,
        }}
      >
        <strong style={{ color: T.blue }}>{STEPS[step].label}:</strong>{" "}
        {STEPS[step].desc}
      </div>
      <PyBlock
        code={STEPS[step].code}
        label={`Step ${step + 1} of 6 — ${STEPS[step].label}`}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 10,
            cursor: step === 0 ? "not-allowed" : "pointer",
            fontFamily: "monospace",
            border: `1px solid ${T.slate}`,
            background: "transparent",
            color: step === 0 ? T.greyDark : T.grey,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setStep((s) => Math.min(5, s + 1))}
          disabled={step === 5}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 10,
            cursor: step === 5 ? "not-allowed" : "pointer",
            fontFamily: "monospace",
            border: `1px solid ${step === 5 ? T.slate : T.blue}44`,
            background: step === 5 ? "transparent" : "rgba(96,165,250,.12)",
            color: step === 5 ? T.greyDark : T.blue,
          }}
        >
          {step === 5 ? "Done ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

function Module19() {
  return (
    <Course
      intro={{
        explain:
          "A data pipeline is a repeatable sequence of steps that takes raw, messy data and produces clean, analysed output. The steps are always the same: load the data, inspect it to understand what you have, clean it to fix problems, transform it to add useful derived columns, visualise your findings, and export the results. In production, pipelines run automatically every day or every hour — which means every step must be correct, robust, and observable.",
        learn: [
          "Structure a full data project as a sequence of named, testable pipeline functions",
          "Write modular functions that each take a DataFrame and return a transformed DataFrame",
          "Add logging statements and assertions so failures are caught early with clear messages",
          "Export results to CSV, Excel, and chart files in one complete reproducible run",
        ],
        concepts: [
          "Each function should take a df as input and return a df — this makes steps composable and individually testable",
          "df = df.copy() at the start of a function prevents accidentally modifying the original data",
          "assert df['id'].is_unique — always validate key assumptions after each step, do not assume",
          "logging.info(f'Cleaned: {len(df)} rows') after each step so you always know what was processed",
        ],
        why: "This is what a data analyst or engineer does every day. Every module in this course was a building block toward this. A clean, well-structured pipeline is the professional deliverable — not just working analysis, but a repeatable, trustworthy process that produces it reliably.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Full pipeline",
          desc: "A data pipeline has six stages that always appear in the same order. Load: read raw data into a DataFrame. Inspect: understand the shape, types, and nulls before touching anything. Clean: fix dtypes, handle missing values, remove duplicates. Transform: derive new columns that answer the business question. Visualise: produce charts that communicate findings clearly. Output: save results to CSV, Excel, or a database. Step through each stage to see the code for a complete employee analytics pipeline.",
          content: () => <PipelineVisual />,
        },
        {
          title: "Production patterns",
          desc: "A Jupyter notebook is for exploration. Production code — code that runs on a schedule and must be reliable — follows different conventions. Functions with clear signatures replace sprawling notebook cells. Type hints (name: str) document what each function expects. Assertions (assert df['id'].is_unique) validate assumptions and fail loudly if violated. Logging with the logging module records what happened and when, which is essential for debugging when a pipeline fails at 3am. df = df.copy() inside every function prevents one step from silently corrupting the next step's input.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>
                Notebooks are for exploration. Production code follows different
                patterns — functions, logging, assertions, and reproducibility.
              </Note>
              <PyBlock
                label="Production-grade data script"
                code={`import pandas as pd\nimport logging\nfrom pathlib import Path\n\nlogging.basicConfig(level=logging.INFO)\nlog = logging.getLogger(__name__)\n\ndef load_data(path: str) -> pd.DataFrame:\n    """Load and validate raw employee data."""\n    path = Path(path)\n    if not path.exists():\n        raise FileNotFoundError(f"No file at {path}")\n    df = pd.read_csv(path, parse_dates=["hired"])\n    log.info(f"Loaded {len(df)} rows from {path.name}")\n    return df\n\ndef clean(df: pd.DataFrame) -> pd.DataFrame:\n    """Standardise types and handle nulls."""\n    df = df.copy()  # never modify input in place\n    df["salary"] = pd.to_numeric(df["salary"], errors="coerce")\n    df["score"].fillna(df["score"].median(), inplace=True)\n    df.drop_duplicates(subset=["id"], inplace=True)\n    assert df["salary"].isna().sum() == 0, "Null salaries remain"\n    return df\n\ndef transform(df: pd.DataFrame) -> pd.DataFrame:\n    """Add derived columns."""\n    df = df.copy()\n    df["tenure_yrs"] = ((pd.Timestamp.now() - df["hired"]).dt.days / 365.25).round(1)\n    return df\n\nif __name__ == "__main__":\n    df = load_data("employees.csv")\n    df = clean(df)\n    df = transform(df)\n    df.to_csv("employees_processed.csv", index=False)\n    log.info("Pipeline complete")`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}

// ─── CATALOG & APP SHELL ──────────────────────────────────────────────────────
const PY_MODULES = [
  {
    id: "01",
    title: "Variables & Types",
    icon: "🔢",
    level: "easy",
    c: T.blue,
    desc: "9 types with live type explorer, f-strings, mutability, and LEGB scope",
    component: Module01,
  },
  {
    id: "02",
    title: "Lists & Loops",
    icon: "📋",
    level: "easy",
    c: T.purple,
    desc: "List operations, loop animator, comprehension builder, zip & enumerate",
    component: Module02,
  },
  {
    id: "03",
    title: "Dictionaries",
    icon: "🗂️",
    level: "easy",
    c: T.orange,
    desc: "Live dict explorer, defaultdict, Counter, nested dicts, power patterns",
    component: Module03,
  },
  {
    id: "04",
    title: "Functions",
    icon: "⚙️",
    level: "easy",
    c: T.purple,
    desc: "Function tracer, all arg types, closures, decorators, common mistakes",
    component: Module04,
  },
  {
    id: "05",
    title: "DataFrames",
    icon: "🐼",
    level: "mid",
    c: T.cyan,
    desc: "TABLE/.info()/.describe() explorer, creating dfs, index & alignment",
    component: Module05,
  },
  {
    id: "06",
    title: "Filtering",
    icon: "🎯",
    level: "mid",
    c: T.blue,
    desc: "Filter builder, .loc vs .iloc, multiple conditions, isin & between",
    component: Module06,
  },
  {
    id: "07",
    title: "GroupBy",
    icon: "📊",
    level: "mid",
    c: T.cyan,
    desc: "4-phase journey, .agg() vs .transform(), named aggregations",
    component: Module07,
  },
  {
    id: "08",
    title: "Merging",
    icon: "🔗",
    level: "mid",
    c: T.green,
    desc: "Merge animator (INNER/LEFT/RIGHT/OUTER), pd.concat axis=0 & 1",
    component: Module08,
  },
  {
    id: "09",
    title: "Data Cleaning",
    icon: "🧹",
    level: "mid",
    c: T.yellow,
    desc: "Null heatmap, dtype fixer, outlier detection, duplicates",
    component: Module09,
  },
  {
    id: "10",
    title: "String Operations",
    icon: "📝",
    level: "mid",
    c: T.green,
    desc: "Live str method explorer, .str accessor, regex in pandas",
    component: Module10,
  },
  {
    id: "11",
    title: "Dates & Times",
    icon: "📅",
    level: "mid",
    c: T.blue,
    desc: "Datetime explorer, tenure calculator, resample & time periods",
    component: Module11,
  },
  {
    id: "12",
    title: "Visualisation",
    icon: "📈",
    level: "mid",
    c: T.blue,
    desc: "6-chart builder, choosing the right chart, subplots & saving",
    component: Module12,
  },
  {
    id: "13",
    title: "Lambda & Apply",
    icon: "⚡",
    level: "hard",
    c: T.purple,
    desc: "Row-by-row apply animator, vectorised alternatives, map vs transform",
    component: Module13,
  },
  {
    id: "14",
    title: "NumPy",
    icon: "🔢",
    level: "hard",
    c: T.orange,
    desc: "Array creation, vectorised math, statistics, boolean masking",
    component: Module14,
  },
  {
    id: "15",
    title: "Error Handling",
    icon: "🛡️",
    level: "hard",
    c: T.red,
    desc: "try/except explorer, common exceptions, custom errors, context managers",
    component: Module15,
  },
  {
    id: "16",
    title: "File I/O",
    icon: "📁",
    level: "mid",
    c: T.cyan,
    desc: "read_csv() mastery, CSV/Excel/JSON/Parquet/SQL, writing output",
    component: Module16,
  },
  {
    id: "17",
    title: "Regular Expressions",
    icon: "🔍",
    level: "hard",
    c: T.green,
    desc: "Live regex builder with highlighting, cheatsheet, pandas regex patterns",
    component: Module17,
  },
  {
    id: "18",
    title: "APIs & JSON",
    icon: "🌐",
    level: "hard",
    c: T.cyan,
    desc: "JSON navigator, calling APIs with requests, flatten with json_normalize",
    component: Module18,
  },
  {
    id: "19",
    title: "Full Pipeline",
    icon: "🚀",
    level: "hard",
    c: T.blue,
    desc: "6-step production pipeline: Load→Inspect→Clean→Transform→Visualise→Output",
    component: Module19,
  },
];

const LEVEL = {
  easy: { label: "Beginner", bg: "rgba(74,222,128,.1)", text: T.green },
  mid: { label: "Intermediate", bg: "rgba(250,204,21,.1)", text: T.yellow },
  hard: { label: "Advanced", bg: "rgba(248,113,113,.1)", text: T.red },
};

function PyCatalog({ onSelect }) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all"
      ? PY_MODULES
      : PY_MODULES.filter((m) => m.level === filter);
  const total = PY_MODULES.length;
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            color: T.green,
            fontFamily: "monospace",
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          🐍 ALGORA PLAYGROUND
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: T.white,
            fontFamily: "'Syne',sans-serif",
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          Python for Data
        </div>
        <div
          style={{ fontSize: 13, color: T.grey, marginTop: 8, lineHeight: 1.6 }}
        >
          {total} interactive modules · visual-first · hands-on every step
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginTop: 14,
          }}
        >
          {[
            {
              c: T.green,
              label:
                PY_MODULES.filter((m) => m.level === "easy").length +
                " Beginner",
            },
            {
              c: T.yellow,
              label:
                PY_MODULES.filter((m) => m.level === "mid").length +
                " Intermediate",
            },
            {
              c: T.red,
              label:
                PY_MODULES.filter((m) => m.level === "hard").length +
                " Advanced",
            },
          ].map((b) => (
            <div
              key={b.label}
              style={{ fontSize: 10, color: b.c, fontFamily: "monospace" }}
            >
              {b.label}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginTop: 14,
            flexWrap: "wrap",
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
                border: `1px solid ${filter === f ? (f === "all" ? T.cyan : LEVEL[f].text) : "rgba(255,255,255,.1)"}`,
                background:
                  filter === f
                    ? f === "all"
                      ? "rgba(34,211,238,.1)"
                      : LEVEL[f].bg
                    : "transparent",
                color:
                  filter === f
                    ? f === "all"
                      ? T.cyan
                      : LEVEL[f].text
                    : T.grey,
              }}
            >
              {f === "all" ? `All ${total}` : LEVEL[f].label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))",
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
              position: "relative",
              overflow: "hidden",
              animation: `fadeUp .4s ease ${i * 25}ms both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${m.c}44`;
              e.currentTarget.style.background = `${m.c}0a`;
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
                background: `radial-gradient(ellipse at top left,${m.c}07 0%,transparent 65%)`,
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
                  background: LEVEL[m.level].bg,
                  color: LEVEL[m.level].text,
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {LEVEL[m.level].label}
              </span>
            </div>
            <div
              style={{
                fontSize: 9,
                color: m.c,
                fontFamily: "monospace",
                marginBottom: 3,
                letterSpacing: 0.5,
                fontWeight: 700,
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
  );
}

function PyModuleShell({ module, onBack, onNav }) {
  const Comp = module.component;
  const idx = PY_MODULES.findIndex((m) => m.id === module.id);
  const prev = PY_MODULES[idx - 1];
  const next = PY_MODULES[idx + 1];
  return (
    <div>
      <div
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.slate}`,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            border: `1px solid ${T.slate}`,
            background: "transparent",
            color: T.grey,
          }}
        >
          ← Catalog
        </button>
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
            Module {module.id} of {PY_MODULES.length} · Python for Data · Algora
          </div>
        </div>
        <Badge c={LEVEL[module.level].text}>{LEVEL[module.level].label}</Badge>
      </div>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "24px 20px" }}>
        <Comp />
      </div>
      <div
        style={{
          maxWidth: 940,
          margin: "0 auto",
          padding: "0 20px 40px",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {prev ? (
          <button
            onClick={() => onNav(prev)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1px solid ${T.slate}`,
              background: T.surface,
              fontSize: 10,
              fontFamily: "monospace",
              textAlign: "left",
              display: "flex",
              gap: 8,
              alignItems: "center",
              color: T.grey,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${prev.c}44`;
              e.currentTarget.style.color = prev.c;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = `1px solid ${T.slate}`;
              e.currentTarget.style.color = T.grey;
            }}
          >
            ←{" "}
            <div>
              <div style={{ fontSize: 8, color: T.greyDark }}>Previous</div>
              {prev.icon} {prev.title}
            </div>
          </button>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {next && (
          <button
            onClick={() => onNav(next)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1px solid ${T.slate}`,
              background: T.surface,
              fontSize: 10,
              fontFamily: "monospace",
              textAlign: "right",
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "flex-end",
              color: T.grey,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${next.c}44`;
              e.currentTarget.style.color = next.c;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = `1px solid ${next.c}`;
              e.currentTarget.style.color = next.c;
            }}
          >
            <div>
              <div style={{ fontSize: 8, color: T.greyDark }}>Next</div>
              {next.icon} {next.title}
            </div>{" "}
            →
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState(null);
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: T.bg,
        minHeight: "100vh",
        color: T.white,
      }}
    >
      <style>{GS}</style>
      {!current && <PyCatalog onSelect={setCurrent} />}
      {current && (
        <PyModuleShell
          module={current}
          onBack={() => setCurrent(null)}
          onNav={setCurrent}
        />
      )}
    </div>
  );
}
