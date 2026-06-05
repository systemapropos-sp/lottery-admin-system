import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Filter, Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { transactions, bettingPools } from "@/data/mockData";

interface TransaccionRow {
  id: string;
  concepto: string;
  fecha: string;
  hora: string;
  creadoPor: string;
  entidad1: string;
  entidad2: string;
  saldoIni1: number;
  saldoIni2: number;
  debito: number;
  credito: number;
  saldoFin1: number;
  saldoFin2: number;
  notas: string;
  tipo: string;
  categoria: string;
}

export default function ListaTransacciones() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tipoEntidad, setTipoEntidad] = useState("");
  const [entidad, setEntidad] = useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const [creadoPor, setCreadoPor] = useState("");
  const [showNotas, setShowNotas] = useState(false);

  const allData: TransaccionRow[] = useMemo(() => {
    let base = 50000;
    return transactions.map((t) => {
      const d = new Date(t.createdAt);
      const debito = t.type === "PAGO" ? t.amount : 0;
      const credito = t.type === "COBRO" ? t.amount : 0;
      const saldoIni1 = base;
      const saldoFin1 = base + credito - debito;
      base = saldoFin1;
      return {
        id: t.id,
        concepto: `${t.type} - ${t.category}`,
        fecha: d.toLocaleDateString("es-ES"),
        hora: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        creadoPor: t.createdBy,
        entidad1: t.bettingPoolName,
        entidad2: t.category,
        saldoIni1: saldoIni1,
        saldoIni2: 0,
        debito: debito,
        credito: credito,
        saldoFin1: saldoFin1,
        saldoFin2: 0,
        notas: t.notes || "",
        tipo: t.type,
        categoria: t.category,
      };
    });
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (startDate) {
        const parts = row.fecha.split("/");
        const rowDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (rowDate < new Date(startDate)) return false;
      }
      if (endDate) {
        const parts = row.fecha.split("/");
        const rowDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (rowDate > new Date(endDate)) return false;
      }
      if (tipoEntidad && row.entidad1 !== tipoEntidad) return false;
      if (entidad && !row.entidad1.toLowerCase().includes(entidad.toLowerCase())) return false;
      if (tipoTransaccion && row.tipo !== tipoTransaccion) return false;
      if (creadoPor && row.creadoPor !== creadoPor) return false;
      return true;
    });
  }, [allData, startDate, endDate, tipoEntidad, entidad, tipoTransaccion, creadoPor]);

  const columns = useMemo<Column<TransaccionRow>[]>(() => {
    const baseCols: Column<TransaccionRow>[] = [
      { key: "concepto", header: "Concepto", accessor: (r) => r.concepto, sortable: true },
      { key: "fecha", header: "Fecha", accessor: (r) => r.fecha, sortable: true },
      { key: "hora", header: "Hora", accessor: (r) => r.hora, sortable: true },
      { key: "creadoPor", header: "Creado por", accessor: (r) => r.creadoPor, sortable: true },
      { key: "entidad1", header: "Entidad #1", accessor: (r) => r.entidad1, sortable: true },
      { key: "entidad2", header: "Entidad #2", accessor: (r) => r.entidad2, sortable: true },
      { key: "saldoIni1", header: "Saldo ini #1", accessor: (r) => r.saldoIni1, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoIni1.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
      { key: "saldoIni2", header: "Saldo ini #2", accessor: (r) => r.saldoIni2, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoIni2.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
      { key: "debito", header: "Debito", accessor: (r) => r.debito, sortable: true, align: "right", cell: (r) => (
        <span className="text-[#EF4444] font-medium">{r.debito > 0 ? `-$${r.debito.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "-"}</span>
      )},
      { key: "credito", header: "Credito", accessor: (r) => r.credito, sortable: true, align: "right", cell: (r) => (
        <span className="text-[#22C55E] font-medium">{r.credito > 0 ? `+$${r.credito.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "-"}</span>
      )},
      { key: "saldoFin1", header: "Saldo fin #1", accessor: (r) => r.saldoFin1, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoFin1.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
      { key: "saldoFin2", header: "Saldo fin #2", accessor: (r) => r.saldoFin2, sortable: true, align: "right", formatter: (_v, r) => `$${r.saldoFin2.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    ];
    if (showNotas) {
      baseCols.push({ key: "notas", header: "Notas", accessor: (r) => r.notas, sortable: false });
    }
    return baseCols;
  }, [showNotas]);

  const uniqueUsers = useMemo(() => [...new Set(transactions.map((t) => t.createdBy))], []);

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Transacciones" subtitle="Registro completo de movimientos financieros" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Desde</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Hasta</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo de entidad</label>
            <select value={tipoEntidad} onChange={(e) => setTipoEntidad(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]">
              <option value="">Todos</option>
              {bettingPools.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Entidad</label>
            <select value={entidad} onChange={(e) => setEntidad(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]">
              <option value="">Todas</option>
              {bettingPools.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo de transaccion</label>
            <select value={tipoTransaccion} onChange={(e) => setTipoTransaccion(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]">
              <option value="">Todos</option>
              <option value="COBRO">Credito</option>
              <option value="PAGO">Debito</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Creado por</label>
            <select value={creadoPor} onChange={(e) => setCreadoPor(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]">
              <option value="">Todos</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={showNotas} onChange={(e) => setShowNotas(e.target.checked)} className="accent-[#4ECDC4] w-4 h-4 rounded" />
            <span className="text-sm text-[#333333]">Mostrar notas</span>
          </label>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Filter size={14} />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
              <Download size={14} />
              CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors">
              <FileText size={14} />
              PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
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
