import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  UserPlus, Users, ArrowDownCircle, CreditCard,
  XCircle, Ticket, BarChart3, Building2, ChevronDown,
  PlusCircle, Check, Globe2, CheckCircle2, Trophy,
  TrendingUp, RefreshCcw, AlertCircle,
} from "lucide-react";

// ─── NMV Bancas ───────────────────────────────────────────────────────────────
const NMV_BANCAS = [
  { id: "b01", name: "NMV RD 01", code: "NMV-0001" },
  { id: "b02", name: "NMV RD 02", code: "NMV-0002" },
  { id: "b03", name: "NMV RD 03", code: "NMV-0003" },
  { id: "b04", name: "NMV RD 04", code: "NMV-0004" },
  { id: "b05", name: "NMV RD 05", code: "NMV-0005" },
  { id: "b06", name: "NMV RD 06", code: "NMV-0006" },
  { id: "b07", name: "NMV RD 07", code: "NMV-0007" },
  { id: "b08", name: "NMV RD 08", code: "NMV-0008" },
  { id: "b09", name: "NMV RD 09", code: "NMV-0009" },
  { id: "b10", name: "NMV RD 10", code: "NMV-0010" },
  { id: "b11", name: "NMV RD 11", code: "NMV-0011" },
  { id: "b12", name: "NMV RD 12", code: "NMV-0012" },
  { id: "b13", name: "NMV RD 13", code: "NMV-0013" },
];

// ─── Per-Banca mock data ───────────────────────────────────────────────────────
const BANCA_CLIENTS: Record<string, {id:string;name:string;phone:string;balance:number;status:string}[]> = {
  b01: [
    {id:"C001",name:"Juan Pérez",   phone:"+1-809-555-0001",balance:250.0, status:"Activo"},
    {id:"C002",name:"María García", phone:"+1-809-555-0002",balance:80.5,  status:"Activo"},
    {id:"C003",name:"Carlos López", phone:"+1-809-555-0003",balance:0.0,   status:"Inactivo"},
  ],
  b02: [
    {id:"C011",name:"Ana Martínez", phone:"+1-809-555-0011",balance:410.0,status:"Activo"},
    {id:"C012",name:"Luis Rodríguez",phone:"+1-809-555-0012",balance:95.0, status:"Activo"},
  ],
  b03: [
    {id:"C021",name:"Rosa Díaz",    phone:"+1-809-555-0021",balance:180.0,status:"Activo"},
    {id:"C022",name:"Pedro Ruiz",   phone:"+1-809-555-0022",balance:0.0,  status:"Inactivo"},
    {id:"C023",name:"Sofía Cruz",   phone:"+1-809-555-0023",balance:620.0,status:"Activo"},
  ],
};
const getClients = (id: string) => BANCA_CLIENTS[id] ?? [
  {id:"C099",name:"(Sin clientes demo)",phone:"—",balance:0,status:"—"}
];

// ─── Menu sections ────────────────────────────────────────────────────────────
const SECTIONS = [
  { route: "/movil",                  label: "Ver todo",          icon: Globe2,          color: "#6366F1" },
  { route: "/movil/crear-ticket",     label: "Crear Ticket",      icon: PlusCircle,      color: "#0EA5E9", highlight: true },
  { route: "/movil/crear-cliente",    label: "Crear cliente",     icon: UserPlus,        color: "#4ECDC4" },
  { route: "/movil/clientes",         label: "Lista de clientes", icon: Users,           color: "#3B82F6" },
  { route: "/movil/retiro",           label: "Retiro",            icon: ArrowDownCircle, color: "#F59E0B" },
  { route: "/movil/recargas",         label: "Recargas",          icon: CreditCard,      color: "#10B981" },
  { route: "/movil/cancelar-recarga", label: "Cancelar recarga",  icon: XCircle,         color: "#EF4444" },
  { route: "/movil/tickets",          label: "Tickets",           icon: Ticket,          color: "#8B5CF6" },
  { route: "/movil/premios",          label: "Premios",           icon: Trophy,          color: "#F59E0B" },
  { route: "/movil/reporte",          label: "Ver reporte",       icon: BarChart3,       color: "#F97316" },
];

