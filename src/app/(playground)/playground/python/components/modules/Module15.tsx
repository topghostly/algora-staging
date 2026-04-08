"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, OutBlock, Note, Hint, Warn, Quiz, Course, SLabel as SL, Badge } from "../python-shared";

function TryExceptVisual() {
  const [scenario, setScenario] = useState("div");
  const [input, setInput] = useState("0");

  type ScenarioFn = (v: string) => number | string;
  const SCENARIOS: Record<string, { label: string; fn: ScenarioFn; code: string }> = {
    div: {
      label: "Division by zero",
      fn: v => {
        const n = Number(v);
        if (n === 0) throw new Error("ZeroDivisionError: division by zero");
        return 100 / n;
      },
      code: `def safe_divide(a, b):\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        print("Cannot divide by zero!")\n        return None\n\nsafe_divide(100, 5)   # 20.0\nsafe_divide(100, 0)   # Cannot divide by zero! → None`,
    },
    key: {
      label: "Missing dict key",
      fn: v => {
        const d: Record<string, number> = { Amara: 85000, Bola: 72000, Chidi: 91000 };
        if (!(v in d)) throw new Error(`KeyError: '${v}'`);
        return d[v];
      },
      code: `def get_salary(name):\n    try:\n        return salaries[name]\n    except KeyError:\n        return f"Employee '{name}' not found"\n\nget_salary("Amara")   # 85000\nget_salary("Zara")    # "Employee 'Zara' not found"`,
    },
    type: {
      label: "Type conversion",
      fn: v => {
        const n = Number(v);
        if (v === "") throw new Error("ValueError: empty string");
        if (isNaN(n)) throw new Error(`ValueError: could not convert '${v}' to float`);
        return n;
      },
      code: `def parse_salary(raw):\n    try:\n        return float(raw)\n    except ValueError as e:\n        print(f"Bad data: {e}")\n        return None\n    except TypeError:\n        print("Expected a string, got None")\n        return None\n\nparse_salary("85000")  # 85000.0\nparse_salary("N/A")    # Bad data: ... → None`,
    },
  };

  const sc = SCENARIOS[scenario];
  let result: number | string | null = null, err: string | null = null;
  try { result = sc.fn(input); } catch (e: unknown) { err = (e as Error).message; }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Select an error type, type a value, and watch whether it succeeds or triggers the except block.</Hint>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {Object.entries(SCENARIOS).map(([k, v]) => (
          <button key={k} onClick={() => setScenario(k)} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${scenario === k ? T.red : "rgba(255,255,255,.08)"}`, background: scenario === k ? "rgba(248,113,113,.12)" : "rgba(255,255,255,.02)", color: scenario === k ? T.red : T.grey, fontWeight: scenario === k ? 700 : 400 }}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PyBlock code={sc.code} label="Python — try/except" />
          <div>
            <SL>TEST INPUT</SL>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a value..." style={{ width: "100%", padding: "7px 12px", borderRadius: 8, border: `1px solid ${err ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.3)"}`, background: T.bg, color: err ? T.red : T.green, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
          </div>
          {err
            ? <OutBlock err>{err}{"\n\n"}→ except block runs → returns None</OutBlock>
            : <OutBlock label="try block succeeds">{`result = ${JSON.stringify(result)}`}</OutBlock>
          }
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ border: `1px solid ${T.slate}`, borderRadius: 10, padding: "12px", background: T.surface }}>
            <SL c={T.red}>EXCEPTION HIERARCHY</SL>
            <PyBlock code={`# Most specific first:\ntry:\n    do_something()\nexcept FileNotFoundError:  # specific\n    print("File missing")\nexcept IOError:            # broader\n    print("IO problem")\nexcept Exception as e:     # catch-all\n    print(f"Unexpected: {e}")\nelse:\n    print("No exception raised")\nfinally:\n    print("Always runs — cleanup here")`} />
          </div>
          <Warn>Never use bare <code>except:</code> — it catches everything including KeyboardInterrupt and SystemExit. Always catch specific exceptions.</Warn>
        </div>
      </div>
    </div>
  );
}

