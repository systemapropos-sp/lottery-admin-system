import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronDown, Search, X } from "lucide-react";

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const BANCAS = [
  { id:"b1",  ref:"MATADOR-SPORT", codigo:"MWR-0001" },
  { id:"b2",  ref:"MMW RD 02",     codigo:"MWR-0002" },
  { id:"b3",  ref:"MMW RD 03",     codigo:"MWR-0003" },
  { id:"b4",  ref:"MMW RD 04",     codigo:"MWR-0004" },
  { id:"b5",  ref:"MMW RD 05",     codigo:"MWR-0005" },
  { id:"b6",  ref:"MMW RD 06",     codigo:"MWR-0006" },
  { id:"b7",  ref:"MMW RD 07",     codigo:"MWR-0007" },
  { id:"b8",  ref:"MMW RD 08",     codigo:"MWR-0008" },
  { id:"b9",  ref:"MMW RD 09",     codigo:"MWR-0009" },
  { id:"b10", ref:"MMW RD 10",     codigo:"MWR-0010" },
  { id:"b11", ref:"MMW RD 11",     codigo:"MWR-0011" },
  { id:"b12", ref:"MMW RD 12",     codigo:"MWR-0012" },
  { id:"b13", ref:"MMW RD 13",     codigo:"MWR-0013" },
];
const ZONAS  = [{ id:"z1", nombre:"Default" }, { id:"z2", nombre:"SFM" }];
const SORTEOS = ["LA PRIMERA 7PM","FLORIDA PM","LOTEKA","LA SUERTE","LA PRIMERA","GANA MAS","QUINIELA REAL","SUPER PALE REAL-GANA MAS","Anguila 10AM","NEW YORK AM","Anguila 6PM","SUPER PALE NACIONAL-QP","NACIONAL","NEW YORK PM","Anguila 9PM","Anguila 1PM","LA SUERTE 6:00pm","QUINIELA PALE","FLORIDA AM","LOTEDOM","REAL","LOTO POOL","MEGA CHANCES","SUPER PALE PALE"];

type Pill = "TODOS"|"CON VENTAS"|"CON PREMIOS"|"CON TICKETS PENDIENTES"|"CON VENTAS NETAS NEGATIVAS"|"CON VENTAS NETAS POSITIVAS";
const PILLS: Pill[] = ["TODOS","CON VENTAS","CON PREMIOS","CON TICKETS PENDIENTES","CON VENTAS NETAS NEGATIVAS","CON VENTAS NETAS POSITIVAS"];

interface Row { id:string; ref:string; codigo:string; venta:number; comisiones:number; premios:number; neto:number; balance:number; ticketsPend:number; }
const baseRows: Row[] = BANCAS.map((b) => ({ id:b.id, ref:b.ref, codigo:b.codigo, venta:0, comisiones:0, premios:0, neto:0, balance:0, ticketsPend:0 }));

function applyPill(rows: Row[], pill: Pill): Row[] {
  switch(pill){
    case "CON VENTAS": return rows.filter((r)=>r.venta>0);
    case "CON PREMIOS": return rows.filter((r)=>r.premios>0);
    case "CON TICKETS PENDIENTES": return rows.filter((r)=>r.ticketsPend>0);
    case "CON VENTAS NETAS NEGATIVAS": return rows.filter((r)=>r.neto<0);
    case "CON VENTAS NETAS POSITIVAS": return rows.filter((r)=>r.neto>0);
    default: return rows;
  }
}
const netoCell = (n:number) => <span className={`font-semibold ${n<0?"text-[#EF4444]":n>0?"text-[#22C55E]":"text-[#999]"}`}>{fmt(n)}</span>;

