import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

function fmt(n:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);}
function today(){return new Date().toISOString().split("T")[0];}

const SORTEOS_LIST=["GANA MAS","LA PRIMERA","NEW YORK AM","FLORIDA AM","QUINIELA REAL","ANGUILA 10AM","LOTEKA","LA SUERTE","LOTEDOM"];

const MOCK_RESULTS: { sorteo: string; tipos: { tipo: string; jugadas: { num: string; venta: number; premio: number }[] }[] }[] = [];

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
      {open&&<div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg p-2 max-h-[220px] overflow-y-auto min-w-[180px]">
        {options.map(o=><label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm">
          <input type="checkbox" checked={value.includes(o)} onChange={()=>toggle(o)} className="accent-[#4ECDC4]"/>{o}
        </label>)}
      </div>}
    </div>
  );
}

export default function JugadasGanadoras(){
  const { zonas } = useBancasZonas();
  const [fi,setFi]=useState(()=>{const d=new Date();d.setDate(d.getDate()-3);return d.toISOString().split("T")[0];});
  const [ff,setFf]=useState(today());
  const [sorteo,setSorteo]=useState("GANA MAS");
  const [selZonas,setSelZonas]=useState<string[]>([]);

  const filtered=useMemo(()=>MOCK_RESULTS.filter(r=>r.sorteo===sorteo),[sorteo]);

  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Jugadas ganadoras"/>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Sorteo</label>
          <div className="relative">
            <select value={sorteo} onChange={e=>setSorteo(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4] pr-8">
              {SORTEOS_LIST.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"/>
          </div>
        </div>
        <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> FILTRAR
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13}/> PDF
        </button>
      </div>

      {/* Results tables */}
      {filtered.map(result=>{
        const totalVenta=result.tipos.reduce((s,t)=>s+t.jugadas.reduce((ss,j)=>ss+j.venta,0),0);
        const totalPremio=result.tipos.reduce((s,t)=>s+t.jugadas.reduce((ss,j)=>ss+j.premio,0),0);
        return(
          <div key={result.sorteo} className="bg-white rounded-xl border border-[#E5E5E0] overflow-hidden shadow-sm">
            {/* Sorteo header */}
            <div className="bg-[#F0F7F5] border-b border-[#E5E5E0] px-5 py-3 text-center">
              <span className="text-base font-bold text-[#333] uppercase tracking-wide">{result.sorteo}</span>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
                <th className="px-4 py-3 text-xs font-semibold text-[#555] text-left w-[140px]">Tipo de jugada</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#555] text-left">Jugada</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#555] text-right">Venta</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#555] text-right">Premio</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#555] text-right w-[110px]">Total</th>
              </tr></thead>
              <tbody>
                {result.tipos.map(tipo=>{
                  const subtot=tipo.jugadas.reduce((s,j)=>s+j.premio,0);
                  return tipo.jugadas.map((j,ji)=>(
                    <tr key={`${tipo.tipo}-${ji}`} className={`border-b border-[#F0F0EB] ${ji%2===0?"bg-white":"bg-[#FAFAFA]"}`}>
                      {ji===0&&(
                        <td rowSpan={tipo.jugadas.length} className="px-4 py-3 font-bold text-[#333] align-top border-r border-[#F0F0EB]">
                          {tipo.tipo}
                        </td>
                      )}
                      <td className="px-4 py-2.5 font-mono text-[#4ECDC4] font-semibold">{j.num}</td>
                      <td className="px-4 py-2.5 text-right text-[#555]">{fmt(j.venta)}</td>
                      <td className="px-4 py-2.5 text-right text-[#333]">{fmt(j.premio)}</td>
                      {ji===0&&(
                        <td rowSpan={tipo.jugadas.length} className="px-4 py-2.5 text-right font-bold text-sky-700 align-middle">
                          {fmt(subtot)}
                        </td>
                      )}
                    </tr>
                  ));
                })}
                {/* Total row */}
                <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
                  <td className="px-4 py-3 text-[#333]">Total</td>
                  <td className="px-4 py-3"/>
                  <td className="px-4 py-3 text-right">{fmt(totalVenta)}</td>
                  <td className="px-4 py-3 text-right">{fmt(totalPremio)}</td>
                  <td className="px-4 py-3"/>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      {filtered.length===0&&(
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-12 text-center text-[#999] text-sm">
          No hay jugadas ganadoras para este sorteo en el período seleccionado
        </div>
      )}
    </motion.div>
  );
}