export default function Module15() {
  return (
    <Course
      intro={{
        explain: "In Python, when something goes wrong at runtime — a file does not exist, a value cannot be converted, a key is missing from a dict — Python raises an exception and your program stops unless you handle it. try/except lets you intercept that exception and decide what to do: log it, return a default value, skip the row, or raise a clearer error. This is what separates a script that works once from a pipeline that runs reliably every night.",
        learn: [
          "Write try/except blocks that catch specific exception types rather than everything",
          "Use else (runs if no error occurred) and finally (always runs) in the right places",
          "Create custom exception classes that describe exactly what went wrong in your system",
          "Use context managers — the with statement — to safely open files and database connections",
        ],
        concepts: [
          "Never use bare except: — it catches everything including Ctrl+C and system exits; always name the exception",
          "The else block runs only if the try block completed with no exception — good for the success path",
          "finally always runs even if there is a return statement inside the try block — use it for cleanup",
          "with open('file') as f: guarantees the file is closed even if an error occurs inside the block",
        ],
        why: "Real pipelines encounter unexpected inputs constantly — missing files, API timeouts, malformed rows. Code without error handling crashes and leaves data in an inconsistent state. Robust error handling is what you need to sleep well when pipelines run unattended.",
      }}
      c={T.red}
      steps={[
        {
          title: "try/except explorer",
          desc: "A try/except block has a clear structure. Python attempts to run the code inside try. If a specific exception is raised, execution jumps immediately to the matching except block — the rest of the try block is skipped. You name the exception type you want to catch: except ZeroDivisionError, except KeyError, except ValueError. Catching only the exception you expect means unexpected errors still propagate and alert you — they are not silently swallowed. Select a scenario, type a value, and watch whether the try or except block runs.",
          content: () => <TryExceptVisual />,
        },
        {
          title: "Common exceptions",
          desc: "Python has a hierarchy of built-in exceptions. Knowing the most common ones by name means you know exactly which except clause to write. KeyError: a dict key does not exist. IndexError: a list index is out of range. ValueError: the right type but wrong value, like int('N/A'). TypeError: the wrong type entirely, like adding a string to an int. AttributeError: the object does not have that method, like calling .strip() on None. FileNotFoundError: the file path does not exist. Each has a specific, informative fix.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.red}>Knowing which exception to expect makes code more robust. These are the ones you'll see most in data work.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { name: "KeyError",            when: "Dict key doesn't exist",           ex: `d["missing"]`,     fix: `.get("key",default)` },
                  { name: "IndexError",           when: "List index out of range",          ex: `lst[999]`,         fix: `lst[-1] or len check` },
                  { name: "ValueError",           when: "Wrong type of value",              ex: `int("N/A")`,       fix: `try/except or pd.to_numeric(errors='coerce')` },
                  { name: "TypeError",            when: "Wrong type for operation",         ex: `"age" + 5`,        fix: `str(5) or type check` },
                  { name: "AttributeError",       when: "Object doesn't have that attr",    ex: `None.strip()`,     fix: `Check for None first` },
                  { name: "FileNotFoundError",    when: "File path doesn't exist",          ex: `open("missing.csv")`, fix: `os.path.exists() first` },
                  { name: "ZeroDivisionError",    when: "Dividing by zero",                 ex: `total / count`,    fix: `if count != 0: ...` },
                  { name: "ImportError",          when: "Module not installed/misspelled",  ex: `import panads`,    fix: `pip install pandas` },
                ].map(e => (
                  <div key={e.name} style={{ border: `1px solid ${T.slate}`, borderRadius: 8, padding: "9px 12px", background: T.surface }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.red, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>{e.name}</div>
                    <div style={{ fontSize: 10, color: T.grey, marginBottom: 3 }}>{e.when}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <code style={{ fontSize: 9, color: T.orange, fontFamily: "'JetBrains Mono',monospace", flex: 1 }}>❌ {e.ex}</code>
                      <code style={{ fontSize: 9, color: T.green, fontFamily: "'JetBrains Mono',monospace", flex: 1 }}>✓ {e.fix}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Custom exceptions & context managers",
          desc: "Custom exceptions make your errors self-documenting. Instead of raising ValueError('bad data') you raise SalaryOutOfRangeError(salary) — the name and the attached data tell the reader exactly what failed. Create one by subclassing Exception. Context managers, written with the with statement, are the correct way to handle resources that must be cleaned up — files, database connections, locks. The with statement guarantees the cleanup code runs even if an error occurs inside the block, which is something a bare try/finally achieves but with more code.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.red}>Custom exceptions make errors descriptive. Context managers (with statement) ensure cleanup always runs — files close, connections close.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SL>CUSTOM EXCEPTIONS</SL>
                  <PyBlock code={`class DataValidationError(Exception):\n    """Raised when data fails validation."""\n    pass\n\nclass SalaryOutOfRangeError(DataValidationError):\n    def __init__(self, salary, min_val=0, max_val=500000):\n        self.salary = salary\n        msg = f"Salary {salary} not in [{min_val},{max_val}]"\n        super().__init__(msg)\n\ndef validate_salary(salary):\n    if not isinstance(salary, (int, float)):\n        raise TypeError(f"Expected number, got {type(salary)}")\n    if salary < 0 or salary > 500000:\n        raise SalaryOutOfRangeError(salary)\n    return salary\n\ntry:\n    validate_salary(-5000)\nexcept SalaryOutOfRangeError as e:\n    print(f"Validation failed: {e}")`} />
                </div>
                <div>
                  <SL>CONTEXT MANAGERS — with</SL>
                  <PyBlock code={`# File handling — always closes even on error:\nwith open("data.csv", "r") as f:\n    content = f.read()\n# file is guaranteed closed here\n\n# Database connection:\nimport sqlite3\nwith sqlite3.connect("db.sqlite") as conn:\n    df = pd.read_sql("SELECT * FROM emp", conn)\n# connection closed automatically\n\n# Multiple context managers:\nwith open("input.csv") as fin, \\\n     open("output.csv", "w") as fout:\n    fout.write(fin.read())\n\n# Why it matters:\nf = open("data.csv")  # BAD — won't close on error\nf.read()\nf.close()  # never reached if error above!`} />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.red} questions={[
              {
                type: "bug",
                question: "What's wrong with this exception handler?",
                code: `try:\n    result = risky_function()\nexcept:\n    print("Something went wrong")`,
                options: ["except needs parentheses", "Bare except catches EVERYTHING including SystemExit — use except Exception", "Missing finally block", "Should use if/else instead"],
                correct: 1,
                explanation: "Bare except: catches all exceptions including SystemExit, KeyboardInterrupt, and GeneratorExit — things Python uses internally. Always catch specific exceptions or at minimum use 'except Exception' which excludes system exceptions.",
              },
              {
                question: "What does the 'finally' block do in try/except/finally?",
                options: ["Only runs if no exception occurred", "Only runs if an exception occurred", "Always runs — even if there's a return or exception", "Catches any remaining exceptions"],
                correct: 2,
                explanation: "finally always executes — whether the try block succeeds, fails, or even has a return statement. It's for cleanup: closing files, releasing locks, closing database connections.",
              },
              {
                type: "output",
                question: "What does this print?",
                code: `try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("caught")\nelse:\n    print("no error")\nfinally:\n    print("done")`,
                options: ["caught, done", "caught", "no error, done", "done"],
                correct: 0,
                explanation: "ZeroDivisionError is raised → caught by except → prints 'caught'. The else block only runs if NO exception occurred. finally always runs → prints 'done'. Output: caught\\ndone.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
