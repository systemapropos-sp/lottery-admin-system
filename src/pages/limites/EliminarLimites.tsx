import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const NMV_SORTEOS = [
  "ANGUILA 10AM","LA PRIMERA","LOTEDOM","LA SUERTE","KING LOTTERY AM","QUINIELA REAL",
  "ANGUILA 1PM","SUPER PALE REAL-GANA MAS","GANA MAS","SUPER PALE NY-GANA MAS",
  "FLORIDA AM","NEW YORK AM","ANGUILA 6PM","LA SUERTE 6:00PM","KING LOTTERY PM",
  "LOTEKA","LA PRIMERA 7PM","NACIONAL","QUINIELA PALE","SUPER PALE NACIONAL-QP",
  "SUPER PALE NY-NACIONAL","ANGUILA 9PM","FLORIDA PM","NEW YORK PM",
];
const TIPOS_LIMITE = ["General para grupo","General por banca","Por sorteo","Por zona"];
const LOTERIAS = ["NMV RD","King Lottery","Anguila","Florida","New York","Quiniela Pale","Leidsa","Nacional"];
const JUGADAS = [
  "DIRECTO","PALE","TRIPLETA","CASH3 STRAIGHT","CASH3 BOX",
  "PLAY4 STRAIGHT","PLAY4 BOX","SUPER PALE","BOLITA 1","BOLITA 2",
  "SINGULACIÓN 1","SINGULACIÓN 2","SINGULACIÓN 3",
  "PICK5 STRAIGHT","PICK5 BOX",
  "CASH3 FRONT STRAIGHT","CASH3 FRONT BOX",
  "CASH3 BACK STRAIGHT","CASH3 BACK BOX",
  "PICK TWO FRONT","PICK TWO BACK","PICK TWO MIDDLE",
];
const DIAS = ["LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO","DOMINGO"];

export default function EliminarLimites() {
  const [tipoLimite,setTipoLimite] = useState("General para grupo");
  const [loteria,setLoteria] = useState("");
  const [selectedJugadas,setSelectedJugadas] = useState<Set<string>>(new Set());
  const [selectedSorteos,setSelectedSorteos] = useState<Set<string>>(new Set());
  const [selectedDias,setSelectedDias] = useState<Set<string>>(new Set());
  const [showConfirm,setShowConfirm] = useState(false);

  const toggleJugada=(j:string)=>setSelectedJugadas(p=>{const n=new Set(p);n.has(j)?n.delete(j):n.add(j);return n;});
  const toggleSorteo=(s:string)=>setSelectedSorteos(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n;});
  const toggleDia=(d:string)=>setSelectedDias(p=>{const n=new Set(p);n.has(d)?n.delete(d):n.add(d);return n;});
  const selectTodosJugadas=()=>setSelectedJugadas(selectedJugadas.size===JUGADAS.length?new Set():new Set(JUGADAS));
  const selectTodosSorteos=()=>setSelectedSorteos(selectedSorteos.size===NMV_SORTEOS.length?new Set():new Set(NMV_SORTEOS));
  const selectTodosDias=()=>setSelectedDias(new Set(DIAS));

  const canEliminar=selectedJugadas.size>0&&selectedDias.size>0;

  const chipCls=(active:boolean)=>`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
    active?"bg-[#4ECDC4] border-[#4ECDC4] text-white shadow-sm"
          :"bg-white border-[#D0D0CB] text-[#555] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
  }`;
  const dayCls=(active:boolean)=>`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
    active?"bg-[#4ECDC4] border-[#4ECDC4] text-white shadow-sm"
          :"bg-white border-[#D0D0CB] text-[#555] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
  }`;

  return (
    <div className="min-h-[100dvh] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Eliminar límites en lote</h1>
        <p className="text-sm text-[#666666] mt-0.5">Elimina límites masivamente por tipo, jugada y día de semana</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT */}
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22}}
          className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="text-xs font-bold tracking-[0.14em] text-[#333] uppercase pb-3 border-b border-[#F0F0EB]">LÍMITES</h2>

          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Tipo de Límite</label>
            <select value={tipoLimite} onChange={e=>setTipoLimite(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all">
              {TIPOS_LIMITE.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Eliminar todos los números con jugadas</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {JUGADAS.map(j=>(
                <button key={j} type="button" onClick={()=>toggleJugada(j)} className={chipCls(selectedJugadas.has(j))}>{j}</button>
              ))}
            </div>
            <button type="button" onClick={selectTodosJugadas}
              className="px-4 py-1.5 rounded-full text-xs font-bold border border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-all">
              {selectedJugadas.size===JUGADAS.length?"DESELECCIONAR TODOS":"SELECCIONAR TODOS"}
            </button>
            {selectedJugadas.size>0&&<p className="text-xs text-[#4ECDC4] font-medium mt-2">{selectedJugadas.size} jugada(s) seleccionada(s)</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Loterias</label>
            <select value={loteria} onChange={e=>setLoteria(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all">
              <option value="">Seleccione</option>
              {LOTERIAS.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Sorteos</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {NMV_SORTEOS.map(s=>(
                <button key={s} type="button" onClick={()=>toggleSorteo(s)} className={chipCls(selectedSorteos.has(s))}>{s}</button>
              ))}
            </div>
            <button type="button" onClick={selectTodosSorteos}
              className="px-4 py-1.5 rounded-full text-xs font-bold border border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-all">
              {selectedSorteos.size===NMV_SORTEOS.length?"DESELECCIONAR TODOS":"SELECCIONAR TODOS"}
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22,delay:0.06}}
          className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="text-xs font-bold tracking-[0.14em] text-[#333] uppercase pb-3 border-b border-[#F0F0EB]">DÍA DE SEMANA</h2>

          <div className="flex flex-wrap gap-2">
            {DIAS.map(d=>(
              <button key={d} type="button" onClick={()=>toggleDia(d)} className={dayCls(selectedDias.has(d))}>{d}</button>
            ))}
          </div>

          <button type="button" onClick={selectTodosDias}
            className="w-full py-2.5 rounded-full border border-[#4ECDC4] text-[#4ECDC4] text-sm font-bold hover:bg-[#4ECDC4] hover:text-white transition-all">
            SELECCIONAR TODOS
          </button>

          <button type="button" onClick={()=>canEliminar&&setShowConfirm(true)}
            disabled={!canEliminar}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              canEliminar
                ?"bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:scale-[1.01]"
                :"bg-[#F0F0EB] text-[#AAAAAA] cursor-not-allowed"
            }`}>
            <Trash2 size={16}/>ELIMINAR
          </button>
          {!canEliminar&&<p className="text-xs text-[#999] text-center -mt-2">Selecciona al menos una jugada y un día</p>}
        </motion.div>
      </div>

      {/* Confirm Modal */}
      {showConfirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-500"/>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#333]">Confirmar eliminación</h3>
                <p className="text-xs text-[#666]">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-sm text-[#555] mb-5">
              Se eliminarán los límites de <strong>{selectedJugadas.size} jugada(s)</strong> para{" "}
              <strong>{selectedDias.size} día(s)</strong> con tipo <strong>{tipoLimite}</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={()=>setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E5E0] text-[#555] text-sm font-medium hover:bg-[#F8F8F5] transition-colors">
                Cancelar
              </button>
              <button onClick={()=>{setShowConfirm(false);setSelectedJugadas(new Set());setSelectedDias(new Set());}}
                className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-white text-sm font-bold hover:bg-[#DC2626] transition-colors">
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
