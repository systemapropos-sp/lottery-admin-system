import { useState, useEffect } from "react";
import { Shield, RefreshCw, CheckCircle2, XCircle, Plus, Pause, ToggleRight, ToggleLeft, Users, Building2, Ticket, BarChart3, X, Store } from "lucide-react";
import { supabase, BUSINESS_ID } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  rol: "SuperAdmin" | "Admin" | "Moderador";
  pin: string;
  estado: "activo" | "pausado";
}

interface SystemControls {
  sistemaCompleto: boolean;
  loginVendedores: boolean;
  loginAdmins: boolean;
  creacionTickets: boolean;
  pagosCobros: boolean;
  resultadosVisibles: boolean;
  reportes: boolean;
  mantenimiento: boolean;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const initialAdmins: AdminUser[] = [
  {
    id: "1",
    nombre: "RDV-01",
    usuario: "RDV-01",
    email: "duepostllc@gmail.com",
    rol: "Admin",
    pin: "0587",
    estado: "activo",
  },
];

const initialControls: SystemControls = {
  sistemaCompleto: true,
  loginVendedores: true,
  loginAdmins: true,
  creacionTickets: true,
  pagosCobros: true,
  resultadosVisibles: true,
  reportes: true,
  mantenimiento: false,
};

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
  icon, label, description, value, onChange, disabled = false,
}: {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
      disabled ? "opacity-50" : "hover:bg-gray-50/60"
    } ${value ? "border-teal-100 bg-teal-50/30" : "border-gray-100 bg-white"}`}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            value ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-400"
          }`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        className="flex-shrink-0 ml-4"
        disabled={disabled}
      >
        {value
          ? <ToggleRight size={28} className="text-teal-500" />
          : <ToggleLeft size={28} className="text-gray-300" />
        }
      </button>
    </div>
  );
}

// ─── Rol badge ────────────────────────────────────────────────────────────────

