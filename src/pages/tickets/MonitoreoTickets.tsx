import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, FileText, Printer } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

function fmt(n:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);}
function today(){return new Date().toISOString().split("T")[0];}

const SORTEOS_LIST=["Anguila 10AM","GANA MAS","LA PRIMERA","NEW YORK AM","FLORIDA AM","QUINIELA REAL","LOTEKA","LA SUERTE"];
const ZONAS_LIST=["Default","SFM"];

// Mock directo: 00-99 with amounts (some red = over limit, some 0 = grey)
const DIRECTO_DATA=Array.from({length:100},(_,i)=>{
  const table:{[k:number]:number}={4:995,8:190,14:325,15:370,17:365,18:640,23:285,24:210,
    25:155,26:205,27:150,28:225,29:115,30:300,31:195,32:355,40:400,41:125,42:90,44:55,
    45:145,46:100,47:40,48:15,49:65,50:175,51:20,52:200,53:5,54:75,55:35,56:125,57:15,
    58:345,59:15,60:100,61:500,62:15,63:95,64:125,65:25,66:80,68:25,69:175,70:50,71:75,
    72:65,73:300,74:15,75:5,76:100,80:50,81:675,82:5,83:280,84:25,85:15,86:100,87:190,
    88:190,89:190,90:50,91:25,92:265,93:125,94:170,95:105,96:200,97:15,98:75,99:100,
    0:135,1:25,2:55,3:15,5:175,6:60,7:200,9:15,10:195,11:100,12:175,13:225,16:70,
    19:120,20:160,21:125,22:215};
  return {num:String(i).padStart(2,"0"),amt:table[i]??0};
});

const PALE_DATA=[
  {num:"19-79",amt:350},{num:"11-70",amt:200},{num:"14-23",amt:200},{num:"22-73",amt:200},
  {num:"04-40",amt:175},{num:"37-73",amt:135},{num:"00-87",amt:100},{num:"04-61",amt:100},
  {num:"07-27",amt:100},{num:"08-30",amt:100},{num:"10-27",amt:100},{num:"13-76",amt:100},
  {num:"18-40",amt:100},{num:"19-48",amt:100},{num:"19-56",amt:100},{num:"19-65",amt:100},
  {num:"19-83",amt:100},
];
const TRIP_DATA=[
  {num:"13-19-58",amt:50},{num:"19-56-83",amt:50},{num:"19-65-83",amt:50},
  {num:"30-69-76",amt:25},{num:"56-64-94",amt:20},{num:"03-34-37",amt:5},
  {num:"05-37-73",amt:5},{num:"28-58-94",amt:5},{num:"28-58-95",amt:5},{num:"37-42-79",amt:5},
];

// Limit threshold for red highlight
const LIMIT = 500;
// Split directo into chunks of ~17
const chunkDir=(arr:{num:string;amt:number}[],size:number)=>{
  const chunks=[];
  for(let i=0;i<arr.length;i+=size) chunks.push(arr.slice(i,i+size));
  return chunks;
};

