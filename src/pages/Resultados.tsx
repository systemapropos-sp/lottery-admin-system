import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Save, Trophy, Calendar } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries } from "@/data/mockData";

interface ResultEntry {
  lotteryId: string;
  lotteryName: string;
  color: string;
  numbers: string[];
  locked: boolean;
}

interface ResultLog {
  id: string;
  fecha: string;
  sorteo: string;
  usuario: string;
  accion: string;
  anterior: string;
  nuevo: string;
}

function generateInitialResults(): ResultEntry[] {
  return lotteries.map((lot) => ({
    lotteryId: lot.id,
    lotteryName: lot.name,
    color: lot.color,
    numbers: lot.id === "lot-001" ? ["12", "34", "56", "", ""] : ["", "", "", "", ""],
    locked: false,
  }));
}

function generateResultLogs(): ResultLog[] {
  return [
    { id: "log-001", fecha: "2024-05-15T10:15:00Z", sorteo: "Anguila 10AM", usuario: "mmwrduser", accion: "Creo", anterior: "-", nuevo: "12-34-56" },
    { id: "log-002", fecha: "2024-05-15T10:20:00Z", sorteo: "Anguila 10AM", usuario: "mmwrduser", accion: "Modifico", anterior: "12-34-56", nuevo: "12-34-57" },
    { id: "log-003", fecha: "2024-05-15T13:10:00Z", sorteo: "LOTEDOM", usuario: "sfm056", accion: "Creo", anterior: "-", nuevo: "44-55-66" },
    { id: "log-004", fecha: "2024-05-14T18:30:00Z", sorteo: "Anguila 6PM", usuario: "mmwrduser", accion: "Bloqueo", anterior: "45-67-89", nuevo: "45-67-89" },
    { id: "log-005", fecha: "2024-05-14T21:05:00Z", sorteo: "Anguila 9PM", usuario: "vale", accion: "Modifico", anterior: "01-02-03", nuevo: "01-02-04" },
    { id: "log-006", fecha: "2024-05-13T10:30:00Z", sorteo: "LA PRIMERA", usuario: "mmwrduser", accion: "Creo", anterior: "-", nuevo: "11-22-33" },
  ];
}

const accionConfig: Record<string, string> = {
  "Creo": "bg-blue-100 text-blue-800",
  "Modifico": "bg-amber-100 text-amber-800",
  "Bloqueo": "bg-green-100 text-green-800",
};

