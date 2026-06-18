import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowLeft,
  Building2,
  Users,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockZones = [
  {
    id: "Z-001",
    name: "Zona Norte",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.1)",
    border: "rgba(20,184,166,0.2)",
    cobradores: ["Juan Pérez"],
    bancas: [
      { id: "B-001", name: "Banca Las Americas", address: "Av. Las Americas #12" },
      { id: "B-002", name: "Lucky Stars", address: "C/ Principal #45" },
      { id: "B-003", name: "Banca El Triunfo", address: "Av. Norte #78" },
      { id: "B-004", name: "Super Chance", address: "C/ Central #9" },
    ],
  },
  {
    id: "Z-002",
    name: "Zona Sur",
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.1)",
    border: "rgba(14,165,233,0.2)",
    cobradores: ["María García"],
    bancas: [
      { id: "B-005", name: "Banca El Sol", address: "Av. Sur #30" },
      { id: "B-006", name: "Grand Prix", address: "C/ Nuevo Sur #55" },
      { id: "B-007", name: "Banca Millonaria", address: "Av. Independencia #100" },
    ],
  },
  {
    id: "Z-003",
    name: "Zona Este",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    cobradores: ["Carlos López"],
    bancas: [
      { id: "B-008", name: "Banca Oriental", address: "Av. Del Este #7" },
      { id: "B-009", name: "Lucky Dream", address: "C/ Este #22" },
      { id: "B-010", name: "Banca Fortuna", address: "Av. Libertad #88" },
    ],
  },
  {
    id: "Z-004",
    name: "Zona Oeste",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    cobradores: ["Ana Martínez"],
    bancas: [
      { id: "B-011", name: "Banca Occidental", address: "Av. Oeste #15" },
      { id: "B-012", name: "El Gran Premio", address: "C/ Oeste #40" },
      { id: "B-013", name: "Banca Dorada", address: "Av. Principal #60" },
      { id: "B-014", name: "Fortuna Max", address: "C/ Altagracia #3" },
      { id: "B-015", name: "Banca Royal", address: "Av. Kennedy #120" },
    ],
  },
  {
    id: "Z-005",
    name: "Centro",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
    cobradores: ["Luis Rodríguez"],
    bancas: [
      { id: "B-016", name: "Banca Central", address: "C/ Duarte #1" },
      { id: "B-017", name: "Megajuego", address: "Av. Mella #25" },
      { id: "B-018", name: "Banca Cristal", address: "C/ Hostos #88" },
      { id: "B-019", name: "Gran Casino", address: "Av. París #47" },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function RutasZonas() {
  const navigate = useNavigate();
  const [expandedZone, setExpandedZone] = useState<string | null>("Z-001");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const totalBancas = mockZones.reduce((sum, z) => sum + z.bancas.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Rutas / Zonas"
        subtitle="Zonas y bancas asignadas a cada cobrador"
        actions={
          <div className="flex items-center gap-2">
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

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Zonas", value: mockZones.length, color: "#14B8A6" },
          { label: "Total Bancas", value: totalBancas, color: "#0EA5E9" },
          { label: "Cobradores Asignados", value: mockZones.filter(z => z.cobradores.length > 0).length, color: "#8B5CF6" },
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

      {/* View Toggle + Zones */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-[#E5E5E0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#333333]">Zonas y Rutas</h3>
          <div className="flex items-center bg-[#F5F5F0] rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                viewMode === "list" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"
              }`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                viewMode === "grid" ? "bg-white text-[#14B8A6] shadow-sm" : "text-[#999999]"
              }`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          /* Accordion List */
          <div className="divide-y divide-[#F0F0EC]">
            {mockZones.map((zone, idx) => {
              const isOpen = expandedZone === zone.id;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Zone header */}
                  <button
                    onClick={() => setExpandedZone(isOpen ? null : zone.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: zone.color }}
                    >
                      <MapPin size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#333333]">{zone.name}</p>
                      <p className="text-[11px] text-[#999999] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users size={10} /> {zone.cobradores.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 size={10} /> {zone.bancas.length} bancas
                        </span>
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-[#999999]"
                    >
                      <ChevronRight size={15} />
                    </motion.div>
                  </button>

                  {/* Bancas list */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#FAFAF8] border-t border-[#F0F0EC]"
                    >
                      <div className="px-5 py-3">
                        <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-wide mb-2">
                          Bancas en {zone.name}
                        </p>
                        <div className="space-y-1.5">
                          {zone.bancas.map((banca, bIdx) => (
                            <motion.div
                              key={banca.id}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: bIdx * 0.04 }}
                              className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E8E8E3]"
                            >
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: zone.bg, border: `1px solid ${zone.border}` }}
                              >
                                <Building2 size={11} style={{ color: zone.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-[#333333]">{banca.name}</p>
                                <p className="text-[11px] text-[#999999] truncate">{banca.address}</p>
                              </div>
                              <span className="font-mono text-[10px] text-[#AAAAAA]">{banca.id}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockZones.map((zone, idx) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.06, ease: easeOut }}
                className="rounded-xl border p-4"
                style={{ backgroundColor: zone.bg, borderColor: zone.border }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: zone.color }}
                  >
                    <MapPin size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: zone.color }}>{zone.name}</p>
                    <p className="text-[10px] text-[#64748B]">{zone.cobradores[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Building2 size={11} style={{ color: zone.color }} />
                    {zone.bancas.length} bancas
                  </span>
                </div>
                <button
                  onClick={() => { setViewMode("list"); setExpandedZone(zone.id); }}
                  className="mt-3 w-full text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  style={{ color: zone.color, border: `1px solid ${zone.border}`, backgroundColor: "white" }}
                >
                  <ChevronDown size={11} /> Ver bancas
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
