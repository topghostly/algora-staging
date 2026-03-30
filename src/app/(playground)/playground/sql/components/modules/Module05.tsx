"use client"
import React, { useState } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP } from "../data";
import { SQLBlock, Hint, Course, CommonMistakes, Quiz, Note, Tip } from "../sql-shared";

function SubqueryExecutionVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
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
            <div style={{fontSize:9,color:pc,fontFamily:"monospace",marginBottom:6,letterSpacing:.5}}>{PLAT[platform as keyof typeof PLAT].icon} {PLAT[platform as keyof typeof PLAT].label}</div>
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

function CTELayerVisual({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  const [step,setStep]=useState(0);
  const deptStats=[
    {dept:"Engineering",headcount:4,avg_sal:89250,max_sal:93000},
    {dept:"Analytics",  headcount:3,avg_sal:72000,max_sal:75000},
    {dept:"Product",    headcount:3,avg_sal:68000,max_sal:71000},
  ];
  const highEarners=EMP.filter(e=>{const d=deptStats.find(d=>d.dept===e.dept);return d&&e.salary>d.avg_sal;}).map(e=>{const d=deptStats.find(d=>d.dept===e.dept);if(!d)return{name:e.name,dept:e.dept,salary:e.salary,dept_avg:0,above:0};return{name:e.name,dept:e.dept,salary:e.salary,dept_avg:d.avg_sal,above:e.salary-d.avg_sal};}).sort((a,b)=>b.above-a.above);
  const STEPS=[
    {label:"WITH dept_stats",sql:`WITH dept_stats AS (\n  SELECT dept,\n    COUNT(*)    AS headcount,\n    AVG(salary) AS avg_sal,\n    MAX(salary) AS max_sal\n  FROM employees\n  GROUP BY dept\n)`,preview:deptStats,cols:["dept","headcount","avg_sal","max_sal"],desc:"CTE 1: aggregate salary stats per department. Not executed yet — just defined."},
    {label:"+ high_earners",sql:`WITH dept_stats AS (\n  SELECT dept, COUNT(*) AS headcount,\n    AVG(salary) AS avg_sal, MAX(salary) AS max_sal\n  FROM employees GROUP BY dept\n),\nhigh_earners AS (\n  SELECT e.name, e.dept, e.salary, d.avg_sal\n  FROM employees e\n  JOIN dept_stats d ON e.dept = d.dept\n  WHERE e.salary > d.avg_sal\n)`,preview:highEarners.map(e=>({name:e.name,dept:e.dept,salary:e.salary,dept_avg:e.dept_avg})),cols:["name","dept","salary","dept_avg"],desc:"CTE 2 references CTE 1 as if it were a real table. Finds employees above their dept average."},
    {label:"Final SELECT",sql:`WITH dept_stats AS (\n  SELECT dept, COUNT(*) AS headcount,\n    AVG(salary) AS avg_sal, MAX(salary) AS max_sal\n  FROM employees GROUP BY dept\n),\nhigh_earners AS (\n  SELECT e.name, e.dept, e.salary, d.avg_sal\n  FROM employees e\n  JOIN dept_stats d ON e.dept = d.dept\n  WHERE e.salary > d.avg_sal\n)\nSELECT h.name, h.dept, h.salary,\n  h.avg_sal AS dept_avg,\n  h.salary - h.avg_sal AS above_avg_by,\n  d.headcount\nFROM high_earners h\nJOIN dept_stats d ON h.dept = d.dept\nORDER BY above_avg_by DESC;`,preview:highEarners.map(e=>({name:e.name,dept:e.dept,salary:e.salary,above:e.above})),cols:["name","dept","salary","above"],desc:"Final SELECT references both CTEs like tables. The query reads naturally top-to-bottom."},
  ];
  const cur=STEPS[step];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Hint icon="👆">Click each <strong>numbered step</strong> above to build the CTE chain one layer at a time. Each step shows the SQL so far and a preview of what that CTE produces.</Hint>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{padding:"5px 12px",borderRadius:18,fontSize:10,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${step===i?pc:step>i?pc+"44":"rgba(255,255,255,.08)"}`,background:step===i?`${pc}18`:step>i?`${pc}08`:"transparent",color:step===i?pc:step>i?pc+"99":T.grey,transition:"all .2s",fontWeight:step===i?700:400}}>
            {step>i?"✓ ":""}{i+1}. {s.label}
          </button>
        ))}
      </div>
      <div style={{background:`${pc}09`,border:`1px solid ${pc}25`,borderRadius:8,padding:"8px 12px",fontSize:11,color:T.greyLight}}>{cur.desc}</div>
      <SQLBlock code={cur.sql} platform={platform}/>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:pc,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>PREVIEW — {cur.preview.length} rows</div>
        <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${T.slate}`}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'JetBrains Mono',monospace"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.slate}`,background:"rgba(4,9,20,.9)"}}>
              {cur.cols.map(c=><th key={c} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:T.greyDark,fontWeight:700}}>{c}</th>)}
            </tr></thead>
            <tbody>{cur.preview.map((row: any,ri: number)=>(
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

export default function Module05({platform}: any){
  const pc=PLAT[platform as keyof typeof PLAT].color;
  return <Course color={pc} steps={[
    {title:"How subqueries execute",content:()=><SubqueryExecutionVisual platform={platform}/>},
    {title:"Types of subqueries",content:()=>(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.grey,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>IN — value must be in list</div>
            <SQLBlock platform={platform} code={`-- Orders from Lagos customers:\nSELECT order_id, amount\nFROM orders\nWHERE cust_id IN (\n  SELECT cust_id FROM customers\n  WHERE city = 'Lagos'\n);\n-- Inner query returns (101, 104)\n-- Outer: WHERE cust_id IN (101, 104)`}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.grey,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>EXISTS — check if rows exist</div>
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
          <div><div style={{fontSize:10,fontWeight:700,color:T.red,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>Subquery — nested and hard to read</div><SQLBlock platform={platform} code={`SELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN (\n  SELECT dept, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept\n) d ON e.dept = d.dept\nWHERE e.salary > d.avg_sal;`}/></div>
          <div><div style={{fontSize:10,fontWeight:700,color:pc,fontFamily:"monospace",marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>CTE — readable top-to-bottom ✓</div><SQLBlock platform={platform} code={`WITH dept_avg AS (\n  SELECT dept, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept\n)\nSELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN dept_avg d ON e.dept = d.dept\nWHERE e.salary > d.avg_sal;`}/></div>
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
