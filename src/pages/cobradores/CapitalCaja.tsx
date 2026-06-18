// Módulo Capital/Caja — Admin entrega y recibe capital
// Futuro: conectar a cobrador.nmvapp.com via Supabase
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Banknote, ArrowDownCircle, ArrowUpCircle, 
  Plus, RefreshCw, Wallet, TrendingUp, TrendingDown,
  Clock, CheckCircle2, X, User
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType = "entrega" | "recibo";

interface Transaction {
  id: string;
  tipo: TxType;
  monto: number;
  cobrador: string;
  nota: string;
  fecha: Date;
}

// ─── Mock cobradores for selector ─────────────────────────────────────────────
const COBRADORES_LIST = [
  "Carlos Ramírez", "Luis Pérez", "Ana Martínez",
  "Roberto Díaz", "María García", "Juan López",
];

function fmtMoney(n: number) {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(n);
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("es-DO", { day: "numeric", month: "short" });
}

// ─── New Transaction Modal ────────────────────────────────────────────────────
function NuevaTxModal({
  defaultTipo, onSave, onClose,
}: {
  defaultTipo: TxType;
  onSave: (tx: Omit<Transaction, "id" | "fecha">) => void;
  onClose: () => void;
}) {
  const [tipo, setTipo] = useState<TxType>(defaultTipo);
  const [monto, setMonto] = useState("");
  const [cobrador, setCobrador] = useState(COBRADORES_LIST[0]);
  const [nota, setNota] = useState("");

  const valid = parseFloat(monto) > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`p-5 rounded-t-2xl flex items-center justify-between ${
          tipo === "entrega" ? "bg-gradient-to-r from-teal-500 to-cyan-500" : "bg-gradient-to-r from-orange-400 to-amber-400"
        }`}>
          <div className="flex items-center gap-3">
            {tipo === "entrega"
              ? <ArrowDownCircle size={22} className="text-white"/>
              : <ArrowUpCircle size={22} className="text-white"/>}
            <div>
              <h3 className="text-white font-bold text-lg">
                {tipo === "entrega" ? "Entregar Capital" : "Recibir Capital"}
              </h3>
              <p className="text-white/80 text-xs">Registrar movimiento de caja</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18}/>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Tipo switch */}
          <div className="grid grid-cols-2 gap-2">
            {(["entrega","recibo"] as TxType[]).map(t => (
              <button key={t} onClick={() => setTipo(t)}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  tipo === t
                    ? t === "entrega"
                      ? "bg-teal-500 border-teal-500 text-white"
                      : "bg-orange-400 border-orange-400 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
                {t === "entrega" ? "⬇ Entregar" : "⬆ Recibir"}
              </button>
            ))}
          </div>

          {/* Cobrador */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Cobrador
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              <select value={cobrador} onChange={e => setCobrador(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                {COBRADORES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Monto (RD$)
            </label>
            <div className="relative">
              <Banknote size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              <input type="number" min="1" step="any" value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-mono"/>
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nota (opcional)
            </label>
            <input type="text" value={nota} onChange={e => setNota(e.target.value)}
              placeholder="Descripción del movimiento..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"/>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
              Cancelar
            </button>
            <button
              disabled={!valid}
              onClick={() => { onSave({ tipo, monto: parseFloat(monto), cobrador, nota }); onClose(); }}
              className={`flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 ${
                tipo === "entrega" ? "bg-teal-500 hover:bg-teal-600" : "bg-orange-400 hover:bg-orange-500"
              }`}>
              <CheckCircle2 size={15}/> Registrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CapitalCaja() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id:"t1", tipo:"entrega", monto:15000, cobrador:"Carlos Ramírez", nota:"Capital inicial del día",     fecha: new Date(Date.now()-3*3600000) },
    { id:"t2", tipo:"recibo",  monto:8500,  cobrador:"Luis Pérez",     nota:"Cobro ruta norte",            fecha: new Date(Date.now()-2*3600000) },
    { id:"t3", tipo:"entrega", monto:5000,  cobrador:"Ana Martínez",   nota:"Adicional para zona sur",     fecha: new Date(Date.now()-1*3600000) },
    { id:"t4", tipo:"recibo",  monto:12000, cobrador:"Carlos Ramírez", nota:"Cierre parcial",              fecha: new Date(Date.now()-30*60000)  },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState<TxType>("entrega");

  const abrirModal = (t: TxType) => { setModalTipo(t); setShowModal(true); };

  const addTx = (tx: Omit<Transaction, "id" | "fecha">) => {
    setTransactions(prev => [{ ...tx, id: `t${Date.now()}`, fecha: new Date() }, ...prev]);
  };

  // ── Stats ──
  const totalEntregado = transactions.filter(t => t.tipo==="entrega").reduce((s,t) => s+t.monto, 0);
  const totalRecibido  = transactions.filter(t => t.tipo==="recibo" ).reduce((s,t) => s+t.monto, 0);
  const cajaActual     = totalEntregado - totalRecibido;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Capital / Caja"
        subtitle="Gestión de capital entregado y recibido por cobradores"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Caja Actual",      value: cajaActual,      icon: <Wallet size={20}/>,        color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-100" },
          { label: "Total Entregado",  value: totalEntregado,  icon: <TrendingDown size={20}/>,  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
          { label: "Total Recibido",   value: totalRecibido,   icon: <TrendingUp size={20}/>,    color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-5`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{fmtMoney(s.value)}</p>
            <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => abrirModal("entrega")}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all hover:scale-105 active:scale-100"
          style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>
          <ArrowDownCircle size={16}/> Entregar Capital
        </button>
        <button onClick={() => abrirModal("recibo")}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all hover:scale-105 active:scale-100"
          style={{ background: "linear-gradient(135deg,#F97316,#F59E0B)" }}>
          <ArrowUpCircle size={16}/> Recibir Capital
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Clock size={16} className="text-gray-400"/> Historial del Día
          </h3>
          <span className="text-xs text-gray-400">{transactions.length} movimientos</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-16 text-center">
            <Banknote size={36} className="mx-auto text-gray-200 mb-3"/>
            <p className="text-gray-400">Sin movimientos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {transactions.map((tx, i) => (
                <motion.div key={tx.id}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i*0.04, duration:0.2 }}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.tipo === "entrega" ? "bg-teal-50" : "bg-orange-50"
                  }`}>
                    {tx.tipo === "entrega"
                      ? <ArrowDownCircle size={18} className="text-teal-500"/>
                      : <ArrowUpCircle   size={18} className="text-orange-400"/>}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">{tx.cobrador}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tx.tipo === "entrega"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-orange-100 text-orange-600"
                      }`}>
                        {tx.tipo === "entrega" ? "Entrega" : "Recibo"}
                      </span>
                    </div>
                    {tx.nota && <p className="text-xs text-gray-400 mt-0.5 truncate">{tx.nota}</p>}
                  </div>
                  {/* Monto + fecha */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-black ${
                      tx.tipo === "entrega" ? "text-teal-600" : "text-orange-500"
                    }`}>
                      {tx.tipo === "entrega" ? "+" : "-"}{fmtMoney(tx.monto)}
                    </p>
                    <p className="text-xs text-gray-400">{fmtDate(tx.fecha)} {fmtTime(tx.fecha)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <NuevaTxModal
            defaultTipo={modalTipo}
            onSave={addTx}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
