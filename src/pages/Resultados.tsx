import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Save, Trophy, Calendar } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { supabase } from "@/lib/supabase";
import { useSorteosStore } from "@/store/sorteosStore";

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

// ── Helper: format numbers array as "12-34-56" for logs ──────────────────────
function formatNums(numbers: string[]): string {
  return numbers.slice(0, 3).filter(Boolean).join('-') || '-';
}

function generateInitialResults(sorteos?: { id: string; nombre: string; color: string }[]): ResultEntry[] {
  const list = sorteos && sorteos.length > 0 ? sorteos : [];
  return list.map((s) => ({
    lotteryId: s.id,
    lotteryName: s.nombre,
    color: s.color,
    numbers: ["", "", "", "", ""],
    locked: false,
  }));
}


const accionConfig: Record<string, string> = {
  "Creo": "bg-blue-100 text-blue-800",
  "Modifico": "bg-amber-100 text-amber-800",
  "Bloqueo": "bg-green-100 text-green-800",
};

// Prize multipliers (configurable)
const PRIZES = {
  quiniela_1: 70,    // exact 1st position
  quiniela_2: 50,    // exact 2nd position
  quiniela_3: 40,    // exact 3rd position
  quiniela_any: 12,  // any position (combinación)
  pale: 160,         // 2 numbers match
  tripleta: 500,     // 3 numbers match
};

// Evaluate a single play against winning numbers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function evaluatePlay(play: Record<string, any>, winNums: string[]): { won: boolean; prize: number } {
  const type = String(play.type || play.playType || '').toLowerCase();
  const numbers = String(play.numbers || play.number || '');
  const amount = parseFloat(String(play.amount || play.bet || 0));
  const parts = numbers.split(/[-,\s]+/).map((n: string) => n.trim().padStart(2, '0')).filter(Boolean);

  if (type.includes('pale') || type.includes('palé')) {
    const [n1, n2] = parts;
    const ws = new Set(winNums);
    return n1 && n2 && ws.has(n1) && ws.has(n2)
      ? { won: true, prize: amount * PRIZES.pale }
      : { won: false, prize: 0 };
  }
  if (type.includes('tripleta') || type.includes('triple')) {
    const ws = new Set(winNums);
    const allMatch = parts.slice(0, 3).every((n: string) => ws.has(n));
    return parts.length >= 3 && allMatch
      ? { won: true, prize: amount * PRIZES.tripleta }
      : { won: false, prize: 0 };
  }
  // Default: quiniela/directo — check by position
  const n = parts[0];
  if (!n) return { won: false, prize: 0 };
  if (winNums[0] === n) return { won: true, prize: amount * PRIZES.quiniela_1 };
  if (winNums[1] === n) return { won: true, prize: amount * PRIZES.quiniela_2 };
  if (winNums[2] === n) return { won: true, prize: amount * PRIZES.quiniela_3 };
  if (winNums.includes(n)) return { won: true, prize: amount * PRIZES.quiniela_any };
  return { won: false, prize: 0 };
}

