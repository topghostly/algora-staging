'use client';

import React, { useState } from 'react';
import { T, PLAT } from '../sql-constants';
import { 
  Course, 
  SQLBlock, 
  Note, 
  Quiz, 
  Hint, 
  PlatformDiff 
} from '../sql-shared';

function TransactionTimeline({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState<"commit" | "rollback">("commit");
  
  const INITIAL_BALANCE_A = 5000;
  const INITIAL_BALANCE_B = 3000;
  const TRANSFER = 1500;
  
  const STEPS = [
    { label: "BEGIN", icon: "▶", desc: "Transaction starts. A savepoint for rollback." },
    { label: "UPDATE A", icon: "↓", desc: "Deduct $1,500 from Account A" },
    { label: "UPDATE B", icon: "↑", desc: "Add $1,500 to Account B" },
    { label: "COMMIT / ROLLBACK", icon: "✓", desc: "Finalize or undo all changes" },
  ];
  
  const balA = [INITIAL_BALANCE_A, INITIAL_BALANCE_A - TRANSFER, INITIAL_BALANCE_A - TRANSFER];
  const balB = [INITIAL_BALANCE_B, INITIAL_BALANCE_B, INITIAL_BALANCE_B + TRANSFER];
  
  const currentA = mode === "rollback" && phase >= 3 ? INITIAL_BALANCE_A : balA[Math.min(phase, 2)];
  const currentB = mode === "rollback" && phase >= 3 ? INITIAL_BALANCE_B : balB[Math.min(phase, 2)];
  
  const changedA = phase >= 1 && (mode === "commit" || phase < 3);
  const changedB = phase >= 2 && (mode === "commit" || phase < 3);
  
  const sql = mode === "commit"
    ? `BEGIN;\n\nUPDATE accounts SET balance = balance - ${TRANSFER}\nWHERE account_id = 'A';\n-- A: ${INITIAL_BALANCE_A} → ${INITIAL_BALANCE_A - TRANSFER}\n\nUPDATE accounts SET balance = balance + ${TRANSFER}\nWHERE account_id = 'B';\n-- B: ${INITIAL_BALANCE_B} → ${INITIAL_BALANCE_B + TRANSFER}\n\nCOMMIT; -- both changes written permanently`
    : `BEGIN;\n\nUPDATE accounts SET balance = balance - ${TRANSFER}\nWHERE account_id = 'A';\n-- A changes in memory...\n\n-- ⚠️ Error detected / change of mind:\n\nROLLBACK; -- both changes undone\n-- A returns to ${INITIAL_BALANCE_A}\n-- B returns to ${INITIAL_BALANCE_B}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hint icon="👆">Choose <strong>COMMIT</strong> or <strong>ROLLBACK</strong> mode above, then click <strong>Next →</strong> to step through the bank transfer. Watch balances change. At the final step, COMMIT locks changes permanently; ROLLBACK undoes everything.</Hint>
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ display: "flex", gap: 4, background: T.surface, padding: 3, borderRadius: 9, border: `1px solid ${T.slate}` }}>
          <button onClick={() => { setMode("commit"); setPhase(0); }} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: mode === "commit" ? `${T.green}22` : "transparent", color: mode === "commit" ? T.green : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}>COMMIT</button>
          <button onClick={() => { setMode("rollback"); setPhase(0); }} style={{ padding: "4px 14px", borderRadius: 7, border: "none", background: mode === "rollback" ? `${T.red}22` : "transparent", color: mode === "rollback" ? T.red : T.grey, fontSize: 10, cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}>ROLLBACK</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ label: "Account A", init: INITIAL_BALANCE_A, cur: currentA, changed: changedA },
            { label: "Account B", init: INITIAL_BALANCE_B, cur: currentB, changed: changedB }].map(acc => (
            <div key={acc.label} style={{ border: `1px solid ${acc.changed ? (mode === "rollback" && phase >= 3 ? T.red : T.yellow) : T.slate}`, borderRadius: 10, padding: "12px", background: acc.changed ? (mode === "rollback" && phase >= 3 ? "rgba(248,113,113,.07)" : "rgba(250,204,21,.07)") : "rgba(255,255,255,.02)", transition: "all .4s" }}>
              <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginBottom: 4 }}>{acc.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: acc.changed ? (mode === "rollback" && phase >= 3 ? T.red : T.yellow) : T.greyLight, fontFamily: "'Syne',sans-serif", transition: "color .4s" }}>${acc.cur.toLocaleString()}</div>
              {acc.changed && phase < 3 && <div style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace", marginTop: 2 }}>was ${acc.init.toLocaleString()} — in-memory only</div>}
              {acc.changed && mode === "commit" && phase >= 3 && <div style={{ fontSize: 9, color: T.green, fontFamily: "monospace", marginTop: 2 }}>✓ committed</div>}
              {acc.changed && mode === "rollback" && phase >= 3 && <div style={{ fontSize: 9, color: T.red, fontFamily: "monospace", marginTop: 2 }}>↩ rolled back</div>}
            </div>
          ))}
          <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.02)", border: `1px solid ${T.slate}`, fontSize: 9, color: T.greyDark, fontFamily: "monospace" }}>
            Total: ${(currentA + currentB).toLocaleString()} {(currentA + currentB === INITIAL_BALANCE_A + INITIAL_BALANCE_B) ? "✓ consistent" : "✓ consistent"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STEPS.map((s, i) => {
            const done = phase > i; const active2 = phase === i;
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: i > phase + 1 ? .2 : 1, transition: "opacity .3s" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${done ? (mode === "rollback" && i === 3 ? T.red : T.green) : active2 ? pc : T.slate}`, background: done ? (mode === "rollback" && i === 3 ? "rgba(248,113,113,.1)" : "rgba(74,222,128,.1)") : active2 ? `${pc}14` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .4s", fontSize: 14 }}>
                  {done ? (mode === "rollback" && i === 3 ? "↩" : "✓") : <span style={{ fontSize: 9, color: active2 ? pc : T.greyDark, fontFamily: "monospace" }}>{s.icon}</span>}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: done ? T.green : active2 ? pc : T.greyDark, fontFamily: "monospace", transition: "color .3s" }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: T.greyDark }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <button onClick={() => setPhase(p => Math.max(0, p - 1))} disabled={phase === 0} style={{ padding: "5px 12px", borderRadius: 7, fontSize: 9, cursor: phase === 0 ? "not-allowed" : "pointer", fontFamily: "monospace", border: `1px solid ${T.slate}`, background: "transparent", color: phase === 0 ? T.greyDark : T.grey }}>← Back</button>
            <button onClick={() => setPhase(p => Math.min(3, p + 1))} disabled={phase === 3} style={{ padding: "5px 14px", borderRadius: 7, fontSize: 9, cursor: phase === 3 ? "not-allowed" : "pointer", fontFamily: "monospace", border: `1px solid ${phase === 3 ? T.slate : pc}44`, background: phase === 3 ? "transparent" : `${pc}14`, color: phase === 3 ? T.greyDark : pc }}>{phase === 2 ? mode === "commit" ? "COMMIT ✓" : "ROLLBACK ↩" : "Next →"}</button>
          </div>
        </div>
        <div><SQLBlock code={sql} platform={platform} /></div>
      </div>
    </div>
  );
}

