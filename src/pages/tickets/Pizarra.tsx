// PIZARRA: Vista expandida de todos los números (00-99 en orden) + Pale + Tripleta
// Para monitorear qué números específicos se están jugando y cuánto
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Printer } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function today() { return new Date().toISOString().split("T")[0]; }

const SORTEOS_LIST = ["Anguila 10AM","GANA MAS","LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","QUINIELA REAL","LOTEKA","LA SUERTE","LOTEDOM","KING LOTTERY AM"];
const ZONAS_LIST   = ["Default","SFM"];

// Mock: 00-99 con montos reales del sorteo
const DIR_DATA = Array.from({ length: 100 }, (_, i) => {
  const m: Record<number,number> = {
    4:995,8:190,14:325,15:370,17:365,18:640,23:285,24:210,25:155,26:205,27:150,28:225,
    29:115,30:300,31:195,32:355,40:400,41:125,42:90,44:55,45:145,46:100,47:40,48:15,
    49:65,50:175,51:20,52:200,53:5,54:75,55:35,56:125,57:15,58:345,59:15,60:100,61:500,
    62:15,63:95,64:125,65:25,66:80,68:25,69:175,70:50,71:75,72:65,73:300,74:15,75:5,
    76:100,80:50,81:675,82:5,83:280,84:25,85:15,86:100,87:190,88:190,89:190,90:50,
    91:25,92:265,93:125,94:170,95:105,96:200,97:15,98:75,99:100,
    0:135,1:25,2:55,3:15,5:175,6:60,7:200,9:15,10:195,11:100,12:175,13:225,16:70,
    19:120,20:160,21:125,22:215,33:0,38:0,39:0,43:0,67:0,77:0,78:0
  };
  return { num: String(i).padStart(2,"0"), amt: m[i] ?? 0 };
});
const PALE_DATA = [
  {num:"19-79",amt:350},{num:"11-70",amt:200},{num:"14-23",amt:200},{num:"22-73",amt:200},
  {num:"04-40",amt:175},{num:"37-73",amt:135},{num:"00-87",amt:100},{num:"04-61",amt:100},
  {num:"07-27",amt:100},{num:"08-30",amt:100},{num:"10-27",amt:100},{num:"13-76",amt:100},
  {num:"18-40",amt:100},{num:"19-48",amt:100},{num:"19-56",amt:100},{num:"19-65",amt:100},
  {num:"19-83",amt:100},
];
const TRIP_DATA = [
  {num:"13-19-58",amt:50},{num:"19-56-83",amt:50},{num:"19-65-83",amt:50},
  {num:"30-69-76",amt:25},{num:"56-64-94",amt:20},{num:"03-34-37",amt:5},
  {num:"05-37-73",amt:5},{num:"28-58-94",amt:5},{num:"28-58-95",amt:5},{num:"37-42-79",amt:5},
];
const LIMIT = 500;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function Pizarra() {
  const [fecha, setFecha]   = useState(today());
  const [sorteo, setSorteo] = useState("Anguila 10AM");
  const [banca, setBanca]   = useState("");
  const [autoRef, setAutoRef] = useState(false);
  const [dirQ, setDirQ]  = useState("");
  const [paleQ, setPaleQ] = useState("");
  const [tripQ, setTripQ] = useState("");

  useEffect(() => {
    if (!autoRef) return;
    const id = setInterval(() => { /* TODO: fetch real data */ }, 30000);
    return () => clearInterval(id);
  }, [autoRef]);

  const filtDir  = useMemo(() => dirQ  ? DIR_DATA.filter(r => r.num.includes(dirQ))  : DIR_DATA,  [dirQ]);
  const filtPale = useMemo(() => paleQ ? PALE_DATA.filter(r => r.num.includes(paleQ)) : PALE_DATA, [paleQ]);
  const filtTrip = useMemo(() => tripQ ? TRIP_DATA.filter(r => r.num.includes(tripQ)) : TRIP_DATA, [tripQ]);

  const dirTotal  = DIR_DATA.reduce((s, r) => s + r.amt, 0);
  const paleTotal = PALE_DATA.reduce((s, r) => s + r.amt, 0);
  const tripTotal = TRIP_DATA.reduce((s, r) => s + r.amt, 0);
  const grand     = dirTotal + paleTotal + tripTotal;
  const dirPct    = grand ? ((dirTotal  / grand) * 100).toFixed(1) : "0";
  const palePct   = grand ? ((paleTotal / grand) * 100).toFixed(1) : "0";
  const tripPct   = grand ? ((tripTotal / grand) * 100).toFixed(1) : "0";

  const dirChunks = useMemo(() => chunk(filtDir, 17), [filtDir]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <PageHeader title="Pizarra" />

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
              <option>{ZONAS_LIST.length} seleccionadas</option>
              {ZONAS_LIST.map(z => <option key={z}>{z}</option>)}
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#666]">Auto refrescar</span>
          <button onClick={() => setAutoRef(v => !v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${autoRef ? "bg-[#4ECDC4]" : "bg-[#CCC]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoRef ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-center">
        <span className="text-xl font-bold text-[#333]">Total para sorteo {sorteo}: </span>
        <span className="text-2xl font-extrabold text-[#EF4444]">{fmt(grand)}</span>
      </div>

      {/* Columnar grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {/* Directo: all 00-99 in chunks of 17 */}
          {dirChunks.map((chunk, ci) => (
            <div key={ci} className="bg-white rounded-xl border border-[#E5E5E0] min-w-[130px] flex flex-col">
              <div className="px-3 pt-2.5">
                {ci === 0 && (
                  <input value={dirQ} onChange={e => setDirQ(e.target.value)} placeholder="##"
                    className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded-md font-mono focus:outline-none focus:border-[#4ECDC4] mb-1.5" />
                )}
                {ci > 0 && <div className="h-7 mb-1.5" />}
                <p className="text-sm font-bold text-[#333] text-center">Directo ({filtDir.length})</p>
                {ci === 0 && <p className="text-xs font-bold text-[#4ECDC4] text-center">{dirPct}%</p>}
                {ci === 0 && <p className="text-sm font-extrabold text-[#333] text-center mb-1">{fmt(dirTotal)}</p>}
                {ci > 0 && <div className="h-8" />}
                <div className="grid grid-cols-2 gap-x-1 border-t border-[#E5E5E0] pt-1 pb-0.5">
                  <span className="text-[11px] font-semibold text-[#4ECDC4]">Jugada</span>
                  <span className="text-[11px] font-semibold text-[#4ECDC4] text-right">Importe</span>
                </div>
              </div>
              <div className="border-t border-[#F0F0EB]">
                {chunk.map((r, i) => (
                  <div key={r.num} className={`grid grid-cols-2 gap-x-1 px-3 py-[3px] text-xs ${
                    r.amt >= LIMIT ? "bg-[#FFCCCC] font-bold text-[#CC0000]" :
                    r.amt === 0 ? "bg-[#F5F5F0] text-[#BBB]" :
                    i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                  }`}>
                    <span className="font-mono">{r.num}</span>
                    <span className="text-right">{r.amt || ""}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pale column */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] min-w-[130px] flex flex-col">
            <div className="px-3 pt-2.5">
              <input value={paleQ} onChange={e => setPaleQ(e.target.value)} placeholder="##-##"
                className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded-md font-mono focus:outline-none focus:border-[#4ECDC4] mb-1.5" />
              <p className="text-sm font-bold text-[#333] text-center">Pale ({filtPale.length})</p>
              <p className="text-xs font-bold text-[#4ECDC4] text-center">{palePct}%</p>
              <p className="text-sm font-extrabold text-[#333] text-center mb-1">{fmt(paleTotal)}</p>
              <div className="grid grid-cols-2 gap-x-1 border-t border-[#E5E5E0] pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-[#4ECDC4]">Jugada</span>
                <span className="text-[11px] font-semibold text-[#4ECDC4] text-right">Importe</span>
              </div>
            </div>
            <div className="border-t border-[#F0F0EB]">
              {filtPale.map((r, i) => (
                <div key={r.num} className={`grid grid-cols-2 gap-x-1 px-3 py-[3px] text-xs ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                }`}>
                  <span className="font-mono">{r.num}</span>
                  <span className="text-right">{r.amt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tripleta column */}
          <div className="bg-white rounded-xl border border-[#E5E5E0] min-w-[130px] flex flex-col">
            <div className="px-3 pt-2.5">
              <input value={tripQ} onChange={e => setTripQ(e.target.value)} placeholder="##-##-##"
                className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded-md font-mono focus:outline-none focus:border-[#4ECDC4] mb-1.5" />
              <p className="text-sm font-bold text-[#333] text-center">Tripleta ({filtTrip.length})</p>
              <p className="text-xs font-bold text-[#4ECDC4] text-center">{tripPct}%</p>
              <p className="text-sm font-extrabold text-[#333] text-center mb-1">{fmt(tripTotal)}</p>
              <div className="grid grid-cols-2 gap-x-1 border-t border-[#E5E5E0] pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-[#4ECDC4]">Jugada</span>
                <span className="text-[11px] font-semibold text-[#4ECDC4] text-right">Importe</span>
              </div>
            </div>
            <div className="border-t border-[#F0F0EB]">
              {filtTrip.map((r, i) => (
                <div key={r.num} className={`grid grid-cols-2 gap-x-1 px-3 py-[3px] text-xs ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                }`}>
                  <span className="font-mono">{r.num}</span>
                  <span className="text-right">{r.amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
