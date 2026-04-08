"use client";
import React, { useState } from "react";
import { T } from "./python-constants";

// ─── PyBlock ──────────────────────────────────────────────────────────────────
export function PyBlock({ code, label }: { code: string; label?: string }) {
  const kws = [
    "import","from","as","def","return","class","if","elif","else","for","in",
    "while","and","or","not","True","False","None","lambda","with","try","except",
    "finally","raise","pass","break","continue","yield","global","nonlocal","async","await",
  ];
  const builtins = [
    "print","len","range","type","int","float","str","list","dict","set","tuple","bool",
    "sorted","reversed","enumerate","zip","map","filter","sum","min","max","abs","round",
    "isinstance","pd","np","df","plt","sns","re","json","open","requests",
  ];
  return (
    <div style={{ background: "rgba(4,9,20,.95)", border: "1px solid rgba(96,165,250,.18)", borderRadius: 8, padding: "10px 14px", overflowX: "auto" }}>
      {label && (
        <div style={{ fontSize: 8, color: T.blue, fontFamily: "'JetBrains Mono',monospace", marginBottom: 5, letterSpacing: 0.5 }}>
          🐍 {label}
        </div>
      )}
      <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {(code || "").split("\n").map((line: string, i: number) => {
          if (line.trim().startsWith("#"))
            return <div key={i} style={{ color: "#4b5563" }}>{line || " "}</div>;
          const parts = line.split(/\b/);
          return (
            <div key={i}>
              {parts.map((p, j) => {
                const pu = p.trim();
                if (kws.includes(pu)) return <span key={j} style={{ color: T.purple }}>{p}</span>;
                if (builtins.includes(pu)) return <span key={j} style={{ color: T.cyan }}>{p}</span>;
                if (/^["'].*["']$/.test(p)) return <span key={j} style={{ color: T.green }}>{p}</span>;
                if (/^\d+(\.\d+)?$/.test(p)) return <span key={j} style={{ color: T.orange }}>{p}</span>;
                return <span key={j} style={{ color: T.white }}>{p}</span>;
              })}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

// ─── OutBlock ─────────────────────────────────────────────────────────────────
export function OutBlock({ children, label = "Output", err }: { children: React.ReactNode; label?: string; err?: boolean }) {
  return (
    <div style={{ background: "rgba(4,9,20,.8)", border: `1px solid ${err ? "rgba(248,113,113,.3)" : "rgba(74,222,128,.2)"}`, borderRadius: 8, padding: "8px 14px" }}>
      <div style={{ fontSize: 8, color: err ? T.red : T.green, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4, letterSpacing: 0.5 }}>
        {err ? "❌ ERROR" : "▶ " + label}
      </div>
      <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, lineHeight: 1.7, color: err ? T.red : T.greyLight, whiteSpace: "pre-wrap" }}>
        {children}
      </pre>
    </div>
  );
}

// ─── Note ─────────────────────────────────────────────────────────────────────
export function Note({ children, c = T.cyan }: { children: React.ReactNode; c?: string }) {
  return (
    <div style={{ background: `${c}10`, border: `1px solid ${c}28`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.greyLight, lineHeight: 1.75 }}>
      {children}
    </div>
  );
}

// ─── Hint ─────────────────────────────────────────────────────────────────────
export function Hint({ children, icon = "👆" }: { children: React.ReactNode; icon?: string }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,.04)", border: "1px dashed rgba(255,255,255,.13)", fontSize: 11, color: T.greyLight, alignItems: "flex-start" }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ lineHeight: 1.55 }}>{children}</span>
    </div>
  );
}

// ─── Tip ──────────────────────────────────────────────────────────────────────
export function Tip({ icon = "💡", title, children, c = T.yellow }: { icon?: string; title?: string; children: React.ReactNode; c?: string }) {
  return (
    <div style={{ background: `${c}09`, border: `1px solid ${c}25`, borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace", marginBottom: 5, letterSpacing: 0.5 }}>{icon} {title}</div>
      <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ─── Warn ─────────────────────────────────────────────────────────────────────
export function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.22)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.greyLight, lineHeight: 1.7 }}>
      <span style={{ color: T.red, fontWeight: 700, marginRight: 6 }}>⚠️</span>
      {children}
    </div>
  );
}

// ─── SLabel ───────────────────────────────────────────────────────────────────
export function SLabel({ children, c = T.greyDark }: { children: React.ReactNode; c?: string }) {
  return (
    <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: c, letterSpacing: 1.2, fontWeight: 700, textTransform: "uppercase" as const, marginBottom: 7 }}>
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, c = T.blue }: { children: React.ReactNode; c?: string }) {
  return (
    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: `${c}15`, color: c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, border: `1px solid ${c}28` }}>
      {children}
    </span>
  );
}

