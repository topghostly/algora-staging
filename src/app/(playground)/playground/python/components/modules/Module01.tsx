"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, OutBlock, Note, Hint, Tip, Warn, SLabel, Badge, CM, Quiz, Course } from "../python-shared";

// ─── TypeExplorer ─────────────────────────────────────────────────────────────
function TypeExplorer() {
  const TYPES = [
    { label: "42", pyType: "int", c: T.blue, icon: "🔢", props: { value: 42, "unlimited precision": "True", "is_bool subclass": "False" }, convs: { float: "42.0", str: '"42"', bool: "True" }, ops: ["+ - * / // % **", "abs() round()", "bin() hex() oct()"], note: "Python 3 ints have no size limit — no overflow." },
    { label: "3.14", pyType: "float", c: T.cyan, icon: "🔣", props: { value: 3.14, "IEEE 754": "64-bit", precision: "~15 digits" }, convs: { int: "3 (truncates)", str: '"3.14"', bool: "True" }, ops: ["math.floor() math.ceil()", "round(x, n)", "math.isnan() math.isinf()"], note: "0.1 + 0.2 ≠ 0.3 due to binary floating point. Use Decimal for money." },
    { label: '"Lagos"', pyType: "str", c: T.green, icon: "📝", props: { immutable: "True", indexable: "True", iterable: "True" }, convs: { int: "ValueError", float: "ValueError", list: '["L","a","g","o","s"]' }, ops: ['s[0] s[-1] s[1:3]', '.upper() .lower() .strip()', '.split() .join() .replace()'], note: "Immutable sequence. s[0]='L' raises TypeError." },
    { label: "True", pyType: "bool", c: T.yellow, icon: "✅", props: { value: 1, "subclass of int": "True", "False == 0": "True" }, convs: { int: "1", float: "1.0", str: '"True"' }, ops: ["and or not", "True + True → 2", "sum([True, False, True]) → 2"], note: "bool is a subclass of int. True == 1, False == 0." },
    { label: "None", pyType: "NoneType", c: T.red, icon: "❌", props: { singleton: "True", falsy: "True", "is None": "use this" }, convs: { bool: "False", str: '"None"', int: "TypeError" }, ops: ["x is None", "x is not None", "x or default_val"], note: "Singleton — only one None exists. Always use 'is None', never '== None'." },
    { label: "[1,2,3]", pyType: "list", c: T.purple, icon: "📋", props: { mutable: "True", ordered: "True", allows_dupes: "True" }, convs: { tuple: "(1,2,3)", set: "{1,2,3}", dict: "zip required" }, ops: [".append() .pop() .insert()", ".sort() .reverse() .copy()", "sorted() len() min() max()"], note: "Most versatile structure. O(1) append, O(n) insert at index." },
    { label: '{"a":1}', pyType: "dict", c: T.orange, icon: "🗂️", props: { mutable: "True", "ordered (3.7+)": "True", keys_unique: "True" }, convs: { keys: "dict_keys view", values: "dict_values view", items: "dict_items view" }, ops: [".get(k, default)", ".update() | merge", ".pop() .setdefault()"], note: "O(1) key lookup. Keys must be hashable (str, int, tuple — not list)." },
    { label: "(1,2,3)", pyType: "tuple", c: T.pink, icon: "📦", props: { immutable: "True", ordered: "True", hashable: "True (if items are)" }, convs: { list: "[1,2,3]", set: "{1,2,3}", str: "str((1,2,3))" }, ops: ["t[0] t[-1] t[1:]", "len() in count() index()", "unpacking: a,b,c = t"], note: "Immutable list. Use as dict keys, for multiple return values, for fixed records." },
    { label: "{1,2,3}", pyType: "set", c: T.teal, icon: "🔵", props: { mutable: "True", unordered: "True", unique_only: "True" }, convs: { list: "[1,2,3]", tuple: "(1,2,3)", frozenset: "frozenset({1,2,3})" }, ops: ["| union & intersect - diff", "^ symmetric_diff", ".add() .discard() .remove()"], note: "O(1) membership test. No duplicates. Unordered — no indexing." },
  ] as const;
  const [sel, setSel] = useState(0);
  const t = TYPES[sel];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Click any value below to explore its type — see properties, operations, and how it converts to other types.</Hint>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {TYPES.map((tp, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding: "6px 12px", borderRadius: 9, fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${sel === i ? tp.c : "rgba(255,255,255,.08)"}`, background: sel === i ? `${tp.c}15` : "rgba(255,255,255,.02)", color: sel === i ? tp.c : T.grey, transition: "all .18s", fontWeight: sel === i ? 700 : 400 }}>{tp.label}</button>
        ))}
      </div>
      <div key={sel} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "popIn .22s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ border: `1px solid ${t.c}44`, borderRadius: 12, padding: "14px", background: `${t.c}08` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 26 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: t.c, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t.pyType}</div>
                <div style={{ fontSize: 10, color: T.grey, lineHeight: 1.4, fontFamily: "'Onest',sans-serif" }}>{t.note}</div>
              </div>
            </div>
            <PyBlock code={`x = ${t.label}\ntype(x)   # <class '${t.pyType}'>\nprint(x)  # ${String(Object.values(t.props)[0] ?? t.label)}`} />
          </div>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 10, padding: "12px" }}>
            <SLabel c={t.c}>PROPERTIES</SLabel>
            {Object.entries(t.props).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${T.slate}33`, gap: 8 }}>
                <span style={{ fontSize: 10, color: T.grey, fontFamily: "'JetBrains Mono',monospace" }}>{k}</span>
                <span style={{ fontSize: 10, color: T.white, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 10, padding: "12px" }}>
            <SLabel c={T.green}>TYPE CONVERSIONS</SLabel>
            {Object.entries(t.convs).map(([to, result]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>{t.pyType} → {to}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(4,9,20,.7)", borderRadius: 6, padding: "5px 8px" }}>
                  <code style={{ fontSize: 10, color: t.c, fontFamily: "'JetBrains Mono',monospace" }}>{t.label}</code>
                  <span style={{ fontSize: 10, color: T.greyDark }}>→</span>
                  <code style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: (result as string).includes("Error") ? T.red : T.green, fontWeight: 700 }}>{result as string}</code>
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 10, padding: "12px" }}>
            <SLabel c={T.purple}>COMMON OPERATIONS</SLabel>
            {t.ops.map((op, i) => (
              <div key={i} style={{ display: "flex", gap: 7, padding: "4px 0" }}>
                <span style={{ color: T.purple, fontSize: 10, flexShrink: 0 }}>▸</span>
                <code style={{ fontSize: 10, color: T.greyLight, fontFamily: "'JetBrains Mono',monospace" }}>{op}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FStringBuilder ───────────────────────────────────────────────────────────
function FStringBuilder() {
  const [name, setName] = useState("Amara");
  const [salary, setSalary] = useState(85000);
  const [score, setScore] = useState(92.5);
  const [dept, setDept] = useState("Engineering");
  const TEMPLATES = [
    { label: "Basic", code: (n: string) => `f"Hello, {${n}}!"`, result: (n: string) => `Hello, ${n}!` },
    { label: "Number format", code: (_n: string, s: number) => `f"Salary: {${s}:,}"`, result: (_n: string, s: number) => `Salary: ${s.toLocaleString()}` },
    { label: "Float precision", code: (_n: string, _s: number, sc: number) => `f"Score: {${sc}:.1f}%"`, result: (_n: string, _s: number, sc: number) => `Score: ${sc.toFixed(1)}%` },
    { label: "Padding", code: (n: string) => `f"{${n}:<15} |done|"`, result: (n: string) => `${n.padEnd(15)} |done|` },
    { label: "Expression", code: (_n: string, s: number) => `f"Tax: {${s}*0.15:,.0f}"`, result: (_n: string, s: number) => `Tax: ${Math.round(s * 0.15).toLocaleString()}` },
    { label: "Conditional", code: (n: string, s: number) => `f"{${n}} is {'senior' if ${s}>80000 else 'junior'}"`, result: (n: string, s: number) => `${n} is ${s > 80000 ? "senior" : "junior"}` },
    { label: "Multi-line", code: (n: string, s: number, _sc: number, d: string) => `f"""\nName:  {${n}}\nDept:  {${d}}\nSal:   {${s}:,}\n"""`, result: (n: string, s: number, _sc: number, d: string) => `\nName:  ${n}\nDept:  ${d}\nSal:   ${s.toLocaleString()}\n` },
  ];
  const [sel, setSel] = useState(0);
  let result = "";
  if (sel === 0) result = `Hello, ${name}!`;
  else if (sel === 1) result = `Salary: ${salary.toLocaleString()}`;
  else if (sel === 2) result = `Score: ${score.toFixed(1)}%`;
  else if (sel === 3) result = `${name.padEnd(15)} |done|`;
  else if (sel === 4) result = `Tax: ${Math.round(salary * 0.15).toLocaleString()}`;
  else if (sel === 5) result = `${name} is ${salary > 80000 ? "senior" : "junior"}`;
  else result = `\nName:  ${name}\nDept:  ${dept}\nSal:   ${salary.toLocaleString()}\n`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Edit the variables on the left. Choose an f-string template on the right. The output updates as you type.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SLabel c={T.cyan}>VARIABLES</SLabel>
          {([
            { k: "name", v: name, set: setName, type: "text", c: T.green },
            { k: "salary", v: salary, set: (e: string) => setSalary(Number(e)), type: "number", c: T.blue },
            { k: "score", v: score, set: (e: string) => setScore(Number(e)), type: "number", step: 0.1, c: T.orange },
            { k: "dept", v: dept, set: setDept, type: "text", c: T.purple },
          ] as any[]).map((f) => (
            <div key={f.k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <code style={{ fontSize: 10, color: f.c, fontFamily: "'JetBrains Mono',monospace", minWidth: 52 }}>{f.k}</code>
              <span style={{ color: T.greyDark, fontSize: 12 }}>=</span>
              <input value={f.v} onChange={(e) => f.set(e.target.value)} type={f.type} step={f.step} style={{ flex: 1, padding: "5px 9px", borderRadius: 7, border: `1px solid ${f.c}44`, background: T.bg, color: f.c, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SLabel c={T.cyan}>TEMPLATE</SLabel>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {TEMPLATES.map((tmpl, i) => (
              <button key={i} onClick={() => setSel(i)} style={{ padding: "4px 9px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${sel === i ? T.cyan : "rgba(255,255,255,.08)"}`, background: sel === i ? "rgba(34,211,238,.12)" : "transparent", color: sel === i ? T.cyan : T.grey, fontWeight: sel === i ? 700 : 400 }}>{tmpl.label}</button>
            ))}
          </div>
          <PyBlock code={TEMPLATES[sel].code(name, salary, score, dept)} />
          <div style={{ background: "rgba(4,9,20,.9)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 8, color: T.green, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>▶ OUTPUT</div>
            <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.white, lineHeight: 1.6 }}>{result}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MutabilityVisual ─────────────────────────────────────────────────────────
