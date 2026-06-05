import { useState } from "react";
import { motion } from "framer-motion";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { zones, bettingPools } from "@/data/mockData";

interface ZoneSalesRow {
  id: string;
  zona: string;
  bancas: number;
  tickets: number;
  venta: number;
  comision1: number;
  comision2: number;
  premios: number;
  neto: number;
  final: number;
}

function generateZoneSales(): ZoneSalesRow[] {
  return zones.map((z) => {
    const poolsInZone = bettingPools.filter((bp) => bp.zoneId === z.id);
    const bancas = poolsInZone.length;
    const venta = Math.random() * 150000 + 10000;
    const comision1 = venta * 0.12;
    const comision2 = venta * 0.05;
    const premios = Math.random() * 80000;
    return {
      id: z.id,
      zona: z.name,
      bancas,
      tickets: Math.floor(Math.random() * 500) + bancas * 20,
      venta,
      comision1,
      comision2,
      premios,
      neto: venta - comision1 - comision2 - premios,
      final: venta - comision1 - comision2 - premios + poolsInZone.reduce((s, bp) => s + bp.balance, 0),
    };
  });
}

export default function VentasZonas() {
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedZone, setSelectedZone] = useState("");
  const [data] = useState<ZoneSalesRow[]>(generateZoneSales);

  const filtered = selectedZone ? data.filter((r) => r.zona === selectedZone) : data;

  const columns = [
    { key: "zona", header: "Zona", accessor: (r: ZoneSalesRow) => r.zona, sortable: true },
    { key: "bancas", header: "Bancas", accessor: (r: ZoneSalesRow) => r.bancas, sortable: true, align: "center" as const },
    { key: "tickets", header: "Tickets", accessor: (r: ZoneSalesRow) => r.tickets, sortable: true, align: "center" as const },
    {
      key: "venta", header: "Venta", accessor: (r: ZoneSalesRow) => r.venta, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: ZoneSalesRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comision1", header: "Comision 1", accessor: (r: ZoneSalesRow) => r.comision1, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: ZoneSalesRow) => `$${r.comision1.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comision2", header: "Comision 2", accessor: (r: ZoneSalesRow) => r.comision2, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: ZoneSalesRow) => `$${r.comision2.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premios", header: "Premios", accessor: (r: ZoneSalesRow) => r.premios, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: ZoneSalesRow) => `$${r.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "neto", header: "Neto", accessor: (r: ZoneSalesRow) => r.neto, sortable: true, align: "right" as const,
      cell: (r: ZoneSalesRow) => (
        <span className={r.neto >= 0 ? "text-green-600" : "text-red-500"}>
          ${r.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "final", header: "Final", accessor: (r: ZoneSalesRow) => r.final, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: ZoneSalesRow) => `$${r.final.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const totals = filtered.reduce(
    (acc, r) => ({
      bancas: acc.bancas + r.bancas,
      tickets: acc.tickets + r.tickets,
      venta: acc.venta + r.venta,
      comision1: acc.comision1 + r.comision1,
      comision2: acc.comision2 + r.comision2,
      premios: acc.premios + r.premios,
      neto: acc.neto + r.neto,
      final: acc.final + r.final,
    }),
    { bancas: 0, tickets: 0, venta: 0, comision1: 0, comision2: 0, premios: 0, neto: 0, final: 0 }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Ventas por Zonas" subtitle="Resumen de ventas agrupado por zona" />

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Fecha</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zona</label>
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              {zones.map((z) => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          pageSize={10}
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td className="px-4 py-3 text-right text-sm">TOTALES</td>
              <td className="px-4 py-3 text-center text-sm font-mono">{totals.bancas}</td>
              <td className="px-4 py-3 text-center text-sm font-mono">{totals.tickets}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.comision1.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.comision2.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
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
