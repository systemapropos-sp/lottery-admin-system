import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BellOff, Plus, Trash2, AlertTriangle, CheckCircle2,
  Hash, TrendingUp, Shield, X, Edit2, Save, Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NumeroLimite {
  id: string;
  numero: string;
  limite: number;
  actual: number;
  activo: boolean;
  notificar: boolean;
  color: string;
}

const PALETTE = [
  "#14B8A6","#0EA5E9","#8B5CF6","#F59E0B",
  "#EF4444","#22C55E","#EC4899","#F97316",
];

const MOCK: NumeroLimite[] = [
  { id:"1", numero:"47", limite:5000,  actual:3200,  activo:true,  notificar:true,  color:"#14B8A6" },
  { id:"2", numero:"18", limite:3000,  actual:2950,  activo:true,  notificar:true,  color:"#EF4444" },
  { id:"3", numero:"33", limite:8000,  actual:1100,  activo:true,  notificar:false, color:"#8B5CF6" },
  { id:"4", numero:"00", limite:10000, actual:10000, activo:true,  notificar:true,  color:"#F59E0B" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(n: NumeroLimite) { return Math.min(100, Math.round((n.actual / n.limite) * 100)); }

function statusLabel(p: number) {
  if (p >= 100) return { text: "LÍMITE",  cls: "bg-red-100 text-red-700 ring-1 ring-red-200" };
  if (p >= 80)  return { text: "ALERTA",  cls: "bg-amber-100 text-amber-700 ring-1 ring-amber-200" };
  return               { text: "Normal",  cls: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" };
}
function barColor(p: number) {
  if (p >= 100) return "#EF4444";
  if (p >= 80)  return "#F59E0B";
  return "#22C55E";
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LimitacionNumerosPage() {
  const [numeros, setNumeros] = useState<NumeroLimite[]>(MOCK);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  // Add form
  const [fNum,  setFNum]  = useState("");
  const [fLim,  setFLim]  = useState("");
  const [fColor,setFColor]= useState(PALETTE[0]);
  const [fNot,  setFNot]  = useState(true);

  const alertas = numeros.filter(n => n.notificar && pct(n) >= 80);

  function addNumero() {
    if (!fNum.trim() || !fLim) return;
    setNumeros(p => [...p, {
      id: Date.now().toString(),
      numero: fNum.padStart(2,"0"),
      limite: Number(fLim),
      actual: 0,
      activo: true,
      notificar: fNot,
      color: fColor,
    }]);
    setFNum(""); setFLim(""); setFColor(PALETTE[0]); setFNot(true);
    setShowAdd(false);
  }
  function saveEdit(id: string) {
    const v = Number(editVal);
    if (v > 0) setNumeros(p => p.map(n => n.id === id ? { ...n, limite: v } : n));
    setEditId(null);
    setEditVal("");
  }
  function toggleNotif(id: string)  { setNumeros(p => p.map(n => n.id === id ? { ...n, notificar: !n.notificar } : n)); }
  function toggleActivo(id: string) { setNumeros(p => p.map(n => n.id === id ? { ...n, activo: !n.activo } : n)); }
  function remove(id: string)       { setNumeros(p => p.filter(n => n.id !== id)); }

  const stats = [
    { label:"Total monitoreados",  value: numeros.length,                                          icon: Hash,          color:"teal"  },
    { label:"En límite (100%)",    value: numeros.filter(n=>pct(n)>=100).length,                   icon: AlertTriangle, color:"red"   },
    { label:"En alerta (≥80%)",    value: numeros.filter(n=>pct(n)>=80&&pct(n)<100).length,        icon: TrendingUp,    color:"amber" },
    { label:"Con notificación",    value: numeros.filter(n=>n.notificar).length,                    icon: Bell,          color:"blue"  },
  ];
  const colorMap:Record<string,string>={teal:"text-teal-600 bg-teal-50",red:"text-red-600 bg-red-50",amber:"text-amber-600 bg-amber-50",blue:"text-blue-600 bg-blue-50"};

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Limitación de Números</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Monitorea números con ventas cercanas al límite configurado
          </p>
        </div>
        <motion.button onClick={() => setShowAdd(true)}
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-[0_4px_14px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.45)] transition-all"
          style={{ background:"linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
          <Plus size={16} /> Agregar Número
        </motion.button>
      </div>

      {/* ── Alert banner ── */}
      <AnimatePresence>
        {alertas.length > 0 && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-[0_2px_8px_rgba(245,158,11,0.12)]">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">
                {alertas.length} número{alertas.length > 1 ? "s" : ""} cerca o en el límite
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {alertas.map(n => (
                  <span key={n.id}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pct(n) >= 100 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                    #{n.numero} — {pct(n)}% ({n.actual.toLocaleString()}/{n.limite.toLocaleString()})
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[s.color]}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#222]">{s.value}</p>
              <p className="text-[11px] text-[#888] leading-tight mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {numeros.map((n, i) => {
            const p = pct(n);
            const { text: statusText, cls: statusCls } = statusLabel(p);
            const isEditing = editId === n.id;
            const bar = barColor(p);

            return (
              <motion.div key={n.id}
                initial={{ opacity:0, y:16, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, scale:0.9 }}
                transition={{ delay: i * 0.05, duration:0.22 }}
                className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden border transition-all ${
                  !n.activo ? "opacity-50" : ""
                } ${p >= 100 ? "border-red-200 ring-2 ring-red-100" : p >= 80 ? "border-amber-200 ring-2 ring-amber-50" : "border-[#E5E5E0]"}`}
              >
                {/* Color band */}
                <div className="h-1.5 w-full" style={{ background: n.color }} />

                <div className="p-4 space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0"
                        style={{ backgroundColor: n.color }}>
                        {n.numero}
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AAA] font-semibold uppercase tracking-wider">Número</p>
                        <p className="text-base font-black text-[#222]">#{n.numero}</p>
                      </div>
                    </div>
                    {/* Action icons */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleNotif(n.id)}
                        title={n.notificar ? "Quitar notificación" : "Activar notificación"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          n.notificar ? "text-blue-500 bg-blue-50 hover:bg-blue-100" : "text-[#CCC] hover:bg-[#F5F5F5]"
                        }`}>
                        {n.notificar ? <Bell size={14} /> : <BellOff size={14} />}
                      </button>
                      <button onClick={() => toggleActivo(n.id)} title={n.activo ? "Pausar" : "Activar"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          n.activo ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100" : "text-[#CCC] hover:bg-[#F5F5F5]"
                        }`}>
                        <Activity size={14} />
                      </button>
                      <button onClick={() => remove(n.id)} title="Eliminar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] text-[#AAA] font-medium">Ventas acumuladas</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>
                        {p >= 100 ? "●" : p >= 80 ? "▲" : "✓"} {statusText}
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width:0 }}
                        animate={{ width: `${Math.min(100, p)}%` }}
                        transition={{ duration:1, ease:"easeOut", delay: i * 0.06 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: bar }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs font-bold text-[#333]">{n.actual.toLocaleString()}</span>
                      <span className="text-xs text-[#AAA]">/ {n.limite.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Edit / modify limit */}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => { if(e.key==="Enter") saveEdit(n.id); if(e.key==="Escape") setEditId(null); }}
                        autoFocus
                        placeholder={String(n.limite)}
                        className="flex-1 border border-[#4ECDC4] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20 text-right font-mono"
                      />
                      <button onClick={() => saveEdit(n.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#4ECDC4] text-white hover:bg-[#3DBDB5] transition-colors shadow-sm">
                        <Save size={14} />
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F5F5F5] text-[#999] hover:bg-[#EEE] transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(n.id); setEditVal(String(n.limite)); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-[#E0E0E0] text-[11px] text-[#AAA] hover:border-[#4ECDC4] hover:text-[#4ECDC4] hover:bg-[#F0FBFA] transition-all font-medium">
                      <Edit2 size={11} />
                      Modificar límite ({n.limite.toLocaleString()})
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add card placeholder */}
        <motion.button onClick={() => setShowAdd(true)}
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          className="bg-white rounded-2xl border-2 border-dashed border-[#E5E5E0] p-6 flex flex-col items-center justify-center gap-3 text-[#CCCCCC] hover:border-[#4ECDC4]/60 hover:text-[#4ECDC4] hover:bg-[#F8FFFE] transition-all min-h-[200px]">
          <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus size={22} />
          </div>
          <span className="text-sm font-semibold">Agregar número</span>
        </motion.button>
      </div>

      {/* ── Modal Agregar ── */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.96, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96, y:20 }}
              transition={{ duration:0.2, ease:"easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ background:"linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
                      <Hash size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#222]">Agregar Número</h2>
                      <p className="text-xs text-[#999]">Se notificará cuando alcance el límite</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAdd(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#999] hover:bg-[#F5F5F5] transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="px-6 py-5 space-y-5">
                  {/* Número */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">Número a monitorear</label>
                    <input type="text" maxLength={2} value={fNum}
                      onChange={e => setFNum(e.target.value.replace(/\D/g,""))}
                      placeholder="ej. 47"
                      className="w-full border-2 border-[#E5E5E0] rounded-2xl px-4 py-3 text-3xl font-black text-center tracking-widest text-[#14B8A6] focus:outline-none focus:border-[#4ECDC4] transition-colors"
                    />
                  </div>

                  {/* Límite */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">Límite máximo de ventas</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA] text-sm font-bold">$</span>
                      <input type="number" value={fLim} onChange={e => setFLim(e.target.value)}
                        placeholder="5,000"
                        className="w-full border-2 border-[#E5E5E0] rounded-2xl pl-8 pr-4 py-3 text-lg font-bold focus:outline-none focus:border-[#4ECDC4] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">Color identificador</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PALETTE.map(c => (
                        <button key={c} onClick={() => setFColor(c)}
                          className={`w-9 h-9 rounded-xl transition-all hover:scale-110 ${
                            fColor === c ? "ring-2 ring-offset-2 ring-[#333] scale-110" : ""
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Notificación toggle */}
                  <div className="flex items-center justify-between bg-[#F8F8F5] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Bell size={16} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-[#333]">Notificaciones</p>
                        <p className="text-xs text-[#999]">Alertar al llegar al límite</p>
                      </div>
                    </div>
                    <button onClick={() => setFNot(v => !v)}
                      className={`relative w-12 h-6.5 rounded-full transition-colors ${fNot ? "bg-[#4ECDC4]" : "bg-[#D5D5D0]"}`}
                      style={{height:"26px",width:"48px"}}>
                      <motion.span
                        animate={{ x: fNot ? 22 : 2 }}
                        transition={{ type:"spring", stiffness:500, damping:30 }}
                        className="absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                        style={{width:"18px",height:"18px"}}
                      />
                    </button>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0F0EB] bg-[#FAFAFA]">
                  <button onClick={() => setShowAdd(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#666] border border-[#E5E5E0] hover:bg-[#F5F5F5] transition-colors">
                    Cancelar
                  </button>
                  <button onClick={addNumero} disabled={!fNum || !fLim}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_8px_rgba(78,205,196,0.35)]"
                    style={{ background:"linear-gradient(135deg,#4ECDC4,#0EA5E9)" }}>
                    <CheckCircle2 size={15} />
                    Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
