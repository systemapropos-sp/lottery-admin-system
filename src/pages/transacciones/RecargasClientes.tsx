// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Inbox, Trash2, Filter } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { supabase, BUSINESS_ID } from "@/lib/supabase";
import { toast, Toaster } from "sonner";

const today = new Date().toISOString().split("T")[0];
const weekAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
const fmt = (n: number) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function RecargasClientes() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(weekAgo);
  const [hasta, setHasta] = useState(today);
  const [nombre, setNombre] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("movil_transactions")
        .select("*")
        .eq("business_id", BUSINESS_ID)
        .eq("type", "recarga")
        .gte("created_at", desde)
        .lte("created_at", hasta + "T23:59:59")
        .order("created_at", { ascending: false })
        .limit(500);
      setRows(data || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let r = rows;
    if (nombre.trim()) r = r.filter(x =>
      (x.client_name || "").toLowerCase().includes(nombre.toLowerCase()) ||
      (x.client_code || "").toLowerCase().includes(nombre.toLowerCase())
    );
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter(x =>
        (x.client_name || "").toLowerCase().includes(s) ||
        (x.client_code || "").toLowerCase().includes(s) ||
        (x.banca_code || "").toLowerCase().includes(s) ||
        String(x.amount || "").includes(s)
      );
    }
    return r;
  }, [rows, nombre, search]);

  const paginated = filtered.slice(0, perPage);
  const totalAmount = filtered.reduce((s, r) => s + (r.amount || 0), 0);

  const handleDelete = async (row: any) => {
    if (!confirm(`¿Eliminar recarga de ${row.client_name || row.id}?`)) return;
    try {
      const { error } = await supabase.from("movil_transactions").delete().eq("id", row.id);
      if (error) { toast.error("Error al eliminar"); return; }
      toast.success("Recarga eliminada");
      setRows(prev => prev.filter(r => r.id !== row.id));
    } catch { toast.error("Error inesperado"); }
  };

  const statusBadge = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-500";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Toaster position="top-right" richColors />
      <PageHeader title="Recargas de Clientes" subtitle="Transacciones › Recargas clientes" />

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl p-5 space-y-4"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
          <span className="text-[#94A3B8]">→</span>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Nombre completo</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Buscar por nombre o código..."
            className="w-72 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
          <Filter className="w-4 h-4" /> Filtrar
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Mostrando</span>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-[#E2E8F0] rounded-lg bg-white">
              {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
            </select>
            <span className="text-xs text-[#94A3B8]">entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-2 py-1">
              <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
                className="text-xs focus:outline-none w-36" />
            </div>
            <button onClick={load} className="p-1.5 border border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:bg-[#F8FAFC]">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F172A]">
                {["Nombre completo","Código","Fecha","Monto","Banca","Estado","Eliminar"].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-bold text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[#94A3B8]">Cargando...</span>
                  </div>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="w-8 h-8 text-[#CBD5E1]" />
                    <p className="text-sm text-[#94A3B8]">No se encontraron recargas</p>
                  </div>
                </td></tr>
              ) : (
                paginated.map((r, i) => (
                  <tr key={r.id || i} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}>
                    <td className="py-2.5 px-4 text-xs font-medium text-[#0F172A]">{r.client_name || "—"}</td>
                    <td className="py-2.5 px-4 text-xs text-[#14B8A6] font-mono">{r.client_code || "—"}</td>
                    <td className="py-2.5 px-4 text-xs text-[#64748B] whitespace-nowrap">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString("es-ES") : "—"}
                    </td>
                    <td className="py-2.5 px-4 text-xs font-mono font-semibold text-green-600">{fmt(r.amount)}</td>
                    <td className="py-2.5 px-4 text-xs text-[#64748B]">{r.banca_code || r.banca_name || "—"}</td>
                    <td className="py-2.5 px-4 text-xs">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${statusBadge(r.status)}`}>
                        {r.status || "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <button onClick={() => handleDelete(r)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && paginated.length > 0 && (
                <tr className="bg-[#1E293B]">
                  <td colSpan={3} className="py-2.5 px-4 text-xs font-bold text-white">TOTAL ({filtered.length} recargas)</td>
                  <td className="py-2.5 px-4 text-xs font-mono font-bold text-green-300">{fmt(totalAmount)}</td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
          <span>{filtered.length === 0 ? "No hay entradas" : `Mostrando ${paginated.length} de ${filtered.length} entradas`}</span>
          {filtered.length > perPage && (
            <button onClick={() => setPerPage(p => p + 25)}
              className="px-3 py-1 rounded-lg border border-[#E2E8F0] text-[#14B8A6] font-semibold hover:bg-[#F0FDFB]">
              Cargar más
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
