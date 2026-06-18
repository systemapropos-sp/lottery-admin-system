import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, ChevronDown } from "lucide-react";
// ─── Datos locales NMV (no depende de mockData) ───────────────────────────────
const bettingPools = [
  {id:"b01",name:"NMV RD 01",code:"NMV-0001",isActive:true},
  {id:"b02",name:"NMV RD 02",code:"NMV-0002",isActive:true},
  {id:"b03",name:"NMV RD 03",code:"NMV-0003",isActive:true},
  {id:"b04",name:"NMV RD 04",code:"NMV-0004",isActive:true},
  {id:"b05",name:"NMV RD 05",code:"NMV-0005",isActive:true},
  {id:"b06",name:"NMV RD 06",code:"NMV-0006",isActive:true},
  {id:"b07",name:"NMV RD 07",code:"NMV-0007",isActive:true},
  {id:"b08",name:"NMV RD 08",code:"NMV-0008",isActive:true},
  {id:"b09",name:"NMV RD 09",code:"NMV-0009",isActive:true},
  {id:"b10",name:"NMV RD 10",code:"NMV-0010",isActive:true},
  {id:"b11",name:"NMV RD 11",code:"NMV-0011",isActive:true},
  {id:"b12",name:"NMV RD 12",code:"NMV-0012",isActive:true},
  {id:"b13",name:"NMV RD 13",code:"NMV-0013",isActive:true},
];
const zones = [
  {id:"z1",name:"Default",code:"ZON-0001"},
  {id:"z2",name:"SFM",code:"ZON-0002"},
];

// ─── Types ────────────────────────────────────────────────────────────────────

