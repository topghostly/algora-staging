"use client";
import React, { useState } from "react";
import { T } from "../python-constants";
import { PyBlock, Note, Hint, Warn, Quiz, Course, SLabel as SL } from "../python-shared";

const DF_EMPLOYEES = [
  { id: 1,  name: "Amara Osei",      dept: "Engineering", salary: 85000, hired: "2021-03-15", score: 88.5 },
  { id: 2,  name: "Bola Adeyemi",    dept: "Analytics",   salary: 72000, hired: "2020-07-22", score: null },
  { id: 3,  name: "Chidi Nwosu",     dept: "Engineering", salary: 91000, hired: "2019-11-01", score: 92.0 },
  { id: 4,  name: "Dami Okonkwo",    dept: "Product",     salary: 68000, hired: "2022-01-10", score: 74.0 },
  { id: 5,  name: "Emeka Eze",       dept: "Analytics",   salary: 77000, hired: "2020-04-05", score: null },
  { id: 6,  name: "Funmi Alade",     dept: "Engineering", salary: 95000, hired: "2018-09-17", score: 97.0 },
  { id: 7,  name: "Gbemi Coker",     dept: "Product",     salary: 71000, hired: "2021-11-30", score: 81.0 },
  { id: 8,  name: "Hassan Musa",     dept: "Analytics",   salary: 69000, hired: "2023-02-14", score: 70.0 },
  { id: 9,  name: "Ifeoma Uche",     dept: "Engineering", salary: 83000, hired: "2022-06-20", score: null },
  { id: 10, name: "Jide Fadahunsi",  dept: "Product",     salary: 78000, hired: "2019-08-11", score: 85.0 },
];

const dc = (dept: string) => ({
  Engineering: { text: T.blue,   bg: "rgba(96,165,250,.08)",  border: "rgba(96,165,250,.3)"  },
  Analytics:   { text: T.cyan,   bg: "rgba(34,211,238,.08)",  border: "rgba(34,211,238,.3)"  },
  Product:     { text: T.purple, bg: "rgba(192,132,252,.08)", border: "rgba(192,132,252,.3)" },
} as Record<string, { text: string; bg: string; border: string }>)[dept] ?? { text: T.grey, bg: "transparent", border: T.slate };

