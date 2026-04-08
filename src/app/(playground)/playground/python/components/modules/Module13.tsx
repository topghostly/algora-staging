"use client";
import React, { useState, useRef } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Tip, Quiz, Course, SLabel as SL, Badge } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1,  name: "Amara Osei",      dept: "Engineering", salary: 85000, hired: "2021-03-15", score: 88.5  },
  { id: 2,  name: "Bola Adeyemi",    dept: "Analytics",   salary: 72000, hired: "2020-07-22", score: null  },
  { id: 3,  name: "Chidi Nwosu",     dept: "Engineering", salary: 91000, hired: "2019-11-01", score: 92.0  },
  { id: 4,  name: "Dami Okonkwo",    dept: "Product",     salary: 68000, hired: "2022-01-10", score: 74.0  },
  { id: 5,  name: "Emeka Eze",       dept: "Analytics",   salary: 77000, hired: "2020-04-05", score: null  },
  { id: 6,  name: "Funmi Alade",     dept: "Engineering", salary: 95000, hired: "2018-09-17", score: 97.0  },
  { id: 7,  name: "Gbemi Coker",     dept: "Product",     salary: 71000, hired: "2021-11-30", score: 81.0  },
  { id: 8,  name: "Hassan Musa",     dept: "Analytics",   salary: 69000, hired: "2023-02-14", score: 70.0  },
  { id: 9,  name: "Ifeoma Uche",     dept: "Engineering", salary: 83000, hired: "2022-06-20", score: null  },
  { id: 10, name: "Jide Fadahunsi",  dept: "Product",     salary: 78000, hired: "2019-08-11", score: 85.0  },
];

