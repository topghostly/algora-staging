import React, { useState, useEffect, useRef, useCallback } from "react";
import { T, PLAT } from "./sql-constants";

// ─── SHARED UI ────────────────────────────────────────────────────────────────
export function SQLBlock({ code, platform, label }: any) {
  const pc = PLAT[platform as keyof typeof PLAT]?.color || T.cyan;
  const kws = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "TOP", "OFFSET", "FETCH NEXT", "ROWS ONLY", "JOIN", "INNER JOIN", "LEFT JOIN", "LEFT OUTER JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "CROSS JOIN", "ON", "AND", "OR", "NOT", "IN", "NOT IN", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "AS", "DISTINCT", "WITH", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "TRUNCATE", "CREATE", "VIEW", "INDEX", "OVER", "PARTITION BY", "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "NTILE", "SUM", "COUNT", "AVG", "MIN", "MAX", "COALESCE", "ISNULL", "IFNULL", "NULLIF", "CASE", "WHEN", "THEN", "ELSE", "END", "NULL", "TRUE", "FALSE", "ASC", "DESC", "UNION", "UNION ALL", "INTERSECT", "EXCEPT", "BEGIN", "COMMIT", "ROLLBACK", "SAVEPOINT", "OUTPUT", "RETURNING", "EXPLAIN", "CAST", "CONVERT", "FORMAT", "CONCAT", "REPLACE", "TRIM", "UPPER", "LOWER", "SUBSTRING", "LENGTH", "LEN", "ROUND", "FLOOR", "CEIL", "CEILING", "ABS", "YEAR", "MONTH", "DAY", "NOW", "GETDATE", "CURRENT_DATE", "DATE_FORMAT", "TO_CHAR", "DATEDIFF", "DATEADD", "DATE_ADD", "INTERVAL"
  ];
  return (
    <div style={{ background: "rgba(4,9,20,.95)", border: `1px solid ${pc}22`, borderRadius: 8, padding: "10px 14px", overflowX: "auto" }}>
      {(PLAT[platform as keyof typeof PLAT] || label) && <div style={{ fontSize: 8, color: pc, fontFamily: "monospace", marginBottom: 5, letterSpacing: .5 }}>{PLAT[platform as keyof typeof PLAT]?.icon} {label || PLAT[platform as keyof typeof PLAT]?.label}</div>}
      <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {(code || "").split("\n").map((line: string, i: number) => {
          if (line.trim().startsWith("--")) return <div key={i} style={{ color: T.greyDark }}>{line || " "}</div>;
          const parts = line.split(/(\\b)/);
          return <div key={i}>{parts.map((p, j) => { const u = p.trim().toUpperCase(); return <span key={j} style={{ color: kws.includes(u) ? pc : p.match(/^'[^']*'$/) ? T.green : p.match(/^\\d+(\\.\\d+)?$/) ? T.purple : T.white }}>{p}</span>; })}</div>;
        })}
      </pre>
    </div>
  );
}

export function PlatformTabs({ mysql, postgres, sqlserver, platform: init }: any) {
  const [a, setA] = useState(init || "mysql");
  useEffect(() => { if (init) setA(init); }, [init]);
  const codes: any = { mysql, postgres, sqlserver };
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {Object.values(PLAT).map(p => <button key={p.id} onClick={() => setA(p.id)} style={{ padding: "3px 10px", borderRadius: 14, fontSize: 9, cursor: "pointer", fontFamily: "monospace", fontWeight: 700, border: `1px solid ${a === p.id ? p.color : "rgba(255,255,255,.08)"}`, background: a === p.id ? p.bg : "transparent", color: a === p.id ? p.color : T.grey, transition: "all .2s" }}>{p.icon} {p.label}</button>)}
      </div>
      <SQLBlock code={codes[a]} platform={a} />
    </div>
  );
}

export function PlatformDiff({ title, diffs }: any) {
  return (
    <div style={{ border: `1px solid ${T.slate}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "6px 14px", background: T.surface, borderBottom: `1px solid ${T.slate}`, fontSize: 9, color: T.grey, fontFamily: "monospace", letterSpacing: .8, fontWeight: 700 }}>🔀 PLATFORM DIFFERENCE: {title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
        {diffs.map((d: any, i: number) => (
          <div key={i} style={{ borderRight: i < 2 ? `1px solid ${T.slate}` : undefined, padding: "10px 12px", background: T.bg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><span style={{ fontSize: 12 }}>{PLAT[d.platform as keyof typeof PLAT].icon}</span><span style={{ fontSize: 10, color: PLAT[d.platform as keyof typeof PLAT].color, fontFamily: "monospace", fontWeight: 700 }}>{PLAT[d.platform as keyof typeof PLAT].label}</span></div>
            <SQLBlock code={d.code} platform={d.platform} />
            {d.note && <div style={{ fontSize: 10, color: T.grey, marginTop: 5, lineHeight: 1.5 }}>{d.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Note({ children, color = T.cyan }: any) { return <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.greyLight, lineHeight: 1.75 }}>{children}</div>; }
export function Tip({ icon = "💡", title, children, color = T.yellow }: any) {
  return (
    <div style={{ background: `${color}09`, border: `1px solid ${color}28`, borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: .5, marginBottom: 5 }}>{icon} {title}</div>
      <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
export function Warn({ children }: any) { return <div style={{ background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.25)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.greyLight, lineHeight: 1.7 }}><span style={{ color: T.red, fontWeight: 700, fontFamily: "monospace", marginRight: 6 }}>⚠️ GOTCHA:</span>{children}</div>; }
export function SLabel({ children, color = T.greyDark }: any) { return <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color, letterSpacing: 1.2, fontWeight: 700, textTransform: "uppercase", marginBottom: 7 }}>{children}</div>; }
export function DiffBadge({ diff }: any) { const d: any = { easy: { color: T.green, bg: "rgba(74,222,128,.1)", label: "Beginner" }, mid: { color: T.yellow, bg: "rgba(250,204,21,.1)", label: "Intermediate" }, hard: { color: T.red, bg: "rgba(248,113,113,.1)", label: "Advanced" } }; const s = d[diff] || d.easy; return <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: s.bg, color: s.color, fontWeight: 700, fontFamily: "monospace" }}>{s.label}</span>; }

export function Hint({ children, icon = "👆" }: any) { return (<div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,.04)", border: "1px dashed rgba(255,255,255,.15)", fontSize: 11, color: T.greyLight }}><span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span><span style={{ lineHeight: 1.5 }}>{children}</span></div>); }

export function Quiz({ questions, color }: any) {
  const [ans, setAns] = useState<any>({});
  const [sub, setSub] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const submit = () => { let c = 0; questions.forEach((q: any, i: number) => { if (ans[i] === q.correct) c++; }); setScore(c); setSub(true); };
  const reset = () => { setAns({}); setSub(false); setScore(null); };
  const all = questions.every((_: any, i: number) => ans[i] !== undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Note color={color}><strong style={{ color }}>Module Quiz</strong> — {questions.length} questions. See explanations for every answer after submitting.</Note>
      {questions.map((q: any, qi: number) => {
        const cor = ans[qi] === q.correct;
        return (
          <div key={qi} style={{ background: T.surface, border: `1px solid ${sub ? cor ? T.green : T.red + "44" : T.slate}`, borderRadius: 10, padding: "14px 16px", transition: "border .3s" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: sub ? cor ? T.green : T.red : T.greyDark, fontFamily: "monospace", flexShrink: 0 }}>Q{qi + 1}</span>
              {q.type === "bug" && <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 8, background: "rgba(248,113,113,.12)", color: T.red, fontFamily: "monospace", flexShrink: 0 }}>spot the bug</span>}
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.6 }}>{q.question}</div>
            </div>
            {q.code && <div style={{ marginBottom: 10 }}><SQLBlock code={q.code} label="SQL" /></div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {q.options.map((opt: string, oi: number) => {
                let bc = T.slate, bg = "rgba(255,255,255,.02)", tc = T.greyLight;
                if (sub) { if (oi === q.correct) { bc = T.green + "66"; bg = "rgba(74,222,128,.1)"; tc = T.green; } else if (ans[qi] === oi) { bc = T.red + "66"; bg = "rgba(248,113,113,.1)"; tc = T.red; } }
                else if (ans[qi] === oi) { bc = color + "66"; bg = `${color}12`; tc = color; }
                return (
                  <div key={oi} onClick={() => !sub && setAns((p: any) => ({ ...p, [qi]: oi }))} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", borderRadius: 8, border: `1px solid ${bc}`, background: bg, cursor: sub ? "default" : "pointer", transition: "all .2s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${bc}`, background: ans[qi] === oi && !sub ? color : oi === q.correct && sub ? T.green : ans[qi] === oi && sub ? T.red : "transparent", flexShrink: 0, marginTop: 1, transition: "all .2s" }} />
                    <span style={{ fontSize: 11, color: tc, lineHeight: 1.55 }}>{opt}</span>
                    {sub && oi === q.correct && <span style={{ marginLeft: "auto", fontSize: 10, color: T.green, flexShrink: 0 }}>✓</span>}
                    {sub && ans[qi] === oi && oi !== q.correct && <span style={{ marginLeft: "auto", fontSize: 10, color: T.red, flexShrink: 0 }}>✗</span>}
                  </div>
                );
              })}
            </div>
            {sub && <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: cor ? "rgba(74,222,128,.06)" : "rgba(248,113,113,.06)", border: `1px solid ${cor ? T.green : T.red}22`, fontSize: 11, color: T.greyLight, lineHeight: 1.65, animation: "popIn .25s ease" }}><strong style={{ color: cor ? T.green : T.orange }}>{cor ? "✓ Correct!" : "✗ Not quite."}</strong> {q.explanation}</div>}
          </div>
        );
      })}
      {!sub ? (
        <button onClick={submit} disabled={!all} style={{ padding: "9px 22px", borderRadius: 9, border: `1px solid ${all ? color : T.slate}44`, background: all ? `${color}14` : "transparent", color: all ? color : T.greyDark, fontSize: 11, cursor: all ? "pointer" : "not-allowed", fontFamily: "monospace", fontWeight: 700, alignSelf: "flex-start", transition: "all .2s" }}>
          {all ? "Submit quiz →" : "Answer all questions first"}
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12, animation: "popIn .3s ease" }}>
          <div style={{ padding: "10px 20px", borderRadius: 10, background: `${score === questions.length ? T.green : score && score >= questions.length / 2 ? T.yellow : T.red}12`, border: `1px solid ${score === questions.length ? T.green : score && score >= questions.length / 2 ? T.yellow : T.red}33`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: score === questions.length ? T.green : score && score >= questions.length / 2 ? T.yellow : T.red, fontFamily: "'Syne',sans-serif" }}>{score}/{questions.length}</div>
            <div style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}>{score === questions.length ? "PERFECT" : "SCORE"}</div>
          </div>
          <button onClick={reset} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${T.slate}`, background: "transparent", color: T.grey, fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>↩ Retry</button>
        </div>
      )}
    </div>
  );
}

export function CommonMistakes({ mistakes }: any) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Note color={T.red}>Click each bug to see wrong code, correct code, and why it happens.</Note>
      {mistakes.map((m: any, i: number) => (
        <div key={i} style={{ border: `1px solid ${open === i ? "rgba(248,113,113,.4)" : T.slate}`, borderRadius: 9, overflow: "hidden", transition: "border .2s" }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: open === i ? "rgba(248,113,113,.05)" : T.surface }}>
            <span style={{ fontSize: 14 }}>🐛</span><span style={{ fontSize: 12, fontWeight: 600, color: T.white, flex: 1 }}>{m.title}</span>
            <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>{open === i ? "▾" : "▸"}</span>
          </div>
          {open === i && (
            <div style={{ padding: "12px 14px", background: "rgba(4,9,20,.7)", borderTop: `1px solid ${T.slate}44`, animation: "fadeUp .2s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><SLabel color={T.red}>❌ Wrong</SLabel><SQLBlock code={m.wrong} label="Bug" /></div>
                <div><SLabel color={T.green}>✅ Correct</SLabel><SQLBlock code={m.right} label="Fix" /></div>
              </div>
              <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.7, background: `${T.orange}09`, border: `1px solid ${T.orange}22`, borderRadius: 7, padding: "8px 12px" }}><strong style={{ color: T.orange }}>Why: </strong>{m.why}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Course({ steps, color }: any) {
  const [s, setS] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {steps.map((st: any, i: number) => <button key={i} onClick={() => setS(i)} style={{ padding: "5px 11px", borderRadius: 18, fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .18s", border: `1px solid ${s === i ? color : "rgba(255,255,255,.08)"}`, background: s === i ? `${color}18` : "rgba(255,255,255,.03)", color: s === i ? color : T.grey, fontWeight: s === i ? 600 : 400 }}>{i + 1}. {st.title}</button>)}
      </div>
      <div key={s} style={{ animation: "fadeUp .3s ease" }}>{steps[s].content()}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => setS(p => Math.max(0, p - 1))} disabled={s === 0} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: s === 0 ? "not-allowed" : "pointer", fontFamily: "monospace", border: `1px solid ${T.slate}`, background: "transparent", color: s === 0 ? T.greyDark : T.grey }}>← Prev</button>
        <button onClick={() => setS(p => Math.min(steps.length - 1, p + 1))} disabled={s === steps.length - 1} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: s === steps.length - 1 ? "not-allowed" : "pointer", fontFamily: "monospace", border: `1px solid ${s === steps.length - 1 ? T.slate : color}44`, background: s === steps.length - 1 ? "transparent" : `${color}14`, color: s === steps.length - 1 ? T.greyDark : color }}>Next →</button>
      </div>
    </div>
  );
}
