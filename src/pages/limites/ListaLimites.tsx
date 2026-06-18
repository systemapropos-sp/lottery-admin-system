import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCw, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────
const NMV_SORTEOS = [
  "LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","FLORIDA PM",
  "GANA MAS","NACIONAL","QUINIELA PALE","ANGUILA 10AM","ANGUILA 1PM",
  "ANGUILA 6PM","ANGUILA 9PM","KING LOTTERY AM","KING LOTTERY PM",
  "LOTEKA","LOTEDOM","LA SUERTE","QUINIELA REAL","SUPER PALE REAL-GANA MAS",
  "SUPER PALE NY-GANA MAS","LA PRIMERA 7PM","SUPER PALE NACIONAL-QP",
  "SUPER PALE NY-NACIONAL","LA SUERTE 6:00PM",
];
const NMV_BANCAS = Array.from({length:13},(_,i)=>`NMV RD ${String(i+1).padStart(2,"0")}`);
const NMV_ZONAS = ["Default","SFM"];
const TIPOS_LIMITE = ["General para grupo","General por banca","Por sorteo","Por zona"];
const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const JUGADAS_LISTA = [
  {key:"directo",       label:"Directo",             monto:11000},
  {key:"pale",          label:"Pale",                monto:1300 },
  {key:"tripleta",      label:"Tripleta",            monto:100  },
  {key:"cash3S",        label:"Cash3 Straight",      monto:5    },
  {key:"cash3B",        label:"Cash3 Box",           monto:5    },
  {key:"play4S",        label:"Play4 Straight",      monto:5    },
  {key:"play4B",        label:"Play4 Box",           monto:5    },
  {key:"bolita1",       label:"Bolita 1",            monto:5    },
  {key:"bolita2",       label:"Bolita 2",            monto:5    },
  {key:"sing1",         label:"Singulación 1",       monto:5    },
  {key:"sing2",         label:"Singulación 2",       monto:5    },
  {key:"sing3",         label:"Singulación 3",       monto:5    },
  {key:"pick5S",        label:"Pick5 Straight",      monto:5    },
  {key:"pick5B",        label:"Pick5 Box",           monto:5    },
  {key:"cash3FS",       label:"Cash3 Front Straight",monto:5    },
  {key:"cash3FB",       label:"Cash3 Front Box",     monto:5    },
  {key:"cash3BS",       label:"Cash3 Back Straight", monto:5    },
  {key:"cash3BB",       label:"Cash3 Back Box",      monto:5    },
  {key:"pickTwoF",      label:"Pick Two Front",      monto:5    },
  {key:"pickTwoB",      label:"Pick Two Back",       monto:5    },
  {key:"pickTwoM",      label:"Pick Two Middle",     monto:5    },
];

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────
const ZONE_TABS = ["General para grupo","General para zona"] as const;
type ZoneTab = (typeof ZONE_TABS)[number];