export default function Resultados() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [results, setResults] = useState<ResultEntry[]>(generateInitialResults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const tabs = ["Manejar resultados", "Logs de resultados"];

  const updateNumber = (lotteryId: string, idx: number, value: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.lotteryId === lotteryId && !r.locked ? { ...r, numbers: r.numbers.map((n, i) => (i === idx ? value.slice(0, 2) : n)) } : r
      )
    );
    setSaved(false);
  };

  const toggleLock = (lotteryId: string) => {
    setResults((prev) => prev.map((r) => (r.lotteryId === lotteryId ? { ...r, locked: !r.locked } : r)));
  };

  const handleUnlockAll = () => {
    setResults((prev) => prev.map((r) => ({ ...r, locked: false })));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const handleProcessWinners = () => {
    setShowConfirm(true);
  };

  const confirmProcess = () => {
    setShowConfirm(false);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const logColumns = [
    {
      key: "fecha", header: "Fecha", accessor: (r: ResultLog) => r.fecha, sortable: true,
      formatter: (_v: unknown, r: ResultLog) => new Date(r.fecha).toLocaleString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    },
    { key: "sorteo", header: "Sorteo", accessor: (r: ResultLog) => r.sorteo, sortable: true },
    { key: "usuario", header: "Usuario", accessor: (r: ResultLog) => r.usuario, sortable: true },
    {
      key: "accion", header: "Accion", accessor: (r: ResultLog) => r.accion, sortable: true, align: "center" as const,
      cell: (r: ResultLog) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${accionConfig[r.accion] || "bg-gray-100"}`}>{r.accion}</span>,
    },
    {
      key: "anterior", header: "Anterior", accessor: (r: ResultLog) => r.anterior, sortable: true, align: "center" as const,
      cell: (r: ResultLog) => r.anterior === "-" ? <span className="text-[#CCCCCC]">-</span> : <span className="text-red-500 line-through font-mono text-sm">{r.anterior}</span>,
    },
    {
      key: "nuevo", header: "Nuevo", accessor: (r: ResultLog) => r.nuevo, sortable: true, align: "center" as const,
      cell: (r: ResultLog) => <span className="text-green-600 font-semibold font-mono text-sm">{r.nuevo}</span>,
    },
  ];

  const logFilters = (
    <div className="flex flex-wrap items-end gap-4 mb-4">
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Fecha</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Resultados" subtitle="Gestion de resultados de loterias" />

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="border-b border-[#E5E5E0] mb-4">
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === i ? "text-[#4ECDC4] border-[#4ECDC4]" : "text-[#999999] border-transparent hover:text-[#666666]"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 0 ? (
          <motion.div key="manage"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
          >
            {/* Date + Unlock */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Fecha</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
              </div>
              <button onClick={handleUnlockAll}
                className="px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors flex items-center gap-2 mt-5">
                <Unlock size={16} /> Desbloquear
              </button>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-600 text-sm font-medium mt-5">
                  Guardado exitosamente!
                </motion.span>
              )}
            </div>

            {/* Results Grid */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Sorteo</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">1ro</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">2do</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">3ro</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">4to</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">5to</th>
                      <th className="px-4 py-3 text-center border-b border-[#E8E8E3] w-[60px]">Lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, idx) => (
                      <motion.tr
                        key={r.lotteryId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.025, duration: 0.2 }}
                        className={`border-b border-[#E8E8E3] transition-colors ${r.locked ? "bg-gray-50/50" : "bg-white hover:bg-[#F0F8F7]"}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.span
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ delay: idx * 0.025 + 0.3, duration: 0.4 }}
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: r.color }}
                            />
                            <span className={`text-sm ${r.locked ? "text-[#999999]" : "text-[#333333]"}`}>{r.lotteryName}</span>
                          </div>
                        </td>
                        {r.numbers.map((num, i) => (
                          <td key={i} className="px-2 py-2">
                            <input
                              type="text"
                              value={num}
                              onChange={(e) => updateNumber(r.lotteryId, i, e.target.value.replace(/\D/g, ""))}
                              disabled={r.locked}
                              maxLength={2}
                              className={`w-[48px] h-[40px] text-center text-lg font-mono border-b-2 rounded-t bg-white focus:outline-none transition-colors ${
                                r.locked
                                  ? "border-[#E5E5E0] text-[#999999] bg-gray-100 cursor-not-allowed"
                                  : num
                                  ? "border-green-500 focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)]"
                                  : "border-[#E5E5E0] focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)]"
                              }`}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => toggleLock(r.lotteryId)}
                            className={`p-1.5 rounded-md transition-all duration-200 ${
                              r.locked
                                ? "text-green-500 hover:bg-green-50"
                                : "text-amber-500 hover:bg-amber-50"
                            }`}
                            title={r.locked ? "Desbloquear" : "Bloquear"}
                          >
                            {r.locked ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Guardando..." : "Guardar resultados"}
              </button>
              <button
                onClick={handleProcessWinners}
                disabled={saving}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#EF4444] rounded-full hover:bg-[#DC2626] hover:shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Trophy size={18} />
                Procesar ganadores
              </button>
            </motion.div>

            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold text-[#333333] mb-2">Confirmar procesamiento</h3>
                  <p className="text-sm text-[#666666] mb-4">
                    Esto calculara todos los ganadores para los resultados ingresados. Esta accion no se puede deshacer.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowConfirm(false)}
                      className="px-5 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-colors">
                      Cancelar
                    </button>
                    <button onClick={confirmProcess}
                      className="px-5 py-2 text-sm font-medium text-white bg-[#EF4444] rounded-full hover:bg-[#DC2626] transition-colors">
                      Continuar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="logs"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
          >
            {logFilters}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <DataTable columns={logColumns} data={generateResultLogs()} keyExtractor={(r) => r.id} pageSize={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
