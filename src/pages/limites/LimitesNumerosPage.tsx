import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Save, Trash2, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const NMV_SORTEOS_OPTS = [
  "Todos","LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","FLORIDA PM",
  "GANA MAS","NACIONAL","ANGUILA 10AM","KING LOTTERY AM","KING LOTTERY PM",
];

// Row type for the Límites tab table
interface LimiteCaliente {
  id: string;
  sorteo: string;
  directo: string;
  pale1: string;
  pale2: string;
  tripleta1: string;
  tripleta2: string;
  tripleta3: string;
}

const TABS = ["Números calientes","Límites"] as const;
type Tab = (typeof TABS)[number];

// ── Números calientes tab ──────────────────────────────────────────────────────
function NumerosCalientesTab() {
  const nums = Array.from({length:100},(_,i)=>String(i).padStart(2,"0"));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const toggle = (n: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const handleSave = () => {
    // TODO: persist to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#666]">
          Selecciona los números calientes —{" "}
          <span className="font-bold text-orange-500">{selected.size} seleccionados</span>
        </p>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-xs text-[#999] border border-[#E5E5E0] rounded-lg hover:bg-[#F5F5F0]">
              Limpiar
            </button>
          )}
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all ${
              saved ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"
            }`}>
            {saved ? <><CheckCircle2 size={13}/> Guardado!</> : <><Save size={13}/> Guardar</>}
          </button>
        </div>
      </div>
      <div className="grid gap-2" style={{gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))"}}>
        {nums.map(n => {
          const active = selected.has(n);
          return (
            <motion.button key={n} onClick={() => toggle(n)}
              whileHover={{scale:1.06}} whileTap={{scale:0.95}}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl border-2 transition-all font-black text-sm ${
                active
                  ? "bg-orange-500 border-orange-500 text-white shadow-md"
                  : "border-[#4ECDC4]/60 bg-white text-[#14B8A6] hover:border-orange-400 hover:bg-orange-50"
              }`}>
              <span>{n}</span>
              <Flame size={13} className={active ? "text-white" : "text-[#4ECDC4] opacity-60"}/>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Límites tab ────────────────────────────────────────────────────────────────
function LimitesTab() {
  const [rows,setRows] = useState<LimiteCaliente[]>([]);
  const [sorteo,setSorteo] = useState("Todos");
  const [form,setForm] = useState({directo:"",pale1:"",pale2:"",tripleta1:"",tripleta2:"",tripleta3:""});

  function handleGuardar(){
    if(!sorteo) return;
    const newRow:LimiteCaliente={id:Date.now().toString(),sorteo,...form};
    setRows(p=>[...p,newRow]);
    setForm({directo:"",pale1:"",pale2:"",tripleta1:"",tripleta2:"",tripleta3:""});
  }
  function deleteRow(id:string){setRows(p=>p.filter(r=>r.id!==id));}

  const inputCls="w-full px-2.5 py-2 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all font-mono placeholder:text-[#DDD]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#F0F0EB]">
      {/* Left: table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAFAF8] border-b border-[#F0F0EB]">
              {["Sorteos","Directo","Pale 1 caliente","Pale 2 caliente","Tripleta 1 caliente","Tripleta 2 caliente","Tripleta 3 caliente","Acciones"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#4ECDC4] uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.length===0?(
                <tr>
                  <td colSpan={8} className="text-center py-16 text-sm text-[#AAA]">
                    No hay información disponible
                  </td>
                </tr>
              ):rows.map(r=>(
                <motion.tr key={r.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="border-b border-[#F7F7F5] hover:bg-[#F0FBF9] transition-colors group">
                  <td className="px-4 py-2.5 font-semibold text-[#333]">{r.sorteo}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.directo||"—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.pale1||"—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.pale2||"—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.tripleta1||"—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.tripleta2||"—"}</td>
                  <td className="px-4 py-2.5 font-mono text-[#555]">{r.tripleta3||"—"}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={()=>deleteRow(r.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center hover:bg-[#EF4444] hover:text-white transition-all">
                      <Trash2 size={13}/>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Right: form */}
      <div className="p-5 space-y-4 min-w-[280px]">
        <h3 className="text-sm font-bold text-[#333]">Límite para número caliente</h3>

        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">Sorteos</label>
          <select value={sorteo} onChange={e=>setSorteo(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all">
            {NMV_SORTEOS_OPTS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        {(["directo","pale1","pale2","tripleta1","tripleta2","tripleta3"] as const).map(k=>{
          const labels:Record<string,string>={directo:"Directo",pale1:"Pale 1 caliente",pale2:"Pale 2 caliente",tripleta1:"Tripleta 1 caliente",tripleta2:"Tripleta 2 caliente",tripleta3:"Tripleta 3 caliente"};
          return(
            <div key={k}>
              <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5">{labels[k]}</label>
              <input type="number" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                placeholder="0" className={inputCls}/>
            </div>
          );
        })}

        <button onClick={handleGuardar}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_14px_rgba(78,205,196,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          style={{background:"linear-gradient(135deg,#4ECDC4,#0EA5E9)"}}>
          <Save size={15}/>GUARDAR
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function LimitesNumerosPage() {
  const [activeTab,setActiveTab] = useState<Tab>("Números calientes");

  return (
    <div className="min-h-[100dvh] p-6 space-y-5">
      <PageHeader title="Límites de Números" subtitle="Números calientes y límites por número caliente"/>

      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
        className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-[#F0F0EB]">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              className={`px-6 py-3.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab===t
                  ?"border-[#4ECDC4] text-[#0F766E] bg-[#F0FBFA]"
                  :"border-transparent text-[#666] hover:text-[#333] hover:bg-[#FAFAF8]"
              }`}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.18}}>
            {activeTab==="Números calientes"?<NumerosCalientesTab/>:<LimitesTab/>}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
