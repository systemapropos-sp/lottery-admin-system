// JUGADAS: Vista compacta — 3 columnas (Directo, Pale, Tripleta) ordenadas por importe desc
// Para identificar rápidamente los números con mayor exposición
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Printer } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function today() { return new Date().toISOString().split("T")[0]; }

const SORTEOS_LIST = ["Anguila 10AM","GANA MAS","LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","QUINIELA REAL","LOTEKA","LA SUERTE","LOTEDOM","KING LOTTERY AM"];

const DIR_RAW:  { num: string; amt: number }[] = [];
const PALE_RAW: { num: string; amt: number }[] = [];
const TRIP_RAW: { num: string; amt: number }[] = [];

export default function Jugadas() {
  const { zonas } = useBancasZonas();
  const [fecha, setFecha]   = useState(today());
  const [sorteo, setSorteo] = useState("Anguila 10AM");
  const [banca, setBanca]   = useState("");
  const [dirQ, setDirQ]     = useState("");
  const [paleQ, setPaleQ]   = useState("");
  const [tripQ, setTripQ]   = useState("");

  const filtDir  = useMemo(() => dirQ  ? DIR_RAW.filter(r  => r.num.includes(dirQ))   : DIR_RAW,  [dirQ]);
  const filtPale = useMemo(() => paleQ ? PALE_RAW.filter(r => r.num.includes(paleQ))  : PALE_RAW, [paleQ]);
  const filtTrip = useMemo(() => tripQ ? TRIP_RAW.filter(r => r.num.includes(tripQ))  : TRIP_RAW, [tripQ]);

  const dirTotal  = DIR_RAW.reduce((s, r) => s + r.amt, 0);
  const paleTotal = PALE_RAW.reduce((s, r) => s + r.amt, 0);
  const tripTotal = TRIP_RAW.reduce((s, r) => s + r.amt, 0);
  const grand     = dirTotal + paleTotal + tripTotal;
  const dirPct    = grand ? ((dirTotal  / grand) * 100).toFixed(1) : "0";
  const palePct   = grand ? ((paleTotal / grand) * 100).toFixed(1) : "0";
  const tripPct   = grand ? ((tripTotal / grand) * 100).toFixed(1) : "0";

  function Col({ title, icon, count, total, pct, items, q, setQ }: {
    title: string; icon: string; count: number; total: number; pct: string;
    items: { num: string; amt: number }[]; q: string; setQ: (v: string) => void;
  }) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E5E0] flex-1 min-w-[200px] max-w-[300px] flex flex-col shadow-sm">
        <div className="px-4 pt-4 pb-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={icon}
            className="w-full px-3 py-1.5 text-xs border border-[#E5E5E0] rounded-lg font-mono focus:outline-none focus:border-[#4ECDC4] mb-2" />
          <div className="text-center mb-1">
            <p className="text-base font-bold text-[#333]">{title}</p>
            <p className="text-2xl font-black text-[#4ECDC4]">{pct}%</p>
            <p className="text-lg font-extrabold text-[#333]">{fmt(total)}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-2 border-t border-[#E5E5E0] pt-2 pb-1">
            <span className="text-[11px] font-bold text-[#4ECDC4]">Jugada ({count})</span>
            <span className="text-[11px] font-bold text-[#4ECDC4] text-right">Importe</span>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[400px] border-t border-[#F0F0EB]">
          {items.map((r, i) => (
            <div key={r.num} className={`grid grid-cols-2 gap-x-2 px-4 py-1.5 text-sm ${
              i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
            } ${i === 0 ? "font-bold text-[#333]" : "text-[#555]"}`}>
              <span className="font-mono">{r.num}</span>
              <span className="text-right">{fmt(r.amt)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <PageHeader title="Jugadas" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]" />
        </div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Sorteos</label>
          <div className="relative">
            <select value={sorteo} onChange={e => setSorteo(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4] pr-8">
              {SORTEOS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Zonas</label>
          <div className="relative">
            <select className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4] pr-8 min-w-[160px]">
              <option>{zonas.length} seleccionadas</option>
              {zonas.map(z => <option key={z.id} value={z.nombre}>{z.nombre}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Banca</label>
          <input value={banca} onChange={e => setBanca(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] w-36" />
        </div>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13} /> REFRESCAR
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13} /> PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white text-sm font-semibold rounded-full hover:bg-[#4F46E5] shadow-sm">
          <Printer size={13} /> IMPRIMIR
        </button>
      </div>

      {/* Total badge */}
      <div className="text-center">
        <span className="text-xl font-bold text-[#333]">Total para sorteo {sorteo}: </span>
        <span className="text-2xl font-extrabold text-[#EF4444]">{fmt(grand)}</span>
      </div>

      {/* 3-column layout */}
      <div className="flex gap-4 items-start">
        <Col title="Directo"  icon="##"       count={filtDir.length}  total={dirTotal}  pct={dirPct}  items={filtDir}  q={dirQ}  setQ={setDirQ}  />
        <Col title="Pale"     icon="##-##"    count={filtPale.length} total={paleTotal} pct={palePct} items={filtPale} q={paleQ} setQ={setPaleQ} />
        <Col title="Tripleta" icon="##-##-##" count={filtTrip.length} total={tripTotal} pct={tripPct} items={filtTrip} q={tripQ} setQ={setTripQ} />
      </div>
    </motion.div>
  );
}