// Helper: infer category from sorteo name
function inferCategory(name: string): string {
  const n = name.toUpperCase();
  if (n.includes("FLORIDA")) return "FLORIDA";
  if (n.includes("NEW YORK") || n.includes("NEWYORK")) return "NEW YORK";
  if (n.includes("NACIONAL")) return "NACIONAL";
  if (n.includes("LEIDSA")) return "LEIDSA";
  if (n.includes("PRIMERA")) return "LA PRIMERA";
  if (n.includes("LOTEKA")) return "LOTEKA";
  if (n.includes("GANA MAS") || n.includes("GANA+")) return "GANA MAS";
  if (n.includes("SUERTE")) return "LA SUERTE";
  if (n.includes("KING")) return "KING LOTTERY";
  if (n.includes("ANGUILA")) return "ANGUILA";
  return name.split(" ").slice(0, -1).join(" ") || name;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Resultados() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingFromDB, setLoadingFromDB] = useState(false);
  const [processMsg, setProcessMsg] = useState<string | null>(null);
  // ── Logs state ──────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState<ResultLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Get sorteos — use stable ref (no .filter in selector to avoid infinite loop)
  const allSorteos = useSorteosStore((s) => s.sorteos);
  const sorteos = useMemo(() => allSorteos.filter((x) => x.activo), [allSorteos]);

  // ── Load logs from Supabase ─────────────────────────────────────────────────
  const loadLogs = useCallback(async (date: string) => {
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from("resultado_logs")
        .select("*")
        .eq("draw_date", date)
        .eq("business_id", "bb000001-0000-0000-0000-000000000001")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setLogs(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any[]).map((row) => ({
            id: row.id,
            fecha: row.created_at,
            sorteo: row.lottery_name,
            usuario: row.usuario,
            accion: row.accion,
            anterior: row.anterior || "-",
            nuevo: row.nuevo,
          }))
        );
      } else {
        setLogs([]); // table may not exist yet — show empty gracefully
      }
    } catch {
      setLogs([]); // if table doesn't exist yet, just show empty
    } finally {
      setLogsLoading(false);
    }
  }, []);

  // Reload logs when Logs tab becomes active or date changes
  useEffect(() => {
    if (activeTab === 1) loadLogs(selectedDate);
  }, [activeTab, selectedDate, loadLogs]);

  // ── Load/reload results whenever date OR sorteos list changes ───────────────
  useEffect(() => {
    // Guard: wait for store to hydrate (never show blank page)
    if (sorteos.length === 0) return;

    const base = generateInitialResults(sorteos);

    async function loadFromDB() {
      setLoadingFromDB(true);
      // Show all sorteos with empty fields immediately — prevents blank page
      setResults(base);
      try {
        const { data, error } = await supabase
          .from("sortition_results")
          .select("*")
          .eq("fecha", selectedDate)
          .eq("admin_id", "RDV-01");

        if (!error && data && data.length > 0) {
          setResults(base.map(entry => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const row = (data as any[]).find(d =>
              d.sorteo_name === entry.lotteryName || d.lottery_id === entry.lotteryId
            );
            if (!row) return entry;
            return {
              ...entry,
              numbers: [
                (row.num1 || "").slice(0, 2),
                (row.num2 || "").slice(0, 2),
                (row.num3 || "").slice(0, 2),
                (row.p3 || "").slice(0, 4),
                (row.p4 || "").slice(0, 4),
              ],
              locked: row.locked ?? false,
            };
          }));
        }
        // base already set above — no else needed
      } catch {
        // base already set above — table still shows sorteos list
      } finally {
        setLoadingFromDB(false);
      }
    }
    loadFromDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, sorteos.length]);

  const tabs = ["Manejar resultados", "Logs de resultados"];

  const updateNumber = (lotteryId: string, idx: number, value: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.lotteryId === lotteryId && !r.locked
          ? { ...r, numbers: r.numbers.map((n, i) => (i === idx ? value.replace(/\D/g, "").slice(0, 2) : n)) }
          : r
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // ── 0. Cargar resultados anteriores para detectar Creo vs Modifico ────────
      const { data: existingData } = await supabase
        .from("lottery_results")
        .select("lottery_name, primera, segunda, tercera, pick3, pick4")
        .eq("draw_date", selectedDate);

      const existingMap: Record<string, { primera?: string; segunda?: string; tercera?: string; pick3?: string; pick4?: string }> = {};
      if (existingData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (existingData as any[]).forEach(row => {
          existingMap[row.lottery_name] = row;
        });
      }

      const rows = results
        .filter(r => r.numbers.some(n => n && n.trim()))
        .map(r => {
          const sorteo = sorteos.find(s => s.id === r.lotteryId || s.nombre === r.lotteryName);
          return {
            admin_id: "RDV-01",
            sorteo_name: r.lotteryName,
            lottery_id: r.lotteryId,
            categoria: inferCategory(r.lotteryName),
            hora: sorteo?.horario || null,
            color: sorteo?.color || r.color || null,
            fecha: selectedDate,
            num1: r.numbers[0] || null,
            num2: r.numbers[1] || null,
            num3: r.numbers[2] || null,
            p3: r.numbers[3] || null,
            p4: r.numbers[4] || null,
            locked: r.locked,
            updated_at: new Date().toISOString(),
          };
        });

      if (rows.length > 0) {
        const { error } = await supabase
          .from("sortition_results")
          .upsert(rows, { onConflict: "admin_id,sorteo_name,fecha" });
        if (error) throw error;
      }

      // ── También escribir a lottery_results (portal vendedor + cliente móvil) ──
      const lotteryRows = results
        .filter(r => r.numbers.some(n => n && n.trim()))
        .map(r => {
          const sorteo = sorteos.find(s => s.id === r.lotteryId || s.nombre === r.lotteryName);
          return {
            lottery_name:  r.lotteryName,
            draw_date:     selectedDate,
            draw_time:     sorteo?.horario || null,
            primera:       r.numbers[0] || null,
            segunda:       r.numbers[1] || null,
            tercera:       r.numbers[2] || null,
            pick3:         r.numbers[3] || null,
            pick4:         r.numbers[4] || null,
            company:       inferCategory(r.lotteryName),
            color:         sorteo?.color || r.color || null,
            admin_id:      "RDV-01",
            business_id:   "bb000001-0000-0000-0000-000000000001",
            updated_at:    new Date().toISOString(),
          };
        });
      if (lotteryRows.length > 0) {
        await supabase
          .from("lottery_results")
          .upsert(lotteryRows, { onConflict: "lottery_name,draw_date" });
      }

      // ── Insertar logs de resultado_logs ────────────────────────────────────
      const logRows = results
        .filter(r => r.numbers.some(n => n && n.trim()))
        .map(r => {
          const nuevoStr = formatNums(r.numbers);
          const existing = existingMap[r.lotteryName];
          let anterior = "-";
          let accion = "Creo";
          if (existing) {
            const oldNums = [existing.primera, existing.segunda, existing.tercera].filter(Boolean).join("-");
            if (oldNums) {
              anterior = oldNums;
              accion = "Modifico";
            }
          }
          return {
            business_id: "bb000001-0000-0000-0000-000000000001",
            draw_date: selectedDate,
            lottery_name: r.lotteryName,
            usuario: localStorage.getItem("nmv_admin_user") || "admin",
            accion,
            anterior,
            nuevo: nuevoStr,
          };
        });
      if (logRows.length > 0) {
        // Insert (not upsert) — each save creates a new log entry
        await supabase.from("resultado_logs").insert(logRows).then(({ error }) => {
          if (error) console.warn("resultado_logs insert:", error.message); // non-fatal
        });
        // Refresh logs if on Logs tab
        if (activeTab === 1) loadLogs(selectedDate);
      }

      // Backward compat: also update admin_config.resultados
      const resultadosJson = results
        .filter(r => r.numbers.some(n => n && n.trim()))
        .map(r => ({
          sorteo_name: r.lotteryName,
          nombre: r.lotteryName,
          categoria: inferCategory(r.lotteryName),
          color: r.color || null,
          fecha: selectedDate,
          num1: r.numbers[0] || undefined,
          num2: r.numbers[1] || undefined,
          num3: r.numbers[2] || undefined,
          p3: r.numbers[3] || undefined,
          p4: r.numbers[4] || undefined,
        }));
      await supabase
        .from("admin_config")
        .update({ resultados: resultadosJson, updated_at: new Date().toISOString() })
        .eq("admin_id", "RDV-01");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving results:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Winner processing logic ──────────────────────────────────────────────
  const confirmProcess = async () => {
    setShowConfirm(false);
    setSaving(true);
    setProcessMsg(null);
    let totalWinners = 0;
    let totalLosers = 0;
    let totalPrize = 0;
    try {
      const resultsWithNums = results.filter(r => r.numbers[0] || r.numbers[1] || r.numbers[2]);
      for (const entry of resultsWithNums) {
        const winNums = [entry.numbers[0], entry.numbers[1], entry.numbers[2]]
          .filter(Boolean)
          .map(n => n.padStart(2, '0'));
        if (!winNums.length) continue;

        // Fetch pending tickets for this lottery
        const { data: tickets } = await supabase
          .from("tickets")
          .select("id, metadata, amount, status, lottery_name")
          .eq("status", "pending")
          .ilike("lottery_name", `%${entry.lotteryName}%`);

        if (!tickets?.length) continue;

        for (const ticket of tickets) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const plays: Record<string, any>[] = (ticket.metadata as any)?.plays || [];
          let prizeAmount = 0;
          let hasWin = false;
          for (const play of plays) {
            const res = evaluatePlay(play, winNums);
            if (res.won) { hasWin = true; prizeAmount += res.prize; }
          }
          const newStatus = hasWin ? "won" : "lost";
          await supabase.from("tickets").update({
            status: newStatus,
            metadata: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...(ticket.metadata as any),
              prize_amount: prizeAmount,
              winning_numbers: winNums,
              processed_at: new Date().toISOString(),
            },
          }).eq("id", ticket.id);

          if (hasWin) { totalWinners++; totalPrize += prizeAmount; }
          else totalLosers++;
        }
      }
      const msg = `✅ ${totalWinners} ganador${totalWinners !== 1 ? 'es' : ''} (RD$${totalPrize.toFixed(2)}) · ${totalLosers} perdedor${totalLosers !== 1 ? 'es' : ''}`;
      setProcessMsg(msg);
      setSaved(true);
      setTimeout(() => { setSaved(false); setProcessMsg(null); }, 8000);
    } catch (err) {
      console.error("Error procesando ganadores:", err);
      setProcessMsg("❌ Error al procesar ganadores. Verifique la consola.");
      setTimeout(() => setProcessMsg(null), 5000);
    } finally {
      setSaving(false);
    }
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
          className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] transition-colors" />
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
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {/* Date + Unlock + Status messages */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Fecha</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] transition-colors" />
              </div>
              <button onClick={handleUnlockAll}
                className="px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors flex items-center gap-2 mt-5">
                <Unlock size={16} /> Desbloquear todo
              </button>
              {loadingFromDB && (
                <span className="text-[#999] text-sm mt-5">Cargando...</span>
              )}
              {saved && !processMsg && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="text-green-600 text-sm font-semibold mt-5">
                  ¡Guardado exitosamente!
                </motion.span>
              )}
              {processMsg && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`text-sm font-semibold mt-5 ${processMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {processMsg}
                </motion.span>
              )}
            </div>

            {/* Results Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                      <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Sorteo</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">1ro</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">2do</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">3ro</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">P3</th>
                      <th className="px-2 py-3 text-center border-b border-[#E8E8E3] w-[60px]">P4</th>
                      <th className="px-4 py-3 text-center border-b border-[#E8E8E3] w-[60px]">Lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, idx) => (
                      <motion.tr key={r.lotteryId}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02, duration: 0.2 }}
                        className={`border-b border-[#E8E8E3] transition-colors ${r.locked ? "bg-gray-50/50" : "bg-white hover:bg-[#F0F8F7]"}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                            <span className={`text-sm font-medium ${r.locked ? "text-[#999999]" : "text-[#333333]"}`}>{r.lotteryName}</span>
                          </div>
                        </td>
                        {r.numbers.map((num, i) => (
                          <td key={i} className="px-2 py-2">
                            <input type="text" value={num}
                              onChange={(e) => updateNumber(r.lotteryId, i, e.target.value)}
                              disabled={r.locked}
                              maxLength={i < 3 ? 2 : 4}
                              placeholder={i < 3 ? "00" : ""}
                              className={`w-[48px] h-[40px] text-center text-lg font-mono border-b-2 rounded-t bg-white focus:outline-none transition-colors ${
                                r.locked
                                  ? "border-[#E5E5E0] text-[#999999] bg-gray-100 cursor-not-allowed"
                                  : num ? "border-green-500 focus:border-[#4ECDC4]"
                                  : "border-[#E5E5E0] focus:border-[#4ECDC4]"
                              }`} />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => toggleLock(r.lotteryId)}
                            className={`p-1.5 rounded-md transition-all ${r.locked ? "text-green-500 hover:bg-green-50" : "text-amber-500 hover:bg-amber-50"}`}
                            title={r.locked ? "Desbloquear" : "Bloquear"}>
                            {r.locked ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {results.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-[#999] text-sm">Cargando sorteos...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60">
                <Save size={18} />
                {saving ? "Guardando..." : "Guardar resultados"}
              </button>
              <button onClick={() => setShowConfirm(true)} disabled={saving}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#EF4444] rounded-full hover:bg-[#DC2626] hover:shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60">
                <Trophy size={18} />
                {saving ? "Procesando..." : "Procesar ganadores"}
              </button>
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-[#333333] mb-2 flex items-center gap-2">
                      <Trophy size={20} className="text-amber-500" /> Procesar Ganadores
                    </h3>
                    <p className="text-sm text-[#666666] mb-2">
                      El sistema va a revisar <strong>todos los tickets pendientes</strong> de los sorteos con resultados publicados y los marcará como:
                    </p>
                    <ul className="text-sm text-[#555] mb-4 pl-4 space-y-1 list-disc">
                      <li><span className="font-semibold text-green-600">Ganador</span> — si el número jugado coincide con el resultado</li>
                      <li><span className="font-semibold text-red-500">Perdedor</span> — si no coincide</li>
                    </ul>
                    <p className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg mb-4">
                      ⚠️ Esta acción no se puede deshacer. Asegúrate de que los resultados sean correctos.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setShowConfirm(false)}
                        className="px-5 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-colors">
                        Cancelar
                      </button>
                      <button onClick={confirmProcess}
                        className="px-5 py-2 text-sm font-semibold text-white bg-[#EF4444] rounded-full hover:bg-[#DC2626] transition-colors flex items-center gap-2">
                        <Trophy size={16} /> Procesar ahora
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="logs"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {logFilters}
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {logsLoading ? (
                <div className="text-center py-10 text-[#999] text-sm">Cargando logs...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-[#bbb] text-sm">
                  <div className="text-3xl mb-2">📋</div>
                  <div>No hay logs para esta fecha.</div>
                  <div className="text-xs mt-1 text-[#ccc]">Los logs se crean automáticamente al guardar resultados.</div>
                </div>
              ) : (
                <DataTable columns={logColumns} data={logs} keyExtractor={(r) => r.id} pageSize={10} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
