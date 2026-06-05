import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Eye,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools, lotteries } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonitorEntry {
  id: string;
  bancaName: string;
  monto: number;
}

type QuickFilterType = "todos" | "top10" | "gt100" | "gt500" | "gt1000";

// ─── Mock Monitor Data ────────────────────────────────────────────────────────

function generateMonitorData(): MonitorEntry[] {
  const data: MonitorEntry[] = [
    { id: "m-001", bancaName: "MATADOR-SPORT", monto: 3200.0 },
    { id: "m-002", bancaName: "MMW RD 02", monto: 2850.0 },
    { id: "m-003", bancaName: "MMW RD 05", monto: 1500.0 },
    { id: "m-004", bancaName: "MMW RD 01", monto: 1200.0 },
    { id: "m-005", bancaName: "MMW RD 07", monto: 980.0 },
    { id: "m-006", bancaName: "MMW RD 03", monto: 750.0 },
    { id: "m-007", bancaName: "MMW RD 09", monto: 620.0 },
    { id: "m-008", bancaName: "MMW RD 04", monto: 450.0 },
    { id: "m-009", bancaName: "MMW RD 11", monto: 320.0 },
    { id: "m-010", bancaName: "MMW RD 06", monto: 280.0 },
    { id: "m-011", bancaName: "MMW RD 08", monto: 150.0 },
    { id: "m-012", bancaName: "MMW RD 10", monto: 120.0 },
    { id: "m-013", bancaName: "MMW RD 13", monto: 85.0 },
    { id: "m-014", bancaName: "MMW RD 14", monto: 50.0 },
    { id: "m-015", bancaName: "MMW RD 15", monto: 25.0 },
    { id: "m-016", bancaName: "MMW RD 12", monto: 10.0 },
    { id: "m-017", bancaName: "MMW RD 16", monto: 0.0 },
    { id: "m-018", bancaName: "MMW RD 17", monto: 0.0 },
    { id: "m-019", bancaName: "MMW RD 18", monto: 0.0 },
    { id: "m-020", bancaName: "MMW RD 19", monto: 0.0 },
    { id: "m-021", bancaName: "MMW RD 20", monto: 0.0 },
  ];
  // Add some inactive pool names from bettingPools
  return data.map((d, i) => ({
    ...d,
    bancaName:
      bettingPools[i]?.name || d.bancaName,
  }));
}

const allMonitorData = generateMonitorData();

const quickFilterOptions: { key: QuickFilterType; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "top10", label: "Top 10" },
  { key: "gt100", label: ">$100" },
  { key: "gt500", label: ">$500" },
  { key: "gt1000", label: ">$1000" },
];

// ─── Format currency ──────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function F8Monitoreo() {
  const [fecha, setFecha] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSorteos, setSelectedSorteos] = useState<string[]>([]);
  const [jugada, setJugada] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>("todos");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"monto" | "banca">("monto");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // Sort toggle
  function toggleSort(column: "monto" | "banca") {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
  }

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let data = [...allMonitorData];

    // Quick filter
    switch (quickFilter) {
      case "top10":
        data = data.sort((a, b) => b.monto - a.monto).slice(0, 10);
        break;
      case "gt100":
        data = data.filter((d) => d.monto > 100);
        break;
      case "gt500":
        data = data.filter((d) => d.monto > 500);
        break;
      case "gt1000":
        data = data.filter((d) => d.monto > 1000);
        break;
      default:
        break;
    }

    // Jugada filter
    if (jugada.trim()) {
      data = data.filter((d) =>
        d.bancaName.toLowerCase().includes(jugada.toLowerCase())
      );
    }

    // Sort
    data.sort((a, b) => {
      if (sortBy === "monto") {
        return sortDir === "asc" ? a.monto - b.monto : b.monto - a.monto;
      }
      return sortDir === "asc"
        ? a.bancaName.localeCompare(b.bancaName)
        : b.bancaName.localeCompare(a.bancaName);
    });

    return data;
  }, [quickFilter, jugada, sortBy, sortDir]);

  const total = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.monto, 0),
    [filteredData]
  );

  const maxMonto = useMemo(
    () => Math.max(...filteredData.map((d) => d.monto), 1),
    [filteredData]
  );

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
      <PageHeader title="F8 - Monitoreo de jugadas por Banca" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          {/* Fecha */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#666666]">Fecha</label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
              />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="pl-9 pr-3 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
              />
            </div>
          </div>

          {/* Sorteos multi-select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#666666]">
              Sorteos
            </label>
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
              />
              <select
                multiple={false}
                value={selectedSorteos[0] || ""}
                onChange={(e) =>
                  setSelectedSorteos(e.target.value ? [e.target.value] : [])
                }
                className="pl-9 pr-8 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all appearance-none bg-white min-w-[180px]"
              >
                <option value="">Todos los sorteos</option>
                {lotteries.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jugada input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#666666]">
              Jugada
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
              />
              <input
                type="text"
                placeholder="Numero..."
                value={jugada}
                onChange={(e) => setJugada(e.target.value)}
                className="pl-9 pr-3 py-2.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all w-32"
              />
            </div>
          </div>

          {/* Refrescar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4ECDC4] text-white text-sm font-medium hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refrescar
          </motion.button>
        </div>
      </motion.div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-[#666666] mb-1">Total</p>
            <motion.p
              key={total}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-[#333333] tabular-nums"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatCurrency(total)}
            </motion.p>
          </div>

          {/* Quick filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Eye size={16} className="text-[#999999] mr-1" />
            {quickFilterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setQuickFilter(opt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  quickFilter === opt.key
                    ? "bg-[#4ECDC4] text-white shadow-[0_2px_6px_rgba(78,205,196,0.3)]"
                    : "bg-[#F5F5F0] text-[#666666] hover:bg-[#E8E8E3]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th
                  className="px-4 py-3 text-left border-b border-[#E8E8E3] cursor-pointer select-none hover:text-[#333333] transition-colors"
                  onClick={() => toggleSort("banca")}
                >
                  <div className="flex items-center gap-1">
                    Banca
                    {sortBy === "banca" && (
                      <span className="text-[#4ECDC4]">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-[#E8E8E3] cursor-pointer select-none hover:text-[#333333] transition-colors"
                  onClick={() => toggleSort("monto")}
                >
                  <div className="flex items-center gap-1">
                    Monto
                    {sortBy === "monto" && (
                      <span className="text-[#4ECDC4]">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3] w-full">
                  Distribucion
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((entry, idx) => {
                  const percentage =
                    maxMonto > 0 ? (entry.monto / maxMonto) * 100 : 0;
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * 0.04,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                      }}
                      className={`border-b border-[#E8E8E3] transition-colors hover:bg-[#F0F8F7] ${
                        idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                      }`}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-[#333333]">
                          {entry.bancaName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className="tabular-nums font-medium text-[#333333]"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {formatCurrency(entry.monto)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-4 bg-[#F0F0EB] rounded-full overflow-hidden min-w-[100px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{
                                duration: 0.6,
                                ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                                delay: idx * 0.05,
                              }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, #6FE3DC 0%, #4ECDC4 50%, #3DBDB5 100%)`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#999999] tabular-nums w-12 text-right">
                            {maxMonto > 0
                              ? `${((entry.monto / total) * 100).toFixed(1)}%`
                              : "0.0%"}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-16 text-center text-[#999999]"
                  >
                    No hay datos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-[#F8F8F5] font-semibold text-[#333333] border-t-2 border-[#E8E8E3]">
                <tr>
                  <td className="px-4 py-3">TOTAL</td>
                  <td
                    className="px-4 py-3 tabular-nums"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-3">100.0%</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
