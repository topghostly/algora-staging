"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Quiz, Course } from "../python-shared";

function ReadCsvOptionsVisual() {
  const OPTIONS = [
    { opt: "Basic read",       code: `df = pd.read_csv("employees.csv")\n# Assumes: comma delimiter, first row = header`,                                                                                                                                                              result: "All defaults. Works on clean CSVs." },
    { opt: "Parse dates",      code: `df = pd.read_csv("employees.csv",\n    parse_dates=["hired"]\n)\n# hired column → datetime64 automatically`,                                                                                                                                 result: "hired: datetime64 instead of object string" },
    { opt: "Custom delimiter", code: `# Semicolons instead of commas:\ndf = pd.read_csv("data.csv", sep=";")\n\n# Tab-separated:\ndf = pd.read_csv("data.tsv", sep="\\t")\n\n# Auto-detect:\ndf = pd.read_csv("data.csv", sep=None,\n                 engine="python")`,         result: "Handles non-comma delimiters" },
    { opt: "Handle nulls",     code: `df = pd.read_csv("data.csv",\n    na_values=["N/A","null","","none","#VALUE!"]\n)\n# These strings → NaN in the DataFrame`,                                                                                                                 result: "Custom null value recognition" },
    { opt: "Select columns",   code: `df = pd.read_csv("data.csv",\n    usecols=["id","name","salary","dept"]\n)\n# Only loads these 4 columns\n# Saves memory on large files`,                                                                                                   result: "Only 4 columns loaded — rest ignored" },
    { opt: "Chunk large files",code: `# Process 100k-row CSV without loading all:\nchunks = pd.read_csv("big_file.csv",\n                      chunksize=10000)\nresults = []\nfor chunk in chunks:\n    summary = chunk.groupby("dept")["salary"].sum()\n    results.append(summary)\n\nfinal = pd.concat(results).groupby(level=0).sum()`, result: "Process massive files without running out of memory" },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>pd.read_csv() has 50+ parameters. These 6 cover 90% of real-world use cases. Click each to see the option and when to use it.</Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {OPTIONS.map((o, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding: "5px 10px", borderRadius: 8, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`, background: sel === i ? "rgba(34,211,238,.12)" : "rgba(255,255,255,.02)", color: sel === i ? T.cyan : T.grey, fontWeight: sel === i ? 700 : 400 }}>{o.opt}</button>
        ))}
      </div>
      <PyBlock code={OPTIONS[sel].code} label="pandas — read_csv()" />
      <div style={{ background: `${T.cyan}09`, border: `1px solid ${T.cyan}25`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.greyLight }}>
        <strong style={{ color: T.cyan }}>Effect: </strong>{OPTIONS[sel].result}
      </div>
    </div>
  );
}

export default function Module16() {
  return (
    <Course
      intro={{
        explain: "pd.read_csv() is likely the most frequently called function in all of data analysis. But real files are messy — dates stored as plain text, custom null values like N/A or #VALUE!, semicolons instead of commas as delimiters, files too large to load into memory at once. Knowing the right parameters handles all of this at load time and saves you extra cleaning steps. Beyond CSV you will also encounter Excel, JSON, Parquet, and SQL databases in real projects.",
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
              <Note c={T.cyan}>CSV is the most common, but real pipelines use JSON, Excel, Parquet, and databases. Each has the right use case.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <PyBlock label="Reading" code={`# CSV:\ndf = pd.read_csv("data.csv")\n\n# Excel:\ndf = pd.read_excel("data.xlsx",\n    sheet_name="Sheet1")\n\n# JSON:\ndf = pd.read_json("data.json")\n# or load manually:\nimport json\nwith open("data.json") as f:\n    data = json.load(f)\ndf = pd.DataFrame(data)\n\n# Parquet (fast, compressed, typed):\ndf = pd.read_parquet("data.parquet")\n\n# SQL database:\nimport sqlite3\nwith sqlite3.connect("db.sqlite") as conn:\n    df = pd.read_sql("SELECT * FROM emp", conn)`} />
                <PyBlock label="Writing" code={`# CSV:\ndf.to_csv("output.csv", index=False)\n# index=False — don't write the row numbers\n\n# Excel:\ndf.to_excel("output.xlsx",\n    sheet_name="Employees", index=False)\n\n# Multiple sheets:\nwith pd.ExcelWriter("report.xlsx") as writer:\n    df.to_excel(writer, sheet_name="Data")\n    summary.to_excel(writer, sheet_name="Summary")\n\n# JSON:\ndf.to_json("output.json", orient="records")\n\n# Parquet — best for large datasets:\ndf.to_parquet("data.parquet", index=False)\n# Preserves dtypes, ~5x compression vs CSV`} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { fmt: "CSV",     when: "Sharing data, simple pipeline",  pro: "Universal, human-readable",     con: "No dtype info, large size" },
                  { fmt: "Excel",   when: "Business stakeholders",           pro: "Rich formatting, multiple sheets", con: "Slow, bad for large data" },
                  { fmt: "Parquet", when: "Production data pipelines",       pro: "Typed, compressed, columnar",   con: "Not human-readable" },
                ].map(f => (
                  <div key={f.fmt} style={{ border: `1px solid ${T.slate}`, borderRadius: 8, padding: "9px 12px", background: T.surface }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.cyan, marginBottom: 4 }}>.{f.fmt.toLowerCase()}</div>
                    <div style={{ fontSize: 9, color: T.grey, marginBottom: 3 }}>{f.when}</div>
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
            <Quiz c={T.cyan} questions={[
              {
                question: "pd.read_csv() with no arguments — what does it assume about the file?",
                options: ["Semicolons, no header", "Commas, first row = header, system encoding", "Tabs, second row = header", "Spaces, last row = header"],
                correct: 1,
                explanation: "read_csv() defaults: sep=',' (comma), header=0 (first row), encoding='utf-8'. These work for most clean CSVs. Override any default with explicit parameters when needed.",
              },
              {
                type: "bug",
                question: "A developer saves a DataFrame and then notices an extra column '0' in the file:",
                code: `df.to_csv("output.csv")`,
                options: ["Should use to_excel() instead", "Missing index=False — the index is being written as a column", "Should specify column names", "Missing encoding parameter"],
                correct: 1,
                explanation: "By default, to_csv() writes the DataFrame's index (0,1,2...) as the first column. Use index=False to exclude it. When re-reading the file, you'd get an unwanted 'Unnamed: 0' column.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
