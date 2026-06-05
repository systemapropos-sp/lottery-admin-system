import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, Download } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools } from "@/data/mockData";

const tabs = ["General", "Por sorteo", "Combinaciones", "Por zona"];

interface HistoryRow {
  id: string;
  ref: string;
  codigo: string;
  tickets: number;
  venta: number;
  comisiones: number;
  premios: number;
  neto: number;
  final: number;
  comision2?: number;
}

function generateHistoryData(): HistoryRow[] {
  return bettingPools.map((bp, i) => {
    const venta = Math.random() * 80000 + 2000;
    const comisiones = venta * 0.15;
    const premios = Math.random() * 50000;
    const neto = venta - comisiones - premios;
    return {
      id: bp.id,
      ref: `${i + 1}`,
      codigo: bp.mwrCode,
      tickets: Math.floor(Math.random() * 200) + 10,
      venta,
      comisiones,
      premios,
      neto,
      final: neto + bp.balance,
      comision2: venta * 0.05,
    };
  });
}

export default function VentasHistorico() {
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [selectedZone, setSelectedZone] = useState("");
  const [showComision2, setShowComision2] = useState(false);
  const [data] = useState<HistoryRow[]>(generateHistoryData);

  const baseColumns = [
    { key: "ref", header: "Ref.", accessor: (r: HistoryRow) => r.ref, sortable: true },
    { key: "codigo", header: "Codigo", accessor: (r: HistoryRow) => r.codigo, sortable: true },
    { key: "tickets", header: "Tickets", accessor: (r: HistoryRow) => r.tickets, sortable: true, align: "center" as const },
    {
      key: "venta", header: "Venta", accessor: (r: HistoryRow) => r.venta, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: HistoryRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comisiones", header: "Comisiones", accessor: (r: HistoryRow) => r.comisiones, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: HistoryRow) => `$${r.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premios", header: "Premios", accessor: (r: HistoryRow) => r.premios, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: HistoryRow) => `$${r.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "neto", header: "Neto", accessor: (r: HistoryRow) => r.neto, sortable: true, align: "right" as const,
      cell: (r: HistoryRow) => (
        <span className={r.neto >= 0 ? "text-green-600" : "text-red-500"}>
          ${r.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "final", header: "Final", accessor: (r: HistoryRow) => r.final, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: HistoryRow) => `$${r.final.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const comision2Column = {
    key: "comision2", header: "Comision #2", accessor: (r: HistoryRow) => r.comision2 ?? 0, sortable: true, align: "right" as const,
    formatter: (_v: unknown, r: HistoryRow) => `$${(r.comision2 ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  };

  const columns = showComision2 ? [...baseColumns.slice(0, 4), comision2Column, ...baseColumns.slice(4)] : baseColumns;

  const totals = data.reduce(
    (acc, row) => ({
      tickets: acc.tickets + row.tickets,
      venta: acc.venta + row.venta,
      comisiones: acc.comisiones + row.comisiones,
      premios: acc.premios + row.premios,
      neto: acc.neto + row.neto,
      final: acc.final + row.final,
    }),
    { tickets: 0, venta: 0, comisiones: 0, premios: 0, neto: 0, final: 0 }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Ventas — Historico" subtitle="Historial de ventas por periodo" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} /> Desde
            </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} /> Hasta
            </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zonas</label>
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              <option value="Default">Default</option>
              <option value="SFM">SFM</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer select-none">
            <input type="checkbox" checked={showComision2} onChange={(e) => setShowComision2(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]" />
            Mostrar comision #2
          </label>
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
              Ver ventas
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="PDF">
              <FileText size={16} />
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="CSV">
              <Download size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="border-b border-[#E5E5E0] mb-4">
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === i ? "text-[#4ECDC4] border-[#4ECDC4]" : "text-[#999999] border-transparent hover:text-[#666666]"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(r) => r.id}
          pageSize={10}
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td colSpan={2} className="px-4 py-3 text-right text-sm">TOTALES</td>
              <td className="px-4 py-3 text-center text-sm font-mono">{totals.tickets}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              {showComision2 && <td className="px-4 py-3" />}
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                <span className={totals.neto >= 0 ? "text-green-600" : "text-red-500"}>
                  ${totals.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.final.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
