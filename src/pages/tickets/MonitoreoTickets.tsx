import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Printer, Ban, Calendar, Search } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import { tickets, lotteries, bettingPools } from "@/data/mockData";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Ganador", className: "bg-green-100 text-green-800" },
  paid: { label: "Perdedor", className: "bg-gray-100 text-gray-800" },
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
};

const quickFilters = [
  { key: "todos", label: "Todos" },
  { key: "active", label: "Ganadores" },
  { key: "pending", label: "Pendientes" },
  { key: "paid", label: "Perdedores" },
  { key: "cancelled", label: "Cancelado" },
];

function generateExtendedTickets() {
  const lotteryNames = lotteries.map((l) => l.name);
  const users = ["mmwrduser", "sfm056", "vale"];
  const playTypes = ["Quiniela", "Pale", "Tripleta", "Super Pale"];
  const extended = [...tickets];
  for (let i = 0; i < 44; i++) {
    const bp = bettingPools[i % bettingPools.length];
    const statuses: Array<"active" | "paid" | "pending" | "cancelled"> = ["active", "paid", "pending", "cancelled"];
    const status = statuses[i % 4];
    const amount = Math.random() * 500 + 10;
    extended.push({
      id: `tk-ext-${i}`,
      number: `TK-240515-${String(i + 10).padStart(4, "0")}`,
      bettingPoolId: bp.id,
      bettingPoolName: bp.name,
      lotteryName: lotteryNames[i % lotteryNames.length],
      playType: playTypes[i % playTypes.length],
      numbers: `${String(Math.floor(Math.random() * 99)).padStart(2, "0")}-${String(Math.floor(Math.random() * 99)).padStart(2, "0")}`,
      amount,
      createdAt: `2024-05-${String(10 + (i % 6)).padStart(2, "0")}T${String(8 + (i % 12)).padStart(2, "0")}:30:00Z`,
      status,
      userId: `u-${(i % 3) + 1}`,
      userName: users[i % 3],
    });
  }
  return extended;
}

