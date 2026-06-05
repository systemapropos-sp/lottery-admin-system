import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Ticket, TrendingUp } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools } from "@/data/mockData";

const tabs = [
  "General",
  "Banca por sorteo",
  "Por sorteo",
  "Combinaciones",
  "Por zona",
  "Categoria de Premios",
  "Categoria de Premios para Pale",
];

const quickFilters = [
  "Todos",
  "Con ventas",
  "Con premios",
  "Con tickets pendientes",
  "Con ventas netas negativas",
  "Con ventas netas positivas",
];

interface SalesRow {
  id: string;
  ref: string;
  codigo: string;
  p: number;
  l: number;
  w: number;
  total: number;
  venta: number;
  comisiones: number;
  premios: number;
  neto: number;
  final: number;
  balance: number;
}

function generateSalesData(): SalesRow[] {
  return bettingPools.map((bp, i) => {
    const venta = bp.hasSalesToday ? Math.random() * 50000 + 5000 : 0;
    const comisiones = venta * 0.15;
    const premios = bp.hasSalesToday ? Math.random() * 30000 : 0;
    const neto = venta - comisiones - premios;
    return {
      id: bp.id,
      ref: `${i + 1}`,
      codigo: bp.mwrCode,
      p: bp.hasSalesToday ? Math.floor(Math.random() * 10) : 0,
      l: bp.hasSalesToday ? Math.floor(Math.random() * 15) : 0,
      w: bp.hasSalesToday ? Math.floor(Math.random() * 8) : 0,
      total: venta,
      venta,
      comisiones,
      premios,
      neto,
      final: neto + bp.balance,
      balance: bp.balance,
    };
  });
}

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function VentasDelDia() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [data, setData] = useState<SalesRow[]>(generateSalesData);

  const zones = ["Default", "SFM"];

  const filteredData = data.filter((row) => {
    if (activeFilter === "Con ventas") return row.venta > 0;
    if (activeFilter === "Con premios") return row.premios > 0;
    if (activeFilter === "Con tickets pendientes") return row.p > 0;
    if (activeFilter === "Con ventas netas negativas") return row.neto < 0;
    if (activeFilter === "Con ventas netas positivas") return row.neto > 0;
    return true;
  });

  const totals = filteredData.reduce(
    (acc, row) => ({
      total: acc.total + row.total,
      venta: acc.venta + row.venta,
      comisiones: acc.comisiones + row.comisiones,
      premios: acc.premios + row.premios,
      neto: acc.neto + row.neto,
      final: acc.final + row.final,
    }),
    { total: 0, venta: 0, comisiones: 0, premios: 0, neto: 0, final: 0 }
  );

  const columns = [
    { key: "ref", header: "Ref.", accessor: (r: SalesRow) => r.ref, sortable: true },
    { key: "codigo", header: "Codigo", accessor: (r: SalesRow) => r.codigo, sortable: true },
    { key: "p", header: "P", accessor: (r: SalesRow) => r.p, sortable: true, align: "center" as const },
    { key: "l", header: "L", accessor: (r: SalesRow) => r.l, sortable: true, align: "center" as const },
    { key: "w", header: "W", accessor: (r: SalesRow) => r.w, sortable: true, align: "center" as const },
    {
      key: "total",
      header: "Total",
      accessor: (r: SalesRow) => r.total,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "venta",
      header: "Venta",
      accessor: (r: SalesRow) => r.venta,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comisiones",
      header: "Comisiones",
      accessor: (r: SalesRow) => r.comisiones,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premios",
      header: "Premios",
      accessor: (r: SalesRow) => r.premios,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "neto",
      header: "Neto",
      accessor: (r: SalesRow) => r.neto,
      sortable: true,
      align: "right" as const,
      cell: (r: SalesRow) => (
        <span className={r.neto >= 0 ? "text-green-600" : "text-red-500"}>
          ${r.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "final",
      header: "Final",
      accessor: (r: SalesRow) => r.final,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.final.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "balance",
      header: "Balance",
      accessor: (r: SalesRow) => r.balance,
      sortable: true,
      align: "right" as const,
      formatter: (_v: unknown, r: SalesRow) => `$${r.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const handleView = () => setData(generateSalesData());

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Ventas del dia" subtitle={`Resumen de ventas para ${selectedDate}`} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zonas</label>
            <select
              multiple
              value={selectedZones}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
                setSelectedZones(opts);
              }}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
              size={1}
            >
              <option value="">Todas las zonas</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleView}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <TrendingUp size={16} />
              Ver ventas
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="PDF">
              <FileText size={16} />
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="CSV">
              <Download size={16} />
            </button>
            <button className="px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors flex items-center gap-2">
              <Ticket size={16} />
              Procesar tickets
            </button>
            <button className="px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
              Procesar ventas
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === filter
                ? "bg-[#4ECDC4] text-white shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                : "bg-white text-[#666666] border border-[#E5E5E0] hover:border-[#4ECDC4] hover:text-[#333333]"
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="border-b border-[#E5E5E0] mb-4"
      >
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === i
                  ? "text-[#4ECDC4] border-[#4ECDC4]"
                  : "text-[#999999] border-transparent hover:text-[#666666]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(r) => r.id}
          pageSize={10}
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td colSpan={5} className="px-4 py-3 text-right text-sm">
                TOTALES
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                ${totals.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                ${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                ${totals.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                ${totals.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                <span className={totals.neto >= 0 ? "text-green-600" : "text-red-500"}>
                  ${totals.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                ${totals.final.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3" />
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