// ─── PyTag ────────────────────────────────────────────────────────────────────
export function PyTag({ children, c = T.greyDark }: { children: React.ReactNode; c?: string }) {
  return (
    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: `${c}18`, color: c, fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${c}30` }}>
      {children}
    </span>
  );
}

// ─── CommonMistakes ───────────────────────────────────────────────────────────
export function CM({ mistakes }: { mistakes: Array<{ title: string; wrong: string; right: string; why: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Note c={T.red}>
        <strong style={{ color: T.red }}>Common Mistakes</strong> — click each bug to see what went wrong and how to fix it.
      </Note>
      {mistakes.map((m, i) => (
        <div key={i} style={{ border: `1px solid ${open === i ? "rgba(248,113,113,.4)" : T.slate}`, borderRadius: 9, overflow: "hidden", transition: "border .2s" }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: "10px 14px", display: "flex", gap: 10, cursor: "pointer", background: open === i ? "rgba(248,113,113,.05)" : T.surface, alignItems: "center" }}>
            <span style={{ fontSize: 13 }}>🐛</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.white, flex: 1 }}>{m.title}</span>
            <span style={{ fontSize: 10, color: T.grey, fontFamily: "'JetBrains Mono',monospace" }}>{open === i ? "▾" : "▸"}</span>
          </div>
          {open === i && (
            <div style={{ padding: "12px 14px", background: "rgba(4,9,20,.7)", borderTop: `1px solid ${T.slate}44`, animation: "fadeUp .2s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><SLabel c={T.red}>❌ Wrong</SLabel><PyBlock code={m.wrong} /></div>
                <div><SLabel c={T.green}>✅ Fix</SLabel><PyBlock code={m.right} /></div>
              </div>
              <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.7, background: `${T.orange}09`, border: `1px solid ${T.orange}22`, borderRadius: 7, padding: "8px 12px" }}>
                <strong style={{ color: T.orange }}>Why: </strong>{m.why}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export function Quiz({ questions, c = T.blue }: { questions: any[]; c?: string }) {
  const [ans, setAns] = useState<Record<number, number>>({});
  const [sub, setSub] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const submit = () => {
    let n = 0;
    questions.forEach((q, i) => { if (ans[i] === q.correct) n++; });
    setScore(n); setSub(true);
  };
  const reset = () => { setAns({}); setSub(false); setScore(null); };
  const all = questions.every((_, i) => ans[i] !== undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Note c={c}><strong style={{ color: c }}>Knowledge check</strong> — {questions.length} questions. Full explanations after submitting.</Note>
      {questions.map((q, qi) => {
        const cor = ans[qi] === q.correct;
        return (
          <div key={qi} style={{ background: T.surface, border: `1px solid ${sub ? (cor ? "rgba(74,222,128,.4)" : "rgba(248,113,113,.35)") : T.slate}`, borderRadius: 10, padding: "14px 16px", transition: "border .3s" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: sub ? (cor ? T.green : T.red) : T.greyDark, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>Q{qi + 1}</span>
              {q.type === "bug" && <Badge c={T.red}>spot the bug</Badge>}
              {q.type === "output" && <Badge c={T.orange}>predict output</Badge>}
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.6 }}>{q.question}</div>
            </div>
            {q.code && <div style={{ marginBottom: 10 }}><PyBlock code={q.code} /></div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {q.options.map((opt: string, oi: number) => {
                let bc = T.slate, bg = "rgba(255,255,255,.02)", tc = T.greyLight;
                if (sub) {
                  if (oi === q.correct) { bc = "rgba(74,222,128,.5)"; bg = "rgba(74,222,128,.1)"; tc = T.green; }
                  else if (ans[qi] === oi) { bc = "rgba(248,113,113,.5)"; bg = "rgba(248,113,113,.1)"; tc = T.red; }
                } else if (ans[qi] === oi) { bc = `${c}66`; bg = `${c}12`; tc = c; }
                return (
                  <div key={oi} onClick={() => !sub && setAns(p => ({ ...p, [qi]: oi }))} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", borderRadius: 8, border: `1px solid ${bc}`, background: bg, cursor: sub ? "default" : "pointer", transition: "all .2s" }}>
                    <div style={{ width: 15, height: 15, borderRadius: "50%", border: `2px solid ${bc}`, background: ans[qi] === oi && !sub ? c : oi === q.correct && sub ? T.green : ans[qi] === oi && sub ? T.red : "transparent", flexShrink: 0, marginTop: 2, transition: "all .2s" }} />
                    <span style={{ fontSize: 11, color: tc, lineHeight: 1.55, fontFamily: "'JetBrains Mono',monospace" }}>{opt}</span>
                    {sub && oi === q.correct && <span style={{ marginLeft: "auto", color: T.green, flexShrink: 0 }}>✓</span>}
                  </div>
                );
              })}
            </div>
            {sub && (
              <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: cor ? "rgba(74,222,128,.06)" : "rgba(248,113,113,.06)", border: `1px solid ${cor ? T.green : T.red}22`, fontSize: 11, color: T.greyLight, lineHeight: 1.65, animation: "popIn .25s ease" }}>
                <strong style={{ color: cor ? T.green : T.orange }}>{cor ? "✓ Correct!" : "✗ Not quite."}</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}
      {!sub ? (
        <button onClick={submit} disabled={!all} style={{ padding: "9px 22px", borderRadius: 9, border: `1px solid ${all ? c : T.slate}44`, background: all ? `${c}14` : "transparent", color: all ? c : T.greyDark, fontSize: 11, cursor: all ? "pointer" : "not-allowed", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, alignSelf: "flex-start" }}>
          {all ? "Submit answers →" : "Answer all questions first"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "center", animation: "popIn .3s ease" }}>
          <div style={{ padding: "10px 20px", borderRadius: 10, background: `${score === questions.length ? T.green : score !== null && score >= questions.length / 2 ? T.yellow : T.red}12`, border: `1px solid ${score === questions.length ? T.green : score !== null && score >= questions.length / 2 ? T.yellow : T.red}33`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: score === questions.length ? T.green : score !== null && score >= questions.length / 2 ? T.yellow : T.red, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{score}/{questions.length}</div>
            <div style={{ fontSize: 9, color: T.grey, fontFamily: "'JetBrains Mono',monospace" }}>{score === questions.length ? "PERFECT" : "SCORE"}</div>
          </div>
          <button onClick={reset} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${T.slate}`, background: "transparent", color: T.grey, fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>↩ Retry</button>
        </div>
      )}
    </div>
  );
}

