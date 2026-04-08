"use client";
import React, { useState, useEffect, useRef } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, CM, Quiz, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1, name: "Amara Osei",     dept: "Engineering", salary: 85000, score: 88.5 },
  { id: 2, name: "Bola Adeyemi",   dept: "Analytics",   salary: 72000, score: 91.2 },
  { id: 3, name: "Chidi Nwosu",    dept: "Engineering", salary: 91000, score: 79.0 },
  { id: 4, name: "Dami Okafor",    dept: "Product",     salary: 68000, score: null },
  { id: 5, name: "Efe Obi",        dept: "Analytics",   salary: 77000, score: 84.3 },
  { id: 6, name: "Funke Adesanya", dept: "Engineering", salary: 94000, score: 92.1 },
  { id: 7, name: "Grace Mensah",   dept: "Product",     salary: 65000, score: 76.8 },
  { id: 8, name: "Henry Darko",    dept: "Analytics",   salary: 80000, score: 88.0 },
  { id: 9, name: "Ifeoma Eze",     dept: "Engineering", salary: 87000, score: null },
  { id: 10, name: "Jide Bakare",   dept: "Product",     salary: 73000, score: 81.5 },
];

const dc = (dept: string) => ({
  Engineering: { text: T.blue,   bg: "rgba(96,165,250,.08)",   border: "rgba(96,165,250,.3)"   },
  Analytics:   { text: T.cyan,   bg: "rgba(34,211,238,.08)",   border: "rgba(34,211,238,.3)"   },
  Product:     { text: T.purple, bg: "rgba(192,132,252,.08)",  border: "rgba(192,132,252,.3)"  },
  true:        { text: T.green,  bg: "rgba(74,222,128,.08)",   border: "rgba(74,222,128,.3)"   },
  false:       { text: T.red,    bg: "rgba(248,113,113,.08)",  border: "rgba(248,113,113,.3)"  },
} as Record<string, { text: string; bg: string; border: string }>)[dept] ?? { text: T.grey, bg: "transparent", border: T.slate };

