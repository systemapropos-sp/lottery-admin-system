import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useCobradoresStore } from "@/store/cobradoresStore";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const statusConfig = {
  completado: {
    label: "Completado",
    icon: CheckCircle2,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  fallido: {
    label: "Fallido",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

export default function CobrosDelDia() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { cobros, cobradores, loading, fetchCobros, fetchCobradores } = useCobradoresStore();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchCobros(undefined, today);
    if (cobradores.length === 0) fetchCobradores();
  }, [fetchCobros, fetchCobradores, today]);

  // Map DB cobros → UI shape
  const cobrosUI = useMemo(() => {
    return cobros.map((c) => {
      const cobrador = cobradores.find((cb) => cb.id === c.cobrador_id);
      return {
        id: c.id.slice(0, 7).toUpperCase(),
        cobrador: cobrador?.name ?? "Desconocido",
        cobradorId: c.cobrador_id.slice(0, 6),
        banca: c.banca_name,
        bancaId: c.banca_id?.slice(0, 6) ?? "—",
        zone: cobrador?.zona_nombre ?? "—",
        amount: c.monto,
        time: formatTime(c.created_at),
        status: c.tipo === "cobro" ? "completado" : c.tipo === "prestamo" ? "pendiente" : "completado",
        method: c.tipo,
      };
    });
  }, [cobros, cobradores]);

  const filtered = cobrosUI.filter((c) => {
    const matchSearch =
      c.cobrador.toLowerCase().includes(search.toLowerCase()) ||
      c.banca.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCobrado = cobrosUI
    .filter((c) => c.status === "completado")
    .reduce((sum, c) => sum + c.amount, 0);
  const completados = cobrosUI.filter((c) => c.status === "completado").length;
  const pendientes = cobrosUI.filter((c) => c.status === "pendiente").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Cobros del Día"
        subtitle={`Cobros realizados el ${today}`}
        actions={
          <button
            onClick={() => navigate("/cobradores")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] hover:text-[#333333] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0] transition-colors"
          >
            <ArrowLeft size={14} />
            Cobradores
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Cobrado", value: `$${totalCobrado.toLocaleString()}`, color: "#14B8A6", icon: DollarSign },
          { label: "Completados", value: completados, color: "#10B981", icon: CheckCircle2 },
          { label: "Pendientes", value: pendientes, color: "#F59E0B", icon: Clock },
          { label: "Total Transacciones", value: cobrosUI.length, color: "#0EA5E9", icon: TrendingUp },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06, ease: easeOut }}
              className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color: card.color }} />
                <p className="text-[11px] text-[#999999] uppercase tracking-wide">{card.label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Filters */}
        <div className="p-4 border-b border-[#E5E5E0] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Buscar cobrador, banca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
          >
            <option value="todos">Todos</option>
            <option value="completado">Completados</option>
            <option value="pendiente">Pendientes</option>
            <option value="fallido">Fallidos</option>
          </select>
          <div className="flex items-center bg-[#F5F5F0] rounded-lg p-0.5 gap-0.5 ml-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "table" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-12 text-center text-[#999999] text-sm">Cargando cobros...</div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F8F5] text-[#666666] text-[12px] font-semibold uppercase tracking-[0.04em]">
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">ID</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Hora</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Cobrador</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Banca</th>
                  <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Zona</th>
                  <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Monto</th>
                  <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Método</th>
                  <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-[#999999] text-sm">No se encontraron cobros</td>
                  </tr>
                ) : (
                  filtered.map((cobro, idx) => {
                    const sc = statusConfig[cobro.status as keyof typeof statusConfig];
                    const Icon = sc.icon;
                    return (
                      <motion.tr
                        key={cobro.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: idx * 0.04, ease: easeOut }}
                        className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                      >
                        <td className="px-4 py-3"><span className="font-mono text-[11px] text-[#14B8A6] font-semibold">{cobro.id}</span></td>
                        <td className="px-4 py-3 text-[#666666] font-mono text-sm">{cobro.time}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#333333] text-sm">{cobro.cobrador}</p>
                            <p className="text-[11px] text-[#999999]">{cobro.cobradorId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-[#333333]">{cobro.banca}</p>
                            <p className="text-[11px] text-[#999999]">{cobro.bancaId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#666666]">{cobro.zone}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#14B8A6]">${cobro.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[11px] text-[#666666] capitalize">{cobro.method}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sc.color} ${sc.bg} ${sc.border}`}>
                            <Icon size={10} /> {sc.label}
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
            {filtered.map((cobro, idx) => {
              const sc = statusConfig[cobro.status as keyof typeof statusConfig];
              const Icon = sc.icon;
              return (
                <motion.div
                  key={cobro.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.05, ease: easeOut }}
                  className="border border-[#E5E5E0] rounded-xl p-4 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-[#14B8A6] font-semibold">{cobro.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sc.color} ${sc.bg} ${sc.border}`}>
                      <Icon size={9} /> {sc.label}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-[#333333]">{cobro.cobrador}</p>
                  <p className="text-[12px] text-[#666666]">{cobro.banca}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0EC]">
                    <div>
                      <p className="text-[10px] text-[#999999]">{cobro.zone} · {cobro.time}</p>
                      <p className="text-[11px] text-[#888888] capitalize">{cobro.method}</p>
                    </div>
                    <p className="font-bold text-[#14B8A6] text-base">${cobro.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="px-4 py-3 border-t border-[#E5E5E0] bg-[#FAFAF8] flex items-center justify-between">
          <span className="text-[12px] text-[#999999]">{filtered.length} cobros</span>
          <span className="text-[12px] font-semibold text-[#14B8A6]">
            Total: ${filtered.filter(c => c.status === "completado").reduce((s, c) => s + c.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
