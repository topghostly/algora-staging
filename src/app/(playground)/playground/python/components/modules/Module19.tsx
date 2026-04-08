"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Quiz, Course } from "../python-shared";

function PipelineVisual() {
  const [step, setStep] = useState(0);
  const STEPS = [
    {
      label: "Load", icon: "📂", desc: "Read data into a DataFrame",
      code: `import pandas as pd\nimport numpy as np\n\n# Load from CSV:\ndf = pd.read_csv("employees.csv",\n    parse_dates=["hired"],\n    na_values=["N/A","null",""]\n)\nprint(f"Loaded: {df.shape}")\ndf.head()`,
    },
    {
      label: "Inspect", icon: "🔍", desc: "Understand what you have",
      code: `# Shape, types, nulls:\ndf.info()\ndf.describe()\ndf.isnull().sum()\n\n# Unique values per column:\nfor col in df.columns:\n    nunique = df[col].nunique()\n    nulls = df[col].isnull().sum()\n    print(f"{col}: {nunique} unique, {nulls} nulls")\n\n# Spot numeric columns stored as strings:\ndf.dtypes[df.dtypes == "object"]`,
    },
    {
      label: "Clean", icon: "🧹", desc: "Fix types, nulls, duplicates",
      code: `# 1. Fix dtypes:\ndf["salary"] = pd.to_numeric(df["salary"],\n    errors="coerce")\n# hired already parsed_dates in read_csv\n\n# 2. Handle nulls:\ndf["score"].fillna(df["score"].median(),\n    inplace=True)\ndf.dropna(subset=["salary"], inplace=True)\n\n# 3. Remove duplicates:\ndf.drop_duplicates(subset=["id"],\n    inplace=True)\n\n# 4. Validate:\nassert df["salary"].min() > 0\nassert df.duplicated().sum() == 0`,
    },
    {
      label: "Transform", icon: "⚙️", desc: "Derive new columns",
      code: `# Tenure in years:\ndf["tenure_yrs"] = (\n    (pd.Timestamp.now() - df["hired"])\n    .dt.days / 365.25\n).round(1)\n\n# Salary tier:\ndf["tier"] = pd.cut(\n    df["salary"],\n    bins=[0, 70000, 82000, float("inf")],\n    labels=["Junior", "Mid", "Senior"]\n)\n\n# Group summary:\nsummary = df.groupby("dept").agg(\n    headcount = ("id",     "count"),\n    avg_salary = ("salary", "mean"),\n    avg_tenure = ("tenure_yrs", "mean"),\n).round(1)`,
    },
    {
      label: "Visualise", icon: "📊", desc: "Communicate findings",
      code: `import matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 2, figsize=(12,4))\n\n# Chart 1: Headcount by dept\nsummary["headcount"].plot(\n    kind="bar", ax=axes[0],\n    title="Headcount by Dept",\n    color=["#60a5fa","#4ade80","#c084fc"]\n)\n\n# Chart 2: Avg salary vs avg tenure\naxes[1].scatter(\n    summary["avg_salary"],\n    summary["avg_tenure"],\n    s=summary["headcount"]*80\n)\nfor dept in summary.index:\n    axes[1].annotate(dept,\n        (summary.loc[dept,"avg_salary"],\n         summary.loc[dept,"avg_tenure"]))\n\nplt.tight_layout()\nplt.savefig("report.png", bbox_inches="tight")`,
    },
    {
      label: "Output", icon: "✅", desc: "Export results",
      code: `# Save cleaned data:\ndf.to_csv("employees_clean.csv", index=False)\n\n# Save summary as Excel with formatting:\nwith pd.ExcelWriter("report.xlsx") as writer:\n    df.to_excel(writer, sheet_name="Data",\n                index=False)\n    summary.to_excel(writer,\n                     sheet_name="Summary")\n\n# Print key stats:\nprint(f"\\n{'='*40}")\nprint(f"EMPLOYEES REPORT — {pd.Timestamp.now().date()}")\nprint(f"{'='*40}")\nprint(f"Total employees: {len(df)}")\nprint(f"Avg salary: {df['salary'].mean():,.0f}")\nprint(summary.to_string())`,
    },
  ];
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Step through a complete data pipeline. This is the workflow you'll follow on every real project.</Hint>
      <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.slate}` }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ flex: 1, padding: "9px 4px", border: "none", cursor: "pointer", background: step === i ? "rgba(96,165,250,.13)" : step > i ? "rgba(96,165,250,.05)" : "transparent", borderRight: i < 5 ? `1px solid ${T.slate}` : "none", transition: "all .2s" }}>
            <div style={{ fontSize: 14 }}>{s.icon}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: step >= i ? T.blue : T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.label}</div>
          </button>
        ))}
      </div>
      <div style={{ height: 2, background: T.slate, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: T.blue, borderRadius: 2, transition: "width .3s" }} />
      </div>
      <div style={{ background: `${T.blue}09`, border: `1px solid ${T.blue}25`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.greyLight }}>
        <strong style={{ color: T.blue }}>{STEPS[step].label}:</strong> {STEPS[step].desc}
      </div>
      <PyBlock code={STEPS[step].code} label={`Step ${step + 1} of 6 — ${STEPS[step].label}`} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: step === 0 ? T.greyDark : T.grey }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(5, s + 1))} disabled={step === 5} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: step === 5 ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${step === 5 ? T.slate : T.blue}44`, background: step === 5 ? "transparent" : "rgba(96,165,250,.12)", color: step === 5 ? T.greyDark : T.blue }}>{step === 5 ? "Done ✓" : "Next →"}</button>
      </div>
    </div>
  );
}

