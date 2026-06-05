import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";

interface DateSalesRow {
  id: string;
  fecha: string;
  venta: number;
  premios: number;
  comisiones: number;
  neto: number;
}

function generateDateSales(): DateSalesRow[] {
  const rows: DateSalesRow[] = [];
  const baseDate = new Date(2024, 4, 1);
  for (let i = 0; i < 15; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const venta = Math.random() * 100000 + 10000;
    const comisiones = venta * 0.15;
    const premios = Math.random() * 60000;
    rows.push({
      id: `ds-${i}`,
      fecha: d.toISOString().split("T")[0],
      venta,
      premios,
      comisiones,
      neto: venta - comisiones - premios,
    });
  }
  return rows;
}

export default function VentasPorFecha() {
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [extraOption, setExtraOption] = useState(false);
  const [data] = useState<DateSalesRow[]>(generateDateSales);

  const columns = [
    {
      key: "fecha", header: "Fecha", accessor: (r: DateSalesRow) => r.fecha, sortable: true,
      formatter: (_v: unknown, r: DateSalesRow) => {
        const d = new Date(r.fecha + "T00:00:00");
        return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
      },
    },
    {
      key: "venta", header: "Venta", accessor: (r: DateSalesRow) => r.venta, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: DateSalesRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premios", header: "Premios", accessor: (r: DateSalesRow) => r.premios, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: DateSalesRow) => `$${r.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comisiones", header: "Comisiones", accessor: (r: DateSalesRow) => r.comisiones, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: DateSalesRow) => `$${r.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "neto", header: "Neto", accessor: (r: DateSalesRow) => r.neto, sortable: true, align: "right" as const,
      cell: (r: DateSalesRow) => (
        <span className={r.neto >= 0 ? "text-green-600" : "text-red-500"}>
          ${r.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const totals = data.reduce(
    (acc, row) => ({
      venta: acc.venta + row.venta,
      premios: acc.premios + row.premios,
      comisiones: acc.comisiones + row.comisiones,
      neto: acc.neto + row.neto,
    }),
    { venta: 0, premios: 0, comisiones: 0, neto: 0 }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Ventas por Fecha" subtitle="Ventas agregadas por fecha" />

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
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Bancas</label>
            <select value={selectedBanca} onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas las bancas</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={`MWR-${String(i + 1).padStart(4, "0")}`}>{`MWR-${String(i + 1).padStart(4, "0")}`}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zonas</label>
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas las zonas</option>
              <option value="Default">Default</option>
              <option value="SFM">SFM</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer select-none">
            <input type="checkbox" checked={extraOption} onChange={(e) => setExtraOption(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]" />
            Mostrar detalles
          </label>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(r) => r.id}
          pageSize={10}
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td className="px-4 py-3 text-right text-sm">TOTALES</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                <span className={totals.neto >= 0 ? "text-green-600" : "text-red-500"}>
                  ${totals.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </td>
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
