// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Search, Download, Inbox } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { supabase, BUSINESS_ID } from "@/lib/supabase";
import { useBancasStore } from "@/store/bancasStore";

const today = new Date().toISOString().split("T")[0];
const weekAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

const TIPOS_TRANSACCION = [
  "AJUSTE","AJUSTE DE COMISION","BALANCE INICIAL","CAIDA","CAIDA ACUMULADA",
  "COBRO","CANCELAR RECARGA DE CLIENTE PERSONAL","COBRO DE EMPLEADO",
  "COBRO DE PRESTAMOS","CONSUMO AUTOMATICO DE BANCA","GASTOS",
  "GASTO AUTOMATICO DE GRUPO","INTERBANCARIO","PAGO","PAGO AUTOMATICO DE EMPLEADO",
  "PAGO DE EMPLEADO","PREMIO CANCELADO","PREMIO TRANSFERIDO",
  "RECARGA DE CLIENTE PERSONAL","RETIRO","RESULTADOS DE VENTA",
  "RETIRO DE CLIENTE PERSONAL","RETORNO DE TICKET EXPIRADO","SNAPSHOT","TRANSFERENCIA",
] as const;

const TIPOS_ENTIDAD = ["BANCA","BANCO","CAIDA ACUMULADA","CLIENTE PERSONAL","EMPLEADO","GRUPO","OTROS","SISTEMA","ZONA"] as const;

const fmt = (n: number) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function ListaTransacciones() {
  const { bancas } = useBancasStore();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(weekAgo);
  const [hasta, setHasta] = useState(today);
  const [tipoEntidad, setTipoEntidad] = useState("");
  const [entidad, setEntidad] = useState("");
  const [tipoTx, setTipoTx] = useState("");
  const [creadoPor, setCreadoPor] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);

  const load = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from("accountable_transactions")
        .select("*")
        .eq("business_id", BUSINESS_ID)
        .gte("date", desde)
        .lte("date", hasta)
        .order("date", { ascending: false })
        .limit(500);
      if (tipoTx) q = q.eq("type", tipoTx);
      if (creadoPor.trim()) q = q.ilike("created_by", `%${creadoPor.trim()}%`);
      const { data } = await q;
      setRows(data || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let r = rows;
    if (tipoEntidad) r = r.filter(x => (x.entity_type || "").toUpperCase() === tipoEntidad);
    if (entidad.trim()) r = r.filter(x =>
      (x.entity_name || "").toLowerCase().includes(entidad.toLowerCase()) ||
      (x.pool_name || "").toLowerCase().includes(entidad.toLowerCase())
    );
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter(x =>
        (x.entity_name || "").toLowerCase().includes(s) ||
        (x.type || "").toLowerCase().includes(s) ||
        (x.description || "").toLowerCase().includes(s) ||
        (x.created_by || "").toLowerCase().includes(s) ||
        String(x.amount || "").includes(s)
      );
    }
    return r;
  }, [rows, tipoEntidad, entidad, search]);

  const paginated = filtered.slice(0, perPage);

  const totDebit = filtered.filter(r => (r.amount || 0) < 0).reduce((s, r) => s + Math.abs(r.amount || 0), 0);
  const totCredit = filtered.filter(r => (r.amount || 0) >= 0).reduce((s, r) => s + (r.amount || 0), 0);

  const badgeClass = (type: string) => {
    const t = (type || "").toUpperCase();
    if (t === "COBRO" || t === "COBRO DE EMPLEADO") return "bg-green-100 text-green-700";
    if (t === "PAGO" || t === "PAGO DE EMPLEADO") return "bg-red-100 text-red-600";
    if (t === "AJUSTE") return "bg-blue-100 text-blue-700";
    if (t === "GASTOS") return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader
        title="Transacciones"
        subtitle="Transacciones › Lista"
        actions={
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </button>
        }
      />

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl p-5 space-y-4"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Desde</label>
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Hasta</label>
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Tipo entidad</label>
            <select value={tipoEntidad} onChange={e => setTipoEntidad(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6] bg-white">
              <option value="">Todos</option>
              {TIPOS_ENTIDAD.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Entidad</label>
            <input value={entidad} onChange={e => setEntidad(e.target.value)} placeholder="Nombre..."
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Tipo tx</label>
            <select value={tipoTx} onChange={e => setTipoTx(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6] bg-white">
              <option value="">Todos</option>
              {TIPOS_TRANSACCION.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-1">Creado por</label>
            <input value={creadoPor} onChange={e => setCreadoPor(e.target.value)} placeholder="Usuario..."
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#14B8A6]" />
          </div>
        </div>
        <button onClick={load} disabled={loading}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
          Filtrar
        </button>
      </motion.div>

      {/* Table card */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Mostrando</span>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-[#E2E8F0] rounded-lg bg-white">
              {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
            </select>
            <span className="text-xs text-[#94A3B8]">entradas</span>
          </div>
          <div className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-2 py-1">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              className="text-xs focus:outline-none w-36" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F172A]">
                {["Fecha","Banca","Tipo","Descripción","Creado por","Débito","Crédito"].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-bold text-white whitespace-nowrap">{h}</th>
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
                    <p className="text-sm text-[#94A3B8]">No se encontraron transacciones</p>
                  </div>
                </td></tr>
              ) : (
                paginated.map((r, i) => {
                  const isDebit = (r.amount || 0) < 0;
                  return (
                    <tr key={r.id || i} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}>
                      <td className="py-2.5 px-4 text-xs text-[#64748B] whitespace-nowrap">{r.date || "—"}</td>
                      <td className="py-2.5 px-4 text-xs font-medium text-[#14B8A6]">{r.pool_name || r.entity_name || "—"}</td>
                      <td className="py-2.5 px-4 text-xs">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeClass(r.type)}`}>
                          {r.type || "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-[#64748B] max-w-[200px] truncate">{r.description || "—"}</td>
                      <td className="py-2.5 px-4 text-xs text-[#94A3B8]">{r.created_by || "—"}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-red-500">{isDebit ? fmt(Math.abs(r.amount)) : "—"}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-green-600">{!isDebit ? fmt(r.amount) : "—"}</td>
                    </tr>
                  );
                })
              )}
              {/* Totals */}
              {!loading && paginated.length > 0 && (
                <tr className="bg-[#1E293B]">
                  <td colSpan={5} className="py-2.5 px-4 text-xs font-bold text-white">TOTALES ({filtered.length} transacciones)</td>
                  <td className="py-2.5 px-4 text-xs font-mono font-bold text-red-300">{fmt(totDebit)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono font-bold text-green-300">{fmt(totCredit)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[#F1F5F9]">
          <span className="text-xs text-[#94A3B8]">
            {filtered.length === 0 ? "No hay entradas" : `Mostrando ${paginated.length} de ${filtered.length} entradas`}
          </span>
          {filtered.length > perPage && (
            <button onClick={() => setPerPage(p => p + 25)}
              className="px-3 py-1 rounded-lg border border-[#E2E8F0] text-xs text-[#14B8A6] font-semibold hover:bg-[#F0FDFB]">
              Cargar más
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
