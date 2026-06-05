import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, RotateCw, FileText, Printer } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { lotteries, bettingPools } from "@/data/mockData";

interface BlackboardRow {
  id: string;
  sorteo: string;
  color: string;
  jugada: string;
  monto: number;
  tipo: string;
  banca: string;
  hora: string;
}

function generateBlackboardData(): BlackboardRow[] {
  const playTypes = ["Quiniela", "Pale", "Tripleta"];
  const rows: BlackboardRow[] = [];
  for (let i = 0; i < 60; i++) {
    const lot = lotteries[i % lotteries.length];
    const bp = bettingPools[i % bettingPools.length];
    rows.push({
      id: `bb-${i}`,
      sorteo: lot.name,
      color: lot.color,
      jugada: `${String(Math.floor(Math.random() * 99)).padStart(2, "0")}`,
      monto: Math.random() * 1000 + 25,
      tipo: playTypes[i % playTypes.length],
      banca: bp.mwrCode,
      hora: `${String(8 + Math.floor(Math.random() * 14)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    });
  }
  return rows;
}

export default function Pizarra() {
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedSorteos, setSelectedSorteos] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [data, setData] = useState<BlackboardRow[]>(generateBlackboardData);

  const refresh = useCallback(() => {
    setData(generateBlackboardData());
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  const columns = [
    {
      key: "sorteo", header: "Sorteo", accessor: (r: BlackboardRow) => r.sorteo, sortable: true,
      cell: (r: BlackboardRow) => (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
          <span className="text-sm">{r.sorteo}</span>
        </div>
      ),
    },
    { key: "hora", header: "Hora", accessor: (r: BlackboardRow) => r.hora, sortable: true, align: "center" as const },
    {
      key: "jugada", header: "Jugada", accessor: (r: BlackboardRow) => r.jugada, sortable: true, align: "center" as const,
      cell: (r: BlackboardRow) => <span className="font-mono font-semibold text-lg text-[#333333]">{r.jugada}</span>,
    },
    { key: "tipo", header: "Tipo", accessor: (r: BlackboardRow) => r.tipo, sortable: true },
    {
      key: "monto", header: "Monto", accessor: (r: BlackboardRow) => r.monto, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: BlackboardRow) => `$${r.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    { key: "banca", header: "Banca", accessor: (r: BlackboardRow) => r.banca, sortable: true },
  ];

  const totalMonto = data.reduce((s, r) => s + r.monto, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Pizarra" subtitle="Vista en tiempo real de las jugadas" />

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
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select value={selectedBanca} onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              {bettingPools.map((bp) => <option key={bp.id} value={bp.mwrCode}>{bp.mwrCode}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer select-none mr-2">
              <div className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${autoRefresh ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"}`}
                onClick={() => setAutoRefresh(!autoRefresh)}>
                <div className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200 ${autoRefresh ? "translate-x-[18px]" : "translate-x-0"}`} />
              </div>
              Auto refrescar
            </label>
            <button onClick={refresh}
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
        {autoRefresh && (
          <p className="text-xs text-[#999999] mt-2">Ultima actualizacion: {lastRefresh.toLocaleTimeString("es-DO")}</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(r) => r.id}
          pageSize={25}
          summaryRow={
            <tr className="bg-[#F0F0EB] font-semibold text-[#333333]">
              <td colSpan={4} className="px-4 py-3 text-right text-sm">TOTAL</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totalMonto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td />
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
