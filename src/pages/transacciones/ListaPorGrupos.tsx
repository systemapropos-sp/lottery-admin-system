import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { transactions } from "@/data/mockData";

interface GrupoRow {
  grupoId: string;
  grupoNombre: string;
  fecha: string;
  creadoPor: string;
  totalDebitos: number;
  totalCreditos: number;
  transacciones: typeof transactions;
}

export default function ListaPorGrupos() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const grupos: GrupoRow[] = useMemo(() => {
    const grouped = new Map<string, typeof transactions>();
    transactions.forEach((t) => {
      const key = `${t.bettingPoolId}-${new Date(t.createdAt).toLocaleDateString("es-ES")}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(t);
    });

    return Array.from(grouped.entries()).map(([key, txs], idx) => {
      const d = new Date(txs[0].createdAt);
      const totalDebitos = txs.filter((t) => t.type === "PAGO").reduce((s, t) => s + t.amount, 0);
      const totalCreditos = txs.filter((t) => t.type === "COBRO").reduce((s, t) => s + t.amount, 0);
      return {
        grupoId: key,
        grupoNombre: `Grupo #${idx + 1} - ${txs[0].bettingPoolName}`,
        fecha: d.toLocaleDateString("es-ES"),
        creadoPor: txs[0].createdBy,
        totalDebitos,
        totalCreditos,
        transacciones: txs,
      };
    });
  }, []);

  const filteredGrupos = useMemo(() => {
    return grupos.filter((g) => {
      if (startDate) {
        const parts = g.fecha.split("/");
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (d < new Date(startDate)) return false;
      }
      if (endDate) {
        const parts = g.fecha.split("/");
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (d > new Date(endDate)) return false;
      }
      return true;
    });
  }, [grupos, startDate, endDate]);

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Transacciones por Grupos" subtitle="Vista agrupada de transacciones por banca y fecha" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Desde</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hasta</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grouped List */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="space-y-3">
        {filteredGrupos.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-12 text-center text-[#999999]">
            No hay grupos disponibles
          </div>
        ) : (
          filteredGrupos.map((grupo, gIdx) => (
            <motion.div
              key={grupo.grupoId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gIdx * 0.05 }}
              className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(grupo.grupoId)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div animate={{ rotate: expandedGroups.has(grupo.grupoId) ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={18} className="text-[#666666]" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-[#333333]">{grupo.grupoNombre}</h3>
                    <p className="text-xs text-[#666666] mt-0.5">{grupo.fecha} &middot; {grupo.transacciones.length} transacciones &middot; Creado por {grupo.creadoPor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#EF4444] font-medium">Debitos: ${grupo.totalDebitos.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  <span className="text-[#22C55E] font-medium">Creditos: ${grupo.totalCreditos.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  <span className="font-semibold text-[#333333]">Neto: ${(grupo.totalCreditos - grupo.totalDebitos).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </button>

              {/* Expanded Transactions */}
              <AnimatePresence>
                {expandedGroups.has(grupo.grupoId) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#E8E8E3]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                            <th className="px-5 py-2.5 text-left">Concepto</th>
                            <th className="px-5 py-2.5 text-left">Fecha</th>
                            <th className="px-5 py-2.5 text-left">Tipo</th>
                            <th className="px-5 py-2.5 text-right">Monto</th>
                            <th className="px-5 py-2.5 text-left">Notas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.transacciones.map((tx, tIdx) => (
                            <motion.tr
                              key={tx.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: tIdx * 0.02 }}
                              className="border-b border-[#E8E8E3] hover:bg-[#F0F8F7] transition-colors"
                            >
                              <td className="px-5 py-2.5 text-[#333333]">{tx.category}</td>
                              <td className="px-5 py-2.5 text-[#333333]">{new Date(tx.createdAt).toLocaleString("es-ES")}</td>
                              <td className="px-5 py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === "COBRO" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className={`px-5 py-2.5 text-right font-medium ${tx.type === "COBRO" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                                {tx.type === "COBRO" ? "+" : "-"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-5 py-2.5 text-[#666666]">{tx.notes || "-"}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
