"use client"
import React, { useState } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP } from "../data";
import { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip, PlatformDiff } from "../sql-shared";

function SelectVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const ALL_COLS=["id","name","dept","salary","hired","active","city"];
  const [cols,setCols]=useState(["id","name","dept","salary"]);
  const [orderBy,setOrderBy]=useState("none");
  const [dir,setDir]=useState("DESC");
  const [lim,setLim]=useState(0);
  const [distinct,setDistinct]=useState(false);
  const toggle=(c: string)=>setCols(p=>p.includes(c)?p.length>1?p.filter(x=>x!==c):p:[...p,c]);
  let rows=[...EMP];
  if(distinct&&cols.length===1){const s=new Set();rows=rows.filter(r=>{const v=r[cols[0] as keyof typeof r];if(s.has(v))return false;s.add(v);return true;});}
  if(orderBy!=="none")rows.sort((a: any,b: any)=>{const m=dir==="ASC"?1:-1;return a[orderBy]<b[orderBy]?-m:a[orderBy]>b[orderBy]?m:0;});
  if(lim>0)rows=rows.slice(0,lim);
  const displayed=rows.map((r: any)=>{const o: any={};cols.forEach(c=>o[c]=r[c]);return o;});
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
                {displayed.map((row: any,ri)=>(
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

function ComputedColumnsVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [show,setShow]=useState<number | null>(null);
  const exprs=[
    {label:"salary * 1.1",desc:"Arithmetic — 10% raise",fn:(r: any)=>(r.salary*1.1).toFixed(0),color:T.blue},
    {label:"salary / 12",desc:"Monthly pay",fn:(r: any)=>Math.round(r.salary/12),color:T.green},
    {label:"2024 - hired",desc:"Years at company",fn:(r: any)=>2024-r.hired,color:T.yellow},
    {label:"UPPER(dept)",desc:"All caps department",fn:(r: any)=>r.dept.toUpperCase(),color:T.purple},
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

export default function Module01({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
