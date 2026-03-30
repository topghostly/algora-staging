'use client';

import React, { useState } from 'react';
import { T, PLAT } from '../sql-constants';
import { EMP } from '../data';
import { 
  Course, 
  SQLBlock, 
  Note, 
  Quiz, 
  Hint, 
  SLabel, 
  PlatformDiff, 
  CommonMistakes 
} from '../sql-shared';

function ViewLensVisual({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [step, setStep] = useState(0);
  
  const viewRows = EMP.filter((r: any) => r.active === 1 && r.salary >= 70000).map((r: any) => ({ name: r.name, dept: r.dept, salary: r.salary }));
  
  const STEPS = [
    { label: "Base table", icon: "🗄️", desc: "The underlying employees table" },
    { label: "Define VIEW", icon: "🔭", desc: "CREATE VIEW stores the query definition" },
    { label: "Query VIEW", icon: "📋", desc: "SELECT from the view like a table" },
    { label: "Behind the scenes", icon: "🔍", desc: "The engine replaces the view with its definition" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="👆">Click through the <strong>4 phase tabs</strong> above — from raw table, to CREATE VIEW, to querying it, to seeing what the engine actually runs behind the scenes.</Hint>
      <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.slate}` }}>
        {STEPS.map((s, i) => (
          <button 
            key={i} 
            onClick={() => setStep(i)} 
            style={{ 
              flex: 1, 
              padding: "9px 5px", 
              border: "none", 
              cursor: "pointer", 
              background: step === i ? `${pc}18` : step > i ? `${pc}06` : "transparent", 
              borderRight: i < 3 ? `1px solid ${T.slate}` : "none", 
              transition: "all .2s" 
            }}
          >
            <div style={{ fontSize: 13 }}>{s.icon}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: step >= i ? pc : T.greyDark, fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
          </button>
        ))}
      </div>
      {step === 0 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 8 }}>
          <SLabel>employees — full table (10 rows)</SLabel>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.slate}`, background: "rgba(4,9,20,.9)" }}>
                  {["name", "dept", "salary", "active"].map(c => <th key={c} style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.greyDark }}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {EMP.map((r, ri) => (
                  <tr key={r.id} style={{ borderBottom: ri < EMP.length - 1 ? `1px solid ${T.slate}44` : "none", opacity: r.active === 1 && r.salary >= 70000 ? 1 : .35 }}>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.name}</td>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.dept}</td>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.salary.toLocaleString()}</td>
                    <td style={{ padding: "5px 10px", fontSize: 10, color: r.active === 1 ? T.green : T.red }}>{r.active === 1 ? "active" : "inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: T.greyDark, fontFamily: "monospace" }}>Dimmed rows: inactive or salary under 70,000 — these will be excluded by the view</div>
        </div>
      )}
      {step === 1 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 8 }}>
          <Note color={pc}><strong style={{ color: pc }}>CREATE VIEW</strong> stores the query definition — not the data. The base table remains unchanged. The view is a virtual table.</Note>
          <SQLBlock platform={platform} code={`CREATE VIEW active_senior_staff AS\nSELECT name, dept, salary\nFROM employees\nWHERE active = 1\n  AND salary >= 70000;\n\n-- No data copied.\n-- Just the query definition is stored.\n-- View will always reflect current base table.`} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "12px", border: `1px solid ${T.slate}`, borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginBottom: 6 }}>STORED IN DATABASE CATALOG</div>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: T.greyLight, lineHeight: 1.7 }}>
                <span style={{ color: pc }}>view_name:</span> active_senior_staff<br />
                <span style={{ color: pc }}>definition:</span> SELECT name, dept, salary<br />
                <span style={{ marginLeft: 16, color: T.greyDark }}>FROM employees</span><br />
                <span style={{ marginLeft: 16, color: T.greyDark }}>WHERE active=1 AND salary≥70000</span>
              </div>
            </div>
            <div style={{ padding: "12px", border: `1px solid ${T.slate}`, borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginBottom: 6 }}>NOT STORED</div>
              <div style={{ fontSize: 10, color: T.greyLight, lineHeight: 1.7 }}>
                ✗ No copy of the data<br />
                ✗ No extra storage used<br />
                ✓ Query runs at access time<br />
                ✓ Always current with base table
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 8 }}>
          <SQLBlock platform={platform} code={`-- Query the view just like a real table:\nSELECT * FROM active_senior_staff;\n\n-- Or add more filters:\nSELECT * FROM active_senior_staff\nWHERE dept = 'Engineering'\nORDER BY salary DESC;`} />
          <SLabel color={pc}>VIEW RESULT — {viewRows.length} rows (looks like a table)</SLabel>
          <div style={{ border: `1px solid ${pc}33`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "5px 12px", background: `${pc}10`, borderBottom: `1px solid ${pc}22`, fontSize: 9, color: pc, fontFamily: "monospace", fontWeight: 700 }}>📋 active_senior_staff (view)</div>
            {viewRows.map((r, ri) => (
              <div key={ri} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", padding: "5px 12px", borderBottom: ri < viewRows.length - 1 ? `1px solid ${T.slate}44` : "none" }}>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: T.greyLight }}>{r.name}</span>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: T.greyLight }}>{r.dept}</span>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: T.greyLight }}>{r.salary.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 10 }}>
          <Note color={pc}>When you query a view, the engine rewrites your query. It substitutes the view definition inline — so the final query runs against the actual base table.</Note>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
            <div>
              <SLabel>WHAT YOU WRITE</SLabel>
              <SQLBlock platform={platform} code={`SELECT *\nFROM active_senior_staff\nWHERE dept = 'Engineering';`} />
            </div>
            <div style={{ textAlign: "center", fontSize: 18, color: pc }}>→<div style={{ fontSize: 8, color: T.greyDark, fontFamily: "monospace" }}>engine<br />rewrites</div></div>
            <div>
              <SLabel color={pc}>WHAT ACTUALLY RUNS</SLabel>
              <SQLBlock platform={platform} code={`SELECT name, dept, salary\nFROM employees\nWHERE active = 1\n  AND salary >= 70000\n  AND dept = 'Engineering';`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Module10({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "Views — virtual tables",
        content: () => <ViewLensVisual platform={platform} />
      },
      {
        title: "CREATE, ALTER, DROP",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PlatformDiff title="View management syntax" diffs={[
              { platform: "mysql", code: `-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Replace (MySQL):\nCREATE OR REPLACE VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`, note: "CREATE OR REPLACE is MySQL's way to update a view without dropping first" },
              { platform: "postgres", code: `-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Replace (PostgreSQL 9.4+):\nCREATE OR REPLACE VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`, note: "PostgreSQL also supports materialized views (stores data)" },
              { platform: "sqlserver", code: `-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Alter:\nALTER VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`, note: "SQL Server uses ALTER VIEW (no CREATE OR REPLACE)" },
            ]} />
          </div>
        )
      },
      {
        title: "Common mistakes",
        content: () => (
          <CommonMistakes mistakes={[
            { title: "Expecting view data to be cached", wrong: `-- View queries base table EVERY time:\nSELECT * FROM v_active; -- reads employees now\nSELECT * FROM v_active; -- reads employees again\n-- No performance benefit from the view itself`, right: `-- For cached/pre-computed data:\n-- Use a Materialized View (PostgreSQL/Oracle)\nCREATE MATERIALIZED VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n-- Must REFRESH MATERIALIZED VIEW to update`, why: "A standard view is just a stored query. Every access re-runs it against live data. It provides security and reusability — not performance. For performance, use indexed/materialized views." },
            { title: "Updating a view with an unsupported expression", wrong: `-- This view is not updatable:\nCREATE VIEW v_dept_summary AS\nSELECT dept, COUNT(*), AVG(salary)\nFROM employees GROUP BY dept;\n\n-- Will fail:\nUPDATE v_dept_summary SET dept = 'Eng';`, right: `-- Only simple views (no GROUP BY, DISTINCT, JOIN)\n-- pointing to a single base table are updatable:\nCREATE VIEW v_simple AS\nSELECT id, name, dept FROM employees;\n\nUPDATE v_simple SET dept = 'Engineering' WHERE id = 1;`, why: "Views with aggregation, GROUP BY, DISTINCT, or JOINs are not updatable because the database can't map changes back to specific base table rows." },
          ]} />
        )
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { question: "Data is updated in the base table. What happens to a view built on that table?", options: ["The view stays stale — must be refreshed", "The view immediately reflects the change (it queries live data)", "The view must be dropped and recreated", "The change is blocked by the view"], correct: 1, explanation: "A standard view stores the query definition, not data. Every time you query the view, it executes against the current state of the base table. Updates to the base table are instantly visible through the view." },
            { question: "What is the main purpose of views? (choose best answer)", options: ["Improve query performance", "Encapsulate complex logic, provide security by limiting column/row access, and simplify queries", "Store pre-computed aggregations", "Back up table data"], correct: 1, explanation: "Views excel at: (1) hiding complexity behind a named query, (2) security — users can access v_public_data without accessing the raw table with sensitive columns, (3) reusability. For performance gains, use materialized views or indexed views." },
          ]} />
        )
      },
    ]} />
  );
}
