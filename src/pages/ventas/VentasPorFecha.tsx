import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Search, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

function fmt(n:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);}
function today(){return new Date().toISOString().split("T")[0];}

const MOCK = [
  { fecha:"06/17/2026", venta:300250, premios:396560, comisiones:1395.20, comision2:0, neto:-97705.20 },
  { fecha:"06/16/2026", venta:185320, premios:142100, comisiones:890.40,  comision2:0, neto:42329.60  },
  { fecha:"06/15/2026", venta:220445, premios:198340, comisiones:1102.10, comision2:0, neto:21002.90  },
];
const ZONAS_LIST  = ["Default","SFM"];
const BANCAS_LIST = ["MATADOR-SPORT","MMW RD 02","MMW RD 03"];

function MultiSelect({ label, options, value, onChange }: {
  label:string; options:string[]; value:string[]; onChange:(v:string[])=>void;
}) {
  const [open,setOpen]=useState(false);
  const toggle=(o:string)=>onChange(value.includes(o)?value.filter(x=>x!==o):[...value,o]);
  const txt=value.length===0||value.length===options.length?`${options.length} seleccionadas`:`${value.length} seleccionadas`;
  return (
    <div className="relative">
      <label className="text-xs text-[#999] font-medium block mb-1">{label}</label>
      <button onClick={()=>setOpen(v=>!v)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white min-w-[160px] hover:border-[#4ECDC4]">
        <span className="flex-1 text-left text-[#555]">{txt}</span>
        <ChevronDown size={13} className={`text-[#999] transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open&&(
        <div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2 max-h-[220px] overflow-y-auto">
          {options.map(o=>(
            <label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm">
              <input type="checkbox" checked={value.includes(o)} onChange={()=>toggle(o)} className="accent-[#4ECDC4]"/>
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VentasPorFecha() {
  const [fi,setFi]=useState(today()); const [ff,setFf]=useState(today());
  const [selBancas,setSelBancas]=useState<string[]>([]);
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [showC2,setShowC2]=useState(true);
  const [quick,setQuick]=useState("");

  const filtered=useMemo(()=>{
    if(!quick) return MOCK;
    return MOCK.filter(r=>r.fecha.includes(quick));
  },[quick]);

  const tot=useMemo(()=>({
    venta:     filtered.reduce((s,r)=>s+r.venta,0),
    premios:   filtered.reduce((s,r)=>s+r.premios,0),
    comisiones:filtered.reduce((s,r)=>s+r.comisiones,0),
    comision2: filtered.reduce((s,r)=>s+r.comision2,0),
    neto:      filtered.reduce((s,r)=>s+r.neto,0),
  }),[filtered]);

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Ventas por fecha"/>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Bancas" options={BANCAS_LIST} value={selBancas} onChange={setSelBancas}/>
        <MultiSelect label="Zonas" options={ZONAS_LIST} value={selZonas} onChange={setSelZonas}/>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#999] font-medium">Mostrar comisión #2</label>
          <button onClick={()=>setShowC2(v=>!v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${showC2?"bg-[#4ECDC4]":"bg-[#CCC]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showC2?"translate-x-5":"translate-x-0.5"}`}/>
          </button>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> VER VENTAS
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13}/> PDF
        </button>
      </div>
      {/* Quick filter */}
      <div className="relative max-w-xs ml-auto">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtrado rápido"
          className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
        {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
            {["Fecha","Venta","Premios","Comisiones",...(showC2?["Comisión #2"]:[]),"Neto"].map(h=>(
              <th key={h} className="px-4 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.fecha} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-4 py-2.5 font-medium text-[#333]">{r.fecha}</td>
                <td className="px-4 py-2.5 text-[#333]">{fmt(r.venta)}</td>
                <td className="px-4 py-2.5 text-[#555]">{fmt(r.premios)}</td>
                <td className="px-4 py-2.5 text-[#555]">{fmt(r.comisiones)}</td>
                {showC2&&<td className="px-4 py-2.5 text-[#555]">{fmt(r.comision2)}</td>}
                <td className={`px-4 py-2.5 font-semibold ${r.neto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.neto)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-4 py-2.5 text-[#333]">Totales</td>
              <td className="px-4 py-2.5">{fmt(tot.venta)}</td>
              <td className="px-4 py-2.5">{fmt(tot.premios)}</td>
              <td className="px-4 py-2.5">{fmt(tot.comisiones)}</td>
              {showC2&&<td className="px-4 py-2.5">{fmt(tot.comision2)}</td>}
              <td className={`px-4 py-2.5 ${tot.neto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.neto)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length} de {MOCK.length} entradas</p>
      </div>
    </motion.div>
  );
}
