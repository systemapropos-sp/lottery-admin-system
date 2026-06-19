import { useRef, useState } from "react";
import {
  Activity, LogIn, LogOut, Ticket, DollarSign, User, Smartphone,
  Filter, RefreshCw, Search, ChevronDown, Circle
} from "lucide-react";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogType = "login" | "logout" | "venta" | "cobro" | "ticket_anulado" | "cliente" | "error";
type Source = string;

interface LogEntry {
  id: string;
  timestamp: Date;
  type: LogType;
  source: Source;
  user: string;
  message: string;
  detail?: string;
  amount?: number;
}

// ─── Config per type ──────────────────────────────────────────────────────────

const typeConfig: Record<LogType, { label: string; icon: React.ElementType; color: string; bg: string; dot: string }> = {
  login:          { label: "Entrada",  icon: LogIn,      color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-500" },
  logout:         { label: "Salida",   icon: LogOut,     color: "text-slate-600",  bg: "bg-slate-50",  dot: "bg-slate-400" },
  venta:          { label: "Venta",    icon: Ticket,     color: "text-teal-700",   bg: "bg-teal-50",   dot: "bg-teal-500" },
  cobro:          { label: "Cobro",    icon: DollarSign, color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-500" },
  ticket_anulado: { label: "Anulado",  icon: Ticket,     color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-500" },
  cliente:        { label: "Cliente",  icon: User,       color: "text-violet-700", bg: "bg-violet-50", dot: "bg-violet-500" },
  error:          { label: "Error",    icon: Circle,     color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500" },
};

const SOURCE_PALETTE = [
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
];
function getSourceColor(source: string): string {
  if (source === "MOVIL") return "bg-orange-100 text-orange-700 border-orange-200";
  if (source === "ADMIN") return "bg-purple-100 text-purple-700 border-purple-200";
  let hash = 0;
  for (const c of source) hash = (hash * 31 + c.charCodeAt(0)) & 0xff;
  return SOURCE_PALETTE[hash % SOURCE_PALETTE.length];
}

// ─── Format time ──────────────────────────────────────────────────────────────

function formatTime(d: Date) {
  return d.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
}
function formatDate(d: Date) {
  return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ActivityLogPage() {
  const { bancas: bancasRaw } = useBancasZonas();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [filterSource, setFilterSource] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<LogType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [newCount, setNewCount] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  // Auto-scroll detection
  const handleScroll = () => {
    if (!feedRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
    isAtBottom.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  const scrollToTop = () => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setNewCount(0);
  };

  const filtered = logs.filter((e) => {
    if (filterSource !== "ALL" && e.source !== filterSource) return false;
    if (filterType !== "ALL" && e.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.message.toLowerCase().includes(q) && !e.user.toLowerCase().includes(q) && !e.source.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const stats = {
    total: filtered.length,
    ventas: filtered.filter((e) => e.type === "venta").length,
    logins: filtered.filter((e) => e.type === "login").length,
    cobros: filtered.filter((e) => e.type === "cobro").length,
  };

  // Dynamic source list: real bancas + MOVIL
  const sourceTags = [...bancasRaw.map(b => b.code), "MOVIL"];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Log de Operaciones</h1>
            <p className="text-gray-400 text-sm">Actividad en tiempo real · vendedores & clientes móvil</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            EN VIVO
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              paused
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {paused ? "▶ Reanudar" : "⏸ Pausar"}
          </button>
          <button
            onClick={() => { setLogs([]); setNewCount(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Registros", value: stats.total,  color: "text-gray-700",  bg: "bg-gray-50",  b: "border-gray-100" },
          { label: "Ventas",    value: stats.ventas,  color: "text-teal-700",  bg: "bg-teal-50",  b: "border-teal-100" },
          { label: "Entradas",  value: stats.logins,  color: "text-green-700", bg: "bg-green-50", b: "border-green-100" },
          { label: "Cobros",    value: stats.cobros,  color: "text-blue-700",  bg: "bg-blue-50",  b: "border-blue-100" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.b} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-gray-400" />
          <input
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Buscar por vendedor, banca, acción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Source filter */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Filter size={13} className="text-gray-400" />
          <select
            className="text-sm bg-transparent outline-none text-gray-700 cursor-pointer"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <option value="ALL">Todas las bancas</option>
            {bancasRaw.map(b => (
              <option key={b.id} value={b.code}>{b.code} — {b.name}</option>
            ))}
            <option value="MOVIL">Móvil</option>
          </select>
          <ChevronDown size={12} className="text-gray-400" />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <select
            className="text-sm bg-transparent outline-none text-gray-700 cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as LogType | "ALL")}
          >
            <option value="ALL">Todos los tipos</option>
            <option value="login">Entradas</option>
            <option value="logout">Salidas</option>
            <option value="venta">Ventas</option>
            <option value="cobro">Cobros</option>
            <option value="ticket_anulado">Anulados</option>
            <option value="cliente">Clientes nuevos</option>
          </select>
          <ChevronDown size={12} className="text-gray-400" />
        </div>

        {/* Banca source badges — dinámicos desde Supabase */}
        <div className="flex items-center gap-1 flex-wrap">
          {sourceTags.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSource(filterSource === s ? "ALL" : s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filterSource === s ? getSourceColor(s) : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {s === "MOVIL" ? <><Smartphone size={11} className="inline mr-0.5" />Móvil</> : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── New entries notice ────────────────────────────────────── */}
      {newCount > 0 && (
        <button
          onClick={scrollToTop}
          className="w-full py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
        >
          ↑ {newCount} nuevo(s) registro(s) — click para ver
        </button>
      )}

      {/* ── Feed ─────────────────────────────────────────────────── */}
      <div
        ref={feedRef}
        onScroll={handleScroll}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
            <Activity size={40} className="mb-3" />
            <p className="text-gray-400 font-medium">Sin registros</p>
            <p className="text-gray-300 text-sm">Las actividades reales aparecerán aquí en tiempo real</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((entry, i) => {
              const cfg = typeConfig[entry.type];
              const IconEl = cfg.icon;
              return (
                <div
                  key={entry.id}
                  className={`flex items-start gap-4 px-5 py-3 transition-colors hover:bg-gray-50/60 ${
                    i === 0 && !paused ? "bg-teal-50/30 animate-pulse [animation-iteration-count:1]" : ""
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                    <IconEl size={14} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getSourceColor(entry.source)}`}>
                        {entry.source}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-600">{entry.user}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{entry.message}</p>
                    {entry.detail && (
                      <p className="text-xs text-gray-400 mt-0.5">{entry.detail}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {entry.amount && (
                      <p className={`text-sm font-bold mb-0.5 ${entry.type === "ticket_anulado" ? "text-red-600" : "text-teal-600"}`}>
                        {entry.type === "ticket_anulado" ? "-" : "+"}${entry.amount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 font-mono">{formatTime(entry.timestamp)}</p>
                    <p className="text-[10px] text-gray-300">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-300 text-center">
        Mostrando {filtered.length} de {logs.length} registros totales
      </p>
    </div>
  );
}