export default function MovilPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedBancaId, setSelectedBancaId] = useState<string>(NMV_BANCAS[0].id);
  const [showBancaDropdown, setShowBancaDropdown] = useState(false);

  const selectedBanca = NMV_BANCAS.find(b => b.id === selectedBancaId) ?? NMV_BANCAS[0];
  const active = SECTIONS.find((s) => s.route === location.pathname) ?? SECTIONS[0];
  const ActiveIcon = active.icon;

  const handleSectionClick = (route: string) => {
    if (route === "/movil/crear-ticket") {
      navigate(`/tickets/create?banca=${selectedBancaId}`);
    } else {
      navigate(route);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Módulo Móvil</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Gestión de clientes, recargas y retiros del portal móvil
          </p>
        </div>
      </div>

      {/* ── Banca Selector ──────────────────────────────────────────────── */}
      <div className="mb-5 relative">
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#14B8A6]/10">
            <Building2 size={20} className="text-[#14B8A6]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#999999] font-semibold uppercase tracking-wider">Banca activa</p>
            <p className="text-[15px] font-bold text-[#333333]">{selectedBanca.name}</p>
            <p className="text-xs text-[#999999]">{selectedBanca.code}</p>
          </div>
          <button
            onClick={() => setShowBancaDropdown(!showBancaDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-[0_2px_10px_rgba(20,184,166,0.4)] hover:shadow-[0_4px_16px_rgba(20,184,166,0.5)] hover:scale-105 active:scale-95 transition-all"
            style={{background:"linear-gradient(135deg,#14B8A6,#0EA5E9)"}}
          >
            <Building2 size={14}/>
            Cambiar Banca
            <ChevronDown size={13} className={`transition-transform ${showBancaDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {showBancaDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E5E5E0] shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto"
          >
            {NMV_BANCAS.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBancaId(b.id); setShowBancaDropdown(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-[#F0F0EB] last:border-b-0 ${
                  b.id === selectedBancaId
                    ? 'bg-[#14B8A6]/5 text-[#0F766E] font-semibold'
                    : 'text-[#333333] hover:bg-[#F8F8F5]'
                }`}
              >
                <div>
                  <span className="font-medium">{b.name}</span>
                  <span className="ml-2 text-[11px] text-[#999999]">{b.code}</span>
                </div>
                {b.id === selectedBancaId && <Check size={14} className="text-[#14B8A6]" />}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Left: Nav ─────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = location.pathname === s.route || (s.route === "/movil/crear-ticket" && false);
              return (
                <button
                  key={s.route}
                  onClick={() => handleSectionClick(s.route)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-[#F0F0EB] last:border-b-0 ${
                    s.highlight
                      ? 'text-white'
                      : isActive
                      ? 'text-white'
                      : 'text-[#555555] hover:bg-[#F8F8F5]'
                  }`}
                  style={s.highlight || isActive ? { background: s.color } : {}}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{s.label}</span>
                  {s.highlight && (
                    <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-full font-bold">NUEVO</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Content ────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F0F0EB]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${active.color}20` }}
              >
                <ActiveIcon size={20} style={{ color: active.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#333333]">{active.label}</h2>
                <p className="text-xs text-[#999999]">
                  {selectedBanca.name} · {selectedBanca.code}
                </p>
              </div>
            </div>

            {/* Content per section */}
            {(location.pathname === "/movil") && <VerTodo />}
            {location.pathname === "/movil/crear-cliente" && <CrearCliente bancaName={selectedBanca.name} bancaId={selectedBancaId}/>}
            {location.pathname === "/movil/clientes" && <ListaClientes bancaId={selectedBancaId} bancaName={selectedBanca.name} />}
            {location.pathname === "/movil/retiro" && <Retiro bancaName={selectedBanca.name} />}
            {location.pathname === "/movil/recargas" && <Recargas bancaName={selectedBanca.name} />}
            {location.pathname === "/movil/cancelar-recarga" && <CancelarRecarga />}
      {location.pathname === "/movil/tickets" && <TicketsList bancaName={selectedBanca.name} />}
      {location.pathname === "/movil/premios" && <Premios bancaId={selectedBancaId} bancaName={selectedBanca.name} />}
      {location.pathname === "/movil/reporte" && <Reporte bancaId={selectedBancaId} bancaName={selectedBanca.name} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormField({ label, placeholder, type = "text", defaultValue }: {
  label: string; placeholder: string; type?: string; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#555555] mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full px-3 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#4ECDC4] transition-colors" />
    </div>
  );
}

function SaveBtn({ label = "Guardar", color = "#4ECDC4" }: { label?: string; color?: string }) {
  return (
    <button type="button" className="px-6 py-2.5 text-white text-sm font-medium rounded-full transition-colors"
      style={{ background: color, boxShadow: `0 2px 8px ${color}50` }}>
      {label}
    </button>
  );
}

function CrearCliente({ bancaName, bancaId }: { bancaName: string; bancaId: string }) {
  const [nombre,setNombre]=useState("");
  const [apellido,setApellido]=useState("");
  const [telefono,setTelefono]=useState("");
  const [email,setEmail]=useState("");
  const [pin,setPin]=useState("");
  const [saved,setSaved]=useState(false);
  const [errors,setErrors]=useState<string[]>([]);

  function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    const errs:string[]=[];
    if(!nombre.trim()) errs.push("Nombre requerido");
    if(!telefono.trim()) errs.push("Teléfono requerido");
    if(pin.length!==4||isNaN(Number(pin))) errs.push("PIN debe ser 4 dígitos");
    if(errs.length){setErrors(errs);return;}
    setErrors([]);
    setSaved(true);
    setTimeout(()=>{
      setSaved(false);
      setNombre("");setApellido("");setTelefono("");setEmail("");setPin("");
    },3000);
    console.log("Nuevo cliente:",{bancaId,nombre,apellido,telefono,email,pin});
  }

  const inputCls="w-full px-3 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all";

  if(saved) return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
      className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-emerald-500"/>
      </div>
      <p className="text-lg font-bold text-[#333]">¡Cliente creado!</p>
      <p className="text-sm text-[#666]">El cliente ha sido registrado en <strong>{bancaName}</strong></p>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="text-xs text-[#14B8A6] font-semibold mb-1">📍 Banca: {bancaName}</div>
      <AnimatePresence>
        {errors.length>0&&(
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
            className="p-3 bg-red-50 border border-red-200 rounded-xl">
            {errors.map(e=><p key={e} className="text-xs text-red-600 font-medium">• {e}</p>)}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Nombre *</label>
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre del cliente" className={inputCls}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Apellido</label>
          <input value={apellido} onChange={e=>setApellido(e.target.value)} placeholder="Apellido" className={inputCls}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Teléfono *</label>
          <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="+1 (809) 000-0000" type="tel" className={inputCls}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@ejemplo.com" type="email" className={inputCls}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#555] mb-1.5">PIN (4 dígitos) *</label>
          <input value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} placeholder="••••" type="password" maxLength={4} className={inputCls}/>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit"
          className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_14px_rgba(78,205,196,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          style={{background:"linear-gradient(135deg,#4ECDC4,#0EA5E9)"}}>
          <UserPlus size={15}/>
          Crear Cliente
        </button>
      </div>
    </form>
  );
}

const MOCK_TRANSACTIONS = [
  { id:"T001", tipo:"Recarga",  cliente:"Juan Pérez",    banca:"NMV RD 01", monto:150,  status:"Completado", time:"09:12" },
  { id:"T002", tipo:"Retiro",   cliente:"María García",  banca:"NMV RD 01", monto:80,   status:"Completado", time:"09:18" },
  { id:"T003", tipo:"Recarga",  cliente:"Ana Martínez",  banca:"NMV RD 02", monto:300,  status:"Pendiente",  time:"09:35" },
  { id:"T004", tipo:"Ticket",   cliente:"Luis Rodríguez",banca:"NMV RD 02", monto:25,   status:"Completado", time:"10:02" },
  { id:"T005", tipo:"Recarga",  cliente:"Rosa Díaz",     banca:"NMV RD 03", monto:200,  status:"Completado", time:"10:15" },
  { id:"T006", tipo:"Retiro",   cliente:"Sofía Cruz",    banca:"NMV RD 03", monto:120,  status:"Error",      time:"10:47" },
  { id:"T007", tipo:"Ticket",   cliente:"Juan Pérez",    banca:"NMV RD 01", monto:50,   status:"Completado", time:"11:03" },
  { id:"T008", tipo:"Recarga",  cliente:"Pedro Ruiz",    banca:"NMV RD 03", monto:450,  status:"Completado", time:"11:20" },
];

function VerTodo() {
  const [tab, setTab] = useState<"todos"|"clientes"|"recargas"|"retiros"|"tickets">("todos");
  const totalClientes = Object.values(BANCA_CLIENTS).flat().length;
  const clientesActivos = Object.values(BANCA_CLIENTS).flat().filter(c=>c.status==="Activo").length;
  const totalRecargas = MOCK_TRANSACTIONS.filter(t=>t.tipo==="Recarga").reduce((s,t)=>s+t.monto,0);
  const totalRetiros = MOCK_TRANSACTIONS.filter(t=>t.tipo==="Retiro").reduce((s,t)=>s+t.monto,0);

  const TABS = [
    { key:"todos",    label:"Todos",    color:"#6366F1" },
    { key:"clientes", label:"Clientes", color:"#3B82F6" },
    { key:"recargas", label:"Recargas", color:"#10B981" },
    { key:"retiros",  label:"Retiros",  color:"#F59E0B" },
    { key:"tickets",  label:"Tickets",  color:"#8B5CF6" },
  ] as const;

  const filtered = tab === "todos" ? MOCK_TRANSACTIONS
    : tab === "clientes" ? Object.values(BANCA_CLIENTS).flat().map(c=>({...c, tipo:"Cliente"})) as unknown as typeof MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter(t => t.tipo.toLowerCase() === tab.slice(0,-1) || t.tipo.toLowerCase() === tab);

  const statusColor = (s:string)=> s==="Completado"?"bg-emerald-100 text-emerald-700":s==="Pendiente"?"bg-amber-100 text-amber-700":"bg-red-100 text-red-700";
  const tipoColor = (t:string)=> t==="Recarga"?"text-emerald-600 bg-emerald-50":t==="Retiro"?"text-amber-600 bg-amber-50":"text-violet-600 bg-violet-50";

  return (
    <div className="space-y-4 -m-2">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users,         label:"Total Clientes",   value:String(totalClientes),       sub:`${clientesActivos} activos`,      bg:"bg-blue-50",    ic:"text-blue-500"  },
          { icon: CreditCard,    label:"Total Recargas",   value:`$${totalRecargas}`,          sub:"hoy",                             bg:"bg-emerald-50", ic:"text-emerald-500"},
          { icon: ArrowDownCircle,label:"Total Retiros",   value:`$${totalRetiros}`,           sub:"hoy",                             bg:"bg-amber-50",   ic:"text-amber-500" },
          { icon: Ticket,        label:"Tickets Móvil",    value:String(MOCK_TRANSACTIONS.filter(t=>t.tipo==="Ticket").length), sub:"hoy", bg:"bg-violet-50",  ic:"text-violet-500"},
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E5E0] p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon size={16} className={s.ic}/>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-[#222] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#888] leading-tight mt-0.5">{s.label}</p>
              <p className="text-[10px] text-[#BBB]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-0.5" style={{scrollbarWidth:"none"}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              tab===t.key ? "text-white border-transparent" : "bg-white border-[#E5E5E0] text-[#666] hover:border-[#CCC]"
            }`}
            style={tab===t.key ? {background:t.color} : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "clientes" ? (
        <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F8F5]">
              {["ID","Nombre","Teléfono","Balance","Estado","Banca"].map(h=>(
                <th key={h} className="text-left px-3 py-2.5 text-[11px] font-bold text-[#666] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {Object.entries(BANCA_CLIENTS).flatMap(([bid, clients])=>
                clients.map(c=>(
                  <tr key={c.id} className="border-t border-[#F0F0EB] hover:bg-[#FAFAF8]">
                    <td className="px-3 py-2 font-mono text-xs text-[#999]">{c.id}</td>
                    <td className="px-3 py-2 font-medium text-[#333]">{c.name}</td>
                    <td className="px-3 py-2 text-[#555]">{c.phone}</td>
                    <td className="px-3 py-2 font-mono font-bold text-[#333]">${c.balance.toFixed(2)}</td>
                    <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status==="Activo"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{c.status}</span></td>
                    <td className="px-3 py-2 text-xs text-[#888]">{NMV_BANCAS.find(b=>b.id===bid)?.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F8F5]">
              {["ID","Tipo","Cliente","Banca","Monto","Estado","Hora"].map(h=>(
                <th key={h} className="text-left px-3 py-2.5 text-[11px] font-bold text-[#666] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(tab==="todos" ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter(t=>
                tab==="recargas"?t.tipo==="Recarga":tab==="retiros"?t.tipo==="Retiro":t.tipo==="Ticket"
              )).map(t=>(
                <tr key={t.id} className="border-t border-[#F0F0EB] hover:bg-[#FAFAF8]">
                  <td className="px-3 py-2 font-mono text-xs text-[#999]">{t.id}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tipoColor(t.tipo)}`}>{t.tipo}</span></td>
                  <td className="px-3 py-2 font-medium text-[#333]">{t.cliente}</td>
                  <td className="px-3 py-2 text-xs text-[#888]">{t.banca}</td>
                  <td className="px-3 py-2 font-mono font-bold text-[#333]">${t.monto}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>{t.status}</span></td>
                  <td className="px-3 py-2 text-xs text-[#888] font-mono">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs text-[#AAA]">
        <RefreshCcw size={11}/> Actualización en tiempo real · {new Date().toLocaleTimeString("es-DO",{hour:"2-digit",minute:"2-digit"})}
      </div>
    </div>
  );
}

function ListaClientes({ bancaId, bancaName }: { bancaId: string; bancaName: string }) {
  const mock = getClients(bancaId);
  void bancaName;
  return(
    <div>
      <div className="text-xs text-[#14B8A6] font-medium mb-3">Clientes de: {bancaName}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5]">
              {["ID","Nombre","Teléfono","Balance","Estado"].map(h=>(
                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-[#666] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mock.map((c)=>(
              <tr key={c.id} className="border-t border-[#F0F0EB] hover:bg-[#FAFAF8]">
                <td className="px-3 py-2.5 text-[#999] font-mono">{c.id}</td>
                <td className="px-3 py-2.5 text-[#333] font-medium">{c.name}</td>
                <td className="px-3 py-2.5 text-[#555]">{c.phone}</td>
                <td className="px-3 py-2.5 font-mono text-[#333]">${c.balance.toFixed(2)}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status==="Activo"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// LEGACY (was here before)
function _ListaClientesOld({ bancaName }: { bancaName: string }) {
  const mock = [
    { id: "C001", name: "Juan Pérez",    phone: "+1-809-555-0001", balance: 250.0, status: "Activo" },
    { id: "C002", name: "María García",  phone: "+1-809-555-0002", balance: 80.5,  status: "Activo" },
    { id: "C003", name: "Carlos López",  phone: "+1-809-555-0003", balance: 0.0,   status: "Inactivo" },
  ];
  return (
    <div>
      <div className="text-xs text-[#14B8A6] font-medium mb-3">Clientes de: {bancaName}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5]">
              {["ID","Nombre","Teléfono","Balance","Estado"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-[#666666] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mock.map((c) => (
              <tr key={c.id} className="border-t border-[#F0F0EB] hover:bg-[#FAFAF8]">
                <td className="px-3 py-2.5 text-[#999999] font-mono">{c.id}</td>
                <td className="px-3 py-2.5 text-[#333333] font-medium">{c.name}</td>
                <td className="px-3 py-2.5 text-[#555555]">{c.phone}</td>
                <td className="px-3 py-2.5 font-mono text-[#333333]">${c.balance.toFixed(2)}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Retiro({ bancaName }: { bancaName: string }) {
  return (
    <div className="space-y-4 max-w-md">
      <div className="text-xs text-[#14B8A6] font-medium">Banca: {bancaName}</div>
      <FormField label="Cliente" placeholder="ID o nombre del cliente" />
      <FormField label="Monto" placeholder="0.00" type="number" />
      <FormField label="Concepto" placeholder="Descripción del retiro" />
      <div className="flex justify-end pt-2"><SaveBtn label="Procesar Retiro" color="#F59E0B" /></div>
    </div>
  );
}

function Recargas({ bancaName }: { bancaName: string }) {
  return (
    <div className="space-y-4 max-w-md">
      <div className="text-xs text-[#14B8A6] font-medium">Banca: {bancaName}</div>
      <FormField label="Cliente" placeholder="ID o nombre del cliente" />
      <FormField label="Monto de Recarga" placeholder="0.00" type="number" />
      <FormField label="Referencia" placeholder="Número de referencia (opcional)" />
      <div className="flex justify-end pt-2"><SaveBtn label="Procesar Recarga" color="#10B981" /></div>
    </div>
  );
}

function CancelarRecarga() {
  return (
    <div className="space-y-4 max-w-md">
      <FormField label="ID de Recarga" placeholder="ID de la recarga a cancelar" />
      <FormField label="Motivo" placeholder="Razón de la cancelación" />
      <div className="flex justify-end pt-2"><SaveBtn label="Cancelar Recarga" color="#EF4444" /></div>
    </div>
  );
}

function TicketsList({ bancaName }: { bancaName: string }) {
  return (
    <div className="text-center py-10 text-[#AAAAAA]">
      <Ticket size={40} className="mx-auto mb-3 opacity-40" />
      <p className="text-sm">Historial de tickets — <strong>{bancaName}</strong></p>
      <p className="text-xs mt-1">Conexión con Supabase pendiente</p>
    </div>
  );
}

const MOCK_PREMIOS = [
  { banca:"NMV RD 01", numero:"47", tipo:"Directo", monto:5000,  tickets:3, status:"Pagado"    },
  { banca:"NMV RD 01", numero:"18", tipo:"Pale",    monto:2500,  tickets:1, status:"Pendiente" },
  { banca:"NMV RD 02", numero:"33", tipo:"Directo", monto:8000,  tickets:5, status:"Pagado"    },
  { banca:"NMV RD 02", numero:"00", tipo:"Tripleta",monto:15000, tickets:2, status:"Pendiente" },
  { banca:"NMV RD 03", numero:"72", tipo:"Directo", monto:4500,  tickets:4, status:"Pagado"    },
  { banca:"NMV RD 03", numero:"55", tipo:"Pale",    monto:3200,  tickets:2, status:"Pagado"    },
];

function Premios({ bancaId, bancaName }: { bancaId: string; bancaName: string }) {
  void bancaId;
  const data = MOCK_PREMIOS.filter(p => p.banca === bancaName);
  const totalPagado   = data.filter(p=>p.status==="Pagado").reduce((s,p)=>s+p.monto,0);
  const totalPendiente= data.filter(p=>p.status==="Pendiente").reduce((s,p)=>s+p.monto,0);

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#F59E0B] font-semibold">🏆 Premios — {bancaName}</div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Premios",   value:String(data.length),          sub:"total",       bg:"bg-amber-50",   tc:"text-amber-600"  },
          { label:"Pagado",    value:`$${totalPagado.toLocaleString()}`,sub:"completado",bg:"bg-emerald-50",tc:"text-emerald-600"},
          { label:"Pendiente", value:`$${totalPendiente.toLocaleString()}`,sub:"por pagar",bg:"bg-red-50", tc:"text-red-500"    },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E5E0] p-3 text-center">
            <p className={`text-xl font-black ${s.tc}`}>{s.value}</p>
            <p className="text-xs text-[#555] font-semibold">{s.label}</p>
            <p className="text-[10px] text-[#AAA]">{s.sub}</p>
          </div>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 text-[#AAA]">
          <AlertCircle size={36} className="mx-auto mb-3 opacity-40"/>
          <p className="text-sm">Sin premios registrados para {bancaName}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#FFFBF0]">
              {["Banca","Número","Tipo","Monto","Tickets","Estado"].map(h=>(
                <th key={h} className="text-left px-3 py-2.5 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {data.map((p,i)=>(
                <tr key={i} className="border-t border-[#F0F0EB] hover:bg-[#FFFBF0]">
                  <td className="px-3 py-2.5 text-xs font-medium text-[#555]">{p.banca}</td>
                  <td className="px-3 py-2.5"><span className="font-black text-[#F59E0B] text-lg">{p.numero}</span></td>
                  <td className="px-3 py-2.5"><span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">{p.tipo}</span></td>
                  <td className="px-3 py-2.5 font-mono font-bold text-[#333]">${p.monto.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-center"><span className="text-xs bg-[#F8F8F5] border border-[#E5E5E0] rounded-full px-2 py-0.5">{p.tickets}</span></td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status==="Pagado"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length===0 && MOCK_PREMIOS.length>0 && (
        <p className="text-xs text-[#AAA] text-center">Cambia la banca para ver sus premios</p>
      )}
    </div>
  );
}

function Reporte({ bancaId, bancaName }: { bancaId: string; bancaName: string }) {
  const clients = getClients(bancaId);
  const activos = clients.filter(c=>c.status==="Activo").length;
  return (
    <div>
      <div className="text-xs text-[#14B8A6] font-medium mb-4">Reporte de: {bancaName}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Clientes activos",  value: String(activos), color: "#4ECDC4" },
          { label: "Recargas hoy",      value: "—",             color: "#10B981" },
          { label: "Retiros hoy",       value: "—",             color: "#F59E0B" },
          { label: "Total recargado",   value: "—",             color: "#3B82F6" },
          { label: "Total retirado",    value: "—",             color: "#8B5CF6" },
          { label: "Tickets móvil",     value: "—",             color: "#F97316" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#F8F8F5] rounded-xl p-4 text-center border border-[#E5E5E0]">
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[#666666]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
