import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";

interface AnomalyTicket {
  id: string;
  numero: string;
  fecha: string;
  banca: string;
  monto: number;
  tipo: string;
  descripcion: string;
  severidad: "alta" | "media" | "baja";
}

interface ResultChange {
  id: string;
  fecha: string;
  sorteo: string;
  usuario: string;
  accion: string;
  anterior: string;
  nuevo: string;
}

// Datos reales de anomalías y cambios vendrán de Supabase
function generateAnomalies(): AnomalyTicket[] { return []; }
function generateResultChanges(): ResultChange[] { return []; }

const severidadConfig = {
  alta: "bg-red-100 text-red-800 border-l-4 border-red-500",
  media: "bg-amber-50 border-l-4 border-amber-400",
  baja: "bg-blue-50 border-l-4 border-blue-400",
};

const accionConfig: Record<string, string> = {
  "Creo": "bg-blue-100 text-blue-800",
  "Modifico": "bg-amber-100 text-amber-800",
  "Bloqueo": "bg-green-100 text-green-800",
};

export default function Anomalias() {
  const [ticketDate, setTicketDate] = useState("2024-05-15");
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketPageSize, setTicketPageSize] = useState(10);
  const [changePageSize, setChangePageSize] = useState(10);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSorteo, setSelectedSorteo] = useState("");

  const anomalies = generateAnomalies();
  const changes = generateResultChanges();

  const anomalyColumns = [
    { key: "numero", header: "Numero", accessor: (r: AnomalyTicket) => r.numero, sortable: true, cell: (r: AnomalyTicket) => <span className="font-mono text-[#4ECDC4]">{r.numero}</span> },
    {
      key: "fecha", header: "Fecha", accessor: (r: AnomalyTicket) => r.fecha, sortable: true,
      formatter: (_v: unknown, r: AnomalyTicket) => new Date(r.fecha).toLocaleString("es-DO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    },
    { key: "banca", header: "Banca", accessor: (r: AnomalyTicket) => r.banca, sortable: true },
    {
      key: "monto", header: "Monto", accessor: (r: AnomalyTicket) => r.monto, sortable: true, align: "right" as const,
      formatter: (_v: unknown, r: AnomalyTicket) => `$${r.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    { key: "tipo", header: "Tipo", accessor: (r: AnomalyTicket) => r.tipo, sortable: true },
    { key: "descripcion", header: "Descripcion", accessor: (r: AnomalyTicket) => r.descripcion, sortable: true },
    {
      key: "severidad", header: "Severidad", accessor: (r: AnomalyTicket) => r.severidad, sortable: true, align: "center" as const,
      cell: (r: AnomalyTicket) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${severidadConfig[r.severidad]?.replace("border-l-4 border-red-500 ", "").replace("border-l-4 border-amber-400 ", "").replace("border-l-4 border-blue-400 ", "")}`}>
          {r.severidad}
        </span>
      ),
    },
  ];

  const changeColumns = [
    {
      key: "fecha", header: "Fecha", accessor: (r: ResultChange) => r.fecha, sortable: true,
      formatter: (_v: unknown, r: ResultChange) => new Date(r.fecha).toLocaleString("es-DO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    },
    { key: "sorteo", header: "Sorteo", accessor: (r: ResultChange) => r.sorteo, sortable: true },
    { key: "usuario", header: "Usuario", accessor: (r: ResultChange) => r.usuario, sortable: true },
    {
      key: "accion", header: "Accion", accessor: (r: ResultChange) => r.accion, sortable: true, align: "center" as const,
      cell: (r: ResultChange) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${accionConfig[r.accion] || "bg-gray-100 text-gray-800"}`}>{r.accion}</span>,
    },
    {
      key: "anterior", header: "Anterior", accessor: (r: ResultChange) => r.anterior, sortable: true, align: "center" as const,
      cell: (r: ResultChange) => r.anterior === "-" ? <span className="text-[#CCCCCC]">-</span> : <span className="text-red-500 line-through font-mono">{r.anterior}</span>,
    },
    {
      key: "nuevo", header: "Nuevo", accessor: (r: ResultChange) => r.nuevo, sortable: true, align: "center" as const,
      cell: (r: ResultChange) => <span className="text-green-600 font-semibold font-mono">{r.nuevo}</span>,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <PageHeader title="Anomalias" subtitle="Deteccion de irregularidades en tickets y resultados" />

      {/* Section 1: Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-[#333333]">Tickets anomalos</h2>
        </div>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Fecha</label>
            <input type="date" value={ticketDate} onChange={(e) => setTicketDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Buscar ticket</label>
            <input type="text" value={ticketSearch} onChange={(e) => setTicketSearch(e.target.value)} placeholder="Numero de ticket..."
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Entradas por pagina</label>
            <select value={ticketPageSize} onChange={(e) => setTicketPageSize(Number(e.target.value))}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <DataTable columns={anomalyColumns} data={anomalies} keyExtractor={(r) => r.id} pageSize={ticketPageSize} />
      </motion.div>

      {/* Section 2: Result Changes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-[#4ECDC4]" />
          <h2 className="text-lg font-semibold text-[#333333]">Cambios de resultados</h2>
        </div>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Entradas por pagina</label>
            <select value={changePageSize} onChange={(e) => setChangePageSize(Number(e.target.value))}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Grupos</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todos</option>
              <option value="default">Default</option>
              <option value="sfm">SFM</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">Sorteo</label>
            <select value={selectedSorteo} onChange={(e) => setSelectedSorteo(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors">
              <option value="">Todos</option>
            </select>
          </div>
        </div>
        <DataTable columns={changeColumns} data={changes} keyExtractor={(r) => r.id} pageSize={changePageSize} />
      </motion.div>
    </motion.div>
  );
}
