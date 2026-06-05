import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, Plus } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { bettingPools, zones } from "@/data/mockData";
import type { BettingPool } from "@/data/mockData";

// ─── Additional Entity Types ──────────────────────────────────────────────────

interface Employee {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

interface OtherEntity {
  id: string;
  name: string;
  code: string;
  balance: number;
  caidaAcumulada: number;
  prestamo: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const employees: Employee[] = [
  { id: "emp-001", name: "Juan Perez", code: "EMP-0001", balance: 25000.0, caidaAcumulada: 0.0, prestamo: 5000.0 },
  { id: "emp-002", name: "Maria Garcia", code: "EMP-0002", balance: 15000.0, caidaAcumulada: 1200.0, prestamo: 0.0 },
  { id: "emp-003", name: "Carlos Lopez", code: "EMP-0003", balance: -3500.0, caidaAcumulada: 3500.0, prestamo: 2000.0 },
  { id: "emp-004", name: "Ana Martinez", code: "EMP-0004", balance: 42000.0, caidaAcumulada: 0.0, prestamo: 0.0 },
  { id: "emp-005", name: "Luis Rodriguez", code: "EMP-0005", balance: 8900.0, caidaAcumulada: 500.0, prestamo: 1000.0 },
];

const banks: Bank[] = [
  { id: "bank-01", name: "Banco Popular", code: "BNK-0001", balance: 1250000.0, caidaAcumulada: 0.0, prestamo: 0.0 },
  { id: "bank-02", name: "Banco BHD", code: "BNK-0002", balance: -233415.0, caidaAcumulada: 15000.0, prestamo: 50000.0 },
  { id: "bank-03", name: "Banco Reservas", code: "BNK-0003", balance: 450000.0, caidaAcumulada: 0.0, prestamo: 0.0 },
  { id: "bank-04", name: "ScotiaBank", code: "BNK-0004", balance: 78000.0, caidaAcumulada: 2000.0, prestamo: 15000.0 },
];

const zoneEntities = zones.map((z) => ({
  id: z.id,
  name: z.name,
  code: `ZON-${z.id.split("-")[1].padStart(4, "0")}`,
  balance: z.bettingPoolCount * 10000,
  caidaAcumulada: 0.0,
  prestamo: 0.0,
}));

const others: OtherEntity[] = [
  { id: "oth-001", name: "Caja General", code: "CJA-0001", balance: 500000.0, caidaAcumulada: 0.0, prestamo: 0.0 },
  { id: "oth-002", name: "Gastos Operativos", code: "GST-0001", balance: -45000.0, caidaAcumulada: 0.0, prestamo: 0.0 },
  { id: "oth-003", name: "Impuestos", code: "IMP-0001", balance: -12500.0, caidaAcumulada: 0.0, prestamo: 0.0 },
];

const tabs = ["Bancas", "Empleados", "Bancos", "Zonas", "Otros"] as const;
type TabType = (typeof tabs)[number];

// ─── Currency Formatter ───────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  const absVal = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(absVal);
  return value < 0 ? `-${formatted}` : formatted;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListaEntidades() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("Bancas");
  const [filter, setFilter] = useState("");

  // ─── Filter Logic ───────────────────────────────────────────────────────────

  const filterByText = <T extends { name: string; code: string }>(items: T[]): T[] => {
    if (!filter.trim()) return items;
    const lower = filter.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower)
    );
  };

  const filteredPools = useMemo(() => filterByText(bettingPools), [filter]);
  const filteredEmployees = useMemo(() => filterByText(employees), [filter]);
  const filteredBanks = useMemo(() => filterByText(banks), [filter]);
  const filteredZones = useMemo(() => filterByText(zoneEntities), [filter]);
  const filteredOthers = useMemo(() => filterByText(others), [filter]);

  // ─── Balance Cell ───────────────────────────────────────────────────────────

  function BalanceCell({ value }: { value: number }) {
    const colorClass =
      value > 0
        ? "text-[#22C55E]"
        : value < 0
          ? "text-[#EF4444]"
          : "text-[#999999]";
    return <span className={`font-mono font-medium ${colorClass}`}>{formatCurrency(value)}</span>;
  }

  // ─── Actions Cell ───────────────────────────────────────────────────────────

  function ActionsCell() {
    return (
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 rounded-lg text-[#999999] hover:text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] transition-colors"
        title="Configuracion"
      >
        <Settings size={16} />
      </button>
    );
  }

  // ─── Columns ────────────────────────────────────────────────────────────────

  const poolColumns: Column<BettingPool>[] = [
    {
      key: "name",
      header: "Nombre",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      key: "code",
      header: "Codigo",
      accessor: (row) => row.mwrCode,
      sortable: true,
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row) => row.balance,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.balance} />,
    },
    {
      key: "caida",
      header: "Caida acumulada",
      accessor: () => 0,
      sortable: true,
      align: "right",
      cell: () => <span className="font-mono text-[#999999]">$0.00</span>,
    },
    {
      key: "prestamo",
      header: "Prestamo",
      accessor: () => 0,
      sortable: true,
      align: "right",
      cell: () => <span className="font-mono text-[#999999]">$0.00</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      cell: () => <ActionsCell />,
    },
  ];

  const genericColumns: Column<
    Employee | Bank | (typeof zoneEntities)[number] | OtherEntity
  >[] = [
    {
      key: "name",
      header: "Nombre",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      key: "code",
      header: "Codigo",
      accessor: (row) => row.code,
      sortable: true,
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row) => row.balance,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.balance} />,
    },
    {
      key: "caida",
      header: "Caida acumulada",
      accessor: (row) => row.caidaAcumulada,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.caidaAcumulada} />,
    },
    {
      key: "prestamo",
      header: "Prestamo",
      accessor: (row) => row.prestamo,
      sortable: true,
      align: "right",
      cell: (row) => <BalanceCell value={row.prestamo} />,
    },
    {
      key: "actions",
      header: "Acciones",
      accessor: () => "",
      align: "center",
      cell: () => <ActionsCell />,
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Entidades Contables</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Gestion de todas las entidades financieras del sistema
          </p>
        </div>
        <button
          onClick={() => navigate("/accountable-entities/new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_12px_rgba(78,205,196,0.4)]"
        >
          <Plus size={16} />
          Crear Entidad
        </button>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="border-b border-[#F0F0EB] px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-[#4ECDC4]"
                    : "text-[#999999] hover:text-[#666666]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="entity-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Quick Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="relative mb-4"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            />
            <input
              type="text"
              placeholder="Filtro rapido..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
            />
          </motion.div>

          {/* Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Bancas" && (
                <DataTable
                  columns={poolColumns}
                  data={filteredPools}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Empleados" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredEmployees}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Bancos" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredBanks}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Zonas" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredZones}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
              {activeTab === "Otros" && (
                <DataTable
                  columns={genericColumns}
                  data={filteredOthers}
                  keyExtractor={(row) => row.id}
                  pageSize={10}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
