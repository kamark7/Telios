import { useState, useEffect } from "react";

const DEFAULT_CHARGES = [

];
const SLIDER_COLORS  = ["#818cf8","#34d399","#fb923c","#f472b6","#38bdf8","#a3e635","#fbbf24"];
const DEFAULT_SLIDERS = [
  { id:1, label:"Up Bank · Daily Life", pct:30, color:"#818cf8" },
  { id:2, label:"BRK · Investment",  pct:70, color:"#34d399" },
];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const sans = { fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" };
const $fmt  = (n) => `$${Math.round(Math.abs(n)).toLocaleString()}`;

// ── Deep shadow helper ──────────────────────────────────────
const glow  = (hex, alpha=0.25) => `0 0 24px ${hex}${Math.round(alpha*255).toString(16).padStart(2,'0')}`;
const lift  = "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)";
const liftSm = "0 4px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)";
const inset = "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)";

// ── Palette ────────────────────────────────────────────────
const P = {
  bg:     "#13161c",
  deep:   "#0d0f14",
  card:   "#1c2028",
  cardHi: "#222832",
  rim:    "rgba(255,255,255,0.07)",
  rimHi:  "rgba(255,255,255,0.12)",
  groove: "rgba(0,0,0,0.4)",
  muted:  "#48546a",
  label:  "#7a8fa8",
  text:   "#e2e8f4",
  sub:    "#9aa8bc",
  green:  "#34d399",
  red:    "#f87171",
  orange: "#fb923c",
  indigo: "#818cf8",
  blue:   "#38bdf8",
  white:  "#f0f4ff",
};

// ── Raised card ─────────────────────────────────────────────
const RaisedCard = ({ children, accent, style={} }) => (
  <div style={{
    background: `linear-gradient(145deg, #1e2530 0%, #181d26 100%)`,
    borderRadius:"22px",
    padding:"20px",
    marginBottom:"12px",
    boxShadow: `${lift}, ${accent ? glow(accent, 0.12) : ""}`,
    border:`1px solid ${P.rim}`,
    position:"relative",
    overflow:"hidden",
    ...style,
  }}>
    {/* Top highlight rim */}
    <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"rgba(255,255,255,0.10)", borderRadius:"999px" }} />
    {children}
  </div>
);

// ── Glass pill ──────────────────────────────────────────────
const StatPill = ({ label, value, color }) => (
  <div style={{
    background:`linear-gradient(145deg, #1e2530, #181d26)`,
    borderRadius:"16px", padding:"14px 10px", textAlign:"center",
    boxShadow:`${liftSm}, ${glow(color, 0.10)}`,
    border:`1px solid ${P.rim}`,
    position:"relative", overflow:"hidden",
  }}>
    <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:"1px", background:"rgba(255,255,255,0.09)" }} />
    <div style={{ fontSize:"16px", fontWeight:"700", color, letterSpacing:"-0.3px" }}>{value}</div>
    <div style={{ fontSize:"10px", color:P.muted, marginTop:"3px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase" }}>{label}</div>
  </div>
);

