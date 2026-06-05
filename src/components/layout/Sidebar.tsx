import { useCallback } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router";
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
  Keyboard,
  MapPin,
  BookOpen,
  Mail,
  Bell,
  ChevronDown,
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
}

const menuGroups: MenuGroup[] = [
  {
    key: "inicio",
    labelKey: "nav.inicio",
    icon: LayoutDashboard,
    route: "/dashboard",
  },
  {
    key: "ventas",
    labelKey: "nav.ventas",
    icon: DollarSign,
    items: [
      { labelKey: "nav.sales.daily", route: "/sales/daily" },
      { labelKey: "nav.sales.historical", route: "/sales/historical" },
      { labelKey: "nav.sales.by-date", route: "/sales/by-date" },
      { labelKey: "nav.sales.prizes", route: "/play-type-prizes" },
      { labelKey: "nav.sales.percentages", route: "/play-type-prizes-percentages" },
      { labelKey: "nav.sales.pools", route: "/sales/betting-pool" },
      { labelKey: "nav.sales.zones", route: "/sales/zones" },
    ],
  },
  {
    key: "tickets",
    labelKey: "nav.tickets",
    icon: Ticket,
    items: [
      { labelKey: "nav.tickets.create", route: "/tickets/create" },
      { labelKey: "nav.tickets.monitor", route: "/betting-pool-play-monitor" },
      { labelKey: "nav.tickets.plays", route: "/play-amounts" },
      { labelKey: "nav.tickets.winners", route: "/winning-plays" },
      { labelKey: "nav.tickets.blackboard", route: "/blackboard" },
      { labelKey: "nav.tickets.anomalies", route: "/anomalies" },
    ],
  },
  {
    key: "resultados",
    labelKey: "nav.resultados",
    icon: Trophy,
    route: "/results",
  },
  {
    key: "bancas",
    labelKey: "nav.bancas",
    icon: Building2,
    items: [
      { labelKey: "nav.pools.list", route: "/betting-pools" },
      { labelKey: "nav.pools.create", route: "/betting-pools/new" },
      { labelKey: "nav.pools.mass-edit", route: "/betting-pools/mass-edit" },
      { labelKey: "nav.pools.access", route: "/betting-pool-access" },
      { labelKey: "nav.pools.clean", route: "/clean-pending-for-payment" },
      { labelKey: "nav.pools.no-sales", route: "/betting-pools-without-sales" },
      { labelKey: "nav.pools.days-report", route: "/days-without-sales" },
    ],
  },
  {
    key: "balances",
    labelKey: "nav.balances",
    icon: Scale,
    items: [
      { labelKey: "nav.balances.pools", route: "/balances/betting-pools" },
      { labelKey: "nav.balances.banks", route: "/balances/banks" },
    ],
  },
  {
    key: "usuarios",
    labelKey: "nav.usuarios",
    icon: Users,
    items: [
      { labelKey: "nav.users.list", route: "/users" },
      { labelKey: "nav.users.pools", route: "/pool-users" },
      { labelKey: "nav.users.admins", route: "/users/administrators" },
      { labelKey: "nav.users.create", route: "/users/new" },
      { labelKey: "nav.users.login-logs", route: "/login-logs" },
      { labelKey: "nav.users.blocked", route: "/group-security/blocked-logins" },
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
      { labelKey: "nav.transactions.list", route: "/accountable-transactions" },
      { labelKey: "nav.transactions.groups", route: "/accountable-transactions/groups" },
      { labelKey: "nav.transactions.summary", route: "/accountable-transactions/summary" },
      { labelKey: "nav.transactions.pools", route: "/accountable-transactions/pools" },
      { labelKey: "nav.transactions.categories", route: "/accountable-transactions/categories" },
    ],
  },
  {
    key: "limites",
    labelKey: "nav.limites",
    icon: Shield,
    items: [
      { labelKey: "nav.limits.list", route: "/limits" },
      { labelKey: "nav.limits.create", route: "/limits/new" },
      { labelKey: "nav.limits.automatic", route: "/limits/automatic" },
    ],
  },
  {
    key: "sorteos",
    labelKey: "nav.sorteos",
    icon: CalendarDays,
    badge: "F8",
    items: [
      { labelKey: "nav.sorteos.list", route: "/sortition-informations" },
      { labelKey: "nav.sorteos.schedule", route: "/sortition-schedules" },
    ],
  },
  {
    key: "f8",
    labelKey: "nav.sorteos",
    icon: Keyboard,
    route: "/betting-pool-play-monitor",
  },
  {
    key: "zonas",
    labelKey: "nav.zonas",
    icon: MapPin,
    items: [
      { labelKey: "nav.zones.list", route: "/zones" },
      { labelKey: "nav.zones.create", route: "/zones/new" },
      { labelKey: "nav.zones.manage", route: "/zones/manage" },
    ],
  },
  {
    key: "entidades",
    labelKey: "nav.entidades",
    icon: BookOpen,
    items: [
      { labelKey: "nav.entities.list", route: "/accountable-entities" },
      { labelKey: "nav.entities.create", route: "/accountable-entities/new" },
    ],
  },
  {
    key: "receptores",
    labelKey: "nav.receptores",
    icon: Mail,
    items: [
      { labelKey: "nav.receptores.list", route: "/mail-receptors" },
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
  const { expandedGroups, toggleGroup } = useAuthStore();
  const { t } = useTranslation();

  const isActiveRoute = useCallback(
    (route: string) => {
      return location.pathname === route;
    },
    [location.pathname]
  );

  const hasActiveChild = useCallback(
    (items: SubMenuItem[]) => {
      return items.some((item) => location.pathname === item.route);
    },
    [location.pathname]
  );

  return (
    <aside
      className="fixed top-0 left-0 z-40 h-full w-[260px] bg-[#2D2D2D] flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="h-[60px] flex items-center justify-center border-b border-[#3A3A3A] flex-shrink-0">
        <Link to="/dashboard" className="text-white text-xl font-bold tracking-[0.15em] select-none">
          LOTTERY
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
        {menuGroups.map((group) => {
          const Icon = group.icon;
          const isGroupActive = group.route
            ? isActiveRoute(group.route)
            : group.items
              ? hasActiveChild(group.items)
              : false;
          const isExpanded = expandedGroups[group.key] ?? false;

          // Direct link group (no submenu)
          if (group.route && !group.items) {
            return (
              <Link
                key={group.key}
                to={group.route}
                className={`flex items-center gap-3 px-5 h-11 text-sm transition-colors relative ${
                  isGroupActive
                    ? "text-white bg-[#1E1E1E]"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A]"
                }`}
              >
                {isGroupActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4ECDC4]"
                    transition={{ duration: 0.15 }}
                  />
                )}
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium uppercase tracking-[0.05em] text-xs">
                  {t(group.labelKey)}
                </span>
                {group.badge && (
                  <span className="ml-auto text-[10px] font-semibold text-[#4ECDC4] bg-[#4ECDC4]/10 px-1.5 py-0.5 rounded">
                    [{group.badge}]
                  </span>
                )}
              </Link>
            );
          }

          // Expandable group
          return (
            <div key={group.key}>
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center gap-3 px-5 h-11 text-sm transition-colors relative ${
                  isGroupActive || isExpanded
                    ? "text-white bg-[#1E1E1E]"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A]"
                }`}
              >
                {(isGroupActive || isExpanded) && (
                  <motion.div
                    layoutId={`sidebar-active-${group.key}`}
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4ECDC4]"
                    transition={{ duration: 0.15 }}
                  />
                )}
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium uppercase tracking-[0.05em] text-xs flex-1 text-left">
                  {t(group.labelKey)}
                </span>
                {group.badge && (
                  <span className="text-[10px] font-semibold text-[#4ECDC4] bg-[#4ECDC4]/10 px-1.5 py-0.5 rounded mr-2">
                    [{group.badge}]
                  </span>
                )}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              {/* Submenu */}
              <AnimatePresence initial={false}>
                {isExpanded && group.items && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-l-[2px] border-[#3A3A3A] ml-7 my-1">
                      {group.items.map((item) => {
                        const itemActive = isActiveRoute(item.route);
                        return (
                          <Link
                            key={item.route}
                            to={item.route}
                            className={`flex items-center pl-5 pr-4 h-9 text-sm transition-colors ${
                              itemActive
                                ? "text-[#4ECDC4] bg-[#1E1E1E]"
                                : "text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A]"
                            }`}
                          >
                            <span className="truncate">{t(item.labelKey)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Mini profile at bottom */}
      <div className="border-t border-[#3A3A3A] p-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#4ECDC4] flex items-center justify-center text-[#2D2D2D] font-bold text-xs flex-shrink-0">
            {useAuthStore.getState().user?.username?.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">
              {useAuthStore.getState().user?.username ?? "Admin"}
            </p>
            <p className="text-[10px] text-[#A0A0A0] truncate">
              {useAuthStore.getState().user?.role ?? "Superadmin"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
