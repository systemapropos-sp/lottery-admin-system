import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Settings } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { bettingPools, zones } from "@/data/mockData";
import type { BettingPool } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AccesoBancas() {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    bettingPools.forEach((bp) => {
      map[bp.id] = bp.isActive;
    });
    return map;
  });

  const togglePool = (id: string) => {
    setActiveToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredData = useMemo(() => {
    if (selectedZones.length === 0) return bettingPools;
    return bettingPools.filter((bp) => selectedZones.includes(bp.zoneId));
  }, [selectedZones]);

  const columns = [
    {
      key: "numero",
      header: "Numero",
      accessor: (_row: BettingPool) => "",
      sortable: false,
      align: "center" as const,
      width: "60px",
      cell: (_row: BettingPool, idx?: number) => (
        <span className="font-medium text-[#666666]">{(idx ?? 0) + 1}</span>
      ),
    },
    {
      key: "usuarios",
      header: "Usuarios",
      accessor: (row: BettingPool) => row.code,
      sortable: true,
      cell: (row: BettingPool) => (
        <a href={`#/pool-users`} className="text-[#4ECDC4] hover:underline font-medium">
          {row.code}
        </a>
      ),
    },
    {
      key: "nombre",
      header: "Nombre",
      accessor: (row: BettingPool) => row.name,
      sortable: true,
    },
    {
      key: "referencia",
      header: "Referencia",
      accessor: (row: BettingPool) => row.mwrCode,
      sortable: true,
      cell: (row: BettingPool) => (
        <span className="font-mono text-[13px] text-[#666666]">{row.mwrCode}</span>
      ),
    },
    {
      key: "zona",
      header: "Zona",
      accessor: (row: BettingPool) => row.zoneName,
      sortable: true,
      cell: (row: BettingPool) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.zoneName === "SFM" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
          {row.zoneName}
        </span>
      ),
    },
    {
      key: "activa",
      header: "Activa",
      accessor: (row: BettingPool) => (activeToggles[row.id] ? "Si" : "No"),
      sortable: false,
      align: "center" as const,
      cell: (row: BettingPool) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePool(row.id);
          }}
          className={`relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-200 ${
            activeToggles[row.id] ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
          }`}
        >
          <span
            className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
              activeToggles[row.id] ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      ),
    },
    {
      key: "configuraciones",
      header: "Configuraciones",
      accessor: () => "",
      sortable: false,
      align: "center" as const,
      cell: () => (
        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F0] text-[#666666] rounded-lg text-xs hover:bg-[#4ECDC4] hover:text-white transition-colors">
          <Settings size={12} />
          <span>Config</span>
        </button>
      ),
    },
    {
      key: "balanceRecargas",
      header: "Balance de recargas telefonicas",
      accessor: () => 0,
      sortable: false,
      align: "right" as const,
      cell: () => (
        <button className="px-3 py-1.5 bg-[#F5F5F0] text-[#666666] rounded-lg text-xs hover:bg-[#4ECDC4] hover:text-white transition-colors font-mono">
          $0.00
        </button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader title="Acceso a Bancas" subtitle="Gestion de acceso y configuraciones por banca" />

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
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(row) => row.id}
          pageSize={pageSize}
          emptyMessage="No se encontraron bancas"
        />
      </div>
    </motion.div>
  );
}
