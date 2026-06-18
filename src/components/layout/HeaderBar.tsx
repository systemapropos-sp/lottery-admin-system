import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Bell,
  LogOut,
  Lock,
  ChevronRight,
  Globe,
  LayoutDashboard,
  Ticket,
  TrendingUp,
  Building2,
  Scale,
  CreditCard,
  Trophy,
  Users,
  Activity,
  UserX,
  Monitor,
  HandCoins,
  Calculator,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore, useTranslation } from "@/store/authStore";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PasswordChangeModal from "@/components/ui/PasswordChangeModal";

// ─── Route to Breadcrumb Map ──────────────────────────────────────────────────

const routeLabelMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sales/daily": "Ventas del dia",
  "/sales/historical": "Ventas Historico",
  "/sales/by-date": "Ventas por fecha",
  "/sales/zones": "Ventas por Zonas",
  "/play-type-prizes": "Premios por jugada",
  "/play-type-prizes-percentages": "Porcentajes",
  "/sales/betting-pool": "Ventas por Banca",
  "/tickets/create": "Crear Ticket",
  "/tickets": "Tickets",
  "/play-amounts": "Jugadas",
  "/winning-plays": "Jugadas ganadoras",
  "/blackboard": "Pizarra",
  "/anomalies": "Anomalias",
  "/results": "Resultados",
  "/betting-pools": "Bancas",
  "/betting-pools/new": "Crear Banca",
  "/betting-pools/mass-edit": "Edicion masiva de Bancas",
  "/betting-pool-access": "Acceso a Bancas",
  "/clean-pending-for-payment": "Limpiar pendientes",
  "/betting-pools-without-sales": "Bancas sin ventas",
  "/days-without-sales": "Dias sin venta",
  "/balances/betting-pools": "Balances de Bancas",
  "/balances/banks": "Balances de Bancos",
  "/users": "Usuarios",
  "/pool-users": "Usuarios de Banca",
  "/users/administrators": "Administradores",
  "/users/new": "Crear Usuario",
  "/login-logs": "Inicios de sesion",
  "/group-security/blocked-logins": "Sesiones bloqueadas",
  "/simplified-accountable-transaction-groups": "Cobros y Pagos",
  "/accountable-transactions": "Transacciones",
  "/limits": "Limites",
  "/limits/new": "Crear Limite",
  "/limits/automatic": "Limites automaticos",
  "/limits/numeros": "Límites de Números",
  "/limits/limitacion": "Limitación de Números",
  "/contabilidad": "Contabilidad",
  "/contabilidad/gastos": "Gastos",
  "/contabilidad/compras": "Compras",
  "/contabilidad/rentas": "Rentas",
  "/contabilidad/empleados": "Empleados",
  "/contabilidad/inversion": "Inversión",
  "/contabilidad/resumen": "Resumen General",
  "/prestamos": "Préstamos",
  "/activity-log": "Log de Operaciones",
  "/superadmin": "Panel Admin",
  "/sortition-informations": "Sorteos",
  "/sortition-schedules": "Horario de Sorteos",
  "/betting-pool-play-monitor": "Monitoreo de Jugadas [F8]",
  "/zones": "Zonas",
  "/zones/new": "Crear Zona",
  "/zones/manage": "Manejar Zonas",
  "/accountable-entities": "Entidades Contables",
  "/accountable-entities/new": "Crear Entidad",
  "/mail-receptors": "Receptores de Correo",
  "/mail-receptors/new": "Crear Receptor",
  "/movil/premios":          "Premios Móvil",
  "/notifications/new": "Notificaciones",
  "/settings": "Configuracion",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeaderBar() {
  const location = useLocation();
  const { user, logout, notifications, unreadNotifications, language, setLanguage, sidebarExpanded } = useAuthStore();
  const { t } = useTranslation();
  const sidebarW = sidebarExpanded ? 260 : 60;

  const navigate = useNavigate();
  const [clock, setClock] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Tooltip flotante (escapa overflow)
  const [tooltip, setTooltip] = useState<{label:string;x:number;y:number}|null>(null);

  // ─── Quick Toolbar Config ─────────────────────────────────────────────────
  // Orden: Acciones frecuentes → Operaciones → Admin → Reportes/Config
  const quickTools = [
    // Grupo 1 — Acciones frecuentes
    { icon: LayoutDashboard, label: "Inicio",             route: "/dashboard",           color: "text-gray-500",    bg: "hover:bg-gray-100"    },
    { icon: Ticket,          label: "Crear Ticket",        route: "/tickets/create",      color: "text-teal-600",    bg: "hover:bg-teal-50",  highlight: true },
    { icon: Monitor,         label: "Monitor Tickets",     route: "/betting-pool-play-monitor", color: "text-blue-600", bg: "hover:bg-blue-50"  },
    { icon: TrendingUp,      label: "Ventas del Día",      route: "/sales/daily",         color: "text-green-600",   bg: "hover:bg-green-50"    },
    { icon: Trophy,          label: "Resultados",          route: "/results",             color: "text-amber-600",   bg: "hover:bg-amber-50"    },
    // Grupo 2 — Operaciones financieras
    { icon: Building2,       label: "Bancas",              route: "/betting-pools",       color: "text-slate-600",   bg: "hover:bg-slate-100"   },
    { icon: Scale,           label: "Balances",            route: "/balances/betting-pools", color: "text-indigo-600", bg: "hover:bg-indigo-50" },
    { icon: CreditCard,      label: "Cobros / Pagos",      route: "/simplified-accountable-transaction-groups", color: "text-emerald-600", bg: "hover:bg-emerald-50" },
    { icon: HandCoins,       label: "Préstamos",           route: "/prestamos",           color: "text-orange-600",  bg: "hover:bg-orange-50"   },
    // Grupo 3 — Usuarios y Admin
    { icon: Users,           label: "Usuarios",            route: "/users",               color: "text-violet-600",  bg: "hover:bg-violet-50"   },
    { icon: Calculator,      label: "Contabilidad",        route: "/contabilidad",        color: "text-cyan-600",    bg: "hover:bg-cyan-50"     },
    { icon: CalendarDays,    label: "Sorteos",             route: "/sortition-informations", color: "text-purple-600", bg: "hover:bg-purple-50" },
    // Grupo 4 — Zonas, Notifs, Log
    { icon: MapPin,          label: "Zonas",               route: "/zones",               color: "text-pink-600",    bg: "hover:bg-pink-50"     },
    { icon: Bell,            label: "Notificaciones",      route: "/notifications/new",   color: "text-sky-600",     bg: "hover:bg-sky-50"      },
    { icon: Activity,        label: "Log Operaciones",     route: "/activity-log",        color: "text-rose-600",    bg: "hover:bg-rose-50"     },
    { icon: UserX,           label: "Sesiones Bloqueadas", route: "/group-security/blocked-logins", color: "text-red-600", bg: "hover:bg-red-50" },
  ];

  // Live clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      const pad = (n: number) => n.toString().padStart(2, "0");
      setClock(`${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Build breadcrumb
  const breadcrumb = (() => {
    const path = location.pathname;
    const label = routeLabelMap[path] ?? path;
    if (path === "/dashboard") {
      return [{ label: "Inicio", route: "/dashboard" }];
    }
    return [
      { label: "Inicio", route: "/dashboard" },
      { label, route: path },
    ];
  })();

  return (
    <>
      <header
        className="fixed top-0 right-0 z-30 h-[56px] bg-white border-b border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between px-6"
        style={{ left: sidebarW, transition: "left 0.25s ease-out" }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumb.map((crumb, idx) => (
            <span key={crumb.route} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight size={14} className="text-[#CCCCCC]" />
              )}
              <a
                href={`/#${crumb.route}`}
                className={`transition-colors ${
                  idx === breadcrumb.length - 1
                    ? "text-[#333333] font-medium"
                    : "text-[#999999] hover:text-[#4ECDC4]"
                }`}
              >
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <span className="text-sm font-mono text-[#666666] tabular-nums hidden sm:inline">
            {clock}
          </span>

          <div className="w-px h-6 bg-[#E5E5E0] hidden sm:block" />

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-1 text-xs font-medium text-[#666666] hover:text-[#4ECDC4] transition-colors px-2 py-1 rounded-lg hover:bg-[#F5F5F0]"
            title={language === "es" ? "Switch to English" : "Cambiar a Espanol"}
          >
            <Globe size={14} />
            <span>{language === "es" ? "ES" : "EN"}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[#F5F5F0] transition-colors"
            title={t("header.settings")}
          >
            <Settings size={18} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifPanel((s) => !s)}
            className="relative p-2 rounded-lg text-[#666666] hover:text-[#4ECDC4] hover:bg-[#F5F5F0] transition-colors"
            title={t("header.notifications")}
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((s) => !s)}
              className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-lg hover:bg-[#F5F5F0] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#4ECDC4] flex items-center justify-center text-white font-bold text-xs">
                {user?.username?.slice(0, 2).toUpperCase() ?? "AD"}
              </div>
              <span className="text-sm font-medium text-[#333333] hidden md:inline">
                {user?.username ?? "admin"}
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#E5E5E0] shadow-lg z-50 py-1 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-[#F0F0EB]">
                      <p className="text-sm font-medium text-[#333333]">
                        {user?.fullName ?? user?.username ?? "Admin"}
                      </p>
                      <p className="text-xs text-[#999999]">
                        {user?.email ?? ""}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#666666] hover:bg-[#F5F5F0] hover:text-[#333333] transition-colors text-left"
                    >
                      <Lock size={14} />
                      {t("header.changePassword")}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutDialog(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEE2E2] transition-colors text-left"
                    >
                      <LogOut size={14} />
                      {t("header.logout")}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Quick Access Toolbar ─────────────────────────────────────────── */}
      <div
        className="fixed bg-white border-b border-[#E5E5E0]"
        style={{
          top: 56,
          left: sidebarW,
          right: 0,
          transition: "left 0.25s ease-out",
          height: 55,
          zIndex: 29,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 16,
          gap: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        }}
      >
        {/* Divider left */}
        <div className="w-px h-7 bg-gray-100 mr-1 flex-shrink-0" />

        <div className="flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {quickTools.map((tool, i) => {
            if (!tool) return null;
            const IconEl = tool.icon;
            const isActive = location.pathname === tool.route;
            // Dividers: after groups (5,4,4,3 = indices 5,9,12)
            const dividerBefore = i === 5 || i === 9 || i === 12;
            return (
              <div key={tool.route} className="flex items-center gap-0.5">
                {dividerBefore && (
                  <div className="w-px h-6 bg-gray-200/80 mx-1 flex-shrink-0" />
                )}
                <button
                  onClick={() => navigate(tool.route)}
                  title={tool.label}
                  onMouseEnter={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setTooltip({ label: tool.label, x: r.left + r.width / 2, y: r.bottom + 6 });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  className={`relative flex items-center justify-center w-[42px] h-[42px] rounded-xl transition-all duration-150 flex-shrink-0 ${
                    isActive
                      ? "bg-gradient-to-br from-[#E0F7F5] to-[#DBEAFE] shadow-sm border border-[#4ECDC4]/30 scale-105"
                      : (tool as {highlight?:boolean}).highlight
                        ? "bg-gradient-to-br from-[#4ECDC4] to-[#0EA5E9] shadow-[0_2px_8px_rgba(78,205,196,0.35)] hover:shadow-[0_4px_12px_rgba(78,205,196,0.5)] hover:scale-110 active:scale-95"
                        : `${tool.bg} hover:scale-105 hover:shadow-sm active:scale-95`
                  }`}
                >
                  <IconEl
                    size={20}
                    className={
                      isActive ? "text-teal-600"
                      : (tool as {highlight?:boolean}).highlight ? "text-white"
                      : tool.color
                    }
                    strokeWidth={isActive || (tool as {highlight?:boolean}).highlight ? 2.3 : 1.8}
                  />
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-[3px] rounded-full bg-[#4ECDC4]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right status */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 flex-shrink-0 ml-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="hidden md:inline text-green-600">En línea</span>
        </div>
      </div>

      {/* ── Floating Tooltip (escapa overflow del toolbar) ───────────── */}
      {tooltip && (
        <div
          style={{ position: "fixed", left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)", zIndex: 9999, pointerEvents: "none" }}
          className="px-2.5 py-1.5 text-[11px] font-semibold text-white bg-gray-900 rounded-lg whitespace-nowrap shadow-lg"
        >
          {tooltip.label}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}

      {/* ── Notification Modal (estilo DonBest / NMV) ─────────────────── */}
      <AnimatePresence>
        {showNotifPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNotifPanel(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
                style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E293B 100%)" }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {/* NMV Logo badge */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
                      style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}>
                      N
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">NMV Lottery</p>
                      <p className="text-white/40 text-[10px]">Centro de Notificaciones</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifications > 0 && (
                      <button
                        onClick={() => useAuthStore.getState().markAllNotificationsRead()}
                        className="text-[11px] text-[#14B8A6] hover:text-[#2DD4BF] font-semibold transition-colors"
                      >
                        Marcar leídas
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifPanel(false)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Notifications list */}
                <div className="max-h-[340px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}>
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-3">
                        <Bell size={22} className="text-white/30" />
                      </div>
                      <p className="text-white/50 text-sm font-medium">Sin notificaciones</p>
                      <p className="text-white/25 text-xs mt-1">Las alertas aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.06]">
                      {notifications.map((notif) => {
                        const colors = {
                          error:   { dot: "bg-red-500",    ring: "border-red-500/20   bg-red-500/10"   },
                          warning: { dot: "bg-amber-400",  ring: "border-amber-400/20 bg-amber-400/10"  },
                          success: { dot: "bg-emerald-400",ring: "border-emerald-400/20 bg-emerald-400/10"},
                          info:    { dot: "bg-sky-400",    ring: "border-sky-400/20   bg-sky-400/10"   },
                        };
                        const c = colors[notif.type] ?? colors.info;
                        return (
                          <div key={notif.id}
                            className={`px-5 py-4 transition-colors ${!notif.isRead ? "bg-white/[0.04]" : ""} hover:bg-white/[0.06]`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${c.ring}`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <p className={`text-sm font-semibold leading-tight ${!notif.isRead ? "text-white" : "text-white/70"}`}>
                                    {notif.title}
                                  </p>
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }} />
                                  )}
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-white/25 mt-1.5">{new Date(notif.createdAt).toLocaleString("es-DO", { hour:"2-digit", minute:"2-digit", month:"short", day:"numeric" })}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center gap-3 px-5 py-4 border-t border-white/10">
                  <button
                    onClick={() => { navigate("/notifications/new"); setShowNotifPanel(false); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#14B8A6,#0EA5E9)" }}
                  >
                    Ver todas
                  </button>
                  <button
                    onClick={() => setShowNotifPanel(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10 hover:bg-white/[0.06] hover:text-white transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Cerrar sesion"
        message="Estas seguro de que deseas cerrar la sesion?"
        confirmLabel="Cerrar sesion"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => {
          setShowLogoutDialog(false);
          logout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
