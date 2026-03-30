'use client';

import React, { useState } from 'react';
import { T, PLAT } from '../sql-constants';
import { 
  Course, 
  SQLBlock, 
  Note, 
  Warn, 
  Quiz, 
  Hint, 
  PlatformDiff 
} from '../sql-shared';

function DMLVisual({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [op, setOp] = useState<"INSERT" | "UPDATE" | "DELETE">("INSERT");
  const INITIAL = [
    { id: 1, name: "Amara Osei", dept: "Engineering", salary: 85000, status: "stable" },
    { id: 2, name: "Bola Adeyemi", dept: "Analytics", salary: 72000, status: "stable" },
    { id: 3, name: "Chidi Nwosu", dept: "Engineering", salary: 91000, status: "stable" },
    { id: 4, name: "Dami Afolabi", dept: "Product", salary: 68000, status: "stable" },
    { id: 5, name: "Efe Okonkwo", dept: "Analytics", salary: 75000, status: "stable" },
  ];
  const [rows, setRows] = useState(INITIAL.map(r => ({ ...r })));
  const [staged, setStaged] = useState<any>(null);
  const [phase, setPhase] = useState(0);
  
  const reset = () => { setRows(INITIAL.map(r => ({ ...r }))); setStaged(null); setPhase(0); };
  
  const ops: Record<string, any> = {
    INSERT: { color: T.blue, sql: `INSERT INTO employees (id, name, dept, salary)\nVALUES (6, 'Funke Balogun', 'Engineering', 88000);`, action: () => { setStaged({ id: 6, name: "Funke Balogun", dept: "Engineering", salary: 88000, status: "new" }); setPhase(1); } },
    UPDATE: { color: T.yellow, sql: `UPDATE employees\nSET salary = salary * 1.10\nWHERE dept = 'Analytics';\n-- Affects 2 rows`, action: () => { setRows(r => r.map(e => e.dept === "Analytics" ? { ...e, salary: Math.round(e.salary * 1.1), status: "updated" } : e)); setPhase(1); } },
    DELETE: { color: T.red, sql: `DELETE FROM employees\nWHERE id = 4;\n-- Dami Afolabi — inactive`, action: () => { setRows(r => r.map(e => e.id === 4 ? { ...e, status: "deleted" } : e)); setPhase(1); } },
  };
  
  const active = ops[op];
  
  const commit = () => {
    if (op === "INSERT" && staged) { setRows(r => [...r, staged]); setStaged(null); }
    if (op === "DELETE") { setRows(r => r.filter(e => e.status !== "deleted")); }
    if (op === "UPDATE") { setRows(r => r.map(e => ({ ...e, status: e.status === "updated" ? "stable" : e.status }))); }
    setPhase(2);
  };
  
  const rowColor = (r: any) => {
    if (r.status === "new") return { bg: "rgba(96,165,250,.15)", border: `1px solid ${T.blue}55`, text: T.blue };
    if (r.status === "updated") return { bg: "rgba(250,204,21,.1)", border: `1px solid ${T.yellow}55`, text: T.yellow };
    if (r.status === "deleted") return { bg: "rgba(248,113,113,.1)", border: `1px solid ${T.red}55`, text: T.red };
    return { bg: "transparent", border: "none", text: T.greyLight };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">Pick INSERT, UPDATE, or DELETE. Click <strong>▶ Stage</strong> to preview the change (rows glow). Then choose <strong>✓ COMMIT</strong> to apply permanently or <strong>↩ ROLLBACK</strong> to undo.</Hint>
      <div style={{ display: "flex", gap: 5 }}>
        {["INSERT", "UPDATE", "DELETE"].map(o => (
          <button 
            key={o} 
            onClick={() => { setOp(o as any); reset(); }} 
            style={{ 
              flex: 1, 
              padding: "8px", 
              borderRadius: 8, 
              fontSize: 10, 
              cursor: "pointer", 
              fontFamily: "monospace", 
              fontWeight: 700, 
              border: `1px solid ${op === o ? ops[o].color : "rgba(255,255,255,.08)"}`, 
              background: op === o ? `${ops[o].color}14` : "rgba(255,255,255,.03)", 
              color: op === o ? ops[o].color : T.grey, 
              transition: "all .2s" 
            }}
          >
            {o}
          </button>
        ))}
      </div>
      <SQLBlock code={active.sql} platform={platform} />
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${T.slate}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.slate}`, background: "rgba(4,9,20,.9)" }}>
              {["id", "name", "dept", "salary", "change"].map(c => <th key={c} style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, color: T.greyDark, fontWeight: 700 }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const sc = rowColor(r);
              return (
                <tr key={r.id} style={{ borderBottom: `1px solid ${T.slate}44`, background: sc.bg, transition: "all .4s", opacity: r.status === "deleted" ? .5 : 1 }}>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyDark }}>{r.id}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: sc.text, fontWeight: r.status !== "stable" ? 700 : 400, textDecoration: r.status === "deleted" ? "line-through" : "none" }}>{r.name}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{r.dept}</td>
                  <td style={{ padding: "5px 10px", fontSize: 10, color: r.status === "updated" ? T.yellow : T.greyLight, fontWeight: r.status === "updated" ? 700 : 400 }}>{r.salary.toLocaleString()}</td>
                  <td style={{ padding: "5px 10px", fontSize: 9, fontFamily: "monospace", color: sc.text, fontWeight: 700 }}>
                    {r.status === "new" ? "⬆ INSERT" : r.status === "updated" ? "✏ UPDATE" : r.status === "deleted" ? "✗ DELETE" : ""}
                  </td>
                </tr>
              );
            })}
            {op === "INSERT" && staged && phase === 1 && (
              <tr style={{ borderBottom: `1px solid ${T.slate}44`, background: "rgba(96,165,250,.12)", animation: "rowAppear .3s ease" }}>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyDark }}>{staged.id}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.blue, fontWeight: 700 }}>{staged.name}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.greyLight }}>{staged.dept}</td>
                <td style={{ padding: "5px 10px", fontSize: 10, color: T.blue, fontWeight: 700 }}>{staged.salary.toLocaleString()}</td>
                <td style={{ padding: "5px 10px", fontSize: 9, fontFamily: "monospace", color: T.blue, fontWeight: 700 }}>⬆ STAGED</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: "4px 10px", fontSize: 8, color: T.greyDark, fontFamily: "monospace", borderTop: `1px solid ${T.slate}44` }}>{rows.length}{staged ? " + 1 staged" : ""} rows</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {phase === 0 && <button onClick={active.action} style={{ padding: "7px 18px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${active.color}55`, background: `${active.color}14`, color: active.color }}>▶ Stage {op}</button>}
        {phase === 1 && (
          <>
            <button onClick={commit} style={{ padding: "7px 18px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${T.green}55`, background: `${T.green}14`, color: T.green }}>✓ COMMIT</button>
            <button onClick={reset} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${T.red}55`, background: `${T.red}08`, color: T.red }}>↩ ROLLBACK</button>
          </>
        )}
        {phase === 2 && <button onClick={reset} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 10, cursor: "pointer", fontFamily: "monospace", border: `1px solid ${T.slate}`, background: "transparent", color: T.grey }}>↩ Reset</button>}
      </div>
    </div>
  );
}

export default function Module11({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "INSERT",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={T.blue}>INSERT adds new rows to a table. You can insert one row at a time or multiple rows in a single statement.</Note>
            <PlatformDiff title="INSERT syntax" diffs={[
              { platform: "mysql", code: `-- Single row:\nINSERT INTO employees (name, dept, salary)\nVALUES ('Funke Balogun', 'Engineering', 88000);\n\n-- Multiple rows:\nINSERT INTO employees (name, dept, salary)\nVALUES\n  ('Grace M.', 'Product', 71000),\n  ('Henry E.', 'Analytics', 69000);\n\n-- From SELECT:\nINSERT INTO archive_emp\nSELECT * FROM employees\nWHERE active = 0;` },
              { platform: "postgres", code: `-- INSERT ... RETURNING (gets inserted values):\nINSERT INTO employees (name, dept, salary)\nVALUES ('Funke Balogun', 'Engineering', 88000)\nRETURNING id, name;\n-- Returns the new row's generated id\n-- Extremely useful for getting auto-increment id` },
              { platform: "sqlserver", code: `-- OUTPUT clause (like RETURNING):\nINSERT INTO employees (name, dept, salary)\nOUTPUT INSERTED.id, INSERTED.name\nVALUES ('Funke Balogun', 'Engineering', 88000);\n\n-- Insert from SELECT:\nINSERT INTO archive_emp\nSELECT * FROM employees WHERE active = 0;` },
            ]} />
          </div>
        )
      },
      {
        title: "UPDATE",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={T.yellow}>UPDATE modifies existing rows. <strong style={{ color: T.red }}>Always use a WHERE clause</strong> — without one, every row in the table is updated.</Note>
            <SQLBlock platform={platform} code={`-- ALWAYS check your WHERE before running!\nSELECT * FROM employees WHERE dept = 'Analytics';\n-- Looks right? Then run:\nUPDATE employees\nSET salary = salary * 1.10,\n    dept   = 'Data Analytics'\nWHERE dept = 'Analytics';\n\n-- Multi-table UPDATE (MySQL):\nUPDATE employees e\nJOIN departments d ON e.dept_id = d.id\nSET e.salary = e.salary * 1.1\nWHERE d.budget > 1000000;`} />
            <Warn>In MySQL and SQL Server, UPDATE without WHERE updates every row silently. PostgreSQL raises a warning if no rows are affected. A common safety practice: SELECT first with the same WHERE, then UPDATE.</Warn>
          </div>
        )
      },
      {
        title: "DELETE & TRUNCATE",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PlatformDiff title="DELETE vs TRUNCATE" diffs={[
              { platform: "mysql", code: `-- DELETE: row-by-row, WHERE supported\nDELETE FROM employees WHERE id = 4;\n-- Check first:\n-- SELECT * FROM employees WHERE id=4;\n\n-- TRUNCATE: removes all rows, no WHERE\nTRUNCATE TABLE employees;\n-- Resets auto-increment counter\n-- Cannot be rolled back in MySQL!`, note: "MySQL TRUNCATE cannot be rolled back — use DELETE for rollback safety" },
              { platform: "postgres", code: `-- DELETE: transactional and rollback-safe\nDELETE FROM employees WHERE id = 4;\n\n-- DELETE ... RETURNING:\nDELETE FROM employees WHERE active = 0\nRETURNING id, name; -- shows deleted rows\n\n-- TRUNCATE: fast full wipe\nTRUNCATE TABLE employees;\n-- Can be rolled back in PostgreSQL`, note: "PostgreSQL TRUNCATE can be rolled back within a transaction" },
              { platform: "sqlserver", code: `-- DELETE:\nDELETE FROM employees WHERE id = 4;\n\n-- Check count first:\nSELECT COUNT(*) FROM employees WHERE id=4;\n\n-- TRUNCATE: full wipe\nTRUNCATE TABLE employees;\n-- Faster than DELETE, no logging per row`, note: "SQL Server TRUNCATE resets identity columns" },
            ]} />
          </div>
        )
      },
      {
        title: "🛝 DML visual",
        content: () => <DMLVisual platform={platform} />
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { question: "You run UPDATE employees SET salary = 100000; (no WHERE). What happens?", options: ["Error — WHERE is required", "Every row in employees gets salary = 100000", "Only the first row is updated", "Only NULL salary rows are updated"], correct: 1, explanation: "UPDATE without WHERE modifies every row in the table. This is a common and very damaging mistake. Always run a SELECT with the same WHERE condition first, then UPDATE." },
            { question: "What is the key difference between DELETE and TRUNCATE?", options: ["DELETE removes one row, TRUNCATE removes all", "DELETE supports WHERE and is transactional; TRUNCATE is faster but removes all rows and may not support rollback", "DELETE is DDL, TRUNCATE is DML", "TRUNCATE only works on empty tables"], correct: 1, explanation: "DELETE is row-by-row (logged, supports WHERE, fully transactional). TRUNCATE is a bulk operation (minimal logging, no WHERE, resets identity — and in MySQL cannot be rolled back)." },
          ]} />
        )
      },
    ]} />
  );
}
