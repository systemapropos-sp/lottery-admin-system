import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools } from "@/data/mockData";

interface PercentRow {
  id: string;
  banca: string;
  totalVendido: number;
  directo: number;
  pale: number;
  cash3s: number;
  cash3b: number;
  play4s: number;
  play4b: number;
}

function generatePercentData(): PercentRow[] {
  return bettingPools.map((bp) => {
    const total = Math.random() * 50000 + 1000;
    const directo = total * (Math.random() * 0.4 + 0.1);
    const pale = total * (Math.random() * 0.25 + 0.05);
    const cash3s = total * (Math.random() * 0.15 + 0.02);
    const cash3b = total * (Math.random() * 0.1 + 0.01);
    const play4s = total * (Math.random() * 0.12 + 0.02);
    const play4b = total * (Math.random() * 0.08 + 0.01);
    return { id: bp.id, banca: bp.mwrCode, totalVendido: total, directo, pale, cash3s, cash3b, play4s, play4b };
  });
}

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pct(n: number, total: number) {
  if (total === 0) return "(0%)";
  return `(${(n / total * 100).toFixed(1)}%)`;
}

export default function Porcentajes() {
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [selectedZone, setSelectedZone] = useState("");
  const [data] = useState<PercentRow[]>(generatePercentData);

  const grandTotal = data.reduce((s, r) => s + r.totalVendido, 0);

  const columns = [
    { key: "banca", header: "Banca / Codigo", accessor: (r: PercentRow) => r.banca, sortable: true },
    {
      key: "totalVendido", header: "Total vendido", accessor: (r: PercentRow) => r.totalVendido, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.totalVendido)}</div>
          <div className="text-xs text-[#999999]">{pct(r.totalVendido, grandTotal)}</div>
        </div>
      ),
    },
    {
      key: "directo", header: "Directo", accessor: (r: PercentRow) => r.directo, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.directo)}</div>
          <div className="text-xs text-[#999999]">{pct(r.directo, r.totalVendido)}</div>
        </div>
      ),
    },
    {
      key: "pale", header: "Pale", accessor: (r: PercentRow) => r.pale, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.pale)}</div>
          <div className="text-xs text-[#999999]">{pct(r.pale, r.totalVendido)}</div>
        </div>
      ),
    },
    {
      key: "cash3s", header: "Cash3 S", accessor: (r: PercentRow) => r.cash3s, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.cash3s)}</div>
          <div className="text-xs text-[#999999]">{pct(r.cash3s, r.totalVendido)}</div>
        </div>
      ),
    },
    {
      key: "cash3b", header: "Cash3 B", accessor: (r: PercentRow) => r.cash3b, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.cash3b)}</div>
          <div className="text-xs text-[#999999]">{pct(r.cash3b, r.totalVendido)}</div>
        </div>
      ),
    },
    {
      key: "play4s", header: "Play4 S", accessor: (r: PercentRow) => r.play4s, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.play4s)}</div>
          <div className="text-xs text-[#999999]">{pct(r.play4s, r.totalVendido)}</div>
        </div>
      ),
    },
    {
      key: "play4b", header: "Play4 B", accessor: (r: PercentRow) => r.play4b, sortable: true, align: "right" as const,
      cell: (r: PercentRow) => (
        <div className="text-right">
          <div className="font-mono text-sm">{fmt(r.play4b)}</div>
          <div className="text-xs text-[#999999]">{pct(r.play4b, r.totalVendido)}</div>
        </div>
      ),
    },
  ];

  const totals = data.reduce(
    (acc, r) => ({
      total: acc.total + r.totalVendido,
      directo: acc.directo + r.directo,
      pale: acc.pale + r.pale,
      cash3s: acc.cash3s + r.cash3s,
      cash3b: acc.cash3b + r.cash3b,
      play4s: acc.play4s + r.play4s,
      play4b: acc.play4b + r.play4b,
    }),
    { total: 0, directo: 0, pale: 0, cash3s: 0, cash3b: 0, play4s: 0, play4b: 0 }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Porcentajes" subtitle="Desglose de ventas por tipo de jugada con porcentajes" />

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Desde</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Hasta</label>
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
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.total)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.directo)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.pale)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.cash3s)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.cash3b)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.play4s)}</div></td>
              <td className="px-4 py-3 text-right"><div className="font-mono text-sm">{fmt(totals.play4b)}</div></td>
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