// ── Tab bar ─────────────────────────────────────────────────
const TabBar = ({ tab, setTab }) => (
  <div style={{
    display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr",
    gap:"5px", marginBottom:"20px",
    background:`linear-gradient(145deg, #1a1f28, #141820)`,
    borderRadius:"20px", padding:"6px",
    boxShadow:`${lift}`,
    border:`1px solid ${P.rim}`,
  }}>
    {[
      { id:"income",  label:"Pays",    icon:"💰" },
      { id:"expense", label:"Expenses", icon:"🛒" },
      { id:"charges", label:"Charges",  icon:"🏦" },
      { id:"sliders", label:"Split", icon:"📊" },
    ].map(t => {
      const active = tab === t.id;
      return (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          background: active ? `linear-gradient(145deg, #252d3a, #1d2430)` : "transparent",
          border: active ? `1px solid ${P.rimHi}` : "1px solid transparent",
          borderRadius:"14px", padding:"9px 4px",
          cursor:"pointer", transition:"all 0.2s",
          boxShadow: active ? `${liftSm}, inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
        }}>
          <div style={{ fontSize:"17px" }}>{t.icon}</div>
          <div style={{ fontSize:"10px", color: active ? P.text : P.muted, fontWeight: active?"600":"400", marginTop:"3px", ...sans }}>{t.label}</div>
        </button>
      );
    })}
  </div>
);

// ── Input ───────────────────────────────────────────────────
const FInput = ({ value, onChange, placeholder, onEnter, style={} }) => (
  <input type="text" value={value} onChange={e=>onChange(e.target.value)}
    onKeyDown={e=>e.key==="Enter"&&onEnter&&onEnter()}
    placeholder={placeholder}
    style={{
      background:`linear-gradient(145deg, #161b23, #121620)`,
      border:`1px solid ${P.rim}`, borderRadius:"13px",
      padding:"12px 16px", color:P.text, fontSize:"14px", width:"100%",
      ...sans, outline:"none", boxSizing:"border-box",
      boxShadow:"inset 0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(0,0,0,0.2)",
      ...style,
    }} />
);

const BigAmt = ({ value, onChange, color, placeholder="0" }) => (
  <div style={{
    background:`linear-gradient(145deg, #161b23, #111520)`,
    border:`1px solid ${P.rim}`, borderRadius:"16px", padding:"16px 18px",
    boxShadow:`inset 0 3px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,0,0,0.3)`,
    marginBottom:"10px",
  }}>
    <div style={{ fontSize:"11px", color:P.muted, fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:"8px" }}>Net Amount</div>
    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
      <span style={{ color, fontSize:"26px", fontWeight:"300" }}>$</span>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ background:"transparent", border:"none", outline:"none", color, fontSize:"34px", fontWeight:"600", width:"100%", ...sans, letterSpacing:"-1px" }} />
    </div>
  </div>
);

const ActionBtn = ({ onClick, children, color, disabled=false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width:"100%", borderRadius:"14px", padding:"14px",
    border: disabled ? `1px solid rgba(255,255,255,0.05)` : "none",
    background: disabled
      ? `linear-gradient(145deg, #1a1f28, #141820)`
      : `linear-gradient(145deg, ${color}ee, ${color}bb)`,
    color: disabled ? P.muted : "#0d1117",
    fontSize:"14px", fontWeight:"700", cursor: disabled?"default":"pointer",
    ...sans, transition:"all 0.2s",
    boxShadow: disabled ? "none" : `${liftSm}, ${glow(color, 0.35)}`,
  }}>{children}</button>
);

const RowItem = ({ icon, label, sub, value, color, onRemove }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderTop:`1px solid rgba(255,255,255,0.04)` }}>
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      {icon && <span style={{ fontSize:"16px" }}>{icon}</span>}
      <div>
        <div style={{ fontSize:"13px", color:P.text, fontWeight:"500" }}>{label}</div>
        {sub && <div style={{ fontSize:"11px", color:P.muted, marginTop:"1px" }}>{sub}</div>}
      </div>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      <span style={{ fontSize:"14px", fontWeight:"700", color }}>{value}</span>
      {onRemove && <button onClick={onRemove} style={{ background:"none", border:"none", color:P.muted, cursor:"pointer", fontSize:"18px", lineHeight:1, padding:"0", opacity:0.6 }}>×</button>}
    </div>
  </div>
);

const GlowSlider = ({ value, onChange, color }) => (
  <input type="range" min={0} max={100} value={value}
    onChange={e=>onChange(Number(e.target.value))}
    style={{ width:"100%", accentColor:color, cursor:"pointer", height:"4px" }} />
);

