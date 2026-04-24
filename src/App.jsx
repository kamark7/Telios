import { useState, useEffect } from "react";

var F = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";
var fmt = function(n){ return "$" + Math.round(Math.abs(n)).toLocaleString(); };
var glow = function(hex, alpha){ var a = alpha||0.25; return "0 0 24px " + hex + Math.round(a*255).toString(16).padStart(2,"0"); };
var lift   = "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)";
var liftSm = "0 4px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)";

var P = {
  bg:"#13161c", card:"#1c2028", rim:"rgba(255,255,255,0.07)", rimHi:"rgba(255,255,255,0.12)",
  muted:"#48546a", label:"#7a8fa8", text:"#e2e8f4", sub:"#9aa8bc",
  green:"#34d399", red:"#f87171", orange:"#fb923c", indigo:"#818cf8", blue:"#38bdf8", white:"#f0f4ff",
};

var DEFAULT_CHARGES = [];

var SLIDER_COLORS = ["#818cf8","#34d399","#fb923c","#f472b6","#38bdf8","#a3e635","#fbbf24"];

var DEFAULT_SLIDERS = [
  { id:1, label:"Up Bank - Daily Life", pct:30, color:"#818cf8" },
  { id:2, label:"BRK - Investment",     pct:70, color:"#34d399" },
];

var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var YEARS  = [2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036];

var TeliosLogo = function(props) {
  var s = props.size || 80;
  return (
    <svg viewBox="0 0 200 220" width={s} height={s * 1.1} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tlg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9D82FF"/>
          <stop offset="100%" stopColor="#7B5CFF"/>
        </linearGradient>
        <linearGradient id="tlg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd"/>
          <stop offset="100%" stopColor="#7B5CFF"/>
        </linearGradient>
      </defs>
      <path d="M18 42 L182 42 L182 78 L116 78 L100 94 L84 78 L18 78 Z" fill="url(#tlg1)"/>
      <path d="M182 42 L190 50 L190 86 L116 86 L100 102 L116 94 L182 78 Z" fill="#9D82FF" opacity="0.5"/>
      <path d="M84 94 L116 94 L116 190 L84 190 Z" fill="url(#tlg2)"/>
      <path d="M116 94 L124 102 L124 198 L116 190 Z" fill="#9D82FF" opacity="0.45"/>
      <line x1="100" y1="94" x2="100" y2="192" stroke="#0a0812" strokeWidth="2" opacity="0.5"/>
      <rect x="66" y="190" width="36" height="16" rx="4" fill="#7B5CFF"/>
      <rect x="98" y="190" width="36" height="16" rx="4" fill="#7B5CFF"/>
    </svg>
  );
};

function RaisedCard(props) {
  return (
    <div style={{
      background:"linear-gradient(145deg,#1e2530 0%,#181d26 100%)",
      borderRadius:"22px", padding:"20px", marginBottom:"12px",
      boxShadow: lift + (props.accent ? ", " + glow(props.accent, 0.12) : ""),
      border:"1px solid " + P.rim,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:"1px",background:"rgba(255,255,255,0.10)",borderRadius:"999px"}} />
      {props.children}
    </div>
  );
}

function StatPill(props) {
  return (
    <div style={{
      background:"linear-gradient(145deg,#1e2530,#181d26)",
      borderRadius:"16px", padding:"14px 10px", textAlign:"center",
      boxShadow: liftSm + ", " + glow(props.color, 0.10),
      border:"1px solid " + P.rim, position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:"1px",background:"rgba(255,255,255,0.09)"}} />
      <div style={{fontSize:"16px",fontWeight:"700",color:props.color,letterSpacing:"-0.3px"}}>{props.value}</div>
      <div style={{fontSize:"10px",color:P.muted,marginTop:"3px",fontWeight:"600",letterSpacing:"0.07em",textTransform:"uppercase"}}>{props.label}</div>
    </div>
  );
}

