import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileDown, FileText, Search, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
function today() { return new Date().toISOString().split("T")[0]; }

// ─── Sin datos mock — se cargarán desde Supabase ─────────────────────────────
const BANCAS_DATA:   { ref:string;codigo:string;tickets:number;venta:number;comisiones:number;comision2:number;premios:number;neto:number;final:number }[] = [];
const SORTEOS_DATA:  { sorteo:string;vendido:number;premios:number;comisiones:number;neto:number }[] = [];
const COMBOS_DATA:   { combo:string;vendido:number;comis1:number;comis2:number;premios:number;balance:number }[] = [];
const ZONAS_DATA:    { nombre:string;cnt:number;p:number;l:number;w:number;total:number;venta:number;comisiones:number;premios:number;neto:number;caida:number;final:number }[] = [];
const SORTEOS_LIST:  string[] = [];

// ─── Shared helpers ───────────────────────────────────────────────────────────
const PILLS = ["TODOS","CON VENTAS","CON PREMIOS","CON TICKETS PENDIENTES","CON VENTAS NETAS NEGATIVAS","CON VENTAS NETAS POSITIVAS"] as const;

function MultiSelect({ label, options, value, onChange }: {
  label:string; options:string[]; value:string[]; onChange:(v:string[])=>void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (o:string) => onChange(value.includes(o) ? value.filter(x=>x!==o) : [...value,o]);
  const txt = value.length===0||value.length===options.length ? `${options.length} seleccionadas` : `${value.length} seleccionadas`;
  return (
    <div className="relative">
      <label className="text-xs text-[#999] font-medium block mb-1">{label}</label>
      <button onClick={()=>setOpen(v=>!v)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white min-w-[160px] hover:border-[#4ECDC4]">
        <span className="flex-1 text-left text-[#555]">{txt}</span>
        <ChevronDown size={13} className={`text-[#999] transition-transform ${open?"rotate-180":""}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2 max-h-[260px] overflow-y-auto">
          {options.map(o=>(
            <label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm text-[#333]">
              <input type="checkbox" checked={value.includes(o)} onChange={()=>toggle(o)} className="accent-[#4ECDC4]"/>
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }: {label:string;value:boolean;onChange:(v:boolean)=>void}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#999] font-medium">{label}</label>
      <button onClick={()=>onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value?"bg-[#4ECDC4]":"bg-[#CCCCCC]"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value?"translate-x-5":"translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function NetoBadge({val}:{val:number}) {
  const pos = val >= 0;
  return <span className={`font-semibold ${pos ? "text-sky-700" : "text-[#EF4444]"}`}>{fmt(val)}</span>;
}

// ─── Tab: General ─────────────────────────────────────────────────────────────
function TabGeneral() {
  const { zonas } = useBancasZonas();
  const [fi,setFi]=useState(today()); const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [showC2,setShowC2]=useState(false);
  const [pill,setPill]=useState<typeof PILLS[number]>("TODOS");
  const [quick,setQuick]=useState("");

  const filtered = useMemo(()=>{
    let list = BANCAS_DATA;
    if(pill==="CON VENTAS") list=list.filter(r=>r.venta>0);
    if(pill==="CON PREMIOS") list=list.filter(r=>r.premios>0);
    if(pill==="CON TICKETS PENDIENTES") list=list.filter(r=>r.tickets>0);
    if(pill==="CON VENTAS NETAS NEGATIVAS") list=list.filter(r=>r.neto<0);
    if(pill==="CON VENTAS NETAS POSITIVAS") list=list.filter(r=>r.neto>0);
    if(quick) list=list.filter(r=>r.ref.toLowerCase().includes(quick.toLowerCase())||r.codigo.toLowerCase().includes(quick.toLowerCase()));
    return list;
  },[pill,quick]);

  const tot = useMemo(()=>({
    tickets:   filtered.reduce((s,r)=>s+r.tickets,0),
    venta:     filtered.reduce((s,r)=>s+r.venta,0),
    comisiones:filtered.reduce((s,r)=>s+r.comisiones,0),
    comision2: filtered.reduce((s,r)=>s+r.comision2,0),
    premios:   filtered.reduce((s,r)=>s+r.premios,0),
    neto:      filtered.reduce((s,r)=>s+r.neto,0),
    final:     filtered.reduce((s,r)=>s+r.final,0),
  }),[filtered]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
        <Toggle label="Mostrar comisión #2" value={showC2} onChange={setShowC2}/>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm transition-colors">
          <RefreshCw size={13}/> VER VENTAS
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white text-sm font-semibold rounded-full hover:bg-[#16A34A] shadow-sm transition-colors">
          <FileDown size={13}/> CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm transition-colors">
          <FileText size={13}/> PDF
        </button>
      </div>
      {/* Total neto */}
      <div className="text-center">
        <span className="text-sm text-[#666]">Total: </span>
        <span className={`text-2xl font-bold px-4 py-1 rounded-xl border-2 ${tot.neto>=0?"border-sky-300 text-sky-700":"border-red-300 text-[#EF4444]"}`}>{fmt(tot.neto)}</span>
      </div>
      {/* Pill filters */}
      <div className="flex flex-wrap gap-2">
        {PILLS.map(p=>(
          <button key={p} onClick={()=>setPill(p)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${pill===p?"bg-[#4ECDC4] text-white border-[#4ECDC4]":"bg-white text-[#555] border-[#E5E5E0] hover:border-[#4ECDC4]"}`}>
            {p}
          </button>
        ))}
      </div>
      {/* Quick filter */}
      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtro rápido"
          className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
        {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
            {["Ref.","Código","Tickets","Venta","Comisiones",...(showC2?["Comisión #2"]:[]),"Premios","Neto","Final"].map(h=>(
              <th key={h} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.codigo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-3 py-2.5 font-medium text-[#333]">{r.ref}</td>
                <td className="px-3 py-2.5 font-mono text-[#4ECDC4] text-xs">{r.codigo}</td>
                <td className="px-3 py-2.5 text-[#555]">{r.tickets}</td>
                <td className="px-3 py-2.5 text-[#333]">{fmt(r.venta)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.comisiones)}</td>
                {showC2&&<td className="px-3 py-2.5 text-[#555]">{fmt(r.comision2)}</td>}
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.premios)}</td>
                <td className={`px-3 py-2.5 font-semibold ${r.neto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.neto)}</td>
                <td className={`px-3 py-2.5 font-semibold ${r.final>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.final)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-3 py-2.5 text-[#333]">Totales</td>
              <td className="px-3 py-2.5 text-[#999] text-xs">-</td>
              <td className="px-3 py-2.5">{tot.tickets}</td>
              <td className="px-3 py-2.5">{fmt(tot.venta)}</td>
              <td className="px-3 py-2.5">{fmt(tot.comisiones)}</td>
              {showC2&&<td className="px-3 py-2.5">{fmt(tot.comision2)}</td>}
              <td className="px-3 py-2.5">{fmt(tot.premios)}</td>
              <td className={`px-3 py-2.5 ${tot.neto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.neto)}</td>
              <td className={`px-3 py-2.5 ${tot.final>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.final)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length} entradas</p>
      </div>
    </div>
  );
}

// ─── Tab: Por sorteo ──────────────────────────────────────────────────────────
function TabPorSorteo() {
  const { zonas } = useBancasZonas();
  const [fi,setFi]=useState(today()); const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [perPage,setPerPage]=useState(20);
  const [quick,setQuick]=useState("");

  const filtered = useMemo(()=>{
    if(!quick) return SORTEOS_DATA;
    return SORTEOS_DATA.filter(r=>r.sorteo.toLowerCase().includes(quick.toLowerCase()));
  },[quick]);

  const tot = useMemo(()=>({
    vendido:   filtered.reduce((s,r)=>s+r.vendido,0),
    premios:   filtered.reduce((s,r)=>s+r.premios,0),
    comisiones:filtered.reduce((s,r)=>s+r.comisiones,0),
    neto:      filtered.reduce((s,r)=>s+r.neto,0),
  }),[filtered]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> VER VENTAS
        </button>
      </div>
      <div className="text-center">
        <span className="text-sm text-[#666]">Total neto: </span>
        <span className={`text-2xl font-bold px-4 py-1 rounded-xl border-2 ${tot.neto>=0?"border-sky-300 text-sky-700":"border-red-300 text-[#EF4444]"}`}>{fmt(tot.neto)}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#999]">Entradas por página</label>
          <select value={perPage} onChange={e=>setPerPage(+e.target.value)}
            className="px-2 py-1.5 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]">
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
          <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
            {["Sorteo","Total Vendido","Total premios","Total comisiones","Total neto"].map(h=>(
              <th key={h} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.slice(0,perPage).map((r,i)=>(
              <tr key={r.sorteo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-3 py-2.5 font-medium text-[#333]">{r.sorteo}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.vendido)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.premios)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.comisiones)}</td>
                <td className={`px-3 py-2.5 font-semibold ${r.neto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.neto)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-3 py-2.5 text-[#333]">Totales</td>
              <td className="px-3 py-2.5 font-bold">{fmt(tot.vendido)}</td>
              <td className="px-3 py-2.5 font-bold">{fmt(tot.premios)}</td>
              <td className="px-3 py-2.5 font-bold">{fmt(tot.comisiones)}</td>
              <td className={`px-3 py-2.5 font-bold ${tot.neto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.neto)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {Math.min(filtered.length,perPage)} de {filtered.length} entradas</p>
      </div>
    </div>
  );
}

// ─── Tab: Combinaciones ───────────────────────────────────────────────────────
function TabCombinaciones() {
  const { zonas, bancas } = useBancasZonas();
  const [fi,setFi]=useState(today()); const [ff,setFf]=useState(today());
  const [selSorteos,setSelSorteos]=useState<string[]>([]);
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [selBancas,setSelBancas]=useState<string[]>([]);
  const [quick,setQuick]=useState("");
  const [loading,setLoading]=useState(false);

  function handleSearch(){
    setLoading(true);
    setTimeout(()=>setLoading(false),800);
  }

  const filtered = useMemo(()=>{
    if(!quick) return COMBOS_DATA;
    return COMBOS_DATA.filter(r=>r.combo.toLowerCase().includes(quick.toLowerCase()));
  },[quick]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Sorteos" options={SORTEOS_LIST} value={selSorteos} onChange={setSelSorteos}/>
        <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
        <MultiSelect label="Bancas" options={bancas.map(b => b.name)} value={selBancas} onChange={setSelBancas}/>
        <button onClick={handleSearch} className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> VER VENTAS
        </button>
      </div>
      <div className="relative max-w-xs ml-auto">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtrado rápido"
          className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
        {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
      </div>
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
            {["Combinación","Total Vendido","Total comisiones","Total comisiones 2","Total premios","Balances"].map(h=>(
              <th key={h} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#4ECDC4] text-sm">
                <div className="flex items-center justify-center gap-2"><RefreshCw size={16} className="animate-spin"/> Cargando</div>
              </td></tr>
            ) : filtered.length===0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#999] text-sm">No hay datos</td></tr>
            ) : filtered.map((r,i)=>(
              <tr key={r.combo} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-3 py-2.5 font-medium text-[#333]">{r.combo}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.vendido)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.comis1)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.comis2)}</td>
                <td className="px-3 py-2.5 text-[#555]">{fmt(r.premios)}</td>
                <td className={`px-3 py-2.5 font-semibold ${r.balance>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {loading?0:filtered.length} de {COMBOS_DATA.length} entradas</p>
      </div>
    </div>
  );
}

// ─── Tab: Por zona ────────────────────────────────────────────────────────────
function TabPorZona() {
  const { zonas } = useBancasZonas();
  const [fi,setFi]=useState(today()); const [ff,setFf]=useState(today());
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [showC2,setShowC2]=useState(false);
  const [pill,setPill]=useState<"TODOS"|"CON VENTAS"|"CON PREMIOS"|"CON TICKETS PENDIENTES">("TODOS");
  const [quick,setQuick]=useState("");

  const filtered = useMemo(()=>{
    let list = ZONAS_DATA;
    if(pill==="CON VENTAS") list=list.filter(r=>r.venta>0);
    if(pill==="CON PREMIOS") list=list.filter(r=>r.premios>0);
    if(quick) list=list.filter(r=>r.nombre.toLowerCase().includes(quick.toLowerCase()));
    return list;
  },[pill,quick]);

  const tot = useMemo(()=>({
    p:    filtered.reduce((s,r)=>s+r.p,0),
    l:    filtered.reduce((s,r)=>s+r.l,0),
    w:    filtered.reduce((s,r)=>s+r.w,0),
    total:filtered.reduce((s,r)=>s+r.total,0),
    venta:filtered.reduce((s,r)=>s+r.venta,0),
    comis:filtered.reduce((s,r)=>s+r.comisiones,0),
    prems:filtered.reduce((s,r)=>s+r.premios,0),
    neto: filtered.reduce((s,r)=>s+r.neto,0),
    fin:  filtered.reduce((s,r)=>s+r.final,0),
  }),[filtered]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e=>setFi(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e=>setFf(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <MultiSelect label="Zonas" options={zonas.map(z => z.nombre)} value={selZonas} onChange={setSelZonas}/>
        <Toggle label="Mostrar comisión #2" value={showC2} onChange={setShowC2}/>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> VER VENTAS
        </button>
      </div>
      <div className="text-center">
        <span className="text-sm text-[#666]">Total: </span>
        <span className={`text-2xl font-bold px-4 py-1 rounded-xl border-2 ${tot.neto>=0?"border-sky-300 text-sky-700":"border-red-300 text-[#EF4444]"}`}>{fmt(tot.neto)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["TODOS","CON VENTAS","CON PREMIOS","CON TICKETS PENDIENTES"] as const).map(p=>(
          <button key={p} onClick={()=>setPill(p)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${pill===p?"bg-[#4ECDC4] text-white border-[#4ECDC4]":"bg-white text-[#555] border-[#E5E5E0] hover:border-[#4ECDC4]"}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="relative max-w-xs ml-auto">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="Filtrado rápido"
          className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
        {quick&&<button onClick={()=>setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
      </div>
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
            {["Nombre","P","L","W","Total","Venta","Comisiones","Premios","Neto","Caída","Final"].map(h=>(
              <th key={h} className="px-2 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={r.nombre} className={`border-b border-[#F0F0EB] ${i%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-2 py-2.5 font-medium text-[#333] whitespace-nowrap">{r.nombre} ({r.cnt})</td>
                <td className="px-2 py-2.5 text-[#555]">{r.p}</td>
                <td className="px-2 py-2.5 text-[#555]">{r.l}</td>
                <td className="px-2 py-2.5 text-[#555]">{r.w}</td>
                <td className="px-2 py-2.5 text-[#555]">{r.total}</td>
                <td className="px-2 py-2.5 text-[#333]">{fmt(r.venta)}</td>
                <td className="px-2 py-2.5 text-[#555]">{fmt(r.comisiones)}</td>
                <td className="px-2 py-2.5 text-[#555]">{fmt(r.premios)}</td>
                <td className={`px-2 py-2.5 font-semibold ${r.neto>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.neto)}</td>
                <td className="px-2 py-2.5 text-[#555]">{fmt(r.caida)}</td>
                <td className={`px-2 py-2.5 font-semibold ${r.final>=0?"bg-sky-50 text-sky-700":"bg-red-50 text-[#EF4444]"}`}>{fmt(r.final)}</td>
              </tr>
            ))}
            <tr className="bg-[#F0F7F5] font-bold border-t-2 border-[#4ECDC4]">
              <td className="px-2 py-2.5 text-[#333]">Totales</td>
              <td className="px-2 py-2.5">{tot.p}</td>
              <td className="px-2 py-2.5">{tot.l}</td>
              <td className="px-2 py-2.5">{tot.w}</td>
              <td className="px-2 py-2.5">{tot.total}</td>
              <td className="px-2 py-2.5">{fmt(tot.venta)}</td>
              <td className="px-2 py-2.5">{fmt(tot.comis)}</td>
              <td className="px-2 py-2.5">{fmt(tot.prems)}</td>
              <td className={`px-2 py-2.5 ${tot.neto>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.neto)}</td>
              <td className="px-2 py-2.5">$0.00</td>
              <td className={`px-2 py-2.5 ${tot.fin>=0?"text-sky-700":"text-[#EF4444]"}`}>{fmt(tot.fin)}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[#999]">Mostrando {filtered.length} de {ZONAS_DATA.length} entradas</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const TABS = ["General","Por sorteo","Combinaciones","Por zona"] as const;

export default function VentasBancas() {
  const [tab, setTab] = useState<typeof TABS[number]>("General");

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Reportes" />
      {/* Tabs */}
      <div className="border-b border-[#E5E5E0]">
        <div className="flex gap-0">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab===t?"text-[#4ECDC4] border-[#4ECDC4]":"text-[#999] border-transparent hover:text-[#666]"
              }`}>{t}</button>
          ))}
        </div>
      </div>
      {tab==="General"       && <TabGeneral/>}
      {tab==="Por sorteo"    && <TabPorSorteo/>}
      {tab==="Combinaciones" && <TabCombinaciones/>}
      {tab==="Por zona"      && <TabPorZona/>}
    </motion.div>
  );
}
