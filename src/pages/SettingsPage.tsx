import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Palette,
  Globe,
  Eye,
  EyeOff,
  Bell,
  Moon,
  Sun,
  Save,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { QuickAccessSettings } from "@/components/quick-access";

const tabs = [
  { key: "password", label: "Cambiar contrasena", icon: Lock },
  { key: "preferences", label: "Preferencias", icon: Palette },
  { key: "language", label: "Idioma", icon: Globe },
  { key: "quickaccess", label: "Accesos rapidos", icon: Zap },
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
    <div className="max-w-4xl mx-auto">
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
