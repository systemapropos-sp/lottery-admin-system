import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Download,
  LayoutGrid,
  List,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockHistorial = [
  { id: "TXN-001", date: "2026-06-17", cobrador: "Juan Pérez",    cobradorId: "COB-001", banca: "Banca Las Americas", zone: "Zona Norte", amount: 3500, status: "completado", method: "efectivo" },
  { id: "TXN-002", date: "2026-06-17", cobrador: "María García",  cobradorId: "COB-002", banca: "Banca El Sol",        zone: "Zona Sur",   amount: 2800, status: "completado", method: "efectivo" },
  { id: "TXN-003", date: "2026-06-17", cobrador: "Ana Martínez",  cobradorId: "COB-004", banca: "Banca Royal",        zone: "Zona Oeste", amount: 5200, status: "completado", method: "transferencia" },
  { id: "TXN-004", date: "2026-06-17", cobrador: "Juan Pérez",    cobradorId: "COB-001", banca: "Lucky Stars",        zone: "Zona Norte", amount: 1800, status: "pendiente",  method: "efectivo" },
  { id: "TXN-005", date: "2026-06-16", cobrador: "Luis Rodríguez",cobradorId: "COB-005", banca: "Banca Central",     zone: "Centro",     amount: 4100, status: "completado", method: "transferencia" },
  { id: "TXN-006", date: "2026-06-16", cobrador: "Ana Martínez",  cobradorId: "COB-004", banca: "El Gran Premio",    zone: "Zona Oeste", amount: 3300, status: "fallido",    method: "efectivo" },
  { id: "TXN-007", date: "2026-06-16", cobrador: "María García",  cobradorId: "COB-002", banca: "Grand Prix",        zone: "Zona Sur",   amount: 2100, status: "completado", method: "efectivo" },
  { id: "TXN-008", date: "2026-06-15", cobrador: "Juan Pérez",    cobradorId: "COB-001", banca: "Super Chance",      zone: "Zona Norte", amount: 4800, status: "completado", method: "transferencia" },
  { id: "TXN-009", date: "2026-06-15", cobrador: "Luis Rodríguez",cobradorId: "COB-005", banca: "Megajuego",         zone: "Centro",     amount: 2900, status: "completado", method: "efectivo" },
  { id: "TXN-010", date: "2026-06-14", cobrador: "Ana Martínez",  cobradorId: "COB-004", banca: "Banca Dorada",      zone: "Zona Oeste", amount: 6100, status: "completado", method: "transferencia" },
  { id: "TXN-011", date: "2026-06-14", cobrador: "María García",  cobradorId: "COB-002", banca: "Banca Millonaria",  zone: "Zona Sur",   amount: 3750, status: "completado", method: "efectivo" },
  { id: "TXN-012", date: "2026-06-13", cobrador: "Juan Pérez",    cobradorId: "COB-001", banca: "Banca El Triunfo",  zone: "Zona Norte", amount: 2200, status: "completado", method: "efectivo" },
];

