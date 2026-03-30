"use client"
import React, { useState, useRef } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP, gc } from "../data";
import { SQLBlock, Hint, Course, CommonMistakes, Quiz, Note, SLabel } from "../sql-shared";

function WindowSlider({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [fn,setFn]=useState("ROW_NUMBER");
  const [partBy,setPartBy]=useState("dept");
  const [ordCol,setOrdCol]=useState("salary");
  const [ordDir,setOrdDir]=useState("DESC");
  const [activeRow,setActiveRow]=useState<number | null>(null);
  const [running,setRunning]=useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const FNS=[
    {id:"ROW_NUMBER",  label:"ROW_NUMBER()",  desc:"Unique sequential number per partition — no ties"},
    {id:"RANK",        label:"RANK()",         desc:"Ties get same rank; next rank skips (1,1,3)"},
    {id:"DENSE_RANK",  label:"DENSE_RANK()",  desc:"Ties get same rank; no gaps (1,1,2)"},
    {id:"LAG",         label:"LAG(salary,1)",  desc:"Previous row's salary; NULL for first row"},
    {id:"LEAD",        label:"LEAD(salary,1)", desc:"Next row's salary; NULL for last row"},
    {id:"SUM_OVER",    label:"SUM() running", desc:"Cumulative salary within partition"},
  ];

  const sorted=[...EMP].sort((a: any,b: any)=>{
    const pa=String(a[partBy as keyof typeof a]),pb=String(b[partBy as keyof typeof b]);
    if(pa!==pb)return pa<pb?-1:1;
    const va=a[ordCol as keyof typeof a],vb=b[ordCol as keyof typeof b];
    return ordDir==="DESC"?vb-va:va-vb;
  });

  const groups: Record<string, any[]> = {};
  sorted.forEach(r=>{const k=String(r[partBy as keyof typeof r]);if(!groups[k])groups[k]=[];groups[k].push(r);});

  const computed: any[] = [...sorted];
  Object.values(groups).forEach(gRows=>{
    let prevVal: any = null, denseRank = 0, currentSum = 0;
    gRows.forEach((r,i)=>{
      const idx=sorted.findIndex(s=>s.id===r.id);
      if(r[ordCol as keyof typeof r]!==prevVal)denseRank++;
      currentSum += (r[ordCol as keyof typeof r] as number) || 0;
      const sameAbove=i>0&&gRows[i-1][ordCol]===r[ordCol];
      computed[idx]._row_number=i+1;
      computed[idx]._rank=sameAbove?computed[sorted.findIndex(s=>s.id===gRows[i-1].id)]._rank:i+1;
      computed[idx]._dense_rank=denseRank;
      computed[idx]._lag=i>0?gRows[i-1][ordCol]:null;
      computed[idx]._lead=i<gRows.length-1?gRows[i+1][ordCol]:null;
      computed[idx]._sum_over=currentSum;
      prevVal=r[ordCol as keyof typeof r];
    });
  });

  const fnKey: Record<string, string> = {ROW_NUMBER:"_row_number",RANK:"_rank",DENSE_RANK:"_dense_rank",LAG:"_lag",LEAD:"_lead",SUM_OVER:"_sum_over"};
  const activeFn=FNS.find(f=>f.id===fn)!;
  const fnSql: Record<string, string> = {ROW_NUMBER:"ROW_NUMBER()",RANK:"RANK()",DENSE_RANK:"DENSE_RANK()",LAG:`LAG(${ordCol}, 1)`,LEAD:`LEAD(${ordCol}, 1)`,SUM_OVER:`SUM(${ordCol})`};

  const play=()=>{
    timers.current.forEach(clearTimeout);timers.current=[];
    setActiveRow(null);setRunning(true);
    sorted.forEach((_,i)=>{
      const t=setTimeout(()=>{setActiveRow(i);if(i===sorted.length-1)setTimeout(()=>{setRunning(false);setActiveRow(null);},600);},(i+1)*350);
      timers.current.push(t as unknown as NodeJS.Timeout);
    });
  };

  const sql=`SELECT name, ${partBy}, ${ordCol},\n  ${fnSql[fn]} OVER (\n    PARTITION BY ${partBy}\n    ORDER BY ${ordCol} ${ordDir}\n  ) AS result\nFROM employees;`;

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
              <tbody>{computed.map((row: any,ri: number)=>{
                const isDone=activeRow!==null&&ri<=activeRow;
                const isActive=activeRow===ri;
                const prev=ri>0?computed[ri-1]:null;
                const isNewPart=prev&&String(row[partBy as keyof typeof row])!==String(prev[partBy as keyof typeof prev]);
                const key=fnKey[fn];
                return(
                  <tr key={row.id} style={{borderBottom:ri<computed.length-1?`1px solid ${T.slate}44`:"none",borderTop:isNewPart?`2px solid ${pc}44`:"none",background:isActive?`${pc}22`:isDone?`${pc}08`:"transparent",transition:"all .2s"}}>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{row.name}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:isNewPart||ri===0?pc:T.greyLight,fontWeight:isNewPart||ri===0?700:400}}>{String(row[partBy as keyof typeof row])}</td>
                    <td style={{padding:"5px 10px",fontSize:10,color:T.greyLight}}>{typeof row[ordCol as keyof typeof row]==="number"?row[ordCol as keyof typeof row].toLocaleString():row[ordCol as keyof typeof row]}</td>
                    <td style={{padding:"5px 10px",fontSize:11}}>
                      {isDone?(
                        <span style={{color:pc,fontWeight:700,animation:isActive?"popIn .2s ease":"none"}}>{row[key]===null?"NULL":typeof row[key]==="number"?row[key].toLocaleString():String(row[key])}</span>
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

export default function Module07({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  return <Course color={pc} steps={[
    {title:"GROUP BY vs window functions",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Note color={pc}>Window functions compute a value for each row using related rows — without collapsing them. Every input row stays as an output row. This is the key difference from GROUP BY.</Note>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.red,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>GROUP BY — collapses (10 → 3 rows)</div>
            <SQLBlock platform={platform} code={`SELECT dept, AVG(salary)\nFROM employees\nGROUP BY dept;\n-- 3 rows out\n-- Individual names: gone`}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:pc,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>WINDOW — keeps all rows (10 → 10)</div>
            <SQLBlock platform={platform} code={`SELECT name, dept, salary,\n  AVG(salary) OVER (\n    PARTITION BY dept\n  ) AS dept_avg\nFROM employees;\n-- 10 rows out — nobody lost!\n-- Each row gets its dept average`}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{dept:"Engineering",rows:[{name:"Ifeoma",salary:93000},{name:"Chidi",salary:91000},{name:"Funke",salary:88000},{name:"Amara",salary:85000}],avg:89250},
            {dept:"Analytics",rows:[{name:"Efe",salary:75000},{name:"Bola",salary:72000},{name:"Henry",salary:69000}],avg:72000}].map(g=>(
            <div key={g.dept} style={{border:`1px solid ${T.slate}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{padding:"5px 10px",background:"rgba(4,9,20,.9)",fontSize:9,color:T.greyDark,fontFamily:"monospace",fontWeight:700}}>{g.dept} — dept_avg = {g.avg.toLocaleString()}</div>
              {g.rows.map((r,ri)=>(
                <div key={ri} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",padding:"4px 10px",borderBottom:ri<g.rows.length-1?`1px solid ${T.slate}22`:"none"}}>
                  <span style={{fontSize:9,fontFamily:"monospace",color:pc}}>{r.name}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:T.greyLight}}>{r.salary.toLocaleString()}</span>
                  <span style={{fontSize:9,fontFamily:"monospace",color:pc,fontWeight:700}}>{g.avg.toLocaleString()}</span>
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
