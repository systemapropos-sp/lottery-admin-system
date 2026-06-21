import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function UsuariosBanca() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const filteredPools = useMemo(() => {
    if (selectedZones.length === 0) return bancasRaw;
    return bancasRaw.filter((bp) => selectedZones.includes(bp.zone_id ?? ""));
  }, [bancasRaw, selectedZones]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Usuarios de Banca" subtitle="Listado de usuarios asignados a cada banca" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <span>Entradas por pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-[#E5E5E0] rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
            >
              {[10, 25, 50, 100].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Usuario</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Banca</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Referencia</th>
                <th className="px-4 py-3 text-center border-b border-[#E8E8E3]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((bp, idx) => (
                <motion.tr
                  key={bp.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03, ease: easeOut }}
                  className={`border-b border-[#E8E8E3] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"} hover:bg-[#F0F8F7] group`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-[13px] font-medium text-[#4ECDC4] hover:underline cursor-pointer">
                      {bp.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#333333] font-medium">
                    <a href={`#/betting-pools`} className="hover:text-[#4ECDC4] transition-colors">
                      {bp.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] text-[#666666]">{bp.mwr_code}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[rgba(78,205,196,0.1)] text-[#666666] hover:text-[#4ECDC4] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-50 text-[#666666] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-[#999999]">{filteredPools.length} entradas encontradas</div>
      </div>
    </motion.div>
  );
}
