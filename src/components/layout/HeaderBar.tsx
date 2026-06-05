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
} from "lucide-react";
import { useAuthStore, useTranslation } from "@/store/authStore";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
  "/sortition-informations": "Sorteos",
  "/sortition-schedules": "Horario de Sorteos",
  "/betting-pool-play-monitor": "Monitoreo de Jugadas [F8]",
  "/zones": "Zonas",
  "/zones/new": "Crear Zona",
  "/zones/manage": "Manejar Zonas",
  "/accountable-entities": "Entidades Contables",
  "/mail-receptors": "Receptores de Correo",
  "/notifications/new": "Notificaciones",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeaderBar() {
  const location = useLocation();
  const { user, logout, notifications, unreadNotifications, language, setLanguage } = useAuthStore();
  const { t } = useTranslation();

  const [clock, setClock] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
      <header className="fixed top-0 right-0 left-[260px] z-30 h-[56px] bg-white border-b border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between px-6">
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
                      onClick={() => setShowUserMenu(false)}
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

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[56px] right-4 z-[45] w-80 bg-white rounded-xl border border-[#E5E5E0] shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0EB]">
              <h3 className="text-sm font-semibold text-[#333333]">
                {t("header.notifications")}
              </h3>
              <button
                onClick={() => setShowNotifPanel(false)}
                className="text-xs text-[#4ECDC4] hover:text-[#3DBDB5] font-medium"
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-[#999999] text-center py-8">
                  No hay notificaciones
                </p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-[#F0F0EB] last:border-0 ${
                      !notif.isRead ? "bg-[#F0F8F7]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notif.type === "error"
                            ? "bg-[#EF4444]"
                            : notif.type === "warning"
                              ? "bg-[#F59E0B]"
                              : notif.type === "success"
                                ? "bg-[#22C55E]"
                                : "bg-[#3B82F6]"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-[#333333]">
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#666666] mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
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
    </>
  );
}
