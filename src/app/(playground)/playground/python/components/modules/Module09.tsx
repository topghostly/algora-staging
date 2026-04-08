"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Quiz, Course, SLabel as SL, Badge } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1,  name: "Amara Osei",      dept: "Engineering", salary: 85000, hired: "2021-03-15", active: true,  score: 88.5 },
  { id: 2,  name: "Bola Adeyemi",    dept: "Analytics",   salary: 72000, hired: "2020-07-22", active: true,  score: null },
  { id: 3,  name: "Chidi Nwosu",     dept: "Engineering", salary: 91000, hired: "2019-11-01", active: true,  score: 92.0 },
  { id: 4,  name: "Dami Okonkwo",    dept: "Product",     salary: 68000, hired: "2022-01-10", active: false, score: 74.0 },
  { id: 5,  name: "Emeka Eze",       dept: "Analytics",   salary: 77000, hired: "2020-04-05", active: true,  score: null },
  { id: 6,  name: "Funmi Alade",     dept: "Engineering", salary: 95000, hired: "2018-09-17", active: true,  score: 97.0 },
  { id: 7,  name: "Gbemi Coker",     dept: "Product",     salary: 71000, hired: "2021-11-30", active: true,  score: 81.0 },
  { id: 8,  name: "Hassan Musa",     dept: "Analytics",   salary: 69000, hired: "2023-02-14", active: false, score: 70.0 },
  { id: 9,  name: "Ifeoma Uche",     dept: "Engineering", salary: 83000, hired: "2022-06-20", active: true,  score: null },
  { id: 10, name: "Jide Fadahunsi",  dept: "Product",     salary: 78000, hired: "2019-08-11", active: true,  score: 85.0 },
];

