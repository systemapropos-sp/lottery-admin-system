import { useEffect, useRef, useState } from "react";
import {
  Activity, LogIn, LogOut, Ticket, DollarSign, User, Smartphone,
  Filter, RefreshCw, Search, ChevronDown, Circle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogType = "login" | "logout" | "venta" | "cobro" | "ticket_anulado" | "cliente" | "error";
type Source = "NMV-001" | "NMV-002" | "NMV-003" | "MOVIL" | "ADMIN";

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

// ─── Mock data generator ──────────────────────────────────────────────────────

const vendors = ["María", "Carlos", "Rosa", "José", "Ana"];
const lotteries = ["Florida PM", "New York PM", "Anguila 9PM", "Pale Florida"];
const clients = ["Juan P.", "Miguel R.", "Laura S.", "Sofía V.", "Pedro C."];
const sources: Source[] = ["NMV-001", "NMV-002", "NMV-003", "MOVIL"];

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateEntry(): LogEntry {
  const types: LogType[] = ["venta", "venta", "venta", "cobro", "login", "logout", "cliente", "ticket_anulado"];
  const type = randomFrom(types);
  const source = randomFrom(sources);
  const vendor = randomFrom(vendors);
  const lottery = randomFrom(lotteries);
  const client = randomFrom(clients);

  const messages: Record<LogType, string> = {
    login:          `${vendor} inició sesión en ${source}`,
    logout:         `${vendor} cerró sesión en ${source}`,
    venta:          `${vendor} vendió ticket ${lottery} — cliente ${client}`,
    cobro:          `${vendor} registró cobro a ${client}`,
    ticket_anulado: `${vendor} anuló ticket de ${lottery}`,
    cliente:        `${vendor} registró cliente nuevo: ${client}`,
    error:          `Error de conexión en ${source}`,
  };

  const details: Record<LogType, string | undefined> = {
    login:          "Acceso desde Chrome · IP 192.168.1.x",
    logout:         undefined,
    venta:          `${lottery} · ${Math.floor(Math.random() * 4) + 1} jugada(s)`,
    cobro:          `Saldo pendiente actualizado`,
    ticket_anulado: `Ticket #${Math.floor(Math.random() * 9000) + 1000}`,
    cliente:        `Tel: 809-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    error:          "Tiempo de espera agotado",
  };

  return {
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    type,
    source,
    user: vendor,
    message: messages[type],
    detail: details[type],
    amount: type === "venta" ? Math.round((Math.random() * 200 + 5) * 100) / 100
           : type === "cobro" ? Math.round((Math.random() * 500 + 20) * 100) / 100
           : undefined,
  };
}

function buildInitialLog(): LogEntry[] {
  const now = new Date();
  return Array.from({ length: 40 }, (_, i) => {
    const e = generateEntry();
    e.timestamp = new Date(now.getTime() - (40 - i) * 45_000 - Math.random() * 30_000);
    e.id = `log-init-${i}`;
    return e;
  }).reverse();
}

// ─── Config per type ──────────────────────────────────────────────────────────

const typeConfig: Record<LogType, { label: string; icon: React.ElementType; color: string; bg: string; dot: string }> = {
  login:          { label: "Entrada",     icon: LogIn,          color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-500" },
  logout:         { label: "Salida",      icon: LogOut,         color: "text-slate-600",  bg: "bg-slate-50",  dot: "bg-slate-400" },
  venta:          { label: "Venta",       icon: Ticket,         color: "text-teal-700",   bg: "bg-teal-50",   dot: "bg-teal-500" },
  cobro:          { label: "Cobro",       icon: DollarSign,     color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-500" },
  ticket_anulado: { label: "Anulado",     icon: Ticket,         color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-500" },
  cliente:        { label: "Cliente",     icon: User,           color: "text-violet-700", bg: "bg-violet-50", dot: "bg-violet-500" },
  error:          { label: "Error",       icon: Circle,         color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500" },
};

const sourceColors: Record<Source, string> = {
  "NMV-001": "bg-teal-100 text-teal-700 border-teal-200",
  "NMV-002": "bg-blue-100 text-blue-700 border-blue-200",
  "NMV-003": "bg-violet-100 text-violet-700 border-violet-200",
  "MOVIL":   "bg-orange-100 text-orange-700 border-orange-200",
  "ADMIN":   "bg-purple-100 text-purple-700 border-purple-200",
};

// ─── Format time ──────────────────────────────────────────────────────────────

function formatTime(d: Date) {
  return d.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
}
function formatDate(d: Date) {
  return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>(buildInitialLog);
  const [paused, setPaused] = useState(false);
  const [filterSource, setFilterSource] = useState<Source | "ALL">("ALL");
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

  // Auto-add entries every 3-5s
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const entry = generateEntry();
      setLogs((prev) => [entry, ...prev.slice(0, 199)]);
      if (!isAtBottom.current) {
        setNewCount((c) => c + 1);
      }
    }, Math.random() * 2000 + 3000);
    return () => clearInterval(interval);
  }, [paused]);

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
            onClick={() => setLogs(buildInitialLog)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Registros", value: stats.total, color: "text-gray-700", bg: "bg-gray-50", b: "border-gray-100" },
          { label: "Ventas",    value: stats.ventas, color: "text-teal-700", bg: "bg-teal-50",  b: "border-teal-100" },
          { label: "Entradas",  value: stats.logins, color: "text-green-700", bg: "bg-green-50", b: "border-green-100" },
          { label: "Cobros",    value: stats.cobros, color: "text-blue-700",  bg: "bg-blue-50",  b: "border-blue-100" },
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
            onChange={(e) => setFilterSource(e.target.value as Source | "ALL")}
          >
            <option value="ALL">Todas las bancas</option>
            <option value="NMV-001">NMV-001</option>
            <option value="NMV-002">NMV-002</option>
            <option value="NMV-003">NMV-003</option>
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

        {/* Banca source badges */}
        <div className="flex items-center gap-1">
          {(["NMV-001", "NMV-002", "NMV-003", "MOVIL"] as Source[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSource(filterSource === s ? "ALL" : s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filterSource === s ? sourceColors[s] : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
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
            <p className="text-gray-300 text-sm">Ajusta los filtros para ver actividad</p>
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
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                    <IconEl size={14} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${sourceColors[entry.source]}`}>
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

                  {/* Timestamp + Amount */}
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
        Mostrando {filtered.length} de {logs.length} registros totales · Actualización automática cada 3-5 segundos
      </p>
    </div>
  );
}
