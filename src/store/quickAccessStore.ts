import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickAccessItem {
  id: string;
  label: string;
  icon: string; // lucide icon name
  route: string;
  color: string; // icon color
}

// ─── Default Available Items (pool of all possible shortcuts) ─────────────────

export const DEFAULT_AVAILABLE_ITEMS: QuickAccessItem[] = [
  { id: "dashboard",      label: "Dashboard",          icon: "LayoutDashboard", route: "/dashboard",                        color: "#6366F1" },
  { id: "pizarra",        label: "Pizarra Tickets",    icon: "FileText",        route: "/tickets/pizarra",                  color: "#14B8A6" },
  { id: "ventas",         label: "Crear Ticket",       icon: "Ticket",          route: "/tickets/crear",                    color: "#0EA5E9" },
  { id: "resultados",     label: "Resultados",         icon: "Trophy",          route: "/resultados",                       color: "#F59E0B" },
  { id: "sorteos",        label: "Lista Sorteos",      icon: "CalendarDays",    route: "/sorteos/lista",                    color: "#8B5CF6" },
  { id: "horarios",       label: "Horario Sorteos",    icon: "Clock",           route: "/sorteos/horarios",                 color: "#EC4899" },
  { id: "bancas",         label: "Bancas",             icon: "Store",           route: "/accountable-entities/bancas",      color: "#10B981" },
  { id: "cobradores",     label: "Cobradores",         icon: "Briefcase",       route: "/cobradores",                       color: "#F97316" },
  { id: "limites",        label: "Límites Números",    icon: "Shield",          route: "/limits/numbers",                   color: "#EF4444" },
  { id: "notificaciones", label: "Notificaciones",     icon: "Bell",            route: "/notificaciones",                   color: "#3B82F6" },
  { id: "superadmin",     label: "Panel Admin",        icon: "ShieldCheck",     route: "/superadmin",                       color: "#7C3AED" },
  { id: "configuracion",  label: "Configuración",      icon: "Settings",        route: "/settings",                         color: "#64748B" },
  { id: "monitoreo",      label: "Monitoreo F8",       icon: "Monitor",         route: "/monitoreo",                        color: "#0891B2" },
  { id: "zonas",          label: "Zonas",              icon: "Map",             route: "/accountable-entities/zonas",        color: "#84CC16" },
  { id: "transacciones",  label: "Transacciones",      icon: "ArrowLeftRight",  route: "/transacciones",                    color: "#F59E0B" },
];

// ─── Default Active Items (shown in quick access panel) ───────────────────────

export const DEFAULT_ACTIVE_IDS = [
  "dashboard",
  "pizarra",
  "ventas",
  "resultados",
  "sorteos",
  "horarios",
  "bancas",
  "cobradores",
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface QuickAccessState {
  isOpen: boolean;
  activeIds: string[];

  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  toggleItem: (id: string) => void;
  setActiveIds: (ids: string[]) => void;
  resetToDefaults: () => void;
}

// ─── Zustand Store ────────────────────────────────────────────────────────────

export const useQuickAccessStore = create<QuickAccessState>((set) => ({
  isOpen: false,
  activeIds: DEFAULT_ACTIVE_IDS,

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  toggleItem: (id) =>
    set((s) => ({
      activeIds: s.activeIds.includes(id)
        ? s.activeIds.filter((i) => i !== id)
        : [...s.activeIds, id],
    })),
  setActiveIds: (ids) => set({ activeIds: ids }),
  resetToDefaults: () => set({ activeIds: DEFAULT_ACTIVE_IDS }),
}));
