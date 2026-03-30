'use client';

import React, { useState } from 'react';
import { T, PLAT } from '../sql-constants';
import { 
  Course, 
  SQLBlock, 
  Note, 
  Tip, 
  Warn, 
  Quiz, 
  Hint, 
  SLabel, 
  PlatformDiff 
} from '../sql-shared';

function NullPropagationExplorer({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [expr, setExpr] = useState("salary + bonus");
  const [showFix, setShowFix] = useState(false);
  
  const DATA = [
    { name: "Amara", salary: 85000, bonus: 5000, active: 1 },
    { name: "Bola", salary: 72000, bonus: null, active: 1 },
    { name: "Chidi", salary: 91000, bonus: 8000, active: 1 },
    { name: "Dami", salary: 68000, bonus: null, active: 0 },
    { name: "Efe", salary: 75000, bonus: 2000, active: 1 },
  ];

  const EXPRESSIONS = [
    { label: "salary + bonus", fn: (r: any) => r.bonus !== null ? r.salary + r.bonus : null, fixed: (r: any) => r.salary + (r.bonus || 0), fixExpr: "salary + COALESCE(bonus, 0)" },
    { label: "salary * 1.1", fn: (r: any) => Math.round(r.salary * 1.1), fixed: (r: any) => Math.round(r.salary * 1.1), fixExpr: "salary * 1.1 (no NULLs here)" },
    { label: "salary / bonus", fn: (r: any) => r.bonus !== null && r.bonus !== 0 ? Math.round(r.salary / r.bonus) : null, fixed: (r: any) => r.bonus ? Math.round(r.salary / r.bonus) : null, fixExpr: "NULLIF(bonus, 0) — prevent divide-by-zero" },
    { label: "bonus > 3000", fn: (r: any) => r.bonus === null ? null : r.bonus > 3000 ? true : false, fixed: (r: any) => r.bonus === null ? false : r.bonus > 3000, fixExpr: "COALESCE(bonus, 0) > 3000" },
    { label: "COALESCE(bonus,0)", fn: (r: any) => r.bonus !== null ? r.bonus : 0, fixed: (r: any) => r.bonus !== null ? r.bonus : 0, fixExpr: "COALESCE(bonus, 0) ← already the fix" },
  ];

  const active = EXPRESSIONS.find(e => e.label === expr) || EXPRESSIONS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="👆">Click any expression button to test it against the data. Rows with NULL inputs turn red — NULL infected the result. Click <strong>Show fix →</strong> to see the corrected version side by side.</Hint>
      <div>
        <SLabel color={pc}>EXPRESSION — click to test</SLabel>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {EXPRESSIONS.map(e => (
            <button 
              key={e.label} 
              onClick={() => { setExpr(e.label); setShowFix(false); }} 
              style={{ 
                padding: "5px 12px", 
                borderRadius: 8, 
                fontSize: 10, 
                cursor: "pointer", 
                fontFamily: "monospace", 
                border: `1px solid ${expr === e.label ? pc : "rgba(255,255,255,.1)"}`, 
                background: expr === e.label ? `${pc}18` : "transparent", 
                color: expr === e.label ? pc : T.grey, 
                transition: "all .18s" 
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.slate}`, background: "rgba(4,9,20,.9)" }}>
              <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.greyDark }}>name</th>
              <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.greyDark }}>salary</th>
              <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.orange }}>bonus (nullable)</th>
              <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: pc }}>{expr}</th>
              {showFix && <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.green }}>{active.fixExpr}</th>}
            </tr>
          </thead>
          <tbody>
            {DATA.map((row, ri) => {
              const raw = active.fn(row);
              const fixed = active.fixed(row);
              const isNull = raw === null;
              return (
                <tr key={ri} style={{ borderBottom: ri < DATA.length - 1 ? `1px solid ${T.slate}44` : "none", background: isNull ? "rgba(248,113,113,.06)" : "transparent", transition: "background .3s" }}>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{row.name}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{row.salary.toLocaleString()}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: row.bonus === null ? T.orange : T.greyLight, fontStyle: row.bonus === null ? "italic" : "normal", fontWeight: row.bonus === null ? 700 : 400 }}>{row.bonus === null ? "NULL" : row.bonus.toLocaleString()}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: isNull ? T.red : T.green, fontWeight: 700, fontStyle: isNull ? "italic" : "normal" }}>
                    {isNull ? "NULL ← NULL infected result" : typeof raw === "boolean" ? String(raw).toUpperCase() : typeof raw === "number" ? raw.toLocaleString() : String(raw)}
                  </td>
                  {showFix && <td style={{ padding: "5px 10px", fontSize: 10, color: T.green, fontWeight: 700 }}>{fixed === null ? "NULL" : typeof fixed === "boolean" ? String(fixed).toUpperCase() : typeof fixed === "number" ? fixed.toLocaleString() : String(fixed)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {DATA.some(r => active.fn(r) === null) && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.25)", fontSize: 11, color: T.greyLight, flex: 1 }}>
            <strong style={{ color: T.red }}>⚠️ NULL propagation:</strong> rows with NULL bonus produce NULL results. These rows are silently excluded from aggregates like SUM and AVG.
          </div>
          <button onClick={() => setShowFix(!showFix)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${T.green}55`, background: showFix ? `${T.green}18` : "transparent", color: T.green, whiteSpace: "nowrap" }}>
            {showFix ? "← Hide fix" : "Show fix →"}
          </button>
        </div>
      )}
      {showFix && <SQLBlock platform={platform} code={`-- Fix: ${active.fixExpr}\nSELECT name, ${active.fixExpr} AS result\nFROM employees;`} />}
    </div>
  );
}

