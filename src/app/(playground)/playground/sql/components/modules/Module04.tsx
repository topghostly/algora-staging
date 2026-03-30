"use client"
import React, { useState, useRef } from "react";
import { T, PLAT } from "../sql-constants";
import { ORDERS, CUSTS, gc } from "../data";
import { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip, Warn } from "../sql-shared";

function JoinMatchVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [joinType,setJoinType]=useState<keyof typeof jDefs>("INNER");
  const [phase,setPhase]=useState(0);
  const [running,setRunning]=useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const jDefs = {
    INNER:{label:"INNER JOIN",color:T.blue,  desc:"Only rows with a match in BOTH tables"},
    LEFT: {label:"LEFT JOIN", color:T.green, desc:"ALL left rows + matching right (NULL if none)"},
    RIGHT:{label:"RIGHT JOIN",color:T.orange,desc:"ALL right rows + matching left (NULL if none)"},
    FULL: {label:"FULL OUTER JOIN",color:T.purple,desc:"ALL rows from both tables"},
    CROSS:{label:"CROSS JOIN",color:T.pink,  desc:"Every left × every right (no ON condition)"},
  };
  const def=jDefs[joinType];
  const isMatchedLeft=(o: any)=>CUSTS.some(c=>c.cust_id===o.cust_id);
  const isMatchedRight=(c: any)=>ORDERS.some(o=>o.cust_id===c.cust_id);
  const leftVisible=(o: any)=>{
    if(joinType==="INNER") return isMatchedLeft(o);
    if(joinType==="RIGHT") return isMatchedLeft(o);
    return true;
  };
  const rightVisible=(c: any)=>{
    if(joinType==="INNER") return isMatchedRight(c);
    if(joinType==="LEFT")  return isMatchedRight(c);
    return true;
  };
  const result=(()=>{
    if(joinType==="INNER") return ORDERS.filter(o=>CUSTS.some(c=>c.cust_id===o.cust_id)).map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c?.name,amount:o.amount,city:c?.city};});
    if(joinType==="LEFT")  return ORDERS.map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c?.name??null,amount:o.amount,city:c?.city??null};});
    if(joinType==="RIGHT") return CUSTS.map(c=>{const o=ORDERS.find(o=>o.cust_id===c.cust_id);return{order_id:o?.order_id??null,customer:c.name,amount:o?.amount??null,city:c.city};});
    if(joinType==="FULL"){const l=ORDERS.map(o=>{const c=CUSTS.find(c=>c.cust_id===o.cust_id);return{order_id:o.order_id,customer:c?.name??null,amount:o.amount,city:c?.city??null};});const r=CUSTS.filter(c=>!ORDERS.some(o=>o.cust_id===c.cust_id)).map(c=>({order_id:null,customer:c.name,amount:null,city:c.city}));return[...l,...r];}
    if(joinType==="CROSS"){const r: any[]=[];ORDERS.slice(0,3).forEach(o=>CUSTS.slice(0,3).forEach(c=>r.push({order_id:o.order_id,customer:c.name,amount:o.amount})));return r;}
    return[];
  })();
  const sql: Record<string, string> = {
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
    timer.current=setInterval(()=>{p++;setPhase(p);if(p>=3){if(timer.current)clearInterval(timer.current);setRunning(false);}},700);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="▶">Select a JOIN type with the buttons above, then click <strong>▶ Animate JOIN</strong>. Watch rows light up or dim based on whether they match. The result table appears after the animation.</Hint>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {(Object.keys(jDefs) as Array<keyof typeof jDefs>).map((k)=>(
          <button key={k} onClick={()=>{setJoinType(k);setPhase(0);setRunning(false);if(timer.current)clearInterval(timer.current);}} style={{padding:"5px 12px",borderRadius:8,fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,border:`1px solid ${joinType===k?jDefs[k].color:"rgba(255,255,255,.08)"}`,background:joinType===k?`${jDefs[k].color}14`:"rgba(255,255,255,.03)",color:joinType===k?jDefs[k].color:T.grey,transition:"all .2s"}}>
            {jDefs[k].label}
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
                {result.map((row: any,ri: number)=>(
                  <tr key={ri} style={{borderBottom:ri<result.length-1?`1px solid ${T.slate}44`:"none",animation:`rowAppear .3s ease ${ri*50}ms both`}}>
                    {Object.values(row).map((v,ci)=><td key={ci} style={{padding:"5px 10px",fontSize:10,color:v===null?T.greyDark:T.greyLight,fontStyle:v===null?"italic":"normal"}}>{v===null?"NULL":String(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:"4px 10px",fontSize:8,color:T.greyDark,fontFamily:"monospace",borderTop:`1px solid ${T.slate}44`}}>{result.length} rows</div>
          </div>
          {result.some((r: any)=>Object.values(r).some(v=>v===null))&&<div style={{marginTop:5,fontSize:9,color:T.greyDark,fontFamily:"monospace"}}>NULL = no matching row in the other table</div>}
        </div>
      )}
    </div>
  );
}

export default function Module04({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
              {ORDERS.slice(0,5).map((e,i)=>{const m=CUSTS.find(x=>x.cust_id===e.cust_id);return(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1.5fr",padding:"5px 10px",borderBottom:i<4?`1px solid ${T.slate}44`:"none"}}>
                  <span style={{fontSize:10,fontFamily:"monospace",color:T.greyLight}}>{e.order_id}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyDark}}>{e.product}</span>
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
