import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useBancasZonas } from "@/context/BancasZonasContext";
import { useBancasStore } from "@/store/bancasStore";
import type { Banca } from "@/store/bancasStore";
import type { Zona } from "@/store/zonasStore";

// ─── Auto-número: calcula el siguiente código disponible ──────────────────────
function getNextBancaCode(bancas: Banca[]): string {
  const codes = bancas.map((b) => b.mwr_code || b.code || "");
  let maxNum = 0;
  let prefix = "RDV";
  let padding = 3;
  codes.forEach((code) => {
    const m = code.match(/^([A-Za-z]+-[A-Za-z]*)(\d+)$|^([A-Za-z]+)-(\d+)$/);
    if (m) {
      const p = m[1] || m[3];
      const n = parseInt(m[2] || m[4], 10);
      if (!isNaN(n)) {
        prefix = p.replace(/-$/, "");
        padding = (m[2] || m[4]).length;
        if (n > maxNum) maxNum = n;
      }
    }
  });
  return `${prefix}-${String(maxNum + 1).padStart(padding, "0")}`;
}

// ─── Static data (outside component to avoid recreation) ──────────────────────
const TABS = ["General","Configuracion","Pies de pagina","Premios & Comisiones","Horarios de sorteos","Sorteos","Gastos automaticos"];
const TEMPLATE_CHIPS = ["CONFIGURACION","PIES DE PAGINA","PREMIOS & COMISIONES","HORARIOS DE SORTEOS","SORTEOS","ESTILOS","REGLAS"];
const DAYS = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
const SORTEOS_LIST = ["LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","FLORIDA PM","GANA MAS","NACIONAL","QUINIELA PALE","QUINIELA REAL","LOTEKA","SUPER PALE REAL-GANA MAS","SUPER PALE NACIONAL-QP","SUPER PALE NY-GANA MAS","SUPER PALE NY-NACIONAL","LA SUERTE","LOTEDOM","KING LOTTERY AM","KING LOTTERY PM","ANGUILA 1PM","ANGUILA 6PM","ANGUILA 9PM","ANGUILA 10AM","LA PRIMERA 7PM","LA SUERTE 6:00PM"];
const LOTTERY_TABS = ["General","LA PRIMERA","NEW YORK AM","NEW YORK PM","FLORIDA AM","FLORIDA PM","GANA MAS","NACIONAL","LOTEKA","QUINIELA REAL","QUINIELA PALE"];
const PRIZE_SUB_TABS = ["Premios","Comisiones","Comisiones 2"];
const COMISIONS = ["Quiniela","Pale","Tripleta","Super Pale","Combo","Picks 5","Cash 3","Bolita","Singulacion","Play 4","Pick Two"];
const PRIZES = [
  { title:"DIRECTO",              fields:[{label:"Primer Pago",value:"70"},{label:"Segundo Pago",value:"10"},{label:"Tercer Pago",value:"4"},{label:"Dobles",value:"70"}]},
  { title:"PALE",                 fields:[{label:"Todos en secuencia",value:"0"},{label:"Primer Pago",value:"1500"},{label:"Segundo Pago",value:"1500"},{label:"Tercer Pago",value:"100"}]},
  { title:"TRIPLETA",             fields:[{label:"Primer Pago",value:"20000"},{label:"Segundo Pago",value:"100"}]},
  { title:"CASH3 STRAIGHT",       fields:[{label:"Todos en secuencia",value:"700"},{label:"Triples",value:"700"}]},
  { title:"CASH3 BOX",            fields:[{label:"3-Way: 2 identicos",value:"232"},{label:"6-Way: 3 unicos",value:"116"}]},
  { title:"PLAY4 STRAIGHT",       fields:[{label:"Todos en secuencia",value:"5000"},{label:"Dobles",value:"5000"}]},
  { title:"PLAY4 BOX",            fields:[{label:"24-Way: 4 unicos",value:"200"},{label:"12-Way: 2 identicos",value:"400"},{label:"6-Way: 2 identicos",value:"800"},{label:"4-Way: 3 identicos",value:"1200"}]},
  { title:"SUPER PALE",           fields:[{label:"Primer Pago",value:"3000"}]},
  { title:"BOLITA 1",             fields:[{label:"Primer Pago",value:"80"}]},
  { title:"BOLITA 2",             fields:[{label:"Primer Pago",value:"80"}]},
  { title:"SINGULACION 1",        fields:[{label:"Primer Pago",value:"9"}]},
  { title:"SINGULACION 2",        fields:[{label:"Primer Pago",value:"9"}]},
  { title:"SINGULACION 3",        fields:[{label:"Primer Pago",value:"9"}]},
  { title:"PICKS5 STRAIGHT",      fields:[{label:"Todos en secuencia",value:"30000"},{label:"Dobles",value:"30000"}]},
  { title:"PICKS5 BOX",           fields:[{label:"5-Way 4 ident.",value:"10000"},{label:"10-Way 3 ident.",value:"5000"},{label:"20-Way 3 ident.",value:"2500"},{label:"30-Way 2 ident.",value:"1660"},{label:"60-Way 2 ident.",value:"830"},{label:"120-Way 5 unicos",value:"416"}]},
  { title:"CASH3 FRONT STRAIGHT", fields:[{label:"Todos en secuencia",value:"700"},{label:"Triples",value:"700"}]},
  { title:"CASH3 FRONT BOX",      fields:[{label:"3-Way: 2 identicos",value:"232"},{label:"6-Way: 3 unicos",value:"116"}]},
  { title:"CASH3 BACK STRAIGHT",  fields:[{label:"Todos en secuencia",value:"700"},{label:"Triples",value:"700"}]},
  { title:"CASH3 BACK BOX",       fields:[{label:"3-Way: 2 identicos",value:"232"},{label:"6-Way: 3 unicos",value:"116"}]},
  { title:"PICK TWO FRONT",       fields:[{label:"Primer Pago",value:"70"},{label:"Dobles",value:"70"}]},
  { title:"PICK TWO BACK",        fields:[{label:"Primer Pago",value:"70"},{label:"Dobles",value:"70"}]},
  { title:"PICK TWO MIDDLE",      fields:[{label:"Primer Pago",value:"70"},{label:"Dobles",value:"70"}]},
];

