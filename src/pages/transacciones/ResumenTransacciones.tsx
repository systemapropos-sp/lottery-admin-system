// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Inbox } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

const today = new Date().toISOString().split("T")[0];
const weekAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
const fmt = (n: number) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function ResumenTransacciones() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(weekAgo);
  const [hasta, setHasta] = useState(today);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("accountable_transactions")
        .select("*")
        .eq("business_id", BUSINESS_ID)
        .gte("date", desde)
        .lte("date", hasta)
        .limit(2000);
      setRows(data || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resumen = useMemo(() => {
    const map = new Map<string, { pool: string; cobros: number; pagos: number; debitoVentas: number; creditoVentas: number; rojoAlDia: number; }>();
    rows.forEach(t => {
      const key = t.pool_id || t.pool_name || t.entity_name || "N/A";
      if (!map.has(key)) map.set(key, { pool: t.pool_name || t.entity_name || key, cobros: 0, pagos: 0, debitoVentas: 0, creditoVentas: 0, rojoAlDia: 0 });
      const r = map.get(key)!;
      const type = (t.type || "").toUpperCase();
      if (type === "COBRO" || type === "COBRO DE EMPLEADO") r.cobros += Math.abs(t.amount || 0);
      else if (type === "PAGO" || type === "PAGO DE EMPLEADO") r.pagos += Math.abs(t.amount || 0);
      else if (type === "RESULTADOS DE VENTA") {
        if ((t.amount || 0) < 0) r.debitoVentas += Math.abs(t.amount || 0);
        else r.creditoVentas += t.amount || 0;
      }
    });
    return [...map.values()];
  }, [rows]);

  const totals = useMemo(() => ({
    cobros: resumen.reduce((s, r) => s + r.cobros, 0),
    pagos: resumen.reduce((s, r) => s + r.pagos, 0),
    neto: resumen.reduce((s, r) => s + (r.cobros - r.pagos), 0),
    debito: resumen.reduce((s, r) => s + r.debitoVentas, 0),
    credito: resumen.reduce((s, r) => s + r.creditoVentas, 0),
    netoVentas: resumen.reduce((s, r) => s + (r.creditoVentas - r.debitoVentas), 0),
    rojo: resumen.reduce((s, r) => s + r.rojoAlDia, 0),
  }), [resumen]);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader
        title="Resumen de Transacciones"
        subtitle="Transacciones › Resumen"
        actions={
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:brightness-105 disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </button>
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
          Actualizar
        </button>
      </motion.div>

      {/* Main table */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F172A]">
                <th rowSpan={2} className="py-3 px-4 text-left text-[10px] font-bold text-white align-middle">Banca/Entidad</th>
                <th colSpan={3} className="py-2 px-4 text-center text-[10px] font-bold text-white border-b border-white/20">Flujo de caja</th>
                <th colSpan={3} className="py-2 px-4 text-center text-[10px] font-bold text-white border-b border-white/20">Resultados de Ventas</th>
                <th rowSpan={2} className="py-3 px-4 text-left text-[10px] font-bold text-white align-middle whitespace-nowrap">Rojo al día</th>
              </tr>
              <tr className="bg-[#1E293B]">
                {["Cobros","Pagos","Neto","Débito","Crédito","Neto"].map(h => (
                  <th key={h} className="py-2 px-4 text-[10px] font-bold text-white text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[#94A3B8]">Cargando...</span>
                  </div>
                </td></tr>
              ) : resumen.length === 0 ? (
                <tr><td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="w-8 h-8 text-[#CBD5E1]" />
                    <p className="text-sm text-[#94A3B8]">No se encontraron datos</p>
                  </div>
                </td></tr>
              ) : (
                resumen.map((r, i) => {
                  const neto = r.cobros - r.pagos;
                  const netoVentas = r.creditoVentas - r.debitoVentas;
                  return (
                    <tr key={i} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}>
                      <td className="py-2.5 px-4 text-xs text-[#0F172A] font-medium">{r.pool}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-green-600 text-right">{fmt(r.cobros)}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-red-500 text-right">{fmt(r.pagos)}</td>
                      <td className={`py-2.5 px-4 text-xs font-mono font-bold text-right ${neto < 0 ? "text-red-600 bg-red-50" : "text-[#10B981] bg-green-50"}`}>{fmt(neto)}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-[#64748B] text-right">{fmt(r.debitoVentas)}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-[#64748B] text-right">{fmt(r.creditoVentas)}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-[#10B981] text-right bg-green-50">{fmt(netoVentas)}</td>
                      <td className="py-2.5 px-4 text-xs font-mono text-blue-500 text-right bg-blue-50">{fmt(r.rojoAlDia)}</td>
                    </tr>
                  );
                })
              )}
              {!loading && resumen.length > 0 && (
                <tr className="bg-[#1E293B]">
                  <td className="py-2.5 px-4 text-xs font-bold text-white">TOTALES</td>
                  <td className="py-2.5 px-4 text-xs font-mono font-bold text-green-300 text-right">{fmt(totals.cobros)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono font-bold text-red-300 text-right">{fmt(totals.pagos)}</td>
                  <td className={`py-2.5 px-4 text-xs font-mono font-bold text-right ${totals.neto < 0 ? "text-red-300" : "text-green-300"}`}>{fmt(totals.neto)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-[#94A3B8] text-right">{fmt(totals.debito)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-[#94A3B8] text-right">{fmt(totals.credito)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-green-300 text-right">{fmt(totals.netoVentas)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-blue-300 text-right">{fmt(totals.rojo)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom: Retiros + Ajustes */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0F172A]">
              <th className="py-3 px-4 text-center text-[10px] font-bold text-white">Retiros de efectivo</th>
              <th colSpan={2} className="py-3 px-4 text-center text-[10px] font-bold text-white border-l border-white/10">Ajustes</th>
            </tr>
            <tr className="bg-[#1E293B]">
              <th className="py-2 px-4 text-[10px] font-bold text-white"></th>
              <th className="py-2 px-4 text-[10px] font-bold text-white border-l border-white/10">Débito</th>
              <th className="py-2 px-4 text-[10px] font-bold text-white">Crédito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                rows.filter(r => (r.type || "").toUpperCase() === "RETIRO").reduce((s, r) => s + Math.abs(r.amount || 0), 0),
                rows.filter(r => (r.type || "").toUpperCase() === "AJUSTE" && (r.amount || 0) < 0).reduce((s, r) => s + Math.abs(r.amount || 0), 0),
                rows.filter(r => (r.type || "").toUpperCase() === "AJUSTE" && (r.amount || 0) >= 0).reduce((s, r) => s + (r.amount || 0), 0),
              ].map((v, i) => (
                <td key={i} className={`py-3 px-4 text-sm font-mono font-semibold text-center text-[#64748B] ${i > 0 ? "border-l border-[#E2E8F0]" : ""}`}>
                  {fmt(v)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
