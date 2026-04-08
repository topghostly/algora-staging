"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Quiz, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1, name: "Amara Osei",     dept: "Engineering", salary: 85000, score: 88.5 },
  { id: 2, name: "Bola Adeyemi",   dept: "Analytics",   salary: 72000, score: null },
  { id: 3, name: "Chidi Nwosu",    dept: "Engineering", salary: 91000, score: 92.0 },
  { id: 4, name: "Dami Okonkwo",   dept: "Product",     salary: 68000, score: 74.0 },
  { id: 5, name: "Emeka Eze",      dept: "Analytics",   salary: 77000, score: null },
  { id: 6, name: "Funmi Alade",    dept: "Engineering", salary: 95000, score: 97.0 },
  { id: 7, name: "Gbemi Coker",    dept: "Product",     salary: 71000, score: 81.0 },
  { id: 8, name: "Hassan Musa",    dept: "Analytics",   salary: 69000, score: 70.0 },
  { id: 9, name: "Ifeoma Uche",    dept: "Engineering", salary: 83000, score: null },
  { id: 10, name: "Jide Fadahunsi",dept: "Product",     salary: 78000, score: 85.0 },
];

const dc = (dept: string) => ({
  Engineering: { text: T.blue,   bg: "rgba(96,165,250,.08)",  border: "rgba(96,165,250,.3)"  },
  Analytics:   { text: T.cyan,   bg: "rgba(34,211,238,.08)",  border: "rgba(34,211,238,.3)"  },
  Product:     { text: T.purple, bg: "rgba(192,132,252,.08)", border: "rgba(192,132,252,.3)" },
} as Record<string, { text: string; bg: string; border: string }>)[dept] ?? { text: T.grey, bg: "transparent", border: T.slate };