export default function Module09({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "What NULL means",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={pc}><strong style={{ color: pc }}>NULL</strong> means "unknown value" — not zero, not empty string, not false. It represents the absence of data. This distinction causes most NULL-related bugs.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { val: "NULL", desc: "Unknown — no value", color: T.orange, code: `NULL\n-- salary IS NULL\n-- The person's salary is unknown\n-- Different from salary = 0!` },
                { val: "0", desc: "Known value: zero", color: T.blue, code: `0\n-- salary = 0\n-- The person earns zero\n-- Measurable and definite` },
                { val: "''", desc: "Known value: empty string", color: T.green, code: `''\n-- name = ''\n-- The name IS empty\n-- Not the same as name IS NULL` }
              ].map(i => (
                <div key={i.val} style={{ border: `1px solid ${i.color}33`, borderRadius: 8, padding: "12px", background: `${i.color}08` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: i.color, fontFamily: "'Syne',sans-serif", marginBottom: 4 }}>{i.val}</div>
                  <div style={{ fontSize: 10, color: T.greyLight, marginBottom: 8 }}>{i.desc}</div>
                  <SQLBlock code={i.code} label="SQL" />
                </div>
              ))}
            </div>
            <Tip icon="🧠" title="THREE-VALUED LOGIC" color={pc}>
              SQL comparisons don't just return TRUE or FALSE — they can return <strong style={{ color: T.orange }}>UNKNOWN</strong> when NULL is involved. Only IS NULL and IS NOT NULL can test for NULL directly. WHERE and HAVING only keep rows that evaluate to TRUE — UNKNOWN rows are dropped.
            </Tip>
          </div>
        )
      },
      {
        title: "🛝 NULL propagation explorer",
        content: () => <NullPropagationExplorer platform={platform} />
      },
      {
        title: "NULL functions",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PlatformDiff title="Handling NULL values" diffs={[
              { platform: "mysql", code: `-- Replace NULL with a default:\nCOALESCE(bonus, 0)       -- standard\nIFNULL(bonus, 0)         -- MySQL only\n\n-- Prevent divide-by-zero:\nCOALESCE(NULLIF(divisor, 0), 1)\n\n-- Return NULL if values match:\nNULLIF(a, b)\n-- NULLIF(status,'pending') → NULL\n-- if status='pending'`, note: "IFNULL is MySQL-specific; use COALESCE for portability" },
              { platform: "postgres", code: `-- Standard SQL (works everywhere):\nCOALESCE(bonus, 0)\nNULLIF(a, b)\n\n-- First non-NULL from a list:\nCOALESCE(bonus, commission, 0)\n\n-- PostgreSQL-specific:\n-- NVL not available (Oracle only)\n-- Use COALESCE instead`, note: "COALESCE and NULLIF are ANSI standard" },
              { platform: "sqlserver", code: `-- Standard:\nCOALESCE(bonus, 0)\nNULLIF(a, b)\n\n-- SQL Server specific:\nISNULL(bonus, 0)   -- similar to IFNULL\n-- ISNULL is faster but only 2 args\n-- COALESCE accepts multiple args\n\nSELECT COALESCE(col1, col2, col3, 0)`, note: "ISNULL is SQL Server-specific; COALESCE is portable" },
            ]} />
          </div>
        )
      },
      {
        title: "NULL in aggregates",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={T.orange}><strong style={{ color: T.orange }}>Aggregates silently ignore NULLs.</strong> If 3 of 10 salary rows are NULL, AVG(salary) divides by 7, not 10. COUNT(*) counts all rows; COUNT(col) counts non-NULL rows only.</Note>
            <SQLBlock platform={platform} code={`-- Employees table: 5 rows, 2 NULL bonuses\nSELECT\n  COUNT(*)          AS total_rows,    -- 5\n  COUNT(bonus)      AS non_null_bonus, -- 3 (NULLs skipped)\n  SUM(bonus)        AS sum_bonus,      -- 9000 (NULLs skipped)\n  AVG(bonus)        AS avg_bonus,      -- 3000 = 9000 / 3, NOT / 5!\n  AVG(COALESCE(bonus,0)) AS avg_safe   -- 1800 = 9000 / 5\nFROM employees;`} />
            <Warn>AVG(bonus) with NULLs gives 3000 (average of non-NULL rows). AVG(COALESCE(bonus,0)) gives 1800 (treating NULL as zero). Neither is "wrong" — but they answer different questions. Always be explicit about which you want.</Warn>
          </div>
        )
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { question: "What does NULL + 5 return in SQL?", options: ["5", "0", "NULL", "Error"], correct: 2, explanation: "NULL propagates through arithmetic. Any expression involving NULL returns NULL unless you explicitly handle it with COALESCE or IFNULL." },
            { question: "A table has 10 rows, 3 of which have NULL salary. What does COUNT(*) return?", options: ["7 (skips NULLs)", "10 (counts all rows)", "3 (counts only NULLs)", "Error"], correct: 1, explanation: "COUNT(*) counts all rows regardless of NULL values. COUNT(salary) would return 7 (skips NULLs). This is the key difference between COUNT(*) and COUNT(column)." },
            { type: "bug", question: "A developer expects rows where bonus is unknown. What's wrong?", code: `SELECT name FROM employees\nWHERE bonus = NULL;`, options: ["NULL should be in quotes", "= NULL always returns UNKNOWN, not TRUE — should be IS NULL", "bonus is not nullable", "SELECT * should be used"], correct: 1, explanation: "NULL = NULL evaluates to UNKNOWN, not TRUE. WHERE only keeps rows that evaluate to TRUE, so this query always returns 0 rows. Fix: WHERE bonus IS NULL." },
          ]} />
        )
      },
    ]} />
  );
}