export default function MonitoreoTickets() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedDate, setSelectedDate] = useState("2024-05-15");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [selectedLottery, setSelectedLottery] = useState("");
  const [selectedPlayType, setSelectedPlayType] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");

  const allTickets = useMemo(() => generateExtendedTickets(), []);

  const filtered = useMemo(() => {
    return allTickets.filter((t) => {
      if (activeFilter !== "todos" && t.status !== activeFilter) return false;
      if (selectedBanca && t.bettingPoolId !== selectedBanca) return false;
      if (selectedLottery && t.lotteryName !== selectedLottery) return false;
      if (selectedPlayType && t.playType !== selectedPlayType) return false;
      if (searchNumber && !t.numbers.includes(searchNumber)) return false;
      if (pendingOnly && t.status !== "pending") return false;
      if (winnersOnly && t.status !== "active") return false;
      return true;
    });
  }, [allTickets, activeFilter, selectedBanca, selectedLottery, selectedPlayType, searchNumber, pendingOnly, winnersOnly]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: allTickets.length, active: 0, paid: 0, pending: 0, cancelled: 0 };
    allTickets.forEach((t) => { c[t.status] = (c[t.status] || 0) + 1; });
    return c;
  }, [allTickets]);

  const totals = useMemo(() => ({
    monto: filtered.reduce((s, t) => s + t.amount, 0),
    premios: filtered.filter((t) => t.status === "active").reduce((s, t) => s + t.amount * 85, 0),
    pendiente: filtered.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0),
  }), [filtered]);

  const columns = [
    {
      key: "numero", header: "Numero", accessor: (t: typeof tickets[0]) => t.number, sortable: true,
      cell: (t: typeof tickets[0]) => <span className="font-mono text-[#4ECDC4] cursor-pointer hover:underline">{t.number}</span>,
    },
    {
      key: "fecha", header: "Fecha", accessor: (t: typeof tickets[0]) => t.createdAt, sortable: true,
      formatter: (_v: unknown, t: typeof tickets[0]) => new Date(t.createdAt).toLocaleString("es-DO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    },
    { key: "usuario", header: "Usuario", accessor: (t: typeof tickets[0]) => t.userName, sortable: true },
    {
      key: "monto", header: "Monto", accessor: (t: typeof tickets[0]) => t.amount, sortable: true, align: "right" as const,
      formatter: (_v: unknown, t: typeof tickets[0]) => `$${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "premio", header: "Premio", accessor: (t: typeof tickets[0]) => t.amount, sortable: true, align: "right" as const,
      cell: (t: typeof tickets[0]) => (
        <span className={t.status === "active" ? "text-green-600 font-mono" : "text-[#999999] font-mono"}>
          {t.status === "active" ? `$${(t.amount * 85).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}
        </span>
      ),
    },
    {
      key: "cancelDate", header: "Fecha de cancelacion", accessor: (t: typeof tickets[0]) => t.createdAt, sortable: true,
      cell: (t: typeof tickets[0]) => t.status === "cancelled" ? <span className="text-red-500 text-xs">{new Date(t.createdAt).toLocaleString("es-DO")}</span> : <span className="text-[#CCCCCC]">-</span>,
    },
    {
      key: "estado", header: "Estado", accessor: (t: typeof tickets[0]) => t.status, sortable: true, align: "center" as const,
      cell: (t: typeof tickets[0]) => {
        const cfg = statusConfig[t.status] || statusConfig.paid;
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
      },
    },
    {
      key: "acciones", header: "Acciones", accessor: (t: typeof tickets[0]) => t.id, align: "center" as const,
      cell: () => (
        <div className="flex items-center justify-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[#4ECDC4]/10 text-[#999999] hover:text-[#4ECDC4] transition-colors" title="Ver"><Eye size={15} /></button>
          <button className="p-1.5 rounded-md hover:bg-blue-50 text-[#999999] hover:text-blue-500 transition-colors" title="Imprimir"><Printer size={15} /></button>
          <button className="p-1.5 rounded-md hover:bg-red-50 text-[#999999] hover:text-red-500 transition-colors" title="Cancelar"><Ban size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Monitoreo de Tickets" subtitle="Supervise todos los tickets del sistema" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Fecha</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Banca</label>
            <select value={selectedBanca} onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              {bettingPools.map((bp) => <option key={bp.id} value={bp.id}>{bp.mwrCode}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Loteria</label>
            <select value={selectedLottery} onChange={(e) => setSelectedLottery(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todas</option>
              {lotteries.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Tipo de jugada</label>
            <select value={selectedPlayType} onChange={(e) => setSelectedPlayType(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todos</option>
              <option value="Quiniela">Quiniela</option>
              <option value="Pale">Pale</option>
              <option value="Tripleta">Tripleta</option>
              <option value="Super Pale">Super Pale</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Search size={12} /> Numero</label>
            <input type="text" value={searchNumber} onChange={(e) => setSearchNumber(e.target.value)} placeholder="Buscar numero..."
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
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
        </div>
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-[#F0F0EB]">
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer select-none">
            <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]" />
            Pendientes de pago
          </label>
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer select-none">
            <input type="checkbox" checked={winnersOnly} onChange={(e) => setWinnersOnly(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E0] text-[#4ECDC4] focus:ring-[#4ECDC4]" />
            Solo tickets ganadores
          </label>
        </div>
      </motion.div>

      {/* Quick Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeFilter === f.key
                ? "bg-[#4ECDC4] text-white shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                : "bg-white text-[#666666] border border-[#E5E5E0] hover:border-[#4ECDC4] hover:text-[#333333]"
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? "bg-white/20" : "bg-[#F0F0EB]"}`}>
              {counts[f.key] || 0}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Summary Pills */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">Monto total</p>
          <p className="text-xl font-bold font-mono text-[#333333] mt-1">${totals.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">Total de premios</p>
          <p className="text-xl font-bold font-mono text-green-600 mt-1">${totals.premios.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">Total pendiente de pago</p>
          <p className={`text-xl font-bold font-mono mt-1 ${totals.pendiente > 0 ? "text-red-500" : "text-[#333333]"}`}>
            ${totals.pendiente.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <DataTable columns={columns} data={filtered} keyExtractor={(t) => t.id} pageSize={10} />
      </motion.div>
    </motion.div>
  );
}
