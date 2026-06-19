import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Pencil, Trash2, Calendar, X, ChevronDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Column } from "@/components/ui/DataTable";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─── Multi-Select Reusable ─────────────────────────────────────────────────────
function MultiSelectDropdown({items,selected,onChange,placeholder,labelKey="name",idKey="id"}:{
  items:{[k:string]:string}[];selected:string[];onChange:(v:string[])=>void;placeholder:string;labelKey?:string;idKey?:string;
}) {
  const [open,setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  const toggle=(id:string)=>onChange(selected.includes(id)?selected.filter(s=>s!==id):[...selected,id]);
  const label = selected.length===0?placeholder:selected.length===items.length?"Todas":
    selected.length<=2?selected.map(id=>items.find(i=>i[idKey]===id)?.[labelKey]??"").join(", "):`${selected.length} seleccionadas`;
  return(
    <div ref={ref} className="relative">
      <button type="button" onClick={()=>setOpen(v=>!v)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm border rounded-lg bg-white transition-all min-w-[190px] ${
          open||selected.length>0?"border-[#4ECDC4] ring-2 ring-[#4ECDC4]/15":"border-[#E5E5E0] hover:border-[#CCCCCC]"
        }`}>
        <span className={`truncate ${selected.length>0?"text-[#333] font-medium":"text-[#999]"}`}>{label}</span>
        <ChevronDown size={13} className={`text-[#999] flex-shrink-0 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.15}}
            className="absolute top-full mt-1 left-0 z-20 bg-white border border-[#E5E5E0] rounded-xl shadow-xl p-2 min-w-[210px] max-h-56 overflow-y-auto">
            <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm border-b border-[#F0F0EB] mb-1">
              <input type="checkbox" checked={selected.length===items.length}
                onChange={()=>onChange(selected.length===items.length?[]:items.map(i=>i[idKey]))}
                className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"/>
              <span className="font-semibold text-[#333]">Todas</span>
            </label>
            {items.map(item=>(
              <label key={item[idKey]} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm transition-colors">
                <input type="checkbox" checked={selected.includes(item[idKey])} onChange={()=>toggle(item[idKey])}
                  className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"/>
                <span className="text-[#333]">{item[labelKey]}</span>
                {item.code&&<span className="text-[#AAA] text-xs ml-auto">{item.code}</span>}
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CobroRow {
  id: string;
  numero: number;
  fecha: string;
  hora: string;
  tipo: string;
  banca: string;
  monto: number;
  creadoPor: string;
  notas: string;
}

export default function ListaCobros() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const NMV_BANCAS = bancasRaw.map(b => ({ id: b.id, code: b.code, name: b.name }));
  const NMV_ZONAS  = zonasRaw.map(z  => ({ id: z.id, nombre: z.nombre }));

  const [filterType, setFilterType] = useState("");
  const [filterBancas, setFilterBancas] = useState<string[]>([]);
  const [filterZonas, setFilterZonas] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CobroRow | null>(null);
  const [, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formTipo, setFormTipo] = useState("COBRO");
  const [formBanca, setFormBanca] = useState("");
  const [formBanco, setFormBanco] = useState("");
  const [formMonto, setFormMonto] = useState("");
  const [formNotas, setFormNotas] = useState("");

  // Datos reales de cobros — vacío hasta integración con Supabase
  const allData: CobroRow[] = [];

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (filterType && row.tipo !== filterType) return false;
      if (filterBancas.length > 0) {
        const b = NMV_BANCAS.find(b=>filterBancas.includes(b.id));
        if (b && row.banca !== b.name && row.banca !== b.code) {
          // check any match
          const matchesBanca = filterBancas.some(fid => {
            const fb = NMV_BANCAS.find(x=>x.id===fid);
            return fb && (row.banca === fb.name || row.banca === fb.code);
          });
          if (!matchesBanca) return false;
        }
      }
      if (startDate) {
        const rowDate = new Date(row.fecha.split("/").reverse().join("-"));
        if (rowDate < new Date(startDate)) return false;
      }
      if (endDate) {
        const rowDate = new Date(row.fecha.split("/").reverse().join("-"));
        if (rowDate > new Date(endDate)) return false;
      }
      return true;
    });
  }, [allData, filterType, filterBancas, startDate, endDate]);

  const columns: Column<CobroRow>[] = [
    { key: "numero", header: "Numero", accessor: (r) => r.numero, sortable: true, align: "center", width: "70px" },
    { key: "fecha", header: "Fecha", accessor: (r) => r.fecha, sortable: true },
    { key: "hora", header: "Hora", accessor: (r) => r.hora, sortable: true },
    { key: "tipo", header: "Tipo", accessor: (r) => r.tipo, sortable: true, cell: (r) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.tipo === "COBRO" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
        {r.tipo}
      </span>
    )},
    { key: "banca", header: "Banca", accessor: (r) => r.banca, sortable: true },
    { key: "monto", header: "Monto", accessor: (r) => r.monto, sortable: true, align: "right", formatter: (_v, r) => `$${r.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    { key: "creadoPor", header: "Creado por", accessor: (r) => r.creadoPor, sortable: true },
    { key: "notas", header: "Notas", accessor: (r) => r.notas, sortable: false },
    {
      key: "acciones",
      header: "",
      accessor: () => "",
      align: "center",
      cell: (r) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); setSelectedRow(r); }} className="p-1.5 rounded-md text-[#666666] hover:bg-[rgba(78,205,196,0.1)] hover:text-[#4ECDC4] transition-colors" title="Ver">
            <Eye size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setSelectedRow(r); }} className="p-1.5 rounded-md text-[#666666] hover:bg-[rgba(78,205,196,0.1)] hover:text-[#4ECDC4] transition-colors" title="Editar">
            <Pencil size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); setShowDelete(true); }} className="p-1.5 rounded-md text-[#666666] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-colors" title="Eliminar">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setShowCreate(false);
    setFormTipo("COBRO");
    setFormBanca("");
    setFormBanco("");
    setFormMonto("");
    setFormNotas("");
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader
        title="Cobros / Pagos"
        subtitle="Gestion de cobros y pagos del sistema"
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            Crear
          </button>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Desde</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hasta</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todos</option>
              <option value="COBRO">Cobro</option>
              <option value="PAGO">Pago</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Bancas</label>
            <MultiSelectDropdown items={NMV_BANCAS as unknown as {[k:string]:string}[]} selected={filterBancas} onChange={setFilterBancas} placeholder="Todas las bancas"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zona</label>
            <MultiSelectDropdown items={NMV_ZONAS.map(z=>({id:z.id,name:z.nombre})) as unknown as {[k:string]:string}[]} selected={filterZonas} onChange={setFilterZonas} placeholder="Todas las zonas"/>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(r) => r.id}
        />
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setShowCreate(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[520px] w-[calc(100%-2rem)] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-3">
                <h3 className="text-lg font-semibold text-[#333333]">Nuevo Cobro / Pago</h3>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Tipo</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tipo" value="COBRO" checked={formTipo === "COBRO"} onChange={() => setFormTipo("COBRO")} className="accent-[#4ECDC4]" />
                      <span className="text-sm text-[#333333]">Cobro</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tipo" value="PAGO" checked={formTipo === "PAGO"} onChange={() => setFormTipo("PAGO")} className="accent-[#4ECDC4]" />
                      <span className="text-sm text-[#333333]">Pago</span>
                    </label>
                  </div>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-[#666666] mb-1.5">Banca</label>
                   <select value={formBanca} onChange={(e) => setFormBanca(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
                     <option value="">Seleccionar banca</option>
                     {NMV_BANCAS.map(b=><option key={b.id} value={b.id}>{b.code} — {b.name}</option>)}
                   </select>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Banco</label>
                  <select value={formBanco} onChange={(e) => setFormBanco(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
                    <option value="">Seleccionar banco</option>
                    <option value="bank-01">Banco Principal</option>
                    <option value="bank-02">Banco Secundario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Monto</label>
                  <input type="number" step="0.01" value={formMonto} onChange={(e) => setFormMonto(e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1.5">Notas</label>
                  <textarea value={formNotas} onChange={(e) => setFormNotas(e.target.value)} rows={3} placeholder="Notas opcionales..." className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors resize-none" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRow && !showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setSelectedRow(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[480px] w-[calc(100%-2rem)] mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#333333]">Detalle #{selectedRow.numero}</h3>
                <button onClick={() => setSelectedRow(null)} className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Fecha:</span><span className="text-sm font-medium text-[#333333]">{selectedRow.fecha}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Hora:</span><span className="text-sm font-medium text-[#333333]">{selectedRow.hora}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Tipo:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedRow.tipo === "COBRO" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>{selectedRow.tipo}</span>
                </div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Banca:</span><span className="text-sm font-medium text-[#333333]">{selectedRow.banca}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Monto:</span><span className="text-sm font-medium text-[#333333]">${selectedRow.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Creado por:</span><span className="text-sm font-medium text-[#333333]">{selectedRow.creadoPor}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#666666]">Notas:</span><span className="text-sm font-medium text-[#333333]">{selectedRow.notas || "-"}</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Eliminar transaccion"
        message="Estas seguro de que deseas eliminar esta transaccion?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => { setShowDelete(false); setDeleteId(null); }}
        onCancel={() => { setShowDelete(false); setDeleteId(null); }}
      />
    </div>
  );
}
