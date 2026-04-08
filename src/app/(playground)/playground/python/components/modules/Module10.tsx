"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Quiz, Hint, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1,  name: "Amara Osei",      dept: "Engineering", salary: 85000 },
  { id: 2,  name: "Bola Adeyemi",    dept: "Analytics",   salary: 72000 },
  { id: 3,  name: "Chidi Nwosu",     dept: "Engineering", salary: 91000 },
  { id: 4,  name: "Dami Okonkwo",    dept: "Product",     salary: 68000 },
  { id: 5,  name: "Emeka Eze",       dept: "Analytics",   salary: 77000 },
];

function StrAccessorVisual() {
  const [input, setInput] = useState("  Amara Osei - Engineering  ");
  const OPS = [
    { fn: ".strip()",       fn2: (s: string) => s.trim(),                                                              c: T.cyan,   desc: "Remove whitespace from both ends" },
    { fn: ".upper()",       fn2: (s: string) => s.toUpperCase(),                                                       c: T.blue,   desc: "All uppercase" },
    { fn: ".lower()",       fn2: (s: string) => s.toLowerCase(),                                                       c: T.green,  desc: "All lowercase" },
    { fn: ".title()",       fn2: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()), c: T.yellow, desc: "Capitalise each word" },
    { fn: ".split('-')",    fn2: (s: string) => JSON.stringify(s.split("-").map(x => x.trim())),                       c: T.purple, desc: "Split on delimiter" },
    { fn: ".replace('-',' ')", fn2: (s: string) => s.replace(/-/g, " "),                                              c: T.orange, desc: "Replace substring" },
    { fn: "len()",          fn2: (s: string) => s.length,                                                              c: T.red,    desc: "Character count" },
    { fn: ".strip().split()", fn2: (s: string) => JSON.stringify(s.trim().split(/\s+/)),                               c: T.pink,   desc: "Strip then split on whitespace" },
  ];
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Type any text in the input. Hover each .str method card to see it applied to your text instantly.</Hint>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.green, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>s =</span>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(74,222,128,.35)", background: T.bg, color: T.green, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {OPS.map(op => {
          let res: string | number;
          try { res = op.fn2(input); } catch { res = "error"; }
          return (
            <div key={op.fn} onMouseEnter={() => setHover(op.fn)} onMouseLeave={() => setHover(null)} style={{ border: `1px solid ${hover === op.fn ? op.c : T.slate}`, borderRadius: 9, padding: "10px 12px", cursor: "default", background: hover === op.fn ? `${op.c}0d` : "rgba(255,255,255,.02)", transition: "all .2s" }}>
              <code style={{ fontSize: 11, color: op.c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, display: "block", marginBottom: 3 }}>str{op.fn}</code>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.white, fontFamily: "'JetBrains Mono',monospace", marginBottom: 3, wordBreak: "break-all", lineHeight: 1.3 }}>{String(res)}</div>
              <div style={{ fontSize: 9, color: T.greyDark }}>{op.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Module10() {
  return (
    <Course
      intro={{
        explain: "String operations let you clean, extract, and transform text columns. In pandas, every string method on a column goes through the .str accessor — it applies the method to every cell in the column at once, with no loop. This covers basic cleaning like removing whitespace and changing case, splitting composite fields like full name into first and last name, extracting data from messy strings, and filtering rows based on text patterns.",
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
              <Note c={T.green}>Pandas exposes string methods through <code style={{ color: T.green }}>Series.str</code> — applies to the entire column at once. No loops needed.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <PyBlock label="Common .str operations" code={`df["name"].str.upper()\ndf["name"].str.len()\ndf["name"].str.split()\ndf["name"].str[0]          # first char\ndf["name"].str.strip()\ndf["name"].str.startswith("A")\ndf["dept"].str.contains("Eng")\ndf["name"].str.replace("Nwosu","N.")\n\n# Split and access parts:\ndf["first"] = df["name"].str.split().str[0]\ndf["last"]  = df["name"].str.split().str[-1]\n\n# Regex extract:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")`} />
                <div>
                  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
                    <div style={{ padding: "5px 10px", background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}`, fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>
                      df["name"].str.split().str[0] → first_name
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                          {["name", "first", "last"].map(c => (
                            <th key={c} style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, color: T.greyDark }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DF_EMPLOYEES.map((r, i) => (
                          <tr key={r.id} style={{ borderBottom: i < 4 ? `1px solid ${T.slate}33` : "none" }}>
                            <td style={{ padding: "4px 8px", fontSize: 10, color: T.greyLight }}>{r.name}</td>
                            <td style={{ padding: "4px 8px", fontSize: 10, color: T.green, fontWeight: 700 }}>{r.name.split(" ")[0]}</td>
                            <td style={{ padding: "4px 8px", fontSize: 10, color: T.green }}>{r.name.split(" ").slice(-1)[0]}</td>
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
              <Note c={T.teal}>Regular expressions let you match patterns in text — essential for cleaning messy data. The .str accessor supports regex natively.</Note>
              <PyBlock label="pandas regex patterns" code={`# contains() — filter rows by pattern:\ndf[df["name"].str.contains(r"Nwosu|Osei")]  # OR\ndf[df["email"].str.contains(r"@company\\.com")]\n\n# extract() — pull matching groups:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")\ndf["first_name"] = df["name"].str.extract(r"^(\\w+)")\n\n# replace() with regex:\ndf["salary_clean"] = df["salary_raw"].str.replace(\n    r"[^0-9]", "", regex=True\n).astype(int)\n\n# extractall() — multiple matches per row:\ndf["phone"].str.extractall(r"(\\d{3}-\\d{4})")\n\n# Useful patterns:\n# r"\\d+"     — one or more digits\n# r"\\w+"     — one or more word chars\n# r"^\\s+"    — leading whitespace\n# r"\\s+$"    — trailing whitespace\n# r"[A-Z]+"  — uppercase letters only`} />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.green} questions={[
              {
                question: "How do you check if each name in df['name'] contains 'Nwosu'?",
                options: ["'Nwosu' in df['name']", "df['name'] == 'Nwosu'", "df['name'].str.contains('Nwosu')", "df['name'].contains('Nwosu')"],
                correct: 2,
                explanation: "The .str accessor gives vectorised string operations. df['name'].str.contains('Nwosu') returns a boolean Series. Without .str, you'd get AttributeError — 'Series' object has no attribute 'contains'.",
              },
              {
                type: "bug",
                question: "What's wrong?",
                code: `df["first"] = df["name"].split().str[0]`,
                options: ["str[0] should be str[-1]", "Need .str before .split(): df['name'].str.split().str[0]", "Should use .extract() instead", "Nothing is wrong"],
                correct: 1,
                explanation: "On a Series, string methods must go through the .str accessor: df['name'].str.split(). Without .str, Python tries to call .split() directly on the Series object, which raises AttributeError.",
              },
              {
                question: "What does df['salary_raw'].str.replace(r'[^0-9]', '', regex=True) do?",
                options: ["Removes all characters", "Removes all non-numeric characters (keeps only digits)", "Replaces 0-9 with empty string", "Removes spaces only"],
                correct: 1,
                explanation: "[^0-9] in regex means 'any character that is NOT a digit'. Replacing it with '' (empty string) removes all non-digits. So '$85,000' becomes '85000'. Then .astype(int) converts to integer.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
