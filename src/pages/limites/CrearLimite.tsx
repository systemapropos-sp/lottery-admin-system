import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries } from "@/data/mockData";

interface MontoState {
  directo: string;
  pale: string;
  tripleta: string;
  cash3Straight: string;
  cash3Box: string;
  play4Straight: string;
  play4Box: string;
  superPale: string;
  bolita1: string;
  bolita2: string;
  singulacion1: string;
  singulacion2: string;
  singulacion3: string;
  pick5Straight: string;
  pick5Box: string;
  cash3FrontStraight: string;
  cash3BackStraight: string;
  cash3FrontBox: string;
  cash3BackBox: string;
  pickTwoFront: string;
  pickTwoBack: string;
  pickTwoMiddle: string;
}

const DIAS = [
  { key: "monday", label: "Lun" },
  { key: "tuesday", label: "Mar" },
  { key: "wednesday", label: "Mie" },
  { key: "thursday", label: "Jue" },
  { key: "friday", label: "Vie" },
  { key: "saturday", label: "Sab" },
  { key: "sunday", label: "Dom" },
];

const initialMontos: MontoState = {
  directo: "", pale: "", tripleta: "",
  cash3Straight: "", cash3Box: "", play4Straight: "", play4Box: "",
  superPale: "", bolita1: "", bolita2: "",
  singulacion1: "", singulacion2: "", singulacion3: "",
  pick5Straight: "", pick5Box: "",
  cash3FrontStraight: "", cash3BackStraight: "", cash3FrontBox: "", cash3BackBox: "",
  pickTwoFront: "", pickTwoBack: "", pickTwoMiddle: "",
};

export default function CrearLimite() {
  const [tipoLimite, setTipoLimite] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [selectedSorteos, setSelectedSorteos] = useState<Set<string>>(new Set());
  const [montos, setMontos] = useState<MontoState>(initialMontos);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggleSorteo(id: string) {
    setSelectedSorteos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleDay(key: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAllDays() {
    if (selectedDays.size === DIAS.length) {
      setSelectedDays(new Set());
    } else {
      setSelectedDays(new Set(DIAS.map((d) => d.key)));
    }
  }

  function handleMontoChange(key: keyof MontoState, value: string) {
    setMontos((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }

  const montoField = (label: string, key: keyof MontoState) => (
    <div key={key} className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#666666]">{label}</label>
      <input
        type="number"
        value={montos[key]}
        onChange={(e) => handleMontoChange(key, e.target.value)}
        placeholder="0.00"
        className="w-full px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Crear Limite" subtitle="Configurar un nuevo limite de apuestas" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[900px] space-y-6"
      >
        {/* Tipo y Fecha */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo de Limite *</label>
              <select
                value={tipoLimite}
                onChange={(e) => setTipoLimite(e.target.value)}
                required
                className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
              >
                <option value="">Seleccionar tipo</option>
                <option value="numero">Por numero</option>
                <option value="linea">Por linea</option>
                <option value="banca">Por banca</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Fecha de expiracion</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
                <input
                  type="date"
                  value={fechaExpiracion}
                  onChange={(e) => setFechaExpiracion(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sorteos Grid */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-base font-semibold text-[#333333] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
            SORTEOS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lotteries.map((lot) => (
              <motion.button
                key={lot.id}
                type="button"
                onClick={() => toggleSorteo(lot.id)}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  selectedSorteos.has(lot.id)
                    ? "border-[#4ECDC4] bg-[#F0F8F7] shadow-sm"
                    : "border-[#E5E5E0] bg-white hover:bg-[#FAFAF8]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedSorteos.has(lot.id) ? "bg-[#4ECDC4] border-[#4ECDC4]" : "border-[#CCCCCC]"
                  }`}
                >
                  {selectedSorteos.has(lot.id) && <Check size={12} className="text-white" />}
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: lot.color }} />
                <span className="text-sm text-[#333333]">{lot.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="mt-3 text-xs text-[#999999]">
            {selectedSorteos.size} de {lotteries.length} sorteos seleccionados
          </div>
        </div>

        {/* Montos Grid */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-base font-semibold text-[#333333] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD93D]" />
            MONTOS MAXIMOS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {montoField("Directo", "directo")}
            {montoField("Pale", "pale")}
            {montoField("Tripleta", "tripleta")}
            {montoField("Cash3 S", "cash3Straight")}
            {montoField("Cash3 B", "cash3Box")}
            {montoField("Play4 S", "play4Straight")}
            {montoField("Play4 B", "play4Box")}
            {montoField("Super Pale", "superPale")}
            {montoField("Bolita 1", "bolita1")}
            {montoField("Bolita 2", "bolita2")}
            {montoField("Singulacion 1", "singulacion1")}
            {montoField("Singulacion 2", "singulacion2")}
            {montoField("Singulacion 3", "singulacion3")}
            {montoField("Pick5 S", "pick5Straight")}
            {montoField("Pick5 B", "pick5Box")}
            {montoField("Cash3 Front S", "cash3FrontStraight")}
            {montoField("Cash3 Back S", "cash3BackStraight")}
            {montoField("Cash3 Front B", "cash3FrontBox")}
            {montoField("Cash3 Back B", "cash3BackBox")}
            {montoField("Pick Two F", "pickTwoFront")}
            {montoField("Pick Two B", "pickTwoBack")}
            {montoField("Pick Two M", "pickTwoMiddle")}
          </div>
        </div>

        {/* Dias */}
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-base font-semibold text-[#333333] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#96CEB4]" />
            DIAS DE LA SEMANA
          </h3>
          <div className="flex flex-wrap gap-3 mb-3">
            {DIAS.map((dia) => (
              <motion.button
                key={dia.key}
                type="button"
                onClick={() => toggleDay(dia.key)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selectedDays.has(dia.key)
                    ? "border-[#4ECDC4] bg-[#F0F8F7] text-[#333333]"
                    : "border-[#E5E5E0] bg-white text-[#666666] hover:bg-[#FAFAF8]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedDays.has(dia.key) ? "bg-[#4ECDC4] border-[#4ECDC4]" : "border-[#CCCCCC]"
                  }`}
                >
                  {selectedDays.has(dia.key) && <Check size={10} className="text-white" />}
                </div>
                {dia.label}
              </motion.button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleAllDays}
            className="text-sm text-[#4ECDC4] hover:text-[#3DBDB5] font-medium transition-colors"
          >
            {selectedDays.size === DIAS.length ? "Deseleccionar todos" : "Seleccionar todos"}
          </button>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {submitted && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-[#22C55E] font-medium"
            >
              Limite creado exitosamente!
            </motion.span>
          )}
          <button
            type="submit"
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CREAR
          </button>
        </div>
      </motion.form>
    </div>
  );
}
