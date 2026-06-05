import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RotateCw, FileText, Printer } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries, bettingPools } from "@/data/mockData";

interface PlayRow {
  id: string;
  sorteo: string;
  tipoJugada: string;
  numero: string;
  monto: number;
  banca: string;
  zona: string;
}

function generatePlays(): PlayRow[] {
  const playTypes = ["Quiniela", "Pale", "Tripleta", "Super Pale"];
  const rows: PlayRow[] = [];
  for (let i = 0; i < 50; i++) {
    const lot = lotteries[i % lotteries.length];
    const bp = bettingPools[i % bettingPools.length];
    rows.push({
      id: `play-${i}`,
      sorteo: lot.name,
      tipoJugada: playTypes[i % playTypes.length],
      numero: `${String(Math.floor(Math.random() * 99)).padStart(2, "0")}`,
      monto: Math.random() * 500 + 10,
      banca: bp.mwrCode,
      zona: bp.zoneName,
    });
  }
  return rows;
}

export default function Jugadas() {
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedSorteos, setSelectedSorteos] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [data, setData] = useState<PlayRow[]>(generatePlays);

  const columns = [
    { key: "sorteo", header: "Sorteo", accessor: (r: PlayRow) => r.sorteo, sortable: true },
    { key: "tipoJugada", header: "Tipo de jugada", accessor: (r: PlayRow) => r.tipoJugada, sortable: true },
    { key: "numero", header: "Numero", accessor: (r: PlayRow) => r.numero, sortable: true, align: "center" as const, cell: (r: PlayRow) => <span className="font-mono">{r.numero}</span> },
    {
      key: "monto", header: "Monto", accessor: (r: PlayRow) => r.monto, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PlayRow) => `$${r.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    { key: "banca", header: "Banca", accessor: (r: PlayRow) => r.banca, sortable: true },
    { key: "zona", header: "Zona", accessor: (r: PlayRow) => r.zona, sortable: true },
  ];

  const totalMonto = data.reduce((s, r) => s + r.monto, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Jugadas" subtitle="Monto de jugadas por sorteo" />

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Fecha</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Sorteos</label>
            <select multiple value={selectedSorteos} onChange={(e) => setSelectedSorteos(Array.from(e.target.selectedOptions).map((o) => o.value))}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" size={1}>
              <option value="">Todos los sorteos</option>
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
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select value={selectedBanca} onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              {bettingPools.map((bp) => <option key={bp.id} value={bp.mwrCode}>{bp.mwrCode}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button onClick={() => setData(generatePlays())}
              className="px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors flex items-center gap-2">
              <RotateCw size={16} /> Refrescar
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="PDF">
              <FileText size={16} />
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="Imprimir">
              <Printer size={16} />
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
              <td colSpan={3} className="px-4 py-3 text-right text-sm">TOTAL</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totalMonto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td colSpan={2} />
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