export default function Module19() {
  return (
    <Course
      intro={{
        explain: "A data pipeline is a repeatable sequence of steps that takes raw, messy data and produces clean, analysed output. The steps are always the same: load the data, inspect it to understand what you have, clean it to fix problems, transform it to add useful derived columns, visualise your findings, and export the results. In production, pipelines run automatically every day or every hour — which means every step must be correct, robust, and observable.",
        learn: [
          "Structure a full data project as a sequence of named, testable pipeline functions",
          "Write modular functions that each take a DataFrame and return a transformed DataFrame",
          "Add logging statements and assertions so failures are caught early with clear messages",
          "Export results to CSV, Excel, and chart files in one complete reproducible run",
        ],
        concepts: [
          "Each function should take a df as input and return a df — this makes steps composable and individually testable",
          "df = df.copy() at the start of a function prevents accidentally modifying the original data",
          "assert df['id'].is_unique — always validate key assumptions after each step, do not assume",
          "logging.info(f'Cleaned: {len(df)} rows') after each step so you always know what was processed",
        ],
        why: "This is what a data analyst or engineer does every day. Every module in this course was a building block toward this. A clean, well-structured pipeline is the professional deliverable — not just working analysis, but a repeatable, trustworthy process that produces it reliably.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Full pipeline",
          desc: "A data pipeline has six stages that always appear in the same order. Load: read raw data into a DataFrame. Inspect: understand the shape, types, and nulls before touching anything. Clean: fix dtypes, handle missing values, remove duplicates. Transform: derive new columns that answer the business question. Visualise: produce charts that communicate findings clearly. Output: save results to CSV, Excel, or a database. Step through each stage to see the code for a complete employee analytics pipeline.",
          content: () => <PipelineVisual />,
        },
        {
          title: "Production patterns",
          desc: "A Jupyter notebook is for exploration. Production code — code that runs on a schedule and must be reliable — follows different conventions. Functions with clear signatures replace sprawling notebook cells. Type hints (name: str) document what each function expects. Assertions (assert df['id'].is_unique) validate assumptions and fail loudly if violated. Logging with the logging module records what happened and when, which is essential for debugging when a pipeline fails at 3am. df = df.copy() inside every function prevents one step from silently corrupting the next step's input.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>Notebooks are for exploration. Production code follows different patterns — functions, logging, assertions, and reproducibility.</Note>
              <PyBlock label="Production-grade data script" code={`import pandas as pd\nimport logging\nfrom pathlib import Path\n\nlogging.basicConfig(level=logging.INFO)\nlog = logging.getLogger(__name__)\n\ndef load_data(path: str) -> pd.DataFrame:\n    """Load and validate raw employee data."""\n    path = Path(path)\n    if not path.exists():\n        raise FileNotFoundError(f"No file at {path}")\n    df = pd.read_csv(path, parse_dates=["hired"])\n    log.info(f"Loaded {len(df)} rows from {path.name}")\n    return df\n\ndef clean(df: pd.DataFrame) -> pd.DataFrame:\n    """Standardise types and handle nulls."""\n    df = df.copy()  # never modify input in place\n    df["salary"] = pd.to_numeric(df["salary"], errors="coerce")\n    df["score"].fillna(df["score"].median(), inplace=True)\n    df.drop_duplicates(subset=["id"], inplace=True)\n    assert df["salary"].isna().sum() == 0, "Null salaries remain"\n    return df\n\ndef transform(df: pd.DataFrame) -> pd.DataFrame:\n    """Add derived columns."""\n    df = df.copy()\n    df["tenure_yrs"] = ((pd.Timestamp.now() - df["hired"]).dt.days / 365.25).round(1)\n    return df\n\nif __name__ == "__main__":\n    df = load_data("employees.csv")\n    df = clean(df)\n    df = transform(df)\n    df.to_csv("employees_processed.csv", index=False)\n    log.info("Pipeline complete")`} />
            </div>
          ),
        },
      ]}
    />
  );
}
