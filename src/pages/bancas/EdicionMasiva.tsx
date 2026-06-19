import { useState } from "react";
import { motion } from "framer-motion";
import { Save, ChevronDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SORTEOS = ["LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","FLORIDA PM","GANA MAS","NACIONAL","QUINIELA PALE","QUINIELA REAL","LOTEKA","SUPER PALE REAL-GANA MAS","SUPER PALE NACIONAL-QP","SUPER PALE NY-GANA MAS","SUPER PALE NY-NACIONAL","LA SUERTE","LOTEDOM","KING LOTTERY AM","KING LOTTERY PM","ANGUILA 1PM","ANGUILA 6PM","ANGUILA 9PM","ANGUILA 10AM","LA PRIMERA 7PM","LA SUERTE 6:00PM","TODOS"];

const PRIZE_TYPES = [
  {t:"DIRECTO",       s:"Todos en secuencia", f:["","Segundo Pago","Tercer Pago","Dobles"]},
  {t:"PALE",          s:"Todos en secuencia", f:["Primer Pago","Segundo Pago","Tercer Pago"]},
  {t:"TRIPLETA",      s:"Primer Pago",        f:["Segundo Pago","Triples"]},
  {t:"CASH3 STRAIGHT",s:"Todos en secuencia", f:["Segundo Pago"]},
  {t:"CASH3 BOX",     s:"3-Way; 2 idénticos", f:["6-Way; 3 únicos"]},
  {t:"PLAY4 STRAIGHT",s:"Todos en secuencia", f:["Dobles"]},
  {t:"PLAY4 BOX",     s:"34-Way; 4 idénticos",f:["12-Way; 2 idénticos","6-Way; 2 idénticos","4-Way; 3 idénticos"]},
  {t:"SUPER PALE",    s:"Primer Pago",        f:[]},
  {t:"BOLITA 1",      s:"Primer Pago",        f:[]},
  {t:"BOLITA 2",      s:"Primer Pago",        f:[]},
  {t:"SINGULACIÓN 1", s:"Primer Pago",        f:[]},
  {t:"SINGULACIÓN 2", s:"Primer Pago",        f:[]},
  {t:"SINGULACIÓN 3", s:"Primer Pago",        f:[]},
  {t:"PICKS STRAIGHT",s:"5-Way; 4 idénticos", f:["Dobles"]},
  {t:"PICKS BOX",     s:"5-Way; 4 idénticos", f:["10-Way; 3 idénticos","20-Way; 3 idénticos","30-Way; 2 idénticos","40-Way; 1 idéntico","120-Way; 6 únicos"]},
  {t:"PICK TWO",      s:"Primer Pago",        f:["Dobles"]},
  {t:"CASH3 COMBO",   s:"Primer Pago",        f:["Segundo Pago","Tercer Pago"]},
  {t:"PLAY4 COMBO",   s:"Primer Pago",        f:["Segundo Pago","Tercer Pago","Aproximaciones"]},
  {t:"CASH3 FRONT STRAIGHT",s:"Todos en secuencia",f:["Triples"]},
  {t:"CASH3 FRONT BOX",s:"3-Way; 2 idénticos",f:["6-Way; 3 únicos"]},
  {t:"CASH3 BACK STRAIGHT",s:"Todos en secuencia",f:["Triples"]},
  {t:"CASH3 BACK BOX",s:"3-Way; 2 idénticos", f:["6-Way; 3 únicos"]},
  {t:"IMPAR",         s:"Acertado",           f:[]},
  {t:"PAR",           s:"Acertado",           f:[]},
  {t:"PRIMEROS 50",   s:"Acertado",           f:[]},
  {t:"ULTIMOS 50",    s:"Acertado",           f:[]},
  {t:"PICK TWO FRONT",s:"Primer Pago",        f:["Dobles"]},
  {t:"PICK TWO BACK", s:"Primer Pago",        f:["Dobles"]},
  {t:"LOTO POOL",     s:"Acertar 1 número",   f:["Acertar 2 números","Acertar 3 números","Acertar 4 números"]},
  {t:"LOTO FOUR 1",   s:"Todos en secuencia", f:[]},
  {t:"LOTO FOUR 2",   s:"Todos en secuencia", f:[]},
  {t:"LOTO FOUR 3",   s:"Todos en secuencia", f:[]},
  {t:"EXTRA FIVE 1",  s:"Todos en secuencia", f:[]},
  {t:"EXTRA FIVE 2",  s:"Todos en secuencia", f:[]},
  {t:"EXTRA FIVE 3",  s:"Todos en secuencia", f:[]},
  {t:"PICK TWO MIDDLE",s:"Primer Pago",       f:["Dobles"]},
  {t:"PICK ONE",      s:"Primer Pago",        f:[]},
  {t:"PANAMÁ",        s:"4 números primera ronda",f:["3 números primera ronda","3 números primera ronda","Último número primera ronda","4 números segunda ronda","3 números segunda ronda","Últimos 2 números segunda ronda","Último número segunda ronda"]},
  {t:"PANAMÁ 1 RONDA",s:"4 números primera ronda",f:["3 números primera ronda","2 números primera ronda","Último número primera ronda"]},
  {t:"PICK TWO",      s:"Primer Pago",        f:["Dobles"]},
  {t:"PEGA 3",        s:"Triples",            f:["3-Way; 2 idénticos en orden","3-Way; 2 idénticos","6-Way; 3 únicos en orden","6-Way; 3 únicos"]},
  {t:"DOBLES",        s:"Primer Pago",        f:[]},
];

const TABS = ["Configuración","Pies de página","Premios & Comisiones","Sorteos"] as const;
type Tab = typeof TABS[number];

// ─── Toggle group (ENCENDER / APAGAR / NO CAMBIAR) ───────────────────────────
type TVal = "on"|"off"|"nc";
function ToggleGroup({value,onChange}:{value:TVal;onChange:(v:TVal)=>void}){
  const btns:[TVal,string][] = [["on","ENCENDER"],["off","APAGAR"],["nc","NO CAMBIAR"]];
  return(
    <div className="flex rounded-lg overflow-hidden border border-[#E5E5E0]">
      {btns.map(([v,label])=>(
        <button key={v} onClick={()=>onChange(v)}
          className={`px-3 py-1.5 text-xs font-semibold flex-1 transition-colors ${value===v?"bg-[#4ECDC4] text-white":"bg-white text-[#555] hover:bg-[#F5F5F0]"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Two-button selector ───────────────────────────────────────────────────────
function TwoBtn({opts,value,onChange}:{opts:[string,string];value:string;onChange:(v:string)=>void}){
  return(
    <div className="flex rounded-lg overflow-hidden border border-[#E5E5E0]">
      {opts.map(o=>(
        <button key={o} onClick={()=>onChange(o)}
          className={`px-4 py-1.5 text-xs font-semibold flex-1 transition-colors ${value===o?"bg-[#4ECDC4] text-white":"bg-white text-[#555] hover:bg-[#F5F5F0]"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){
  return(
    <button onClick={onClick}
      className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${active?"bg-[#4ECDC4]/20 text-[#0D9488] border-[#4ECDC4]":"bg-white text-[#555] border-[#E5E5E0] hover:border-[#4ECDC4]"}`}>
      {label}
    </button>
  );
}

// ─── Shared footer ────────────────────────────────────────────────────────────
function SharedFooter({selSorteos,setSelSorteos,selBancas,setSelBancas,selZonas,setSelZonas,updGeneral,setUpdGeneral,bancas,zonas}:{
  selSorteos:Set<string>;setSelSorteos:(s:Set<string>)=>void;
  selBancas:Set<string>;setSelBancas:(s:Set<string>)=>void;
  selZonas:Set<string>;setSelZonas:(s:Set<string>)=>void;
  updGeneral:boolean;setUpdGeneral:(v:boolean)=>void;
  bancas:{id:string;ref:string;codigo:string}[];
  zonas:{id:string;nombre:string}[];
}){
  const toggleS=(v:string)=>{const n=new Set(selSorteos);n.has(v)?n.delete(v):n.add(v);setSelSorteos(n);};
  const toggleB=(v:string)=>{const n=new Set(selBancas);n.has(v)?n.delete(v):n.add(v);setSelBancas(n);};
  const toggleZ=(v:string)=>{const n=new Set(selZonas);n.has(v)?n.delete(v):n.add(v);setSelZonas(n);};
  return(
    <div className="mt-6 space-y-4 pt-6 border-t border-[#E5E5E0]">
      <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
        <span className="text-xs font-medium text-[#666] pt-1">Sorteos</span>
        <div className="flex flex-wrap gap-1.5">{SORTEOS.map(s=><Chip key={s} label={s} active={selSorteos.has(s)} onClick={()=>toggleS(s)}/>)}</div>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
        <span className="text-xs font-medium text-[#666] pt-1">Bancas</span>
        <div className="flex flex-wrap gap-1.5">{bancas.map(b=><Chip key={b.id} label={b.ref} active={selBancas.has(b.id)} onClick={()=>toggleB(b.id)}/>)}</div>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
        <span className="text-xs font-medium text-[#666] pt-1">Zonas</span>
        <div className="flex flex-wrap gap-1.5">{zonas.map(z=><Chip key={z.id} label={z.nombre} active={selZonas.has(z.id)} onClick={()=>toggleZ(z.id)}/>)}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#666]">Actualizar valores generales</span>
          <button onClick={()=>setUpdGeneral(!updGeneral)}
            className={`w-11 h-6 rounded-full relative transition-colors ${updGeneral?"bg-[#4ECDC4]":"bg-[#CCC]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${updGeneral?"translate-x-5":"translate-x-0.5"}`}/>
          </button>
        </div>
        <button className="flex items-center gap-2 px-8 py-2.5 bg-[#4ECDC4] text-white font-semibold text-sm rounded-full hover:bg-[#3DBDB5] shadow-sm transition-colors">
          <Save size={14}/> ACTUALIZAR
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Configuración ───────────────────────────────────────────────────────
function TabConfig({footer,zonas}:{footer:React.ReactNode;zonas:{id:string;nombre:string}[]}){
  const [zona,setZona]=useState("");
  const [idioma,setIdioma]=useState("ESPAÑOL");
  const [impresion,setImpresion]=useState("DRIVER");
  const [proveedor,setProveedor]=useState("GRUPO");
  const [toggles,setToggles]=useState<Record<string,TVal>>({
    copia:"nc",activa:"nc",tickets:"nc",premios:"nc",bote:"nc",contrasena:"nc"
  });
  const setT=(k:string)=>(v:TVal)=>setToggles(p=>({...p,[k]:v}));

  const rows: {label:string;key:string}[] = [
    {label:"Imprimir copia de ticket",key:"copia"},
    {label:"Activa",key:"activa"},
    {label:"Control de tickets ganadores",key:"tickets"},
    {label:"Usar premios normalizados",key:"premios"},
    {label:"Permitir pasar bote",key:"bote"},
  ];

  return(
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left */}
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Zona</label>
            <div className="relative">
              <select value={zona} onChange={e=>setZona(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4]">
                <option value="">—</option>
                {zonas.map(z=><option key={z.id} value={z.id}>{z.nombre}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"/>
            </div>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Balance de desactivacion</label>
            <input placeholder="Balance de desactivacion" className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Límite de venta diaria</label>
            <input placeholder="Límite de venta diaria" className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>
          {rows.map(r=>(
            <div key={r.key} className="grid grid-cols-[160px_1fr] gap-3 items-center">
              <label className="text-sm text-[#666]">{r.label}</label>
              <ToggleGroup value={toggles[r.key]} onChange={setT(r.key)}/>
            </div>
          ))}
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Minutos para cancelar tickets</label>
            <input className="w-32 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Tickets a cancelar por día</label>
            <input className="w-32 px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>
        </div>
        {/* Right */}
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Idioma</label>
            <TwoBtn opts={["ESPAÑOL","INGLÉS"]} value={idioma} onChange={setIdioma}/>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Modo de impresión</label>
            <TwoBtn opts={["DRIVER","GENÉRICO"]} value={impresion} onChange={setImpresion}/>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">Proveedor de descuento</label>
            <TwoBtn opts={["GRUPO","RIFERO"]} value={proveedor} onChange={setProveedor}/>
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-3 items-start">
            <label className="text-sm text-[#666] pt-1.5">Permitir cambiar contraseña</label>
            <div className="space-y-1">
              <TwoBtn opts={["ENCENDER","APAGAR"]} value={toggles.contrasena==="on"?"ENCENDER":"APAGAR"} onChange={v=>setT("contrasena")(v==="ENCENDER"?"on":"off")}/>
              <button onClick={()=>setT("contrasena")("nc")}
                className={`w-full px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${toggles.contrasena==="nc"?"bg-[#4ECDC4] text-white border-[#4ECDC4]":"bg-white text-[#555] border-[#E5E5E0] hover:bg-[#F5F5F0]"}`}>
                NO CAMBIAR
              </button>
            </div>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}

// ─── Tab: Pies de página ──────────────────────────────────────────────────────
function TabPies({footer}:{footer:React.ReactNode}){
  const [auto,setAuto]=useState<TVal>("nc");
  return(
    <div>
      <div className="space-y-4 max-w-lg mb-6">
        <div className="grid grid-cols-[180px_1fr] gap-3 items-center">
          <label className="text-sm text-[#666]">Pie de página automático</label>
          <ToggleGroup value={auto} onChange={setAuto}/>
        </div>
        {["Primer pie de pagina","Segundo pie de pagina","Tercer pie de pagina","Cuarto pie de pagina"].map(l=>(
          <div key={l} className="grid grid-cols-[180px_1fr] gap-3 items-center">
            <label className="text-sm text-[#666]">{l}</label>
            <input className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/>
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}

// ─── Tab: Premios & Comisiones ────────────────────────────────────────────────
function TabPremios({footer}:{footer:React.ReactNode}){
  const [sub,setSub]=useState<"Premios"|"Comisiones"|"Comisiones 2">("Premios");
  return(
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-5 border-b border-[#E5E5E0]">
        {(["Premios","Comisiones","Comisiones 2"] as const).map(s=>(
          <button key={s} onClick={()=>setSub(s)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${sub===s?"text-[#4ECDC4] border-[#4ECDC4]":"text-[#999] border-transparent hover:text-[#666]"}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {PRIZE_TYPES.map((p,i)=>(
          <div key={`${p.t}-${i}`} className="bg-[#F8F8F5] rounded-xl border border-[#E5E5E0] p-3">
            <p className="text-[11px] font-bold text-[#333] uppercase tracking-wide mb-0.5">{p.t}</p>
            <p className="text-[10px] text-[#999] mb-2">{p.s}</p>
            <input className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded bg-white focus:outline-none focus:border-[#4ECDC4] mb-1.5"/>
            {p.f.map((fl,j)=>(
              <div key={j} className="mb-1.5">
                {fl&&<label className="text-[10px] text-[#999] block">{fl}</label>}
                <input className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded bg-white focus:outline-none focus:border-[#4ECDC4]"/>
              </div>
            ))}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}

// ─── Tab: Sorteos ─────────────────────────────────────────────────────────────
function TabSorteos({footer}:{footer:React.ReactNode}){
  const [activos,setActivos]=useState<Set<string>>(new Set(SORTEOS.filter(s=>s!=="TODOS")));
  const [cierre,setCierre]=useState("");
  const toggle=(s:string)=>{const n=new Set(activos);n.has(s)?n.delete(s):n.add(s);setActivos(n);};
  return(
    <div>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-[160px_1fr] gap-3 items-start">
          <label className="text-sm text-[#666] pt-1">Sorteos activos</label>
          <div className="flex flex-wrap gap-1.5">
            {SORTEOS.filter(s=>s!=="TODOS").map(s=>(
              <Chip key={s} label={s} active={activos.has(s)} onClick={()=>toggle(s)}/>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[160px_1fr] gap-3 items-center">
          <label className="text-sm text-[#666]">Aplicar cierre anticipado a</label>
          <div className="relative w-56">
            <select value={cierre} onChange={e=>setCierre(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4]">
              <option value="">Seleccione</option>
              {SORTEOS.filter(s=>s!=="TODOS").map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"/>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EdicionMasiva(){
  const { bancas: bancasRaw, zonas: zonasRaw } = useBancasZonas();
  const bancas = bancasRaw.map(b => ({ id: b.id, ref: b.name, codigo: b.code }));
  const zonas  = zonasRaw.map(z => ({ id: z.id, nombre: z.nombre }));
  const [tab,setTab]=useState<Tab>("Configuración");
  const [selSorteos,setSelSorteos]=useState<Set<string>>(new Set(SORTEOS));
  const [selBancas,setSelBancas]=useState<Set<string>>(new Set());
  const [selZonas,setSelZonas]=useState<Set<string>>(new Set());
  const [updGeneral,setUpdGeneral]=useState(true);

  const footer=(
    <SharedFooter selSorteos={selSorteos} setSelSorteos={setSelSorteos}
      selBancas={selBancas} setSelBancas={setSelBancas}
      selZonas={selZonas} setSelZonas={setSelZonas}
      updGeneral={updGeneral} setUpdGeneral={setUpdGeneral}
      bancas={bancas} zonas={zonas}/>
  );

  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Actualizar banca"/>
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-6">
        {/* Tabs */}
        <div className="border-b border-[#E5E5E0] mb-6">
          <div className="flex gap-0">
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t?"text-[#4ECDC4] border-[#4ECDC4]":"text-[#999] border-transparent hover:text-[#666]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {tab==="Configuración"       && <TabConfig footer={footer} zonas={zonas}/>}
        {tab==="Pies de página"      && <TabPies footer={footer}/>}
        {tab==="Premios & Comisiones"&& <TabPremios footer={footer}/>}
        {tab==="Sorteos"             && <TabSorteos footer={footer}/>}
      </div>
    </motion.div>
  );
}