// ─── Course ───────────────────────────────────────────────────────────────────
export function Course({ steps, c, intro }: { steps: Array<{ title: string; desc?: string; content: () => React.ReactNode }>; c: string; intro?: { explain: string; learn: string[]; concepts: string[]; why?: string } }) {
  const [s, setS] = useState(0);
  const pct = Math.round(((s + 1) / steps.length) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {intro && (
        <div style={{ border: `1px solid ${c}28`, borderRadius: 14, overflow: "hidden", marginBottom: 4 }}>
          <div style={{ background: `${c}13`, padding: "8px 16px", borderBottom: `1px solid ${c}20`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 1 }}>WHAT IS THIS?</span>
          </div>
          <div style={{ background: `${c}07`, padding: "16px" }}>
            <div style={{ fontSize: 13, color: T.white, lineHeight: 1.85, marginBottom: 12, fontWeight: 500, fontFamily: "'Onest',sans-serif" }}>
              {intro.explain}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: intro.why ? 12 : 0 }}>
              <div style={{ background: "rgba(4,9,20,.5)", border: `1px solid ${T.slate}`, borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 0.8, marginBottom: 7 }}>YOU&apos;LL LEARN TO</div>
                {intro.learn.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
                    <span style={{ color: c, fontSize: 9, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <span style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.5, fontFamily: "'Onest',sans-serif" }}>{pt}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(4,9,20,.5)", border: `1px solid ${T.slate}`, borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 0.8, marginBottom: 7 }}>KEY CONCEPTS</div>
                {intro.concepts.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
                    <span style={{ color: T.yellow, fontSize: 9, flexShrink: 0, marginTop: 2 }}>◆</span>
                    <span style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.5, fontFamily: "'Onest',sans-serif" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            {intro.why && (
              <div style={{ background: `${c}0c`, border: `1px solid ${c}25`, borderRadius: 8, padding: "9px 12px", fontSize: 11, color: T.greyLight, lineHeight: 1.65, fontFamily: "'Onest',sans-serif" }}>
                <span style={{ color: c, fontWeight: 700, marginRight: 6 }}>In practice:</span>
                {intro.why}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Step tabs */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setS(i)} style={{ padding: "4px 10px", borderRadius: 16, fontSize: 10, cursor: "pointer", fontFamily: "'Onest',sans-serif", transition: "all .18s", border: `1px solid ${s === i ? c : "rgba(255,255,255,.07)"}`, background: s === i ? `${c}18` : s > i ? `${c}06` : "rgba(255,255,255,.02)", color: s === i ? c : s > i ? `${c}88` : T.grey, fontWeight: s === i ? 700 : 400 }}>
            {s > i && <span style={{ marginRight: 3, fontSize: 8 }}>✓</span>}
            {i + 1}. {st.title}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 9, color: T.greyDark, fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 2, background: T.slate, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 2, transition: "width .3s" }} />
      </div>
      {/* Step content */}
      <div key={s} style={{ animation: "fadeUp .3s ease" }}>
        {steps[s].desc && (
          <div style={{ background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 0.8, marginBottom: 5 }}>ABOUT THIS STEP</div>
            <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.8, fontFamily: "'Onest',sans-serif" }}>{steps[s].desc}</div>
          </div>
        )}
        {steps[s].content()}
      </div>
      {/* Nav */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => setS(p => Math.max(0, p - 1))} disabled={s === 0} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: s === 0 ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${T.slate}`, background: "transparent", color: s === 0 ? T.greyDark : T.grey }}>← Prev</button>
        <button onClick={() => setS(p => Math.min(steps.length - 1, p + 1))} disabled={s === steps.length - 1} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, cursor: s === steps.length - 1 ? "not-allowed" : "pointer", fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${s === steps.length - 1 ? T.slate : c}44`, background: s === steps.length - 1 ? "transparent" : `${c}14`, color: s === steps.length - 1 ? T.greyDark : c }}>Next →</button>
      </div>
    </div>
  );
}
