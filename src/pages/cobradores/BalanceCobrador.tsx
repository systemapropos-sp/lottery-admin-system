import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockZoneBalance = [
  {
    id: "Z-001",
    zone: "Zona Norte",
    cobrador: "Juan Pérez",
    cobradorId: "COB-001",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.1)",
    border: "rgba(20,184,166,0.2)",
    totalCobrado: 12500,
    totalPendiente: 1800,
    totalBancas: 4,
    bancas: [
      { id: "B-001", name: "Banca Las Americas", cobrado: 3500, pendiente: 0,    estado: "al_dia" },
      { id: "B-002", name: "Lucky Stars",        cobrado: 1800, pendiente: 1800, estado: "pendiente" },
      { id: "B-003", name: "Banca El Triunfo",   cobrado: 3800, pendiente: 0,    estado: "al_dia" },
      { id: "B-004", name: "Super Chance",       cobrado: 3400, pendiente: 0,    estado: "al_dia" },
    ],
  },
  {
    id: "Z-002",
    zone: "Zona Sur",
    cobrador: "María García",
    cobradorId: "COB-002",
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.1)",
    border: "rgba(14,165,233,0.2)",
    totalCobrado: 8750,
    totalPendiente: 0,
    totalBancas: 3,
    bancas: [
      { id: "B-005", name: "Banca El Sol",      cobrado: 2800, pendiente: 0, estado: "al_dia" },
      { id: "B-006", name: "Grand Prix",         cobrado: 2100, pendiente: 0, estado: "al_dia" },
      { id: "B-007", name: "Banca Millonaria",   cobrado: 3850, pendiente: 0, estado: "al_dia" },
    ],
  },
  {
    id: "Z-003",
    zone: "Zona Este",
    cobrador: "Carlos López",
    cobradorId: "COB-003",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    totalCobrado: 0,
    totalPendiente: 9200,
    totalBancas: 3,
    bancas: [
      { id: "B-008", name: "Banca Oriental",  cobrado: 0, pendiente: 3100, estado: "pendiente" },
      { id: "B-009", name: "Lucky Dream",      cobrado: 0, pendiente: 2800, estado: "pendiente" },
      { id: "B-010", name: "Banca Fortuna",    cobrado: 0, pendiente: 3300, estado: "pendiente" },
    ],
  },
  {
    id: "Z-004",
    zone: "Zona Oeste",
    cobrador: "Ana Martínez",
    cobradorId: "COB-004",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    totalCobrado: 15200,
    totalPendiente: 0,
    totalBancas: 5,
    bancas: [
      { id: "B-011", name: "Banca Occidental",  cobrado: 2700, pendiente: 0, estado: "al_dia" },
      { id: "B-012", name: "El Gran Premio",     cobrado: 3200, pendiente: 0, estado: "al_dia" },
      { id: "B-013", name: "Banca Dorada",       cobrado: 4100, pendiente: 0, estado: "al_dia" },
      { id: "B-014", name: "Fortuna Max",        cobrado: 2900, pendiente: 0, estado: "al_dia" },
      { id: "B-015", name: "Banca Royal",        cobrado: 2300, pendiente: 0, estado: "al_dia" },
    ],
  },
  {
    id: "Z-005",
    zone: "Centro",
    cobrador: "Luis Rodríguez",
    cobradorId: "COB-005",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
    totalCobrado: 6800,
    totalPendiente: 2400,
    totalBancas: 4,
    bancas: [
      { id: "B-016", name: "Banca Central",  cobrado: 2800, pendiente: 0,    estado: "al_dia" },
      { id: "B-017", name: "Megajuego",       cobrado: 2900, pendiente: 0,    estado: "al_dia" },
      { id: "B-018", name: "Banca Cristal",   cobrado: 1100, pendiente: 2400, estado: "pendiente" },
      { id: "B-019", name: "Gran Casino",     cobrado: 0,    pendiente: 0,    estado: "al_dia" },
    ],
  },
];

