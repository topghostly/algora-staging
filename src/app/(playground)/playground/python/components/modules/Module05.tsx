"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, OutBlock, Note, Hint, Tip, Warn, CM, Quiz, Course, SLabel as SL, Badge } from "../python-shared";

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
  Engineering: { text: T.blue,   bg: "rgba(96,165,250,.1)"  },
  Analytics:   { text: T.cyan,   bg: "rgba(34,211,238,.1)"  },
  Product:     { text: T.purple, bg: "rgba(192,132,252,.1)" },
} as Record<string, { text: string; bg: string }>)[dept] ?? { text: T.grey, bg: "transparent" };

function DataFrameExplorer() {
  const [view, setView] = useState("table");
  const cols = ["id", "name", "dept", "salary", "hired", "active", "score"] as const;
  const nullCt = (c: string) => DF_EMPLOYEES.filter(r => (r as any)[c] === null).length;
  const dtypes: Record<string, string> = { id: "int64", name: "object", dept: "object", salary: "int64", hired: "object", active: "bool", score: "float64" };
  const dtC: Record<string, string> = { int64: T.blue, float64: T.cyan, object: T.green, bool: T.yellow };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Click TABLE, .info(), and .describe() to see three different views of the same DataFrame — exactly as you'd explore in Jupyter.</Hint>
      <div style={{ display: "flex", gap: "3px", background: T.surface, padding: 3, borderRadius: 10, border: `1px solid ${T.slate}`, alignSelf: "flex-start" }}>
        {["table", ".info()", ".describe()"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: view === v ? "rgba(34,211,238,.14)" : "transparent", color: view === v ? T.cyan : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: view === v ? 700 : 400, transition: "all .15s" }}>{v}</button>
        ))}
      </div>

      {view === "table" && (
        <div style={{ animation: "fadeUp .25s ease" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            <Badge c={T.cyan}>{DF_EMPLOYEES.length} rows × {cols.length} cols</Badge>
            <Badge c={T.green}>pd.DataFrame</Badge>
            {cols.filter(c => nullCt(c) > 0).map(c => <Badge key={c} c={T.red}>{c}: {nullCt(c)} NaN</Badge>)}
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                  <th style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>#</th>
                  {cols.map(c => (
                    <th key={c} style={{ padding: "5px 8px", textAlign: "left" }}>
                      <div style={{ fontSize: 9, color: T.cyan }}>{c}</div>
                      <div style={{ fontSize: 7, color: dtC[dtypes[c]] || T.greyDark }}>{dtypes[c]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DF_EMPLOYEES.map((row, ri) => (
                  <tr key={row.id} style={{ borderBottom: ri < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}22` : "none", background: ri % 2 === 0 ? "rgba(255,255,255,.01)" : "transparent" }}>
                    <td style={{ padding: "4px 8px", fontSize: 9, color: T.greyDark }}>{ri}</td>
                    {cols.map(c => (
                      <td key={c} style={{ padding: "4px 8px", fontSize: 10, color: (row as any)[c] === null ? T.greyDark : c === "dept" ? dc((row as any)[c]).text : T.greyLight, fontStyle: (row as any)[c] === null ? "italic" : "normal" }}>
                        {(row as any)[c] === null ? "NaN" : c === "salary" ? (row as any)[c].toLocaleString() : String((row as any)[c])}
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
        <div style={{ animation: "fadeUp .25s ease", display: "flex", flexDirection: "column", gap: 8 }}>
          <OutBlock label="df.info()">{`<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 10 entries, 0 to 9\nData columns (total 7 columns):\n #   Column   Non-Null Count  Dtype  \n---  ------   --------------  -----  \n 0   id       10 non-null     int64  \n 1   name     10 non-null     object \n 2   dept     10 non-null     object \n 3   salary   10 non-null     int64  \n 4   hired    10 non-null     object \n 5   active   10 non-null     bool   \n 6   score     7 non-null     float64\ndtypes: bool(1), float64(1), int64(2), object(3)\nmemory usage: 688+ bytes`}</OutBlock>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Tip icon="🔍" title="WHAT TO LOOK FOR IN .info()" c={T.cyan}>Non-null counts reveal missing data. Column dtypes matter — object columns can't be averaged. Unexpected 'object' type on a numeric column means there's dirty data.</Tip>
            <div>
              <SL c={T.red}>⚠️ COLUMNS WITH NULLS</SL>
              {cols.filter(c => nullCt(c) > 0).map(c => (
                <div key={c} style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.2)", marginBottom: 4, fontSize: 10, color: T.greyLight, fontFamily: "'JetBrains Mono',monospace" }}>
                  <span style={{ color: T.red, fontWeight: 700 }}>{c}</span> — {nullCt(c)}/10 missing ({Math.round((nullCt(c) / 10) * 100)}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === ".describe()" && (
        <div style={{ animation: "fadeUp .25s ease" }}>
          <SL c={T.cyan}>df.describe() — numeric columns only</SL>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.greyDark }}>stat</th>
                  <th style={{ padding: "6px 10px", textAlign: "right", fontSize: 9, color: T.blue }}>salary</th>
                  <th style={{ padding: "6px 10px", textAlign: "right", fontSize: 9, color: T.cyan }}>score</th>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.grey, maxWidth: 180 }}>what it means</th>
                </tr>
              </thead>
              <tbody>
                {[["count","10","7","non-null row count"],["mean","79,700","87.6","arithmetic average"],["std","9,873","7.8","spread of values"],["min","65,000","77.0","smallest value"],["25%","70,750","79.5","1st quartile"],["50%","78,500","88.5","median"],["75%","89,000","93.5","3rd quartile"],["max","93,000","98.5","largest value"]].map(([s, sal, sc, m], i) => (
                  <tr key={s} style={{ borderBottom: i < 7 ? `1px solid ${T.slate}33` : "none", background: ["min","max"].includes(s) ? `${T.blue}05` : "transparent" }}>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{s}</td>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.blue, textAlign: "right" }}>{sal}</td>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.cyan, textAlign: "right" }}>{sc}</td>
                    <td style={{ padding: "5px 10px", fontSize: 9, color: T.greyDark }}>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note c={T.cyan} style={{ marginTop: 8 }}>score has <strong>count=7 not 10</strong> — .describe() excludes NaN. The 3 missing score values don't affect count here.</Note>
        </div>
      )}
    </div>
  );
}

export default function Module05() {
  return (
    <Course
      intro={{
        explain: "A DataFrame is the central data structure in pandas — a two-dimensional table with labelled rows and columns, similar to a spreadsheet or a database table. Each column is a Series: a one-dimensional labelled array. DataFrames are the starting point for every data analysis in Python: you load your raw data into one, then clean, filter, transform, aggregate, and visualise it from there. Almost everything else in this course operates on DataFrames.",
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
              <Note c={T.cyan}>A DataFrame is a 2D table with labelled axes. Every column is a Series. Every row has an integer index by default.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SL>3 WAYS TO CREATE</SL>
                  <PyBlock code={`import pandas as pd\n\n# 1. From list of dicts (most common):\ndata = [\n    {"name": "Amara", "salary": 85000},\n    {"name": "Bola",  "salary": 72000},\n]\ndf = pd.DataFrame(data)\n\n# 2. From CSV (real world):\ndf = pd.read_csv("employees.csv")\ndf = pd.read_csv("data.csv",\n    parse_dates=["hired"],\n    dtype={"id": int},\n    na_values=["N/A", "null", ""],\n)\n\n# 3. From dict of lists:\ndf = pd.DataFrame({\n    "name":   ["Amara", "Bola"],\n    "salary": [85000, 72000]\n})`} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <SL>KEY ATTRIBUTES</SL>
                  <PyBlock code={`df.shape      # (10, 7) — rows, cols\ndf.columns    # Index(['id','name',...])\ndf.dtypes     # id: int64, name: object...\ndf.index      # RangeIndex(start=0, stop=10)\ndf.values     # numpy array of all values\n\n# Head and tail:\ndf.head()     # first 5 rows\ndf.head(3)    # first 3 rows\ndf.tail(2)    # last 2 rows\n\n# Random sample:\ndf.sample(3)  # 3 random rows\ndf.sample(frac=0.2)  # 20% of rows`} />
                  <Tip icon="🧠" title="SERIES vs DATAFRAME" c={T.cyan}>
                    <code>df["salary"]</code> → <strong>Series</strong> (1D)<br />
                    <code>df[["salary"]]</code> → <strong>DataFrame</strong> (2D, 1 col)<br />
                    Double brackets force a DataFrame — critical for many operations.
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
              <Note c={T.cyan}>The index is a powerful feature — pandas aligns operations on index, not position. Misaligned indexes cause silent NaN bugs.</Note>
              <PyBlock label="Index operations" code={`# Default integer index:\ndf.index  # RangeIndex(start=0, stop=10, step=1)\n\n# Set a column as index:\ndf = df.set_index("id")\ndf.index  # Int64Index([1,2,3,...,10])\n\n# Access by index label:\ndf.loc[1]   # employee with id=1\n\n# Reset to default integer index:\ndf = df.reset_index()\n\n# Index alignment (automatic):\ns1 = pd.Series([10, 20, 30], index=["a","b","c"])\ns2 = pd.Series([1, 2, 3], index=["b","c","d"])\ns1 + s2\n# a    NaN  (a not in s2)\n# b    22   (20 + 2)\n# c    33   (30 + 3)\n# d    NaN  (d not in s1)`} />
              <Warn>After merges or groupby().reset_index(), your index may contain unexpected values. Always check df.index after complex operations.</Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.cyan} questions={[
              {
                question: "What does df.shape return?",
                options: ["A list of column names", "A tuple (rows, columns)", "The number of cells", "A dict of dtypes"],
                correct: 1,
                explanation: "df.shape returns a tuple like (10, 7). df.shape[0] is row count, df.shape[1] is column count. len(df) also returns row count.",
              },
              {
                type: "bug",
                question: "A developer wants a DataFrame not a Series:",
                code: `col = df["salary"]  # got a Series, wanted DataFrame`,
                options: ["Use df.salary", "Use df[['salary']] (double brackets)", "Use df.to_frame('salary')", "Use df.loc[:,'salary']"],
                correct: 1,
                explanation: "df['salary'] returns a Series. df[['salary']] (list with one element) returns a single-column DataFrame. The outer brackets select columns, the inner list specifies which ones.",
              },
              {
                type: "output",
                question: "df.describe() on score (7 non-null out of 10). What is 'count'?",
                options: ["10", "7", "8.5", "NaN"],
                correct: 1,
                explanation: ".describe() operates on non-null values only. If 3 values are NaN, count=7. The NaN rows are excluded from all statistics. This is why nulls must be handled before analysis.",
              },
              {
                question: "What's the difference between df.head() and df.sample()?",
                options: ["No difference", "head() returns first N rows, sample() returns random N rows", "head() is faster", "sample() sorts the data first"],
                correct: 1,
                explanation: "df.head(n) always returns the first n rows (default 5). df.sample(n) returns n random rows. Use sample() for quick exploratory checks on large datasets to avoid always seeing only the first rows.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
