"use client";
import React, { useState, useRef } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Warn, SLabel, CM, Quiz, Course } from "../python-shared";

const DF_EMPLOYEES = [
  { id:1,  name:"Amara Osei",    dept:"Engineering", salary:85000, hired:"2021-03-15", active:true,  score:null  },
  { id:2,  name:"Bola Adeyemi",  dept:"Analytics",   salary:72000, hired:"2020-07-22", active:true,  score:88.5  },
  { id:3,  name:"Chidi Nwosu",   dept:"Engineering", salary:91000, hired:"2019-11-01", active:true,  score:92.0  },
  { id:4,  name:"Dami Afolabi",  dept:"Product",     salary:68000, hired:"2022-01-10", active:false, score:null  },
  { id:5,  name:"Efe Okonkwo",   dept:"Analytics",   salary:75000, hired:"2021-06-30", active:true,  score:79.5  },
  { id:6,  name:"Funke Balogun", dept:"Engineering", salary:88000, hired:"2020-04-18", active:true,  score:95.0  },
  { id:7,  name:"Grace Mensah",  dept:"Product",     salary:71000, hired:"2022-09-05", active:true,  score:83.0  },
  { id:8,  name:"Henry Eze",     dept:"Analytics",   salary:69000, hired:"2023-02-14", active:true,  score:77.0  },
  { id:9,  name:"Ifeoma Nwosu",  dept:"Engineering", salary:93000, hired:"2018-08-20", active:true,  score:98.5  },
  { id:10, name:"Jide Okafor",   dept:"Product",     salary:65000, hired:"2023-05-11", active:true,  score:null  },
];

