"use client";
import React, { useState, useEffect } from "react";
import { T, PLAT } from "../sql-constants";
import { EMP, gc } from "../data";
import { SQLBlock, SLabel, Hint, Course, CommonMistakes, Quiz, Note, Tip } from "../sql-shared";

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

export default function Module03({platform}){
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

