"use client";
import React, { useState, useRef } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Warn, Quiz, Course, SLabel as SL, Badge } from "../python-shared";

function MergeAnimator() {
  const [how, setHow] = useState<"inner" | "left" | "right" | "outer">("inner");
  const [phase, setPhase] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

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
    inner: { c: T.blue,   desc: "Only rows with dept_id in BOTH tables" },
    left:  { c: T.green,  desc: "ALL left rows + matching right (NaN if no right match)" },
    right: { c: T.orange, desc: "ALL right rows + matching left (NaN if no left match)" },
    outer: { c: T.purple, desc: "ALL rows from both tables — NaN where no match" },
  };
  const h = HOW[how];

  const getResult = () => {
    if (how === "inner")
      return LEFT.filter(l => RIGHT.some(r => r.dept_id === l.dept_id)).map(l => {
        const r = RIGHT.find(r => r.dept_id === l.dept_id)!;
        return { emp_id: l.emp_id, name: l.name, dept_id: l.dept_id, dept_name: r.dept_name, budget: r.budget };
      });
    if (how === "left")
      return LEFT.map(l => {
        const r = RIGHT.find(r => r.dept_id === l.dept_id);
        return { emp_id: l.emp_id, name: l.name, dept_id: l.dept_id, dept_name: r?.dept_name ?? null, budget: r?.budget ?? null };
      });
    if (how === "right") {
      const matched = RIGHT.flatMap(r => {
        const ls = LEFT.filter(l => l.dept_id === r.dept_id);
        return ls.length ? ls.map(l => ({ emp_id: l.emp_id, name: l.name, dept_id: r.dept_id, dept_name: r.dept_name, budget: r.budget })) : [];
      });
      const unmatched = RIGHT.filter(r => !LEFT.some(l => l.dept_id === r.dept_id)).map(r => ({ emp_id: null, name: null, dept_id: r.dept_id, dept_name: r.dept_name, budget: r.budget }));
      return [...matched, ...unmatched];
    }
    if (how === "outer") {
      const l_res = LEFT.map(l => {
        const r = RIGHT.find(r => r.dept_id === l.dept_id);
        return { emp_id: l.emp_id, name: l.name, dept_id: l.dept_id, dept_name: r?.dept_name ?? null, budget: r?.budget ?? null };
      });
      const r_only = RIGHT.filter(r => !LEFT.some(l => l.dept_id === r.dept_id)).map(r => ({ emp_id: null, name: null, dept_id: r.dept_id, dept_name: r.dept_name, budget: r.budget }));
      return [...l_res, ...r_only];
    }
    return [] as { emp_id: number | null; name: string | null; dept_id: number; dept_name: string | null; budget: number | null }[];
  };

  const result = getResult();

  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setPhase(0);
    let p = 0;
    timer.current = setInterval(() => {
      p++;
      setPhase(p);
      if (p >= 2) clearInterval(timer.current!);
    }, 700);
  };

  const lSurvives = (l: typeof LEFT[0]) => how === "right" ? RIGHT.some(r => r.dept_id === l.dept_id) : true;
  const rSurvives = (r: typeof RIGHT[0]) => how === "left" ? LEFT.some(l => l.dept_id === r.dept_id) : how === "inner" ? LEFT.some(l => l.dept_id === r.dept_id) : true;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">Select a merge type, then click Animate. Rows that don't find a match dim out — the result shows what survives.</Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {(Object.entries(HOW) as [string, { c: string; desc: string }][]).map(([k, v]) => (
          <button key={k} onClick={() => { setHow(k as typeof how); setPhase(0); if (timer.current) clearInterval(timer.current); }} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${how === k ? v.c : "rgba(255,255,255,.07)"}`, background: how === k ? `${v.c}12` : "rgba(255,255,255,.02)", color: how === k ? v.c : T.grey, transition: "all .2s" }}>
            how=&quot;{k}&quot;
          </button>
        ))}
      </div>
      <div style={{ background: `${h.c}09`, border: `1px solid ${h.c}25`, borderRadius: 8, padding: "7px 12px", fontSize: 11, color: T.greyLight }}>
        <strong style={{ color: h.c }}>&quot;{how}&quot; merge:</strong> {h.desc}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "flex-start" }}>
        <div>
          <SL c={T.blue}>LEFT: employees</SL>
          <div style={{ background: "rgba(4,9,20,.85)", borderRadius: 8, border: "1px solid rgba(96,165,250,.2)", overflow: "hidden" }}>
            {LEFT.map((r, i) => {
              const s = lSurvives(r);
              return (
                <div key={i} style={{ padding: "7px 10px", borderBottom: i < LEFT.length - 1 ? `1px solid ${T.slate}33` : "none", display: "flex", gap: 8, background: phase > 0 && s ? "rgba(96,165,250,.08)" : "transparent", opacity: phase > 0 ? (s ? 1 : 0.2) : 1, transition: "all .4s", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>#{r.emp_id}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.blue, flex: 1 }}>{r.name}</span>
                  <Badge c={s ? T.cyan : T.greyDark}>dept:{r.dept_id}</Badge>
                  {phase > 0 && <span style={{ fontSize: 8, color: s ? T.green : T.greyDark }}>{s ? "✓" : "✗"}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ paddingTop: 22, textAlign: "center", fontSize: 14, color: h.c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
          pd.merge
          <div style={{ fontSize: 7, color: T.greyDark, marginTop: 2 }}>on="dept_id"</div>
        </div>
        <div>
          <SL c={T.green}>RIGHT: departments</SL>
          <div style={{ background: "rgba(4,9,20,.85)", borderRadius: 8, border: "1px solid rgba(74,222,128,.2)", overflow: "hidden" }}>
            {RIGHT.map((r, i) => {
              const s = rSurvives(r);
              return (
                <div key={i} style={{ padding: "7px 10px", borderBottom: i < RIGHT.length - 1 ? `1px solid ${T.slate}33` : "none", display: "flex", gap: 8, background: phase > 1 && s ? "rgba(74,222,128,.07)" : "transparent", opacity: phase > 1 ? (s ? 1 : 0.2) : 1, transition: "all .4s", alignItems: "center" }}>
                  <Badge c={s ? T.cyan : T.greyDark}>id:{r.dept_id}</Badge>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.green, flex: 1 }}>{r.dept_name}</span>
                  {phase > 1 && <span style={{ fontSize: 8, color: s ? T.green : T.greyDark }}>{s ? "✓" : "✗"}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={play} style={{ padding: "6px 16px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${h.c}55`, background: `${h.c}12`, color: h.c }}>▶ Animate</button>
        <button onClick={() => { if (timer.current) clearInterval(timer.current); setPhase(0); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: T.grey }}>Reset</button>
      </div>
      {phase >= 1 && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          <SL c={h.c}>RESULT — {result.length} rows</SL>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                  {Object.keys(result[0] || {}).map(c => (
                    <th key={c} style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: ri < result.length - 1 ? `1px solid ${T.slate}33` : "none", animation: `rowAppear .3s ease ${ri * 50}ms both` }}>
                    {Object.values(row).map((v, ci) => (
                      <td key={ci} style={{ padding: "5px 8px", fontSize: 10, color: v === null ? T.red : T.greyLight, fontStyle: v === null ? "italic" : "normal" }}>
                        {v === null ? "NaN" : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PyBlock code={`employees.merge(departments, on="dept_id", how="${how}")\n# ${result.length} rows returned`} label="pandas" />
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
      <Hint>Switch between axis=0 (stack rows) and axis=1 (add columns). These are fundamentally different operations.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        {[0, 1].map(a => (
          <button key={a} onClick={() => setAxis(a)} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: axis === a ? "rgba(34,211,238,.14)" : "transparent", color: axis === a ? T.cyan : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: axis === a ? 700 : 400 }}>
            axis={a} ({a === 0 ? "rows" : "columns"})
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
        <div>
          <SL c={axis === 0 ? T.cyan : T.blue}>{axis === 1 ? "df1 + scores" : "df1"}</SL>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 8, overflow: "hidden" }}>
            {DF1.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 6, padding: "5px 10px", borderBottom: i < DF1.length - 1 ? `1px solid ${T.slate}33` : "none", background: "rgba(96,165,250,.05)" }}>
                {Object.entries(axis === 0 ? r : r).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.blue, flex: 1 }}>{k}:{String(v)}</span>
                ))}
              </div>
            ))}
          </div>
          {axis === 1 && (
            <div style={{ marginTop: 6 }}>
              <SL c={T.green}>+ scores</SL>
              <div style={{ border: `1px solid ${T.slate}`, borderRadius: 8, overflow: "hidden" }}>
                {SCORES.map((r, i) => (
                  <div key={i} style={{ padding: "5px 10px", borderBottom: i < 1 ? `1px solid ${T.slate}33` : "none", background: "rgba(74,222,128,.04)" }}>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.green }}>score:{r.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {axis === 0 && (
            <div style={{ marginTop: 6 }}>
              <SL c={T.green}>df2</SL>
              <div style={{ border: `1px solid ${T.slate}`, borderRadius: 8, overflow: "hidden" }}>
                {DF2.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, padding: "5px 10px", borderBottom: i < DF2.length - 1 ? `1px solid ${T.slate}33` : "none", background: "rgba(74,222,128,.04)" }}>
                    {Object.entries(r).map(([k, v]) => (
                      <span key={k} style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.green, flex: 1 }}>{k}:{String(v)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", fontSize: 16, color: T.cyan }}>
          →<div style={{ fontSize: 7, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>concat</div>
        </div>
        <div>
          <SL c={T.cyan}>RESULT</SL>
          <div style={{ border: `1px solid ${T.cyan}44`, borderRadius: 8, overflow: "hidden", background: "rgba(34,211,238,.04)" }}>
            {(axis === 0 ? resultAxis0 : resultAxis1).map((r, i, a) => (
              <div key={i} style={{ display: "flex", gap: 6, padding: "5px 10px", borderBottom: i < a.length - 1 ? `1px solid ${T.slate}33` : "none", animation: `rowAppear .3s ease ${i * 60}ms both` }}>
                {Object.entries(r).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.cyan, flex: 1 }}>{k}:{String(v)}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <PyBlock code={axis === 0 ? `# axis=0 — stack rows (same columns):\nresult = pd.concat([df1, df2], ignore_index=True)\n# ignore_index=True resets the index: 0,1,2,3...\n\n# Without ignore_index:\nresult = pd.concat([df1, df2])\n# Index may have duplicates from original dfs` : `# axis=1 — add columns (same rows):\nresult = pd.concat([df1, scores], axis=1)\n# df1 and scores must have same number of rows\n# or matching index values`} label="pandas — pd.concat" />
    </div>
  );
}

export default function Module08() {
  return (
    <Course
      intro={{
        explain: "Merging (joining) combines two DataFrames by matching rows on shared key column values — exactly like SQL JOINs. The join type controls which rows survive. An inner join keeps only rows that exist in both tables. A left join keeps every row from the left table and fills NaN for any columns from the right table where no match was found. Getting the join type wrong is a silent bug — no error, just wrong counts or missing data.",
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
              <Note c={T.green}>Real merges often involve different column names, multiple keys, or needing to detect mismatches.</Note>
              <PyBlock label="pandas — merge patterns" code={`# Different column names:\nemployees.merge(departments,\n    left_on="dept_id",\n    right_on="department_id"\n)\n\n# Multiple keys:\ndf.merge(other, on=["year","month","dept"])\n\n# Detect merge mismatches (validate):\ndf.merge(lookup, on="id", validate="many_to_one")\n# Raises if any id in df maps to multiple rows in lookup\n# Options: "one_to_one","one_to_many","many_to_one","many_to_many"\n\n# Suffixes for overlapping column names:\ndf.merge(other, on="id",\n    suffixes=("_emp","_dept")\n)\n# salary_emp, salary_dept instead of salary_x, salary_y\n\n# Merge on index:\ndf.merge(other, left_index=True, right_index=True)`} />
              <Warn>Many-to-many merges create explosive row counts. Always check <code>result.shape</code> after a merge to catch unexpected row multiplication.</Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.green} questions={[
              {
                question: "how='left' — what happens to left rows with no match?",
                options: ["They are dropped", "They appear with NaN in right columns", "MergeError is raised", "They get duplicated"],
                correct: 1,
                explanation: "With how='left', ALL rows from the left DataFrame are kept. For rows with no match in the right DataFrame, the columns that came from the right are filled with NaN.",
              },
              {
                type: "bug",
                question: "A developer wants to stack two DataFrames. What's wrong?",
                code: `combined = df_2023.merge(df_2024)`,
                options: ["merge needs on= parameter", "pd.concat should be used to stack rows", "Should use df.join()", "axis=0 is missing"],
                correct: 1,
                explanation: "merge() joins on shared key columns — it's for widening a table. To stack DataFrames with the same columns (add rows), use pd.concat([df1, df2], ignore_index=True).",
              },
              {
                type: "output",
                question: "left has 5 rows, right has 3 rows. how='inner'. Max possible output rows?",
                options: ["5", "3", "15", "8"],
                correct: 1,
                explanation: "An inner merge only keeps matching rows. The maximum is limited by the smaller side (3). But if there are multiple matches (many-to-many), you could get more rows than either side.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
