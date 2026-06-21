import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronDown, Search, X, AlertTriangle } from "lucide-react";
import { useBancasZonas } from "@/context/BancasZonasContext";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

// --- Tipos compartidos --------------------------------------------------------
const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const SORTEOS = [
  "LA PRIMERA 7PM","FLORIDA PM","LOTEKA","LA SUERTE","LA PRIMERA",
  "GANA MAS","QUINIELA REAL","SUPER PALE REAL-GANA MAS","Anguila 10AM",
  "NEW YORK AM","Anguila 6PM","SUPER PALE NACIONAL-QP","NACIONAL",
  "NEW YORK PM","Anguila 9PM","Anguila 1PM","LA SUERTE 6:00pm",
  "QUINIELA PALE","FLORIDA AM","LOTEDOM","REAL","LOTO POOL",
  "MEGA CHANCES","SUPER PALE PALE",
];

// --- Tipos de fila general ----------------------------------------------------
interface GeneralRow {
  id: string; ref: string; codigo: string;
  p: number; l: number; w: number; total: number;
  venta: number; comisiones: number; premios: number;
  neto: number; final: number; balance: number;
}

// --- Pills de filtro ----------------------------------------------------------
type FilterPill = "TODOS" | "CON VENTAS" | "CON PREMIOS" | "CON TICKETS PENDIENTES" | "CON VENTAS NETAS NEGATIVAS" | "CON VENTAS NETAS POSITIVAS";
const PILLS: FilterPill[] = ["TODOS", "CON VENTAS", "CON PREMIOS", "CON TICKETS PENDIENTES", "CON VENTAS NETAS NEGATIVAS", "CON VENTAS NETAS POSITIVAS"];

function applyPill(rows: GeneralRow[], pill: FilterPill): GeneralRow[] {
  switch (pill) {
    case "CON VENTAS":                return rows.filter((r) => r.venta > 0);
    case "CON PREMIOS":               return rows.filter((r) => r.premios > 0);
    case "CON TICKETS PENDIENTES":    return rows.filter((r) => r.total > 0);
    case "CON VENTAS NETAS NEGATIVAS":return rows.filter((r) => r.neto < 0);
    case "CON VENTAS NETAS POSITIVAS":return rows.filter((r) => r.neto > 0);
    default:                          return rows;
  }
}

// --- Helpers UI ---------------------------------------------------------------
const netoCell = (n: number) => (
  <span className={`font-semibold ${n < 0 ? "text-[#EF4444]" : n > 0 ? "text-[#22C55E]" : "text-[#999]"}`}>{fmt(n)}</span>
);
const balanceCell = (n: number) => (
  <span className={`font-semibold ${n > 0 ? "text-[#3B82F6]" : "text-[#999]"}`}>{fmt(n)}</span>
);

function TotalBadge({ label, amount }: { label: string; amount: number }) {
  const neg = amount < 0;
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <span className="text-lg font-semibold text-[#333]">{label}:</span>
      <span className={`text-lg font-bold px-4 py-1 rounded-full border-2 ${neg ? "text-[#EF4444] border-[#EF4444] bg-[#FEF2F2]" : "text-[#22C55E] border-[#22C55E] bg-[#F0FDF4]"}`}>
        {fmt(amount)}
      </span>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#999]">{label}</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#14B8A6] transition-colors" />
    </div>
  );
}