function MutabilityVisual() {
  const [cities, setCities] = useState(["Lagos", "Accra", "Nairobi"]);
  const [newCity, setNewCity] = useState("");
  const [lastOp, setLastOp] = useState<{ op: string; res: string[] } | null>(null);
  const [strAttempt, setStrAttempt] = useState(false);
  const ops = [
    { label: ".append('Cairo')", c: T.green, fn: () => { setCities(p => [...p, "Cairo"]); setLastOp({ op: "append('Cairo')", res: [...cities, "Cairo"] }); } },
    { label: ".pop()", c: T.red, fn: () => { if (cities.length) { const n = [...cities]; n.pop(); setCities(n); setLastOp({ op: "pop()", res: n }); } } },
    { label: ".pop(0)", c: T.orange, fn: () => { if (cities.length) { const n = cities.slice(1); setCities(n); setLastOp({ op: "pop(0)", res: n }); } } },
    { label: ".sort()", c: T.blue, fn: () => { const n = [...cities].sort(); setCities(n); setLastOp({ op: "sort()", res: n }); } },
    { label: ".reverse()", c: T.purple, fn: () => { const n = [...cities].reverse(); setCities(n); setLastOp({ op: "reverse()", res: n }); } },
    { label: ".clear()", c: T.red, fn: () => { setCities([]); setLastOp({ op: "clear()", res: [] }); } },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Lists are mutable — click operations below to modify the list in place. Try to change the string — watch it refuse.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <SLabel c={T.green}>MUTABLE — list</SLabel>
            <Badge c={T.green}>modifies in place</Badge>
          </div>
          <div style={{ background: "rgba(4,9,20,.85)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 10, padding: "10px", minHeight: 120, marginBottom: 8 }}>
            {cities.length === 0 && <div style={{ fontSize: 10, color: T.greyDark, textAlign: "center", padding: "16px", fontFamily: "'JetBrains Mono',monospace" }}>[] — empty list</div>}
            {cities.map((c, i) => (
              <div key={`${c}-${i}`} style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 6px", borderRadius: 6, background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.15)", marginBottom: 3, animation: "slideIn .2s ease" }}>
                <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", minWidth: 20 }}>[{i}]</span>
                <span style={{ fontSize: 11, color: T.green, fontFamily: "'JetBrains Mono',monospace", flex: 1 }}>"{c}"</span>
                <button onClick={() => { setCities(p => p.filter((_, j) => j !== i)); setLastOp({ op: `remove index ${i}`, res: cities.filter((_, j) => j !== i) }); }} style={{ fontSize: 9, color: T.red, background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            <input value={newCity} onChange={e => setNewCity(e.target.value)} onKeyDown={e => e.key === "Enter" && newCity.trim() && (ops[0].fn(), setNewCity(""))} placeholder="New city..." style={{ flex: 1, padding: "5px 9px", borderRadius: 6, border: "1px solid rgba(74,222,128,.3)", background: T.bg, color: T.green, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
            <button onClick={() => { if (newCity.trim()) { setCities(p => [...p, newCity.trim()]); setLastOp({ op: `append("${newCity.trim()}")`, res: [...cities, newCity.trim()] }); setNewCity(""); } }} style={{ padding: "5px 11px", borderRadius: 6, border: "1px solid rgba(74,222,128,.4)", background: "rgba(74,222,128,.1)", color: T.green, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>append()</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {ops.slice(1).map((op, i) => (
              <button key={i} onClick={op.fn} style={{ padding: "5px", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${op.c}44`, background: `${op.c}0c`, color: op.c }}>{op.label}</button>
            ))}
          </div>
          <button onClick={() => { setCities(["Lagos", "Accra", "Nairobi"]); setLastOp(null); }} style={{ marginTop: 6, padding: "4px", width: "100%", borderRadius: 7, fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: T.greyDark }}>↩ Reset</button>
        </div>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <SLabel c={T.red}>IMMUTABLE — str</SLabel>
            <Badge c={T.red}>cannot change in place</Badge>
          </div>
          <div style={{ background: "rgba(4,9,20,.85)", border: "1px solid rgba(248,113,113,.25)", borderRadius: 10, padding: "12px", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
              {"Lagos".split("").map((ch, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 4px", background: "rgba(248,113,113,.12)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 5 }}>
                  <div style={{ fontSize: 13, color: T.red, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{ch}</div>
                  <div style={{ fontSize: 7, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>[{i}]</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStrAttempt(true)} style={{ width: "100%", padding: "6px", borderRadius: 7, border: "1px solid rgba(248,113,113,.4)", background: "rgba(248,113,113,.08)", color: T.red, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>Try: city[0] = &quot;l&quot;</button>
            {strAttempt && (
              <div style={{ marginTop: 8, animation: "popIn .2s ease" }}>
                <OutBlock err>TypeError: &apos;str&apos; object does not support item assignment</OutBlock>
                <div style={{ marginTop: 6, fontSize: 10, color: T.greyLight, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6 }}>
                  To &quot;modify&quot; a string, create a <strong style={{ color: T.green }}>new</strong> one:<br />
                  <code style={{ color: T.cyan }}>city = &quot;l&quot; + city[1:] # &quot;lagos&quot;</code>
                </div>
              </div>
            )}
          </div>
          {lastOp && (
            <div style={{ animation: "popIn .2s ease" }}>
              <SLabel c={T.green}>LAST OPERATION</SLabel>
              <PyBlock code={`cities.${lastOp.op}\n# Result: ${JSON.stringify(lastOp.res)}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ScopeVisual ──────────────────────────────────────────────────────────────
function ScopeVisual() {
  const ZONES = [
    { label: "Built-in (B)", c: T.greyDark, vars: ["len", "print", "range", "type", "int", "str", "list", "dict"], desc: "Always available. Python's built-in namespace." },
    { label: "Global (G)", c: T.blue, vars: ["RATE = 0.15", "employees = [...]", "BASE_SALARY = 50000"], desc: "Module-level variables. Accessible anywhere in the file." },
    { label: "Enclosing (E)", c: T.cyan, vars: ["tax_year = 2024", "region = 'Lagos'"], desc: "Only in nested functions — the outer function's scope." },
    { label: "Local (L)", c: T.green, vars: ["name = 'Amara'", "salary = 85000", "result = None"], desc: "Variables created inside the current function." },
  ];
  const [active, setActive] = useState(3);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Python searches for names in L → E → G → B order (LEGB). Click each scope to see what&apos;s available. The innermost scope wins.</Hint>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[...ZONES].reverse().map((z, i) => {
          const ri = ZONES.length - 1 - i;
          return (
            <div key={z.label} onClick={() => setActive(ri)} style={{ border: `2px solid ${active === ri ? z.c : z.c + "44"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", background: active === ri ? `${z.c}0d` : "transparent", transition: "all .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: z.c, fontFamily: "'JetBrains Mono',monospace" }}>{z.label}</span>
                <span style={{ fontSize: 10, color: T.grey, fontFamily: "'Onest',sans-serif" }}>{z.desc}</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {z.vars.map((v, j) => (
                  <code key={j} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 5, background: `${z.c}18`, color: z.c, fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${z.c}30` }}>{v}</code>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <PyBlock label="LEGB in action" code={`RATE = 0.15  # Global\n\ndef calc_tax(salary):  # salary is Local\n    tax = salary * RATE  # uses Global RATE\n    return tax\n\ndef outer():\n    year = 2024  # Enclosing\n    def inner():\n        print(year)  # finds in Enclosing scope ✓\n    inner()\n\n# global keyword — modify global from inside function:\ncount = 0\ndef increment():\n    global count  # without this, creates local 'count'\n    count += 1`} />
      <Warn>Avoid mutable globals. Passing data through function arguments is cleaner and more testable than relying on global state.</Warn>
    </div>
  );
}

// ─── Module01 ─────────────────────────────────────────────────────────────────
export default function Module01() {
  return (
    <Course
      intro={{
        explain: "In Python, every piece of data is an object — a number, a word, a list, even True or False. Variables are just names that point to those objects. Unlike languages like Java or C, you do not declare a type upfront. Python figures it out at runtime. This means you need to understand what type you are working with to avoid bugs — passing a string where a number is expected will not be caught until the code runs.",
        learn: ["Identify all 9 built-in Python types and when to use each", "Use f-strings to format output clearly with expressions and number formatting", "Understand why some types can be changed in-place (mutable) and others cannot", "Write functions that find variables using Python's scope (LEGB) rules"],
        concepts: ["int and float for numbers; str for text; bool for True/False; None for no value", "list, dict, set, tuple are collections — each with different rules", "Mutable types (list, dict, set) can be modified after creation; immutable ones (str, tuple, int) cannot", "y = x for a list does NOT copy — both names point to the same object in memory"],
        why: "Type confusion causes more beginner bugs than almost anything else. Knowing your types is the foundation every other concept in this course builds on.",
      }}
      c={T.blue}
      steps={[
        { title: "9 types explored", desc: "Python has 9 built-in types you will use constantly. A type defines what kind of data a variable holds and what operations are allowed on it. For example, you can multiply two ints but not two strings. Click each value in the explorer to see its type, properties, how it converts to other types, and the operations it supports.", content: () => <TypeExplorer /> },
        { title: "f-strings builder", desc: "An f-string (formatted string literal) lets you embed Python expressions directly inside a string. You write f\"...\" and put any variable or expression inside curly braces {}. Edit the variables on the left and watch every template update instantly.", content: () => <FStringBuilder /> },
        { title: "Mutable vs immutable", desc: "Mutable means changeable in place — a list can have items added, removed, or reordered after it is created. Immutable means the value cannot be changed — a string cannot have individual characters reassigned.", content: () => <MutabilityVisual /> },
        { title: "LEGB scope", desc: "Scope controls where Python looks for the value of a name. When you write x, Python searches four scopes in order: Local, Enclosing, Global, Built-in. This is the LEGB rule.", content: () => <ScopeVisual /> },
        { title: "Type checking", desc: "Checking types at runtime lets you write defensive code. isinstance() handles inheritance correctly — isinstance(True, int) returns True because bool is a subclass of int.", content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Note c={T.blue}>Python is dynamically typed — variables hold references, not typed containers. Use <code style={{ color: T.cyan }}>type()</code>, <code style={{ color: T.cyan }}>isinstance()</code>, and annotations for clarity.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <PyBlock label="Type checking" code={`x = 42\ntype(x)              # <class 'int'>\ntype(x) == int       # True\n\n# isinstance — preferred, handles subclasses:\nisinstance(x, int)           # True\nisinstance(True, int)        # True (bool IS int)\nisinstance(x, (int, float))  # True — checks multiple\n\n# Type annotations (Python 3.5+):\ndef greet(name: str) -> str:\n    return f"Hello, {name}"\n\n# Use dataclasses for structured data:\nfrom dataclasses import dataclass\n@dataclass\nclass Employee:\n    name: str\n    salary: float\n    active: bool = True`} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <OutBlock label="type() vs isinstance()">{`type(True) == int   → False\ntype(True) == bool  → True\n\nisinstance(True, int)   → True\nisinstance(True, bool)  → True\n\n# bool is a SUBCLASS of int\n# isinstance handles this correctly\n# type() checks exact type only`}</OutBlock>
                <Tip icon="📏" title="WHEN TO USE EACH" c={T.blue}>Use <strong>isinstance()</strong> in production code — it handles inheritance. Use <strong>type(x) == T</strong> only when you explicitly want to exclude subclasses.</Tip>
              </div>
            </div>
          </div>
        )},
        { title: "Common mistakes", content: () => <CM mistakes={[
          { title: "Using == None instead of is None", wrong: `if result == None:\n    print("empty")`, right: `if result is None:\n    print("empty")`, why: "None is a singleton. 'is None' checks identity (same object). '== None' calls __eq__ which can be overridden. PEP 8 mandates 'is None'." },
          { title: "Mutable default argument", wrong: `def add_tag(item, tags=[]):\n    tags.append(item)\n    return tags\n\nadd_tag("a")  # ['a']\nadd_tag("b")  # ['a', 'b'] ← shared!`, right: `def add_tag(item, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(item)\n    return tags`, why: "Default values are created ONCE when the function is defined, not per call. Mutable defaults (lists, dicts) persist between calls. Use None and create inside." },
          { title: "Modifying a list while iterating", wrong: `for item in my_list:\n    if condition(item):\n        my_list.remove(item)  # skips items!`, right: `my_list = [x for x in my_list\n           if not condition(x)]\n# or:\nfor item in my_list[:]:  # iterate a copy\n    if condition(item):\n        my_list.remove(item)`, why: "Removing items shifts indices mid-iteration, causing items to be skipped. Use a list comprehension to create a filtered copy, or iterate over a copy with my_list[:]." },
          { title: "Integer division vs float division", wrong: `ratio = 7 / 2   # 3.5 (Python 3)\n# Expected 3? Use // instead\nwrong = 7 // 2  # 3 — this is floor division`, right: `# Python 3: / always returns float\n7 / 2    # 3.5\n7 // 2   # 3  (floor division)\n7 % 2    # 1  (remainder)\ndivmod(7, 2)  # (3, 1)`, why: "Python 3 made / always return float. Use // for integer division and % for the remainder. In Python 2, 7/2 returned 3 — common source of bugs when migrating." },
        ]} /> },
        { title: "Quiz", content: () => <Quiz c={T.blue} questions={[
          { question: "What does type(True) return?", options: ["<class 'bool'>", "<class 'int'>", "<class 'boolean'>", "True"], correct: 0, explanation: "type(True) returns <class 'bool'>. But isinstance(True, int) is also True because bool is a subclass of int in Python." },
          { type: "output", question: "What does this print?", code: `print(True + True + False)`, options: ["Error", "True", "2", "TrueTrue"], correct: 2, explanation: "bool is a subclass of int. True==1, False==0. So True + True + False = 1 + 1 + 0 = 2." },
          { type: "bug", question: "What's wrong?", code: `if result == None:\n    print("missing")`, options: ["Should be 'result is None'", "== is fine here", "None should be 'null'", "Missing parentheses"], correct: 0, explanation: "Use 'is None' not '== None'. PEP 8 mandates this. 'is' checks identity (same object in memory) — since None is a singleton, 'is None' is both correct and faster." },
          { question: "What does 'Lagos'[-1] return?", options: ["Error", "'L'", "'s'", "5"], correct: 2, explanation: "Negative indexing counts from the end. [-1] is the last character 's'. [-2] is 'o'. Python strings support negative indexing just like lists." },
          { type: "output", question: "What does this return?", code: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)`, options: ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "[4]"], correct: 1, explanation: "y = x doesn't copy the list — both y and x point to the SAME list object in memory. Appending to y also modifies x. Use x.copy() or list(x) or x[:] to get an independent copy." },
        ]} /> },
      ]}
    />
  );
}