const statusConfig = {
  completado: { label: "Completado", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  pendiente:  { label: "Pendiente",  icon: Clock,        color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  fallido:    { label: "Fallido",    icon: XCircle,      color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
};

const allDates   = [...new Set(mockHistorial.map((h) => h.date))].sort((a, b) => b.localeCompare(a));
const allCobradores = [...new Set(mockHistorial.map((h) => h.cobrador))];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function HistorialCobros() {
  const navigate = useNavigate();
  const [search, setSearch]         = useState("");
  const [dateFilter, setDateFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [cobradorFilter, setCobradorFilter] = useState("todos");
  const [viewMode, setViewMode]     = useState<"table" | "grid">("table");

  const filtered = useMemo(() =>
    mockHistorial.filter((h) => {
      const ms = h.cobrador.toLowerCase().includes(search.toLowerCase()) ||
                 h.banca.toLowerCase().includes(search.toLowerCase()) ||
                 h.id.toLowerCase().includes(search.toLowerCase());
      const md = dateFilter === "todos" || h.date === dateFilter;
      const mst = statusFilter === "todos" || h.status === statusFilter;
      const mc = cobradorFilter === "todos" || h.cobrador === cobradorFilter;
      return ms && md && mst && mc;
    }),
  [search, dateFilter, statusFilter, cobradorFilter]);

  const totalFiltrado = filtered
    .filter((h) => h.status === "completado")
    .reduce((s, h) => s + h.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Historial de Cobros"
        subtitle="Registro histórico completo de todos los cobros"
        actions={
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
              title="Exportar"
            >
              <Download size={14} />
              Exportar
            </button>
            <button
              onClick={() => navigate("/cobradores")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] hover:text-[#333333] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
            >
              <ArrowLeft size={14} />
              Cobradores
            </button>
          </div>
        }
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Registros", value: mockHistorial.length, color: "#0EA5E9" },
          { label: "Completados", value: mockHistorial.filter(h => h.status === "completado").length, color: "#10B981" },
          { label: "Monto Total", value: `$${mockHistorial.filter(h => h.status === "completado").reduce((s, h) => s + h.amount, 0).toLocaleString()}`, color: "#14B8A6" },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.06, ease: easeOut }}
            className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[11px] text-[#999999] uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Filters */}
        <div className="p-4 border-b border-[#E5E5E0] flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px] flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            />
          </div>
          <div className="flex items-center gap-1.5 border border-[#E5E5E0] rounded-lg px-3 py-2 bg-white">
            <Calendar size={13} className="text-[#999999]" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm bg-transparent focus:outline-none text-[#555555]"
            >
              <option value="todos">Todas las fechas</option>
              {allDates.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <select
            value={cobradorFilter}
            onChange={(e) => setCobradorFilter(e.target.value)}
            className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
          >
            <option value="todos">Todos los cobradores</option>
            {allCobradores.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
          >
            <option value="todos">Todos los estados</option>
            <option value="completado">Completados</option>
            <option value="pendiente">Pendientes</option>
            <option value="fallido">Fallidos</option>
          </select>
          <div className="flex items-center bg-[#F5F5F0] rounded-lg p-0.5 gap-0.5 ml-auto">
            <button onClick={() => setViewMode("table")} className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "table" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"}`}><List size={14} /></button>
            <button onClick={() => setViewMode("grid")}  className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "grid"  ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"}`}><LayoutGrid size={14} /></button>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F8F5] text-[#666666] text-[12px] font-semibold uppercase tracking-[0.04em]">
                  {["ID", "Fecha", "Cobrador", "Banca", "Zona", "Monto", "Método", "Estado"].map((h) => (
                    <th key={h} className={`px-4 py-3 border-b border-[#E8E8E3] ${h === "Monto" ? "text-right" : h === "Método" || h === "Estado" ? "text-center" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#999999]">Sin resultados</td></tr>
                ) : (
                  filtered.map((h, idx) => {
                    const sc = statusConfig[h.status as keyof typeof statusConfig];
                    const Icon = sc.icon;
                    return (
                      <motion.tr
                        key={h.id}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03, ease: easeOut }}
                        className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                      >
                        <td className="px-4 py-3"><span className="font-mono text-[11px] text-[#14B8A6] font-semibold">{h.id}</span></td>
                        <td className="px-4 py-3 font-mono text-[12px] text-[#666666]">{h.date}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm text-[#333333]">{h.cobrador}</p>
                          <p className="text-[10px] text-[#999999]">{h.cobradorId}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#444444]">{h.banca}</td>
                        <td className="px-4 py-3 text-[13px] text-[#666666]">{h.zone}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#14B8A6]">${h.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-[11px] text-[#666666] capitalize">{h.method}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sc.color} ${sc.bg} ${sc.border}`}>
                            <Icon size={9} /> {sc.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((h, idx) => {
              const sc = statusConfig[h.status as keyof typeof statusConfig];
              const Icon = sc.icon;
              return (
                <motion.div key={h.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, ease: easeOut }}
                  className="border border-[#E5E5E0] rounded-xl p-4 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[11px] text-[#14B8A6] font-semibold">{h.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sc.color} ${sc.bg} ${sc.border}`}><Icon size={9} />{sc.label}</span>
                  </div>
                  <p className="font-semibold text-sm text-[#333333]">{h.cobrador}</p>
                  <p className="text-[12px] text-[#666666]">{h.banca}</p>
                  <div className="flex justify-between mt-3 pt-3 border-t border-[#F0F0EC]">
                    <div>
                      <p className="text-[10px] text-[#999999]">{h.date}</p>
                      <p className="text-[11px] text-[#888888] capitalize">{h.method} · {h.zone}</p>
                    </div>
                    <p className="font-bold text-[#14B8A6] text-base">${h.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="px-4 py-3 border-t border-[#E5E5E0] bg-[#FAFAF8] flex items-center justify-between">
          <span className="text-[12px] text-[#999999]">{filtered.length} registros</span>
          <span className="text-[12px] font-semibold text-[#14B8A6]">Cobrado: ${totalFiltrado.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
