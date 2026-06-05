import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { transactions, bettingPools } from "@/data/mockData";

interface BancaTransaccion {
  id: string;
  concepto: string;
  fecha: string;
  hora: string;
  creadoPor: string;
  banca: string;
  mwrCode: string;
  tipo: string;
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;
  notas: string;
}

export default function TransaccionesBancas() {
  const [selectedPool, setSelectedPool] = useState("");

  const allData: BancaTransaccion[] = useMemo(() => {
    let balances: Record<string, number> = {};
    bettingPools.forEach((b) => { balances[b.id] = b.balance; });

    return transactions.map((t) => {
      const d = new Date(t.createdAt);
      const saldoAnterior = balances[t.bettingPoolId] || 0;
      const cambio = t.type === "COBRO" ? t.amount : -t.amount;
      const saldoNuevo = saldoAnterior + cambio;
      balances[t.bettingPoolId] = saldoNuevo;

      return {
        id: t.id,
        concepto: `${t.type} - ${t.category}`,
        fecha: d.toLocaleDateString("es-ES"),
        hora: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        creadoPor: t.createdBy,
        banca: t.bettingPoolName,
        mwrCode: t.mwrCode,
        tipo: t.type,
        monto: t.amount,
        saldoAnterior,
        saldoNuevo,
        notas: t.notes || "",
      };
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!selectedPool) return allData;
    return allData.filter((r) => r.banca === selectedPool);
  }, [allData, selectedPool]);

  const columns: Column<BancaTransaccion>[] = [
    { key: "concepto", header: "Concepto", accessor: (r) => r.concepto, sortable: true },
    { key: "fecha", header: "Fecha", accessor: (r) => r.fecha, sortable: true },
    { key: "hora", header: "Hora", accessor: (r) => r.hora, sortable: true },
    { key: "creadoPor", header: "Creado por", accessor: (r) => r.creadoPor, sortable: true },
    {
      key: "banca",
      header: "Banca",
      accessor: (r) => r.banca,
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-[#4ECDC4]" />
          <span className="text-[#333333]">{r.banca}</span>
          <span className="text-xs text-[#999999]">({r.mwrCode})</span>
        </div>
      ),
    },
    {
      key: "tipo",
      header: "Tipo",
      accessor: (r) => r.tipo,
      sortable: true,
      cell: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.tipo === "COBRO" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
          {r.tipo}
        </span>
      ),
    },
    { key: "monto", header: "Monto", accessor: (r) => r.monto, sortable: true, align: "right", formatter: (_v, r) => `$${r.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    { key: "saldoAnterior", header: "Saldo Ant.", accessor: (r) => r.saldoAnterior, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoAnterior.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    { key: "saldoNuevo", header: "Saldo Nuevo", accessor: (r) => r.saldoNuevo, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoNuevo.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    { key: "notas", header: "Notas", accessor: (r) => r.notas, sortable: false },
  ];

  const poolTotals = useMemo(() => {
    const map = new Map<string, { name: string; cobros: number; pagos: number }>();
    filteredData.forEach((r) => {
      if (!map.has(r.banca)) map.set(r.banca, { name: r.banca, cobros: 0, pagos: 0 });
      const e = map.get(r.banca)!;
      if (r.tipo === "COBRO") e.cobros += r.monto;
      else e.pagos += r.monto;
    });
    return Array.from(map.values());
  }, [filteredData]);

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Transacciones por Bancas" subtitle="Movimientos filtrados por banca" />

      {/* Pool Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todas las bancas</option>
              {bettingPools.map((b) => (
                <option key={b.id} value={b.name}>{b.name} ({b.mwrCode})</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      {poolTotals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {poolTotals.slice(0, 4).map((pt, idx) => (
            <motion.div
              key={pt.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">{pt.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#22C55E] font-medium">+${pt.cobros.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <span className="text-sm text-[#EF4444] font-medium">-${pt.pagos.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-lg font-bold text-[#333333] mt-1">Neto: ${(pt.cobros - pt.pagos).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(r) => r.id}
          pageSize={10}
        />
      </motion.div>
    </div>
  );
}
