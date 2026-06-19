import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Pencil, Trash2, Check, Plus, Settings2, Building2, Power, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useBancasZonas } from "@/context/BancasZonasContext";
import { useZonasStore } from "@/store/zonasStore";
import type { Zona } from "@/store/zonasStore";

export default function ListaZonas() {
  const navigate = useNavigate();
  const { zonas, zonasLoading, refetch } = useBancasZonas();
  const { createZona, updateZona, deleteZona } = useZonasStore();

  const [search, setSearch]               = useState("");
  const [editId, setEditId]               = useState<string | null>(null);
  const [editName, setEditName]           = useState("");
  const [deleteTarget, setDeleteTarget]   = useState<Zona | null>(null);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [newNombre, setNewNombre]         = useState("");
  const [newDesc, setNewDesc]             = useState("");
  const [saving, setSaving]               = useState(false);
  const [errMsg, setErrMsg]               = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? zonas.filter((z) => z.nombre.toLowerCase().includes(q) || z.descripcion?.toLowerCase().includes(q))
      : zonas;
  }, [zonas, search]);

  const activasCount = zonas.filter((z) => z.is_active).length;

  // Count bancas per zona from context
  const { bancas } = useBancasZonas();
  const bancasPorZona = (zonaId: string): number =>
    bancas.filter((b) => b.zone_id === zonaId).length;

  // Edit in-place
  function startEdit(z: Zona) { setEditId(z.id); setEditName(z.nombre); }
  async function saveEdit() {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    await updateZona(editId, { nombre: editName.trim() });
    setSaving(false);
    setEditId(null);
    refetch();
  }

  // Toggle active
  async function toggleActivo(z: Zona) {
    await updateZona(z.id, { is_active: !z.is_active });
    refetch();
  }

  // Delete
  async function handleDelete(id: string) {
    setSaving(true);
    await deleteZona(id);
    setSaving(false);
    setDeleteTarget(null);
    refetch();
  }

  // Create
  async function addZona() {
    if (!newNombre.trim()) return;
    setSaving(true);
    setErrMsg("");
    const result = await createZona({ nombre: newNombre.trim(), descripcion: newDesc.trim(), is_active: true });
    setSaving(false);
    if (!result.ok) { setErrMsg(result.error ?? "Error al crear zona"); return; }
    setNewNombre(""); setNewDesc(""); setShowAddModal(false);
    refetch();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Zonas</h1>
          <p className="text-sm text-[#999] mt-0.5">{activasCount} activas de {zonas.length} zonas</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/zones/manage")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm transition-colors active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
          >
            <Settings2 size={15} /> Manejar Todas
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] text-white text-sm font-semibold rounded-xl hover:bg-[#0F766E] shadow-sm transition-colors active:scale-[0.97]"
          >
            <Plus size={15} /> Crear Zona
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Zonas",  val: zonas.length,                  color: "text-[#333]",     bg: "bg-white" },
          { label: "Activas",      val: activasCount,                  color: "text-[#22C55E]",  bg: "bg-[#F0FDF4]" },
          { label: "Inactivas",    val: zonas.length - activasCount,   color: "text-[#EF4444]",  bg: "bg-[#FEF2F2]" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} rounded-xl border border-[#E5E5E0] p-4 text-center`}>
            <p className={`text-2xl font-bold ${c.color}`}>{c.val}</p>
            <p className="text-xs text-[#999] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Searchbar */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar zonas..."
            className="w-full pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X size={12} className="text-[#999]" />
            </button>
          )}
        </div>
        <span className="text-sm text-[#999]">{filtered.length} zona{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Loading */}
      {zonasLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={22} className="animate-spin text-[#14B8A6]" />
          <span className="ml-2 text-sm text-[#999]">Cargando zonas...</span>
        </div>
      )}

      {/* Tabla */}
      {!zonasLoading && (
        <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
                {["Nombre", "Descripción", "Bancas", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#555] text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-[#999]">No se encontraron zonas</td>
                </tr>
              ) : (
                filtered.map((z, ri) => (
                  <tr key={z.id} className={`border-b border-[#F5F5F0] ${ri % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                    <td className="px-4 py-3 font-semibold text-[#333]">
                      {editId === z.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditId(null); }}
                            className="border border-[#E5E5E0] rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#14B8A6]"
                            autoFocus
                          />
                          <button onClick={saveEdit} disabled={saving} className="p-1 rounded-md bg-[#14B8A6] text-white hover:bg-[#0F766E]">
                            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1 rounded-md bg-[#EF4444] text-white">
                            <X size={13} />
                          </button>
                        </div>
                      ) : z.nombre}
                    </td>
                    <td className="px-4 py-3 text-[#666] text-sm">{z.descripcion || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-[#14B8A6]">
                        <Building2 size={12} /> {bancasPorZona(z.id)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActivo(z)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          z.is_active
                            ? "bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]"
                            : "bg-[#F9FAFB] text-[#999] border border-[#E5E5E0] hover:bg-[#F3F4F6]"
                        }`}
                      >
                        <Power size={10} /> {z.is_active ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(z)} className="p-1.5 rounded-lg text-[#666] hover:text-[#14B8A6] hover:bg-[#E0F7F5]" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(z)} className="p-1.5 rounded-lg text-[#666] hover:text-[#EF4444] hover:bg-[#FEE2E2]" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-[#F0F0EB] border-t border-[#E5E5E0]">
                <td colSpan={2} className="px-4 py-2.5 text-xs font-semibold text-[#555]">Totales</td>
                <td className="px-4 py-2.5 text-xs font-semibold text-[#14B8A6]">{bancas.length} bancas</td>
                <td colSpan={2} className="px-4 py-2.5 text-xs text-[#999]">{activasCount} activas</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Modal Crear Zona */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#333]">Crear Zona</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-[#F5F5F0]"><X size={15} className="text-[#666]" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#999] font-medium">Nombre *</label>
                  <input value={newNombre} onChange={(e) => setNewNombre(e.target.value)} placeholder="Ej: Bronx"
                    className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
                </div>
                <div>
                  <label className="text-xs text-[#999] font-medium">Descripción</label>
                  <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descripción opcional"
                    className="w-full mt-1 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
                </div>
                {errMsg && <p className="text-xs text-red-500 font-medium">{errMsg}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-sm border border-[#E5E5E0] rounded-xl hover:bg-[#F5F5F0]">Cancelar</button>
                <button
                  onClick={addZona}
                  disabled={!newNombre.trim() || saving}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    newNombre.trim() && !saving ? "bg-[#14B8A6] text-white hover:bg-[#0F766E]" : "bg-[#E5E5E0] text-[#999] cursor-not-allowed"
                  }`}
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                  {saving ? "Guardando..." : "Crear Zona"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#333]">Eliminar zona</h3>
              <p className="text-sm text-[#666]">¿Eliminar <strong>"{deleteTarget.nombre}"</strong>? Esta acción no se puede deshacer.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 text-sm border border-[#E5E5E0] rounded-xl hover:bg-[#F5F5F0]">Cancelar</button>
                <button
                  onClick={() => handleDelete(deleteTarget.id)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626]"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                  {saving ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
