"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Tip, CM, Quiz, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1, name: "Amara Osei",     dept: "Engineering", salary: 85000 },
  { id: 2, name: "Bola Adeyemi",   dept: "Analytics",   salary: 72000 },
  { id: 3, name: "Chidi Nwosu",    dept: "Engineering", salary: 91000 },
  { id: 4, name: "Dami Okafor",    dept: "Product",     salary: 68000 },
  { id: 5, name: "Efe Obi",        dept: "Analytics",   salary: 77000 },
  { id: 6, name: "Funke Adesanya", dept: "Engineering", salary: 94000 },
  { id: 7, name: "Grace Mensah",   dept: "Product",     salary: 65000 },
];

function FunctionPipeline() {
  const [salary, setSalary] = useState(85000);
  const classify = (s: number) =>
    s >= 90000 ? "Senior" : s >= 75000 ? "Mid-level" : s >= 65000 ? "Junior" : "Trainee";
  const result = classify(salary);
  const resC: Record<string, string> = { Senior: T.green, "Mid-level": T.blue, Junior: T.yellow, Trainee: T.orange }[result] ? { Senior: T.green, "Mid-level": T.blue, Junior: T.yellow, Trainee: T.orange } : { Senior: T.green };
  const rc = ({ Senior: T.green, "Mid-level": T.blue, Junior: T.yellow, Trainee: T.orange } as Record<string, string>)[result];
  const conditions = [
    { cond: "salary >= 90000", pass: salary >= 90000, ret: "Senior", c: T.green },
    { cond: "salary >= 75000", pass: salary >= 75000 && salary < 90000, ret: "Mid-level", c: T.blue },
    { cond: "salary >= 65000", pass: salary >= 65000 && salary < 75000, ret: "Junior", c: T.yellow },
    { cond: "else",            pass: salary < 65000,                     ret: "Trainee", c: T.orange },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="🎛️">Drag the salary slider. The trace shows each condition evaluated top to bottom — the first True wins.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PyBlock code={`def classify_salary(salary):\n    if salary >= 90000:\n        return "Senior"\n    elif salary >= 75000:\n        return "Mid-level"\n    elif salary >= 65000:\n        return "Junior"\n    else:\n        return "Trainee"`} />
          <div>
            <SL c={T.purple}>Input: salary</SL>
            <input type="range" min={40000} max={105000} step={1000} value={salary} onChange={e => setSalary(Number(e.target.value))} style={{ width: "100%", accentColor: T.purple, marginBottom: 4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyDark }}>
              <span>40k</span>
              <span style={{ color: T.purple, fontWeight: 700 }}>{salary.toLocaleString()}</span>
              <span>105k</span>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "12px", border: `1px solid ${rc}44`, borderRadius: 10, background: `${rc}09` }}>
            <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>classify_salary({salary.toLocaleString()}) →</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: rc, fontFamily: "'Bricolage Grotesque',sans-serif" }}>"{result}"</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SL c={T.purple}>CONDITION TRACE</SL>
          {conditions.map((c, i) => {
            const tested = i === 0 || conditions.slice(0, i).every(x => !x.pass);
            return (
              <div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", borderRadius: 7, border: `1px solid ${c.pass ? c.c : T.slate}`, background: c.pass ? `${c.c}12` : "rgba(255,255,255,.02)", opacity: !tested && !c.pass ? 0.25 : 1, transition: "all .25s" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.pass ? c.c : tested ? T.red : T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>{c.pass ? "✓" : tested ? "✗" : "·"}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyLight, flex: 1 }}>{c.cond}</span>
                {c.pass && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: c.c, fontWeight: 700 }}>→ "{c.ret}"</span>}
              </div>
            );
          })}
          <SL c={T.greyDark} style={{ marginTop: 8 }}>APPLY TO ALL EMPLOYEES</SL>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 8, overflow: "hidden" }}>
            {DF_EMPLOYEES.map((emp, i) => {
              const r = classify(emp.salary);
              const rColor = ({ Senior: T.green, "Mid-level": T.blue, Junior: T.yellow, Trainee: T.orange } as Record<string, string>)[r];
              return (
                <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", padding: "5px 10px", borderBottom: i < DF_EMPLOYEES.length - 1 ? `1px solid ${T.slate}33` : "none" }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyLight }}>{emp.name}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.greyDark }}>{emp.salary.toLocaleString()}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: rColor, fontWeight: 700 }}>{r}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArgsKwargsVisual() {
  const [mode, setMode] = useState("positional");
  const MODES: Record<string, { label: string; code: string; result: string }> = {
    positional: {
      label: "Positional",
      code: `def greet(name, greeting, punct):\n    return f"{greeting}, {name}{punct}"\n\ngreet("Amara", "Hello", "!")  # positional\n# "Hello, Amara!"\n\ngreet("Hello", "Amara", "!")  # wrong order!\n# "Amara, Hello!" ← swapped meaning`,
      result: '"Hello, Amara!"',
    },
    keyword: {
      label: "Keyword",
      code: `def greet(name, greeting="Hello", punct="!"):\n    return f"{greeting}, {name}{punct}"\n\ngreet("Amara")                    # "Hello, Amara!"\ngreet("Amara", greeting="Hey")    # "Hey, Amara!"\ngreet("Amara", punct=".")          # "Hello, Amara."\ngreet(name="Amara", greeting="Hi") # explicit`,
      result: '"Hello, Amara!" or customised',
    },
    args: {
      label: "*args",
      code: `def total(*amounts):\n    return sum(amounts)\n\ntotal(100)                 # 100\ntotal(100, 200)            # 300\ntotal(100, 200, 300, 400)  # 1000\n\n# *args captures as a tuple:\ndef show(*args):\n    print(type(args))  # <class 'tuple'>\n    print(args)        # (100, 200, 300)`,
      result: "Accepts any number of positional args",
    },
    kwargs: {
      label: "**kwargs",
      code: `def create_employee(**details):\n    return details\n\ncreate_employee(name="Amara", dept="Eng", salary=85000)\n# {"name":"Amara","dept":"Eng","salary":85000}\n\n# **kwargs captures as a dict:\ndef log(**kwargs):\n    for k, v in kwargs.items():\n        print(f"{k}: {v}")\n\n# Common: pass config dicts to functions:\nconfig = {"threshold": 0.5, "max_iter": 100}\nrun_model(**config)  # unpacks to keyword args`,
      result: "Accepts any keyword arguments as a dict",
    },
    combined: {
      label: "All together",
      code: `def pipeline(data, method="mean",\n             *transforms, verbose=False,\n             **options):\n    pass\n\n# Full signature order rule:\n# def f(pos, pos_default=val, *args, kw_only, **kwargs)\n\n# Practical example:\ndef read_data(path, encoding="utf-8", *,\n             na_values=None, parse_dates=False):\n    # * forces na_values and parse_dates to be keyword-only\n    pass\n\nread_data("file.csv", parse_dates=True)`,
      result: "Order: positional → default → *args → kwonly → **kwargs",
    },
  };
  const m = MODES[mode];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint>Explore how Python handles different argument types. The order of the signatures matters.</Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {Object.entries(MODES).map(([k, val]) => (
          <button key={k} onClick={() => setMode(k)} style={{ padding: "5px 11px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${mode === k ? T.purple : "rgba(255,255,255,.08)"}`, background: mode === k ? "rgba(192,132,252,.12)" : "transparent", color: mode === k ? T.purple : T.grey, fontWeight: mode === k ? 700 : 400 }}>
            {val.label}
          </button>
        ))}
      </div>
      <PyBlock code={m.code} label="Python — function arguments" />
      <div style={{ background: `${T.purple}09`, border: `1px solid ${T.purple}25`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.greyLight }}>
        <strong style={{ color: T.purple }}>{m.label}: </strong>{m.result}
      </div>
    </div>
  );
}

export default function Module04() {
  return (
    <Course
      intro={{
        explain: "A function is a named, reusable block of code that takes inputs (parameters), does something, and returns an output. You define it once and call it as many times as you need. Good functions do one thing clearly and can be tested in isolation. In Python, functions are first-class objects — you can pass them as arguments, return them from other functions, and store them in variables, which enables powerful patterns like closures and decorators.",
        learn: [
          "Define functions with positional, default, *args, and **kwargs arguments",
          "Understand the LEGB rule — how Python finds the value of any variable name",
          "Write closures that remember variables from their surrounding scope",
          "Use and understand decorators, which wrap a function to add behaviour without changing its code",
        ],
        concepts: [
          "Default arguments are evaluated ONCE at function definition — use None as default for mutable types",
          "*args captures extra positional arguments as a tuple; **kwargs captures keyword arguments as a dict",
          "A closure is a function that remembers variables from the scope where it was defined",
          "@decorator is shorthand for: my_function = decorator(my_function)",
        ],
        why: "Every real Python project is built from functions. Writing clean, well-scoped functions is the single biggest factor in whether code is readable, testable, and maintainable.",
      }}
      c={T.purple}
      steps={[
        {
          title: "Function tracer",
          desc: "A function is defined with the def keyword, a name, parentheses containing parameters, and a colon. The body is indented. The return statement sends a value back to the caller. If a function has no return statement it returns None. When you call classify_salary(85000), Python executes the function body with salary = 85000, evaluates each condition from top to bottom, and returns the first matching result. Drag the slider to see exactly which condition fires for each salary value.",
          content: () => <FunctionPipeline />,
        },
        {
          title: "Args & kwargs",
          desc: "Python functions support four kinds of parameters. Positional arguments are matched by order. Keyword arguments have default values and can be passed by name. *args collects any extra positional arguments into a tuple — useful when you do not know how many will be passed. **kwargs collects any extra keyword arguments into a dict. The order in a function signature must always be: positional, defaults, *args, keyword-only, **kwargs. Click each mode to see the syntax and behaviour of each.",
          content: () => <ArgsKwargsVisual />,
        },
        {
          title: "Closures & decorators",
          desc: "A closure is a function defined inside another function that remembers variables from its enclosing scope even after the outer function has finished running. This lets you create factory functions that produce customised functions. A decorator is a closure pattern specifically for wrapping other functions — it takes a function as input and returns a new function that adds behaviour (logging, timing, caching) before or after the original runs. The @syntax is shorthand: @timer above a function is identical to writing function = timer(function).",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.purple}>A closure is a function that remembers values from its enclosing scope. Decorators are closures that wrap other functions to add behaviour.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SL>CLOSURE</SL>
                  <PyBlock code={`def make_multiplier(factor):\n    # 'factor' is captured in closure:\n    def multiply(x):\n        return x * factor\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\n\ndouble(5)  # 10\ntriple(5)  # 15\ndouble(salary)  # salary * 2`} />
                </div>
                <div>
                  <SL>DECORATOR</SL>
                  <PyBlock code={`import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"{func.__name__} took {end-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef process_employees(df):\n    return df.groupby("dept")["salary"].mean()\n\n# @timer is syntactic sugar for:\n# process_employees = timer(process_employees)`} />
                </div>
              </div>
              <Tip icon="🏗️" title="COMMON DECORATORS IN DATA WORK" c={T.purple}>
                <code>@functools.lru_cache</code> — cache expensive computations · <code>@staticmethod</code> — utility methods on classes · <code>@property</code> — computed attributes · <code>@dataclass</code> — auto-generate __init__, __repr__
              </Tip>
            </div>
          ),
        },
        {
          title: "Common mistakes",
          content: () => (
            <CM mistakes={[
              {
                title: "Mutable default argument",
                wrong: `def add_city(city, result=[]):\n    result.append(city)\n    return result\n\nadd_city("Lagos")   # ['Lagos']\nadd_city("Accra")   # ['Lagos','Accra'] ← SHARED!`,
                right: `def add_city(city, result=None):\n    if result is None:\n        result = []\n    result.append(city)\n    return result`,
                why: "Default values are evaluated ONCE when def is executed. Lists, dicts, and sets as defaults are shared across all calls. Use None and create the mutable inside the function body.",
              },
              {
                title: "Forgetting to return a value",
                wrong: `def add_salary(emp, raise_pct):\n    emp["salary"] *= (1 + raise_pct)\n    # forgot return!\n\nresult = add_salary(emp, 0.1)\nprint(result)  # None`,
                right: `def add_salary(emp, raise_pct):\n    emp["salary"] *= (1 + raise_pct)\n    return emp  # ← explicit return`,
                why: "Functions without return statements return None. This is a common source of bugs — the caller expects the modified value but gets None. Always be explicit about what your function returns.",
              },
            ]} />
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.purple} questions={[
              {
                type: "output",
                question: "What does this print?",
                code: `def f(a, b=2, *args, **kwargs):\n    print(a, b, args, kwargs)\n\nf(1, 3, 4, 5, x=6)`,
                options: ["1 2 (3,4,5) {'x':6}", "1 3 (4,5) {'x':6}", "Error", "1 3 4 5 6"],
                correct: 1,
                explanation: "a=1 (positional), b=3 (overrides default of 2), args=(4,5) (remaining positional), kwargs={'x':6} (keyword args). The default for b is overridden by the value 3.",
              },
              {
                type: "bug",
                question: "What's the issue?",
                code: `def get_tags(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\nprint(get_tags("python"))  # ['python']\nprint(get_tags("data"))    # ???`,
                options: ["tags=[] should be tags=list()", "Default mutable argument — both calls share the same list", ".append() returns None", "Missing return tags"],
                correct: 1,
                explanation: "tags=[] is created ONCE when def runs. Both calls share the same list, so the second call returns ['python', 'data']. Use tags=None and create tags=[] inside the function.",
              },
              {
                question: "What does @timer above a function definition do?",
                options: ["Imports timer module", "Equivalent to: function = timer(function)", "Makes the function run in a timer loop", "Adds timing to Python's scheduler"],
                correct: 1,
                explanation: "@timer is syntactic sugar (syntax shortcut) for: function = timer(function). The decorator is called with the function as its argument, and the returned value replaces the original function.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