// ─── ListOpsVisual ────────────────────────────────────────────────────────────
function ListOpsVisual() {
  const [items, setItems] = useState(["Lagos","Accra","Nairobi","Cairo","Abuja"]);
  const [input, setInput] = useState("");
  const [insertAt, setInsertAt] = useState(0);
  const [sliceA, setSliceA] = useState(1);
  const [sliceB, setSliceB] = useState(4);
  const [lastOp, setLastOp] = useState<string | null>(null);
  const op = (label: string, fn: () => void) => { fn(); setLastOp(label); };
  const sliced = items.slice(sliceA, sliceB);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Use every button to see list operations live. The slicing section lets you drag start and end to highlight what Python returns.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <SLabel c={T.purple}>LIST — {items.length} items</SLabel>
          <div style={{ background: "rgba(4,9,20,.85)", border: "1px solid rgba(192,132,252,.2)", borderRadius: 10, padding: "8px", minHeight: 160, marginBottom: 8 }}>
            {items.length === 0 && <div style={{ fontSize: 10, color: T.greyDark, textAlign: "center", padding: "20px", fontFamily: "'JetBrains Mono',monospace" }}>[] — empty</div>}
            {items.map((item, i) => (
              <div key={`${item}-${i}`} style={{ display: "flex", gap: 6, padding: "4px 6px", borderRadius: 6, background: "rgba(192,132,252,.07)", border: "1px solid rgba(192,132,252,.14)", marginBottom: 3, animation: "slideIn .2s ease", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", minWidth: 22 }}>[{i}]</span>
                <span style={{ fontSize: 11, color: T.purple, fontFamily: "'JetBrains Mono',monospace", flex: 1 }}>&quot;{item}&quot;</span>
                <button onClick={() => op(`remove [${i}]`, () => setItems(p => p.filter((_, j) => j !== i)))} style={{ fontSize: 9, color: T.red, background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input.trim() && op(`append("${input.trim()}")`, () => { setItems(p => [...p, input.trim()]); setInput(""); })} placeholder="New item..." style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(192,132,252,.3)", background: T.bg, color: T.purple, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
            <button onClick={() => input.trim() && op(`append("${input.trim()}")`, () => { setItems(p => [...p, input.trim()]); setInput(""); })} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(192,132,252,.4)", background: "rgba(192,132,252,.1)", color: T.purple, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>append</button>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 6, alignItems: "center" }}>
            <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>insert at [{insertAt}]:</span>
            <input type="range" min={0} max={items.length} value={insertAt} onChange={e => setInsertAt(Number(e.target.value))} style={{ flex: 1, accentColor: T.cyan }} />
            <button onClick={() => input.trim() && op(`insert(${insertAt},"${input.trim()}")`, () => { setItems(p => { const n = [...p]; n.splice(insertAt, 0, input.trim()); return n; }); setInput(""); })} style={{ padding: "4px 9px", borderRadius: 6, border: "1px solid rgba(34,211,238,.4)", background: "rgba(34,211,238,.08)", color: T.cyan, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>insert()</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 5 }}>
            {([
              [".sort()", T.green, () => setItems(p => [...p].sort())],
              [".sort(rev)", T.yellow, () => setItems(p => [...p].sort().reverse())],
              [".reverse()", T.orange, () => setItems(p => [...p].reverse())],
              [".pop()", T.red, () => setItems(p => { const n=[...p]; n.pop(); return n; })],
              [".pop(0)", T.pink, () => setItems(p => p.slice(1))],
              [".clear()", T.red, () => setItems([])],
            ] as [string, string, () => void][]).map(([label, c, fn]) => (
              <button key={label} onClick={() => op(label, fn)} style={{ padding: "5px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${c}44`, background: `${c}0c`, color: c }}>{label}</button>
            ))}
          </div>
          <button onClick={() => { setItems(["Lagos","Accra","Nairobi","Cairo","Abuja"]); setLastOp(null); }} style={{ width: "100%", padding: "4px", borderRadius: 6, border: `1px solid ${T.slate}`, background: "transparent", color: T.greyDark, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>↩ Reset</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lastOp && <div style={{ animation: "popIn .2s ease" }}><SLabel c={T.green}>LAST OP</SLabel><PyBlock code={`cities.${lastOp}\n# → ${JSON.stringify(items)}`} /></div>}
          <div>
            <SLabel c={T.blue}>SLICING — [{sliceA}:{sliceB}]</SLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
              <div><div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>start [{sliceA}]</div><input type="range" min={0} max={items.length} value={sliceA} onChange={e => setSliceA(Number(e.target.value))} style={{ width: "100%", accentColor: T.blue }} /></div>
              <div><div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>stop [{sliceB}]</div><input type="range" min={0} max={items.length} value={sliceB} onChange={e => setSliceB(Number(e.target.value))} style={{ width: "100%", accentColor: T.cyan }} /></div>
            </div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 6 }}>
              {items.map((item, i) => (
                <span key={i} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 9, fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${i >= sliceA && i < sliceB ? "rgba(96,165,250,.5)" : "rgba(255,255,255,.06)"}`, background: i >= sliceA && i < sliceB ? "rgba(96,165,250,.14)" : "transparent", color: i >= sliceA && i < sliceB ? T.blue : T.greyDark, transition: "all .2s" }}>[{i}]&quot;{item}&quot;</span>
              ))}
            </div>
            <PyBlock code={`cities[${sliceA}:${sliceB}]\n# ${JSON.stringify(sliced)}\n\n# Negative indexing:\ncities[-1]   # last → "${items[items.length - 1] || "?"}"\ncities[-3:]  # last 3\ncities[::-1] # reversed`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LoopVisual ───────────────────────────────────────────────────────────────
function LoopVisual() {
  const items = ["Lagos","Accra","Nairobi","Cairo","Abuja"];
  const [mode, setMode] = useState("for");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const MODES: Record<string, { code: string; rows: string[] }> = {
    for:         { code: `for city in cities:\n    print(city)`,               rows: items.map(c => c) },
    enumerate:   { code: `for i, city in enumerate(cities):\n    print(f"{i}: {city}")`, rows: items.map((c,i) => `${i}: ${c}`) },
    zip:         { code: `salaries = [85000,72000,91000,68000,75000]\nfor city, sal in zip(cities, salaries):\n    print(f"{city}: {sal:,}")`, rows: items.map((c,i) => `${c}: ${[85000,72000,91000,68000,75000][i].toLocaleString()}`) },
    while:       { code: `i = 0\nwhile i < len(cities):\n    print(cities[i])\n    i += 1`,   rows: items.map(c => c) },
    comprehension: { code: `upper = [c.upper() for c in cities\n         if len(c) > 4]\n# ${JSON.stringify(items.filter(c=>c.length>4).map(c=>c.toUpperCase()))}`, rows: items.map(c=>c.length>4?`"${c}" → "${c.toUpperCase()}"`:null).filter(Boolean) as string[] },
  };
  const m = MODES[mode];
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(-1); setRunning(true);
    let i = -1;
    timer.current = setInterval(() => { i++; setStep(i); if (i >= m.rows.length - 1) { clearInterval(timer.current!); setRunning(false); } }, 600);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">Pick a loop type, then click Animate to step through each iteration. Completed rows turn green.</Hint>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Object.keys(MODES).map(k => (
          <button key={k} onClick={() => { setMode(k); setStep(-1); setRunning(false); if (timer.current) clearInterval(timer.current); }} style={{ padding: "5px 11px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${mode===k?T.cyan:"rgba(255,255,255,.08)"}`, background: mode===k?"rgba(34,211,238,.12)":"transparent", color: mode===k?T.cyan:T.grey, fontWeight: mode===k?700:400 }}>{k}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <PyBlock code={m.code} label="Python" />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={play} disabled={running} style={{ padding: "6px 16px", borderRadius: 8, fontSize: 10, cursor: running?"not-allowed":"pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: "1px solid rgba(34,211,238,.4)", background: running?"transparent":"rgba(34,211,238,.12)", color: running?T.grey:T.cyan }}>{running?"⚙️ Running...":"▶ Animate"}</button>
            <button onClick={() => { if (timer.current) clearInterval(timer.current); setStep(-1); setRunning(false); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: T.grey }}>Reset</button>
          </div>
        </div>
        <div>
          <SLabel c={T.cyan}>ITERATIONS</SLabel>
          <div style={{ background: "rgba(4,9,20,.85)", borderRadius: 10, border: "1px solid rgba(34,211,238,.15)", padding: "8px", display: "flex", flexDirection: "column", gap: 3 }}>
            {m.rows.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 8px", borderRadius: 6, background: step===i?"rgba(34,211,238,.14)":step>i?"rgba(74,222,128,.06)":"transparent", border: `1px solid ${step===i?"rgba(34,211,238,.4)":step>i?"rgba(74,222,128,.2)":"transparent"}`, transition: "all .2s", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", minWidth: 18, flexShrink: 0 }}>#{i}</span>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: step===i?T.cyan:step>i?T.green:T.greyLight, fontWeight: step===i?700:400, flex: 1, transition: "color .2s" }}>{row}</span>
                {step===i && <span style={{ fontSize: 8, color: T.cyan }}>← now</span>}
                {step>i && <span style={{ fontSize: 8, color: T.green }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ComprehensionBuilder ─────────────────────────────────────────────────────
function ComprehensionBuilder() {
  const PRESETS = [
    { label: "Names of active staff", expr: "e.name", cond: "e.active", result: () => DF_EMPLOYEES.filter(e=>e.active).map(e=>e.name) },
    { label: "Salaries > 80k",        expr: "e.salary", cond: "e.salary > 80000", result: () => DF_EMPLOYEES.filter(e=>e.salary>80000).map(e=>e.salary) },
    { label: "Depts of engineers",    expr: "e.dept", cond: "e.dept == 'Engineering'", result: () => DF_EMPLOYEES.filter(e=>e.dept==="Engineering").map(e=>e.dept) },
    { label: "Scores, no nulls",      expr: "e.score", cond: "e.score is not None", result: () => DF_EMPLOYEES.filter(e=>e.score!==null).map(e=>e.score) },
  ];
  const [sel, setSel] = useState(0);
  const p = PRESETS[sel];
  const res = p.result();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Click a preset to see different comprehension patterns evaluated against the real employee data.</Hint>
      <div style={{ background: `${T.purple}09`, border: `1px solid ${T.purple}28`, borderRadius: 12, padding: "14px" }}>
        <SLabel c={T.purple}>COMPREHENSION PATTERN</SLabel>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8 }}>
          <span style={{ color: T.greyDark }}>[</span>
          <span style={{ color: T.green }}>{p.expr}</span>
          <span style={{ color: T.purple, fontWeight: 700 }}> for e in employees </span>
          <span style={{ color: T.purple, fontWeight: 700 }}>if </span>
          <span style={{ color: T.yellow }}>{p.cond}</span>
          <span style={{ color: T.greyDark }}>]</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {PRESETS.map((pr, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding: "8px 10px", borderRadius: 8, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", textAlign: "left", border: `1px solid ${sel===i?T.purple:T.slate}`, background: sel===i?`${T.purple}12`:"rgba(255,255,255,.02)", color: sel===i?T.purple:T.greyLight }}>
            <div style={{ color: sel===i?T.purple:T.greyDark, fontWeight: 700, marginBottom: 2 }}>{pr.label}</div>
            <code style={{ color: T.grey, fontSize: 8 }}>[{pr.expr} for e in ... if {pr.cond}]</code>
          </button>
        ))}
      </div>
      <div>
        <SLabel c={T.green}>RESULT — {res.length} items</SLabel>
        <div style={{ background: "rgba(4,9,20,.85)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: "10px 14px" }}>
          <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.green, lineHeight: 1.7 }}>{JSON.stringify(res, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

// ─── Module02 ─────────────────────────────────────────────────────────────────
export default function Module02() {
  return (
    <Course
      intro={{
        explain: "A list is an ordered, changeable collection of items. It can hold any mix of data types and you can add, remove, sort, or rearrange its contents at any time. Loops let you process each item in a collection one by one. Together, lists and loops form the backbone of almost all data processing: reading through rows, filtering results, transforming values, and building summaries.",
        learn: ["Add, remove, sort, slice, and index items in a list", "Use for, while, enumerate, and zip in the right situations", "Write list comprehensions to filter or transform a list in one readable line", "Understand why zip(), map(), and filter() return lazy iterators, not lists"],
        concepts: ["Lists use zero-based indexing: list[0] is first, list[-1] is the last item", "Slicing list[a:b] returns from index a up to but not including b", "[expr for item in iterable if cond] is a list comprehension — equivalent to a for loop with append", "enumerate() gives both index and value — cleaner than range(len(list))"],
        why: "In data work you loop through rows, filter records, and build transformed lists constantly. Comprehensions appear in nearly every pandas codebase and reduce multi-line loops to one clear expression.",
      }}
      c={T.purple}
      steps={[
        { title: "List operations", desc: "A list is created with square brackets: cities = ['Lagos', 'Accra']. Python gives you a rich set of built-in methods to modify it. .append(x) adds x to the end. .insert(i, x) adds x at position i. .pop() removes and returns the last item. .sort() reorders in place. Slicing with list[a:b] returns a new list from index a up to (not including) b.", content: () => <ListOpsVisual /> },
        { title: "Loops animator", desc: "A for loop iterates over every item in a sequence one by one. enumerate(cities) gives both the index and the value. zip(list1, list2) pairs up items from two lists simultaneously. Hit Animate to watch Python step through each iteration.", content: () => <LoopVisual /> },
        { title: "Comprehension builder", desc: "A list comprehension is a compact way to build a list from another sequence. The pattern is: [expression for item in iterable if condition]. Click presets to see different comprehension patterns against real employee data.", content: () => <ComprehensionBuilder /> },
        { title: "zip & enumerate", desc: "enumerate() and zip() are two of the most useful built-in functions for loops. enumerate(iterable, start=0) adds a counter. zip(list1, list2) pairs items from multiple iterables. zip stops at the shorter list.", content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Note c={T.purple}>Two of the most useful built-ins for loops. <code style={{ color: T.cyan }}>enumerate()</code> gives index + value. <code style={{ color: T.cyan }}>zip()</code> pairs multiple iterables.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><SLabel>enumerate()</SLabel><PyBlock code={`cities = ["Lagos", "Accra", "Nairobi"]\n\n# Without enumerate (bad):\nfor i in range(len(cities)):\n    print(i, cities[i])\n\n# With enumerate (Pythonic):\nfor i, city in enumerate(cities):\n    print(i, city)\n\n# Start from 1:\nfor i, city in enumerate(cities, start=1):\n    print(f"{i}. {city}")\n\n# Output:\n# 1. Lagos\n# 2. Accra\n# 3. Nairobi`} /></div>
              <div><SLabel>zip()</SLabel><PyBlock code={`cities  = ["Lagos", "Accra", "Nairobi"]\ncountry = ["Nigeria", "Ghana", "Kenya"]\npop_m   = [15.3, 2.3, 4.4]\n\nfor city, country, pop in zip(cities, country, pop_m):\n    print(f"{city} ({country}): {pop}M")\n\n# zip stops at shortest:\nlist(zip([1,2,3], ["a","b"]))  # [(1,'a'),(2,'b')]\n\n# Use zip_longest for full length:\nfrom itertools import zip_longest\nlist(zip_longest([1,2,3], ["a","b"], fillvalue=None))\n# [(1,'a'),(2,'b'),(3,None)]`} /></div>
            </div>
          </div>
        )},
        { title: "Common mistakes", content: () => <CM mistakes={[
          { title: "range(len(list)) instead of enumerate", wrong: `cities = ["Lagos", "Accra"]\nfor i in range(len(cities)):\n    print(i, cities[i])`, right: `for i, city in enumerate(cities):\n    print(i, city)`, why: "range(len()) is verbose and error-prone. enumerate() is idiomatic Python — it's cleaner, faster, and harder to get wrong." },
          { title: "Forgetting list() on zip/map/filter", wrong: `result = zip(names, salaries)\nprint(result)  # <zip object at 0x...>\n\nfirst = result[0]  # TypeError!`, right: `result = list(zip(names, salaries))\nprint(result)  # [('Amara', 85000), ...]\n\n# or iterate directly:\nfor name, sal in zip(names, salaries):\n    print(name, sal)`, why: "zip(), map(), filter() return lazy iterators — not lists. You can only iterate them ONCE. Wrap in list() if you need to index, reuse, or measure length." },
          { title: "Nesting comprehensions too deeply", wrong: `result = [[cell for cell in row]\n          for row in matrix\n          if sum(row) > 10\n          if all(c > 0 for c in row)]`, right: `# Break it into steps:\nvalid_rows = [row for row in matrix\n              if sum(row) > 10 and all(c > 0 for c in row)]\nresult = [[cell for cell in row] for row in valid_rows]`, why: "Comprehensions with 2+ conditions and a nested expression become hard to read and debug. Readability matters. A for loop or intermediate variable is cleaner." },
        ]} /> },
        { title: "Quiz", content: () => <Quiz c={T.purple} questions={[
          { type: "output", question: "What does this print?", code: `print(list(zip([1,2,3], ['a','b'])))`, options: ["[(1,'a'),(2,'b'),(3,None)]","[(1,'a'),(2,'b')]","Error","[(1,'a'),(2,'b'),(3,'')]"], correct: 1, explanation: "zip() stops at the shortest iterable. [1,2,3] has 3 items but ['a','b'] only has 2, so zip produces only 2 pairs. Use itertools.zip_longest() to include all items." },
          { type: "bug", question: "This list comprehension has a bug:", code: `evens = [x for x in range(10) if x % 2 = 0]`, options: ["range(10) should be range(1,11)","= is assignment; == is comparison","Missing return keyword","x % 2 doesn't work for even numbers"], correct: 1, explanation: "= is assignment (SyntaxError inside an expression). Use == for comparison. The correct code is: [x for x in range(10) if x % 2 == 0]." },
          { question: "What does cities[-2:] return if cities = ['Lagos','Accra','Nairobi','Cairo']?", options: ["['Lagos','Accra']","['Nairobi','Cairo']","['Cairo']","Error"], correct: 1, explanation: "Negative slicing: [-2:] starts 2 from the end and goes to the end. So ['Nairobi', 'Cairo']. [-2] alone returns just 'Nairobi'." },
          { type: "output", question: "What prints?", code: `for i, v in enumerate(['a','b','c'], start=1):\n    print(i, v)\n# What is the first line printed?`, options: ["0 a","1 a","(1, 'a')","a 1"], correct: 1, explanation: "enumerate(iterable, start=1) starts the counter at 1 instead of 0. The format is 'i v' so it prints '1 a' on the first iteration." },
        ]} /> },
      ]}
    />
  );
}