function GroupByJourney() {
  const [grpCol, setGrpCol] = useState("dept");
  const [aggFn, setAggFn] = useState("mean");
  const [aggCol, setAggCol] = useState("salary");
  const [phase, setPhase] = useState(0);
  useEffect(() => setPhase(0), [grpCol, aggFn, aggCol]);

  const keys = [...new Set(DF_EMPLOYEES.map(r => String((r as any)[grpCol])))].sort();
  const grouped = Object.fromEntries(keys.map(k => [k, DF_EMPLOYEES.filter(r => String((r as any)[grpCol]) === k)]));
  const agg = (rows: typeof DF_EMPLOYEES) => {
    const v = rows.map(r => (r as any)[aggCol]).filter((x: any) => x !== null) as number[];
    if (aggFn === "count") return rows.length;
    if (aggFn === "mean") return Math.round(v.reduce((s, x) => s + x, 0) / v.length).toLocaleString();
    if (aggFn === "sum") return v.reduce((s, x) => s + x, 0).toLocaleString();
    if (aggFn === "min") return Math.min(...v).toLocaleString();
    if (aggFn === "max") return Math.max(...v).toLocaleString();
    return "—";
  };
  const PHASES = ["Raw df", "groupby()", "Groups", "Aggregate"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Configure groupby + aggregation, then step through all 4 phases. See {DF_EMPLOYEES.length} rows collapse into {keys.length} group summaries.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: T.surface, border: `1px solid ${T.slate}`, borderRadius: 10, padding: "10px 14px" }}>
        <div>
          <SL>groupby()</SL>
          <div style={{ display: "flex", gap: 4 }}>
            {["dept","active"].map(c => (
              <button key={c} onClick={() => setGrpCol(c)} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${grpCol === c ? T.cyan : "rgba(255,255,255,.08)"}`, background: grpCol === c ? "rgba(34,211,238,.12)" : "transparent", color: grpCol === c ? T.cyan : T.grey, fontWeight: grpCol === c ? 700 : 400 }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <SL c={T.cyan}>Agg function</SL>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {["mean","sum","count","min","max"].map(f => (
              <button key={f} onClick={() => setAggFn(f)} style={{ padding: "3px 7px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${aggFn === f ? T.cyan : "rgba(255,255,255,.08)"}`, background: aggFn === f ? "rgba(34,211,238,.12)" : "transparent", color: aggFn === f ? T.cyan : T.grey }}>.{f}()</button>
            ))}
          </div>
        </div>
        <div>
          <SL>Column</SL>
          <div style={{ display: "flex", gap: 4 }}>
            {["salary","score","id"].map(c => (
              <button key={c} onClick={() => setAggCol(c)} style={{ padding: "4px 8px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${aggCol === c ? T.cyan : "rgba(255,255,255,.08)"}`, background: aggCol === c ? "rgba(34,211,238,.12)" : "transparent", color: aggCol === c ? T.cyan : T.grey, fontWeight: aggCol === c ? 700 : 400 }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.slate}` }}>
        {PHASES.map((p, i) => (
          <button key={i} onClick={() => setPhase(i)} style={{ flex: 1, padding: "9px 4px", border: "none", cursor: "pointer", background: phase === i ? "rgba(34,211,238,.13)" : phase > i ? "rgba(34,211,238,.05)" : "transparent", borderRight: i < 3 ? `1px solid ${T.slate}` : "none", transition: "all .2s" }}>
            <div style={{ fontSize: 13 }}>{"📋🎨📦⚡"[i]}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: phase >= i ? T.cyan : T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{p}</div>
          </button>
        ))}
      </div>
      {phase === 0 && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          <PyBlock code={`df.groupby("${grpCol}")["${aggCol}"].${aggFn}()\n# ${DF_EMPLOYEES.length} rows → ${keys.length} rows`} label="pandas" />
        </div>
      )}
      {phase === 1 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", gap: 6, flexWrap: "wrap", padding: 4 }}>
          {keys.map(k => (
            <span key={k} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 14, background: dc(k).bg, border: `1px solid ${dc(k).border}`, color: dc(k).text, fontFamily: "'JetBrains Mono',monospace" }}>{grpCol}="{k}" ({grouped[k].length})</span>
          ))}
        </div>
      )}
      {phase === 2 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 8 }}>
          {keys.map((k, gi) => {
            const col = dc(k);
            return (
              <div key={k} style={{ border: `1px solid ${col.border}`, borderRadius: 10, overflow: "hidden", animation: `fadeUp .4s ease ${gi * 80}ms both` }}>
                <div style={{ padding: "6px 12px", background: col.bg, borderBottom: `1px solid ${col.border}`, display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: col.text, fontFamily: "'JetBrains Mono',monospace" }}>Group: "{k}"</span>
                  <span style={{ fontSize: 9, color: col.text, opacity: 0.7 }}>{grouped[k].length} rows</span>
                </div>
                {grouped[k].map((row, ri) => (
                  <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 0.7fr", padding: "4px 12px", borderBottom: ri < grouped[k].length - 1 ? `1px solid ${col.border}22` : "none", background: "rgba(4,9,20,.6)" }}>
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyLight }}>{row.name}</span>
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: col.text }}>{(row as any)[aggCol] === null ? "NaN" : typeof (row as any)[aggCol] === "number" ? (row as any)[aggCol].toLocaleString() : String((row as any)[aggCol])}</span>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.greyDark }}>{aggCol}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {phase === 3 && (
        <div style={{ animation: "fadeUp .3s ease", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "flex-start" }}>
          <div>
            <SL>BEFORE — {DF_EMPLOYEES.length} rows</SL>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {keys.map((k, gi) => {
                const col = dc(k);
                const v = agg(grouped[k]);
                return (
                  <div key={k} style={{ border: `1px solid ${col.border}`, borderRadius: 8, overflow: "hidden", animation: `fadeUp .3s ease ${gi * 50}ms both` }}>
                    <div style={{ padding: "4px 10px", background: col.bg, fontSize: 9, color: col.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{k} ({grouped[k].length} rows)</div>
                    <div style={{ padding: "5px 10px", background: "rgba(4,9,20,.5)", fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>→ .{aggFn}("{aggCol}") = {v}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ paddingTop: 20, fontSize: 16, color: T.cyan, textAlign: "center" }}>→<div style={{ fontSize: 7, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>collapse</div></div>
          <div>
            <SL c={T.cyan}>AFTER — {keys.length} rows</SL>
            <div style={{ border: `1px solid ${T.slate}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "5px 10px", background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>{grpCol}</span>
                <span style={{ fontSize: 9, color: T.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{aggCol}_{aggFn}</span>
              </div>
              {keys.map((k, gi) => {
                const col = dc(k);
                const v = agg(grouped[k]);
                return (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "8px 10px", borderBottom: gi < keys.length - 1 ? `1px solid ${T.slate}44` : "none", background: col.bg, animation: `popIn .4s ease ${gi * 80}ms both` }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: col.text, fontWeight: 700 }}>{k}</span>
                    <span style={{ fontSize: 15, fontFamily: "'JetBrains Mono',monospace", color: col.text, fontWeight: 800 }}>{String(v)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AggTransformVisual() {
  const [mode, setMode] = useState("agg");
  const deptMean = Object.fromEntries(
    [...new Set(DF_EMPLOYEES.map(r => r.dept))].map(d => [
      d,
      Math.round(DF_EMPLOYEES.filter(r => r.dept === d).reduce((s, r) => s + r.salary, 0) / DF_EMPLOYEES.filter(r => r.dept === d).length),
    ])
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Compare .agg() (collapses rows) vs .transform() (keeps original shape). This is one of the most important GroupBy distinctions.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        {["agg","transform"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: mode === m ? "rgba(96,165,250,.14)" : "transparent", color: mode === m ? T.blue : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: mode === m ? 700 : 400 }}>.{m}()</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <PyBlock code={mode === "agg"
          ? `# .agg() — COLLAPSES rows:\n# Input: 10 rows\n# Output: N rows (one per group)\n\nresult = df.groupby("dept")["salary"].agg(["mean","min","max"])\n#              mean    min    max\n# dept\n# Analytics   72000  69000  75000\n# Engineering 89250  85000  93000\n# Product     68000  65000  71000\n\n# Named aggregations:\ndf.groupby("dept").agg(\n    avg_sal = ("salary", "mean"),\n    headcount = ("id", "count"),\n)`
          : `# .transform() — KEEPS original shape:\n# Input: 10 rows\n# Output: 10 rows (same index)\n\n# Great for adding a column based on group stats:\ndf["dept_avg"] = df.groupby("dept")["salary"].transform("mean")\n\n# Now calculate deviation from dept average:\ndf["vs_dept_avg"] = df["salary"] - df["dept_avg"]\n\n# Use case: normalise within groups,\n# flag outliers, compute % of dept total`
        } label="pandas" />
        <div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                  <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>name</th>
                  <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>dept</th>
                  <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>salary</th>
                  {mode === "transform" && <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.cyan }}>dept_avg</th>}
                  {mode === "transform" && <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.green }}>vs_avg</th>}
                  {mode === "agg" && <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>→</th>}
                </tr>
              </thead>
              <tbody>
                {mode === "agg"
                  ? Object.entries(deptMean).sort().map(([d, m], i) => (
                    <tr key={d} style={{ borderBottom: i < 2 ? `1px solid ${T.slate}33` : "none", background: dc(d).bg }}>
                      <td colSpan={3} style={{ padding: "5px 8px", fontSize: 10, color: dc(d).text, fontWeight: 700 }}>{d}</td>
                      <td style={{ padding: "5px 8px", fontSize: 10, color: T.cyan, fontWeight: 700 }}>{(m as number).toLocaleString()}</td>
                    </tr>
                  ))
                  : DF_EMPLOYEES.slice(0, 8).map((r, i) => {
                    const dAvg = deptMean[r.dept] as number;
                    const diff = r.salary - dAvg;
                    return (
                      <tr key={r.id} style={{ borderBottom: i < 7 ? `1px solid ${T.slate}22` : "none" }}>
                        <td style={{ padding: "4px 8px", fontSize: 9, color: T.greyLight }}>{r.name.split(" ")[0]}</td>
                        <td style={{ padding: "4px 8px", fontSize: 9, color: dc(r.dept).text }}>{r.dept.slice(0, 3)}</td>
                        <td style={{ padding: "4px 8px", fontSize: 9, color: T.greyLight }}>{r.salary.toLocaleString()}</td>
                        <td style={{ padding: "4px 8px", fontSize: 9, color: T.cyan, fontWeight: 700 }}>{dAvg.toLocaleString()}</td>
                        <td style={{ padding: "4px 8px", fontSize: 9, color: diff > 0 ? T.green : T.red, fontWeight: 700 }}>{diff > 0 ? "+" : ""}{diff.toLocaleString()}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, padding: "7px 10px", borderRadius: 8, background: `${T.blue}09`, border: `1px solid ${T.blue}25`, fontSize: 10, color: T.greyLight }}>
            <strong style={{ color: T.blue }}>{mode === "agg" ? "agg():" : "transform():"} </strong>
            {mode === "agg" ? "3 rows out — one per department." : "Still 10 rows — but each row now knows its dept average."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Module07() {
  return (
    <Course
      intro={{
        explain: "GroupBy implements the split-apply-combine pattern: split your data into groups based on the values in one or more columns, apply a function to each group independently, then combine the results into a single summary table. This maps directly to SQL's GROUP BY. It transforms a table of individual records into a summary — headcount by department, average salary by team, total revenue by month — and is the core operation in most reporting work.",
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
              <Note c={T.cyan}>.agg() is the most flexible aggregation tool. Learn to name your output columns and apply multiple functions at once.</Note>
              <PyBlock label="pandas — agg() mastery" code={`# Multiple functions on one column:\ndf.groupby("dept")["salary"].agg(["mean","min","max","count","std"])\n\n# Named aggregations (clean output column names):\nresult = df.groupby("dept").agg(\n    headcount    = ("id",     "count"),\n    avg_salary   = ("salary", "mean"),\n    salary_range = ("salary", lambda x: x.max() - x.min()),\n    avg_score    = ("score",  "mean"),\n    active_count = ("active", "sum"),  # True counts as 1\n).round(1)\n\n# pivot_table — GroupBy with tabular output:\npd.pivot_table(\n    df,\n    values="salary",\n    index="dept",\n    aggfunc=["mean","count"]\n)\n\n# Multi-level groupby:\ndf.groupby(["dept","active"])["salary"].mean()`} />
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM mistakes={[
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
            ]} />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.cyan} questions={[
              {
                question: "df.groupby('dept')['salary'].mean() returns what?",
                options: ["A DataFrame with dept as a column", "A Series with dept as the index", "A list of mean salaries", "A dict"],
                correct: 1,
                explanation: "groupby().mean() returns a Series where the group key (dept) is the index, not a column. Add .reset_index() to turn it into a DataFrame with dept as a regular column.",
              },
              {
                type: "bug",
                question: "What's wrong?",
                code: `df["dept_avg"] = df.groupby("dept")["salary"].agg("mean")`,
                options: ["agg should be transform", "mean is wrong function", "groupby needs reset_index", "Nothing is wrong"],
                correct: 0,
                explanation: ".agg('mean') reduces 10 rows to 3 (one per dept). You can't assign that back to a 10-row DataFrame — shapes don't match. Use .transform('mean') which returns 10 values, broadcasting each dept's mean to all its rows.",
              },
              {
                type: "output",
                question: "What does this produce?",
                code: `df.groupby("dept").agg(\n    n = ("id", "count"),\n    avg = ("salary", "mean")\n)`,
                options: ["A Series", "A DataFrame with dept as index, n and avg as columns", "A dict", "An error"],
                correct: 1,
                explanation: "Named aggregations with .agg() return a DataFrame. The group column (dept) becomes the index. n and avg become the column names. Add .reset_index() to get dept as a column.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
