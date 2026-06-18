import { useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  DollarSign,
  Ticket,
  Trophy,
  Building2,
  Scale,
  Users,
  CreditCard,
  Receipt,
  Shield,
  CalendarDays,
  MapPin,
  BookOpen,
  Mail,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  HandCoins,
  Calculator,
  Pin,
  Activity,
  Smartphone,
  Wallet,
  Settings,
} from "lucide-react";
import { useAuthStore, useTranslation } from "@/store/authStore";

// ─── Menu Structure ───────────────────────────────────────────────────────────

interface SubMenuItem {
  labelKey: import("@/store/authStore").TranslationKey;
  route: string;
}

interface MenuGroup {
  key: string;
  labelKey: import("@/store/authStore").TranslationKey;
  icon: React.ElementType;
  route?: string;
  items?: SubMenuItem[];
  badge?: string;
  section?: string;
}

const menuGroups: MenuGroup[] = [
  // ── SUPERADMIN ──
  {
    key: "superadmin",
    labelKey: "nav.superadmin.panel",
    icon: Shield,
    route: "/superadmin",
    section: "SUPERADMIN",
  },
  // ── PRINCIPAL ──
  {
    key: "inicio",
    labelKey: "nav.inicio",
    icon: LayoutDashboard,
    route: "/dashboard",
    section: "PRINCIPAL",
  },
  // ── REPORTES ──
  {
    key: "ventas",
    labelKey: "nav.ventas",
    icon: DollarSign,
    section: "REPORTES",
    items: [
      { labelKey: "nav.sales.daily",       route: "/sales/daily" },
      { labelKey: "nav.sales.historical",  route: "/sales/historical" },
      { labelKey: "nav.sales.by-date",     route: "/sales/by-date" },
      { labelKey: "nav.sales.prizes",      route: "/play-type-prizes" },
      { labelKey: "nav.sales.percentages", route: "/play-type-prizes-percentages" },
      { labelKey: "nav.sales.pools",       route: "/sales/betting-pool" },
      { labelKey: "nav.sales.zones",       route: "/sales/zones" },
    ],
  },
  {
    key: "tickets",
    labelKey: "nav.tickets",
    icon: Ticket,
    items: [
      { labelKey: "nav.tickets.create",     route: "/tickets/create" },
      { labelKey: "nav.tickets.monitor",    route: "/betting-pool-play-monitor" },
      { labelKey: "nav.tickets.plays",      route: "/play-amounts" },
      { labelKey: "nav.tickets.winners",    route: "/winning-plays" },
      { labelKey: "nav.tickets.blackboard", route: "/blackboard" },
      { labelKey: "nav.tickets.anomalies",  route: "/anomalies" },
    ],
  },
  {
    key: "resultados",
    labelKey: "nav.resultados",
    icon: Trophy,
    route: "/results",
  },
  // ── GESTIÓN ──
  {
    key: "movil",
    labelKey: "nav.movil",
    icon: Smartphone,
    section: "GESTIÓN",
    items: [
      { labelKey: "nav.movil.crear-cliente", route: "/movil/crear-cliente" },
      { labelKey: "nav.movil.clientes",      route: "/movil/clientes" },
      { labelKey: "nav.movil.retiro",        route: "/movil/retiro" },
      { labelKey: "nav.movil.recargas",      route: "/movil/recargas" },
      { labelKey: "nav.movil.cancelar",      route: "/movil/cancelar-recarga" },
      { labelKey: "nav.movil.tickets",       route: "/movil/tickets" },
      { labelKey: "nav.movil.premios",       route: "/movil/premios" },
      { labelKey: "nav.movil.reporte",       route: "/movil/reporte" },
    ],
  },
  {
    key: "cobradores",
    labelKey: "nav.cobradores",
    icon: Wallet,
    route: "/cobradores",
  },
  {
    key: "bancas",
    labelKey: "nav.bancas",
    icon: Building2,
    items: [
      { labelKey: "nav.pools.list",        route: "/betting-pools" },
      { labelKey: "nav.pools.create",      route: "/betting-pools/new" },
      { labelKey: "nav.pools.mass-edit",   route: "/betting-pools/mass-edit" },
      { labelKey: "nav.pools.access",      route: "/betting-pool-access" },
      { labelKey: "nav.pools.clean",       route: "/clean-pending-for-payment" },
      { labelKey: "nav.pools.no-sales",    route: "/betting-pools-without-sales" },
      { labelKey: "nav.pools.days-report", route: "/days-without-sales" },
    ],
  },
  {
    key: "usuarios",
    labelKey: "nav.usuarios",
    icon: Users,
    items: [
      { labelKey: "nav.users.list",        route: "/users" },
      { labelKey: "nav.users.admins",      route: "/users/administrators" },
      { labelKey: "nav.users.create",      route: "/users/new" },
      { labelKey: "nav.users.login-logs",  route: "/login-logs" },
    ],
  },
  // ── FINANZAS ──
  {
    key: "balances",
    labelKey: "nav.balances",
    icon: Scale,
    section: "FINANZAS",
    items: [
      { labelKey: "nav.balances.pools", route: "/balances/betting-pools" },
      { labelKey: "nav.balances.banks", route: "/balances/banks" },
    ],
  },
  {
    key: "cobros",
    labelKey: "nav.cobros",
    icon: CreditCard,
    items: [
      { labelKey: "nav.payments.list", route: "/simplified-accountable-transaction-groups" },
    ],
  },
  {
    key: "transacciones",
    labelKey: "nav.transacciones",
    icon: Receipt,
    items: [
      { labelKey: "nav.transactions.list",       route: "/accountable-transactions" },
      { labelKey: "nav.transactions.groups",     route: "/accountable-transactions/groups" },
      { labelKey: "nav.transactions.summary",    route: "/accountable-transactions/summary" },
      { labelKey: "nav.transactions.categories", route: "/accountable-transactions/categories" },
    ],
  },
  {
    key: "contabilidad",
    labelKey: "nav.contabilidad",
    icon: Calculator,
    route: "/contabilidad",
  },
  {
    key: "prestamos",
    labelKey: "nav.prestamos",
    icon: HandCoins,
    route: "/prestamos",
  },
  {
    key: "log",
    labelKey: "nav.log",
    icon: Activity,
    route: "/activity-log",
  },
  // ── SISTEMA ──
  {
    key: "limites",
    labelKey: "nav.limites",
    icon: Shield,
    section: "SISTEMA",
    items: [
      { labelKey: "nav.limits.list",      route: "/limits" },
      { labelKey: "nav.limits.create",    route: "/limits/new" },
      { labelKey: "nav.limits.automatic", route: "/limits/automatic" },
      { labelKey: "nav.limits.delete",    route: "/limits/delete" },
      { labelKey: "nav.limits.numeros",   route: "/limits/numeros" },
      { labelKey: "nav.limits.limitacion", route: "/limits/limitacion" },
    ],
  },
  {
    key: "sorteos",
    labelKey: "nav.sorteos",
    icon: CalendarDays,
    badge: "F8",
    items: [
      { labelKey: "nav.sorteos.list",     route: "/sortition-informations" },
      { labelKey: "nav.sorteos.schedule", route: "/sortition-schedules" },
    ],
  },
  {
    key: "zonas",
    labelKey: "nav.zonas",
    icon: MapPin,
    items: [
      { labelKey: "nav.zones.list",   route: "/zones" },
      { labelKey: "nav.zones.create", route: "/zones/new" },
    ],
  },
  {
    key: "entidades",
    labelKey: "nav.entidades",
    icon: BookOpen,
    route: "/accountable-entities",
    items: [
      { labelKey: "nav.entities.bancas",    route: "/accountable-entities/bancas" },
      { labelKey: "nav.entities.empleados", route: "/accountable-entities/empleados" },
      { labelKey: "nav.entities.bancos",    route: "/accountable-entities/bancos" },
      { labelKey: "nav.entities.zonas",     route: "/accountable-entities/zonas" },
      { labelKey: "nav.entities.otros",     route: "/accountable-entities/otros" },
      { labelKey: "nav.entities.create",    route: "/accountable-entities/new" },
    ],
  },
  {
    key: "receptores",
    labelKey: "nav.receptores",
    icon: Mail,
    items: [
      { labelKey: "nav.receptores.list",   route: "/mail-receptors" },
      { labelKey: "nav.receptores.create", route: "/mail-receptors/new" },
    ],
  },
  {
    key: "notificaciones",
    labelKey: "nav.notificaciones",
    icon: Bell,
    route: "/notifications/new",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expandedGroups, toggleGroup, sidebarExpanded, toggleSidebar, sidebarPinned, toggleSidebarPin } = useAuthStore();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  // ── Hover open / close (disabled when pinned) ──────────────────────────────
  const handleMouseEnter = useCallback(() => {
    const { sidebarExpanded: exp, sidebarPinned: pinned, toggleSidebar: toggle } = useAuthStore.getState();
    if (!exp && !pinned) toggle();
  }, []);

  const handleMouseLeave = useCallback(() => {
    const { sidebarExpanded: exp, sidebarPinned: pinned, toggleSidebar: toggle } = useAuthStore.getState();
    if (exp && !pinned) toggle();
  }, []);

  // Keep resetAutoCollapse as a no-op so existing call sites don't break
  const resetAutoCollapse = useCallback(() => {}, []);

  const isActiveRoute = useCallback(
    (route: string) => location.pathname === route,
    [location.pathname]
  );

  const hasActiveChild = useCallback(
    (items: SubMenuItem[]) => items.some((item) => location.pathname === item.route),
    [location.pathname]
  );

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "AD";
  const w = sidebarExpanded ? 260 : 60;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed top-0 left-0 z-40 h-full flex flex-col overflow-hidden bg-[#0F172A]"
      style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.35)", width: w }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Logo + Toggle ──────────────────────────────────────────────── */}
      <div className="h-[64px] flex items-center px-3 flex-shrink-0 border-b border-white/[0.06]">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 group select-none flex-1 min-w-0"
          onClick={resetAutoCollapse}
        >
          {/* Icon badge */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)" }}
          >
            <span className="text-white font-black text-sm leading-none">N</span>
          </div>
          {/* Brand text */}
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col leading-none overflow-hidden"
              >
                <span className="text-white font-bold text-sm tracking-wider whitespace-nowrap">NMV</span>
                <span className="text-[#94A3B8] text-[10px] tracking-[0.15em] uppercase whitespace-nowrap">Lottery</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        {/* Pin button (visible when expanded) */}
        {sidebarExpanded && (
          <button
            onClick={toggleSidebarPin}
            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors mr-0.5 ${
              sidebarPinned
                ? "text-[#14B8A6] bg-[#14B8A6]/20 hover:bg-[#14B8A6]/30"
                : "text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.06]"
            }`}
            title={sidebarPinned ? "Desfijar menú" : "Fijar menú (no colapsar)"}
          >
            <Pin size={13} className={sidebarPinned ? "fill-[#14B8A6]" : ""} />
          </button>
        )}
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
            sidebarExpanded
              ? "text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.06]"
              : "text-[#94A3B8] bg-[#14B8A6]/20 hover:bg-[#14B8A6]/35 hover:text-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.25)]"
          }`}
          title={sidebarExpanded ? "Colapsar menú" : "Expandir menú"}
        >
          {sidebarExpanded
            ? <PanelLeftClose size={15} />
            : <PanelLeftOpen size={15} />
          }
        </button>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5"
        style={{ scrollbarWidth: "none", paddingLeft: sidebarExpanded ? "12px" : "6px", paddingRight: sidebarExpanded ? "12px" : "6px" }}
        onClick={resetAutoCollapse}
      >
        {menuGroups.map((group, idx) => {
          const Icon = group.icon;
          const isGroupActive = group.route
            ? isActiveRoute(group.route)
            : group.items
              ? hasActiveChild(group.items)
              : false;
          const isExpanded = expandedGroups[group.key] ?? false;

          const prevGroup = idx > 0 ? menuGroups[idx - 1] : null;
          const showSection = sidebarExpanded && group.section && group.section !== prevGroup?.section;

          return (
            <div key={group.key}>
              {/* Section label */}
              {showSection && (
                <div className={`px-2 pb-1.5 ${idx === 0 ? "pt-1" : "pt-4"}`}>
                  <span className="text-[10px] font-semibold tracking-[0.12em] text-[#475569] uppercase">
                    {group.section}
                  </span>
                </div>
              )}

              {/* Direct link */}
              {group.route && !group.items ? (
                <Link
                  to={group.route}
                  title={!sidebarExpanded ? t(group.labelKey) : undefined}
                  className={`flex items-center gap-3 h-10 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                    sidebarExpanded ? "px-3" : "px-1.5 justify-center"
                  } ${isGroupActive ? "text-white" : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"}`}
                  style={isGroupActive ? {
                    background: "linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(14,165,233,0.15) 100%)",
                  } : {}}
                >
                  {isGroupActive && sidebarExpanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-[#14B8A6] to-[#0EA5E9]" />
                  )}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isGroupActive
                      ? "bg-gradient-to-br from-[#14B8A6] to-[#0EA5E9]"
                      : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                  }`}>
                    <Icon size={14} className={isGroupActive ? "text-white" : "text-[#94A3B8] group-hover:text-white"} />
                  </div>
                  <AnimatePresence>
                    {sidebarExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t(group.labelKey)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {sidebarExpanded && group.badge && (
                    <span className="text-[9px] font-bold text-[#14B8A6] bg-[#14B8A6]/15 border border-[#14B8A6]/30 px-1.5 py-0.5 rounded-md">
                      {group.badge}
                    </span>
                  )}
                </Link>
              ) : (
                /* Expandable group */
                <div>
                  <button
                    onClick={() => {
                      if (sidebarExpanded) {
                        toggleGroup(group.key);
                        if (group.route) navigate(group.route);
                      } else {
                        toggleSidebar();
                        if (group.route) navigate(group.route);
                      }
                    }}
                    title={!sidebarExpanded ? t(group.labelKey) : undefined}
                    className={`w-full flex items-center gap-3 h-10 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                      sidebarExpanded ? "px-3" : "px-1.5 justify-center"
                    } ${isGroupActive || isExpanded ? "text-white" : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"}`}
                    style={isGroupActive && !isExpanded ? {
                      background: "linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(14,165,233,0.15) 100%)",
                    } : isExpanded ? {
                      background: "rgba(255,255,255,0.04)",
                    } : {}}
                  >
                    {isGroupActive && !isExpanded && sidebarExpanded && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-[#14B8A6] to-[#0EA5E9]" />
                    )}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isGroupActive || isExpanded
                        ? "bg-gradient-to-br from-[#14B8A6] to-[#0EA5E9]"
                        : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                    }`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <AnimatePresence>
                      {sidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {t(group.labelKey)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {sidebarExpanded && group.badge && (
                      <span className="text-[9px] font-bold text-[#14B8A6] bg-[#14B8A6]/15 border border-[#14B8A6]/30 px-1.5 py-0.5 rounded-md mr-1">
                        {group.badge}
                      </span>
                    )}
                    {sidebarExpanded && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`flex-shrink-0 ${isExpanded ? "text-[#14B8A6]" : "text-[#475569]"}`}
                      >
                        <ChevronRight size={13} />
                      </motion.div>
                    )}
                  </button>

                  {/* Submenu (only when expanded) */}
                  <AnimatePresence initial={false}>
                    {sidebarExpanded && isExpanded && group.items && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-0.5 mb-1 ml-[14px] pl-3 border-l border-white/[0.08] space-y-0.5">
                          {group.items.map((item) => {
                            const itemActive = isActiveRoute(item.route);
                            return (
                              <Link
                                key={item.route}
                                to={item.route}
                                className={`flex items-center gap-2 px-3 h-8 rounded-lg text-[13px] transition-all duration-150 ${
                                  itemActive
                                    ? "text-[#2DD4BF] bg-[#14B8A6]/10 font-medium"
                                    : "text-[#64748B] hover:text-[#CBD5E1] hover:bg-white/[0.05]"
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  itemActive ? "bg-[#14B8A6]" : "bg-[#334155]"
                                }`} />
                                <span className="truncate leading-none">{t(item.labelKey)}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Settings link ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-3 pb-1 pt-2 border-t border-white/[0.06]">
        <Link
          to="/settings"
          title={!sidebarExpanded ? "Configuracion · Permisos" : undefined}
          className={`flex items-center gap-3 h-10 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
            sidebarExpanded ? "px-3" : "px-1.5 justify-center"
          } ${isActiveRoute("/settings")
              ? "text-white"
              : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"
          }`}
          style={isActiveRoute("/settings") ? {
            background: "linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(14,165,233,0.15) 100%)",
          } : {}}
        >
          {isActiveRoute("/settings") && sidebarExpanded && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-[#14B8A6] to-[#0EA5E9]" />
          )}
          <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            isActiveRoute("/settings")
              ? "bg-gradient-to-br from-[#14B8A6] to-[#0EA5E9]"
              : "bg-white/[0.06] group-hover:bg-white/[0.1]"
          }`}>
            <Settings size={14} className={isActiveRoute("/settings") ? "text-white" : "text-[#94A3B8] group-hover:text-white"} />
          </div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Configuracion
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ── User card ────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3">
        <div className={`flex items-center gap-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-default px-2 py-2 ${!sidebarExpanded && "justify-center"}`}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)" }}
          >
            {initials}
          </div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-[13px] text-white font-semibold truncate leading-none mb-0.5 whitespace-nowrap">
                  {user?.username ?? "Admin"}
                </p>
                <span className="text-[10px] font-medium text-[#14B8A6] bg-[#14B8A6]/15 px-1.5 py-0.5 rounded-md capitalize whitespace-nowrap">
                  {user?.role ?? "superadmin"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
