"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import {
  PyBlock,
  Note,
  Tip,
  Quiz,
  Hint,
  Course,
  SLabel as SL,
} from "../python-shared";

function NumpyVisual() {
  const [op, setOp] = useState("create");
  const ARR = [
    85000, 72000, 91000, 68000, 75000, 88000, 71000, 69000, 93000, 65000,
  ];
  const mean = Math.round(ARR.reduce((s, v) => s + v, 0) / ARR.length);
  const std = Math.round(
    Math.sqrt(ARR.reduce((s, v) => s + (v - mean) ** 2, 0) / ARR.length),
  );

  const OPS: Record<string, { label: string; code: string }> = {
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
              fontFamily: "'JetBrains Mono',monospace",
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
        <PyBlock code={OPS[op].code} label="NumPy" />
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
                        fontFamily: "'JetBrains Mono',monospace",
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
                        fontFamily: "'JetBrains Mono',monospace",
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
                  key={String(k)}
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
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    np.{k}()
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.orange,
                      fontFamily: "'JetBrains Mono',monospace",
                      fontWeight: 700,
                    }}
                  >
                    {(v as number).toLocaleString()}
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
                          fontFamily: "'JetBrains Mono',monospace",
                          color: T.greyLight,
                          flex: 1,
                        }}
                      >
                        {s.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'JetBrains Mono',monospace",
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

export default function Module14() {
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
                        fontFamily: "'Bricolage Grotesque',sans-serif",
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
