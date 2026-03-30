"use client"
import React, { useState, useRef } from "react";
import { T, PLAT } from "../sql-constants";
import { SQLBlock, Hint, Course, Quiz, SLabel, Warn, Note } from "../sql-shared";

interface ResultRow {
  id?: number;
  name: string;
}

function SetOpVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [op,setOp]=useState("UNION_ALL");
  const [step,setStep]=useState(0);
  const timer=useRef<NodeJS.Timeout | null>(null);
  const left: ResultRow[]=[{id:1,name:"Lagos"},{id:2,name:"Accra"},{id:3,name:"Nairobi"},{id:4,name:"Lagos"}];
  const right: ResultRow[]=[{id:3,name:"Nairobi"},{id:4,name:"Lagos"},{id:5,name:"Abuja"},{id:6,name:"Cairo"}];
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
  const oc=OPS.find(o=>o.id===op)!;
  const play=()=>{
    if(timer.current)clearInterval(timer.current);
    setStep(0);let s=0;
    timer.current=setInterval(()=>{s++;setStep(s);if(s>=2 && timer.current)clearInterval(timer.current);},700);
  };
  const leftSurvives=(r: ResultRow)=>{
    if(op==="UNION_ALL"||op==="UNION"||op==="EXCEPT")return true;
    if(op==="INTERSECT")return right.some(x=>x.name===r.name);
    return true;
  };
  const rightSurvives=(r: ResultRow)=>{
    if(op==="UNION_ALL"||op==="UNION")return true;
    if(op==="INTERSECT")return left.some(x=>x.name===r.name);
    if(op==="EXCEPT")return false;
    return true;
  };
  const isDuplicate=(r: ResultRow,side: string)=>{
    if(op!=="UNION")return false;
    if(side==="left"){const seen=new Set(left.slice(0,left.indexOf(r)).map(x=>x.name));if(seen.has(r.name))return true;}
    if(side==="right"){const allLeft=left.map(x=>x.name);if(allLeft.includes(r.name))return true;const seenRight=new Set(right.slice(0,right.indexOf(r)).map(x=>x.name));if(seenRight.has(r.name))return true;}
    return false;
  };

  const PlatformDiff = ({title, diffs}: any) => (
    <div>
        <div style={{fontSize:11,fontWeight:700,color:T.white,marginBottom:8}}>{title}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {diffs.map((d: any) => (
                <div key={d.platform} style={{display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:10,color:PLAT[d.platform as keyof typeof PLAT].color}}>{PLAT[d.platform as keyof typeof PLAT].icon}</span>
                        <span style={{fontSize:9,color:T.greyDark,fontWeight:700,textTransform:"uppercase"}}>{PLAT[d.platform as keyof typeof PLAT].label}</span>
                    </div>
                    <SQLBlock code={d.code} platform={d.platform} />
                    {d.note && <div style={{fontSize:9,color:T.greyDark,fontStyle:"italic"}}>* {d.note}</div>}
                </div>
            ))}
        </div>
    </div>
  )

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

export default function Module08({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
