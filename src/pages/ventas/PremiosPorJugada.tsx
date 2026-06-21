import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileDown, Search, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

function fmt(n:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);}
function today(){return new Date().toISOString().split("T")[0];}

const DIRPALE: {banca:string;codigo:string;dJug:number;dPrem:number;dComis:number;dNeto:number;pJug:number;pPrem:number;pComis:number;pNeto:number}[] = [];
const TRIPLES: {banca:string;codigo:string;tJug:number;tPrem:number;tComis:number;tNeto:number;spJug:number;spPrem:number;spComis:number;spNeto:number}[] = [];

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

function Filters({fi,setFi,ff,setFf,selZonas,setSelZonas}:{fi:string;setFi:(v:string)=>void;ff:string;setFf:(v:string)=>void;selZonas:string[];setSelZonas:(v:string[])=>void}){
  const { zonas } = useBancasZonas();
  return(
    <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
      <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
        <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
      <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
        <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
      <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
      <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
        <RefreshCw size={13}/> REFRESCAR
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white text-sm font-semibold rounded-full hover:bg-[#16A34A] shadow-sm">
        <FileDown size={13}/> CSV
      </button>
    </div>
  );
}

function TabDirPale(){
  const [fi,setFi]=useState(today());const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [perPage,setPerPage]=useState(20);
  const [quick,setQuick]=useState("");
  const filtered=useMemo(()=>(quick?DIRPALE.filter(r=>r.banca.toLowerCase().includes(quick.toLowerCase())):DIRPALE).slice(0,perPage),[quick,perPage]);
  const tot=useMemo(()=>({dJug:filtered.reduce((s,r)=>s+r.dJug,0),dPrem:filtered.reduce((s,r)=>s+r.dPrem,0),dComis:filtered.reduce((s,r)=>s+r.dComis,0),dNeto:filtered.reduce((s,r)=>s+r.dNeto,0),pJug:filtered.reduce((s,r)=>s+r.pJug,0),pPrem:filtered.reduce((s,r)=>s+r.pPrem,0),pComis:filtered.reduce((s,r)=>s+r.pComis,0),pNeto:filtered.reduce((s,r)=>s+r.pNeto,0)}),[filtered]);
  return(
    <div className="space-y-4">
      <Filters fi={fi} setFi={setFi} ff={ff} setFf={setFf} selZonas={selZonas} setSelZonas={setSelZonas}/>
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
              <th colSpan={4} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0] bg-teal-50">Directo</th>
              <th colSpan={4} className="px-3 py-2 text-xs font-semibold text-[#555] text-center">Pale</th>
            </tr>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0] text-xs text-[#777]">
              {["Jugado","Premios","Comisiones","Neto","Jugado","Premios","Comisiones","Neto"].map((h,i)=>(
                <th key={i} className={`px-2 py-2 font-semibold text-right whitespace-nowrap ${i<4?"bg-teal-50 border-r border-[#E5E5E0]":""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.codigo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-teal-50/10`}>
                <td className="px-3 py-2.5 font-medium text-[#333] whitespace-nowrap border-r border-[#F0F0EB]">{r.banca}</td>
                <td className="px-3 py-2.5 font-mono text-[#4ECDC4] text-xs border-r border-[#F0F0EB]">{r.codigo}</td>
                <td className="px-2 py-2.5 text-right bg-teal-50/30 text-[#333]">{fmt(r.dJug)}</td>
                <td className="px-2 py-2.5 text-right bg-teal-50/30 text-[#555]">{fmt(r.dPrem)}</td>
                <td className="px-2 py-2.5 text-right bg-teal-50/30 text-[#555]">{fmt(r.dComis)}</td>
                <td className={`px-2 py-2.5 text-right font-semibold border-r border-[#E5E5E0] ${r.dNeto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.dNeto)}</td>
                <td className="px-2 py-2.5 text-right text-[#333]">{fmt(r.pJug)}</td>
                <td className="px-2 py-2.5 text-right text-[#555]">{fmt(r.pPrem)}</td>
                <td className="px-2 py-2.5 text-right text-[#555]">{fmt(r.pComis)}</td>
                <td className={`px-2 py-2.5 text-right font-semibold ${r.pNeto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.pNeto)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-3 py-2.5">Totales</td>
              <td className="px-3 py-2.5 text-[#999]">-</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.dJug)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.dPrem)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.dComis)}</td>
              <td className={`px-2 py-2.5 text-right ${tot.dNeto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.dNeto)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.pJug)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.pPrem)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.pComis)}</td>
              <td className={`px-2 py-2.5 text-right ${tot.pNeto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.pNeto)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length > 0 ? 0 : 0} de {filtered.length} entradas</p>
      </div>
    </div>
  );
}