// ── MAIN ────────────────────────────────────────────────────
export default function App() {
  const now = new Date();
  const [year,    setYear]    = useState(now.getFullYear());
  const [month,   setMonth]   = useState(now.getMonth());
  const [data,    setData]    = useState({});
  const [charges, setCharges] = useState(DEFAULT_CHARGES);
  const [sliders, setSliders] = useState(DEFAULT_SLIDERS);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("income");

  const [ni, setNi] = useState({ amt:"", label:"" });
  const [ne, setNe] = useState({ amt:"", label:"" });
  const [nc, setNc] = useState({ amt:"", label:"", icon:"💳" });
  const [ns, setNs] = useState({ label:"" });

  const key = `${year}-${month}`;

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("fifo-v5");
        if (res) { const s=JSON.parse(res.value); if(s.data)setData(s.data); if(s.charges)setCharges(s.charges); if(s.sliders)setSliders(s.sliders); }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = (d,ch,sl) => {
    setData(d); setCharges(ch); setSliders(sl);
    try { window.storage.set("fifo-v5", JSON.stringify({data:d,charges:ch,sliders:sl})); } catch {}
  };

  const mData   = data[key] || { incomes:[], expenses:[] };
  const incomes  = mData.incomes  || [];
  const expenses = mData.expenses || [];
  const updateM  = (patch) => persist({...data,[key]:{...mData,...patch}},charges,sliders);

  const fixedTotal   = charges.reduce((s,c)=>s+c.amount,0);
  const totalIncome  = incomes.reduce((s,e)=>s+e.amount,0);
  const totalExpense = expenses.reduce((s,e)=>s+e.amount,0);
  const flexible     = Math.max(0, totalIncome - fixedTotal);
  const deficit      = totalIncome > 0 && totalIncome < fixedTotal;
  const sliderSum    = sliders.reduce((s,sl)=>s+sl.pct,0);
  const normalized   = sliders.map(sl=>({...sl, amt:sliderSum>0?Math.round(flexible*sl.pct/sliderSum):0}));

  const addIncome = () => {
    const amt=parseFloat(ni.amt); if(!amt)return;
    updateM({incomes:[...incomes,{id:Date.now(),amount:amt,label:ni.label||"Shutdown",date:new Date().toLocaleDateString("en-AU")}]});
    setNi({amt:"",label:""});
  };
  const addExpense = () => {
    const amt=parseFloat(ne.amt); if(!amt)return;
    updateM({expenses:[...expenses,{id:Date.now(),amount:amt,label:ne.label||"Expense",date:new Date().toLocaleDateString("en-AU")}]});
    setNe({amt:"",label:""});
  };
  const addCharge = () => {
    const amt=parseFloat(nc.amt); if(!amt||!nc.label)return;
    persist(data,[...charges,{id:Date.now(),label:nc.label,amount:amt,icon:nc.icon||"💳"}],sliders);
    setNc({amt:"",label:"",icon:"💳"});
  };
  const addSlider = () => {
    if(!ns.label)return;
    const color=SLIDER_COLORS[sliders.length%SLIDER_COLORS.length];
    const pct=Math.round(100/(sliders.length+1));
    const newList=sliders.map(s=>({...s,pct:Math.round(s.pct*sliders.length/(sliders.length+1))}));
    newList.push({id:Date.now(),label:ns.label,pct,color});
    persist(data,charges,newList);
    setNs({label:""});
  };
  const moveSlider = (id,val) => {
    const idx=sliders.findIndex(s=>s.id===id);
    const ns=[...sliders];
    const diff=val-ns[idx].pct;
    ns[idx]={...ns[idx],pct:val};
    const o=ns.length-1===idx?ns.length-2:ns.length-1;
    ns[o]={...ns[o],pct:Math.max(0,ns[o].pct-diff)};
    persist(data,charges,ns);
  };
  const removeSlider = (id) => {
    if(sliders.length<=1)return;
    const removed=sliders.find(s=>s.id===id);
    const rest=sliders.filter(s=>s.id!==id);
    rest[rest.length-1]={...rest[rest.length-1],pct:rest[rest.length-1].pct+removed.pct};
    persist(data,charges,rest);
  };
  const navMonth = (dir) => { const d=new Date(year,month+dir); setYear(d.getFullYear()); setMonth(d.getMonth()); };

  const [showPicker, setShowPicker] = useState(false);
  const YEARS = [2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

  if (loading) return <div style={{...sans,background:P.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:P.muted,fontSize:"24px"}}>⟳</div>;

  return (
    <div style={{...sans,background:P.bg,minHeight:"100vh",color:P.text,padding:"24px 16px 48px",maxWidth:"440px",margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{marginBottom:"24px"}}>
        <div style={{fontSize:"11px",fontWeight:"600",color:P.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"6px"}}>FIFO · Tracker</div>
        <div style={{fontSize:"30px",fontWeight:"800",color:P.white,letterSpacing:"-1px"}}>Monthly Tracker</div>
      </div>

      {/* MONTH NAV */}
      <RaisedCard style={{marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>navMonth(-1)} style={{
            background:`linear-gradient(145deg,#252d3a,#1a2030)`,
            border:`1px solid ${P.rim}`,color:P.label,borderRadius:"12px",
            width:"38px",height:"38px",cursor:"pointer",fontSize:"18px",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:liftSm,
          }}>‹</button>

          {/* Clickable month/year — opens picker */}
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowPicker(v=>!v)}>
            <div style={{fontSize:"19px",fontWeight:"700",color:P.white,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
              {MONTHS[month]} {year}
              <span style={{fontSize:"11px",color:P.muted,marginTop:"2px"}}>{showPicker?"▲":"▼"}</span>
            </div>
            <div style={{fontSize:"12px",color:P.muted,marginTop:"2px"}}>
              {incomes.length} pay{incomes.length!==1?"s":""} · <span style={{color:P.green,fontWeight:"600"}}>{$fmt(totalIncome)}</span>
            </div>
          </div>

          <button onClick={()=>navMonth(1)} style={{
            background:`linear-gradient(145deg,#252d3a,#1a2030)`,
            border:`1px solid ${P.rim}`,color:P.label,borderRadius:"12px",
            width:"38px",height:"38px",cursor:"pointer",fontSize:"18px",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:liftSm,
          }}>›</button>
        </div>

        {/* PICKER DROPDOWN */}
        {showPicker && (
          <div style={{marginTop:"16px",borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:"16px"}}>
            {/* Year selector */}
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center",marginBottom:"14px"}}>
              {YEARS.map(y=>(
                <button key={y} onClick={()=>{setYear(y);}}
                  style={{
                    background: y===year ? `linear-gradient(145deg,${P.indigo}cc,${P.indigo}88)` : `linear-gradient(145deg,#252d3a,#1a2030)`,
                    border:`1px solid ${y===year ? P.indigo+"66" : P.rim}`,
                    borderRadius:"10px",padding:"6px 10px",
                    color: y===year ? P.white : P.muted,
                    fontSize:"12px",fontWeight: y===year?"700":"500",
                    cursor:"pointer",...sans,
                    boxShadow: y===year ? `${liftSm},${glow(P.indigo,0.25)}` : liftSm,
                    transition:"all 0.15s",
                  }}>{y}</button>
              ))}
            </div>
            {/* Month grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px"}}>
              {MONTHS.map((m,i)=>(
                <button key={m} onClick={()=>{setMonth(i);setShowPicker(false);}}
                  style={{
                    background: i===month ? `linear-gradient(145deg,${P.indigo}cc,${P.indigo}88)` : `linear-gradient(145deg,#252d3a,#1a2030)`,
                    border:`1px solid ${i===month ? P.indigo+"66" : P.rim}`,
                    borderRadius:"10px",padding:"8px 4px",
                    color: i===month ? P.white : P.label,
                    fontSize:"11px",fontWeight: i===month?"700":"400",
                    cursor:"pointer",...sans,
                    boxShadow: i===month ? `${liftSm},${glow(P.indigo,0.2)}` : liftSm,
                    transition:"all 0.15s",
                  }}>{m.slice(0,3)}</button>
              ))}
            </div>
          </div>
        )}
      </RaisedCard>

      {/* STAT PILLS */}
      {totalIncome > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"18px"}}>
          <StatPill label="Received"    value={$fmt(totalIncome)}  color={P.green}  />
          <StatPill label="Charges" value={$fmt(fixedTotal)}   color={P.orange} />
          <StatPill label="Flexible" value={$fmt(flexible)}    color={P.indigo} />
        </div>
      )}

      {/* TABS */}
      <TabBar tab={tab} setTab={setTab} />

      {/* ── PAIES ── */}
      {tab==="income" && <>
        <RaisedCard accent={P.green}>
          <div style={{fontSize:"12px",color:P.muted,fontWeight:"600",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"14px"}}>New Pay</div>
          <BigAmt value={ni.amt} onChange={v=>setNi(p=>({...p,amt:v}))} color={P.green} />
          <FInput value={ni.label} onChange={v=>setNi(p=>({...p,label:v}))} placeholder="Description · e.g: Shutdown FMG" onEnter={addIncome} style={{marginBottom:"12px"}} />
          <ActionBtn onClick={addIncome} color={P.green} disabled={!ni.amt}>+ Add Pay</ActionBtn>
        </RaisedCard>

        {incomes.length > 0 && (
          <RaisedCard>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
              <span style={{fontSize:"12px",fontWeight:"600",color:P.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>This Month's Pays</span>
              <span style={{background:`${P.green}22`,color:P.green,borderRadius:"8px",padding:"3px 9px",fontSize:"11px",fontWeight:"700"}}>{incomes.length}</span>
            </div>
            {incomes.map(e=><RowItem key={e.id} label={e.label} sub={e.date} value={$fmt(e.amount)} color={P.green} onRemove={()=>updateM({incomes:incomes.filter(x=>x.id!==e.id)})} />)}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"12px",borderTop:`1px solid rgba(255,255,255,0.06)`,marginTop:"4px"}}>
              <span style={{fontSize:"12px",color:P.muted}}>Total Received</span>
              <span style={{fontSize:"20px",fontWeight:"700",color:P.green}}>{$fmt(totalIncome)}</span>
            </div>
          </RaisedCard>
        )}

        {incomes.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:P.muted}}><div style={{fontSize:"32px",marginBottom:"10px"}}>💰</div><div style={{fontSize:"13px"}}>No pay this month</div></div>}
      </>}

      {/* ── DÉPENSES ── */}
      {tab==="expense" && <>
        <RaisedCard accent={P.red}>
          <div style={{fontSize:"12px",color:P.muted,fontWeight:"600",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"14px"}}>New Expense</div>
          <BigAmt value={ne.amt} onChange={v=>setNe(p=>({...p,amt:v}))} color={P.red} />
          <FInput value={ne.label} onChange={v=>setNe(p=>({...p,label:v}))} placeholder="Description · e.g: Groceries Coles" onEnter={addExpense} style={{marginBottom:"12px"}} />
          <ActionBtn onClick={addExpense} color={P.red} disabled={!ne.amt}>+ Add Expense</ActionBtn>
        </RaisedCard>

        {expenses.length > 0 && (
          <RaisedCard>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
              <span style={{fontSize:"12px",fontWeight:"600",color:P.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>This Month's Expenses</span>
              <span style={{background:`${P.red}22`,color:P.red,borderRadius:"8px",padding:"3px 9px",fontSize:"11px",fontWeight:"700"}}>{expenses.length}</span>
            </div>
            {expenses.map(e=><RowItem key={e.id} label={e.label} sub={e.date} value={`− ${$fmt(e.amount)}`} color={P.red} onRemove={()=>updateM({expenses:expenses.filter(x=>x.id!==e.id)})} />)}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"12px",borderTop:`1px solid rgba(255,255,255,0.06)`,marginTop:"4px"}}>
              <span style={{fontSize:"12px",color:P.muted}}>Total Spent</span>
              <span style={{fontSize:"20px",fontWeight:"700",color:P.red}}>− {$fmt(totalExpense)}</span>
            </div>
          </RaisedCard>
        )}

        {expenses.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:P.muted}}><div style={{fontSize:"32px",marginBottom:"10px"}}>🛒</div><div style={{fontSize:"13px"}}>No expenses this month</div></div>}
      </>}

      {/* ── CHARGES ── */}
      {tab==="charges" && <>
        <RaisedCard accent={P.orange}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",fontWeight:"600",color:P.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Fixed Charges · /month</span>
            <span style={{fontSize:"20px",fontWeight:"700",color:P.orange}}>{$fmt(fixedTotal)}</span>
          </div>
          {charges.map(c=><RowItem key={c.id} icon={c.icon} label={c.label} value={`$${c.amount}`} color={P.orange} onRemove={()=>persist(data,charges.filter(x=>x.id!==c.id),sliders)} />)}
        </RaisedCard>

        <RaisedCard>
          <div style={{fontSize:"12px",color:P.muted,fontWeight:"600",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"14px"}}>Add a Charge</div>
          <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
            <input value={nc.icon} onChange={e=>setNc(p=>({...p,icon:e.target.value}))}
              style={{background:`linear-gradient(145deg,#161b23,#111520)`,border:`1px solid ${P.rim}`,borderRadius:"13px",padding:"12px",width:"52px",textAlign:"center",fontSize:"18px",outline:"none",boxSizing:"border-box",boxShadow:`inset 0 2px 6px rgba(0,0,0,0.35)`}} />
            <input value={nc.label} onChange={e=>setNc(p=>({...p,label:e.target.value}))}
              placeholder="Charge Name"
              style={{background:`linear-gradient(145deg,#161b23,#111520)`,border:`1px solid ${P.rim}`,borderRadius:"13px",padding:"12px 16px",color:P.text,fontSize:"14px",flex:1,...sans,outline:"none",boxShadow:`inset 0 2px 6px rgba(0,0,0,0.35)`}} />
          </div>
          <div style={{background:`linear-gradient(145deg,#161b23,#111520)`,border:`1px solid ${P.rim}`,borderRadius:"16px",padding:"14px 18px",marginBottom:"12px",boxShadow:`inset 0 3px 10px rgba(0,0,0,0.4)`}}>
            <div style={{fontSize:"11px",color:P.muted,fontWeight:"500",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.07em"}}>Monthly Amount</div>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{color:P.orange,fontSize:"22px",fontWeight:"300"}}>$</span>
              <input type="number" value={nc.amt} onChange={e=>setNc(p=>({...p,amt:e.target.value}))} placeholder="0"
                style={{background:"transparent",border:"none",outline:"none",color:P.orange,fontSize:"28px",fontWeight:"600",width:"100%",...sans}} />
            </div>
          </div>
          <ActionBtn onClick={addCharge} color={P.orange} disabled={!nc.amt||!nc.label}>+ Add Charge</ActionBtn>
        </RaisedCard>
      </>}

      {/* ── SLIDERS ── */}
      {tab==="sliders" && <>
        {!deficit && flexible > 0 ? <>
          <RaisedCard accent={P.indigo}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <div>
                <div style={{fontSize:"11px",color:P.muted,fontWeight:"600",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"4px"}}>This Month's Flexible</div>
                <div style={{fontSize:"28px",fontWeight:"800",color:P.indigo,letterSpacing:"-0.5px"}}>{$fmt(flexible)}</div>
              </div>
              <button onClick={addSlider} style={{
                background:`linear-gradient(145deg,#252d3a,#1a2030)`,
                border:`1px solid ${P.green}44`,color:P.green,
                borderRadius:"12px",padding:"8px 14px",fontSize:"12px",
                fontWeight:"700",cursor:"pointer",...sans,
                boxShadow:`${liftSm},${glow(P.green,0.15)}`,
              }}>+ Slider</button>
            </div>

            {normalized.map((sl,idx)=>(
              <div key={sl.id} style={{marginBottom:"20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"10px",height:"10px",borderRadius:"3px",background:sl.color,boxShadow:`0 0 8px ${sl.color}88`}} />
                    <span style={{fontSize:"13px",color:P.text,fontWeight:"500"}}>{sl.label}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{fontSize:"15px",fontWeight:"700",color:sl.color}}>{$fmt(sl.amt)}</span>
                    <span style={{fontSize:"11px",color:P.muted,background:"rgba(255,255,255,0.05)",borderRadius:"6px",padding:"2px 7px"}}>{Math.round(sl.pct*100/sliderSum)}%</span>
                    {sliders.length>1&&<button onClick={()=>removeSlider(sl.id)} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:"18px",lineHeight:1,padding:"0",opacity:0.6}}>×</button>}
                  </div>
                </div>
                <GlowSlider value={sl.pct} onChange={v=>moveSlider(sl.id,v)} color={sl.color} />
              </div>
            ))}

            {/* Bar */}
            <div style={{marginTop:"8px"}}>
              <div style={{display:"flex",height:"6px",borderRadius:"999px",overflow:"hidden",gap:"3px"}}>
                {normalized.filter(s=>s.amt>0).map((s,i)=>(
                  <div key={i} style={{flex:s.amt,background:s.color,transition:"flex 0.3s",borderRadius:"999px",boxShadow:`0 0 6px ${s.color}66`}} />
                ))}
              </div>
            </div>
          </RaisedCard>

          {/* Add slider form */}
          <RaisedCard>
            <div style={{fontSize:"12px",color:P.muted,fontWeight:"600",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"12px"}}>New Slider</div>
            <FInput value={ns.label} onChange={v=>setNs({label:v})} placeholder="e.g: Savings · Westpac" onEnter={addSlider} style={{marginBottom:"12px"}} />
            <ActionBtn onClick={addSlider} color={SLIDER_COLORS[sliders.length%SLIDER_COLORS.length]} disabled={!ns.label}>+ Ajouter</ActionBtn>
          </RaisedCard>

          {/* Virements */}
          <div style={{marginTop:"8px"}}>
            <div style={{fontSize:"11px",fontWeight:"600",color:P.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"10px"}}>Monthly Transfers</div>
            <div style={{background:`linear-gradient(145deg,#1a1f28,#141820)`,border:`1px solid ${P.rim}`,borderRadius:"22px",padding:"8px",boxShadow:lift}}>
              {[{label:"Westpac",sub:"Fixed Charges · always the same",color:P.blue,amt:fixedTotal},...normalized].map((a,i)=>(
                <div key={a.label+i} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"14px 16px",borderRadius:"16px",marginBottom: i<normalized.length?"4px":"0",
                  background: i%2===0?`linear-gradient(135deg,rgba(255,255,255,0.03),transparent)`:"transparent",
                }}>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:"600",color:P.text}}>{a.label}</div>
                    <div style={{fontSize:"11px",color:P.muted,marginTop:"2px"}}>{a.sub || `${Math.round(a.pct*100/sliderSum)}% of flexible`}</div>
                  </div>
                  <div style={{fontSize:"22px",fontWeight:"700",color:a.color,textShadow:`0 0 12px ${a.color}66`}}>{$fmt(a.amt)}</div>
                </div>
              ))}
            </div>
          </div>
        </> : (
          <div style={{textAlign:"center",padding:"50px 20px",color:P.muted}}>
            <div style={{fontSize:"36px",marginBottom:"12px"}}>📊</div>
            <div style={{fontSize:"14px",fontWeight:"500",color:P.sub}}>
              {totalIncome===0?"Add a pay first":"Charges not covered yet"}
            </div>
            {totalIncome>0&&<div style={{fontSize:"12px",marginTop:"6px"}}>Still receiving</div>}
          </div>
        )}
      </>}
    </div>
  );
}
