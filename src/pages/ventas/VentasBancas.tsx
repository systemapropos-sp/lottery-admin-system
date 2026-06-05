import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { bettingPools } from "@/data/mockData";

interface PoolSalesRow {
  id: string;
  codigo: string;
  nombre: string;
  zona: string;
  tickets: number;
  venta: number;
  comisiones: number;
  premios: number;
  neto: number;
  balance: number;
}

function generatePoolSales(): PoolSalesRow[] {
  return bettingPools.map((bp) => {
    const venta = bp.hasSalesToday ? Math.random() * 60000 + 5000 : Math.random() * 5000;
    const comisiones = venta * 0.15;
    const premios = venta * 0.4;
    return {
      id: bp.id,
      codigo: bp.mwrCode,
      nombre: bp.name,
      zona: bp.zoneName,
      tickets: Math.floor(Math.random() * 300) + (bp.hasSalesToday ? 50 : 0),
      venta,
      comisiones,
      premios,
      neto: venta - comisiones - premios,
      balance: bp.balance,
    };
  });
}

export default function VentasBancas() {
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [search, setSearch] = useState("");
  const [data] = useState<PoolSalesRow[]>(generatePoolSales);

  const filtered = data.filter((r) => {
    const matchSearch = !search || r.nombre.toLowerCase().includes(search.toLowerCase()) || r.codigo.toLowerCase().includes(search.toLowerCase());
    const matchBanca = !selectedBanca || r.codigo === selectedBanca;
    return matchSearch && matchBanca;
  });

  const columns = [
    { key: "codigo", header: "Codigo", accessor: (r: PoolSalesRow) => r.codigo, sortable: true },
    { key: "nombre", header: "Nombre", accessor: (r: PoolSalesRow) => r.nombre, sortable: true },
    { key: "zona", header: "Zona", accessor: (r: PoolSalesRow) => r.zona, sortable: true },
    { key: "tickets", header: "Tickets", accessor: (r: PoolSalesRow) => r.tickets, sortable: true, align: "center" as const },
    {
      key: "venta", header: "Venta", accessor: (r: PoolSalesRow) => r.venta, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PoolSalesRow) => `$${r.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "comisiones", header: "Comisiones", accessor: (r: PoolSalesRow) => r.comisiones, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PoolSalesRow) => `$${r.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premios", header: "Premios", accessor: (r: PoolSalesRow) => r.premios, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PoolSalesRow) => `$${r.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "neto", header: "Neto", accessor: (r: PoolSalesRow) => r.neto, sortable: true, align: "right" as const,
      cell: (r: PoolSalesRow) => (
        <span className={r.neto >= 0 ? "text-green-600" : "text-red-500"}>
          ${r.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "balance", header: "Balance", accessor: (r: PoolSalesRow) => r.balance, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: PoolSalesRow) => `$${r.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ];

  const totals = filtered.reduce(
    (acc, r) => ({
      tickets: acc.tickets + r.tickets,
      venta: acc.venta + r.venta,
      comisiones: acc.comisiones + r.comisiones,
      premios: acc.premios + r.premios,
      neto: acc.neto + r.neto,
    }),
    { tickets: 0, venta: 0, comisiones: 0, premios: 0, neto: 0 }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Ventas por Banca" subtitle="Desglose de ventas por banca" />

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
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select value={selectedBanca} onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas las bancas</option>
              {bettingPools.map((bp) => (
                <option key={bp.id} value={bp.mwrCode}>{bp.mwrCode} - {bp.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Buscar</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar banca..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
            </div>
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
              <td colSpan={3} className="px-4 py-3 text-right text-sm">TOTALES</td>
              <td className="px-4 py-3 text-center text-sm font-mono">{totals.tickets}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.venta.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.comisiones.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">${totals.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">
                <span className={totals.neto >= 0 ? "text-green-600" : "text-red-500"}>
                  ${totals.neto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-4 py-3" />
            </tr>
          }
        />
      </motion.div>
    </motion.div>
  );
}
