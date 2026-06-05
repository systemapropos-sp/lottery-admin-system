import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Save } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/switch";

interface ToggleInputState {
  enabled: boolean;
  value: string;
}

interface AutomaticLimits {
  // Por numero
  directoDia: ToggleInputState;
  paleDiaMes: ToggleInputState;
  superPaleDiaMes: ToggleInputState;
  // Por linea (bancas)
  lineaDirectoDia: ToggleInputState;
  lineaPaleDiaMes: ToggleInputState;
  lineaSuperPaleDiaMes: ToggleInputState;
}

const initialLimits: AutomaticLimits = {
  directoDia: { enabled: false, value: "500" },
  paleDiaMes: { enabled: false, value: "300" },
  superPaleDiaMes: { enabled: false, value: "200" },
  lineaDirectoDia: { enabled: false, value: "1000" },
  lineaPaleDiaMes: { enabled: false, value: "600" },
  lineaSuperPaleDiaMes: { enabled: false, value: "400" },
};

type TabKey = "general" | "bloqueo";

export default function LimitesAutomaticos() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [limits, setLimits] = useState<AutomaticLimits>(initialLimits);
  const [saved, setSaved] = useState(false);

  // Bloqueo aleatorio state
  const [randomBlockPercent, setRandomBlockPercent] = useState("10");
  const [randomStartTime, setRandomStartTime] = useState("09:00");
  const [randomEndTime, setRandomEndTime] = useState("21:00");
  const [randomEnabled, setRandomEnabled] = useState(false);

  function updateLimit(key: keyof AutomaticLimits, field: "enabled" | "value", val: boolean | string) {
    setLimits((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "bloqueo", label: "Bloqueo Aleatorio" },
  ];

  const ToggleInput = ({
    label,
    limitKey,
  }: {
    label: string;
    limitKey: keyof AutomaticLimits;
  }) => {
    const st = limits[limitKey];
    return (
      <div className="flex items-center gap-4 py-3 border-b border-[#F0F0EB] last:border-0">
        <Switch
          checked={st.enabled}
          onCheckedChange={(v) => updateLimit(limitKey, "enabled", v)}
        />
        <span className="text-sm text-[#333333] flex-1 min-w-[200px]">{label}</span>
        <AnimatePresence>
          {st.enabled && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -10 }}
              animate={{ opacity: 1, width: "auto", x: 0 }}
              exit={{ opacity: 0, width: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <input
                type="number"
                value={st.value}
                onChange={(e) => updateLimit(limitKey, "value", e.target.value)}
                className="w-28 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
                placeholder="Monto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Limites Automaticos" subtitle="Configurar controles automaticos de limites" />

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-1 border-b border-[#E5E5E0] mb-6"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key ? "text-[#4ECDC4]" : "text-[#999999] hover:text-[#666666]"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="limites-automaticos-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "general" && (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Por numero */}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-[#333333] mb-2">
                Controles automaticos generales por numero
              </h3>
              <p className="text-xs text-[#666666] mb-4">
                Estos limites aplican a nivel global para todos los numeros jugados.
              </p>
              <ToggleInput label="Habilitar directo (dia)" limitKey="directoDia" />
              <ToggleInput label="Habilitar pale (dia-mes)" limitKey="paleDiaMes" />
              <ToggleInput label="Habilitar super pale (dia-mes)" limitKey="superPaleDiaMes" />
            </div>

            {/* Por linea */}
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-semibold text-[#333333] mb-2">
                Controles automaticos de linea para bancas
              </h3>
              <p className="text-xs text-[#666666] mb-4">
                Estos limites aplican por cada linea/banca individual.
              </p>
              <ToggleInput label="Habilitar directo (dia)" limitKey="lineaDirectoDia" />
              <ToggleInput label="Habilitar pale (dia-mes)" limitKey="lineaPaleDiaMes" />
              <ToggleInput label="Habilitar super pale (dia-mes)" limitKey="lineaSuperPaleDiaMes" />
            </div>
          </motion.div>
        )}

        {activeTab === "bloqueo" && (
          <motion.div
            key="bloqueo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-[600px]"
          >
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
              <h3 className="text-base font-semibold text-[#333333]">
                Bloqueo Aleatorio de Numeros
              </h3>
              <p className="text-xs text-[#666666]">
                Configura el bloqueo aleatorio de numeros para gestionar el riesgo.
              </p>

              <div className="flex items-center gap-4">
                <Switch checked={randomEnabled} onCheckedChange={setRandomEnabled} />
                <span className="text-sm text-[#333333]">Habilitar bloqueo aleatorio</span>
              </div>

              <AnimatePresence>
                {randomEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                        Porcentaje de numeros a bloquear
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={randomBlockPercent}
                          onChange={(e) => setRandomBlockPercent(e.target.value)}
                          className="flex-1 accent-[#4ECDC4]"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={randomBlockPercent}
                          onChange={(e) => setRandomBlockPercent(e.target.value)}
                          className="w-20 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] text-center"
                        />
                        <span className="text-sm text-[#666666]">%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hora inicio</label>
                        <input
                          type="time"
                          value={randomStartTime}
                          onChange={(e) => setRandomStartTime(e.target.value)}
                          className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hora fin</label>
                        <input
                          type="time"
                          value={randomEndTime}
                          onChange={(e) => setRandomEndTime(e.target.value)}
                          className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-end gap-3 mt-8"
      >
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-[#22C55E] font-medium flex items-center gap-1"
          >
            <Check size={14} /> Configuracion guardada exitosamente
          </motion.span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Save size={14} />
          GUARDAR
        </button>
      </motion.div>
    </div>
  );
}