export default function ListaLimites() {
  const [tipoLimite, setTipoLimite] = useState("");
  const [sorteoFilter, setSorteoFilter] = useState("");
  const [diaFilter, setDiaFilter] = useState("");
  const [bancaFilter, setBancaFilter] = useState("");
  const [zonaFilter, setZonaFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeDay, setActiveDay] = useState("Lunes");
  const [activeZone, setActiveZone] = useState<ZoneTab>("General para grupo");
  const [activeSorteo, setActiveSorteo] = useState("LA PRIMERA");
  const [montos, setMontos] = useState<Record<string,string>>(
    () => Object.fromEntries(JUGADAS_LISTA.map(j=>[j.key, String(j.monto)]))
  );
  const sorteoRef = useRef<HTMLDivElement>(null);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }
  function scrollSorteos(dir: "left"|"right") {
    if(sorteoRef.current) sorteoRef.current.scrollBy({left: dir==="right"?120:-120, behavior:"smooth"});
  }

  const selectCls = "px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-xl bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all min-w-[145px]";

  return (
    <div className="min-h-[100dvh] p-6 space-y-5">
      <PageHeader title="Lista de límites" subtitle="Gestión de límites de apuestas configurados" />

      {/* Filters */}
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
        className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Tipo de Límite</label>
            <select value={tipoLimite} onChange={e=>setTipoLimite(e.target.value)} className={selectCls}>
              <option value="">Todos</option>
              {TIPOS_LIMITE.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Sorteos</label>
            <select value={sorteoFilter} onChange={e=>setSorteoFilter(e.target.value)} className={selectCls}>
              <option value="">Todos</option>
              {NMV_SORTEOS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Días</label>
            <select value={diaFilter} onChange={e=>setDiaFilter(e.target.value)} className={selectCls}>
              <option value="">Todos</option>
              {DIAS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Bancas</label>
            <select value={bancaFilter} onChange={e=>setBancaFilter(e.target.value)} className={selectCls}>
              <option value="">Todas</option>
              {NMV_BANCAS.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Zonas</label>
            <select value={zonaFilter} onChange={e=>setZonaFilter(e.target.value)} className={selectCls}>
              <option value="">Todas</option>
              {NMV_ZONAS.map(z=><option key={z}>{z}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
            <label className="text-[10px] font-semibold text-[#999] uppercase tracking-wider">Grupos</label>
            <select className={selectCls} defaultValue="">
              <option value="" disabled>Seleccione</option>
              <option>Grupo 1</option>
              <option>Grupo 2</option>
            </select>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:shadow-[0_4px_14px_rgba(78,205,196,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{background:"linear-gradient(135deg,#4ECDC4,#0EA5E9)"}}>
            <RotateCw size={14} className={refreshing?"animate-spin ":""}/>
            REFRESCAR
          </button>
        </div>
      </motion.div>

      {/* Main card */}
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25,delay:0.07}}
        className="bg-white rounded-2xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Day tabs */}
        <div className="flex items-center border-b border-[#F0F0EB] px-1 overflow-x-auto">
          {DIAS.map(dia=>(
            <button key={dia} onClick={()=>setActiveDay(dia)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeDay===dia
                  ?"border-[#4ECDC4] text-[#0F766E] bg-[#F0FBFA]"
                  :"border-transparent text-[#666] hover:text-[#333] hover:bg-[#FAFAF8]"
              }`}>
              {dia}
            </button>
          ))}
        </div>

        {/* Zone sub-tabs */}
        <div className="flex items-center border-b border-[#F0F0EB] bg-[#FAFAFA] px-5">
          {ZONE_TABS.map(zt=>(
            <button key={zt} onClick={()=>setActiveZone(zt)}
              className={`px-6 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeZone===zt
                  ?"border-[#4ECDC4] text-[#4ECDC4]"
                  :"border-transparent text-[#666] hover:text-[#333]"
              }`}>
              {zt}
            </button>
          ))}
        </div>

        {/* Sorteo tabs (scrollable) */}
        <div className="flex items-center border-b border-[#F0F0EB] relative">
          <button onClick={()=>scrollSorteos("left")}
            className="p-2 text-[#999] hover:text-[#4ECDC4] flex-shrink-0">
            <ChevronLeft size={16}/>
          </button>
          <div ref={sorteoRef} className="flex-1 flex items-center gap-1 overflow-x-auto scroll-smooth px-1 scrollbar-none" style={{scrollbarWidth:"none"}}>
            {NMV_SORTEOS.map(s=>(
              <button key={s} onClick={()=>setActiveSorteo(s)}
                className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-lg transition-all flex-shrink-0 ${
                  activeSorteo===s
                    ?"text-[#4ECDC4] bg-[#E0F7F5]"
                    :"text-[#666] hover:text-[#4ECDC4] hover:bg-[#F5FFFD]"
                }`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={()=>scrollSorteos("right")}
            className="p-2 text-[#999] hover:text-[#4ECDC4] flex-shrink-0">
            <ChevronRight size={16}/>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#F0F0EB]">
                <th className="text-left px-5 py-3 text-xs font-bold text-[#333] uppercase tracking-wide">Tipo de jugada</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#333] uppercase tracking-wide">Monto</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#333] uppercase tracking-wide">Fecha de expiración</th>
                <th className="px-4 py-3 w-12 text-center">
                  <span className="sr-only">Acciones</span>
                  <div className="w-5 h-5 rounded bg-[#E5E5E0] mx-auto"/>
                </th>
              </tr>
            </thead>
            <tbody>
              {JUGADAS_LISTA.map((j,ri)=>(
                <tr key={j.key} className={`border-b border-[#F7F7F5] ${ri%2===0?"bg-white":"bg-[#FAFAFA]"} hover:bg-[#F0FBF9] transition-colors group`}>
                  <td className="px-5 py-2.5">
                    <span className="text-sm font-medium text-[#333]">{j.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="number" value={montos[j.key]}
                      onChange={e=>setMontos(m=>({...m,[j.key]:e.target.value}))}
                      className="w-24 px-2.5 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all text-right font-mono"/>
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="date"
                      className="px-2.5 py-1.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/15 transition-all w-36"/>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto hover:bg-[#EF4444] hover:text-white transition-all">
                      <Trash2 size={13}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
