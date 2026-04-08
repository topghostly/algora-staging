"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Warn, CM, Quiz, Course, SLabel as SL, PyTag as Tag } from "../python-shared";

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

function DictExplorer() {
  const [d, setD] = useState<Record<string, any>>({
    name: "Amara Osei",
    dept: "Engineering",
    salary: 85000,
    active: true,
    score: null,
  });
  const [k, setK] = useState("");
  const [v, setV] = useState("");
  const [lk, setLk] = useState("");
  const [lr, setLr] = useState<{ found: boolean; val?: any } | null>(null);
  const [lastOp, setLastOp] = useState<string | null>(null);

  const parseVal = (s: string) =>
    s === "true" ? true : s === "false" ? false : s === "None" || s === "null" ? null : !isNaN(Number(s)) && s !== "" ? Number(s) : s;

  const add = () => {
    if (k.trim()) {
      setD({ ...d, [k.trim()]: parseVal(v) });
      setLastOp(`d["${k.trim()}"] = ${v}`);
      setK(""); setV("");
    }
  };
  const del = (key: string) => {
    const n = { ...d }; delete n[key]; setD(n);
    setLastOp(`del d["${key}"]`);
  };
  const lookup = () => {
    if (lk.trim()) {
      setLr(lk.trim() in d ? { found: true, val: d[lk.trim()] } : { found: false });
      setLastOp(`d.get("${lk.trim()}")`);
    }
  };
  const tc = (val: any) =>
    val === null ? T.red : typeof val === "boolean" ? T.yellow : typeof val === "number" ? T.orange : T.green;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Add key-value pairs, delete keys, or look up a key safely with .get(). Watch the dict and Python code update in real time.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ border: "1px solid rgba(251,146,60,.3)", borderRadius: 10, background: "rgba(251,146,60,.04)", marginBottom: 10 }}>
            <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(251,146,60,.2)", fontSize: 9, color: T.orange, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
              🗂️ dict ({Object.keys(d).length} keys)
            </div>
            {Object.entries(d).map(([key, val]) => (
              <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr auto", padding: "6px 12px", borderBottom: `1px solid ${T.slate}22`, alignItems: "center", gap: 8 }}>
                <code style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.cyan }}>"{key}"</code>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <code style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: tc(val), fontWeight: 700 }}>
                    {val === null ? "None" : typeof val === "string" ? `"${val}"` : String(val)}
                  </code>
                  <Tag c={tc(val)}>{val === null ? "NoneType" : typeof val}</Tag>
                </div>
                <button onClick={() => del(key)} style={{ fontSize: 9, color: T.red, background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <input value={k} onChange={e => setK(e.target.value)} placeholder="key (str)" style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(34,211,238,.3)", background: T.bg, color: T.cyan, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
              <span style={{ color: T.greyDark, fontSize: 16, alignSelf: "center" }}>:</span>
              <input value={v} onChange={e => setV(e.target.value)} placeholder="value" style={{ flex: 1.2, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(251,146,60,.3)", background: T.bg, color: T.orange, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
              <button onClick={add} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid rgba(251,146,60,.4)", background: "rgba(251,146,60,.1)", color: T.orange, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>add</button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <input value={lk} onChange={e => setLk(e.target.value)} onKeyDown={e => e.key === "Enter" && lookup()} placeholder="lookup key..." style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(192,132,252,.3)", background: T.bg, color: T.purple, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
              <button onClick={lookup} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(192,132,252,.4)", background: "rgba(192,132,252,.1)", color: T.purple, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>d.get()</button>
            </div>
            {lr !== null && (
              <div style={{ padding: "6px 10px", borderRadius: 7, background: lr.found ? "rgba(74,222,128,.08)" : "rgba(248,113,113,.08)", border: `1px solid ${lr.found ? T.green : T.red}33`, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: lr.found ? T.green : T.red, animation: "popIn .2s ease" }}>
                {lr.found ? `✓ d["${lk}"] = ${JSON.stringify(lr.val)}` : `✗ "${lk}" not found → None (no KeyError)`}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lastOp && (
            <div style={{ animation: "popIn .2s ease" }}>
              <SL c={T.green}>LAST OP</SL>
              <PyBlock code={lastOp} />
            </div>
          )}
          <PyBlock label="Iterating a dict" code={`emp = ${JSON.stringify(d, null, 2)}\n\n# Keys only:\nfor key in emp:\n    print(key)\n\n# Values only:\nfor val in emp.values():\n    print(val)\n\n# Both (most common):\nfor key, val in emp.items():\n    print(f"{key}: {val}")`} />
        </div>
      </div>
    </div>
  );
}

function DictPatternsVisual() {
  const [pattern, setPattern] = useState("comprehension");
  const PATTERNS: Record<string, { label: string; code: string; result: string }> = {
    comprehension: {
      label: "Dict comprehension",
      code: `employees = [{"name":"Amara","salary":85000},{"name":"Bola","salary":72000},...]\n\n# Map name → salary:\nsal_map = {e["name"]: e["salary"] for e in employees}\n# {"Amara Osei": 85000, "Bola Adeyemi": 72000, ...}\n\n# Filter AND transform:\nhigh_earners = {\n    e["name"]: e["salary"]\n    for e in employees\n    if e["salary"] > 80000\n}\n\n# Invert a dict:\noriginal = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in original.items()}\n# {1: "a", 2: "b", 3: "c"}`,
      result: "sal_map = {name: salary for each employee}",
    },
    defaultdict: {
      label: "defaultdict",
      code: `from collections import defaultdict\n\n# Group employees by department:\nby_dept = defaultdict(list)\nfor emp in employees:\n    by_dept[emp["dept"]].append(emp["name"])\n\n# {"Engineering": ["Amara","Chidi","Funke","Ifeoma"],\n#  "Analytics":   ["Bola","Efe","Henry"],\n#  "Product":     ["Dami","Grace","Jide"]}\n\n# defaultdict(int) — counting:\nword_count = defaultdict(int)\nfor word in text.split():\n    word_count[word] += 1  # no KeyError on first access!`,
      result: "by_dept = defaultdict(list) — group without checking if key exists",
    },
    counter: {
      label: "Counter",
      code: `from collections import Counter\n\ndepts = [e["dept"] for e in employees]\ncounts = Counter(depts)\n# Counter({"Engineering":4, "Analytics":3, "Product":3})\n\ncounts.most_common(2)  # [("Engineering",4), ...]\ncounts["Engineering"]   # 4\ncounts["Unknown"]       # 0 (no KeyError!)\n\n# Count words:\ntext = "data engineering data analytics data"\nCounter(text.split())\n# Counter({"data":3, "engineering":1, "analytics":1})`,
      result: "Counter — automatic counting, most_common(), no KeyError",
    },
    merge: {
      label: "Merge dicts",
      code: `defaults = {"active": True, "score": None, "region": "WA"}\noverride = {"name": "Amara", "score": 88.5}\n\n# Python 3.9+ — | operator:\nmerged = defaults | override\n# {"active":True, "score":88.5, "region":"WA", "name":"Amara"}\n\n# Earlier Python — ** unpacking:\nmerged = {**defaults, **override}\n\n# In-place update:\ndefaults.update(override)  # modifies defaults\n\n# Dict.get() with default:\nval = d.get("missing_key", "default_value")`,
      result: "| operator (3.9+) or {**a, **b} to merge dicts",
    },
  };
  const p = PATTERNS[pattern];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>Click a pattern to see the full code. These cover 80% of dict usage in real data work.</Hint>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {Object.entries(PATTERNS).map(([k, val]) => (
          <button key={k} onClick={() => setPattern(k)} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${pattern === k ? T.orange : "rgba(255,255,255,.08)"}`, background: pattern === k ? "rgba(251,146,60,.12)" : "rgba(255,255,255,.02)", color: pattern === k ? T.orange : T.grey, fontWeight: pattern === k ? 700 : 400 }}>
            {val.label}
          </button>
        ))}
      </div>
      <div style={{ background: `${T.orange}09`, border: `1px solid ${T.orange}25`, borderRadius: 8, padding: "7px 12px", fontSize: 11, color: T.greyLight }}>
        <strong style={{ color: T.orange }}>{p.label}:</strong> {p.result}
      </div>
      <PyBlock code={p.code} label="Python" />
    </div>
  );
}

export default function Module03() {
  return (
    <Course
      intro={{
        explain: "A dictionary stores data as key-value pairs — like a real dictionary where you look up a word (key) and get its definition (value). Lookup is instant regardless of how many items are stored, because Python uses a hash table under the hood. In data work, dicts appear everywhere: JSON API responses are dicts, grouping records produces dicts, and mapping one set of values to another is done with dicts.",
        learn: [
          "Create, read, update, and delete dictionary entries",
          "Use .get() to safely access a key that might not exist",
          "Use dict comprehensions, defaultdict, and Counter for grouping and counting",
          "Navigate and flatten nested dicts from real-world API responses",
        ],
        concepts: [
          "d['key'] raises KeyError if missing; d.get('key', default) returns the default instead",
          "Keys must be hashable — strings, ints, and tuples work; lists do not",
          "Iterate with d.items() to get both key and value at once in a for loop",
          "defaultdict(list) creates an empty list automatically for new keys — great for grouping",
        ],
        why: "JSON APIs return dicts. Pandas groupby produces dicts. Counting, grouping, and mapping values all rely on dicts. Understanding them deeply is what makes the jump from beginner to practitioner.",
      }}
      c={T.orange}
      steps={[
        {
          title: "Dict explorer",
          desc: "A dictionary is created with curly braces: emp = {'name': 'Amara', 'salary': 85000}. You read values with emp['name'] or safely with emp.get('name', default). You add or update a key with emp['dept'] = 'Engineering'. You delete a key with del emp['dept'] or emp.pop('dept'). You iterate over keys with for k in emp, over values with emp.values(), or over both with emp.items(). Add, remove, and look up keys in the explorer below to see the live Python code.",
          content: () => <DictExplorer />,
        },
        {
          title: "Power patterns",
          desc: "Four patterns cover almost all advanced dict usage in data work. A dict comprehension builds a dict from an iterable in one line: {key: value for item in iterable}. defaultdict from the collections module creates a default value automatically for any missing key — perfect for grouping. Counter counts occurrences automatically and has useful methods like .most_common(). The | operator (Python 3.9+) or {**d1, **d2} merges two dicts, with the right dict overriding duplicates.",
          content: () => <DictPatternsVisual />,
        },
        {
          title: "Nested dicts",
          desc: "Nested dicts are dicts that contain other dicts as values. JSON API responses almost always look like this. You navigate them by chaining bracket lookups: data['employee']['address']['city']. The safe way to navigate potentially missing keys is to chain .get() calls: data.get('employee', {}).get('address', {}).get('city'). .setdefault(key, default) adds the key with a default value if it does not exist, and returns the value — useful for building nested structures incrementally.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.orange}>Real-world data (APIs, JSON, configs) is almost always nested. Know how to traverse, update, and flatten.</Note>
              <PyBlock label="Nested dicts" code={`# API-style nested response:\nemployee = {\n    "id": 1,\n    "name": "Amara Osei",\n    "contact": {\n        "email": "amara@company.com",\n        "phone": "+234-800-0000"\n    },\n    "role": {\n        "title": "Senior Engineer",\n        "dept": "Engineering",\n        "reports_to": {"id": 5, "name": "Manager"}\n    }\n}\n\n# Safe deep access:\nemail = employee["contact"]["email"]\ntitle = employee.get("role", {}).get("title", "Unknown")\n\n# Update nested:\nemployee["contact"]["phone"] = "+234-900-0000"\n\n# Flatten with dict comprehension:\nflat = {f"{k}_{ik}": iv\n        for k, outer in employee.items()\n        if isinstance(outer, dict)\n        for ik, iv in outer.items()}\n\n# setdefault — add if missing:\nemployee.setdefault("tags", []).append("senior")`} />
              <Warn>Deep nesting (&gt;3 levels) is a code smell. Consider flattening or using dataclasses for complex structures.</Warn>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM mistakes={[
              {
                title: "KeyError on missing key — use .get()",
                wrong: `# Direct access raises KeyError:\nval = d["missing_key"]  # KeyError!`,
                right: `# .get() returns None or your default:\nval = d.get("missing_key")         # None\nval = d.get("missing_key", 0)      # 0\nval = d.get("missing_key", [])     # []`,
                why: ".get() is safe — it returns None (or a default) instead of raising KeyError. Use it whenever a key might not exist, which is almost always in real-world data.",
              },
              {
                title: "Using a list as a dict key",
                wrong: `# Lists are not hashable:\nd = {[1,2,3]: "value"}  # TypeError: unhashable type: 'list'`,
                right: `# Use a tuple instead:\nd = {(1,2,3): "value"}  # ✓ tuples are hashable\n\n# Or convert to string:\nd = {str([1,2,3]): "value"}`,
                why: "Dict keys must be hashable (immutable). Lists are mutable and unhashable. Use tuples, strings, ints, or frozensets as keys.",
              },
              {
                title: "Modifying a dict while iterating",
                wrong: `for key in my_dict:\n    if some_condition(key):\n        del my_dict[key]  # RuntimeError!`,
                right: `# Iterate over a copy of keys:\nfor key in list(my_dict.keys()):\n    if some_condition(key):\n        del my_dict[key]\n\n# Or build a new dict:\nmy_dict = {k: v for k, v in my_dict.items()\n           if not some_condition(k)}`,
                why: "Modifying a dict while iterating it raises RuntimeError. Create a list of keys first with list(d.keys()), or build a new dict with a comprehension.",
              },
            ]} />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.orange} questions={[
              {
                question: "What does d.get('missing', 'default') return if 'missing' isn't in d?",
                options: ["KeyError", "None", "'default'", "False"],
                correct: 2,
                explanation: ".get(key, default) returns the default value (second argument) if the key doesn't exist. Without a default, it returns None. This is much safer than d['key'] which raises KeyError.",
              },
              {
                type: "output",
                question: "What does this print?",
                code: `from collections import Counter\nc = Counter("banana")\nprint(c["z"])`,
                options: ["KeyError", "None", "0", "1"],
                correct: 2,
                explanation: "Counter subclasses dict but returns 0 for missing keys instead of raising KeyError. This makes it safe to count things without checking if the key exists first.",
              },
              {
                type: "bug",
                question: "What's wrong with this grouping code?",
                code: `by_dept = {}\nfor emp in employees:\n    by_dept[emp["dept"]].append(emp["name"])`,
                options: [".append() doesn't work on dict values", "First time accessing a new dept, the key doesn't exist — KeyError", "Should iterate over dept keys", "employees should be a dict"],
                correct: 1,
                explanation: "On the first encounter of a department, by_dept[emp['dept']] raises KeyError because the key doesn't exist yet. Fix: use defaultdict(list), or add by_dept.setdefault(emp['dept'], []).append(emp['name']).",
              },
              {
                question: "How do you merge two dicts in Python 3.9+?",
                options: ["{**d1, **d2}", "d1.merge(d2)", "d1 | d2", "d1 + d2"],
                correct: 2,
                explanation: "Python 3.9 introduced the | operator for merging dicts. d1 | d2 creates a new dict with d2's values overriding d1's. For in-place merging, use |=. Before 3.9, use {**d1, **d2}.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