// ─── Reusable small components ─────────────────────────────────────────────────
function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(v => !v)} className={`relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-200 flex-shrink-0 ${on ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"}`}>
      <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-[#F9F9F9]">
      <span className="text-sm text-[#666] flex-1">{label}</span>
      <Toggle defaultOn={defaultOn} />
    </div>
  );
}

function Inp({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <label className="text-sm text-[#666] w-52 flex-shrink-0">{label}</label>
      <input type={type} placeholder={placeholder || label} className="flex-1 min-w-0 px-3 py-1.5 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] bg-white" />
    </div>
  );
}

function CreateBtn({ onClick, saving }: { onClick?: () => void; saving?: boolean }) {
  return (
    <div className="flex justify-center my-6">
      <button onClick={onClick} disabled={saving}
        className="px-16 py-2.5 bg-[#4ECDC4] text-white rounded-full text-sm font-bold hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] uppercase tracking-widest disabled:opacity-60">
        {saving ? "CREANDO..." : "CREAR"}
      </button>
    </div>
  );
}

function PlantillaSection() {
  const { bancas } = useBancasZonas();
  const [bancaId, setBancaId] = useState("");
  const [chips, setChips] = useState([...TEMPLATE_CHIPS]);
  return (
    <div className="mt-2 pt-6 border-t border-[#E5E5E0]">
      <h3 className="text-base font-semibold text-[#333] mb-4">Copiar de banca plantilla</h3>
      <div className="border-t border-[#E5E5E0] pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[#555] w-14">Banca</label>
          <select value={bancaId} onChange={e => setBancaId(e.target.value)} className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] bg-white min-w-[180px]">
            <option value="">Seleccionar banca...</option>
            {bancas.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-[#555] mb-2">Campos de plantilla</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CHIPS.map(chip => (
              <button key={chip} onClick={() => setChips(p => p.includes(chip) ? p.filter(c => c !== chip) : [...p, chip])}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all ${chips.includes(chip) ? "bg-[#4ECDC4] text-white" : "bg-[#E5E5E0] text-[#666]"}`}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab content components ────────────────────────────────────────────────────
function TabGeneral() {
  const navigate = useNavigate();
  const { bancas, zonas } = useBancasZonas();
  const { createBanca } = useBancasStore();
  const nextCode = useMemo(() => getNextBancaCode(bancas), [bancas]);

  const [form, setForm] = useState({
    nombre: "", username: "", password: "", confirmacion: "",
    ubicacion: "", referencia: "", comentario: "", zona_id: "",
  });
  const [numero, setNumero] = useState(nextCode);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useMemo(() => { setNumero(getNextBancaCode(bancas)); }, [bancas]);

  function fld(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCrear() {
    if (!form.nombre.trim()) { setMsg({ type: "err", text: "El nombre es requerido" }); return; }
    if (!numero.trim()) { setMsg({ type: "err", text: "El número es requerido" }); return; }
    if (form.password && form.password !== form.confirmacion) {
      setMsg({ type: "err", text: "Las contraseñas no coinciden" }); return;
    }
    const zona = zonas.find((z: Zona) => z.id === form.zona_id);
    setSaving(true);
    setMsg(null);
    const { ok, error } = await createBanca({
      name:      form.nombre.trim(),
      code:      numero.trim(),
      mwr_code:  numero.trim(),
      balance:   0,
      zone_id:   form.zona_id || null,
      zone_name: zona?.nombre || null,
      is_active: true,
    });
    setSaving(false);
    if (ok) {
      setMsg({ type: "ok", text: `✅ Banca "${form.nombre}" creada exitosamente en Supabase (${numero})` });
      setTimeout(() => navigate("/bancas"), 1800);
    } else {
      setMsg({ type: "err", text: error ?? "Error al crear banca" });
    }
  }

  return (
    <div className="space-y-3">
      {msg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${msg.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg.type === "ok" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>} {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Nombre *", name: "nombre", type: "text" },
          { label: "Nombre de usuario *", name: "username", type: "text" },
          { label: "Contraseña *", name: "password", type: "password" },
          { label: "Confirmación *", name: "confirmacion", type: "password" },
          { label: "Ubicación", name: "ubicacion", type: "text" },
          { label: "Referencia", name: "referencia", type: "text" },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-[#333] mb-1">{f.label}</label>
            <input type={f.type} name={f.name} value={(form as Record<string, string>)[f.name]}
              onChange={fld} placeholder={f.label.replace(" *", "")}
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]" />
          </div>
        ))}

        {/* Numero — auto-numeración */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1">
            Numero *
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-600 border border-teal-100">
              <Sparkles size={9} /> Auto-asignado
            </span>
          </label>
          <div className="relative">
            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)}
              className="w-full px-3 py-2 border-2 border-[#4ECDC4] rounded-lg text-sm focus:outline-none font-mono font-bold text-teal-700 bg-teal-50"
              placeholder="RDV-001" />
            <button type="button" onClick={() => setNumero(nextCode)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-teal-500 hover:text-teal-700 font-semibold">
              ↺ auto
            </button>
          </div>
          <p className="text-[10px] text-[#999] mt-1">
            Siguiente disponible: <span className="font-mono font-bold text-teal-600">{nextCode}</span>
            {" "}(basado en {bancas.length} bancas existentes)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333] mb-1">Zona</label>
          <select name="zona_id" value={form.zona_id} onChange={fld}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] bg-white">
            <option value="">Seleccionar zona...</option>
            {zonas.map((z: Zona) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#333] mb-1">Comentario</label>
        <textarea name="comentario" value={form.comentario} onChange={fld}
          rows={3} className="w-full px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] resize-none"
          placeholder="Notas adicionales..." />
      </div>

      <CreateBtn onClick={handleCrear} saving={saving} />
      <PlantillaSection />
    </div>
  );
}

function TabConfiguracion() {
  const { zonas } = useBancasZonas();
  const [modoImp, setModoImp] = useState<"DRIVER" | "GENERICO">("DRIVER");
  const [modoPago, setModoPago] = useState<"BANCA" | "GRUPO" | "ZONA">("GRUPO");
  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <label className="text-sm font-medium text-[#555] w-14">Zona</label>
        <select className="px-3 py-1.5 border border-[#E5E5E0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#4ECDC4] min-w-[160px]">
          <option value="">Seleccionar zona...</option>
          {zonas.map((z: Zona) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
        {/* Left */}
        <div>
          <Inp label="Balance de desactivacion" />
          <Inp label="Límite de venta diaria" />
          <Inp label="Balance límite al día" />
          <div className="flex items-center gap-3 py-1.5 border-b border-[#F9F9F9]">
            <span className="text-sm text-[#666] flex-1">Habilitar balance temporal adicional</span>
            <Toggle />
            <input type="text" defaultValue="" placeholder="Valor" className="w-24 px-2 py-1.5 border border-[#E5E5E0] rounded text-sm focus:outline-none focus:border-[#4ECDC4]" />
          </div>
          <ToggleRow label="Activa" defaultOn={true} />
          <ToggleRow label="Control de tickets ganadores" defaultOn={true} />
          <ToggleRow label="Permitir pasar bote" defaultOn={true} />
          <ToggleRow label="Imprimir" defaultOn={true} />
          <ToggleRow label="Imprimir copia de ticket" defaultOn={true} />
          <ToggleRow label="Sólo SMS" />
          <div className="flex items-center gap-3 py-1.5 border-b border-[#F9F9F9]">
            <span className="text-sm text-[#666] flex-1">Minutos para cancelar tickets</span>
            <input type="number" defaultValue={120} className="w-24 px-2 py-1.5 border border-[#E5E5E0] rounded text-sm focus:outline-none focus:border-[#4ECDC4]" />
          </div>
          <div className="flex items-center gap-3 py-1.5 border-b border-[#F9F9F9]">
            <span className="text-sm text-[#666] flex-1">Tickets a cancelar por día</span>
            <input type="number" className="w-24 px-2 py-1.5 border border-[#E5E5E0] rounded text-sm focus:outline-none focus:border-[#4ECDC4]" />
          </div>
          <ToggleRow label="Habilitar recargas" />
          <ToggleRow label="Permitir cambiar contraseña" defaultOn={true} />
        </div>

        {/* Right */}
        <div className="mt-6 lg:mt-0 space-y-5">
          <div>
            <p className="text-sm font-medium text-[#555] mb-2">Modo de impresión</p>
            <div className="flex">
              {(["DRIVER","GENERICO"] as const).map(m => (
                <button key={m} onClick={() => setModoImp(m)} className={`px-5 py-2 border text-sm font-bold first:rounded-l-lg last:rounded-r-lg transition-all ${modoImp===m ? "bg-[#4ECDC4] text-white border-[#4ECDC4]" : "bg-white text-[#666] border-[#E5E5E0] hover:bg-[#F5F5F0]"}`}>
                  {m === "GENERICO" ? "GENÉRICO" : m}
                </button>
              ))}
            </div>
          </div>
          <Inp label="Monto máx. para cancelar ticket" />
          <Inp label="Monto máximo de tickets" />
          <Inp label="Monto máximo diario de recargas" />
          <div>
            <p className="text-sm font-medium text-[#555] mb-2">Modo de pago de tickets</p>
            <div className="flex mb-3">
              {(["BANCA","GRUPO","ZONA"] as const).map(m => (
                <button key={m} onClick={() => setModoPago(m)} className={`px-5 py-2 border text-sm font-bold first:rounded-l-lg last:rounded-r-lg transition-all ${modoPago===m ? "bg-[#4ECDC4] text-white border-[#4ECDC4]" : "bg-white text-[#666] border-[#E5E5E0] hover:bg-[#F5F5F0]"}`}>
                  {m}
                </button>
              ))}
            </div>
            <button className="px-5 py-2 bg-[#4ECDC4] text-white text-sm font-bold rounded-lg hover:bg-[#3DBDB5] transition-colors">
              USAR PREFERENCIA DE GRUPO
            </button>
          </div>
        </div>
      </div>

      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

function TabPies() {
  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#666] flex-1">Pie de página automático</span>
        <Toggle />
      </div>
      <hr className="border-[#F0F0EB]" />
      {["Primer pie de pagina","Segundo pie de pagina","Tercer pie de pagina","Cuarto pie de pagina"].map(f => (
        <div key={f} className="flex items-center gap-4">
          <label className="text-sm text-[#666] w-44 flex-shrink-0">{f}</label>
          <input type="text" className="flex-1 px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]" />
        </div>
      ))}
      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

function TabPremios() {
  const [subTab, setSubTab] = useState(0);
  const [lotIdx, setLotIdx] = useState(0);
  const [offset, setOffset] = useState(0);
  const visible = LOTTERY_TABS.slice(offset, offset + 7);

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-[#E5E5E0] mb-4">
        {PRIZE_SUB_TABS.map((st, i) => (
          <button key={st} onClick={() => setSubTab(i)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab===i ? "text-[#4ECDC4] border-[#4ECDC4]" : "text-[#999] border-transparent hover:text-[#666]"}`}>
            {st}
          </button>
        ))}
      </div>

      {subTab === 0 && (
        <div>
          {/* Lottery sub-nav */}
          <div className="flex items-center gap-1 mb-4">
            <button onClick={() => setOffset(Math.max(0, offset-1))} className="p-1 rounded hover:bg-[#F0F0EB] text-[#4ECDC4] flex-shrink-0"><ChevronLeft size={16}/></button>
            <div className="flex gap-1 overflow-hidden flex-1">
              {visible.map((lt, i) => {
                const ri = offset + i;
                return (
                  <button key={lt} onClick={() => setLotIdx(ri)} className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${lotIdx===ri ? "text-[#4ECDC4] bg-[#E0F7F5]" : "text-[#666] hover:bg-[#F5F5F0]"}`}>
                    {lt}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setOffset(Math.min(LOTTERY_TABS.length-7, offset+1))} className="p-1 rounded hover:bg-[#F0F0EB] text-[#4ECDC4] flex-shrink-0"><ChevronRight size={16}/></button>
          </div>

          {/* Prizes grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PRIZES.map(p => (
              <div key={p.title} className="min-w-0">
                <p className="text-[11px] font-bold text-[#333] uppercase tracking-wide mb-2 border-b border-[#E5E5E0] pb-1">{p.title}</p>
                {p.fields.map(f => (
                  <div key={f.label} className="mb-1.5">
                    <p className="text-[10px] text-[#888] leading-tight">{f.label}</p>
                    <input type="number" defaultValue={f.value} className="w-full px-2 py-1 border border-[#E5E5E0] rounded text-sm font-mono focus:outline-none focus:border-[#4ECDC4]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMISIONS.map(c => (
            <div key={c} className="bg-[#FAFAF8] rounded-lg p-3 border border-[#E5E5E0]">
              <p className="text-xs font-bold text-[#333] mb-2 uppercase">{c}</p>
              <div className="space-y-2">
                {["Comision %","Reduccion %"].map(lbl => (
                  <div key={lbl}><p className="text-[10px] text-[#888]">{lbl}</p><input type="number" defaultValue={0} className="w-full px-2 py-1 border border-[#E5E5E0] rounded text-sm font-mono focus:outline-none focus:border-[#4ECDC4]"/></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 2 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMISIONS.map(c => (
            <div key={c} className="bg-[#FAFAF8] rounded-lg p-3 border border-[#E5E5E0]">
              <p className="text-xs font-bold text-[#333] mb-2 uppercase">{c}</p>
              <div className="space-y-2">
                {["Nivel 2 %","Nivel 3 %"].map(lbl => (
                  <div key={lbl}><p className="text-[10px] text-[#888]">{lbl}</p><input type="number" defaultValue={0} className="w-full px-2 py-1 border border-[#E5E5E0] rounded text-sm font-mono focus:outline-none focus:border-[#4ECDC4]"/></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

function TabHorarios() {
  return (
    <div>
      <div className="space-y-3 max-w-xl">
        {DAYS.map(day => (
          <div key={day} className="grid grid-cols-[100px_1fr_20px_1fr_32px] items-center gap-2">
            <span className="text-sm font-medium text-[#555]">{day}</span>
            <input type="time" defaultValue="00:00" className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]" />
            <span className="text-[#999] text-center text-sm">→</span>
            <input type="time" defaultValue="23:59" className="px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4]" />
            <span className="text-[#CCC] text-lg cursor-pointer hover:text-[#999]">📅</span>
          </div>
        ))}
      </div>
      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

function TabSorteos() {
  const [active, setActive] = useState([...SORTEOS_LIST]);
  const toggle = (s: string) => setActive(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {SORTEOS_LIST.map(s => (
          <button key={s} onClick={() => toggle(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${active.includes(s) ? "bg-[#4ECDC4] text-white" : "bg-[#E5E5E0] text-[#666]"}`}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => setActive(active.length === SORTEOS_LIST.length ? [] : [...SORTEOS_LIST])}
        className={`px-6 py-1.5 rounded-lg text-xs font-bold uppercase border-2 transition-all mb-5 ${active.length === SORTEOS_LIST.length ? "bg-[#4ECDC4] text-white border-[#4ECDC4]" : "bg-white text-[#4ECDC4] border-[#4ECDC4]"}`}>
        TODOS
      </button>
      <div className="flex items-center gap-3 max-w-md">
        <label className="text-sm text-[#555] w-48 flex-shrink-0">Aplicar cierre anticipado a</label>
        <select className="flex-1 px-3 py-2 border border-[#E5E5E0] rounded-lg text-sm focus:outline-none focus:border-[#4ECDC4] bg-white">
          <option value="">Seleccione</option>
          {SORTEOS_LIST.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

function TabGastos() {
  const gastos = [
    {name:"Gasto administrativo",active:true},{name:"Gasto por venta",active:false},
    {name:"Gasto por ticket",active:false},{name:"Comision bancaria",active:false},
    {name:"Gasto por retiro",active:false},{name:"Costo de SMS",active:false},
  ];
  return (
    <div>
      <div className="space-y-3 max-w-lg">
        {gastos.map(g => (
          <div key={g.name} className="flex items-center justify-between py-2 px-3 bg-[#FAFAF8] rounded-lg border border-[#E5E5E0]">
            <div className="flex items-center gap-3">
              <Toggle defaultOn={g.active} />
              <span className="text-sm text-[#333]">{g.name}</span>
            </div>
            <input type="number" defaultValue={0} className="w-24 px-2 py-1 border border-[#E5E5E0] rounded text-sm font-mono text-right focus:outline-none focus:border-[#4ECDC4]" />
          </div>
        ))}
      </div>
      <CreateBtn />
      <PlantillaSection />
    </div>
  );
}

const TAB_COMPONENTS = [TabGeneral, TabConfiguracion, TabPies, TabPremios, TabHorarios, TabSorteos, TabGastos];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CrearBanca() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <PageHeader title="Crear Banca" subtitle="Complete el formulario para registrar una nueva banca" />

      <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Tab bar */}
        <div className="border-b border-[#E5E5E0] overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map((tab, idx) => (
              <button key={tab} onClick={() => setActiveTab(idx)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab===idx ? "text-[#4ECDC4] border-[#4ECDC4]" : "text-[#999] border-transparent hover:text-[#666]"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
