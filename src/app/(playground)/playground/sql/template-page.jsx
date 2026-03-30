"use client"

import { useState, useEffect, useRef, useCallback } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  bg:"#07090f", surface:"#0d1220", card:"#111827", raised:"#141d2e",
  slate:"#1e293b", slateLight:"#273548",
  greyDark:"#334155", grey:"#64748b", greyLight:"#94a3b8", white:"#f1f5f9",
  green:"#4ade80", yellow:"#facc15", orange:"#fb923c",
  red:"#f87171", blue:"#60a5fa", purple:"#c084fc", pink:"#f472b6",
  teal:"#2dd4bf", cyan:"#22d3ee", indigo:"#818cf8",
};
const PLAT = {
  mysql:    {id:"mysql",    label:"MySQL",     icon:"🐬",color:"#f59e0b",border:"rgba(245,158,11,0.3)", bg:"rgba(245,158,11,0.07)"},
  postgres: {id:"postgres", label:"PostgreSQL",icon:"🐘",color:"#3b82f6",border:"rgba(59,130,246,0.3)",  bg:"rgba(59,130,246,0.07)"},
  sqlserver:{id:"sqlserver",label:"SQL Server",icon:"🪟",color:"#e84c3d",border:"rgba(232,76,61,0.3)",   bg:"rgba(232,76,61,0.07)"},
};
const GS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#07090f;color:#f1f5f9;font-family:'DM Sans',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes rowFlash{0%{background:rgba(250,204,21,.25)}100%{background:transparent}}
@keyframes rowAppear{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@keyframes collapse{from{max-height:300px}to{max-height:36px}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EMP=[
  {id:1,name:"Amara Osei",    dept:"Engineering",salary:85000,hired:2021,mgr_id:null,active:1,city:"Accra"},
  {id:2,name:"Bola Adeyemi",  dept:"Analytics",  salary:72000,hired:2020,mgr_id:1,  active:1,city:"Lagos"},
  {id:3,name:"Chidi Nwosu",   dept:"Engineering",salary:91000,hired:2019,mgr_id:1,  active:1,city:"Accra"},
  {id:4,name:"Dami Afolabi",  dept:"Product",    salary:68000,hired:2022,mgr_id:null,active:0,city:"Lagos"},
  {id:5,name:"Efe Okonkwo",   dept:"Analytics",  salary:75000,hired:2021,mgr_id:2,  active:1,city:"Abuja"},
  {id:6,name:"Funke Balogun", dept:"Engineering",salary:88000,hired:2020,mgr_id:1,  active:1,city:"Lagos"},
  {id:7,name:"Grace Mensah",  dept:"Product",    salary:71000,hired:2022,mgr_id:null,active:1,city:"Accra"},
  {id:8,name:"Henry Eze",     dept:"Analytics",  salary:69000,hired:2023,mgr_id:2,  active:1,city:"Abuja"},
  {id:9,name:"Ifeoma Nwosu",  dept:"Engineering",salary:93000,hired:2018,mgr_id:null,active:1,city:"Lagos"},
  {id:10,name:"Jide Okafor",  dept:"Product",    salary:65000,hired:2023,mgr_id:null,active:1,city:"Lagos"},
];
const ORDERS=[
  {order_id:1,cust_id:101,product:"Laptop", amount:1200,status:"completed",order_date:"2024-01-15"},
  {order_id:2,cust_id:102,product:"Phone",  amount:450, status:"completed",order_date:"2024-01-22"},
  {order_id:3,cust_id:101,product:"Tablet", amount:850, status:"pending",  order_date:"2024-02-03"},
  {order_id:4,cust_id:103,product:"Monitor",amount:320, status:"cancelled",order_date:"2024-02-10"},
  {order_id:5,cust_id:104,product:"Laptop", amount:1200,status:"completed",order_date:"2024-02-18"},
  {order_id:6,cust_id:null,product:"Phone", amount:450, status:"completed",order_date:"2024-03-01"},
];
const CUSTS=[
  {cust_id:101,name:"Ifeoma N.",   city:"Lagos",  tier:"Gold"},
  {cust_id:102,name:"James Obi",   city:"Accra",  tier:"Silver"},
  {cust_id:103,name:"Kechi Onu",   city:"Nairobi",tier:"Bronze"},
  {cust_id:104,name:"Leke Fadipe", city:"Lagos",  tier:"Gold"},
  {cust_id:105,name:"Mimi Adaeze", city:"Accra",  tier:"Silver"},
];

const GC={
  Engineering:{bg:"rgba(96,165,250,.12)",border:"rgba(96,165,250,.4)",text:T.blue},
  Analytics:  {bg:"rgba(74,222,128,.10)",border:"rgba(74,222,128,.4)",text:T.green},
  Product:    {bg:"rgba(192,132,252,.10)",border:"rgba(192,132,252,.4)",text:T.purple},
  "2018":{bg:"rgba(251,146,60,.10)", border:"rgba(251,146,60,.4)",  text:T.orange},
  "2019":{bg:"rgba(74,222,128,.10)", border:"rgba(74,222,128,.4)",  text:T.green},
  "2020":{bg:"rgba(96,165,250,.12)", border:"rgba(96,165,250,.4)",  text:T.blue},
  "2021":{bg:"rgba(192,132,252,.10)",border:"rgba(192,132,252,.4)", text:T.purple},
  "2022":{bg:"rgba(250,204,21,.10)", border:"rgba(250,204,21,.4)",  text:T.yellow},
  "2023":{bg:"rgba(45,212,191,.10)", border:"rgba(45,212,191,.4)",  text:T.teal},
  "0":  {bg:"rgba(248,113,113,.08)",border:"rgba(248,113,113,.3)", text:T.red},
  "1":  {bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.3)",  text:T.green},
  "101":{bg:"rgba(96,165,250,.12)", border:"rgba(96,165,250,.4)",  text:T.blue},
  "102":{bg:"rgba(74,222,128,.10)", border:"rgba(74,222,128,.4)",  text:T.green},
  "103":{bg:"rgba(251,146,60,.10)", border:"rgba(251,146,60,.4)",  text:T.orange},
  "104":{bg:"rgba(192,132,252,.10)",border:"rgba(192,132,252,.4)", text:T.purple},
  "105":{bg:"rgba(45,212,191,.10)", border:"rgba(45,212,191,.4)",  text:T.teal},
  "null":{bg:"rgba(248,113,113,.06)",border:"rgba(248,113,113,.2)",text:T.red},
};
const gc=k=>GC[String(k)]||{bg:"rgba(255,255,255,.04)",border:"rgba(255,255,255,.15)",text:T.greyLight};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function SQLBlock({code,platform,label}){
  const pc=PLAT[platform]?.color||T.cyan;
  const kws=["SELECT","FROM","WHERE","GROUP BY","HAVING","ORDER BY","LIMIT","TOP","OFFSET","FETCH NEXT","ROWS ONLY","JOIN","INNER JOIN","LEFT JOIN","LEFT OUTER JOIN","RIGHT JOIN","FULL OUTER JOIN","CROSS JOIN","ON","AND","OR","NOT","IN","NOT IN","BETWEEN","LIKE","IS NULL","IS NOT NULL","AS","DISTINCT","WITH","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","TRUNCATE","CREATE","VIEW","INDEX","OVER","PARTITION BY","ROW_NUMBER","RANK","DENSE_RANK","LAG","LEAD","NTILE","SUM","COUNT","AVG","MIN","MAX","COALESCE","ISNULL","IFNULL","NULLIF","CASE","WHEN","THEN","ELSE","END","NULL","TRUE","FALSE","ASC","DESC","UNION","UNION ALL","INTERSECT","EXCEPT","BEGIN","COMMIT","ROLLBACK","SAVEPOINT","OUTPUT","RETURNING","EXPLAIN","CAST","CONVERT","FORMAT","CONCAT","REPLACE","TRIM","UPPER","LOWER","SUBSTRING","LENGTH","LEN","ROUND","FLOOR","CEIL","CEILING","ABS","YEAR","MONTH","DAY","NOW","GETDATE","CURRENT_DATE","DATE_FORMAT","TO_CHAR","DATEDIFF","DATEADD","DATE_ADD","INTERVAL"];
  return(
    <div style={{background:"rgba(4,9,20,.95)",border:`1px solid ${pc}22`,borderRadius:8,padding:"10px 14px",overflowX:"auto"}}>
      {(PLAT[platform]||label)&&<div style={{fontSize:8,color:pc,fontFamily:"monospace",marginBottom:5,letterSpacing:.5}}>{PLAT[platform]?.icon} {label||PLAT[platform]?.label}</div>}
      <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
        {(code||"").split("\n").map((line,i)=>{
          if(line.trim().startsWith("--"))return <div key={i} style={{color:T.greyDark}}>{line||" "}</div>;
          const parts=line.split(/\b/);
          return <div key={i}>{parts.map((p,j)=>{const u=p.trim().toUpperCase();return <span key={j} style={{color:kws.includes(u)?pc:p.match(/^'[^']*'$/)?T.green:p.match(/^\d+(\.\d+)?$/)?T.purple:T.white}}>{p}</span>;})}</div>;
        })}
      </pre>
    </div>
  );
}
function PlatformTabs({mysql,postgres,sqlserver,platform:init}){
  const [a,setA]=useState(init||"mysql");
  useEffect(()=>{if(init)setA(init);},[init]);
  return(
    <div>
      <div style={{display:"flex",gap:4,marginBottom:6}}>
        {Object.values(PLAT).map(p=><button key={p.id} onClick={()=>setA(p.id)} style={{padding:"3px 10px",borderRadius:14,fontSize:9,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${a===p.id?p.color:"rgba(255,255,255,.08)"}`,background:a===p.id?p.bg:"transparent",color:a===p.id?p.color:T.grey,transition:"all .2s"}}>{p.icon} {p.label}</button>)}
      </div>
      <SQLBlock code={{mysql,postgres,sqlserver}[a]} platform={a}/>
    </div>
  );
}
function PlatformDiff({title,diffs}){
  return(
    <div style={{border:`1px solid ${T.slate}`,borderRadius:10,overflow:"hidden"}}>
      <div style={{padding:"6px 14px",background:T.surface,borderBottom:`1px solid ${T.slate}`,fontSize:9,color:T.grey,fontFamily:"monospace",letterSpacing:.8,fontWeight:700}}>🔀 PLATFORM DIFFERENCE: {title}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        {diffs.map((d,i)=>(
          <div key={i} style={{borderRight:i<2?`1px solid ${T.slate}`:undefined,padding:"10px 12px",background:T.bg}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}><span style={{fontSize:12}}>{PLAT[d.platform].icon}</span><span style={{fontSize:10,color:PLAT[d.platform].color,fontFamily:"monospace",fontWeight:700}}>{PLAT[d.platform].label}</span></div>
            <SQLBlock code={d.code} platform={d.platform}/>
            {d.note&&<div style={{fontSize:10,color:T.grey,marginTop:5,lineHeight:1.5}}>{d.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
function Note({children,color=T.cyan}){return <div style={{background:`${color}10`,border:`1px solid ${color}30`,borderRadius:10,padding:"10px 14px",fontSize:12,color:T.greyLight,lineHeight:1.75}}>{children}</div>;}
function Tip({icon="💡",title,children,color=T.yellow}){return(
  <div style={{background:`${color}09`,border:`1px solid ${color}28`,borderRadius:10,padding:"10px 14px"}}>
    <div style={{fontSize:10,fontWeight:700,color,fontFamily:"monospace",letterSpacing:.5,marginBottom:5}}>{icon} {title}</div>
    <div style={{fontSize:11,color:T.greyLight,lineHeight:1.7}}>{children}</div>
  </div>
);}
function Warn({children}){return <div style={{background:"rgba(248,113,113,.07)",border:"1px solid rgba(248,113,113,.25)",borderRadius:10,padding:"10px 14px",fontSize:12,color:T.greyLight,lineHeight:1.7}}><span style={{color:T.red,fontWeight:700,fontFamily:"monospace",marginRight:6}}>⚠️ GOTCHA:</span>{children}</div>;}
function SLabel({children,color=T.greyDark}){return <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color,letterSpacing:1.2,fontWeight:700,textTransform:"uppercase",marginBottom:7}}>{children}</div>;}
function DiffBadge({diff}){const d={easy:{color:T.green,bg:"rgba(74,222,128,.1)",label:"Beginner"},mid:{color:T.yellow,bg:"rgba(250,204,21,.1)",label:"Intermediate"},hard:{color:T.red,bg:"rgba(248,113,113,.1)",label:"Advanced"}};const s=d[diff]||d.easy;return <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:s.bg,color:s.color,fontWeight:700,fontFamily:"monospace"}}>{s.label}</span>;}

function Hint({children,icon="👆"}){return(<div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px dashed rgba(255,255,255,.15)",fontSize:11,color:T.greyLight}}><span style={{fontSize:14,flexShrink:0}}>{icon}</span><span style={{lineHeight:1.5}}>{children}</span></div>);}
function Quiz({questions,color}){
  const [ans,setAns]=useState({});
  const [sub,setSub]=useState(false);
  const [score,setScore]=useState(null);
  const submit=()=>{let c=0;questions.forEach((q,i)=>{if(ans[i]===q.correct)c++;});setScore(c);setSub(true);};
  const reset=()=>{setAns({});setSub(false);setScore(null);};
  const all=questions.every((_,i)=>ans[i]!==undefined);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Note color={color}><strong style={{color}}>Module Quiz</strong> — {questions.length} questions. See explanations for every answer after submitting.</Note>
      {questions.map((q,qi)=>{
        const cor=ans[qi]===q.correct;
        return(
          <div key={qi} style={{background:T.surface,border:`1px solid ${sub?cor?T.green:T.red+"44":T.slate}`,borderRadius:10,padding:"14px 16px",transition:"border .3s"}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:11,fontWeight:700,color:sub?cor?T.green:T.red:T.greyDark,fontFamily:"monospace",flexShrink:0}}>Q{qi+1}</span>
              {q.type==="bug"&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:8,background:"rgba(248,113,113,.12)",color:T.red,fontFamily:"monospace",flexShrink:0}}>spot the bug</span>}
              <div style={{fontSize:12,color:T.white,lineHeight:1.6}}>{q.question}</div>
            </div>
            {q.code&&<div style={{marginBottom:10}}><SQLBlock code={q.code} label="SQL"/></div>}
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {q.options.map((opt,oi)=>{
                let bc=T.slate,bg="rgba(255,255,255,.02)",tc=T.greyLight;
                if(sub){if(oi===q.correct){bc=T.green+"66";bg="rgba(74,222,128,.1)";tc=T.green;}else if(ans[qi]===oi){bc=T.red+"66";bg="rgba(248,113,113,.1)";tc=T.red;}}
                else if(ans[qi]===oi){bc=color+"66";bg=`${color}12`;tc=color;}
                return(
                  <div key={oi} onClick={()=>!sub&&setAns(p=>({...p,[qi]:oi}))} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 12px",borderRadius:8,border:`1px solid ${bc}`,background:bg,cursor:sub?"default":"pointer",transition:"all .2s"}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${bc}`,background:ans[qi]===oi&&!sub?color:oi===q.correct&&sub?T.green:ans[qi]===oi&&sub?T.red:"transparent",flexShrink:0,marginTop:1,transition:"all .2s"}}/>
                    <span style={{fontSize:11,color:tc,lineHeight:1.55}}>{opt}</span>
                    {sub&&oi===q.correct&&<span style={{marginLeft:"auto",fontSize:10,color:T.green,flexShrink:0}}>✓</span>}
                    {sub&&ans[qi]===oi&&oi!==q.correct&&<span style={{marginLeft:"auto",fontSize:10,color:T.red,flexShrink:0}}>✗</span>}
                  </div>
                );
              })}
            </div>
            {sub&&<div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:cor?"rgba(74,222,128,.06)":"rgba(248,113,113,.06)",border:`1px solid ${cor?T.green:T.red}22`,fontSize:11,color:T.greyLight,lineHeight:1.65,animation:"popIn .25s ease"}}><strong style={{color:cor?T.green:T.orange}}>{cor?"✓ Correct!":"✗ Not quite."}</strong> {q.explanation}</div>}
          </div>
        );
      })}
      {!sub?(
        <button onClick={submit} disabled={!all} style={{padding:"9px 22px",borderRadius:9,border:`1px solid ${all?color:T.slate}44`,background:all?`${color}14`:"transparent",color:all?color:T.greyDark,fontSize:11,cursor:all?"pointer":"not-allowed",fontFamily:"monospace",fontWeight:700,alignSelf:"flex-start",transition:"all .2s"}}>
          {all?"Submit quiz →":"Answer all questions first"}
        </button>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:12,animation:"popIn .3s ease"}}>
          <div style={{padding:"10px 20px",borderRadius:10,background:`${score===questions.length?T.green:score>=questions.length/2?T.yellow:T.red}12`,border:`1px solid ${score===questions.length?T.green:score>=questions.length/2?T.yellow:T.red}33`,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:score===questions.length?T.green:score>=questions.length/2?T.yellow:T.red,fontFamily:"'Syne',sans-serif"}}>{score}/{questions.length}</div>
            <div style={{fontSize:9,color:T.grey,fontFamily:"monospace"}}>{score===questions.length?"PERFECT":"SCORE"}</div>
          </div>
          <button onClick={reset} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${T.slate}`,background:"transparent",color:T.grey,fontSize:10,cursor:"pointer",fontFamily:"monospace"}}>↩ Retry</button>
        </div>
      )}
    </div>
  );
}
function CommonMistakes({mistakes}){
  const [open,setOpen]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <Note color={T.red}>Click each bug to see wrong code, correct code, and why it happens.</Note>
      {mistakes.map((m,i)=>(
        <div key={i} style={{border:`1px solid ${open===i?"rgba(248,113,113,.4)":T.slate}`,borderRadius:9,overflow:"hidden",transition:"border .2s"}}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",background:open===i?"rgba(248,113,113,.05)":T.surface}}>
            <span style={{fontSize:14}}>🐛</span><span style={{fontSize:12,fontWeight:600,color:T.white,flex:1}}>{m.title}</span>
            <span style={{fontSize:10,color:T.grey,fontFamily:"monospace"}}>{open===i?"▾":"▸"}</span>
          </div>
          {open===i&&(
            <div style={{padding:"12px 14px",background:"rgba(4,9,20,.7)",borderTop:`1px solid ${T.slate}44`,animation:"fadeUp .2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><SLabel color={T.red}>❌ Wrong</SLabel><SQLBlock code={m.wrong} label="Bug"/></div>
                <div><SLabel color={T.green}>✅ Correct</SLabel><SQLBlock code={m.right} label="Fix"/></div>
              </div>
              <div style={{fontSize:11,color:T.greyLight,lineHeight:1.7,background:`${T.orange}09`,border:`1px solid ${T.orange}22`,borderRadius:7,padding:"8px 12px"}}><strong style={{color:T.orange}}>Why: </strong>{m.why}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
function Course({steps,color}){
  const [s,setS]=useState(0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {steps.map((st,i)=><button key={i} onClick={()=>setS(i)} style={{padding:"5px 11px",borderRadius:18,fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s",border:`1px solid ${s===i?color:"rgba(255,255,255,.08)"}`,background:s===i?`${color}18`:"rgba(255,255,255,.03)",color:s===i?color:T.grey,fontWeight:s===i?600:400}}>{i+1}. {st.title}</button>)}
      </div>
      <div key={s} style={{animation:"fadeUp .3s ease"}}>{steps[s].content()}</div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={()=>setS(p=>Math.max(0,p-1))} disabled={s===0} style={{padding:"6px 14px",borderRadius:8,fontSize:10,cursor:s===0?"not-allowed":"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:s===0?T.greyDark:T.grey}}>← Prev</button>
        <button onClick={()=>setS(p=>Math.min(steps.length-1,p+1))} disabled={s===steps.length-1} style={{padding:"6px 14px",borderRadius:8,fontSize:10,cursor:s===steps.length-1?"not-allowed":"pointer",fontFamily:"monospace",border:`1px solid ${s===steps.length-1?T.slate:color}44`,background:s===steps.length-1?"transparent":`${color}14`,color:s===steps.length-1?T.greyDark:color}}>Next →</button>
      </div>
    </div>
  );
}

// ─── MODULE 01: SELECT & FROM ─────────────────────────────────────────────────
function SelectVisual({platform}){
  const pc=PLAT[platform].color;
  const ALL_COLS=["id","name","dept","salary","hired","active","city"];
  const [cols,setCols]=useState(["id","name","dept","salary"]);
  const [orderBy,setOrderBy]=useState("none");
  const [dir,setDir]=useState("DESC");
  const [lim,setLim]=useState(0);
  const [distinct,setDistinct]=useState(false);
  const toggle=c=>setCols(p=>p.includes(c)?p.length>1?p.filter(x=>x!==c):p:[...p,c]);
  let rows=[...EMP];
  if(distinct&&cols.length===1){const s=new Set();rows=rows.filter(r=>{const v=r[cols[0]];if(s.has(v))return false;s.add(v);return true;});}
  if(orderBy!=="none")rows.sort((a,b)=>{const m=dir==="ASC"?1:-1;return a[orderBy]<b[orderBy]?-m:a[orderBy]>b[orderBy]?m:0;});
  if(lim>0)rows=rows.slice(0,lim);
  const displayed=rows.map(r=>{const o={};cols.forEach(c=>o[c]=r[c]);return o;});
  const isTop=platform==="sqlserver"&&lim>0;
  const sql=[`SELECT ${distinct?"DISTINCT ":""}${isTop?`TOP ${lim} `:""}${cols.join(", ")}`,`FROM employees`,orderBy!=="none"?`ORDER BY ${orderBy} ${dir}`:null,lim>0&&!isTop?`LIMIT ${lim}`:null,";"].filter(Boolean).join("\n");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click any column button to add or remove it from the result. Use the ORDER BY dropdown and LIMIT slider to shape the output. Watch the SQL update live.</Hint>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <SLabel color={pc}>SELECT — click to toggle columns</SLabel>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {ALL_COLS.map(c=>{
                const inSel=cols.includes(c);
                return(
                  <button key={c} onClick={()=>toggle(c)} style={{padding:"5px 11px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",transition:"all .18s",border:`1px solid ${inSel?pc:"rgba(255,255,255,.1)"}`,background:inSel?`${pc}18`:"rgba(255,255,255,.03)",color:inSel?pc:T.grey,fontWeight:inSel?700:400}}>
                    {inSel&&<span style={{marginRight:4,fontSize:9}}>✓</span>}{c}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <SLabel>ORDER BY</SLabel>
              <select value={orderBy} onChange={e=>setOrderBy(e.target.value)} style={{width:"100%",padding:"5px 8px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.surface,color:T.white,fontSize:10,fontFamily:"monospace"}}>
                <option value="none">— none —</option>
                {cols.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <SLabel>DIRECTION</SLabel>
              <div style={{display:"flex",gap:4}}>
                {["ASC","DESC"].map(d=><button key={d} onClick={()=>setDir(d)} style={{flex:1,padding:"5px",borderRadius:7,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${dir===d?pc:T.slate}`,background:dir===d?`${pc}14`:"transparent",color:dir===d?pc:T.grey}}>{d} {d==="ASC"?"↑":"↓"}</button>)}
              </div>
            </div>
          </div>
          <div>
            <SLabel>{platform==="sqlserver"?"TOP N":"LIMIT"} — rows to return (0 = all {EMP.length})</SLabel>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="range" min={0} max={EMP.length} value={lim} onChange={e=>setLim(Number(e.target.value))} style={{flex:1,accentColor:pc}}/>
              <span style={{fontSize:11,color:pc,fontFamily:"monospace",minWidth:24}}>{lim||"All"}</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setDistinct(!distinct)}>
            <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${distinct?pc:T.slate}`,background:distinct?`${pc}22`:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{distinct&&<span style={{color:pc,fontSize:11}}>✓</span>}</div>
            <span style={{fontSize:11,color:T.greyLight}}>DISTINCT — remove duplicate rows</span>
          </div>
          <SQLBlock code={sql} platform={platform}/>
        </div>
        <div>
          <SLabel color={pc}>RESULT — {displayed.length} row{displayed.length!==1?"s":""} × {cols.length} column{cols.length!==1?"s":""}</SLabel>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                  {cols.map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:pc,letterSpacing:.5,fontWeight:700,whiteSpace:"nowrap"}}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {displayed.map((row,ri)=>(
                  <tr key={ri} style={{borderBottom:ri<displayed.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*40}ms both`}}>
                    {cols.map(c=><td key={c} style={{padding:"5px 10px",fontSize:10,color:row[c]===null?T.greyDark:T.greyLight,fontStyle:row[c]===null?"italic":"normal"}}>{row[c]===null?"NULL":String(row[c])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{displayed.length} rows</div>
          </div>
          {ALL_COLS.filter(c=>!cols.includes(c)).length>0&&(
            <div style={{marginTop:8,padding:"6px 10px",borderRadius:8,background:"rgba(255,255,255,.02)",border:`1px solid ${T.slate}33`,fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>
              Hidden columns: {ALL_COLS.filter(c=>!cols.includes(c)).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComputedColumnsVisual({platform}){
  const pc=PLAT[platform].color;
  const [show,setShow]=useState(null);
  const exprs=[
    {label:"salary * 1.1",desc:"Arithmetic — 10% raise",fn:r=>(r.salary*1.1).toFixed(0),color:T.blue},
    {label:"salary / 12",desc:"Monthly pay",fn:r=>Math.round(r.salary/12),color:T.green},
    {label:"2024 - hired",desc:"Years at company",fn:r=>2024-r.hired,color:T.yellow},
    {label:"UPPER(dept)",desc:"All caps department",fn:r=>r.dept.toUpperCase(),color:T.purple},
  ];
  const active=show!==null?exprs[show]:null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Note color={pc}>SELECT can compute new columns on the fly. Click a formula below to see it calculated for every row.</Note>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {exprs.map((e,i)=>(
          <button key={i} onClick={()=>setShow(show===i?null:i)} style={{padding:"5px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${show===i?e.color:"rgba(255,255,255,.1)"}`,background:show===i?`${e.color}14`:"rgba(255,255,255,.02)",color:show===i?e.color:T.grey,transition:"all .18s"}}>
            <strong>{e.label}</strong>
          </button>
        ))}
      </div>
      {active&&(
        <div style={{animation:"popIn .25s ease",display:"flex",flexDirection:"column",gap:10}}>
          <SQLBlock platform={platform} code={`SELECT name, salary,\n  ${active.label} AS computed_col\nFROM employees;`}/>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>salary</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:active.color}}>→ {active.label}</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>formula</th>
              </tr></thead>
              <tbody>
                {EMP.map((r,ri)=>(
                  <tr key={r.id} style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*35}ms both`}}>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.name}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.salary.toLocaleString()}</td>
                    <td style={{padding:"5px 10px",fontSize:11,color:active.color,fontWeight:700}}>{active.fn(r)}</td>
                    <td style={{padding:"5px 10px",fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>{active.label.replace("salary",String(r.salary)).replace("hired",String(r.hired)).replace("dept",`'${r.dept}'`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {show===null&&<div style={{textAlign:"center",padding:"16px",fontSize:10,color:T.greyDark,fontFamily:"monospace"}}>← click a formula above</div>}
    </div>
  );
}

function Module01({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"What SELECT does",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>SELECT tells the database <em>which columns</em> to return. FROM tells it <em>which table</em> to read. Together, they're the minimum valid SQL query.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <SLabel color={T.red}>SELECT * — returns everything</SLabel>
            <SQLBlock platform={platform} code={`SELECT *\nFROM employees;\n\n-- Returns all 7 columns × 10 rows\n-- Avoid in production:\n--   • Slow on wide tables\n--   • Fragile if schema changes\n--   • May expose sensitive columns`}/>
          </div>
          <div>
            <SLabel color={pc}>SELECT columns — precise ✓</SLabel>
            <SQLBlock platform={platform} code={`SELECT id, name, dept, salary\nFROM employees;\n\n-- Only 4 columns returned\n-- Faster, clearer intent\n-- Safe when schema changes`}/>
          </div>
        </div>
        <Tip icon="🧠" title="SQL IS DECLARATIVE" color={pc}>You describe <em>what</em> you want — the database engine decides <em>how</em> to get it. This is different from most programming where you write step-by-step instructions.</Tip>
      </div>
    )},
    {title:"🛝 SELECT sandbox",content:()=><SelectVisual platform={platform}/>},
    {title:"Computed columns",content:()=><ComputedColumnsVisual platform={platform}/>},
    {title:"LIMIT / TOP differences",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>SQL Server puts <code style={{color:pc}}>TOP</code> <em>inside</em> SELECT. MySQL and PostgreSQL put <code style={{color:pc}}>LIMIT</code> at the end. This is one of the first cross-platform surprises developers hit.</Note>
        <PlatformDiff title="Limiting rows returned" diffs={[
          {platform:"mysql",    code:`SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;\n\n-- Pagination:\nLIMIT 5 OFFSET 10;`,note:"LIMIT at the end. OFFSET to skip rows."},
          {platform:"postgres", code:`SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;\n\n-- SQL standard syntax also valid:\nFETCH NEXT 5 ROWS ONLY;`,note:"Same as MySQL. Also supports SQL:2008 FETCH syntax."},
          {platform:"sqlserver",code:`SELECT TOP 5 name, salary\nFROM employees\nORDER BY salary DESC;\n\n-- Pagination:\nORDER BY salary DESC\nOFFSET 10 ROWS\nFETCH NEXT 5 ROWS ONLY;`,note:"TOP goes right after SELECT. No LIMIT keyword."},
        ]}/>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"SELECT * in production code",wrong:`SELECT * FROM employees;`,right:`SELECT id, name, email FROM employees;`,why:"SELECT * returns sensitive columns you didn't intend to expose, wastes network bandwidth on unused data, and breaks silently if new columns are added to the table."},
      {title:"Using a SELECT alias in WHERE",wrong:`SELECT salary * 12 AS annual\nFROM employees\nWHERE annual > 1000000;`,right:`SELECT salary * 12 AS annual\nFROM employees\nWHERE salary * 12 > 1000000;`,why:"SQL's logical execution order is FROM → WHERE → SELECT. The alias 'annual' doesn't exist when WHERE is evaluated. Repeat the expression, or use a subquery/CTE."},
      {title:"TOP without ORDER BY (SQL Server)",wrong:`SELECT TOP 3 name FROM employees;\n-- Which 3? Unknown — could change daily!`,right:`SELECT TOP 3 name FROM employees\nORDER BY salary DESC;\n-- Deterministic: top 3 earners`,why:"Without ORDER BY, TOP returns whatever rows the engine encounters first — which is non-deterministic and can change between runs."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"You run SELECT * FROM employees. A new column called ssn is added. What happens?",options:["Error — must update the query","The ssn column is now returned by your query","Nothing — SELECT * is locked to original schema","Performance improves"],correct:1,explanation:"SELECT * is dynamic and returns all columns as they exist at query time. Adding ssn to the table means it's now returned by every SELECT * query — a security risk."},
      {question:"Which is the correct SQL Server syntax for the top 5 highest earners?",options:["SELECT name FROM employees LIMIT 5 ORDER BY salary DESC","SELECT name FROM employees ORDER BY salary DESC LIMIT 5","SELECT TOP 5 name FROM employees ORDER BY salary DESC","SELECT name TOP 5 FROM employees ORDER BY salary"],correct:2,explanation:"SQL Server uses TOP n placed right after SELECT. MySQL and PostgreSQL use LIMIT at the end. This is one of the most common platform-switch mistakes."},
      {type:"bug",question:"What is wrong with this query?",code:`SELECT name, salary * 12 AS annual\nFROM employees\nWHERE annual > 900000;`,options:["salary * 12 is not allowed","WHERE references 'annual' which is a SELECT alias — not valid here","Missing GROUP BY","Nothing wrong"],correct:1,explanation:"SELECT aliases can't be referenced in WHERE because WHERE runs before SELECT in SQL's logical execution order. Fix: repeat the expression (salary * 12 > 900000) or wrap in a CTE."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 02: WHERE ─────────────────────────────────────────────────────────
function WhereRowEvaluator({platform}){
  const pc=PLAT[platform].color;
  const [col,setCol]=useState("dept");
  const [op,setOp]=useState("=");
  const [val,setVal]=useState("Engineering");
  const [hovId,setHovId]=useState(null);
  const colOpts=["id","name","dept","salary","hired","active","city","mgr_id"];
  const ops=["=","!=",">",">=","<","<=","LIKE","IS NULL","IS NOT NULL"];
  const evaluate=row=>{
    const v=row[col];
    if(op==="IS NULL")return v===null||v===undefined?"TRUE":"FALSE";
    if(op==="IS NOT NULL")return v!==null&&v!==undefined?"TRUE":"FALSE";
    if(v===null||v===undefined)return"UNKNOWN";
    const n=isNaN(val)?val.replace(/'/g,""):Number(val);
    switch(op){
      case"=": return String(v)===String(n)?"TRUE":"FALSE";
      case"!=":return String(v)!==String(n)?"TRUE":"FALSE";
      case">": return Number(v)>Number(n)?"TRUE":"FALSE";
      case">=":return Number(v)>=Number(n)?"TRUE":"FALSE";
      case"<": return Number(v)<Number(n)?"TRUE":"FALSE";
      case"<=":return Number(v)<=Number(n)?"TRUE":"FALSE";
      case"LIKE":return String(v).toLowerCase().includes(String(n).replace(/%/g,"").toLowerCase())?"TRUE":"FALSE";
      default:return"UNKNOWN";
    }
  };
  const rc=r=>r==="TRUE"?T.green:r==="FALSE"?T.greyDark:T.orange;
  const valInput=!["IS NULL","IS NOT NULL"].includes(op);
  const passing=EMP.filter(r=>evaluate(r)==="TRUE");
  const unknown=EMP.filter(r=>evaluate(r)==="UNKNOWN");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="🎛️">Use the dropdowns to pick a column, operator, and value. Every row is evaluated instantly — <strong style={{color:T.green}}>green = included</strong>, <strong style={{color:T.greyDark}}>dimmed = excluded</strong>, <strong style={{color:T.orange}}>orange = UNKNOWN (NULL)</strong>. Hover a row to highlight it.</Hint>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",background:T.surface,padding:"12px 14px",borderRadius:10,border:`1px solid ${T.slate}`}}>
        <span style={{fontSize:12,color:T.grey,fontFamily:"monospace",fontWeight:700}}>WHERE</span>
        <select value={col} onChange={e=>setCol(e.target.value)} style={{padding:"5px 8px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.bg,color:T.white,fontSize:10,fontFamily:"monospace"}}>
          {colOpts.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={op} onChange={e=>setOp(e.target.value)} style={{padding:"5px 8px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.bg,color:T.white,fontSize:10,fontFamily:"monospace"}}>
          {ops.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        {valInput&&<input value={val} onChange={e=>setVal(e.target.value)} style={{padding:"5px 9px",borderRadius:7,border:`1px solid ${pc}44`,background:T.bg,color:pc,fontSize:10,fontFamily:"monospace",width:120}} placeholder="value"/>}
        <span style={{marginLeft:"auto",fontSize:10,fontFamily:"monospace"}}>
          <span style={{color:T.green}}>✓ {passing.length}</span>
          <span style={{color:T.greyDark,margin:"0 6px"}}>✗ {EMP.length-passing.length-unknown.length}</span>
          {unknown.length>0&&<span style={{color:T.orange}}>? {unknown.length}</span>}
        </span>
      </div>
      <SQLBlock code={`SELECT * FROM employees\nWHERE ${col} ${op}${valInput?` ${isNaN(val)?`'${val}'`:val}`:""};\n-- ${passing.length}/${EMP.length} rows returned`} platform={platform}/>
      <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
            {["name","dept","salary","hired","mgr_id","active",`${col} value`,"verdict","included?"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:(c==="verdict"||c==="included?")?pc:T.greyDark,letterSpacing:.5,fontWeight:700,whiteSpace:"nowrap"}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {EMP.map((row,ri)=>{
              const res=evaluate(row);
              const inc=res==="TRUE";
              const isHov=hovId===row.id;
              return(
                <tr key={row.id} onMouseEnter={()=>setHovId(row.id)} onMouseLeave={()=>setHovId(null)}
                  style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none",background:inc?"rgba(74,222,128,.06)":res==="UNKNOWN"?"rgba(251,146,60,.05)":"transparent",opacity:inc||isHov?1:0.3,transition:"all .25s"}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.dept}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.salary.toLocaleString()}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.hired}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:row.mgr_id===null?T.orange:T.greyLight,fontStyle:row.mgr_id===null?"italic":"normal"}}>{row.mgr_id===null?"NULL":row.mgr_id}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.active}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:row[col]===null?T.orange:isHov?T.white:T.greyLight,fontWeight:isHov?700:400,fontStyle:row[col]===null?"italic":"normal"}}>{row[col]===null?"NULL":String(row[col])}</td>
                  <td style={{padding:"5px 10px",fontSize:11,fontWeight:700,color:rc(res),fontFamily:"monospace"}}>{res}</td>
                  <td style={{padding:"5px 10px",fontSize:13}}>{inc?"✓":res==="UNKNOWN"?"?":"✗"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AndOrVisual({platform}){
  const pc=PLAT[platform].color;
  const [conds,setConds]=useState([{col:"dept",op:"=",val:"Engineering",id:1},{col:"salary",op:">",val:"85000",id:2}]);
  const [logic,setLogic]=useState("AND");
  const add=()=>setConds(p=>[...p,{col:"salary",op:">",val:"70000",id:Date.now()}]);
  const remove=id=>setConds(p=>p.filter(c=>c.id!==id));
  const update=(id,f,v)=>setConds(p=>p.map(c=>c.id===id?{...c,[f]:v}:c));
  const evalCond=(row,cond)=>{
    const v=row[cond.col];if(v===null)return false;
    const n=isNaN(cond.val)?cond.val.replace(/'/g,""):Number(cond.val);
    switch(cond.op){case"=":return String(v)===String(n);case"!=":return String(v)!==String(n);case">":return Number(v)>Number(n);case">=":return Number(v)>=Number(n);case"<":return Number(v)<Number(n);case"<=":return Number(v)<=Number(n);case"LIKE":return String(v).toLowerCase().includes(String(n).replace(/%/g,"").toLowerCase());default:return false;}
  };
  const evalRow=row=>{
    if(conds.length===0)return{pass:true,results:[]};
    const results=conds.map(c=>evalCond(row,c));
    return{pass:logic==="AND"?results.every(Boolean):results.some(Boolean),results};
  };
  const passIds=EMP.filter(r=>evalRow(r).pass).map(r=>r.id);
  const sql=`SELECT * FROM employees\nWHERE\n${conds.map((c,i)=>`${i>0?`  ${logic} `:"  "}${c.col} ${c.op} ${isNaN(c.val)?`'${c.val}'`:c.val}`).join("\n")||"  -- add conditions"};\n-- ${passIds.length}/${EMP.length} rows pass`;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Hint icon="🛠️">Click <strong>+ Add</strong> to add a condition. Edit the column, operator, and value for each one. Toggle <strong>AND / OR</strong> to change how they combine. Each column in the table shows a per-condition ✓ or ✗.</Hint>
      <div style={{background:T.surface,border:`1px solid ${T.slate}`,borderRadius:10,padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <SLabel color={pc}>WHERE CONDITIONS</SLabel>
          <div style={{display:"flex",gap:6}}>
            {conds.length>1&&["AND","OR"].map(l=><button key={l} onClick={()=>setLogic(l)} style={{padding:"3px 10px",borderRadius:14,fontSize:9,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${logic===l?pc:T.slate}`,background:logic===l?`${pc}18`:"transparent",color:logic===l?pc:T.grey}}>{l}</button>)}
            <button onClick={add} style={{padding:"4px 12px",borderRadius:14,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${pc}55`,background:`${pc}14`,color:pc}}>+ Add</button>
          </div>
        </div>
        {conds.map((c,i)=>(
          <div key={c.id} style={{display:"flex",gap:6,alignItems:"center"}}>
            {i>0?<span style={{fontSize:10,color:pc,fontFamily:"monospace",fontWeight:700,minWidth:30}}>{logic}</span>:<span style={{minWidth:30}}/>}
            <select value={c.col} onChange={e=>update(c.id,"col",e.target.value)} style={{padding:"4px 7px",borderRadius:6,border:`1px solid ${T.slate}`,background:T.bg,color:T.white,fontSize:10,fontFamily:"monospace"}}>
              {["id","name","dept","salary","hired","active","city"].map(x=><option key={x} value={x}>{x}</option>)}
            </select>
            <select value={c.op} onChange={e=>update(c.id,"op",e.target.value)} style={{padding:"4px 7px",borderRadius:6,border:`1px solid ${T.slate}`,background:T.bg,color:T.white,fontSize:10,fontFamily:"monospace"}}>
              {["=","!=",">",">=","<","<=","LIKE"].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
            <input value={c.val} onChange={e=>update(c.id,"val",e.target.value)} style={{flex:1,padding:"4px 8px",borderRadius:6,border:`1px solid ${pc}44`,background:T.bg,color:pc,fontSize:10,fontFamily:"monospace"}} placeholder="value"/>
            <button onClick={()=>remove(c.id)} style={{padding:"4px 8px",borderRadius:6,fontSize:10,cursor:"pointer",border:`1px solid rgba(248,113,113,.2)`,background:"rgba(248,113,113,.08)",color:T.red}}>✕</button>
          </div>
        ))}
      </div>
      <SQLBlock code={sql} platform={platform}/>
      <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>dept</th>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>salary</th>
            {conds.map((c,i)=><th key={i} style={{padding:"6px 10px",textAlign:"center",fontSize:9,color:pc,letterSpacing:.3}}>C{i+1}: {c.col} {c.op} {c.val}</th>)}
            <th style={{padding:"6px 10px",textAlign:"center",fontSize:9,color:T.white,fontWeight:700}}>RESULT</th>
          </tr></thead>
          <tbody>
            {EMP.map((row,ri)=>{
              const {pass,results}=evalRow(row);
              return(
                <tr key={row.id} style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none",background:pass?"rgba(74,222,128,.06)":"transparent",opacity:pass?1:.28,transition:"all .25s"}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.dept}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.salary.toLocaleString()}</td>
                  {results.map((r,ci)=><td key={ci} style={{padding:"5px 10px",textAlign:"center",fontSize:12}}>{r?"✓":"✗"}</td>)}
                  <td style={{padding:"5px 10px",textAlign:"center",fontSize:11,fontWeight:700,color:pass?T.green:T.red,fontFamily:"monospace"}}>{pass?"PASS":"FAIL"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Module02({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"How WHERE works",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}><strong style={{color:pc}}>WHERE</strong> tests every row in the table. Only rows that evaluate to <strong style={{color:T.green}}>TRUE</strong> are returned. Rows that evaluate to <strong style={{color:T.greyDark}}>FALSE</strong> or <strong style={{color:T.orange}}>UNKNOWN</strong> (NULL comparisons) are excluded.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <SQLBlock platform={platform} code={`SELECT name, salary\nFROM employees\nWHERE dept = 'Engineering';\n\n-- SQL checks every row:\n-- Row 1: 'Engineering' = 'Engineering' → TRUE  ✓\n-- Row 2: 'Analytics' = 'Engineering' → FALSE ✗\n-- Row 4: 'Product' = 'Engineering' → FALSE ✗`}/>
          <div>
            <SLabel color={pc}>Result: Engineering employees</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              {EMP.filter(r=>r.dept==="Engineering").map((r,ri,a)=>(
                <div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderBottom:ri<a.length-1?`1px solid ${T.slate}44`:"none",background:"rgba(74,222,128,.06)"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.green,fontWeight:700}}>{r.name}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{r.salary.toLocaleString()}</span>
                </div>
              ))}
              <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{EMP.filter(r=>r.dept==="Engineering").length} rows</div>
            </div>
          </div>
        </div>
        <Tip icon="🧠" title="SQL EXECUTION ORDER" color={pc}>FROM → <strong style={{color:T.white}}>WHERE</strong> → GROUP BY → HAVING → SELECT → ORDER BY. WHERE runs before SELECT — this is why you can't use SELECT aliases in WHERE.</Tip>
      </div>
    )},
    {title:"🔬 Row evaluator",content:()=><WhereRowEvaluator platform={platform}/>},
    {title:"🛝 AND / OR builder",content:()=><AndOrVisual platform={platform}/>},
    {title:"IN, BETWEEN, LIKE",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <SQLBlock platform={platform} code={`-- IN: match a list (cleaner than OR chains)\nSELECT name FROM employees\nWHERE dept IN ('Engineering','Analytics');\n\n-- BETWEEN: inclusive on both ends!\nSELECT name, salary FROM employees\nWHERE salary BETWEEN 70000 AND 85000;\n-- = WHERE salary >= 70000 AND salary <= 85000\n-- Amara (85000) IS included ← boundary!`}/>
          <div>
            <PlatformTabs platform={platform}
              mysql={`-- MySQL: LIKE is case-INSENSITIVE by default\nWHERE name LIKE 'A%'     -- starts with A\nWHERE name LIKE '%Eze'   -- ends with Eze\nWHERE name LIKE '%a%'    -- contains 'a'\nWHERE name LIKE '_ola%'  -- 2nd char = 'o'`}
              postgres={`-- PostgreSQL: LIKE is case-SENSITIVE\nWHERE name LIKE 'A%';   -- uppercase A only\n\n-- Case-insensitive: use ILIKE\nWHERE name ILIKE 'a%';  -- finds Amara etc.\n\n-- Regex support:\nWHERE name ~ '^A';       -- starts with A`}
              sqlserver={`-- SQL Server: case depends on collation\n-- Most default to case-insensitive\nWHERE name LIKE 'A%';\n\n-- Force case-insensitive:\nWHERE name LIKE 'a%'\n  COLLATE SQL_Latin1_General_CP1_CI_AS`}
            />
          </div>
        </div>
        <Warn>NOT IN with a subquery that can return NULL values returns zero rows. <code style={{color:T.orange}}>WHERE id NOT IN (1, 2, NULL)</code> evaluates as <code style={{color:T.orange}}>id≠1 AND id≠2 AND id≠NULL</code> — the last part is always UNKNOWN, so every row fails. Always add <code style={{color:T.orange}}>WHERE col IS NOT NULL</code> to the subquery.</Warn>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"Using = NULL instead of IS NULL",wrong:`SELECT * FROM employees WHERE mgr_id = NULL;\n-- Always returns 0 rows!`,right:`SELECT * FROM employees WHERE mgr_id IS NULL;\n-- Returns Amara, Dami, Grace, Ifeoma, Jide`,why:"NULL = anything always evaluates to UNKNOWN, not TRUE. Only IS NULL and IS NOT NULL correctly identify NULL values. This is SQL's 3-valued logic: TRUE, FALSE, UNKNOWN."},
      {title:"NOT IN with NULLs in the list",wrong:`SELECT name FROM employees\nWHERE id NOT IN (SELECT mgr_id FROM employees);\n-- Returns 0 rows! (mgr_id has NULLs)`,right:`SELECT name FROM employees\nWHERE id NOT IN (\n  SELECT mgr_id FROM employees\n  WHERE mgr_id IS NOT NULL\n);`,why:"NOT IN (1, 2, NULL) = id≠1 AND id≠2 AND id≠NULL. id≠NULL is always UNKNOWN, poisoning the whole AND chain. Always filter NULLs from NOT IN subqueries, or use NOT EXISTS instead."},
      {title:"Mixing AND/OR without parentheses",wrong:`WHERE dept='Engineering' OR dept='Analytics'\n  AND salary > 75000\n-- Parsed as: dept='Eng' OR (dept='Analytics' AND salary>75k)`,right:`WHERE (dept='Engineering' OR dept='Analytics')\n  AND salary > 75000`,why:"AND has higher precedence than OR, just like * beats + in math. Always use parentheses when mixing AND and OR to make your intent explicit and prevent logic bugs."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"A table has a nullable email column. Which query correctly finds rows with no email?",options:["WHERE email = NULL","WHERE email = ''","WHERE email IS NULL","WHERE ISNULL(email)"],correct:2,explanation:"NULL cannot be compared with =. WHERE email = NULL evaluates to UNKNOWN for every row. Only IS NULL correctly identifies NULL values in SQL."},
      {question:"BETWEEN 70000 AND 85000 — is 85000 included or excluded?",options:["Excluded — BETWEEN is exclusive on both ends","Included — BETWEEN is inclusive on both ends","Depends on the platform","Excluded on the right, included on the left"],correct:1,explanation:"SQL's BETWEEN is inclusive on both ends. BETWEEN 70000 AND 85000 is equivalent to >= 70000 AND <= 85000. Amara at exactly 85000 IS included."},
      {type:"bug",question:"A developer wants employees not managed by anyone (no manager). What's wrong?",code:`SELECT name FROM employees\nWHERE mgr_id = NULL;`,options:["NULL should be in quotes: mgr_id = 'NULL'","= NULL always returns UNKNOWN — should be IS NULL","mgr_id is the wrong column","Missing FROM clause"],correct:1,explanation:"NULL = NULL evaluates to UNKNOWN, not TRUE. This query always returns 0 rows. Fix: WHERE mgr_id IS NULL."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 03: GROUP BY ─────────────────────────────────────────────────────
function GroupByJourney({platform}){
  const pc=PLAT[platform].color;
  const [groupCol,setGroupCol]=useState("dept");
  const [aggFn,setAggFn]=useState("COUNT");
  const [aggCol,setAggCol]=useState("*");
  const [phase,setPhase]=useState(0);
  useEffect(()=>setPhase(0),[groupCol,aggFn,aggCol]);
  const getKey=r=>String(r[groupCol]);
  const groups=[...new Set(EMP.map(getKey))].sort();
  const grouped={};groups.forEach(g=>{grouped[g]=EMP.filter(r=>getKey(r)===g);});
  const computeAgg=rows=>{
    if(aggFn==="COUNT")return aggCol==="*"?rows.length:rows.filter(r=>r[aggCol]!==null).length;
    const vs=rows.map(r=>r[aggCol]).filter(v=>v!==null);
    if(aggFn==="SUM")return vs.reduce((s,v)=>s+v,0).toLocaleString();
    if(aggFn==="AVG")return Math.round(vs.reduce((s,v)=>s+v,0)/vs.length).toLocaleString();
    if(aggFn==="MIN")return Math.min(...vs).toLocaleString();
    if(aggFn==="MAX")return Math.max(...vs).toLocaleString();
    return"—";
  };
  const PHASES=[
    {label:"Raw data",icon:"📋",desc:"All rows in the table"},
    {label:"Colour by group",icon:"🎨",desc:"Rows colour-coded by group value"},
    {label:"Cluster groups",icon:"📦",desc:"Rows reorganise into buckets"},
    {label:"Aggregate",icon:"⚡",desc:"Each bucket collapses to 1 row"},
  ];
  const colOpts={salary:true,hired:true,id:true};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Use the config row to change GROUP BY column, function, and column. Then click through the <strong>4 phase tabs</strong> to see raw rows → colour-coded → clustered → aggregated. Watch the row count change from 10 to the number of groups.</Hint>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,background:T.surface,border:`1px solid ${T.slate}`,borderRadius:10,padding:"12px 14px"}}>
        <div>
          <SLabel>GROUP BY</SLabel>
          <div style={{display:"flex",gap:4}}>
            {["dept","hired","active"].map(c=><button key={c} onClick={()=>setGroupCol(c)} style={{padding:"4px 10px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${groupCol===c?pc:"rgba(255,255,255,.1)"}`,background:groupCol===c?`${pc}18`:"transparent",color:groupCol===c?pc:T.grey,transition:"all .18s"}}>{c}</button>)}
          </div>
        </div>
        <div>
          <SLabel color={pc}>FUNCTION</SLabel>
          <div style={{display:"flex",gap:4}}>
            {["COUNT","SUM","AVG","MIN","MAX"].map(f=><button key={f} onClick={()=>setAggFn(f)} style={{padding:"4px 9px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${aggFn===f?pc:"rgba(255,255,255,.1)"}`,background:aggFn===f?`${pc}18`:"transparent",color:aggFn===f?pc:T.grey,transition:"all .18s"}}>{f}</button>)}
          </div>
        </div>
        <div>
          <SLabel>COLUMN</SLabel>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["*","salary","hired","id"].map(c=><button key={c} onClick={()=>setAggCol(c)} style={{padding:"4px 9px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${aggCol===c?pc:"rgba(255,255,255,.1)"}`,background:aggCol===c?`${pc}18`:"transparent",color:aggCol===c?pc:T.grey,transition:"all .18s"}}>{c}</button>)}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:`1px solid ${T.slate}`}}>
        {PHASES.map((p,i)=>(
          <button key={i} onClick={()=>setPhase(i)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",background:phase===i?`${pc}18`:phase>i?`${pc}06`:"transparent",borderRight:i<3?`1px solid ${T.slate}`:"none",transition:"all .2s"}}>
            <div style={{fontSize:16,marginBottom:3}}>{p.icon}</div>
            <div style={{fontSize:9,fontWeight:700,color:phase>=i?pc:T.greyDark,fontFamily:"monospace"}}>{p.label}</div>
            <div style={{fontSize:8,color:T.greyDark,marginTop:1}}>{p.desc}</div>
          </button>
        ))}
      </div>
      {phase===0&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:10,color:T.greyLight,fontFamily:"monospace"}}>employees — {EMP.length} rows. No grouping yet. <code style={{color:pc}}>{groupCol}</code> has {groups.length} unique values.</div>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                {["id","name","dept","salary","hired"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:c===groupCol?T.yellow:T.greyDark,fontWeight:700}}>{c}{c===groupCol?" ← group col":""}</th>)}
              </tr></thead>
              <tbody>{EMP.map((r,ri)=>(
                <tr key={r.id} style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none"}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyDark}}>{r.id}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.dept}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.salary.toLocaleString()}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.hired}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{padding:"8px 12px",borderRadius:8,background:`${T.yellow}09`,border:`1px solid ${T.yellow}22`,fontSize:11,color:T.greyLight}}>
            <strong style={{color:T.yellow}}>Step 1:</strong> See the raw {EMP.length} rows. The <code style={{color:T.yellow}}>{groupCol}</code> column will be used to form groups. Click <strong style={{color:T.white}}>Colour by group →</strong>
          </div>
        </div>
      )}
      {phase===1&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:9,color:T.grey,fontFamily:"monospace"}}>Groups detected:</span>
            {groups.map(g=><span key={g} style={{fontSize:10,padding:"3px 10px",borderRadius:14,background:gc(g).bg,border:`1px solid ${gc(g).border}`,color:gc(g).text,fontFamily:"monospace",fontWeight:700}}>{groupCol}={g}</span>)}
          </div>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                {["id","name","dept","salary","hired"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:c===groupCol?T.yellow:T.greyDark,fontWeight:700}}>{c}</th>)}
              </tr></thead>
              <tbody>{EMP.map((r,ri)=>{
                const col=gc(getKey(r));
                return(
                  <tr key={r.id} style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none",background:col.bg,transition:"background .4s ease"}}>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyDark}}>{r.id}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.name}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.dept}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.salary.toLocaleString()}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.hired}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <div style={{padding:"8px 12px",borderRadius:8,background:`${pc}09`,border:`1px solid ${pc}22`,fontSize:11,color:T.greyLight}}>
            <strong style={{color:pc}}>Step 2:</strong> Rows are colour-coded by their <code style={{color:pc}}>{groupCol}</code> value. Same colour = same group. Still {EMP.length} rows — nothing removed yet. Click <strong style={{color:T.white}}>Cluster groups →</strong>
          </div>
        </div>
      )}
      {phase===2&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontSize:10,color:T.greyLight,fontFamily:"monospace"}}>Rows reorganised into {groups.length} groups — still {EMP.length} total rows</div>
          {groups.map((g,gi)=>{
            const rows=grouped[g];const col=gc(g);
            return(
              <div key={g} style={{border:`1px solid ${col.border}`,borderRadius:10,overflow:"hidden",animation:`fadeUp .4s ease ${gi*80}ms both`}}>
                <div style={{padding:"8px 14px",background:col.bg,borderBottom:`1px solid ${col.border}`,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:10,fontWeight:700,color:col.text,fontFamily:"monospace"}}>{groupCol} = {g}</span>
                  <span style={{fontSize:9,color:col.text,fontFamily:"monospace",opacity:.7}}>{rows.length} row{rows.length!==1?"s":""}</span>
                  <span style={{marginLeft:"auto",fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>→ will collapse to 1 row</span>
                </div>
                <div style={{background:"rgba(4,9,20,.7)"}}>
                  {rows.map((row,ri)=>(
                    <div key={row.id} style={{display:"grid",gridTemplateColumns:".3fr 1.5fr 1fr .8fr .5fr",padding:"5px 14px",borderBottom:ri<rows.length-1?`1px solid ${col.border}22`:"none",animation:`fadeUp .3s ease ${ri*40}ms both`}}>
                      <span style={{fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>{row.id}</span>
                      <span style={{fontSize:10,fontFamily:"monospace",color:col.text}}>{row.name}</span>
                      <span style={{fontSize:10,fontFamily:"monospace",color:col.text,fontWeight:700}}>{String(row[groupCol])}</span>
                      <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{row.salary.toLocaleString()}</span>
                      <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{row.hired}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{padding:"8px 12px",borderRadius:8,background:`${pc}09`,border:`1px solid ${pc}22`,fontSize:11,color:T.greyLight}}>
            <strong style={{color:pc}}>Step 3:</strong> Rows are clustered but still all {EMP.length} present. Next step collapses each bucket into <strong style={{color:T.white}}>1 row</strong> using the aggregate function. Click <strong style={{color:T.white}}>Aggregate →</strong>
          </div>
        </div>
      )}
      {phase===3&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"flex-start"}}>
            <div>
              <SLabel>BEFORE — {EMP.length} rows in groups</SLabel>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {groups.map((g,gi)=>{
                  const rows=grouped[g];const col=gc(g);const val=computeAgg(rows);
                  return(
                    <div key={g} style={{border:`1px solid ${col.border}`,borderRadius:8,overflow:"hidden",animation:`fadeUp .3s ease ${gi*70}ms both`}}>
                      <div style={{padding:"5px 10px",background:col.bg,fontSize:9,color:col.text,fontFamily:"monospace",fontWeight:700}}>{g} ({rows.length} rows)</div>
                      {rows.map((row,ri)=>(
                        <div key={row.id} style={{padding:"3px 10px",display:"flex",justifyContent:"space-between",borderBottom:ri<rows.length-1?`1px solid ${col.border}22`:"none",background:"rgba(4,9,20,.5)"}}>
                          <span style={{fontSize:9,color:col.text,fontFamily:"monospace",opacity:.8}}>{row.name}</span>
                          {aggCol!=="*"&&<span style={{fontSize:9,color:T.greyLight,fontFamily:"monospace"}}>{(row[aggCol]||"—").toLocaleString?.()??row[aggCol]}</span>}
                        </div>
                      ))}
                      <div style={{padding:"5px 10px",background:col.bg,borderTop:`1px dashed ${col.border}`,fontSize:9,color:col.text,fontFamily:"monospace"}}>
                        {aggFn}({aggCol}) =
                        {aggFn==="COUNT"?` ${rows.length}`:
                         aggFn==="SUM"&&aggCol!=="*"?` ${rows.map(r=>r[aggCol]).filter(Boolean).join("+")} = ${val}`:
                         aggFn==="AVG"&&aggCol!=="*"?` avg(${rows.map(r=>r[aggCol]).filter(Boolean).join(",")}) ≈ ${val}`:
                         aggFn==="MIN"&&aggCol!=="*"?` min(${rows.map(r=>r[aggCol]).filter(Boolean).join(",")}) = ${val}`:
                         aggFn==="MAX"&&aggCol!=="*"?` max(${rows.map(r=>r[aggCol]).filter(Boolean).join(",")}) = ${val}`:` ${val}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{paddingTop:28,fontSize:22,color:pc,textAlign:"center"}}>→<div style={{fontSize:8,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>collapse</div></div>
            <div>
              <SLabel color={pc}>AFTER — {groups.length} rows</SLabel>
              <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"5px 12px",background:"rgba(4,9,20,.9)",borderBottom:`1px solid ${T.slate}`}}>
                  <span style={{fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>{groupCol}</span>
                  <span style={{fontSize:9,color:pc,fontFamily:"monospace"}}>{aggFn}({aggCol})</span>
                </div>
                {groups.map((g,gi)=>{
                  const col=gc(g);const val=computeAgg(grouped[g]);
                  return(
                    <div key={g} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"8px 12px",borderBottom:gi<groups.length-1?`1px solid ${T.slate}44`:"none",background:col.bg,animation:`popIn .35s ease ${gi*90}ms both`}}>
                      <span style={{fontSize:11,fontFamily:"monospace",color:col.text,fontWeight:700}}>{g}</span>
                      <span style={{fontSize:14,fontFamily:"monospace",color:col.text,fontWeight:800}}>{String(val)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:6,fontSize:9,color:T.greyDark,fontFamily:"monospace",textAlign:"center"}}>{EMP.length} rows → {groups.length} rows</div>
            </div>
          </div>
          <SQLBlock code={`SELECT ${groupCol},\n  ${aggFn}(${aggCol}) AS result\nFROM employees\nGROUP BY ${groupCol};\n-- ${EMP.length} rows → ${groups.length} groups`} platform={platform}/>
        </div>
      )}
    </div>
  );
}

function HavingVisual({platform}){
  const pc=PLAT[platform].color;
  const [fn,setFn]=useState("COUNT");
  const [col,setCol]=useState("*");
  const [thresh,setThresh]=useState(2);
  const groups=["Engineering","Analytics","Product"];
  const grouped={};groups.forEach(g=>{grouped[g]=EMP.filter(r=>r.dept===g);});
  const computeVal=rows=>{
    if(fn==="COUNT")return col==="*"?rows.length:rows.filter(r=>r[col]!==null).length;
    const vs=rows.map(r=>r[col]).filter(v=>v!==null);
    if(fn==="SUM")return vs.reduce((s,v)=>s+v,0);
    if(fn==="AVG")return Math.round(vs.reduce((s,v)=>s+v,0)/vs.length);
    if(fn==="MIN")return Math.min(...vs);
    if(fn==="MAX")return Math.max(...vs);
    return 0;
  };
  const vals=groups.map(g=>({group:g,val:computeVal(grouped[g])}));
  const maxVal=Math.max(...vals.map(v=>v.val));
  const passing=vals.filter(v=>v.val>thresh);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:"rgba(250,204,21,.07)",border:"1px solid rgba(250,204,21,.22)",borderRadius:10,padding:"10px 14px",fontSize:11,color:T.greyLight}}>
        <strong style={{color:T.yellow}}>HAVING</strong> filters groups <em>after</em> aggregation. Drag the threshold bar below — watch groups pass or fail in real time. WHERE filters rows before grouping; HAVING filters groups after.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["COUNT","SUM","AVG","MAX"].map(f=><button key={f} onClick={()=>setFn(f)} style={{padding:"4px 9px",borderRadius:7,fontSize:9,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${fn===f?pc:"rgba(255,255,255,.1)"}`,background:fn===f?`${pc}18`:"transparent",color:fn===f?pc:T.grey}}>{f}</button>)}
            {["*","salary","hired"].map(c=><button key={c} onClick={()=>setCol(c)} style={{padding:"4px 9px",borderRadius:7,fontSize:9,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${col===c?pc:"rgba(255,255,255,.1)"}`,background:col===c?`${pc}18`:"transparent",color:col===c?pc:T.grey}}>{c}</button>)}
          </div>
          <div>
            <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginBottom:4}}>HAVING {fn}({col}) &gt; <span style={{color:pc,fontWeight:700}}>{thresh}</span></div>
            <div style={{fontSize:9,color:"#facc15",marginBottom:4,display:"flex",alignItems:"center",gap:5}}><span>↔️</span><span>Drag the slider to move the yellow threshold line</span></div>
            <input type="range" min={0} max={maxVal} value={thresh} onChange={e=>setThresh(Number(e.target.value))} style={{width:"100%",accentColor:pc}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:T.greyDark,fontFamily:"monospace",marginTop:2}}><span>0</span><span>threshold</span><span>{maxVal}</span></div>
          </div>
          <SQLBlock code={`SELECT dept, ${fn}(${col}) AS result\nFROM employees\nGROUP BY dept\nHAVING ${fn}(${col}) > ${thresh};\n-- ${passing.length}/${groups.length} groups pass`} platform={platform}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <SLabel>GROUP VALUES — yellow line = threshold</SLabel>
          {vals.map(v=>{
            const passes=v.val>thresh;const col2=gc(v.group);const pct=Math.round((v.val/maxVal)*100);
            return(
              <div key={v.group}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:10,color:passes?col2.text:T.greyDark,fontFamily:"monospace",fontWeight:700}}>{v.group}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:passes?col2.text:T.greyDark,fontWeight:700}}>{fn}({col}) = {typeof v.val==="number"?v.val.toLocaleString():v.val}</span>
                </div>
                <div style={{height:26,borderRadius:6,background:"rgba(255,255,255,.03)",border:`1px solid ${T.slate}`,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:passes?`${col2.text}28`:"rgba(255,255,255,.04)",borderRight:passes?`2px solid ${col2.text}`:`2px solid ${T.greyDark}`,transition:"all .3s"}}/>
                  <div style={{position:"absolute",top:0,height:"100%",left:`${Math.round((thresh/maxVal)*100)}%`,width:2,background:`${T.yellow}88`,transition:"left .15s"}}/>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontFamily:"monospace",color:passes?col2.text:T.greyDark,fontWeight:700}}>{passes?"✓ PASSES":"✗ FILTERED OUT"}</div>
                </div>
              </div>
            );
          })}
          <div>
            <SLabel color={pc}>RESULT</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"5px 12px",background:"rgba(4,9,20,.9)",borderBottom:`1px solid ${T.slate}`}}>
                <span style={{fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>dept</span>
                <span style={{fontSize:9,color:pc,fontFamily:"monospace"}}>{fn}({col})</span>
              </div>
              {vals.map((v,i)=>{const passes=v.val>thresh;const col2=gc(v.group);return(
                <div key={v.group} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"7px 12px",borderBottom:i<vals.length-1?`1px solid ${T.slate}44`:"none",background:passes?col2.bg:"rgba(255,255,255,.01)",opacity:passes?1:.25,transition:"all .3s"}}>
                  <span style={{fontSize:11,fontFamily:"monospace",color:passes?col2.text:T.greyDark,fontWeight:700}}>{v.group}</span>
                  <span style={{fontSize:13,fontFamily:"monospace",color:passes?col2.text:T.greyDark,fontWeight:700}}>{typeof v.val==="number"?v.val.toLocaleString():v.val}</span>
                </div>
              );})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AggFnHover({platform}){
  const pc=PLAT[platform].color;
  const [active,setActive]=useState(null);
  const rows=EMP.filter(r=>r.dept==="Analytics");
  const fns=[
    {fn:"COUNT(*)",    result:3,      color:T.blue,
     note:"Counts every row — NULLs included",
     rows:[
       {name:"Bola",   val:"row exists",verdict:"count it",running:1},
       {name:"Efe",    val:"row exists",verdict:"count it",running:2},
       {name:"Henry",  val:"row exists",verdict:"count it",running:3},
     ],
     formula:"= 3"},
    {fn:"COUNT(salary)",result:3,     color:T.cyan,
     note:"Counts non-NULL salary values only",
     rows:[
       {name:"Bola",   val:"72,000",verdict:"≠ NULL → count",running:1},
       {name:"Efe",    val:"75,000",verdict:"≠ NULL → count",running:2},
       {name:"Henry",  val:"69,000",verdict:"≠ NULL → count",running:3},
     ],
     formula:"= 3"},
    {fn:"SUM(salary)", result:216000, color:T.green,
     note:"Adds all salary values together",
     rows:[
       {name:"Bola",   val:"72,000",verdict:"add",running:72000},
       {name:"Efe",    val:"75,000",verdict:"add",running:147000},
       {name:"Henry",  val:"69,000",verdict:"add",running:216000},
     ],
     formula:"72,000 + 75,000 + 69,000 = 216,000"},
    {fn:"AVG(salary)", result:72000,  color:T.yellow,
     note:"SUM ÷ COUNT of non-NULL rows",
     rows:[
       {name:"Bola",   val:"72,000",verdict:"include",running:"sum so far: 72,000"},
       {name:"Efe",    val:"75,000",verdict:"include",running:"sum so far: 147,000"},
       {name:"Henry",  val:"69,000",verdict:"include",running:"sum so far: 216,000"},
     ],
     formula:"216,000 ÷ 3 rows = 72,000"},
    {fn:"MIN(salary)", result:69000,  color:T.orange,
     note:"Scans all values, keeps the smallest",
     rows:[
       {name:"Bola",   val:"72,000",verdict:"new min ←",running:"min = 72,000"},
       {name:"Efe",    val:"75,000",verdict:"75k > 72k, skip",running:"min = 72,000"},
       {name:"Henry",  val:"69,000",verdict:"69k < 72k, new min ←",running:"min = 69,000"},
     ],
     formula:"= 69,000"},
    {fn:"MAX(salary)", result:75000,  color:T.red,
     note:"Scans all values, keeps the largest",
     rows:[
       {name:"Bola",   val:"72,000",verdict:"new max ←",running:"max = 72,000"},
       {name:"Efe",    val:"75,000",verdict:"75k > 72k, new max ←",running:"max = 75,000"},
       {name:"Henry",  val:"69,000",verdict:"69k < 75k, skip",running:"max = 75,000"},
     ],
     formula:"= 75,000"},
  ];
  const cur=active!==null?fns[active]:null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click any function card to expand its step-by-step working. See exactly how each row contributes to the final result.</Hint>
      {/* Data being used */}
      <div style={{border:`1px solid ${gc("Analytics").border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"6px 12px",background:gc("Analytics").bg,fontSize:9,color:gc("Analytics").text,fontFamily:"monospace",fontWeight:700}}>Input data: Analytics dept — 3 rows</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
          {rows.map((r,ri)=>(
            <div key={r.id} style={{padding:"8px 12px",borderRight:ri<rows.length-1?`1px solid ${T.slate}33`:"none",background:cur?`${cur.color}0c`:"rgba(4,9,20,.7)",transition:"background .25s",textAlign:"center"}}>
              <div style={{fontSize:10,fontFamily:"monospace",color:cur?cur.color:T.greyLight,fontWeight:cur?700:400,transition:"color .25s"}}>{r.name}</div>
              <div style={{fontSize:14,fontFamily:"monospace",color:T.white,fontWeight:700,marginTop:2}}>{r.salary.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Function cards — click to expand */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {fns.map((f,fi)=>{
          const isOpen=active===fi;
          return(
            <div key={f.fn} onClick={()=>setActive(isOpen?null:fi)}
              style={{border:`1px solid ${isOpen?f.color:T.slate}`,borderRadius:10,overflow:"hidden",cursor:"pointer",transition:"border .2s",background:isOpen?`${f.color}0c`:"rgba(255,255,255,.02)"}}>
              {/* Card header — always visible */}
              <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1}}>
                  <code style={{fontSize:11,color:f.color,fontFamily:"monospace",fontWeight:700,display:"block",marginBottom:3}}>{f.fn}</code>
                  <div style={{fontSize:9,color:T.greyLight,lineHeight:1.4}}>{f.note}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:18,fontWeight:800,color:isOpen?f.color:T.white,fontFamily:"'Syne',sans-serif",transition:"color .2s"}}>{typeof f.result==="number"?f.result.toLocaleString():f.result}</div>
                  <div style={{fontSize:9,color:isOpen?f.color:T.greyDark,fontFamily:"monospace",transition:"color .2s"}}>{isOpen?"▲ hide":"▼ show working"}</div>
                </div>
              </div>
              {/* Expanded working — shown on click */}
              {isOpen&&(
                <div style={{borderTop:`1px solid ${f.color}33`,padding:"10px 12px",animation:"fadeUp .2s ease"}}>
                  <div style={{fontSize:9,color:f.color,fontFamily:"monospace",fontWeight:700,letterSpacing:.8,marginBottom:8}}>ROW-BY-ROW WORKING</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${f.color}22`}}>
                        <th style={{padding:"3px 6px",textAlign:"left",fontSize:8,color:T.greyDark,fontWeight:700}}>row</th>
                        <th style={{padding:"3px 6px",textAlign:"left",fontSize:8,color:T.greyDark,fontWeight:700}}>value</th>
                        <th style={{padding:"3px 6px",textAlign:"left",fontSize:8,color:T.greyDark,fontWeight:700}}>action</th>
                        <th style={{padding:"3px 6px",textAlign:"right",fontSize:8,color:f.color,fontWeight:700}}>running</th>
                      </tr>
                    </thead>
                    <tbody>
                      {f.rows.map((r,ri)=>(
                        <tr key={ri} style={{borderBottom:ri<f.rows.length-1?`1px solid ${f.color}15`:"none",animation:`rowAppear .25s ease ${ri*60}ms both`}}>
                          <td style={{padding:"4px 6px",fontSize:9,color:f.color,fontFamily:"monospace",fontWeight:700}}>{r.name}</td>
                          <td style={{padding:"4px 6px",fontSize:9,color:T.white,fontFamily:"monospace",fontWeight:700}}>{r.val}</td>
                          <td style={{padding:"4px 6px",fontSize:9,color:T.greyLight,fontFamily:"monospace"}}>{r.verdict}</td>
                          <td style={{padding:"4px 6px",fontSize:9,color:f.color,fontFamily:"monospace",textAlign:"right",fontWeight:700}}>{typeof r.running==="number"?r.running.toLocaleString():r.running}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{marginTop:8,padding:"6px 10px",borderRadius:6,background:`${f.color}18`,border:`1px solid ${f.color}44`,fontSize:12,fontFamily:"monospace",color:f.color,fontWeight:700,textAlign:"center"}}>
                    {f.fn} {f.formula}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Module03({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"The problem GROUP BY solves",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>Without GROUP BY, aggregates collapse the <em>entire table</em> into one number. GROUP BY splits rows into buckets first, then aggregates each bucket separately.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
          <div>
            <SLabel color={T.red}>No GROUP BY → 1 row</SLabel>
            <SQLBlock platform={platform} code={`SELECT COUNT(*) FROM employees;\n-- Returns: 10\n-- Whole table = one group`}/>
            <div style={{marginTop:8,border:`1px solid ${T.slate}`,borderRadius:8,padding:"12px",textAlign:"center"}}><span style={{fontSize:28,fontWeight:800,color:T.white,fontFamily:"'Syne',sans-serif"}}>10</span><div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>COUNT(*)</div></div>
          </div>
          <div style={{textAlign:"center",color:pc,fontSize:24}}>→</div>
          <div>
            <SLabel color={pc}>With GROUP BY → 1 row per group</SLabel>
            <SQLBlock platform={platform} code={`SELECT dept, COUNT(*)\nFROM employees\nGROUP BY dept;\n-- Returns: 3 rows`}/>
            <div style={{marginTop:8,border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              {[["Engineering",4],["Analytics",3],["Product",3]].map(([d,c],i)=>(
                <div key={d} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"7px 12px",borderBottom:i<2?`1px solid ${T.slate}44`:"none",background:gc(d).bg}}>
                  <span style={{fontSize:11,fontFamily:"monospace",color:gc(d).text,fontWeight:700}}>{d}</span>
                  <span style={{fontSize:14,fontFamily:"monospace",color:gc(d).text,fontWeight:800}}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )},
    {title:"🛝 GROUP BY journey",content:()=><GroupByJourney platform={platform}/>},
    {title:"Aggregate functions",content:()=><AggFnHover platform={platform}/>},
    {title:"🛝 HAVING threshold",content:()=><HavingVisual platform={platform}/>},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"Non-aggregated column not in GROUP BY",wrong:`SELECT dept, name, COUNT(*)\nFROM employees\nGROUP BY dept;\n-- ERROR (or arbitrary name in MySQL)`,right:`SELECT dept, COUNT(*) FROM employees GROUP BY dept;\n-- OR include name in GROUP BY:\nSELECT dept, name, COUNT(*) FROM employees GROUP BY dept, name;`,why:"Every column in SELECT must be in GROUP BY or inside an aggregate. MySQL may allow it with a random value — which is misleading and wrong."},
      {title:"WHERE instead of HAVING for aggregate conditions",wrong:`SELECT dept, COUNT(*) AS n\nFROM employees\nWHERE COUNT(*) > 2  -- ERROR!`,right:`SELECT dept, COUNT(*) AS n\nFROM employees\nGROUP BY dept\nHAVING COUNT(*) > 2;`,why:"WHERE runs before aggregation — COUNT(*) doesn't exist yet at WHERE time. HAVING runs after GROUP BY where aggregate values are available."},
      {title:"COUNT(col) vs COUNT(*)",wrong:`-- Wants unique dept count:\nSELECT COUNT(dept) AS dept_count FROM employees;\n-- Returns 10 (not 3!)`,right:`SELECT COUNT(DISTINCT dept) AS dept_count FROM employees;\n-- Returns 3 (unique values only)`,why:"COUNT(col) counts non-NULL values including duplicates. COUNT(DISTINCT col) counts unique non-NULL values. DISTINCT goes inside the parentheses."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"10 rows enter GROUP BY dept (4 Engineering, 3 Analytics, 3 Product). How many rows come out?",options:["10 — GROUP BY doesn't change row count","3 — one row per unique dept value","1 — all groups merge","Depends on the aggregate"],correct:1,explanation:"GROUP BY always produces exactly one output row per unique group value — regardless of group size or aggregate function."},
      {type:"bug",question:"What's wrong?",code:`SELECT dept, name, AVG(salary)\nFROM employees\nGROUP BY dept;`,options:["AVG(salary) is invalid","'name' is not in GROUP BY and not aggregated","dept should be in HAVING","Missing ORDER BY"],correct:1,explanation:"name is neither in GROUP BY nor wrapped in an aggregate. In standard SQL this is an error. MySQL may return an arbitrary name value — making it silently wrong."},
      {question:"AVG(salary) on a column where 3 of 10 rows have NULL salary. What denominator is used?",options:["10 (all rows)","7 (non-NULL rows)","0 (returns NULL)","Depends on the platform"],correct:1,explanation:"Aggregate functions ignore NULL values. AVG divides the sum of 7 non-NULL values by 7, not 10. This can produce a misleadingly high average if NULLs should be treated as 0."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 04: JOINS ─────────────────────────────────────────────────────────
function JoinMatchVisual({platform}){
  const pc=PLAT[platform].color;
  const [joinType,setJoinType]=useState("INNER");
  const [phase,setPhase]=useState(0);
  const [running,setRunning]=useState(false);
  const timer=useRef(null);
  const jDefs={
    INNER:{label:"INNER JOIN",color:T.blue,  desc:"Only rows with a match in BOTH tables"},
    LEFT: {label:"LEFT JOIN", color:T.green, desc:"ALL left rows + matching right (NULL if none)"},
    RIGHT:{label:"RIGHT JOIN",color:T.orange,desc:"ALL right rows + matching left (NULL if none)"},
    FULL: {label:"FULL OUTER JOIN",color:T.purple,desc:"ALL rows from both tables"},
    CROSS:{label:"CROSS JOIN",color:T.pink,  desc:"Every left × every right (no ON condition)"},
  };
  const def=jDefs[joinType];
  const leftRows=ORDERS;
  const rightRows=CUSTS;
  const isMatchedLeft=o=>CUSTS.some(c=>c.cust_id===o.cust_id);
  const isMatchedRight=c=>ORDERS.some(o=>o.cust_id===c.cust_id);
  const leftVisible=o=>{
    if(joinType==="INNER") return isMatchedLeft(o);
    if(joinType==="RIGHT") return isMatchedLeft(o);
    return true;
  };
  const rightVisible=c=>{
    if(joinType==="INNER") return isMatchedRight(c);
    if(joinType==="LEFT")  return isMatchedRight(c);
    return true;
  };
  const result=(()=>{
    if(joinType==="INNER") return ORDERS.filter(o=>CUSTS.some(c=>c.cust_id===o.cust_id)).map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c.name,amount:o.amount,city:c.city};});
    if(joinType==="LEFT")  return ORDERS.map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c?.name??null,amount:o.amount,city:c?.city??null};});
    if(joinType==="RIGHT") return CUSTS.map(c=>{const o=ORDERS.find(o=>o.cust_id===c.cust_id);return{order_id:o?.order_id??null,customer:c.name,amount:o?.amount??null,city:c.city};});
    if(joinType==="FULL"){const l=ORDERS.map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c?.name??null,amount:o.amount,city:c?.city??null};});const r=CUSTS.filter(c=>!ORDERS.some(o=>o.cust_id===c.cust_id)).map(c=>({order_id:null,customer:c.name,amount:null,city:c.city}));return[...l,...r];}
    if(joinType==="CROSS"){const r=[];ORDERS.slice(0,3).forEach(o=>CUSTS.slice(0,3).forEach(c=>r.push({order_id:o.order_id,customer:c.name,amount:o.amount})));return r;}
    return[];
  })();
  const sql={
    INNER:`SELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nINNER JOIN customers c\n  ON o.cust_id = c.cust_id;`,
    LEFT: `SELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nLEFT JOIN customers c\n  ON o.cust_id = c.cust_id;\n-- All orders kept; no customer → NULL`,
    RIGHT:`SELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nRIGHT JOIN customers c\n  ON o.cust_id = c.cust_id;\n-- All customers kept; no order → NULL`,
    FULL: platform==="mysql"
      ?`-- MySQL: simulate FULL OUTER JOIN:\nSELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nLEFT JOIN customers c ON o.cust_id = c.cust_id\nUNION\nSELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nRIGHT JOIN customers c ON o.cust_id = c.cust_id\nWHERE o.order_id IS NULL;`
      :`SELECT o.order_id, c.name, o.amount, c.city\nFROM orders o\nFULL OUTER JOIN customers c\n  ON o.cust_id = c.cust_id;\n-- All rows from both tables`,
    CROSS:`SELECT o.order_id, c.name, o.amount\nFROM orders o\nCROSS JOIN customers c;\n-- ${ORDERS.length} × ${CUSTS.length} = ${ORDERS.length*CUSTS.length} rows\n-- No ON clause`,
  };
  const play=()=>{
    if(timer.current)clearInterval(timer.current);
    setPhase(0);setRunning(true);
    let p=0;
    timer.current=setInterval(()=>{p++;setPhase(p);if(p>=3){clearInterval(timer.current);setRunning(false);}},700);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Select a JOIN type with the buttons above, then click <strong>▶ Animate JOIN</strong>. Watch rows light up or dim based on whether they match. The result table appears after the animation.</Hint>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {Object.entries(jDefs).map(([k,v])=>(
          <button key={k} onClick={()=>{setJoinType(k);setPhase(0);setRunning(false);if(timer.current)clearInterval(timer.current);}} style={{padding:"5px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${joinType===k?v.color:"rgba(255,255,255,.08)"}`,background:joinType===k?`${v.color}14`:"rgba(255,255,255,.03)",color:joinType===k?v.color:T.grey,transition:"all .2s"}}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{background:`${def.color}09`,border:`1px solid ${def.color}28`,borderRadius:8,padding:"8px 14px",fontSize:11,color:T.greyLight}}>
        <strong style={{color:def.color}}>{def.label}:</strong> {def.desc}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"flex-start"}}>
        <div>
          <SLabel color={T.blue}>LEFT: orders ({ORDERS.length} rows)</SLabel>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.blue}22`}}>
            {ORDERS.map((o,i)=>{
              const matched=isMatchedLeft(o);
              const keep=leftVisible(o);
              const custStr=o.cust_id===null?"NULL":String(o.cust_id);
              const col=gc(String(o.cust_id));
              return(
                <div key={i} style={{padding:"5px 10px",borderBottom:i<ORDERS.length-1?`1px solid ${T.slate}44`:"none",display:"flex",gap:8,alignItems:"center",background:phase>0&&keep?`${col.bg}`:"transparent",opacity:phase>0?keep?1:.2:1,transition:"all .4s"}}>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.blue}}>#{o.order_id}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:o.cust_id===null?T.orange:col.text,fontWeight:700}}>cust:{custStr}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyLight,flex:1}}>${o.amount}</span>
                  {phase>0&&<span style={{fontSize:8,color:matched?T.green:T.greyDark}}>{matched?"✓":"✗"}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{paddingTop:24,textAlign:"center"}}>
          <div style={{fontSize:20,color:phase>=2?def.color:T.greyDark,transition:"color .4s"}}>→</div>
          <div style={{fontSize:7,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>join on<br/>cust_id</div>
        </div>
        <div>
          <SLabel color={T.green}>RIGHT: customers ({CUSTS.length} rows)</SLabel>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.green}22`}}>
            {CUSTS.map((c,i)=>{
              const matched=isMatchedRight(c);
              const keep=rightVisible(c);
              const col=gc(String(c.cust_id));
              return(
                <div key={i} style={{padding:"5px 10px",borderBottom:i<CUSTS.length-1?`1px solid ${T.slate}44`:"none",display:"flex",gap:8,alignItems:"center",background:phase>1&&keep?col.bg:"transparent",opacity:phase>1?keep?1:.2:1,transition:"all .4s"}}>
                  <span style={{fontSize:9,fontFamily:"monospace",color:col.text,fontWeight:700}}>#{c.cust_id}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyLight,flex:1}}>{c.name}</span>
                  {phase>1&&<span style={{fontSize:8,color:matched?T.green:T.greyDark}}>{matched?"✓":"✗"}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={play} disabled={running} style={{padding:"6px 18px",borderRadius:8,fontSize:10,cursor:running?"not-allowed":"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${def.color}55`,background:running?`${def.color}06`:`${def.color}14`,color:running?T.grey:def.color}}>
          {running?"Animating...":"▶ Animate JOIN"}
        </button>
        <button onClick={()=>{if(timer.current)clearInterval(timer.current);setPhase(0);setRunning(false);}} style={{padding:"6px 14px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:T.grey}}>Reset</button>
      </div>
      <SQLBlock code={sql[joinType]} platform={platform}/>
      {phase>=2&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <SLabel color={def.color}>RESULT — {result.length} row{result.length!==1?"s":""}</SLabel>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                {Object.keys(result[0]||{}).map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark,fontWeight:700}}>{c}</th>)}
              </tr></thead>
              <tbody>
                {result.map((row,ri)=>(
                  <tr key={ri} style={{borderBottom:ri<result.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*50}ms both`}}>
                    {Object.values(row).map((v,ci)=><td key={ci} style={{padding:"5px 10px",fontSize:10,color:v===null?T.greyDark:T.greyLight,fontStyle:v===null?"italic":"normal"}}>{v===null?"NULL":String(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{result.length} rows</div>
          </div>
          {result.some(r=>Object.values(r).some(v=>v===null))&&<div style={{marginTop:5,fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>NULL = no matching row in the other table</div>}
        </div>
      )}
    </div>
  );
}

function Module04({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"Why JOINs?",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>Databases split data into separate tables to avoid repetition. JOINs recombine them at query time using a shared column — a primary key on one side and a foreign key on the other.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <SLabel>orders (cust_id = FK)</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:".5fr 1fr 1.5fr 1fr",padding:"5px 10px",background:"rgba(4,9,20,.9)",borderBottom:`1px solid ${T.slate}`}}>
                {["order_id","cust_id","product","amount"].map(c=><span key={c} style={{fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>{c}</span>)}
              </div>
              {ORDERS.slice(0,4).map((o,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:".5fr 1fr 1.5fr 1fr",padding:"5px 10px",borderBottom:i<3?`1px solid ${T.slate}44`:"none"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{o.order_id}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:o.cust_id?gc(String(o.cust_id)).text:T.orange,fontWeight:700}}>{o.cust_id??<em>NULL</em>}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{o.product}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{o.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SLabel>customers (cust_id = PK)</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",padding:"5px 10px",background:"rgba(4,9,20,.9)",borderBottom:`1px solid ${T.slate}`}}>
                {["cust_id","name","tier"].map(c=><span key={c} style={{fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>{c}</span>)}
              </div>
              {CUSTS.slice(0,4).map((c,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",padding:"5px 10px",borderBottom:i<3?`1px solid ${T.slate}44`:"none"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:gc(String(c.cust_id)).text,fontWeight:700}}>{c.cust_id}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{c.name}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{c.tier}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SQLBlock platform={platform} code={`-- The shared column (cust_id) links them:\nSELECT o.order_id, c.name, o.amount, c.city\nFROM orders o              -- 'o' = alias for orders\nINNER JOIN customers c     -- 'c' = alias for customers\n  ON o.cust_id = c.cust_id; -- the join condition`}/>
        <Tip icon="🔑" title="ALWAYS USE TABLE ALIASES" color={pc}>When joining, prefix column names with the table alias (o.amount, c.name). Both tables may have a column with the same name — aliases prevent ambiguity errors.</Tip>
      </div>
    )},
    {title:"🛝 JOIN animator",content:()=><JoinMatchVisual platform={platform}/>},
    {title:"Self JOIN & multi-JOIN",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>A <strong style={{color:pc}}>self join</strong> joins a table to itself. Classic use: employee table with a mgr_id column that references another employee's id.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <SQLBlock platform={platform} code={`-- Each employee + their manager's name:\nSELECT\n  e.name      AS employee,\n  e.dept,\n  m.name      AS manager\nFROM employees e\nLEFT JOIN employees m  -- same table!\n  ON e.mgr_id = m.id;\n-- LEFT JOIN: include employees with no manager`}/>
          <div>
            <SLabel color={pc}>Result (first 5)</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              {EMP.slice(0,5).map((e,i)=>{const m=EMP.find(x=>x.id===e.mgr_id);return(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1.5fr",padding:"5px 10px",borderBottom:i<4?`1px solid ${T.slate}44`:"none"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{e.name}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyDark}}>{e.dept}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:m?T.blue:T.greyDark,fontStyle:m?"normal":"italic"}}>{m?m.name:"(none)"}</span>
                </div>
              );})}
            </div>
          </div>
        </div>
        <Warn>The most common JOIN mistake: <code style={{color:T.orange}}>FROM orders, customers</code> without an ON condition creates a Cartesian product — {ORDERS.length} × {CUSTS.length} = {ORDERS.length*CUSTS.length} rows. Always use explicit JOIN ... ON syntax.</Warn>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"INNER JOIN silently drops unmatched rows",wrong:`-- Want all employees + order count\nSELECT e.name, COUNT(o.order_id)\nFROM employees e\nINNER JOIN orders o ON e.id = o.cust_id\nGROUP BY e.name;\n-- Employees with no orders: MISSING!`,right:`SELECT e.name, COUNT(o.order_id) AS orders\nFROM employees e\nLEFT JOIN orders o ON e.id = o.cust_id\nGROUP BY e.name;\n-- All employees shown; 0 for those with no orders`,why:"INNER JOIN silently drops rows with no match. Use LEFT JOIN when you need ALL rows from the left table, including those without a match."},
      {title:"Cartesian product (missing ON condition)",wrong:`SELECT * FROM orders, customers;\n-- 6 orders × 5 customers = 30 rows!`,right:`SELECT o.order_id, c.name\nFROM orders o\nINNER JOIN customers c ON o.cust_id = c.cust_id;`,why:"Writing FROM table1, table2 without a WHERE/ON condition creates a Cartesian product — every row from table1 paired with every row from table2. On large tables this generates billions of rows."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"100 customers, 500 orders, 30 overlapping cust_ids. INNER JOIN returns how many rows?",options:["100 (all customers)","500 (all orders)","Orders that have a matching customer","30 (only overlapping IDs)"],correct:2,explanation:"INNER JOIN returns only orders where cust_id exists in the customers table. If 480 orders have a valid matching customer, 480 rows are returned. The 20 orders without a match are dropped."},
      {question:"MySQL natively supports FULL OUTER JOIN. True or false?",options:["True","False — MySQL has no FULL OUTER JOIN; must simulate with UNION"],correct:1,explanation:"MySQL does not support FULL OUTER JOIN. You must simulate it with a LEFT JOIN UNION RIGHT JOIN (filtering rows already found in the LEFT JOIN from the RIGHT JOIN)."},
      {type:"bug",question:"A developer wants all customers even those with no orders. What's wrong?",code:`SELECT c.name, SUM(o.amount) AS total\nFROM customers c\nINNER JOIN orders o ON c.cust_id = o.cust_id\nGROUP BY c.name;`,options:["SUM should be COUNT","INNER JOIN drops customers with no orders — should be LEFT JOIN","cust_id is the wrong column","GROUP BY should include c.cust_id"],correct:1,explanation:"INNER JOIN silently drops customers with no orders. Fix: use LEFT JOIN so all customers appear. COUNT(o.order_id) and SUM(o.amount) will naturally return 0/NULL for customers with no orders."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 05: SUBQUERIES & CTEs ─────────────────────────────────────────────
function SubqueryExecutionVisual({platform}){
  const pc=PLAT[platform].color;
  const [phase,setPhase]=useState(0);
  const avgSalary=Math.round(EMP.reduce((s,r)=>s+r.salary,0)/EMP.length);
  const aboveAvg=EMP.filter(r=>r.salary>avgSalary);
  const PHASES=[
    {label:"Full query",icon:"📝",desc:"The complete query with subquery"},
    {label:"Inner query runs",icon:"⚙️",desc:"Subquery executes first"},
    {label:"Result substituted",icon:"🔁",desc:"Subquery result replaces the subquery"},
    {label:"Outer query runs",icon:"✅",desc:"Outer query uses the computed value"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click any <strong>phase tab</strong> above to step through execution — inner query first, then substitution, then the outer result.</Hint>
      <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:`1px solid ${T.slate}`}}>
        {PHASES.map((p,i)=>(
          <button key={i} onClick={()=>setPhase(i)} style={{flex:1,padding:"9px 6px",border:"none",cursor:"pointer",background:phase===i?`${pc}18`:phase>i?`${pc}06`:"transparent",borderRight:i<3?`1px solid ${T.slate}`:"none",transition:"all .2s"}}>
            <div style={{fontSize:14,marginBottom:2}}>{p.icon}</div>
            <div style={{fontSize:8,fontWeight:700,color:phase>=i?pc:T.greyDark,fontFamily:"monospace"}}>{p.label}</div>
          </button>
        ))}
      </div>
      {phase===0&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"rgba(4,9,20,.95)",border:`1px solid ${pc}22`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:pc,fontFamily:"monospace",marginBottom:6,letterSpacing:.5}}>{PLAT[platform].icon} {PLAT[platform].label}</div>
            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.8,color:T.white}}>
              <span style={{color:pc}}>SELECT</span> name, salary{"\n"}
              <span style={{color:pc}}>FROM</span> employees{"\n"}
              <span style={{color:pc}}>WHERE</span> salary {`>`} <span style={{background:`${T.yellow}20`,border:`1px solid ${T.yellow}44`,borderRadius:4,padding:"1px 4px",color:T.yellow}}>({"\n"}  <span style={{color:pc}}>SELECT</span> <span style={{color:T.green}}>AVG</span>(salary) <span style={{color:pc}}>FROM</span> employees{"\n"})</span>;
            </pre>
          </div>
          <div style={{padding:"8px 12px",background:`${T.yellow}09`,border:`1px solid ${T.yellow}22`,borderRadius:8,fontSize:11,color:T.greyLight}}>
            The highlighted part in yellow is the <strong style={{color:T.yellow}}>subquery</strong>. It will execute first. Click <strong style={{color:T.white}}>Inner query runs →</strong>
          </div>
        </div>
      )}
      {phase===1&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"rgba(4,9,20,.95)",border:`1px solid ${T.yellow}44`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:T.yellow,fontFamily:"monospace",marginBottom:6}}>⚙️ INNER QUERY EXECUTING...</div>
            <SQLBlock code={`SELECT AVG(salary) FROM employees;\n-- Reads all 10 rows\n-- SUM = ${EMP.reduce((s,r)=>s+r.salary,0).toLocaleString()}\n-- COUNT = 10\n-- AVG = ${avgSalary.toLocaleString()}`} platform={platform}/>
          </div>
          <div style={{padding:"8px 12px",background:`${T.green}09`,border:`1px solid ${T.green}22`,borderRadius:8,fontSize:11,color:T.greyLight}}>
            ✓ Inner query returned: <strong style={{color:T.green,fontSize:14,fontFamily:"monospace"}}>{avgSalary.toLocaleString()}</strong>
          </div>
        </div>
      )}
      {phase===2&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"rgba(4,9,20,.95)",border:`1px solid ${pc}22`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:pc,fontFamily:"monospace",marginBottom:6}}>🔁 SUBQUERY REPLACED WITH RESULT</div>
            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.8,color:T.white}}>
              <span style={{color:pc}}>SELECT</span> name, salary{"\n"}
              <span style={{color:pc}}>FROM</span> employees{"\n"}
              <span style={{color:pc}}>WHERE</span> salary {`>`} <span style={{background:`${T.green}22`,border:`1px solid ${T.green}55`,borderRadius:4,padding:"1px 6px",color:T.green,fontSize:13,fontWeight:700}}>{avgSalary.toLocaleString()}</span>;
            </pre>
          </div>
          <div style={{padding:"8px 12px",background:`${pc}09`,border:`1px solid ${pc}22`,borderRadius:8,fontSize:11,color:T.greyLight}}>
            The WHERE clause is now effectively: <code style={{color:pc}}>salary &gt; {avgSalary.toLocaleString()}</code>. Now the outer query runs.
          </div>
        </div>
      )}
      {phase===3&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <SQLBlock code={`-- Outer query final result:\n-- Employees earning above ${avgSalary.toLocaleString()} (company average)\n-- Found: ${aboveAvg.length} employees`} platform={platform}/>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:pc}}>salary</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>vs avg ({avgSalary.toLocaleString()})</th>
              </tr></thead>
              <tbody>{aboveAvg.sort((a,b)=>b.salary-a.salary).map((r,ri)=>(
                <tr key={r.id} style={{borderBottom:ri<aboveAvg.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*50}ms both`}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.green,fontWeight:700}}>{r.salary.toLocaleString()}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.green}}>+{(r.salary-avgSalary).toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{aboveAvg.length} rows</div>
          </div>
        </div>
      )}
    </div>
  );
}

function CTELayerVisual({platform}){
  const pc=PLAT[platform].color;
  const [step,setStep]=useState(0);
  const deptStats=[
    {dept:"Engineering",headcount:4,avg_sal:89250,max_sal:93000},
    {dept:"Analytics",  headcount:3,avg_sal:72000,max_sal:75000},
    {dept:"Product",    headcount:3,avg_sal:68000,max_sal:71000},
  ];
  const highEarners=EMP.filter(e=>{const d=deptStats.find(d=>d.dept===e.dept);return d&&e.salary>d.avg_sal;}).map(e=>{const d=deptStats.find(d=>d.dept===e.dept);return{name:e.name,dept:e.dept,salary:e.salary,dept_avg:d.avg_sal,above:e.salary-d.avg_sal};}).sort((a,b)=>b.above-a.above);
  const STEPS=[
    {label:"WITH dept_stats",sql:`WITH dept_stats AS (\n  SELECT dept,\n    COUNT(*)    AS headcount,\n    AVG(salary) AS avg_sal,\n    MAX(salary) AS max_sal\n  FROM employees\n  GROUP BY dept\n)`,preview:deptStats,cols:["dept","headcount","avg_sal","max_sal"],desc:"CTE 1: aggregate salary stats per department. Not executed yet — just defined."},
    {label:"+ high_earners",sql:`WITH dept_stats AS (\n  SELECT dept, COUNT(*) AS headcount,\n    AVG(salary) AS avg_sal, MAX(salary) AS max_sal\n  FROM employees GROUP BY dept\n),\nhigh_earners AS (\n  SELECT e.name, e.dept, e.salary, d.avg_sal\n  FROM employees e\n  JOIN dept_stats d ON e.dept = d.dept\n  WHERE e.salary > d.avg_sal\n)`,preview:highEarners.map(e=>({name:e.name,dept:e.dept,salary:e.salary,dept_avg:e.dept_avg})),cols:["name","dept","salary","dept_avg"],desc:"CTE 2 references CTE 1 as if it were a real table. Finds employees above their dept average."},
    {label:"Final SELECT",sql:`WITH dept_stats AS (\n  SELECT dept, COUNT(*) AS headcount,\n    AVG(salary) AS avg_sal, MAX(salary) AS max_sal\n  FROM employees GROUP BY dept\n),\nhigh_earners AS (\n  SELECT e.name, e.dept, e.salary, d.avg_sal\n  FROM employees e\n  JOIN dept_stats d ON e.dept = d.dept\n  WHERE e.salary > d.avg_sal\n)\nSELECT h.name, h.dept, h.salary,\n  h.avg_sal AS dept_avg,\n  h.salary - h.avg_sal AS above_avg_by,\n  d.headcount\nFROM high_earners h\nJOIN dept_stats d ON h.dept = d.dept\nORDER BY above_avg_by DESC;`,preview:highEarners.map(e=>({name:e.name,dept:e.dept,salary:e.salary,above:e.above})),cols:["name","dept","salary","above"],desc:"Final SELECT references both CTEs like tables. The query reads naturally top-to-bottom."},
  ];
  const cur=STEPS[step];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click each <strong>numbered step</strong> above to build the CTE chain one layer at a time. Each step shows the SQL so far and a preview of what that CTE produces.</Hint>
      <div style={{display:"flex",gap:4}}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{padding:"5px 12px",borderRadius:18,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${step===i?pc:step>i?pc+"44":"rgba(255,255,255,.08)"}`,background:step===i?`${pc}18`:step>i?`${pc}08`:"transparent",color:step===i?pc:step>i?pc+"99":T.grey,transition:"all .2s",fontWeight:step===i?700:400}}>
            {step>i?"✓ ":""}{i+1}. {s.label}
          </button>
        ))}
      </div>
      <div style={{background:`${pc}09`,border:`1px solid ${pc}25`,borderRadius:8,padding:"8px 12px",fontSize:11,color:T.greyLight}}>{cur.desc}</div>
      <SQLBlock code={cur.sql} platform={platform}/>
      <div>
        <SLabel color={pc}>PREVIEW — {cur.preview.length} rows</SLabel>
        <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
              {cur.cols.map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark,fontWeight:700}}>{c}</th>)}
            </tr></thead>
            <tbody>{cur.preview.map((row,ri)=>(
              <tr key={ri} style={{borderBottom:ri<cur.preview.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*50}ms both`}}>
                {cur.cols.map(c=><td key={c} style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row[c]===null?"NULL":typeof row[c]==="number"?row[c].toLocaleString():String(row[c])}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Module05({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"How subqueries execute",content:()=><SubqueryExecutionVisual platform={platform}/>},
    {title:"Types of subqueries",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <SLabel>IN — value must be in list</SLabel>
            <SQLBlock platform={platform} code={`-- Orders from Lagos customers:\nSELECT order_id, amount\nFROM orders\nWHERE cust_id IN (\n  SELECT cust_id FROM customers\n  WHERE city = 'Lagos'\n);\n-- Inner query returns (101, 104)\n-- Outer: WHERE cust_id IN (101, 104)`}/>
          </div>
          <div>
            <SLabel>EXISTS — check if rows exist</SLabel>
            <SQLBlock platform={platform} code={`-- Customers who placed at least one order:\nSELECT name, city\nFROM customers c\nWHERE EXISTS (\n  SELECT 1  -- value doesn't matter\n  FROM orders o\n  WHERE o.cust_id = c.cust_id\n);\n-- EXISTS stops at first match → faster`}/>
          </div>
        </div>
        <Tip icon="⚡" title="IN vs EXISTS" color={pc}>Use <code style={{color:T.white}}>IN</code> for small static lists. Use <code style={{color:T.white}}>EXISTS</code> for large correlated subqueries — it short-circuits on first match. NEVER use <code style={{color:T.red}}>NOT IN</code> when the subquery can return NULLs (see Common Mistakes).</Tip>
      </div>
    )},
    {title:"🛝 CTE layer builder",content:()=><CTELayerVisual platform={platform}/>},
    {title:"CTE vs subquery",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><SLabel color={T.red}>Subquery — nested and hard to read</SLabel><SQLBlock platform={platform} code={`SELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN (\n  SELECT dept, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept\n) d ON e.dept = d.dept\nWHERE e.salary > d.avg_sal;`}/></div>
          <div><SLabel color={pc}>CTE — readable top-to-bottom ✓</SLabel><SQLBlock platform={platform} code={`WITH dept_avg AS (\n  SELECT dept, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept\n)\nSELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN dept_avg d ON e.dept = d.dept\nWHERE e.salary > d.avg_sal;`}/></div>
        </div>
        <Note color={pc}>CTEs produce identical results to subqueries. The advantages are purely readability and reusability — a CTE defined once can be referenced multiple times in the same query.</Note>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"NOT IN when subquery can return NULLs",wrong:`SELECT name FROM employees\nWHERE id NOT IN (SELECT mgr_id FROM employees);\n-- Returns 0 rows! (mgr_id has NULLs)`,right:`SELECT name FROM employees\nWHERE id NOT IN (\n  SELECT mgr_id FROM employees\n  WHERE mgr_id IS NOT NULL\n);`,why:"NOT IN (1, 2, NULL) = id≠1 AND id≠2 AND id≠NULL. The last clause is always UNKNOWN, making every row fail. Always filter NULLs from NOT IN subqueries, or use NOT EXISTS which handles NULLs correctly."},
      {title:"Correlated subquery in SELECT (N+1 problem)",wrong:`SELECT name,\n  (SELECT COUNT(*) FROM orders\n   WHERE orders.cust_id = employees.id)\nFROM employees;\n-- Executes 10 subqueries for 10 employees`,right:`SELECT e.name, COUNT(o.order_id) AS orders\nFROM employees e\nLEFT JOIN orders o ON e.id = o.cust_id\nGROUP BY e.name;\n-- Single pass — much faster`,why:"A correlated subquery in SELECT runs once per outer row. On 10,000 rows it runs 10,000 times. Use a JOIN + aggregate or window function for a single-pass solution."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"A subquery in WHERE: SELECT * FROM emp WHERE salary > (SELECT AVG(salary) FROM emp). How many times does the inner query run?",options:["Once per row of the outer query","Once for the entire query","It depends on row count","It runs in parallel"],correct:1,explanation:"A non-correlated scalar subquery in WHERE executes exactly once. Its result is computed, then reused for all rows in the outer query. A correlated subquery (referencing the outer table) would execute once per row."},
      {type:"bug",question:"Why does this return 0 rows even though some employees aren't managers?",code:`SELECT name FROM employees\nWHERE id NOT IN (\n  SELECT mgr_id FROM employees\n);`,options:["Subquery is missing a WHERE","NULL values in mgr_id cause NOT IN to return UNKNOWN for all rows","NOT IN doesn't work with subqueries","id should be compared to name"],correct:1,explanation:"mgr_id contains NULLs. NOT IN (1,2,NULL) evaluates id≠1 AND id≠2 AND id≠NULL. id≠NULL is always UNKNOWN, making the whole AND chain UNKNOWN for every row. Fix: add WHERE mgr_id IS NOT NULL to the subquery."},
      {question:"What is the main practical advantage of a CTE over a subquery?",options:["CTEs are always faster","CTEs are more readable and can be referenced multiple times","CTEs automatically add indexes","CTEs work in MySQL 5.x but subqueries don't"],correct:1,explanation:"CTEs produce the same query plan as subqueries — the performance is usually identical. The benefits are readability (you can name and explain each step) and reusability (reference the CTE multiple times without repeating code)."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 06: CASE ─────────────────────────────────────────────────────────
function CaseRowWalkthrough({platform}){
  const pc=PLAT[platform].color;
  const [whens,setWhens]=useState([
    {when:"salary >= 90000",then:"Senior",  id:1},
    {when:"salary >= 75000",then:"Mid-level",id:2},
    {when:"salary >= 65000",then:"Junior",  id:3},
  ]);
  const [elseVal,setElseVal]=useState("Unclassified");
  const [selectedRow,setSelectedRow]=useState(null);
  const evalCase=row=>{
    for(const w of whens){
      try{
        const expr=w.when.replace(/salary/g,String(row.salary)).replace(/hired/g,String(row.hired)).replace(/active/g,String(row.active));
        if(eval(expr))return{value:w.then,matchedWhen:w.when,matchedIdx:whens.indexOf(w)};
      }catch{}
    }
    return{value:elseVal,matchedWhen:null,matchedIdx:-1};
  };
  const addWhen=()=>setWhens(p=>[...p,{when:"salary >= ",then:"",id:Date.now()}]);
  const removeWhen=id=>setWhens(p=>p.filter(w=>w.id!==id));
  const update=(id,f,v)=>setWhens(p=>p.map(w=>w.id===id?{...w,[f]:v}:w));
  const resultRows=EMP.map(r=>({...r,tier:evalCase(r)}));
  const tiers=[...new Set(resultRows.map(r=>r.tier.value))];
  const sql=`SELECT name, salary,\n  CASE\n${whens.map(w=>`    WHEN ${w.when} THEN '${w.then}'`).join("\n")}\n    ELSE '${elseVal}'\n  END AS tier\nFROM employees;`;
  const selRow=selectedRow!==null?resultRows[selectedRow]:null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click any row in the right-hand table to trace its CASE evaluation on the left — conditions are tested top-to-bottom until the first match. Edit the WHEN/THEN inputs to change the logic live.</Hint>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:T.surface,border:`1px solid ${T.slate}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <SLabel color={pc}>CASE WHEN / THEN conditions</SLabel>
              <button onClick={addWhen} style={{padding:"3px 10px",borderRadius:14,fontSize:9,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${pc}55`,background:`${pc}14`,color:pc}}>+ Add WHEN</button>
            </div>
            {whens.map((w,i)=>(
              <div key={w.id} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,padding:"6px 8px",borderRadius:7,background:selRow&&selRow.tier.matchedIdx===i?"rgba(74,222,128,.1)":selRow&&selRow.tier.matchedIdx>i?"rgba(248,113,113,.06)":selRow&&i===0&&selRow.tier.matchedIdx===-1?"rgba(248,113,113,.06)":"rgba(255,255,255,.02)",border:`1px solid ${selRow&&selRow.tier.matchedIdx===i?T.green:T.slate}`,transition:"all .3s"}}>
                <span style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",minWidth:14}}>{i+1}</span>
                <span style={{fontSize:9,color:selRow?(selRow.tier.matchedIdx===i?T.green:selRow.tier.matchedIdx>i||selRow.tier.matchedIdx===-1?T.red:T.greyDark):pc,fontFamily:"monospace",fontWeight:700,minWidth:32,transition:"color .3s"}}>
                  {selRow?(selRow.tier.matchedIdx===i?"✓ WHEN":selRow.tier.matchedIdx>i?"✗ WHEN":"· WHEN"):"WHEN"}
                </span>
                <input value={w.when} onChange={e=>update(w.id,"when",e.target.value)} style={{flex:1,padding:"3px 7px",borderRadius:5,border:`1px solid ${T.slate}`,background:T.bg,color:T.white,fontSize:9,fontFamily:"monospace"}}/>
                <span style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",minWidth:28}}>THEN</span>
                <input value={w.then} onChange={e=>update(w.id,"then",e.target.value)} style={{width:80,padding:"3px 7px",borderRadius:5,border:`1px solid ${selRow&&selRow.tier.matchedIdx===i?T.green:T.slate}`,background:T.bg,color:selRow&&selRow.tier.matchedIdx===i?T.green:pc,fontSize:9,fontFamily:"monospace",fontWeight:selRow&&selRow.tier.matchedIdx===i?700:400}}/>
                <button onClick={()=>removeWhen(w.id)} style={{padding:"2px 6px",borderRadius:4,fontSize:8,cursor:"pointer",border:"1px solid rgba(248,113,113,.2)",background:"rgba(248,113,113,.07)",color:T.red}}>✕</button>
              </div>
            ))}
            <div style={{display:"flex",gap:6,alignItems:"center",padding:"6px 8px",borderRadius:7,background:selRow&&selRow.tier.matchedIdx===-1?"rgba(251,146,60,.1)":"rgba(255,255,255,.02)",border:`1px solid ${selRow&&selRow.tier.matchedIdx===-1?T.orange:T.slate}`,transition:"all .3s"}}>
              <span style={{minWidth:14}}/>
              <span style={{fontSize:9,color:selRow&&selRow.tier.matchedIdx===-1?T.orange:T.greyDark,fontFamily:"monospace",fontWeight:700,minWidth:32,transition:"color .3s"}}>{selRow&&selRow.tier.matchedIdx===-1?"→ ELSE":"ELSE"}</span>
              <input value={elseVal} onChange={e=>setElseVal(e.target.value)} style={{flex:1,padding:"3px 7px",borderRadius:5,border:`1px solid ${T.slate}`,background:T.bg,color:T.greyLight,fontSize:9,fontFamily:"monospace"}}/>
            </div>
          </div>
          {selRow&&(
            <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(74,222,128,.07)",border:`1px solid ${T.green}33`,animation:"popIn .2s ease"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.white,marginBottom:4}}>{selRow.name} ({selRow.salary.toLocaleString()})</div>
              {whens.map((w,i)=>{
                const passed=selRow.tier.matchedIdx===i;
                const tested=i<=selRow.tier.matchedIdx||selRow.tier.matchedIdx===-1;
                const skipped=selRow.tier.matchedIdx!==-1&&i>selRow.tier.matchedIdx;
                return(
                  <div key={w.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,opacity:skipped?.4:1}}>
                    <span style={{fontSize:10,color:passed?T.green:tested?T.red:T.greyDark,fontFamily:"monospace",fontWeight:700}}>{passed?"✓":tested?"✗":"·"}</span>
                    <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{w.when.replace("salary",selRow.salary.toLocaleString())}</span>
                    <span style={{fontSize:9,color:passed?T.green:tested?T.red:T.greyDark}}>→ {passed?"MATCHED":"false"}</span>
                  </div>
                );
              })}
              <div style={{marginTop:6,padding:"5px 8px",borderRadius:6,background:`${T.green}12`,border:`1px solid ${T.green}33`,fontSize:11,color:T.green,fontFamily:"monospace",fontWeight:700}}>
                Result: '{selRow.tier.value}' ({selRow.tier.matchedIdx===-1?"ELSE":whens[selRow.tier.matchedIdx].when})
              </div>
            </div>
          )}
          {!selRow&&<div style={{padding:"12px",borderRadius:9,background:"rgba(255,255,255,.02)",border:`1px solid ${T.slate}`,fontSize:10,color:T.greyDark,fontFamily:"monospace",textAlign:"center"}}>← click an employee row to trace their CASE evaluation</div>}
        </div>
        <div>
          <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
            {tiers.map(t=><span key={t} style={{fontSize:9,padding:"2px 8px",borderRadius:8,background:`${pc}10`,color:pc,fontFamily:"monospace"}}>{t}: {resultRows.filter(r=>r.tier.value===t).length}</span>)}
          </div>
          <SQLBlock code={sql} platform={platform}/>
          <div style={{marginTop:8,overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>salary</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:pc}}>tier →</th>
              </tr></thead>
              <tbody>{resultRows.map((row,ri)=>(
                <tr key={row.id} onClick={()=>setSelectedRow(selectedRow===ri?null:ri)} style={{borderBottom:ri<resultRows.length-1?`1px solid ${T.slate}44`:"none",cursor:"pointer",background:selectedRow===ri?`${pc}12`:"transparent",transition:"all .2s"}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.salary.toLocaleString()}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:pc,fontWeight:700}}>{row.tier.value}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Module06({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"CASE syntax",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}><strong style={{color:pc}}>CASE</strong> is SQL's if-then-else. It evaluates conditions <strong>top-to-bottom</strong> and returns the THEN value for the first WHEN that matches. If none match, ELSE is returned (or NULL if no ELSE).</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><SLabel color={pc}>Searched CASE — any condition</SLabel><SQLBlock platform={platform} code={`SELECT name, salary,\n  CASE\n    WHEN salary >= 90000 THEN 'Senior'\n    WHEN salary >= 75000 THEN 'Mid-level'\n    WHEN salary >= 65000 THEN 'Junior'\n    ELSE 'Trainee'\n  END AS tier\nFROM employees;\n-- Evaluated top-to-bottom\n-- First match wins`}/></div>
          <div><SLabel>Simple CASE — equality only</SLabel><SQLBlock platform={platform} code={`SELECT name, dept,\n  CASE dept\n    WHEN 'Engineering' THEN '⚙️ Eng'\n    WHEN 'Analytics'   THEN '📊 Data'\n    WHEN 'Product'     THEN '🎯 PM'\n    ELSE '❓ Other'\n  END AS dept_icon\nFROM employees;\n-- Only supports = comparisons\n-- Use searched CASE for >, <, LIKE etc.`}/></div>
        </div>
      </div>
    )},
    {title:"🛝 Per-row walkthrough",content:()=><CaseRowWalkthrough platform={platform}/>},
    {title:"CASE inside aggregates",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>One of the most powerful SQL patterns: CASE inside SUM/COUNT to conditionally aggregate. This is how you pivot data or count things by category.</Note>
        <SQLBlock platform={platform} code={`SELECT dept,\n  COUNT(*) AS total,\n  SUM(CASE WHEN salary >= 85000 THEN 1 ELSE 0 END) AS senior_count,\n  SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END)      AS inactive_count,\n  AVG(CASE WHEN active = 1 THEN salary END)         AS active_avg_salary\n  -- AVG with CASE: NULLs are ignored by AVG,\n  -- so inactive employees don't drag the average down\nFROM employees\nGROUP BY dept;`}/>
        <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
              {["dept","total","senior_count","inactive_count"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark,fontWeight:700}}>{c}</th>)}
            </tr></thead>
            <tbody>
              {[["Engineering",4,3,0],["Analytics",3,1,0],["Product",3,0,1]].map(([d,t,s,i],ri)=>{
                const col=gc(d);
                return(<tr key={d} style={{borderBottom:ri<2?`1px solid ${T.slate}44`:"none",background:col.bg}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:col.text,fontWeight:700}}>{d}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{t}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.blue}}>{s}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:i>0?T.red:T.greyLight}}>{i}</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </div>
    )},
    {title:"CASE in ORDER BY",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>CASE in ORDER BY lets you define custom sort priority rather than relying on alphabetical or numeric order.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <SQLBlock platform={platform} code={`SELECT order_id, status, amount\nFROM orders\nORDER BY\n  CASE status\n    WHEN 'pending'   THEN 1  -- top\n    WHEN 'completed' THEN 2\n    WHEN 'cancelled' THEN 3  -- bottom\n    ELSE 4\n  END,\n  amount DESC;  -- secondary sort`}/>
          <div>
            <SLabel color={pc}>Result — pending first</SLabel>
            <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              {[...ORDERS].sort((a,b)=>{const p={pending:1,completed:2,cancelled:3};return(p[a.status]||4)-(p[b.status]||4)||b.amount-a.amount;}).map((o,i)=>(
                <div key={o.order_id} style={{display:"grid",gridTemplateColumns:".5fr 1.5fr 1fr",padding:"5px 10px",borderBottom:i<ORDERS.length-1?`1px solid ${T.slate}44`:"none"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyDark}}>#{o.order_id}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:o.status==="pending"?T.yellow:o.status==="completed"?T.green:T.red}}>{o.status}</span>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>${o.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"A CASE expression has 3 WHEN conditions. A row matches conditions 2 and 3. What is returned?",options:["Both THEN values separated by comma","The THEN of condition 2 (first match wins)","The THEN of condition 3 (last match wins)","An error — can't match more than one WHEN"],correct:1,explanation:"CASE evaluates conditions top-to-bottom and returns the THEN value of the FIRST matching WHEN. Once a match is found, remaining conditions are skipped."},
      {type:"bug",question:"What is wrong with this CASE expression?",code:`CASE salary\n  WHEN > 90000 THEN 'Senior'\n  WHEN > 75000 THEN 'Mid'\n  ELSE 'Junior'\nEND`,options:["CASE cannot be used with salary","Simple CASE (CASE column WHEN value) only supports = — cannot use >","ELSE is required and missing","salary should be quoted"],correct:1,explanation:"The simple CASE form (CASE expression WHEN value) only supports equality. To use >, <, >=, etc., use searched CASE: CASE WHEN salary > 90000 THEN 'Senior' ..."},
      {question:"SUM(CASE WHEN active=1 THEN 1 ELSE 0 END) — what does this compute?",options:["The salary of active employees","The count of active employees per group","The average of 1s and 0s","It's invalid SQL"],correct:1,explanation:"For each row, CASE returns 1 if active=1, else 0. SUM adds up all the 1s — effectively counting the active employees in each group. This is a standard pattern for conditional counting."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 07: WINDOW FUNCTIONS ─────────────────────────────────────────────
function WindowSlider({platform}){
  const pc=PLAT[platform].color;
  const [fn,setFn]=useState("ROW_NUMBER");
  const [partBy,setPartBy]=useState("dept");
  const [ordCol,setOrdCol]=useState("salary");
  const [ordDir,setOrdDir]=useState("DESC");
  const [activeRow,setActiveRow]=useState(null);
  const [running,setRunning]=useState(false);
  const timers=useRef([]);
  const FNS=[
    {id:"ROW_NUMBER",  label:"ROW_NUMBER()",  desc:"Unique sequential number per partition — no ties"},
    {id:"RANK",        label:"RANK()",         desc:"Ties get same rank; next rank skips (1,1,3)"},
    {id:"DENSE_RANK",  label:"DENSE_RANK()",  desc:"Ties get same rank; no gaps (1,1,2)"},
    {id:"LAG",         label:"LAG(salary,1)",  desc:"Previous row's salary; NULL for first row"},
    {id:"LEAD",        label:"LEAD(salary,1)", desc:"Next row's salary; NULL for last row"},
    {id:"SUM_OVER",    label:"SUM() running", desc:"Cumulative salary within partition"},
  ];
  const sorted=[...EMP].sort((a,b)=>{
    const pa=String(a[partBy]),pb=String(b[partBy]);
    if(pa!==pb)return pa<pb?-1:1;
    const va=a[ordCol],vb=b[ordCol];
    return ordDir==="DESC"?vb-va:va-vb;
  });
  const groups={};sorted.forEach(r=>{const k=String(r[partBy]);if(!groups[k])groups[k]=[];groups[k].push(r);});
  const computed=[...sorted];
  Object.values(groups).forEach(gRows=>{
    let prevVal=null,denseRank=0,running=0;
    gRows.forEach((r,i)=>{
      const idx=sorted.findIndex(s=>s.id===r.id);
      if(r[ordCol]!==prevVal)denseRank++;
      running+=r[ordCol]||0;
      const sameAbove=i>0&&gRows[i-1][ordCol]===r[ordCol];
      computed[idx]._row_number=i+1;
      computed[idx]._rank=sameAbove?computed[sorted.findIndex(s=>s.id===gRows[i-1].id)]._rank:i+1;
      computed[idx]._dense_rank=denseRank;
      computed[idx]._lag=i>0?gRows[i-1][ordCol]:null;
      computed[idx]._lead=i<gRows.length-1?gRows[i+1][ordCol]:null;
      computed[idx]._sum_over=running;
      prevVal=r[ordCol];
    });
  });
  const fnKey={ROW_NUMBER:"_row_number",RANK:"_rank",DENSE_RANK:"_dense_rank",LAG:"_lag",LEAD:"_lead",SUM_OVER:"_sum_over"}[fn];
  const activeFn=FNS.find(f=>f.id===fn);
  const fnSql={ROW_NUMBER:"ROW_NUMBER()",RANK:"RANK()",DENSE_RANK:"DENSE_RANK()",LAG:`LAG(${ordCol}, 1)`,LEAD:`LEAD(${ordCol}, 1)`,SUM_OVER:`SUM(${ordCol})`}[fn];
  const play=()=>{
    timers.current.forEach(clearTimeout);timers.current=[];
    setActiveRow(null);setRunning(true);
    sorted.forEach((_,i)=>{
      const t=setTimeout(()=>{setActiveRow(i);if(i===sorted.length-1)setTimeout(()=>{setRunning(false);setActiveRow(null);},600);},(i+1)*350);
      timers.current.push(t);
    });
  };
  const sql=`SELECT name, ${partBy}, ${ordCol},\n  ${fnSql} OVER (\n    PARTITION BY ${partBy}\n    ORDER BY ${ordCol} ${ordDir}\n  ) AS result\nFROM employees;`;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Choose a function, PARTITION BY, and ORDER BY column. Then click <strong>▶ Animate</strong> to watch row-by-row computation. The blue line marks where a partition resets the calculation.</Hint>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div>
            <SLabel color={pc}>FUNCTION</SLabel>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {FNS.map(f=><button key={f.id} onClick={()=>{setFn(f.id);setActiveRow(null);setRunning(false);}} style={{padding:"3px 9px",borderRadius:7,fontSize:9,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${fn===f.id?pc:"rgba(255,255,255,.1)"}`,background:fn===f.id?`${pc}18`:"transparent",color:fn===f.id?pc:T.grey,transition:"all .18s"}}>{f.label}</button>)}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <SLabel>PARTITION BY</SLabel>
              <select value={partBy} onChange={e=>{setPartBy(e.target.value);setActiveRow(null);}} style={{width:"100%",padding:"5px 8px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.surface,color:T.white,fontSize:10,fontFamily:"monospace"}}>
                {["dept","city","hired","active"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <SLabel>ORDER BY (in OVER)</SLabel>
              <div style={{display:"flex",gap:4}}>
                <select value={ordCol} onChange={e=>{setOrdCol(e.target.value);setActiveRow(null);}} style={{flex:1,padding:"5px 8px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.surface,color:T.white,fontSize:10,fontFamily:"monospace"}}>
                  {["salary","hired","id"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <select value={ordDir} onChange={e=>setOrdDir(e.target.value)} style={{width:52,padding:"5px 4px",borderRadius:7,border:`1px solid ${T.slate}`,background:T.surface,color:T.white,fontSize:10,fontFamily:"monospace"}}>
                  <option>DESC</option><option>ASC</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{background:`${pc}09`,border:`1px solid ${pc}25`,borderRadius:8,padding:"8px 12px",fontSize:11,color:T.greyLight}}><strong style={{color:pc}}>{activeFn.label}:</strong> {activeFn.desc}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={play} disabled={running} style={{padding:"6px 16px",borderRadius:8,fontSize:10,cursor:running?"not-allowed":"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${pc}55`,background:running?`${pc}06`:`${pc}18`,color:running?T.grey:pc}}>{running?"⚙️ Animating...":"▶ Animate"}</button>
            <button onClick={()=>{timers.current.forEach(clearTimeout);setActiveRow(null);setRunning(false);}} style={{padding:"6px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:T.grey}}>Reset</button>
          </div>
          <SQLBlock code={sql} platform={platform}/>
        </div>
        <div>
          <SLabel color={pc}>ROW-BY-ROW COMPUTATION</SLabel>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>{partBy}</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>{ordCol}</th>
                <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:pc}}>result ▼</th>
              </tr></thead>
              <tbody>{computed.map((row,ri)=>{
                const isDone=activeRow!==null&&ri<=activeRow;
                const isActive=activeRow===ri;
                const prev=ri>0?computed[ri-1]:null;
                const isNewPart=prev&&String(row[partBy])!==String(prev[partBy]);
                return(
                  <tr key={row.id} style={{borderBottom:ri<computed.length-1?`1px solid ${T.slate}44`:"none",borderTop:isNewPart?`2px solid ${pc}44`:"none",background:isActive?`${pc}22`:isDone?`${pc}08`:"transparent",transition:"all .2s"}}>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:isNewPart||ri===0?pc:T.greyLight,fontWeight:isNewPart||ri===0?700:400}}>{String(row[partBy])}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{typeof row[ordCol]==="number"?row[ordCol].toLocaleString():row[ordCol]}</td>
                    <td style={{padding:"5px 10px",fontSize:11}}>
                      {isDone?(
                        <span style={{color:pc,fontWeight:700,animation:isActive?"popIn .2s ease":"none"}}>{row[fnKey]===null?"NULL":typeof row[fnKey]==="number"?row[fnKey].toLocaleString():String(row[fnKey])}</span>
                      ):<span style={{color:T.greyDark}}>—</span>}
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
            <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>Blue line = partition boundary (function resets)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Module07({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"GROUP BY vs window functions",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>Window functions compute a value for each row using related rows — without collapsing them. Every input row stays as an output row. This is the key difference from GROUP BY.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <SLabel color={T.red}>GROUP BY — collapses (10 → 3 rows)</SLabel>
            <SQLBlock platform={platform} code={`SELECT dept, AVG(salary)\nFROM employees\nGROUP BY dept;\n-- 3 rows out\n-- Individual names: gone`}/>
          </div>
          <div>
            <SLabel color={pc}>WINDOW — keeps all rows (10 → 10)</SLabel>
            <SQLBlock platform={platform} code={`SELECT name, dept, salary,\n  AVG(salary) OVER (\n    PARTITION BY dept\n  ) AS dept_avg\nFROM employees;\n-- 10 rows out — nobody lost!\n-- Each row gets its dept average`}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{dept:"Engineering",rows:[{name:"Ifeoma",salary:93000},{name:"Chidi",salary:91000},{name:"Funke",salary:88000},{name:"Amara",salary:85000}],avg:89250},
            {dept:"Analytics",rows:[{name:"Efe",salary:75000},{name:"Bola",salary:72000},{name:"Henry",salary:69000}],avg:72000}].map(g=>(
            <div key={g.dept} style={{border:`1px solid ${gc(g.dept).border}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{padding:"5px 10px",background:gc(g.dept).bg,fontSize:9,color:gc(g.dept).text,fontFamily:"monospace",fontWeight:700}}>{g.dept} — dept_avg = {g.avg.toLocaleString()}</div>
              {g.rows.map((r,ri)=>(
                <div key={ri} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",padding:"4px 10px",borderBottom:ri<g.rows.length-1?`1px solid ${gc(g.dept).border}22`:"none"}}>
                  <span style={{fontSize:9,fontFamily:"monospace",color:gc(g.dept).text}}>{r.name}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyLight}}>{r.salary.toLocaleString()}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:gc(g.dept).text,fontWeight:700}}>{g.avg.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )},
    {title:"🛝 Window animator",content:()=><WindowSlider platform={platform}/>},
    {title:"LAG, LEAD & running totals",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <SQLBlock platform={platform} code={`-- LAG: access previous row\nSELECT order_id, amount,\n  LAG(amount, 1)  OVER (ORDER BY order_id)\n    AS prev_amount,\n  amount - LAG(amount,1,0)\n    OVER (ORDER BY order_id) AS change\nFROM orders;\n\n-- LAG(col, n, default)\n-- n rows behind; default if no prev row`}/>
          <SQLBlock platform={platform} code={`-- Running total (cumulative sum):\nSELECT order_id, amount,\n  SUM(amount) OVER (\n    ORDER BY order_id\n    ROWS BETWEEN UNBOUNDED PRECEDING\n             AND CURRENT ROW\n  ) AS running_total\nFROM orders;\n\n-- Without ORDER BY: grand total\n-- (same number on every row)`}/>
        </div>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"Referencing window function result in WHERE",wrong:`SELECT name, RANK() OVER (ORDER BY salary DESC) AS rnk\nFROM employees\nWHERE RANK() OVER (ORDER BY salary DESC) <= 3;\n-- ERROR: window functions not allowed in WHERE`,right:`WITH ranked AS (\n  SELECT name, salary,\n    RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT name, salary FROM ranked WHERE rnk <= 3;`,why:"Window functions run during SELECT processing — after WHERE. Wrap the query in a CTE or subquery and filter the outer query."},
      {title:"SUM OVER without ORDER BY — gives grand total, not running total",wrong:`SELECT order_id, amount,\n  SUM(amount) OVER () AS running_total\nFROM orders;\n-- Every row gets the SAME number (grand total)`,right:`SELECT order_id, amount,\n  SUM(amount) OVER (\n    ORDER BY order_id\n    ROWS UNBOUNDED PRECEDING\n  ) AS running_total\nFROM orders;`,why:"Without ORDER BY inside OVER(), the window covers the entire partition — giving you the grand total on every row. ORDER BY makes the window cumulative from the first row to the current row."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"You want exactly 1 row per department with the highest salary. Which function guarantees this?",options:["RANK() — filter where rank=1 (may return multiple if tied)","ROW_NUMBER() — filter where row_num=1 (always exactly 1)","DENSE_RANK()","NTILE(1)"],correct:1,explanation:"ROW_NUMBER() assigns a unique sequential number — even if two rows have the same salary, only one gets row_num=1. RANK() and DENSE_RANK() assign the same rank to ties, potentially returning multiple 'rank=1' rows."},
      {type:"bug",question:"A developer wants a running total but all rows have the same value. Why?",code:`SELECT order_id, amount,\n  SUM(amount) OVER () AS running_total\nFROM orders;`,options:["SUM can't be used as a window function","OVER() without ORDER BY means the window covers all rows — giving grand total not running total","Missing PARTITION BY","The result column should be named differently"],correct:1,explanation:"OVER() with no ORDER BY makes the window cover the entire partition for every row. SUM returns the grand total. Add ORDER BY order_id (and optionally ROWS UNBOUNDED PRECEDING) to make it cumulative."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 08: SET OPERATIONS ────────────────────────────────────────────────
function SetOpVisual({platform}){
  const pc=PLAT[platform].color;
  const [op,setOp]=useState("UNION_ALL");
  const [step,setStep]=useState(0);
  const timer=useRef(null);
  const left=[{id:1,name:"Lagos"},{id:2,name:"Accra"},{id:3,name:"Nairobi"},{id:4,name:"Lagos"}];
  const right=[{id:3,name:"Nairobi"},{id:4,name:"Lagos"},{id:5,name:"Abuja"},{id:6,name:"Cairo"}];
  const getResult=()=>{
    const combined=[...left,...right];
    if(op==="UNION_ALL")return combined;
    if(op==="UNION"){const s=new Set();return combined.filter(r=>{if(s.has(r.name))return false;s.add(r.name);return true;});}
    if(op==="INTERSECT")return left.filter(l=>right.some(r=>r.name===l.name)).filter((v,i,a)=>a.findIndex(x=>x.name===v.name)===i);
    if(op==="EXCEPT")return left.filter(l=>!right.some(r=>r.name===l.name));
    return [];
  };
  const result=getResult();
  const OPS=[
    {id:"UNION_ALL",label:"UNION ALL", color:T.blue,  desc:"All rows from both — keeps duplicates"},
    {id:"UNION",    label:"UNION",     color:T.green, desc:"All rows — removes duplicates"},
    {id:"INTERSECT",label:"INTERSECT", color:T.yellow,desc:"Only rows in BOTH sets"},
    {id:"EXCEPT",   label:"EXCEPT",   color:T.red,   desc:"Left minus right — rows NOT in right"},
  ];
  const oc=OPS.find(o=>o.id===op);
  const play=()=>{
    if(timer.current)clearInterval(timer.current);
    setStep(0);let s=0;
    timer.current=setInterval(()=>{s++;setStep(s);if(s>=2)clearInterval(timer.current);},700);
  };
  const leftSurvives=r=>{
    if(op==="UNION_ALL"||op==="UNION"||op==="EXCEPT")return true;
    if(op==="INTERSECT")return right.some(x=>x.name===r.name);
    return true;
  };
  const rightSurvives=r=>{
    if(op==="UNION_ALL"||op==="UNION")return true;
    if(op==="INTERSECT")return left.some(x=>x.name===r.name);
    if(op==="EXCEPT")return false;
    return true;
  };
  const isDuplicate=(r,side)=>{
    if(op!=="UNION")return false;
    if(side==="left"){const seen=new Set(left.slice(0,left.indexOf(r)).map(x=>x.name));if(seen.has(r.name))return true;}
    if(side==="right"){const allLeft=left.map(x=>x.name);if(allLeft.includes(r.name))return true;const seenRight=new Set(right.slice(0,right.indexOf(r)).map(x=>x.name));if(seenRight.has(r.name))return true;}
    return false;
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Click a set operation button, then click <strong>▶ Animate</strong>. Watch which rows survive (stay bright) and which are dropped (dim). The result table appears below.</Hint>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {OPS.map(o=>(
          <button key={o.id} onClick={()=>{setOp(o.id);setStep(0);if(timer.current)clearInterval(timer.current);}} style={{flex:1,minWidth:80,padding:"7px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${op===o.id?o.color:"rgba(255,255,255,.08)"}`,background:op===o.id?`${o.color}14`:"rgba(255,255,255,.03)",color:op===o.id?o.color:T.grey,transition:"all .2s"}}>
            {o.label}
          </button>
        ))}
      </div>
      <div style={{background:`${oc.color}09`,border:`1px solid ${oc.color}28`,borderRadius:8,padding:"7px 12px",fontSize:11,color:T.greyLight}}>
        <strong style={{color:oc.color}}>{oc.label}:</strong> {oc.desc}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10}}>
        <div>
          <SLabel color={T.blue}>Left set (2023)</SLabel>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.blue}22`}}>
            {left.map((r,i)=>{
              const survive=step>0&&leftSurvives(r);
              const dup=step>0&&isDuplicate(r,"left");
              return(<div key={i} style={{padding:"6px 10px",borderBottom:i<left.length-1?`1px solid ${T.slate}44`:"none",display:"flex",gap:8,alignItems:"center",background:survive&&!dup?"rgba(96,165,250,.1)":"transparent",opacity:step>0?(survive&&!dup?1:.2):1,transition:"all .4s"}}>
                <span style={{fontSize:10,fontFamily:"monospace",color:T.blue,fontWeight:700}}>{r.name}</span>
                {step>0&&dup&&<span style={{fontSize:8,color:T.orange,fontFamily:"monospace"}}>dup</span>}
                {step>0&&!leftSurvives(r)&&<span style={{fontSize:8,color:T.red,fontFamily:"monospace"}}>✗ excluded</span>}
              </div>);
            })}
          </div>
        </div>
        <div style={{paddingTop:24,textAlign:"center",fontSize:14,color:oc.color,fontFamily:"monospace",fontWeight:700,transition:"color .3s"}}>{oc.label}</div>
        <div>
          <SLabel color={T.green}>Right set (2024)</SLabel>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.green}22`}}>
            {right.map((r,i)=>{
              const survive=step>1&&rightSurvives(r);
              const dup=step>1&&isDuplicate(r,"right");
              return(<div key={i} style={{padding:"6px 10px",borderBottom:i<right.length-1?`1px solid ${T.slate}44`:"none",display:"flex",gap:8,alignItems:"center",background:survive&&!dup?"rgba(74,222,128,.08)":"transparent",opacity:step>1?(survive&&!dup?1:.2):1,transition:"all .4s"}}>
                <span style={{fontSize:10,fontFamily:"monospace",color:T.green,fontWeight:700}}>{r.name}</span>
                {step>1&&dup&&<span style={{fontSize:8,color:T.orange,fontFamily:"monospace"}}>dup</span>}
                {step>1&&!rightSurvives(r)&&<span style={{fontSize:8,color:T.red,fontFamily:"monospace"}}>✗ excluded</span>}
              </div>);
            })}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={play} style={{padding:"6px 16px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${oc.color}55`,background:`${oc.color}14`,color:oc.color}}>▶ Animate</button>
        <button onClick={()=>{if(timer.current)clearInterval(timer.current);setStep(0);}} style={{padding:"6px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:T.grey}}>Reset</button>
      </div>
      <PlatformDiff title={`${oc.label} syntax`} diffs={[
        {platform:"mysql",    code:op==="UNION_ALL"?`SELECT city FROM employees_2023\nUNION ALL\nSELECT city FROM employees_2024;\n-- Keeps ALL rows including duplicates`:op==="UNION"?`SELECT city FROM employees_2023\nUNION\nSELECT city FROM employees_2024;\n-- Removes duplicates (hidden DISTINCT)`:op==="INTERSECT"?`-- MySQL 8.0.31+: INTERSECT supported\nSELECT city FROM employees_2023\nINTERSECT\nSELECT city FROM employees_2024;\n\n-- Older MySQL: use INNER JOIN\nSELECT DISTINCT a.city\nFROM emp_2023 a\nINNER JOIN emp_2024 b ON a.city=b.city;`:`-- MySQL 8.0.31+: EXCEPT supported\nSELECT city FROM employees_2023\nEXCEPT\nSELECT city FROM employees_2024;\n\n-- Older MySQL:\nSELECT DISTINCT city FROM emp_2023\nWHERE city NOT IN (SELECT city FROM emp_2024);`,note:op==="INTERSECT"||op==="EXCEPT"?"MySQL 8.0.31+ supports INTERSECT and EXCEPT":"UNION and UNION ALL work in all MySQL versions"},
        {platform:"postgres", code:op==="UNION_ALL"?`SELECT city FROM employees_2023\nUNION ALL\nSELECT city FROM employees_2024;`:op==="UNION"?`SELECT city FROM employees_2023\nUNION\nSELECT city FROM employees_2024;`:op==="INTERSECT"?`SELECT city FROM employees_2023\nINTERSECT\nSELECT city FROM employees_2024;`:`SELECT city FROM employees_2023\nEXCEPT\nSELECT city FROM employees_2024;\n-- PostgreSQL uses EXCEPT (not MINUS)`,note:"PostgreSQL supports all four set operations"},
        {platform:"sqlserver",code:op==="UNION_ALL"?`SELECT city FROM employees_2023\nUNION ALL\nSELECT city FROM employees_2024;`:op==="UNION"?`SELECT city FROM employees_2023\nUNION\nSELECT city FROM employees_2024;`:op==="INTERSECT"?`SELECT city FROM employees_2023\nINTERSECT\nSELECT city FROM employees_2024;`:`SELECT city FROM employees_2023\nEXCEPT\nSELECT city FROM employees_2024;\n-- SQL Server uses EXCEPT (not MINUS)\n-- Oracle uses MINUS (not EXCEPT)`,note:"SQL Server supports all four. Uses EXCEPT not MINUS."},
      ]}/>
      {step>=2&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <SLabel color={oc.color}>RESULT — {result.length} row{result.length!==1?"s":""}</SLabel>
          <div style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
            {result.map((r,i)=>(
              <div key={i} style={{padding:"6px 12px",borderBottom:i<result.length-1?`1px solid ${T.slate}44`:"none",background:i%2===0?"rgba(255,255,255,.02)":"transparent",animation:`rowAppear .3s ease ${i*50}ms both`}}>
                <span style={{fontSize:11,fontFamily:"monospace",color:oc.color,fontWeight:700}}>{r.name}</span>
              </div>
            ))}
            <div style={{padding:"4px 12px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{result.length} rows</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Module08({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"Set operations overview",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>Set operations combine two SELECT result sets. Both queries must return the same number of columns with compatible types. Column names come from the first query.</Note>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{op:"UNION ALL",color:T.blue,desc:"All rows from both. Keeps duplicates. Fastest."},
            {op:"UNION",color:T.green,desc:"All rows from both. Removes duplicates. Slower."},
            {op:"INTERSECT",color:T.yellow,desc:"Only rows that appear in BOTH result sets."},
            {op:"EXCEPT/MINUS",color:T.red,desc:"Rows in first NOT in second. MySQL: use NOT IN."},
          ].map(o=>(
            <div key={o.op} style={{background:`${o.color}09`,border:`1px solid ${o.color}25`,borderRadius:8,padding:"10px 12px"}}>
              <code style={{fontSize:11,color:o.color,fontFamily:"monospace",display:"block",marginBottom:4,fontWeight:700}}>{o.op}</code>
              <div style={{fontSize:10,color:T.greyLight,lineHeight:1.5}}>{o.desc}</div>
            </div>
          ))}
        </div>
        <Warn>Both queries must return the <strong>same number of columns</strong> with compatible types. <code style={{color:T.orange}}>SELECT name FROM a UNION SELECT name, city FROM b</code> is an error.</Warn>
      </div>
    )},
    {title:"🛝 Set operation visualizer",content:()=><SetOpVisual platform={platform}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"Query A returns 100 rows, Query B returns 150 rows with 30 overlapping values. UNION ALL returns how many rows?",options:["220 (deduplication happened)","250 (100 + 150, all rows)","30 (only overlapping)","120 (A + unique B)"],correct:1,explanation:"UNION ALL returns ALL rows from both queries without deduplication: 100 + 150 = 250 rows. UNION would deduplicate and return 220 rows (100 + 150 - 30 overlapping)."},
      {type:"bug",question:"A developer wants cities in 2023 data but NOT in 2024. What's wrong?",code:`SELECT city FROM employees_2023\nUNION\nSELECT city FROM employees_2024;`,options:["Should be UNION ALL","Should be EXCEPT / NOT IN — UNION gives you cities from BOTH","Should use INTERSECT","Should use JOIN"],correct:1,explanation:"UNION combines both sets. To find rows in the first set that are absent from the second, use EXCEPT (PostgreSQL/SQL Server) or NOT IN (MySQL). UNION gives you all cities from both years combined."},
      {question:"Why should you prefer UNION ALL over UNION when duplicates are acceptable?",options:["UNION ALL requires less memory","UNION ALL skips the hidden DISTINCT step — faster and less CPU","UNION ALL supports more column types","UNION ALL works across platforms better"],correct:1,explanation:"UNION performs a hidden DISTINCT operation, which requires sorting and deduplication — expensive on large datasets. UNION ALL simply appends rows without processing. Always use UNION ALL unless you specifically need deduplication."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 09: NULL HANDLING ─────────────────────────────────────────────────
function NullPropagationExplorer({platform}){
  const pc=PLAT[platform].color;
  const [expr,setExpr]=useState("salary + bonus");
  const [showFix,setShowFix]=useState(false);
  const DATA=[
    {name:"Amara",  salary:85000,bonus:5000, active:1},
    {name:"Bola",   salary:72000,bonus:null, active:1},
    {name:"Chidi",  salary:91000,bonus:8000, active:1},
    {name:"Dami",   salary:68000,bonus:null, active:0},
    {name:"Efe",    salary:75000,bonus:2000, active:1},
  ];
  const EXPRESSIONS=[
    {label:"salary + bonus",   fn:r=>r.bonus!==null?r.salary+r.bonus:null, fixed:r=>r.salary+(r.bonus||0), fixExpr:"salary + COALESCE(bonus, 0)"},
    {label:"salary * 1.1",     fn:r=>Math.round(r.salary*1.1),             fixed:r=>Math.round(r.salary*1.1), fixExpr:"salary * 1.1  (no NULLs here)"},
    {label:"salary / bonus",   fn:r=>r.bonus!==null&&r.bonus!==0?Math.round(r.salary/r.bonus):null, fixed:r=>r.bonus?Math.round(r.salary/r.bonus):null, fixExpr:"NULLIF(bonus, 0) — prevent divide-by-zero"},
    {label:"bonus > 3000",     fn:r=>r.bonus===null?null:r.bonus>3000?true:false, fixed:r=>r.bonus===null?false:r.bonus>3000, fixExpr:"COALESCE(bonus, 0) > 3000"},
    {label:"COALESCE(bonus,0)",fn:r=>r.bonus!==null?r.bonus:0,             fixed:r=>r.bonus!==null?r.bonus:0, fixExpr:"COALESCE(bonus, 0)  ← already the fix"},
  ];
  const active=EXPRESSIONS.find(e=>e.label===expr)||EXPRESSIONS[0];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click any expression button to test it against the data. Rows with NULL inputs turn red — NULL infected the result. Click <strong>Show fix →</strong> to see the corrected version side by side.</Hint>
      <div>
        <SLabel color={pc}>EXPRESSION — click to test</SLabel>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {EXPRESSIONS.map(e=><button key={e.label} onClick={()=>{setExpr(e.label);setShowFix(false);}} style={{padding:"5px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${expr===e.label?pc:"rgba(255,255,255,.1)"}`,background:expr===e.label?`${pc}18`:"transparent",color:expr===e.label?pc:T.grey,transition:"all .18s"}}>{e.label}</button>)}
        </div>
      </div>
      <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>name</th>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>salary</th>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.orange}}>bonus (nullable)</th>
            <th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:pc}}>{expr}</th>
            {showFix&&<th style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.green}}>{active.fixExpr}</th>}
          </tr></thead>
          <tbody>{DATA.map((row,ri)=>{
            const raw=active.fn(row);
            const fixed=active.fixed(row);
            const isNull=raw===null;
            return(
              <tr key={ri} style={{borderBottom:ri<DATA.length-1?`1px solid ${T.slate}44`:"none",background:isNull?"rgba(248,113,113,.06)":"transparent",transition:"background .3s"}}>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.salary.toLocaleString()}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:row.bonus===null?T.orange:T.greyLight,fontStyle:row.bonus===null?"italic":"normal",fontWeight:row.bonus===null?700:400}}>{row.bonus===null?"NULL":row.bonus.toLocaleString()}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:isNull?T.red:T.green,fontWeight:700,fontStyle:isNull?"italic":"normal"}}>
                  {isNull?"NULL ← NULL infected result":typeof raw==="boolean"?String(raw).toUpperCase():typeof raw==="number"?raw.toLocaleString():String(raw)}
                </td>
                {showFix&&<td style={{padding:"5px 10px",fontSize:10,color:T.green,fontWeight:700}}>{fixed===null?"NULL":typeof fixed==="boolean"?String(fixed).toUpperCase():typeof fixed==="number"?fixed.toLocaleString():String(fixed)}</td>}
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {DATA.some(r=>active.fn(r)===null)&&(
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{padding:"8px 12px",borderRadius:8,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",fontSize:11,color:T.greyLight,flex:1}}>
            <strong style={{color:T.red}}>⚠️ NULL propagation:</strong> rows with NULL bonus produce NULL results. These rows are silently excluded from aggregates like SUM and AVG.
          </div>
          <button onClick={()=>setShowFix(!showFix)} style={{padding:"7px 14px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${T.green}55`,background:showFix?`${T.green}18`:"transparent",color:T.green,whiteSpace:"nowrap"}}>
            {showFix?"← Hide fix":"Show fix →"}
          </button>
        </div>
      )}
      {showFix&&<SQLBlock platform={platform} code={`-- Fix: ${active.fixExpr}\nSELECT name, ${active.fixExpr} AS result\nFROM employees;`}/>}
    </div>
  );
}

function Module09({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"What NULL means",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}><strong style={{color:pc}}>NULL</strong> means "unknown value" — not zero, not empty string, not false. It represents the absence of data. This distinction causes most NULL-related bugs.</Note>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{val:"NULL",desc:"Unknown — no value",color:T.orange,code:`NULL\n-- salary IS NULL\n-- The person's salary is unknown\n-- Different from salary = 0!`},
            {val:"0",   desc:"Known value: zero",color:T.blue,code:`0\n-- salary = 0\n-- The person earns zero\n-- Measurable and definite`},
            {val:"''",  desc:"Known value: empty string",color:T.green,code:`''\n-- name = ''\n-- The name IS empty\n-- Not the same as name IS NULL`}
          ].map(i=>(
            <div key={i.val} style={{border:`1px solid ${i.color}33`,borderRadius:8,padding:"12px",background:`${i.color}08`}}>
              <div style={{fontSize:22,fontWeight:800,color:i.color,fontFamily:"'Syne',sans-serif",marginBottom:4}}>{i.val}</div>
              <div style={{fontSize:10,color:T.greyLight,marginBottom:8}}>{i.desc}</div>
              <SQLBlock code={i.code} label="SQL"/>
            </div>
          ))}
        </div>
        <Tip icon="🧠" title="THREE-VALUED LOGIC" color={pc}>SQL comparisons don't just return TRUE or FALSE — they can return <strong style={{color:T.orange}}>UNKNOWN</strong> when NULL is involved. Only IS NULL and IS NOT NULL can test for NULL directly. WHERE and HAVING only keep rows that evaluate to TRUE — UNKNOWN rows are dropped.</Tip>
      </div>
    )},
    {title:"🛝 NULL propagation explorer",content:()=><NullPropagationExplorer platform={platform}/>},
    {title:"NULL functions",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <PlatformDiff title="Handling NULL values" diffs={[
          {platform:"mysql",    code:`-- Replace NULL with a default:\nCOALESCE(bonus, 0)       -- standard\nIFNULL(bonus, 0)         -- MySQL only\n\n-- Prevent divide-by-zero:\nCOALESCE(NULLIF(divisor, 0), 1)\n\n-- Return NULL if values match:\nNULLIF(a, b)\n-- NULLIF(status,'pending') → NULL\n-- if status='pending'`,note:"IFNULL is MySQL-specific; use COALESCE for portability"},
          {platform:"postgres", code:`-- Standard SQL (works everywhere):\nCOALESCE(bonus, 0)\nNULLIF(a, b)\n\n-- First non-NULL from a list:\nCOALESCE(bonus, commission, 0)\n\n-- PostgreSQL-specific:\n-- NVL not available (Oracle only)\n-- Use COALESCE instead`,note:"COALESCE and NULLIF are ANSI standard"},
          {platform:"sqlserver",code:`-- Standard:\nCOALESCE(bonus, 0)\nNULLIF(a, b)\n\n-- SQL Server specific:\nISNULL(bonus, 0)   -- similar to IFNULL\n-- ISNULL is faster but only 2 args\n-- COALESCE accepts multiple args\n\nSELECT COALESCE(col1, col2, col3, 0)`,note:"ISNULL is SQL Server-specific; COALESCE is portable"},
        ]}/>
      </div>
    )},
    {title:"NULL in aggregates",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={T.orange}><strong style={{color:T.orange}}>Aggregates silently ignore NULLs.</strong> If 3 of 10 salary rows are NULL, AVG(salary) divides by 7, not 10. COUNT(*) counts all rows; COUNT(col) counts non-NULL rows only.</Note>
        <SQLBlock platform={platform} code={`-- Employees table: 5 rows, 2 NULL bonuses\nSELECT\n  COUNT(*)          AS total_rows,    -- 5\n  COUNT(bonus)      AS non_null_bonus, -- 3 (NULLs skipped)\n  SUM(bonus)        AS sum_bonus,      -- 9000 (NULLs skipped)\n  AVG(bonus)        AS avg_bonus,      -- 3000 = 9000 / 3, NOT / 5!\n  AVG(COALESCE(bonus,0)) AS avg_safe   -- 1800 = 9000 / 5\nFROM employees;`}/>
        <Warn>AVG(bonus) with NULLs gives 3000 (average of non-NULL rows). AVG(COALESCE(bonus,0)) gives 1800 (treating NULL as zero). Neither is "wrong" — but they answer different questions. Always be explicit about which you want.</Warn>
      </div>
    )},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"What does NULL + 5 return in SQL?",options:["5","0","NULL","Error"],correct:2,explanation:"NULL propagates through arithmetic. Any expression involving NULL returns NULL unless you explicitly handle it with COALESCE or IFNULL."},
      {question:"A table has 10 rows, 3 of which have NULL salary. What does COUNT(*) return?",options:["7 (skips NULLs)","10 (counts all rows)","3 (counts only NULLs)","Error"],correct:1,explanation:"COUNT(*) counts all rows regardless of NULL values. COUNT(salary) would return 7 (skips NULLs). This is the key difference between COUNT(*) and COUNT(column)."},
      {type:"bug",question:"A developer expects rows where bonus is unknown. What's wrong?",code:`SELECT name FROM employees\nWHERE bonus = NULL;`,options:["NULL should be in quotes","= NULL always returns UNKNOWN, not TRUE — should be IS NULL","bonus is not nullable","SELECT * should be used"],correct:1,explanation:"NULL = NULL evaluates to UNKNOWN, not TRUE. WHERE only keeps rows that evaluate to TRUE, so this query always returns 0 rows. Fix: WHERE bonus IS NULL."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 10: VIEWS ─────────────────────────────────────────────────────────
function ViewLensVisual({platform}){
  const pc=PLAT[platform].color;
  const [step,setStep]=useState(0);
  const [showUnderlying,setShowUnderlying]=useState(false);
  const viewRows=EMP.filter(r=>r.active===1&&r.salary>=70000).map(r=>({name:r.name,dept:r.dept,salary:r.salary}));
  const STEPS=[
    {label:"Base table",icon:"🗄️",desc:"The underlying employees table"},
    {label:"Define VIEW",icon:"🔭",desc:"CREATE VIEW stores the query definition"},
    {label:"Query VIEW",icon:"📋",desc:"SELECT from the view like a table"},
    {label:"Behind the scenes",icon:"🔍",desc:"The engine replaces the view with its definition"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click through the <strong>4 phase tabs</strong> above — from raw table, to CREATE VIEW, to querying it, to seeing what the engine actually runs behind the scenes.</Hint>
      <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:`1px solid ${T.slate}`}}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{flex:1,padding:"9px 5px",border:"none",cursor:"pointer",background:step===i?`${pc}18`:step>i?`${pc}06`:"transparent",borderRight:i<3?`1px solid ${T.slate}`:"none",transition:"all .2s"}}>
            <div style={{fontSize:13}}>{s.icon}</div>
            <div style={{fontSize:8,fontWeight:700,color:step>=i?pc:T.greyDark,fontFamily:"monospace",marginTop:2}}>{s.label}</div>
          </button>
        ))}
      </div>
      {step===0&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:8}}>
          <SLabel>employees — full table (10 rows)</SLabel>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
                {["name","dept","salary","active"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark}}>{c}</th>)}
              </tr></thead>
              <tbody>{EMP.map((r,ri)=>(
                <tr key={r.id} style={{borderBottom:ri<EMP.length-1?`1px solid ${T.slate}44`:"none",opacity:r.active===1&&r.salary>=70000?1:.35}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.name}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.dept}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.salary.toLocaleString()}</td>
                  <td style={{padding:"5px 10px",fontSize:10,color:r.active===1?T.green:T.red}}>{r.active===1?"active":"inactive"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{fontSize:10,color:T.greyDark,fontFamily:"monospace"}}>Dimmed rows: inactive or salary under 70,000 — these will be excluded by the view</div>
        </div>
      )}
      {step===1&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:8}}>
          <Note color={pc}><strong style={{color:pc}}>CREATE VIEW</strong> stores the query definition — not the data. The base table remains unchanged. The view is a virtual table.</Note>
          <SQLBlock platform={platform} code={`CREATE VIEW active_senior_staff AS\nSELECT name, dept, salary\nFROM employees\nWHERE active = 1\n  AND salary >= 70000;\n\n-- No data copied.\n-- Just the query definition is stored.\n-- View will always reflect current base table.`}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{padding:"12px",border:`1px solid ${T.slate}`,borderRadius:8}}>
              <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginBottom:6}}>STORED IN DATABASE CATALOG</div>
              <div style={{fontSize:10,fontFamily:"monospace",color:T.greyLight,lineHeight:1.7}}>
                <span style={{color:pc}}>view_name:</span> active_senior_staff<br/>
                <span style={{color:pc}}>definition:</span> SELECT name, dept, salary<br/>
                <span style={{marginLeft:16,color:T.greyDark}}>FROM employees</span><br/>
                <span style={{marginLeft:16,color:T.greyDark}}>WHERE active=1 AND salary≥70000</span>
              </div>
            </div>
            <div style={{padding:"12px",border:`1px solid ${T.slate}`,borderRadius:8}}>
              <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginBottom:6}}>NOT STORED</div>
              <div style={{fontSize:10,color:T.greyLight,lineHeight:1.7}}>
                ✗ No copy of the data<br/>
                ✗ No extra storage used<br/>
                ✓ Query runs at access time<br/>
                ✓ Always current with base table
              </div>
            </div>
          </div>
        </div>
      )}
      {step===2&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:8}}>
          <SQLBlock platform={platform} code={`-- Query the view just like a real table:\nSELECT * FROM active_senior_staff;\n\n-- Or add more filters:\nSELECT * FROM active_senior_staff\nWHERE dept = 'Engineering'\nORDER BY salary DESC;`}/>
          <SLabel color={pc}>VIEW RESULT — {viewRows.length} rows (looks like a table)</SLabel>
          <div style={{border:`1px solid ${pc}33`,borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"5px 12px",background:`${pc}10`,borderBottom:`1px solid ${pc}22`,fontSize:9,color:pc,fontFamily:"monospace",fontWeight:700}}>📋 active_senior_staff (view)</div>
            {viewRows.map((r,ri)=>(
              <div key={ri} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",padding:"5px 12px",borderBottom:ri<viewRows.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*40}ms both`}}>
                <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{r.name}</span>
                <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{r.dept}</span>
                <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{r.salary.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {step===3&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:10}}>
          <Note color={pc}>When you query a view, the engine rewrites your query. It substitutes the view definition inline — so the final query runs against the actual base table.</Note>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
            <div>
              <SLabel>WHAT YOU WRITE</SLabel>
              <SQLBlock platform={platform} code={`SELECT *\nFROM active_senior_staff\nWHERE dept = 'Engineering';`}/>
            </div>
            <div style={{textAlign:"center",fontSize:18,color:pc}}>→<div style={{fontSize:8,color:T.greyDark,fontFamily:"monospace"}}>engine<br/>rewrites</div></div>
            <div>
              <SLabel color={pc}>WHAT ACTUALLY RUNS</SLabel>
              <SQLBlock platform={platform} code={`SELECT name, dept, salary\nFROM employees\nWHERE active = 1\n  AND salary >= 70000\n  AND dept = 'Engineering';`}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Module10({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"Views — virtual tables",content:()=><ViewLensVisual platform={platform}/>},
    {title:"CREATE, ALTER, DROP",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <PlatformDiff title="View management syntax" diffs={[
          {platform:"mysql",    code:`-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Replace (MySQL):\nCREATE OR REPLACE VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`,note:"CREATE OR REPLACE is MySQL's way to update a view without dropping first"},
          {platform:"postgres", code:`-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Replace (PostgreSQL 9.4+):\nCREATE OR REPLACE VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`,note:"PostgreSQL also supports materialized views (stores data)"},
          {platform:"sqlserver",code:`-- Create:\nCREATE VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n\n-- Alter:\nALTER VIEW v_active AS\nSELECT name, dept, salary\nFROM employees WHERE active = 1;\n\n-- Drop:\nDROP VIEW IF EXISTS v_active;`,note:"SQL Server uses ALTER VIEW (no CREATE OR REPLACE)"},
        ]}/>
      </div>
    )},
    {title:"Common mistakes",content:()=><CommonMistakes mistakes={[
      {title:"Expecting view data to be cached",wrong:`-- View queries base table EVERY time:\nSELECT * FROM v_active; -- reads employees now\nSELECT * FROM v_active; -- reads employees again\n-- No performance benefit from the view itself`,right:`-- For cached/pre-computed data:\n-- Use a Materialized View (PostgreSQL/Oracle)\nCREATE MATERIALIZED VIEW v_active AS\nSELECT name, dept FROM employees\nWHERE active = 1;\n-- Must REFRESH MATERIALIZED VIEW to update`,why:"A standard view is just a stored query. Every access re-runs it against live data. It provides security and reusability — not performance. For performance, use indexed/materialized views."},
      {title:"Updating a view with an unsupported expression",wrong:`-- This view is not updatable:\nCREATE VIEW v_dept_summary AS\nSELECT dept, COUNT(*), AVG(salary)\nFROM employees GROUP BY dept;\n\n-- Will fail:\nUPDATE v_dept_summary SET dept = 'Eng';`,right:`-- Only simple views (no GROUP BY, DISTINCT, JOIN)\n-- pointing to a single base table are updatable:\nCREATE VIEW v_simple AS\nSELECT id, name, dept FROM employees;\n\nUPDATE v_simple SET dept = 'Engineering' WHERE id = 1;`,why:"Views with aggregation, GROUP BY, DISTINCT, or JOINs are not updatable because the database can't map changes back to specific base table rows."},
    ]}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"Data is updated in the base table. What happens to a view built on that table?",options:["The view stays stale — must be refreshed","The view immediately reflects the change (it queries live data)","The view must be dropped and recreated","The change is blocked by the view"],correct:1,explanation:"A standard view stores the query definition, not data. Every time you query the view, it executes against the current state of the base table. Updates to the base table are instantly visible through the view."},
      {question:"What is the main purpose of views? (choose best answer)",options:["Improve query performance","Encapsulate complex logic, provide security by limiting column/row access, and simplify queries","Store pre-computed aggregations","Back up table data"],correct:1,explanation:"Views excel at: (1) hiding complexity behind a named query, (2) security — users can access v_public_data without accessing the raw table with sensitive columns, (3) reusability. For performance gains, use materialized views or indexed views."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 11: DML (INSERT / UPDATE / DELETE) ───────────────────────────────
function DMLVisual({platform}){
  const pc=PLAT[platform].color;
  const [op,setOp]=useState("INSERT");
  const INITIAL=[
    {id:1,name:"Amara Osei",   dept:"Engineering",salary:85000,status:"stable"},
    {id:2,name:"Bola Adeyemi", dept:"Analytics",  salary:72000,status:"stable"},
    {id:3,name:"Chidi Nwosu",  dept:"Engineering",salary:91000,status:"stable"},
    {id:4,name:"Dami Afolabi", dept:"Product",    salary:68000,status:"stable"},
    {id:5,name:"Efe Okonkwo",  dept:"Analytics",  salary:75000,status:"stable"},
  ];
  const [rows,setRows]=useState(INITIAL.map(r=>({...r})));
  const [staged,setStaged]=useState(null);
  const [phase,setPhase]=useState(0);
  const reset=()=>{setRows(INITIAL.map(r=>({...r})));setStaged(null);setPhase(0);};
  const ops={
    INSERT:{color:T.blue, sql:`INSERT INTO employees (id, name, dept, salary)\nVALUES (6, 'Funke Balogun', 'Engineering', 88000);`,action:()=>{setStaged({id:6,name:"Funke Balogun",dept:"Engineering",salary:88000,status:"new"});setPhase(1);}},
    UPDATE:{color:T.yellow,sql:`UPDATE employees\nSET salary = salary * 1.10\nWHERE dept = 'Analytics';\n-- Affects 2 rows`,action:()=>{setRows(r=>r.map(e=>e.dept==="Analytics"?{...e,salary:Math.round(e.salary*1.1),status:"updated"}:e));setPhase(1);}},
    DELETE:{color:T.red,   sql:`DELETE FROM employees\nWHERE id = 4;\n-- Dami Afolabi — inactive`,action:()=>{setRows(r=>r.map(e=>e.id===4?{...e,status:"deleted"}:e));setPhase(1);}},
  };
  const active=ops[op];
  const commit=()=>{
    if(op==="INSERT"&&staged){setRows(r=>[...r,staged]);setStaged(null);}
    if(op==="DELETE"){setRows(r=>r.filter(e=>e.status!=="deleted"));}
    if(op==="UPDATE"){setRows(r=>r.map(e=>({...e,status:e.status==="updated"?"stable":e.status})));}
    setPhase(2);
  };
  const rowColor=r=>{
    if(r.status==="new")     return{bg:"rgba(96,165,250,.15)", border:`1px solid ${T.blue}55`,  text:T.blue};
    if(r.status==="updated") return{bg:"rgba(250,204,21,.1)",  border:`1px solid ${T.yellow}55`,text:T.yellow};
    if(r.status==="deleted") return{bg:"rgba(248,113,113,.1)", border:`1px solid ${T.red}55`,   text:T.red};
    return{bg:"transparent",border:"none",text:T.greyLight};
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Pick INSERT, UPDATE, or DELETE. Click <strong>▶ Stage</strong> to preview the change (rows glow). Then choose <strong>✓ COMMIT</strong> to apply permanently or <strong>↩ ROLLBACK</strong> to undo.</Hint>
      <div style={{display:"flex",gap:5}}>
        {["INSERT","UPDATE","DELETE"].map(o=>(
          <button key={o} onClick={()=>{setOp(o);reset();}} style={{flex:1,padding:"8px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${op===o?ops[o].color:"rgba(255,255,255,.08)"}`,background:op===o?`${ops[o].color}14`:"rgba(255,255,255,.03)",color:op===o?ops[o].color:T.grey,transition:"all .2s"}}>
            {o}
          </button>
        ))}
      </div>
      <SQLBlock code={active.sql} platform={platform}/>
      <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
            {["id","name","dept","salary","change"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark,fontWeight:700}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r,ri)=>{const sc=rowColor(r);return(
              <tr key={r.id} style={{borderBottom:`1px solid ${T.slate}44`,background:sc.bg,transition:"all .4s",opacity:r.status==="deleted"?.5:1}}>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyDark}}>{r.id}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:sc.text,fontWeight:r.status!=="stable"?700:400,textDecoration:r.status==="deleted"?"line-through":"none"}}>{r.name}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{r.dept}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:r.status==="updated"?T.yellow:T.greyLight,fontWeight:r.status==="updated"?700:400}}>{r.salary.toLocaleString()}</td>
                <td style={{padding:"5px 10px",fontSize:9,fontFamily:"monospace",color:sc.text,fontWeight:700}}>
                  {r.status==="new"?"⬆ INSERT":r.status==="updated"?"✏ UPDATE":r.status==="deleted"?"✗ DELETE":""}</td>
              </tr>
            );})}
            {op==="INSERT"&&staged&&phase===1&&(
              <tr style={{borderBottom:`1px solid ${T.slate}44`,background:"rgba(96,165,250,.12)",animation:"rowAppear .3s ease"}}>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyDark}}>{staged.id}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:T.blue,fontWeight:700}}>{staged.name}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{staged.dept}</td>
                <td style={{padding:"5px 10px",fontSize:10,color:T.blue,fontWeight:700}}>{staged.salary.toLocaleString()}</td>
                <td style={{padding:"5px 10px",fontSize:9,fontFamily:"monospace",color:T.blue,fontWeight:700}}>⬆ STAGED</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{rows.length}{staged?" + 1 staged":""} rows</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {phase===0&&<button onClick={active.action} style={{padding:"7px 18px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${active.color}55`,background:`${active.color}14`,color:active.color}}>▶ Stage {op}</button>}
        {phase===1&&<>
          <button onClick={commit} style={{padding:"7px 18px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${T.green}55`,background:`${T.green}14`,color:T.green}}>✓ COMMIT</button>
          <button onClick={reset} style={{padding:"7px 14px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${T.red}55`,background:`${T.red}08`,color:T.red}}>↩ ROLLBACK</button>
        </>}
        {phase===2&&<button onClick={reset} style={{padding:"7px 14px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:T.grey}}>↩ Reset</button>}
      </div>
    </div>
  );
}

function Module11({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"INSERT",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={T.blue}>INSERT adds new rows to a table. You can insert one row at a time or multiple rows in a single statement.</Note>
        <PlatformDiff title="INSERT syntax" diffs={[
          {platform:"mysql",    code:`-- Single row:\nINSERT INTO employees (name, dept, salary)\nVALUES ('Funke Balogun', 'Engineering', 88000);\n\n-- Multiple rows:\nINSERT INTO employees (name, dept, salary)\nVALUES\n  ('Grace M.', 'Product', 71000),\n  ('Henry E.', 'Analytics', 69000);\n\n-- From SELECT:\nINSERT INTO archive_emp\nSELECT * FROM employees\nWHERE active = 0;`},
          {platform:"postgres", code:`-- INSERT ... RETURNING (gets inserted values):\nINSERT INTO employees (name, dept, salary)\nVALUES ('Funke Balogun', 'Engineering', 88000)\nRETURNING id, name;\n-- Returns the new row's generated id\n-- Extremely useful for getting auto-increment id`},
          {platform:"sqlserver",code:`-- OUTPUT clause (like RETURNING):\nINSERT INTO employees (name, dept, salary)\nOUTPUT INSERTED.id, INSERTED.name\nVALUES ('Funke Balogun', 'Engineering', 88000);\n\n-- Insert from SELECT:\nINSERT INTO archive_emp\nSELECT * FROM employees WHERE active = 0;`},
        ]}/>
      </div>
    )},
    {title:"UPDATE",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={T.yellow}>UPDATE modifies existing rows. <strong style={{color:T.red}}>Always use a WHERE clause</strong> — without one, every row in the table is updated.</Note>
        <SQLBlock platform={platform} code={`-- ALWAYS check your WHERE before running!\nSELECT * FROM employees WHERE dept = 'Analytics';\n-- Looks right? Then run:\nUPDATE employees\nSET salary = salary * 1.10,\n    dept   = 'Data Analytics'\nWHERE dept = 'Analytics';\n\n-- Multi-table UPDATE (MySQL):\nUPDATE employees e\nJOIN departments d ON e.dept_id = d.id\nSET e.salary = e.salary * 1.1\nWHERE d.budget > 1000000;`}/>
        <Warn>In MySQL and SQL Server, UPDATE without WHERE updates every row silently. PostgreSQL raises a warning if no rows are affected. A common safety practice: SELECT first with the same WHERE, then UPDATE.</Warn>
      </div>
    )},
    {title:"DELETE & TRUNCATE",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <PlatformDiff title="DELETE vs TRUNCATE" diffs={[
          {platform:"mysql",    code:`-- DELETE: row-by-row, WHERE supported\nDELETE FROM employees WHERE id = 4;\n-- Check first:\n-- SELECT * FROM employees WHERE id=4;\n\n-- TRUNCATE: removes all rows, no WHERE\nTRUNCATE TABLE employees;\n-- Resets auto-increment counter\n-- Cannot be rolled back in MySQL!`,note:"MySQL TRUNCATE cannot be rolled back — use DELETE for rollback safety"},
          {platform:"postgres", code:`-- DELETE: transactional and rollback-safe\nDELETE FROM employees WHERE id = 4;\n\n-- DELETE ... RETURNING:\nDELETE FROM employees WHERE active = 0\nRETURNING id, name; -- shows deleted rows\n\n-- TRUNCATE: fast full wipe\nTRUNCATE TABLE employees;\n-- Can be rolled back in PostgreSQL`,note:"PostgreSQL TRUNCATE can be rolled back within a transaction"},
          {platform:"sqlserver",code:`-- DELETE:\nDELETE FROM employees WHERE id = 4;\n\n-- Check count first:\nSELECT COUNT(*) FROM employees WHERE id=4;\n\n-- TRUNCATE: full wipe\nTRUNCATE TABLE employees;\n-- Faster than DELETE, no logging per row`,note:"SQL Server TRUNCATE resets identity columns"},
        ]}/>
      </div>
    )},
    {title:"🛝 DML visual",content:()=><DMLVisual platform={platform}/>},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"You run UPDATE employees SET salary = 100000; (no WHERE). What happens?",options:["Error — WHERE is required","Every row in employees gets salary = 100000","Only the first row is updated","Only NULL salary rows are updated"],correct:1,explanation:"UPDATE without WHERE modifies every row in the table. This is a common and very damaging mistake. Always run a SELECT with the same WHERE condition first, then UPDATE."},
      {question:"What is the key difference between DELETE and TRUNCATE?",options:["DELETE removes one row, TRUNCATE removes all","DELETE supports WHERE and is transactional; TRUNCATE is faster but removes all rows and may not support rollback","DELETE is DDL, TRUNCATE is DML","TRUNCATE only works on empty tables"],correct:1,explanation:"DELETE is row-by-row (logged, supports WHERE, fully transactional). TRUNCATE is a bulk operation (minimal logging, no WHERE, resets identity — and in MySQL cannot be rolled back)."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 12: STRING & DATE FUNCTIONS ──────────────────────────────────────
function FunctionTransformer({platform}){
  const pc=PLAT[platform].color;
  const [category,setCategory]=useState("string");
  const [input,setInput]=useState("Hello Lagos!");
  const [dateInput,setDateInput]=useState("2024-03-15");
  const stringFns=[
    {name:"UPPER(x)",        fn:s=>s.toUpperCase(),           desc:"Converts to uppercase"},
    {name:"LOWER(x)",        fn:s=>s.toLowerCase(),           desc:"Converts to lowercase"},
    {name:"LENGTH(x)",       fn:s=>s.length,                  desc:"Number of characters"},
    {name:"TRIM(x)",         fn:s=>s.trim(),                  desc:"Remove leading/trailing spaces"},
    {name:"SUBSTRING(x,1,5)",fn:s=>s.substring(0,5),          desc:"First 5 characters"},
    {name:"REPLACE(x,'a','@')",fn:s=>s.replace(/a/gi,"@"),   desc:"Replace 'a' with '@'"},
    {name:"CONCAT(x,' World')",fn:s=>s+" World",              desc:"Append text"},
    {name:"REVERSE(x)",      fn:s=>s.split("").reverse().join(""),desc:"Reverses the string"},
  ];
  const dateFns=[
    {name:"YEAR(x)",         fn:d=>{try{return new Date(d).getFullYear();}catch{return"invalid";}},     desc:"Extract year"},
    {name:"MONTH(x)",        fn:d=>{try{return new Date(d).getMonth()+1;}catch{return"invalid";}},      desc:"Extract month (1-12)"},
    {name:"DAY(x)",          fn:d=>{try{return new Date(d).getDate();}catch{return"invalid";}},          desc:"Extract day of month"},
    {name:"DATEDIFF(NOW(),x)",fn:d=>{try{const diff=Math.floor((Date.now()-new Date(d))/(86400000));return`${diff} days`;}catch{return"invalid";}},desc:"Days from date to now"},
    {name:"DATE_FORMAT(x,'%M %Y')",fn:d=>{try{return new Date(d).toLocaleDateString("en-US",{month:"long",year:"numeric"});}catch{return"invalid";}},desc:"Format as 'Month Year'"},
  ];
  const fns=category==="string"?stringFns:dateFns;
  const val=category==="string"?input:dateInput;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="⌨️">Type any text or date in the input box — every function card updates instantly. Switch between <strong>STRING</strong> and <strong>DATE</strong> modes to explore different function families.</Hint>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <div style={{display:"flex",gap:4,background:T.surface,padding:3,borderRadius:9,border:`1px solid ${T.slate}`}}>
          {["string","date"].map(c=><button key={c} onClick={()=>setCategory(c)} style={{padding:"4px 14px",borderRadius:7,border:"none",background:category===c?`${pc}22`:"transparent",color:category===c?pc:T.grey,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700}}>{c.toUpperCase()}</button>)}
        </div>
        <input value={category==="string"?input:dateInput} onChange={e=>category==="string"?setInput(e.target.value):setDateInput(e.target.value)} style={{flex:1,padding:"6px 12px",borderRadius:8,border:`1px solid ${pc}44`,background:T.bg,color:pc,fontSize:11,fontFamily:"monospace",outline:"none"}} placeholder={category==="string"?"Enter any text...":"YYYY-MM-DD"}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
        {fns.map(f=>{
          let result;try{result=f.fn(val);}catch{result="error";}
          return(
            <div key={f.name} style={{background:T.surface,border:`1px solid ${T.slate}`,borderRadius:9,padding:"10px 12px"}}>
              <code style={{fontSize:10,color:pc,fontFamily:"monospace",fontWeight:700,display:"block",marginBottom:3}}>{f.name}</code>
              <div style={{fontSize:18,fontWeight:800,color:T.white,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{result===null?"NULL":String(result)}</div>
              <div style={{fontSize:9,color:T.greyDark,lineHeight:1.4}}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Module12({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"🛝 Live function transformer",content:()=><FunctionTransformer platform={platform}/>},
    {title:"String functions reference",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <PlatformDiff title="String function differences" diffs={[
          {platform:"mysql",    code:`-- MySQL uses backticks, accepts '':\nSELECT SUBSTRING(name, 1, 3) AS short\nFROM employees;\n-- MySQL: SUBSTRING or SUBSTR\n\nSELECT CONCAT(first, ' ', last) AS full;\n-- Also: CONCAT_WS(' ', first, last)\n-- CONCAT_WS: separator, null-safe\n\nSELECT LENGTH('café'); -- returns 5 bytes\nSELECT CHAR_LENGTH('café'); -- 4 chars`},
          {platform:"postgres", code:`-- PostgreSQL:\nSELECT SUBSTRING(name FROM 1 FOR 3);\n-- Or: SUBSTR(name, 1, 3)\n\n-- String ||  operator:\nSELECT first || ' ' || last AS full;\n\n-- Regex:\nSELECT REGEXP_REPLACE(name, '[aeiou]','*');\n\n-- Standard LENGTH returns char count`},
          {platform:"sqlserver",code:`-- SQL Server:\nSELECT SUBSTRING(name, 1, 3) AS short;\n-- No SUBSTR alias\n\n-- Concatenation:\nSELECT first + ' ' + last AS full;\n-- Or: CONCAT(first, ' ', last)\n\nSELECT LEN(name); -- LEN not LENGTH\nSELECT FORMAT(salary, 'N2'); -- number fmt`},
        ]}/>
      </div>
    )},
    {title:"Date functions reference",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <PlatformDiff title="Date function differences" diffs={[
          {platform:"mysql",    code:`-- Current timestamp:\nNOW()         -- datetime\nCURDATE()     -- date only\nCURTIME()     -- time only\n\n-- Arithmetic:\nDATE_ADD('2024-01-15', INTERVAL 30 DAY)\nDATE_SUB('2024-01-15', INTERVAL 1 MONTH)\nDATEDIFF('2024-12-31', '2024-01-01')\n-- Returns: 365\n\n-- Format:\nDATE_FORMAT(NOW(), '%d %b %Y')`},
          {platform:"postgres", code:`-- Current timestamp:\nNOW()           -- with timezone\nCURRENT_DATE    -- date (no parentheses!)\nCURRENT_TIME    -- time\n\n-- Arithmetic with INTERVAL:\n'2024-01-15'::date + INTERVAL '30 days'\n\n-- Extract:\nEXTRACT(YEAR FROM NOW())\nEXTRACT(DOW FROM NOW()) -- 0=Sunday\n\n-- Format:\nTO_CHAR(NOW(), 'DD Mon YYYY')`},
          {platform:"sqlserver",code:`-- Current timestamp:\nGETDATE()       -- local\nGETUTCDATE()    -- UTC\nSYSDATETIME()   -- higher precision\n\n-- Arithmetic:\nDATEADD(DAY, 30, '2024-01-15')\nDATEDIFF(DAY, '2024-01-01', '2024-12-31')\n-- Returns: 365\n\n-- Format:\nFORMAT(GETDATE(), 'dd MMM yyyy')\nCONVERT(varchar, GETDATE(), 103) -- UK`},
        ]}/>
      </div>
    )},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {type:"bug",question:"A developer wants the first 4 characters of every name but only MySQL returned results. What's wrong?",code:`SELECT SUBSTR(name, 1, 4) FROM employees;`,options:["SUBSTR needs 2 arguments not 3","SQL Server uses SUBSTRING, not SUBSTR — SUBSTR is MySQL/PostgreSQL only","MySQL doesn't support SUBSTR","The start index should be 0"],correct:1,explanation:"SUBSTR is supported in MySQL and PostgreSQL but not SQL Server. SQL Server uses SUBSTRING(col, start, length). Always use SUBSTRING for cross-platform compatibility."},
      {question:"You need to find employees hired in 2021 using a WHERE clause. Which is most portable?",options:["WHERE hired = 2021","WHERE YEAR(hired) = 2021","WHERE hired BETWEEN '2021-01-01' AND '2021-12-31'","WHERE FORMAT(hired,'yyyy') = '2021'"],correct:2,explanation:"BETWEEN with explicit dates is most portable across all platforms. YEAR() works in MySQL and SQL Server but not PostgreSQL (use EXTRACT). FORMAT is SQL Server-specific. The BETWEEN approach also uses indexes more effectively."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 13: TRANSACTIONS ──────────────────────────────────────────────────
function TransactionTimeline({platform}){
  const pc=PLAT[platform].color;
  const [phase,setPhase]=useState(0);
  const [mode,setMode]=useState("commit");
  const INITIAL_BALANCE_A=5000;
  const INITIAL_BALANCE_B=3000;
  const TRANSFER=1500;
  const STEPS=[
    {label:"BEGIN",     icon:"▶",desc:"Transaction starts. A savepoint for rollback."},
    {label:"UPDATE A",  icon:"↓",desc:"Deduct $1,500 from Account A"},
    {label:"UPDATE B",  icon:"↑",desc:"Add $1,500 to Account B"},
    {label:"COMMIT / ROLLBACK",icon:"✓",desc:"Finalize or undo all changes"},
  ];
  const balA=[INITIAL_BALANCE_A,INITIAL_BALANCE_A-TRANSFER,INITIAL_BALANCE_A-TRANSFER];
  const balB=[INITIAL_BALANCE_B,INITIAL_BALANCE_B,INITIAL_BALANCE_B+TRANSFER];
  const currentA=mode==="rollback"&&phase>=3?INITIAL_BALANCE_A:balA[Math.min(phase,2)];
  const currentB=mode==="rollback"&&phase>=3?INITIAL_BALANCE_B:balB[Math.min(phase,2)];
  const changedA=phase>=1&&(mode==="commit"||phase<3);
  const changedB=phase>=2&&(mode==="commit"||phase<3);
  const sql=mode==="commit"
    ?`BEGIN;\n\nUPDATE accounts SET balance = balance - ${TRANSFER}\nWHERE account_id = 'A';\n-- A: ${INITIAL_BALANCE_A} → ${INITIAL_BALANCE_A-TRANSFER}\n\nUPDATE accounts SET balance = balance + ${TRANSFER}\nWHERE account_id = 'B';\n-- B: ${INITIAL_BALANCE_B} → ${INITIAL_BALANCE_B+TRANSFER}\n\nCOMMIT; -- both changes written permanently`
    :`BEGIN;\n\nUPDATE accounts SET balance = balance - ${TRANSFER}\nWHERE account_id = 'A';\n-- A changes in memory...\n\n-- ⚠️ Error detected / change of mind:\n\nROLLBACK; -- both changes undone\n-- A returns to ${INITIAL_BALANCE_A}\n-- B returns to ${INITIAL_BALANCE_B}`;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Choose <strong>COMMIT</strong> or <strong>ROLLBACK</strong> mode above, then click <strong>Next →</strong> to step through the bank transfer. Watch balances change. At the final step, COMMIT locks changes permanently; ROLLBACK undoes everything.</Hint>
      <div style={{display:"flex",gap:6}}>
        <div style={{display:"flex",gap:4,background:T.surface,padding:3,borderRadius:9,border:`1px solid ${T.slate}`}}>
          <button onClick={()=>{setMode("commit");setPhase(0);}} style={{padding:"4px 14px",borderRadius:7,border:"none",background:mode==="commit"?`${T.green}22`:"transparent",color:mode==="commit"?T.green:T.grey,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700}}>COMMIT</button>
          <button onClick={()=>{setMode("rollback");setPhase(0);}} style={{padding:"4px 14px",borderRadius:7,border:"none",background:mode==="rollback"?`${T.red}22`:"transparent",color:mode==="rollback"?T.red:T.grey,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700}}>ROLLBACK</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",gap:14,alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{label:"Account A",init:INITIAL_BALANCE_A,cur:currentA,changed:changedA},
            {label:"Account B",init:INITIAL_BALANCE_B,cur:currentB,changed:changedB}].map(acc=>(
            <div key={acc.label} style={{border:`1px solid ${acc.changed?(mode==="rollback"&&phase>=3?T.red:T.yellow):T.slate}`,borderRadius:10,padding:"12px",background:acc.changed?(mode==="rollback"&&phase>=3?"rgba(248,113,113,.07)":"rgba(250,204,21,.07)"):"rgba(255,255,255,.02)",transition:"all .4s"}}>
              <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginBottom:4}}>{acc.label}</div>
              <div style={{fontSize:28,fontWeight:800,color:acc.changed?(mode==="rollback"&&phase>=3?T.red:T.yellow):T.greyLight,fontFamily:"'Syne',sans-serif",transition:"color .4s"}}>${acc.cur.toLocaleString()}</div>
              {acc.changed&&phase<3&&<div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>was ${acc.init.toLocaleString()} — in-memory only</div>}
              {acc.changed&&mode==="commit"&&phase>=3&&<div style={{fontSize:9,color:T.green,fontFamily:"monospace",marginTop:2}}>✓ committed</div>}
              {acc.changed&&mode==="rollback"&&phase>=3&&<div style={{fontSize:9,color:T.red,fontFamily:"monospace",marginTop:2}}>↩ rolled back</div>}
            </div>
          ))}
          <div style={{padding:"8px 10px",borderRadius:8,background:"rgba(255,255,255,.02)",border:`1px solid ${T.slate}`,fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>
            Total: ${(currentA+currentB).toLocaleString()} {(currentA+currentB===INITIAL_BALANCE_A+INITIAL_BALANCE_B)?"✓ consistent":"✓ consistent"}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {STEPS.map((s,i)=>{
            const done=phase>i;const active2=phase===i;
            return(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",opacity:i>phase+1?.2:1,transition:"opacity .3s"}}>
                <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${done?(mode==="rollback"&&i===3?T.red:T.green):active2?pc:T.slate}`,background:done?(mode==="rollback"&&i===3?"rgba(248,113,113,.1)":"rgba(74,222,128,.1)"):active2?`${pc}14`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .4s",fontSize:14}}>
                  {done?(mode==="rollback"&&i===3?"↩":"✓"):<span style={{fontSize:9,color:active2?pc:T.greyDark,fontFamily:"monospace"}}>{s.icon}</span>}
                </div>
                <div style={{paddingTop:3}}>
                  <div style={{fontSize:11,fontWeight:700,color:done?T.green:active2?pc:T.greyDark,fontFamily:"monospace",transition:"color .3s"}}>{s.label}</div>
                  <div style={{fontSize:9,color:T.greyDark}}>{s.desc}</div>
                </div>
              </div>
            );
          })}
          <div style={{display:"flex",gap:6,marginTop:4}}>
            <button onClick={()=>setPhase(p=>Math.max(0,p-1))} disabled={phase===0} style={{padding:"5px 12px",borderRadius:7,fontSize:9,cursor:phase===0?"not-allowed":"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:phase===0?T.greyDark:T.grey}}>← Back</button>
            <button onClick={()=>setPhase(p=>Math.min(3,p+1))} disabled={phase===3} style={{padding:"5px 14px",borderRadius:7,fontSize:9,cursor:phase===3?"not-allowed":"pointer",fontFamily:"monospace",border:`1px solid ${phase===3?T.slate:pc}44`,background:phase===3?"transparent":`${pc}14`,color:phase===3?T.greyDark:pc}}>{phase===2?mode==="commit"?"COMMIT ✓":"ROLLBACK ↩":"Next →"}</button>
          </div>
        </div>
        <div><SQLBlock code={sql} platform={platform}/></div>
      </div>
    </div>
  );
}

function Module13({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"ACID properties",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}><strong style={{color:pc}}>ACID</strong> describes the four properties that make database transactions reliable. Understanding these is key to writing safe, correct data-modifying code.</Note>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {[{letter:"A",name:"Atomicity",color:T.blue,  icon:"⚛️",desc:"All operations in a transaction succeed, or none of them are applied. A bank transfer either deducts AND credits, or neither happens."},
            {letter:"C",name:"Consistency",color:T.green, icon:"✅",desc:"The database moves from one valid state to another. Constraints (NOT NULL, FOREIGN KEY) are enforced before the transaction commits."},
            {letter:"I",name:"Isolation",color:T.yellow,icon:"🔒",desc:"Concurrent transactions don't see each other's uncommitted changes. Your long-running report doesn't see partial updates from other sessions."},
            {letter:"D",name:"Durability",color:T.purple,icon:"💾",desc:"Once committed, data survives system crashes. The transaction log ensures committed changes can be replayed after a failure."},
          ].map(p=>(
            <div key={p.letter} style={{background:`${p.color}09`,border:`1px solid ${p.color}28`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{fontSize:22,fontWeight:800,color:p.color,fontFamily:"'Syne',sans-serif"}}>{p.letter}</div>
                <div style={{fontSize:12,fontWeight:700,color:T.white}}>{p.name}</div>
                <div style={{marginLeft:"auto",fontSize:18}}>{p.icon}</div>
              </div>
              <div style={{fontSize:11,color:T.greyLight,lineHeight:1.65}}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    {title:"🛝 Transaction timeline",content:()=><TransactionTimeline platform={platform}/>},
    {title:"SAVEPOINT",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>SAVEPOINTs let you mark a point within a transaction and roll back to it without undoing all previous work.</Note>
        <PlatformDiff title="SAVEPOINT syntax" diffs={[
          {platform:"mysql",    code:`BEGIN;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVEPOINT after_order;\n\nINSERT INTO payments VALUES (1,1200);\n-- Error: invalid card\n\nROLLBACK TO SAVEPOINT after_order;\n-- order kept, payment undone\n\nCOMMIT;`,note:"MySQL supports SAVEPOINT fully within transactions"},
          {platform:"postgres", code:`BEGIN;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVEPOINT after_order;\n\nINSERT INTO payments VALUES (1,1200);\n-- Error detected\n\nROLLBACK TO SAVEPOINT after_order;\n\nRELEASE SAVEPOINT after_order;\nCOMMIT;`,note:"PostgreSQL: RELEASE SAVEPOINT clears it from the stack"},
          {platform:"sqlserver",code:`BEGIN TRANSACTION;\n\nINSERT INTO orders VALUES (1,101,'Laptop');\n\nSAVE TRANSACTION after_order;\n-- Note: SAVE TRANSACTION (not SAVEPOINT)\n\nINSERT INTO payments VALUES (1,1200);\n\nROLLBACK TRANSACTION after_order;\n-- Partial rollback to savepoint\n\nCOMMIT TRANSACTION;`,note:"SQL Server uses SAVE TRANSACTION not SAVEPOINT"},
        ]}/>
      </div>
    )},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {question:"A transaction inserts 3 rows, then encounters an error on the 4th INSERT. If ROLLBACK is called, what happens to the first 3 rows?",options:["They remain committed","All 3 are rolled back — the transaction is atomic","They remain, only the 4th fails","Depends on the database"],correct:1,explanation:"Atomicity means all-or-nothing. A ROLLBACK undoes ALL changes made within the transaction, including the successful first 3 inserts. After rollback, the table is in the same state as before the transaction started."},
      {question:"What does COMMIT do?",options:["Pauses the transaction","Permanently writes all transaction changes to the database","Creates a savepoint","Checks constraints"],correct:1,explanation:"COMMIT makes all changes in the transaction permanent and visible to other sessions. Before COMMIT, changes exist only in the transaction's private memory — other sessions can't see them (Isolation property)."},
    ]}/>},
  ]}/>;
}

// ─── MODULE 14: INDEXES & PERFORMANCE ────────────────────────────────────────
function IndexRaceVisual({platform}){
  const pc=PLAT[platform].color;
  const [running,setRunning]=useState(false);
  const [scanStep,setScanStep]=useState(-1);
  const [indexStep,setIndexStep]=useState(-1);
  const [done,setDone]=useState(false);
  const ROWS=10;
  const TARGET=7;
  const timer=useRef(null);
  const play=()=>{
    if(timer.current)clearInterval(timer.current);
    setScanStep(-1);setIndexStep(-1);setDone(false);setRunning(true);
    let s=0;
    timer.current=setInterval(()=>{
      s++;
      setScanStep(Math.min(s-1,ROWS));
      if(s>=4)setIndexStep(Math.min(s-4,2));
      if(s>=ROWS+2){clearInterval(timer.current);setDone(true);setRunning(false);}
    },300);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Click <strong>▶ Race: Full Scan vs Index</strong>. Watch both sides progress simultaneously — the full scan checks every row while the index jumps to the answer in 3 steps.</Hint>
      <button onClick={play} disabled={running} style={{padding:"7px 20px",borderRadius:8,fontSize:10,cursor:running?"not-allowed":"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${pc}55`,background:running?`${pc}06`:`${pc}18`,color:running?T.grey:pc,alignSelf:"flex-start"}}>
        {running?"⚡ Racing...":"▶ Race: Full Scan vs Index"}
      </button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <SLabel color={T.red}>Full Table Scan — WHERE id = {TARGET}</SLabel>
            {done&&<span style={{fontSize:9,color:T.red,fontFamily:"monospace",fontWeight:700,background:"rgba(248,113,113,.1)",padding:"2px 7px",borderRadius:8}}>{TARGET} reads</span>}
          </div>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.red}22`}}>
            {Array.from({length:ROWS},(_,i)=>{
              const checked=scanStep>=i;const found=i===TARGET-1&&checked;
              return(
                <div key={i} style={{padding:"5px 12px",borderBottom:i<ROWS-1?`1px solid ${T.slate}33`:"none",display:"flex",gap:8,alignItems:"center",background:found?"rgba(74,222,128,.1)":checked?"rgba(248,113,113,.06)":"transparent",transition:"background .2s"}}>
                  <span style={{fontSize:9,fontFamily:"monospace",color:checked?found?T.green:T.red:T.greyDark,fontWeight:checked?700:400}}>id = {i+1}</span>
                  <span style={{marginLeft:"auto",fontSize:9,color:checked?found?T.green:T.greyDark:T.greyDark,fontFamily:"monospace"}}>{found?"✓ MATCH":checked?"✗ skip":""}</span>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:5,fontSize:9,color:T.red,fontFamily:"monospace"}}>{scanStep>=0?`Checked ${Math.min(scanStep+1,ROWS)}/${ROWS} rows`:""}</div>
        </div>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <SLabel color={T.green}>B-tree Index — WHERE id = {TARGET}</SLabel>
            {done&&<span style={{fontSize:9,color:T.green,fontFamily:"monospace",fontWeight:700,background:"rgba(74,222,128,.1)",padding:"2px 7px",borderRadius:8}}>3 reads</span>}
          </div>
          <div style={{background:"rgba(4,9,20,.85)",borderRadius:8,overflow:"hidden",border:`1px solid ${T.green}22`}}>
            {[{label:"Root: [1...10]",desc:`${TARGET}>${5}? Go right`,active:indexStep>=0,found:false},
              {label:"Branch: [6,7,8,9,10]",desc:`Found range with ${TARGET}`,active:indexStep>=1,found:false},
              {label:`Leaf: id=${TARGET} → row`,desc:"Direct pointer to row",active:indexStep>=2,found:true},
            ].map((node,i)=>(
              <div key={i} style={{padding:"7px 12px",borderBottom:i<2?`1px solid ${T.slate}33`:"none",display:"flex",gap:8,alignItems:"center",background:node.active?(node.found?"rgba(74,222,128,.12)":"rgba(74,222,128,.05)"):"transparent",transition:"background .2s",marginLeft:i*16}}>
                <span style={{fontSize:9,fontFamily:"monospace",color:node.active?T.green:T.greyDark,fontWeight:node.active?700:400}}>{node.label}</span>
                {node.active&&<span style={{marginLeft:"auto",fontSize:8,color:node.found?T.green:T.greyLight,fontFamily:"monospace"}}>{node.desc}</span>}
              </div>
            ))}
          </div>
          <div style={{marginTop:5,fontSize:9,color:T.green,fontFamily:"monospace"}}>{indexStep>=0?`Traversed ${Math.min(indexStep+1,3)}/3 nodes`:""}</div>
        </div>
      </div>
      {done&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,animation:"popIn .3s ease"}}>
          <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:T.red,fontFamily:"'Syne',sans-serif"}}>{TARGET} reads</div>
            <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>FULL SCAN — O(n)</div>
            <div style={{fontSize:9,color:T.greyLight,marginTop:4}}>Grows with table size. 10M rows = 10M reads.</div>
          </div>
          <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(74,222,128,.07)",border:"1px solid rgba(74,222,128,.25)",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:T.green,fontFamily:"'Syne',sans-serif"}}>3 reads</div>
            <div style={{fontSize:9,color:T.greyDark,fontFamily:"monospace",marginTop:2}}>INDEX — O(log n)</div>
            <div style={{fontSize:9,color:T.greyLight,marginTop:4}}>10M rows = ~23 reads. Barely changes.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExplainVisual({platform}){
  const pc=PLAT[platform].color;
  const plans=[
    {sql:`SELECT * FROM employees WHERE id = 5;`,type:"Index Seek",cost:"low",rows:1,notes:"Primary key lookup — extremely fast. Direct access."},
    {sql:`SELECT * FROM employees WHERE city = 'Lagos';`,type:"Full Table Scan",cost:"high",rows:6,notes:"No index on 'city'. All 10 rows scanned to find matches."},
    {sql:`SELECT * FROM employees\nWHERE LOWER(name) = 'bola adeyemi';`,type:"Full Table Scan",cost:"high",rows:1,notes:"Function on indexed column defeats the index. The function must run on every row."},
    {sql:`SELECT * FROM employees\nWHERE name = 'Bola Adeyemi';`,type:"Index Seek",cost:"low",rows:1,notes:"No function wrapping — index on name can be used."},
  ];
  const [sel,setSel]=useState(0);
  const active=plans[sel];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Hint icon="👆">Click any query in the list to see its execution plan. <strong style={{color:T.green}}>Green = fast (index seek)</strong>. <strong style={{color:T.red}}>Red = slow (full table scan)</strong>. Compare queries 3 and 4 to see how wrapping a column in a function defeats an index.</Hint>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {plans.map((p,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{padding:"8px 12px",borderRadius:8,textAlign:"left",cursor:"pointer",border:`1px solid ${sel===i?pc:T.slate}`,background:sel===i?`${pc}10`:"rgba(255,255,255,.02)",transition:"all .2s"}}>
            <div style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{p.sql.split("\n")[0]}{p.sql.includes("\n")?"...":""}</div>
            <div style={{display:"flex",gap:8,marginTop:3}}>
              <span style={{fontSize:8,fontFamily:"monospace",color:p.cost==="low"?T.green:T.red,fontWeight:700}}>{p.type}</span>
              <span style={{fontSize:8,color:T.greyDark}}>~{p.rows} row{p.rows!==1?"s":""} examined</span>
            </div>
          </button>
        ))}
      </div>
      <div style={{border:`1px solid ${active.cost==="low"?T.green:T.red}44`,borderRadius:10,padding:"12px 14px",background:active.cost==="low"?"rgba(74,222,128,.06)":"rgba(248,113,113,.06)"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:13}}>{active.cost==="low"?"⚡":"🐢"}</span>
          <span style={{fontSize:12,fontWeight:700,color:active.cost==="low"?T.green:T.red}}>{active.type}</span>
          <span style={{fontSize:9,fontFamily:"monospace",color:T.greyDark,marginLeft:"auto"}}>rows examined: {active.rows}</span>
        </div>
        <SQLBlock code={active.sql} platform={platform}/>
        <div style={{marginTop:8,fontSize:11,color:T.greyLight,lineHeight:1.65}}>{active.notes}</div>
      </div>
      <PlatformDiff title="EXPLAIN syntax" diffs={[
        {platform:"mysql",    code:`EXPLAIN SELECT * FROM employees\nWHERE city = 'Lagos';\n\n-- More detail:\nEXPLAIN ANALYZE\nSELECT * FROM employees\nWHERE city = 'Lagos';`,note:"EXPLAIN ANALYZE available in MySQL 8.0+"},
        {platform:"postgres", code:`EXPLAIN SELECT * FROM employees\nWHERE city = 'Lagos';\n\n-- Full execution details:\nEXPLAIN ANALYZE\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Shows actual rows, actual time`,note:"EXPLAIN ANALYZE actually executes the query"},
        {platform:"sqlserver",code:`-- SQL Server: display estimated plan\nSET SHOWPLAN_ALL ON;\nSELECT * FROM employees\nWHERE city = 'Lagos';\nSET SHOWPLAN_ALL OFF;\n\n-- Or use SSMS: Ctrl+L for estimated plan\n-- Ctrl+M for actual plan`,note:"SQL Server Management Studio has visual plan viewer"},
      ]}/>
    </div>
  );
}

function Module14({platform}){
  const pc=PLAT[platform].color;
  return <Course color={pc} steps={[
    {title:"How indexes work",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>An index is a separate data structure that speeds up row lookups. Without one, every query scans every row. With one, the engine jumps directly to the matching rows using a B-tree traversal.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><SLabel color={T.red}>No index — full scan</SLabel><SQLBlock platform={platform} code={`-- No index on city:\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Engine reads ALL 10 rows to find matches\n-- On 10 million rows: reads 10 million rows`}/></div>
          <div><SLabel color={T.green}>With index — fast lookup</SLabel><SQLBlock platform={platform} code={`-- Create index first:\nCREATE INDEX idx_city ON employees(city);\n\n-- Same query, now uses index:\nSELECT * FROM employees\nWHERE city = 'Lagos';\n-- Engine traverses B-tree: ~log2(10M) = 23 steps`}/></div>
        </div>
        <Tip icon="🔑" title="PRIMARY KEY = AUTO INDEX" color={pc}>Primary keys automatically create a unique clustered index. You don't need to manually create an index on id. Create indexes on columns you filter (WHERE), join (ON), or sort (ORDER BY) frequently.</Tip>
      </div>
    )},
    {title:"🛝 Index race",content:()=><IndexRaceVisual platform={platform}/>},
    {title:"🔍 Query plans",content:()=><ExplainVisual platform={platform}/>},
    {title:"Index creation syntax",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <PlatformDiff title="CREATE INDEX" diffs={[
          {platform:"mysql",    code:`-- Single column:\nCREATE INDEX idx_city\n  ON employees(city);\n\n-- Composite (multi-column):\nCREATE INDEX idx_dept_sal\n  ON employees(dept, salary);\n\n-- Unique:\nCREATE UNIQUE INDEX idx_email\n  ON employees(email);\n\n-- Drop:\nDROP INDEX idx_city ON employees;`,note:"MySQL composite: put most selective column first"},
          {platform:"postgres", code:`-- Standard:\nCREATE INDEX idx_city ON employees(city);\n\n-- Concurrent (no table lock!):\nCREATE INDEX CONCURRENTLY idx_city\n  ON employees(city);\n\n-- Partial index (only active employees):\nCREATE INDEX idx_active\n  ON employees(name)\n  WHERE active = 1;\n\n-- Drop:\nDROP INDEX idx_city;`,note:"PostgreSQL partial indexes are very efficient for filtered queries"},
          {platform:"sqlserver",code:`-- Standard:\nCREATE INDEX idx_city\n  ON employees(city);\n\n-- With INCLUDE (covers the query):\nCREATE INDEX idx_dept_covering\n  ON employees(dept)\n  INCLUDE (name, salary);\n-- No key lookup needed if SELECT only\n-- uses dept, name, salary\n\n-- Drop:\nDROP INDEX employees.idx_city;`,note:"INCLUDE columns make 'covering indexes' — fastest possible reads"},
        ]}/>
      </div>
    )},
    {title:"When NOT to index",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={T.orange}>More indexes ≠ faster database. Every index must be maintained on INSERT, UPDATE, and DELETE — slowing writes. Over-indexing is a common performance trap.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{header:"CREATE indexes on",color:T.green,icon:"✓",items:["Columns in WHERE clauses (high-cardinality)","JOIN ON columns (foreign keys especially)","ORDER BY columns in slow queries","Columns in GROUP BY on large tables"]},
            {header:"DON'T index",color:T.red,icon:"✗",items:["Tiny tables (< 1,000 rows) — scan is faster","Boolean/low-cardinality columns (active, gender)","Columns rarely used in queries","Every column by default (storage + write overhead)"]},
          ].map(g=>(
            <div key={g.header} style={{border:`1px solid ${g.color}33`,borderRadius:8,padding:"12px 14px",background:`${g.color}07`}}>
              <div style={{fontSize:10,fontWeight:700,color:g.color,fontFamily:"monospace",marginBottom:8}}>{g.icon} {g.header}</div>
              {g.items.map((it,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:g.color,flexShrink:0}}>{g.icon}</span><span style={{fontSize:11,color:T.greyLight,lineHeight:1.5}}>{it}</span></div>)}
            </div>
          ))}
        </div>
      </div>
    )},
    {title:"Quiz",content:()=><Quiz color={pc} questions={[
      {type:"bug",question:"This query is slow on a 1M-row table. What's the problem?",code:`SELECT * FROM employees\nWHERE UPPER(name) = 'BOLA ADEYEMI';`,options:["UPPER is wrong function — use LOWER","UPPER() wraps the indexed column, preventing index use — index becomes useless","Missing semicolon","name column can't be indexed"],correct:1,explanation:"Applying a function to an indexed column forces a full scan because the index stores original values, not UPPER(name). Fix: store data in consistent case (UPPER or lower), use a function-based index (PostgreSQL/Oracle), or filter by exact case: WHERE name = 'Bola Adeyemi'."},
      {question:"You add indexes on 15 columns of a busy write-heavy table. The read queries speed up but what happens to writes?",options:["Writes also speed up","Nothing — indexes only affect reads","Writes slow down because every INSERT/UPDATE/DELETE must maintain all 15 indexes","The database runs out of storage"],correct:2,explanation:"Every index adds overhead to write operations. An INSERT must update all 15 index structures. On a write-heavy table, over-indexing can make INSERT/UPDATE 10x slower. The right number of indexes balances read speed against write cost."},
    ]}/>},
  ]}/>;
}

// ─── CATALOG & APP SHELL ──────────────────────────────────────────────────────
const MODULES=[
  {id:"01",title:"SELECT & FROM",     icon:"🔍",level:"easy",  desc:"Choose columns, filter rows, sort results",   color:T.cyan,    component:Module01},
  {id:"02",title:"WHERE",            icon:"🎯",level:"easy",  desc:"Filter rows with conditions and predicates",  color:T.blue,    component:Module02},
  {id:"03",title:"GROUP BY",         icon:"📊",level:"mid",   desc:"Aggregate and summarise your data",           color:T.green,   component:Module03},
  {id:"04",title:"JOINs",            icon:"🔗",level:"mid",   desc:"Combine rows from multiple tables",           color:T.yellow,  component:Module04},
  {id:"05",title:"Subqueries & CTEs",icon:"🪆",level:"mid",   desc:"Nested queries and named query expressions",  color:T.orange,  component:Module05},
  {id:"06",title:"CASE",             icon:"🌿",level:"mid",   desc:"Conditional logic and if-then-else in SQL",   color:T.teal,    component:Module06},
  {id:"07",title:"Window Functions", icon:"🪟",level:"hard",  desc:"Row-by-row calculations over ordered sets",   color:T.purple,  component:Module07},
  {id:"08",title:"Set Operations",   icon:"♾️",level:"mid",   desc:"UNION, INTERSECT, EXCEPT across result sets", color:T.indigo,  component:Module08},
  {id:"09",title:"NULL Handling",    icon:"❔",level:"easy",  desc:"Understanding and working with NULLs",        color:T.orange,  component:Module09},
  {id:"10",title:"Views",            icon:"🔭",level:"mid",   desc:"Virtual tables and reusable query logic",     color:T.cyan,    component:Module10},
  {id:"11",title:"DML",              icon:"✏️",level:"mid",   desc:"INSERT, UPDATE, DELETE — modifying data",     color:T.blue,    component:Module11},
  {id:"12",title:"String & Dates",   icon:"📅",level:"mid",   desc:"Text manipulation and date arithmetic",       color:T.green,   component:Module12},
  {id:"13",title:"Transactions",     icon:"⚡",level:"hard",  desc:"ACID, BEGIN, COMMIT, ROLLBACK, SAVEPOINT",   color:T.yellow,  component:Module13},
  {id:"14",title:"Indexes",          icon:"⚡",level:"hard",  desc:"Speed up queries with B-tree indexing",       color:T.red,     component:Module14},
];
const LEVEL_STYLE={
  easy: {label:"Beginner",  bg:"rgba(74,222,128,.1)", text:T.green},
  mid:  {label:"Intermediate",bg:"rgba(250,204,21,.1)",text:T.yellow},
  hard: {label:"Advanced",  bg:"rgba(248,113,113,.1)",text:T.red},
};

function Catalog({onSelect,platform}){
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?MODULES:MODULES.filter(m=>m.level===filter);
  return(
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 20px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:36,fontWeight:800,color:T.white,fontFamily:"'Syne',sans-serif",letterSpacing:-1}}>SQL Playground</div>
        <div style={{fontSize:13,color:T.grey,marginTop:6}}>14 interactive modules · visual-first · three SQL dialects</div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:14}}>
          {["all","easy","mid","hard"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 14px",borderRadius:16,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,transition:"all .18s",border:`1px solid ${filter===f?(f==="all"?T.cyan:LEVEL_STYLE[f].text):"rgba(255,255,255,.1)"}`,background:filter===f?(f==="all"?"rgba(34,211,238,.1)":LEVEL_STYLE[f].bg):"transparent",color:filter===f?(f==="all"?T.cyan:LEVEL_STYLE[f].text):T.grey}}>
              {f==="all"?"All levels":LEVEL_STYLE[f].label}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {filtered.map((m,i)=>(
          <div key={m.id} onClick={()=>onSelect(m)} style={{border:`1px solid ${T.slate}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",background:T.surface,transition:"all .18s",animation:`fadeUp .4s ease ${i*40}ms both"`,position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${m.color}44`;e.currentTarget.style.background=`${m.color}0a`;}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${T.slate}`;e.currentTarget.style.background=T.surface;}}>
            <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at top left,${m.color}08 0%,transparent 60%)`,pointerEvents:"none"}}/>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:22}}>{m.icon}</div>
              <span style={{fontSize:8,padding:"2px 7px",borderRadius:8,background:LEVEL_STYLE[m.level].bg,color:LEVEL_STYLE[m.level].text,fontFamily:"monospace",fontWeight:700}}>{LEVEL_STYLE[m.level].label}</span>
            </div>
            <div style={{fontSize:9,color:m.color,fontFamily:"monospace",marginBottom:3,fontWeight:700,letterSpacing:.5}}>MODULE {m.id}</div>
            <div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:"'Syne',sans-serif",marginBottom:4,lineHeight:1.2}}>{m.title}</div>
            <div style={{fontSize:10,color:T.grey,lineHeight:1.5}}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleShell({module,onBack,platform,setPlatform}){
  const Comp=module.component;
  const pc=module.color;
  const idx=MODULES.findIndex(m=>m.id===module.id);
  const prev=MODULES[idx-1];
  const next=MODULES[idx+1];
  return(
    <div>
      {/* Sticky header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.slate}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:8}}>
        <button onClick={onBack} style={{padding:"4px 10px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${T.slate}`,background:"transparent",color:T.grey}}>← Catalog</button>
        <span style={{fontSize:16}}>{module.icon}</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:"'Syne',sans-serif"}}>{module.title}</div>
          <div style={{fontSize:9,color:T.grey}}>Module {module.id} of {MODULES.length}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:3,background:T.card,padding:3,borderRadius:10,border:`1px solid ${T.slate}`}}>
          {Object.values(PLAT).map(p=>(
            <button key={p.id} onClick={()=>setPlatform(p.id)} style={{padding:"4px 9px",borderRadius:7,border:"none",background:platform===p.id?p.bg:"transparent",color:platform===p.id?p.color:T.grey,fontSize:8,cursor:"pointer",fontFamily:"monospace",fontWeight:700,transition:"all .15s"}}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px"}}>
        <Comp platform={platform}/>
      </div>
      {/* Prev / Next */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px 32px",display:"flex",justifyContent:"space-between",gap:12}}>
        {prev?(
          <button onClick={()=>onBack(prev)} style={{flex:1,padding:"10px 14px",borderRadius:10,cursor:"pointer",border:`1px solid ${T.slate}`,background:T.surface,color:T.grey,fontSize:10,fontFamily:"monospace",textAlign:"left",display:"flex",gap:8,alignItems:"center"}}
            onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${prev.color}44`;e.currentTarget.style.color=prev.color;}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${T.slate}`;e.currentTarget.style.color=T.grey;}}>
            <span>←</span>
            <div><div style={{fontSize:8,color:T.greyDark,marginBottom:1}}>Previous</div>{prev.icon} {prev.title}</div>
          </button>
        ):<div style={{flex:1}}/>}
        {next&&(
          <button onClick={()=>onBack(next)} style={{flex:1,padding:"10px 14px",borderRadius:10,cursor:"pointer",border:`1px solid ${T.slate}`,background:T.surface,color:T.grey,fontSize:10,fontFamily:"monospace",textAlign:"right",display:"flex",gap:8,alignItems:"center",justifyContent:"flex-end"}}
            onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${next.color}44`;e.currentTarget.style.color=next.color;}}
            onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${T.slate}`;e.currentTarget.style.color=T.grey;}}>
            <div><div style={{fontSize:8,color:T.greyDark,marginBottom:1}}>Next</div>{next.icon} {next.title}</div>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [platform,setPlatform]=useState("mysql");
  const [current,setCurrent]=useState(null);
  const handleBack=(mod)=>{
    if(mod&&mod.id)setCurrent(mod);
    else setCurrent(null);
  };
  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,minHeight:"100vh",color:T.white}}>
      <style>{GS}</style>
      {!current&&(
        <Catalog onSelect={m=>setCurrent(m)} platform={platform}/>
      )}
      {current&&(
        <ModuleShell module={current} onBack={handleBack} platform={platform} setPlatform={setPlatform}/>
      )}
    </div>
  );
}