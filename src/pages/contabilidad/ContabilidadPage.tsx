import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, List, Plus, Search, Filter, Download,
  TrendingUp, TrendingDown, DollarSign, PieChart,
  ShoppingCart, Home, Users, Briefcase, BarChart3,
  ChevronUp, ChevronDown, Eye, Trash2, Edit2,
  Receipt, Wallet, CreditCard, ArrowUpRight, ArrowDownRight,
  Trophy, HandCoins, X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Categoria = "gastos"|"compras"|"rentas"|"empleados"|"inversion"|"premios"|"prestamos"|"resumen";
type ViewMode = "grid"|"list";

interface Transaccion {
  id:string; fecha:string; descripcion:string; categoria:Categoria;
  subcategoria:string; monto:number; tipo:"ingreso"|"egreso";
  estado:"pagado"|"pendiente"|"cancelado"; referencia:string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// Datos vacíos — se cargarán desde Supabase
const mockData: Transaccion[] = [
  {id:"1", fecha:"2026-06-16",descripcion:"Alquiler oficina central",   categoria:"rentas",    subcategoria:"Arriendo",     monto:2500, tipo:"egreso", estado:"pagado",    referencia:"RNT-001"},
  {id:"2", fecha:"2026-06-15",descripcion:"Compra impresoras térmicas", categoria:"compras",   subcategoria:"Equipos",      monto:1200, tipo:"egreso", estado:"pagado",    referencia:"CMP-012"},
  {id:"3", fecha:"2026-06-15",descripcion:"Salario vendedor zona norte",categoria:"empleados", subcategoria:"Salarios",     monto:800,  tipo:"egreso", estado:"pagado",    referencia:"EMP-003"},
  {id:"4", fecha:"2026-06-14",descripcion:"Inversión sistema nuevo",    categoria:"inversion", subcategoria:"Tecnología",   monto:5000, tipo:"egreso", estado:"pendiente", referencia:"INV-001"},
  {id:"5", fecha:"2026-06-14",descripcion:"Electricidad local",         categoria:"gastos",    subcategoria:"Servicios",    monto:350,  tipo:"egreso", estado:"pagado",    referencia:"GST-015"},
  {id:"6", fecha:"2026-06-13",descripcion:"Internet empresarial",       categoria:"gastos",    subcategoria:"Servicios",    monto:180,  tipo:"egreso", estado:"pagado",    referencia:"GST-016"},
  {id:"7", fecha:"2026-06-13",descripcion:"Papel de tickets (x20)",     categoria:"compras",   subcategoria:"Consumibles",  monto:95,   tipo:"egreso", estado:"pagado",    referencia:"CMP-013"},
  {id:"8", fecha:"2026-06-12",descripcion:"Salario supervisor",         categoria:"empleados", subcategoria:"Salarios",     monto:1500, tipo:"egreso", estado:"pendiente", referencia:"EMP-004"},
  {id:"9", fecha:"2026-06-12",descripcion:"Gasolina vehículo empresa",  categoria:"gastos",    subcategoria:"Transporte",   monto:220,  tipo:"egreso", estado:"pagado",    referencia:"GST-017"},
  {id:"10",fecha:"2026-06-11",descripcion:"Tinta impresora",            categoria:"compras",   subcategoria:"Consumibles",  monto:75,   tipo:"egreso", estado:"pagado",    referencia:"CMP-014"},
  {id:"11",fecha:"2026-06-11",descripcion:"Alquiler local zona sur",    categoria:"rentas",    subcategoria:"Arriendo",     monto:1800, tipo:"egreso", estado:"pagado",    referencia:"RNT-002"},
  {id:"12",fecha:"2026-06-10",descripcion:"Seguro de equipos",          categoria:"gastos",    subcategoria:"Seguros",      monto:450,  tipo:"egreso", estado:"pagado",    referencia:"GST-018"},
  {id:"13",fecha:"2026-06-10",descripcion:"Capacitación personal",      categoria:"empleados", subcategoria:"Capacitación", monto:600,  tipo:"egreso", estado:"pendiente", referencia:"EMP-005"},
  {id:"14",fecha:"2026-06-09",descripcion:"Nuevo servidor cloud",       categoria:"inversion", subcategoria:"Tecnología",   monto:3500, tipo:"egreso", estado:"pagado",    referencia:"INV-002"},
  {id:"15",fecha:"2026-06-09",descripcion:"Limpieza oficina mensual",   categoria:"gastos",    subcategoria:"Mantenimiento",monto:120,  tipo:"egreso", estado:"pagado",    referencia:"GST-019"},
  // Premios
  {id:"p1",fecha:"2026-06-16",descripcion:"Premio Directo #345 - MWR-0001",categoria:"premios",subcategoria:"Directo",  monto:2400, tipo:"egreso",estado:"pagado",   referencia:"PRE-001"},
  {id:"p2",fecha:"2026-06-16",descripcion:"Premio Pale #12-45 - MWR-0003",  categoria:"premios",subcategoria:"Pale",    monto:8000, tipo:"egreso",estado:"pagado",   referencia:"PRE-002"},
  {id:"p3",fecha:"2026-06-15",descripcion:"Premio Directo #711 - MWR-0005", categoria:"premios",subcategoria:"Directo", monto:4800, tipo:"egreso",estado:"pagado",   referencia:"PRE-003"},
  {id:"p4",fecha:"2026-06-14",descripcion:"Premio Tripleta #2-5-9 - MWR-0002",categoria:"premios",subcategoria:"Tripleta",monto:15000,tipo:"egreso",estado:"pagado", referencia:"PRE-004"},
  {id:"p5",fecha:"2026-06-13",descripcion:"Premio Directo #007 - MWR-0007", categoria:"premios",subcategoria:"Directo", monto:3600, tipo:"egreso",estado:"pendiente",referencia:"PRE-005"},
  // Préstamos
  {id:"l1",fecha:"2026-06-15",descripcion:"Préstamo a MWR-0001 MATADOR-SPORT",categoria:"prestamos",subcategoria:"Efectivo",monto:5000,tipo:"egreso",estado:"pendiente",referencia:"PRE-L001"},
  {id:"l2",fecha:"2026-06-12",descripcion:"Préstamo a MWR-0004 MMW RD 04",    categoria:"prestamos",subcategoria:"Comisión",monto:2000,tipo:"egreso",estado:"pagado",   referencia:"PRE-L002"},
  {id:"l3",fecha:"2026-06-10",descripcion:"Préstamo a MWR-0009 MMW RD 09",    categoria:"prestamos",subcategoria:"Efectivo",monto:3500,tipo:"egreso",estado:"pendiente",referencia:"PRE-L003"},
];

const TRANSACTIONS: Transaccion[] = []; // mockData limpiado — datos reales vendrán de Supabase

// ─── Category Config ──────────────────────────────────────────────────────────

type CatConfig = { key:Categoria; label:string; icon:React.ElementType; color:string; bg:string; gradient:string; };
const categorias: CatConfig[] = [
  {key:"resumen",   label:"Resumen",    icon:BarChart3,    color:"text-indigo-600",  bg:"bg-indigo-50",  gradient:"#6366F1,#8B5CF6"},
  {key:"gastos",    label:"Gastos",     icon:Receipt,      color:"text-red-600",     bg:"bg-red-50",     gradient:"#F87171,#EF4444"},
  {key:"compras",   label:"Compras",    icon:ShoppingCart, color:"text-blue-600",    bg:"bg-blue-50",    gradient:"#60A5FA,#3B82F6"},
  {key:"rentas",    label:"Rentas",     icon:Home,         color:"text-amber-600",   bg:"bg-amber-50",   gradient:"#FBBF24,#F59E0B"},
  {key:"empleados", label:"Empleados",  icon:Users,        color:"text-teal-600",    bg:"bg-teal-50",    gradient:"#2DD4BF,#14B8A6"},
  {key:"inversion", label:"Inversión",  icon:Briefcase,    color:"text-purple-600",  bg:"bg-purple-50",  gradient:"#A78BFA,#8B5CF6"},
  {key:"premios",   label:"Premios",    icon:Trophy,       color:"text-yellow-600",  bg:"bg-yellow-50",  gradient:"#FBBF24,#F59E0B"},
  {key:"prestamos", label:"Préstamos",  icon:HandCoins,    color:"text-emerald-600", bg:"bg-emerald-50", gradient:"#34D399,#059669"},
];

function fmt(n:number){ return `$${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function statusBadge(s:string){
  if(s==="pagado")    return "bg-green-100 text-green-700 border border-green-200";
  if(s==="pendiente") return "bg-amber-100 text-amber-700 border border-amber-200";
  if(s==="activo")    return "bg-teal-100 text-teal-700 border border-teal-200";
  return "bg-red-100 text-red-700 border border-red-200";
}

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportCSV(data: Transaccion[], tab: string){
  const headers = ["ID","Fecha","Descripción","Categoría","Subcategoría","Monto","Tipo","Estado","Referencia"];
  const rows = data.map(t=>[t.id,t.fecha,`"${t.descripcion}"`,t.categoria,t.subcategoria,t.monto,t.tipo,t.estado,t.referencia]);
  const csv = [headers, ...rows].map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`contabilidad-${tab}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─── Nueva Entrada Modal ──────────────────────────────────────────────────────
function NuevaEntradaModal({ onSave, onClose }: {onSave:(t:Transaccion)=>void; onClose:()=>void}) {
  const [form, setForm] = useState({
    descripcion:"", categoria:"gastos" as Omit<Categoria,"resumen">,
    subcategoria:"", monto:0, tipo:"egreso" as "ingreso"|"egreso",
    estado:"pagado" as "pagado"|"pendiente"|"cancelado",
    fecha:new Date().toISOString().split("T")[0], referencia:"",
  });
  const valid = form.descripcion.trim().length>0 && form.monto>0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.15}}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#333]">Nueva Entrada Contable</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} className="text-[#666]"/></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-[#999] font-medium">Descripción *</label>
            <input value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))} placeholder="Describe el movimiento..."
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400"/>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Categoría</label>
            <select value={form.categoria as string} onChange={e=>setForm(p=>({...p,categoria:e.target.value as any}))}
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400 bg-white">
              {categorias.filter(c=>c.key!=="resumen").map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Subcategoría</label>
            <input value={form.subcategoria} onChange={e=>setForm(p=>({...p,subcategoria:e.target.value}))} placeholder="Ej: Servicios"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400"/>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Monto (RD$) *</label>
            <input type="number" value={form.monto||""} onChange={e=>setForm(p=>({...p,monto:parseFloat(e.target.value)||0}))} placeholder="0.00"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400"/>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Fecha</label>
            <input type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400"/>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Tipo</label>
            <div className="flex gap-2 mt-1">
              {(["egreso","ingreso"] as const).map(t=>(
                <button key={t} onClick={()=>setForm(p=>({...p,tipo:t}))}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${form.tipo===t?"bg-teal-50 border-teal-400 text-teal-700":"border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {t==="egreso"?"↑ Egreso":"↓ Ingreso"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Estado</label>
            <select value={form.estado} onChange={e=>setForm(p=>({...p,estado:e.target.value as any}))}
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400 bg-white">
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#999] font-medium">Referencia</label>
            <input value={form.referencia} onChange={e=>setForm(p=>({...p,referencia:e.target.value}))} placeholder="Ej: GST-020"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-teal-400"/>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-[#E5E5E0] rounded-xl hover:bg-gray-50">Cancelar</button>
          <button onClick={()=>valid&&onSave({id:`t${Date.now()}`,fecha:form.fecha,descripcion:form.descripcion,categoria:form.categoria as Categoria,subcategoria:form.subcategoria,monto:form.monto,tipo:form.tipo,estado:form.estado,referencia:form.referencia||(Date.now().toString().slice(-6))})} disabled={!valid}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${valid?"bg-teal-500 text-white hover:bg-teal-600":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Guardar Entrada
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContabilidadPage() {
  const [rows, setRows] = useState<Transaccion[]>(TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<Categoria>("resumen");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"fecha"|"monto"|"descripcion">("fecha");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(()=>{
    let data = activeTab==="resumen" ? rows : rows.filter(t=>t.categoria===activeTab);
    if(search.trim()){
      const q=search.toLowerCase();
      data=data.filter(t=>t.descripcion.toLowerCase().includes(q)||t.referencia.toLowerCase().includes(q)||t.subcategoria.toLowerCase().includes(q));
    }
    return [...data].sort((a,b)=>{
      let cmp=0;
      if(sortField==="monto") cmp=a.monto-b.monto;
      else if(sortField==="fecha") cmp=a.fecha.localeCompare(b.fecha);
      else cmp=a.descripcion.localeCompare(b.descripcion);
      return sortDir==="asc"?cmp:-cmp;
    });
  },[rows,activeTab,search,sortField,sortDir]);

  function toggleSort(f:typeof sortField){ if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortField(f);setSortDir("desc");} }

  const stats = useMemo(()=>{
    const data = activeTab==="resumen" ? rows : rows.filter(t=>t.categoria===activeTab);
    const total=data.reduce((s,t)=>s+t.monto,0);
    const pagado=data.filter(t=>t.estado==="pagado").reduce((s,t)=>s+t.monto,0);
    const pendiente=data.filter(t=>t.estado==="pendiente").reduce((s,t)=>s+t.monto,0);
    return{total,pagado,pendiente,count:data.length};
  },[rows,activeTab]);

  const catConfig=categorias.find(c=>c.key===activeTab)!;

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#333]">Contabilidad</h1><p className="text-sm text-[#999] mt-0.5">{rows.length} registros totales</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>exportCSV(filtered,activeTab)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={15}/> Exportar CSV
          </button>
          <button onClick={()=>setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all"
            style={{background:"linear-gradient(135deg,#14B8A6,#0EA5E9)"}}>
            <Plus size={15}/> Nueva Entrada
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categorias.map(cat=>{
          const CatIcon=cat.icon; const isActive=activeTab===cat.key;
          return(
            <button key={cat.key} onClick={()=>setActiveTab(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive?"text-white shadow-md scale-[1.02]":`${cat.color} ${cat.bg} hover:scale-[1.01] border border-transparent`}`}
              style={isActive?{background:`linear-gradient(135deg,${cat.gradient})`}:{}}>
              <CatIcon size={14}/>{cat.label}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:"Total",    value:fmt(stats.total),    icon:Wallet,     sub:`${stats.count} registros`,change:"+2.4%",up:false},
          {label:"Pagado",   value:fmt(stats.pagado),   icon:CreditCard, sub:"Liquidado",                change:"+5.1%",up:true},
          {label:"Pendiente",value:fmt(stats.pendiente),icon:DollarSign, sub:"Por liquidar",             change:"-1.2%",up:false},
          {label:"Promedio", value:fmt(stats.count?stats.total/stats.count:0),icon:PieChart,sub:"Por registro",change:"+0.8%",up:true},
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06,duration:0.25}}
            className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catConfig.bg} ${catConfig.color}`}><s.icon size={16}/></div>
              <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${s.up?"text-green-600":"text-red-500"}`}>
                {s.up?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>}{s.change}
              </span>
            </div>
            <p className="text-xl font-bold text-[#1E293B] leading-tight">{s.value}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{s.label}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Resumen breakdown */}
      {activeTab==="resumen"&&(
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categorias.filter(c=>c.key!=="resumen").map(cat=>{
            const CatIcon=cat.icon;
            const total=rows.filter(t=>t.categoria===cat.key).reduce((s,t)=>s+t.monto,0);
            const pct=stats.total>0?Math.round((total/stats.total)*100):0;
            return(
              <button key={cat.key} onClick={()=>setActiveTab(cat.key)}
                className="bg-white rounded-xl border border-[#E5E5E0] p-4 text-left hover:border-teal-300 hover:shadow-md transition-all group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}><CatIcon size={14}/></div>
                <p className="text-base font-bold text-[#1E293B]">{fmt(total)}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{cat.label}</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${pct}%`,background:`linear-gradient(90deg,${cat.gradient})`}}/>
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1">{pct}% del total</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar descripción, referencia..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 bg-white"/>
        </div>
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          {(["list","grid"] as ViewMode[]).map(v=>(
            <button key={v} onClick={()=>setViewMode(v)}
              className={`w-8 h-7 rounded-lg flex items-center justify-center transition-all ${viewMode===v?"bg-white shadow text-teal-600":"text-gray-400 hover:text-gray-600"}`}>
              {v==="list"?<List size={14}/>:<LayoutGrid size={14}/>}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{filtered.length} registros</span>
      </div>

      {/* Table / Grid */}
      <AnimatePresence mode="wait">
        {viewMode==="list"?(
          <motion.div key="list" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="bg-white rounded-2xl border border-[#E5E5E0] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_90px_100px_80px] gap-4 px-5 py-3 bg-[#F8FAFC] border-b border-[#E5E5E0] text-xs font-semibold text-[#64748B] uppercase tracking-wide">
              <button className="flex items-center gap-1 text-left hover:text-teal-600 transition-colors" onClick={()=>toggleSort("descripcion")}>
                Descripción {sortField==="descripcion"&&(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>)}
              </button>
              <button className="flex items-center gap-1 hover:text-teal-600 transition-colors justify-end" onClick={()=>toggleSort("monto")}>
                Monto {sortField==="monto"&&(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>)}
              </button>
              <span className="text-center">Estado</span>
              <button className="flex items-center gap-1 justify-end hover:text-teal-600 transition-colors" onClick={()=>toggleSort("fecha")}>
                Fecha {sortField==="fecha"&&(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>)}
              </button>
              <span className="text-right">Acciones</span>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {filtered.length===0?(
                <div className="py-12 text-center text-gray-400 text-sm">No hay registros</div>
              ):filtered.map((t,i)=>{
                const cat=categorias.find(c=>c.key===t.categoria)!;
                const CatIcon=cat?.icon??Receipt;
                return(
                  <motion.div key={t.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.02,duration:0.2}}
                    className="grid grid-cols-[1fr_120px_90px_100px_80px] gap-4 px-5 py-3.5 items-center hover:bg-[#F8FAFC] group transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cat?.bg??""} ${cat?.color??""}`}><CatIcon size={13}/></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1E293B] truncate">{t.descripcion}</p>
                        <p className="text-[11px] text-[#94A3B8]">{t.referencia} · {t.subcategoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      {t.tipo==="egreso"?<TrendingDown size={13} className="text-red-400"/>:<TrendingUp size={13} className="text-green-500"/>}
                      <span className={`text-sm font-bold ${t.tipo==="egreso"?"text-red-600":"text-green-600"}`}>{t.tipo==="egreso"?"-":"+"}{fmt(t.monto)}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(t.estado)}`}>{t.estado}</span>
                    </div>
                    <p className="text-xs text-[#64748B] text-right">{t.fecha}</p>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 rounded flex items-center justify-center text-blue-400 hover:bg-blue-50"><Eye size={12}/></button>
                      <button className="w-6 h-6 rounded flex items-center justify-center text-teal-400 hover:bg-teal-50"><Edit2 size={12}/></button>
                      <button onClick={()=>setRows(p=>p.filter(r=>r.id!==t.id))} className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={12}/></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-t border-[#E5E5E0]">
              <span className="text-xs text-[#64748B]">{filtered.length} de {rows.length} registros</span>
              <span className="text-sm font-bold text-[#1E293B]">Total: {fmt(filtered.reduce((s,t)=>s+t.monto,0))}</span>
            </div>
          </motion.div>
        ):(
          <motion.div key="grid" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length===0?(
              <div className="col-span-3 py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-[#E5E5E0]">No hay registros</div>
            ):filtered.map((t,i)=>{
              const cat=categorias.find(c=>c.key===t.categoria)!;
              const CatIcon=cat?.icon??Receipt;
              return(
                <motion.div key={t.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.03,duration:0.2}}
                  className="bg-white rounded-2xl border border-[#E5E5E0] shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-1" style={{background:`linear-gradient(90deg,${cat?.gradient??"#6366F1,#8B5CF6"})`}}/>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat?.bg??""} ${cat?.color??""}`}><CatIcon size={15}/></div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(t.estado)}`}>{t.estado}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1E293B] leading-tight mb-1">{t.descripcion}</p>
                    <p className="text-[11px] text-[#94A3B8] mb-3">{t.referencia} · {t.subcategoria}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-lg font-black ${t.tipo==="egreso"?"text-red-600":"text-green-600"}`}>{t.tipo==="egreso"?"-":"+"}{fmt(t.monto)}</p>
                        <p className="text-[10px] text-[#94A3B8]">{t.fecha}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-50"><Eye size={13}/></button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-teal-400 hover:bg-teal-50"><Edit2 size={13}/></button>
                        <button onClick={()=>setRows(p=>p.filter(r=>r.id!==t.id))} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13}/></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nueva Entrada Modal */}
      <AnimatePresence>
        {showModal&&(
          <NuevaEntradaModal key="modal"
            onSave={t=>{setRows(p=>[t,...p]);setShowModal(false);}}
            onClose={()=>setShowModal(false)}/>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