function DatetimeExplorer() {
  const [dateStr, setDateStr] = useState("2024-03-15");
  const [offset, setOffset] = useState(45);
  let d: Date, valid = true;
  try {
    d = new Date(dateStr);
    valid = !isNaN(d.getTime());
  } catch {
    valid = false;
    d = new Date();
  }
  const future = valid ? new Date(d.getTime() + offset * 86400000) : null;
  const PARTS = valid ? [
    { fn: ".year",       val: d.getFullYear(),                    c: T.blue   },
    { fn: ".month",      val: d.getMonth() + 1,                   c: T.cyan   },
    { fn: ".day",        val: d.getDate(),                        c: T.green  },
    { fn: ".weekday()",  val: d.getDay(),                         c: T.yellow },
    { fn: ".day_name()", val: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()], c: T.orange },
    { fn: ".quarter",    val: Math.ceil((d.getMonth() + 1) / 3),  c: T.purple },
    { fn: ".week",       val: Math.ceil(d.getDate() / 7),         c: T.pink   },
    { fn: ".dayofyear",  val: Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000), c: T.teal },
  ] : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Type any date below. All extractions and date arithmetic update instantly.</Hint>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL c={T.blue}>INPUT DATE</SL>
            <input value={dateStr} onChange={e => setDateStr(e.target.value)} placeholder="YYYY-MM-DD" style={{ width: "100%", padding: "7px 12px", borderRadius: 8, border: `1px solid ${valid ? "rgba(96,165,250,.35)" : "rgba(248,113,113,.35)"}`, background: T.bg, color: valid ? T.blue : T.red, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
            {!valid && <div style={{ fontSize: 9, color: T.red, marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>Invalid date — try YYYY-MM-DD</div>}
          </div>
          {valid && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, animation: "popIn .2s ease" }}>
              {PARTS.map(p => (
                <div key={p.fn} style={{ border: `1px solid ${p.c}33`, borderRadius: 8, padding: "8px 10px", background: `${p.c}08` }}>
                  <code style={{ fontSize: 9, color: p.c, fontFamily: "'JetBrains Mono',monospace", display: "block", marginBottom: 2 }}>dt{p.fn}</code>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.white, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{String(p.val)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SL c={T.green}>DATE ARITHMETIC — {offset > 0 ? "+" : ""}{offset} days</SL>
            <input type="range" min={-365} max={365} value={offset} onChange={e => setOffset(Number(e.target.value))} style={{ width: "100%", accentColor: T.green, marginBottom: 4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: T.greyDark }}>
              <span>-365</span>
              <span style={{ color: T.green, fontWeight: 700 }}>{offset > 0 ? "+" : ""}{offset} days</span>
              <span>+365</span>
            </div>
          </div>
          {valid && future && (
            <div style={{ border: "1px solid rgba(74,222,128,.3)", borderRadius: 10, padding: "12px", background: "rgba(74,222,128,.06)", animation: "popIn .2s ease" }}>
              <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>{dateStr} {offset > 0 ? "+" : ""}{offset} days =</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.green, fontFamily: "'JetBrains Mono',monospace" }}>{future.toISOString().slice(0, 10)}</div>
              <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][future.getDay()]}</div>
            </div>
          )}
          {valid && (
            <PyBlock label="pandas" code={`from datetime import date\nimport pandas as pd\n\ndt = pd.to_datetime("${dateStr}")\n\ndt.year    # ${d.getFullYear()}\ndt.month   # ${d.getMonth() + 1}\ndt.day     # ${d.getDate()}\ndt.day_name()  # "${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]}"\n\ndt + pd.Timedelta(days=${offset})\n# → ${future?.toISOString().slice(0, 10) || "NaT"}`} />
          )}
        </div>
      </div>
    </div>
  );
}

function TenureCalculator() {
  const now = new Date("2024-12-01");
  const withTenure = DF_EMPLOYEES.map(e => {
    const hired = new Date(e.hired);
    const days = Math.floor((now.getTime() - hired.getTime()) / 86400000);
    return { ...e, hired_dt: e.hired, tenure_days: days, tenure_years: Math.round((days / 365.25) * 10) / 10 };
  }).sort((a, b) => b.tenure_days - a.tenure_days);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint>This shows a real tenure calculation on all 10 employees — the most common datetime operation in HR/people analytics.</Hint>
      <PyBlock label="pandas — tenure calculation" code={`df["hired"] = pd.to_datetime(df["hired"])\ntoday = pd.Timestamp("now")\n\n# Tenure in days:\ndf["tenure_days"] = (today - df["hired"]).dt.days\n\n# Tenure in years (accounting for leap years):\ndf["tenure_years"] = (df["tenure_days"] / 365.25).round(1)\n\n# Year, month, quarter of hire:\ndf["hire_year"]    = df["hired"].dt.year\ndf["hire_quarter"] = df["hired"].dt.quarter\ndf["hire_month"]   = df["hired"].dt.month_name()\n\n# Filter: hired in last 2 years:\ncutoff = today - pd.Timedelta(days=730)\nrecent = df[df["hired"] >= cutoff]`} />
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ background: "rgba(4,9,20,.9)", borderBottom: `1px solid ${T.slate}` }}>
              {["name", "dept", "hired", "tenure_days", "tenure_years"].map(c => (
                <th key={c} style={{ padding: "5px 10px", textAlign: "left", fontSize: 9, color: ["tenure_days","tenure_years"].includes(c) ? T.cyan : T.greyDark }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withTenure.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < withTenure.length - 1 ? `1px solid ${T.slate}22` : "none", background: r.tenure_years > 4 ? "rgba(74,222,128,.04)" : "transparent" }}>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.name}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: dc(r.dept).text }}>{r.dept}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyDark }}>{r.hired_dt}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.cyan, fontWeight: 700 }}>{r.tenure_days.toLocaleString()}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.cyan, fontWeight: 700 }}>{r.tenure_years}y</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Module11() {
  return (
    <Course
      intro={{
        explain: "Dates come in dozens of formats and carry hidden complexity — arithmetic must account for varying month lengths and leap years, and components like year, quarter, and weekday are only accessible once Python knows the column is a date, not a plain string. The key first step is always converting string date columns to datetime64 dtype with pd.to_datetime(). After that, the .dt accessor unlocks every date operation you need.",
        learn: [
          "Convert string date columns to datetime64 dtype using pd.to_datetime()",
          "Extract year, month, quarter, weekday, and other parts using the .dt accessor",
          "Calculate durations between two dates to get tenure, invoice age, or days overdue",
          "Resample a time series into monthly or quarterly summaries using .resample()",
        ],
        concepts: [
          "If df['hired'].dtype shows as object (string), none of the .dt operations will work — always convert first",
          "pd.to_datetime(df['hired']) converts the column in place; parse_dates=['hired'] in read_csv() converts at load time",
          "Subtracting two Timestamps returns a Timedelta object — access .dt.days to get an integer",
          "resample('ME').size() counts events per calendar month — like groupby but built for time periods",
        ],
        why: "HR, finance, and product analytics all depend on date operations. Tenure, churn timing, monthly revenue trends, seasonality. Analysts who cannot handle dates are blocked on a large proportion of real business questions.",
      }}
      c={T.blue}
      steps={[
        {
          title: "Datetime explorer",
          desc: "Before you can do anything with a date column, pandas needs to know it is a date and not a string. pd.to_datetime(df['col']) converts it. Once converted, the .dt accessor unlocks all date components. dt.year, dt.month, dt.day extract the obvious parts. dt.day_name() gives Monday, Tuesday etc. dt.quarter gives 1-4. dt.dayofyear gives the day number within the year (1-365). You can also do arithmetic: adding a pd.Timedelta(days=30) shifts every date forward by 30 days. Type any date below to see all extractions update live.",
          content: () => <DatetimeExplorer />,
        },
        {
          title: "Tenure calculator",
          desc: "The most common datetime operation in HR and people analytics is calculating how long something has been running — employee tenure, account age, days since last purchase. The pattern is: convert to datetime, subtract the earlier date from the later date, which gives a Timedelta, then access .dt.days for the integer number of days. Dividing by 365.25 gives years (accounting for leap years). The table below shows this calculation applied to every employee, sorted by longest tenure.",
          content: () => <TenureCalculator />,
        },
        {
          title: "Resample & periods",
          desc: "Resampling is groupby for time series. Instead of grouping by a category like department, you group by a time period — every month, every quarter, every week. df.resample('ME', on='date').size() counts rows per month. You can use any aggregation: .sum(), .mean(), .first(). The period alias string controls the bucket size: 'ME' for month end, 'QE' for quarter end, 'W' for week, 'D' for day. Note: pandas 2.2 changed the aliases from M and Q to ME and QE — the old ones still work but show a deprecation warning.",
          content: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Note c={T.blue}><code style={{ color: T.cyan }}>resample()</code> is groupby for time series — group rows into time buckets (monthly, quarterly, etc.).</Note>
              <PyBlock label="pandas — time series" code={`df["hired"] = pd.to_datetime(df["hired"])\n\n# Resample = group by time period:\nhires_by_month = df.resample("ME", on="hired").size()\nhires_by_quarter = df.resample("QE", on="hired").size()\nhires_by_year = df.resample("YE", on="hired").size()\n\n# Period aliases (new in pandas 2.2):\n# "ME" = month end,  "QE" = quarter end\n# "YE" = year end,   "W"  = weekly\n# "D"  = daily,      "h"  = hourly\n\n# Rolling windows:\ndf["salary_3mo_avg"] = df.set_index("hired")["salary"].rolling("90D").mean()\n\n# Date ranges:\npd.date_range("2023-01-01", periods=12, freq="ME")\n# DatetimeIndex(['2023-01-31', '2023-02-28', ...])`} />
              <Warn>The resample() period alias changed in pandas 2.2: use <code>ME</code> instead of <code>M</code>, <code>QE</code> instead of <code>Q</code>. The old aliases are deprecated.</Warn>
            </div>
          ),
        },
        {
          title: "Quiz",
          content: () => (
            <Quiz c={T.blue} questions={[
              {
                question: "After df['hired'] = pd.to_datetime(...), how do you get the year from each date?",
                options: ["df['hired'].year", "df['hired'].dt.year", "df['hired'].str.year", "df.year('hired')"],
                correct: 1,
                explanation: "Once a column is datetime dtype, use the .dt accessor: .dt.year, .dt.month, .dt.day_name(), .dt.quarter. Without .dt you get AttributeError.",
              },
              {
                type: "output",
                question: "What does this calculate?",
                code: `(pd.Timestamp("2024-12-01") - pd.Timestamp("2022-03-15")).days`,
                options: ["Days between the dates (an integer)", "A Timedelta object", "A DateOffset", "ValueError"],
                correct: 0,
                explanation: "Subtracting two Timestamps returns a Timedelta. Accessing .days on a Timedelta gives the integer number of days between the dates. Here it's approximately 991 days.",
              },
              {
                type: "bug",
                question: "Why might this give wrong results?",
                code: `df["tenure"] = df["hired"].dt.year - 2024`,
                options: ["Should be pd.Timestamp.now().year", "dt.year gives month, not year", "2024 should be a string", "Missing .days"],
                correct: 0,
                explanation: "Hardcoding 2024 means the calculation is frozen in time — in 2025 this code gives wrong results. Use pd.Timestamp.now().year or (pd.Timestamp.now() - df['hired']).dt.days / 365.25 for a living calculation.",
              },
            ]} />
          ),
        },
      ]}
    />
  );
}
