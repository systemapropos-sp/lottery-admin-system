import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ZONAS = [
  { zona: "Default", bancas: 19, tickets: 417, venta: 168880, comision1: 0, comision2: 0, premios: 157200, neto: 11680, final: 11680 },
  { zona: "SFM",     bancas:  3, tickets:  82, venta:  25540, comision1: 439.20, comision2: 0, premios: 11360, neto: 13740.80, final: 13740.80 },
];
const ZONAS_LIST = ["Default", "SFM"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function today() { return new Date().toISOString().split("T")[0]; }

// ─── MultiSelect ──────────────────────────────────────────────────────────────
function MultiSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  const txt = value.length === 0 || value.length === options.length ? `${options.length} seleccionadas` : `${value.length} seleccionadas`;
  return (
    <div className="relative">
      <label className="text-xs text-[#999] font-medium block mb-1">{label}</label>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white min-w-[160px] hover:border-[#4ECDC4] transition-colors">
        <span className="flex-1 text-left text-[#555]">{txt}</span>
        <ChevronDown size={14} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 bg-white border border-[#E5E5E0] rounded-xl shadow-lg min-w-[180px] p-2">
          {options.map(o => (
            <label key={o} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F0] cursor-pointer text-sm text-[#333]">
              <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} className="accent-[#4ECDC4]" />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VentasZonas() {
  const [fecha, setFecha] = useState(today());
  const [selZonas, setSelZonas] = useState<string[]>([]);
  const [rows, setRows] = useState(MOCK_ZONAS);

  const filtered = useMemo(() => {
    if (selZonas.length === 0) return rows;
    return rows.filter(r => selZonas.includes(r.zona));
  }, [rows, selZonas]);

  function handleSearch() { setRows([...MOCK_ZONAS]); }

  const tot = useMemo(() => ({
    bancas:    filtered.reduce((s, r) => s + r.bancas, 0),
    tickets:   filtered.reduce((s, r) => s + r.tickets, 0),
    venta:     filtered.reduce((s, r) => s + r.venta, 0),
    comision1: filtered.reduce((s, r) => s + r.comision1, 0),
    comision2: filtered.reduce((s, r) => s + r.comision2, 0),
    premios:   filtered.reduce((s, r) => s + r.premios, 0),
    neto:      filtered.reduce((s, r) => s + r.neto, 0),
    final:     filtered.reduce((s, r) => s + r.final, 0),
  }), [filtered]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <PageHeader title="Resumen de venta" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]" />
        </div>
        <MultiSelect label="Zona" options={ZONAS_LIST} value={selZonas} onChange={setSelZonas} />
        <button onClick={handleSearch}
          className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] transition-colors shadow-sm">
          <RefreshCw size={14} /> VER VENTAS
        </button>
      </div>

      {/* Summary table */}
      {filtered.map(r => (
        <motion.div key={r.zona} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[#E5E5E0] overflow-hidden shadow-sm">
          <div className="bg-[#F8F8F5] px-5 py-3 border-b border-[#E5E5E0]">
            <h3 className="text-base font-bold text-[#333]">Zona: <span className="text-[#4ECDC4]">{r.zona}</span></h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "Zona",       val: r.zona,              isText: true },
                { label: "Bancas",     val: r.bancas,            isText: true },
                { label: "Tickets",    val: r.tickets,           isText: true },
                { label: "Venta",      val: fmt(r.venta),        isText: true },
                { label: "Comision 1", val: fmt(r.comision1),    isText: true },
                { label: "Comision 2", val: fmt(r.comision2),    isText: true },
                { label: "Premios",    val: fmt(r.premios),      isText: true },
                { label: "Neto",       val: fmt(r.neto),         isBlue: true },
                { label: "Final",      val: fmt(r.final),        isBlue: true },
              ].map((item, i) => (
                <tr key={item.label} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                  <td className="px-5 py-3 font-semibold text-[#444] w-[200px] border-b border-[#F0F0EB]">{item.label}</td>
                  <td className={`px-5 py-3 border-b border-[#F0F0EB] font-medium ${item.isBlue ? "bg-sky-50 text-sky-700 font-bold" : "text-[#333]"}`}>
                    {String(item.val)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ))}

      {/* Totales when multiple zones */}
      {filtered.length > 1 && (
        <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap gap-6">
          {[
            { label: "Total Venta", val: fmt(tot.venta) },
            { label: "Total Premios", val: fmt(tot.premios) },
            { label: "Total Neto", val: fmt(tot.neto), blue: true },
          ].map(c => (
            <div key={c.label} className={`flex flex-col items-center px-6 py-3 rounded-xl ${c.blue ? "bg-sky-50" : "bg-[#F8F8F5]"}`}>
              <span className="text-xs text-[#999] font-medium uppercase tracking-wide">{c.label}</span>
              <span className={`text-lg font-bold mt-1 ${c.blue ? "text-sky-700" : "text-[#333]"}`}>{c.val}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
