import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, LayoutList, Power, ChevronUp, ChevronDown, RefreshCw, CloudUpload } from "lucide-react";
import { useSorteosStore, type Sorteo } from "@/store/sorteosStore";

// ─── Modal Agregar / Editar Sorteo ───────────────────────────────────────────
interface SorteoForm { nombre:string; abreviacion:string; horario:string; horarioCierre:string; color:string; activo:boolean; }

function SorteoModal({ initial, onSave, onClose, title }: {
  initial?: Partial<SorteoForm>; onSave:(f:SorteoForm)=>void; onClose:()=>void; title:string;
}) {
  const [form, setForm] = useState<SorteoForm>({
    nombre: initial?.nombre ?? "",
    abreviacion: initial?.abreviacion ?? "",
    horario: initial?.horario ?? "",
    horarioCierre: initial?.horarioCierre ?? "",
    color: initial?.color ?? "#14B8A6",
    activo: initial?.activo ?? true,
  });
  const valid = form.nombre.trim().length > 0 && form.abreviacion.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.15}}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#333]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F0]"><X size={16} className="text-[#666]"/></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#999] font-medium">Nombre del sorteo *</label>
            <input value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}
              placeholder="Ej: FLORIDA AM"
              className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#999] font-medium">Abreviación *</label>
              <input value={form.abreviacion} onChange={e=>setForm(p=>({...p,abreviacion:e.target.value.toUpperCase()}))}
                placeholder="Ej: FLAM" maxLength={8}
                className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6] uppercase"/>
            </div>
            <div>
              <label className="text-xs text-[#999] font-medium">Hora Apertura</label>
              <input value={form.horario} onChange={e=>setForm(p=>({...p,horario:e.target.value}))}
                placeholder="Ej: 11:00 AM"
                className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"/>
            </div>
            <div>
              <label className="text-xs text-[#999] font-medium">Hora Cierre</label>
              <input value={form.horarioCierre} onChange={e=>setForm(p=>({...p,horarioCierre:e.target.value}))}
                placeholder="Ej: 11:30 AM"
                className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"/>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#999] font-medium">Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))}
                  className="w-9 h-9 rounded-lg border border-[#E5E5E0] cursor-pointer"/>
                <span className="text-sm font-mono text-[#666]">{form.color}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#999] font-medium">Estado</label>
              <button onClick={()=>setForm(p=>({...p,activo:!p.activo}))}
                className={`mt-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${form.activo?"bg-[#F0FDF4] border-[#22C55E] text-[#16A34A]":"bg-[#F9FAFB] border-[#E5E5E0] text-[#999]"}`}>
                <Power size={14}/> {form.activo?"Activo":"Inactivo"}
              </button>
            </div>
          </div>
          <div className="p-3 bg-[#F5F5F0] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{backgroundColor:form.color}}/>
            <div>
              <p className="text-sm font-semibold text-[#333]">{form.nombre||"Nombre del sorteo"}</p>
              <p className="text-xs text-[#999]">{form.abreviacion||"ABREV"} · 🟢 {form.horario||"--:--"} → 🔴 {form.horarioCierre||"--:--"}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium border border-[#E5E5E0] rounded-xl hover:bg-[#F5F5F0] transition-colors">Cancelar</button>
          <button onClick={()=>valid&&onSave(form)} disabled={!valid}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${valid?"bg-[#14B8A6] text-white hover:bg-[#0F766E]":"bg-[#E5E5E0] text-[#999] cursor-not-allowed"}`}>
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ConfirmDelete ────────────────────────────────────────────────────────────
function ConfirmDelete({ nombre, onConfirm, onCancel }:{nombre:string;onConfirm:()=>void;onCancel:()=>void}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={e=>e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#333]">Eliminar sorteo</h3>
        <p className="text-sm text-[#666]">¿Estás seguro de eliminar <strong>"{nombre}"</strong>? Esta acción no se puede deshacer.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-medium border border-[#E5E5E0] rounded-xl hover:bg-[#F5F5F0]">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626]">Eliminar</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ListaSorteos() {
  const { sorteos, addSorteo, updateSorteo, deleteSorteo, toggleActivo, loadFromSupabase, syncAllToSupabase } = useSorteosStore();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Sorteo|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sorteo|null>(null);
  const [filterActivo, setFilterActivo] = useState<"todos"|"activos"|"inactivos">("todos");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [sortField, setSortField] = useState<"nombre"|"abreviacion"|"horario"|"activo"|null>(null);
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // ── Cargar sorteos de Supabase al montar ──────────────────────────────────
  useEffect(() => { loadFromSupabase(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Push completo a Supabase (reemplaza todo) ─────────────────────────────
  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      await syncAllToSupabase();
      setSyncMsg({ ok: true, text: `✅ ${sorteos.length} sorteos sincronizados a Supabase` });
    } catch {
      setSyncMsg({ ok: false, text: '❌ Error al sincronizar. Ver consola.' });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

  function toggleSort(f:"nombre"|"abreviacion"|"horario"|"activo"){
    if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc");
    else{setSortField(f);setSortDir("asc");}
  }

  const filtered = useMemo(()=>{
    let list = sorteos;
    if(filterActivo==="activos") list=list.filter(s=>s.activo);
    if(filterActivo==="inactivos") list=list.filter(s=>!s.activo);
    const q=search.toLowerCase();
    if(q) list=list.filter(s=>s.nombre.toLowerCase().includes(q)||s.abreviacion.toLowerCase().includes(q)||s.horario.toLowerCase().includes(q));
    if(sortField){
      list=[...list].sort((a,b)=>{
        let cmp=0;
        if(sortField==="nombre") cmp=a.nombre.localeCompare(b.nombre);
        else if(sortField==="abreviacion") cmp=a.abreviacion.localeCompare(b.abreviacion);
        else if(sortField==="horario") cmp=a.horario.localeCompare(b.horario);
        else if(sortField==="activo") cmp=(a.activo===b.activo?0:a.activo?-1:1);
        return sortDir==="asc"?cmp:-cmp;
      });
    }
    return list;
  },[sorteos,search,filterActivo,sortField,sortDir]);

  const paginated = showAll ? filtered : filtered.slice(page*PAGE_SIZE, (page+1)*PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const activosCount = sorteos.filter(s=>s.activo).length;

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Sorteos</h1>
          <p className="text-sm text-[#999] mt-0.5">{activosCount} activos de {sorteos.length} sorteos totales</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cargar desde Supabase */}
          <button onClick={() => loadFromSupabase()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E5E0] text-[#555] text-sm font-medium rounded-xl hover:border-[#14B8A6] transition-colors"
            title="Recargar sorteos desde Supabase">
            <RefreshCw size={14}/> Recargar
          </button>
          {/* Sincronizar a Supabase (push completo) */}
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0EA5E9] text-white text-sm font-semibold rounded-xl hover:bg-[#0284C7] shadow-sm transition-colors active:scale-[0.97] disabled:opacity-60"
            title="Enviar todos los sorteos a Supabase (reemplaza lista)">
            <CloudUpload size={14}/> {syncing ? "Sincronizando..." : "☁ Sync a Supabase"}
          </button>
          <button onClick={()=>setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] text-white text-sm font-semibold rounded-xl hover:bg-[#0F766E] shadow-sm transition-colors active:scale-[0.97]">
            <Plus size={16}/> Agregar Sorteo
          </button>
        </div>
      </div>

      {/* Mensaje de sincronización */}
      {syncMsg && (
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${syncMsg.ok ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]" : "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"}`}>
          {syncMsg.text}
        </motion.div>
      )}

      {/* Barra de búsqueda + filtros */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="Buscar sorteo..."
            className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"/>
          {search&&<button onClick={()=>setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]"/></button>}
        </div>
        <div className="flex gap-1">
          {(["todos","activos","inactivos"] as const).map(f=>(
            <button key={f} onClick={()=>{setFilterActivo(f);setPage(0);}}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${filterActivo===f?"bg-[#14B8A6] text-white border-[#14B8A6]":"bg-white text-[#666] border-[#E5E5E0] hover:border-[#14B8A6]"}`}>
              {f}
            </button>
          ))}
        </div>
        <span className="text-sm text-[#999] ml-auto">{filtered.length} sorteo{filtered.length!==1?"s":""}</span>
        <button onClick={()=>setShowAll(v=>!v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${showAll?"bg-[#14B8A6] text-white border-[#14B8A6]":"bg-white text-[#555] border-[#E5E5E0] hover:border-[#14B8A6]"}`}>
          <LayoutList size={13}/> {showAll?"Paginado":"Ver Todos"}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Total Sorteos",val:sorteos.length,color:"text-[#333]",bg:"bg-white"},
          {label:"Activos",val:activosCount,color:"text-[#22C55E]",bg:"bg-[#F0FDF4]"},
          {label:"Inactivos",val:sorteos.length-activosCount,color:"text-[#EF4444]",bg:"bg-[#FEF2F2]"},
        ].map(c=>(
          <div key={c.label} className={`${c.bg} rounded-xl border border-[#E5E5E0] p-4 text-center`}>
            <p className={`text-2xl font-bold ${c.color}`}>{c.val}</p>
            <p className="text-xs text-[#999] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            <th className="px-3 py-3 w-6"/>
            {([
              {label:"Nombre",   field:"nombre"      as const},
              {label:"Abrev.",   field:"abreviacion" as const},
              {label:"Horario",  field:"horario"     as const},
            ]).map(({label,field})=>(
              <th key={field} className="px-3 py-3 text-xs font-semibold text-[#555] text-left">
                <button onClick={()=>toggleSort(field)} className="flex items-center gap-1 hover:text-[#14B8A6] transition-colors">
                  {label}
                  {sortField===field?(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>):<span className="opacity-30"><ChevronUp size={9}/></span>}
                </button>
              </th>
            ))}
            <th className="px-3 py-3 text-xs font-semibold text-[#555] text-left">Color</th>
            <th className="px-3 py-3 text-xs font-semibold text-[#555] text-left">
              <button onClick={()=>toggleSort("activo")} className="flex items-center gap-1 hover:text-[#14B8A6] transition-colors">
                Estado
                {sortField==="activo"?(sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>):<span className="opacity-30"><ChevronUp size={9}/></span>}
              </button>
            </th>
            <th className="px-3 py-3 text-xs font-semibold text-[#555] text-left">Acciones</th>
          </tr></thead>
          <tbody>
            {paginated.length===0?(
              <tr><td colSpan={7} className="py-10 text-center text-sm text-[#999]">No se encontraron sorteos</td></tr>
            ):paginated.map((s,ri)=>(
              <tr key={s.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20 transition-colors`}>
                <td className="px-3 py-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-white shadow" style={{backgroundColor:s.color}}/>
                </td>
                <td className="px-3 py-2.5 font-medium text-[#333]">{s.nombre}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#F5F5F0] text-[#666]">{s.abreviacion}</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#E0F7F5] text-[#14B8A6]">🟢 {s.horario||"—"}</span>
                    {s.horarioCierre && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#FEE2E2] text-[#EF4444]">🔴 {s.horarioCierre}</span>}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-[#E5E5E0]" style={{backgroundColor:s.color}}/>
                    <span className="text-xs font-mono text-[#999]">{s.color}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <button onClick={()=>toggleActivo(s.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${s.activo?"bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]":"bg-[#F9FAFB] text-[#999] hover:bg-[#F3F4F6]"}`}>
                    <Power size={10}/> {s.activo?"Activo":"Inactivo"}
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={()=>setEditTarget(s)} className="p-1.5 rounded-lg text-[#666] hover:text-[#14B8A6] hover:bg-[#E0F7F5] transition-colors" title="Editar">
                      <Pencil size={14}/>
                    </button>
                    <button onClick={()=>setDeleteTarget(s)} className="p-1.5 rounded-lg text-[#666] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors" title="Eliminar">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {!showAll && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0EB]">
            <p className="text-xs text-[#999]">Página {page+1} de {totalPages} · {filtered.length} resultados</p>
            <div className="flex gap-1">
              <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
                className="px-3 py-1 text-xs rounded-lg border border-[#E5E5E0] disabled:opacity-40 hover:border-[#14B8A6] transition-colors">Ant.</button>
              <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1}
                className="px-3 py-1 text-xs rounded-lg border border-[#E5E5E0] disabled:opacity-40 hover:border-[#14B8A6] transition-colors">Sig.</button>
            </div>
          </div>
        )}
        {!showAll && <p className="px-4 py-2 text-xs text-[#999]">Mostrando {paginated.length} de {filtered.length} sorteos</p>}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAdd&&(
          <SorteoModal key="add" title="Agregar Nuevo Sorteo"
            onSave={f=>{addSorteo(f);setShowAdd(false);}}
            onClose={()=>setShowAdd(false)}/>
        )}
        {editTarget&&(
          <SorteoModal key="edit" title={`Editar: ${editTarget.nombre}`}
            initial={editTarget}
            onSave={f=>{updateSorteo(editTarget.id,f);setEditTarget(null);}}
            onClose={()=>setEditTarget(null)}/>
        )}
        {deleteTarget&&(
          <ConfirmDelete key="del" nombre={deleteTarget.nombre}
            onConfirm={()=>{deleteSorteo(deleteTarget.id);setDeleteTarget(null);}}
            onCancel={()=>setDeleteTarget(null)}/>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