function TabTripletas(){
  const [fi,setFi]=useState(today());const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [quick,setQuick]=useState("");
  const filtered=useMemo(()=>quick?TRIPLES.filter(r=>r.banca.toLowerCase().includes(quick.toLowerCase())):TRIPLES,[quick]);
  const tot=useMemo(()=>({tJug:filtered.reduce((s,r)=>s+r.tJug,0),tPrem:filtered.reduce((s,r)=>s+r.tPrem,0),tComis:filtered.reduce((s,r)=>s+r.tComis,0),tNeto:filtered.reduce((s,r)=>s+r.tNeto,0),spJug:filtered.reduce((s,r)=>s+r.spJug,0),spPrem:filtered.reduce((s,r)=>s+r.spPrem,0),spComis:filtered.reduce((s,r)=>s+r.spComis,0),spNeto:filtered.reduce((s,r)=>s+r.spNeto,0)}),[filtered]);
  return(
    <div className="space-y-4">
      <Filters fi={fi} setFi={setFi} ff={ff} setFf={setFf} selZonas={selZonas} setSelZonas={setSelZonas}/>
      <div className="relative max-w-xs ml-auto">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtrado rápido"
          className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
        {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
      </div>
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
              <th rowSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-left border-r border-[#E5E5E0]">Banca</th>
              <th rowSpan={2} className="px-3 py-2 text-xs font-semibold text-[#555] text-left border-r border-[#E5E5E0]">Código</th>
              <th colSpan={4} className="px-3 py-2 text-xs font-semibold text-[#555] text-center border-r border-[#E5E5E0] bg-purple-50">Tripleta</th>
              <th colSpan={4} className="px-3 py-2 text-xs font-semibold text-[#555] text-center">Super Pale</th>
            </tr>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0] text-xs text-[#777]">
              {["Jugado","Premios","Comisiones","Neto","Jugado","Premios","Comisiones","Neto"].map((h,i)=>(
                <th key={i} className={`px-2 py-2 font-semibold text-right whitespace-nowrap ${i<4?"bg-purple-50 border-r border-[#E5E5E0]":""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.codigo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"}`}>
                <td className="px-3 py-2.5 font-medium text-[#333] border-r border-[#F0F0EB]">{r.banca}</td>
                <td className="px-3 py-2.5 font-mono text-[#4ECDC4] text-xs border-r border-[#F0F0EB]">{r.codigo}</td>
                <td className="px-2 py-2.5 text-right bg-purple-50/30">{fmt(r.tJug)}</td>
                <td className="px-2 py-2.5 text-right bg-purple-50/30">{fmt(r.tPrem)}</td>
                <td className="px-2 py-2.5 text-right bg-purple-50/30">{fmt(r.tComis)}</td>
                <td className={`px-2 py-2.5 text-right font-semibold border-r border-[#E5E5E0] ${r.tNeto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.tNeto)}</td>
                <td className="px-2 py-2.5 text-right">{fmt(r.spJug)}</td>
                <td className="px-2 py-2.5 text-right">{fmt(r.spPrem)}</td>
                <td className="px-2 py-2.5 text-right">{fmt(r.spComis)}</td>
                <td className={`px-2 py-2.5 text-right font-semibold ${r.spNeto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.spNeto)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-3 py-2.5">Totales</td>
              <td className="px-3 py-2.5 text-[#999]">-</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.tJug)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.tPrem)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.tComis)}</td>
              <td className={`px-2 py-2.5 text-right ${tot.tNeto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.tNeto)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.spJug)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.spPrem)}</td>
              <td className="px-2 py-2.5 text-right">{fmt(tot.spComis)}</td>
              <td className={`px-2 py-2.5 text-right ${tot.spNeto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.spNeto)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length} de {TRIPLES.length} entradas</p>
      </div>
    </div>
  );
}

export default function PremiosPorJugada(){
  const [tab,setTab]=useState<"dp"|"ts">("dp");
  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Premios por tipo de jugada"/>
      <div className="border-b border-[#E5E5E0]">
        <div className="flex gap-0">
          {([["dp","Directo y pale"],["ts","Tripleta y super pale"]] as const).map(([k,label])=>(
            <button key={k} onClick={()=>setTab(k)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab===k?"text-[#4ECDC4] border-[#4ECDC4]":"text-[#999] border-transparent hover:text-[#666]"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {tab==="dp"&&<TabDirPale/>}
      {tab==="ts"&&<TabTripletas/>}
    </motion.div>
  );
}
