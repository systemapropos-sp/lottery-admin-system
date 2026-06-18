import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Palette, Globe, Eye, EyeOff, Bell, Moon, Sun, Save,
  Zap, ShieldCheck, Clock, Gauge, Shield, Percent, Database,
  Volume2, VolumeX, RefreshCw, AlertTriangle, Smartphone,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { QuickAccessSettings } from "@/components/quick-access";
import PermisosPage from "@/pages/settings/PermisosPage";

const tabs = [
  { key: "password",    label: "Cambiar Contraseña",  icon: Lock       },
  { key: "preferences", label: "Preferencias",         icon: Palette    },
  { key: "language",    label: "Idioma",               icon: Globe      },
  { key: "quickaccess", label: "Accesos Rápidos",      icon: Zap        },
  { key: "permisos",    label: "Permisos de Banca",    icon: ShieldCheck},
  { key: "horarios",    label: "Horarios de Sorteos",  icon: Clock      },
  { key: "limites",     label: "Límites Globales",     icon: Gauge      },
  { key: "seguridad",   label: "Seguridad",            icon: Shield     },
  { key: "comisiones",  label: "Comisiones",           icon: Percent    },
  { key: "sistema",     label: "Sistema / Datos",      icon: Database   },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function SettingsPage() {
  const { language, setLanguage } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabKey>("password");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Seguridad toggles
  const [segToggles, setSegToggles] = useState<Record<string,boolean>>({
    "2fa": false, "loginAlert": true, "autoBlock": true, "remember": false,
  });
  const [sessionTime, setSessionTime] = useState("1 hora");

  // Sistema toggles
  const [sisToggles, setSisToggles] = useState<Record<string,boolean>>({
    "sounds": true, "silent": false, "autoRefresh": true, "backup": true,
  });

  // Horarios toggles
  const [horToggles, setHorToggles] = useState<Record<string,boolean>>({
    "Florida AM": true, "Florida PM": true, "New York AM": true, "New York PM": true,
    "Anguila 10AM": true, "Anguila PM": true, "Nacional": true, "Leidsa": true, "King Lottery": false,
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("La contrasena actual es requerida");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La nueva contrasena debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };

  const passwordField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    onToggleShow: () => void,
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-[#333333] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className={activeTab === "permisos" ? "w-full" : "max-w-4xl mx-auto"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#333333]">Configuracion</h1>
        <p className="text-sm text-[#666666] mt-0.5">
          Administre su cuenta, preferencias e idioma
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:w-56 flex-shrink-0"
        >
          <div className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-2 sticky top-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPasswordError("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeTab === tab.key
                      ? "bg-[#E0F7F5] text-[#0F766E]"
                      : "text-[#666666] hover:bg-[#F5F5F0] hover:text-[#333333]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ─── PASSWORD TAB ───────────────────────────────────────────────── */}
            {activeTab === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#333333] mb-1">
                  Cambiar contrasena
                </h2>
                <p className="text-sm text-[#666666] mb-5">
                  Actualice su contrasena de acceso al sistema
                </p>

                {passwordSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-[#D1FAE5] rounded-lg text-[#065F46]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center">
                      <Save size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      Contrasena actualizada exitosamente
                    </span>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4 max-w-md"
                  >
                    {passwordField(
                      "Contrasena actual",
                      currentPassword,
                      setCurrentPassword,
                      showCurrent,
                      () => setShowCurrent((s) => !s),
                      "••••••••"
                    )}
                    {passwordField(
                      "Nueva contrasena",
                      newPassword,
                      setNewPassword,
                      showNew,
                      () => setShowNew((s) => !s),
                      "Minimo 6 caracteres"
                    )}
                    {passwordField(
                      "Confirmar contrasena",
                      confirmPassword,
                      setConfirmPassword,
                      showConfirm,
                      () => setShowConfirm((s) => !s),
                      "Repita la nueva contrasena"
                    )}

                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-[#EF4444] font-medium"
                      >
                        {passwordError}
                      </motion.p>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* ─── PREFERENCES TAB ────────────────────────────────────────────── */}
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#333333] mb-1">
                  Preferencias
                </h2>
                <p className="text-sm text-[#666666] mb-5">
                  Personalice su experiencia en el sistema
                </p>

                <div className="space-y-6 max-w-md">
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-[#1E1E1E] text-white"
                            : "bg-[#F5F5F0] text-[#666666]"
                        }`}
                      >
                        {theme === "dark" ? (
                          <Moon size={18} />
                        ) : (
                          <Sun size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">
                          Tema
                        </p>
                        <p className="text-xs text-[#999999]">
                          {theme === "light"
                            ? "Modo claro"
                            : "Modo oscuro"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme((t) => (t === "light" ? "dark" : "light"))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        theme === "dark" ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          theme === "dark" ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-[#F0F0EB]" />

                  {/* Email notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E0F7F5] text-[#0F766E] flex items-center justify-center">
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">
                          Notificaciones por correo
                        </p>
                        <p className="text-xs text-[#999999]">
                          Recibir alertas via email
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailNotifs((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        emailNotifs ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          emailNotifs ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Push notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center">
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">
                          Notificaciones push
                        </p>
                        <p className="text-xs text-[#999999]">
                          Recibir notificaciones en el navegador
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPushNotifs((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        pushNotifs ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          pushNotifs ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sound */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">
                          Sonido
                        </p>
                        <p className="text-xs text-[#999999]">
                          Reproducir sonidos de notificacion
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        soundEnabled ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          soundEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── LANGUAGE TAB ───────────────────────────────────────────────── */}
            {activeTab === "language" && (
              <motion.div
                key="language"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
              >
                <h2 className="text-lg font-semibold text-[#333333] mb-1">
                  Idioma
                </h2>
                <p className="text-sm text-[#666666] mb-5">
                  Seleccione el idioma de la interfaz
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setLanguage("es")}
                    className={`flex-1 max-w-[140px] flex flex-col items-center gap-2 px-6 py-5 rounded-xl border-2 transition-all ${
                      language === "es"
                        ? "border-[#4ECDC4] bg-[#E0F7F5]"
                        : "border-[#E5E5E0] hover:border-[#CCCCCC]"
                    }`}
                  >
                    <span
                      className={`text-2xl font-bold ${
                        language === "es"
                          ? "text-[#4ECDC4]"
                          : "text-[#999999]"
                      }`}
                    >
                      ES
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        language === "es"
                          ? "text-[#0F766E]"
                          : "text-[#666666]"
                      }`}
                    >
                      Espanol
                    </span>
                  </button>

                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 max-w-[140px] flex flex-col items-center gap-2 px-6 py-5 rounded-xl border-2 transition-all ${
                      language === "en"
                        ? "border-[#4ECDC4] bg-[#E0F7F5]"
                        : "border-[#E5E5E0] hover:border-[#CCCCCC]"
                    }`}
                  >
                    <span
                      className={`text-2xl font-bold ${
                        language === "en"
                          ? "text-[#4ECDC4]"
                          : "text-[#999999]"
                      }`}
                    >
                      EN
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        language === "en"
                          ? "text-[#0F766E]"
                          : "text-[#666666]"
                      }`}
                    >
                      English
                    </span>
                  </button>
                </div>

                <p className="text-xs text-[#999999] mt-4">
                  El cambio de idioma se aplica inmediatamente a toda la
                  interfaz.
                </p>
              </motion.div>
            )}
            {/* ─── QUICK ACCESS TAB ───────────────────────────────────────────── */}
            {activeTab === "quickaccess" && (
              <QuickAccessSettings />
            )}

            {/* ─── HORARIOS TAB ───────────────────────────────────────────────── */}
            {activeTab === "horarios" && (
              <motion.div key="horarios" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#333333] mb-1">Horarios de Sorteos</h2>
                  <p className="text-sm text-[#666666]">Configure los horarios de apertura y cierre para cada sorteo</p>
                </div>
                {[
                  {nombre:"Florida AM",          apertura:"07:00",cierre:"09:45",activo:true},
                  {nombre:"Florida PM",          apertura:"12:00",cierre:"13:50",activo:true},
                  {nombre:"New York AM",         apertura:"07:00",cierre:"10:20",activo:true},
                  {nombre:"New York PM",         apertura:"14:00",cierre:"14:20",activo:true},
                  {nombre:"Anguila 10AM",        apertura:"07:00",cierre:"10:00",activo:true},
                  {nombre:"Anguila PM",          apertura:"12:00",cierre:"13:55",activo:true},
                  {nombre:"Nacional",            apertura:"07:00",cierre:"12:00",activo:true},
                  {nombre:"Leidsa",              apertura:"07:00",cierre:"12:00",activo:true},
                  {nombre:"King Lottery",        apertura:"07:00",cierre:"21:00",activo:false},
                ].map(s=>(
                  <div key={s.nombre} className="flex items-center gap-4 p-3 rounded-xl border border-[#F0F0EB] hover:border-[#4ECDC4]/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#E0F7F5] flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-[#4ECDC4]"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#333]">{s.nombre}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#666]">
                      <label className="font-medium">Abre</label>
                      <input type="time" defaultValue={s.apertura}
                        className="px-2 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4] w-24"/>
                      <label className="font-medium">Cierra</label>
                      <input type="time" defaultValue={s.cierre}
                        className="px-2 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4] w-24"/>
                    </div>
                     <button onClick={()=>setHorToggles(h=>({...h,[s.nombre]:!h[s.nombre]}))}
                       className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${horToggles[s.nombre]?"bg-[#4ECDC4]":"bg-[#E5E5E0]"}`}>
                       <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${horToggles[s.nombre]?"left-5":"left-0.5"}`}/>
                     </button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-semibold rounded-xl hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]">
                    <Save size={14}/> Guardar Horarios
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── LÍMITES TAB ────────────────────────────────────────────────── */}
            {activeTab === "limites" && (
              <motion.div key="limites" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#333333] mb-1">Límites Globales de Apuestas</h2>
                  <p className="text-sm text-[#666666]">Defina los límites máximos de venta por tipo de jugada</p>
                </div>
                {[
                  {tipo:"Directo (2 cifras)",   limit:500,  msg:100},
                  {tipo:"Directo (3 cifras)",   limit:200,  msg:50 },
                  {tipo:"Pale",                  limit:100,  msg:20 },
                  {tipo:"Tripleta",              limit:50,   msg:10 },
                  {tipo:"Super Pale",            limit:80,   msg:15 },
                  {tipo:"Quiniela",              limit:1000, msg:200},
                ].map(l=>(
                  <div key={l.tipo} className="grid grid-cols-[1fr_140px_140px] items-center gap-4 p-3 rounded-xl border border-[#F0F0EB]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><Gauge size={14} className="text-orange-500"/></div>
                      <p className="text-sm font-medium text-[#333]">{l.tipo}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#999] uppercase tracking-wide mb-1">Límite máximo</label>
                      <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999] text-xs">$</span>
                        <input type="number" defaultValue={l.limit} className="w-full pl-6 pr-3 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4]"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#999] uppercase tracking-wide mb-1">Mensaje de alerta</label>
                      <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999] text-xs">$</span>
                        <input type="number" defaultValue={l.msg} className="w-full pl-6 pr-3 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4]"/>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-semibold rounded-xl hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]">
                    <Save size={14}/> Guardar Límites
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── SEGURIDAD TAB ──────────────────────────────────────────────── */}
            {activeTab === "seguridad" && (
              <motion.div key="seguridad" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#333333] mb-1">Seguridad de la Cuenta</h2>
                  <p className="text-sm text-[#666666]">Configure opciones de autenticación y protección</p>
                </div>
                {([
                  {icon:<Smartphone size={16}/>,bg:"bg-blue-50",ic:"text-blue-500",title:"Autenticación de 2 factores",desc:"Requiere código adicional al iniciar sesión",key:"2fa",val:false},
                  {icon:<AlertTriangle size={16}/>,bg:"bg-amber-50",ic:"text-amber-500",title:"Alertas de inicio de sesión",desc:"Notifica por email cuando se detecta un nuevo acceso",key:"loginAlert",val:true},
                  {icon:<Shield size={16}/>,bg:"bg-green-50",ic:"text-green-500",title:"Bloqueo automático",desc:"Bloquear sesión tras 5 intentos fallidos",key:"autoBlock",val:true},
                  {icon:<RefreshCw size={16}/>,bg:"bg-purple-50",ic:"text-purple-500",title:"Sesión activa recordada",desc:"Mantener sesión activa entre visitas",key:"remember",val:false},
                ] as {icon:React.ReactNode;bg:string;ic:string;title:string;desc:string;key:string;val:boolean}[]).map(item=>(
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-[#F0F0EB] hover:border-[#4ECDC4]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.ic}`}>{item.icon}</div>
                      <div><p className="text-sm font-semibold text-[#333]">{item.title}</p><p className="text-xs text-[#999] mt-0.5">{item.desc}</p></div>
                    </div>
                     <button onClick={()=>setSegToggles(s=>({...s,[item.key]:!s[item.key]}))}
                       className={`relative w-11 h-6 rounded-full transition-all ${segToggles[item.key]?"bg-[#4ECDC4] shadow-[0_0_8px_rgba(78,205,196,0.4)]":"bg-[#E5E5E0]"}`}>
                       <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${segToggles[item.key]?"translate-x-5":"translate-x-0"}`}/>
                     </button>
                   </div>
                 ))}
                 <div className="p-4 rounded-xl border border-[#F0F0EB]">
                   <p className="text-sm font-semibold text-[#333] mb-3">Tiempo de expiración de sesión</p>
                   <div className="flex gap-2 flex-wrap">
                     {["15 min","30 min","1 hora","4 horas","8 horas","Nunca"].map(t=>(
                       <button key={t} onClick={()=>setSessionTime(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${t===sessionTime?"bg-[#4ECDC4] text-white border-[#4ECDC4]":"bg-white text-[#666] border-[#E5E5E0] hover:border-[#4ECDC4]"}`}>{t}</button>
                     ))}
                   </div>
                 </div>
              </motion.div>
            )}

            {/* ─── COMISIONES TAB ─────────────────────────────────────────────── */}
            {activeTab === "comisiones" && (
              <motion.div key="comisiones" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#333333] mb-1">Comisiones y Pagos</h2>
                  <p className="text-sm text-[#666666]">Defina los porcentajes de comisión por tipo de jugada</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {tipo:"Directo 2 cifras", pago:60,  com:10},
                    {tipo:"Directo 3 cifras", pago:500, com:10},
                    {tipo:"Pale",             pago:800, com:8},
                    {tipo:"Tripleta",         pago:5000,com:6},
                    {tipo:"Super Pale",       pago:1200,com:8},
                    {tipo:"Quiniela",         pago:15,  com:12},
                  ].map(c=>(
                    <div key={c.tipo} className="p-4 rounded-xl border border-[#F0F0EB] space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"><Percent size={12} className="text-emerald-500"/></div>
                        <p className="text-sm font-semibold text-[#333]">{c.tipo}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#999] uppercase mb-1">Pago (x$1)</label>
                          <input type="number" defaultValue={c.pago} className="w-full px-2 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4]"/>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#999] uppercase mb-1">Comisión %</label>
                          <input type="number" defaultValue={c.com} min={0} max={100} className="w-full px-2 py-1.5 border border-[#E5E5E0] rounded-lg text-xs focus:outline-none focus:border-[#4ECDC4]"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4] text-white text-sm font-semibold rounded-xl hover:bg-[#3DBDB5] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]">
                    <Save size={14}/> Guardar Comisiones
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── SISTEMA TAB ────────────────────────────────────────────────── */}
            {activeTab === "sistema" && (
              <motion.div key="sistema" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}
                className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#333333] mb-1">Sistema y Datos</h2>
                  <p className="text-sm text-[#666666]">Configuración avanzada del sistema NMV Lottery</p>
                </div>
                {([
                  {icon:<Volume2 size={16}/>,bg:"bg-teal-50",ic:"text-teal-600",title:"Sonidos del sistema",desc:"Reproducir sonidos al crear/pagar tickets",key:"sounds",val:true},
                  {icon:<VolumeX size={16}/>,bg:"bg-slate-50",ic:"text-slate-500",title:"Modo silencioso nocturno",desc:"Silenciar notificaciones entre 10pm - 7am",key:"silent",val:false},
                  {icon:<RefreshCw size={16}/>,bg:"bg-blue-50",ic:"text-blue-500",title:"Auto-actualizar Dashboard",desc:"Refrescar datos cada 30 segundos automáticamente",key:"autoRefresh",val:true},
                  {icon:<Database size={16}/>,bg:"bg-purple-50",ic:"text-purple-500",title:"Respaldo automático",desc:"Generar respaldo diario de datos a las 2:00 AM",key:"backup",val:true},
                ] as {icon:React.ReactNode;bg:string;ic:string;title:string;desc:string;key:string;val:boolean}[]).map(item=>(
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-[#F0F0EB] hover:border-[#4ECDC4]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.ic}`}>{item.icon}</div>
                      <div><p className="text-sm font-semibold text-[#333]">{item.title}</p><p className="text-xs text-[#999] mt-0.5">{item.desc}</p></div>
                    </div>
                     <button onClick={()=>setSisToggles(s=>({...s,[item.key]:!s[item.key]}))}
                       className={`relative w-11 h-6 rounded-full transition-all ${sisToggles[item.key]?"bg-[#4ECDC4] shadow-[0_0_8px_rgba(78,205,196,0.4)]":"bg-[#E5E5E0]"}`}>
                       <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${sisToggles[item.key]?"translate-x-5":"translate-x-0"}`}/>
                     </button>
                   </div>
                 ))}
                 <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                  <div className="flex items-center gap-2 mb-3"><AlertTriangle size={14} className="text-amber-500"/><p className="text-sm font-semibold text-amber-700">Zona de Peligro</p></div>
                  <div className="flex gap-3 flex-wrap">
                    <button className="px-4 py-2 text-xs font-semibold text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors">Limpiar caché del sistema</button>
                    <button className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Reiniciar contadores</button>
                    <button className="px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Exportar configuración</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PERMISOS DE BANCA TAB ──────────────────────────────────────── */}
            {activeTab === "permisos" && (
              <motion.div
                key="permisos"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <PermisosPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
