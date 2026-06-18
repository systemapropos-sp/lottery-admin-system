import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const NMV_SORTEOS = [
  "ANGUILA 10AM","LA PRIMERA","LOTEDOM","LA SUERTE","KING LOTTERY AM","QUINIELA REAL",
  "ANGUILA 1PM","SUPER PALE REAL-GANA MAS","GANA MAS","SUPER PALE NY-GANA MAS",
  "FLORIDA AM","NEW YORK AM","ANGUILA 6PM","LA SUERTE 6:00PM","KING LOTTERY PM",
  "LOTEKA","LA PRIMERA 7PM","NACIONAL","QUINIELA PALE","SUPER PALE NACIONAL-QP",
  "SUPER PALE NY-NACIONAL","ANGUILA 9PM","FLORIDA PM","NEW YORK PM",
];
const DIAS = [
  {key:"monday",label:"LUNES"},{key:"tuesday",label:"MARTES"},{key:"wednesday",label:"MIÉRCOLES"},
  {key:"thursday",label:"JUEVES"},{key:"friday",label:"VIERNES"},{key:"saturday",label:"SÁBADO"},
  {key:"sunday",label:"DOMINGO"},
];
const TIPOS_LIMITE = ["General para grupo","General por banca","Por sorteo","Por zona"];

interface MontoState {
  directo:string; pale:string; tripleta:string; cash3Straight:string; cash3Box:string;
  play4Straight:string; play4Box:string; superPale:string; bolita1:string; bolita2:string;
  singulacion1:string; singulacion2:string; singulacion3:string; pick5Straight:string;
  pick5Box:string; cash3FrontStraight:string; cash3BackStraight:string;
  cash3FrontBox:string; cash3BackBox:string; pickTwoFront:string;
  pickTwoBack:string; pickTwoMiddle:string;
}
const MONTOS_FIELDS: {key:keyof MontoState;label:string}[] = [
  {key:"directo",label:"Directo"},{key:"pale",label:"Pale"},{key:"tripleta",label:"Tripleta"},
  {key:"cash3Straight",label:"Cash3 Straight"},{key:"cash3Box",label:"Cash3 Box"},
  {key:"play4Straight",label:"Play4 Straight"},{key:"play4Box",label:"Play4 Box"},
  {key:"superPale",label:"Super Pale"},{key:"bolita1",label:"Bolita 1"},
  {key:"bolita2",label:"Bolita 2"},{key:"singulacion1",label:"Singulación 1"},
  {key:"singulacion2",label:"Singulación 2"},{key:"singulacion3",label:"Singulación 3"},
  {key:"pick5Straight",label:"Pick5 Straight"},{key:"pick5Box",label:"Pick5 Box"},
  {key:"cash3FrontStraight",label:"Cash3 Front Straight"},{key:"cash3BackStraight",label:"Cash3 Back Straight"},
  {key:"cash3FrontBox",label:"Cash3 Front Box"},{key:"cash3BackBox",label:"Cash3 Back Box"},
  {key:"pickTwoFront",label:"Pick Two Front"},{key:"pickTwoBack",label:"Pick Two Back"},
  {key:"pickTwoMiddle",label:"Pick Two Middle"},
];
const initMontos: MontoState = Object.fromEntries(MONTOS_FIELDS.map(f=>[f.key,""])) as unknown as MontoState;