export default function MonitoreoTickets(){
  const [fecha,setFecha]=useState(today());
  const [sorteo,setSorteo]=useState("Anguila 10AM");
  const [selZonas,setSelZonas]=useState<string[]>([]);
  const [banca,setBanca]=useState("");
  const [autoRef,setAutoRef]=useState(false);
  const [dirFilter,setDirFilter]=useState("");
  const [paleFilter,setPaleFilter]=useState("");
  const [tripFilter,setTripFilter]=useState("");

  // Auto-refresh every 30s
  useEffect(()=>{
    if(!autoRef) return;
    const id=setInterval(()=>{ /* refresh logic */ },30000);
    return()=>clearInterval(id);
  },[autoRef]);

  const dirTotal=DIRECTO_DATA.reduce((s,r)=>s+r.amt,0);
  const paleTotal=PALE_DATA.reduce((s,r)=>s+r.amt,0);
  const tripTotal=TRIP_DATA.reduce((s,r)=>s+r.amt,0);
  const grandTotal=dirTotal+paleTotal+tripTotal;
  const dirPct=((dirTotal/grandTotal)*100).toFixed(1);
  const palePct=((paleTotal/grandTotal)*100).toFixed(1);
  const tripPct=((tripTotal/grandTotal)*100).toFixed(1);

  const filtDir=useMemo(()=>dirFilter?DIRECTO_DATA.filter(r=>r.num.includes(dirFilter)):DIRECTO_DATA,[dirFilter]);
  const filtPale=useMemo(()=>paleFilter?PALE_DATA.filter(r=>r.num.includes(paleFilter)):PALE_DATA,[paleFilter]);
  const filtTrip=useMemo(()=>tripFilter?TRIP_DATA.filter(r=>r.num.includes(tripFilter)):TRIP_DATA,[tripFilter]);
  const dirChunks=useMemo(()=>chunkDir(filtDir,17),[filtDir]);

  function PlayCol({title,icon,count,total,pct,items,onFilter,filterVal}:{
    title:string;icon:string;count:number;total:number;pct:string;
    items:{num:string;amt:number}[];onFilter:(v:string)=>void;filterVal:string;
  }){
    return(
      <div className="bg-white rounded-xl border border-[#E5E5E0] min-w-[140px] flex flex-col">
        <div className="px-3 pt-2.5">
          <input value={filterVal} onChange={e=>onFilter(e.target.value)} placeholder={icon}
            className="w-full px-2 py-1 text-xs border border-[#E5E5E0] rounded-md font-mono focus:outline-none focus:border-[#4ECDC4] mb-1.5"/>
          <p className="text-sm font-bold text-[#333] text-center">{title} ({count})</p>
          <p className="text-sm font-bold text-[#4ECDC4] text-center mb-1">{pct}%</p>
          <p className="text-base font-extrabold text-[#333] text-center mb-2">{fmt(total)}</p>
          <div className="grid grid-cols-2 gap-x-1 border-t border-[#E5E5E0] pt-1 pb-0.5">
            <span className="text-[11px] font-semibold text-[#4ECDC4]">Jugada ({count})</span>
            <span className="text-[11px] font-semibold text-[#4ECDC4] text-right">Importe</span>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 max-h-[320px] border-t border-[#F0F0EB]">
          {items.map((r,i)=>(
            <div key={i} className={`grid grid-cols-2 gap-x-1 px-3 py-1 text-xs ${
              r.amt>=LIMIT?"bg-[#FFCCCC] font-bold":
              r.amt===0?"bg-[#F0F0EE] text-[#BBB]":
              i%2===0?"bg-white":"bg-[#FAFAFA]"
            }`}>
              <span className="font-mono">{r.num}</span>
              <span className="text-right">{r.amt||""}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}} className="space-y-5">
      <PageHeader title="Monitoreo de jugadas"/>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] p-4 flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-[#999] font-medium block mb-1">Fecha</label>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4]"/></div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Sorteos</label>
          <div className="relative">
            <select value={sorteo} onChange={e=>setSorteo(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4] pr-8">
              {SORTEOS_LIST.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"/>
          </div>
        </div>
        <div>
          <label className="text-xs text-[#999] font-medium block mb-1">Zonas</label>
          <div className="relative">
            <select className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg appearance-none focus:outline-none focus:border-[#4ECDC4] pr-8 min-w-[160px]">
              <option>{selZonas.length||ZONAS_LIST.length} seleccionadas</option>
              {ZONAS_LIST.map(z=><option key={z} value={z}>{z}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"/>
          </div>
        </div>
        <div><label className="text-xs text-[#999] font-medium block mb-1">Banca</label>
          <input value={banca} onChange={e=>setBanca(e.target.value)} className="px-3 py-2 text-sm border border-[#E5E5E0] rounded-lg focus:outline-none focus:border-[#4ECDC4] w-36"/></div>
        <button className="flex items-center gap-2 px-5 py-2 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full hover:bg-[#3DBDB5] shadow-sm">
          <RefreshCw size={13}/> REFRESCAR
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white text-sm font-semibold rounded-full hover:bg-[#DC2626] shadow-sm">
          <FileText size={13}/> PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white text-sm font-semibold rounded-full hover:bg-[#4F46E5] shadow-sm">
          <Printer size={13}/> IMPRIMIR
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#666]">Auto refrescar</span>
          <button onClick={()=>setAutoRef(v=>!v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${autoRef?"bg-[#4ECDC4]":"bg-[#CCC]"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoRef?"translate-x-5":"translate-x-0.5"}`}/>
          </button>
        </div>
      </div>

      {/* Total badge */}
      <div className="text-center">
        <span className="text-xl font-bold text-[#333]">Total para sorteo {sorteo}: </span>
        <span className="text-2xl font-extrabold text-[#EF4444]">{fmt(grandTotal)}</span>
      </div>

      {/* Grid of play columns */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {/* Directo columns split into chunks of ~17 */}
          {dirChunks.map((chunk,ci)=>(
            <PlayCol key={ci}
              title="Directo" icon="##" count={filtDir.length} total={dirTotal}
              pct={dirPct} items={chunk}
              onFilter={setDirFilter} filterVal={ci===0?dirFilter:""}/>
          ))}
          {/* Pale column */}
          <PlayCol title="Pale" icon="##-##" count={filtPale.length} total={paleTotal}
            pct={palePct} items={filtPale}
            onFilter={setPaleFilter} filterVal={paleFilter}/>
          {/* Tripleta column */}
          <PlayCol title="Tripleta" icon="##-##-##" count={filtTrip.length} total={tripTotal}
            pct={tripPct} items={filtTrip}
            onFilter={setTripFilter} filterVal={tripFilter}/>
        </div>
      </div>
    </motion.div>
  );
}