export default function Module13({ platform }: { platform: string }) {
  const pc = PLAT[platform as keyof typeof PLAT].color;
  return (
    <Course color={pc} steps={[
      {
        title: "ACID properties",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={pc}><strong style={{ color: pc }}>ACID</strong> describes the four properties that make database transactions reliable. Understanding these is key to writing safe, correct data-modifying code.</Note>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {[
                { letter: "A", name: "Atomicity", color: T.blue, icon: "⚛️", desc: "All operations in a transaction succeed, or none of them are applied. A bank transfer either deducts AND credits, or neither happens." },
                { letter: "C", name: "Consistency", color: T.green, icon: "✅", desc: "The database moves from one valid state to another. Constraints (NOT NULL, FOREIGN KEY) are enforced before the transaction commits." },
                { letter: "I", name: "Isolation", color: T.yellow, icon: "🔒", desc: "Concurrent transactions don't see each other's uncommitted changes. Your long-running report doesn't see partial updates from other sessions." },
                { letter: "D", name: "Durability", color: T.purple, icon: "💾", desc: "Once committed, data survives system crashes. The transaction log ensures committed changes can be replayed after a failure." },
              ].map(p => (
                <div key={p.letter} style={{ background: `${p.color}09`, border: `1px solid ${p.color}28`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: p.color, fontFamily: "'Syne',sans-serif" }}>{p.letter}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{p.name}</div>
                    <div style={{ marginLeft: "auto", fontSize: 18 }}>{p.icon}</div>
                  </div>
                  <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "🛝 Transaction timeline",
        content: () => <TransactionTimeline platform={platform} />
      },
      {
        title: "SAVEPOINT",
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Note color={pc}>SAVEPOINTs let you mark a point within a transaction and roll back to it without undoing all previous work.</Note>
            <PlatformDiff title="SAVEPOINT syntax" diffs={[
              { platform: "mysql", code: `BEGIN;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVEPOINT after_order;\n\nINSERT INTO payments VALUES (1,1200);\n-- Error: invalid card\n\nROLLBACK TO SAVEPOINT after_order;\n-- order kept, payment undone\n\nCOMMIT;`, note: "MySQL supports SAVEPOINT fully within transactions" },
              { platform: "postgres", code: `BEGIN;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVEPOINT after_order;\n\nINSERT INTO payments VALUES (1,1200);\n-- Error detected\n\nROLLBACK TO SAVEPOINT after_order;\n\nRELEASE SAVEPOINT after_order;\nCOMMIT;`, note: "PostgreSQL: RELEASE SAVEPOINT clears it from the stack" },
              { platform: "sqlserver", code: `BEGIN TRANSACTION;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVE TRANSACTION after_order;\n-- Note: SAVE TRANSACTION (not SAVEPOINT)\n\nINSERT INTO payments VALUES (1,1200);\n\nROLLBACK TRANSACTION after_order;\n-- Partial rollback to savepoint\n\nCOMMIT TRANSACTION;`, note: "SQL Server uses SAVE TRANSACTION not SAVEPOINT" },
            ]} />
          </div>
        )
      },
      {
        title: "Quiz",
        content: () => (
          <Quiz color={pc} questions={[
            { question: "A transaction inserts 3 rows, then encounters an error on the 4th INSERT. If ROLLBACK is called, what happens to the first 3 rows?", options: ["They remain committed", "All 3 are rolled back — the transaction is atomic", "They remain, only the 4th fails", "Depends on the database"], correct: 1, explanation: "Atomicity means all-or-nothing. A ROLLBACK undoes ALL changes made within the transaction, including the successful first 3 inserts. After rollback, the table is in the same state as before the transaction started." },
            { question: "What does COMMIT do?", options: ["Pauses the transaction", "Permanently writes all transaction changes to the database", "Creates a savepoint", "Checks constraints"], correct: 1, explanation: "COMMIT makes all changes in the transaction permanent and visible to other sessions. Before COMMIT, changes exist only in the transaction's private memory — other sessions can't see them (Isolation property)." },
          ]} />
        )
      },
    ]} />
  );
}
