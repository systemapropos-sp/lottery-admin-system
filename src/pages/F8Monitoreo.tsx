/**
 * F8 — Monitor de Tickets
 * Concepto: JRM Monitor de tickets, diseño NMV moderno
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, ChevronDown, ChevronUp, Printer, SlidersHorizontal,
  Search, RotateCcw, TrendingUp, DollarSign, Clock,
} from "lucide-react";

// ─── Datos desde Supabase via BancasZonasContext ──────────────────────────────
import { useBancasZonas } from "@/context/BancasZonasContext";

const NMV_LOTERIAS = [
  "Florida AM","Florida PM","New York AM","New York PM",
  "Anguila 10AM","Anguila PM","Nacional","Leidsa","King Lottery",
];
const TIPOS_JUGADA = ["Directo","Pale","Tripleta","Super Pale","Quiniela"];

interface Ticket {
  id:string; numero:string; fecha:string; usuario:string; banca:string;
  loteria:string; tipoJugada:string; numeroJugado:string;
  monto:number; premio:number;
  fechaCancelacion:string|null; canceladoPor:string|null;
  estado:"ganador"|"pendiente"|"perdedor"|"cancelado"|"pagado";
  zona:string;
}

// Sin tickets hardcodeados — se cargarán desde Supabase
const DEMO: Ticket[] = [];

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({checked,onChange,label}:{checked:boolean;onChange:(v:boolean)=>void;label:string}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <button type="button" onClick={()=>onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          checked ? "bg-[#4ECDC4] shadow-[0_0_8px_rgba(78,205,196,0.4)]" : "bg-[#E0E0E0]"
        }`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
          checked ? "left-5" : "left-0.5"
        }`}/>
      </button>
      <span className="text-xs font-medium text-[#555] group-hover:text-[#333] transition-colors">{label}</span>
    </label>
  );
}

type BancaItem = {id:string; code:string; name:string};

// ─── Bancas Multi-Select ──────────────────────────────────────────────────────
function BancasSelect({selected,onChange,bancasList}:{selected:string[];onChange:(v:string[])=>void;bancasList:BancaItem[]}) {
  const [open,setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  const all = bancasList.length>0 && selected.length===bancasList.length;
  const label = selected.length===0?"Todas las bancas":all?"Todas":
    selected.length<=2?selected.map(id=>bancasList.find(b=>b.id===id)?.code??"").join(", "):`${selected.length} bancas`;
  const toggle=(id:string)=>onChange(selected.includes(id)?selected.filter(s=>s!==id):[...selected,id]);
  return(
    <div ref={ref} className="relative">
      <button type="button" onClick={()=>setOpen(v=>!v)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm border rounded-xl bg-white transition-all min-w-[180px] ${
          open||selected.length>0?"border-[#4ECDC4] ring-2 ring-[#4ECDC4]/15":"border-[#E5E5E0] hover:border-[#CCCCCC]"
        }`}>
        <span className={`truncate ${selected.length>0?"text-[#333] font-medium":"text-[#999]"}`}>{label}</span>
        <ChevronDown size={13} className={`text-[#999] flex-shrink-0 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
            transition={{duration:0.15}}
            className="absolute top-full mt-1.5 left-0 z-20 bg-white border border-[#E5E5E0] rounded-xl shadow-xl p-2 min-w-[220px] max-h-64 overflow-y-auto">
            <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm border-b border-[#F0F0EB] mb-1">
              <input type="checkbox" checked={all}
                onChange={()=>onChange(all?[]:bancasList.map(b=>b.id))}
                className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"/>
              <span className="font-semibold text-[#333]">Todas las bancas</span>
            </label>
            {bancasList.map(b=>(
              <label key={b.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm transition-colors">
                <input type="checkbox" checked={selected.includes(b.id)} onChange={()=>toggle(b.id)}
                  className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"/>
                <span className="text-[#333]">{b.name}</span>
                <span className="text-[#AAA] text-xs ml-auto font-mono">{b.code}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Zonas Multi-Select ────────────────────────────────────────────────────────
function ZonasSelect({selected,onChange,zonasList}:{selected:string[];onChange:(v:string[])=>void;zonasList:string[]}) {
  const [open,setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  const all = zonasList.length>0 && selected.length===zonasList.length;
  const label = selected.length===0?"Todas las zonas":all?"Todas":`${selected.length} zona(s)`;
  const toggle=(z:string)=>onChange(selected.includes(z)?selected.filter(s=>s!==z):[...selected,z]);
  return(
    <div ref={ref} className="relative">
      <button type="button" onClick={()=>setOpen(v=>!v)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm border rounded-xl bg-white transition-all min-w-[160px] ${
          open||selected.length>0?"border-[#4ECDC4] ring-2 ring-[#4ECDC4]/15":"border-[#E5E5E0] hover:border-[#CCCCCC]"
        }`}>
        <span className={`truncate ${selected.length>0?"text-[#333] font-medium":"text-[#999]"}`}>{label}</span>
        <ChevronDown size={13} className={`text-[#999] flex-shrink-0 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
            transition={{duration:0.15}}
            className="absolute top-full mt-1.5 left-0 z-20 bg-white border border-[#E5E5E0] rounded-xl shadow-xl p-2 min-w-[160px]">
            {zonasList.map(z=>(
              <label key={z} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm transition-colors">
                <input type="checkbox" checked={selected.includes(z)} onChange={()=>toggle(z)}
                  className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"/>
                <span className="text-[#333]">{z}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Estado Badge ───────────────────────────────────────────────────────────────
function EstadoBadge({estado}:{estado:Ticket["estado"]}) {
  const cfg:{[k:string]:{label:string;cls:string}} = {
    ganador: {label:"Ganador",   cls:"bg-emerald-50 text-emerald-700 border-emerald-200"},
    pagado:  {label:"Pagado",    cls:"bg-blue-50 text-blue-700 border-blue-200"},
    pendiente:{label:"Pendiente",cls:"bg-amber-50 text-amber-700 border-amber-200"},
    perdedor:{label:"Perdedor",  cls:"bg-slate-100 text-slate-600 border-slate-200"},
    cancelado:{label:"Cancelado",cls:"bg-red-50 text-red-600 border-red-200"},
  };
  const c=cfg[estado]??cfg.perdedor;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.cls}`}>{c.label}</span>;
}

// ─── Summary Card ───────────────────────────────────────────────────────────────
function SummaryCard({icon,label,value,color,bg}:{icon:React.ReactNode;label:string;value:string;color:string;bg:string}) {
  return(
    <div className={`rounded-2xl p-4 ${bg} border border-white/60 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-white/70 flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#666] uppercase tracking-wide">{label}</p>
        <p className={`text-xl font-bold font-mono ${color} mt-0.5`}>{value}</p>
      </div>
    </div>
  );
}

type SortField = "numero"|"fecha"|"usuario"|"monto"|"premio"|"estado";

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function F8Monitoreo() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const bancasList: BancaItem[] = bancasRaw.map(b => ({ id: b.id, code: b.code, name: b.name }));
  const zonasList: string[] = zonasRaw.map(z => z.nombre);
  const today = new Date().toISOString().slice(0,10);
  const [fecha,setFecha] = useState(today);
  const [bancas,setBancas] = useState<string[]>([]);
  const [loteria,setLoteria] = useState("");
  const [tipo,setTipo] = useState("");
  const [numero,setNumero] = useState("");
  const [pendientes,setPendientes] = useState(false);
  const [soloGanadores,setSoloGanadores] = useState(false);
  const [zonas,setZonas] = useState<string[]>([]);
  const [applied,setApplied] = useState(false);
  const [activeTab,setActiveTab] = useState<"todos"|"ganador"|"pendiente"|"perdedor"|"cancelado">("todos");
  const [quickFilter,setQuickFilter] = useState("");
  const [sortField,setSortField] = useState<SortField|null>(null);
  const [sortDir,setSortDir] = useState<"asc"|"desc">("asc");

  // ─ Filtered by apply
  const filtered = useMemo(()=>{
    let list = DEMO;
    if(applied){
      if(bancas.length) list=list.filter(t=>{
        return bancas.some(bid=>{
          const b=bancasList.find(x=>x.id===bid);
          return b&&(t.banca===b.code||t.banca===b.name);
        });
      });
      if(loteria)      list=list.filter(t=>t.loteria===loteria);
      if(tipo)         list=list.filter(t=>t.tipoJugada===tipo);
      if(numero.trim())list=list.filter(t=>t.numeroJugado.includes(numero.trim()));
      if(pendientes)   list=list.filter(t=>t.estado==="pendiente");
      if(soloGanadores)list=list.filter(t=>t.estado==="ganador"||t.estado==="pagado");
      if(zonas.length) list=list.filter(t=>zonas.includes(t.zona));
    }
    return list;
  },[applied,bancas,loteria,tipo,numero,pendientes,soloGanadores,zonas]);

  const counts = useMemo(()=>{
    const c={todos:filtered.length,ganador:0,pendiente:0,perdedor:0,cancelado:0};
    filtered.forEach(t=>{
      if(t.estado==="ganador"||t.estado==="pagado") c.ganador++;
      else if(t.estado==="pendiente") c.pendiente++;
      else if(t.estado==="perdedor")  c.perdedor++;
      else if(t.estado==="cancelado") c.cancelado++;
    });
    return c;
  },[filtered]);

  // ─ Tab + quickfilter + sort
  const displayed = useMemo(()=>{
    let list = activeTab==="todos"?filtered:filtered.filter(t=>{
      if(activeTab==="ganador") return t.estado==="ganador"||t.estado==="pagado";
      return t.estado===activeTab;
    });
    if(quickFilter.trim()){
      const q=quickFilter.toLowerCase();
      list=list.filter(t=>t.numero.toLowerCase().includes(q)||t.usuario.toLowerCase().includes(q)||t.numeroJugado.includes(q));
    }
    if(sortField){
      list=[...list].sort((a,b)=>{
        let cmp=0;
        if(sortField==="numero")  cmp=a.numero.localeCompare(b.numero);
        if(sortField==="fecha")   cmp=a.fecha.localeCompare(b.fecha);
        if(sortField==="usuario") cmp=a.usuario.localeCompare(b.usuario);
        if(sortField==="monto")   cmp=a.monto-b.monto;
        if(sortField==="premio")  cmp=a.premio-b.premio;
        if(sortField==="estado")  cmp=a.estado.localeCompare(b.estado);
        return sortDir==="asc"?cmp:-cmp;
      });
    }
    return list;
  },[filtered,activeTab,quickFilter,sortField,sortDir]);

  const totals = useMemo(()=>({
    monto:    displayed.reduce((s,t)=>s+t.monto,0),
    premios:  displayed.reduce((s,t)=>s+t.premio,0),
    pendiente:displayed.filter(t=>t.estado==="pendiente").reduce((s,t)=>s+t.monto,0),
  }),[displayed]);

  function toggleSort(f:SortField){
    if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc");
    else{setSortField(f);setSortDir("desc");}
  }

  function resetFilters(){
    setBancas([]);setLoteria("");setTipo("");setNumero("");
    setPendientes(false);setSoloGanadores(false);setZonas([]);
    setApplied(false);setActiveTab("todos");setQuickFilter("");
  }

  const fmt=(n:number)=>`$${n.toLocaleString("en-US",{minimumFractionDigits:2})}`;

  const TABS=[
    {key:"todos",    label:"TODOS",     count:counts.todos},
    {key:"ganador",  label:"GANADORES", count:counts.ganador},
    {key:"pendiente",label:"PENDIENTES",count:counts.pendiente},
    {key:"perdedor", label:"PERDEDORES",count:counts.perdedor},
    {key:"cancelado",label:"CANCELADO", count:counts.cancelado},
  ] as const;

  function SortBtn({field,label}:{field:SortField;label:string}) {
    const active=sortField===field;
    return(
      <button onClick={()=>toggleSort(field)} className={`flex items-center gap-0.5 transition-colors font-semibold ${active?"text-[#4ECDC4]":"hover:text-[#4ECDC4]"}`}>
        {label}
        <span className="ml-0.5">{active?(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>):<ChevronUp size={9} className="opacity-20"/>}</span>
      </button>
    );
  }

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className="space-y-5">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Monitor de Tickets</h1>
          <p className="text-sm text-[#9999AA] mt-0.5">Supervisión y filtrado de tickets en tiempo real</p>
        </div>
        {applied && (
          <button onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-[#999] hover:text-[#EF4444] transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-[#E5E5E0] hover:border-red-200">
            <RotateCcw size={12}/> Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Filter Card ─────────────────────────────────────────────── */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:0.05}}
        className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">

        {/* Row 1 */}
        <div className="flex flex-wrap items-end gap-3 mb-4">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Fecha</label>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none"/>
              <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
                className="pl-8 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 w-40 transition-all"/>
            </div>
          </div>
          {/* Banca */}
          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Banca</label>
            <BancasSelect selected={bancas} onChange={setBancas} bancasList={bancasList}/>
          </div>
          {/* Lotería */}
          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Lotería</label>
            <select value={loteria} onChange={e=>setLoteria(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 w-44 transition-all">
              <option value="">Todas</option>
              {NMV_LOTERIAS.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          {/* Tipo jugada */}
          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Tipo de jugada</label>
            <select value={tipo} onChange={e=>setTipo(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 w-36 transition-all">
              <option value="">Todos</option>
              {TIPOS_JUGADA.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          {/* Número */}
          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Número</label>
            <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Ej: 03"
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 w-28 transition-all"/>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Toggle checked={pendientes} onChange={setPendientes} label="Pendientes de pago"/>
          <Toggle checked={soloGanadores} onChange={setSoloGanadores} label="Sólo ganadores"/>
          <div>
            <ZonasSelect selected={zonas} onChange={setZonas} zonasList={zonasList}/>
          </div>
          <button onClick={()=>setApplied(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#4ECDC4] text-white text-sm font-bold rounded-xl hover:bg-[#3DBDB5] active:scale-[0.97] transition-all shadow-[0_2px_10px_rgba(78,205,196,0.35)] hover:shadow-[0_4px_16px_rgba(78,205,196,0.4)]">
            <SlidersHorizontal size={14}/> FILTRAR
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[#F0F0EB]">
          <span className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wider self-center mr-1">Ver:</span>
          {TABS.map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab===tab.key
                  ?"bg-[#4ECDC4] text-white shadow-[0_2px_8px_rgba(78,205,196,0.35)]"
                  :"bg-[#F5F5F0] text-[#666] hover:bg-[#EBEBEB]"
              }`}>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab===tab.key?"bg-white/25 text-white":"bg-white/80 text-[#888]"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Summary Cards ────────────────────────────────────────────── */}
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:0.1}}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={<DollarSign size={18}/>} label="Monto Total"
          value={fmt(totals.monto)} color="text-[#4ECDC4]" bg="bg-gradient-to-br from-[#E0F7F5] to-[#CCF2EF]"/>
        <SummaryCard icon={<TrendingUp size={18}/>} label="Total Premios"
          value={fmt(totals.premios)} color="text-emerald-600" bg="bg-gradient-to-br from-emerald-50 to-green-50"/>
        <SummaryCard icon={<Clock size={18}/>} label="Pendiente de Pago"
          value={fmt(totals.pendiente)} color={totals.pendiente>0?"text-amber-600":"text-[#999]"} bg="bg-gradient-to-br from-amber-50 to-orange-50"/>
      </motion.div>

      {/* ── Table Card ───────────────────────────────────────────────── */}
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:0.15}}
        className="bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Quick filter bar */}
        <div className="px-5 py-3.5 border-b border-[#F5F5F0] flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBBBBB] pointer-events-none"/>
            <input value={quickFilter} onChange={e=>setQuickFilter(e.target.value)}
              placeholder="Filtro rápido..."
              className="pl-8 pr-3 py-2 text-sm border border-[#E5E5E0] rounded-xl focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 w-52 transition-all"/>
          </div>
          <span className="text-xs text-[#BBBBBB] ml-auto">
            {displayed.length} ticket{displayed.length!==1?"s":""}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#EFEFEB] text-[11px] text-[#888] uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold"><SortBtn field="numero" label="Número"/></th>
                <th className="px-4 py-3 text-left font-semibold"><SortBtn field="fecha" label="Fecha"/></th>
                <th className="px-4 py-3 text-left font-semibold"><SortBtn field="usuario" label="Usuario"/></th>
                <th className="px-4 py-3 text-right font-semibold"><SortBtn field="monto" label="Monto"/></th>
                <th className="px-4 py-3 text-right font-semibold"><SortBtn field="premio" label="Premio"/></th>
                <th className="px-4 py-3 text-left font-semibold text-[#888]">Fecha Cancelación</th>
                <th className="px-4 py-3 text-center font-semibold"><SortBtn field="estado" label="Estado"/></th>
                <th className="px-4 py-3 text-center font-semibold text-[#888]">Acción</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayed.length===0?(
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-[#AAAAAA]">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={28} className="text-[#E0E0E0]"/>
                        <p>No se encontraron tickets</p>
                      </div>
                    </td>
                  </tr>
                ):displayed.map((t,ri)=>(
                  <motion.tr key={t.id}
                    initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                    transition={{duration:0.2,delay:ri*0.02}}
                    className={`border-b border-[#F7F7F5] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#F0FBF9] transition-colors`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[#4ECDC4] text-xs font-semibold cursor-pointer hover:underline hover:text-[#3DBDB5] transition-colors">{t.numero}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#666]">{t.fecha}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[#444]">{t.usuario}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-[#333]">{fmt(t.monto)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      <span className={t.premio>0?"text-emerald-600 font-bold":"text-[#CCC]"}>{fmt(t.premio)}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {t.fechaCancelacion
                        ?<span className="text-red-500">{t.fechaCancelacion}{t.canceladoPor&&<span className="text-[#AAA] ml-1">({t.canceladoPor})</span>}</span>
                        :<span className="text-[#DDD]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center"><EstadoBadge estado={t.estado}/></td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-2 rounded-xl text-[#4ECDC4] hover:bg-[#E0F7F5] hover:text-[#3DBDB5] transition-all" title="Imprimir ticket">
                        <Printer size={14}/>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#F0F0EB] flex items-center justify-between">
          <p className="text-xs text-[#AAAAAA]">
            Mostrando <span className="font-semibold text-[#666]">{displayed.length}</span> ticket{displayed.length!==1?"s":""}
          </p>
          {applied && <span className="text-xs text-[#4ECDC4] font-medium bg-[#E0F7F5] px-2.5 py-1 rounded-full">Filtros activos</span>}
        </div>
      </motion.div>
    </motion.div>
  );
}