function NullHeatmap() {
  const [showFix, setShowFix] = useState(false);
  const cols = ["id", "name", "dept", "salary", "hired", "active", "score"] as const;
  type Col = typeof cols[number];
  const nullMap = Object.fromEntries(cols.map(c => [c, DF_EMPLOYEES.map(r => r[c] === null)])) as Record<Col, boolean[]>;
  const nullCt = (c: Col) => nullMap[c].filter(Boolean).length;
  const totalNulls = cols.reduce((s, c) => s + nullCt(c), 0);
  const meanScore = DF_EMPLOYEES.filter(r => r.score !== null).reduce((s, r) => s + (r.score as number), 0) / DF_EMPLOYEES.filter(r => r.score !== null).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Red cells = NaN. See which columns have nulls. Click "Show fix" to see each null filled with the column mean.</Hint>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge c={totalNulls > 0 ? T.red : T.green}>{totalNulls} NaN values</Badge>
        <button onClick={() => setShowFix(!showFix)} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.green}44`, background: showFix ? `${T.green}14` : "transparent", color: T.green, fontWeight: 700 }}>
          {showFix ? "← Raw" : "Show fix →"}
        </button>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
              <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>#</th>
              {cols.map(c => (
                <th key={c} style={{ padding: "5px 8px", textAlign: "left" }}>
                  <div style={{ fontSize: 9, color: nullCt(c) > 0 ? T.red : T.greyDark }}>{c}</div>
                  {nullCt(c) > 0 && <div style={{ fontSize: 7, color: T.red }}>({nullCt(c)} NaN)</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DF_EMPLOYEES.map((row, ri) => (
              <tr key={row.id} style={{ borderBottom: ri < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}22` : "none" }}>
                <td style={{ padding: "3px 8px", fontSize: 9, color: T.greyDark }}>{ri}</td>
                {cols.map(c => {
                  const isNull = row[c] === null;
                  const fixedVal = showFix && isNull && c === "score" ? meanScore.toFixed(1) + " (mean)" : null;
                  return (
                    <td key={c} style={{ padding: "3px 8px", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", background: isNull && !showFix ? "rgba(248,113,113,.15)" : isNull && showFix ? "rgba(74,222,128,.1)" : "transparent", color: isNull && !showFix ? T.red : isNull && showFix ? T.green : T.greyLight, fontStyle: isNull && !showFix ? "italic" : "normal", transition: "all .3s" }}>
                      {isNull && !showFix ? "NaN" : isNull && showFix ? (fixedVal || "filled") : c === "salary" ? (row[c] as number).toLocaleString() : String(row[c])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFix && (
        <PyBlock label="pandas — handling NaN" code={`# Detect:\ndf.isnull().sum()        # count per column\ndf.isnull().sum() / len(df) * 100  # % missing\n\n# Fill strategies:\ndf["score"] = df["score"].fillna(df["score"].mean())   # mean\ndf["score"] = df["score"].fillna(df["score"].median()) # median (robust to outliers)\ndf["score"] = df["score"].fillna(method="ffill")       # forward fill (time series)\ndf["score"] = df["score"].fillna(0)                    # constant\n\n# Drop rows:\ndf.dropna()                          # any null in any column\ndf.dropna(subset=["score","salary"]) # only if these are null\ndf.dropna(thresh=5)                  # keep rows with >= 5 non-null values`} />
      )}
    </div>
  );
}

function DtypeFixerVisual() {
  const MESSY = [
    { id: 1, salary: "85,000",  hired: "March 15, 2021", active: "Yes",  score: "88.5" },
    { id: 2, salary: "72000",   hired: "2020-07-22",     active: "true", score: "72"   },
    { id: 3, salary: "$91,000", hired: "Nov 1st 2019",   active: "1",    score: "92.0" },
    { id: 4, salary: "68k",     hired: "01/10/2022",     active: "No",   score: "N/A"  },
  ];
  const [showFixed, setShowFixed] = useState(false);
  const FIXED = [
    { id: 1, salary: 85000, hired: "2021-03-15", active: true,  score: 88.5 },
    { id: 2, salary: 72000, hired: "2020-07-22", active: true,  score: 72.0 },
    { id: 3, salary: 91000, hired: "2019-11-01", active: true,  score: 92.0 },
    { id: 4, salary: 68000, hired: "2022-01-10", active: false, score: null },
  ];
  const DTYPE_FIXES = [
    { col: "salary", problem: "Commas, $, k suffix", fix: `df["salary"] = df["salary"].str.replace(r"[^0-9]","",regex=True).astype(int)` },
    { col: "hired",  problem: "Mixed date formats",  fix: `df["hired"] = pd.to_datetime(df["hired"])` },
    { col: "active", problem: "Yes/No/1/true strings", fix: `df["active"] = df["active"].map({"Yes":True,"No":False,"true":True,"1":True})` },
    { col: "score",  problem: "N/A string",          fix: `df["score"] = pd.to_numeric(df["score"], errors="coerce")` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>Toggle "Show cleaned" to see messy real-world data transformed into correct Python types. This is what data cleaning actually looks like.</Hint>
      <div style={{ display: "flex", gap: "4px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        <button onClick={() => setShowFixed(false)} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: !showFixed ? "rgba(248,113,113,.14)" : "transparent", color: !showFixed ? T.red : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: !showFixed ? 700 : 400 }}>😬 Raw (messy)</button>
        <button onClick={() => setShowFixed(true)} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: showFixed ? "rgba(74,222,128,.14)" : "transparent", color: showFixed ? T.green : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: showFixed ? 700 : 400 }}>✅ Cleaned</button>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${showFixed ? T.green : T.red}44`, transition: "border .3s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
              {Object.keys(MESSY[0]).map(c => (
                <th key={c} style={{ padding: "5px 10px", textAlign: "left" }}>
                  <div style={{ fontSize: 9, color: showFixed ? T.green : T.red }}>{c}</div>
                  <div style={{ fontSize: 7, color: showFixed ? T.green : T.greyDark }}>
                    {showFixed ? (c === "salary" ? "int64" : c === "active" ? "bool" : c === "score" ? "float64" : c === "id" ? "int64" : "datetime64") : "object (str)"}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(showFixed ? FIXED : MESSY).map((row, ri) => (
              <tr key={row.id} style={{ borderBottom: ri < 3 ? `1px solid ${T.slate}33` : "none", animation: "rowAppear .25s ease" }}>
                {Object.values(row).map((v, ci) => (
                  <td key={ci} style={{ padding: "5px 10px", fontSize: 10, color: v === null ? T.red : showFixed && ci > 0 ? T.green : ci > 0 ? T.orange : T.greyLight, fontWeight: showFixed && ci > 0 ? 700 : 400 }}>
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
            <div key={i} style={{ border: `1px solid ${T.slate}`, borderRadius: 8, padding: "8px 12px", background: "rgba(4,9,20,.7)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                <Badge c={T.green}>{fix.col}</Badge>
                <span style={{ fontSize: 9, color: T.grey }}>{fix.problem}</span>
              </div>
              <code style={{ fontSize: 9, color: T.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{fix.fix}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Module09() {
  return (
    <Course
      intro={{
        explain: "Data cleaning fixes problems in your data before you analyse it. Problems fall into four main categories: missing values (NaN — a cell has no value), wrong data types (a salary column stored as text instead of a number), duplicate rows (the same record appearing twice), and outliers (extreme values that distort statistics like the mean). Skipping cleaning means every analysis downstream is built on a broken foundation.",
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
              <Note c={T.yellow}>Outliers silently corrupt averages. Duplicates inflate counts. Both are invisible without explicit checks.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SL>OUTLIER DETECTION</SL>
                  <PyBlock code={`# Z-score method:\nfrom scipy import stats\nz = stats.zscore(df["salary"])\noutliers = df[abs(z) > 3]\n\n# IQR method (robust):\nQ1 = df["salary"].quantile(0.25)\nQ3 = df["salary"].quantile(0.75)\nIQR = Q3 - Q1\noutliers = df[\n    (df["salary"] < Q1 - 1.5*IQR) |\n    (df["salary"] > Q3 + 1.5*IQR)\n]\n\n# Cap outliers instead of dropping:\ndf["salary"] = df["salary"].clip(\n    lower=Q1 - 1.5*IQR,\n    upper=Q3 + 1.5*IQR\n)`} />
                </div>
                <div>
                  <SL>DUPLICATES</SL>
                  <PyBlock code={`# Check:\ndf.duplicated().sum()           # count\ndf[df.duplicated(keep=False)]   # show all copies\n\n# Drop — keep first occurrence:\ndf.drop_duplicates(inplace=True)\n\n# Drop on specific columns:\ndf.drop_duplicates(subset=["name","dept"])\n\n# Keep most recent (last):\ndf.sort_values("hired", ascending=False)\\\n  .drop_duplicates(subset=["name"], keep="first")\n\n# Full cleaning pipeline:\ndf = (\n    pd.read_csv("employees.csv")\n    .drop_duplicates(subset=["id"])\n    .dropna(subset=["salary"])\n    .reset_index(drop=True)\n)`} />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.yellow} questions={[
              {
                question: "pd.to_numeric(df['col'], errors='coerce') — what happens to 'N/A' values?",
                options: ["ValueError is raised", "'N/A' stays as a string", "'N/A' becomes NaN", "Row is dropped"],
                correct: 2,
                explanation: "errors='coerce' converts unparseable values to NaN instead of raising an error. This is the standard approach for messy numeric columns with text like 'N/A', 'unknown', or '#VALUE!'.",
              },
              {
                type: "bug",
                question: "What's wrong with this deduplication?",
                code: `df.drop_duplicates()`,
                options: ["Missing inplace=True or assignment", "This removes rows where ALL columns match — may not be what you want", "drop_duplicates doesn't exist", "Should use .unique() instead"],
                correct: 1,
                explanation: "Without subset=, drop_duplicates checks ALL columns. Two rows are only considered duplicates if every column matches. Usually you want to dedup on a key column: df.drop_duplicates(subset=['emp_id']).",
              },
              {
                question: "Why use .median() for filling nulls instead of .mean()?",
                options: ["Median is always more accurate", "Mean is affected by outliers; median is more robust to extreme values", "Median is faster to compute", "No difference"],
                correct: 1,
                explanation: "If a column has outliers (e.g., one salary of 5M among employees earning 70-90k), the mean is pulled high. The median (middle value) is unaffected by outliers — it's a better central tendency for skewed distributions.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