function ApplyAnimator() {
  const [fn, setFn] = useState("tier");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  type Row = typeof DF_EMPLOYEES[0];
  const FNS: Record<string, { label: string; fn: (r: Row) => string | number; c: string; code: string }> = {
    tier: {
      label: "classify_tier",
      fn: r => r.salary >= 90000 ? "Senior" : r.salary >= 75000 ? "Mid" : r.salary >= 65000 ? "Junior" : "Trainee",
      c: T.purple,
      code: `df["tier"] = df["salary"].apply(\n    lambda s:\n        "Senior" if s >= 90000 else\n        "Mid"    if s >= 75000 else\n        "Junior" if s >= 65000 else "Trainee"\n)\n# axis=0 (default) — one column at a time`,
    },
    bonus: {
      label: "calc_bonus (multi-col)",
      fn: r => Math.round(r.salary * (r.score ? (r.score / 100) * 0.1 : 0.05)),
      c: T.green,
      code: `def calc_bonus(row):\n    rate = (row["score"] / 100 * 0.10\n            if pd.notna(row["score"])\n            else 0.05)  # 5% if no score\n    return round(row["salary"] * rate)\n\n# axis=1 for row-wise (multi-column):\ndf["bonus"] = df.apply(calc_bonus, axis=1)`,
    },
    tenure: {
      label: "years_tenure",
      fn: r => 2024 - parseInt(r.hired.slice(0, 4)),
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
        clearInterval(timer.current!);
        setRunning(false);
      }
    }, 350);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">Select a function type, then Animate to watch .apply() work row by row. Each row lights up as the function executes on it.</Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {Object.entries(FNS).map(([k, v]) => (
          <button key={k} onClick={() => { setFn(k); setStep(-1); setRunning(false); if (timer.current) clearInterval(timer.current); }} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${fn === k ? v.c : "rgba(255,255,255,.07)"}`, background: fn === k ? `${v.c}12` : "rgba(255,255,255,.02)", color: fn === k ? v.c : T.grey, fontWeight: fn === k ? 700 : 400 }}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PyBlock code={active.code} label="pandas — .apply()" />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={play} disabled={running} style={{ padding: "6px 16px", borderRadius: 8, fontSize: 10, cursor: running ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${active.c}55`, background: running ? `${active.c}06` : `${active.c}12`, color: running ? T.grey : active.c }}>
              {running ? "⚙️ Running..." : "▶ Animate"}
            </button>
            <button onClick={() => { if (timer.current) clearInterval(timer.current); setStep(-1); setRunning(false); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: T.grey }}>Reset</button>
          </div>
          <Tip icon="⚡" title="PERFORMANCE RULE" c={T.yellow}>.apply() has Python-level overhead per row. For &gt;100k rows, prefer: <strong>arithmetic</strong> (df*2), <strong>.str</strong> methods, <strong>np.where()</strong>, or <strong>pd.cut()</strong>. Use .apply() only when the logic needs multiple columns or complex conditionals.</Tip>
        </div>
        <div>
          <SL c={active.c}>ROW-BY-ROW</SL>
          <div style={{ borderRadius: 8, border: `1px solid ${T.slate}`, overflow: "hidden" }}>
            {DF_EMPLOYEES.map((row, ri) => {
              const res = active.fn(row);
              const done = step >= ri;
              const curr = step === ri;
              return (
                <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.9fr", padding: "5px 10px", borderBottom: ri < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}33` : "none", background: curr ? `${active.c}18` : done ? `${active.c}07` : "transparent", transition: "all .2s", animation: curr ? "glow .35s ease" : "none" }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyLight }}>{row.name}</span>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.greyDark }}>
                    {fn === "bonus" ? `${row.salary.toLocaleString()} / ${row.score || "null"}` : fn === "tenure" ? row.hired.slice(0, 4) : row.salary.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: done ? active.c : T.greyDark, fontWeight: done ? 700 : 400, transition: "color .2s" }}>
                    {done ? String(typeof res === "number" ? res.toLocaleString() : res) : "—"}
                    {curr && <span style={{ fontSize: 7, color: active.c, marginLeft: 3 }}>←</span>}
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
    { slow: `df["salary"].apply(lambda x: x * 1.1)`,                                       fast: `df["salary"] * 1.1`,                                                   label: "Arithmetic", why: "Vectorised NumPy operation — C speed" },
    { slow: `df["name"].apply(lambda x: x.upper())`,                                        fast: `df["name"].str.upper()`,                                               label: "String ops", why: ".str accessor is vectorised" },
    { slow: `df["salary"].apply(lambda x: x > 75000)`,                                      fast: `df["salary"] > 75000`,                                                 label: "Comparison", why: "Direct comparison on Series" },
    { slow: `df["salary"].apply(lambda x:\n    "high" if x>80000 else "low")`,              fast: `import numpy as np\nnp.where(df["salary"]>80000,"high","low")`,           label: "If/else",    why: "np.where() vectorised conditional" },
    { slow: `df["salary"].apply(lambda x:\n    pd.cut([x],[0,70000,80000,95000],\n           labels=["J","M","S"])[0])`, fast: `pd.cut(df["salary"],\n       bins=[0,70000,80000,95000],\n       labels=["Junior","Mid","Senior"])`, label: "Binning", why: "pd.cut() operates on the whole column" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>Click SLOW then FAST to see the slower .apply() vs the faster vectorised equivalent for each operation type.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        <button onClick={() => setMode("slow")} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: mode === "slow" ? "rgba(248,113,113,.14)" : "transparent", color: mode === "slow" ? T.red : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: mode === "slow" ? 700 : 400 }}>🐌 SLOW (.apply())</button>
        <button onClick={() => setMode("fast")} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: mode === "fast" ? "rgba(74,222,128,.14)" : "transparent", color: mode === "fast" ? T.green : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: mode === "fast" ? 700 : 400 }}>⚡ FAST (vectorised)</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PAIRS.map((p, i) => (
          <div key={i} style={{ border: `1px solid ${mode === "fast" ? T.green : T.red}33`, borderRadius: 9, padding: "10px 12px", background: mode === "fast" ? "rgba(74,222,128,.04)" : "rgba(248,113,113,.03)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <Badge c={mode === "fast" ? T.green : T.red}>{p.label}</Badge>
              {mode === "fast" && <span style={{ fontSize: 9, color: T.green }}>{p.why}</span>}
            </div>
            <PyBlock code={mode === "fast" ? p.fast : p.slow} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Module13() {
  return (
    <Course
      intro={{
        explain: ".apply() is pandas' escape hatch — it runs any Python function across every element, row, or column of a DataFrame. It is flexible enough to express any logic, but it comes with a real cost: it processes one Python object at a time, losing the compiled speed of vectorised pandas. On 10 rows this does not matter. On 1 million rows it can be 100 times slower than the vectorised equivalent. Knowing when to use it — and when to replace it — is a mark of mature pandas code.",
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
              <Note c={T.purple}>Three similar methods with different purposes: <code>.map()</code> for Series element substitution, <code>.apply()</code> for custom functions, <code>.transform()</code> for group-preserving operations.</Note>
              <PyBlock label="pandas — map vs apply vs transform" code={`# .map() — substitute values (Series only):\ncolor_map = {"Engineering":"blue","Analytics":"green","Product":"purple"}\ndf["dept_color"] = df["dept"].map(color_map)\n# Rows not in map → NaN\n\n# .replace() — like map but keeps unmapped values:\ndf["dept"].replace({"Engineering": "Eng"})  # others unchanged\n\n# .apply() — custom function, more flexible:\ndf["tier"] = df["salary"].apply(lambda s: "High" if s>80000 else "Low")\ndf["info"] = df.apply(lambda r: f"{r['name']} ({r['dept']})", axis=1)\n\n# .transform() — group-aware, keeps shape:\ndf["dept_avg_salary"] = df.groupby("dept")["salary"].transform("mean")\ndf["pct_of_dept"] = df["salary"] / df["dept_avg_salary"] * 100`} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { fn: ".map(dict)",     use: "Lookup / encode categorical", when: "Map one Series to another",    ex: "dept → color code" },
                  { fn: ".apply(func)",   use: "Custom per-row/col logic",     when: "Complex logic, multi-col",     ex: "Calculate bonus from salary+score" },
                  { fn: ".transform(fn)", use: "Group-aware, same shape",      when: "Add group stats to original df", ex: "Add dept mean salary to every row" },
                ].map(m => (
                  <div key={m.fn} style={{ border: `1px solid ${T.slate}`, borderRadius: 8, padding: "10px 12px", background: T.surface }}>
                    <code style={{ fontSize: 11, color: T.purple, fontFamily: "'JetBrains Mono',monospace", display: "block", fontWeight: 700, marginBottom: 4 }}>{m.fn}</code>
                    <div style={{ fontSize: 10, color: T.grey, marginBottom: 3 }}>{m.use}</div>
                    <div style={{ fontSize: 9, color: T.greyDark, marginBottom: 4 }}>When: {m.when}</div>
                    <code style={{ fontSize: 9, color: T.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{m.ex}</code>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.purple} questions={[
              {
                question: "When should you use .apply(axis=1) vs .apply() (default)?",
                options: ["When the DataFrame has more than 1000 rows", "When the function needs values from multiple columns in the same row", "When using lambda functions", "When the column has NaN values"],
                correct: 1,
                explanation: "axis=1 applies the function to each ROW, giving access to multiple columns at once (like row['salary'] and row['score']). Default axis=0 applies to each column as a Series. Use axis=1 for multi-column logic.",
              },
              {
                type: "bug",
                question: "What's the issue here?",
                code: `df["upper_name"] = df["name"].apply(str.upper)`,
                options: ["Should be .str.upper()", "apply(str.upper) doesn't work", "Nothing — this is valid and works", "Missing axis=1"],
                correct: 0,
                explanation: "This actually WORKS — apply(str.upper) passes each value to str.upper. But df['name'].str.upper() is faster (vectorised) and more idiomatic pandas. Prefer .str accessor for string operations.",
              },
              {
                question: "df['dept'].map({'Engineering':'Eng'}) — what happens to 'Analytics' and 'Product'?",
                options: ["They stay unchanged", "They become NaN", "KeyError is raised", "They become empty string"],
                correct: 1,
                explanation: ".map() with a dict substitutes matched values and converts unmatched values to NaN. If you want to keep unmapped values unchanged, use .replace() instead.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
