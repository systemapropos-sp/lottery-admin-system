import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, FileText, Eye } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const daysWithoutSales = [0, 3, 5, 7, 2, 12, 4, 9, 15, 1, 6, 8, 20, 11, 14, 30, 18, 25, 10, 22];
const lastSaleDates = [
  "2024-05-15 10:30", "2024-05-12 14:00", "2024-05-10 09:15", "2024-05-08 16:45",
  "2024-05-13 11:20", "2024-05-03 08:00", "2024-05-11 13:30", "2024-05-06 15:00",
  "2024-04-30 12:00", "2024-05-14 17:00", "2024-05-09 10:00", "2024-05-07 14:30",
  "2024-04-25 09:00", "2024-05-04 11:00", "2024-05-01 16:00", "2024-04-15 08:30",
  "2024-04-27 13:00", "2024-04-20 15:30", "2024-05-05 12:30", "2024-04-23 10:00",
];

export default function ListaSinVentas() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const [dias, setDias] = useState(7);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const poolsWithDays = useMemo(() => {
    return bancasRaw.map((bp, idx) => ({
      ...bp,
      diasSinVenta: daysWithoutSales[idx] || 0,
      ultimaVenta: lastSaleDates[idx] || "N/A",
    }));
  }, [bancasRaw]);

  const filteredPools = useMemo(() => {
    return poolsWithDays.filter((bp) => {
      const matchesDays = bp.diasSinVenta >= dias;
      const matchesZone = selectedZones.length === 0 || selectedZones.includes(bp.zone_id ?? "");
      return matchesDays && matchesZone;
    });
  }, [poolsWithDays, dias, selectedZones]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Bancas sin ventas"
        subtitle="Listado de bancas que no han registrado ventas recientemente"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#333333]">Dias:</label>
            <input
              type="number"
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              min={1}
              className="w-20 px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]"
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
                {zonasRaw.map((z) => (
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
                    <span>{z.nombre}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E0] text-[#333333] rounded-full text-sm hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
            <Eye size={14} />
            <span>Ver ventas</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white rounded-full text-sm hover:bg-[#DC2626] transition-colors">
            <FileText size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Numero</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Nombre</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Referencia</th>
                <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Dias</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Ultima venta</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Zona</th>
                <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-[#999999]">
                    <div className="flex flex-col items-center gap-3">
                      <Eye size={40} className="text-[#22C55E]" />
                      <p className="text-sm font-medium">Todas las bancas tienen ventas recientes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPools.map((pool, idx) => (
                  <motion.tr
                    key={pool.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03, ease: easeOut }}
                    className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7]`}
                  >
                    <td className="px-4 py-3 text-[#666666]">{idx + 1}</td>
                    <td className="px-4 py-3 text-[#333333] font-medium">{pool.name}</td>
                    <td className="px-4 py-3 font-mono text-[13px] text-[#666666]">{pool.mwr_code}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                        pool.diasSinVenta > 14
                          ? "bg-red-100 text-red-700"
                          : pool.diasSinVenta > 7
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {pool.diasSinVenta}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{pool.ultimaVenta}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        pool.zone_name === "SFM" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                      }`}>
                        {pool.zone_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[13px]">
                      <span className={pool.balance > 0 ? "text-green-600" : pool.balance < 0 ? "text-red-600" : "text-[#999999]"}>
                        {pool.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-[#999999]">{filteredPools.length} entradas encontradas</div>
      </div>
    </motion.div>
  );
}