function ActionBtn({ label, variant = "primary", onClick, loading = false, disabled = false }: {
  label: string; variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void; loading?: boolean; disabled?: boolean;
}) {
  const cls = variant === "primary" ? "bg-[#14B8A6] text-white hover:bg-[#0F766E] shadow-sm"
    : variant === "secondary" ? "bg-white text-[#333] border border-[#E5E5E0] hover:bg-[#F5F5F0] hover:border-[#14B8A6]"
    : "bg-[#F5F5F0] text-[#666] hover:bg-[#EBEBEB]";
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 ${cls}`}>
      {loading && <RefreshCw size={11} className="animate-spin"/>}
      {label}
    </button>
  );
}

// --- MultiSelect dropdown con opciones reales ---------------------------------
function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (s: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggleAll = () => onChange(selected.length === options.length ? [] : [...options]);
  const toggleOne = (o: string) => onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs text-[#999]">{label}</label>
      <div onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E5E0] rounded-lg bg-white cursor-pointer hover:border-[#14B8A6] transition-colors min-w-[150px]">
        <span className="text-sm text-[#333] flex-1">
          {selected.length === 0 ? "Ninguna" : selected.length === options.length ? "Todas" : `${selected.length} seleccionadas`}
        </span>
        <ChevronDown size={14} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-xl min-w-[180px] py-2 max-h-60 overflow-y-auto">
          <div className="px-3 py-1.5 border-b border-[#F0F0EB]">
            <button onClick={toggleAll} className="text-xs font-semibold text-[#14B8A6] hover:underline">
              {selected.length === options.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </button>
          </div>
          {options.map((o) => (
            <label key={o} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#F5F5F0] cursor-pointer text-sm text-[#333]">
              <input type="checkbox" checked={selected.includes(o)} onChange={() => toggleOne(o)}
                className="rounded accent-[#14B8A6]" />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// --- QuickFilter --------------------------------------------------------------
function QuickFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999]" />
        <input value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Filtro rápido"
          className="pl-7 pr-7 py-1.5 text-xs border border-[#E5E5E0] rounded-lg bg-[#FAFAFA] focus:outline-none focus:border-[#14B8A6] w-44 transition-colors" />
        {value && (
          <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X size={11} className="text-[#999]" />
          </button>
        )}
      </div>
      <button onClick={() => onChange("")} className="p-1.5 border border-[#E5E5E0] rounded-lg bg-white hover:bg-[#F5F5F0] transition-colors">
        <RefreshCw size={13} className="text-[#666]" />
      </button>
    </div>
  );
}

// --- FilterPills --------------------------------------------------------------
function FilterPills({ active, onChange }: { active: FilterPill; onChange: (p: FilterPill) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PILLS.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${active === p ? "bg-[#14B8A6] text-white border-[#14B8A6]" : "bg-white text-[#666] border-[#E5E5E0] hover:border-[#14B8A6] hover:text-[#14B8A6]"}`}>
          {p}
        </button>
      ))}
    </div>
  );
}

