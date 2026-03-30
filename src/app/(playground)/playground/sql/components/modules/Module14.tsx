'use client';

import React, { useState, useRef } from 'react';
import { T, PLAT } from '../sql-constants';
import { 
  Course, 
  SQLBlock, 
  Note, 
  Tip, 
  Quiz, 
  Hint, 
  SLabel, 
  PlatformDiff 
} from '../sql-shared';

function IndexRaceVisual({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [running, setRunning] = useState(false);
  const [scanStep, setScanStep] = useState(-1);
  const [indexStep, setIndexStep] = useState(-1);
  const [done, setDone] = useState(false);
  const ROWS = 10;
  const TARGET = 7;
  const timer = useRef<any>(null);
  
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setScanStep(-1); setIndexStep(-1); setDone(false); setRunning(true);
    let s = 0;
    timer.current = setInterval(() => {
      s++;
      setScanStep(Math.min(s - 1, ROWS));
      if (s >= 4) setIndexStep(Math.min(s - 4, 2));
      if (s >= ROWS + 2) { clearInterval(timer.current); setDone(true); setRunning(false); }
    }, 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="▶">Click <strong>▶ Race: Full Scan vs Index</strong>. Watch both sides progress simultaneously — the full scan checks every row while the index jumps to the answer in 3 steps.</Hint>
      <button onClick={play} disabled={running} style={{ padding: "7px 20px", borderRadius: 8, fontSize: 10, cursor: running ? "not-allowed" : "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${pc}55`, background: running ? `${pc}06` : `${pc}18`, color: running ? T.grey : pc, alignSelf: "flex-start" }}>
        {running ? "⚡ Racing..." : "▶ Race: Full Scan vs Index"}
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <SLabel color={T.red}>Full Table Scan — WHERE id = {TARGET}</SLabel>
            {done && <span style={{ fontSize: 9, color: T.red, fontFamily: "monospace", fontWeight: 700, background: "rgba(248,113,113,.1)", padding: "2px 7px", borderRadius: 8 }}>{TARGET} reads</span>}
          </div>
          <div style={{ background: "rgba(4,9,20,.85)", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.red}22` }}>
            {Array.from({ length: ROWS }, (_, i) => {
              const checked = scanStep >= i; const found = i === TARGET - 1 && checked;
              return (
                <div key={i} style={{ padding: "5px 12px", borderBottom: i < ROWS - 1 ? `1px solid ${T.slate}33` : "none", display: "flex", gap: 8, alignItems: "center", background: found ? "rgba(74,222,128,.1)" : checked ? "rgba(248,113,113,.06)" : "transparent", transition: "background .2s" }}>
                  <span style={{ fontSize: 9, fontFamily: "monospace", color: checked ? found ? T.green : T.red : T.greyDark, fontWeight: checked ? 700 : 400 }}>id = {i + 1}</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: checked ? found ? T.green : T.greyDark : T.greyDark, fontFamily: "monospace" }}>{found ? "✓ MATCH" : checked ? "✗ skip" : ""}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 5, fontSize: 9, color: T.red, fontFamily: "monospace" }}>{scanStep >= 0 ? `Checked ${Math.min(scanStep + 1, ROWS)}/${ROWS} rows` : ""}</div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <SLabel color={T.green}>B-tree Index — WHERE id = {TARGET}</SLabel>
            {done && <span style={{ fontSize: 9, color: T.green, fontFamily: "monospace", fontWeight: 700, background: "rgba(74,222,128,.1)", padding: "2px 7px", borderRadius: 8 }}>3 reads</span>}
          </div>
          <div style={{ background: "rgba(4,9,20,.85)", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.green}22` }}>
            {[{ label: "Root: [1...10]", desc: `${TARGET} > ${5}? Go right`, active: indexStep >= 0, found: false },
              { label: "Branch: [6,7,8,9,10]", desc: `Found range with ${TARGET}`, active: indexStep >= 1, found: false },
              { label: `Leaf: id=${TARGET} → row`, desc: "Direct pointer to row", active: indexStep >= 2, found: true },
            ].map((node, i) => (
              <div key={i} style={{ padding: "7px 12px", borderBottom: i < 2 ? `1px solid ${T.slate}33` : "none", display: "flex", gap: 8, alignItems: "center", background: node.active ? (node.found ? "rgba(74,222,128,.12)" : "rgba(74,222,128,.05)") : "transparent", transition: "background .2s", marginLeft: i * 16 }}>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: node.active ? T.green : T.greyDark, fontWeight: node.active ? 700 : 400 }}>{node.label}</span>
                {node.active && <span style={{ marginLeft: "auto", fontSize: 8, color: node.found ? T.green : T.greyLight, fontFamily: "monospace" }}>{node.desc}</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5, fontSize: 9, color: T.green, fontFamily: "monospace" }}>{indexStep >= 0 ? `Traversed ${Math.min(indexStep + 1, 3)}/3 nodes` : ""}</div>
        </div>
      </div>
      {done && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, animation: "popIn .3s ease" }}>
          <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.25)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.red, fontFamily: "'Syne',sans-serif" }}>{TARGET} reads</div>
            <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginTop: 2 }}>FULL SCAN — O(n)</div>
            <div style={{ fontSize: 9, color: T.greyLight, marginTop: 4 }}>Grows with table size. 10M rows = 10M reads.</div>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.25)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.green, fontFamily: "'Syne',sans-serif" }}>3 reads</div>
            <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginTop: 2 }}>INDEX — O(log n)</div>
            <div style={{ fontSize: 9, color: T.greyLight, marginTop: 4 }}>10M rows = ~23 reads. Barely changes.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExplainVisual({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const plans = [
    { sql: `SELECT * FROM employees WHERE id = 5;`, type: "Index Seek", cost: "low", rows: 1, notes: "Primary key lookup — extremely fast. Direct access." },
    { sql: `SELECT * FROM employees WHERE city = 'Lagos';`, type: "Full Table Scan", cost: "high", rows: 10, notes: "No index on 'city'. All 10 rows scanned to find matches." },
    { sql: `SELECT * FROM employees\nWHERE LOWER(name) = 'bola adeyemi';`, type: "Full Table Scan", cost: "high", rows: 10, notes: "Function on indexed column defeats the index. The function must run on every row." },
    { sql: `SELECT * FROM employees\nWHERE name = 'Bola Adeyemi';`, type: "Index Seek", cost: "low", rows: 1, notes: "No function wrapping — index on name can be used." },
  ];
  const [sel, setSel] = useState(0);
  const active = plans[sel];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Hint icon="👆">Click any query in the list to see its execution plan. <strong style={{ color: T.green }}>Green = fast (index seek)</strong>. <strong style={{ color: T.red }}>Red = slow (full table scan)</strong>. Compare queries 3 and 4 to see how wrapping a column in a function defeats an index.</Hint>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {plans.map((p, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding: "8px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer", border: `1px solid ${sel === i ? pc : T.slate}`, background: sel === i ? `${pc}10` : "rgba(255,255,255,.02)", transition: "all .2s" }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: T.greyLight }}>{p.sql.split("\n")[0]}{p.sql.includes("\n") ? "..." : ""}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
              <span style={{ fontSize: 8, fontFamily: "monospace", color: p.cost === "low" ? T.green : T.red, fontWeight: 700 }}>{p.type}</span>
              <span style={{ fontSize: 8, color: T.greyDark }}>~{p.rows} row{p.rows !== 1 ? "s" : ""} examined</span>
            </div>
          </button>
        ))}
      </div>
      <div style={{ border: `1px solid ${active.cost === "low" ? T.green : T.red}44`, borderRadius: 10, padding: "12px 14px", background: active.cost === "low" ? "rgba(74,222,128,.06)" : "rgba(248,113,113,.06)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>{active.cost === "low" ? "⚡" : "🐢"}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: active.cost === "low" ? T.green : T.red }}>{active.type}</span>
          <span style={{ fontSize: 9, fontFamily: "monospace", color: T.greyDark, marginLeft: "auto" }}>rows examined: {active.rows}</span>
        </div>
        <SQLBlock code={active.sql} platform={platform} />
        <div style={{ marginTop: 8, fontSize: 11, color: T.greyLight, lineHeight: 1.65 }}>{active.notes}</div>
      </div>
      <PlatformDiff title="EXPLAIN syntax" diffs={[
        { platform: "mysql", code: `EXPLAIN SELECT * FROM employees\nWHERE city = 'Lagos';\n\n-- More detail:\nEXPLAIN ANALYZE\nSELECT * FROM employees\nWHERE city = 'Lagos';`, note: "EXPLAIN ANALYZE available in MySQL 8.0+" },
        { platform: "postgres", code: `EXPLAIN SELECT * FROM employees\nWHERE city = 'Lagos';\n\n-- Full execution details:\nEXPLAIN ANALYZE\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Shows actual rows, actual time`, note: "EXPLAIN ANALYZE actually executes the query" },
        { platform: "sqlserver", code: `-- SQL Server: display estimated plan\nSET SHOWPLAN_ALL ON;\nSELECT * FROM employees\nWHERE city = 'Lagos';\nSET SHOWPLAN_ALL OFF;\n\n-- Or use SSMS: Ctrl+L for estimated plan\n-- Ctrl+M for actual plan`, note: "SQL Server Management Studio has visual plan viewer" },
      ]} />
    </div>
  );
}

