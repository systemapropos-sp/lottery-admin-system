import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface PendingPool {
  id: string;
  name: string;
  mwrCode: string;
  users: string;
  pendingAmount: number;
  status: "pending" | "cleaning" | "cleaned";
}

export default function LimpiarPendientes() {
  const { bancas: bancasRaw } = useBancasZonas();
  const [activeTab, setActiveTab] = useState<"lista" | "reporte">("lista");
  const [pools, setPools] = useState<PendingPool[]>([]);

  const initialPools = useMemo<PendingPool[]>(
    () =>
      bancasRaw.slice(0, 10).map((bp) => ({
        id: bp.id,
        name: bp.name,
        mwrCode: bp.mwr_code,
        users: bp.code,
        pendingAmount: bp.balance > 0 ? bp.balance * 0.1 : 0,
        status: "pending" as const,
      })),
    [bancasRaw]
  );

  useEffect(() => {
    setPools(initialPools);
  }, [bancasRaw]); // eslint-disable-line react-hooks/exhaustive-deps

  const [reportDate, setReportDate] = useState({ start: "2024-05-01", end: "2024-05-15" });

  const handleClean = (id: string) => {
    setPools((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "cleaning" as const } : p))
    );
    setTimeout(() => {
      setPools((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "cleaned" as const } : p))
      );
    }, 1500);
  };

  const totalCleaned = pools.filter((p) => p.status === "cleaned").length;
  const totalAmount = pools
    .filter((p) => p.status === "cleaned")
    .reduce((sum, p) => sum + p.pendingAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Limpiar pendientes" subtitle="Gestion de pagos pendientes por banca" />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#E5E5E0]">
          <div className="flex">
            {(["lista", "reporte"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab === "lista" ? "Lista" : "Reporte"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {activeTab === "lista" && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                        <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Numero</th>
                        <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre</th>
                        <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Referencia</th>
                        <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Usuarios</th>
                        <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Monto pendiente</th>
                        <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {pools.map((pool, idx) => (
                          pool.status !== "cleaned" && (
                            <motion.tr
                              key={pool.id}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3, delay: idx * 0.03, ease: easeOut }}
                              className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                            >
                              <td className="px-4 py-3 text-[#666666]">{idx + 1}</td>
                              <td className="px-4 py-3 text-[#333333] font-medium">{pool.name}</td>
                              <td className="px-4 py-3 font-mono text-[13px] text-[#666666]">{pool.mwrCode}</td>
                              <td className="px-4 py-3 text-[#333333]">{pool.users}</td>
                              <td className="px-4 py-3 text-right font-mono text-[13px] text-[#333333]">
                                {pool.pendingAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {pool.status === "pending" && (
                                  <button
                                    onClick={() => handleClean(pool.id)}
                                    className="px-4 py-1.5 bg-[#EF4444] text-white rounded-full text-xs font-medium hover:bg-[#DC2626] transition-colors"
                                  >
                                    Limpiar
                                  </button>
                                )}
                                {pool.status === "cleaning" && (
                                  <div className="flex items-center justify-center gap-2 text-[#F59E0B]">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="text-xs">Limpiando...</span>
                                  </div>
                                )}
                              </td>
                            </motion.tr>
                          )
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                {pools.length > 0 && pools.every((p) => p.status === "cleaned") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-12 text-[#22C55E]"
                  >
                    <Check size={48} />
                    <p className="text-sm font-medium">Todos los pendientes han sido limpiados</p>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "reporte" && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">Fecha inicio</label>
                    <input
                      type="date"
                      value={reportDate.start}
                      onChange={(e) => setReportDate({ ...reportDate, start: e.target.value })}
                      className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">Fecha fin</label>
                    <input
                      type="date"
                      value={reportDate.end}
                      onChange={(e) => setReportDate({ ...reportDate, end: e.target.value })}
                      className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#FAFAF8] rounded-lg p-4 border border-[#E5E5E0]">
                    <p className="text-xs text-[#666666] uppercase">Total limpiados</p>
                    <p className="text-2xl font-semibold text-[#333333] mt-1">{totalCleaned}</p>
                  </div>
                  <div className="bg-[#FAFAF8] rounded-lg p-4 border border-[#E5E5E0]">
                    <p className="text-xs text-[#666666] uppercase">Monto total</p>
                    <p className="text-2xl font-semibold text-[#22C55E] mt-1">
                      {totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </p>
                  </div>
                  <div className="bg-[#FAFAF8] rounded-lg p-4 border border-[#E5E5E0]">
                    <p className="text-xs text-[#666666] uppercase">Pendientes</p>
                    <p className="text-2xl font-semibold text-[#F59E0B] mt-1">
                      {pools.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