export default function CrearLimite() {
  const [tipoLimite,setTipoLimite] = useState("");
  const [fechaExpiracion,setFechaExpiracion] = useState("");
  const [selectedSorteos,setSelectedSorteos] = useState<Set<string>>(new Set());
  const [montos,setMontos] = useState<MontoState>(initMontos);
  const [selectedDias,setSelectedDias] = useState<Set<string>>(new Set());
  const [submitted,setSubmitted] = useState(false);

  function toggleSorteo(s:string){
    setSelectedSorteos(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n;});
  }
  function toggleDia(k:string){
    setSelectedDias(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});
  }
  function selectAllDias(){setSelectedDias(selectedDias.size===DIAS.length?new Set():new Set(DIAS.map(d=>d.key)));}
  function selectAllSorteos(){setSelectedSorteos(selectedSorteos.size===NMV_SORTEOS.length?new Set():new Set(NMV_SORTEOS));}

  function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setSubmitted(true);
    setTimeout(()=>{setSubmitted(false);setTipoLimite("");setFechaExpiracion("");setSelectedSorteos(new Set());setMontos(initMontos);setSelectedDias(new Set());},3000);
  }

  const inputCls="w-full px-2.5 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all font-mono";

  return (
    <div className="min-h-[100dvh] p-6">
      <PageHeader title="Crear límites" subtitle="Configurar un nuevo límite de apuestas"/>
      <AnimatePresence>
        {submitted&&(
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-500"/>
            <p className="text-sm font-semibold text-emerald-700">¡Límite creado exitosamente!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form onSubmit={handleSubmit} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT — Límites */}
        <div className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="text-xs font-bold tracking-[0.14em] text-[#333] uppercase pb-3 border-b border-[#F0F0EB]">LÍMITES</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Tipo de Límite</label>
              <select value={tipoLimite} onChange={e=>setTipoLimite(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all">
                <option value="">Seleccionar tipo</option>
                {TIPOS_LIMITE.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Fecha de expiración</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA] pointer-events-none"/>
                <input type="date" value={fechaExpiracion} onChange={e=>setFechaExpiracion(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all"/>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">Sorteos</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {NMV_SORTEOS.map(s=>{
                const active=selectedSorteos.has(s);
                return(
                  <button key={s} type="button" onClick={()=>toggleSorteo(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                      active?"bg-[#4ECDC4] border-[#4ECDC4] text-white shadow-sm"
                            :"bg-white border-[#D0D0CB] text-[#555] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={selectAllSorteos}
              className="px-4 py-1.5 rounded-full text-xs font-bold border border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-all">
              {selectedSorteos.size===NMV_SORTEOS.length?"DESELECCIONAR TODOS":"SELECCIONAR TODOS"}
            </button>
            {selectedSorteos.size>0&&<p className="text-xs text-[#4ECDC4] font-medium mt-2">{selectedSorteos.size} sorteo(s) seleccionado(s)</p>}
          </div>
        </div>

        {/* RIGHT — Monto + Días + Crear */}
        <div className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <h2 className="text-xs font-bold tracking-[0.14em] text-[#333] uppercase pb-3 border-b border-[#F0F0EB]">MONTO</h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {MONTOS_FIELDS.map(f=>(
              <div key={f.key}>
                <label className="block text-[10px] font-semibold text-[#666] mb-1 leading-tight">{f.label}</label>
                <input type="number" value={montos[f.key]}
                  onChange={e=>setMontos(m=>({...m,[f.key]:e.target.value}))}
                  placeholder="0" className={inputCls}/>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F0F0EB] pt-5">
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">Día de semana</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {DIAS.map(d=>{
                const active=selectedDias.has(d.key);
                return(
                  <button key={d.key} type="button" onClick={()=>toggleDia(d.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      active?"bg-[#4ECDC4] border-[#4ECDC4] text-white"
                            :"bg-white border-[#D0D0CB] text-[#555] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
                    }`}>
                    {d.label}
                  </button>
                );
              })}
              <button type="button" onClick={selectAllDias}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-all">
                SELECCIONAR TODOS
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit"
              className="px-8 py-3 text-sm font-bold text-white rounded-xl transition-all shadow-[0_2px_10px_rgba(78,205,196,0.35)] hover:shadow-[0_4px_16px_rgba(78,205,196,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              style={{background:"linear-gradient(135deg,#4ECDC4,#0EA5E9)"}}>
              CREAR
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
