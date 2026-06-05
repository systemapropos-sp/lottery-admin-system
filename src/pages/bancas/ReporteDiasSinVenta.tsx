import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools, zones } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

// Generate consistent mock data for each pool x day
function generateSalesData() {
  const data: Record<string, boolean[]> = {};
  bettingPools.forEach((bp) => {
    const seed = bp.id.charCodeAt(bp.id.length - 1) + bp.id.charCodeAt(bp.id.length - 2);
    data[bp.id] = diasSemana.map((_, dayIdx) => (seed + dayIdx * 3) % 5 !== 0);
  });
  return data;
}
const salesData = generateSalesData();

export default function ReporteDiasSinVenta() {
  const [fecha, setFecha] = useState("2024-05-13");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const filteredPools = useMemo(() => {
    if (selectedZones.length === 0) return bettingPools;
    return bettingPools.filter((bp) => selectedZones.includes(bp.zoneId));
  }, [selectedZones]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Reporte de dias sin venta"
        subtitle="Vista semanal de ventas por banca"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#333333]">Fecha (semana):</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
              className="flex items-center gap-2 px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm text-[#333333] hover:border-[#4ECDC4] transition-colors bg-white"
            >
              <span>Zonas</span>
              <ChevronDown size={14} className={`transition-transform ${showZoneDropdown ? "rotate-180" : ""}`} />
              {selectedZones.length > 0 && (
                <span className="ml-1 bg-[#4ECDC4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedZones.length}
                </span>
              )}
            </button>
            {showZoneDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E0] rounded-lg shadow-lg z-20 min-w-[160px] py-1"
              >
                {zones.map((z) => (
                  <label key={z.id} className="flex items-center gap-2 px-3 py-2 hover:bg-[#F5F5F0] cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(z.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedZones([...selectedZones, z.id]);
                        } else {
                          setSelectedZones(selectedZones.filter((id) => id !== z.id));
                        }
                      }}
                      className="rounded border-gray-300 text-[#4ECDC4] focus:ring-[#4ECDC4]"
                    />
                    <span>{z.name}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Grid Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3] min-w-[100px]">Codigo</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3] min-w-[140px]">Nombre</th>
                {diasSemana.map((dia) => (
                  <th key={dia} className="px-3 py-3 text-center border-b border-[#E8E8E3] min-w-[80px]">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((pool, idx) => {
                const hasSales = salesData[pool.id] || diasSemana.map(() => false);
                return (
                  <motion.tr
                    key={pool.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02, ease: easeOut }}
                    className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                  >
                    <td className="px-4 py-3 font-mono text-[13px] text-[#666666]">{pool.mwrCode}</td>
                    <td className="px-4 py-3 text-[#333333] font-medium">{pool.name}</td>
                    {hasSales.map((sold, dayIdx) => (
                      <td key={dayIdx} className="px-3 py-3 text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2, delay: idx * 0.02 + dayIdx * 0.02 }}
                        >
                          {sold ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100">
                              <Check size={14} className="text-green-600" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100">
                              <X size={14} className="text-red-600" />
                            </span>
                          )}
                        </motion.div>
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-[#999999]">{filteredPools.length} entradas</div>
      </div>
    </motion.div>
  );
}
