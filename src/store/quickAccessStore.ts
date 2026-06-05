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
  { id: "monitor-tickets", label: "Monitor de tickets", icon: "FileText", route: "/tickets", color: "#4ECDC4" },
  { id: "pendientes-pago", label: "Pendientes de pago", icon: "Wallet", route: "/clean-pending-for-payment", color: "#4ECDC4" },
  { id: "ventas-historicas", label: "Ventas historicas", icon: "BarChart3", route: "/sales/historical", color: "#4ECDC4" },
  { id: "horarios", label: "Horarios", icon: "Clock", route: "/sortition-schedules", color: "#4ECDC4" },
  { id: "configuracion", label: "Configuracion", icon: "Settings", route: "/settings", color: "#4ECDC4" },
  { id: "duplicar", label: "Duplicar", icon: "Copy", route: "/tickets/create", color: "#4ECDC4" },
  { id: "generador", label: "Generador", icon: "Shuffle", route: "/betting-pool-play-monitor", color: "#4ECDC4" },
  { id: "ayuda", label: "Ayuda", icon: "HelpCircle", route: "/settings", color: "#4ECDC4" },
  { id: "crear-ticket", label: "Crear ticket", icon: "Ticket", route: "/tickets/create", color: "#4ECDC4" },
  { id: "resultados", label: "Resultados", icon: "Trophy", route: "/results", color: "#4ECDC4" },
  { id: "bancas", label: "Bancas", icon: "Store", route: "/betting-pools", color: "#4ECDC4" },
  { id: "usuarios", label: "Usuarios", icon: "Users", route: "/users", color: "#4ECDC4" },
  { id: "cobros", label: "Cobros/Pagos", icon: "Banknote", route: "/simplified-accountable-transaction-groups", color: "#4ECDC4" },
  { id: "limites", label: "Limites", icon: "Shield", route: "/limits", color: "#4ECDC4" },
  { id: "notificaciones", label: "Notificaciones", icon: "Bell", route: "/notifications/new", color: "#4ECDC4" },
];

// ─── Default Active Items (shown in quick access panel) ───────────────────────

export const DEFAULT_ACTIVE_IDS = [
  "monitor-tickets",
  "pendientes-pago",
  "ventas-historicas",
  "horarios",
  "configuracion",
  "duplicar",
  "generador",
  "ayuda",
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
