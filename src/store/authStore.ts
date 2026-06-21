import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

// ─── AdminUser type (migrado de mockData) ───────────────────────────────────
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  fullName?: string;
  role: string;
  email?: string;
  permissions?: string[];
  zones?: string[];
  bancaId?: string | null;
}

// ─── Banca Permissions ──────────────────────────────────────────────────────────

export const BANCA_PERMISSION_KEYS = [
  "monitoreo", "pendiente_pago", "balances", "contabilidad", "clientes",
  "ventas_historicas", "imprimir_reporte", "duplicar_jugadas", "jugadas",
  "pagar", "ver_ventas", "horarios", "ayuda", "configuracion",
  "autorizar_ponchado", "reportes", "generador_jugadas",
  // Nuevas secciones detectadas en nmvapp.com
  "resultados", "escanear", "movil",
] as const;

export type BancaPermKey = typeof BANCA_PERMISSION_KEYS[number];

export const BANCA_PERM_LABELS: Record<BancaPermKey, string> = {
  monitoreo:             "Monitoreo",
  pendiente_pago:        "Pendiente de Pago",
  balances:              "Balances",
  contabilidad:          "Contabilidad",
  clientes:              "Clientes",
  ventas_historicas:     "Ventas Historicas",
  imprimir_reporte:      "Imprimir Reporte",
  duplicar_jugadas:      "Duplicar Jugadas",
  jugadas:               "Jugadas",
  pagar:                 "Pagar",
  ver_ventas:            "Ver Ventas",
  horarios:              "Horarios",
  ayuda:                 "Ayuda",
  configuracion:         "Configuracion",
  autorizar_ponchado:    "Autorizar Ponchado",
  reportes:              "Reportes",
  generador_jugadas:     "Generador de Jugadas Aleatorias",
  resultados:            "Resultados (Dropdown)",
  escanear:              "Escanear Tickets",
  movil:                 "Portal Movil",
};

export type BancaPerms = Record<BancaPermKey, boolean>;
export type BancaPermissions = Record<string, BancaPerms>; // bancaId → perms

export interface PermLogEntry {
  id: string;
  timestamp: string;
  bancaId: string;
  bancaName: string;
  permKey: BancaPermKey;
  permLabel: string;
  value: boolean;
  adminUser: string;
}

