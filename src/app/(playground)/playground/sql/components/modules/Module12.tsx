'use client';

import React, { useState } from 'react';
import { T, PLAT } from '../sql-constants';
import { 
  Course, 
  SQLBlock, 
  Quiz, 
  Hint, 
  PlatformDiff 
} from '../sql-shared';

function FunctionTransformer({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [category, setCategory] = useState("string");
  const [input, setInput] = useState("Hello Lagos!");
  const [dateInput, setDateInput] = useState("2024-03-15");
  
  const stringFns = [
    { name: "UPPER(x)", fn: (s: string) => s.toUpperCase(), desc: "Converts to uppercase" },
    { name: "LOWER(x)", fn: (s: string) => s.toLowerCase(), desc: "Converts to lowercase" },
    { name: "LENGTH(x)", fn: (s: string) => s.length, desc: "Number of characters" },
    { name: "TRIM(x)", fn: (s: string) => s.trim(), desc: "Remove leading/trailing spaces" },
    { name: "SUBSTRING(x,1,5)", fn: (s: string) => s.substring(0, 5), desc: "First 5 characters" },
    { name: "REPLACE(x,'a','@')", fn: (s: string) => s.replace(/a/gi, "@"), desc: "Replace 'a' with '@'" },
    { name: "CONCAT(x,' World')", fn: (s: string) => s + " World", desc: "Append text" },
    { name: "REVERSE(x)", fn: (s: string) => s.split("").reverse().join(""), desc: "Reverses the string" },
  ];
  
  const dateFns = [
    { name: "YEAR(x)", fn: (d: string) => { try { return new Date(d).getFullYear(); } catch { return "invalid"; } }, desc: "Extract year" },
    { name: "MONTH(x)", fn: (d: string) => { try { return new Date(d).getMonth() + 1; } catch { return "invalid"; } }, desc: "Extract month (1-12)" },
    { name: "DAY(x)", fn: (d: string) => { try { return new Date(d).getDate(); } catch { return "invalid"; } }, desc: "Extract day of month" },
    { name: "DATEDIFF(NOW(),x)", fn: (d: string) => { try { const diff = Math.floor((Date.now() - new Date(d).getTime()) / (86400000)); return `${diff} days`; } catch { return "invalid"; } }, desc: "Days from date to now" },
    { name: "DATE_FORMAT(x,'%M %Y')", fn: (d: string) => { try { return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }); } catch { return "invalid"; } }, desc: "Format as 'Month Year'" },
  ];
  
  const fns = category === "string" ? stringFns : dateFns;
  const val = category === "string" ? input : dateInput;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="⌨️">Type any text or date in the input box — every function card updates instantly. Switch between <strong>STRING</strong> and <strong>DATE</strong> modes to explore different function families.</Hint>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, background: T.surface, padding: 3, borderRadius: 9, border: `1px solid ${T.slate}` }}>
          {["string", "date"].map(c => <button key={c} onClick={() => setCategory(c)} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: category === c ? `${pc}22` : "transparent", color: category === c ? pc : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}>{c.toUpperCase()}</button>)}
        </div>
        <input value={category === "string" ? input : dateInput} onChange={e => category === "string" ? setInput(e.target.value) : setDateInput(e.target.value)} style={{ flex: 1, padding: "6px 12px", borderRadius: 8, border: `1px solid ${pc}44`, background: T.bg, color: pc, fontSize: 11, fontFamily: "monospace", outline: "none" }} placeholder={category === "string" ? "Enter any text..." : "YYYY-MM-DD"} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {fns.map(f => {
          let result; try { result = f.fn(val); } catch { result = "error"; }
          return (
            <div key={f.name} style={{ background: T.surface, border: `1px solid ${T.slate}`, borderRadius: 9, padding: "10px 12px" }}>
              <code style={{ fontSize: 10, color: pc, fontFamily: "monospace", fontWeight: 700, display: "block", marginBottom: 3 }}>{f.name}</code>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.white, fontFamily: "'Syne',sans-serif", marginBottom: 3 }}>{result === null ? "NULL" : String(result)}</div>
              <div style={{ fontSize: 9, color: T.greyDark, lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Module12({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "🛝 Live function transformer",
        content: () => <FunctionTransformer platform={platform} />
      },
      {
        title: "String functions reference",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PlatformDiff title="String function differences" diffs={[
              { platform: "mysql", code: `-- MySQL uses backticks, accepts '':\nSELECT SUBSTRING(name, 1, 3) AS short\nFROM employees;\n-- MySQL: SUBSTRING or SUBSTR\n\nSELECT CONCAT(first, ' ', last) AS full;\n-- Also: CONCAT_WS(' ', first, last)\n-- CONCAT_WS: separator, null-safe\n\nSELECT LENGTH('café'); -- returns 5 bytes\nSELECT CHAR_LENGTH('café'); -- 4 chars` },
              { platform: "postgres", code: `-- PostgreSQL:\nSELECT SUBSTRING(name FROM 1 FOR 3);\n-- Or: SUBSTR(name, 1, 3)\n\n-- String ||  operator:\nSELECT first || ' ' || last AS full;\n\n-- Regex:\nSELECT REGEXP_REPLACE(name, '[aeiou]','*');\n\n-- Standard LENGTH returns char count` },
              { platform: "sqlserver", code: `-- SQL Server:\nSELECT SUBSTRING(name, 1, 3) AS short;\n-- No SUBSTR alias\n\n-- Concatenation:\nSELECT first + ' ' + last AS full;\n-- Or: CONCAT(first, ' ', last)\n\nSELECT LEN(name); -- LEN not LENGTH\nSELECT FORMAT(salary, 'N2'); -- number fmt` },
            ]} />
          </div>
        )
      },
      {
        title: "Date functions reference",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PlatformDiff title="Date function differences" diffs={[
              { platform: "mysql", code: `-- Current timestamp:\nNOW()         -- datetime\nCURDATE()     -- date only\nCURTIME()     -- time only\n\n-- Arithmetic:\nDATE_ADD('2024-01-15', INTERVAL 30 DAY)\nDATE_SUB('2024-01-15', INTERVAL 1 MONTH)\nDATEDIFF('2024-12-31', '2024-01-01')\n-- Returns: 365\n\n-- Format:\nDATE_FORMAT(NOW(), '%d %b %Y')` },
              { platform: "postgres", code: `-- Current timestamp:\nNOW()           -- with timezone\nCURRENT_DATE    -- date (no parentheses!)\nCURRENT_TIME    -- time\n\n-- Arithmetic with INTERVAL:\n'2024-01-15'::date + INTERVAL '30 days'\n\n-- Extract:\nEXTRACT(YEAR FROM NOW())\nEXTRACT(DOW FROM NOW()) -- 0=Sunday\n\n-- Format:\nTO_CHAR(NOW(), 'DD Mon YYYY')` },
              { platform: "sqlserver", code: `-- Current timestamp:\nGETDATE()       -- local\nGETUTCDATE()    -- UTC\nSYSDATETIME()   -- higher precision\n\n-- Arithmetic:\nDATEADD(DAY, 30, '2024-01-15')\nDATEDIFF(DAY, '2024-01-01', '2024-12-31')\n-- Returns: 365\n\n-- Format:\nFORMAT(GETDATE(), 'dd MMM yyyy')\nCONVERT(varchar, GETDATE(), 103) -- UK` },
            ]} />
          </div>
        )
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { type: "bug", question: "A developer wants the first 4 characters of every name but only MySQL returned results. What's wrong?", code: `SELECT SUBSTR(name, 1, 4) FROM employees;`, options: ["SUBSTR needs 2 arguments not 3", "SQL Server uses SUBSTRING, not SUBSTR — SUBSTR is MySQL/PostgreSQL only", "MySQL doesn't support SUBSTR", "The start index should be 0"], correct: 1, explanation: "SUBSTR is supported in MySQL and PostgreSQL but not SQL Server. SQL Server uses SUBSTRING(col, start, length). Always use SUBSTRING for cross-platform compatibility." },
            { question: "You need to find employees hired in 2021 using a WHERE clause. Which is most portable?", options: ["WHERE hired = 2021", "WHERE YEAR(hired) = 2021", "WHERE hired BETWEEN '2021-01-01' AND '2021-12-31'", "WHERE FORMAT(hired,'yyyy') = '2021'"], correct: 2, explanation: "BETWEEN with explicit dates is most portable across all platforms. YEAR() works in MySQL and SQL Server but not PostgreSQL (use EXTRACT). FORMAT is SQL Server-specific. The BETWEEN approach also uses indexes more effectively." },
          ]} />
        )
      },
    ]} />
  );
}