function RolBadge({ rol }: { rol: AdminUser["rol"] }) {
  const map = {
    SuperAdmin: "bg-purple-100 text-purple-700 border-purple-200",
    Admin: "bg-blue-100 text-blue-700 border-blue-200",
    Moderador: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${map[rol]}`}>
      {rol}
    </span>
  );
}

// ─── Vendedor Types & Data ────────────────────────────────────────────────────

interface Vendedor {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  pin: string;
  bancaAsignada: string;
  estado: "activo" | "pausado";
}

const NMV_BANCAS_V = [
  "NMV-0001","NMV-0002","NMV-0003","NMV-0004","NMV-0005",
  "NMV-0006","NMV-0007","NMV-0008","NMV-0009","NMV-0010",
  "NMV-0011","NMV-0012","NMV-0013",
];

// ─── Create Vendedor Modal ────────────────────────────────────────────────────

function CreateVendedorModal({ onSave, onClose }: { onSave:(v:Vendedor)=>void; onClose:()=>void }) {
  const [form, setForm] = useState({ nombre:"", usuario:"", email:"", pin:"", bancaAsignada:NMV_BANCAS_V[0] });
  const isValid = form.nombre.trim() && form.usuario.trim() && form.pin.length >= 4;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Crear Banca</h3>
            <p className="text-sm text-gray-500 mt-0.5">Nueva banca en el sistema</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Juan Pérez"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.usuario} onChange={e=>setForm({...form,usuario:e.target.value})} placeholder="juanp01"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="banca@email.com"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN (4 dígitos)</label>
              <input type="password" maxLength={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 font-mono tracking-widest text-center"
                value={form.pin} onChange={e=>setForm({...form,pin:e.target.value.replace(/\D/g,"").slice(0,4)})} placeholder="••••"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banca asignada</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.bancaAsignada} onChange={e=>setForm({...form,bancaAsignada:e.target.value})}>
                {NMV_BANCAS_V.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button disabled={!isValid} onClick={()=>onSave({id:`v-${Date.now()}`,nombre:form.nombre,usuario:form.usuario,email:form.email,pin:form.pin,bancaAsignada:form.bancaAsignada,estado:"activo"})}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-40"
            style={{background:"linear-gradient(135deg,#14B8A6,#0EA5E9)"}}>
            Crear Banca
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Admin Modal ───────────────────────────────────────────────────────

function CreateAdminModal({ onSave, onClose }: {
  onSave: (a: AdminUser) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    rol: "Admin" as AdminUser["rol"],
    pin: "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Crear Admin</h3>
          <p className="text-sm text-gray-500 mt-0.5">Nuevo administrador del sistema</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nombre</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Usuario</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Rol</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as AdminUser["rol"] })}>
                <option>Admin</option>
                <option>Moderador</option>
                <option>SuperAdmin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">PIN</label>
              <input type="text" maxLength={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="0000" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button
            onClick={() => onSave({ ...form, id: `admin-${Date.now()}`, estado: "activo" })}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}
          >Crear Admin</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SuperAdminPage() {
  const [tab, setTab] = useState<"resumen" | "control" | "admins" | "vendedores">("resumen");
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [controls, setControls] = useState<SystemControls>(initialControls);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [showCreateVendedor, setShowCreateVendedor] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load vendors from Supabase
  useEffect(() => {
    supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) {
          setVendedores(
            data.map((v) => ({
              id: v.id,
              nombre: v.name || v.vendor_code || "Sin nombre",
              usuario: v.vendor_code || v.id,
              email: v.phone || "",
              pin: v.pin || "",
              bancaAsignada: v.vendor_code || "",
              estado: v.is_active ? "activo" : "pausado",
            }))
          );
        }
      });
  }, []);

  const superAdmins = admins.filter((a) => a.rol === "SuperAdmin").length;
  const adminCount = admins.filter((a) => a.rol === "Admin").length;
  const sistemActivo = controls.sistemaCompleto;

  const handleSaveControls = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setControl = (key: keyof SystemControls) => (val: boolean) => {
    if (key === "sistemaCompleto" && !val) {
      setControls({ sistemaCompleto: false, loginVendedores: false, loginAdmins: false, creacionTickets: false, pagosCobros: false, resultadosVisibles: false, reportes: false, mantenimiento: false });
    } else {
      setControls((prev) => ({ ...prev, [key]: val }));
    }
  };

  const tabs: { key: typeof tab; emoji: string; label: string }[] = [
    { key: "resumen", emoji: "📊", label: "Resumen" },
    { key: "control", emoji: "⚙️", label: "Control" },
    { key: "admins", emoji: "👥", label: "Admins" },
    { key: "vendedores", emoji: "🏪", label: "Bancas" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
            <p className="text-gray-400 text-sm mt-0.5">Bienvenido, RDV-01 · NMV Lottery</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveControls}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
            Actualizar
          </button>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            sistemActivo ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <div className={`w-2 h-2 rounded-full ${sistemActivo ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
            {sistemActivo ? "SISTEMA ACTIVO" : "SISTEMA APAGADO"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: RESUMEN ─────────────────────────────────────────────────── */}
      {tab === "resumen" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: <Shield size={18} />, label: "SuperAdmins", value: superAdmins, color: "text-purple-600", bg: "bg-purple-50" },
              { icon: <Building2 size={18} />, label: "Admins", value: adminCount, color: "text-blue-600", bg: "bg-blue-50" },
      { icon: <Users size={18} />, label: "Bancas", value: vendedores.length, color: "text-teal-600", bg: "bg-teal-50" },
              { icon: <Ticket size={18} />, label: "Activos hoy", value: 0, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Estado del sistema */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚡</span> Estado del Sistema
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Sistema general", value: controls.sistemaCompleto },
                  { label: "Login bancas", value: controls.loginVendedores },
                  { label: "Creación tickets", value: controls.creacionTickets },
                  { label: "Pagos habilitados", value: controls.pagosCobros },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    {item.value
                      ? <CheckCircle2 size={18} className="text-teal-500" />
                      : <XCircle size={18} className="text-red-400" />
                    }
                  </div>
                ))}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-600">Mantenimiento</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    controls.mantenimiento
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {controls.mantenimiento ? "Activado" : "Desactivado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendedores registrados */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏪</span> Bancas Registradas
              </h3>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building2 size={32} className="text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">Sin bancas registradas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: CONTROL ─────────────────────────────────────────────────── */}
      {tab === "control" && (
        <div className="space-y-5">
          {/* Control Maestro */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span>🔴</span>
              <h3 className="font-bold text-gray-800">Control Maestro</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Apagar el sistema bloqueará el acceso a bancas y deshabilitará la creación de tickets.</p>
            <ToggleRow
              icon={<Shield size={14} />}
              label="Sistema Completo"
              description="Master switch — apaga todo el sistema"
              value={controls.sistemaCompleto}
              onChange={setControl("sistemaCompleto")}
            />
          </div>

          {/* Accesos */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span>🔒</span>
              <h3 className="font-bold text-gray-800">Accesos</h3>
            </div>
            <div className="space-y-3">
              <ToggleRow
                icon={<Users size={14} />}
                label="Login Bancas"
                description="Permite que bancas inicien sesión"
                value={controls.loginVendedores}
                onChange={setControl("loginVendedores")}
                disabled={!controls.sistemaCompleto}
              />
              <ToggleRow
                icon={<Shield size={14} />}
                label="Login Admins"
                description="Permite que admins inicien sesión"
                value={controls.loginAdmins}
                onChange={setControl("loginAdmins")}
                disabled={!controls.sistemaCompleto}
              />
            </div>
          </div>

          {/* Módulos del Sistema */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span>⚙️</span>
              <h3 className="font-bold text-gray-800">Módulos del Sistema</h3>
            </div>
            <div className="space-y-3">
              <ToggleRow
                icon={<Ticket size={14} />}
                label="Creación de Tickets"
                description="Permite crear/vender nuevos tickets"
                value={controls.creacionTickets}
                onChange={setControl("creacionTickets")}
                disabled={!controls.sistemaCompleto}
              />
              <ToggleRow
                icon={<BarChart3 size={14} />}
                label="Pagos/Cobros"
                description="Habilita módulo de pagos y cobros"
                value={controls.pagosCobros}
                onChange={setControl("pagosCobros")}
                disabled={!controls.sistemaCompleto}
              />
              <ToggleRow
                icon={<CheckCircle2 size={14} />}
                label="Resultados Visibles"
                description="Muestra resultados de sorteos"
                value={controls.resultadosVisibles}
                onChange={setControl("resultadosVisibles")}
                disabled={!controls.sistemaCompleto}
              />
              <ToggleRow
                icon={<BarChart3 size={14} />}
                label="Reportes"
                description="Habilita acceso a reportes"
                value={controls.reportes}
                onChange={setControl("reportes")}
                disabled={!controls.sistemaCompleto}
              />
            </div>
          </div>

          {/* Modo Mantenimiento */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span>🚧</span>
              <h3 className="font-bold text-gray-800">Modo Mantenimiento</h3>
            </div>
            <ToggleRow
              icon={<Shield size={14} />}
              label="Mantenimiento"
              description="Muestra página de mantenimiento a usuarios"
              value={controls.mantenimiento}
              onChange={setControl("mantenimiento")}
            />
          </div>

          {/* Guardar */}
          <button
            onClick={handleSaveControls}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            style={{ background: saved ? "#10B981" : "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
          >
            {saved ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            {saved ? "¡Guardado!" : "💾 Guardar Cambios"}
          </button>
        </div>
      )}

      {/* ── TAB: ADMINS ──────────────────────────────────────────────────── */}
      {tab === "admins" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Administradores del Sistema</h2>
              <p className="text-sm text-gray-400">{admins.length} usuario(s) registrados en Supabase</p>
            </div>
            <button
              onClick={() => setShowCreateAdmin(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
            >
              <Plus size={15} />
              Crear Admin
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Nombre</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Usuario</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-600">Rol</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-600">PIN</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-600">Estado</th>
                  <th className="px-5 py-3 text-center font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{admin.nombre}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{admin.usuario}</td>
                    <td className="px-5 py-3 text-gray-500">{admin.email}</td>
                    <td className="px-5 py-3 text-center">
                      <RolBadge rol={admin.rol} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="font-mono font-bold text-gray-700 tracking-widest bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {admin.pin.split("").join(" ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        admin.estado === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {admin.estado === "activo" ? "Activo" : "Pausado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() =>
                          setAdmins((prev) =>
                            prev.map((a) => a.id === admin.id
                              ? { ...a, estado: a.estado === "activo" ? "pausado" : "activo" }
                              : a
                            )
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border mx-auto transition-colors ${
                          admin.estado === "activo"
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {admin.estado === "activo"
                          ? <><Pause size={11} /> Pausar</>
                          : <><CheckCircle2 size={11} /> Activar</>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: BANCAS ──────────────────────────────────────────────────── */}
      {tab === "vendedores" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Bancas Registradas</h2>
              <p className="text-sm text-gray-400">{vendedores.length} banca(s) en el sistema</p>
            </div>
            <button onClick={()=>setShowCreateVendedor(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{background:"linear-gradient(135deg,#14B8A6,#0EA5E9)"}}>
              <Plus size={15}/> Crear Banca
            </button>
          </div>

          {vendedores.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-teal-100 rounded-xl p-16 text-center">
              <Store size={40} className="mx-auto mb-3 text-teal-200"/>
              <p className="text-gray-400 font-medium">Sin bancas</p>
              <p className="text-gray-300 text-sm mt-1">Crea la primera banca con el botón de arriba</p>
              <button onClick={()=>setShowCreateVendedor(true)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
                style={{background:"linear-gradient(135deg,#14B8A6,#0EA5E9)"}}>
                <Plus size={14}/> Crear Primera Banca
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Nombre</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Usuario</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="px-5 py-3 text-center font-semibold text-gray-600">Banca</th>
                    <th className="px-5 py-3 text-center font-semibold text-gray-600">PIN</th>
                    <th className="px-5 py-3 text-center font-semibold text-gray-600">Estado</th>
                    <th className="px-5 py-3 text-center font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vendedores.map(v=>(
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">{v.nombre}</td>
                      <td className="px-5 py-3 text-gray-500 font-mono text-xs">{v.usuario}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{v.email||"—"}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full">{v.bancaAsignada}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="font-mono font-bold text-gray-700 tracking-widest bg-gray-100 px-2 py-1 rounded-md text-xs">{v.pin.split("").join(" ")}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${v.estado==="activo"?"bg-green-100 text-green-700":"bg-amber-100 text-amber-700"}`}>
                          {v.estado==="activo"?"Activo":"Pausado"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={()=>setVendedores(prev=>prev.map(x=>x.id===v.id?{...x,estado:x.estado==="activo"?"pausado":"activo"}:x))}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border mx-auto transition-colors ${
                            v.estado==="activo"?"border-amber-200 text-amber-600 hover:bg-amber-50":"border-green-200 text-green-600 hover:bg-green-50"}`}>
                          {v.estado==="activo"?<><Pause size={11}/> Pausar</>:<><CheckCircle2 size={11}/> Activar</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Vendedor */}
      {showCreateVendedor && (
        <CreateVendedorModal
          onSave={async (v) => {
            // Save to Supabase vendors table
            const { error } = await supabase.from("vendors").insert({
              name: v.nombre,
              vendor_code: v.usuario,
              pin: v.pin,
              phone: v.email || null,
              is_active: true,
              admin_id: "RDV-01",
              business_id: BUSINESS_ID,
              sorteos: [],
              colores: {},
              horarios: {},
            });
            if (!error) {
              setVendedores(prev => [...prev, { ...v, usuario: v.usuario }]);
              setShowCreateVendedor(false);
            } else {
              alert("Error al crear vendedor: " + error.message);
            }
          }}
          onClose={()=>setShowCreateVendedor(false)}
        />
      )}

      {/* Modal Admin */}
      {showCreateAdmin && (
        <CreateAdminModal
          onSave={(a) => { setAdmins((prev) => [...prev, a]); setShowCreateAdmin(false); }}
          onClose={() => setShowCreateAdmin(false)}
        />
      )}
    </div>
  );
}