function ChartBuilder() {
  const [ct, setCt] = useState("bar");
  const CHARTS = [
    { id: "bar",     icon: "📊", label: "Bar",       desc: "Compare categories" },
    { id: "hist",    icon: "📈", label: "Histogram", desc: "Distribution of numeric" },
    { id: "scatter", icon: "⭕", label: "Scatter",   desc: "Two variables" },
    { id: "line",    icon: "📉", label: "Line",      desc: "Trend over time" },
    { id: "box",     icon: "📦", label: "Box Plot",  desc: "Distribution + outliers" },
    { id: "heatmap", icon: "🌡️", label: "Heatmap",  desc: "Correlation matrix" },
  ];
  const DEPT_COUNTS: Record<string, number> = { Engineering: 4, Analytics: 3, Product: 3 };
  const SALARY_BINS: [number, number, number][] = [[65000,70000,2],[70000,75000,2],[75000,80000,1],[80000,85000,2],[85000,90000,1],[90000,95000,2]];
  const SCATTER = DF_EMPLOYEES.filter(r => r.score !== null);
  const LINE: [number, number][] = [[2018,1],[2019,1],[2020,2],[2021,2],[2022,2],[2023,2]];
  const CODE: Record<string, string> = {
    bar: `import matplotlib.pyplot as plt\n\ncounts = df["dept"].value_counts()\ncolors = ["#60a5fa","#4ade80","#c084fc"]\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.bar(counts.index, counts.values, color=colors)\nax.set_title("Employees by Department")\nax.set_xlabel("Department")\nax.set_ylabel("Count")\nfor i, v in enumerate(counts.values):\n    ax.text(i, v+0.05, str(v), ha="center")\nplt.tight_layout()\nplt.show()`,
    hist: `import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.hist(df["salary"], bins=8, color="#60a5fa",\n        edgecolor="white", alpha=0.8)\nax.set_title("Salary Distribution")\nax.set_xlabel("Salary")\nax.set_ylabel("Frequency")\n\n# Add mean line:\nmean = df["salary"].mean()\nax.axvline(mean, color="#f87171", ls="--",\n           label=f"Mean: {mean:,.0f}")\nax.legend()\nplt.tight_layout()`,
    scatter: `import matplotlib.pyplot as plt\n\ncolor_map = {"Engineering":"#60a5fa",\n             "Analytics":"#4ade80",\n             "Product":"#c084fc"}\ncolors = df["dept"].map(color_map)\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.scatter(df["salary"], df["score"],\n           c=colors, s=100, alpha=0.7)\nfor _, row in df.dropna().iterrows():\n    ax.annotate(row["name"].split()[0],\n                (row["salary"], row["score"]),\n                fontsize=7, alpha=0.7)\nax.set_title("Salary vs Score")\nplt.tight_layout()`,
    line: `import matplotlib.pyplot as plt\n\nhires = df.groupby(\n    df["hired"].dt.year\n).size().reset_index()\nhires.columns = ["year","count"]\n\nfig, ax = plt.subplots(figsize=(8,5))\nax.plot(hires["year"], hires["count"],\n        marker="o", color="#4ade80", lw=2)\nax.fill_between(hires["year"],hires["count"],\n                alpha=0.1, color="#4ade80")\nax.set_title("Hires Per Year")\nplt.grid(alpha=0.3)\nplt.tight_layout()`,
    box: `import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8,5))\ngroups = [df[df["dept"]==d]["salary"].values\n          for d in df["dept"].unique()]\nlabels = df["dept"].unique()\nax.boxplot(groups, labels=labels)\nax.set_title("Salary Distribution by Dept")\nax.set_ylabel("Salary")\n\n# Shows: median, IQR, whiskers, outliers\nplt.tight_layout()`,
    heatmap: `import seaborn as sns\nimport matplotlib.pyplot as plt\n\n# Correlation matrix:\nnumeric = df[["salary","score","id"]]\ncorr = numeric.corr()\n\nfig, ax = plt.subplots(figsize=(6,5))\nsns.heatmap(corr, annot=True, fmt=".2f",\n            cmap="coolwarm", center=0,\n            ax=ax)\nax.set_title("Correlation Heatmap")\nplt.tight_layout()`,
  };
  const barMax = Math.max(...Object.values(DEPT_COUNTS));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>Click a chart type to see a live preview of the data and the full matplotlib code.</Hint>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {CHARTS.map(c => (
          <button key={c.id} onClick={() => setCt(c.id)} style={{ padding: "5px 11px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${ct === c.id ? T.blue : "rgba(255,255,255,.07)"}`, background: ct === c.id ? "rgba(96,165,250,.12)" : "rgba(255,255,255,.02)", color: ct === c.id ? T.blue : T.grey, fontWeight: ct === c.id ? 700 : 400 }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "rgba(4,9,20,.7)", border: `1px solid ${T.slate}`, borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.white, textAlign: "center" }}>{CHARTS.find(c => c.id === ct)?.desc}</div>
          {ct === "bar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
              {Object.entries(DEPT_COUNTS).map(([dept, count]) => (
                <div key={dept} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 9, color: dc(dept).text, fontFamily: "'JetBrains Mono',monospace", width: 88, flexShrink: 0 }}>{dept}</div>
                  <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / barMax) * 100}%`, background: dc(dept).text, borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 6 }}>
                      <span style={{ fontSize: 9, color: "rgba(4,9,20,.9)", fontWeight: 700 }}>{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {ct === "hist" && (
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 90, marginTop: 4 }}>
              {SALARY_BINS.map(([lo, , n]) => (
                <div key={lo} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 7, color: T.greyDark }}>{n}</span>
                  <div style={{ width: "100%", height: `${(n / 2) * 70}px`, background: T.blue, borderRadius: "3px 3px 0 0", opacity: 0.8 }} />
                  <span style={{ fontSize: 6, color: T.greyDark, whiteSpace: "nowrap" }}>{(lo / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          )}
          {ct === "scatter" && (
            <div style={{ position: "relative", height: 110, marginTop: 4 }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: T.slate }} />
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: T.slate }} />
              {SCATTER.map((p, i) => {
                const x = ((p.salary - 64000) / (94000 - 64000)) * 88;
                const y = (((p.score as number) - 75) / (100 - 75)) * 90;
                return (
                  <div key={i} style={{ position: "absolute", left: `${x}%`, bottom: `${y}%`, transform: "translate(-50%,50%)" }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: dc(p.dept).text, opacity: 0.8 }} />
                    <div style={{ fontSize: 6, color: T.greyDark, textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }}>{p.name.split(" ")[0][0]}</div>
                  </div>
                );
              })}
            </div>
          )}
          {ct === "line" && (
            <div style={{ height: 90, marginTop: 4 }}>
              <svg width="100%" height="90" viewBox="0 0 200 75">
                <polyline points={LINE.map(([, v], i) => `${(i / 5) * 180 + 10},${75 - v * 28}`).join(" ")} fill="none" stroke={T.green} strokeWidth={2} />
                {LINE.map(([y, v], i) => (
                  <g key={y}>
                    <circle cx={(i / 5) * 180 + 10} cy={75 - v * 28} r={3} fill={T.green} />
                    <text x={(i / 5) * 180 + 10} y={73} textAnchor="middle" fontSize={6} fill={T.greyDark}>{y}</text>
                  </g>
                ))}
              </svg>
            </div>
          )}
          {ct === "box" && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8, alignItems: "flex-end" }}>
              {Object.entries({ Engineering: [85,88,89.25,91,93], Analytics: [69,72,72,75,75], Product: [65,68,71,71,71] }).map(([d, v]) => {
                const [mn, q1, med, q3, mx] = v;
                const range = mx - mn;
                const total = 40;
                return (
                  <div key={d} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ position: "relative", width: 24, height: total + 8 }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: dc(d).border }} />
                      <div style={{ position: "absolute", left: 0, right: 0, top: `${((mx - q3) / range) * total}px`, height: `${((q3 - q1) / range) * total}px`, background: dc(d).bg, border: `1px solid ${dc(d).border}`, borderRadius: 2 }} />
                      <div style={{ position: "absolute", left: 0, right: 0, top: `${((mx - med) / range) * total}px`, height: 2, background: dc(d).text }} />
                    </div>
                    <div style={{ fontSize: 7, color: dc(d).text, fontFamily: "'JetBrains Mono',monospace" }}>{d.slice(0, 3)}</div>
                  </div>
                );
              })}
            </div>
          )}
          {ct === "heatmap" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginTop: 8 }}>
              {[["1.00","0.32","0.45"],["0.32","1.00","0.21"],["0.45","0.21","1.00"]].map((row, ri) =>
                row.map((v, ci) => (
                  <div key={`${ri}-${ci}`} style={{ padding: "6px", textAlign: "center", borderRadius: 4, background: `rgba(96,165,250,${parseFloat(v) * 0.4})`, fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.white, fontWeight: 700 }}>{v}</div>
                ))
              )}
            </div>
          )}
        </div>
        <PyBlock label="matplotlib" code={CODE[ct]} />
      </div>
    </div>
  );
}

export default function Module12() {
  return (
    <Course
      intro={{
        explain: "matplotlib is Python's core plotting library — when you call df.plot() in pandas, matplotlib runs under the hood. Learning it directly gives you full control over every element of a chart: axes, colours, fonts, annotations, tick marks, and multi-chart layouts. A clear, well-labelled chart communicates a finding in seconds. A chart missing labels or using the wrong type for the data confuses the audience even when the underlying analysis is correct.",
        learn: [
          "Build bar charts, histograms, scatter plots, line charts, and box plots for the right situations",
          "Add titles, axis labels, legends, annotations, and reference lines to any chart",
          "Create multi-panel figures with subplots for side-by-side comparisons",
          "Save charts to file at the correct resolution without labels being cut off",
        ],
        concepts: [
          "fig, ax = plt.subplots() — fig is the whole figure canvas, ax is the set of axes where you draw",
          "ax.set_title(), ax.set_xlabel(), ax.set_ylabel() — always label every axis on every chart",
          "ax.axvline(mean, color='red', ls='--') adds a vertical reference line — useful for showing mean or median",
          "plt.tight_layout() prevents text from being cut off; savefig(..., bbox_inches='tight') for saving to file",
        ],
        why: "Every analysis ends with communication. Stakeholders read charts, not tables of numbers. Producing clear, correctly-labelled visuals quickly is a core part of every analyst, scientist, and engineer's daily work.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Chart builder",
          desc: "matplotlib works through a figure and axes model. plt.subplots() creates a Figure (the entire canvas) and one or more Axes (a single plot area with its own x and y axis). You call methods on the Axes object to draw: ax.bar() for bars, ax.hist() for histogram, ax.scatter() for scatter plot. Always set a title and axis labels — unlabelled charts are almost always misread. Click each chart type to see a preview of the employee data rendered in that form, along with the full code.",
          content: () => <ChartBuilder />,
        },
        {
          title: "Choosing the right chart",
          desc: "Chart choice communicates intent. A bar chart compares categories — department counts, regional revenue. A histogram shows the distribution of a single numeric column — salary range, score spread. A scatter plot reveals the relationship between two numeric variables — does higher salary correlate with higher score? A line chart shows change over time — hires per year. A box plot shows the distribution and spread within groups, including outliers. Choosing the wrong chart makes a correct finding look wrong, or hides a real pattern entirely.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>Chart choice communicates intent. Wrong chart = confused audience.</Note>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { icon: "📊", name: "Bar",       when: "Compare categories",                   avoid: "When you have >10 categories",         code: `df["dept"].value_counts().plot(kind="bar")` },
                  { icon: "📈", name: "Histogram",  when: "Distribution of a single numeric col", avoid: "Comparing multiple groups",            code: `df["salary"].plot(kind="hist",bins=10)` },
                  { icon: "⭕", name: "Scatter",    when: "Relationship between two numeric cols", avoid: "Categorical data",                    code: `df.plot.scatter(x="salary",y="score")` },
                  { icon: "📉", name: "Line",       when: "Continuous change over time",          avoid: "Non-time categorical data",            code: `hires_by_year.plot(kind="line",marker="o")` },
                  { icon: "📦", name: "Box",        when: "Distribution + outliers by group",     avoid: "Small datasets (<15 points)",          code: `df.boxplot(col="salary",by="dept")` },
                  { icon: "🥧", name: "Pie",        when: "Parts of a whole (max 5 slices)",      avoid: "Comparison — bars are almost always better", code: `df["dept"].value_counts().plot(kind="pie")` },
                ].map(c => (
                  <div key={c.name} style={{ border: `1px solid ${T.slate}`, borderRadius: 8, padding: "10px 12px", background: T.surface }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 16 }}>{c.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.white }}>{c.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.grey, marginBottom: 2 }}>✓ {c.when}</div>
                    <div style={{ fontSize: 9, color: T.red, marginBottom: 5 }}>✗ {c.avoid}</div>
                    <code style={{ fontSize: 9, color: T.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{c.code}</code>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Subplots & formatting",
          desc: "plt.subplots(1, 2) creates a figure with two side-by-side Axes — axes is then an array you index as axes[0] and axes[1]. plt.suptitle() sets a title for the whole figure, not just one subplot. plt.tight_layout() automatically adjusts spacing so titles and labels do not overlap. plt.savefig('file.png', dpi=150, bbox_inches='tight') saves to disk at print quality. dpi=150 is a good default for slides; dpi=300 for print. bbox_inches='tight' prevents the figure from being cropped at the edges.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}>Professional charts need titles, labels, and tight_layout. Subplots let you show multiple charts in one figure.</Note>
              <PyBlock label="matplotlib — pro patterns" code={`fig, axes = plt.subplots(1, 2, figsize=(12, 4))\n\n# Chart 1 — salary distribution:\naxes[0].hist(df["salary"], bins=8, color="#60a5fa")\naxes[0].set_title("Salary Distribution")\naxes[0].set_xlabel("Salary")\naxes[0].axvline(df["salary"].mean(),\n               color="#f87171", ls="--",\n               label=f"Mean: {df['salary'].mean():,.0f}")\naxes[0].legend()\n\n# Chart 2 — scores by department:\nfor dept, grp in df.groupby("dept"):\n    axes[1].scatter(grp["salary"], grp["score"],\n                   label=dept, s=80)\naxes[1].set_title("Salary vs Score by Dept")\naxes[1].legend()\n\nplt.suptitle("Employee Analytics", fontsize=14)\nplt.tight_layout()\nplt.savefig("charts.png", dpi=150, bbox_inches="tight")\nplt.show()`} />
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.blue} questions={[
              {
                question: "You want to show how employee count is distributed across departments. Best chart?",
                options: ["Histogram — numeric distribution", "Bar chart — compare category counts", "Scatter — two variables", "Line — over time"],
                correct: 1,
                explanation: "Bar charts compare values across categories. Department is a category, count is numeric — bar chart is the right choice. Histogram is for the distribution of a SINGLE numeric column (like salary range).",
              },
              {
                question: "df['salary'].plot(kind='hist', bins=10) — what does 'bins=10' control?",
                options: ["The number of bars (buckets) to group values into", "The x-axis range", "The height of the tallest bar", "The number of data points shown"],
                correct: 0,
                explanation: "bins= controls how many equal-width intervals (buckets) the data is divided into. More bins = finer detail. Fewer bins = broader overview. Default is usually 10.",
              },
              {
                type: "bug",
                question: "A chart is cut off when saved. Fix:",
                code: `plt.savefig("chart.png")`,
                options: ["Use plt.show() first", "Add bbox_inches='tight' to savefig", "Use fig.save() instead", "Set dpi=72"],
                correct: 1,
                explanation: "Without bbox_inches='tight', matplotlib clips the figure at the canvas boundary, cutting off labels and titles. plt.savefig('chart.png', bbox_inches='tight') ensures the full figure is captured.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
