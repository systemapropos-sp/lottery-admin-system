// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, RefreshCw, Inbox, Plus, X, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { supabase, BUSINESS_ID } from "@/lib/supabase";
import { toast, Toaster } from "sonner";

const today = new Date().toISOString().split("T")[0];
const weekAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
const fmt = (n: number) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

interface GrupoRow {
  grupoId: string;
  grupoNombre: string;
  fecha: string;
  creadoPor: string;
  totalDebitos: number;
  totalCreditos: number;
  transacciones: any[];
}

interface FilaGrupo { concepto: string; entidad1: string; entidad2: string; debito: string; credito: string; notas: string; }

export default function ListaPorGrupos() {
  const [grupos, setGrupos] = useState<GrupoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [desde, setDesde] = useState(weekAgo);
  const [hasta, setHasta] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filas, setFilas] = useState<FilaGrupo[]>([
    { concepto: "", entidad1: "", entidad2: "", debito: "", credito: "", notas: "" },
  ]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("accountable_transactions")
        .select("*")
        .eq("business_id", BUSINESS_ID)
        .gte("date", desde)
        .lte("date", hasta)
        .not("group_id", "is", null)
        .order("date", { ascending: false })
        .limit(1000);

      const raw = data || [];
      const map = new Map<string, any[]>();
      raw.forEach(t => {
        const key = t.group_id || `no-group-${t.id}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      });

      const rows: GrupoRow[] = Array.from(map.entries()).map(([gId, txs]) => ({
        grupoId: gId,
        grupoNombre: txs[0].group_name || `Grupo ${gId.slice(0, 8)}`,
        fecha: txs[0].date || "—",
        creadoPor: txs[0].created_by || "—",
        totalDebitos: txs.filter(t => (t.amount || 0) < 0).reduce((s, t) => s + Math.abs(t.amount || 0), 0),
        totalCreditos: txs.filter(t => (t.amount || 0) >= 0).reduce((s, t) => s + (t.amount || 0), 0),
        transacciones: txs,
      }));
      setGrupos(rows);
    } catch { setGrupos([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const addFila = () => setFilas(f => [...f, { concepto: "", entidad1: "", entidad2: "", debito: "", credito: "", notas: "" }]);
  const removeFila = (i: number) => setFilas(f => f.filter((_, idx) => idx !== i));
  const updateFila = (i: number, k: keyof FilaGrupo, v: string) =>
    setFilas(f => f.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const handleSave = async () => {
    const valid = filas.filter(f => f.concepto.trim() && (f.debito || f.credito));
    if (valid.length === 0) { toast.error("Añade al menos una fila con concepto y monto"); return; }
    setSaving(true);
    try {
      const groupId = `grp-${Date.now()}`;
      const groupName = valid[0].concepto;
      const rows = valid.map(f => ({
        business_id: BUSINESS_ID,
        group_id: groupId,
        group_name: groupName,
        date: today,
        type: f.debito ? "PAGO" : "COBRO",
        description: f.concepto,
        entity_name: f.entidad1 || f.entidad2 || "—",
        amount: f.debito ? -(parseFloat(f.debito) || 0) : (parseFloat(f.credito) || 0),
        notes: f.notas,
        created_by: "admin",
      }));
      const { error } = await supabase.from("accountable_transactions").insert(rows);
      if (error) { toast.error("Error al guardar: " + error.message); return; }
      toast.success(`Grupo creado con ${rows.length} transacciones`);
      setShowModal(false);
      setFilas([{ concepto: "", entidad1: "", entidad2: "", debito: "", credito: "", notas: "" }]);
      await load();
    } catch { toast.error("Error inesperado"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Toaster position="top-right" richColors />
      <PageHeader
        title="Transacciones por Grupos"
        subtitle="Transacciones › Lista por grupos"
        actions={
          <div className="flex gap-2">
            <button onClick={load} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105">
              <Plus className="w-4 h-4" /> Crear grupo
            </button>
          </div>
        }
      />

      {/* Date filter */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl p-4 flex items-center gap-3 flex-wrap"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
        <span className="text-[#94A3B8]">→</span>
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
        <button onClick={load} disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
          Filtrar
        </button>
      </motion.div>

      {/* Groups */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="bg-[#0F172A] py-3 px-4 flex gap-8">
          {["Fecha","Grupo","Creado por","Débitos","Créditos","Acciones"].map(h => (
            <span key={h} className="text-[10px] font-bold text-white">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#94A3B8]">Cargando...</span>
          </div>
        ) : grupos.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-2">
            <Inbox className="w-8 h-8 text-[#CBD5E1]" />
            <p className="text-sm text-[#94A3B8]">No se encontraron grupos</p>
          </div>
        ) : (
          grupos.map((g) => {
            const exp = expandedGroups.has(g.grupoId);
            return (
              <div key={g.grupoId} className="border-b border-[#F1F5F9]">
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer"
                  onClick={() => toggleGroup(g.grupoId)}>
                  <span className="text-xs text-[#64748B] w-20 whitespace-nowrap">{g.fecha}</span>
                  <span className="text-xs font-semibold text-[#0F172A] flex-1">{g.grupoNombre}</span>
                  <span className="text-xs text-[#94A3B8] w-24">{g.creadoPor}</span>
                  <span className="text-xs font-mono text-red-500 w-24">{fmt(g.totalDebitos)}</span>
                  <span className="text-xs font-mono text-green-600 w-24">{fmt(g.totalCreditos)}</span>
                  <span className="ml-auto text-[#94A3B8]">
                    {exp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {exp && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden bg-[#F8FAFC]">
                      <table className="w-full text-xs border-t border-[#E2E8F0]">
                        <thead>
                          <tr className="bg-[#1E293B]">
                            {["Tipo","Descripción","Entidad","Monto","Notas"].map(h => (
                              <th key={h} className="py-2 px-4 text-left text-[10px] font-bold text-white">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.transacciones.map((t, ti) => (
                            <tr key={t.id || ti} className="border-b border-[#EEF2F7] hover:bg-white">
                              <td className="py-2 px-4 text-[#14B8A6] font-semibold">{t.type}</td>
                              <td className="py-2 px-4 text-[#64748B]">{t.description || "—"}</td>
                              <td className="py-2 px-4 text-[#0F172A]">{t.entity_name || "—"}</td>
                              <td className={`py-2 px-4 font-mono font-semibold ${(t.amount || 0) < 0 ? "text-red-500" : "text-green-600"}`}>
                                {fmt(Math.abs(t.amount || 0))}
                              </td>
                              <td className="py-2 px-4 text-[#94A3B8]">{t.notes || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Modal crear grupo */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#0F172A]">
              <h2 className="font-bold text-white text-base">Crear Grupo de Transacciones</h2>
              <button onClick={() => setShowModal(false)} className="text-[#94A3B8] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {["Concepto *","Entidad #1","Entidad #2","Débito","Crédito","Notas",""].map(h => (
                      <th key={h} className="py-2 px-3 text-left text-[10px] font-bold text-[#64748B] border border-[#E2E8F0]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f, i) => (
                    <tr key={i}>
                      {(["concepto","entidad1","entidad2","debito","credito","notas"] as const).map(k => (
                        <td key={k} className="border border-[#E2E8F0] p-1">
                          <input value={f[k]} onChange={e => updateFila(i, k, e.target.value)}
                            placeholder={k === "debito" || k === "credito" ? "0.00" : ""}
                            type={k === "debito" || k === "credito" ? "number" : "text"}
                            className="w-full px-2 py-1.5 text-xs border-0 focus:outline-none rounded" />
                        </td>
                      ))}
                      <td className="border border-[#E2E8F0] p-1 text-center">
                        {filas.length > 1 && (
                          <button onClick={() => removeFila(i)} className="text-red-400 hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addFila}
                className="mt-3 flex items-center gap-1 text-xs text-[#14B8A6] font-semibold hover:underline">
                <Plus className="w-3.5 h-3.5" /> Añadir fila
              </button>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]">Cancelar</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
