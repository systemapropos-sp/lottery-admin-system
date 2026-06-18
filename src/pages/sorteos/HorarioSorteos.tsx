import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Save, CalendarRange, X, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useSorteosStore, type Sorteo } from "@/store/sorteosStore";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScheduleDay { day: string; dayShort: string; openTime: string; closeTime: string; }
interface LotterySchedule { sorteo: Sorteo; days: ScheduleDay[]; }

const daysOfWeek = [
  { day: "Lunes",     dayShort: "Lun" }, { day: "Martes",    dayShort: "Mar" },
  { day: "Miercoles", dayShort: "Mie" }, { day: "Jueves",    dayShort: "Jue" },
  { day: "Viernes",   dayShort: "Vie" }, { day: "Sabado",    dayShort: "Sab" },
  { day: "Domingo",   dayShort: "Dom" },
];

// Convert 12h (e.g. "7:00 PM") to 24h (e.g. "19:00")
function to24h(t: string): string {
  if (!t) return "09:00";
  if (/^\d{1,2}:\d{2}$/.test(t)) return t.padStart(5, '0'); // already 24h
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return "09:00";
  let h = parseInt(m[1]);
  const min = m[2];
  const per = m[3].toUpperCase();
  if (per === "PM" && h !== 12) h += 12;
  if (per === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

// Convert 24h (e.g. "19:00") to 12h (e.g. "7:00 PM")
function to12h(t: string): string {
  if (!t) return "";
  const [hStr, min] = t.split(":");
  const h = parseInt(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${min} ${period}`;
}

function buildSchedule(s: Sorteo): LotterySchedule {
  const openTime = to24h(s.horario || "09:00");
  const closeTime = to24h(s.horarioCierre || "");
  const defaultClose = closeTime === "09:00" && !s.horarioCierre ? "18:00" : closeTime;
  return { sorteo: s, days: daysOfWeek.map((d) => ({ ...d, openTime, closeTime: defaultClose })) };
}

// ─── Provider filter pills ────────────────────────────────────────────────────
const PROVIDERS = [
  { key: "TODAS",        keywords: [] },
  { key: "Anguila",      keywords: ["anguila"] },
  { key: "FLORIDA",      keywords: ["florida"] },
  { key: "NEW YORK",     keywords: ["new york", "newyork"] },
  { key: "LA PRIMERA",   keywords: ["primera"] },
  { key: "LA SUERTE",    keywords: ["suerte"] },
  { key: "LOTEDOM",      keywords: ["lotedom"] },
  { key: "LOTEKA",       keywords: ["loteka"] },
  { key: "NACIONAL",     keywords: ["nacional"] },
  { key: "REAL",         keywords: ["real"] },
  { key: "KING",         keywords: ["king"] },
  { key: "OTROS",        keywords: ["gana", "pale", "pool", "mega"] },
];

export default function HorarioSorteos() {
  const { sorteos, updateSorteo } = useSorteosStore();
  const [selectedProvider, setSelectedProvider] = useState("TODAS");
  const [schedules, setSchedules] = useState<Map<string, LotterySchedule>>(() => {
    const map = new Map<string, LotterySchedule>();
    // Use getState() for lazy init (runs once on mount, store is already hydrated)
    useSorteosStore.getState().sorteos.forEach((s) => map.set(s.id, buildSchedule(s)));
    return map;
  });
  const [savedFlash, setSavedFlash] = useState<Set<string>>(new Set());

  // Modal state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalDays, setModalDays] = useState(
    daysOfWeek.map((d) => ({ ...d, openTime: "09:00", closeTime: "18:00", active: true }))
  );
  const [modalApplied, setModalApplied] = useState(false);

  const editingSorteo = editingId ? schedules.get(editingId)?.sorteo ?? null : null;

  function openModal(sorteoId: string) {
    const sc = schedules.get(sorteoId);
    if (!sc) return;
    setModalDays(sc.days.map((d) => ({ ...d, active: true })));
    setEditingId(sorteoId);
    setModalApplied(false);
  }

  function applyModal() {
    if (!editingId) return;
    const ex = schedules.get(editingId);
    if (!ex) return;
    const newDays = ex.days.map((day, i) => ({
      ...day,
      openTime: modalDays[i].active ? modalDays[i].openTime : day.openTime,
      closeTime: modalDays[i].active ? modalDays[i].closeTime : day.closeTime,
    }));
    setSchedules((prev) => {
      const next = new Map(prev);
      next.set(editingId, { ...ex, days: newDays });
      return next;
    });
    // ── SYNC → sorteosStore so ListaSorteos (columna horario) queda actualizado ──
    const first = newDays[0];
    if (first) {
      updateSorteo(editingId, {
        horario: first.openTime,
        horarioCierre: first.closeTime,
      });
    }
    setModalApplied(true);
    setTimeout(() => { setModalApplied(false); setEditingId(null); }, 1200);
  }

  // Filter sorteos by selected provider keyword
  const providerSorteos = useMemo(() => {
    if (selectedProvider === "TODAS") return sorteos;
    const prov = PROVIDERS.find(p => p.key === selectedProvider);
    if (!prov || prov.keywords.length === 0) return sorteos;
    return sorteos.filter(s => prov.keywords.some(kw => s.nombre.toLowerCase().includes(kw)));
  }, [selectedProvider, sorteos]);

  const currentSchedules = useMemo(
    () => providerSorteos.map((s) => schedules.get(s.id) ?? buildSchedule(s)),
    [providerSorteos, schedules]
  );

  function updateTime(id: string, dIdx: number, field: "openTime" | "closeTime", val: string) {
    setSchedules((prev) => {
      const next = new Map(prev);
      const ex = next.get(id);
      if (!ex) return prev;
      const days = [...ex.days];
      days[dIdx] = { ...days[dIdx], [field]: val };
      next.set(id, { ...ex, days });
      return next;
    });
  }

  // Save: persist to sorteosStore so Lista tab sees the changes
  function handleSave(id: string) {
    const sc = schedules.get(id);
    if (sc) {
      // Use the first active day as representative times
      const openTime = sc.days[0]?.openTime || "";
      const closeTime = sc.days[0]?.closeTime || "";
      updateSorteo(id, {
        horario: to12h(openTime),
        horarioCierre: to12h(closeTime),
      });
    }
    setSavedFlash((prev) => new Set(prev).add(id));
    setTimeout(() => setSavedFlash((prev) => { const n = new Set(prev); n.delete(id); return n; }), 1200);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="space-y-6"
    >
      <PageHeader title="Horario de Sorteos" subtitle="Los cambios guardados se reflejan en la lista de sorteos" />

      {/* Provider selector */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }} className="flex flex-wrap gap-2"
      >
        {PROVIDERS.map((p, idx) => (
          <motion.button key={p.key}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            onClick={() => setSelectedProvider(p.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedProvider === p.key
                ? p.key === "TODAS"
                  ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                  : "bg-[#4ECDC4] text-white shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                : p.key === "TODAS"
                  ? "bg-white text-[#666666] border border-[#E5E5E0] hover:border-teal-400"
                  : "bg-white text-[#666666] border border-[#E5E5E0] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
            }`}
          >{p.key}</motion.button>
        ))}
      </motion.div>

      {/* Schedule cards */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedProvider} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4"
        >
          {currentSchedules.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E5E0] p-12 text-center">
              <Clock size={40} className="mx-auto text-[#CCCCCC] mb-3" />
              <p className="text-[#999999]">No hay sorteos para este proveedor</p>
            </div>
          ) : currentSchedules.map((schedule, sIdx) => (
            <motion.div key={schedule.sorteo.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.03, duration: 0.25 }}
              className={`bg-white rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors ${
                savedFlash.has(schedule.sorteo.id) ? "border-[#4ECDC4]" : "border-[#E5E5E0]"
              }`}
            >
              {/* Card header */}
              <div className="p-4 border-b border-[#F0F0EB] flex items-center gap-4 flex-wrap">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: schedule.sorteo.color }} />
                <div>
                  <h3 className="text-base font-semibold text-[#333333]">{schedule.sorteo.nombre}</h3>
                  <span className="text-xs text-[#999999]">
                    {schedule.sorteo.abreviacion}
                    {schedule.sorteo.horario && ` · 🟢 ${schedule.sorteo.horario}`}
                    {schedule.sorteo.horarioCierre && ` → 🔴 ${schedule.sorteo.horarioCierre}`}
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <input type="color" value={schedule.sorteo.color}
                    onChange={(e) => updateSorteo(schedule.sorteo.id, { color: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-[#E5E5E0]" title="Cambiar color" />
                  <button
                    onClick={() => openModal(schedule.sorteo.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 text-teal-600 bg-teal-50 text-sm font-medium hover:bg-teal-100 transition-all"
                    title="Modificar todos los días de esta lotería a la vez"
                  >
                    <CalendarRange size={13} />
                    Horario General
                  </button>
                  <button onClick={() => handleSave(schedule.sorteo.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                  >
                    <Save size={13} /> Guardar
                  </button>
                </div>
              </div>

              {/* Schedule grid */}
              <div className="p-4 overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="text-xs font-semibold text-[#999999] uppercase tracking-wider py-2">Sorteo</div>
                    {daysOfWeek.map((d) => (
                      <div key={d.day} className="text-xs font-semibold text-[#999999] uppercase tracking-wider text-center py-2">{d.dayShort}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    <div className="flex items-center text-sm font-medium text-[#333333] py-2">{schedule.sorteo.nombre}</div>
                    {schedule.days.map((day, dIdx) => (
                      <motion.div key={day.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sIdx * 0.03 + dIdx * 0.02, duration: 0.2 }} className="space-y-1"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] text-[#999999] block">🟢 Apertura</label>
                          <input type="time" value={day.openTime}
                            onChange={(e) => updateTime(schedule.sorteo.id, dIdx, "openTime", e.target.value)}
                            className="w-full border border-[#E5E5E0] rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:border-[#4ECDC4] transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-[#EF4444] block">🔴 Cierre</label>
                          <input type="time" value={day.closeTime}
                            onChange={(e) => updateTime(schedule.sorteo.id, dIdx, "closeTime", e.target.value)}
                            className="w-full border border-[#FEE2E2] rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:border-[#EF4444] transition-all"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Modal Horario General ─────────────────────────────────────────── */}
      <AnimatePresence>
        {editingId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setEditingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
                      <CalendarRange size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Horario General</h2>
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-teal-600">{editingSorteo?.nombre}</span>
                        {" "}— aplica a todos los días seleccionados
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setEditingId(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Days Grid */}
                <div className="p-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Solo los días activos (●) serán actualizados
                  </p>
                  {modalDays.map((day, i) => (
                    <div key={day.day}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                        day.active ? "border-teal-200 bg-teal-50/30" : "border-gray-100 bg-gray-50/50 opacity-60"
                      }`}
                    >
                      <button
                        onClick={() => setModalDays((prev) => prev.map((d, idx) => idx === i ? { ...d, active: !d.active } : d))}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          day.active ? "bg-teal-500 border-teal-500" : "border-gray-300"
                        }`}
                      >
                        {day.active && <span className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                      <span className={`w-24 text-sm font-semibold flex-shrink-0 ${day.active ? "text-gray-700" : "text-gray-400"}`}>
                        {day.day}
                      </span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-teal-500 font-semibold w-14">🟢 Apertura</label>
                          <input type="time" value={day.openTime} disabled={!day.active}
                            onChange={(e) => setModalDays((prev) => prev.map((d, idx) => idx === i ? { ...d, openTime: e.target.value } : d))}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          />
                        </div>
                        <span className="text-gray-300">→</span>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-red-400 font-semibold w-10">🔴 Cierre</label>
                          <input type="time" value={day.closeTime} disabled={!day.active}
                            onChange={(e) => setModalDays((prev) => prev.map((d, idx) => idx === i ? { ...d, closeTime: e.target.value } : d))}
                            className="border border-red-100 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setModalDays(daysOfWeek.map((d) => ({ ...d, openTime: "09:00", closeTime: "18:00", active: true })))}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Restablecer todo
                  </button>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={applyModal}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all ${modalApplied ? "bg-green-500" : "hover:opacity-90"}`}
                      style={!modalApplied ? { background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" } : {}}
                    >
                      {modalApplied
                        ? <><CheckCircle2 size={15} /> ¡Aplicado!</>
                        : <><CalendarRange size={15} /> Aplicar los 7 días</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
