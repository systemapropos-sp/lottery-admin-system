import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools, zones, lotteries } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const tabs = ["Configuracion", "Pies de pagina", "Premios & Comisiones", "Sorteos"];

interface ToggleParam {
  label: string;
  enabled: boolean;
}

const initialParams: ToggleParam[] = [
  { label: "Balance de desactivacion", enabled: false },
  { label: "Limite venta diaria", enabled: false },
  { label: "Imprimir copia", enabled: true },
  { label: "Activa", enabled: true },
  { label: "Control tickets ganadores", enabled: false },
  { label: "Usar premios normalizados", enabled: false },
  { label: "Permitir pasar bote", enabled: false },
  { label: "Minutos para cancelar", enabled: true },
  { label: "Tickets a cancelar", enabled: true },
  { label: "Idioma", enabled: true },
  { label: "Modo impresion", enabled: true },
  { label: "Proveedor descuento", enabled: false },
  { label: "Permitir cambiar contrasena", enabled: true },
];

export default function EdicionMasiva() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedZone, setSelectedZone] = useState("Todas");
  const [params, setParams] = useState<ToggleParam[]>(initialParams);
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(new Set(bettingPools.map((bp) => bp.id)));
  const [selectedLotteries, setSelectedLotteries] = useState<Set<string>>(new Set());

  const toggleParam = (idx: number) => {
    setParams((prev) => prev.map((p, i) => (i === idx ? { ...p, enabled: !p.enabled } : p)));
  };

  const toggleBank = (id: string) => {
    setSelectedBanks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLottery = (id: string) => {
    setSelectedLotteries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllBanks = () => setSelectedBanks(new Set(bettingPools.map((bp) => bp.id)));
  const deselectAllBanks = () => setSelectedBanks(new Set());

  const selectAllLotteries = () => setSelectedLotteries(new Set(lotteries.map((l) => l.id)));
  const deselectAllLotteries = () => setSelectedLotteries(new Set());

  const filteredPools = useMemo(() => {
    if (selectedZone === "Todas") return bettingPools;
    const zone = zones.find((z) => z.name === selectedZone);
    return zone ? bettingPools.filter((bp) => bp.zoneId === zone.id) : bettingPools;
  }, [selectedZone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Edicion masiva de Bancas"
        subtitle="Actualice la configuracion de multiples bancas simultaneamente"
      />

      {/* Zone Filter */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#333333]">Zona:</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
          >
            <option>Todas</option>
            {zones.map((z) => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </select>
          <span className="text-sm text-[#999999] ml-2">
            {filteredPools.length} bancas seleccionadas
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#E5E5E0] overflow-x-auto">
          <div className="flex">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === idx
                    ? "text-[#4ECDC4] border-[#4ECDC4]"
                    : "text-[#999999] border-transparent hover:text-[#666666]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="p-5"
          >
            {activeTab === 0 && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-[#333333]">Parametros de configuracion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {params.map((param, idx) => (
                    <div key={param.label} className="flex items-center justify-between py-2 border-b border-[#F0F0EB]">
                      <span className="text-sm text-[#333333]">{param.label}</span>
                      <button
                        onClick={() => toggleParam(idx)}
                        className={`relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-200 ${
                          param.enabled ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                        }`}
                      >
                        <span
                          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
                            param.enabled ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bank Selection */}
                <div className="border-t border-[#E5E5E0] pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#333333]">Bancas a actualizar</h3>
                    <div className="flex gap-2">
                      <button onClick={selectAllBanks} className="text-xs text-[#4ECDC4] hover:underline">Seleccionar todas</button>
                      <button onClick={deselectAllBanks} className="text-xs text-[#999999] hover:underline">Deseleccionar</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto border border-[#E5E5E0] rounded-lg p-3">
                    {filteredPools.map((bp) => (
                      <label
                        key={bp.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#FAFAF8] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBanks.has(bp.id)}
                          onChange={() => toggleBank(bp.id)}
                          className="rounded text-[#4ECDC4] focus:ring-[#4ECDC4]"
                        />
                        <span className="text-sm text-[#333333] truncate">{bp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-4 max-w-lg">
                <h3 className="text-sm font-semibold text-[#333333]">Pies de pagina</h3>
                {["Pie de pagina ticket", "Pie de pagina web", "Pie de pagina movil", "Mensaje de agradecimiento"].map((label) => (
                  <div key={label}>
                    <label className="block text-sm text-[#666666] mb-1">{label}</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] resize-none"
                      placeholder={`Texto de ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#333333]">Premios & Comisiones</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Quiniela", "Pale", "Tripleta", "Super Pale", "Combo"].map((tipo) => (
                    <div key={tipo} className="bg-[#FAFAF8] rounded-lg p-3 border border-[#E5E5E0]">
                      <label className="block text-sm font-medium text-[#333333] mb-1">{tipo}</label>
                      <input type="number" defaultValue={85} className="w-full px-2 py-1.5 border border-[#E5E5E0] rounded text-sm font-mono" />
                      <span className="text-xs text-[#999999] mt-1 block">Multiplicador</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#333333]">Sorteos disponibles</h3>
                  <div className="flex gap-2">
                    <button onClick={selectAllLotteries} className="text-xs text-[#4ECDC4] hover:underline">Seleccionar todos</button>
                    <button onClick={deselectAllLotteries} className="text-xs text-[#999999] hover:underline">Deseleccionar</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {lotteries.map((lot) => (
                    <label
                      key={lot.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E0] hover:bg-[#FAFAF8] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLotteries.has(lot.id)}
                        onChange={() => toggleLottery(lot.id)}
                        className="rounded text-[#4ECDC4] focus:ring-[#4ECDC4]"
                      />
                      <span className="text-sm text-[#333333] truncate">{lot.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2.5 bg-white border border-[#E5E5E0] text-[#333333] rounded-full text-sm font-medium hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-all duration-200">
          Actualizar valores generales
        </button>
        <button className="px-6 py-2.5 bg-[#4ECDC4] text-white rounded-full text-sm font-medium hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_2px_8px_rgba(78,205,196,0.3)]">
          Actualizar
        </button>
      </div>
    </motion.div>
  );
}