function DateInput({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return <div className="flex flex-col gap-1"><label className="text-xs text-[#999]">{label}</label><input type="date" value={value} onChange={(e)=>onChange(e.target.value)} className="px-3 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#14B8A6] transition-colors"/></div>;
}
function Btn({label,variant="primary",onClick}:{label:string;variant?:"primary"|"secondary";onClick?:()=>void}) {
  return <button onClick={onClick} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all active:scale-[0.97] ${variant==="primary"?"bg-[#14B8A6] text-white hover:bg-[#0F766E]":"bg-white text-[#333] border border-[#E5E5E0] hover:border-[#14B8A6]"}`}>{label}</button>;
}
function MultiSelect({label,options,selected,onChange}:{label:string;options:string[];selected:string[];onChange:(s:string[])=>void}) {
  const [open,setOpen]=useState(false);
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs text-[#999]">{label}</label>
      <div onClick={()=>setOpen(p=>!p)} className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E5E0] rounded-lg bg-white cursor-pointer hover:border-[#14B8A6] min-w-[140px]">
        <span className="text-sm text-[#333] flex-1">{selected.length===0?"Ninguna":selected.length===options.length?"Todas":`${selected.length} sel.`}</span>
        <ChevronDown size={14} className={`text-[#999] transition-transform ${open?"rotate-180":""}`}/>
      </div>
      {open&&<div className="absolute top-full left-0 z-50 mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-xl min-w-[170px] py-2 max-h-56 overflow-y-auto">
        <div className="px-3 py-1 border-b border-[#F0F0EB]"><button onClick={()=>onChange(selected.length===options.length?[]:[...options])} className="text-xs font-semibold text-[#14B8A6]">{selected.length===options.length?"Deselect todo":"Selec. todo"}</button></div>
        {options.map(o=><label key={o} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F5F5F0] cursor-pointer text-sm"><input type="checkbox" checked={selected.includes(o)} onChange={()=>onChange(selected.includes(o)?selected.filter(x=>x!==o):[...selected,o])} className="accent-[#14B8A6]"/>{o}</label>)}
      </div>}
    </div>
  );
}
function QuickFilter({value,onChange}:{value:string;onChange:(v:string)=>void}) {
  return <div className="flex items-center gap-2"><div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999]"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder="Filtro rápido" className="pl-7 pr-6 py-1.5 text-xs border border-[#E5E5E0] rounded-lg bg-[#FAFAFA] focus:outline-none focus:border-[#14B8A6] w-44"/>{value&&<button onClick={()=>onChange("")} className="absolute right-1.5 top-1/2 -translate-y-1/2"><X size={11} className="text-[#999]"/></button>}</div><button onClick={()=>onChange("")} className="p-1.5 border border-[#E5E5E0] rounded-lg bg-white hover:bg-[#F5F5F0]"><RefreshCw size={13} className="text-[#666]"/></button></div>;
}
function FilterPills({active,onChange}:{active:Pill;onChange:(p:Pill)=>void}) {
  return <div className="flex flex-wrap gap-1.5">{PILLS.map(p=><button key={p} onClick={()=>onChange(p)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${active===p?"bg-[#14B8A6] text-white border-[#14B8A6]":"bg-white text-[#666] border-[#E5E5E0] hover:border-[#14B8A6] hover:text-[#14B8A6]"}`}>{p}</button>)}</div>;
}
function TotalBadge({label,amount}:{label:string;amount:number}) {
  return <div className="flex items-center justify-center gap-2 py-2"><span className="text-base font-semibold text-[#333]">{label}:</span><span className={`text-base font-bold px-4 py-1 rounded-full border-2 ${amount<0?"text-[#EF4444] border-[#EF4444] bg-[#FEF2F2]":"text-[#22C55E] border-[#22C55E] bg-[#F0FDF4]"}`}>{fmt(amount)}</span></div>;
}

const HEADERS = ["Ref.","Código","Venta","Comisiones","Premios","Neto","Balance"];

export default function VentasHistorico() {
  const [fi,setFi] = useState(()=>{ const d=new Date(); d.setDate(d.getDate()-30); return d.toISOString().slice(0,10); });
  const [ff,setFf] = useState(new Date().toISOString().slice(0,10));
  const [pill,setPill] = useState<Pill>("TODOS");
  const [quick,setQuick] = useState("");
  const [selZonas,setSelZonas] = useState<string[]>(ZONAS.map(z=>z.nombre));
  const [selBancas,setSelBancas] = useState<string[]>(BANCAS.map(b=>b.ref));
  const [selSorteos,setSelSorteos] = useState<string[]>(SORTEOS);
  const [activeTab,setActiveTab] = useState<"general"|"sorteo">("general");

  const filtered = useMemo(()=>{
    const byPill = applyPill(baseRows, pill);
    const q = quick.toLowerCase();
    return q ? byPill.filter(r=>r.ref.toLowerCase().includes(q)||r.codigo.toLowerCase().includes(q)) : byPill;
  },[pill,quick]);

  const totals = useMemo(()=>filtered.reduce((a,r)=>({...a,venta:a.venta+r.venta,comisiones:a.comisiones+r.comisiones,premios:a.premios+r.premios,neto:a.neto+r.neto,balance:a.balance+r.balance}),{venta:0,comisiones:0,premios:0,neto:0,balance:0}),[filtered]);

  const sorteoRows = SORTEOS.map((s,i)=>({id:`s${i}`,sorteo:s,venta:0,premios:0,comisiones:0,neto:0}));

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 space-y-3">
        <h2 className="text-xl font-bold text-[#333]">Ventas Histórico</h2>
        <div className="flex flex-wrap items-end gap-3">
          <DateInput label="Fecha inicial" value={fi} onChange={setFi}/>
          <DateInput label="Fecha final" value={ff} onChange={setFf}/>
          <MultiSelect label="Zonas" options={ZONAS.map(z=>z.nombre)} selected={selZonas} onChange={setSelZonas}/>
          <MultiSelect label="Bancas" options={BANCAS.map(b=>b.ref)} selected={selBancas} onChange={setSelBancas}/>
          <MultiSelect label="Sorteos" options={SORTEOS} selected={selSorteos} onChange={setSelSorteos}/>
          <Btn label="VER REPORTE" variant="primary"/>
          <Btn label="CSV" variant="secondary"/>
        </div>
        <TotalBadge label="Total neto" amount={totals.neto}/>
      </div>

      <div className="flex gap-2 border-b border-[#E5E5E0]">
        {(["general","sorteo"] as const).map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${activeTab===t?"text-[#14B8A6] border-[#14B8A6]":"text-[#666] border-transparent hover:text-[#333]"}`}>
            {t==="general"?"General":"Por sorteo"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}} className="space-y-3">
          {activeTab==="general" ? <>
            <div><p className="text-sm font-semibold text-[#333] mb-2">Filtros</p><FilterPills active={pill} onChange={setPill}/></div>
            <div className="flex justify-end"><QuickFilter value={quick} onChange={setQuick}/></div>
            <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">{HEADERS.map(h=><th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555] whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.length===0?<tr><td colSpan={7} className="py-8 text-center text-sm text-[#999]">Sin datos para el filtro seleccionado</td></tr>
                  :filtered.map((r,ri)=>(
                    <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                      <td className="px-3 py-2 text-[#333]">{r.ref}</td>
                      <td className="px-3 py-2 text-[#14B8A6] font-medium">{r.codigo}</td>
                      <td className="px-3 py-2 text-right">{fmt(r.venta)}</td>
                      <td className="px-3 py-2 text-right">{fmt(r.comisiones)}</td>
                      <td className="px-3 py-2 text-right">{fmt(r.premios)}</td>
                      <td className="px-3 py-2 text-right">{netoCell(r.neto)}</td>
                      <td className="px-3 py-2 text-right"><span className={`font-semibold ${r.balance>0?"text-[#3B82F6]":"text-[#999]"}`}>{fmt(r.balance)}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
                  <td className="px-3 py-2.5" colSpan={2}>Totales</td>
                  {[totals.venta,totals.comisiones,totals.premios].map((v,i)=><td key={i} className="px-3 py-2.5 text-right">{fmt(v)}</td>)}
                  <td className="px-3 py-2.5 text-right">{netoCell(totals.neto)}</td>
                  <td className="px-3 py-2.5 text-right"><span className={`font-semibold ${totals.balance>0?"text-[#3B82F6]":"text-[#999]"}`}>{fmt(totals.balance)}</span></td>
                </tr></tfoot>
              </table>
            </div>
            <p className="text-xs text-[#999]">Mostrando {filtered.length} de {baseRows.length} bancas</p>
          </> : <>
            <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
                  {["Sorteo","Venta","Premios","Comisiones","Neto"].map(h=><th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555] text-left">{h}</th>)}
                </tr></thead>
                <tbody>
                  {sorteoRows.map((r,ri)=>(
                    <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                      <td className="px-3 py-2 font-medium">{r.sorteo}</td>
                      {[r.venta,r.premios,r.comisiones].map((v,i)=><td key={i} className="px-3 py-2 text-right">{fmt(v)}</td>)}
                      <td className="px-3 py-2 text-right">{netoCell(r.neto)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
                  <td className="px-3 py-2.5">Totales</td>
                  {["$0.00","$0.00","$0.00"].map((v,i)=><td key={i} className="px-3 py-2.5 text-right">{v}</td>)}
                  <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
                </tr></tfoot>
              </table>
            </div>
          </>}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
