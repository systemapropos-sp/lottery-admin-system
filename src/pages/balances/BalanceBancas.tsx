import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, RotateCw, Printer, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { bettingPools, zones } from "@/data/mockData";
import type { BettingPool } from "@/data/mockData";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

type BalanceFilter = "Todos" | "Positivos" | "Negativos";

export default function BalanceBancas() {
  const [fecha, setFecha] = useState("2024-05-15");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>("Todos");
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const filteredData = useMemo(() => {
    let data = bettingPools;
    if (selectedZones.length > 0) {
      data = data.filter((bp) => selectedZones.includes(bp.zoneId));
    }
    if (balanceFilter === "Positivos") {
      data = data.filter((bp) => bp.balance > 0);
    } else if (balanceFilter === "Negativos") {
      data = data.filter((bp) => bp.balance < 0);
    }
    return data;
  }, [selectedZones, balanceFilter]);

  const totalBalance = filteredData.reduce((sum, bp) => sum + bp.balance, 0);
  const totalPrestamos = 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

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
      key: "nombre",
      header: "Nombre",
      accessor: (row: BettingPool) => row.name,
      sortable: true,
    },
    {
      key: "usuarios",
      header: "Usuarios",
      accessor: (row: BettingPool) => row.code,
      sortable: true,
      cell: (row: BettingPool) => (
        <span className="font-mono text-[13px]">{row.code}</span>
      ),
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
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.zoneName === "SFM" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
        }`}>
          {row.zoneName}
        </span>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (row: BettingPool) => row.balance,
      sortable: true,
      align: "right" as const,
      cell: (row: BettingPool) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`font-mono text-[13px] ${
            row.balance > 0
              ? "text-green-600"
              : row.balance < 0
              ? "text-red-600"
              : "text-[#999999]"
          }`}
        >
          {formatCurrency(row.balance)}
        </motion.span>
      ),
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="space-y-5"
    >
      <PageHeader
        title="Balances - Bancas"
        subtitle="Vista de balances financieros por banca"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#333333]">Fecha:</label>
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#333333]">Balances:</span>
            <div className="flex rounded-lg border border-[#E5E5E0] overflow-hidden">
              {(["Todos", "Positivos", "Negativos"] as BalanceFilter[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBalanceFilter(opt)}
                  className={`px-3 py-2 text-sm transition-colors ${
                    balanceFilter === opt
                      ? "bg-[#4ECDC4] text-white"
                      : "bg-white text-[#666666] hover:bg-[#F5F5F0]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E0] text-[#333333] rounded-full text-sm hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
            <RotateCw size={14} />
            <span>Refrescar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E0] text-[#333333] rounded-full text-sm hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
            <Printer size={14} />
            <span>Imprimir</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white rounded-full text-sm hover:bg-[#DC2626] transition-colors">
            <FileText size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(row) => row.id}
          pageSize={10}
          emptyMessage="No se encontraron bancas"
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td colSpan={5} className="px-4 py-3 text-right text-sm">
                TOTAL:
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px]">
                <span className={totalBalance > 0 ? "text-green-600" : totalBalance < 0 ? "text-red-600" : ""}>
                  {formatCurrency(totalBalance)}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] text-[#999999]">
                {formatCurrency(totalPrestamos)}
              </td>
            </tr>
          }
        />
      </div>
    </motion.div>
  );
}
