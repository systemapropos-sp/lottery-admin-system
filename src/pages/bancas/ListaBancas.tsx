import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { useBancasZonas } from "@/context/BancasZonasContext";
import type { Banca } from "@/store/bancasStore";
import { useBancasStore } from "@/store/bancasStore";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
};

const pageSizeOptions = [10, 25, 50, 100];

export default function ListaBancas() {
  const { bancas, zonas, bancasLoading } = useBancasZonas();
  const { updateBanca } = useBancasStore();

  const [search, setSearch]               = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [pageSize, setPageSize]           = useState(10);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  // local toggle state mirrors is_active; updates Supabase on click
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({});

  // Merge Supabase is_active with any local override
  const isActive = (b: Banca): boolean =>
    activeToggles[b.id] !== undefined ? activeToggles[b.id] : b.is_active;

  const filteredData = useMemo(() => {
    return bancas.filter((bp) => {
      const matchesSearch =
        search === "" ||
        bp.name.toLowerCase().includes(search.toLowerCase()) ||
        bp.mwr_code.toLowerCase().includes(search.toLowerCase()) ||
        bp.code.toLowerCase().includes(search.toLowerCase());
      const matchesZone =
        selectedZones.length === 0 ||
        selectedZones.includes(bp.zone_id ?? "") ||
        selectedZones.includes(bp.zone_name ?? "");
      return matchesSearch && matchesZone;
    });
  }, [search, selectedZones, bancas]);

  const togglePool = async (b: Banca) => {
    const newVal = !isActive(b);
    setActiveToggles((prev) => ({ ...prev, [b.id]: newVal }));
    await updateBanca(b.id, { is_active: newVal });
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return "$0.00";
    return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const columns = [
    {
      key: "numero",
      header: "Numero",
      accessor: (_row: Banca) => 0,
      sortable: false,
      align: "center" as const,
      width: "60px",
      cell: (_row: Banca, idx?: number) => (
        <span className="font-medium text-[#666666]">{(idx ?? 0) + 1}</span>
      ),
    },
    {
      key: "nombre",
      header: "Nombre",
      accessor: (row: Banca) => row.name,
      sortable: true,
    },
    {
      key: "referencia",
      header: "Referencia",
      accessor: (row: Banca) => row.mwr_code,
      sortable: true,
      cell: (row: Banca) => (
        <span className="font-mono text-[13px] text-[#666666]">{row.mwr_code}</span>
      ),
    },
    {
      key: "usuarios",
      header: "Usuarios",
      accessor: (row: Banca) => row.code,
      sortable: true,
      cell: (row: Banca) => (
        <a href="#/pool-users" className="text-[#4ECDC4] hover:underline font-medium">
          {row.code}
        </a>
      ),
    },
    {
      key: "activa",
      header: "Activa",
      accessor: (row: Banca) => (isActive(row) ? "Si" : "No"),
      sortable: false,
      align: "center" as const,
      cell: (row: Banca) => (
        <button
          onClick={(e) => { e.stopPropagation(); togglePool(row); }}
          className={`relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-200 ${
            isActive(row) ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
          }`}
        >
          <span
            className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
              isActive(row) ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      ),
    },
    {
      key: "zona",
      header: "Zona",
      accessor: (row: Banca) => row.zone_name ?? "—",
      sortable: true,
      cell: (row: Banca) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#E0F7F5] text-[#0F766E]">
          {row.zone_name ?? "—"}
        </span>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row: Banca) => row.balance,
      sortable: true,
      align: "right" as const,
      cell: (row: Banca) => (
        <span
          className={`font-mono text-[13px] ${
            row.balance > 0 ? "text-green-600" : row.balance < 0 ? "text-red-600" : "text-[#999999]"
          }`}
        >
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      key: "caida",
      header: "Caida acumulada",
      accessor: () => 0,
      sortable: false,
      align: "right" as const,
      cell: () => <span className="font-mono text-[13px] text-[#999999]">$0.00</span>,
    },
    {
      key: "prestamos",
      header: "Prestamos",
      accessor: () => 0,
      sortable: false,
      align: "right" as const,
      cell: () => <span className="font-mono text-[13px] text-[#999999]">$0.00</span>,
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <PageHeader
        title="Bancas"
        subtitle="Lista de todas las bancas registradas en el sistema"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Zonas multi-select */}
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
                {zonas.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#999]">Sin zonas</p>
                )}
                {zonas.map((z) => (
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

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Buscar por nombre, referencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
            />
          </div>

          {/* Page size */}
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <span>Entradas por pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-[#E5E5E0] rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-[#4ECDC4]"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {bancasLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#4ECDC4]" />
          <span className="ml-2 text-sm text-[#999]">Cargando bancas...</span>
        </div>
      )}

      {/* Table */}
      {!bancasLoading && (
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <DataTable
            columns={columns}
            data={filteredData}
            keyExtractor={(row) => row.id}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            emptyMessage="No se encontraron bancas"
          />
          <div className="mt-3 text-sm text-[#999999]">
            {filteredData.length} entradas encontradas
          </div>
        </div>
      )}
    </motion.div>
  );
}