// --- CSV / PDF helpers --------------------------------------------------------
function exportCSV(rows: GeneralRow[], filename: string) {
  const headers = ["Ref","Código","P","L","W","Total","Venta","Comisiones","Premios","Neto","Final","Balance"];
  const csvRows = [headers.join(","), ...rows.map(r =>
    [r.ref, r.codigo, r.p, r.l, r.w, r.total,
      r.venta.toFixed(2), r.comisiones.toFixed(2), r.premios.toFixed(2),
      r.neto.toFixed(2), r.final.toFixed(2), r.balance.toFixed(2)].join(",")
  )];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function printTable(rows: GeneralRow[], date: string) {
  const fmt2 = (n: number) => `$${n.toLocaleString("en-US",{minimumFractionDigits:2})}`;
  const html = `<html><head><title>Ventas del Día ${date}</title>
    <style>body{font-family:Arial,sans-serif;font-size:12px}table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ccc;padding:4px 8px;text-align:right}th{background:#f0f0f0;text-align:center}
    td:first-child,td:nth-child(2){text-align:left}h2{text-align:center}</style></head>
    <body><h2>Ventas del Día — ${date}</h2><table>
    <thead><tr>${["Ref","Código","P","L","W","Total","Venta","Comisiones","Premios","Neto","Final","Balance"].map(h=>`<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r=>`<tr><td>${r.ref}</td><td>${r.codigo}</td><td>${r.p}</td><td>${r.l}</td><td>${r.w}</td>
    <td>${r.total}</td><td>${fmt2(r.venta)}</td><td>${fmt2(r.comisiones)}</td><td>${fmt2(r.premios)}</td>
    <td>${fmt2(r.neto)}</td><td>${fmt2(r.final)}</td><td>${fmt2(r.balance)}</td></tr>`).join("")}</tbody>
    </table></body></html>`;
  const w = window.open("","_blank"); if (!w) return;
  w.document.write(html); w.document.close(); w.print();
}

// --- TAB GENERAL -------------------------------------------------------------
function TabGeneral() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const BANCAS = bancasRaw.map(b => ({ id: b.id, ref: b.name ?? "", codigo: b.code ?? "" }));
  const ZONAS = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));

  const [date, setDate]       = useState(new Date().toISOString().slice(0, 10));
  const [pill, setPill]       = useState<FilterPill>("TODOS");
  const [subTab, setSubTab]   = useState<"bancas" | "resultados">("bancas");
  const [quick, setQuick]     = useState("");
  const [selZonas, setSelZonas] = useState<string[]>(ZONAS.map((z) => z.nombre));
  const [rows, setRows]       = useState<GeneralRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [warnMsg, setWarnMsg] = useState("");

  const fetchVentas = useCallback(async () => {
    setLoading(true); setWarnMsg("");
    try {
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("id, banca_code, created_at")
        .eq("business_id", BUSINESS_ID)
        .gte("created_at", `${date}T00:00:00`)
        .lte("created_at", `${date}T23:59:59`);

      if (error) throw error;

      const { data: plays } = await supabase
        .from("ticket_plays")
        .select("ticket_id, amount, prize")
        .in("ticket_id", (tickets ?? []).map((t: { id: string }) => t.id));

      // Group by banca_code
      const map = new Map<string, GeneralRow>();
      BANCAS.forEach(b => {
        map.set(b.codigo, {
          id: b.id, ref: b.ref, codigo: b.codigo,
          p: 0, l: 0, w: 0, total: 0,
          venta: 0, comisiones: 0, premios: 0,
          neto: 0, final: 0, balance: 0,
        });
      });

      (tickets ?? []).forEach((t: { id: string; banca_code: string }) => {
        const row = map.get(t.banca_code);
        if (row) row.total += 1;
      });

      (plays ?? []).forEach((p: { ticket_id: string; amount: number; prize: number }) => {
        const ticket = (tickets ?? []).find((t: { id: string; banca_code: string }) => t.id === p.ticket_id);
        if (!ticket) return;
        const row = map.get(ticket.banca_code);
        if (row) {
          row.venta += p.amount ?? 0;
          row.premios += p.prize ?? 0;
          row.neto = row.venta - row.premios - row.comisiones;
          row.final = row.neto;
          row.balance = row.neto;
        }
      });

      setRows([...map.values()]);
      setLoaded(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error de conexión";
      setWarnMsg("Error al cargar datos: " + msg);
    } finally {
      setLoading(false);
    }
  }, [date, BANCAS]);

  const displayRows = loaded ? rows : BANCAS.map(b => ({
    id: b.id, ref: b.ref, codigo: b.codigo,
    p: 0, l: 0, w: 0, total: 0,
    venta: 0, comisiones: 0, premios: 0,
    neto: 0, final: 0, balance: 0,
  }));

  const filtered = useMemo(() => {
    const byPill = applyPill(displayRows, pill);
    const q = quick.toLowerCase();
    return q ? byPill.filter((r) => r.ref.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q)) : byPill;
  }, [displayRows, pill, quick]);

  const totals = useMemo(() => filtered.reduce((acc, r) => ({
    p: acc.p + r.p, l: acc.l + r.l, w: acc.w + r.w,
    total: acc.total + r.total, venta: acc.venta + r.venta,
    comisiones: acc.comisiones + r.comisiones, premios: acc.premios + r.premios,
    neto: acc.neto + r.neto, final: acc.final + r.final, balance: acc.balance + r.balance,
  }), { p:0,l:0,w:0,total:0,venta:0,comisiones:0,premios:0,neto:0,final:0,balance:0 }), [filtered]);

  return (
    <div className="space-y-4">
      {warnMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <AlertTriangle size={16}/> {warnMsg}
          <button onClick={() => setWarnMsg("")} className="ml-auto text-amber-400 hover:text-amber-600"><X size={14}/></button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <DateInput label="Fecha" value={date} onChange={() => setLoaded(false)} />
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setLoaded(false); }}
            className="px-3 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#14B8A6] transition-colors" />
          <MultiSelect label="Zonas" options={ZONAS.map((z) => z.nombre)} selected={selZonas} onChange={setSelZonas} />
          <div className="flex flex-wrap gap-2 flex-1 justify-end">
            <ActionBtn label="VER VENTAS" variant="primary" loading={loading} onClick={fetchVentas} />
            <ActionBtn label="PDF" variant="secondary"
              onClick={() => printTable(filtered, date)} disabled={!loaded} />
            <ActionBtn label="CSV" variant="secondary"
              onClick={() => exportCSV(filtered, `ventas-${date}.csv`)} disabled={!loaded} />
            <ActionBtn label="PROCESAR TICKETS DE HOY" variant="ghost"
              onClick={() => setWarnMsg("⚠️ Función PROCESAR en desarrollo — se habilitará próximamente.")} />
            <ActionBtn label="PROCESAR VENTAS DE AYER" variant="ghost"
              onClick={() => setWarnMsg("⚠️ Función PROCESAR en desarrollo — se habilitará próximamente.")} />
          </div>
        </div>
        <TotalBadge label="Neto (banca/grupos/agentes)" amount={totals.neto} />
      </div>

      <div className="flex gap-3 border-b border-[#E5E5E0]">
        {(["bancas","resultados"] as const).map((st) => (
          <button key={st} onClick={() => setSubTab(st)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${subTab===st ? "text-[#14B8A6] border-[#14B8A6]" : "text-[#666] border-transparent hover:text-[#333]"}`}>
            {st.charAt(0).toUpperCase()+st.slice(1)}
          </button>
        ))}
      </div>

      <TotalBadge label="Total" amount={totals.neto} />

      <div>
        <p className="text-sm font-semibold text-[#333] mb-2">Filtros</p>
        <FilterPills active={pill} onChange={setPill} />
      </div>

      <div className="flex justify-end mb-2"><QuickFilter value={quick} onChange={setQuick} /></div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
              {["Ref.","Código","P","L","W","Total","Venta","Comisiones","Premios","Neto","Final","Balance"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} className="py-8 text-center text-sm text-[#999]">Sin datos para el filtro seleccionado</td></tr>
            ) : filtered.map((row, ri) => (
              <tr key={row.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30 transition-colors`}>
                <td className="px-3 py-2 text-[#333]">{row.ref}</td>
                <td className="px-3 py-2 text-[#14B8A6] font-medium">{row.codigo}</td>
                <td className="px-3 py-2 text-center">{row.p}</td>
                <td className="px-3 py-2 text-center">{row.l}</td>
                <td className="px-3 py-2 text-center">{row.w}</td>
                <td className="px-3 py-2 text-right">{row.total}</td>
                <td className="px-3 py-2 text-right">{fmt(row.venta)}</td>
                <td className="px-3 py-2 text-right">{fmt(row.comisiones)}</td>
                <td className="px-3 py-2 text-right">{fmt(row.premios)}</td>
                <td className="px-3 py-2 text-right">{netoCell(row.neto)}</td>
                <td className="px-3 py-2 text-right">{netoCell(row.final)}</td>
                <td className="px-3 py-2 text-right">{balanceCell(row.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
              <td className="px-3 py-2.5" colSpan={2}>Totales</td>
              <td className="px-3 py-2.5 text-center">{totals.p}</td>
              <td className="px-3 py-2.5 text-center">{totals.l}</td>
              <td className="px-3 py-2.5 text-center">{totals.w}</td>
              <td className="px-3 py-2.5 text-right">{totals.total}</td>
              <td className="px-3 py-2.5 text-right">{fmt(totals.venta)}</td>
              <td className="px-3 py-2.5 text-right">{fmt(totals.comisiones)}</td>
              <td className="px-3 py-2.5 text-right">{fmt(totals.premios)}</td>
              <td className="px-3 py-2.5 text-right">{netoCell(totals.neto)}</td>
              <td className="px-3 py-2.5 text-right">{netoCell(totals.final)}</td>
              <td className="px-3 py-2.5 text-right">{balanceCell(totals.balance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-[#999]">Mostrando {filtered.length} de {displayRows.length} entradas</p>
    </div>
  );
}

// --- TAB BANCA POR SORTEO -----------------------------------------------------
function TabBancaPorSorteo() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const BANCAS = bancasRaw.map(b => ({ id: b.id, ref: b.name ?? "", codigo: b.code ?? "" }));
  const ZONAS = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));
  const [fi, setFi] = useState(new Date().toISOString().slice(0, 10));
  const [ff, setFf] = useState(new Date().toISOString().slice(0, 10));
  const [selSorteos, setSelSorteos] = useState<string[]>(SORTEOS);
  const [selZonas, setSelZonas]     = useState<string[]>(ZONAS.map((z) => z.nombre));
  const [quick, setQuick] = useState("");

  const rows = useMemo(() => BANCAS.map((b) => ({
    id: b.id, ref: b.ref, banca: b.codigo,
    totalVendido: 0, totalPremios: 0, totalComisiones: 0, totalNeto: 0,
  })), []);

  const filtered = useMemo(() => {
    const q = quick.toLowerCase();
    return q ? rows.filter((r) => r.ref.toLowerCase().includes(q) || r.banca.toLowerCase().includes(q)) : rows;
  }, [rows, quick]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
        <h2 className="text-xl font-bold text-[#333] mb-4 text-center">Montos por sorteo y banca</h2>
        <div className="flex flex-wrap items-end gap-3 mb-3">
          <DateInput label="Fecha inicial" value={fi} onChange={setFi} />
          <DateInput label="Fecha final"   value={ff} onChange={setFf} />
          <MultiSelect label="Sorteos" options={SORTEOS} selected={selSorteos} onChange={setSelSorteos} />
          <MultiSelect label="Zonas"   options={ZONAS.map((z) => z.nombre)} selected={selZonas} onChange={setSelZonas} />
          <ActionBtn label="VER VENTAS" variant="primary" />
        </div>
        <TotalBadge label="Total neto" amount={0} />
      </div>
      <div className="flex justify-end"><QuickFilter value={quick} onChange={setQuick} /></div>
      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            {["Ref.","Banca","Total Vendido","Total premios","Total comisiones","Total neto"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r, ri) => (
              <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                <td className="px-3 py-2">{r.ref}</td>
                <td className="px-3 py-2 text-[#14B8A6] font-medium">{r.banca}</td>
                <td className="px-3 py-2 text-right">{fmt(r.totalVendido)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.totalPremios)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.totalComisiones)}</td>
                <td className="px-3 py-2 text-right">{netoCell(r.totalNeto)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
            <td className="px-3 py-2.5" colSpan={2}>Totales</td>
            {["$0.00","$0.00","$0.00"].map((v,i) => <td key={i} className="px-3 py-2.5 text-right">{v}</td>)}
            <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
          </tr></tfoot>
        </table>
      </div>
      <p className="text-xs text-[#999]">Mostrando {filtered.length} de {rows.length} entradas</p>
    </div>
  );
}

// --- TAB POR SORTEO -----------------------------------------------------------
function TabPorSorteo() {
  const { zonas: zonasRaw } = useBancasZonas();
  const ZONAS = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selZonas, setSelZonas] = useState<string[]>(ZONAS.map((z) => z.nombre));
  const [quick, setQuick] = useState("");

  const rows = SORTEOS.map((s, i) => ({ id:`s${i}`, sorteo:s, totalVendido:0, totalPremios:0, totalComisiones:0, totalNeto:0 }));
  const filtered = useMemo(() => {
    const q = quick.toLowerCase();
    return q ? rows.filter((r) => r.sorteo.toLowerCase().includes(q)) : rows;
  }, [quick]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
        <h2 className="text-xl font-bold text-[#333] mb-4 text-center">Ventas por sorteo</h2>
        <div className="flex flex-wrap items-end gap-3 mb-2">
          <DateInput label="Fecha" value={date} onChange={setDate} />
          <MultiSelect label="Zonas" options={ZONAS.map((z) => z.nombre)} selected={selZonas} onChange={setSelZonas} />
          <ActionBtn label="VER VENTAS" variant="primary" />
        </div>
        <TotalBadge label="Total neto" amount={0} />
      </div>
      <div className="flex justify-end"><QuickFilter value={quick} onChange={setQuick} /></div>
      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            {["Sorteo","Total Vendido","Total premios","Total comisiones","Total neto"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r, ri) => (
              <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                <td className="px-3 py-2 font-medium text-[#333]">{r.sorteo}</td>
                {[r.totalVendido,r.totalPremios,r.totalComisiones].map((v,i) => <td key={i} className="px-3 py-2 text-right">{fmt(v)}</td>)}
                <td className="px-3 py-2 text-right">{netoCell(r.totalNeto)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
            <td className="px-3 py-2.5">Totales</td>
            {["$0.00","$0.00","$0.00"].map((v,i) => <td key={i} className="px-3 py-2.5 text-right">{v}</td>)}
            <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
          </tr></tfoot>
        </table>
      </div>
      <p className="text-xs text-[#999]">Mostrando {filtered.length} de {rows.length} entradas</p>
    </div>
  );
}

// --- TAB COMBINACIONES --------------------------------------------------------
function TabCombinaciones() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const BANCAS = bancasRaw.map(b => ({ id: b.id, ref: b.name ?? "", codigo: b.code ?? "" }));
  const ZONAS = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [selSorteos, setSelSorteos] = useState<string[]>(SORTEOS);
  const [selZonas, setSelZonas]     = useState<string[]>(ZONAS.map((z) => z.nombre));
  const [selBancas, setSelBancas]   = useState<string[]>(BANCAS.map((b) => b.ref));

  const rows = [
    { id:"c1", comb:"Directo(0)",    vendido:0, com1:0, com2:0, premios:0, balance:0 },
    { id:"c2", comb:"Pale(0)",       vendido:0, com1:0, com2:0, premios:0, balance:0 },
    { id:"c3", comb:"Tripleta(0)",   vendido:0, com1:0, com2:0, premios:0, balance:0 },
    { id:"c4", comb:"Super Pale(0)", vendido:0, com1:0, com2:0, premios:0, balance:0 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
        <h2 className="text-xl font-bold text-[#333] mb-4 text-center">Combinaciones</h2>
        <div className="flex flex-wrap items-end gap-3">
          <DateInput label="Fecha" value={date} onChange={setDate} />
          <MultiSelect label="Sorteos" options={SORTEOS} selected={selSorteos} onChange={setSelSorteos} />
          <MultiSelect label="Zonas"   options={ZONAS.map((z) => z.nombre)} selected={selZonas} onChange={setSelZonas} />
          <MultiSelect label="Bancas"  options={BANCAS.map((b) => b.ref)} selected={selBancas} onChange={setSelBancas} />
          <ActionBtn label="VER VENTAS" variant="primary" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            {["Combinación","Total Vendido","Total comisiones","Total comisiones 2","Total premios","Balances"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555] text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                <td className="px-3 py-2 font-medium">{r.comb}</td>
                <td className="px-3 py-2 text-right">{fmt(r.vendido)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.com1)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.com2)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.premios)}</td>
                <td className="px-3 py-2 text-right">{netoCell(r.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
            <td className="px-3 py-2.5">Totales</td>
            {["$0.00","$0.00","$0.00","$0.00"].map((v,i) => <td key={i} className="px-3 py-2.5 text-right">{v}</td>)}
            <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
          </tr></tfoot>
        </table>
      </div>
    </div>
  );
}

// --- TAB POR ZONA -------------------------------------------------------------
function TabPorZona() {
  const { zonas: zonasRaw } = useBancasZonas();
  const ZONAS = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [pill, setPill]         = useState<FilterPill>("TODOS");
  const [selZonas, setSelZonas] = useState<string[]>(ZONAS.map((z) => z.nombre));
  const [quick, setQuick]       = useState("");

  const rows = ZONAS.map((z) => ({
    id:z.id, nombre:z.nombre, p:0, l:0, w:0, total:0,
    venta:0, comisiones:0, premios:0, neto:0, caida:0, final:0, balance:0,
  })).filter((r) => selZonas.includes(r.nombre));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
        <h2 className="text-xl font-bold text-[#333] mb-4">Zonas</h2>
        <div className="flex flex-wrap items-end gap-3 mb-2">
          <DateInput label="Fecha" value={date} onChange={setDate} />
          <MultiSelect label="Zonas" options={ZONAS.map((z) => z.nombre)} selected={selZonas} onChange={setSelZonas} />
          <ActionBtn label="VER VENTAS" variant="primary" />
          <ActionBtn label="PDF" variant="secondary" />
        </div>
        <TotalBadge label="Total" amount={0} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#333] mb-2">Filtros</p>
        <FilterPills active={pill} onChange={setPill} />
      </div>
      <div className="flex justify-end"><QuickFilter value={quick} onChange={setQuick} /></div>
      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            {["Nombre","P","L","W","Total","Venta","Comisiones","Premios","Neto","Caida","Final","Balance"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={12} className="py-6 text-center text-[#999] text-sm">Sin zonas seleccionadas</td></tr>
            : rows.map((r, ri) => (
              <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                <td className="px-3 py-2">{r.nombre}</td>
                {[r.p,r.l,r.w].map((v,i) => <td key={i} className="px-3 py-2 text-center">{v}</td>)}
                <td className="px-3 py-2 text-right">{r.total}</td>
                {[r.venta,r.comisiones,r.premios].map((v,i) => <td key={i} className="px-3 py-2 text-right">{fmt(v)}</td>)}
                <td className="px-3 py-2 text-right">{netoCell(r.neto)}</td>
                <td className="px-3 py-2 text-right">{fmt(r.caida)}</td>
                <td className="px-3 py-2 text-right">{netoCell(r.final)}</td>
                <td className="px-3 py-2 text-right">{balanceCell(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- TAB CATEGORÍA DE PREMIOS -------------------------------------------------
function TabCategPremios({ tipo }: { tipo: "directo" | "pale" }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [quick, setQuick] = useState("");
  const rows = tipo === "directo"
    ? [{ id:"p1",premio:"80" },{ id:"p2",premio:"70" }]
    : [{ id:"q1",premio:"1700" },{ id:"q2",premio:"1500" }];
  const allRows = rows.map((r) => ({ ...r, p:0,l:0,w:0,total:0,venta:0,comisiones:0,premios:0,neto:0,final:0,balance:0 }));
  const filtered = useMemo(() => {
    const q = quick.toLowerCase();
    return q ? allRows.filter((r) => r.premio.includes(q)) : allRows;
  }, [quick]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4">
        <TotalBadge label="Total" amount={0} />
        <div className="flex flex-wrap items-end gap-3 mt-2">
          <DateInput label="Fecha" value={date} onChange={setDate} />
          <ActionBtn label="VER REPORTE" variant="primary" />
        </div>
      </div>
      <div className="flex justify-end"><QuickFilter value={quick} onChange={setQuick} /></div>
      <div className="overflow-x-auto rounded-xl border border-[#E5E5E0]">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F5F5F0] border-b border-[#E5E5E0]">
            {["Premio 1ra","P","L","W","Total","Venta","Comisiones","Premios","Neto","Final","Balance"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-[#555]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r, ri) => (
              <tr key={r.id} className={`border-b border-[#F5F5F0] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/30`}>
                <td className="px-3 py-2 flex items-center gap-1">{r.premio} <Search size={11} className="text-[#999] cursor-pointer" /></td>
                {[r.p,r.l,r.w].map((v,i) => <td key={i} className="px-3 py-2 text-center">{v}</td>)}
                <td className="px-3 py-2 text-right">{r.total}</td>
                {[r.venta,r.comisiones,r.premios].map((v,i) => <td key={i} className="px-3 py-2 text-right">{fmt(v)}</td>)}
                <td className="px-3 py-2 text-right">{netoCell(r.neto)}</td>
                <td className="px-3 py-2 text-right">{netoCell(r.final)}</td>
                <td className="px-3 py-2 text-right">{balanceCell(r.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="bg-[#F0F0EB] font-semibold border-t-2 border-[#E5E5E0]">
            <td className="px-3 py-2.5" colSpan={4}>Totales</td>
            <td className="px-3 py-2.5 text-right">0</td>
            {["$0.00","$0.00","$0.00"].map((v,i)=><td key={i} className="px-3 py-2.5 text-right">{v}</td>)}
            <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
            <td className="px-3 py-2.5 text-right text-[#999]">$0.00</td>
            <td className="px-3 py-2.5 text-right text-[#3B82F6]">$0.00</td>
          </tr></tfoot>
        </table>
      </div>
      <p className="text-xs text-[#999]">Mostrando {filtered.length} de {allRows.length} entradas</p>
    </div>
  );
}

// --- TABS BAR -----------------------------------------------------------------
const TABS = ["General","Banca por sorteo","Por sorteo","Combinaciones","Por zona","Categoría de Premios","Categoría de Premios para Pale"] as const;
type Tab = typeof TABS[number];

export default function VentasDelDia() {
  const [activeTab, setActiveTab] = useState<Tab>("General");

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b border-[#E5E5E0] mb-5" style={{ scrollbarWidth:"none" }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab===tab ? "text-[#14B8A6] border-[#14B8A6] bg-[#E0F7F5]/30" : "text-[#666] border-transparent hover:text-[#333] hover:border-[#CCC]"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
          {activeTab==="General"                        && <TabGeneral />}
          {activeTab==="Banca por sorteo"               && <TabBancaPorSorteo />}
          {activeTab==="Por sorteo"                     && <TabPorSorteo />}
          {activeTab==="Combinaciones"                  && <TabCombinaciones />}
          {activeTab==="Por zona"                       && <TabPorZona />}
          {activeTab==="Categoría de Premios"           && <TabCategPremios tipo="directo" />}
          {activeTab==="Categoría de Premios para Pale" && <TabCategPremios tipo="pale" />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
