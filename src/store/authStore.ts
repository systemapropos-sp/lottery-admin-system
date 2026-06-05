import { create } from "zustand";
import type { AdminUser } from "@/data/mockData";
import { adminUsers } from "@/data/mockData";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

interface SidebarGroupState {
  [groupKey: string]: boolean;
}

interface AuthState {
  // Auth
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Sidebar
  sidebarExpanded: boolean;
  expandedGroups: SidebarGroupState;

  // UI
  language: "es" | "en";
  notifications: NotificationItem[];
  unreadNotifications: number;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;

  // Sidebar actions
  toggleSidebar: () => void;
  toggleGroup: (groupKey: string) => void;
  setGroupExpanded: (groupKey: string, expanded: boolean) => void;

  // UI actions
  setLanguage: (lang: "es" | "en") => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

// ─── Translations ───────────────────────────────────────────────────────────────

export const translations = {
  es: {
    // Login
    "login.title": "Sistema de Administracion",
    "login.username": "Nombre de usuario",
    "login.password": "Contrasena",
    "login.submit": "Iniciar sesion",
    "login.error": "Credenciales invalidas",
    "login.loading": "Cargando...",
    "login.drivers": "Descargar Drivers de printers",
    "login.firefox": "Firefox Silent Print: print.always_print_silent",

    // Sidebar
    "nav.inicio": "INICIO",
    "nav.ventas": "VENTAS",
    "nav.tickets": "TICKETS",
    "nav.resultados": "RESULTADOS",
    "nav.bancas": "BANCAS",
    "nav.balances": "BALANCES",
    "nav.usuarios": "USUARIOS",
    "nav.cobros": "COBROS/PAGOS",
    "nav.transacciones": "TRANSACCIONES",
    "nav.limites": "LIMITES",
    "nav.sorteos": "SORTEOS",
    "nav.zonas": "ZONAS",
    "nav.entidades": "ENTIDADES CONTABLES",
    "nav.receptores": "RECEPTORES DE CORREO",
    "nav.notificaciones": "NOTIFICACIONES",

    // Submenu items
    "nav.sales.daily": "Del dia",
    "nav.sales.historical": "Historico",
    "nav.sales.by-date": "Ventas por fecha",
    "nav.sales.prizes": "Premios por jugada",
    "nav.sales.percentages": "Porcentajes",
    "nav.sales.pools": "Bancas",
    "nav.sales.zones": "Zonas",
    "nav.tickets.create": "Crear",
    "nav.tickets.monitor": "Monitoreo",
    "nav.tickets.plays": "Jugadas",
    "nav.tickets.winners": "Jugadas ganadoras",
    "nav.tickets.blackboard": "Pizarra",
    "nav.tickets.anomalies": "Anomalias",
    "nav.pools.list": "Lista",
    "nav.pools.create": "Crear",
    "nav.pools.mass-edit": "Edicion masiva",
    "nav.pools.access": "Acceso",
    "nav.pools.clean": "Limpiar pendientes",
    "nav.pools.no-sales": "Lista sin ventas",
    "nav.pools.days-report": "Reporte dias sin venta",
    "nav.balances.pools": "Bancas",
    "nav.balances.banks": "Bancos",
    "nav.users.list": "Lista",
    "nav.users.pools": "Bancas",
    "nav.users.admins": "Administradores",
    "nav.users.create": "Crear",
    "nav.users.login-logs": "Inicios de sesion",
    "nav.users.blocked": "Sesiones bloqueadas",
    "nav.payments.list": "Lista",
    "nav.transactions.list": "Lista",
    "nav.transactions.groups": "Lista por grupos",
    "nav.transactions.summary": "Resumen",
    "nav.transactions.pools": "Bancas",
    "nav.transactions.categories": "Categorias de gastos",
    "nav.limits.list": "Lista",
    "nav.limits.create": "Crear",
    "nav.limits.automatic": "Limites automaticos",
    "nav.sorteos.list": "Lista",
    "nav.sorteos.schedule": "Horario",
    "nav.zones.list": "Lista",
    "nav.zones.create": "Crear",
    "nav.zones.manage": "Manejar",
    "nav.entities.list": "Lista",
    "nav.entities.create": "Crear",
    "nav.receptores.list": "Lista",
    "nav.receptores.create": "Crear",

    // Header
    "header.changePassword": "Cambiar contrasena",
    "header.logout": "Cerrar sesion",
    "header.settings": "Configuracion",
    "header.notifications": "Notificaciones",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.cobrosPagos": "Cobros & Pagos",
    "dashboard.cobro": "COBRO",
    "dashboard.pago": "PAGO",
    "dashboard.bankCode": "Codigo de banca",
    "dashboard.selectBank": "Seleccionar banca",
    "dashboard.amount": "Monto",
    "dashboard.create": "CREAR",
    "dashboard.statistics": "Estadisticas",
    "dashboard.sellingPools": "Bancas vendiendo",
    "dashboard.topPools": "Bancas con Mayor Actividad",
    "dashboard.noSalesData": "No hay datos de ventas recientes",
    "dashboard.today": "hoy",

    // Common
    "common.view": "Ver",
    "common.pdf": "PDF",
    "common.csv": "CSV",
    "common.refresh": "Refrescar",
    "common.search": "Buscar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.close": "Cerrar",
    "common.noEntries": "No hay entradas disponibles",
    "common.entriesPerPage": "Entradas por pagina",
    "common.confirm": "Confirmar",
    "common.confirmAction": "Confirmar accion",
    "common.areYouSure": "Estas seguro de que deseas continuar?",
  },
  en: {
    // Login
    "login.title": "Management System",
    "login.username": "Username",
    "login.password": "Password",
    "login.submit": "Log In",
    "login.error": "Invalid credentials",
    "login.loading": "Loading...",
    "login.drivers": "Download Printer Drivers",
    "login.firefox": "Firefox Silent Print: print.always_print_silent",

    // Sidebar
    "nav.inicio": "HOME",
    "nav.ventas": "SALES",
    "nav.tickets": "TICKETS",
    "nav.resultados": "RESULTS",
    "nav.bancas": "POOLS",
    "nav.balances": "BALANCES",
    "nav.usuarios": "USERS",
    "nav.cobros": "COLLECTIONS/PAYMENTS",
    "nav.transacciones": "TRANSACTIONS",
    "nav.limites": "LIMITS",
    "nav.sorteos": "DRAWS",
    "nav.zonas": "ZONES",
    "nav.entidades": "ACCOUNTING ENTITIES",
    "nav.receptores": "EMAIL RECIPIENTS",
    "nav.notificaciones": "NOTIFICATIONS",

    // Submenu items
    "nav.sales.daily": "Daily",
    "nav.sales.historical": "Historical",
    "nav.sales.by-date": "Sales by Date",
    "nav.sales.prizes": "Prizes by Play",
    "nav.sales.percentages": "Percentages",
    "nav.sales.pools": "Pools",
    "nav.sales.zones": "Zones",
    "nav.tickets.create": "Create",
    "nav.tickets.monitor": "Monitor",
    "nav.tickets.plays": "Plays",
    "nav.tickets.winners": "Winning Plays",
    "nav.tickets.blackboard": "Blackboard",
    "nav.tickets.anomalies": "Anomalies",
    "nav.pools.list": "List",
    "nav.pools.create": "Create",
    "nav.pools.mass-edit": "Mass Edit",
    "nav.pools.access": "Access",
    "nav.pools.clean": "Clean Pending",
    "nav.pools.no-sales": "No Sales List",
    "nav.pools.days-report": "Days Without Sales",
    "nav.balances.pools": "Pools",
    "nav.balances.banks": "Banks",
    "nav.users.list": "List",
    "nav.users.pools": "Pools",
    "nav.users.admins": "Administrators",
    "nav.users.create": "Create",
    "nav.users.login-logs": "Login Logs",
    "nav.users.blocked": "Blocked Sessions",
    "nav.payments.list": "List",
    "nav.transactions.list": "List",
    "nav.transactions.groups": "List by Groups",
    "nav.transactions.summary": "Summary",
    "nav.transactions.pools": "Pools",
    "nav.transactions.categories": "Expense Categories",
    "nav.limits.list": "List",
    "nav.limits.create": "Create",
    "nav.limits.automatic": "Automatic Limits",
    "nav.sorteos.list": "List",
    "nav.sorteos.schedule": "Schedule",
    "nav.zones.list": "List",
    "nav.zones.create": "Create",
    "nav.zones.manage": "Manage",
    "nav.entities.list": "List",
    "nav.entities.create": "Create",
    "nav.receptores.list": "List",
    "nav.receptores.create": "Create",

    // Header
    "header.changePassword": "Change Password",
    "header.logout": "Log Out",
    "header.settings": "Settings",
    "header.notifications": "Notifications",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.cobrosPagos": "Collections & Payments",
    "dashboard.cobro": "COLLECT",
    "dashboard.pago": "PAY",
    "dashboard.bankCode": "Pool Code",
    "dashboard.selectBank": "Select pool",
    "dashboard.amount": "Amount",
    "dashboard.create": "CREATE",
    "dashboard.statistics": "Statistics",
    "dashboard.sellingPools": "Pools selling",
    "dashboard.topPools": "Most Active Pools",
    "dashboard.noSalesData": "No recent sales data",
    "dashboard.today": "today",

    // Common
    "common.view": "View",
    "common.pdf": "PDF",
    "common.csv": "CSV",
    "common.refresh": "Refresh",
    "common.search": "Search",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.close": "Close",
    "common.noEntries": "No entries available",
    "common.entriesPerPage": "Entries per page",
    "common.confirm": "Confirm",
    "common.confirmAction": "Confirm Action",
    "common.areYouSure": "Are you sure you want to continue?",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["es"];

// ─── Store ──────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  // ── Initial State ────────────────────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  sidebarExpanded: true,
  expandedGroups: {
    ventas: false,
    tickets: false,
    bancas: false,
    balances: false,
    usuarios: false,
    cobros: false,
    transacciones: false,
    limites: false,
    sorteos: false,
    zonas: false,
    entidades: false,
    receptores: false,
  },

  language: "es",
  notifications: [],
  unreadNotifications: 0,

  // ── Auth Actions ─────────────────────────────────────────────────────────────

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = adminUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        password.length > 0 // Accept any non-empty password
    );

    if (found) {
      set({
        user: found,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Credenciales invalidas",
      });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  // ── Sidebar Actions ──────────────────────────────────────────────────────────

  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  toggleGroup: (groupKey: string) =>
    set((state) => {
      const currentlyExpanded = state.expandedGroups[groupKey] ?? false;
      // Accordion: close all, then toggle clicked
      const allClosed: SidebarGroupState = {};
      Object.keys(state.expandedGroups).forEach((k) => {
        allClosed[k] = false;
      });
      return {
        expandedGroups: {
          ...allClosed,
          [groupKey]: !currentlyExpanded,
        },
      };
    }),

  setGroupExpanded: (groupKey: string, expanded: boolean) =>
    set((state) => ({
      expandedGroups: { ...state.expandedGroups, [groupKey]: expanded },
    })),

  // ── UI Actions ───────────────────────────────────────────────────────────────

  setLanguage: (lang) => set({ language: lang }),

  addNotification: (notif) =>
    set((state) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const notifications = [newNotif, ...state.notifications];
      const unreadNotifications = notifications.filter((n) => !n.isRead).length;
      return { notifications, unreadNotifications };
    }),

  markNotificationRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      const unreadNotifications = notifications.filter((n) => !n.isRead).length;
      return { notifications, unreadNotifications };
    }),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadNotifications: 0,
    })),

  clearNotifications: () =>
    set({ notifications: [], unreadNotifications: 0 }),
}));

// ─── Helper Hook ────────────────────────────────────────────────────────────────

export function useTranslation() {
  const language = useAuthStore((s) => s.language);

  function t(key: TranslationKey): string {
    return translations[language][key] ?? key;
  }

  return { t, language };
}
