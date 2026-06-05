import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Save } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries as allLotteries, type Lottery } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProviderKey =
  | "Anguila Quiniela"
  | "FLORIDA"
  | "King Lottery"
  | "LA PRIMERA"
  | "LA SUERTE DOMINICANA"
  | "LOTEDOM"
  | "LOTEKA"
  | "LOTERIA NACIONAL"
  | "LOTERIA REAL"
  | "NEW YORK"
  | "QUINIELA PALE"
  | "SUPER PALE (RD)"
  | "SUPER PALE (USA)";

interface ScheduleDay {
  day: string;
  dayShort: string;
  openTime: string;
  closeTime: string;
}

interface LotterySchedule {
  lottery: Lottery;
  days: ScheduleDay[];
}

// ─── 13 Lottery Providers ─────────────────────────────────────────────────────

const providers: { key: ProviderKey; lotteries: string[] }[] = [
  {
    key: "Anguila Quiniela",
    lotteries: ["Anguila 10AM", "Anguila 1PM", "Anguila 6PM", "Anguila 9PM"],
  },
  {
    key: "FLORIDA",
    lotteries: ["Florida AM", "Florida PM", "Florida NOCHE"],
  },
  {
    key: "King Lottery",
    lotteries: ["King Lottery AM", "King Lottery PM"],
  },
  {
    key: "LA PRIMERA",
    lotteries: ["LA PRIMERA", "LA PRIMERA NOCHE"],
  },
  {
    key: "LA SUERTE DOMINICANA",
    lotteries: ["LA SUERTE", "LA SUERTE NOCHE"],
  },
  { key: "LOTEDOM", lotteries: ["LOTEDOM"] },
  { key: "LOTEKA", lotteries: ["LOTEKA", "LOTeka NOCHE"] },
  { key: "LOTERIA NACIONAL", lotteries: ["NACIONAL NOCHE", "NACIONAL"] },
  {
    key: "LOTERIA REAL",
    lotteries: ["QUINIELA REAL", "QUINIELA REAL NOCHE"],
  },
  {
    key: "NEW YORK",
    lotteries: ["New York AM", "New York PM", "New York NOCHE"],
  },
  { key: "QUINIELA PALE", lotteries: ["QUINIELA REAL", "QUINIELA REAL NOCHE"] },
  {
    key: "SUPER PALE (RD)",
    lotteries: ["GANA MAS", "LA SUERTE NOCHE", "LA PRIMERA NOCHE"],
  },
  {
    key: "SUPER PALE (USA)",
    lotteries: ["Florida AM", "New York AM", "Florida PM", "New York PM"],
  },
];

const daysOfWeek = [
  { day: "Lunes", dayShort: "Lun" },
  { day: "Martes", dayShort: "Mar" },
  { day: "Miercoles", dayShort: "Mie" },
  { day: "Jueves", dayShort: "Jue" },
  { day: "Viernes", dayShort: "Vie" },
  { day: "Sabado", dayShort: "Sab" },
  { day: "Domingo", dayShort: "Dom" },
];

// ─── Build Schedule ───────────────────────────────────────────────────────────

