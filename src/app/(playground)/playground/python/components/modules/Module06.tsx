"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Hint, Warn, CM, Quiz, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1, name: "Amara Osei",     dept: "Engineering", salary: 85000, hired: "2021-03-15", active: true,  score: 88.5 },
  { id: 2, name: "Bola Adeyemi",   dept: "Analytics",   salary: 72000, hired: "2020-07-01", active: true,  score: 91.2 },
  { id: 3, name: "Chidi Nwosu",    dept: "Engineering", salary: 91000, hired: "2019-11-20", active: true,  score: 79.0 },
  { id: 4, name: "Dami Okafor",    dept: "Product",     salary: 68000, hired: "2022-01-10", active: false, score: null },
  { id: 5, name: "Efe Obi",        dept: "Analytics",   salary: 77000, hired: "2021-09-05", active: true,  score: 84.3 },
  { id: 6, name: "Funke Adesanya", dept: "Engineering", salary: 94000, hired: "2018-06-30", active: true,  score: 92.1 },
  { id: 7, name: "Grace Mensah",   dept: "Product",     salary: 65000, hired: "2023-02-14", active: true,  score: 76.8 },
  { id: 8, name: "Henry Darko",    dept: "Analytics",   salary: 80000, hired: "2020-04-22", active: true,  score: 88.0 },
  { id: 9, name: "Ifeoma Eze",     dept: "Engineering", salary: 87000, hired: "2021-08-11", active: false, score: null },
  { id: 10, name: "Jide Bakare",   dept: "Product",     salary: 73000, hired: "2019-12-03", active: true,  score: 81.5 },
];

const dc = (dept: string) => ({
  Engineering: { text: T.blue },
  Analytics:   { text: T.cyan },
  Product:     { text: T.purple },
} as Record<string, { text: string }>)[dept] ?? { text: T.grey };