type RecipientType = "bancas" | "admins";
type NotificationType = "dismissible" | "expiration";
type PriorityType = "low" | "medium" | "high";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Notificaciones() {
  // ─── State ──────────────────────────────────────────────────────────────────

  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState<RecipientType>("bancas");
  const [notificationType, setNotificationType] =
    useState<NotificationType>("dismissible");
  const [priority, setPriority] = useState<PriorityType>("high");
  const [message, setMessage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const maxChars = 200;
  const charCount = message.length;

  // ─── Derived State ──────────────────────────────────────────────────────────

  const isAllPoolsSelected = selectedPools.length === bettingPools.length;
  const isAllZonesSelected = selectedZones.length === zones.length;

  const toggleAllPools = () => {
    if (isAllPoolsSelected) {
      setSelectedPools([]);
    } else {
      setSelectedPools(bettingPools.map((p) => p.id));
    }
  };

  const togglePool = (id: string) => {
    setSelectedPools((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAllZones = () => {
    if (isAllZonesSelected) {
      setSelectedZones([]);
    } else {
      setSelectedZones(zones.map((z) => z.id));
    }
  };

  const toggleZone = (id: string) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id]
    );
  };

  const isSubmitEnabled =
    message.trim().length > 0 &&
    !isSubmitting &&
    ((recipientType === "bancas" &&
      (selectedPools.length > 0 || selectedZones.length > 0)) ||
      recipientType === "admins");

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!isSubmitEnabled) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        setSelectedPools([]);
        setSelectedZones([]);
        setRecipientType("bancas");
        setNotificationType("dismissible");
        setPriority("high");
        setExpirationDate("");
      }, 2000);
    }, 1200);
  };

  // ─── Counter Color ──────────────────────────────────────────────────────────

  const counterColor =
    charCount >= 190
      ? "text-[#EF4444]"
      : charCount >= 150
        ? "text-[#F59E0B]"
        : "text-[#999999]";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#333333]">Enviar notificaciones</h1>
        <p className="text-sm text-[#666666] mt-0.5">
          Cree y envie notificaciones push a operadores y administradores
        </p>
      </motion.div>

      {/* ─── DESTINATARIOS ────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-4"
      >
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-[0.05em] mb-4">
          Destinatarios
        </h2>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Bancas dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Bancas
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleAllPools}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] hover:border-[#CCCCCC] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
              >
                <span>
                  {isAllPoolsSelected
                    ? "Todas"
                    : selectedPools.length === 0
                      ? "Seleccionar bancas..."
                      : `${selectedPools.length} banca(s)`}
                </span>
                <ChevronDown size={14} className="text-[#999999]"/>
              </button>
              {/* Pool checkboxes */}
              <div className="mt-2 max-h-[200px] overflow-y-auto border border-[#F0F0EB] rounded-lg p-2 space-y-1">
                <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F0] cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={isAllPoolsSelected}
                    onChange={toggleAllPools}
                    className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"
                  />
                  <span className="font-medium text-[#333333]">Todas</span>
                </label>
                <div className="border-t border-[#F0F0EB] my-1" />
                {bettingPools.map((pool) => (
                  <label
                    key={pool.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F0] cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPools.includes(pool.id)}
                      onChange={() => togglePool(pool.id)}
                      className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"
                    />
                    <span className="text-[#333333]">{pool.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Zonas dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              Zonas
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleAllZones}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] hover:border-[#CCCCCC] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
              >
                <span>
                  {isAllZonesSelected
                    ? "Todas"
                    : selectedZones.length === 0
                      ? "Seleccionar zonas..."
                      : `${selectedZones.length} zona(s)`}
                </span>
                <ChevronDown size={14} className="text-[#999999]"/>
              </button>
              <div className="mt-2 max-h-[120px] overflow-y-auto border border-[#F0F0EB] rounded-lg p-2 space-y-1">
                <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F0] cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={isAllZonesSelected}
                    onChange={toggleAllZones}
                    className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"
                  />
                  <span className="font-medium text-[#333333]">Todas</span>
                </label>
                <div className="border-t border-[#F0F0EB] my-1" />
                {zones.map((zone) => (
                  <label
                    key={zone.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F5F5F0] cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(zone.id)}
                      onChange={() => toggleZone(zone.id)}
                      className="rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]"
                    />
                    <span className="text-[#333333]">{zone.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Type Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRecipientType("bancas")}
            className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all ${
              recipientType === "bancas"
                ? "border-[#4ECDC4] bg-[#E0F7F5]"
                : "border-[#E5E5E0] bg-white hover:border-[#CCCCCC]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                recipientType === "bancas"
                  ? "border-[#4ECDC4] bg-[#4ECDC4]"
                  : "border-[#CCCCCC]"
              }`}
            >
              {recipientType === "bancas" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <span
                className={`block text-sm font-semibold ${
                  recipientType === "bancas"
                    ? "text-[#0F766E]"
                    : "text-[#333333]"
                }`}
              >
                BANCAS
              </span>
              <span className="text-xs text-[#666666]">
                Enviar a operadores de banca
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRecipientType("admins")}
            className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all ${
              recipientType === "admins"
                ? "border-[#4ECDC4] bg-[#E0F7F5]"
                : "border-[#E5E5E0] bg-white hover:border-[#CCCCCC]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                recipientType === "admins"
                  ? "border-[#4ECDC4] bg-[#4ECDC4]"
                  : "border-[#CCCCCC]"
              }`}
            >
              {recipientType === "admins" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <span
                className={`block text-sm font-semibold ${
                  recipientType === "admins"
                    ? "text-[#0F766E]"
                    : "text-[#333333]"
                }`}
              >
                ADMINISTRADORES DE MI GRUPO
              </span>
              <span className="text-xs text-[#666666]">
                Enviar solo a administradores
              </span>
            </div>
          </button>
        </div>
      </motion.section>

      {/* ─── CONFIGURACIÓN ────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-4"
      >
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-[0.05em] mb-4">
          Configuracion
        </h2>

        {/* Type toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Tipo de notificacion
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setNotificationType("dismissible")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                notificationType === "dismissible"
                  ? "border-[#4ECDC4] bg-[#E0F7F5] text-[#0F766E]"
                  : "border-[#E5E5E0] text-[#666666] hover:border-[#CCCCCC]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  notificationType === "dismissible"
                    ? "border-[#4ECDC4] bg-[#4ECDC4]"
                    : "border-[#CCCCCC]"
                }`}
              >
                {notificationType === "dismissible" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              DISMISSIBLE
            </button>

            <button
              type="button"
              onClick={() => setNotificationType("expiration")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                notificationType === "expiration"
                  ? "border-[#4ECDC4] bg-[#E0F7F5] text-[#0F766E]"
                  : "border-[#E5E5E0] text-[#666666] hover:border-[#CCCCCC]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  notificationType === "expiration"
                    ? "border-[#4ECDC4] bg-[#4ECDC4]"
                    : "border-[#CCCCCC]"
                }`}
              >
                {notificationType === "expiration" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              WITH EXPIRATION DATE
            </button>
          </div>
        </div>

        {/* Expiration date - conditional */}
        <AnimatePresence>
          {notificationType === "expiration" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="pb-1">
                <label className="block text-sm font-medium text-[#333333] mb-1.5">
                  Fecha de expiracion
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full sm:w-56 px-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Tipo de prioridad
          </label>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { key: "low", label: "LOW", dot: "#9CA3AF" },
                { key: "medium", label: "MEDIUM", dot: "#F59E0B" },
                { key: "high", label: "HIGH", dot: "#EF4444" },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPriority(p.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  priority === p.key
                    ? "border-[#4ECDC4] bg-[#E0F7F5] text-[#0F766E]"
                    : "border-[#E5E5E0] text-[#666666] hover:border-[#CCCCCC]"
                }`}
              >
                <motion.span
                  animate={
                    priority === p.key ? { scale: [1, 1.3, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: p.dot }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── MENSAJE ──────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6"
      >
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-[0.05em] mb-4">
          Mensaje
        </h2>

        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setMessage(e.target.value);
              }
            }}
            placeholder="Escriba su mensaje aqui..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all resize-none"
          />
          <div className={`text-right text-xs mt-1.5 font-medium ${counterColor}`}>
            {charCount}/{maxChars}
          </div>
        </div>
      </motion.section>

      {/* ─── SUBMIT BUTTON ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
      >
        <button
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          className={`w-full h-[52px] flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all ${
            isSuccess
              ? "bg-[#22C55E] text-white"
              : "bg-[#4ECDC4] text-white hover:bg-[#3DBDB5] hover:scale-[1.01] active:scale-[0.99] shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_16px_rgba(78,205,196,0.4)]"
          } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : isSuccess ? (
            <>
              <Check size={18} />
              Notificacion enviada!
            </>
          ) : (
            <>
              <Send size={16} />
              CREAR NOTIFICACION
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
