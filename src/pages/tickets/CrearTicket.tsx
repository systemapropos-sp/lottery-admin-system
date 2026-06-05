import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, HelpCircle, Copy, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries, lotteriesByDrawTime, bettingPools } from "@/data/mockData";
import type { DrawTime } from "@/data/mockData";

interface PlayRow {
  id: string;
  numero: string;
  monto: string;
  montoB?: string;
}

const drawTimes: DrawTime[] = ["10AM", "1PM", "6PM", "9PM"];

const playSections = [
  { key: "directo", title: "Directo", fields: [{ key: "monto", label: "Monto", width: "w-32" }] },
  { key: "pale", title: "Pale & Tripleta", fields: [{ key: "monto", label: "Monto", width: "w-32" }] },
  { key: "cash3", title: "Cash 3", fields: [{ key: "montoS", label: "S", width: "w-24" }, { key: "montoB", label: "B", width: "w-24" }] },
  { key: "play4", title: "Play 4 & Pick 5", fields: [{ key: "montoS", label: "S", width: "w-24" }, { key: "montoB", label: "B", width: "w-24" }] },
];

function usePlaySection() {
  const [rows, setRows] = useState<PlayRow[]>([{ id: crypto.randomUUID(), numero: "", monto: "" }]);
  const addRow = useCallback(() => setRows((prev) => [...prev, { id: crypto.randomUUID(), numero: "", monto: "" }]), []);
  const removeRow = useCallback((id: string) => setRows((prev) => prev.filter((r) => r.id !== id)), []);
  const updateRow = useCallback((id: string, field: keyof PlayRow, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);
  const getTotal = useCallback(() => rows.reduce((s, r) => s + (parseFloat(r.monto) || 0) + (parseFloat(r.montoB ?? "") || 0), 0), [rows]);
  const getCount = useCallback(() => rows.filter((r) => r.numero && r.monto).length, [rows]);
  return { rows, addRow, removeRow, updateRow, getTotal, getCount };
}

export default function CrearTicket() {
  const [selectedBanca, setSelectedBanca] = useState("");
  const [selectedLotteries, setSelectedLotteries] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const directo = usePlaySection();
  const pale = usePlaySection();
  const cash3 = usePlaySection();
  const play4 = usePlaySection();

  const totalJugadas = directo.getCount() + pale.getCount() + cash3.getCount() + play4.getCount();
  const totalAmount = directo.getTotal() + pale.getTotal() + cash3.getTotal() + play4.getTotal();

  const toggleLottery = (id: string) => {
    setSelectedLotteries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs = ["Jugadas del dia", "Vendido en grupo", "Vendido en banca", "Mult. lot"];

  const renderSection = (section: typeof playSections[0], ctrl: ReturnType<typeof usePlaySection>) => (
    <div key={section.key} className="mb-6">
      <h3 className="text-sm font-semibold text-[#333333] uppercase tracking-wider mb-3">{section.title}</h3>
      <div className="border border-[#E5E5E0] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5] text-[#666666]">
              <th className="px-3 py-2 text-left font-medium w-24">Numero</th>
              {section.fields.map((f) => (
                <th key={f.key} className={`px-3 py-2 text-left font-medium ${f.width}`}>{f.label}</th>
              ))}
              <th className="px-3 py-2 text-right w-16">
                <button onClick={ctrl.addRow} className="p-1 rounded-md hover:bg-[#4ECDC4]/10 text-[#4ECDC4] transition-colors">
                  <Plus size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {ctrl.rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[#E8E8E3] bg-white hover:bg-[#FAFAF8]"
                >
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.numero}
                      onChange={(e) => ctrl.updateRow(row.id, "numero", e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-[#E5E5E0] rounded focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)] transition-colors font-mono"
                      placeholder="--"
                    />
                  </td>
                  {section.fields.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                      <input
                        type="number"
                        value={f.key === "montoB" ? row.montoB ?? "" : row.monto}
                        onChange={(e) => ctrl.updateRow(row.id, f.key === "montoB" ? "montoB" : "monto", e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-[#E5E5E0] rounded focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)] transition-colors font-mono"
                        placeholder="$0.00"
                        min={0}
                        step={0.01}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    {ctrl.rows.length > 1 && (
                      <button onClick={() => ctrl.removeRow(row.id)} className="p-1 rounded-md hover:bg-red-50 text-[#999999] hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Crear Ticket" subtitle="Crear un nuevo ticket de jugada" />

      {/* Banca */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-col gap-1.5 max-w-md">
          <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca *</label>
          <select
            value={selectedBanca}
            onChange={(e) => setSelectedBanca(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
          >
            <option value="">Seleccionar banca...</option>
            {bettingPools.map((bp) => (
              <option key={bp.id} value={bp.mwrCode}>{bp.mwrCode} - {bp.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Lottery Selection */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <legend className="text-sm font-semibold text-[#333333] uppercase tracking-wider">Seleccionar Loterias</legend>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLotteries(new Set(lotteries.map((l) => l.id)))}
              className="px-3 py-1.5 text-xs font-medium text-[#4ECDC4] border border-[#4ECDC4] rounded-full hover:bg-[#4ECDC4]/10 transition-colors"
            >
              Seleccionar todas
            </button>
            <button
              onClick={() => setSelectedLotteries(new Set())}
              className="px-3 py-1.5 text-xs font-medium text-[#999999] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {drawTimes.map((dt) => (
            <div key={dt}>
              <h4 className="text-xs font-semibold text-[#999999] uppercase tracking-wider mb-2">{dt}</h4>
              <div className="space-y-1.5">
                {lotteriesByDrawTime[dt]?.map((lot) => (
                  <label
                    key={lot.id}
                    className="flex items-center gap-2.5 text-sm text-[#333333] cursor-pointer select-none hover:bg-[#F5F5F0] rounded-lg px-2 py-1.5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLotteries.has(lot.id)}
                      onChange={() => toggleLottery(lot.id)}
                      className="w-4 h-4 rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"
                    />
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: lot.color }} />
                    {lot.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}
        className="border-b border-[#E5E5E0] mb-4"
      >
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === i ? "text-[#4ECDC4] border-[#4ECDC4]" : "text-[#999999] border-transparent hover:text-[#666666]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Play Type Tables */}
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        {renderSection(playSections[0], directo)}
        {renderSection(playSections[1], pale)}
        {renderSection(playSections[2], cash3)}
        {renderSection(playSections[3], play4)}
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}
        className="sticky bottom-4 bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 z-10"
      >
        <div className="text-lg text-[#333333]">
          Jugadas: <span className="font-semibold">{totalJugadas}</span>
        </div>
        <div className="text-2xl font-bold font-mono text-[#4ECDC4]">
          Total: ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors flex items-center gap-2">
            <Copy size={16} /> Duplicar
          </button>
          <button className="px-8 py-3 text-sm font-semibold text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <CheckCircle2 size={18} /> Crear ticket
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="p-2.5 text-sm font-medium text-[#999999] hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-full transition-colors"
            title="Ayuda"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </motion.div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Ayuda - Crear Ticket</h3>
            <p className="text-sm text-[#666666] mb-2">1. Seleccione la banca donde se registrara el ticket.</p>
            <p className="text-sm text-[#666666] mb-2">2. Seleccione las loterias en las que desea jugar.</p>
            <p className="text-sm text-[#666666] mb-2">3. Ingrese los numeros y montos para cada tipo de jugada.</p>
            <p className="text-sm text-[#666666] mb-4">4. Presione "Crear ticket" para generar el ticket.</p>
            <button
              onClick={() => setShowHelp(false)}
              className="px-5 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