function FilterBuilder() {
  const [col, setCol] = useState("dept");
  const [op, setOp] = useState("==");
  const [val, setVal] = useState("Engineering");
  const [mode, setMode] = useState("boolean");
  const ops = ["==", "!=", ">", ">=", "<", "<="];

  const evalRow = (r: typeof DF_EMPLOYEES[0]) => {
    const v = (r as any)[col];
    if (v === null) return false;
    const n = isNaN(Number(val)) ? val : Number(val);
    switch (op) {
      case "==": return String(v) === String(n);
      case "!=": return String(v) !== String(n);
      case ">":  return Number(v) > Number(n);
      case ">=": return Number(v) >= Number(n);
      case "<":  return Number(v) < Number(n);
      case "<=": return Number(v) <= Number(n);
    }
    return false;
  };

  const passing = DF_EMPLOYEES.filter(evalRow);
  const codes: Record<string, string> = {
    boolean: `df[df["${col}"] ${op} "${isNaN(Number(val)) ? val : val}"]\n# ${passing.length} rows pass`,
    loc: `df.loc[\n    df["${col}"] ${op} "${isNaN(Number(val)) ? val : val}",\n    ["name","dept","salary"]\n]`,
    query: `df.query('${col} ${op} "${val}"')`,
    isin: `df[df["dept"].isin(["Engineering","Analytics"])]\n# Multiple values — cleaner than OR chains`,
    between: `df[df["salary"].between(70000, 85000)]\n# Both ends inclusive by default`,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Build a filter condition using the controls. Watch rows dim/glow as they evaluate to True or False. Switch filter styles to compare syntax.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        {Object.keys(codes).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: "4px 11px", borderRadius: 7, border: "none", background: mode === m ? "rgba(96,165,250,.14)" : "transparent", color: mode === m ? T.blue : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: mode === m ? 700 : 400 }}>{m}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.surface, padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.slate}`, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>df[ df["</span>
        <select value={col} onChange={e => setCol(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${T.slate}`, background: T.bg, color: T.blue, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }}>
          {["id","name","dept","salary","hired","active"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 11, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>"]</span>
        <select value={op} onChange={e => setOp(e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${T.slate}`, background: T.bg, color: T.cyan, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }}>
          {ops.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <input value={val} onChange={e => setVal(e.target.value)} style={{ padding: "4px 9px", borderRadius: 6, border: "1px solid rgba(96,165,250,.4)", background: T.bg, color: T.blue, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", width: 100, outline: "none" }} />
        <span style={{ fontSize: 11, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>]</span>
        <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ color: T.green }}>✓ {passing.length}</span> <span style={{ color: T.greyDark }}>✗ {DF_EMPLOYEES.length - passing.length}</span>
        </span>
      </div>
      <PyBlock code={codes[mode]} label="pandas" />
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
              {["name","dept","salary","verdict"].map(c => <th key={c} style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: c === "verdict" ? T.blue : T.greyDark }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {DF_EMPLOYEES.map((row, ri) => {
              const p = evalRow(row);
              return (
                <tr key={row.id} style={{ borderBottom: ri < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}22` : "none", background: p ? "rgba(74,222,128,.05)" : "transparent", opacity: p ? 1 : 0.2, transition: "all .25s" }}>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{row.name}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: dc(row.dept).text }}>{row.dept}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{row.salary.toLocaleString()}</td>
                  <td style={{ padding: "5px 10px", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: p ? T.green : T.greyDark }}>{p ? "True" : "False"}</td>
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
  const [cols, setCols] = useState(["name","salary","dept"]);
  const ALL = ["id","name","dept","salary","hired","active","score"];
  const tog = (c: string) => setCols(p => p.includes(c) ? (p.length > 1 ? p.filter(x => x !== c) : p) : [...p, c]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Toggle between .loc and .iloc. Drag row sliders to select a range. Toggle columns. Note the important difference between inclusive/exclusive ends.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        {["loc","iloc"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: mode === m ? "rgba(250,204,21,.14)" : "transparent", color: mode === m ? T.yellow : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: mode === m ? 700 : 400 }}>df.{m}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL>ROW RANGE</SL>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>start: {rowA}</div>
                <input type="range" min={0} max={8} value={rowA} onChange={e => setRowA(Math.min(Number(e.target.value), rowB))} style={{ width: "100%", accentColor: T.yellow }} />
              </div>
              <div>
                <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>end: {rowB}</div>
                <input type="range" min={1} max={9} value={rowB} onChange={e => setRowB(Math.max(Number(e.target.value), rowA))} style={{ width: "100%", accentColor: T.yellow }} />
              </div>
            </div>
          </div>
          <div>
            <SL>COLUMNS</SL>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {ALL.map(c => (
                <button key={c} onClick={() => tog(c)} style={{ padding: "3px 8px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${cols.includes(c) ? T.yellow : "rgba(255,255,255,.08)"}`, background: cols.includes(c) ? "rgba(250,204,21,.1)" : "transparent", color: cols.includes(c) ? T.yellow : T.grey }}>{c}</button>
              ))}
            </div>
          </div>
          <PyBlock label="pandas" code={mode === "loc" ? `# .loc — LABEL based, END INCLUSIVE:\ndf.loc[${rowA}:${rowB}, ${JSON.stringify(cols)}]\n# Rows with INDEX LABELS ${rowA} through ${rowB}\n# i.e. ${rowB - rowA + 1} rows` : `# .iloc — POSITION based, END EXCLUSIVE:\ndf.iloc[${rowA}:${rowB + 1}, [${cols.map(c => ALL.indexOf(c)).join(",")}]]\n# Rows at positions ${rowA} to ${rowB}\n# i.e. ${rowB - rowA + 1} rows (${rowB + 1} exclusive)`} />
          <div style={{ background: `${T.yellow}09`, border: `1px solid ${T.yellow}28`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10, color: T.greyLight }}>
              <div><strong style={{ color: T.yellow }}>.loc[a:b]</strong><br />→ includes BOTH a and b<br /><span style={{ color: T.greyDark }}>like SQL BETWEEN</span></div>
              <div><strong style={{ color: T.yellow }}>.iloc[a:b]</strong><br />→ excludes b (like Python slicing)<br /><span style={{ color: T.greyDark }}>like Python list[a:b]</span></div>
            </div>
          </div>
        </div>
        <div>
          <SL c={T.yellow}>SELECTED — {rowB - rowA + 1} rows × {cols.length} cols</SL>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                  <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>#</th>
                  {cols.map(c => <th key={c} style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.yellow }}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((row, ri) => {
                  const sel = ri >= rowA && ri <= rowB;
                  return (
                    <tr key={row.id} style={{ borderBottom: ri < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}22` : "none", background: sel ? "rgba(250,204,21,.06)" : "transparent", opacity: sel ? 1 : 0.15, transition: "all .25s" }}>
                      <td style={{ padding: "4px 8px", fontSize: 9, color: sel ? T.yellow : T.greyDark }}>{ri}</td>
                      {cols.map(c => <td key={c} style={{ padding: "4px 8px", fontSize: 10, color: T.greyLight }}>{(row as any)[c] === null ? "NaN" : String((row as any)[c])}</td>)}
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

export default function Module06() {
  return (
    <Course
      intro={{
        explain: "Filtering selects only the rows that satisfy a condition. In pandas you create a boolean mask — a Series of True/False values the same length as your DataFrame — and use it to index the DataFrame. Rows where the mask is True are kept, the rest are excluded. This is the pandas equivalent of SQL's WHERE clause and it is one of the most-used operations in all of data analysis.",
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
              <Warn>Use <code>&</code> (not <code>and</code>) and <code>|</code> (not <code>or</code>) in pandas. Always wrap each condition in parentheses.</Warn>
              <PyBlock label="pandas — combining conditions" code={`# AND — use & with parentheses:\nhigh_active = df[(df["salary"] > 75000) & (df["active"] == True)]\n\n# OR — use |:\ntech = df[(df["dept"] == "Engineering") | (df["dept"] == "Analytics")]\n\n# NOT — use ~:\nnot_active = df[~df["active"]]\n\n# isin() — cleaner than chained OR:\ndepts = ["Engineering", "Analytics"]\ntech2 = df[df["dept"].isin(depts)]\n\n# between() — inclusive by default:\nmid_salary = df[df["salary"].between(70000, 85000)]\n\n# .query() string — readable for complex filters:\nresult = df.query('salary > 75000 and dept == "Engineering"')\n\n# Combine isin + condition:\nresult = df[df["dept"].isin(depts) & (df["salary"] > 72000)]`} />
              <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
                <div style={{ padding: "5px 10px", background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}`, fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>
                  df[(df["salary"] &gt; 75000) &amp; (df["active"] == True)] — {DF_EMPLOYEES.filter(r => r.salary > 75000 && r.active).length} results
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
                  <thead><tr style={{ borderBottom: `1px solid ${T.slate}` }}>{["name","dept","salary","active"].map(c => <th key={c} style={{ padding: "5px 10px", textAlign: "left", fontSize: 9, color: T.greyDark }}>{c}</th>)}</tr></thead>
                  <tbody>
                    {DF_EMPLOYEES.filter(r => r.salary > 75000 && r.active).map((r, i, a) => (
                      <tr key={r.id} style={{ borderBottom: i < a.length - 1 ? `1px solid ${T.slate}33` : "none" }}>
                        <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.name}</td>
                        <td style={{ padding: "5px 10px", fontSize: 10, color: dc(r.dept).text }}>{r.dept}</td>
                        <td style={{ padding: "5px 10px", fontSize: 10, color: T.green, fontWeight: 700 }}>{r.salary.toLocaleString()}</td>
                        <td style={{ padding: "5px 10px", fontSize: 10, color: T.green }}>True</td>
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
            <CM mistakes={[
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
            ]} />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.blue} questions={[
              {
                type: "bug",
                question: "What's wrong?",
                code: `result = df[df["salary"] > 75000 and df["active"] == True]`,
                options: ["and is fine here", "Should use & with parentheses around each condition", "Should use df.query()", "active needs to be quoted"],
                correct: 1,
                explanation: "Python's 'and' can't work element-wise on Series — it raises ValueError. Use & for AND and | for OR. Always wrap each condition in parentheses: df[(df['salary'] > 75000) & (df['active'] == True)].",
              },
              {
                question: "What does .loc[1:3] return vs .iloc[1:3]?",
                options: ["Same thing", "loc[1:3] includes rows with labels 1,2,3 (inclusive). iloc[1:3] includes positions 1,2 only (exclusive end)", "loc is always faster", "iloc only works with integer indexes"],
                correct: 1,
                explanation: ".loc end is INCLUSIVE: loc[1:3] returns labels 1,2,3. .iloc end is EXCLUSIVE like Python slicing: iloc[1:3] returns positions 1,2. This matters when the index isn't the default RangeIndex.",
              },
              {
                question: "Which is cleaner for 'dept is either Engineering or Analytics'?",
                options: ["df[(df['dept']=='Engineering')|(df['dept']=='Analytics')]", "df[df['dept'].isin(['Engineering','Analytics'])]", "df.query(\"dept == 'Engineering' or dept == 'Analytics'\")", "All are equivalent — pick any"],
                correct: 1,
                explanation: "All three work, but .isin() is cleanest for multi-value OR conditions. It scales well — just add more values to the list. The chained | approach gets unwieldy with 5+ values.",
              },
              {
                type: "output",
                question: "How many rows does this return?",
                code: `df[df["salary"].between(70000, 85000)]`,
                options: ["Rows where 70000 < salary < 85000 (exclusive)", "Rows where 70000 <= salary <= 85000 (inclusive)", "Rows where salary == 70000 or salary == 85000", "Depends on the data"],
                correct: 1,
                explanation: ".between() is INCLUSIVE on both ends by default. .between(a, b) is equivalent to (df['col'] >= a) & (df['col'] <= b). Use inclusive='left' or 'right' to change this.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
