"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Tip, Quiz, Course, SLabel as SL } from "../python-shared";

function RegexBuilder() {
  const [pattern, setPattern] = useState("\\d+");
  const [text, setText] = useState("Amara earns 85000 and Bola earns 72000 per year");

  const PRESETS = [
    { label: "Digits",           pat: "\\d+",                                                    desc: "One or more digits" },
    { label: "Word",             pat: "\\w+",                                                    desc: "Word characters (letters, digits, _)" },
    { label: "Email",            pat: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",        desc: "Email address" },
    { label: "Date (YYYY-MM-DD)",pat: "\\d{4}-\\d{2}-\\d{2}",                                   desc: "ISO date format" },
    { label: "Phone",            pat: "\\+?\\d[\\d\\s-]{7,}\\d",                                desc: "Phone number pattern" },
    { label: "Capitalized word", pat: "[A-Z][a-z]+",                                             desc: "Words starting with capital" },
  ];

  let matches: { val: string; idx: number }[] = [];
  let error: string | null = null;
  try {
    const re = new RegExp(pattern, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ val: m[0], idx: m.index });
    }
  } catch (e: any) {
    error = e.message;
  }

  const highlighted = error
    ? null
    : text.split("").map((ch, i) => ({
        ch,
        hi: matches.some(m => i >= m.idx && i < m.idx + m.val.length),
      }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Type a regex pattern or click a preset. The matching text highlights in real time. All matches are listed below.</Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => setPattern(p.pat)} style={{ padding: "4px 9px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${pattern === p.pat ? T.green : "rgba(255,255,255,.08)"}`, background: pattern === p.pat ? "rgba(74,222,128,.12)" : "rgba(255,255,255,.02)", color: pattern === p.pat ? T.green : T.grey }}>{p.label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <SL c={T.green}>PATTERN</SL>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>/</span>
              <input value={pattern} onChange={e => setPattern(e.target.value)} style={{ flex: 1, padding: "6px 10px", borderRadius: 7, border: `1px solid ${error ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.35)"}`, background: T.bg, color: T.green, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
              <span style={{ color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>/g</span>
            </div>
            {error && <div style={{ fontSize: 9, color: T.red, marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>{error}</div>}
          </div>
          <div>
            <SL>TEST STRING</SL>
            <textarea value={text} onChange={e => setText(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 7, border: `1px solid ${T.slate}`, background: T.bg, color: T.white, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", outline: "none", resize: "vertical", minHeight: 60 }} />
          </div>
          {highlighted && (
            <div>
              <SL c={T.green}>HIGHLIGHTED</SL>
              <div style={{ background: "rgba(4,9,20,.85)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.8, wordBreak: "break-word" }}>
                {highlighted.map((c, i) => (
                  <span key={i} style={{ background: c.hi ? "rgba(74,222,128,.3)" : "transparent", color: c.hi ? T.green : T.white, borderRadius: c.hi ? 2 : 0 }}>{c.ch}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!error && (
            <div>
              <SL c={T.green}>{matches.length} MATCH{matches.length !== 1 ? "ES" : ""}</SL>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {matches.length === 0 && <div style={{ fontSize: 10, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", padding: "8px", textAlign: "center" }}>No matches</div>}
                {matches.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 10px", borderRadius: 6, background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)" }}>
                    <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", minWidth: 55 }}>idx {m.idx}</span>
                    <code style={{ fontSize: 11, color: T.green, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>"{m.val}"</code>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PyBlock label="Python — re module" code={`import re\n\ntext = "${text.slice(0, 40)}..."\npattern = r"${pattern}"\n\n# Find all matches:\nmatches = re.findall(pattern, text)\n# ${JSON.stringify(matches.map(m => m.val).slice(0, 3))}...\n\n# Find with positions:\nfor m in re.finditer(pattern, text):\n    print(m.group(), m.start(), m.end())\n\n# Replace:\ncleaned = re.sub(r"\\d+", "[NUM]", text)`} />
        </div>
      </div>
    </div>
  );
}

export default function Module17() {
  return (
    <Course
      intro={{
        explain: "A regular expression is a pattern that describes a set of strings. \\d+ means one or more digits. [A-Z][a-z]+ means a capital letter followed by one or more lowercase letters. You use regex to find, validate, extract, and replace text that follows a pattern — phone numbers, email addresses, product codes, dates embedded in free text. In pandas, regex integrates directly into the .str accessor so it applies to entire columns at once.",
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
              <Note c={T.green}>Regex patterns look cryptic but follow a small set of rules. Master these 15 patterns and you can handle 90% of text cleaning tasks.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  ["\\d","Digit (0-9)"],["\\w","Word char (a-z, A-Z, 0-9, _)"],["\\s","Whitespace (space, tab, newline)"],
                  ["\\D","NOT digit"],["\\W","NOT word char"],["\\S","NOT whitespace"],
                  [".","Any character (except newline)"],["+","One or more of preceding"],["*","Zero or more of preceding"],
                  ["?","Zero or one of preceding"],["^","Start of string"],["$","End of string"],
                  ["{n}","Exactly n times"],["{n,m}","Between n and m times"],["[abc]","Any of: a, b, or c"],
                  ["[^abc]","NOT a, b, or c"],["(group)","Capture group"],["a|b","a OR b"],
                ].map(([p, d]) => (
                  <div key={p} style={{ display: "flex", gap: 8, padding: "5px 8px", borderRadius: 6, background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.1)" }}>
                    <code style={{ fontSize: 11, color: T.green, fontFamily: "'JetBrains Mono',monospace", minWidth: 60, fontWeight: 700 }}>{p}</code>
                    <span style={{ fontSize: 10, color: T.greyLight }}>{d}</span>
                  </div>
                ))}
              </div>
              <Tip icon="🔑" title="ALWAYS USE RAW STRINGS" c={T.green}>
                In Python, write regex as <code>r"\d+"</code> not <code>"\d+"</code>. Raw strings treat backslashes literally. Without r, <code>"\d"</code> is just "d" and <code>"\n"</code> is a newline.
              </Tip>
            </div>
          ),
        },
        {
          title: "Regex in pandas",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.green}>pandas .str accessor accepts regex in most string methods. This is how you clean messy text columns at scale.</Note>
              <PyBlock label="pandas regex patterns" code={`# Filter rows by regex pattern:\ndf[df["name"].str.contains(r"Nwosu|Osei")]\ndf[df["email"].str.match(r"^\\w+@company\\.com$")]\n\n# Extract groups:\ndf["year"] = df["hired"].str.extract(r"(\\d{4})")\ndf["first"] = df["name"].str.extract(r"^(\\w+)")\ndf["last"]  = df["name"].str.extract(r"(\\w+)$")\n\n# Replace with regex:\ndf["salary_int"] = (\n    df["salary_raw"]\n    .str.replace(r"[^\\d]", "", regex=True)\n    .astype(int)\n)\n\n# Split on regex:\ndf["parts"] = df["full_name"].str.split(r"\\s+-\\s+")\n\n# extractall — multiple matches per row:\ndf["phone"].str.extractall(r"(\\d{3}-\\d{4})")`} />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.green} questions={[
              {
                question: "What does r'\\d+' mean in Python?",
                options: ["A raw string containing \\d+ (matches one or more digits)", "A string containing a newline and 'd+'", "A regular expression for 'digit'", "An error — invalid syntax"],
                correct: 0,
                explanation: "r'' is a raw string literal — backslashes are treated literally, not as escape sequences. r'\\d+' contains the two characters \\ and d followed by +. In regex, \\d matches any digit and + means 'one or more'. Without r, Python would try to interpret \\d as an escape sequence.",
              },
              {
                type: "bug",
                question: "What's wrong with this email filter?",
                code: `df[df["email"].str.contains("@company.com")]`,
                options: ["Missing regex=True flag", "The dot . in regex matches ANY character — should escape it as \\\\.", ".str.contains needs re import", "Nothing — this is correct"],
                correct: 1,
                explanation: "In regex, . matches any character. '@company.com' would match '@companyXcom' too. Escape the dot: str.contains(r'@company\\.com') or str.contains('@company.com', regex=False) for literal matching.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