// Default: all ON
function defaultPerms(): BancaPerms {
  return Object.fromEntries(
    BANCA_PERMISSION_KEYS.map((k) => [k, true])
  ) as BancaPerms;
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const LS_PERMS_KEY = "nmv_banca_perms";
const LS_LOG_KEY   = "nmv_perm_log";

function loadPerms(): BancaPermissions {
  try {
    const raw = localStorage.getItem(LS_PERMS_KEY);
    return raw ? (JSON.parse(raw) as BancaPermissions) : {};
  } catch { return {}; }
}

function savePerms(p: BancaPermissions) {
  try { localStorage.setItem(LS_PERMS_KEY, JSON.stringify(p)); } catch {}
}

function loadLog(): PermLogEntry[] {
  try {
    const raw = localStorage.getItem(LS_LOG_KEY);
    return raw ? (JSON.parse(raw) as PermLogEntry[]) : [];
  } catch { return []; }
}

function saveLog(log: PermLogEntry[]) {
  try { localStorage.setItem(LS_LOG_KEY, JSON.stringify(log.slice(0, 500))); } catch {}
}

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
  sidebarPinned: boolean;
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
  toggleSidebarPin: () => void;
  toggleGroup: (groupKey: string) => void;
  setGroupExpanded: (groupKey: string, expanded: boolean) => void;

  // Banca Permissions
  bancaPermissions: BancaPermissions;
  permissionsLog: PermLogEntry[];
  getBancaPerms: (bancaId: string) => BancaPerms;
  setBancaPermission: (bancaId: string, bancaName: string, permKey: BancaPermKey, value: boolean, bancaCode?: string) => void;
  resetBancaPerms: (bancaId: string) => void;

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

    // SuperAdmin
    "nav.superadmin": "ADMIN",
    "nav.superadmin.panel": "PANEL ADMIN",
    "nav.log": "LOG OPERACIONES",

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
    "nav.tickets.create":  "Crear",
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
    "nav.transactions.entities": "Entidades",
    "nav.transactions.recargas": "Recargas clientes",
    "nav.limits.list": "Lista",
    "nav.limits.create": "Crear",
    "nav.limits.automatic": "Limites automaticos",
    "nav.limits.delete": "Eliminar",
    "nav.limits.numeros": "Límites de Números",
    "nav.limits.limitacion": "Limitación de Números",
    "nav.movil": "MÓVIL",
    "nav.movil.crear-cliente": "Crear cliente",
    "nav.movil.clientes": "Lista de clientes",
    "nav.movil.retiro": "Retiro",
    "nav.movil.recargas": "Recargas",
    "nav.movil.cancelar": "Cancelar recarga",
    "nav.movil.tickets": "Tickets",
    "nav.movil.premios": "Premios",
    "nav.movil.reporte": "Ver reporte",
    "nav.sorteos.list": "Lista",
    "nav.sorteos.schedule": "Horario",
    "nav.zones.list": "Lista",
    "nav.zones.create": "Crear",
    "nav.zones.manage": "Manejar",
    "nav.entities.bancas":    "Bancas",
    "nav.entities.empleados": "Empleados",
    "nav.entities.bancos":    "Bancos",
    "nav.entities.zonas":     "Zonas",
    "nav.entities.otros":     "Otros",
    "nav.entities.list":      "Lista",
    "nav.entities.create":    "Crear",
    "nav.receptores.list": "Lista",
    "nav.receptores.create": "Crear",

    // Contabilidad
    "nav.contabilidad": "CONTABILIDAD",
    "nav.contabilidad.gastos": "Gastos",
    "nav.contabilidad.compras": "Compras",
    "nav.contabilidad.rentas": "Rentas",
    "nav.contabilidad.empleados": "Empleados",
    "nav.contabilidad.inversion": "Inversion",
    "nav.contabilidad.resumen": "Resumen General",

    // Cobradores
    "nav.cobradores": "COBRADORES",

    // Prestamos
    "nav.prestamos": "PRESTAMOS",
    "nav.prestamos.lista": "Lista de Prestamos",
    "nav.prestamos.nuevo": "Nuevo Prestamo",
    "nav.prestamos.abonos": "Abonos",
    "nav.prestamos.cobros": "Cobros",

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
    "nav.tickets.create":  "Create",
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
    "nav.transactions.entities": "Entities",
    "nav.transactions.recargas": "Customer Recharges",
    "nav.limits.list": "List",
    "nav.limits.create": "Create",
    "nav.limits.automatic": "Automatic Limits",
    "nav.limits.delete": "Delete",
    "nav.limits.numeros": "Number Limits",
    "nav.limits.limitacion": "Number Limitation",
    "nav.movil": "MOBILE",
    "nav.movil.crear-cliente": "Create Client",
    "nav.movil.clientes": "Client List",
    "nav.movil.retiro": "Withdrawal",
    "nav.movil.recargas": "Recharges",
    "nav.movil.cancelar": "Cancel Recharge",
    "nav.movil.tickets": "Tickets",
    "nav.movil.premios": "Prizes",
    "nav.movil.reporte": "View Report",
    "nav.sorteos.list": "List",
    "nav.sorteos.schedule": "Schedule",
    "nav.zones.list": "List",
    "nav.zones.create": "Create",
    "nav.zones.manage": "Manage",
    "nav.entities.bancas":    "Pools",
    "nav.entities.empleados": "Employees",
    "nav.entities.bancos":    "Banks",
    "nav.entities.zonas":     "Zones",
    "nav.entities.otros":     "Others",
    "nav.entities.list":      "List",
    "nav.entities.create":    "Create",
    "nav.receptores.list": "List",
    "nav.receptores.create": "Create",

    // Contabilidad
    "nav.contabilidad": "ACCOUNTING",
    "nav.contabilidad.gastos": "Expenses",
    "nav.contabilidad.compras": "Purchases",
    "nav.contabilidad.rentas": "Rent",
    "nav.contabilidad.empleados": "Employees",
    "nav.contabilidad.inversion": "Investment",
    "nav.contabilidad.resumen": "General Summary",

    // Cobradores
    "nav.cobradores": "COLLECTORS",

    // Prestamos
    "nav.prestamos": "LOANS",
    "nav.prestamos.lista": "Loan List",
    "nav.prestamos.nuevo": "New Loan",
    "nav.prestamos.abonos": "Payments",
    "nav.prestamos.cobros": "Collections",

    // SuperAdmin
    "nav.superadmin": "ADMIN",
    "nav.superadmin.panel": "PANEL ADMIN",
    "nav.log": "ACTIVITY LOG",

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
  // ── Initial State ────────────────────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  sidebarExpanded: true,
  sidebarPinned: false,
    expandedGroups: {
      cobradores: false,
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

  // ── Banca Permissions (loaded from localStorage) ────────────────────────────
  bancaPermissions: loadPerms(),
  permissionsLog: loadLog(),

  getBancaPerms: (bancaId: string): BancaPerms => {
    const stored = loadPerms()[bancaId];
    return stored ?? defaultPerms();
  },

  setBancaPermission: (bancaId, bancaName, permKey, value, bancaCode) =>
    set((state) => {
      const current = state.bancaPermissions[bancaId] ?? defaultPerms();
      const updatedPerms = { ...current, [permKey]: value };
      const updated: BancaPermissions = {
        ...state.bancaPermissions,
        [bancaId]: updatedPerms,
      };
      savePerms(updated);

      // ── Supabase real-time save (fire & forget) ──────────────────────────
      if (bancaCode) {
        const BIZ_ID = "bb000001-0000-0000-0000-000000000001";
        supabase
          .from("banca_permisos")
          .upsert(
            { banca_id: bancaCode, business_id: BIZ_ID, permisos: updatedPerms, updated_by: state.user?.username ?? "admin" },
            { onConflict: "banca_id,business_id" }
          )
          .then(({ error }) => {
            if (error) console.warn("[permisos] Supabase save error:", error.message);
          });
      }

      const entry: PermLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
        bancaId,
        bancaName,
        permKey,
        permLabel: BANCA_PERM_LABELS[permKey],
        value,
        adminUser: state.user?.username ?? "admin",
      };
      const newLog = [entry, ...state.permissionsLog];
      saveLog(newLog);

      return { bancaPermissions: updated, permissionsLog: newLog };
    }),

  resetBancaPerms: (bancaId) =>
    set((state) => {
      const updated = { ...state.bancaPermissions, [bancaId]: defaultPerms() };
      savePerms(updated);
      return { bancaPermissions: updated };
    }),

  // ── Auth Actions ─────────────────────────────────────────────────────────────

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // Query admin_users from Supabase — matches username + (pin OR password)
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, username, full_name, role, email, pin, password, is_active")
        .eq("username", username.trim().toLowerCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        set({ user: null, isAuthenticated: false, isLoading: false, error: "Credenciales invalidas" });
        return false;
      }

      // Accept pin OR password
      const validPin = data.pin && data.pin === password.trim();
      const validPass = data.password && data.password === password.trim();

      if (!validPin && !validPass) {
        set({ user: null, isAuthenticated: false, isLoading: false, error: "Credenciales invalidas" });
        return false;
      }

      const user: AdminUser = {
        id: data.id,
        username: data.username,
        password: "",
        name: data.full_name ?? data.username,
        fullName: data.full_name,
        role: data.role ?? "admin",
        email: data.email,
      };

      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, error: "Error de conexion" });
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

  toggleSidebarPin: () =>
    set((state) => ({
      sidebarPinned: !state.sidebarPinned,
      sidebarExpanded: !state.sidebarPinned ? true : state.sidebarExpanded,
    })),

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
  }),
  {
    name: "nmv-auth-storage",
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      language: state.language,
    }),
  }
));

// ─── Helper Hook ────────────────────────────────────────────────────────────────

export function useTranslation() {
  const language = useAuthStore((s) => s.language);

  function t(key: TranslationKey): string {
    return translations[language][key] ?? key;
  }

  return { t, language };
}
