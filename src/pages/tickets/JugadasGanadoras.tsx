import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, Filter } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries } from "@/data/mockData";

interface WinnerRow {
  id: string;
  tipoJugada: string;
  jugada: string;
  venta: number;
  premio: number;
  total: number;
}

function generateWinners(): WinnerRow[] {
  const playTypes = ["Quiniela", "Pale", "Tripleta", "Super Pale"];
  const rows: WinnerRow[] = [];
  for (let i = 0; i < 25; i++) {
    const venta = Math.random() * 2000 + 50;
    const premio = venta * (Math.random() * 50 + 20);
    rows.push({
      id: `win-${i}`,
      tipoJugada: playTypes[i % playTypes.length],
      jugada: `${String(Math.floor(Math.random() * 99)).padStart(2, "0")}-${String(Math.floor(Math.random() * 99)).padStart(2, "0")}`,
      venta,
      premio,
      total: premio,
    });
  }
  return rows;
}

export default function JugadasGanadoras() {
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [selectedSorteo, setSelectedSorteo] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [data] = useState<WinnerRow[]>(generateWinners);

  const columns = [
    { key: "tipoJugada", header: "Tipo de jugada", accessor: (r: WinnerRow) => r.tipoJugada, sortable: true },
    { key: "jugada", header: "Jugada", accessor: (r: WinnerRow) => r.jugada, sortable: true, align: "center" as const, cell: (r: WinnerRow) => <span className="font-mono font-semibold text-[#333333]">{r.jugada}</span> },
    {
      key: "venta", header: "Venta", accessor: (r: WinnerRow) => r.venta, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: WinnerRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premio", header: "Premio", accessor: (r: WinnerRow) => r.premio, sortable: true, align: "right" as const,
      cell: (r: WinnerRow) => <span className="text-green-600 font-mono font-semibold">${r.premio.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>,
    },
    {
      key: "total", header: "Total", accessor: (r: WinnerRow) => r.total, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: WinnerRow) => `$${r.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const totals = data.reduce((acc, r) => ({ venta: acc.venta + r.venta, premio: acc.premio + r.premio, total: acc.total + r.total }), { venta: 0, premio: 0, total: 0 });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Jugadas Ganadoras" subtitle="Listado de jugadas ganadoras" />

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
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Sorteo</label>
            <select value={selectedSorteo} onChange={(e) => setSelectedSorteo(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todos</option>
              {lotteries.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Zonas</label>
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              <option value="Default">Default</option>
              <option value="SFM">SFM</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button className="px-4 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <Filter size={16} /> Filtrar
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="PDF">
              <FileText size={16} />
            </button>
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
              <td colSpan={2} className="px-4 py-3 text-right text-sm">TOTALES</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-green-600">${totals.premio.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
