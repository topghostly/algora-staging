"use client"
import React, { useState } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP } from "../data";
import { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip, PlatformTabs, Warn } from "../sql-shared";

function WhereRowEvaluator({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [col,setCol]=useState("dept");
  const [op,setOp]=useState("=");
  const [val,setVal]=useState("Engineering");
  const [hovId,setHovId]=useState<number | null>(null);
  const colOpts=["id","name","dept","salary","hired","active","city","mgr_id"];
  const ops=["=","!=",">",">=","<","<=","LIKE","IS NULL","IS NOT NULL"];
  const evaluate=(row: any)=>{
    const v=row[col];
    if(op==="IS NULL")return v===null||v===undefined?"TRUE":"FALSE";
    if(op==="IS NOT NULL")return v!==null&&v!==undefined?"TRUE":"FALSE";
    if(v===null||v===undefined)return"UNKNOWN";
    const n=isNaN(val as any)?val.replace(/'/g,""):Number(val);
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
  const rc=(r: string)=>r==="TRUE"?T.green:r==="FALSE"?T.greyDark:T.orange;
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
      <SQLBlock code={`SELECT * FROM employees\nWHERE ${col} ${op}${valInput?` ${isNaN(val as any)?`'${val}'`:val}`:""};\n-- ${passing.length}/${EMP.length} rows returned`} platform={platform}/>
      <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
            {["name","dept","salary","hired","mgr_id","active",`${col} value`,"verdict","included?"].map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:(c==="verdict"||c==="included?")?pc:T.greyDark,letterSpacing:.5,fontWeight:700,whiteSpace:"nowrap"}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {EMP.map((row: any,ri)=>{
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

function AndOrVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [conds,setConds]=useState([{col:"dept",op:"=",val:"Engineering",id:1},{col:"salary",op:">",val:"85000",id:2}]);
  const [logic,setLogic]=useState("AND");
  const add=()=>setConds(p=>[...p,{col:"salary",op:">",val:"70000",id:Date.now()}]);
  const remove=(id: number)=>setConds(p=>p.filter(c=>c.id!==id));
  const update=(id: number,f: string,v: string)=>setConds(p=>p.map(c=>c.id===id?{...c,[f]:v}:c));
  const evalCond=(row: any,cond: any)=>{
    const v=row[cond.col];if(v===null)return false;
    const n=isNaN(cond.val)?cond.val.replace(/'/g,""):Number(cond.val);
    switch(cond.op){case"=":return String(v)===String(n);case"!=":return String(v)!==String(n);case">":return Number(v)>Number(n);case">=":return Number(v)>=Number(n);case"<":return Number(v)<Number(n);case"<=":return Number(v)<=Number(n);case"LIKE":return String(v).toLowerCase().includes(String(n).replace(/%/g,"").toLowerCase());default:return false;}
  };
  const evalRow=(row: any)=>{
    if(conds.length===0)return{pass:true,results:[]};
    const results=conds.map(c=>evalCond(row,c));
    return{pass:logic==="AND"?results.every(Boolean):results.some(Boolean),results};
  };
  const passIds=EMP.filter(r=>evalRow(r).pass).map(r=>r.id);
  const sql=`SELECT * FROM employees\nWHERE\n${conds.map((c,i)=>`${i>0?`  ${logic} `:"  "}${c.col} ${c.op} ${isNaN(c.val as any)?`'${c.val}'`:c.val}`).join("\n")||"  -- add conditions"};\n-- ${passIds.length}/${EMP.length} rows pass`;
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

export default function Module02({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
