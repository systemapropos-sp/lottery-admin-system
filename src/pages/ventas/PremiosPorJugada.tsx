import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RotateCw, Download, SearchX } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { playTypes } from "@/data/mockData";

interface PrizeRow {
  id: string;
  tipoJugada: string;
  cantidad: number;
  premio: number;
  promedio: number;
}

function generatePrizeData(): PrizeRow[] {
  return playTypes.map((pt) => ({
    id: pt.id,
    tipoJugada: pt.name,
    cantidad: Math.floor(Math.random() * 100) + 5,
    premio: Math.random() * 30000 + 1000,
    promedio: Math.random() * 500 + 50,
  }));
}

export default function PremiosPorJugada() {
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [selectedZone, setSelectedZone] = useState("");
  const [hasData, setHasData] = useState(false);

  const columns = [
    { key: "tipoJugada", header: "Tipo de jugada", accessor: (r: PrizeRow) => r.tipoJugada, sortable: true },
    {
      key: "cantidad", header: "Cantidad", accessor: (r: PrizeRow) => r.cantidad, sortable: true, align: "center" as const,
    },
    {
      key: "premio", header: "Premio", accessor: (r: PrizeRow) => r.premio, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PrizeRow) => `$${r.premio.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "promedio", header: "Promedio", accessor: (r: PrizeRow) => r.promedio, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PrizeRow) => `$${r.promedio.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const handleRefresh = () => setHasData(true);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Premios por Jugada" subtitle="Premios desglosados por tipo de jugada" />

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
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button onClick={handleRefresh}
              className="px-4 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              <RotateCw size={16} /> Refrescar
            </button>
            <button className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors" title="CSV">
              <Download size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center gap-3"
        >
          <SearchX size={48} className="text-[#CCCCCC]" />
          <p className="text-[#666666] text-sm">No hay datos disponibles. Presione "Refrescar" para cargar.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <DataTable columns={columns} data={generatePrizeData()} keyExtractor={(r) => r.id} pageSize={10} />
        </motion.div>
      )}
    </motion.div>
  );
}