const estadoConfig = {
  al_dia:    { label: "Al día",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  pendiente: { label: "Pendiente", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BalanceCobrador() {
  const navigate = useNavigate();
  const [expandedZone, setExpandedZone] = useState<string | null>("Z-001");
  const [viewMode, setViewMode] = useState<"detail" | "grid">("detail");

  const totalCobrado  = mockZoneBalance.reduce((s, z) => s + z.totalCobrado,  0);
  const totalPendiente = mockZoneBalance.reduce((s, z) => s + z.totalPendiente, 0);
  const totalGeneral  = totalCobrado + totalPendiente;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Balance"
        subtitle="Balance detallado por banca y zona de cobrador"
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

      {/* Global Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total General",  value: `$${totalGeneral.toLocaleString()}`,   color: "#0EA5E9",  Icon: DollarSign },
          { label: "Total Cobrado",  value: `$${totalCobrado.toLocaleString()}`,    color: "#10B981",  Icon: TrendingUp },
          { label: "Pendiente",      value: `$${totalPendiente.toLocaleString()}`, color: "#F59E0B",  Icon: TrendingDown },
          { label: "Zonas",          value: mockZoneBalance.length,                color: "#8B5CF6",  Icon: MapPin },
        ].map((card, idx) => {
          const Icon = card.Icon;
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

      {/* Main Balance Card */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-[#E5E5E0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#333333]">Balance por Zona y Banca</h3>
          <div className="flex items-center bg-[#F5F5F0] rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("detail")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "detail" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"}`}
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

        {viewMode === "detail" ? (
          /* ── Accordion Detail ── */
          <div className="divide-y divide-[#F0F0EC]">
            {mockZoneBalance.map((zone, idx) => {
              const isOpen = expandedZone === zone.id;
              const pct = zone.totalCobrado + zone.totalPendiente > 0
                ? Math.round((zone.totalCobrado / (zone.totalCobrado + zone.totalPendiente)) * 100)
                : 0;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Zone row */}
                  <button
                    onClick={() => setExpandedZone(isOpen ? null : zone.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAF8] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: zone.color }}>
                      <MapPin size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-[#333333]">{zone.zone}</p>
                        <span className="text-[11px] text-[#999999]">— {zone.cobrador}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-[#F0F0EC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: zone.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0 text-right">
                      <div>
                        <p className="text-[10px] text-[#999999]">Cobrado</p>
                        <p className="font-bold text-[13px]" style={{ color: zone.color }}>${zone.totalCobrado.toLocaleString()}</p>
                      </div>
                      {zone.totalPendiente > 0 && (
                        <div>
                          <p className="text-[10px] text-[#999999]">Pendiente</p>
                          <p className="font-bold text-[13px] text-amber-600">${zone.totalPendiente.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-[#999999]">%</p>
                        <p className="font-bold text-[13px] text-[#555555]">{pct}%</p>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }} className="text-[#999999] flex-shrink-0">
                      <ChevronRight size={15} />
                    </motion.div>
                  </button>

                  {/* Bancas detail */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#F0F0EC] bg-[#FAFAF8]"
                    >
                      <div className="px-5 py-3">
                        <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-wide mb-2">
                          Bancas — {zone.zone}
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[11px] text-[#999999] font-semibold uppercase">
                                <th className="text-left pb-2 pr-4">Banca</th>
                                <th className="text-right pb-2 pr-4">Cobrado</th>
                                <th className="text-right pb-2 pr-4">Pendiente</th>
                                <th className="text-center pb-2">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0EC]">
                              {zone.bancas.map((banca, bIdx) => {
                                const ec = estadoConfig[banca.estado as keyof typeof estadoConfig];
                                return (
                                  <motion.tr
                                    key={banca.id}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: bIdx * 0.04 }}
                                  >
                                    <td className="py-2 pr-4">
                                      <div className="flex items-center gap-2">
                                        <Building2 size={12} style={{ color: zone.color }} />
                                        <span className="text-[#333333] font-medium">{banca.name}</span>
                                        <span className="font-mono text-[10px] text-[#BBBBBB]">{banca.id}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 pr-4 text-right font-semibold" style={{ color: zone.color }}>
                                      ${banca.cobrado.toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4 text-right font-semibold text-amber-600">
                                      {banca.pendiente > 0 ? `$${banca.pendiente.toLocaleString()}` : "—"}
                                    </td>
                                    <td className="py-2 text-center">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ec.color} ${ec.bg} ${ec.border}`}>
                                        {ec.label}
                                      </span>
                                    </td>
                                  </motion.tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── Grid View ── */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockZoneBalance.map((zone, idx) => {
              const pct = zone.totalCobrado + zone.totalPendiente > 0
                ? Math.round((zone.totalCobrado / (zone.totalCobrado + zone.totalPendiente)) * 100)
                : 0;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.06, ease: easeOut }}
                  className="rounded-xl border p-4"
                  style={{ backgroundColor: zone.bg, borderColor: zone.border }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: zone.color }}>
                      <MapPin size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: zone.color }}>{zone.zone}</p>
                      <p className="text-[10px] text-[#64748B]">{zone.cobrador}</p>
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-[#64748B] mb-1">
                      <span>Cobrado</span><span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden border" style={{ borderColor: zone.border }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: zone.color }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2 border" style={{ borderColor: zone.border }}>
                      <p className="text-[10px] text-[#999999]">Cobrado</p>
                      <p className="font-bold text-sm" style={{ color: zone.color }}>${zone.totalCobrado.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border" style={{ borderColor: zone.border }}>
                      <p className="text-[10px] text-[#999999]">Pendiente</p>
                      <p className="font-bold text-sm text-amber-600">${zone.totalPendiente.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setViewMode("detail"); setExpandedZone(zone.id); }}
                    className="mt-3 w-full text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
                    style={{ color: zone.color, border: `1px solid ${zone.border}`, backgroundColor: "white" }}
                  >
                    <ChevronDown size={11} /> Ver detalle
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E5E0] bg-[#FAFAF8] flex items-center justify-between">
          <span className="text-[12px] text-[#999999]">{mockZoneBalance.length} zonas · {mockZoneBalance.reduce((s, z) => s + z.totalBancas, 0)} bancas</span>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-semibold text-emerald-600">Cobrado: ${totalCobrado.toLocaleString()}</span>
            <span className="text-[12px] font-semibold text-amber-600">Pendiente: ${totalPendiente.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