export default function Module14({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "How indexes work",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={pc}>An index is a separate data structure that speeds up row lookups. Without one, every query scans every row. With one, the engine jumps directly to the matching rows using a B-tree traversal.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><SLabel color={T.red}>No index — full scan</SLabel><SQLBlock platform={platform} code={`-- No index on city:\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Engine reads ALL 10 rows to find matches\n-- On 10 million rows: reads 10 million rows`} /></div>
              <div><SLabel color={T.green}>With index — fast lookup</SLabel><SQLBlock platform={platform} code={`-- Create index first:\nCREATE INDEX idx_city ON employees(city);\n\n-- Same query, now uses index:\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Engine traverses B-tree: ~log2(10M) = 23 steps`} /></div>
            </div>
            <Tip icon="🔑" title="PRIMARY KEY = AUTO INDEX" color={pc}>Primary keys automatically create a unique clustered index. You don't need to manually create an index on id. Create indexes on columns you filter (WHERE), join (ON), or sort (ORDER BY) frequently.</Tip>
          </div>
        )
      },
      {
        title: "🛝 Index race",
        content: () => <IndexRaceVisual platform={platform} />
      },
      {
        title: "🔍 Query plans",
        content: () => <ExplainVisual platform={platform} />
      },
      {
        title: "Index creation syntax",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PlatformDiff title="CREATE INDEX" diffs={[
              { platform: "mysql", code: `-- Single column:\nCREATE INDEX idx_city\n  ON employees(city);\n\n-- Composite (multi-column):\nCREATE INDEX idx_dept_sal\n  ON employees(dept, salary);\n\n-- Unique:\nCREATE UNIQUE INDEX idx_email\n  ON employees(email);\n\n-- Drop:\nDROP INDEX idx_city ON employees;`, note: "MySQL composite: put most selective column first" },
              { platform: "postgres", code: `-- Standard:\nCREATE INDEX idx_city ON employees(city);\n\n-- Concurrent (no table lock!):\nCREATE INDEX CONCURRENTLY idx_city\n  ON employees(city);\n\n-- Partial index (only active employees):\nCREATE INDEX idx_active\n  ON employees(name)\n  WHERE active = 1;\n\n-- Drop:\nDROP INDEX idx_city;`, note: "PostgreSQL partial indexes are very efficient for filtered queries" },
              { platform: "sqlserver", code: `-- Standard:\nCREATE INDEX idx_city\n  ON employees(city);\n\n-- With INCLUDE (covers the query):\nCREATE INDEX idx_dept_covering\n  ON employees(dept)\n  INCLUDE (name, salary);\n-- No key lookup needed if SELECT only\n-- uses dept, name, salary\n\n-- Drop:\nDROP INDEX employees.idx_city;`, note: "SQL Server INCLUDE columns make 'covering indexes' — fastest possible reads" },
            ]} />
          </div>
        )
      },
      {
        title: "When NOT to index",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={T.orange}>More indexes ≠ faster database. Every index must be maintained on INSERT, UPDATE, and DELETE — slowing writes. Over-indexing is a common performance trap.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { header: "CREATE indexes on", color: T.green, icon: "✓", items: ["Columns in WHERE clauses (high-cardinality)", "JOIN ON columns (foreign keys especially)", "ORDER BY columns in slow queries", "Columns in GROUP BY on large tables"] },
                { header: "DON'T index", color: T.red, icon: "✗", items: ["Tiny tables (< 1,000 rows) — scan is faster", "Boolean/low-cardinality columns (active, gender)", "Columns rarely used in queries", "Every column by default (storage + write overhead)"] },
              ].map(g => (
                <div key={g.header} style={{ border: `1px solid ${g.color}33`, borderRadius: 8, padding: "12px 14px", background: `${g.color}07` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: g.color, fontFamily: "monospace", marginBottom: 8 }}>{g.icon} {g.header}</div>
                  {g.items.map((it, i) => <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}><span style={{ color: g.color, flexShrink: 0 }}>{g.icon}</span><span style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.5 }}>{it}</span></div>)}
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { type: "bug", question: "This query is slow on a 1M-row table. What's the problem?", code: `SELECT * FROM employees\nWHERE UPPER(name) = 'BOLA ADEYEMI';`, options: ["UPPER is wrong function — use LOWER", "UPPER() wraps the indexed column, preventing index use — index becomes useless", "Missing semicolon", "name column can't be indexed"], correct: 1, explanation: "Applying a function to an indexed column forces a full scan because the index stores original values, not UPPER(name). Fix: store data in consistent case (UPPER or lower), use a function-based index (PostgreSQL/Oracle), or filter by exact case: WHERE name = 'Bola Adeyemi'." },
            { question: "You add indexes on 15 columns of a busy write-heavy table. The read queries speed up but what happens to writes?", options: ["Writes also speed up", "Nothing — indexes only affect reads", "Writes slow down because every INSERT/UPDATE/DELETE must maintain all 15 indexes", "The database runs out of storage"], correct: 2, explanation: "Every index adds overhead to write operations. An INSERT must update all 15 index structures. On a write-heavy table, over-indexing can make INSERT/UPDATE 10x slower. The right number of indexes balances read speed against write cost." },
          ]} />
        )
      },
    ]} />
  );
}