function TabBar(props) {
  var tabs = [
    {id:"income",  label:"Pays",     icon:"💰"},
    {id:"expense", label:"Expenses", icon:"🛒"},
    {id:"charges", label:"Charges",  icon:"🏦"},
    {id:"sliders", label:"Split",    icon:"📊"},
  ];
  return (
    <div style={{
      display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr",
      gap:"5px", marginBottom:"20px",
      background:"linear-gradient(145deg,#1a1f28,#141820)",
      borderRadius:"20px", padding:"6px",
      boxShadow:lift, border:"1px solid " + P.rim,
    }}>
      {tabs.map(function(t) {
        var active = props.tab === t.id;
        return (
          <button key={t.id} onClick={function(){ props.setTab(t.id); }} style={{
            background: active ? "linear-gradient(145deg,#252d3a,#1d2430)" : "transparent",
            border: active ? "1px solid " + P.rimHi : "1px solid transparent",
            borderRadius:"14px", padding:"9px 4px", cursor:"pointer", transition:"all 0.2s",
            boxShadow: active ? liftSm + ", inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
          }}>
            <div style={{fontSize:"17px"}}>{t.icon}</div>
            <div style={{fontSize:"10px",color:active?P.text:P.muted,fontWeight:active?"600":"400",marginTop:"3px",fontFamily:F}}>{t.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function FInput(props) {
  return (
    <input type="text" value={props.value}
      onChange={function(e){ props.onChange(e.target.value); }}
      onKeyDown={function(e){ if(e.key==="Enter" && props.onEnter) props.onEnter(); }}
      placeholder={props.placeholder}
      style={Object.assign({
        background:"linear-gradient(145deg,#161b23,#121620)",
        border:"1px solid " + P.rim, borderRadius:"13px",
        padding:"12px 16px", color:P.text, fontSize:"14px", width:"100%",
        fontFamily:F, outline:"none", boxSizing:"border-box",
        boxShadow:"inset 0 2px 6px rgba(0,0,0,0.35)",
      }, props.style || {})}
    />
  );
}

function BigAmt(props) {
  return (
    <div style={{
      background:"linear-gradient(145deg,#161b23,#111520)",
      border:"1px solid " + P.rim, borderRadius:"16px", padding:"16px 18px",
      boxShadow:"inset 0 3px 10px rgba(0,0,0,0.4)", marginBottom:"10px",
    }}>
      <div style={{fontSize:"11px",color:P.muted,fontWeight:"600",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"8px"}}>Net Amount</div>
      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
        <span style={{color:props.color,fontSize:"26px",fontWeight:"300"}}>$</span>
        <input type="number" value={props.value}
          onChange={function(e){ props.onChange(e.target.value); }}
          placeholder={props.placeholder || "0"}
          style={{background:"transparent",border:"none",outline:"none",color:props.color,fontSize:"34px",fontWeight:"600",width:"100%",fontFamily:F,letterSpacing:"-1px"}}
        />
      </div>
    </div>
  );
}

function ActionBtn(props) {
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{
      width:"100%", borderRadius:"14px", padding:"14px",
      border: props.disabled ? "1px solid rgba(255,255,255,0.05)" : "none",
      background: props.disabled
        ? "linear-gradient(145deg,#1a1f28,#141820)"
        : "linear-gradient(145deg," + props.color + "ee," + props.color + "bb)",
      color: props.disabled ? P.muted : "#0d1117",
      fontSize:"14px", fontWeight:"700",
      cursor: props.disabled ? "default" : "pointer",
      fontFamily:F, transition:"all 0.2s",
      boxShadow: props.disabled ? "none" : liftSm + ", " + glow(props.color, 0.35),
    }}>{props.children}</button>
  );
}

function RowItem(props) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        {props.icon && <span style={{fontSize:"16px"}}>{props.icon}</span>}
        <div>
          <div style={{fontSize:"13px",color:P.text,fontWeight:"500"}}>{props.label}</div>
          {props.sub && <div style={{fontSize:"11px",color:P.muted,marginTop:"1px"}}>{props.sub}</div>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <span style={{fontSize:"14px",fontWeight:"700",color:props.color}}>{props.value}</span>
        {props.onRemove && <button onClick={props.onRemove} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:"18px",lineHeight:1,padding:"0",opacity:0.6}}>x</button>}
      </div>
    </div>
  );
}

function GlowSlider(props) {
  return (
    <input type="range" min={0} max={100} value={props.value}
      onChange={function(e){ props.onChange(Number(e.target.value)); }}
      style={{width:"100%",accentColor:props.color,cursor:"pointer",height:"4px"}}
    />
  );
}

export default function App() {
  var now = new Date();
  var [year,       setYear]       = useState(now.getFullYear());
  var [month,      setMonth]      = useState(now.getMonth());
  var [data,       setData]       = useState({});
  var [charges,    setCharges]    = useState(DEFAULT_CHARGES);
  var [sliders,    setSliders]    = useState(DEFAULT_SLIDERS);
  var [loading,    setLoading]    = useState(true);
  var [tab,        setTab]        = useState("income");
  var [ni,         setNi]         = useState({amt:"", label:""});
  var [ne,         setNe]         = useState({amt:"", label:""});
  var [nc,         setNc]         = useState({amt:"", label:"", icon:"💳"});
  var [ns,         setNs]         = useState({label:""});
  var [showPicker, setShowPicker] = useState(false);
  var [showSplash, setShowSplash] = useState(true);

  var key = year + "-" + month;

  useEffect(function() {
    try {
      var res = localStorage.getItem("telios-v1");
      if (res) {
        var s = JSON.parse(res);
        if (s.data)    setData(s.data);
        if (s.charges) setCharges(s.charges);
        if (s.sliders) setSliders(s.sliders);
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  useEffect(function() {
    var t = setTimeout(function(){ setShowSplash(false); }, 2200);
    return function(){ clearTimeout(t); };
  }, []);

  function persist(d, ch, sl) {
    setData(d); setCharges(ch); setSliders(sl);
    try { localStorage.setItem("telios-v1", JSON.stringify({data:d, charges:ch, sliders:sl})); } catch(e) {}
  }

  var mData    = data[key] || {incomes:[], expenses:[]};
  var incomes  = mData.incomes  || [];
  var expenses = mData.expenses || [];

  function updateM(patch) {
    var newKey  = Object.assign({}, mData, patch);
    var newData = Object.assign({}, data);
    newData[key] = newKey;
    persist(newData, charges, sliders);
  }

  var fixedTotal   = charges.reduce(function(s,c){ return s+c.amount; }, 0);
  var totalIncome  = incomes.reduce(function(s,e){ return s+e.amount; }, 0);
  var totalExpense = expenses.reduce(function(s,e){ return s+e.amount; }, 0);
  var flexible     = Math.max(0, totalIncome - fixedTotal);
  var deficit      = totalIncome > 0 && totalIncome < fixedTotal;
  var sliderSum    = sliders.reduce(function(s,sl){ return s+sl.pct; }, 0);
  var normalized   = sliders.map(function(sl){
    return Object.assign({}, sl, {amt: sliderSum > 0 ? Math.round(flexible * sl.pct / sliderSum) : 0});
  });

  function addIncome() {
    var amt = parseFloat(ni.amt); if (!amt) return;
    updateM({incomes: incomes.concat([{id:Date.now(), amount:amt, label:ni.label||"Income", date:new Date().toLocaleDateString("en-AU")}])});
    setNi({amt:"", label:""});
  }
  function addExpense() {
    var amt = parseFloat(ne.amt); if (!amt) return;
    updateM({expenses: expenses.concat([{id:Date.now(), amount:amt, label:ne.label||"Expense", date:new Date().toLocaleDateString("en-AU")}])});
    setNe({amt:"", label:""});
  }
  function addCharge() {
    var amt = parseFloat(nc.amt); if (!amt || !nc.label) return;
    persist(data, charges.concat([{id:Date.now(), label:nc.label, amount:amt, icon:nc.icon||"💳"}]), sliders);
    setNc({amt:"", label:"", icon:"💳"});
  }
  function addSlider() {
    if (!ns.label) return;
    var color   = SLIDER_COLORS[sliders.length % SLIDER_COLORS.length];
    var pct     = Math.round(100 / (sliders.length + 1));
    var newList = sliders.map(function(s){
      return Object.assign({}, s, {pct: Math.round(s.pct * sliders.length / (sliders.length + 1))});
    });
    newList.push({id:Date.now(), label:ns.label, pct:pct, color:color});
    persist(data, charges, newList);
    setNs({label:""});
  }
  function moveSlider(id, val) {
    var sidx = sliders.findIndex(function(s){ return s.id === id; });
    var nsl  = sliders.map(function(x){ return Object.assign({}, x); });
    var diff = val - nsl[sidx].pct;
    nsl[sidx] = Object.assign({}, nsl[sidx], {pct: val});
    var o = nsl.length - 1 === sidx ? nsl.length - 2 : nsl.length - 1;
    nsl[o] = Object.assign({}, nsl[o], {pct: Math.max(0, nsl[o].pct - diff)});
    persist(data, charges, nsl);
  }
  function removeSlider(id) {
    if (sliders.length <= 1) return;
    var removed = sliders.find(function(s){ return s.id === id; });
    var rest    = sliders.filter(function(s){ return s.id !== id; });
    rest[rest.length - 1] = Object.assign({}, rest[rest.length - 1], {pct: rest[rest.length - 1].pct + removed.pct});
    persist(data, charges, rest);
  }
  function navMonth(dir) {
    var d = new Date(year, month + dir);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  if (loading || showSplash) {
    return (
      <div style={{fontFamily:F, background:"linear-gradient(160deg,#0d0f1a 0%,#1a1040 50%,#0d0f1a 100%)", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"28px"}}>
        <div style={{width:"110px", height:"110px", borderRadius:"28px", background:"linear-gradient(145deg,#1e1b4b,#0d0f1a)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 60px rgba(139,92,246,0.35), 0 8px 32px rgba(0,0,0,0.6)", border:"1px solid rgba(167,139,250,0.2)", position:"relative", overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:"1px",background:"rgba(167,139,250,0.3)",borderRadius:"999px"}} />
          <TeliosLogo size={80} />
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"38px", fontWeight:"800", letterSpacing:"0.12em", textTransform:"uppercase", background:"linear-gradient(135deg,#c4b5fd,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"8px"}}>TELIOS</div>
          <div style={{fontSize:"13px", color:"rgba(167,139,250,0.5)", letterSpacing:"0.06em"}}>Your financial purpose</div>
        </div>
        <div style={{display:"flex", gap:"6px", marginTop:"12px"}}>
          {[0,1,2].map(function(i){
            return <div key={i} style={{width:"6px", height:"6px", borderRadius:"50%", background:"rgba(139,92,246,0.5)", animation:"pulse 1.2s ease-in-out " + (i*0.2) + "s infinite"}} />;
          })}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
      </div>
    );
  }

  return (
    <div style={{fontFamily:F, background:P.bg, minHeight:"100vh", color:P.text, padding:"54px 16px 48px", maxWidth:"440px", margin:"0 auto"}}>

      <div style={{marginBottom:"24px", display:"flex", alignItems:"center", gap:"14px"}}>
        <div style={{width:"46px", height:"46px", borderRadius:"13px", flexShrink:0, background:"#0B0B1A", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(123,92,255,0.25), " + liftSm, border:"1px solid rgba(167,139,250,0.2)"}}>
          <TeliosLogo size={32} />
        </div>
        <div>
          <div style={{fontSize:"11px", fontWeight:"600", color:P.muted, letterSpacing:"0.14em", textTransform:"uppercase"}}>TELIOS</div>
          <div style={{fontSize:"24px", fontWeight:"800", color:P.white, letterSpacing:"-0.5px", lineHeight:1.1}}>Monthly Tracker</div>
        </div>
      </div>

      <RaisedCard>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <button onClick={function(){ navMonth(-1); }} style={{background:"linear-gradient(145deg,#252d3a,#1a2030)", border:"1px solid " + P.rim, color:P.label, borderRadius:"12px", width:"38px", height:"38px", cursor:"pointer", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:liftSm}}>&#8249;</button>
          <div style={{textAlign:"center", cursor:"pointer"}} onClick={function(){ setShowPicker(function(v){ return !v; }); }}>
            <div style={{fontSize:"19px", fontWeight:"700", color:P.white, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px"}}>
              {MONTHS[month]} {year}
              <span style={{fontSize:"11px", color:P.muted}}>{showPicker ? "▲" : "▼"}</span>
            </div>
            <div style={{fontSize:"12px", color:P.muted, marginTop:"2px"}}>
              {incomes.length} pay{incomes.length !== 1 ? "s" : ""} &middot; <span style={{color:P.green, fontWeight:"600"}}>{fmt(totalIncome)}</span>
            </div>
          </div>
          <button onClick={function(){ navMonth(1); }} style={{background:"linear-gradient(145deg,#252d3a,#1a2030)", border:"1px solid " + P.rim, color:P.label, borderRadius:"12px", width:"38px", height:"38px", cursor:"pointer", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:liftSm}}>&#8250;</button>
        </div>
        {showPicker && (
          <div style={{marginTop:"16px", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"16px"}}>
            <div style={{display:"flex", gap:"6px", flexWrap:"wrap", justifyContent:"center", marginBottom:"14px"}}>
              {YEARS.map(function(y){
                var active = y === year;
                return (
                  <button key={y} onClick={function(){ setYear(y); }} style={{
                    background: active ? "linear-gradient(145deg," + P.indigo + "cc," + P.indigo + "88)" : "linear-gradient(145deg,#252d3a,#1a2030)",
                    border: "1px solid " + (active ? P.indigo + "66" : P.rim),
                    borderRadius:"10px", padding:"6px 10px", color: active ? P.white : P.muted,
                    fontSize:"12px", fontWeight: active ? "700" : "500", cursor:"pointer", fontFamily:F,
                    boxShadow: active ? liftSm + "," + glow(P.indigo, 0.25) : liftSm,
                  }}>{y}</button>
                );
              })}
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px"}}>
              {MONTHS.map(function(m, i){
                var active = i === month;
                return (
                  <button key={m} onClick={function(){ setMonth(i); setShowPicker(false); }} style={{
                    background: active ? "linear-gradient(145deg," + P.indigo + "cc," + P.indigo + "88)" : "linear-gradient(145deg,#252d3a,#1a2030)",
                    border: "1px solid " + (active ? P.indigo + "66" : P.rim),
                    borderRadius:"10px", padding:"8px 4px", color: active ? P.white : P.label,
                    fontSize:"11px", fontWeight: active ? "700" : "400", cursor:"pointer", fontFamily:F,
                    boxShadow: active ? liftSm + "," + glow(P.indigo, 0.2) : liftSm,
                  }}>{m.slice(0,3)}</button>
                );
              })}
            </div>
          </div>
        )}
      </RaisedCard>

      {totalIncome > 0 && (
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"18px"}}>
          <StatPill label="Received" value={fmt(totalIncome)} color={P.green} />
          <StatPill label="Charges"  value={fmt(fixedTotal)}  color={P.orange} />
          <StatPill label="Flexible" value={fmt(flexible)}    color={P.indigo} />
        </div>
      )}

      <TabBar tab={tab} setTab={setTab} />

      {tab === "income" && (
        <div>
          <RaisedCard accent={P.green}>
            <div style={{fontSize:"12px", color:P.muted, fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"14px"}}>New Pay</div>
            <BigAmt value={ni.amt} onChange={function(v){ setNi({amt:v, label:ni.label}); }} color={P.green} />
            <FInput value={ni.label} onChange={function(v){ setNi({amt:ni.amt, label:v}); }} placeholder="Description - e.g: Shutdown FMG" onEnter={addIncome} style={{marginBottom:"12px"}} />
            <ActionBtn onClick={addIncome} color={P.green} disabled={!ni.amt}>+ Add Pay</ActionBtn>
          </RaisedCard>
          {incomes.length > 0 && (
            <RaisedCard>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px"}}>
                <span style={{fontSize:"12px", fontWeight:"600", color:P.muted, letterSpacing:"0.06em", textTransform:"uppercase"}}>This Month's Pays</span>
                <span style={{background:P.green + "22", color:P.green, borderRadius:"8px", padding:"3px 9px", fontSize:"11px", fontWeight:"700"}}>{incomes.length}</span>
              </div>
              {incomes.map(function(e){
                return <RowItem key={e.id} label={e.label} sub={e.date} value={fmt(e.amount)} color={P.green} onRemove={function(){ updateM({incomes:incomes.filter(function(x){ return x.id!==e.id; })}); }} />;
              })}
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"12px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:"4px"}}>
                <span style={{fontSize:"12px", color:P.muted}}>Total Received</span>
                <span style={{fontSize:"20px", fontWeight:"700", color:P.green}}>{fmt(totalIncome)}</span>
              </div>
            </RaisedCard>
          )}
          {incomes.length === 0 && (
            <div style={{textAlign:"center", padding:"40px 0", color:P.muted}}>
              <div style={{fontSize:"32px", marginBottom:"10px"}}>💰</div>
              <div style={{fontSize:"13px"}}>No pay this month</div>
            </div>
          )}
        </div>
      )}

      {tab === "expense" && (
        <div>
          <RaisedCard accent={P.red}>
            <div style={{fontSize:"12px", color:P.muted, fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"14px"}}>New Expense</div>
            <BigAmt value={ne.amt} onChange={function(v){ setNe({amt:v, label:ne.label}); }} color={P.red} />
            <FInput value={ne.label} onChange={function(v){ setNe({amt:ne.amt, label:v}); }} placeholder="Description - e.g: Groceries Coles" onEnter={addExpense} style={{marginBottom:"12px"}} />
            <ActionBtn onClick={addExpense} color={P.red} disabled={!ne.amt}>+ Add Expense</ActionBtn>
          </RaisedCard>
          {expenses.length > 0 && (
            <RaisedCard>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px"}}>
                <span style={{fontSize:"12px", fontWeight:"600", color:P.muted, letterSpacing:"0.06em", textTransform:"uppercase"}}>This Month's Expenses</span>
                <span style={{background:P.red + "22", color:P.red, borderRadius:"8px", padding:"3px 9px", fontSize:"11px", fontWeight:"700"}}>{expenses.length}</span>
              </div>
              {expenses.map(function(e){
                return <RowItem key={e.id} label={e.label} sub={e.date} value={"- " + fmt(e.amount)} color={P.red} onRemove={function(){ updateM({expenses:expenses.filter(function(x){ return x.id!==e.id; })}); }} />;
              })}
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"12px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:"4px"}}>
                <span style={{fontSize:"12px", color:P.muted}}>Total Spent</span>
                <span style={{fontSize:"20px", fontWeight:"700", color:P.red}}>- {fmt(totalExpense)}</span>
              </div>
            </RaisedCard>
          )}
          {expenses.length === 0 && (
            <div style={{textAlign:"center", padding:"40px 0", color:P.muted}}>
              <div style={{fontSize:"32px", marginBottom:"10px"}}>🛒</div>
              <div style={{fontSize:"13px"}}>No expenses this month</div>
            </div>
          )}
        </div>
      )}

      {tab === "charges" && (
        <div>
          <RaisedCard accent={P.orange}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px"}}>
              <span style={{fontSize:"12px", fontWeight:"600", color:P.muted, letterSpacing:"0.06em", textTransform:"uppercase"}}>Fixed Charges / month</span>
              <span style={{fontSize:"20px", fontWeight:"700", color:P.orange}}>{fmt(fixedTotal)}</span>
            </div>
            {charges.map(function(c){
              return <RowItem key={c.id} icon={c.icon} label={c.label} value={"$" + c.amount} color={P.orange} onRemove={function(){ persist(data, charges.filter(function(x){ return x.id!==c.id; }), sliders); }} />;
            })}
          </RaisedCard>
          <RaisedCard>
            <div style={{fontSize:"12px", color:P.muted, fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"14px"}}>Add a Charge</div>
            <div style={{display:"flex", gap:"8px", marginBottom:"10px"}}>
              <input value={nc.icon} onChange={function(e){ setNc({amt:nc.amt, label:nc.label, icon:e.target.value}); }}
                style={{background:"linear-gradient(145deg,#161b23,#111520)", border:"1px solid " + P.rim, borderRadius:"13px", padding:"12px", width:"52px", textAlign:"center", fontSize:"18px", outline:"none", boxSizing:"border-box"}} />
              <input value={nc.label} onChange={function(e){ setNc({amt:nc.amt, label:e.target.value, icon:nc.icon}); }}
                placeholder="Charge Name"
                style={{background:"linear-gradient(145deg,#161b23,#111520)", border:"1px solid " + P.rim, borderRadius:"13px", padding:"12px 16px", color:P.text, fontSize:"14px", flex:1, fontFamily:F, outline:"none"}} />
            </div>
            <div style={{background:"linear-gradient(145deg,#161b23,#111520)", border:"1px solid " + P.rim, borderRadius:"16px", padding:"14px 18px", marginBottom:"12px"}}>
              <div style={{fontSize:"11px", color:P.muted, fontWeight:"500", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.07em"}}>Monthly Amount</div>
              <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
                <span style={{color:P.orange, fontSize:"22px", fontWeight:"300"}}>$</span>
                <input type="number" value={nc.amt} onChange={function(e){ setNc({amt:e.target.value, label:nc.label, icon:nc.icon}); }} placeholder="0"
                  style={{background:"transparent", border:"none", outline:"none", color:P.orange, fontSize:"28px", fontWeight:"600", width:"100%", fontFamily:F}} />
              </div>
            </div>
            <ActionBtn onClick={addCharge} color={P.orange} disabled={!nc.amt || !nc.label}>+ Add Charge</ActionBtn>
          </RaisedCard>
        </div>
      )}

      {tab === "sliders" && (
        <div>
          {(!deficit && flexible > 0) ? (
            <div>
              <RaisedCard accent={P.indigo}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
                  <div>
                    <div style={{fontSize:"11px", color:P.muted, fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:"4px"}}>This Month's Flexible</div>
                    <div style={{fontSize:"28px", fontWeight:"800", color:P.indigo, letterSpacing:"-0.5px"}}>{fmt(flexible)}</div>
                  </div>
                  <button onClick={addSlider} style={{background:"linear-gradient(145deg,#252d3a,#1a2030)", border:"1px solid " + P.green + "44", color:P.green, borderRadius:"12px", padding:"8px 14px", fontSize:"12px", fontWeight:"700", cursor:"pointer", fontFamily:F, boxShadow:liftSm + "," + glow(P.green, 0.15)}}>+ Slider</button>
                </div>
                {normalized.map(function(sl){
                  return (
                    <div key={sl.id} style={{marginBottom:"20px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px"}}>
                        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                          <div style={{width:"10px", height:"10px", borderRadius:"3px", background:sl.color, boxShadow:"0 0 8px " + sl.color + "88"}} />
                          <span style={{fontSize:"13px", color:P.text, fontWeight:"500"}}>{sl.label}</span>
                        </div>
                        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
                          <span style={{fontSize:"15px", fontWeight:"700", color:sl.color}}>{fmt(sl.amt)}</span>
                          <span style={{fontSize:"11px", color:P.muted, background:"rgba(255,255,255,0.05)", borderRadius:"6px", padding:"2px 7px"}}>{Math.round(sl.pct * 100 / sliderSum)}%</span>
                          {sliders.length > 1 && <button onClick={function(){ removeSlider(sl.id); }} style={{background:"none", border:"none", color:P.muted, cursor:"pointer", fontSize:"18px", lineHeight:1, padding:"0", opacity:0.6}}>x</button>}
                        </div>
                      </div>
                      <GlowSlider value={sl.pct} onChange={function(v){ moveSlider(sl.id, v); }} color={sl.color} />
                    </div>
                  );
                })}
                <div style={{marginTop:"8px"}}>
                  <div style={{display:"flex", height:"6px", borderRadius:"999px", overflow:"hidden", gap:"3px"}}>
                    {normalized.filter(function(s){ return s.amt > 0; }).map(function(s, i){
                      return <div key={i} style={{flex:s.amt, background:s.color, transition:"flex 0.3s", borderRadius:"999px", boxShadow:"0 0 6px " + s.color + "66"}} />;
                    })}
                  </div>
                </div>
              </RaisedCard>
              <RaisedCard>
                <div style={{fontSize:"12px", color:P.muted, fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"12px"}}>New Slider</div>
                <FInput value={ns.label} onChange={function(v){ setNs({label:v}); }} placeholder="e.g: Savings - Westpac" onEnter={addSlider} style={{marginBottom:"12px"}} />
                <ActionBtn onClick={addSlider} color={SLIDER_COLORS[sliders.length % SLIDER_COLORS.length]} disabled={!ns.label}>+ Add Slider</ActionBtn>
              </RaisedCard>
              <div style={{marginTop:"8px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:P.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px"}}>Monthly Transfers</div>
                <div style={{background:"linear-gradient(145deg,#1a1f28,#141820)", border:"1px solid " + P.rim, borderRadius:"22px", padding:"8px", boxShadow:lift}}>
                  {[{label:"Westpac", sub:"Fixed Charges - always the same", color:P.blue, amt:fixedTotal}].concat(normalized).map(function(a, i){
                    return (
                      <div key={a.label + i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderRadius:"16px", marginBottom: i < normalized.length ? "4px" : "0", background: i % 2 === 0 ? "linear-gradient(135deg,rgba(255,255,255,0.03),transparent)" : "transparent"}}>
                        <div>
                          <div style={{fontSize:"13px", fontWeight:"600", color:P.text}}>{a.label}</div>
                          <div style={{fontSize:"11px", color:P.muted, marginTop:"2px"}}>{a.sub || (Math.round(a.pct * 100 / sliderSum) + "% of flexible")}</div>
                        </div>
                        <div style={{fontSize:"22px", fontWeight:"700", color:a.color, textShadow:"0 0 12px " + a.color + "66"}}>{fmt(a.amt)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{textAlign:"center", padding:"50px 20px", color:P.muted}}>
              <div style={{fontSize:"36px", marginBottom:"12px"}}>📊</div>
              <div style={{fontSize:"14px", fontWeight:"500", color:P.sub}}>{totalIncome === 0 ? "Add a pay first" : "Charges not covered yet"}</div>
              {totalIncome > 0 && <div style={{fontSize:"12px", marginTop:"6px"}}>Still {fmt(fixedTotal - totalIncome)} to cover</div>}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
