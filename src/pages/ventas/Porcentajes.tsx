import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Search, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function pct(n: number) { return n === 0 ? "0" : n.toFixed(2); }
function today() { return new Date().toISOString().split("T")[0]; }

interface PorcentajeRow {
  banca: string; codigo: string; total: number;
  dirAmt: number; dirPct: number;
  paleAmt: number; palePct: number;
  c3sAmt: number; c3sPct: number;
  c3bAmt: number; c3bPct: number;
  p4sAmt: number; p4sPct: number;
  p4bAmt: number; p4bPct: number;
}

function MultiSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  const txt = value.length === 0 || value.length === options.length
    ? `${options.length} seleccionadas` : `${value.length} seleccionadas`;
  return (
    <div className="relative">
      <label className="text-xs text-[#999] font-medium block mb-1">{label}</label>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white min-w-[160px] hover:border-[#4ECDC4]">
        <span className="flex-1 text-left text-[#555]">{txt}</span>
        <ChevronDown size={13} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2 max-h-[220px] overflow-y-auto">
          {options.map(o => (
            <label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm">
              <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} className="accent-[#4ECDC4]" />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Porcentajes() {
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const ZONAS_LIST = zonasRaw.map(z => z.nombre);
  const MOCK: PorcentajeRow[] = bancasRaw.map(b => ({
    banca: b.name, codigo: b.code, total: 0,
    dirAmt: 0, dirPct: 0, paleAmt: 0, palePct: 0,
    c3sAmt: 0, c3sPct: 0, c3bAmt: 0, c3bPct: 0,
    p4sAmt: 0, p4sPct: 0, p4bAmt: 0, p4bPct: 0,
  }));

  const [fi, setFi] = useState(today());
  const [ff, setFf] = useState(today());
  const [selZonas, setSelZonas] = useState<string[]>(ZONAS_LIST);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [quick, setQuick] = useState("");

  const filtered = useMemo(() => {
    if (!quick) return MOCK;
    const q = quick.toLowerCase();
    return MOCK.filter(r => r.banca.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q));
  }, [quick, bancasRaw]);

  const paginated = useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page, perPage]);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <PageHeader title="Reporte de porcentaje de jugadas" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Fecha inicial</label>
          <input type="date" value={fi} onChange={e => setFi(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]" />
        </div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Fecha final</label>
          <input type="date" value={ff} onChange={e => setFf(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]" />
        </div>
        <MultiSelect label="Zonas" options={ZONAS_LIST} value={selZonas} onChange={setSelZonas} />
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13} /> REFRESCAR
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13} /> PDF
        </button>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#555]">Entradas por página</span>
          <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="px-2 py-1 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]">
            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input value={quick} onChange={e => { setQuick(e.target.value); setPage(1); }} placeholder="Filtrado rápido"
            className="pl-8 pr-8 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] w-48" />
          {quick && <button onClick={() => setQuick("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[#999]" /></button>}
        </div>
      </div>

      {/* Table with merged headers */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F8F5] border-b border-[#E5E5E0]">
              <th rowSpan={2} className="px-3 py-2 text-left font-semibold text-[#555] border-r border-[#E5E5E0]">Banca</th>
              <th rowSpan={2} className="px-3 py-2 text-left font-semibold text-[#555] border-r border-[#E5E5E0]">Código</th>
              <th rowSpan={2} className="px-3 py-2 text-right font-semibold text-[#555] border-r border-[#E5E5E0]">Total vendido</th>
              {["Directo", "Pale", "Cash3 S", "Cash3 B", "Play4 S", "Play4 B"].map(h => (
                <th key={h} colSpan={2} className="px-3 py-1.5 text-center font-semibold text-[#555] border-r border-[#E5E5E0] border-b border-[#E5E5E0]">{h}</th>
              ))}
            </tr>
            <tr className="bg-[#F0F0EB] border-b border-[#E5E5E0]">
              {["$", "%", "$", "%", "$", "%", "$", "%", "$", "%", "$", "%"].map((h, i) => (
                <th key={i} className={`px-2 py-1 text-center font-medium text-[#777] ${i % 2 === 1 ? "border-r border-[#E5E5E0]" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={15} className="py-8 text-center text-sm text-[#999]">Sin datos disponibles</td></tr>
            ) : paginated.map((r, i) => (
              <tr key={r.codigo} className={`border-b border-[#F0F0EB] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"} hover:bg-[#E0F7F5]/20`}>
                <td className="px-3 py-2 font-medium text-[#333] border-r border-[#F0F0EB]">{r.banca}</td>
                <td className="px-3 py-2 text-[#4ECDC4] font-medium border-r border-[#F0F0EB]">{r.codigo}</td>
                <td className="px-3 py-2 text-right border-r border-[#F0F0EB]">{fmt(r.total)}</td>
                {[
                  [r.dirAmt, r.dirPct], [r.paleAmt, r.palePct],
                  [r.c3sAmt, r.c3sPct], [r.c3bAmt, r.c3bPct],
                  [r.p4sAmt, r.p4sPct], [r.p4bAmt, r.p4bPct],
                ].map(([a, p], ci) => (
                  <>
                    <td key={`a${ci}`} className="px-2 py-2 text-right">{fmt(a as number)}</td>
                    <td key={`p${ci}`} className="px-2 py-2 text-right border-r border-[#F0F0EB]">{pct(p as number)}</td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#E5E5E0]">
          <span className="text-xs text-[#999]">
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length} entradas
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-2 py-1 text-xs border border-[#E5E5E0] rounded disabled:opacity-40">‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-2 py-1 text-xs border rounded ${p === page ? "bg-[#4ECDC4] text-white border-[#4ECDC4]" : "border-[#E5E5E0] hover:border-[#4ECDC4]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-2 py-1 text-xs border border-[#E5E5E0] rounded disabled:opacity-40">›</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
