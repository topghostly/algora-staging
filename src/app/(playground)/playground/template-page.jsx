'use client'
import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const T = {
  teal:       "#2dd4bf",
  tealDim:    "#0d9488",
  tealBg:     "rgba(45,212,191,0.08)",
  tealBorder: "rgba(45,212,191,0.22)",
  grey:       "#64748b",
  greyLight:  "#94a3b8",
  greyDark:   "#334155",
  greyBg:     "rgba(100,116,139,0.08)",
  slate:      "#1e293b",
  ink:        "#060b18",
  surface:    "rgba(12,18,36,0.85)",
  orange:     "#fb923c",
  purple:     "#818cf8",
  green:      "#4ade80",
  red:        "#f87171",
  yellow:     "#facc15",
  blue:       "#38bdf8",
  pink:       "#f472b6",
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600;700&family=Onest:wght@400;500;600&display=swap');
  @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 6px currentColor}50%{opacity:.5;box-shadow:none} }
  @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)} }
  @keyframes popIn { from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)} }
  @keyframes flow { 0%{stroke-dashoffset:100}100%{stroke-dashoffset:0} }
  * { box-sizing:border-box; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
`;

// ─── COURSE REGISTRY ──────────────────────────────────────────────────────
const COURSES = [
  { id:"fundamentals", num:"01", title:"dbt Fundamentals",         subtitle:"Modeling, sources, tests & docs",        icon:"🏗️",  color:T.purple,  difficulty:"Beginner",     duration:"45 min", topics:["Warehouse connection","Project structure","Modeling","Sources","Testing","Documentation","Deployment"] },
  { id:"jinja",        num:"02", title:"Jinja, Macros & Packages",  subtitle:"Extend dbt with dynamic SQL",            icon:"🧩",  color:T.pink,    difficulty:"Intermediate", duration:"35 min", topics:["Jinja templating","ref() & source()","Custom macros","dbt-utils","Packages"] },
  { id:"incremental",  num:"03", title:"Incremental Models",        subtitle:"Process only new or changed data",       icon:"🧱",  color:T.orange,  difficulty:"Intermediate", duration:"40 min", topics:["Full refresh vs incremental","is_incremental()","Strategies","Schema changes","Warehouse strategies"], fullyBuilt:true },
  { id:"snapshots",    num:"04", title:"Snapshots",                 subtitle:"Track historical records over time",     icon:"📸",  color:T.teal,    difficulty:"Intermediate", duration:"30 min", topics:["SCD Type 2","dbt_valid_from/to","check strategy","timestamp strategy","History queries"] },
  { id:"seeds",        num:"05", title:"Analyses & Seeds",          subtitle:"Ad hoc queries and CSV data",            icon:"🌱",  color:"#a3e635", difficulty:"Beginner",     duration:"20 min", topics:["Seeds overview","CSV versioning","Analyses","Ad hoc queries","ref() in analyses"] },
  { id:"exposures",    num:"06", title:"Exposures",                 subtitle:"Downstream dependency visibility",       icon:"🔭",  color:T.blue,    difficulty:"Beginner",     duration:"20 min", topics:["Exposure config","YAML definition","DAG visibility","Dependency tracking","Freshness"] },
  { id:"state",        num:"07", title:"State Management",          subtitle:"Run only what changed",                  icon:"⚡",  color:T.yellow,  difficulty:"Advanced",     duration:"25 min", topics:["dbt state","Slim CI","modified selector","Artifacts","Deferred runs"] },
  { id:"retry",        num:"08", title:"dbt Retry",                 subtitle:"Efficiently rebuild failed pipelines",   icon:"🔁",  color:T.orange,  difficulty:"Beginner",     duration:"15 min", topics:["dbt retry command","run_results.json","Error recovery","CI patterns","Best practices"] },
  { id:"mesh",         num:"09", title:"dbt Mesh",                  subtitle:"Cross-project data products at scale",   icon:"🕸️",  color:"#c084fc", difficulty:"Advanced",     duration:"40 min", topics:["Projects & contracts","Public models","Cross-project refs","Governance","Producer/consumer"] },
  { id:"testing",      num:"10", title:"Advanced Testing",          subtitle:"Custom tests, packages & config",        icon:"🧪",  color:T.teal,    difficulty:"Advanced",     duration:"35 min", topics:["Generic tests","Custom tests","dbt-expectations","Test severity","Test configs"] },
  { id:"deployment",   num:"11", title:"Advanced Deployment",       subtitle:"CI, orchestration & environments",       icon:"🚀",  color:T.red,     difficulty:"Advanced",     duration:"35 min", topics:["Continuous integration","Conflicting jobs","Environment configs","dbt Cloud jobs","Slim CI"] },
  { id:"clone",        num:"12", title:"dbt Clone",                 subtitle:"Zero-copy dev & test environments",      icon:"🪞",  color:"#67e8f9", difficulty:"Intermediate", duration:"20 min", topics:["dbt clone command","Zero-copy cloning","Warehouse clones","Dev workflows","Cost savings"] },
  { id:"grants",       num:"13", title:"Grants",                    subtitle:"Fine-grained permission control",        icon:"🔐",  color:"#86efac", difficulty:"Intermediate", duration:"20 min", topics:["Grant config","Models & seeds","Snapshots grants","Role-based access","Auto-grants"] },
  { id:"python",       num:"14", title:"Python dbt Models",         subtitle:"ML & statistics beyond SQL",             icon:"🐍",  color:T.yellow,  difficulty:"Advanced",     duration:"35 min", topics:["Python models","Pandas & PySpark","ML use cases","SQL + Python hybrid","Packages"] },
];

const DIFF_COLOR = { Beginner: T.green, Intermediate: T.orange, Advanced: T.red };

// ─── SHARED UI HELPERS ────────────────────────────────────────────────────
function CodeBlock({ code, small = false }) {
  return (
    <div style={{ background:"rgba(4,9,20,0.97)", borderRadius:8, padding:small?"8px 12px":"12px 16px", fontFamily:"'JetBrains Mono',monospace", fontSize:small?10:11, lineHeight:1.8, overflowX:"auto", border:`1px solid ${T.slate}` }}>
      {code.split("\n").map((line, i) => {
        const isComment = line.trim().startsWith("--") || line.trim().startsWith("#") || line.trim().startsWith("//");
        const isJinja   = line.includes("{{") || line.includes("{%");
        const isYaml    = line.trim().startsWith("-") && !line.includes("(");
        return (
          <div key={i} style={{ color: isComment ? T.greyDark : isJinja ? T.orange : "#e2e8f0", whiteSpace:"pre" }}>{line||" "}</div>
        );
      })}
    </div>
  );
}

function Tag({ label, color }) {
  return <span style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace", padding:"2px 7px", borderRadius:10, background:color+"18", border:`1px solid ${color}44`, color }}>{label}</span>;
}

function SectionTitle({ children, color }) {
  return <div style={{ fontSize:9, color:color||T.greyDark, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}><span style={{ width:16, height:1, background:color||T.greyDark, display:"inline-block" }} />{children}</div>;
}

function InfoCard({ icon, title, body, color = T.green }) {
  return (
    <div style={{ background:`${color}09`, border:`1px solid ${color}28`, borderRadius:10, padding:"12px 14px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"'JetBrains Mono',monospace" }}>{title}</span>
      </div>
      <div style={{ fontSize:12, color:T.greyLight, lineHeight:1.65 }}>{body}</div>
    </div>
  );
}

function BeginnerNote({ children }) {
  return (
    <div style={{ display:"flex", gap:10, alignItems:"flex-start", background:T.tealBg, border:T.tealBorder, borderRadius:10, padding:"10px 14px" }}>
      <span style={{ fontSize:14, flexShrink:0 }}>💡</span>
      <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.65 }}>{children}</div>
    </div>
  );
}

function Callout({ icon="⚠️", title, children, color = T.orange }) {
  return (
    <div style={{ display:"flex", gap:10, alignItems:"flex-start", background:`${color}09`, border:`1px solid ${color}30`, borderRadius:10, padding:"10px 14px" }}>
      <span style={{ fontSize:14, flexShrink:0 }}>{icon}</span>
      <div>
        {title && <div style={{ fontSize:10, fontWeight:700, color, fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>{title}</div>}
        <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function GenericCourse({ steps, color }) {
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {steps.length > 1 && (
        <div style={{ display:"flex", gap:5, marginBottom:16, flexWrap:"wrap" }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              padding:"5px 13px", borderRadius:20, fontSize:10, cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
              border:`1px solid ${idx===i ? color : "rgba(255,255,255,0.08)"}`,
              background:idx===i ? `${color}18` : "transparent",
              color:idx===i ? color : T.grey,
            }}>{i+1}. {s.title}</button>
          ))}
        </div>
      )}
      <div>{steps[idx].content()}</div>
    </div>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────────────────
function CourseCatalog({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? COURSES : COURSES.filter(c => c.difficulty === filter);

  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 15% 0%, #0a1628 0%, ${T.ink} 65%)`, color:"#f1f5f9", fontFamily:"'Onest',sans-serif" }}>
      {/* Hero */}
      <div style={{ padding:"56px 32px 40px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"relative", overflow:"hidden" }}>
        {/* teal glow behind hero */}
        <div style={{ position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)", width:600, height:300, background:`radial-gradient(ellipse, ${T.teal}18 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:T.tealBg, border:T.tealBorder, borderRadius:20, padding:"5px 16px", marginBottom:20 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:T.teal, display:"inline-block" }} />
          <span style={{ fontSize:11, color:T.teal, fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>dbt Learning Platform · Interactive</span>
        </div>
        <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(30px,5vw,50px)", fontWeight:800, margin:"0 0 14px", lineHeight:1.1, letterSpacing:-1 }}>
          Learn{" "}
          <span style={{ background:`linear-gradient(135deg, ${T.teal}, ${T.blue})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>dbt</span>
          {" "}from scratch
        </h1>
        <p style={{ color:T.grey, fontSize:14, maxWidth:500, margin:"0 auto 28px", lineHeight:1.75 }}>
          14 interactive courses covering everything from fundamentals to Python models — built for analysts and engineers who are brand new to dbt.
        </p>
        <div style={{ display:"flex", gap:28, justifyContent:"center", flexWrap:"wrap" }}>
          {[["14","Courses"],["4h+","Content"],["🌐","Any Warehouse"],["✦","Interactive"]].map(([v,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:17, fontWeight:800, color:"#f1f5f9", fontFamily:"'Bricolage Grotesque',sans-serif" }}>{v}</div>
              <div style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace", letterSpacing:0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", justifyContent:"center", gap:7, padding:"18px 32px 4px", flexWrap:"wrap" }}>
        {["All","Beginner","Intermediate","Advanced"].map(d => (
          <button key={d} onClick={() => setFilter(d)} style={{
            padding:"5px 14px", borderRadius:20, fontSize:11, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${filter===d ? (DIFF_COLOR[d]||T.teal) : "rgba(255,255,255,0.08)"}`,
            background:filter===d ? `${DIFF_COLOR[d]||T.teal}15` : "transparent",
            color:filter===d ? (DIFF_COLOR[d]||T.teal) : T.grey,
          }}>{d}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding:"16px 24px 60px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))", gap:12, maxWidth:1160, margin:"0 auto" }}>
        {filtered.map((c, i) => (
          <div key={c.id} onClick={() => onSelect(c.id)}
            onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
            style={{
              background:hovered===c.id ? "rgba(15,23,42,0.98)" : T.surface,
              border:`1px solid ${hovered===c.id ? c.color+"44" : "rgba(255,255,255,0.07)"}`,
              borderRadius:14, padding:"16px 16px 14px", cursor:"pointer",
              transition:"all 0.2s",
              transform:hovered===c.id ? "translateY(-3px)" : "translateY(0)",
              boxShadow:hovered===c.id ? `0 10px 32px ${c.color}14` : "none",
              animation:`fadeUp 0.4s ease both`, animationDelay:`${i*28}ms`,
              display:"flex", flexDirection:"column", gap:10,
            }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${c.color}15`, border:`1px solid ${c.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{c.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                  <span style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace" }}>{c.num}</span>
                  {c.fullyBuilt && <span style={{ fontSize:8, background:"#4ade8020", color:T.green, border:"1px solid #4ade8033", padding:"1px 5px", borderRadius:10, fontFamily:"monospace" }}>COMPLETE</span>}
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", fontFamily:"'Bricolage Grotesque',sans-serif", lineHeight:1.2 }}>{c.title}</div>
                <div style={{ fontSize:11, color:T.grey, marginTop:2 }}>{c.subtitle}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {c.topics.slice(0,4).map(t => (
                <span key={t} style={{ fontSize:9, fontFamily:"monospace", padding:"2px 6px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", color:T.greyDark }}>{t}</span>
              ))}
              {c.topics.length>4 && <span style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace" }}>+{c.topics.length-4}</span>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:"auto", paddingTop:6, borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:DIFF_COLOR[c.difficulty]+"14", color:DIFF_COLOR[c.difficulty], border:`1px solid ${DIFF_COLOR[c.difficulty]}33`, fontFamily:"monospace" }}>{c.difficulty}</span>
              <span style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace", marginLeft:"auto" }}>⏱ {c.duration}</span>
              <span style={{ fontSize:11, color:hovered===c.id ? c.color : T.greyDark, transition:"color 0.2s" }}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// COURSE 01 — dbt FUNDAMENTALS
// Interactive: clickable layer DAG showing data flow
// ══════════════════════════════════════════════════════════════════════════

function LayerDAG() {
  const [active, setActive] = useState(null);

  const layers = [
    {
      id: "source",
      label: "Source",
      sublabel: "Raw warehouse tables",
      icon: "🗄️",
      color: "#475569",
      x: 0,
      tables: ["raw.loans", "raw.customers", "raw.payments"],
      what: "These are the raw tables that already exist in your data warehouse — loaded by your data pipelines (Fivetran, Airbyte, custom ETL). You didn't create them. dbt reads from them.",
      example: `-- You DON'T create these. They already exist.
-- In your warehouse:
RAW.CORE_BANKING.LOANS
RAW.CORE_BANKING.CUSTOMERS
RAW.STRIPE.PAYMENTS`,
      rule: "Never modify source tables from dbt. Read-only.",
    },
    {
      id: "staging",
      label: "Staging",
      sublabel: "stg_ models",
      icon: "🔵",
      color: "#818cf8",
      x: 1,
      tables: ["stg_loans", "stg_customers", "stg_payments"],
      what: "Staging models are a thin cleaning layer — one per source table. They rename confusing column names, cast data types, and add basic derivations. Nothing complex.",
      example: `-- models/staging/core_banking/stg_loans.sql
SELECT
    loan_id,
    cust_id          AS customer_id,   -- rename
    loan_amt / 100   AS loan_amount,   -- cast cents→dollars
    created_ts::date AS created_date,  -- cast timestamp→date
    loan_status      AS status
FROM {{ source('core_banking', 'loans') }}`,
      rule: "One staging model per source table. No joins. No business logic.",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      sublabel: "int_ models",
      icon: "🟡",
      color: "#facc15",
      x: 2,
      tables: ["int_payments_pivoted", "int_loan_metrics"],
      what: "Intermediate models handle complex transformations that are too long for a mart. They join and pivot staging data, but aren't consumed by BI tools directly. Think of them as building blocks.",
      example: `-- models/intermediate/int_payments_pivoted.sql
-- Pivot payment methods into columns per loan
SELECT
    loan_id,
    SUM(CASE WHEN method='mpesa'  THEN amount END) AS mpesa_total,
    SUM(CASE WHEN method='bank'   THEN amount END) AS bank_total,
    SUM(CASE WHEN method='cash'   THEN amount END) AS cash_total
FROM {{ ref('stg_payments') }}
GROUP BY loan_id`,
      rule: "Only used by other dbt models, never queried by analysts directly.",
    },
    {
      id: "mart",
      label: "Mart",
      sublabel: "fct_ / dim_ models",
      icon: "🟠",
      color: "#fb923c",
      x: 3,
      tables: ["fct_disbursements", "dim_customers", "fct_repayments"],
      what: "Marts are your final, polished tables. BI tools, dashboards, and analysts query these. They combine multiple staging and intermediate models into clean business facts and dimensions.",
      example: `-- models/marts/finance/fct_disbursements.sql
SELECT
    l.loan_id,
    l.loan_amount,
    l.created_date,
    c.customer_name,
    c.country_code,
    p.mpesa_total,
    p.bank_total
FROM {{ ref('stg_loans') }}         l
JOIN {{ ref('stg_customers') }}     c ON l.customer_id = c.customer_id
JOIN {{ ref('int_payments_pivoted') }} p ON l.loan_id = p.loan_id`,
      rule: "Named fct_ (facts) or dim_ (dimensions). These are what Looker/Tableau query.",
    },
    {
      id: "exposure",
      label: "Exposure",
      sublabel: "dashboards, ML, apps",
      icon: "📊",
      color: "#38bdf8",
      x: 4,
      tables: ["Portfolio Dashboard", "Credit Risk Model", "Finance Report"],
      what: "Exposures are downstream consumers of your marts — dashboards, ML models, APIs. You declare them in YAML so they appear in your dbt lineage graph and freshness alerts.",
      example: `# models/exposures.yml
exposures:
  - name: loan_portfolio_dashboard
    type: dashboard
    url: https://looker.company.com/42
    depends_on:
      - ref('fct_disbursements')
      - ref('dim_customers')
    owner:
      name: Finance Team`,
      rule: "Not a dbt model — a declaration of who uses your data downstream.",
    },
  ];

  const activeLayer = layers.find(l => l.id === active);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Think of dbt like an assembly line for your data. Raw parts (sources) come in one end, get cleaned and assembled layer by layer, and a finished product (mart table) comes out the other end for analysts to use. <strong style={{ color:T.teal }}>Click any layer</strong> to understand what happens there.
      </BeginnerNote>

      {/* DAG visualization */}
      <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.slate}`, borderRadius:12, padding:"20px 16px 16px", overflowX:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:0, minWidth:560, justifyContent:"center" }}>
          {layers.map((layer, i) => (
            <div key={layer.id} style={{ display:"flex", alignItems:"center" }}>
              {/* Node */}
              <div onClick={() => setActive(active===layer.id ? null : layer.id)}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  padding:"12px 10px", borderRadius:10, cursor:"pointer", transition:"all 0.2s",
                  background:active===layer.id ? `${layer.color}18` : "rgba(255,255,255,0.03)",
                  border:`1px solid ${active===layer.id ? layer.color+"66" : "rgba(255,255,255,0.07)"}`,
                  minWidth:88,
                  transform:active===layer.id ? "scale(1.05)" : "scale(1)",
                  boxShadow:active===layer.id ? `0 0 16px ${layer.color}22` : "none",
                }}>
                <span style={{ fontSize:20 }}>{layer.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:layer.color, fontFamily:"'Bricolage Grotesque',sans-serif" }}>{layer.label}</span>
                <span style={{ fontSize:9, color:T.grey, fontFamily:"monospace", textAlign:"center" }}>{layer.sublabel}</span>
                {/* Mini table list */}
                <div style={{ display:"flex", flexDirection:"column", gap:2, width:"100%", marginTop:2 }}>
                  {layer.tables.map(t => (
                    <div key={t} style={{ fontSize:8, fontFamily:"monospace", color:active===layer.id ? layer.color : T.greyDark, background:`${layer.color}10`, borderRadius:4, padding:"1px 5px", textAlign:"center", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t}</div>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              {i < layers.length-1 && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 6px", gap:2 }}>
                  <div style={{ width:28, height:1, background:`${T.greyDark}` }} />
                  <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${T.greyDark}`, marginLeft:22 }} />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Click hint */}
        {!active && <div style={{ textAlign:"center", fontSize:9, color:T.greyDark, fontFamily:"monospace", marginTop:12 }}>↑ click any layer to learn what it does</div>}
      </div>

      {/* Detail panel */}
      {activeLayer && (
        <div style={{ background:T.surface, border:`1px solid ${activeLayer.color}44`, borderRadius:12, padding:"16px 18px", animation:"popIn 0.2s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:20 }}>{activeLayer.icon}</span>
            <span style={{ fontSize:16, fontWeight:800, color:activeLayer.color, fontFamily:"'Bricolage Grotesque',sans-serif" }}>{activeLayer.label} layer</span>
            <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace", marginLeft:"auto" }}>{activeLayer.sublabel}</span>
          </div>
          <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.7, margin:"0 0 12px" }}>{activeLayer.what}</p>
          <SectionTitle color={activeLayer.color}>EXAMPLE</SectionTitle>
          <CodeBlock code={activeLayer.example} small />
          <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"flex-start", background:`${activeLayer.color}09`, border:`1px solid ${activeLayer.color}25`, borderRadius:8, padding:"8px 12px" }}>
            <span style={{ fontSize:12, color:activeLayer.color }}>📌</span>
            <span style={{ fontSize:11, color:T.greyLight, fontFamily:"monospace" }}>{activeLayer.rule}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FundamentalsSlides() {
  const steps = [
    {
      title: "What is dbt?",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            <strong style={{ color:T.teal }}>Imagine this:</strong> Your company's raw data lands in your data warehouse — messy column names, cents instead of dollars, cryptic IDs. Someone needs to turn that into clean tables that analysts can actually use. That job used to be done by writing SQL scripts and running them manually. dbt automates that entire process.
          </BeginnerNote>
          <p style={{ color:T.greyLight, fontSize:13, lineHeight:1.75, margin:0 }}>dbt stands for <strong style={{ color:"#f1f5f9" }}>data build tool</strong>. It lets you write SELECT statements, and dbt handles the CREATE TABLE / CREATE VIEW for you. It also adds testing, documentation, and version control to your data transformations.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:10 }}>
            {[
              ["🏗️","You write SELECT","dbt handles CREATE TABLE / VIEW / SCHEMA"],
              ["✅","Testing built in","Assert uniqueness, not-null, referential integrity"],
              ["📚","Auto-docs","Generate a data catalog from your code + YAML"],
              ["🌿","Version controlled","Every model lives in Git — PRs, reviews, rollback"],
              ["🔗","Lineage graph","See exactly which tables depend on which sources"],
              ["🚀","Scheduled runs","Deploy on a schedule via dbt Cloud or Airflow"],
            ].map(([icon,title,desc]) => (
              <InfoCard key={title} icon={icon} title={title} body={desc} color={T.purple} />
            ))}
          </div>
          <Callout icon="🤔" title="THE SINGLE KEY IDEA" color={T.teal}>
            In dbt, <strong style={{ color:"#f1f5f9" }}>every model is just a SELECT statement</strong>. You write what data you want. dbt figures out how to materialise it in the warehouse. That's it.
          </Callout>
        </div>
      ),
    },
    {
      title: "Project Structure",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            When you run <code style={{ color:T.teal }}>dbt init</code>, it creates a folder structure for you. Here's the official structure — we've adapted it to a lending/fintech context. Don't worry about memorising it; focus on understanding <em>why</em> each folder exists.
          </BeginnerNote>
          <CodeBlock code={`lending_analytics/
├── README.md
├── dbt_project.yml                          # project config — name, paths, materializations
├── packages.yml                             # external packages like dbt-utils
│
├── analyses/                                # ad hoc SQL (compiled but never run by dbt)
├── seeds/
│   └── country_codes.csv                    # static CSV data — loaded as tables
├── snapshots/                               # SCD Type 2 historical tracking
├── macros/
│   └── cents_to_dollars.sql                 # reusable Jinja helper functions
├── tests/
│   └── assert_positive_total_amount.sql     # custom one-off data tests
│
└── models/
    ├── staging/                             # LAYER 1: clean raw sources, 1-to-1
    │   ├── core_banking/
    │   │   ├── _core_banking__sources.yml   # declare the source tables here
    │   │   ├── _core_banking__models.yml    # column tests + descriptions
    │   │   ├── _core_banking__docs.md       # reusable doc blocks
    │   │   ├── base/
    │   │   │   └── base_core_banking__loans.sql   # dedup/union before staging
    │   │   ├── stg_core_banking__loans.sql
    │   │   └── stg_core_banking__customers.sql
    │   └── payments/
    │       ├── _payments__sources.yml
    │       └── stg_payments__transactions.sql
    │
    ├── intermediate/                        # LAYER 2: complex logic, not for BI tools
    │   └── finance/
    │       ├── _int_finance__models.yml
    │       └── int_payments_pivoted_to_loans.sql
    │
    ├── marts/                               # LAYER 3: final tables consumed by analysts
    │   ├── finance/
    │   │   ├── _finance__models.yml
    │   │   ├── fct_disbursements.sql
    │   │   └── fct_repayments.sql
    │   ├── credit/
    │   │   ├── dim_customers.sql
    │   │   └── fct_defaults.sql
    │   └── operations/
    │       └── fct_loan_events.sql
    │
    └── utilities/
        └── all_dates.sql                    # date spine shared across marts`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            <InfoCard icon="🔵" title="staging/" body="1-to-1 with source tables. Clean, rename, cast — no joins, no aggregations." color={T.purple} />
            <InfoCard icon="🟡" title="intermediate/" body="Complex multi-step logic too long for a mart. Never queried by BI tools directly." color={T.yellow} />
            <InfoCard icon="🟠" title="marts/" body="Final business-facing tables. Organised by domain: finance, credit, operations." color={T.orange} />
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Data Layers",
      content: () => <LayerDAG />,
    },
    {
      title: "Sources, Tests & Docs",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            A <strong style={{ color:T.teal }}>source</strong> is any table in your warehouse that dbt reads but didn't create. You declare them in YAML so dbt can track their freshness and build lineage from them.
          </BeginnerNote>
          <SectionTitle>STEP 1 — DECLARE YOUR SOURCES</SectionTitle>
          <CodeBlock code={`# models/staging/core_banking/_core_banking__sources.yml
version: 2
sources:
  - name: core_banking               # a friendly name you choose
    database: lending_db             # your warehouse database name
    schema: raw                      # the schema where raw tables live
    tables:
      - name: loans
        description: "Raw loan records loaded by Fivetran every 30 mins"
        freshness:
          warn_after:  {count: 6,  period: hour}   # warn if data is >6h old
          error_after: {count: 24, period: hour}   # fail if data is >24h old
        loaded_at_field: _fivetran_synced           # column to check freshness`} />
          <SectionTitle>STEP 2 — REFERENCE SOURCES IN STAGING MODELS</SectionTitle>
          <CodeBlock code={`-- models/staging/core_banking/stg_core_banking__loans.sql
SELECT
    loan_id,
    customer_id,
    amount / 100 AS loan_amount_usd,   -- cents → dollars
    status,
    created_at::date AS created_date
-- Use source() not a direct table name — dbt tracks the lineage
FROM {{ source('core_banking', 'loans') }}
--   ↑ this is the "name" from sources.yml
--                  ↑ this is the "tables.name"`} />
          <SectionTitle>STEP 3 — ADD TESTS TO CATCH BAD DATA</SectionTitle>
          <CodeBlock code={`# models/staging/core_banking/_core_banking__models.yml
version: 2
models:
  - name: stg_core_banking__loans
    description: "One row per loan. Cleaned from raw.loans."
    columns:
      - name: loan_id
        description: "Unique identifier for each loan"
        tests:
          - unique          # no duplicate loan IDs allowed
          - not_null        # every row must have a loan_id

      - name: status
        tests:
          - accepted_values:
              values: ['active', 'repaid', 'defaulted', 'written_off']

      - name: customer_id
        tests:
          - relationships:  # every loan must have a matching customer
              to: ref('stg_core_banking__customers')
              field: customer_id`} />
          <Callout icon="▶️" title="RUNNING YOUR FIRST dbt COMMANDS" color={T.teal}>
            <code style={{ color:T.teal }}>dbt run</code> — builds all your models in the warehouse<br/>
            <code style={{ color:T.teal }}>dbt test</code> — runs all your data tests<br/>
            <code style={{ color:T.teal }}>dbt run --select stg_core_banking__loans</code> — run just one model<br/>
            <code style={{ color:T.teal }}>dbt source freshness</code> — check if source tables are up to date
          </Callout>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.purple} />;
}

// ══════════════════════════════════════════════════════════════════════════
// COURSE 02 — JINJA, MACROS & PACKAGES
// Interactive: Live Jinja → SQL compiler
// ══════════════════════════════════════════════════════════════════════════

function JinjaCompiler() {
  const examples = [
    {
      label: "ref()",
      jinja: `SELECT
    loan_id,
    amount,
    status
FROM {{ ref('stg_core_banking__loans') }}
WHERE status = 'active'`,
      sql: `SELECT
    loan_id,
    amount,
    status
FROM "lending_db"."dbt_damilare"."stg_core_banking__loans"
WHERE status = 'active'`,
      explain: "ref() is the most important dbt function. It replaces the raw table name with the fully-qualified warehouse path AND tells dbt 'this model depends on that one' — which is how dbt builds its lineage graph.",
    },
    {
      label: "{% if %}",
      jinja: `SELECT *
FROM {{ ref('stg_loans') }}

{% if target.name == 'prod' %}
  WHERE created_date >= '2024-01-01'
{% else %}
  -- In dev: only last 30 days to keep it fast
  WHERE created_date >= DATEADD('day', -30, CURRENT_DATE())
  LIMIT 500
{% endif %}`,
      sql: `-- When target = dev:
SELECT *
FROM "lending_db"."dbt_damilare"."stg_loans"
  -- In dev: only last 30 days to keep it fast
  WHERE created_date >= DATEADD('day', -30, CURRENT_DATE())
  LIMIT 500

-- When target = prod:
SELECT *
FROM "lending_db"."analytics"."stg_loans"
  WHERE created_date >= '2024-01-01'`,
      explain: "target.name is a built-in dbt variable that tells you which environment you're running in. Use it to make dev runs faster (less data) while prod runs the full dataset.",
    },
    {
      label: "{% for %}",
      jinja: `SELECT
    loan_id,
    {% for status in ['active','repaid','defaulted'] %}
    SUM(CASE WHEN status = '{{ status }}'
             THEN amount ELSE 0 END)
        AS total_{{ status }}_amount
    {{ "," if not loop.last }}
    {% endfor %}
FROM {{ ref('stg_loans') }}
GROUP BY loan_id`,
      sql: `SELECT
    loan_id,
    SUM(CASE WHEN status = 'active'
             THEN amount ELSE 0 END)
        AS total_active_amount,
    SUM(CASE WHEN status = 'repaid'
             THEN amount ELSE 0 END)
        AS total_repaid_amount,
    SUM(CASE WHEN status = 'defaulted'
             THEN amount ELSE 0 END)
        AS total_defaulted_amount
FROM "lending_db"."analytics"."stg_loans"
GROUP BY loan_id`,
      explain: "{% for %} loops generate repeated SQL. Instead of copy-pasting the same CASE WHEN 10 times, write it once and loop over a list. Perfect for pivoting or generating many similar columns.",
    },
    {
      label: "macro call",
      jinja: `-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(col, precision=2) %}
  ROUND({{ col }} / 100.0, {{ precision }})
{% endmacro %}

-- In your model:
SELECT
    loan_id,
    {{ cents_to_dollars('raw_amount') }}
        AS loan_amount_usd,
    {{ cents_to_dollars('raw_fee', 4) }}
        AS fee_usd
FROM {{ source('raw', 'loans') }}`,
      sql: `SELECT
    loan_id,
    ROUND(raw_amount / 100.0, 2)
        AS loan_amount_usd,
    ROUND(raw_fee / 100.0, 4)
        AS fee_usd
FROM "lending_db"."raw"."loans"`,
      explain: "Macros are reusable Jinja functions. Define cents_to_dollars once in macros/ and call it anywhere. If the logic ever changes (e.g. different rounding), you fix it in one place.",
    },
  ];

  const [selected, setSelected] = useState(0);
  const ex = examples[selected];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <BeginnerNote>
        When you run <code style={{ color:T.teal }}>dbt compile</code>, dbt processes all the Jinja in your models and outputs pure SQL. This is called <strong style={{ color:T.teal }}>compilation</strong>. Click each example to see what your Jinja becomes after compilation.
      </BeginnerNote>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {examples.map((e, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding:"5px 13px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${selected===i ? T.pink : "rgba(255,255,255,0.08)"}`,
            background:selected===i ? `${T.pink}18` : "transparent",
            color:selected===i ? T.pink : T.grey,
          }}>{e.label}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"flex-start" }}>
        <div>
          <SectionTitle color={T.pink}>YOUR JINJA (dbt model)</SectionTitle>
          <CodeBlock code={ex.jinja} small />
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", paddingTop:32, gap:4 }}>
          <div style={{ fontSize:9, color:T.grey, fontFamily:"monospace" }}>dbt compile</div>
          <div style={{ fontSize:18, color:T.pink }}>→</div>
        </div>
        <div>
          <SectionTitle color={T.teal}>COMPILED SQL (sent to your warehouse)</SectionTitle>
          <CodeBlock code={ex.sql} small />
        </div>
      </div>
      <div style={{ background:`${T.pink}09`, border:`1px solid ${T.pink}28`, borderRadius:10, padding:"10px 14px" }}>
        <div style={{ fontSize:9, color:T.pink, fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>🧠 WHY THIS MATTERS</div>
        <div style={{ fontSize:12, color:T.greyLight, lineHeight:1.65 }}>{ex.explain}</div>
      </div>
    </div>
  );
}

function JinjaSlides() {
  const steps = [
    {
      title: "Jinja in dbt",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            dbt models aren't plain SQL — they're <strong style={{ color:T.pink }}>SQL templates</strong>. Before dbt sends SQL to your warehouse, it runs the file through a templating engine called <strong style={{ color:T.pink }}>Jinja</strong>. Jinja adds logic, variables, and loops to SQL.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[
              ["{{ }}", T.orange, "Expression\n— outputs a value", `{{ ref('stg_loans') }}\n{{ var('start_date') }}\n{{ target.schema }}`],
              ["{% %}", T.pink,   "Statement\n— logic, no output",  `{% if target.name == 'prod' %}\n  ...\n{% endif %}\n{% for col in cols %}`],
              ["{# #}", T.grey,   "Comment\n— not compiled",        `{# This won't appear\n   in the compiled SQL #}`],
            ].map(([syntax, color, desc, example]) => (
              <div key={syntax} style={{ background:`${color}09`, border:`1px solid ${color}28`, borderRadius:10, padding:"12px 14px" }}>
                <code style={{ fontSize:18, color, fontFamily:"'JetBrains Mono',monospace", display:"block", marginBottom:6 }}>{syntax}</code>
                <div style={{ fontSize:11, fontWeight:600, color:"#f1f5f9", marginBottom:4, whiteSpace:"pre-line", fontFamily:"'Onest',sans-serif" }}>{desc}</div>
                <CodeBlock code={example} small />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Jinja → SQL",
      content: () => <JinjaCompiler />,
    },
    {
      title: "Writing Macros",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            A <strong style={{ color:T.pink }}>macro</strong> is like a function in Python, but for SQL. You define it once, and call it in any model. If the logic changes, you only fix it in one place.
          </BeginnerNote>
          <SectionTitle>PROBLEM: COPY-PASTE SQL IS FRAGILE</SectionTitle>
          <CodeBlock code={`-- Without a macro — repeated in 15 models:
ROUND(disbursement_amount / 100.0, 2) AS disbursement_usd
ROUND(repayment_amount / 100.0, 2) AS repayment_usd
ROUND(fee_amount / 100.0, 2) AS fee_usd
-- If the rule changes → you edit 15 files 😱`} small />
          <SectionTitle>SOLUTION: WRITE A MACRO ONCE</SectionTitle>
          <CodeBlock code={`-- macros/cents_to_dollars.sql
{%- macro cents_to_dollars(column_name, precision=2) -%}
  ROUND({{ column_name }} / 100.0, {{ precision }})
{%- endmacro -%}

-- Now use it in ANY model:
SELECT
    loan_id,
    {{ cents_to_dollars('disbursement_amount') }}    AS disbursement_usd,
    {{ cents_to_dollars('repayment_amount') }}       AS repayment_usd,
    {{ cents_to_dollars('fee_amount', precision=4) }} AS fee_usd
FROM {{ ref('stg_loans') }}`} />
          <SectionTitle>A MORE ADVANCED MACRO: GENERATE A SURROGATE KEY</SectionTitle>
          <CodeBlock code={`-- macros/generate_surrogate_key.sql
{% macro surrogate_key(fields) %}
  MD5(
    CONCAT_WS('||',
      {% for field in fields %}
        CAST({{ field }} AS VARCHAR){{ "," if not loop.last }}
      {% endfor %}
    )
  )
{% endmacro %}

-- Usage:
SELECT
    {{ surrogate_key(['loan_id', 'payment_date', 'transaction_id']) }}
        AS unique_key,
    loan_id,
    payment_date
FROM {{ ref('int_payments') }}`} />
        </div>
      ),
    },
    {
      title: "dbt Packages",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Packages are like npm/pip for dbt. Other people have already solved common problems (surrogate keys, date spines, pivot tables) and published them as packages. You install them and use their macros for free.
          </BeginnerNote>
          <SectionTitle>INSTALL PACKAGES</SectionTitle>
          <CodeBlock code={`# packages.yml  (at your project root)
packages:
  - package: dbt-labs/dbt_utils       # the most popular dbt package
    version: 1.2.0
  - package: calogica/dbt_expectations # port of Great Expectations
    version: 0.10.1

# Then run once to download them:
dbt deps`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:4 }}>
            <div>
              <SectionTitle color={T.pink}>dbt_utils — most used macros</SectionTitle>
              <CodeBlock code={`-- Surrogate key from multiple columns:
{{ dbt_utils.generate_surrogate_key(
    ['loan_id', 'payment_date']
) }}

-- Date spine (generate every date in a range):
{{ dbt_utils.date_spine(
    datepart="day",
    start_date="cast('2024-01-01' as date)",
    end_date="cast('2025-01-01' as date)"
) }}

-- Safe divide (avoids divide-by-zero errors):
{{ dbt_utils.safe_divide('numerator', 'denominator') }}`} small />
            </div>
            <div>
              <SectionTitle color={T.teal}>dbt_expectations — data tests</SectionTitle>
              <CodeBlock code={`# In your schema.yml tests:
- name: loan_amount
  tests:
    - dbt_expectations.expect_column_values_to_be_between:
        min_value: 0
        max_value: 10000000

- name: created_date
  tests:
    - dbt_expectations.expect_column_values_to_be_of_type:
        column_type: date

- name: loan_id
  tests:
    - dbt_expectations.expect_column_values_to_match_regex:
        regex: "^LN-[0-9]{6}$"`} small />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.pink} />;
}

// ══════════════════════════════════════════════════════════════════════════
// COURSE 04 — SNAPSHOTS
// Interactive: SCD Type 2 timeline — advance time to see history capture
// ══════════════════════════════════════════════════════════════════════════

function SnapshotTimeline() {
  // Simulate a loan status changing over time
  const timeline = [
    { date:"2024-01-15", event:"Loan LN-001 created",          status:"active",    amount:5000 },
    { date:"2024-03-01", event:"LN-001 missed first payment",   status:"delinquent",amount:5000 },
    { date:"2024-04-10", event:"LN-001 fully repaid",           status:"repaid",    amount:5000 },
  ];

  const [step, setStep] = useState(0);

  // Build the snapshot table up to current step
  const snapshotRows = [];
  for (let i = 0; i <= step && i < timeline.length; i++) {
    const t = timeline[i];
    // Close previous row
    if (snapshotRows.length > 0) {
      snapshotRows[snapshotRows.length - 1].valid_to = t.date;
      snapshotRows[snapshotRows.length - 1].is_current = false;
    }
    snapshotRows.push({
      loan_id: "LN-001",
      status: t.status,
      amount: t.amount,
      valid_from: t.date,
      valid_to: null,
      is_current: true,
    });
  }

  const STATUS_COLOR = { active:"#4ade80", delinquent:"#facc15", repaid:"#38bdf8" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Without snapshots, your warehouse only stores the <em>current</em> state of a record. If a loan changes from <strong style={{ color:"#4ade80" }}>active</strong> to <strong style={{ color:"#facc15" }}>delinquent</strong>, the previous state is gone forever. Snapshots capture every version of every record over time. <strong style={{ color:T.teal }}>Click "Advance time →" to simulate changes and watch the snapshot table grow.</strong>
      </BeginnerNote>

      {/* Timeline progress */}
      <div style={{ display:"flex", alignItems:"center", gap:0, background:"rgba(4,9,20,0.8)", borderRadius:10, padding:"14px 16px", border:`1px solid ${T.slate}` }}>
        {timeline.map((t, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${i<=step ? STATUS_COLOR[t.status] : T.slate}`, background:i<=step ? `${STATUS_COLOR[t.status]}18` : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, transition:"all 0.3s" }}>
                {i<=step ? "✓" : i+1}
              </div>
              <div style={{ fontSize:9, color:i<=step ? STATUS_COLOR[t.status] : T.greyDark, fontFamily:"monospace", textAlign:"center", lineHeight:1.4, maxWidth:80 }}>{t.date}<br/><span style={{ color:i<=step?"#f1f5f9":T.greyDark }}>{t.event}</span></div>
            </div>
            {i < timeline.length-1 && <div style={{ width:40, height:1, background:i<step ? T.teal : T.slate, transition:"background 0.3s", flexShrink:0 }} />}
          </div>
        ))}
      </div>

      {/* Current loan record */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div>
          <SectionTitle>WHAT raw.loans SHOWS RIGHT NOW</SectionTitle>
          <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.slate}`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ display:"flex", padding:"5px 10px", gap:0, borderBottom:`1px solid ${T.slate}` }}>
              {["loan_id","status","amount"].map(h => (
                <span key={h} style={{ fontSize:9, fontFamily:"monospace", color:T.greyDark, flex:1 }}>{h}</span>
              ))}
            </div>
            <div style={{ display:"flex", padding:"7px 10px", gap:0 }}>
              <span style={{ fontSize:10, fontFamily:"monospace", color:T.grey, flex:1 }}>LN-001</span>
              <span style={{ fontSize:10, fontFamily:"monospace", color:step<timeline.length ? STATUS_COLOR[timeline[step].status] : T.grey, flex:1, transition:"color 0.3s" }}>{step<timeline.length ? timeline[step].status : "repaid"}</span>
              <span style={{ fontSize:10, fontFamily:"monospace", color:T.grey, flex:1 }}>$5,000</span>
            </div>
          </div>
          <div style={{ fontSize:10, color:T.red, fontFamily:"monospace", marginTop:6, lineHeight:1.5 }}>
            ⚠️ Only current state. Previous statuses lost forever.
          </div>
        </div>

        <div>
          <SectionTitle color={T.teal}>snapshots.snap_loans — HISTORY PRESERVED</SectionTitle>
          <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.teal}33`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ display:"flex", padding:"5px 8px", gap:0, borderBottom:`1px solid ${T.slate}` }}>
              {["loan_id","status","valid_from","valid_to","current?"].map(h => (
                <span key={h} style={{ fontSize:8, fontFamily:"monospace", color:T.greyDark, flex:1, minWidth:0 }}>{h}</span>
              ))}
            </div>
            {snapshotRows.length === 0 && (
              <div style={{ padding:"12px 10px", fontSize:10, color:T.greyDark, fontFamily:"monospace", textAlign:"center" }}>Run dbt snapshot to capture first row →</div>
            )}
            {snapshotRows.map((r, i) => (
              <div key={i} style={{ display:"flex", padding:"5px 8px", gap:0, borderBottom:i<snapshotRows.length-1?`1px solid ${T.slate}`:"none", background:r.is_current ? `${T.teal}08`:"transparent", animation:i===snapshotRows.length-1&&i>0?"popIn 0.3s ease":"none" }}>
                <span style={{ fontSize:9, fontFamily:"monospace", color:T.grey, flex:1 }}>LN-001</span>
                <span style={{ fontSize:9, fontFamily:"monospace", color:STATUS_COLOR[r.status], flex:1 }}>{r.status}</span>
                <span style={{ fontSize:9, fontFamily:"monospace", color:T.grey, flex:1 }}>{r.valid_from}</span>
                <span style={{ fontSize:9, fontFamily:"monospace", color:r.valid_to?T.grey:T.teal, flex:1, fontStyle:r.valid_to?"normal":"italic" }}>{r.valid_to||"NULL"}</span>
                <span style={{ fontSize:9, fontFamily:"monospace", color:r.is_current?T.green:T.greyDark, flex:1 }}>{r.is_current?"✓ yes":"no"}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, color:T.teal, fontFamily:"monospace", marginTop:6, lineHeight:1.5 }}>
            ✓ Full history. NULL valid_to = current row.
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button onClick={() => setStep(0)} style={{ padding:"7px 18px", borderRadius:8, border:`1px solid ${T.slate}`, background:"transparent", color:T.grey, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>↩ Reset</button>
        <button onClick={() => setStep(s => Math.min(timeline.length-1, s+1))} disabled={step>=timeline.length-1} style={{ padding:"7px 22px", borderRadius:8, border:`1px solid ${T.teal}55`, background:step>=timeline.length-1?"transparent":`${T.teal}18`, color:step>=timeline.length-1?T.slate:T.teal, fontSize:11, cursor:step>=timeline.length-1?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>
          {step>=timeline.length-1 ? "✓ All changes captured" : "Advance time → (dbt snapshot)"}
        </button>
      </div>
    </div>
  );
}

function SnapshotsSlides() {
  const steps = [
    {
      title: "The Problem Snapshots Solve",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Most database tables only store the <strong style={{ color:T.teal }}>current state</strong> of a record. When a loan status changes from "active" to "repaid", the old "active" row is overwritten and gone. But what if Finance asks: <em>"How many loans were delinquent in March 2024?"</em> — you'd have no way to answer.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.red, fontFamily:"monospace", marginBottom:8 }}>❌ WITHOUT SNAPSHOTS</div>
              <div style={{ background:"rgba(4,9,20,0.8)", borderRadius:8, overflow:"hidden" }}>
                <div style={{ padding:"5px 10px", borderBottom:`1px solid ${T.slate}`, fontSize:9, color:T.greyDark, fontFamily:"monospace" }}>raw.loans — today</div>
                {[["LN-001","repaid"],["LN-002","active"],["LN-003","defaulted"]].map(([id,s],i) => (
                  <div key={i} style={{ padding:"5px 10px", borderBottom:i<2?`1px solid ${T.slate}`:"none", fontSize:10, fontFamily:"monospace", display:"flex", gap:12 }}>
                    <span style={{ color:T.grey }}>{id}</span>
                    <span style={{ color:s==="active"?"#4ade80":s==="repaid"?"#38bdf8":"#f87171" }}>{s}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11, color:T.greyLight, marginTop:8, lineHeight:1.5 }}>You can only answer questions about <em>today's</em> state. Historical questions are impossible.</p>
            </div>
            <div style={{ background:`${T.teal}09`, border:T.tealBorder, borderRadius:10, padding:"14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.teal, fontFamily:"monospace", marginBottom:8 }}>✅ WITH SNAPSHOTS</div>
              <div style={{ background:"rgba(4,9,20,0.8)", borderRadius:8, overflow:"hidden" }}>
                <div style={{ padding:"5px 10px", borderBottom:`1px solid ${T.slate}`, fontSize:9, color:T.greyDark, fontFamily:"monospace" }}>snapshots.snap_loans</div>
                {[["LN-001","active","Jan 15","Mar 01"],["LN-001","delinquent","Mar 01","Apr 10"],["LN-001","repaid","Apr 10","NULL"]].map(([id,s,from,to],i) => (
                  <div key={i} style={{ padding:"4px 10px", borderBottom:i<2?`1px solid ${T.slate}`:"none", fontSize:9, fontFamily:"monospace", display:"flex", gap:8 }}>
                    <span style={{ color:T.grey, minWidth:40 }}>{id}</span>
                    <span style={{ color:s==="active"?"#4ade80":s==="delinquent"?"#facc15":"#38bdf8", minWidth:70 }}>{s}</span>
                    <span style={{ color:T.greyDark }}>{from}→{to}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11, color:T.greyLight, marginTop:8, lineHeight:1.5 }}>Full history preserved. Answer any point-in-time question.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Watch Snapshots Work",
      content: () => <SnapshotTimeline />,
    },
    {
      title: "Snapshot Strategies",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            dbt needs to know <em>when</em> a record changed. There are two strategies: <strong style={{ color:T.teal }}>timestamp</strong> (recommended — uses <code style={{ color:T.teal }}>updated_at</code>) and <strong style={{ color:T.teal }}>check</strong> (compares specific columns). The official docs strongly recommend timestamp wherever possible.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle color={T.teal}>TIMESTAMP STRATEGY — recommended ✓</SectionTitle>
              <CodeBlock code={`-- YAML config (dbt Core v1.9+ — current standard)
-- snapshots/snap_loans.yml
snapshots:
  - name: snap_loans
    relation: source('core_banking', 'loans')
    config:
      schema: snapshots
      unique_key: loan_id
      strategy: timestamp
      updated_at: updated_at

-- Legacy block syntax (still valid, older projects):
-- {% snapshot snap_loans %}
--   {{ config(strategy='timestamp', unique_key='loan_id',
--     target_schema='snapshots', updated_at='updated_at') }}
--   SELECT loan_id, status, updated_at
--   FROM {{ source('core_banking','loans') }}
-- {% endsnapshot %}`} small />
              <p style={{ fontSize:11, color:T.greyLight, marginTop:8, lineHeight:1.55 }}>
                <strong style={{ color:T.teal }}>Why recommended:</strong> tracks only one column, handles schema evolution (add/remove columns) gracefully, and is more efficient.
              </p>
            </div>
            <div>
              <SectionTitle color={T.yellow}>CHECK STRATEGY — fallback only</SectionTitle>
              <CodeBlock code={`-- snapshots/snap_loans_check.yml
snapshots:
  - name: snap_loans_check
    relation: source('core_banking', 'loans')
    config:
      schema: snapshots
      unique_key: loan_id
      strategy: check
      check_cols:
        - status
        - amount
      # Check every column:
      # check_cols: all

# ⚠️ If you add/remove columns from check_cols
# you must update this config file.
# Timestamp strategy avoids this entirely.`} small />
              <p style={{ fontSize:11, color:T.greyLight, marginTop:8, lineHeight:1.55 }}>
                Use only when your source has no <code style={{ color:T.yellow }}>updated_at</code> column. More brittle — schema changes require config updates.
              </p>
            </div>
          </div>

          <Callout icon="💡" title="dbt_valid_to_current (dbt Core v1.9+)" color={T.teal}>
            By default, current records have <code style={{ color:T.teal }}>dbt_valid_to = NULL</code>. Set <code style={{ color:T.teal }}>dbt_valid_to_current: "9999-12-31"</code> in config so all records have a real date — makes BETWEEN range queries simpler and avoids NULL handling everywhere.
          </Callout>

          <SectionTitle>QUERYING SNAPSHOT HISTORY</SectionTitle>
          <CodeBlock code={`-- All loans that were delinquent during Q1 2024:
SELECT loan_id, status, dbt_valid_from, dbt_valid_to
FROM {{ ref('snap_loans') }}
WHERE status = 'delinquent'
  AND dbt_valid_from < '2024-04-01'
  AND (dbt_valid_to > '2024-01-01' OR dbt_valid_to IS NULL)

-- With dbt_valid_to_current='9999-12-31' — simpler BETWEEN:
SELECT loan_id, status
FROM {{ ref('snap_loans') }}
WHERE '2024-03-01' BETWEEN dbt_valid_from AND dbt_valid_to`} />

          <Callout icon="⚠️" title="NEVER RUN --full-refresh ON A SNAPSHOT IN PRODUCTION" color={T.red}>
            <code style={{ color:T.red }}>dbt snapshot --full-refresh</code> permanently wipes all history. There is no undo. Development only. The entire purpose of a snapshot is to preserve history — destroying it defeats the point.
          </Callout>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.teal} />;
}

// ══════════════════════════════════════════════════════════════════════════
// COURSE 05 — SEEDS & ANALYSES
// ══════════════════════════════════════════════════════════════════════════
function SeedSimulator() {
  const [phase, setPhase] = useState(0);
  // 0=csv, 1=running, 2=loaded, 3=queried
  const [running, setRunning] = useState(false);

  const csvRows = [
    { country_code:"UG", country_name:"Uganda",       currency:"UGX", region:"East Africa"    },
    { country_code:"KE", country_name:"Kenya",         currency:"KES", region:"East Africa"    },
    { country_code:"GH", country_name:"Ghana",         currency:"GHS", region:"West Africa"    },
    { country_code:"NG", country_name:"Nigeria",       currency:"NGN", region:"West Africa"    },
    { country_code:"ZA", country_name:"South Africa",  currency:"ZAR", region:"Southern Africa"},
  ];

  const resultRows = [
    { loan_id:"LN-001", amount:"$4,200", country_name:"Uganda",       currency:"UGX", region:"East Africa"    },
    { loan_id:"LN-002", amount:"$1,800", country_name:"Kenya",         currency:"KES", region:"East Africa"    },
    { loan_id:"LN-003", amount:"$6,500", country_name:"Nigeria",       currency:"NGN", region:"West Africa"    },
  ];

  const runSeed = () => {
    if (phase >= 2) { setPhase(0); return; }
    setRunning(true); setPhase(1);
    setTimeout(() => { setRunning(false); setPhase(2); }, 1800);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Watch how a CSV file becomes a real warehouse table that your models can query. Click <strong style={{ color:"#a3e635" }}>Run dbt seed</strong> to simulate the process, then see how a model joins against it.
      </BeginnerNote>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"flex-start" }}>
        {/* Left: CSV file */}
        <div>
          <SectionTitle>seeds/country_codes.csv</SectionTitle>
          <div style={{ background:"rgba(4,9,20,0.95)", border:`1px solid ${phase>=1?"#a3e635"+"55":T.slate}`, borderRadius:8, overflow:"hidden", transition:"border-color 0.4s" }}>
            <div style={{ padding:"6px 10px", borderBottom:`1px solid ${T.slate}`, display:"flex", gap:8 }}>
              {["country_code","country_name","currency","region"].map(h => (
                <span key={h} style={{ fontSize:8, fontFamily:"monospace", color:T.greyDark, flex:1 }}>{h}</span>
              ))}
            </div>
            {csvRows.map((r,i) => (
              <div key={i} style={{ padding:"5px 10px", borderBottom:i<csvRows.length-1?`1px solid ${T.slate}00`:"none", display:"flex", gap:8,
                background:phase>=1 ? `${"#a3e635"}0${i+1}` : "transparent",
                transition:`background 0.3s`, transitionDelay:`${i*120}ms` }}>
                {[r.country_code, r.country_name, r.currency, r.region].map((v,j) => (
                  <span key={j} style={{ fontSize:9, fontFamily:"monospace", color:phase>=1?"#a3e635":T.greyDark, flex:1, transition:"color 0.3s", transitionDelay:`${i*120}ms` }}>{v}</span>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop:8 }}>
            <button onClick={runSeed} disabled={running} style={{
              width:"100%", padding:"8px", borderRadius:8, fontSize:11, cursor:running?"not-allowed":"pointer",
              fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
              border:`1px solid ${"#a3e635"}55`, background:phase>=2?"rgba(163,230,53,0.06)":`${"#a3e635"}18`,
              color:running?T.grey:"#a3e635", transition:"all 0.2s",
            }}>
              {running ? "⚙️  Loading to warehouse..." : phase>=2 ? "↩ Reset" : "▶  Run dbt seed"}
            </button>
          </div>
        </div>

        {/* Middle arrow */}
        <div style={{ paddingTop:40, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:9, color:phase>=2?"#a3e635":T.slate, fontFamily:"monospace", transition:"color 0.4s" }}>dbt seed</div>
          <div style={{ fontSize:16, color:phase>=2?"#a3e635":T.slate, transition:"color 0.4s" }}>→</div>
        </div>

        {/* Right: warehouse table */}
        <div>
          <SectionTitle>warehouse: reference.country_codes</SectionTitle>
          {phase < 2 ? (
            <div style={{ background:"rgba(4,9,20,0.6)", border:`2px dashed ${T.slate}`, borderRadius:8, padding:"20px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:6 }}>📭</div>
              <div style={{ fontSize:10, color:T.greyDark, fontFamily:"monospace" }}>table does not exist yet</div>
            </div>
          ) : (
            <div style={{ background:"rgba(4,9,20,0.95)", border:`1px solid ${"#a3e635"}44`, borderRadius:8, overflow:"hidden" }}>
              <div style={{ padding:"6px 10px", borderBottom:`1px solid ${"#a3e635"}22`, display:"flex", gap:8, background:`${"#a3e635"}08` }}>
                {["country_code","country_name","currency","region"].map(h => (
                  <span key={h} style={{ fontSize:8, fontFamily:"monospace", color:"#a3e635", flex:1 }}>{h}</span>
                ))}
              </div>
              {csvRows.map((r,i) => (
                <div key={i} style={{ padding:"5px 10px", borderBottom:i<csvRows.length-1?`1px solid ${T.slate}66`:"none", display:"flex", gap:8,
                  animation:"slideIn 0.3s ease both", animationDelay:`${i*80}ms` }}>
                  {[r.country_code, r.country_name, r.currency, r.region].map((v,j) => (
                    <span key={j} style={{ fontSize:9, fontFamily:"monospace", color:T.greyLight, flex:1 }}>{v}</span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: ref() in a model */}
      {phase >= 2 && (
        <div style={{ animation:"fadeUp 0.4s ease" }}>
          <SectionTitle color="#a3e635">NOW ref() IT IN A MODEL</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"flex-start" }}>
            <CodeBlock code={`-- models/marts/fct_disbursements.sql
SELECT
  l.loan_id,
  l.amount,
  c.country_name,  -- ← from seed!
  c.currency,
  c.region
FROM {{ ref('stg_loans') }} l
JOIN {{ ref('country_codes') }} c
  ON l.country_code = c.country_code`} small />
            <div style={{ paddingTop:36, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:9, color:"#a3e635", fontFamily:"monospace" }}>dbt run</span>
              <span style={{ fontSize:16, color:"#a3e635" }}>→</span>
            </div>
            <div>
              <div style={{ background:"rgba(4,9,20,0.95)", border:`1px solid ${"#a3e635"}44`, borderRadius:8, overflow:"hidden" }}>
                <div style={{ padding:"6px 10px", borderBottom:`1px solid ${"#a3e635"}22`, display:"flex", gap:8, background:`${"#a3e635"}08` }}>
                  {["loan_id","amount","country_name","currency","region"].map(h => (
                    <span key={h} style={{ fontSize:8, fontFamily:"monospace", color:"#a3e635", flex:1 }}>{h}</span>
                  ))}
                </div>
                {resultRows.map((r,i) => (
                  <div key={i} style={{ padding:"5px 10px", borderBottom:i<resultRows.length-1?`1px solid ${T.slate}66`:"none", display:"flex", gap:8 }}>
                    {[r.loan_id, r.amount, r.country_name, r.currency, r.region].map((v,j) => (
                      <span key={j} style={{ fontSize:9, fontFamily:"monospace", color:T.greyLight, flex:1 }}>{v}</span>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:"#a3e635", fontFamily:"monospace", marginTop:5 }}>✓ Seed data joined into mart</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeedsSlides() {
  const steps = [
    {
      title: "Seeds — CSV as Tables",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            A <strong style={{ color:"#a3e635" }}>seed</strong> is just a CSV file that lives in your dbt project. When you run <code style={{ color:"#a3e635" }}>dbt seed</code>, dbt loads it into your warehouse as a table. It becomes a real warehouse table you can <code style={{ color:"#a3e635" }}>ref()</code> from any model.
          </BeginnerNote>
          <Callout icon="💡" title="WHEN TO USE SEEDS" color="#a3e635">
            Seeds are perfect for small, slowly-changing reference data: country codes, product categories, cost center mappings, risk tiers. If it fits in a spreadsheet and rarely changes — it's a seed candidate.
          </Callout>
          <CodeBlock code={`# Project structure:
seeds/
  country_codes.csv       ← you create this

# dbt_project.yml — configure the seed:
seeds:
  lending_analytics:
    country_codes:
      +schema: reference      # loads to reference.country_codes
      +column_types:
        country_code: varchar(2)
        currency: varchar(3)`} />
        </div>
      ),
    },
    { title: "Interactive: Seed → Table → Model", content: () => <SeedSimulator /> },
    {
      title: "Analyses — Ad Hoc SQL",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Analyses are SQL files in the <code style={{ color:"#a3e635" }}>analyses/</code> folder. They use <code style={{ color:"#a3e635" }}>ref()</code> and Jinja — but dbt <strong style={{ color:"#f1f5f9" }}>never materialises them</strong>. They compile to plain SQL you run manually in your warehouse editor.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle>analyses/monthly_collection_rate.sql</SectionTitle>
              <CodeBlock code={`-- Uses ref() — dbt tracks lineage
-- but NEVER creates a table from this

SELECT
    DATE_TRUNC('month', payment_date)
        AS payment_month,
    COUNT(DISTINCT loan_id)
        AS loans_with_payment,
    SUM(amount)         AS total_collected,
    AVG(days_to_repay)  AS avg_days_to_repay
FROM {{ ref('fct_repayments') }}
WHERE payment_status = 'completed'
GROUP BY 1 ORDER BY 1 DESC`} small />
            </div>
            <div>
              <SectionTitle>WORKFLOW</SectionTitle>
              <CodeBlock code={`# Compile: resolves ref() to real table names
dbt compile

# Output lands here:
# target/compiled/lending_analytics/
#   analyses/monthly_collection_rate.sql

# Copy that compiled SQL and run it
# in your warehouse SQL editor / BI tool`} small />
              <InfoCard icon="🎯" title="Good for analyses" body="Regulatory reports, audit queries, one-off stakeholder requests. Keeps ad hoc SQL in Git alongside your models." color="#a3e635" />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color="#a3e635" />;
}


// ══════════════════════════════════════════════════════════════════════════
// COURSE 06 — EXPOSURES
// Interactive: click exposure type to see YAML + lineage impact
// ══════════════════════════════════════════════════════════════════════════
function ExposureLineageViz() {
  const [activeExposure, setActiveExposure] = useState(null);
  const [broken, setBroken] = useState(null);

  const nodes = [
    { id:"raw_loans",    label:"raw.loans",         layer:"source",   x:0, color:T.grey   },
    { id:"raw_payments", label:"raw.payments",       layer:"source",   x:0, color:T.grey   },
    { id:"stg_loans",    label:"stg_loans",          layer:"staging",  x:1, color:T.purple },
    { id:"stg_payments", label:"stg_payments",       layer:"staging",  x:1, color:T.purple },
    { id:"fct_loans",    label:"fct_disbursements",  layer:"mart",     x:2, color:T.orange },
    { id:"fct_payments", label:"fct_repayments",     layer:"mart",     x:2, color:T.orange },
  ];

  const exposures = [
    { id:"dashboard", label:"Portfolio Dashboard", icon:"📊", color:T.blue,   deps:["fct_loans","fct_payments"], type:"dashboard" },
    { id:"ml",        label:"Risk ML Model",       icon:"🤖", color:T.pink,   deps:["fct_loans"],                type:"ml_model"  },
    { id:"api",       label:"Customer API",        icon:"🔌", color:T.orange, deps:["fct_loans"],                type:"application"},
  ];

  const edges = [
    ["raw_loans","stg_loans"],["raw_payments","stg_payments"],
    ["stg_loans","fct_loans"],["stg_payments","fct_payments"],["stg_loans","fct_payments"],
  ];

  const affectedExposures = broken
    ? exposures.filter(e => {
        // upstream of broken? check if broken feeds into any of e's deps
        const brokenFeeds = (modelId) => {
          if (modelId === broken) return true;
          const upstream = edges.filter(([,t]) => t === modelId).map(([s]) => s);
          return upstream.some(u => brokenFeeds(u));
        };
        return e.deps.some(d => brokenFeeds(d));
      })
    : [];

  const isNodeAffected = (id) => {
    if (!broken) return false;
    const feeds = (nId) => {
      if (nId === broken) return true;
      return edges.filter(([,t]) => t === nId).map(([s]) => s).some(u => feeds(u));
    };
    return feeds(id);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Without exposures, dbt doesn't know who uses your data. <strong style={{ color:T.blue }}>Click an exposure</strong> to highlight what it depends on. Then <strong style={{ color:T.red }}>click "Break a model"</strong> to simulate a failure and see which exposures are at risk — this is why exposures exist.
      </BeginnerNote>

      {/* Controls */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace" }}>Click an exposure:</span>
        {exposures.map(e => (
          <button key={e.id} onClick={() => { setActiveExposure(activeExposure===e.id?null:e.id); setBroken(null); }} style={{
            padding:"5px 11px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${activeExposure===e.id ? e.color : "rgba(255,255,255,0.08)"}`,
            background:activeExposure===e.id ? `${e.color}18` : "transparent",
            color:activeExposure===e.id ? e.color : T.grey,
          }}>{e.icon} {e.label}</button>
        ))}
        <div style={{ width:1, height:16, background:T.slate }} />
        <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace" }}>Simulate break:</span>
        {[{id:"fct_loans", label:"fct_disbursements"},{id:"stg_payments", label:"stg_payments"}].map(({id, label}) => (
          <button key={id} onClick={() => { setBroken(broken===id?null:id); setActiveExposure(null); }} style={{
            padding:"5px 11px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${broken===id ? T.red : "rgba(255,255,255,0.08)"}`,
            background:broken===id ? "rgba(248,113,113,0.12)" : "transparent",
            color:broken===id ? T.red : T.grey,
          }}>💥 {label}</button>
        ))}
        {(activeExposure || broken) && (
          <button onClick={() => { setActiveExposure(null); setBroken(null); }} style={{ padding:"5px 11px", borderRadius:20, fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", border:`1px solid ${T.slate}`, background:"transparent", color:T.grey }}>↩ Reset</button>
        )}
      </div>

      {/* DAG */}
      <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.slate}`, borderRadius:12, padding:"16px" }}>
        <div style={{ display:"flex", gap:0, justifyContent:"center", alignItems:"flex-start" }}>
          {/* Sources */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center", minWidth:110 }}>
            <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", letterSpacing:1, marginBottom:4 }}>SOURCES</div>
            {nodes.filter(n=>n.layer==="source").map(n => {
              const highlight = activeExposure ? exposures.find(e=>e.id===activeExposure)?.deps.some(d => edges.some(([s,t])=>s===n.id&&(t===d||nodes.some(x=>x.id===t)))) : false;
              const affected = isNodeAffected(n.id);
              const isBroken = broken===n.id;
              return (
                <div key={n.id} style={{ padding:"6px 10px", borderRadius:7, fontSize:9, fontFamily:"'JetBrains Mono',monospace",
                  border:`1px solid ${isBroken?T.red:affected?"rgba(248,113,113,0.4)":highlight?n.color+"55":"rgba(255,255,255,0.07)"}`,
                  background:isBroken?"rgba(248,113,113,0.12)":affected?"rgba(248,113,113,0.06)":highlight?`${n.color}12`:"rgba(255,255,255,0.03)",
                  color:isBroken?T.red:affected?T.red:highlight?n.color:T.greyDark, transition:"all 0.25s", width:100, textAlign:"center" }}>
                  {n.label}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", paddingTop:28 }}><div style={{ width:14, height:1, background:T.slate }} /></div>
          {/* Staging */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center", minWidth:110 }}>
            <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", letterSpacing:1, marginBottom:4 }}>STAGING</div>
            {nodes.filter(n=>n.layer==="staging").map(n => {
              const affected = isNodeAffected(n.id);
              const isBroken = broken===n.id;
              const activeExp = activeExposure ? exposures.find(e=>e.id===activeExposure) : null;
              const highlight = activeExp ? edges.some(([s,t])=>s===n.id && activeExp.deps.includes(t)) || activeExp.deps.includes(n.id) : false;
              return (
                <div key={n.id} style={{ padding:"6px 10px", borderRadius:7, fontSize:9, fontFamily:"'JetBrains Mono',monospace",
                  border:`1px solid ${isBroken?T.red:affected?"rgba(248,113,113,0.4)":highlight?n.color+"55":"rgba(255,255,255,0.07)"}`,
                  background:isBroken?"rgba(248,113,113,0.12)":affected?"rgba(248,113,113,0.06)":highlight?`${n.color}12`:"rgba(255,255,255,0.03)",
                  color:isBroken?T.red:affected?T.red:highlight?n.color:T.greyDark, transition:"all 0.25s", width:100, textAlign:"center" }}>
                  {n.label}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", paddingTop:28 }}><div style={{ width:14, height:1, background:T.slate }} /></div>
          {/* Marts */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center", minWidth:120 }}>
            <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", letterSpacing:1, marginBottom:4 }}>MARTS</div>
            {nodes.filter(n=>n.layer==="mart").map(n => {
              const isHighlighted = activeExposure ? exposures.find(e=>e.id===activeExposure)?.deps.includes(n.id) : false;
              const affected = isNodeAffected(n.id);
              const isBroken = broken===n.id;
              return (
                <div key={n.id} style={{ padding:"6px 10px", borderRadius:7, fontSize:9, fontFamily:"'JetBrains Mono',monospace",
                  border:`1px solid ${isBroken?T.red:affected?"rgba(248,113,113,0.4)":isHighlighted?n.color+"66":"rgba(255,255,255,0.07)"}`,
                  background:isBroken?"rgba(248,113,113,0.12)":affected?"rgba(248,113,113,0.06)":isHighlighted?`${n.color}15`:"rgba(255,255,255,0.03)",
                  color:isBroken?T.red:affected?T.red:isHighlighted?n.color:T.greyDark, transition:"all 0.25s", width:110, textAlign:"center",
                  fontWeight:isHighlighted?700:400 }}>
                  {n.label}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", paddingTop:28 }}><div style={{ width:14, height:1, background:T.slate }} /></div>
          {/* Exposures */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center", minWidth:130 }}>
            <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", letterSpacing:1, marginBottom:4 }}>EXPOSURES</div>
            {exposures.map(e => {
              const isActive = activeExposure===e.id;
              const isAffected = broken && affectedExposures.some(ae=>ae.id===e.id);
              return (
                <div key={e.id} onClick={() => { setActiveExposure(isActive?null:e.id); setBroken(null); }}
                  style={{ padding:"6px 10px", borderRadius:7, fontSize:9, fontFamily:"'JetBrains Mono',monospace",
                    border:`1px solid ${isAffected?T.red+"66":isActive?e.color+"66":"rgba(255,255,255,0.07)"}`,
                    background:isAffected?"rgba(248,113,113,0.1)":isActive?`${e.color}15`:"rgba(255,255,255,0.03)",
                    color:isAffected?T.red:isActive?e.color:T.greyDark, transition:"all 0.25s", cursor:"pointer",
                    width:120, textAlign:"center", fontWeight:isActive||isAffected?700:400 }}>
                  {e.icon} {e.label}
                  {isAffected && <div style={{ fontSize:8, color:T.red, marginTop:2 }}>⚠️ AT RISK</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result message */}
      {broken && (
        <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:10, padding:"12px 14px", animation:"popIn 0.2s ease" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.red, fontFamily:"monospace", marginBottom:4 }}>💥 {nodes.find(n=>n.id===broken)?.label || broken} is broken</div>
          <div style={{ fontSize:12, color:T.greyLight, lineHeight:1.6 }}>
            {affectedExposures.length > 0
              ? <>Exposures at risk: <strong style={{ color:T.red }}>{affectedExposures.map(e=>e.label).join(", ")}</strong>. Without exposures in your YAML, you'd have no idea these were broken until users complained.</>
              : "No exposures depend on this model — safe to change."}
          </div>
        </div>
      )}
      {activeExposure && (
        <div style={{ background:`${exposures.find(e=>e.id===activeExposure)?.color}09`, border:`1px solid ${exposures.find(e=>e.id===activeExposure)?.color}25`, borderRadius:10, padding:"12px 14px", animation:"popIn 0.2s ease" }}>
          <div style={{ fontSize:11, fontWeight:700, color:exposures.find(e=>e.id===activeExposure)?.color, fontFamily:"monospace", marginBottom:4 }}>
            {exposures.find(e=>e.id===activeExposure)?.icon} {exposures.find(e=>e.id===activeExposure)?.label}
          </div>
          <div style={{ fontSize:12, color:T.greyLight, lineHeight:1.6 }}>
            Depends on: <strong style={{ color:"#f1f5f9" }}>{exposures.find(e=>e.id===activeExposure)?.deps.map(depId => nodes.find(n=>n.id===depId)?.label || depId).join(", ")}</strong>.
            If either of those models breaks or goes stale, dbt can alert the exposure owner before users notice.
          </div>
        </div>
      )}
    </div>
  );
}

function ExposuresSlides() {
  const steps = [
    {
      title: "What are Exposures?",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            You've built <code style={{ color:T.blue }}>fct_disbursements</code> and it feeds a Looker dashboard, a risk ML model, and a customer-facing API. Without exposures, dbt has no idea about any of these. <strong style={{ color:T.blue }}>With exposures, they appear in your DAG</strong> — so when a model breaks, you know exactly what downstream tools are at risk.
          </BeginnerNote>
          <SectionTitle>DECLARING AN EXPOSURE</SectionTitle>
          <CodeBlock code={`# models/exposures.yml
version: 2
exposures:

  - name: loan_portfolio_dashboard
    label: "Loan Portfolio Dashboard"
    type: dashboard          # dashboard | notebook | ml_model | application
    maturity: high           # low | medium | high (SLA signal)
    url: https://bi.company.com/dashboards/42
    description: >
      Executive dashboard for loan portfolio health.
      Updated daily. Finance team relies on this for month-end.

    depends_on:
      - ref('fct_disbursements')   # ← these are your dbt models
      - ref('fct_repayments')

    owner:
      name: Damilare Adewale
      email: damilare@company.com`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <InfoCard icon="🗺️" title="Lineage visibility" body="Exposures appear as terminal nodes in dbt's DAG. Trace any dashboard back through every model to its raw source table." color={T.blue} />
            <InfoCard icon="🔔" title="Freshness alerts" body="Source freshness warnings propagate to exposures. Know which dashboards are at risk before your users notice stale data." color={T.blue} />
          </div>
        </div>
      ),
    },
    { title: "Interactive: Lineage & Break Simulation", content: () => <ExposureLineageViz /> },
    {
      title: "Exposure Commands",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <SectionTitle>SELECT MODELS FEEDING AN EXPOSURE</SectionTitle>
          <CodeBlock code={`# Run only models this exposure depends on:
dbt run  --select +exposure:loan_portfolio_dashboard

# Test all models feeding this exposure:
dbt test --select +exposure:loan_portfolio_dashboard

# Check freshness for its sources:
dbt source freshness \
  --select +exposure:loan_portfolio_dashboard`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <InfoCard icon="👤" title="Owner accountability" body="When a model upstream of an exposure changes, you know exactly who to notify. The owner field is the point of contact." color={T.blue} />
            <InfoCard icon="📐" title="Maturity signals" body="low/medium/high maturity communicates SLA expectations. A 'high' maturity exposure means consumers depend on it for critical decisions." color={T.blue} />
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.blue} />;
}


// ══════════════════════════════════════════════════════════════════════════
// COURSE 07 — STATE MANAGEMENT
// Interactive: timeline + DAG toggle + CI workflow builder
// ══════════════════════════════════════════════════════════════════════════

// ── Shared mini component: animated file icon ───────────────────────────
function ManifestFile({ label, glow = false, color = T.yellow }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "10px 14px", borderRadius: 10,
      background: glow ? `${color}15` : "rgba(255,255,255,0.03)",
      border: `1px solid ${glow ? color + "55" : "rgba(255,255,255,0.08)"}`,
      boxShadow: glow ? `0 0 16px ${color}22` : "none",
      transition: "all 0.35s",
    }}>
      <span style={{ fontSize: 22 }}>📄</span>
      <span style={{ fontSize: 9, fontFamily: "monospace", color: glow ? color : T.grey }}>{label}</span>
    </div>
  );
}

// ── Step 1: What is the manifest? ───────────────────────────────────────
function ManifestExplainer() {
  const [phase, setPhase] = useState(0);

  const phases = [
    { label: "Before dbt run", desc: "You have SQL model files on disk. dbt hasn't run yet. No manifest exists." },
    { label: "dbt run starts", desc: "dbt compiles all your Jinja, resolves all ref() calls, and builds a complete picture of your project." },
    { label: "manifest.json written", desc: "After compilation, dbt writes manifest.json to target/. It contains a fingerprint (hash) of every model's compiled SQL." },
    { label: "Next PR opens", desc: "Your PR changes stg_loans.sql. dbt compiles the PR branch — and compares the new hashes against the saved manifest." },
    { label: "State diff found!", desc: "dbt knows exactly which models changed. It can now run only those models + anything downstream." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Before understanding state, you need to understand <code style={{ color: T.yellow }}>manifest.json</code>. Think of it as a <strong style={{ color: T.yellow }}>fingerprint of your entire dbt project</strong>. dbt produces it on any command that parses your project — <code style={{ color: T.yellow }}>dbt run</code>, <code style={{ color: T.yellow }}>dbt build</code>, <code style={{ color: T.yellow }}>dbt compile</code>, <code style={{ color: T.yellow }}>dbt ls</code>, and more. Click through each phase to see how it powers state detection.
      </BeginnerNote>

      {/* Phase stepper */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {phases.map((p, i) => (
          <button key={i} onClick={() => setPhase(i)} style={{
            padding: "5px 11px", borderRadius: 20, fontSize: 9, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", transition: "all 0.18s",
            border: `1px solid ${phase === i ? T.yellow : "rgba(255,255,255,0.08)"}`,
            background: phase === i ? `${T.yellow}18` : "transparent",
            color: phase === i ? T.yellow : T.grey,
          }}>{i + 1}. {p.label}</button>
        ))}
      </div>

      {/* Visual */}
      <div style={{ background: "rgba(4,9,20,0.9)", border: `1px solid ${T.slate}`, borderRadius: 12, padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", minHeight: 90 }}>
          {/* SQL files */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["stg_loans.sql", "int_payments.sql", "fct_disbursements.sql"].map((f, i) => (
                <div key={f} style={{
                  padding: "5px 8px", borderRadius: 6, fontSize: 8,
                  fontFamily: "monospace", border: `1px solid ${T.slate}`,
                  background: phase >= 1 ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)",
                  color: phase >= 1 ? T.green : T.greyDark,
                  transition: "all 0.3s", transitionDelay: `${i * 80}ms`,
                }}>{f}</div>
              ))}
            </div>
            <span style={{ fontSize: 9, color: T.greyDark, fontFamily: "monospace" }}>your .sql files</span>
          </div>

          {/* Arrow 1 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ fontSize: 8, color: phase >= 1 ? T.green : T.slate, fontFamily: "monospace", transition: "color 0.3s" }}>dbt compile</div>
            <div style={{ fontSize: 16, color: phase >= 1 ? T.green : T.slate, transition: "color 0.3s" }}>→</div>
          </div>

          {/* Manifest */}
          <ManifestFile label="manifest.json" glow={phase >= 2} color={T.yellow} />

          {/* Arrow 2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ fontSize: 8, color: phase >= 3 ? T.orange : T.slate, fontFamily: "monospace", transition: "color 0.3s" }}>PR branch</div>
            <div style={{ fontSize: 16, color: phase >= 3 ? T.orange : T.slate, transition: "color 0.3s" }}>→</div>
          </div>

          {/* New manifest */}
          <ManifestFile label="manifest.json (PR)" glow={phase >= 3} color={T.orange} />

          {/* Diff result */}
          {phase >= 4 && (
            <div style={{
              padding: "8px 14px", borderRadius: 8, background: `${T.teal}12`,
              border: `1px solid ${T.teal}44`, fontSize: 10, fontFamily: "monospace",
              color: T.teal, animation: "popIn 0.3s ease",
            }}>
              stg_loans.sql changed!<br />
              <span style={{ color: T.grey, fontSize: 9 }}>hash: a3f1... → c8d2...</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: T.greyLight, lineHeight: 1.6, maxWidth: 500, margin: "14px auto 0" }}>
          {phases[phase].desc}
        </div>
      </div>

      {/* What's inside the manifest */}
      <SectionTitle>WHAT manifest.json ACTUALLY CONTAINS</SectionTitle>
      <CodeBlock code={`# target/manifest.json (simplified)
{
  "nodes": {
    "model.my_project.stg_loans": {
      "compiled_sql": "SELECT loan_id, ...",
      "fqn": ["my_project", "staging", "stg_loans"],
      "depends_on": {
        "nodes": ["source.my_project.core_banking.loans"]
      },
      "checksum": {
        "name": "sha256",
        "checksum": "a3f1c8d2..."  # ← hash of compiled SQL
        # This is what dbt compares to detect changes
      }
    },
    "model.my_project.int_payments": { ... },
    "model.my_project.fct_disbursements": { ... }
  }
}`} small />
    </div>
  );
}

// ── Step 2: The --defer flag ─────────────────────────────────────────────
function DeferExplainer() {
  const [showDefer, setShowDefer] = useState(false);

  const models = [
    { id: "stg_loans",      label: "stg_loans",       changed: false, layer: "staging" },
    { id: "stg_customers",  label: "stg_customers",   changed: false, layer: "staging" },
    { id: "stg_payments",   label: "stg_payments",    changed: true,  layer: "staging" },
    { id: "int_payments",   label: "int_payments",    changed: false, layer: "intermediate", deps: ["stg_payments"] },
    { id: "fct_loans",      label: "fct_disbursements", changed: false, layer: "mart",         deps: ["stg_loans", "stg_customers", "int_payments"] },
    { id: "fct_repayments", label: "fct_repayments",  changed: false, layer: "mart",         deps: ["int_payments"] },
  ];

  // Without defer: must rebuild EVERYTHING (all upstream of fct_disbursements)
  // With defer: only stg_payments + int_payments + fct_disbursements + fct_repayments
  const modifiedSet = new Set(["stg_payments"]);
  const selectedWithDefer = new Set(modifiedSet);
  let changed = true;
  while (changed) {
    changed = false;
    models.forEach(m => {
      if (!selectedWithDefer.has(m.id) && m.deps?.some(d => selectedWithDefer.has(d))) {
        selectedWithDefer.add(m.id);
        changed = true;
      }
    });
  }

  const getStatus = (m) => {
    if (!showDefer) return "rebuild"; // without defer, rebuild all
    if (selectedWithDefer.has(m.id)) return m.changed ? "modified" : "downstream";
    return "deferred"; // use prod table
  };

  const STATUS = {
    rebuild:    { color: T.red,    label: "REBUILD",   bg: "rgba(248,113,113,0.1)"  },
    modified:   { color: T.orange, label: "MODIFIED",  bg: "rgba(251,146,60,0.1)"   },
    downstream: { color: T.yellow, label: "DOWNSTREAM",bg: "rgba(250,204,21,0.08)"  },
    deferred:   { color: T.teal,   label: "USE PROD",  bg: `${T.teal}0d`            },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        <strong style={{ color: T.teal }}>--defer</strong> is dbt's way of saying: "For any upstream model I'm NOT rebuilding today, just use the version that's already in production." Without it, dbt would error on missing upstream tables in your CI schema.
      </BeginnerNote>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: T.grey }}>stg_payments.sql was changed. Show how dbt handles the rest:</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowDefer(false)} style={{
            padding: "5px 13px", borderRadius: 20, fontSize: 10, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            border: `1px solid ${!showDefer ? T.red : "rgba(255,255,255,0.08)"}`,
            background: !showDefer ? "rgba(248,113,113,0.12)" : "transparent",
            color: !showDefer ? T.red : T.grey,
          }}>Without --defer</button>
          <button onClick={() => setShowDefer(true)} style={{
            padding: "5px 13px", borderRadius: 20, fontSize: 10, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            border: `1px solid ${showDefer ? T.teal : "rgba(255,255,255,0.08)"}`,
            background: showDefer ? `${T.teal}12` : "transparent",
            color: showDefer ? T.teal : T.grey,
          }}>With --defer</button>
        </div>
      </div>

      {/* Model grid */}
      <div style={{ background: "rgba(4,9,20,0.9)", border: `1px solid ${T.slate}`, borderRadius: 12, padding: "16px" }}>
        {[
          { label: "Staging",      ids: ["stg_loans", "stg_customers", "stg_payments"] },
          { label: "Intermediate", ids: ["int_payments"] },
          { label: "Marts",        ids: ["fct_loans", "fct_repayments"] },
        ].map(row => (
          <div key={row.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{row.label.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {row.ids.map(id => {
                const m = models.find(x => x.id === id);
                const status = getStatus(m);
                const s = STATUS[status];
                return (
                  <div key={id} style={{
                    padding: "7px 12px", borderRadius: 8,
                    border: `1px solid ${s.color}55`, background: s.bg,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: s.color,
                    transition: "all 0.3s",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                  }}>
                    <span>{m.label}</span>
                    <span style={{ fontSize: 8, opacity: 0.8 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.red, fontFamily: "monospace", marginBottom: 4 }}>WITHOUT --defer</div>
          <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>dbt errors: "Table stg_loans does not exist in ci schema." You must rebuild ALL upstream models even if you didn't change them.</div>
        </div>
        <div style={{ background: `${T.teal}09`, border: T.tealBorder, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.teal, fontFamily: "monospace", marginBottom: 4 }}>WITH --defer</div>
          <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>dbt uses prod versions of stg_loans and stg_customers. Only rebuilds what actually changed and its downstream. Fast, cheap, correct.</div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Interactive DAG ──────────────────────────────────────────────
function StateInteractive() {
  const models = [
    { id: "stg_loans",      layer: "staging",      deps: [],                                         label: "stg_loans" },
    { id: "stg_customers",  layer: "staging",      deps: [],                                         label: "stg_customers" },
    { id: "stg_payments",   layer: "staging",      deps: [],                                         label: "stg_payments" },
    { id: "int_payments",   layer: "intermediate", deps: ["stg_payments"],                           label: "int_payments_pivoted" },
    { id: "fct_loans",      layer: "mart",         deps: ["stg_loans", "stg_customers", "int_payments"], label: "fct_disbursements" },
    { id: "fct_repayments", layer: "mart",         deps: ["int_payments"],                           label: "fct_repayments" },
    { id: "dim_customers",  layer: "mart",         deps: ["stg_customers"],                          label: "dim_customers" },
  ];

  const [modified, setModified] = useState(new Set());
  const toggle = (id) => setModified(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectedModified   = new Set(modified);
  const selectedModifiedPlus = new Set(modified);
  let ch = true;
  while (ch) {
    ch = false;
    models.forEach(m => {
      if (!selectedModifiedPlus.has(m.id) && m.deps?.some(d => selectedModifiedPlus.has(d))) {
        selectedModifiedPlus.add(m.id); ch = true;
      }
    });
  }

  const [selector, setSelector] = useState("modified+");
  const activeSet = selector === "modified" ? selectedModified : selector === "modified+" ? selectedModifiedPlus : new Set(models.filter(m => !modified.has(m.id) && !selectedModifiedPlus.has(m.id)).map(m => m.id));

  const LAYER_LABEL = { staging: "Staging", intermediate: "Intermediate", mart: "Marts" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        <strong style={{ color: T.yellow }}>Click model nodes</strong> to mark them as changed. Then switch between selectors to see exactly which models each one targets. This is how dbt decides what to run in CI.
      </BeginnerNote>

      {/* Selector picker */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>Selector:</span>
        {[
          ["modified",       T.orange, "Only the changed models themselves"],
          ["modified+",      T.yellow, "Changed + all downstream descendants"],
          ["deferred",       T.teal,   "Unchanged models (uses prod via --defer)"],
        ].map(([sel, c, desc]) => (
          <button key={sel} onClick={() => setSelector(sel)} style={{
            padding: "4px 11px", borderRadius: 20, fontSize: 10, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", transition: "all 0.18s",
            border: `1px solid ${selector === sel ? c : "rgba(255,255,255,0.08)"}`,
            background: selector === sel ? `${c}18` : "transparent",
            color: selector === sel ? c : T.grey,
          }}>state:{sel}</button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          [T.orange, "Modified (you changed this)"],
          [T.yellow, "Downstream (depends on modified)"],
          [T.teal, "Deferred (uses prod table)"],
          [T.greyDark, "Unchanged (not selected)"],
        ].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}>{l}</span>
          </div>
        ))}
      </div>

      {/* DAG */}
      <div style={{ background: "rgba(4,9,20,0.9)", border: `1px solid ${T.slate}`, borderRadius: 12, padding: "14px 16px" }}>
        {["staging", "intermediate", "mart"].map(layer => (
          <div key={layer} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8, color: T.greyDark, fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{LAYER_LABEL[layer].toUpperCase()}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {models.filter(m => m.layer === layer).map(m => {
                const isModified   = modified.has(m.id);
                const isDownstream = !isModified && selectedModifiedPlus.has(m.id);
                const isDeferred   = !selectedModifiedPlus.has(m.id);
                const isInActive   = activeSet.has(m.id);
                const c = isModified ? T.orange : isDownstream ? T.yellow : isDeferred ? T.teal : T.greyDark;
                return (
                  <div key={m.id} onClick={() => toggle(m.id)} style={{
                    padding: "7px 13px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${isInActive ? c : "rgba(255,255,255,0.06)"}`,
                    background: isInActive ? `${c}15` : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    color: isInActive ? c : T.greyDark,
                    fontWeight: isInActive ? 700 : 400,
                    opacity: isInActive || modified.size === 0 ? 1 : 0.45,
                  }}>
                    {m.label}
                    {isModified && <span style={{ marginLeft: 5, fontSize: 9 }}>✎</span>}
                    {isDownstream && <span style={{ marginLeft: 5, fontSize: 9 }}>↓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Command preview */}
      <div style={{ background: `${T.yellow}09`, border: `1px solid ${T.yellow}28`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 9, color: T.yellow, fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>COMMAND THAT RUNS IN CI</div>
        <code style={{ fontSize: 11, fontFamily: "monospace", color: "#e2e8f0" }}>
          dbt build --select state:{selector} --defer --state ./prod-manifest
        </code>
        {modified.size > 0 ? (
          <div style={{ marginTop: 6, fontSize: 11, color: T.greyLight }}>
            Runs <strong style={{ color: T.yellow }}>{activeSet.size}</strong> of {models.length} models
            {selector === "modified+" && ` (${modified.size} modified + ${activeSet.size - modified.size} downstream)`}
            {selector === "modified" && ` (only the ${modified.size} directly changed)`}
            {selector === "deferred" && ` (reads ${activeSet.size} unchanged models from production)`}
          </div>
        ) : (
          <div style={{ marginTop: 6, fontSize: 11, color: T.greyDark }}>← click model nodes above to see the selection</div>
        )}
      </div>
    </div>
  );
}

// ── Step 4: Full Slim CI pipeline ────────────────────────────────────────
function SlimCIPipeline() {
  const [activeStep, setActiveStep] = useState(null);

  const pipelineSteps = [
    {
      id: "pr",
      num: "1",
      icon: "🔀",
      label: "PR opened",
      color: T.purple,
      desc: "An engineer opens a Pull Request changing stg_payments.sql and int_payments_pivoted.sql.",
      detail: "The PR triggers your CI workflow (GitHub Actions, GitLab CI, dbt Cloud webhooks, etc.).",
    },
    {
      id: "manifest",
      num: "2",
      icon: "📦",
      label: "Download prod manifest",
      color: T.yellow,
      desc: "The CI job downloads manifest.json from the last successful production run.",
      detail: `# Download artifact from dbt Cloud job:
dbt-cloud artifact download \\
  --job-id $PROD_JOB_ID \\
  --run-id latest \\
  --path ./prod-manifest/
# OR: pull from S3/GCS where you stored it`,
    },
    {
      id: "compile",
      num: "3",
      icon: "🔍",
      label: "Detect changes",
      color: T.orange,
      desc: "dbt compares the PR branch manifest against prod manifest. It identifies stg_payments and int_payments as modified.",
      detail: `# dbt does this internally when you pass --state:
# It hashes your compiled SQL for each model
# and compares it to the stored manifest.
# Changed hash = modified model`,
    },
    {
      id: "build",
      num: "4",
      icon: "⚙️",
      label: "Build changed models",
      color: T.teal,
      desc: "dbt builds only modified models + downstream. Unchanged upstream models are deferred to production.",
      detail: `dbt build \\
  --select state:modified+ \\
  --defer \\
  --state ./prod-manifest/ \\
  --target ci
# Result: builds stg_payments, int_payments,
# fct_disbursements, fct_repayments — not the other 396`,
    },
    {
      id: "test",
      num: "5",
      icon: "✅",
      label: "Tests pass",
      color: T.green,
      desc: "All data tests run against the rebuilt models. If tests fail, the PR is blocked from merging.",
      detail: `# dbt build runs tests automatically.
# But you can also run explicitly:
dbt test --select state:modified+
# Tests only models that were rebuilt — fast.`,
    },
    {
      id: "merge",
      num: "6",
      icon: "🚀",
      label: "Merge → prod",
      color: T.green,
      desc: "PR merges. Production job runs the full dbt build and stores a new manifest.json for the next CI run.",
      detail: `# After merge, prod job runs:
dbt build   # full build in prod

# dbt Cloud stores manifest.json automatically.
# Self-hosted: copy target/manifest.json to S3/GCS
# so the next CI run can download it.`,
    },
  ];

  const active = pipelineSteps.find(s => s.id === activeStep);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Slim CI is the combination of everything you've learned: state detection, modified+ selector, and --defer. Click each step to see exactly what happens inside your CI pipeline.
      </BeginnerNote>

      {/* Pipeline flow */}
      <div style={{ background: "rgba(4,9,20,0.9)", border: `1px solid ${T.slate}`, borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0, justifyContent: "center" }}>
          {pipelineSteps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
              <div onClick={() => setActiveStep(activeStep === s.id ? null : s.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "10px 10px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                background: activeStep === s.id ? `${s.color}18` : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeStep === s.id ? s.color + "55" : "rgba(255,255,255,0.06)"}`,
                minWidth: 72,
                transform: activeStep === s.id ? "translateY(-2px)" : "none",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "monospace", color: s.color, fontWeight: 800 }}>{s.num}</div>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span style={{ fontSize: 8, fontFamily: "monospace", color: activeStep === s.id ? s.color : T.greyDark, textAlign: "center", lineHeight: 1.3 }}>{s.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div style={{ width: 12, height: 1, background: T.slate, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {active && (
        <div style={{ background: T.surface, border: `1px solid ${active.color}44`, borderRadius: 12, padding: "14px 16px", animation: "popIn 0.2s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{active.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: active.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step {active.num}: {active.label}</span>
          </div>
          <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7, margin: "0 0 10px" }}>{active.desc}</p>
          {active.detail.includes("\n") ? (
            <CodeBlock code={active.detail} small />
          ) : (
            <div style={{ fontSize: 11, color: T.grey, fontFamily: "monospace", background: "rgba(4,9,20,0.8)", borderRadius: 6, padding: "8px 12px" }}>{active.detail}</div>
          )}
        </div>
      )}

      {!activeStep && (
        <div style={{ textAlign: "center", fontSize: 10, color: T.greyDark, fontFamily: "monospace" }}>↑ click any pipeline step to see what happens inside</div>
      )}
    </div>
  );
}

// ── Step 5: Common pitfalls ──────────────────────────────────────────────
function StatePitfalls() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        State management is powerful but has sharp edges. These are the mistakes every team makes their first time — knowing them upfront will save you hours of debugging.
      </BeginnerNote>

      {[
        {
          color: T.red,
          icon: "❌",
          title: "Stale manifest = wrong diff",
          problem: "If you pass an old manifest.json (e.g. from 3 days ago), dbt compares against stale state. Models changed between then and now will be missed.",
          fix: "Always download the manifest from the latest successful production run. In dbt Cloud CI jobs, deferral is configured automatically — you just set the deferred environment in the job settings.",
          code: `# ❌ Wrong: using a stale or old cached manifest
dbt build --select state:modified+ --state ./old-manifest/

# ✅ Self-hosted: always pull the latest production manifest
dbt-cloud artifact download --run-id latest

# ✅ dbt Cloud CI: set the deferred environment in job settings
# dbt Cloud automatically supplies --defer and --state
# Your CI command is simply:
dbt build --select state:modified+`,
        },
        {
          color: T.orange,
          icon: "⚠️",
          title: "env_var() and var() in model bodies are not tracked",
          problem: "If your model uses {{ var('my_var') }} or {{ env_var('MY_VAR') }} inline in its SQL body (not just in config), dbt cannot detect that lineage. Changing the variable value won't cause the model to appear in state:modified.",
          fix: "When a var/env_var change affects logic, trigger a full run for that model explicitly. Use --select to target it by name rather than relying on state detection.",
          code: `# ❌ Won't detect this change:
# my_var changed from 30 to 60 in dbt_project.yml
# but model body has: WHERE days_back < {{ var('my_var') }}
dbt build --select state:modified+  # model not selected!

# ✅ Target the model directly when vars change:
dbt build --select my_model_name`,
        },
        {
          color: T.yellow,
          icon: "⚠️",
          title: "Forgetting --defer in CI",
          problem: "If you run state:modified+ without --defer, dbt will error on any upstream model that doesn't exist in your CI schema. Your CI schema is blank — only rebuilt models exist there.",
          fix: "Always pair state:modified+ with --defer and --state in CI. They're a package deal.",
          code: `# ❌ Will error: stg_loans not in ci schema
dbt build --select state:modified+ --state ./manifest/

# ✅ Correct: defer fills missing upstream from prod
dbt build --select state:modified+ \\
  --defer --state ./manifest/`,
        },
        {
          color: T.red,
          icon: "❌",
          title: "--state and --target-path must NOT be the same directory",
          problem: "dbt overwrites manifest.json at the start of every run. If --state and --target-path point to the same directory (target/), dbt overwrites the manifest before it can be read for comparison — state detection silently fails.",
          fix: "Always save your reference manifest to a different directory from your --target-path. Copy the prod manifest to ./prod-manifest/ and never set --state target/.",
          code: `# ❌ WRONG: --state and output dir are the same
dbt build --select state:modified+ --state target/
# dbt overwrites target/manifest.json before reading it
# No changes will be detected!

# ✅ CORRECT: use a separate directory for the reference manifest
cp target/manifest.json ./prod-manifest/manifest.json
dbt build --select state:modified+ --state ./prod-manifest/`,
        },
        {
          color: T.purple,
          icon: "💡",
          title: "No manifest = first run problem",
          problem: "Brand new project or first CI run — there's no production manifest to compare against. state:modified+ will fail or select nothing.",
          fix: "On the first run, do a full dbt build with no state selection. After it succeeds, save the manifest. Subsequent runs can use state.",
          code: `# First run — no manifest exists yet:
dbt build   # full build, no --select needed

# Save manifest for future CI runs:
cp target/manifest.json ./artifacts/

# All subsequent CI runs:
dbt build --select state:modified+ --defer \\
  --state ./artifacts/`,
        },
      ].map((item) => (
        <div key={item.title} style={{ background: `${item.color}08`, border: `1px solid ${item.color}28`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{item.title}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: T.red, fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>THE PROBLEM</div>
              <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>{item.problem}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: T.green, fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>THE FIX</div>
              <div style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}>{item.fix}</div>
            </div>
          </div>
          <CodeBlock code={item.code} small />
        </div>
      ))}
    </div>
  );
}

function StateSlides() {
  const steps = [
    { title: "What is the manifest?",       content: () => <ManifestExplainer /> },
    { title: "The --defer flag",             content: () => <DeferExplainer /> },
    { title: "Interactive: State Selectors", content: () => <StateInteractive /> },
    { title: "Slim CI: Full Pipeline",       content: () => <SlimCIPipeline /> },
    { title: "Common Pitfalls",             content: () => <StatePitfalls /> },
  ];
  return <GenericCourse steps={steps} color={T.yellow} />;
}
// ══════════════════════════════════════════════════════════════════════════
// COURSES 08-14 (concise but clear)
// ══════════════════════════════════════════════════════════════════════════
function RetrySimulator() {
  const models = [
    { id:"stg_loans",      label:"stg_loans",           group:0 },
    { id:"stg_payments",   label:"stg_payments",         group:0 },
    { id:"int_payments",   label:"int_payments_pivoted", group:1 },
    { id:"fct_loans",      label:"fct_disbursements",    group:2 },
    { id:"fct_repayments", label:"fct_repayments",       group:2 },
    { id:"dim_customers",  label:"dim_customers",        group:2 },
  ];
  // int_payments will fail
  const FAIL_ID = "int_payments";

  const [phase, setPhase] = useState("idle"); // idle | running | failed | fixed | retrying | done
  const [statuses, setStatuses] = useState({});
  const timers = useRef([]);

  const sched = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); };
  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const runInitial = () => {
    clearAll(); setPhase("running"); setStatuses({});
    const ordered = ["stg_loans","stg_payments","int_payments","fct_loans","fct_repayments","dim_customers"];
    ordered.forEach((id, i) => {
      sched(() => setStatuses(p => ({ ...p, [id]: "running" })), i * 400);
      if (id === FAIL_ID) {
        sched(() => setStatuses(p => ({ ...p, [id]: "error" })), i * 400 + 500);
        ["fct_loans","fct_repayments","dim_customers"].forEach((sid, j) => {
          sched(() => setStatuses(p => ({ ...p, [sid]: "skipped" })), i * 400 + 600 + j * 100);
        });
        sched(() => setPhase("failed"), i * 400 + 900);
      } else if (!["fct_loans","fct_repayments","dim_customers"].includes(id)) {
        sched(() => setStatuses(p => ({ ...p, [id]: "success" })), i * 400 + 500);
      }
    });
  };

  const runRetry = () => {
    clearAll(); setPhase("retrying");
    // Only retry error + skipped
    const toRetry = ["int_payments","fct_loans","fct_repayments","dim_customers"];
    toRetry.forEach((id, i) => {
      sched(() => setStatuses(p => ({ ...p, [id]: "running" })), i * 450);
      sched(() => setStatuses(p => ({ ...p, [id]: "success" })), i * 450 + 500);
    });
    sched(() => setPhase("done"), toRetry.length * 450 + 600);
  };

  const reset = () => { clearAll(); setPhase("idle"); setStatuses({}); };

  const STATUS_STYLE = {
    idle:    { color:T.greyDark, bg:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.06)", label:"" },
    running: { color:T.yellow,  bg:`${T.yellow}10`,            border:`${T.yellow}44`,         label:"⚙️" },
    success: { color:T.green,   bg:`${T.green}0d`,             border:`${T.green}44`,          label:"✓" },
    error:   { color:T.red,     bg:"rgba(248,113,113,0.12)",   border:"rgba(248,113,113,0.4)", label:"✕" },
    skipped: { color:T.grey,    bg:"rgba(255,255,255,0.02)",   border:"rgba(255,255,255,0.06)",label:"⏭" },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Watch a full dbt run fail mid-way, then see how <strong style={{ color:T.orange }}>dbt retry</strong> recovers only the failed and skipped models — not the ones that already succeeded.
      </BeginnerNote>

      {/* Model pipeline */}
      <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.slate}`, borderRadius:12, padding:"16px" }}>
        {[0,1,2].map(grp => (
          <div key={grp} style={{ marginBottom:12 }}>
            <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", letterSpacing:1, marginBottom:6 }}>
              {grp===0?"STAGING":grp===1?"INTERMEDIATE":"MARTS"}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {models.filter(m => m.group===grp).map(m => {
                const s = statuses[m.id] || "idle";
                const st = STATUS_STYLE[s];
                return (
                  <div key={m.id} style={{
                    padding:"7px 12px", borderRadius:8, fontSize:10, fontFamily:"'JetBrains Mono',monospace",
                    border:`1px solid ${st.border}`, background:st.bg, color:st.color,
                    transition:"all 0.3s", display:"flex", alignItems:"center", gap:6,
                    fontWeight:s==="error"||s==="running"?700:400,
                  }}>
                    {st.label && <span>{st.label}</span>}
                    {m.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Status message */}
      {phase !== "idle" && (
        <div style={{
          padding:"10px 14px", borderRadius:8, fontSize:11, fontFamily:"monospace",
          background: phase==="failed"?"rgba(248,113,113,0.08)":phase==="done"?`${T.green}09`:`${T.yellow}09`,
          border: `1px solid ${phase==="failed"?T.red:phase==="done"?T.green:T.yellow}33`,
          color: phase==="failed"?T.red:phase==="done"?T.green:T.yellow,
        }}>
          {phase==="running"  && "⚙️  dbt run — processing all 6 models..."}
          {phase==="failed"   && "❌ Run failed at int_payments_pivoted. Models fct_disbursements, fct_repayments, dim_customers were skipped."}
          {phase==="fixed"    && "🔧 Bug fixed. Ready to retry — only 4 models need to run."}
          {phase==="retrying" && "⚙️  dbt retry — running only failed + skipped models (4 of 6)..."}
          {phase==="done"     && "✅ All models succeeded. stg_loans and stg_payments were NOT re-run — they passed first time."}
        </div>
      )}

      {/* target/run_results.json preview */}
      {(phase === "failed" || phase === "fixed") && (
        <div>
          <SectionTitle>target/run_results.json — what dbt retry reads</SectionTitle>
          <CodeBlock code={`{
  "results": [
    { "unique_id": "model.stg_loans",      "status": "success" },
    { "unique_id": "model.stg_payments",   "status": "success" },
    { "unique_id": "model.int_payments",   "status": "error"   },  // ← retry this
    { "unique_id": "model.fct_disbursements", "status": "skipped" },  // ← retry this
    { "unique_id": "model.fct_repayments", "status": "skipped" },  // ← retry this
    { "unique_id": "model.dim_customers",  "status": "skipped" }   // ← retry this
  ]
}`} small />
        </div>
      )}

      {/* Buttons */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {phase==="idle" && (
          <button onClick={runInitial} style={{ padding:"8px 20px", borderRadius:8, border:`1px solid ${T.orange}44`, background:`${T.orange}14`, color:T.orange, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>▶ Run dbt run (will fail)</button>
        )}
        {phase==="failed" && (
          <button onClick={() => setPhase("fixed")} style={{ padding:"8px 20px", borderRadius:8, border:`1px solid ${T.yellow}44`, background:`${T.yellow}10`, color:T.yellow, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>🔧 Fix the bug</button>
        )}
        {phase==="fixed" && (
          <button onClick={runRetry} style={{ padding:"8px 20px", borderRadius:8, border:`1px solid ${T.green}44`, background:`${T.green}10`, color:T.green, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>▶ dbt retry</button>
        )}
        {(phase==="failed"||phase==="done"||phase==="fixed") && (
          <button onClick={reset} style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${T.slate}`, background:"transparent", color:T.grey, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>↩ Reset</button>
        )}
      </div>
    </div>
  );
}

function RetrySlides() {
  const steps = [
    {
      title: "dbt retry",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Your dbt run has 200 models. Model #150 fails because of a warehouse timeout. Without <code style={{ color:T.orange }}>dbt retry</code>, you'd rerun all 200. With retry, you rerun only the failed and skipped ones.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle color={T.red}>WITHOUT RETRY</SectionTitle>
              <CodeBlock code={`dbt run   # 200 models
# ✅ Models 1-149: SUCCESS
# ❌ Model 150: FAILED
# ⏭️ Models 151-200: SKIPPED

# Fix the bug, then:
dbt run   # reruns ALL 200 again 😩
# Even the 149 that passed!`} small />
            </div>
            <div>
              <SectionTitle color={T.green}>WITH RETRY</SectionTitle>
              <CodeBlock code={`dbt run   # 200 models
# ✅ Models 1-149: SUCCESS
# ❌ Model 150: FAILED
# ⏭️ Models 151-200: SKIPPED

# Fix the bug, then:
dbt retry  # reruns only 51 models 🎉
# (1 error + 50 skipped)`} small />
            </div>
          </div>
          <Callout icon="⚠️" title="IMPORTANT GOTCHA" color={T.orange}>
            <code style={{ color:T.orange }}>dbt retry</code> uses the same command flags as the original run. It won't pick up <code style={{ color:T.orange }}>dbt_project.yml</code> changes. If you changed project config, run <code style={{ color:T.orange }}>dbt run</code> fresh.
          </Callout>
        </div>
      ),
    },
    { title: "Interactive: Watch Retry Work", content: () => <RetrySimulator /> },
  ];
  return <GenericCourse steps={steps} color={T.orange} />;
}


function MeshAccessExplorer() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedProject, setSelectedProject] = useState("finance_analytics");

  const models = [
    { id:"stg_loans",     project:"lending_core",      access:"private",    group:"data_eng",    label:"stg_loans",       desc:"Cleaned staging model. Private — internal use only." },
    { id:"int_payments",  project:"lending_core",      access:"protected",  group:"data_eng",    label:"int_payments",    desc:"Intermediate pivot. Protected — only lending_core models can ref it." },
    { id:"mart_loans",    project:"lending_core",      access:"public",     group:"data_eng",    label:"mart_loans",      desc:"Public interface. Any project can ref() this with a contract." },
    { id:"mart_payments", project:"lending_core",      access:"public",     group:"data_eng",    label:"mart_payments",   desc:"Public interface. Contractually enforced schema." },
    { id:"fct_revenue",   project:"finance_analytics", access:"private",    group:"finance",     label:"fct_revenue",     desc:"Finance-only model. References mart_loans from lending_core." },
    { id:"rpt_portfolio", project:"credit_analytics",  access:"private",    group:"credit_risk", label:"rpt_portfolio",   desc:"Credit risk report. References mart_loans from lending_core." },
  ];

  const projects = [
    { id:"lending_core",      label:"lending_core",      color:"#c084fc", owner:"Data Engineering", icon:"🏭" },
    { id:"finance_analytics", label:"finance_analytics", color:T.blue,    owner:"Finance Team",     icon:"💰" },
    { id:"credit_analytics",  label:"credit_analytics",  color:T.teal,    owner:"Credit Risk Team", icon:"📊" },
  ];

  const ACCESS_COLOR = { public:"#4ade80", protected:"#facc15", private:"#94a3b8" };

  const canRef = (fromProject, model) => {
    if (fromProject === model.project) return true;
    if (model.access === "public") return true;
    return false;
  };

  const active = models.find(m => m.id === selectedModel);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        dbt Mesh uses <strong style={{ color:"#c084fc" }}>access levels</strong> to control which projects can reference which models. <strong style={{ color:"#c084fc" }}>Click a model</strong> to see its access level, then <strong style={{ color:"#c084fc" }}>switch the consumer project</strong> to see whether it can ref() that model.
      </BeginnerNote>

      {/* Project selector */}
      <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace" }}>Consumer project (trying to ref a model):</span>
        {projects.filter(p=>p.id!=="lending_core").map(p => (
          <button key={p.id} onClick={() => setSelectedProject(p.id)} style={{
            padding:"5px 12px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${selectedProject===p.id ? p.color : "rgba(255,255,255,0.08)"}`,
            background:selectedProject===p.id ? `${p.color}18` : "transparent",
            color:selectedProject===p.id ? p.color : T.grey,
          }}>{p.icon} {p.id}</button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {Object.entries(ACCESS_COLOR).map(([a,c]) => (
          <div key={a} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:7, height:7, borderRadius:2, background:c }} />
            <span style={{ fontSize:9, color:T.grey, fontFamily:"monospace" }}>{a}</span>
          </div>
        ))}
      </div>

      {/* Project boxes */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {projects.map(proj => (
          <div key={proj.id} style={{
            background:`${proj.color}07`, border:`1px solid ${proj.color}22`,
            borderRadius:10, padding:"12px 14px", flex:"1 1 180px", minWidth:180,
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:proj.color, fontFamily:"'Bricolage Grotesque',sans-serif", marginBottom:4 }}>
              {proj.icon} {proj.label}
            </div>
            <div style={{ fontSize:9, color:T.grey, fontFamily:"monospace", marginBottom:10 }}>{proj.owner}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {models.filter(m=>m.project===proj.id).map(m => {
                const reachable = canRef(selectedProject, m);
                const isActive = selectedModel === m.id;
                const ac = ACCESS_COLOR[m.access];
                return (
                  <div key={m.id} onClick={() => setSelectedModel(isActive?null:m.id)} style={{
                    padding:"6px 9px", borderRadius:7, cursor:"pointer", transition:"all 0.2s",
                    border:`1px solid ${isActive?ac+"88":"rgba(255,255,255,0.07)"}`,
                    background:isActive?`${ac}14`:"rgba(255,255,255,0.03)",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                  }}>
                    <span style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace", color:isActive?ac:T.greyDark }}>{m.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ fontSize:8, fontFamily:"monospace", padding:"1px 5px", borderRadius:8, background:`${ac}18`, color:ac }}>{m.access}</span>
                      {proj.id !== "lending_core" && proj.id === selectedProject && (
                        <span style={{ fontSize:10 }}>{reachable ? "✅" : "🚫"}</span>
                      )}
                      {proj.id === "lending_core" && selectedProject !== "lending_core" && (
                        <span style={{ fontSize:10 }}>{reachable ? "✅" : "🚫"}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {active && (
        <div style={{ background:T.surface, border:`1px solid ${ACCESS_COLOR[active.access]}44`, borderRadius:10, padding:"12px 14px", animation:"popIn 0.2s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <code style={{ fontSize:12, color:ACCESS_COLOR[active.access], fontFamily:"monospace" }}>{active.label}</code>
            <span style={{ fontSize:9, background:`${ACCESS_COLOR[active.access]}18`, color:ACCESS_COLOR[active.access], border:`1px solid ${ACCESS_COLOR[active.access]}44`, padding:"1px 7px", borderRadius:10, fontFamily:"monospace" }}>{active.access}</span>
          </div>
          <p style={{ fontSize:12, color:T.greyLight, lineHeight:1.6, margin:"0 0 8px" }}>{active.desc}</p>
          {canRef(selectedProject, active) ? (
            <CodeBlock code={`-- ✅ ${selectedProject} CAN reference this:
FROM {{ ref('${active.project}', '${active.label}') }}`} small />
          ) : (
            <CodeBlock code={`-- 🚫 ${selectedProject} CANNOT reference this:
-- access: ${active.access} means only ${active.project} can use it
-- Fix: ask the ${active.project} owner to set access: public`} small />
          )}
        </div>
      )}
    </div>
  );
}

function MeshSlides() {
  const steps = [
    {
      title: "What is dbt Mesh?",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Imagine 5 teams all editing one dbt project with 1,000 models. Every PR blocks everyone else. dbt Mesh solves this by letting each team own <strong style={{ color:"#c084fc" }}>their own project</strong> while being able to safely reference another team's stable, published models.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"center" }}>
            <div style={{ background:"rgba(192,132,252,0.07)", border:"1px solid rgba(192,132,252,0.2)", borderRadius:10, padding:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#c084fc", fontFamily:"monospace", marginBottom:8 }}>PRODUCER PROJECT<br/><span style={{ fontSize:9, fontWeight:400 }}>lending_core (Data Eng team)</span></div>
              <CodeBlock code={`# mart_loans is PUBLIC — any project can use it
# contract: enforced means schema is locked
models:
  - name: mart_loans
    access: public
    config:
      contract:
        enforced: true
    columns:
      - name: loan_id
        data_type: varchar
        constraints:
          - type: not_null`} small />
            </div>
            <div style={{ textAlign:"center", color:"#c084fc", fontSize:20 }}>→</div>
            <div style={{ background:"rgba(192,132,252,0.07)", border:"1px solid rgba(192,132,252,0.2)", borderRadius:10, padding:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#c084fc", fontFamily:"monospace", marginBottom:8 }}>CONSUMER PROJECT<br/><span style={{ fontSize:9, fontWeight:400 }}>finance_analytics (Finance team)</span></div>
              <CodeBlock code={`-- Cross-project ref() syntax:
-- ref('project_name', 'model_name')
SELECT
  l.loan_id,
  l.amount,
  l.status
FROM {{ ref('lending_core', 'mart_loans') }} l
-- If lending_core changes mart_loans schema
-- → CI fails → Finance is protected ✓`} small />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            <InfoCard icon="🔓" title="access: public" body="Any project can ref() this. Use for stable interfaces between teams. Schema must be contractually defined." color="#c084fc" />
            <InfoCard icon="🔒" title="access: private" body="Only models within the same project can ref() this. Internal implementation detail — hidden from other teams." color="#c084fc" />
            <InfoCard icon="🛡️" title="access: protected" body="Only models in the same project OR same group can ref() this. Middle ground between public and private." color="#c084fc" />
          </div>
        </div>
      ),
    },
    { title: "Interactive: Access Explorer", content: () => <MeshAccessExplorer /> },
  ];
  return <GenericCourse steps={steps} color="#c084fc" />;
}



// ══════════════════════════════════════════════════════════════════════════
// ADVANCED TESTING — INTERACTIVE TEST LAB
// Shows: raw data → compiled SQL → which rows fail → failures table
// ══════════════════════════════════════════════════════════════════════════

// The table we'll be testing against — visible to learners throughout
const TEST_TABLE_ROWS = [
  { loan_id:"LN-001", customer_id:"C-101", disbursement_amount:  5000, status:"active",    email:"alice@co.com"  },
  { loan_id:"LN-002", customer_id:"C-102", disbursement_amount:  1200, status:"repaid",    email:"bob@co.com"    },
  { loan_id:"LN-003", customer_id:"C-999", disbursement_amount:  3400, status:"active",    email:"carol@co.com"  },  // C-999 not in dim_customers
  { loan_id:"LN-004", customer_id:"C-104", disbursement_amount:     0, status:"defaulted", email:null             },  // amount=0, null email
  { loan_id:"LN-005", customer_id:"C-105", disbursement_amount: -500,  status:"suspended", email:"eve@co.com"    },  // negative amount, bad status
  { loan_id:"LN-001", customer_id:"C-106", disbursement_amount:  2000, status:"active",    email:"frank@co.com"  },  // duplicate loan_id!
  { loan_id:"LN-006", customer_id:null,    disbursement_amount:  8000, status:"repaid",    email:"grace@co.com"  },  // null customer_id
];

const DIM_CUSTOMERS = ["C-101","C-102","C-103","C-104","C-105","C-106","C-107"];

const TEST_DEFINITIONS = {
  unique: {
    label: "unique",
    color: "#818cf8",
    icon: "🔑",
    desc: "Checks that every value in the column appears only once. Detects duplicate records.",
    yaml: `- name: loan_id
  tests:
    - unique`,
    compiledSQL: `-- dbt compiles "unique" to:
SELECT
  loan_id,
  COUNT(*) AS n
FROM analytics.fct_disbursements
GROUP BY loan_id
HAVING COUNT(*) > 1
-- Any rows returned = FAIL (duplicate IDs found)`,
    failingRows: (rows) => {
      const counts = {};
      rows.forEach(r => { counts[r.loan_id] = (counts[r.loan_id] || 0) + 1; });
      return rows.filter(r => counts[r.loan_id] > 1);
    },
    failReason: (r) => `loan_id "${r.loan_id}" appears ${2} times`,
    failColumns: ["loan_id"],
  },
  not_null: {
    label: "not_null",
    color: T.teal,
    icon: "🚫",
    desc: "Checks that no value in the column is NULL. Every row must have a value.",
    yaml: `- name: customer_id
  tests:
    - not_null`,
    compiledSQL: `-- dbt compiles "not_null" to:
SELECT customer_id
FROM analytics.fct_disbursements
WHERE customer_id IS NULL
-- Any rows returned = FAIL (null values found)`,
    failingRows: (rows) => rows.filter(r => r.customer_id === null),
    failReason: (r) => `customer_id is NULL`,
    failColumns: ["customer_id"],
  },
  accepted_values: {
    label: "accepted_values",
    color: T.orange,
    icon: "📋",
    desc: "Checks that every value in the column is from a predefined allowed list.",
    yaml: `- name: status
  tests:
    - accepted_values:
        values: ['active','repaid','defaulted']`,
    compiledSQL: `-- dbt compiles "accepted_values" to:
SELECT status
FROM analytics.fct_disbursements
WHERE status NOT IN (
  'active', 'repaid', 'defaulted'
)
-- Any rows returned = FAIL (unexpected value)`,
    failingRows: (rows) => rows.filter(r => !["active","repaid","defaulted"].includes(r.status)),
    failReason: (r) => `"${r.status}" is not in allowed values`,
    failColumns: ["status"],
  },
  relationships: {
    label: "relationships",
    color: "#f472b6",
    icon: "🔗",
    desc: "Checks referential integrity — every value must exist in a reference table. Like a foreign key constraint.",
    yaml: `- name: customer_id
  tests:
    - relationships:
        to: ref('dim_customers')
        field: customer_id`,
    compiledSQL: `-- dbt compiles "relationships" to:
SELECT customer_id
FROM analytics.fct_disbursements
WHERE customer_id IS NOT NULL
  AND customer_id NOT IN (
    SELECT customer_id
    FROM analytics.dim_customers
  )
-- Any rows = orphaned records (FK violation)`,
    failingRows: (rows) => rows.filter(r => r.customer_id && !DIM_CUSTOMERS.includes(r.customer_id)),
    failReason: (r) => `"${r.customer_id}" not found in dim_customers`,
    failColumns: ["customer_id"],
  },
  assert_positive: {
    label: "assert_positive (custom)",
    color: T.green,
    icon: "➕",
    desc: "A custom generic test. Checks that a numeric column is always greater than zero.",
    yaml: `-- macros/test_assert_positive.sql
{% test assert_positive(model, column_name) %}
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} <= 0
{% endtest %}

-- Apply it:
- name: disbursement_amount
  tests:
    - assert_positive`,
    compiledSQL: `-- dbt compiles your custom test to:
SELECT disbursement_amount
FROM analytics.fct_disbursements
WHERE disbursement_amount <= 0
-- Returns failing rows: 0 values and negatives`,
    failingRows: (rows) => rows.filter(r => r.disbursement_amount <= 0),
    failReason: (r) => `${r.disbursement_amount} is not > 0`,
    failColumns: ["disbursement_amount"],
  },
};

function TestLab() {
  const [activeTest, setActiveTest]   = useState(null);
  const [tab, setTab]                 = useState("data"); // "data" | "sql" | "failures"
  const [running, setRunning]         = useState(false);
  const [ran, setRan]                 = useState(false);
  const timers = useRef([]);

  const testDef = activeTest ? TEST_DEFINITIONS[activeTest] : null;
  const failingRows = testDef ? testDef.failingRows(TEST_TABLE_ROWS) : [];
  const passingRows = testDef ? TEST_TABLE_ROWS.filter(r => !failingRows.includes(r)) : [];

  const selectTest = (testId) => {
    setActiveTest(testId);
    setTab("data");
    setRan(false);
    setRunning(false);
    timers.current.forEach(clearTimeout);
  };

  const runTest = () => {
    setRunning(true); setTab("sql"); setRan(false);
    const t1 = setTimeout(() => setTab("failures"), 1000);
    const t2 = setTimeout(() => { setRunning(false); setRan(true); }, 1200);
    timers.current = [t1, t2];
  };

  const COL_LABELS = {
    loan_id: "loan_id",
    customer_id: "customer_id",
    disbursement_amount: "amount",
    status: "status",
    email: "email",
  };
  const COLUMNS = ["loan_id","customer_id","disbursement_amount","status","email"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Below is a real <code style={{ color:T.teal }}>fct_disbursements</code> table with intentional data quality issues hidden in it. <strong style={{ color:T.teal }}>Select a test type</strong> to see its YAML config, the SQL dbt compiles it to, and exactly which rows fail.
      </BeginnerNote>

      {/* Test type selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {Object.entries(TEST_DEFINITIONS).map(([key, def]) => (
          <button key={key} onClick={() => selectTest(key)} style={{
            padding:"6px 12px", borderRadius:8, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${activeTest===key ? def.color : "rgba(255,255,255,0.08)"}`,
            background:activeTest===key ? `${def.color}18` : "rgba(255,255,255,0.03)",
            color:activeTest===key ? def.color : T.grey, fontWeight:activeTest===key?700:400,
          }}>
            {def.icon} {def.label}
          </button>
        ))}
      </div>

      {/* Source data table — always visible */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
          <SectionTitle>fct_disbursements — source data (7 rows, some with issues)</SectionTitle>
          {activeTest && (
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:7, height:7, borderRadius:2, background:T.red }} />
                <span style={{ fontSize:9, color:T.grey, fontFamily:"monospace" }}>fails test</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:7, height:7, borderRadius:2, background:T.green }} />
                <span style={{ fontSize:9, color:T.grey, fontFamily:"monospace" }}>passes test</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ background:"rgba(4,9,20,0.95)", border:`1px solid ${activeTest ? testDef.color+"33" : T.slate}`, borderRadius:10, overflow:"auto", transition:"border-color 0.3s" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'JetBrains Mono',monospace" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.slate}` }}>
                {COLUMNS.map(col => (
                  <th key={col} style={{
                    padding:"6px 10px", textAlign:"left", fontSize:9,
                    color: activeTest && testDef.failColumns.includes(col) ? testDef.color : T.greyDark,
                    fontWeight: activeTest && testDef.failColumns.includes(col) ? 800 : 600,
                    letterSpacing:0.5, whiteSpace:"nowrap",
                    borderBottom: activeTest && testDef.failColumns.includes(col) ? `2px solid ${testDef.color}55` : "none",
                  }}>
                    {COL_LABELS[col]}
                    {activeTest && testDef.failColumns.includes(col) && (
                      <span style={{ marginLeft:4, fontSize:8, color:testDef.color }}>← tested</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_TABLE_ROWS.map((row, ri) => {
                const isFailing = activeTest && failingRows.includes(row);
                const isPassing = activeTest && !isFailing;
                return (
                  <tr key={ri} style={{
                    borderBottom:ri<TEST_TABLE_ROWS.length-1?`1px solid ${T.slate}22`:"none",
                    background: isFailing ? "rgba(248,113,113,0.08)" : isPassing ? "rgba(74,222,128,0.04)" : "transparent",
                    transition:"background 0.3s",
                  }}>
                    {COLUMNS.map(col => {
                      const val = row[col];
                      const isBadCell = activeTest && testDef.failColumns.includes(col) && isFailing;
                      const isNull = val === null || val === undefined;
                      return (
                        <td key={col} style={{
                          padding:"6px 10px", fontSize:10,
                          color: isBadCell ? T.red : isNull ? T.greyDark : T.greyLight,
                          fontStyle: isNull ? "italic" : "normal",
                          fontWeight: isBadCell ? 700 : 400,
                          position:"relative",
                        }}>
                          {isNull ? "NULL" : String(val)}
                          {isBadCell && <span style={{ marginLeft:5, fontSize:9, color:T.red }}>✕</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {activeTest && (
          <div style={{ marginTop:5, fontSize:10, color:T.greyDark, fontFamily:"monospace" }}>
            {failingRows.length > 0
              ? <span style={{ color:T.red }}>⚠️ {failingRows.length} row{failingRows.length>1?"s":""} would fail this test</span>
              : <span style={{ color:T.green }}>✓ All rows pass this test</span>
            }
          </div>
        )}
      </div>

      {/* Detail panel — only when a test is selected */}
      {activeTest && (
        <div style={{ background:"rgba(4,9,20,0.95)", border:`1px solid ${testDef.color}33`, borderRadius:12, overflow:"hidden" }}>
          {/* Test header */}
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${testDef.color}22`, background:`${testDef.color}09` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:18 }}>{testDef.icon}</span>
              <span style={{ fontSize:14, fontWeight:800, color:testDef.color, fontFamily:"'Bricolage Grotesque',sans-serif" }}>{testDef.label}</span>
              <span style={{ fontSize:9, background:`${testDef.color}18`, color:testDef.color, border:`1px solid ${testDef.color}33`, padding:"2px 8px", borderRadius:10, fontFamily:"monospace", marginLeft:"auto" }}>
                {failingRows.length === 0 ? "✓ 0 failures" : `✕ ${failingRows.length} failure${failingRows.length>1?"s":""}`}
              </span>
            </div>
            <div style={{ fontSize:12, color:T.greyLight, lineHeight:1.6 }}>{testDef.desc}</div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:`1px solid ${T.slate}` }}>
            {[["data","📋 YAML Config"],["sql","⚙️ Compiled SQL"],["failures","🔍 Failing Rows"]].map(([t,label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"8px 14px", border:"none", background:"transparent", cursor:"pointer",
                fontSize:10, fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
                color:tab===t ? testDef.color : T.grey,
                borderBottom: tab===t ? `2px solid ${testDef.color}` : "2px solid transparent",
                fontWeight:tab===t?700:400,
              }}>{label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding:"14px 16px" }}>
            {/* YAML tab */}
            {tab === "data" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace", letterSpacing:0.5 }}>HOW TO DECLARE THIS TEST IN YOUR YAML</div>
                <CodeBlock code={testDef.yaml} small />
                {activeTest === "assert_positive" && (
                  <Callout icon="🧩" title="CUSTOM GENERIC TESTS" color={T.green}>
                    Unlike built-in tests, <code style={{ color:T.green }}>assert_positive</code> is a macro you write yourself in <code style={{ color:T.green }}>macros/</code>. Once defined, apply it to any column in any model — it works exactly like the built-in ones.
                  </Callout>
                )}
              </div>
            )}

            {/* Compiled SQL tab */}
            {tab === "sql" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace", letterSpacing:0.5 }}>THE SQL dbt SENDS TO YOUR WAREHOUSE</div>
                <CodeBlock code={testDef.compiledSQL} small />
                <Callout icon="🧠" title="THE GOLDEN RULE" color={testDef.color}>
                  Every single dbt test — built-in or custom — compiles to a SQL query. <strong style={{ color:"#f1f5f9" }}>0 rows returned = test passes.</strong> Any rows returned = those ARE the failing records. There are no exceptions to this rule.
                </Callout>
              </div>
            )}

            {/* Failures tab */}
            {tab === "failures" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {failingRows.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"20px 0" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                    <div style={{ fontSize:13, color:T.green, fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:700 }}>Test passes — 0 rows returned</div>
                    <div style={{ fontSize:11, color:T.grey, marginTop:4 }}>The compiled SQL query found no violations in the data.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:9, color:T.red, fontFamily:"monospace", letterSpacing:0.5 }}>
                        ROWS RETURNED BY THE TEST QUERY — {failingRows.length} FAILURE{failingRows.length>1?"S":""}
                      </div>
                    </div>

                    {/* Failing rows detail */}
                    <div style={{ background:"rgba(248,113,113,0.06)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:8, overflow:"hidden" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'JetBrains Mono',monospace" }}>
                        <thead>
                          <tr style={{ borderBottom:`1px solid ${T.slate}` }}>
                            {[...testDef.failColumns, "failure_reason"].map(h => (
                              <th key={h} style={{ padding:"6px 10px", textAlign:"left", fontSize:9, color:T.red, fontWeight:700, letterSpacing:0.5 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {failingRows.map((row, ri) => (
                            <tr key={ri} style={{ borderBottom:ri<failingRows.length-1?`1px solid ${T.slate}33`:"none" }}>
                              {testDef.failColumns.map(col => (
                                <td key={col} style={{ padding:"5px 10px", fontSize:10, color:T.red, fontWeight:700, fontStyle:row[col]===null?"italic":"normal" }}>
                                  {row[col] === null ? "NULL" : String(row[col])}
                                </td>
                              ))}
                              <td style={{ padding:"5px 10px", fontSize:10, color:T.greyLight }}>{testDef.failReason(row)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* store_failures explanation */}
                    <div style={{ background:`${testDef.color}08`, border:`1px solid ${testDef.color}25`, borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:testDef.color, fontFamily:"monospace", letterSpacing:0.5, marginBottom:6 }}>
                        💾 WANT dbt TO SAVE THESE ROWS FOR YOU? USE store_failures
                      </div>
                      <CodeBlock code={`- name: ${testDef.failColumns[0]}
  tests:
    - ${activeTest === "assert_positive" ? "assert_positive" : activeTest}:
        store_failures: true      # ← add this
        schema: test_failures     # saves to test_failures.${activeTest}_${testDef.failColumns[0]}
# After dbt test runs, query the failures table:
SELECT * FROM test_failures.${activeTest}_${testDef.failColumns[0]};`} small />
                    </div>

                    {/* Severity configuration */}
                    <div style={{ background:"rgba(250,204,21,0.07)", border:"1px solid rgba(250,204,21,0.2)", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:T.yellow, fontFamily:"monospace", letterSpacing:0.5, marginBottom:6 }}>
                        ⚠️ SHOULD THIS FAILURE STOP THE ENTIRE RUN? CONFIGURE SEVERITY
                      </div>
                      <CodeBlock code={`- name: ${testDef.failColumns[0]}
  tests:
    - ${activeTest === "assert_positive" ? "assert_positive" : activeTest}:
        severity: error    # ← FAIL the run (default)
        # severity: warn   # ← just log a warning, run continues
        # warn_if:  ">5"   # warn only if more than 5 failures
        # error_if: ">50"  # error only if more than 50 failures`} small />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!activeTest && (
        <div style={{ textAlign:"center", padding:"16px 0", fontSize:11, color:T.greyDark, fontFamily:"monospace" }}>
          ↑ select a test type above to inspect the data and see which rows fail
        </div>
      )}
    </div>
  );
}

function TestRunner() {
  // Keep this as a quick "run all" view that uses the TestLab's test definitions
  const tests = [
    { id:"unique_loan_id",   model:"fct_disbursements", column:"loan_id",             type:"unique",          severity:"error", failingRows: TEST_DEFINITIONS.unique.failingRows(TEST_TABLE_ROWS)          },
    { id:"not_null_custid",  model:"fct_disbursements", column:"customer_id",         type:"not_null",        severity:"error", failingRows: TEST_DEFINITIONS.not_null.failingRows(TEST_TABLE_ROWS)        },
    { id:"accepted_status",  model:"fct_disbursements", column:"status",              type:"accepted_values", severity:"error", failingRows: TEST_DEFINITIONS.accepted_values.failingRows(TEST_TABLE_ROWS) },
    { id:"fk_customer",      model:"fct_disbursements", column:"customer_id",         type:"relationships",   severity:"error", failingRows: TEST_DEFINITIONS.relationships.failingRows(TEST_TABLE_ROWS)   },
    { id:"positive_amount",  model:"fct_disbursements", column:"disbursement_amount", type:"assert_positive", severity:"error", failingRows: TEST_DEFINITIONS.assert_positive.failingRows(TEST_TABLE_ROWS) },
    { id:"not_null_email",   model:"dim_customers",     column:"email",               type:"not_null",        severity:"warn",  failingRows: [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12}] },
  ];

  const [visible, setVisible]   = useState([]);
  const [running, setRunning]   = useState(false);
  const [ran, setRan]           = useState(false);
  const timers = useRef([]);

  const runAll = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setVisible([]); setRunning(true); setRan(false);
    tests.forEach((t, i) => {
      const timer = setTimeout(() => {
        setVisible(prev => [...prev, t.id]);
        if (i === tests.length - 1) {
          setTimeout(() => { setRunning(false); setRan(true); }, 300);
        }
      }, i * 320);
      timers.current.push(timer);
    });
  };

  const errors  = tests.filter(t => visible.includes(t.id) && t.failingRows.length > 0 && t.severity==="error");
  const warns   = tests.filter(t => visible.includes(t.id) && t.failingRows.length > 0 && t.severity==="warn");
  const passing = tests.filter(t => visible.includes(t.id) && t.failingRows.length === 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <BeginnerNote>
        Run all tests at once and watch them execute. A test <strong style={{ color:T.green }}>passes</strong> if its SQL returns 0 rows. It <strong style={{ color:T.red }}>fails</strong> if any rows are returned. Notice how some failures stop the run and some are just warnings.
      </BeginnerNote>

      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button onClick={runAll} disabled={running} style={{
          padding:"8px 22px", borderRadius:8, fontSize:11, cursor:running?"not-allowed":"pointer",
          fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
          border:`1px solid ${T.teal}55`, background:running?`${T.teal}06`:`${T.teal}18`,
          color:running?T.grey:T.teal,
        }}>
          {running ? "⚙️  Running tests..." : ran ? "↩ Run again" : "▶  dbt test --select fct_disbursements"}
        </button>
        {ran && !running && (
          <div style={{ fontSize:10, color:errors.length>0?T.red:T.green, fontFamily:"monospace" }}>
            {errors.length > 0 ? `❌ Run FAILED — ${errors.length} test error${errors.length>1?"s":""}` : "✅ Run passed"}
          </div>
        )}
      </div>

      {/* Test results */}
      {visible.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          {tests.filter(t => visible.includes(t.id)).map(t => {
            const failing = t.failingRows.length > 0;
            const isErr   = failing && t.severity === "error";
            const isWarn  = failing && t.severity === "warn";
            const color   = isErr ? T.red : isWarn ? T.yellow : T.green;
            const testColor = TEST_DEFINITIONS[t.type]?.color || T.teal;
            return (
              <div key={t.id} style={{
                background:`${color}08`, border:`1px solid ${color}22`, borderRadius:8,
                padding:"8px 12px", animation:"slideIn 0.25s ease",
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ fontSize:13 }}>{isErr?"❌":isWarn?"⚠️":"✅"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <code style={{ fontSize:10, color:testColor, fontFamily:"monospace", fontWeight:700 }}>{t.type}</code>
                    <span style={{ fontSize:9, color:T.greyDark, fontFamily:"monospace" }}>on {t.model}.{t.column}</span>
                  </div>
                </div>
                {failing && (
                  <span style={{ fontSize:9, background:`${color}18`, color, border:`1px solid ${color}33`, padding:"2px 7px", borderRadius:8, fontFamily:"monospace", whiteSpace:"nowrap" }}>
                    {t.failingRows.length} {t.severity==="warn"?"warnings":"failures"}
                  </span>
                )}
                {t.severity === "warn" && failing && (
                  <span style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace" }}>severity: warn — run continues</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {ran && !running && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, animation:"fadeUp 0.3s ease" }}>
          {[
            [passing.length, T.green,  "PASSED",                    "Query returned 0 rows"],
            [errors.length,  T.red,    "ERRORS — run STOPS",        "Job blocks, PR blocked"],
            [warns.length,   T.yellow, "WARNINGS — run continues",  "Logged but not blocking"],
          ].map(([count, color, label, sublabel]) => (
            <div key={label} style={{ background:`${color}09`, border:`1px solid ${color}25`, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:800, color, fontFamily:"'Bricolage Grotesque',sans-serif" }}>{count}</div>
              <div style={{ fontSize:9, color, fontFamily:"monospace", fontWeight:700, marginTop:2 }}>{label}</div>
              <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace", marginTop:2 }}>{sublabel}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestingSlides() {
  const steps = [
    {
      title: "How dbt Tests Work",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Every dbt test is secretly a SQL query. <strong style={{ color:T.teal }}>If the query returns 0 rows → test passes. If it returns any rows → those rows ARE the bad data.</strong> This one rule applies to every test — built-in or custom.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle color={T.teal}>THE 4 BUILT-IN TESTS</SectionTitle>
              <CodeBlock code={`# models/schema.yml
- name: fct_disbursements
  columns:
    - name: loan_id
      tests:
        - unique          # no duplicates
        - not_null        # must have a value

    - name: status
      tests:
        - accepted_values:
            values: ['active','repaid','defaulted']

    - name: customer_id
      tests:
        - relationships:  # must exist in dim_customers
            to: ref('dim_customers')
            field: customer_id`} small />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <SectionTitle color={T.teal}>WHAT THEY COMPILE TO</SectionTitle>
              <CodeBlock code={`-- "unique" test:
SELECT loan_id, COUNT(*) AS n
FROM analytics.fct_disbursements
GROUP BY loan_id HAVING COUNT(*) > 1
-- 0 rows = ✅ pass

-- "not_null" test:
SELECT loan_id
FROM analytics.fct_disbursements
WHERE loan_id IS NULL
-- 0 rows = ✅ pass`} small />
              <InfoCard icon="🧠" title="The key insight" body="dbt tests are just SQL. Any rows returned by the test query = those rows have a data quality problem. This is why you can write your own tests so easily." color={T.teal} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🔬 Test Lab — Inspect Each Test",
      content: () => <TestLab />,
    },
    {
      title: "▶ Run All Tests",
      content: () => <TestRunner />,
    },
    {
      title: "Custom Generic Tests",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            When the 4 built-in tests aren't enough for your business rules, write a custom generic test. It's a Jinja macro that returns failing rows — the same contract as every built-in test.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle color={T.teal}>1. DEFINE ONCE IN macros/</SectionTitle>
              <CodeBlock code={`-- macros/test_assert_positive.sql
{% test assert_positive(model, column_name) %}

  -- Returns the rows that fail.
  -- 0 rows = test passes.
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} <= 0

{% endtest %}

-- Another example:
{% test between(model, column_name, min, max) %}
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} < {{ min }}
     OR {{ column_name }} > {{ max }}
{% endtest %}`} small />
            </div>
            <div>
              <SectionTitle>2. APPLY TO ANY MODEL, ANY COLUMN</SectionTitle>
              <CodeBlock code={`# Works exactly like built-in tests:
- name: disbursement_amount
  tests:
    - assert_positive        # custom ✓
    - not_null               # built-in ✓
    - between:               # custom ✓
        min: 100
        max: 10000000

- name: fee_amount
  tests:
    - assert_positive        # reuse it!

- name: interest_rate
  tests:
    - between:               # reuse again!
        min: 0
        max: 100`} small />
              <Callout icon="💡" title="PACKAGES ADD MORE TESTS" color={T.purple}>
                Install <code style={{ color:T.purple }}>calogica/dbt_expectations</code> to get 50+ extra tests like <code style={{ color:T.purple }}>expect_column_values_to_be_of_type</code>, <code style={{ color:T.purple }}>expect_row_count_to_be_between</code>, and more.
              </Callout>
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.teal} />;
}


function EnvironmentSim() {
  const [env, setEnv] = useState("dev");

  const envConfig = {
    dev:  { color:T.grey,   label:"dev",  icon:"🛠️", schema:"dbt_damilare", materialize:"view",  limit:"LIMIT 500", freshness:"last 30 days only", buildTime:"~5s" },
    ci:   { color:T.yellow, label:"ci",   icon:"🧪", schema:"ci_pr_42",     materialize:"view",  limit:"LIMIT 500", freshness:"last 30 days only", buildTime:"~30s" },
    prod: { color:T.green,  label:"prod", icon:"🚀", schema:"analytics",    materialize:"table", limit:"",          freshness:"full history",       buildTime:"~8min" },
  };

  const ec = envConfig[env];

  const compiledSQL = `{{ config(
    materialized = '${ec.materialize}'
) }}

SELECT
  l.loan_id,
  l.amount,
  c.country_name,
  p.total_paid
FROM {{ ref('stg_loans') }} l
JOIN {{ ref('dim_customers') }} c
  ON l.customer_id = c.customer_id
JOIN {{ ref('int_payments') }} p
  ON l.loan_id = p.loan_id
${env !== "prod" ? `WHERE l.created_date >= DATEADD('day',-30,CURRENT_DATE())
${ec.limit}  -- dev/ci: small dataset` : "-- prod: full history, no limit"}`;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        The same model behaves differently in each environment. <strong style={{ color:T.teal }}>Switch between dev, ci, and prod</strong> to see how the compiled SQL and materialization change — and why that matters.
      </BeginnerNote>

      {/* Environment tabs */}
      <div style={{ display:"flex", gap:6 }}>
        {Object.entries(envConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setEnv(key)} style={{
            padding:"8px 18px", borderRadius:8, fontSize:11, cursor:"pointer", flex:1,
            fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
            border:`1px solid ${env===key ? cfg.color : "rgba(255,255,255,0.08)"}`,
            background:env===key ? `${cfg.color}18` : "rgba(255,255,255,0.03)",
            color:env===key ? cfg.color : T.grey,
          }}>{cfg.icon} {cfg.label}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {/* Compiled model */}
        <div>
          <SectionTitle color={ec.color}>COMPILED SQL in {env}</SectionTitle>
          <CodeBlock code={compiledSQL} small />
        </div>

        {/* Config */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <SectionTitle color={ec.color}>ENVIRONMENT PROPERTIES</SectionTitle>
          {[
            ["Schema",            ec.schema,       "Where tables/views are created"],
            ["Materialisation",   ec.materialize,  env==="prod"?"Table = fast queries":"View = fast build times"],
            ["Data range",        ec.freshness,    env==="prod"?"Full history for accuracy":"Limited for speed"],
            ["Approx build time", ec.buildTime,    ""],
          ].map(([label, value, note]) => (
            <div key={label} style={{ background:`${ec.color}09`, border:`1px solid ${ec.color}22`, borderRadius:8, padding:"8px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:note?3:0 }}>
                <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace" }}>{label}</span>
                <code style={{ fontSize:11, color:ec.color, fontFamily:"monospace" }}>{value}</code>
              </div>
              {note && <div style={{ fontSize:10, color:T.greyDark, fontFamily:"monospace" }}>{note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* dbt_project.yml config */}
      <SectionTitle>HOW TO SET THIS IN dbt_project.yml</SectionTitle>
      <CodeBlock code={`models:
  lending_analytics:
    +materialized: >-
      {{ 'table' if target.name == 'prod' else 'view' }}

    marts:
      +meta:
        owner: "data-team@company.com"

# In profiles.yml — each env has its own target:
# dev  → schema: dbt_damilare
# ci   → schema: ci_pr_{{ env_var('PR_NUMBER') }}
# prod → schema: analytics`} small />
    </div>
  );
}

function DeploymentSlides() {
  const steps = [
    {
      title: "The 3 Environments",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Every dbt project needs at least three environments: <strong style={{ color:T.grey }}>dev</strong> where you build, <strong style={{ color:T.yellow }}>CI</strong> where automated tests run on each PR, and <strong style={{ color:T.green }}>prod</strong> where analysts actually query your data.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[
              ["🛠️","dev",T.grey,"Your personal sandbox. Fast iteration — use views and row limits. No one else reads from here."],
              ["🧪","ci",T.yellow,"Temporary schema created per Pull Request. Runs dbt build automatically. Destroyed after PR merges."],
              ["🚀","prod",T.green,"The real tables. Full data. Analysts, dashboards, and APIs read from here. Runs on a schedule."],
            ].map(([icon,name,c,desc]) => (
              <div key={name} style={{ background:`${c}09`, border:`1px solid ${c}25`, borderRadius:10, padding:"14px" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                <code style={{ fontSize:13, color:c, fontFamily:"monospace", display:"block", marginBottom:6, fontWeight:700 }}>{name}</code>
                <div style={{ fontSize:11, color:T.greyLight, lineHeight:1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    { title: "Interactive: Environment Switcher", content: () => <EnvironmentSim /> },
    {
      title: "CI & Deployment",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            <strong style={{ color:T.red }}>CI (Continuous Integration)</strong> means every PR automatically runs your dbt models and tests before code merges. It's your safety net.
          </BeginnerNote>
          <SectionTitle>CI JOB PATTERN</SectionTitle>
          <CodeBlock code={`# On every PR → CI job runs:

# 1. Use state management (Slim CI) — only rebuild changed models:
dbt build \
  --select state:modified+ \
  --defer \
  --state ./prod-manifest/ \
  --target ci

# 2. Tests run automatically as part of dbt build
# 3. If any test fails → PR is blocked
# 4. If all pass → PR can be reviewed and merged`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <InfoCard icon="⚡" title="Slim CI" body="Combine --select state:modified+ with --defer to only build changed models. Cuts CI from hours to minutes on large projects." color={T.red} />
            <InfoCard icon="🔀" title="PR environments" body="Each PR builds into its own schema (ci_pr_123). Tests run against isolated data — no risk of polluting production." color={T.red} />
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.red} />;
}


function CloneComparison() {
  const [mode, setMode] = useState(null); // null | "rebuild" | "clone"
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  const REBUILD_MODELS = [
    "stg_loans","stg_customers","stg_payments","stg_accounts",
    "int_payments","int_loan_metrics",
    "fct_disbursements","fct_repayments","dim_customers","rpt_portfolio",
  ];

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const simulate = (m) => {
    clearAll(); setMode(m); setProgress(0); setDone(false);
    if (m === "rebuild") {
      // Slow — one model at a time, 600ms each
      REBUILD_MODELS.forEach((_, i) => {
        const t = setTimeout(() => {
          setProgress(i + 1);
          if (i === REBUILD_MODELS.length - 1) setDone(true);
        }, (i + 1) * 600);
        timers.current.push(t);
      });
    } else {
      // Clone — nearly instant, all at once
      const t1 = setTimeout(() => setProgress(3),  200);
      const t2 = setTimeout(() => setProgress(7),  400);
      const t3 = setTimeout(() => setProgress(10), 600);
      const t4 = setTimeout(() => setDone(true),   700);
      timers.current.push(t1, t2, t3, t4);
    }
  };

  const reset = () => { clearAll(); setMode(null); setProgress(0); setDone(false); };

  const totalModels = REBUILD_MODELS.length;
  const isRebuild = mode === "rebuild";
  const isClone   = mode === "clone";
  const color = isRebuild ? T.red : "#67e8f9";
  const pct = Math.round((progress / totalModels) * 100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        A new analyst joins your team. They need a dev environment with data to work against. Compare two approaches: <strong style={{ color:T.red }}>rebuild from scratch</strong> vs <strong style={{ color:"#67e8f9" }}>dbt clone</strong>.
      </BeginnerNote>

      {/* Buttons */}
      {!mode && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, padding:"14px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.red, fontFamily:"'Bricolage Grotesque',sans-serif" }}>🐢 Rebuild from scratch</div>
            <div style={{ fontSize:11, color:T.greyLight, lineHeight:1.5 }}>Run dbt run --target dev. Rebuilds ALL {totalModels} production models by processing every row from source.</div>
            <button onClick={() => simulate("rebuild")} style={{ padding:"7px", borderRadius:7, border:`1px solid ${T.red}44`, background:`${T.red}12`, color:T.red, fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>▶ Simulate rebuild</button>
          </div>
          <div style={{ background:"rgba(103,232,249,0.07)", border:"1px solid rgba(103,232,249,0.2)", borderRadius:10, padding:"14px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#67e8f9", fontFamily:"'Bricolage Grotesque',sans-serif" }}>⚡ dbt clone</div>
            <div style={{ fontSize:11, color:T.greyLight, lineHeight:1.5 }}>Run dbt clone --state ./prod-manifest. Creates zero-copy table objects pointing to prod storage — no data moved.</div>
            <button onClick={() => simulate("clone")} style={{ padding:"7px", borderRadius:7, border:"1px solid rgba(103,232,249,0.44)", background:"rgba(103,232,249,0.12)", color:"#67e8f9", fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>▶ Simulate clone</button>
          </div>
        </div>
      )}

      {/* Progress */}
      {mode && (
        <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${color}33`, borderRadius:12, padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:11, color, fontFamily:"monospace", fontWeight:700 }}>
              {isRebuild ? "dbt run --target dev" : "dbt clone --state ./prod-manifest"}
            </span>
            <span style={{ fontSize:10, color:T.grey, fontFamily:"monospace" }}>{progress}/{totalModels} models</span>
          </div>

          {/* Progress bar */}
          <div style={{ height:8, background:T.slate, borderRadius:4, overflow:"hidden", marginBottom:12 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:4, transition:"width 0.4s ease", boxShadow:`0 0 8px ${color}66` }} />
          </div>

          {/* Model list */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {REBUILD_MODELS.map((m, i) => {
              const complete = progress > i;
              return (
                <div key={m} style={{
                  fontSize:9, fontFamily:"monospace", padding:"3px 8px", borderRadius:5,
                  border:`1px solid ${complete ? color+"55" : "rgba(255,255,255,0.06)"}`,
                  background:complete ? `${color}12` : "rgba(255,255,255,0.02)",
                  color:complete ? color : T.greyDark,
                  transition:"all 0.3s", transitionDelay:isRebuild?`${i*50}ms`:"0ms",
                }}>{complete && (isClone?"🪞":"✓")} {m}</div>
              );
            })}
          </div>

          {/* Done message */}
          {done && (
            <div style={{ marginTop:12, padding:"10px 12px", borderRadius:8, background:`${color}09`, border:`1px solid ${color}33`, animation:"popIn 0.2s ease" }}>
              {isRebuild ? (
                <div style={{ fontSize:11, color:T.greyLight }}>
                  ⏱️ <strong style={{ color:T.red }}>Rebuild complete</strong> — Took ~{totalModels * 0.6}s in this simulation. In reality: <strong style={{ color:T.red }}>1-4 hours</strong> for a full warehouse with large models.
                </div>
              ) : (
                <div style={{ fontSize:11, color:T.greyLight }}>
                  ⚡ <strong style={{ color:"#67e8f9" }}>Clone complete</strong> — Took ~0.7s in this simulation. In reality: <strong style={{ color:"#67e8f9" }}>2-10 seconds</strong> regardless of table size. Zero data moved.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode && (
        <button onClick={reset} style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${T.slate}`, background:"transparent", color:T.grey, fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", alignSelf:"flex-start" }}>↩ Compare again</button>
      )}
    </div>
  );
}

function CloneSlides() {
  const steps = [
    {
      title: "dbt clone",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            Every developer on your team needs a dev environment with data to work against. Traditionally this meant rebuilding production tables from scratch — a multi-hour process. <strong style={{ color:"#67e8f9" }}>dbt clone</strong> does it in seconds by creating lightweight table objects that point to production data without copying it.
          </BeginnerNote>
          <SectionTitle>COMMANDS</SectionTitle>
          <CodeBlock code={`# Clone ALL prod models into your dev schema:
dbt clone --state ./prod-manifest

# Clone specific models only:
dbt clone --select fct_disbursements fct_repayments

# Clone a model + all its upstream deps (+):
dbt clone --select +fct_disbursements

# On supported warehouses (e.g. Snowflake):
# CREATE OR REPLACE TABLE dbt_damilare.fct_disbursements
#   CLONE analytics.fct_disbursements;
# ← zero data moved, instant`} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <InfoCard icon="🪞" title="Zero-copy on supported warehouses" body="On Snowflake, BigQuery, and Databricks, dbt creates table objects that share underlying storage with production. No data is copied until you write to the clone." color="#67e8f9" />
            <InfoCard icon="🔄" title="Fallback on other warehouses" body="On warehouses without native cloning, dbt falls back to CREATE TABLE AS SELECT — a full copy. Still useful for workflows, just slower." color="#67e8f9" />
          </div>
        </div>
      ),
    },
    { title: "Interactive: Rebuild vs Clone", content: () => <CloneComparison /> },
  ];
  return <GenericCourse steps={steps} color="#67e8f9" />;
}


function GrantsMatrix() {
  const roles = ["ROLE_ANALYST","ROLE_FINANCE","ROLE_CREDIT_RISK","ROLE_EXEC","ROLE_AUDIT"];
  const models = [
    { id:"stg_loans",      label:"stg_loans",         layer:"staging",  defaultGrants:[] },
    { id:"dim_customers",  label:"dim_customers",      layer:"mart",     defaultGrants:["ROLE_ANALYST","ROLE_FINANCE","ROLE_CREDIT_RISK","ROLE_EXEC"] },
    { id:"fct_loans",      label:"fct_disbursements",  layer:"mart",     defaultGrants:["ROLE_ANALYST","ROLE_FINANCE","ROLE_EXEC"] },
    { id:"fct_credit",     label:"fct_defaults",       layer:"mart",     defaultGrants:["ROLE_CREDIT_RISK","ROLE_EXEC"] },
    { id:"rpt_audit",      label:"rpt_audit_trail",    layer:"mart",     defaultGrants:["ROLE_AUDIT","ROLE_EXEC"] },
  ];

  const [grants, setGrants] = useState(() => {
    const g = {};
    models.forEach(m => { g[m.id] = new Set(m.defaultGrants); });
    return g;
  });
  const [rebuilt, setRebuilt] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [showGrantSql, setShowGrantSql] = useState(false);

  const toggle = (modelId, role) => {
    setGrants(prev => {
      const next = { ...prev, [modelId]: new Set(prev[modelId]) };
      next[modelId].has(role) ? next[modelId].delete(role) : next[modelId].add(role);
      return next;
    });
    setRebuilt(false);
  };

  const rebuild = () => {
    setRebuilding(true);
    setTimeout(() => { setRebuilding(false); setRebuilt(true); setShowGrantSql(true); }, 1200);
  };

  const grantStatements = models
    .filter(m => grants[m.id].size > 0)
    .map(m => `GRANT SELECT ON TABLE analytics.${m.label}
  TO ROLE ${[...grants[m.id]].join(', ')};`);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        <strong style={{ color:"#86efac" }}>Click the checkboxes</strong> to grant or revoke access for each role on each model. Then click <strong style={{ color:"#86efac" }}>Run dbt build</strong> to see the GRANT statements dbt automatically executes after building each table.
      </BeginnerNote>

      {/* Matrix */}
      <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${T.slate}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.slate}` }}>
                <th style={{ padding:"8px 12px", textAlign:"left", fontSize:9, color:T.greyDark, fontFamily:"monospace", letterSpacing:0.5, fontWeight:600 }}>MODEL</th>
                {roles.map(r => (
                  <th key={r} style={{ padding:"8px 10px", fontSize:8, color:"#86efac", fontFamily:"monospace", whiteSpace:"nowrap", fontWeight:600 }}>{r.replace("ROLE_","")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, mi) => (
                <tr key={m.id} style={{ borderBottom:mi<models.length-1?`1px solid ${T.slate}44`:"none" }}>
                  <td style={{ padding:"8px 12px" }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono',monospace", color:T.greyLight }}>{m.label}</div>
                    <div style={{ fontSize:8, color:T.greyDark, fontFamily:"monospace" }}>{m.layer}</div>
                  </td>
                  {roles.map(r => {
                    const granted = grants[m.id]?.has(r);
                    return (
                      <td key={r} style={{ padding:"8px 10px", textAlign:"center" }}>
                        <div onClick={() => toggle(m.id, r)} style={{
                          width:20, height:20, borderRadius:5, cursor:"pointer", margin:"0 auto",
                          border:`1px solid ${granted?"#86efac55":"rgba(255,255,255,0.1)"}`,
                          background:granted?"rgba(134,239,172,0.15)":"rgba(255,255,255,0.03)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all 0.18s", fontSize:11,
                        }}>
                          {granted && <span style={{ color:"#86efac" }}>✓</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={rebuild} disabled={rebuilding} style={{
        padding:"8px 20px", borderRadius:8, fontSize:11, cursor:rebuilding?"not-allowed":"pointer", alignSelf:"flex-start",
        fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
        border:`1px solid ${"#86efac"}55`, background:rebuilding?`${"#86efac"}08`:`${"#86efac"}18`,
        color:rebuilding?T.grey:"#86efac",
      }}>
        {rebuilding ? "⚙️  Building and granting..." : "▶  Run dbt build"}
      </button>

      {/* Generated GRANT SQL */}
      {showGrantSql && !rebuilding && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle color="#86efac">GRANT STATEMENTS dbt EXECUTES AUTOMATICALLY</SectionTitle>
          <CodeBlock code={grantStatements.join("\n\n") || "-- No grants configured"} small />
          <div style={{ marginTop:8, fontSize:11, color:T.greyLight, lineHeight:1.6 }}>
            ✅ <strong style={{ color:"#86efac" }}>These run after every dbt build</strong> — even if the table is rebuilt from scratch. No manual SQL required. Revoked roles are automatically removed.
          </div>
        </div>
      )}
    </div>
  );
}

function GrantsSlides() {
  const steps = [
    {
      title: "dbt Grants",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            When dbt builds a table, it's private by default — only the service account that ran dbt can read it. <strong style={{ color:"#86efac" }}>dbt grants</strong> automatically run <code style={{ color:"#86efac" }}>GRANT SELECT</code> on your behalf after every build, so the right roles always have access.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <SectionTitle color={T.red}>WITHOUT GRANTS — brittle</SectionTitle>
              <CodeBlock code={`-- After EVERY dbt build, manually run:
GRANT SELECT ON TABLE analytics.fct_disbursements
  TO ROLE ROLE_ANALYST;

-- When dbt rebuilds the table:
-- Grant is WIPED. Access breaks.
-- Analyst gets "Permission denied" ❌
-- You scramble to fix it at 9pm 😰`} small />
            </div>
            <div>
              <SectionTitle color="#86efac">WITH GRANTS — automatic</SectionTitle>
              <CodeBlock code={`-- models/marts/fct_disbursements.sql
{{ config(
  materialized='table',
  grants={
    'select': [
      'ROLE_ANALYST',
      'ROLE_FINANCE',
      'ROLE_EXEC'
    ]
  }
) }}
-- dbt grants access after every build ✓`} small />
            </div>
          </div>
          <SectionTitle>PROJECT-WIDE GRANTS IN dbt_project.yml</SectionTitle>
          <CodeBlock code={`models:
  lending_analytics:
    +grants:
      select: ['ROLE_ANALYST']    # every model
    marts:
      +grants:
        select: ['ROLE_ANALYST','ROLE_FINANCE']
    marts/credit:
      +grants:
        select: ['ROLE_CREDIT_RISK']  # restricted`} small />
        </div>
      ),
    },
    { title: "Interactive: Permission Matrix", content: () => <GrantsMatrix /> },
  ];
  return <GenericCourse steps={steps} color="#86efac" />;
}


function SQLvsPythonToggle() {
  const [view, setView] = useState("sql");
  const [usecase, setUsecase] = useState("risk");

  const usecases = {
    risk: {
      label: "Risk Scoring",
      why: "You need to score loans using a trained ML model. SQL has no ML inference capability — Python is the only option.",
      sql: `-- ❌ SQL cannot do this:
-- There is no native ML inference in SQL.
-- You'd have to export data, score externally,
-- then re-import. Fragile, slow, not reproducible.

-- The best SQL can do is a simple rule:
SELECT
  loan_id,
  CASE
    WHEN missed_payments > 2 THEN 'high'
    WHEN missed_payments = 1 THEN 'medium'
    ELSE 'low'
  END AS risk_tier   -- crude, not an ML model
FROM {{ ref('fct_disbursements') }}`,
      python: `# ✅ Python model: models/ml/loan_risk_score.py
def model(dbt, session):
    dbt.config(
        materialized="table",
        packages=["scikit-learn","pandas"]
    )

    # ref() works just like SQL models
    loans = dbt.ref("fct_disbursements").to_pandas()
    features = dbt.ref("feat_loan_features").to_pandas()

    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(features[FEATURE_COLS], features["label"])

    loans["risk_score"]  = clf.predict_proba(
        loans[FEATURE_COLS])[:, 1]
    loans["risk_tier"] = loans["risk_score"].apply(
        lambda x: "high" if x>0.7 else "medium" if x>0.4 else "low"
    )
    # Return a DataFrame → dbt writes it as a table
    return loans[["loan_id","risk_score","risk_tier"]]`,
    },
    text: {
      label: "Text Processing",
      why: "Extracting intent from free-text loan application notes requires NLP libraries. SQL cannot do this natively.",
      sql: `-- ❌ SQL can do basic text ops:
SELECT
  application_id,
  LOWER(notes) AS notes_lower,
  -- Can find keywords, but no NLP:
  CASE WHEN notes ILIKE '%urgent%' THEN 'urgent'
       WHEN notes ILIKE '%student%' THEN 'education'
       ELSE 'other'
  END AS loan_purpose
-- No sentiment, no entity extraction,
-- no embeddings — all require Python`,
      python: `# ✅ Python model: models/ml/loan_purpose_classifier.py
def model(dbt, session):
    dbt.config(
        materialized="table",
        packages=["transformers","torch"]
    )
    apps = dbt.ref("stg_applications").to_pandas()

    from transformers import pipeline
    classifier = pipeline("zero-shot-classification")

    LABELS = ["business","education","medical","personal"]
    apps["loan_purpose"] = apps["notes"].apply(
        lambda text: classifier(text, LABELS)["labels"][0]
    )
    apps["confidence"] = apps["notes"].apply(
        lambda text: classifier(text, LABELS)["scores"][0]
    )
    return apps[["application_id","loan_purpose","confidence"]]`,
    },
    stats: {
      label: "Statistical Analysis",
      why: "Business wants percentile analysis and outlier detection on loan amounts. SQL percentiles are limited; Python statsmodels gives full control.",
      sql: `-- SQL can do basic percentiles:
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP
    (ORDER BY disbursement_amount) AS median,
  PERCENTILE_CONT(0.95) WITHIN GROUP
    (ORDER BY disbursement_amount) AS p95
FROM {{ ref('fct_disbursements') }}

-- But cannot do:
-- IQR-based outlier detection
-- Bootstrap confidence intervals
-- Distribution fitting (is it log-normal?)`,
      python: `# ✅ Python: full stats power
def model(dbt, session):
    dbt.config(materialized="table")
    df = dbt.ref("fct_disbursements").to_pandas()

    import numpy as np
    from scipy import stats

    # IQR outlier detection
    Q1, Q3 = df["amount"].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    df["is_outlier"] = (
        (df["amount"] < Q1 - 1.5 * IQR) |
        (df["amount"] > Q3 + 1.5 * IQR)
    )

    # Fit a distribution
    shape, loc, scale = stats.lognorm.fit(df["amount"])
    df["log_normal_p"] = stats.lognorm.pdf(
        df["amount"], shape, loc, scale)

    return df[["loan_id","amount","is_outlier","log_normal_p"]]`,
    },
  };

  const uc = usecases[usecase];
  const color = T.yellow;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <BeginnerNote>
        Python models solve things SQL simply cannot. Choose a use case below, then toggle between the SQL attempt and the Python solution to see the difference.
      </BeginnerNote>

      {/* Use case selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {Object.entries(usecases).map(([key, uc]) => (
          <button key={key} onClick={() => { setUsecase(key); setView("sql"); }} style={{
            padding:"5px 13px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${usecase===key ? color : "rgba(255,255,255,0.08)"}`,
            background:usecase===key ? `${color}18` : "transparent",
            color:usecase===key ? color : T.grey,
          }}>{uc.label}</button>
        ))}
      </div>

      {/* Why Python */}
      <Callout icon="🤔" title="WHY YOU NEED PYTHON HERE" color={color}>
        {uc.why}
      </Callout>

      {/* SQL vs Python toggle */}
      <div style={{ display:"flex", gap:6 }}>
        <button onClick={() => setView("sql")} style={{
          flex:1, padding:"8px", borderRadius:8, fontSize:11, cursor:"pointer",
          fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
          border:`1px solid ${view==="sql" ? T.red : "rgba(255,255,255,0.08)"}`,
          background:view==="sql" ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.03)",
          color:view==="sql" ? T.red : T.grey,
        }}>❌ SQL attempt</button>
        <button onClick={() => setView("python")} style={{
          flex:1, padding:"8px", borderRadius:8, fontSize:11, cursor:"pointer",
          fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
          border:`1px solid ${view==="python" ? color : "rgba(255,255,255,0.08)"}`,
          background:view==="python" ? `${color}12` : "rgba(255,255,255,0.03)",
          color:view==="python" ? color : T.grey,
        }}>✅ Python model</button>
      </div>
      <CodeBlock code={view === "sql" ? uc.sql : uc.python} />
    </div>
  );
}

function PythonSlides() {
  const steps = [
    {
      title: "Python dbt Models",
      content: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <BeginnerNote>
            dbt Python models let you run Python <strong style={{ color:T.yellow }}>inside your warehouse</strong> — no data moves to your laptop. They use <code style={{ color:T.yellow }}>ref()</code> just like SQL models, so lineage is tracked and they fit naturally into your DAG.
          </BeginnerNote>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <InfoCard icon="📊" title="Use SQL for" body="Joins, aggregations, filters, window functions, GROUP BY — the vast majority of transformations." color={T.blue} />
            <InfoCard icon="🐍" title="Use Python for" body="ML model scoring, NLP/text processing, statistical analysis, calling external APIs, complex array operations that SQL can't do." color={T.yellow} />
          </div>
          <Callout icon="⚠️" title="Python model restrictions (per dbt docs)" color={T.orange}>
            Python models <strong style={{ color:"#f1f5f9" }}>cannot</strong> be materialised as <code style={{ color:T.orange }}>view</code> or <code style={{ color:T.orange }}>ephemeral</code> — only <code style={{ color:T.green }}>table</code> or <code style={{ color:T.green }}>incremental</code>. Python is also not supported for dbt tests or snapshots — those must be SQL.
          </Callout>
          <SectionTitle>PYTHON MODEL ANATOMY</SectionTitle>
          <CodeBlock code={`# models/ml/loan_risk_score.py  ← .py not .sql!

def model(dbt, session):
    # ① Configure: same as {{ config() }} in SQL
    dbt.config(
        materialized = "table",
        packages     = ["scikit-learn", "pandas"]
    )

    # ② Reference dbt models — works across SQL and Python!
    loans    = dbt.ref("fct_disbursements").to_pandas()
    features = dbt.ref("feat_loan_features").to_pandas()

    # ③ Use any Python library
    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier()
    clf.fit(features[COLS], features["label"])

    # ④ Return a DataFrame — dbt writes it to the warehouse
    loans["risk_score"] = clf.predict_proba(loans[COLS])[:, 1]
    return loans[["loan_id", "risk_score"]]`} />
        </div>
      ),
    },
    { title: "Interactive: SQL vs Python", content: () => <SQLvsPythonToggle /> },
  ];
  return <GenericCourse steps={steps} color={T.yellow} />;
}



const allRows = [
  { id: 1, event: "page_view", user: "alice", ts: "Jan 1", color: "#4ade80" },
  { id: 2, event: "click", user: "bob", ts: "Jan 2", color: "#4ade80" },
  { id: 3, event: "signup", user: "carol", ts: "Jan 3", color: "#4ade80" },
  { id: 4, event: "purchase", user: "alice", ts: "Jan 4", color: "#4ade80" },
  { id: 5, event: "logout", user: "dave", ts: "Jan 5", color: "#4ade80" },
  { id: 6, event: "page_view", user: "eve", ts: "Jan 6", color: "#4ade80" },
  { id: 7, event: "click", user: "frank", ts: "Jan 7", color: "#4ade80" },
  { id: 8, event: "signup", user: "grace", ts: "Jan 8", color: "#4ade80" },
];

// New rows that arrive on Day 2 — only visible in the incremental run source
const newBatchRows = [
  { id: 9,  event: "purchase",  user: "henry", ts: "Jan 9",  color: "#fb923c" },
  { id: 10, event: "logout",    user: "iris",  ts: "Jan 10", color: "#fb923c" },
  { id: 11, event: "page_view", user: "jack",  ts: "Jan 11", color: "#fb923c" },
];

function Row({ row, animate, delay = 0, dim = false }) {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [animate, delay]);
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 6,
        background: visible ? (dim ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)") : "transparent",
        border: `1px solid ${visible ? (dim ? "rgba(255,255,255,0.06)" : row.color + "44") : "transparent"}`,
        transition: "all 0.4s ease",
        opacity: dim ? 0.35 : visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        marginBottom: 4,
      }}
    >
      {["id", "event", "user", "ts"].map((k) => (
        <span
          key={k}
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: k === "id" ? "#94a3b8" : k === "ts" ? row.color : "#e2e8f0",
            minWidth: k === "event" ? 70 : k === "user" ? 50 : 28,
          }}
        >
          {row[k]}
        </span>
      ))}
    </div>
  );
}

function TableBox({ title, rows, animate = false, highlightNew = false, processing = false, badge = null }) {
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.8)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "14px 16px",
      minWidth: 240,
      position: "relative",
    }}>
      {badge && (
        <div style={{
          position: "absolute", top: -10, right: 10,
          background: badge === "NEW" ? "#fb923c" : "#4ade80",
          color: "#000", fontSize: 9, fontWeight: 800,
          padding: "2px 8px", borderRadius: 20,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: processing ? "#fb923c" : "#4ade80" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>{title}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 6, padding: "0 10px" }}>
        {["id", "event", "user", "ts"].map(k => (
          <span key={k} style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono', monospace", minWidth: k === "event" ? 70 : k === "user" ? 50 : 28, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <Row key={row.id} row={row} animate={animate} delay={i * 80} dim={highlightNew && i < 5} />
      ))}
    </div>
  );
}

function Arrow({ label, color = "#4ade80", pulse = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 8px" }}>
      {label && <span style={{ fontSize: 9, color: color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5, textAlign: "center", maxWidth: 80 }}>{label}</span>}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 40, height: 2, background: color,
          animation: pulse ? "pulse 1.5s ease-in-out infinite" : "none",
          boxShadow: pulse ? `0 0 8px ${color}` : "none",
        }} />
        <div style={{ position: "absolute", right: -6, top: -4, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${color}` }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDES
// ─────────────────────────────────────────────

function IntroSlide() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, padding: "20px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🐢</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0, fontFamily: "'Syne', sans-serif" }}>Your dbt model is getting slow.</h2>
        <p style={{ color: "#94a3b8", marginTop: 8, maxWidth: 480, lineHeight: 1.6, fontSize: 14 }}>
          Every time it runs, it reads <strong style={{ color: "#fb923c" }}>millions of rows</strong> from scratch — even though only a handful are new. There's a smarter way.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {/* Big table */}
        <div style={{
          background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.3)",
          borderRadius: 12, padding: "16px 20px", textAlign: "center", transition: "all 0.6s", opacity: show ? 1 : 0,
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🗄️</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fb923c", fontFamily: "'JetBrains Mono', monospace" }}>Source Table</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>500 million rows</div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
            {[..."████████"].map((_, i) => (
              <div key={i} style={{ height: 6, borderRadius: 3, background: i < 7 ? "#374151" : "#fb923c", width: `${60 + i * 8}px`, transition: "all 0.3s" }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#fb923c", marginTop: 6 }}>↑ only 3 new rows today</div>
        </div>

        <Arrow label="full scan every run" color="#ef4444" pulse />

        <div style={{
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 12, padding: "16px 20px", textAlign: "center", transition: "all 0.6s", opacity: show ? 1 : 0, transitionDelay: "0.2s",
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>⏱️</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>Wasted Compute</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Re-processing 499,999,997</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>rows you already have</div>
          <div style={{ fontSize: 28, marginTop: 8 }}>💸</div>
        </div>
      </div>

      <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "12px 20px", maxWidth: 460, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "#4ade80" }}>💡 <strong>Incremental models</strong> solve this by only processing <em>new or changed</em> data.</span>
      </div>
    </div>
  );
}

function FullRefreshSlide() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);

  const run = () => {
    setRunning(true); setDone(false); setTick(0);
    let t = 0;
    const iv = setInterval(() => { t++; setTick(t); if (t >= 8) { clearInterval(iv); setRunning(false); setDone(true); } }, 200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 500, lineHeight: 1.6, fontSize: 14, margin: 0 }}>
        A <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, color: "#fb923c" }}>materialized='table'</code> model <strong style={{ color: "#f1f5f9" }}>drops and rebuilds</strong> the entire table on every run. Great for small datasets — painful for large ones.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <TableBox title="raw.events" rows={allRows} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Arrow label={running ? "reading ALL rows..." : "reads ALL rows"} color={running ? "#ef4444" : "#94a3b8"} pulse={running} />
          <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>DROP TABLE<br />CREATE TABLE</div>
        </div>
        <TableBox title="mart.events" rows={done ? allRows : allRows.slice(0, tick)} animate={running} />
      </div>

      <button
        onClick={run}
        disabled={running}
        style={{
          padding: "10px 28px", borderRadius: 8, border: "1px solid rgba(251,146,60,0.4)",
          background: running ? "rgba(251,146,60,0.1)" : "rgba(251,146,60,0.2)",
          color: "#fb923c", fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 0.5,
          transition: "all 0.2s",
        }}
      >
        {running ? "⚙️  Running..." : done ? "▶  Run Again" : "▶  Run dbt model"}
      </button>

      {done && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#fca5a5", textAlign: "center" }}>
          ⚠️ Processed <strong>all 8 rows</strong> — even the 5 you already had. Imagine this with 500M rows.
        </div>
      )}
    </div>
  );
}

function AnimatedSourceRow({ row, state, delay }) {
  const [current, setCurrent] = useState("idle");
  useEffect(() => {
    if (state === "idle") { setCurrent("idle"); return; }
    const t = setTimeout(() => setCurrent(state), delay);
    return () => clearTimeout(t);
  }, [state, delay]);

  const colors = { idle: "#334155", scanning: "#facc15", skipped: "#1e293b", passing: "#fb923c", done: "#4ade80" };
  const textColors = { idle: "#64748b", scanning: "#fef08a", skipped: "#334155", passing: "#fb923c", done: "#4ade80" };
  const icons = { idle: "", scanning: "→", skipped: "✕", passing: "✓", done: "✓" };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 6, marginBottom: 3,
      border: `1px solid ${colors[current]}55`,
      background: current === "skipped" ? "rgba(15,23,42,0.4)" : current === "passing" ? "rgba(251,146,60,0.1)" : current === "done" ? "rgba(74,222,128,0.07)" : current === "scanning" ? "rgba(250,204,21,0.06)" : "rgba(255,255,255,0.03)",
      transition: "all 0.35s ease",
      opacity: current === "skipped" ? 0.25 : 1,
    }}>
      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#475569", minWidth: 12 }}>{row.id}</span>
      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: textColors[current], minWidth: 72 }}>{row.event}</span>
      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: textColors[current], minWidth: 44 }}>{row.user}</span>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: colors[current], minWidth: 32 }}>{row.ts}</span>
      <span style={{ fontSize: 10, marginLeft: "auto", color: colors[current], fontWeight: 700, minWidth: 12 }}>{icons[current]}</span>
    </div>
  );
}

function TargetRow({ row, isNew, animate }) {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }
    else setVisible(true);
  }, [animate]);
  return (
    <div style={{
      display: "flex", gap: 6, padding: "4px 6px", borderRadius: 5, marginBottom: 3,
      border: isNew ? "1px solid #fb923c55" : "1px solid #4ade8022",
      background: isNew ? "rgba(251,146,60,0.09)" : "rgba(74,222,128,0.05)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(12px)",
      transition: "all 0.4s ease",
    }}>
      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", minWidth: 12 }}>{row.id}</span>
      <span style={{ fontSize: 11, fontFamily: "monospace", color: isNew ? "#fb923c" : "#4ade80", minWidth: 72 }}>{row.event}</span>
      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#e2e8f0", minWidth: 44 }}>{row.user}</span>
      <span style={{ fontSize: 10, fontFamily: "monospace", color: isNew ? "#fb923c77" : "#4ade8066" }}>{row.ts}</span>
    </div>
  );
}

function IncrementalSlide() {
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [rowStates, setRowStates] = useState({});
  // Shared persistent state — survives tab switches
  const [targetRows, setTargetRows] = useState([]);        // rows in mart.events
  const [firstRunDone, setFirstRunDone] = useState(false); // did first run complete?
  const [statusMsg, setStatusMsg] = useState("");
  const timersRef = useRef([]);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const sched = (fn, ms) => { const t = setTimeout(fn, ms); timersRef.current.push(t); };

  // When switching phases, stop running but DON'T wipe targetRows
  const switchPhase = (p) => {
    clearTimers();
    setRunning(false);
    setRowStates({});
    setStatusMsg("");
    setPhase(p);
  };

  const runFirstRun = () => {
    clearTimers();
    setRunning(true);
    setTargetRows([]);
    setRowStates({});
    setStatusMsg("⚙️  is_incremental() → FALSE — target doesn't exist yet. Loading ALL 8 rows...");

    allRows.forEach((r, i) => {
      sched(() => setRowStates(prev => ({ ...prev, [r.id]: "scanning" })), i * 150);
      sched(() => {
        setRowStates(prev => ({ ...prev, [r.id]: "done" }));
        setTargetRows(prev => [...prev.filter(x => x.id !== r.id), { ...r, isNew: false }]);
      }, i * 150 + 380);
    });

    sched(() => {
      setStatusMsg(`✅  First run complete — 8 rows written. mart.events now exists. Click "Incremental run" ③ to continue.`);
      setRunning(false);
      setFirstRunDone(true);
    }, allRows.length * 150 + 650);
  };

  const runIncremental = () => {
    clearTimers();
    setRunning(true);
    setRowStates({});
    setStatusMsg("⚙️  is_incremental() → TRUE — mart.events exists. Applying WHERE created_at > MAX(created_at)...");

    // Scan all rows from source (8 existing + 3 new)
    const allSource = [...allRows, ...newBatchRows];

    // existing 8 → scan then skip
    allRows.forEach((r, i) => {
      sched(() => setRowStates(prev => ({ ...prev, [r.id]: "scanning" })), i * 120);
      sched(() => setRowStates(prev => ({ ...prev, [r.id]: "skipped" })), i * 120 + 300);
    });

    const skipDone = allRows.length * 120 + 450;
    sched(() => setStatusMsg("🔍  Rows 1–8 already in mart.events — WHERE filter eliminates them. Scanning new rows..."), skipDone);

    // new 3 → scan then pass → land in target
    newBatchRows.forEach((r, i) => {
      sched(() => setRowStates(prev => ({ ...prev, [r.id]: "scanning" })), skipDone + 300 + i * 220);
      sched(() => {
        setRowStates(prev => ({ ...prev, [r.id]: "passing" }));
        setTargetRows(prev => [...prev.filter(x => x.id !== r.id), { ...r, isNew: true }]);
      }, skipDone + 300 + i * 220 + 420);
    });

    const total = skipDone + 300 + newBatchRows.length * 220 + 600;
    sched(() => {
      setStatusMsg("✅  Incremental run complete — only 3 new rows inserted. Rows 1–8 untouched.");
      setRunning(false);
    }, total);
  };

  const phaseConfig = [
    { label: "① Initial state", color: "#64748b" },
    { label: "② First run",     color: "#4ade80" },
    { label: "③ Incremental run", color: "#fb923c" },
  ];

  const firstRunRows  = targetRows.filter(r => !r.isNew);
  const incrementalRows = targetRows.filter(r => r.isNew);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
        {phaseConfig.map((p, i) => (
          <button key={i} onClick={() => switchPhase(i)} style={{
            padding: "6px 14px", borderRadius: 20,
            border: "none",
            background: phase === i ? `${p.color}22` : "transparent",
            color: phase === i ? p.color : "#475569", fontSize: 11, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s",
            outline: phase === i ? `1px solid ${p.color}55` : "none",
          }}>{p.label}</button>
        ))}
      </div>

      {/* ── INITIAL STATE ── */}
      {phase === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "6px 0" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 6, textAlign: "center" }}>raw.events (source)</div>
              <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
                {allRows.map(r => <AnimatedSourceRow key={r.id} row={r} state="idle" delay={0} />)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 56 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px dashed #1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>?</div>
              <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginTop: 4, textAlign: "center" }}>no run yet</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 6, textAlign: "center" }}>mart.events (target)</div>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "2px dashed #1e293b", borderRadius: 10, padding: "12px 14px", minWidth: 220, minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 4 }}>📭</div><div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>does not exist yet</div></div>
              </div>
            </div>
          </div>
          <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 8, padding: "8px 16px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            👆 Click <strong style={{ color: "#4ade80" }}>② First run</strong> to build the table for the first time.
          </div>
        </div>
      )}

      {/* ── FIRST RUN ── */}
      {phase === 1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "7px 14px", width: "100%", maxWidth: 580, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>
              {statusMsg || "is_incremental() checks if mart.events exists. First time → FALSE → full load."}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            {/* Source */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 5, textAlign: "center" }}>raw.events — 8 rows (all scanned)</div>
              <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                {allRows.map(r => <AnimatedSourceRow key={r.id} row={r} state={rowStates[r.id] || "idle"} delay={0} />)}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 52 }}>
              <div style={{ fontSize: 9, color: running ? "#4ade80" : "#1e3a2a", fontFamily: "monospace", transition: "color 0.3s" }}>CREATE TABLE</div>
              <div style={{ position: "relative", width: 44 }}>
                <div style={{ height: 2, background: running ? "#4ade80" : "#1e293b", transition: "background 0.3s", boxShadow: running ? "0 0 8px #4ade80" : "none" }} />
                <div style={{ position: "absolute", right: -6, top: -4, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${running ? "#4ade80" : "#1e293b"}`, transition: "all 0.3s" }} />
              </div>
              <div style={{ fontSize: 9, color: "#1e3a2a", fontFamily: "monospace" }}>INSERT ALL</div>
            </div>

            {/* Target */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 5, textAlign: "center" }}>
                mart.events — {firstRunRows.length} / 8 rows written
              </div>
              <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${firstRunRows.length > 0 ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 10, padding: "10px 12px", minWidth: 220, minHeight: 60, transition: "border-color 0.4s" }}>
                {firstRunRows.length === 0 && <div style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace", padding: "12px 0", textAlign: "center" }}>waiting...</div>}
                {firstRunRows.map(r => <TargetRow key={r.id} row={r} isNew={false} animate={false} />)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#fca5a5", fontFamily: "monospace" }}>
              Rows scanned: <strong>{firstRunRows.length} / 8</strong>
            </div>
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#fca5a5", fontFamily: "monospace" }}>
              SQL: <strong>CREATE TABLE → INSERT ALL</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={runFirstRun} disabled={running} style={{
              padding: "8px 22px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.4)",
              background: running ? "rgba(74,222,128,0.04)" : "rgba(74,222,128,0.14)",
              color: running ? "#475569" : "#4ade80", fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, transition: "all 0.2s",
            }}>
              {running ? "⚙️ Running..." : firstRunDone ? "↩ Rerun first run" : "▶ Run first run"}
            </button>
            {firstRunDone && !running && (
              <button onClick={() => switchPhase(2)} style={{
                padding: "8px 22px", borderRadius: 8, border: "1px solid rgba(251,146,60,0.4)",
                background: "rgba(251,146,60,0.12)", color: "#fb923c", fontWeight: 700, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              }}>
                Next → Incremental run ❯
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── INCREMENTAL RUN ── */}
      {phase === 2 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          {/* Prompt to run first run first */}
          {!firstRunDone && (
            <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#fdba74", textAlign: "center" }}>
              ⚠️ Run <strong>② First run</strong> first so mart.events has the initial 8 rows — then come back here.
            </div>
          )}

          <div style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 8, padding: "7px 14px", width: "100%", maxWidth: 600, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#fb923c", fontFamily: "'JetBrains Mono', monospace" }}>
              {statusMsg || "is_incremental() → TRUE — mart.events already has 8 rows. 3 new rows arrived in source."}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            {/* Source — now shows 11 rows */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 5, textAlign: "center" }}>raw.events — 11 rows (8 old + 3 new)</div>
              <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                {/* existing 8 */}
                {allRows.map(r => <AnimatedSourceRow key={r.id} row={r} state={rowStates[r.id] || "idle"} delay={0} />)}
                {/* divider */}
                <div style={{ borderTop: "1px dashed #fb923c33", margin: "5px 0 5px" }}>
                  <span style={{ fontSize: 8, color: "#fb923c55", fontFamily: "monospace" }}>↓ new today</span>
                </div>
                {newBatchRows.map(r => <AnimatedSourceRow key={r.id} row={r} state={rowStates[r.id] || "idle"} delay={0} />)}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 5, justifyContent: "center", flexWrap: "wrap" }}>
                {[["#facc15", "scanning"], ["rgba(30,41,59,0.9)", "✕ filtered out"], ["#fb923c", "✓ passes"]].map(([c, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: c, border: "1px solid #334155" }} />
                    <span style={{ fontSize: 9, color: "#475569", fontFamily: "monospace" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 64 }}>
              <div style={{ fontSize: 9, color: running ? "#fb923c" : "#1e293b", fontFamily: "monospace", transition: "color 0.3s" }}>INSERT INTO</div>
              <div style={{ position: "relative", width: 44 }}>
                <div style={{ height: 2, background: running ? "#fb923c" : "#1e293b", transition: "background 0.3s", boxShadow: running ? "0 0 8px #fb923c" : "none" }} />
                <div style={{ position: "absolute", right: -6, top: -4, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${running ? "#fb923c" : "#1e293b"}`, transition: "all 0.3s" }} />
              </div>
              <div style={{ fontSize: 9, color: "#1e293b", fontFamily: "monospace" }}>3 rows only</div>
            </div>

            {/* Target — starts with 8 rows, 3 get appended */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 5, textAlign: "center" }}>
                mart.events — {firstRunRows.length + incrementalRows.length} rows total
              </div>
              <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${incrementalRows.length > 0 ? "rgba(251,146,60,0.35)" : "rgba(74,222,128,0.2)"}`, borderRadius: 10, padding: "10px 12px", minWidth: 220, transition: "border-color 0.4s" }}>
                {/* existing 8 — dimmed, untouched */}
                {firstRunRows.map(r => <TargetRow key={r.id} row={r} isNew={false} animate={false} />)}
                {/* divider shows when new rows start arriving */}
                {incrementalRows.length > 0 && (
                  <div style={{ borderTop: "1px dashed #fb923c55", margin: "5px 0 4px", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 8, color: "#fb923c77", fontFamily: "monospace" }}>↓ inserted this run</span>
                  </div>
                )}
                {incrementalRows.map(r => <TargetRow key={r.id} row={r} isNew={true} animate={true} />)}
                {/* If first run not done, show empty state */}
                {firstRunRows.length === 0 && (
                  <div style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace", padding: "12px 0", textAlign: "center" }}>run ② first</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#86efac", fontFamily: "monospace" }}>
              Rows scanned: <strong>11</strong> &nbsp;·&nbsp; Inserted: <strong>{incrementalRows.length} / 3</strong>
            </div>
            <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#86efac", fontFamily: "monospace" }}>
              SQL: <strong>INSERT INTO</strong> (no DROP!)
            </div>
          </div>

          <button onClick={runIncremental} disabled={running || !firstRunDone} style={{
            padding: "8px 22px", borderRadius: 8, border: `1px solid ${firstRunDone ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.07)"}`,
            background: !firstRunDone ? "transparent" : running ? "rgba(251,146,60,0.04)" : "rgba(251,146,60,0.14)",
            color: !firstRunDone ? "#334155" : running ? "#475569" : "#fb923c",
            fontWeight: 700, cursor: (running || !firstRunDone) ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, transition: "all 0.2s",
          }}>
            {running ? "⚙️ Running..." : "▶ Run incremental run"}
          </button>
        </div>
      )}
      <style>{`@keyframes slideIn { from { opacity:0; transform: translateX(10px); } to { opacity:1; transform: translateX(0); } }`}</style>
    </div>
  );
}


const macroCode = `-- models/mart_events.sql

{{ config(materialized='incremental') }}

SELECT
    event_id,
    user_id,
    event_type,
    created_at
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}

  -- This filter ONLY applies on incremental runs
  -- On the first run, is_incremental() = false → full load
  WHERE created_at > (
    SELECT MAX(created_at) FROM {{ this }}
  )

{% endif %}`;

function MacroSlide() {
  const [highlight, setHighlight] = useState(null);

  // key -> which lines to highlight (1-indexed, matches macroCode)
  const annotations = {
    config: {
      lines: [3],
      color: "#a78bfa",
      label: "config()",
      text: "Sets this model to incremental mode. dbt will no longer DROP the table on every run — it will INSERT or MERGE instead.",
    },
    macro: {
      lines: [12, 20],
      color: "#fb923c",
      label: "is_incremental()",
      text: "Returns TRUE when the target table already exists AND you're not running dbt run --full-refresh. On the very first run it returns FALSE, so all rows load.",
    },
    filter: {
      lines: [16, 17, 18],
      color: "#4ade80",
      label: "WHERE filter",
      text: "This block only runs when is_incremental() is TRUE. It filters the source to only rows newer than what's already in the target — so you never reprocess old data.",
    },
    this: {
      lines: [17],
      color: "#38bdf8",
      label: "{{ this }}",
      text: "A special dbt Jinja variable that resolves to the current model's fully-qualified table name in Snowflake, e.g. ANALYTICS.MART.MART_EVENTS.",
    },
  };

  // Build a lookup: lineNum -> annotation key
  const lineToKey = {};
  Object.entries(annotations).forEach(([key, ann]) => {
    ann.lines.forEach(l => { lineToKey[l] = key; });
  });

  const lines = macroCode.split("\n");

  const lineBaseColor = (line, lineNum) => {
    const key = lineToKey[lineNum];
    if (key) return annotations[key].color;
    if (line.trim().startsWith("--")) return "#475569";
    if (line.startsWith("SELECT") || line.startsWith("FROM")) return "#7dd3fc";
    if (line.trim().startsWith("SELECT") || line.trim().startsWith("WHERE")) return "#7dd3fc";
    return "#e2e8f0";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 520, lineHeight: 1.6, fontSize: 14, margin: 0 }}>
        The magic is in the <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, color: "#fb923c" }}>is_incremental()</code> macro.{" "}
        <strong style={{ color: "#f1f5f9" }}>Click any highlighted line</strong> or a card on the right to learn what it does.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", width: "100%", alignItems: "flex-start" }}>

        {/* ── CODE PANEL ── */}
        <div style={{
          background: "rgba(8, 15, 30, 0.95)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "14px 16px",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.85,
          minWidth: 320,
        }}>
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const key = lineToKey[lineNum];
            const ann = key ? annotations[key] : null;
            const isActive = key && highlight === key;
            const isRelated = key && highlight === key;
            const dimmed = highlight && !isActive;

            return (
              <div
                key={lineNum}
                onClick={() => key && setHighlight(highlight === key ? null : key)}
                title={ann ? `Click to learn about ${ann.label}` : ""}
                style={{
                  display: "flex", gap: 10, padding: "2px 8px", borderRadius: 5,
                  cursor: key ? "pointer" : "default",
                  background: isActive ? `${ann.color}1a` : "transparent",
                  borderLeft: `3px solid ${key ? ann.color : "transparent"}`,
                  opacity: dimmed ? 0.35 : 1,
                  transition: "all 0.2s",
                  outline: isActive ? `1px solid ${ann.color}44` : "none",
                }}
              >
                <span style={{
                  color: "#2d3f55", minWidth: 20, textAlign: "right",
                  userSelect: "none", fontSize: 10, paddingTop: 1,
                }}>{lineNum}</span>
                <span style={{
                  color: key ? ann.color : lineBaseColor(line, lineNum),
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.2s",
                  whiteSpace: "pre",
                }}>
                  {line || " "}
                </span>
                {key && !isActive && (
                  <span style={{ marginLeft: "auto", fontSize: 9, color: ann.color + "66", alignSelf: "center" }}>↖</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── ANNOTATION CARDS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 210, maxWidth: 250 }}>
          <div style={{ fontSize: 9, color: "#334155", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 2 }}>CLICK TO EXPLORE</div>
          {Object.entries(annotations).map(([key, ann]) => {
            const isActive = highlight === key;
            return (
              <div
                key={key}
                onClick={() => setHighlight(isActive ? null : key)}
                style={{
                  background: isActive ? `${ann.color}15` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isActive ? ann.color + "66" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10, padding: "10px 12px",
                  cursor: "pointer", transition: "all 0.2s",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                  boxShadow: isActive ? `0 0 12px ${ann.color}22` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: isActive ? 6 : 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: ann.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: ann.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {ann.label}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: isActive ? ann.color : "#334155" }}>
                    {isActive ? "▾" : "▸"}
                  </span>
                </div>
                {isActive && (
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginTop: 4 }}>
                    {ann.text}
                    <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {ann.lines.map(l => (
                        <span key={l} style={{ fontSize: 9, background: `${ann.color}22`, color: ann.color, padding: "1px 6px", borderRadius: 10, fontFamily: "monospace" }}>
                          line {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {!highlight && (
            <div style={{ fontSize: 10, color: "#1e3a2a", fontFamily: "monospace", textAlign: "center", marginTop: 4 }}>
              ← click a card or a colored line
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


const strategies = [
  {
    id: "append",
    name: "append",
    emoji: "➕",
    color: "#4ade80",
    isDefault: false,
    desc: "Simply inserts new rows into the Snowflake table. Never touches existing rows — no MERGE, no DELETE.",
    when: "Immutable event logs, click streams, audit trails — data where each row is a permanent fact that never changes.",
    caution: "No deduplication happens. If Snowflake receives the same row twice (e.g. a pipeline retry), you'll get duplicates in the target.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='append'
  -- No unique_key needed
) }}

SELECT event_id, user_id, event_type, created_at
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  WHERE created_at > (
    SELECT MAX(created_at) FROM {{ this }}
  )
{% endif %}`,
    viz: "append",
    snowflakeSql: "INSERT INTO target SELECT ... FROM staging",
  },
  {
    id: "merge",
    name: "merge",
    emoji: "🔀",
    color: "#29b6f6",
    isDefault: true,
    desc: "Snowflake's default strategy. Uses SQL MERGE to UPDATE rows that match on a key and INSERT rows that are brand new.",
    when: "Records that can change over time — order statuses, user profiles, loan states. The go-to for most Snowflake dbt models.",
    caution: "Snowflake's MERGE locks the target table during execution. On very wide tables, consider merge_update_columns to limit what gets updated.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='merge',  -- default on Snowflake
  unique_key='order_id',
  -- Optional: only update specific columns
  merge_update_columns=['status', 'updated_at']
) }}

SELECT order_id, customer_id, status, updated_at
FROM {{ source('raw', 'orders') }}

{% if is_incremental() %}
  WHERE updated_at > (
    SELECT MAX(updated_at) FROM {{ this }}
  )
{% endif %}`,
    viz: "merge",
    snowflakeSql: "MERGE INTO target USING staging\n  ON target.order_id = staging.order_id\n  WHEN MATCHED THEN UPDATE ...\n  WHEN NOT MATCHED THEN INSERT ...",
  },
  {
    id: "delete_insert",
    name: "delete+insert",
    emoji: "🔄",
    color: "#fb923c",
    isDefault: false,
    desc: "Deletes all rows matching a unique_key from the target, then re-inserts the full batch from source. Runs as a single Snowflake transaction.",
    when: "Date-partitioned loads where an entire day or hour can be re-delivered (e.g. late-arriving facts, daily snapshots).",
    caution: "More compute than append but safer than merge for partition-level reloads. unique_key must be the partition column (e.g. date_day).",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='delete+insert',
  unique_key='date_day'
) }}

SELECT
  DATE_TRUNC('day', created_at) AS date_day,
  COUNT(*) AS event_count
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  WHERE date_day >= (
    SELECT MAX(date_day) FROM {{ this }}
  )
{% endif %}

GROUP BY 1`,
    viz: "delete_insert",
    snowflakeSql: "DELETE FROM target WHERE date_day IN (...)\nINSERT INTO target SELECT ... FROM staging",
  },
,
  {
    id: "insert_overwrite",
    name: "insert_overwrite",
    emoji: "🔁",
    color: "#a78bfa",
    isDefault: false,
    desc: "Overwrites entire partitions of the target table. Operates on partitions, not individual rows — no unique_key needed.",
    when: "BigQuery, Spark, and Databricks partitioned tables. Ideal when you want to fully replace a date partition each run.",
    caution: "Not supported on Snowflake or Postgres. Requires a partitioned table. Replaces the entire partition — not row-level updates.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='insert_overwrite',
  partition_by={
    "field": "created_date",
    "data_type": "date"
  }
) }}

SELECT event_id, created_date, event_type
FROM {{ source('raw', 'events') }}

{% if is_incremental() %}
  -- Overwrite only recent partitions
  WHERE created_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
{% endif %}`,
    viz: "insert_overwrite",
    warehouseSql: "INSERT OVERWRITE partition(created_date)\nSELECT ... FROM staging\n-- Replaces entire partition atomically",
  },
  {
    id: "microbatch",
    name: "microbatch",
    emoji: "⚡",
    color: "#f472b6",
    isDefault: false,
    desc: "Processes large time-series datasets in multiple small queries ('batches') based on an event_time column. Designed for resilience and efficiency at scale.",
    when: "Very large event tables where a single incremental query is too slow or risky. dbt Core v1.9+. Requires event_time on model and sources.",
    caution: "Requires dbt Core v1.9+ and event_time config. Not all adapters support it. Each batch window runs a separate query — more queries, but each is smaller and recoverable.",
    sql: `{{ config(
  materialized='incremental',
  incremental_strategy='microbatch',
  event_time='event_timestamp',
  begin='2024-01-01',
  batch_size='day'   -- hour | day | month | year
) }}

SELECT event_id, event_timestamp, event_type
FROM {{ source('raw', 'events') }}
-- dbt automatically adds the batch window filter:
-- WHERE event_timestamp >= '2024-01-15'
--   AND event_timestamp < '2024-01-16'`,
    viz: "microbatch",
    warehouseSql: "-- One query per time window:\nINSERT INTO target\nSELECT ... WHERE event_timestamp BETWEEN batch_start AND batch_end",
  },
];


// ══════════════════════════════════════════════════════════════════════════
// ANIMATED STRATEGY VISUALIZATIONS
// Each strategy plays out frame-by-frame with moving rows and status badges
// ══════════════════════════════════════════════════════════════════════════

function AnimRow({ row, visible, flash, highlight, dim, strikethrough, badge, delay = 0 }) {
  const [show, setShow] = useState(visible || false);
  const [flashing, setFlashing] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout); timers.current = [];
    if (visible && !show) {
      const t = setTimeout(() => setShow(true), delay);
      timers.current.push(t);
    } else if (!visible) {
      setShow(false);
    }
  }, [visible, delay]);

  useEffect(() => {
    if (flash) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 600);
      timers.current.push(t);
    }
  }, [flash]);

  if (!show) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 6, marginBottom: 3,
      border: `1px solid ${highlight ? row.color : dim ? "#1e293b" : row.color + "44"}`,
      background: flashing ? row.color + "33" : highlight ? row.color + "18" : dim ? "rgba(255,255,255,0.02)" : row.color + "0d",
      opacity: dim ? 0.3 : 1,
      transition: "all 0.35s ease",
      animation: show ? "slideIn 0.3s ease" : "none",
      textDecoration: strikethrough ? "line-through" : "none",
    }}>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: dim ? "#334155" : row.color, flex: 1 }}>{row.label}</span>
      {badge && (
        <span style={{ fontSize: 8, fontFamily: "monospace", padding: "1px 6px", borderRadius: 8, background: badge.bg, color: badge.text, fontWeight: 700, whiteSpace: "nowrap" }}>{badge.label}</span>
      )}
    </div>
  );
}

const STRAT_ANIMATIONS = {
  append: {
    title: "➕ APPEND: New rows are inserted. Existing rows are never touched.",
    steps: [
      { label: "Initial state", note: "Target table has 3 existing rows. Source has 2 new rows arriving." },
      { label: "Read new rows", note: "WHERE clause filters source to only rows newer than MAX(created_at) in target." },
      { label: "INSERT new rows", note: "dbt runs INSERT INTO target — the 2 new rows are added at the bottom." },
      { label: "Done ✓", note: "Target now has 5 rows. The original 3 rows were never touched or re-read." },
    ],
    render: (step, color) => {
      const existingRows = [
        { id:1, label:"EVT-001  page_view  Jan 1", color:"#4ade80" },
        { id:2, label:"EVT-002  purchase   Jan 2", color:"#4ade80" },
        { id:3, label:"EVT-003  logout     Jan 3", color:"#4ade80" },
      ];
      const newRows = [
        { id:4, label:"EVT-004  click      Jan 4", color },
        { id:5, label:"EVT-005  signup     Jan 5", color },
      ];
      return (
        <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
          {/* Source */}
          <div style={{ minWidth:200 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>SOURCE (new batch)</div>
            {newRows.map((r,i) => (
              <AnimRow key={r.id} row={r} visible={step >= 1} delay={i*100}
                highlight={step === 1}
                badge={step >= 1 ? { label:"NEW", bg:color+"22", text:color } : null} />
            ))}
          </div>
          {/* Arrow */}
          <div style={{ paddingTop:24, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ fontSize:8, color:step>=2?color:"#1e293b", fontFamily:"monospace", transition:"color 0.4s", whiteSpace:"nowrap" }}>INSERT INTO</div>
            <div style={{ width:32, height:2, background:step>=2?color:"#1e293b", transition:"background 0.4s", boxShadow:step>=2?`0 0 6px ${color}`:""}} />
            <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${step>=2?color:"#1e293b"}`, transition:"border-left-color 0.4s" }} />
          </div>
          {/* Target */}
          <div style={{ minWidth:200 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>TARGET (mart_events)</div>
            {existingRows.map(r => (
              <AnimRow key={r.id} row={r} visible={true} />
            ))}
            {step >= 2 && <div style={{ borderTop:"1px dashed #1e3a2a", margin:"3px 0", fontSize:8, color:color+"88", fontFamily:"monospace" }}>↓ appended</div>}
            {newRows.map((r,i) => (
              <AnimRow key={r.id} row={r} visible={step >= 2} delay={i*150}
                highlight={step === 2}
                badge={step>=3 ? { label:"INSERTED", bg:color+"18", text:color } : null} />
            ))}
          </div>
        </div>
      );
    },
  },

  merge: {
    title: "🔀 MERGE: Matched rows UPDATE. Unmatched rows INSERT. Nothing is deleted.",
    steps: [
      { label: "Initial state", note: "Target has 3 rows. Source has 2 rows: one matches an existing key (EVT-002), one is new (EVT-004)." },
      { label: "Compare keys", note: "dbt checks each source row against the target using unique_key. EVT-002 matches, EVT-004 doesn't." },
      { label: "UPDATE matched", note: "EVT-002 already exists with key order_id=2 — its status column is updated in-place." },
      { label: "INSERT new", note: "EVT-004 has no match in target — it's inserted as a brand new row." },
      { label: "Done ✓", note: "EVT-001 and EVT-003 were untouched. No deletions happened. Target has 4 rows." },
    ],
    render: (step, color) => {
      const targetRows = [
        { id:1, label:"order_id=1  status=pending", color:"#4ade80" },
        { id:2, label:"order_id=2  status=pending", color: step >= 2 ? color : "#4ade80" },
        { id:3, label:"order_id=3  status=shipped", color:"#4ade80" },
      ];
      const sourceRows = [
        { id:2, label:"order_id=2  status=delivered", color },
        { id:4, label:"order_id=4  status=pending",   color },
      ];
      return (
        <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
          <div style={{ minWidth:210 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>SOURCE (new batch)</div>
            {sourceRows.map((r,i) => (
              <AnimRow key={r.id} row={r} visible={true}
                highlight={step >= 1 && r.id === 2}
                badge={
                  step >= 1 && r.id === 2 ? { label:"MATCH → UPDATE", bg:color+"22", text:color } :
                  step >= 1 && r.id === 4 ? { label:"NO MATCH → INSERT", bg:"#4ade8022", text:"#4ade80" } : null
                } />
            ))}
          </div>
          <div style={{ paddingTop:24, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ fontSize:8, color:step>=2?color:"#1e293b", fontFamily:"monospace", transition:"color 0.4s" }}>MERGE</div>
            <div style={{ width:32, height:2, background:step>=2?color:"#1e293b", transition:"background 0.4s" }} />
            <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${step>=2?color:"#1e293b"}`, transition:"border-left-color 0.4s" }} />
          </div>
          <div style={{ minWidth:220 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>TARGET (orders table)</div>
            <AnimRow key={1} row={targetRows[0]} visible={true} />
            <AnimRow key={2} row={{
              ...targetRows[1],
              label: step >= 2 ? "order_id=2  status=delivered" : "order_id=2  status=pending",
              color: step >= 2 ? color : "#4ade80",
            }} visible={true} highlight={step === 2} flash={step === 2}
              badge={step >= 2 ? { label:"UPDATED ✓", bg:color+"22", text:color } : null} />
            <AnimRow key={3} row={targetRows[2]} visible={true} />
            <AnimRow key={4} row={{ id:4, label:"order_id=4  status=pending", color }}
              visible={step >= 3} delay={0}
              badge={{ label:"INSERTED ✓", bg:"#4ade8022", text:"#4ade80" }} />
          </div>
        </div>
      );
    },
  },

  delete_insert: {
    title: "🔄 DELETE+INSERT: Target partition is deleted first, then re-inserted from source.",
    steps: [
      { label: "Initial state", note: "Target has data for Jan 3 (3 rows) and Jan 4 (2 rows). Source will re-deliver all Jan 4 data." },
      { label: "Identify partition", note: "dbt finds the partition to replace: all rows WHERE date_day = '2024-01-04'." },
      { label: "DELETE partition", note: "All Jan 4 rows in the target are deleted. Jan 3 rows are untouched." },
      { label: "INSERT from source", note: "Source data for Jan 4 is re-inserted fresh. This may include corrected or late-arriving rows." },
      { label: "Done ✓", note: "Jan 4 partition replaced atomically. Jan 3 data unchanged. Use this for date-partitioned loads." },
    ],
    render: (step, color) => {
      const jan3 = [
        { id:1, label:"2024-01-03  EVT-001  pageview", color:"#4ade80" },
        { id:2, label:"2024-01-03  EVT-002  click",    color:"#4ade80" },
        { id:3, label:"2024-01-03  EVT-003  signup",   color:"#4ade80" },
      ];
      const jan4old = [
        { id:4, label:"2024-01-04  EVT-004  pageview", color:"#facc15" },
        { id:5, label:"2024-01-04  EVT-005  click",    color:"#facc15" },
      ];
      const jan4new = [
        { id:4, label:"2024-01-04  EVT-004  pageview", color },
        { id:5, label:"2024-01-04  EVT-005  click",    color },
        { id:6, label:"2024-01-04  EVT-006  purchase (corrected)", color },
      ];
      return (
        <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
          <div style={{ minWidth:230 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>SOURCE (date partition)</div>
            <div style={{ fontSize:8, color:"#334155", fontFamily:"monospace", marginBottom:3 }}>Jan 3 — not in this batch</div>
            {jan3.map(r => <AnimRow key={r.id} row={r} visible={true} dim />)}
            <div style={{ fontSize:8, color:color, fontFamily:"monospace", margin:"5px 0 3px" }}>Jan 4 — re-delivering</div>
            {jan4new.map((r,i) => <AnimRow key={r.id} row={r} visible={step>=1} delay={i*80}
              badge={r.id===6 ? {label:"corrected", bg:color+"22", text:color} : null} />)}
          </div>
          <div style={{ paddingTop:60, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ fontSize:8, color:step>=2?T.red:"#1e293b", fontFamily:"monospace", transition:"color 0.4s", whiteSpace:"nowrap" }}>
              {step<2?"":"step 1: DELETE"}
            </div>
            <div style={{ width:32, height:2, background:step>=2?T.red:step>=3?color:"#1e293b", transition:"background 0.4s" }} />
            <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${step>=2?T.red:step>=3?color:"#1e293b"}`, transition:"border-left-color 0.4s" }} />
            {step>=3 && <div style={{ fontSize:8, color:color, fontFamily:"monospace", marginTop:2, whiteSpace:"nowrap" }}>step 2: INSERT</div>}
          </div>
          <div style={{ minWidth:240 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>TARGET (events table)</div>
            <div style={{ fontSize:8, color:"#4ade80", fontFamily:"monospace", marginBottom:3 }}>Jan 3 — untouched</div>
            {jan3.map(r => <AnimRow key={r.id} row={r} visible={true} />)}
            <div style={{ fontSize:8, color:step>=2?T.red:step>=1?"#facc15":"#334155", fontFamily:"monospace", margin:"5px 0 3px", transition:"color 0.4s" }}>
              Jan 4 — {step<1?"old partition":step<2?"target partition":step<3?"← DELETED":"← REPLACED"}
            </div>
            {jan4old.map((r,i) => (
              <AnimRow key={r.id} row={r} visible={step<3} dim={step>=2} strikethrough={step>=2}
                badge={step>=2&&step<3 ? {label:"DELETING...", bg:"rgba(248,113,113,0.15)", text:T.red} : null} />
            ))}
            {jan4new.map((r,i) => (
              <AnimRow key={r.id} row={r} visible={step>=3} delay={i*100}
                highlight={step===3}
                badge={step>=4 ? {label:"INSERTED ✓", bg:color+"18", text:color} : null} />
            ))}
          </div>
        </div>
      );
    },
  },

  insert_overwrite: {
    title: "🔁 INSERT OVERWRITE: Entire partition is atomically replaced in one step.",
    steps: [
      { label: "Initial state", note: "Target has 3 date partitions. Source has fresh data for the Jan 2024 partition." },
      { label: "Select partition", note: "dbt identifies which partition to overwrite based on partition_by config." },
      { label: "INSERT OVERWRITE", note: "Warehouse replaces the entire Jan 2024 partition atomically — no separate DELETE step." },
      { label: "Done ✓", note: "Partition replaced in one atomic operation. Dec and Nov partitions are completely untouched." },
    ],
    render: (step, color) => {
      const partitions = [
        { id:"nov", label:"partition: 2023-11  (34k rows)", color:"#4ade80", month:"Nov" },
        { id:"dec", label:"partition: 2023-12  (41k rows)", color:"#4ade80", month:"Dec" },
        { id:"jan", label:"partition: 2024-01  (28k rows)", color:"#facc15", month:"Jan" },
      ];
      return (
        <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
          <div style={{ minWidth:210 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>SOURCE (new data)</div>
            <div style={{ fontSize:8, color:"#334155", fontFamily:"monospace", marginBottom:4 }}>Only Jan 2024 partition arriving:</div>
            <AnimRow row={{ id:"jan_src", label:"partition: 2024-01  (31k rows, corrected)", color }} visible={true}
              highlight={step>=1} badge={step>=1?{label:"INSERT OVERWRITE", bg:color+"22", text:color}:null} />
          </div>
          <div style={{ paddingTop:44, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ fontSize:8, color:step>=2?color:"#1e293b", fontFamily:"monospace", transition:"color 0.4s", whiteSpace:"nowrap" }}>overwrite partition</div>
            <div style={{ width:32, height:2, background:step>=2?color:"#1e293b", transition:"background 0.4s", boxShadow:step>=2?`0 0 6px ${color}`:""}} />
            <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${step>=2?color:"#1e293b"}`, transition:"border-left-color 0.4s" }} />
          </div>
          <div style={{ minWidth:220 }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>TARGET (partitioned table)</div>
            {partitions.slice(0,2).map(r => (
              <AnimRow key={r.id} row={r} visible={true}
                badge={{ label:`${r.month} — untouched`, bg:"#4ade8012", text:"#4ade8088" }} />
            ))}
            {/* Jan partition: overwritten */}
            {step < 2 && (
              <AnimRow row={partitions[2]} visible={true}
                highlight={step===1}
                badge={step>=1?{label:"← will be overwritten", bg:"#facc1522", text:"#facc15"}:null} />
            )}
            {step >= 2 && (
              <AnimRow row={{ id:"jan_new", label:"partition: 2024-01  (31k rows)", color }}
                visible={true} highlight={step===2} flash={step===2}
                badge={{ label:"OVERWRITTEN ✓", bg:color+"22", text:color }} />
            )}
          </div>
        </div>
      );
    },
  },

  microbatch: {
    title: "⚡ MICROBATCH: Large table processed in small time-window queries (batches).",
    steps: [
      { label: "Initial state", note: "Large events table. Last run was 3 days ago. dbt will process each day as a separate batch." },
      { label: "Batch 1: Jan 13", note: "dbt runs first query: WHERE event_time >= '2024-01-13' AND < '2024-01-14'. Inserts results." },
      { label: "Batch 2: Jan 14", note: "Second query runs: WHERE event_time >= '2024-01-14' AND < '2024-01-15'. Each batch is independent." },
      { label: "Batch 3: Jan 15", note: "Third query runs for the most recent day. If any batch fails, only that batch is retried." },
      { label: "Done ✓", note: "3 days of data processed in 3 separate queries. If Batch 2 failed, dbt retries only that one batch." },
    ],
    render: (step, color) => {
      const batches = [
        { id:1, label:"2024-01-13  batch (42k events)", color, date:"Jan 13" },
        { id:2, label:"2024-01-14  batch (38k events)", color, date:"Jan 14" },
        { id:3, label:"2024-01-15  batch (21k events)", color, date:"Jan 15" },
      ];
      const filters = [
        "event_time >= '2024-01-13' AND < '2024-01-14'",
        "event_time >= '2024-01-14' AND < '2024-01-15'",
        "event_time >= '2024-01-15' AND < '2024-01-16'",
      ];
      return (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            {/* Config */}
            <div style={{ minWidth:180 }}>
              <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>batch_size: 'day'</div>
              {batches.map((b,i) => (
                <div key={b.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 8px", borderRadius:6, marginBottom:3,
                  border:`1px solid ${step>i?color+"55":"rgba(255,255,255,0.07)"}`,
                  background:step===i+1?`${color}18`:step>i?`${color}0d`:"transparent",
                  transition:"all 0.3s" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:step>i?color:step===i+1?color:"#334155", transition:"background 0.3s", flexShrink:0 }} />
                  <span style={{ fontSize:9, fontFamily:"monospace", color:step>i?color:step===i+1?color:"#334155", transition:"color 0.3s" }}>{b.date}</span>
                  {step > i && <span style={{ fontSize:8, color:"#4ade80", marginLeft:"auto" }}>✓</span>}
                  {step === i+1 && <span style={{ fontSize:8, color:color, marginLeft:"auto" }}>running...</span>}
                </div>
              ))}
            </div>
            {/* Queries */}
            <div style={{ minWidth:240, maxWidth:300 }}>
              <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace", marginBottom:5, letterSpacing:0.5 }}>GENERATED QUERIES</div>
              {batches.map((b,i) => (
                <div key={b.id} style={{ marginBottom:6, opacity:step>=i+1?1:0.2, transition:"opacity 0.4s" }}>
                  <div style={{ fontSize:8, color:step===i+1?color:step>i?"#4ade80":"#334155", fontFamily:"monospace", marginBottom:2, transition:"color 0.3s" }}>
                    {step===i+1?"▶ Query "+(i+1)+" running":step>i?"✓ Query "+(i+1)+" done":"○ Query "+(i+1)+" waiting"}
                  </div>
                  <div style={{ background:"rgba(4,9,20,0.8)", borderRadius:5, padding:"4px 8px", border:`1px solid ${step===i+1?color+"44":"rgba(255,255,255,0.05)"}`, transition:"border-color 0.3s" }}>
                    <div style={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace", color:"#475569" }}>WHERE</div>
                    <div style={{ fontSize:8, fontFamily:"'JetBrains Mono',monospace", color:step>=i+1?color:"#334155" }}>{filters[i]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {step >= 4 && (
            <div style={{ background:`${color}09`, border:`1px solid ${color}28`, borderRadius:8, padding:"8px 12px", fontSize:10, color:"#94a3b8", fontFamily:"monospace", animation:"popIn 0.3s ease" }}>
              💡 If Batch 2 (Jan 14) had failed, dbt would retry <strong style={{ color }}>only that batch</strong> — not re-process Jan 13 or Jan 15.
            </div>
          )}
        </div>
      );
    },
  },
};

function StrategyViz({ type, color }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef([]);

  const anim = STRAT_ANIMATIONS[type];
  if (!anim) return null;

  const totalSteps = anim.steps.length - 1;

  const play = () => {
    if (running) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setStep(0); setRunning(true);
    anim.steps.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => {
        setStep(i);
        if (i === totalSteps) setRunning(false);
      }, i * 1000);
      timers.current.push(t);
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setStep(0); setRunning(false);
  };

  return (
    <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:10 }}>
      {/* Header */}
      <div style={{ fontSize:9, color:color, fontFamily:"monospace", letterSpacing:0.5, fontWeight:700 }}>
        🎬 ANIMATED ILLUSTRATION
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", gap:4, alignItems:"center", flexWrap:"wrap" }}>
        {anim.steps.map((s, i) => (
          <div key={i} onClick={() => { reset(); setStep(i); }} style={{
            display:"flex", alignItems:"center", gap:3, cursor:"pointer",
            padding:"3px 8px", borderRadius:14, fontSize:9, fontFamily:"monospace",
            border:`1px solid ${step===i?color:"rgba(255,255,255,0.07)"}`,
            background:step===i?`${color}18`:step>i?"rgba(255,255,255,0.04)":"transparent",
            color:step===i?color:step>i?"#475569":"#1e293b",
            transition:"all 0.2s",
          }}>
            {step > i ? "✓" : i+1}. {s.label}
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:`1px solid rgba(255,255,255,0.06)`, borderRadius:8, padding:"8px 12px", fontSize:11, color:"#94a3b8", lineHeight:1.6, minHeight:36 }}>
        {anim.steps[step].note}
      </div>

      {/* The animation frame */}
      <div style={{ background:"rgba(4,9,20,0.9)", border:`1px solid ${color}22`, borderRadius:10, padding:"14px 12px", minHeight:100 }}>
        {anim.render(step, color)}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={play} disabled={running} style={{
          padding:"6px 18px", borderRadius:8, fontSize:10, cursor:running?"not-allowed":"pointer",
          fontFamily:"'JetBrains Mono',monospace", fontWeight:700, transition:"all 0.2s",
          border:`1px solid ${color}55`, background:running?`${color}08`:`${color}18`,
          color:running?"#475569":color,
        }}>
          {running ? "⚙️  Playing..." : step===totalSteps ? "↩ Replay" : "▶  Play animation"}
        </button>
        <button onClick={reset} style={{
          padding:"6px 14px", borderRadius:8, fontSize:10, cursor:"pointer",
          fontFamily:"'JetBrains Mono',monospace",
          border:"1px solid rgba(255,255,255,0.08)", background:"transparent", color:T.grey,
        }}>Reset</button>
        {step < totalSteps && (
          <button onClick={() => setStep(s => Math.min(totalSteps, s+1))} disabled={running} style={{
            padding:"6px 14px", borderRadius:8, fontSize:10, cursor:running?"not-allowed":"pointer",
            fontFamily:"'JetBrains Mono',monospace",
            border:`1px solid rgba(255,255,255,0.1)`, background:"rgba(255,255,255,0.04)", color:T.grey,
          }}>Step →</button>
        )}
      </div>
    </div>
  );
}

function StrategyCard({ s, expanded, onToggle }) {
  return (
    <div style={{ width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${expanded ? s.color + "44" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.2s" }}>
      {/* Header row — always visible */}
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px",
          background: expanded ? `rgba(15,23,42,0.95)` : "rgba(15,23,42,0.5)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>{s.name}</span>
        {s.isDefault && (
          <span style={{ fontSize: 8, background: s.color, color: "#000", fontWeight: 800, padding: "1px 6px", borderRadius: 10, fontFamily: "monospace", letterSpacing: 0.5, flexShrink: 0 }}>DEFAULT</span>
        )}
        <span style={{ fontSize: 12, color: "#475569", flex: 1, lineHeight: 1.4, paddingLeft: 4 }}>{s.desc}</span>
        <span style={{ fontSize: 12, color: expanded ? s.color : "#334155", flexShrink: 0, transition: "color 0.2s", marginLeft: 8 }}>{expanded ? "▾" : "▸"}</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: "14px 16px 16px", background: "rgba(8,14,28,0.9)", borderTop: `1px solid ${s.color}22` }}>
          {/* Snowflake SQL pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(41,182,246,0.07)", border: "1px solid rgba(41,182,246,0.2)", borderRadius: 6, padding: "3px 10px", marginBottom: 12 }}>
            <span style={{ fontSize: 9, color: "#7dd3fc", fontFamily: "monospace" }}>🗄️ {(s.warehouseSql || s.snowflakeSql || "").split("\n")[0]}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.14)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "#4ade80", fontFamily: "monospace", marginBottom: 3, letterSpacing: 0.5 }}>✅ BEST FOR</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{s.when}</div>
            </div>
            <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.14)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "#fb923c", fontFamily: "monospace", marginBottom: 3, letterSpacing: 0.5 }}>⚠️ WATCH OUT</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{s.caution}</div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>DBT CONFIG</div>
            <div style={{ background: "rgba(4,9,20,0.95)", borderRadius: 8, padding: "8px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, overflowX: "auto" }}>
              {s.sql.split("\n").map((line, i) => (
                <div key={i} style={{ color: line.trim().startsWith("--") ? "#334155" : line.includes("'incremental'") ? "#4ade80" : line.includes("strategy") ? s.color : line.includes("unique_key") || line.includes("merge_update") ? "#38bdf8" : line.startsWith("SELECT") || line.startsWith("FROM") || line.startsWith("WHERE") || line.startsWith("GROUP") ? "#7dd3fc" : "#e2e8f0", whiteSpace: "pre" }}>{line || " "}</div>
              ))}
            </div>
          </div>

          <StrategyViz type={s.viz} color={s.color} />
        </div>
      )}
    </div>
  );
}

function StrategiesSlide() {
  const [expanded, setExpanded] = useState("merge");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(41,182,246,0.07)", border: "1px solid rgba(41,182,246,0.22)", borderRadius: 20, padding: "5px 14px" }}>
        <span style={{ fontSize: 13 }}>❄️</span>
        <span style={{ fontSize: 11, color: "#29b6f6", fontFamily: "'JetBrains Mono', monospace" }}>5 incremental strategies per the dbt docs. Click each to expand.</span>
      </div>
      <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 540, lineHeight: 1.6, fontSize: 13, margin: 0 }}>
        dbt supports 5 incremental strategies. <strong style={{ color: "#29b6f6" }}>merge is the default</strong> when a <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#fb923c" }}>unique_key</code> is set. Strategy availability varies by adapter — check your adapter docs.
      </p>

      {/* Accordion — full width stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {strategies.map(s => (
          <StrategyCard
            key={s.id}
            s={s}
            expanded={expanded === s.id}
            onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
          />
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ width: "100%", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", letterSpacing: 1, padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>QUICK COMPARISON</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["", "➕ append", "🔀 merge", "🔄 delete+insert", "🔁 insert_overwrite", "⚡ microbatch"].map((h, i) => (
                  <th key={i} style={{ padding: "8px 12px", textAlign: i === 0 ? "left" : "center", color: i === 0 ? "#334155" : [null, "#4ade80", "#29b6f6", "#fb923c", "#a78bfa", "#f472b6"][i], fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["unique_key required?", "✕ No", "✓ Yes", "✓ Yes (partition col)", "✕ No (partition_by)", "✕ No (event_time)"],
                ["Handles row updates?", "✕ No", "✓ Yes (MERGE)", "✓ Yes (re-partition)", "✓ Yes (partition)", "✓ Yes (batch)"],
                ["Handles duplicates?", "✕ No", "✓ Yes", "✓ Yes", "✓ Yes (partition)", "✓ Yes (batch)"],
                ["Compute cost", "Cheapest", "Expensive", "Mid", "Mid", "Efficient at scale"],
                ["Warehouse SQL", "INSERT", "MERGE INTO", "DELETE + INSERT", "INSERT OVERWRITE", "Batch INSERTs"],
              ].map(([label, ...vals]) => (
                <tr key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "7px 12px", color: "#475569", whiteSpace: "nowrap" }}>{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ padding: "7px 12px", textAlign: "center", color: v.startsWith("✓") ? "#4ade80" : v.startsWith("✕") ? "#475569" : "#94a3b8", fontSize: 10 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ─── SCHEMA CHANGE SLIDE ───────────────────────────────────────────────────

const schemaOptions = [
  {
    id: "ignore",
    label: "ignore",
    color: "#94a3b8",
    emoji: "🙈",
    isDefault: true,
    desc: "New columns in the source are silently ignored. The target schema stays frozen as-is.",
    behavior: "device_type added to source → NOT added to mart_events. Old rows and new rows both miss the column.",
    when: "Your source schema is tightly controlled and rarely changes. You want no surprises in production.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='ignore'  -- default
) }}`,
    dbtAction: "dbt detects the schema diff but takes no action. Runs normally.",
    snowflakeSql: "-- No ALTER TABLE\nINSERT INTO mart_events (event_id, loan_id, event_type, created_at)\nSELECT event_id, loan_id, event_type, created_at FROM staging\n-- device_type is silently dropped from the SELECT",
  },
  {
    id: "fail",
    label: "fail",
    color: "#ef4444",
    emoji: "🚨",
    isDefault: false,
    desc: "dbt raises a hard error and aborts the run the moment it detects any schema difference.",
    behavior: "device_type added to source → dbt run fails immediately with a clear error. Nothing is written.",
    when: "Any schema change should be a conscious decision. Forces the team to review and run --full-refresh deliberately.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='fail'
) }}`,
    dbtAction: "Schema mismatch detected → RuntimeError raised → run aborted. No data written.",
    snowflakeSql: "-- dbt raises:\n-- RuntimeError: detected column additions/removals\n-- Run aborted. Use --full-refresh to rebuild.",
  },
  {
    id: "append_new_columns",
    label: "append_new_columns",
    color: "#fb923c",
    emoji: "➕",
    isDefault: false,
    desc: "Automatically ALTERs the target table to add new columns. Existing rows get NULL for those columns.",
    behavior: "device_type added to source → ALTER TABLE adds it to mart_events. New rows have values. Old rows get NULL.",
    when: "Additive schema changes are expected and safe. You're OK with NULLs in historical rows.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='append_new_columns'
) }}`,
    dbtAction: "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR → then proceeds with normal INSERT.",
    snowflakeSql: "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR;\nINSERT INTO mart_events\nSELECT event_id, loan_id, event_type, created_at, device_type\nFROM staging;",
  },
  {
    id: "sync_all_columns",
    label: "sync_all_columns",
    color: "#4ade80",
    emoji: "🔄",
    isDefault: false,
    desc: "Full column sync — adds new columns AND drops removed ones. Target mirrors source exactly.",
    behavior: "device_type added + created_at removed from source → both changes reflected in mart_events.",
    when: "Source schema is the single source of truth. You want target to always mirror it exactly. Destructive — use carefully.",
    sql: `{{ config(
  materialized='incremental',
  on_schema_change='sync_all_columns'
) }}`,
    dbtAction: "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR; ALTER TABLE mart_events DROP COLUMN created_at;",
    snowflakeSql: "ALTER TABLE mart_events ADD COLUMN device_type VARCHAR;\nALTER TABLE mart_events DROP COLUMN created_at;\nINSERT INTO mart_events\nSELECT event_id, loan_id, event_type, device_type FROM staging;",
  },
];

// The real-world scenario: mart_events for a loan product
// Before: event_id, loan_id, event_type, created_at
// Change: upstream adds "device_type", and (for sync) removes "created_at"

const ROWS_BEFORE = [
  { event_id: "EVT-001", loan_id: "LN-100", event_type: "disbursed",  created_at: "2024-01-01" },
  { event_id: "EVT-002", loan_id: "LN-101", event_type: "repayment",  created_at: "2024-01-02" },
  { event_id: "EVT-003", loan_id: "LN-102", event_type: "defaulted",  created_at: "2024-01-03" },
];
const ROWS_NEW = [
  { event_id: "EVT-004", loan_id: "LN-103", event_type: "disbursed",  created_at: "2024-01-04", device_type: "smartphone" },
  { event_id: "EVT-005", loan_id: "LN-104", event_type: "repayment",  created_at: "2024-01-05", device_type: "feature_phone" },
];

function ColPill({ label, status }) {
  // status: "existing" | "new" | "dropped" | "missing"
  const styles = {
    existing: { bg: "rgba(255,255,255,0.04)", border: "#1e293b", color: "#64748b" },
    new:      { bg: "rgba(74,222,128,0.1)",   border: "#4ade8055", color: "#4ade80" },
    dropped:  { bg: "rgba(239,68,68,0.08)",   border: "#ef444455", color: "#ef4444" },
    missing:  { bg: "rgba(255,255,255,0.02)", border: "#1e293b44", color: "#1e3a2a" },
  };
  const s = styles[status] || styles.existing;
  return (
    <span style={{
      fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "2px 8px",
      borderRadius: 5, background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      textDecoration: status === "dropped" ? "line-through" : "none",
    }}>
      {label}{status === "new" && " ✦"}{status === "dropped" && " ✕"}
    </span>
  );
}

function DataTable({ title, cols, rows, highlightCol, showNullCol, nullColLabel, borderColor }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace", marginBottom: 5, letterSpacing: 0.5 }}>{title}</div>
      <div style={{
        background: "rgba(4,9,20,0.95)", borderRadius: 8, overflow: "hidden",
        border: `1px solid ${borderColor || "rgba(255,255,255,0.08)"}`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "5px 10px", gap: 0 }}>
          {cols.map(c => (
            <span key={c.key} style={{
              fontSize: 9, fontFamily: "monospace", letterSpacing: 0.5, textTransform: "uppercase",
              color: c.isNew ? "#4ade80" : c.isDropped ? "#ef4444" : "#334155",
              flex: c.flex || 1, minWidth: c.minW || 60,
              textDecoration: c.isDropped ? "line-through" : "none",
            }}>{c.label}{c.isNew ? " ✦" : ""}</span>
          ))}
        </div>
        {/* Rows */}
        {rows.map((row, ri) => (
          <div key={ri} style={{
            display: "flex", padding: "5px 10px", gap: 0,
            borderBottom: ri < rows.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
            background: row._isNew ? "rgba(74,222,128,0.04)" : "transparent",
          }}>
            {cols.map(c => {
              const val = row[c.key];
              const isNull = val === null || val === undefined;
              const isNewCol = c.isNew;
              const isDropped = c.isDropped;
              return (
                <span key={c.key} style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: isNull ? "#1e3a2a" : isNewCol && !isNull ? "#4ade80" : isDropped ? "#ef444466" : row._isNew ? "#94a3b8" : "#475569",
                  flex: c.flex || 1, minWidth: c.minW || 60,
                  fontStyle: isNull ? "italic" : "normal",
                }}>
                  {isNull ? "NULL" : val}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemaExampleViz({ option }) {
  const BASE_COLS = [
    { key: "event_id",   label: "event_id",   minW: 70, flex: 1 },
    { key: "loan_id",    label: "loan_id",     minW: 60, flex: 1 },
    { key: "event_type", label: "event_type",  minW: 72, flex: 1 },
    { key: "created_at", label: "created_at",  minW: 68, flex: 1 },
  ];

  // Source schema — always has device_type added; sync_all_columns also drops created_at
  const srcCols = option === "sync_all_columns"
    ? [...BASE_COLS.filter(c => c.key !== "created_at"), { key: "device_type", label: "device_type", minW: 80, flex: 1, isNew: true }]
    : [...BASE_COLS, { key: "device_type", label: "device_type", minW: 80, flex: 1, isNew: true }];

  const srcRows = [
    ...ROWS_BEFORE.map(r => option === "sync_all_columns" ? { ...r, created_at: undefined, device_type: "smartphone" } : { ...r, device_type: "smartphone" }),
    ...ROWS_NEW.map(r => ({ ...r, _isNew: true, ...(option === "sync_all_columns" ? { created_at: undefined } : {}) })),
  ];

  // Target schema + rows after run
  let targetCols, targetRows, borderColor, actionLabel;

  if (option === "ignore") {
    targetCols = BASE_COLS; // unchanged — device_type never added
    targetRows = [
      ...ROWS_BEFORE,
      ...ROWS_NEW.map(r => ({ event_id: r.event_id, loan_id: r.loan_id, event_type: r.event_type, created_at: r.created_at, _isNew: true })),
    ];
    borderColor = "rgba(148,163,184,0.2)";
    actionLabel = "device_type silently dropped from INSERT — column never appears in target";
  } else if (option === "fail") {
    targetCols = BASE_COLS;
    targetRows = ROWS_BEFORE; // nothing new written
    borderColor = "rgba(239,68,68,0.3)";
    actionLabel = null; // show error state
  } else if (option === "append_new_columns") {
    targetCols = [...BASE_COLS, { key: "device_type", label: "device_type", minW: 80, flex: 1, isNew: true }];
    targetRows = [
      ...ROWS_BEFORE.map(r => ({ ...r, device_type: null })), // old rows get NULL
      ...ROWS_NEW.map(r => ({ ...r, _isNew: true })),
    ];
    borderColor = "rgba(251,146,60,0.3)";
    actionLabel = "ALTER TABLE adds device_type → old rows backfilled with NULL";
  } else { // sync_all_columns
    targetCols = [
      ...BASE_COLS.map(c => c.key === "created_at" ? { ...c, isDropped: true } : c),
      { key: "device_type", label: "device_type", minW: 80, flex: 1, isNew: true },
    ];
    targetRows = [
      ...ROWS_BEFORE.map(r => ({ ...r, created_at: undefined, device_type: null })),
      ...ROWS_NEW.map(r => ({ ...r, _isNew: true, created_at: undefined })),
    ];
    borderColor = "rgba(74,222,128,0.3)";
    actionLabel = "ALTER TABLE adds device_type + DROP COLUMN created_at — historical data lost!";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
      {/* Source table */}
      <DataTable
        title="RAW.EVENTS — source (new schema, 5 rows)"
        cols={srcCols}
        rows={srcRows}
        borderColor="rgba(255,255,255,0.08)"
      />

      {/* Arrow + action label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px" }}>
        <div style={{ flex: 1, height: 1, background: option === "fail" ? "#ef444433" : "rgba(255,255,255,0.06)" }} />
        <div style={{
          fontSize: 9, fontFamily: "monospace", color: option === "fail" ? "#ef4444" : option === "append_new_columns" ? "#fb923c" : option === "sync_all_columns" ? "#4ade80" : "#475569",
          textAlign: "center", maxWidth: 320, lineHeight: 1.5,
        }}>
          {option === "fail" ? "💥 RuntimeError: Schema mismatch detected. Run aborted." : `⚙️ ${actionLabel}`}
        </div>
        <div style={{ flex: 1, height: 1, background: option === "fail" ? "#ef444433" : "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Target table */}
      {option === "fail" ? (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>🚫</div>
          <div style={{ fontSize: 12, color: "#fca5a5", fontFamily: "monospace", marginBottom: 4 }}>dbt run FAILED — no data written</div>
          <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>mart_events still has only the original 3 rows.<br />Fix: run <code style={{ color: "#fb923c" }}>dbt run --full-refresh</code> to intentionally rebuild.</div>
        </div>
      ) : (
        <DataTable
          title={`MART.EVENTS — after incremental run (${targetRows.length} rows)`}
          cols={targetCols}
          rows={targetRows}
          borderColor={borderColor}
        />
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          ["#64748b", "existing row"],
          ["#4ade80", "new row / new column ✦"],
          ["#1e3a2a", "NULL (no value)"],
          ...(option === "sync_all_columns" ? [["#ef4444", "dropped column"]] : []),
        ].map(([c, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 9, color: "#334155", fontFamily: "monospace" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemaChangeSlide() {
  const [selected, setSelected] = useState("ignore");
  const opt = schemaOptions.find(o => o.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 560, lineHeight: 1.6, fontSize: 13, margin: 0 }}>
        What happens when a column is added or removed from your source? By default dbt{" "}
        <strong style={{ color: "#fb923c" }}>silently ignores it</strong>. Use{" "}
        <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#4ade80" }}>on_schema_change</code> to control the behaviour.
      </p>

      {/* Scenario */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(41,182,246,0.06)", border: "1px solid rgba(41,182,246,0.2)", borderRadius: 10, padding: "12px 16px", width: "100%", maxWidth: 660 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📋</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#29b6f6", fontFamily: "monospace", marginBottom: 6 }}>THE SCENARIO</div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
            <code style={{ color: "#e2e8f0" }}>mart_events</code> currently has <strong style={{ color: "#f1f5f9" }}>4 columns</strong>:{" "}
            {["event_id", "loan_id", "event_type", "created_at"].map(c => (
              <code key={c} style={{ background: "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: 4, color: "#94a3b8", marginRight: 4, fontSize: 11 }}>{c}</code>
            ))}
            <br />
            The upstream engineering team <strong style={{ color: "#fb923c" }}>adds a new column</strong>{" "}
            <code style={{ background: "rgba(251,146,60,0.12)", padding: "1px 6px", borderRadius: 4, color: "#fb923c" }}>device_type</code>{" "}
            to the source table to track whether a loan was taken on a smartphone or feature phone.{" "}
            <strong style={{ color: "#f1f5f9" }}>What does dbt do on the next incremental run?</strong>
          </div>
        </div>
      </div>

      {/* Option selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {schemaOptions.map(o => (
          <button key={o.id} onClick={() => setSelected(o.id)} style={{
            padding: "6px 13px", borderRadius: 8, fontSize: 11, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s",
            border: `1px solid ${selected === o.id ? o.color : "rgba(255,255,255,0.1)"}`,
            background: selected === o.id ? `${o.color}18` : "transparent",
            color: selected === o.id ? o.color : "#475569",
            position: "relative",
          }}>
            {o.emoji} {o.label}
            {o.isDefault && <span style={{ position: "absolute", top: -7, right: -3, background: "#94a3b8", color: "#0f172a", fontSize: 7, fontWeight: 800, padding: "1px 5px", borderRadius: 10, fontFamily: "monospace" }}>DEFAULT</span>}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ background: "rgba(12,18,36,0.95)", border: `1px solid ${opt.color}33`, borderRadius: 12, padding: "16px 18px", width: "100%", maxWidth: 700, transition: "border-color 0.3s" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>{opt.emoji}</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: opt.color, fontFamily: "'Syne', sans-serif" }}>{opt.label}</span>
          {opt.isDefault && <span style={{ fontSize: 8, background: opt.color + "33", color: opt.color, border: `1px solid ${opt.color}44`, padding: "2px 7px", borderRadius: 10, fontFamily: "monospace", fontWeight: 700 }}>DEFAULT</span>}
        </div>

        <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{opt.desc}</p>

        {/* What happens / when to use */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div style={{ background: "rgba(41,182,246,0.05)", border: "1px solid rgba(41,182,246,0.14)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 9, color: "#29b6f6", fontFamily: "monospace", marginBottom: 3, letterSpacing: 0.5 }}>📐 WHAT HAPPENS</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{opt.behavior}</div>
          </div>
          <div style={{ background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.14)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 9, color: "#fb923c", fontFamily: "monospace", marginBottom: 3, letterSpacing: 0.5 }}>🧠 WHEN TO USE</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{opt.when}</div>
          </div>
        </div>

        {/* Config + Snowflake SQL side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>DBT CONFIG</div>
            <div style={{ background: "rgba(4,9,20,0.9)", borderRadius: 8, padding: "8px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, height: "100%" }}>
              {opt.sql.split("\n").map((line, i) => (
                <div key={i} style={{ color: line.trim().startsWith("--") ? "#334155" : line.includes("on_schema_change") ? opt.color : line.includes("'incremental'") ? "#4ade80" : "#e2e8f0", whiteSpace: "pre" }}>{line || " "}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginBottom: 4, letterSpacing: 0.5 }}>❄️ SNOWFLAKE RUNS</div>
            <div style={{ background: "rgba(41,182,246,0.04)", border: "1px solid rgba(41,182,246,0.12)", borderRadius: 8, padding: "8px 10px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, height: "100%" }}>
              {opt.snowflakeSql.split("\n").map((line, i) => (
                <div key={i} style={{ color: line.trim().startsWith("--") ? "#334155" : line.startsWith("ALTER") ? opt.color : line.startsWith("INSERT") || line.startsWith("SELECT") ? "#7dd3fc" : "#94a3b8", whiteSpace: "pre" }}>{line || " "}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Live example tables */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
          <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", marginBottom: 2, letterSpacing: 0.5 }}>LIVE EXAMPLE — mart_events (loan events table)</div>
          <SchemaExampleViz option={opt.id} />
        </div>
      </div>

      {/* Full-refresh tip */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 10, padding: "10px 14px", width: "100%", maxWidth: 660 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          <strong style={{ color: "#4ade80" }}>Nuclear option:</strong> run{" "}
          <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, color: "#fb923c", fontSize: 11 }}>dbt run --full-refresh</code>{" "}
          to drop and rebuild the model entirely — the safest way to handle any schema change, regardless of the <code style={{ color: "#4ade80", fontSize: 11 }}>on_schema_change</code> setting. Especially important with <strong style={{ color: "#94a3b8" }}>sync_all_columns</strong> where dropped columns mean permanent data loss.
        </div>
      </div>
    </div>
  );
}



const questions = [
  {
    q: "What does is_incremental() return on the very first run of a model?",
    options: ["TRUE — it always filters for new rows", "FALSE — it loads all rows", "An error", "NULL"],
    answer: 1,
    explain: "On the first run the target table doesn't exist yet, so is_incremental() returns FALSE and dbt does a full load.",
  },
  {
    q: "You have an orders table on Snowflake where order_status can change (e.g. pending → shipped). Which strategy is most appropriate?",
    options: ["append", "delete+insert", "merge", "insert_overwrite"],
    answer: 2,
    explain: "merge is the right call — and it's Snowflake's default when unique_key is set. It uses a SQL MERGE statement to UPDATE matching rows and INSERT new ones. insert_overwrite is not supported on Snowflake.",
  },
  {
    q: "What does {{ this }} refer to in a dbt model?",
    options: ["The source table", "The current model's target table", "The dbt project", "The Jinja context"],
    answer: 1,
    explain: "{{ this }} resolves to the fully-qualified name of the model being built (e.g. analytics.mart_events).",
  },
  {
    q: "Which command forces a full rebuild of an incremental model?",
    options: ["dbt run --reload", "dbt run --full-refresh", "dbt rebuild", "dbt run --drop-table"],
    answer: 1,
    explain: "--full-refresh makes is_incremental() return FALSE, so the model drops and rebuilds the whole table.",
  },
];

function QuizSlide() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560, margin: "0 auto" }}>
      {!submitted ? (
        <>
          {questions.map((q, qi) => (
            <div key={qi} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, lineHeight: 1.5 }}>
                <span style={{ color: "#475569", fontFamily: "monospace", marginRight: 6 }}>Q{qi + 1}.</span>{q.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, oi) => (
                  <label key={oi} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 10px", borderRadius: 6, border: `1px solid ${answers[qi] === oi ? "#4ade8055" : "transparent"}`, background: answers[qi] === oi ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)", transition: "all 0.15s" }}>
                    <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} onChange={() => setAnswers({ ...answers, [qi]: oi })} style={{ accentColor: "#4ade80" }} />
                    <span style={{ fontSize: 12, color: "#cbd5e1" }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            style={{
              padding: "12px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.4)",
              background: Object.keys(answers).length < questions.length ? "rgba(255,255,255,0.04)" : "rgba(74,222,128,0.15)",
              color: Object.keys(answers).length < questions.length ? "#475569" : "#4ade80",
              fontWeight: 700, cursor: Object.keys(answers).length < questions.length ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, transition: "all 0.2s",
            }}
          >
            {Object.keys(answers).length < questions.length ? `Answer all questions (${Object.keys(answers).length}/${questions.length})` : "Submit Answers →"}
          </button>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{score === 4 ? "🏆" : score >= 3 ? "🎉" : score >= 2 ? "📚" : "🔄"}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
              {score}/4 correct
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              {score === 4 ? "Perfect! You're incremental-ready." : score >= 3 ? "Great job! Review the one you missed." : "Keep going — re-read the slides and try again."}
            </div>
          </div>
          {questions.map((q, qi) => {
            const correct = answers[qi] === q.answer;
            return (
              <div key={qi} style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${correct ? "#4ade8033" : "#ef444433"}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: correct ? "#4ade80" : "#f87171", fontFamily: "monospace", marginBottom: 4 }}>{correct ? "✓ Correct" : "✗ Incorrect"} — Q{qi + 1}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{q.explain}</div>
              </div>
            );
          })}
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{
            padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#64748b", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          }}>↩ Try Again</button>
        </div>
      )}
    </div>
  );
}


const INCREMENTAL_STEPS = [
  { id: "intro",       title: "What's the Problem?" },
  { id: "fullrefresh", title: "Full Refresh" },
  { id: "incremental", title: "Incremental Models" },
  { id: "macro",       title: "The is_incremental() Macro" },
  { id: "strategies",  title: "Strategies" },
  { id: "schema",      title: "Handling Schema Changes" },
  { id: "quiz",        title: "Test Your Knowledge" },
];

// ─── INCREMENTAL COURSE WRAPPER ───────────────────────────────────────────
function IncrementalCourse() {
  const [step, setStep] = useState(0);
  const slides = [IntroSlide, FullRefreshSlide, IncrementalSlide, MacroSlide, StrategiesSlide, SchemaChangeSlide, QuizSlide];
  const SlideComponent = slides[step];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", gap:4, marginBottom:14, flexWrap:"wrap" }}>
        {INCREMENTAL_STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)} style={{
            padding:"4px 10px", borderRadius:20, fontSize:10, cursor:"pointer",
            fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s",
            border:`1px solid ${step===i ? T.orange : "rgba(255,255,255,0.08)"}`,
            background:step===i ? `${T.orange}18` : "transparent",
            color:step===i ? T.orange : T.grey,
          }}>{i+1}. {s.title}</button>
        ))}
      </div>
      <div><SlideComponent /></div>
      <div style={{ display:"flex", justifyContent:"center", gap:10, paddingTop:16 }}>
        <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0} style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", color:step===0?T.slate:T.grey, cursor:step===0?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(INCREMENTAL_STEPS.length-1, s+1))} disabled={step===INCREMENTAL_STEPS.length-1} style={{ padding:"7px 20px", borderRadius:8, border:`1px solid ${T.orange}44`, background:step===INCREMENTAL_STEPS.length-1?"transparent":`${T.orange}14`, color:step===INCREMENTAL_STEPS.length-1?T.slate:T.orange, cursor:step===INCREMENTAL_STEPS.length-1?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700 }}>Next →</button>
      </div>
    </div>
  );
}

// ─── COURSE ROUTER ────────────────────────────────────────────────────────
const COURSE_COMPONENTS = {
  fundamentals: FundamentalsSlides,
  jinja:        JinjaSlides,
  incremental:  IncrementalCourse,
  snapshots:    SnapshotsSlides,
  seeds:        SeedsSlides,
  exposures:    ExposuresSlides,
  state:        StateSlides,
  retry:        RetrySlides,
  mesh:         MeshSlides,
  testing:      TestingSlides,
  deployment:   DeploymentSlides,
  clone:        CloneSlides,
  grants:       GrantsSlides,
  python:       PythonSlides,
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]         = useState("home");
  const [activeCourse, setActiveCourse] = useState(null);

  const openCourse = (id) => { setActiveCourse(id); setView("course"); };
  const goHome     = ()   => { setView("home"); setActiveCourse(null); };

  const course          = COURSES.find(c => c.id === activeCourse);
  const CourseComponent = activeCourse ? COURSE_COMPONENTS[activeCourse] : null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {view === "home" ? (
        <CourseCatalog onSelect={openCourse} />
      ) : (
        <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 10% 0%, #0c1525 0%, ${T.ink} 65%)`, color:"#f1f5f9", fontFamily:"'Onest',sans-serif", display:"flex", flexDirection:"column" }}>

          {/* Header */}
          <div style={{ padding:"12px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:12, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:10 }}>
            <button onClick={goHome} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:8, border:`1px solid ${T.slate}`, background:"rgba(255,255,255,0.04)", color:T.grey, fontSize:11, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", transition:"all 0.18s" }}>← All Courses</button>
            <div style={{ width:1, height:18, background:T.slate }} />
            <div style={{ width:28, height:28, borderRadius:8, background:`${course?.color}15`, border:`1px solid ${course?.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{course?.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", fontFamily:"'Bricolage Grotesque',sans-serif" }}>{course?.title}</div>
              <div style={{ fontSize:10, color:T.greyDark, fontFamily:"monospace" }}>{course?.subtitle}</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
              <Tag label={course?.difficulty} color={DIFF_COLOR[course?.difficulty]} />
              <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:"rgba(255,255,255,0.04)", color:T.greyDark, border:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace" }}>⏱ {course?.duration}</span>
            </div>
          </div>

          {/* Course title */}
          <div style={{ textAlign:"center", padding:"24px 20px 12px", borderBottom:`1px solid ${T.slate}30`, background:`linear-gradient(to bottom, ${course?.color}08, transparent)` }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{course?.icon}</div>
            <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:26, fontWeight:800, margin:0, letterSpacing:-0.5, color:"#f1f5f9" }}>{course?.title}</h1>
            <div style={{ fontSize:13, color:T.grey, marginTop:4 }}>{course?.subtitle}</div>
          </div>

          {/* Content */}
          <div style={{ flex:1, padding:"16px 24px 40px", maxWidth:800, margin:"0 auto", width:"100%" }}>
            {CourseComponent && <CourseComponent />}
          </div>
        </div>
      )}
    </>
  );
}