import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCw, Check, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { limits, lotteries } from "@/data/mockData";

interface LimiteRow {
  id: string;
  numero: number;
  tipo: string;
  sorteos: string;
  dias: string;
  montos: string;
  estado: boolean;
}

const TIPOS_LIMITE = ["Todos", "Por numero", "Por linea", "Por banca"];
const DIAS_SEMANA = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const LOTTERY_NAMES = lotteries.map((l) => l.name);

export default function ListaLimites() {
  const [tipoLimite, setTipoLimite] = useState("");
  const [sorteoFilter, setSorteoFilter] = useState("");
  const [diaFilter, setDiaFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const allData: LimiteRow[] = useMemo(() => {
    const tipoMap = ["Por numero", "Por linea", "Por banca", "Por numero"];
    const diasMap = ["Lun-Vie", "Todos", "Lun-Vie", "Sab-Dom", "Todos", "Lun-Vie"];
    return limits.map((l, idx) => ({
      id: l.id,
      numero: idx + 1,
      tipo: tipoMap[idx % tipoMap.length],
      sorteos: l.lotteryName,
      dias: diasMap[idx % diasMap.length],
      montos: `$${l.maxAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      estado: l.isActive,
    }));
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter((r) => {
      if (tipoLimite && r.tipo !== tipoLimite) return false;
      if (sorteoFilter && !r.sorteos.includes(sorteoFilter)) return false;
      if (diaFilter && !r.dias.toLowerCase().includes(diaFilter.toLowerCase())) return false;
      return true;
    });
  }, [allData, tipoLimite, sorteoFilter, diaFilter]);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  const columns: Column<LimiteRow>[] = [
    { key: "numero", header: "#", accessor: (r) => r.numero, sortable: true, align: "center", width: "50px" },
    {
      key: "tipo",
      header: "Tipo",
      accessor: (r) => r.tipo,
      sortable: true,
      cell: (r) => {
        const colorMap: Record<string, string> = {
          "Por numero": "bg-[#DBEAFE] text-[#1E40AF]",
          "Por linea": "bg-[#D1FAE5] text-[#065F46]",
          "Por banca": "bg-[#FEF3C7] text-[#92400E]",
        };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[r.tipo] || "bg-[#E5E7EB] text-[#374151]"}`}>{r.tipo}</span>;
      },
    },
    { key: "sorteos", header: "Sorteos", accessor: (r) => r.sorteos, sortable: true },
    { key: "dias", header: "Dias", accessor: (r) => r.dias, sortable: true },
    { key: "montos", header: "Montos", accessor: (r) => r.montos, sortable: true, align: "right" },
    {
      key: "estado",
      header: "Estado",
      accessor: (r) => (r.estado ? "Activo" : "Inactivo"),
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          {r.estado ? (
            <>
              <div className="w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                <Check size={12} className="text-[#22C55E]" />
              </div>
              <span className="text-xs text-[#065F46] font-medium">Activo</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <X size={12} className="text-[#EF4444]" />
              </div>
              <span className="text-xs text-[#991B1B] font-medium">Inactivo</span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Limites" subtitle="Gestion de limites de apuestas configurados" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo de Limite</label>
            <select
              value={tipoLimite}
              onChange={(e) => setTipoLimite(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todos</option>
              {TIPOS_LIMITE.filter((t) => t !== "Todos").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Sorteos</label>
            <select
              value={sorteoFilter}
              onChange={(e) => setSorteoFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todos</option>
              {LOTTERY_NAMES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Dias</label>
            <select
              value={diaFilter}
              onChange={(e) => setDiaFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todos</option>
              {DIAS_SEMANA.map((d) => (
                <option key={d} value={d.slice(0, 3)}>{d}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors disabled:opacity-50"
          >
            <RotateCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refrescar
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <DataTable columns={columns} data={filteredData} keyExtractor={(r) => r.id} pageSize={10} />
      </motion.div>
    </div>
  );
}
