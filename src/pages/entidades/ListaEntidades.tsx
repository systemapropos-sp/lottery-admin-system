import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Pencil, Save, Loader2 } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { useBancasStore } from "@/store/bancasStore";
import { useZonasStore } from "@/store/zonasStore";
import { supabase, BUSINESS_ID } from "@/lib/supabase";
// ─── Local type alias (compatible con datos de Supabase) ──────────────────────
interface BettingPool { id:string; name:string; code:string; mwrCode:string; balance:number; isActive:boolean; }

// ─── Additional Entity Types ──────────────────────────────────────────────────

interface Employee {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

interface OtherEntity {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const employees: Employee[] = [];

const banks: Bank[] = [];

// zoneEntities: loaded dynamically from Supabase via useBancasZonas

const others: OtherEntity[] = [];

const tabs = ["Bancas", "Empleados", "Bancos", "Zonas", "Otros"] as const;
type TabType = (typeof tabs)[number];

// ─── Currency Formatter ───────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  const absVal = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(absVal);
  return value < 0 ? `-${formatted}` : formatted;
}

// ─── Component ────────────────────────────────────────────────────────────────

type CrearForm = {nombre:string; codigo:string; tipo:TabType; balance:string; caidaAcumulada:string; prestamo:string;};

function CrearEntidadModal({activeTab,onClose,onCreated}:{activeTab:TabType;onClose:()=>void;onCreated:()=>void}){
  const [form,setForm]=useState<CrearForm>({nombre:"",codigo:"",tipo:activeTab,balance:"0",caidaAcumulada:"0",prestamo:"0"});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const { createBanca } = useBancasStore();
  const { createZona }  = useZonasStore();

  const handleCrear = async () => {
    if (!form.nombre.trim()) return;
    setLoading(true); setErr("");
    let result: {ok:boolean;error?:string};
    if (form.tipo === "Bancas") {
      result = await createBanca({ name:form.nombre.trim(), code:form.codigo.trim(), mwr_code:form.codigo.trim(), balance:parseFloat(form.balance)||0, is_active:true, zone_id:null, zone_name:null });
    } else if (form.tipo === "Zonas") {
      result = await createZona({ nombre:form.nombre.trim(), descripcion:"", is_active:true });
    } else {
      // Empleados, Bancos, Otros → save to 'entidades' table
      const tipoMap: Record<TabType, string> = {
        Bancas:"bancas", Empleados:"empleados", Bancos:"bancos", Zonas:"zonas", Otros:"otros"
      };
      const { error } = await supabase.from("entidades").insert({
        nombre:    form.nombre.trim(),
        codigo:    form.codigo.trim() || null,
        tipo:      tipoMap[form.tipo],
        balance:   parseFloat(form.balance) || 0,
        caida_acumulada: parseFloat(form.caidaAcumulada) || 0,
        prestamo:  parseFloat(form.prestamo) || 0,
        is_active: true,
        business_id: BUSINESS_ID,
      });
      result = error ? { ok:false, error: error.message } : { ok:true };
    }
    setLoading(false);
    if (!result.ok) { setErr(result.error ?? "Error al guardar"); return; }
    onCreated();
    onClose();
  };

  return(
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.15}}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#333]">Crear Entidad</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} className="text-[#666]"/></button>
        </div>
        <div className="space-y-3">
          <div><label className="text-xs text-[#999] font-medium">Tipo de entidad</label>
            <select value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value as TabType}))}
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] bg-white">
              {(["Bancas","Empleados","Bancos","Zonas","Otros"] as TabType[]).map(t=><option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label className="text-xs text-[#999] font-medium">Nombre *</label>
            <input value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} placeholder="Nombre de la entidad"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
          {form.tipo==="Bancas" && <div><label className="text-xs text-[#999] font-medium">Código</label>
            <input value={form.codigo} onChange={e=>setForm(p=>({...p,codigo:e.target.value}))} placeholder="Ej: RDV-R01"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>}
          {form.tipo==="Bancas" && <div><label className="text-xs text-[#999] font-medium">Balance inicial (RD$)</label>
            <input type="number" value={form.balance} onChange={e=>setForm(p=>({...p,balance:e.target.value}))}
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>}
          {err && <p className="text-xs text-red-500 font-medium">{err}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-[#E5E5E0] rounded-xl hover:bg-gray-50">Cancelar</button>
          <button onClick={handleCrear} disabled={!form.nombre.trim()||loading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${form.nombre.trim()&&!loading?"bg-[#4ECDC4] text-white hover:bg-[#3DBDB5]":"bg-[#E5E5E0] text-[#999] cursor-not-allowed"}`}>
            {loading?<Loader2 size={14} className="animate-spin"/>:null}
            {loading?"Guardando...":"Crear Entidad"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ListaEntidades() {
  const location = useLocation();
  const tabFromPath: Record<string, TabType> = {
    "/accountable-entities/bancas":    "Bancas",
    "/accountable-entities/empleados": "Empleados",
    "/accountable-entities/bancos":    "Bancos",
    "/accountable-entities/zonas":     "Zonas",
    "/accountable-entities/otros":     "Otros",
  };
  const initialTab: TabType = tabFromPath[location.pathname] ?? "Bancas";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [filter, setFilter] = useState("");
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [editingPool, setEditingPool] = useState<BettingPool | null>(null);
  const [editForm, setEditForm] = useState<BettingPool | null>(null);
  const [saving, setSaving] = useState(false);

  // ─── Supabase stores ─────────────────────────────────────────────────────────
  const { bancas, fetchBancas, createBanca, updateBanca } = useBancasStore();
  const { zonas, fetchZonas } = useZonasStore();

  useEffect(() => {
    fetchBancas();
    fetchZonas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map Banca (Supabase) → BettingPool (display format)
  const bettingPools: BettingPool[] = bancas.map(b => ({
    id: b.id,
    name: b.name,
    code: b.code,
    mwrCode: b.mwr_code,
    balance: b.balance,
    isActive: b.is_active,
  }));

  // Map Zonas (Supabase) → zoneEntities format
  const zoneRows = zonas.map(z => ({
    id: z.id,
    name: z.nombre,
    code: z.id.slice(0, 8).toUpperCase(),
    balance: 0,
    caidaAcumulada: 0,
    prestamo: 0,
  }));

  useEffect(() => {
    const t = tabFromPath[location.pathname];
    if (t) setActiveTab(t);
  }, [location.pathname]);

  // ─── Filter Logic ───────────────────────────────────────────────────────────

  const filterByText = <T extends { name: string; code: string }>(items: T[]): T[] => {
    if (!filter.trim()) return items;
    const lower = filter.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower)
    );
  };

  const filteredPools = useMemo(() => filterByText(bettingPools), [filter, bettingPools]);
  const filteredEmployees = useMemo(() => filterByText(employees), [filter]);
  const filteredBanks = useMemo(() => filterByText(banks), [filter]);
  const filteredZones = useMemo(() => filterByText(zoneRows), [filter, zoneRows]);
  const filteredOthers = useMemo(() => filterByText(others), [filter]);

  // ─── Balance Cell ───────────────────────────────────────────────────────────

  function BalanceCell({ value }: { value: number }) {
    const colorClass =
      value > 0
        ? "text-[#22C55E]"
        : value < 0
          ? "text-[#EF4444]"
          : "text-[#999999]";
    return <span className={`font-mono font-medium ${colorClass}`}>{formatCurrency(value)}</span>;
  }

  // ─── Actions Cell ───────────────────────────────────────────────────────────

  function ActionsCell({ entity }: { entity: BettingPool }) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditingPool(entity); setEditForm({ ...entity }); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] border border-[#4ECDC4]/30 hover:border-[#4ECDC4] transition-all"
        title="Editar entidad"
      >
        <Pencil size={13} /> Editar
      </button>
    );
  }

  // ─── Columns ────────────────────────────────────────────────────────────────

  const poolColumns: Column<BettingPool>[] = [
    {
      key: "name",
      header: "Nombre",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      key: "code",
      header: "Codigo",
      accessor: (row) => row.mwrCode,
      sortable: true,
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row) => row.balance,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.balance} />,
    },
    {
      key: "caida",
      header: "Caida acumulada",
      accessor: () => 0,
      sortable: true,
      align: "right",
      cell: () => <span className="font-mono text-[#999999]">$0.00</span>,
    },
    {
      key: "prestamo",
      header: "Prestamo",
      accessor: () => 0,
      sortable: true,
      align: "right",
      cell: () => <span className="font-mono text-[#999999]">$0.00</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      cell: (row) => <ActionsCell entity={row} />,
    },
  ];

  interface ZoneRow { id:string; name:string; code:string; balance:number; caidaAcumulada:number; prestamo:number; }
  const genericColumns: Column<Employee | Bank | ZoneRow | OtherEntity>[] = [
    {
      key: "name",
      header: "Nombre",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      key: "code",
      header: "Codigo",
      accessor: (row) => row.code,
      sortable: true,
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row) => row.balance,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.balance} />,
    },
    {
      key: "caida",
      header: "Caida acumulada",
      accessor: (row) => row.caidaAcumulada,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.caidaAcumulada} />,
    },
    {
      key: "prestamo",
      header: "Prestamo",
      accessor: (row) => row.prestamo,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.prestamo} />,
    },
    {
      key: "actions",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      cell: () => (
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] border border-[#4ECDC4]/30 hover:border-[#4ECDC4] transition-all">
          <Pencil size={13}/> Editar
        </button>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Entidades Contables</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Gestion de todas las entidades financieras del sistema
          </p>
        </div>
        <button
          onClick={() => setShowCrearModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_12px_rgba(78,205,196,0.4)]"
        >
          <Plus size={16} />
          Crear Entidad
        </button>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="border-b border-[#F0F0EB] px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-[#4ECDC4]"
                    : "text-[#999999] hover:text-[#666666]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="entity-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Quick Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="relative mb-4"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            />
            <input
              type="text"
              placeholder="Filtro rapido..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            />
          </motion.div>

          {/* Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Bancas" && (
                <DataTable
                  columns={poolColumns}
                  data={filteredPools}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Empleados" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredEmployees}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Bancos" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredBanks}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Zonas" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredZones}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Otros" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredOthers}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {showCrearModal&&<CrearEntidadModal key="crear" activeTab={activeTab}
          onClose={()=>setShowCrearModal(false)}
          onCreated={()=>{ fetchBancas(); fetchZonas(); }}
        />}
      </AnimatePresence>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingPool && editForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditingPool(null)}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.15}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#333]">Editar Entidad</h3>
                  <p className="text-xs text-[#999] mt-0.5">{editingPool.code}</p>
                </div>
                <button onClick={()=>setEditingPool(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} className="text-[#666]"/></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#999] font-medium">Nombre</label>
                  <input value={editForm.name} onChange={e=>setEditForm(f=>f?{...f,name:e.target.value}:f)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
                </div>
                <div>
                  <label className="text-xs text-[#999] font-medium">Código MWR</label>
                  <input value={editForm.mwrCode} onChange={e=>setEditForm(f=>f?{...f,mwrCode:e.target.value}:f)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
                </div>
                <div>
                  <label className="text-xs text-[#999] font-medium">Balance (RD$)</label>
                  <input type="number" value={editForm.balance} onChange={e=>setEditForm(f=>f?{...f,balance:Number(e.target.value)}:f)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-[#999] font-medium">Estado</label>
                  <button onClick={()=>setEditForm(f=>f?{...f,isActive:!f.isActive}:f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${editForm.isActive?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>
                    {editForm.isActive?"Activo":"Inactivo"}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setEditingPool(null)} className="flex-1 px-4 py-2 text-sm border border-[#E5E5E0] rounded-xl hover:bg-gray-50">Cancelar</button>
                <button onClick={()=>{
                  // TODO: persist to Supabase vendors table
                  Object.assign(editingPool, editForm); // update in-place for now
                  setEditingPool(null);
                }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#4ECDC4] text-white hover:bg-[#3DBDB5]">
                  <Save size={13}/> Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