function buildSchedule(lottery: Lottery): LotterySchedule {
  const drawHourMap: Record<string, { open: string; close: string }> = {
    "10AM": { open: "09:00", close: "10:30" },
    "1PM": { open: "12:00", close: "13:30" },
    "6PM": { open: "17:00", close: "18:30" },
    "9PM": { open: "20:00", close: "21:30" },
  };
  const timeConfig = drawHourMap[lottery.drawTime] || {
    open: "09:00",
    close: "18:00",
  };
  return {
    lottery,
    days: daysOfWeek.map((d) => ({
      day: d.day,
      dayShort: d.dayShort,
      openTime: timeConfig.open,
      closeTime: timeConfig.close,
    })),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HorarioSorteos() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderKey>(
    "Anguila Quiniela"
  );
  const [schedules, setSchedules] = useState<Map<string, LotterySchedule>>(
    () => {
      const map = new Map<string, LotterySchedule>();
      allLotteries.forEach((l) => map.set(l.id, buildSchedule(l)));
      return map;
    }
  );
  const [savedFlash, setSavedFlash] = useState<Set<string>>(new Set());

  // Get lotteries for selected provider
  const providerLotteries = useMemo(() => {
    const provider = providers.find((p) => p.key === selectedProvider);
    if (!provider) return [];
    return allLotteries.filter((l) => provider.lotteries.includes(l.name));
  }, [selectedProvider]);

  // Get schedules for current lotteries
  const currentSchedules = useMemo(() => {
    return providerLotteries.map(
      (l) => schedules.get(l.id) || buildSchedule(l)
    );
  }, [providerLotteries, schedules]);

  function updateTime(
    lotteryId: string,
    dayIndex: number,
    field: "openTime" | "closeTime",
    value: string
  ) {
    setSchedules((prev) => {
      const next = new Map(prev);
      const existing = next.get(lotteryId);
      if (!existing) return prev;
      const newDays = [...existing.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      next.set(lotteryId, { ...existing, days: newDays });
      return next;
    });
  }

  function handleSaveRow(lotteryId: string) {
    setSavedFlash((prev) => new Set(prev).add(lotteryId));
    setTimeout(() => {
      setSavedFlash((prev) => {
        const next = new Set(prev);
        next.delete(lotteryId);
        return next;
      });
    }, 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      className="space-y-6"
    >
      <PageHeader title="Horario de Sorteos" />

      {/* Provider selector buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-wrap gap-2"
      >
        {providers.map((provider, idx) => (
          <motion.button
            key={provider.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            onClick={() => setSelectedProvider(provider.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedProvider === provider.key
                ? "bg-[#4ECDC4] text-white shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                : "bg-white text-[#666666] border border-[#E5E5E0] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
            }`}
          >
            {provider.key}
          </motion.button>
        ))}
      </motion.div>

      {/* Schedule cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProvider}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {currentSchedules.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-12 text-center">
              <Clock size={40} className="mx-auto text-[#CCCCCC] mb-3" />
              <p className="text-[#999999]">
                No hay sorteos para este proveedor
              </p>
            </div>
          ) : (
            currentSchedules.map((schedule, sIdx) => (
              <motion.div
                key={schedule.lottery.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.03, duration: 0.25 }}
                className={`bg-white rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors ${
                  savedFlash.has(schedule.lottery.id)
                    ? "border-[#4ECDC4] ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                    : "border-[#E5E5E0]"
                }`}
              >
                {/* Card header */}
                <div className="p-4 border-b border-[#F0F0EB] flex items-center gap-4 flex-wrap">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: sIdx * 0.05,
                    }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: schedule.lottery.color }}
                  />
                  <div>
                    <h3 className="text-base font-semibold text-[#333333]">
                      {schedule.lottery.name}
                    </h3>
                    <span className="text-xs text-[#999999]">
                      {schedule.lottery.abbreviation} ·{" "}
                      {schedule.lottery.drawTime}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue={schedule.lottery.color}
                      className="w-7 h-7 rounded cursor-pointer border border-[#E5E5E0]"
                      title="Cambiar color"
                    />
                    <button
                      onClick={() => handleSaveRow(schedule.lottery.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                    >
                      <Save size={13} />
                      Guardar
                    </button>
                  </div>
                </div>

                {/* Schedule grid */}
                <div className="p-4 overflow-x-auto">
                  <div className="min-w-[700px]">
                    {/* Header row */}
                    <div className="grid grid-cols-8 gap-2 mb-2">
                      <div className="text-xs font-semibold text-[#999999] uppercase tracking-wider py-2">
                        Sorteo
                      </div>
                      {daysOfWeek.map((d) => (
                        <div
                          key={d.day}
                          className="text-xs font-semibold text-[#999999] uppercase tracking-wider text-center py-2"
                        >
                          {d.dayShort}
                        </div>
                      ))}
                    </div>

                    {/* Data row */}
                    <div className="grid grid-cols-8 gap-2">
                      <div className="flex items-center text-sm font-medium text-[#333333] py-2">
                        {schedule.lottery.name}
                      </div>
                      {schedule.days.map((day, dIdx) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: sIdx * 0.03 + dIdx * 0.02,
                            duration: 0.2,
                          }}
                          className="space-y-1"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] text-[#999999] block">
                              Inicio
                            </label>
                            <input
                              type="time"
                              value={day.openTime}
                              onChange={(e) =>
                                updateTime(
                                  schedule.lottery.id,
                                  dIdx,
                                  "openTime",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#E5E5E0] rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)] transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-[#999999] block">
                              Fin
                            </label>
                            <input
                              type="time"
                              value={day.closeTime}
                              onChange={(e) =>
                                updateTime(
                                  schedule.lottery.id,
                                  dIdx,
                                  "closeTime",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#E5E5E0] rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_2px_rgba(78,205,196,0.15)] transition-all"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
