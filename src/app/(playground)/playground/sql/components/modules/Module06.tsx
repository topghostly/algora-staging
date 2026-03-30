"use client"
import React, { useState } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP, gc, ORDERS } from "../data";
import { SQLBlock, Hint, Course, CommonMistakes, Quiz, Note, SLabel } from "../sql-shared";

function CaseRowWalkthrough({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [whens,setWhens]=useState([
    {when:"salary >= 90000",then:"Senior",  id:1},
    {when:"salary >= 75000",then:"Mid-level",id:2},
    {when:"salary >= 65000",then:"Junior",  id:3},
  ]);
  const [elseVal,setElseVal]=useState("Unclassified");
  const [selectedRow,setSelectedRow]=useState<number | null>(null);
  const evalCase=(row: any)=>{
    for(const w of whens){
      try{
        const expr=w.when.replace(/salary/g,String(row.salary)).replace(/hired/g,String(row.hired)).replace(/active/g,String(row.active));
        // Note: Using eval here for demonstration purposes in the visualizer.
        // In a real app, this should be a safe parser.
        if(eval(expr))return{value:w.then,matchedWhen:w.when,matchedIdx:whens.indexOf(w)};
      }catch{}
    }
    return{value:elseVal,matchedWhen:null,matchedIdx:-1};
  };
  const addWhen=()=>setWhens(p=>[...p,{when:"salary >= ",then:"",id:Date.now()}]);
  const removeWhen=(id: number)=>setWhens(p=>p.filter(w=>w.id!==id));
  const update=(id: number,f: string,v: string)=>setWhens(p=>p.map(w=>w.id===id?{...w,[f]:v}:w));
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
                <button onClick={()=>removeWhen(w.id)} style={{padding:"2px 6px",borderRadius:4,fontSize:8,cursor:"pointer",border:"1px solid rgba(248,113,113,.2)",background:"rgba(248,113,113,.07)",color:T.red}}>x</button>
              </div>
            ))}
            <div style={{display:"flex",gap:6,alignItems:"center",padding:"6px 8px",borderRadius:7,background:selRow&&selRow.tier.matchedIdx===-1?"rgba(251,146,60,.1)":"rgba(255,255,255,.02)",border:`1px solid ${selRow&&selRow.tier.matchedIdx===-1?T.orange:T.slate}`,transition:"all .3s"}}>
              <span style={{minWidth:14}}/>
              <span style={{fontSize:9,color:selRow&&selRow.tier.matchedIdx===-1?T.orange:T.greyDark,fontFamily:"monospace",fontWeight:700,minWidth:32,transition:"color .3s"}}>{selRow&&selRow.tier.matchedIdx===-1?"→ ELSE":"ELSE"}</span>
              <input value={elseVal} onChange={e=>setElseVal(e.target.value)} style={{flex:1,padding:"3px 7px",borderRadius:5,border:`1px solid ${T.slate}`,background:T.bg,color:T.greyLight,fontSize:9,fontFamily:"monospace"}}/>
            </div>
          </div>
          {selRow&&(
            <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(74,222,128,.07)",border:`1px solid ${T.green}33`,animation:"fadeUp .2s ease"}}>
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

export default function Module06({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
              {([["Engineering",4,3,0],["Analytics",3,1,0],["Product",3,0,1]] as [string, number, number, number][]).map(([d,t,s,i],ri)=>{
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
              {[...ORDERS].sort((a,b)=>{const p: Record<string, number>={pending:1,completed:2,cancelled:3};return(p[a.status]||4)-(p[b.status]||4)||b.amount-a.amount;}).map((o,i)=>(
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
