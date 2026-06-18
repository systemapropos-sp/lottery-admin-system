import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Search, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

function fmt(n:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);}
function pct(n:number){return n===0?"0":n.toFixed(2);}
function today(){return new Date().toISOString().split("T")[0];}
const ZONAS_LIST=["Default","SFM"];

const MOCK=[
  {banca:"MMW RD 02",     codigo:"MWR-0002",total:2745,   dirAmt:2135,   dirPct:77.78,paleAmt:610,   palePct:22.22,c3sAmt:0,c3sPct:0,c3bAmt:0,c3bPct:0,p4sAmt:0,p4sPct:0,p4bAmt:0,p4bPct:0},
  {banca:"MATADOR-SPORT", codigo:"MWR-0001",total:168880, dirAmt:128005, dirPct:75.80,paleAmt:37740, palePct:22.35,c3sAmt:0,c3sPct:0,c3bAmt:0,c3bPct:0,p4sAmt:0,p4sPct:0,p4bAmt:0,p4bPct:0},
  ...Array.from({length:18},(_,i)=>({banca:`MMW RD ${String(i+3).padStart(2,"0")}`,codigo:`MWR-${String(i+3).padStart(4,"0")}`,total:0,dirAmt:0,dirPct:0,paleAmt:0,palePct:0,c3sAmt:0,c3sPct:0,c3bAmt:0,c3bPct:0,p4sAmt:0,p4sPct:0,p4bAmt:0,p4bPct:0})),
];

function MultiSelect({label,options,value,onChange}:{label:string;options:string[];value:string[];onChange:(v:string[])=>void}){
  const [open,setOpen]=useState(false);
  const toggle=(o:string)=>onChange(value.includes(o)?value.filter(x=>x!==o):[...value,o]);
  const txt=value.length===0||value.length===options.length?`${options.length} seleccionadas`:`${value.length} seleccionadas`;
  return(
    <div className="relative">
      <label className="text-xs text-[#999] font-medium block mb-1">{label}</label>
      <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white min-w-[160px] hover:border-[#4ECDC4]">
        <span className="flex-1 text-left text-[#555]">{txt}</span>
        <ChevronDown size={13} className={`text-[#999] transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open&&<div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2">
        {options.map(o=><label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm">
          <input type="checkbox" checked={value.includes(o)} onChange={()=>toggle(o)} className="accent-[#4ECDC4]"/>{o}
        </label>)}
      </div>}
    </div>
  );
}

export default function Porcentajes(){
  const [fi,setFi]=useState(today());const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [perPage,setPerPage]=useState(20);
  const [quick,setQuick]=useState("");

  const filtered=useMemo(()=>{
    const list=quick?MOCK.filter(r=>r.banca.toLowerCase().includes(quick.toLowerCase())||r.codigo.toLowerCase().includes(quick.toLowerCase())):MOCK;
    return list.slice(0,perPage);
  },[quick,perPage]);

  const tot=useMemo(()=>({
    total: MOCK.reduce((s,r)=>s+r.total,0),
    dir:   MOCK.reduce((s,r)=>s+r.dirAmt,0),
    pale:  MOCK.reduce((s,r)=>s+r.paleAmt,0),
  }),[]);

  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Reporte de porcentaje de jugadas"/>
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Zonas" options={ZONAS_LIST} value={selZonas} onChange={setSelZonas}/>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> REFRESCAR
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13}/> PDF
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#999]">Entradas por página</label>
          <select value={perPage} onChange={e=>setPerPage(+e.target.value)} className="px-2 py-1.5 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]">
            {[10,20,50,100].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
          <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtrado rápido"
            className="pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
              <th rowSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-left border-r border-[#E5E5E0]">Banca</th>
              <th rowSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-left border-r border-[#E5E5E0]">Código</th>
              <th rowSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-left border-r border-[#E5E5E0]">Total vendido</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0] bg-yellow-50">Directo</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0]">Pale</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0]">Cash3 S</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0]">Cash3 B</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0]">Play4 S</th>
              <th colSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-center">Play4 B</th>
            </tr>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0] text-xs text-[#777]">
              {["$","%","$","%","$","%","$","%","$","%","$","%","$","%","$","%"].slice(0,14).map((h,i)=>(
                <th key={i} className={`px-2 py-2 font-semibold text-center ${i%2===0&&i<=3?"bg-yellow-50":""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.codigo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-3 py-2.5 font-medium text-[#333] whitespace-nowrap border-r border-[#F0F0EB]">{r.banca}</td>
                <td className="px-3 py-2.5 font-mono text-[#4ECDC4] text-xs border-r border-[#F0F0EB]">{r.codigo}</td>
                <td className="px-3 py-2.5 text-[#333] border-r border-[#F0F0EB]">{fmt(r.total)}</td>
                <td className={`px-2 py-2.5 text-center text-[#333] ${r.dirAmt>0?"bg-yellow-50 font-semibold":""}`}>{fmt(r.dirAmt)}</td>
                <td className={`px-2 py-2.5 text-center border-r border-[#F0F0EB] text-[#555] text-xs ${r.dirPct>0?"bg-yellow-50 font-semibold":""}`}>{pct(r.dirPct)}</td>
                <td className="px-2 py-2.5 text-center text-[#333]">{fmt(r.paleAmt)}</td>
                <td className="px-2 py-2.5 text-center text-xs text-[#555] border-r border-[#F0F0EB]">{pct(r.palePct)}</td>
                <td className="px-2 py-2.5 text-center text-[#555]">{fmt(r.c3sAmt)}</td>
                <td className="px-2 py-2.5 text-center text-xs border-r border-[#F0F0EB]">{pct(r.c3sPct)}</td>
                <td className="px-2 py-2.5 text-center text-[#555]">{fmt(r.c3bAmt)}</td>
                <td className="px-2 py-2.5 text-center text-xs border-r border-[#F0F0EB]">{pct(r.c3bPct)}</td>
                <td className="px-2 py-2.5 text-center text-[#555]">{fmt(r.p4sAmt)}</td>
                <td className="px-2 py-2.5 text-center text-xs border-r border-[#F0F0EB]">{pct(r.p4sPct)}</td>
                <td className="px-2 py-2.5 text-center text-[#555]">{fmt(r.p4bAmt)}</td>
                <td className="px-2 py-2.5 text-center text-xs">{pct(r.p4bPct)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4] text-sm">
              <td className="px-3 py-2.5">Totales</td>
              <td className="px-3 py-2.5 text-[#999]">-</td>
              <td className="px-3 py-2.5">{fmt(tot.total)}</td>
              <td className="px-2 py-2.5 text-center">{fmt(tot.dir)}</td>
              <td className="px-2 py-2.5 text-center text-xs">-</td>
              <td className="px-2 py-2.5 text-center">{fmt(tot.pale)}</td>
              <td className="px-2 py-2.5 text-center text-xs">-</td>
              {Array(8).fill(0).map((_,i)=><td key={i} className="px-2 py-2.5 text-center">-</td>)}
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length} de {MOCK.length} entradas</p>
      </div>
    </motion.div>
  );
}
