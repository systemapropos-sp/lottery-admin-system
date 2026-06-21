import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

// Datos reales de transacciones vendrán de Supabase
const transactions: { id:string; bancaId:string; bancaName:string; amount:number; date:string; type:string; status:string; category:string; createdBy:string; notes:string; }[] = [];

export default function TransaccionesBancas() {
  const { bancas: bancasRaw } = useBancasZonas();
  const [selectedBanca, setSelectedBanca] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let data = transactions;
    if (selectedBanca) data = data.filter((t) => t.bancaId === selectedBanca);
    if (startDate) data = data.filter((t) => t.date >= startDate);
    if (endDate) data = data.filter((t) => t.date <= endDate);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((t) =>
        t.bancaName.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    return data;
  }, [selectedBanca, startDate, endDate, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <PageHeader title="Transacciones por Bancas" subtitle="Vista de transacciones agrupadas por banca" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select
              value={selectedBanca}
              onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]"
            >
              <option value="">Todas las bancas</option>
              {bancasRaw.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Desde</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hasta</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Buscar</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, categoría..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4]" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F8F5] text-[#666666] text-xs font-semibold uppercase tracking-wide">
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Banca</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Categoría</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Tipo</th>
                <th className="px-4 py-3 text-right border-b border-[#E8E8E3]">Monto</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Fecha</th>
                <th className="px-4 py-3 text-left border-b border-[#E8E8E3]">Notas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#999999] text-sm">
                    No hay transacciones disponibles
                  </td>
                </tr>
              ) : (
                filtered.map((t, idx) => (
                  <tr key={t.id} className={`border-b border-[#E8E8E3] hover:bg-[#F0F8F7] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"}`}>
                    <td className="px-4 py-3 font-medium text-[#333333]">{t.bancaName}</td>
                    <td className="px-4 py-3 text-[#666666]">{t.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === "COBRO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${t.type === "COBRO" ? "text-green-600" : "text-red-600"}`}>
                      ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-[#666666] text-xs">{t.date}</td>
                    <td className="px-4 py-3 text-[#666666]">{t.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E8E8E3] bg-[#F8F8F5] text-xs text-[#999999]">
          {filtered.length} transacciones
        </div>
      </div>
    </motion.div>
  );
}
