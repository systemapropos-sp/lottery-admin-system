// ─── Betting Pools (Bancas) ───────────────────────────────────────────────────

export interface BettingPool {
  id: string;
  code: string;
  name: string;
  mwrCode: string;
  balance: number;
  zoneId: string;
  zoneName: string;
  isActive: boolean;
  hasSalesToday: boolean;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  createdAt: string;
  percentage: number;
  bankId: string;
}

export const bettingPools: BettingPool[] = [
  { id: "bp-001", code: "nmv01", name: "NMV Banca 001", mwrCode: "NMV-0001", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 15, bankId: "bank-01" },
  { id: "bp-002", code: "nmv02", name: "NMV Banca 002", mwrCode: "NMV-0002", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 12, bankId: "bank-01" },
  { id: "bp-003", code: "nmv03", name: "NMV Banca 003", mwrCode: "NMV-0003", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 10, bankId: "bank-01" },
  { id: "bp-004", code: "nmv04", name: "NMV Banca 004", mwrCode: "NMV-0004", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 10, bankId: "bank-01" },
  { id: "bp-005", code: "nmv05", name: "NMV Banca 005", mwrCode: "NMV-0005", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 8,  bankId: "bank-01" },
  { id: "bp-006", code: "nmv06", name: "NMV Banca 006", mwrCode: "NMV-0006", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 8,  bankId: "bank-01" },
  { id: "bp-007", code: "nmv07", name: "NMV Banca 007", mwrCode: "NMV-0007", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 7,  bankId: "bank-01" },
  { id: "bp-008", code: "nmv08", name: "NMV Banca 008", mwrCode: "NMV-0008", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 5,  bankId: "bank-01" },
  { id: "bp-009", code: "nmv09", name: "NMV Banca 009", mwrCode: "NMV-0009", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 5,  bankId: "bank-01" },
  { id: "bp-010", code: "nmv10", name: "NMV Banca 010", mwrCode: "NMV-0010", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 5,  bankId: "bank-01" },
  { id: "bp-011", code: "nmv11", name: "NMV Banca 011", mwrCode: "NMV-0011", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 3,  bankId: "bank-01" },
  { id: "bp-012", code: "nmv12", name: "NMV Banca 012", mwrCode: "NMV-0012", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 3,  bankId: "bank-01" },
  { id: "bp-013", code: "nmv13", name: "NMV Banca 013", mwrCode: "NMV-0013", balance: 0.00, zoneId: "z-02", zoneName: "Norte",   isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-014", code: "nmv14", name: "NMV Banca 014", mwrCode: "NMV-0014", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-015", code: "nmv15", name: "NMV Banca 015", mwrCode: "NMV-0015", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-016", code: "nmv16", name: "NMV Banca 016", mwrCode: "NMV-0016", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: false, hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-017", code: "nmv17", name: "NMV Banca 017", mwrCode: "NMV-0017", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 1,  bankId: "bank-01" },
  { id: "bp-018", code: "nmv18", name: "NMV Banca 018", mwrCode: "NMV-0018", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 1,  bankId: "bank-01" },
  { id: "bp-019", code: "nmv19", name: "NMV Banca 019", mwrCode: "NMV-0019", balance: 0.00, zoneId: "z-02", zoneName: "Norte",   isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 1,  bankId: "bank-01" },
  { id: "bp-020", code: "nmv20", name: "NMV Banca 020", mwrCode: "NMV-0020", balance: 0.00, zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "", address: "", city: "", province: "", createdAt: "2024-01-15", percentage: 1,  bankId: "bank-01" },
];

// ─── Admin Users ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: "superadmin" | "admin" | "operator";
  zoneId: string;
  zoneName: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  privileges: string[];
}

export const adminUsers: AdminUser[] = [
  { id: "u-000", username: "RDV-01",   password: "Producers0587@", fullName: "Admin RDV-01",      email: "duepostllc@gmail.com",   role: "admin",      zoneId: "z-01", zoneName: "Default", isActive: true, lastLogin: new Date().toISOString(), createdAt: "2024-01-01", privileges: ["all"] },
  { id: "u-001", username: "admin",    password: "admin123",       fullName: "Administrador NMV", email: "admin@nmvlottery.com",   role: "admin",      zoneId: "z-01", zoneName: "Default", isActive: true, lastLogin: new Date().toISOString(), createdAt: "2024-01-01", privileges: ["sales.view","tickets.view","results.view","pools.view","limits.view","balances.view"] },
  { id: "u-002", username: "operador", password: "operador123",    fullName: "Operador NMV",      email: "operador@nmvlottery.com",role: "operator",   zoneId: "z-01", zoneName: "Default", isActive: true, lastLogin: new Date().toISOString(), createdAt: "2024-01-01", privileges: ["sales.view","tickets.create","tickets.view"] },
];

// ─── Zones ──────────────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  name: string;
  description: string;
  bettingPoolCount: number;
  isActive: boolean;
  color: string;
}

export const zones: Zone[] = [
  { id: "z-01", name: "Default", description: "Zona predeterminada",          bettingPoolCount: 18, isActive: true, color: "#4ECDC4" },
  { id: "z-02", name: "Norte",   description: "Zona Norte",                   bettingPoolCount: 2,  isActive: true, color: "#F59E0B" },
];

// ─── Lottery Draw Times ─────────────────────────────────────────────────────────

export type DrawTime = "10AM" | "1PM" | "6PM" | "9PM";

export interface Lottery {
  id: string;
  name: string;
  color: string;
  drawTime: DrawTime;
  isActive: boolean;
  abbreviation: string;
}

export const lotteries: Lottery[] = [
  // 10AM
  { id: "lot-001", name: "Anguila 10AM",       color: "#FF6B6B", drawTime: "10AM", isActive: true,  abbreviation: "A10" },
  { id: "lot-002", name: "LA PRIMERA",          color: "#DDA0DD", drawTime: "10AM", isActive: true,  abbreviation: "LPM" },
  { id: "lot-003", name: "Florida AM",          color: "#FD79A8", drawTime: "10AM", isActive: true,  abbreviation: "FAM" },
  { id: "lot-004", name: "New York AM",         color: "#0984E3", drawTime: "10AM", isActive: true,  abbreviation: "NYA" },
  { id: "lot-005", name: "King Lottery AM",     color: "#F9A826", drawTime: "10AM", isActive: true,  abbreviation: "KAM" },
  { id: "lot-006", name: "NACIONAL",            color: "#D63031", drawTime: "10AM", isActive: false, abbreviation: "NAC" },
  // 1PM
  { id: "lot-007", name: "Anguila 1PM",         color: "#4ECDC4", drawTime: "1PM",  isActive: true,  abbreviation: "A1P" },
  { id: "lot-008", name: "LOTEDOM",             color: "#FFD93D", drawTime: "1PM",  isActive: true,  abbreviation: "LTD" },
  { id: "lot-009", name: "LA SUERTE",           color: "#6BCB77", drawTime: "1PM",  isActive: true,  abbreviation: "LST" },
  { id: "lot-010", name: "Florida PM",          color: "#E84393", drawTime: "1PM",  isActive: true,  abbreviation: "FPM" },
  { id: "lot-011", name: "New York PM",         color: "#6C5CE7", drawTime: "1PM",  isActive: true,  abbreviation: "NYP" },
  { id: "lot-012", name: "King Lottery PM",     color: "#E17055", drawTime: "1PM",  isActive: true,  abbreviation: "KPM" },
  // 6PM
  { id: "lot-013", name: "Anguila 6PM",         color: "#45B7D1", drawTime: "6PM",  isActive: true,  abbreviation: "A6P" },
  { id: "lot-014", name: "QUINIELA REAL",       color: "#74B9FF", drawTime: "6PM",  isActive: true,  abbreviation: "QRL" },
  { id: "lot-015", name: "LOTEKA",              color: "#00CEC9", drawTime: "6PM",  isActive: true,  abbreviation: "LOK" },
  { id: "lot-016", name: "GANA MAS",            color: "#55EFC4", drawTime: "6PM",  isActive: true,  abbreviation: "GAM" },
  // 9PM
  { id: "lot-017", name: "Anguila 9PM",         color: "#96CEB4", drawTime: "9PM",  isActive: true,  abbreviation: "A9P" },
  { id: "lot-018", name: "NACIONAL NOCHE",      color: "#D63031", drawTime: "9PM",  isActive: true,  abbreviation: "NNC" },
  { id: "lot-019", name: "LOTEKA NOCHE",        color: "#00CEC9", drawTime: "9PM",  isActive: true,  abbreviation: "LKN" },
  { id: "lot-020", name: "QUINIELA REAL NOCHE", color: "#74B9FF", drawTime: "9PM",  isActive: true,  abbreviation: "QRN" },
  { id: "lot-021", name: "LA PRIMERA NOCHE",    color: "#DDA0DD", drawTime: "9PM",  isActive: true,  abbreviation: "LPN" },
  { id: "lot-022", name: "New York NOCHE",      color: "#6C5CE7", drawTime: "9PM",  isActive: true,  abbreviation: "NYN" },
  { id: "lot-023", name: "Florida NOCHE",       color: "#E84393", drawTime: "9PM",  isActive: true,  abbreviation: "FLN" },
  { id: "lot-024", name: "LA SUERTE NOCHE",     color: "#6BCB77", drawTime: "9PM",  isActive: true,  abbreviation: "LSN" },
];

export const lotteriesByDrawTime: Record<DrawTime, Lottery[]> = {
  "10AM": lotteries.filter(l => l.drawTime === "10AM"),
  "1PM":  lotteries.filter(l => l.drawTime === "1PM"),
  "6PM":  lotteries.filter(l => l.drawTime === "6PM"),
  "9PM":  lotteries.filter(l => l.drawTime === "9PM"),
};

// ─── Banks ──────────────────────────────────────────────────────────────────────

export interface Bank {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  isActive: boolean;
  bettingPoolIds: string[];
}

export const banks: Bank[] = [
  {
    id: "bank-01",
    name: "Banco NMV Principal",
    balance: 0.00,
    accountNumber: "001-0000001-0",
    isActive: true,
    bettingPoolIds: bettingPools.map(bp => bp.id),
  },
];

// ─── Transactions ───────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: "COBRO" | "PAGO";
  amount: number;
  bettingPoolId: string;
  bettingPoolName: string;
  mwrCode: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
  category: string;
}

export const transactions: Transaction[] = [];

// ─── Tickets ────────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  number: string;
  bettingPoolId: string;
  bettingPoolName: string;
  lotteryName: string;
  playType: string;
  numbers: string;
  amount: number;
  createdAt: string;
  status: "active" | "paid" | "cancelled" | "pending";
  userId: string;
  userName: string;
}

export const tickets: Ticket[] = [];

// ─── Limits ─────────────────────────────────────────────────────────────────────

export interface Limit {
  id: string;
  bettingPoolId: string;
  bettingPoolName: string;
  lotteryId: string;
  lotteryName: string;
  playType: string;
  maxAmount: number;
  currentUsage: number;
  isActive: boolean;
  createdAt: string;
}

export const limits: Limit[] = [];

// ─── Lottery Results ────────────────────────────────────────────────────────────

export interface LotteryResult {
  id: string;
  lotteryId: string;
  lotteryName: string;
  color: string;
  drawTime: DrawTime;
  date: string;
  first:  string;
  second: string;
  third:  string;
  status: "confirmed" | "pending";
  createdAt: string;
}

export const lotteryResults: LotteryResult[] = [];

// ─── Privileges ─────────────────────────────────────────────────────────────────

export interface Privilege {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const privileges: Privilege[] = [
  // Dashboard
  { id: "dashboard.view",        name: "Ver Dashboard",           category: "Dashboard",     description: "Acceso al panel principal" },
  { id: "dashboard.cobros",      name: "Crear Cobros/Pagos",      category: "Dashboard",     description: "Crear transacciones" },
  // Ventas
  { id: "sales.view",            name: "Ver Ventas",              category: "Ventas",        description: "Ver reportes de ventas" },
  { id: "sales.daily",           name: "Ventas del Dia",          category: "Ventas",        description: "Acceso a ventas diarias" },
  { id: "sales.historical",      name: "Ventas Historicas",       category: "Ventas",        description: "Ver historial de ventas" },
  { id: "sales.by-date",         name: "Ventas por Fecha",        category: "Ventas",        description: "Filtrar ventas por fecha" },
  { id: "sales.prizes",          name: "Premios por Jugada",      category: "Ventas",        description: "Ver premios por tipo de jugada" },
  { id: "sales.percentages",     name: "Porcentajes",             category: "Ventas",        description: "Ver porcentajes de ventas" },
  { id: "sales.pools",           name: "Ventas por Banca",        category: "Ventas",        description: "Ver ventas por banca" },
  { id: "sales.zones",           name: "Ventas por Zona",         category: "Ventas",        description: "Ver ventas por zona" },
  // Tickets
  { id: "tickets.view",          name: "Ver Tickets",             category: "Tickets",       description: "Ver lista de tickets" },
  { id: "tickets.create",        name: "Crear Tickets",           category: "Tickets",       description: "Crear nuevos tickets" },
  { id: "tickets.monitor",       name: "Monitoreo de Jugadas",    category: "Tickets",       description: "Monitorear jugadas en tiempo real" },
  { id: "tickets.plays",         name: "Ver Jugadas",             category: "Tickets",       description: "Ver jugadas realizadas" },
  { id: "tickets.winners",       name: "Jugadas Ganadoras",       category: "Tickets",       description: "Ver jugadas ganadoras" },
  { id: "tickets.blackboard",    name: "Pizarra",                 category: "Tickets",       description: "Ver pizarra de resultados" },
  { id: "tickets.anomalies",     name: "Anomalias",               category: "Tickets",       description: "Ver anomalias en tickets" },
  // Resultados
  { id: "results.view",          name: "Ver Resultados",          category: "Resultados",    description: "Ver resultados de loterias" },
  { id: "results.manage",        name: "Gestionar Resultados",    category: "Resultados",    description: "Crear y editar resultados" },
  // Bancas
  { id: "pools.view",            name: "Ver Bancas",              category: "Bancas",        description: "Ver lista de bancas" },
  { id: "pools.create",          name: "Crear Bancas",            category: "Bancas",        description: "Crear nuevas bancas" },
  { id: "pools.edit",            name: "Editar Bancas",           category: "Bancas",        description: "Editar bancas existentes" },
  { id: "pools.mass-edit",       name: "Edicion Masiva",          category: "Bancas",        description: "Editar multiples bancas" },
  { id: "pools.access",          name: "Acceso a Bancas",         category: "Bancas",        description: "Gestionar acceso a bancas" },
  { id: "pools.clean",           name: "Limpiar Pendientes",      category: "Bancas",        description: "Limpiar pagos pendientes" },
  { id: "pools.no-sales",        name: "Bancas sin Ventas",       category: "Bancas",        description: "Ver bancas sin ventas" },
  // Balances
  { id: "balances.view",         name: "Ver Balances",            category: "Balances",      description: "Ver balances de bancas y bancos" },
  { id: "balances.pools",        name: "Balances Bancas",         category: "Balances",      description: "Ver balances por banca" },
  { id: "balances.banks",        name: "Balances Bancos",         category: "Balances",      description: "Ver balances por banco" },
  // Usuarios
  { id: "users.view",            name: "Ver Usuarios",            category: "Usuarios",      description: "Ver lista de usuarios" },
  { id: "users.create",          name: "Crear Usuarios",          category: "Usuarios",      description: "Crear nuevos usuarios" },
  { id: "users.edit",            name: "Editar Usuarios",         category: "Usuarios",      description: "Editar usuarios existentes" },
  { id: "users.delete",          name: "Eliminar Usuarios",       category: "Usuarios",      description: "Eliminar usuarios" },
  { id: "users.admins",          name: "Ver Administradores",     category: "Usuarios",      description: "Ver administradores" },
  { id: "users.login-logs",      name: "Ver Inicios de Sesion",   category: "Usuarios",      description: "Ver logs de inicio de sesion" },
  { id: "users.blocked",         name: "Ver Sesiones Bloqueadas", category: "Usuarios",      description: "Ver sesiones bloqueadas" },
  // Cobros/Pagos
  { id: "payments.view",         name: "Ver Cobros/Pagos",        category: "Cobros/Pagos",  description: "Ver lista de cobros y pagos" },
  { id: "payments.create",       name: "Crear Cobros/Pagos",      category: "Cobros/Pagos",  description: "Crear cobros y pagos" },
  // Transacciones
  { id: "transactions.view",     name: "Ver Transacciones",       category: "Transacciones", description: "Ver transacciones" },
  { id: "transactions.groups",   name: "Transacciones por Grupo", category: "Transacciones", description: "Ver transacciones agrupadas" },
  { id: "transactions.summary",  name: "Resumen Transacciones",   category: "Transacciones", description: "Ver resumen de transacciones" },
  { id: "transactions.categories",name:"Categorias de Gastos",    category: "Transacciones", description: "Gestionar categorias de gastos" },
  // Limites
  { id: "limits.view",           name: "Ver Limites",             category: "Limites",       description: "Ver limites configurados" },
  { id: "limits.create",         name: "Crear Limites",           category: "Limites",       description: "Crear nuevos limites" },
  { id: "limits.automatic",      name: "Limites Automaticos",     category: "Limites",       description: "Configurar limites automaticos" },
  // Sorteos
  { id: "sorteos.view",          name: "Ver Sorteos",             category: "Sorteos",       description: "Ver informacion de sorteos" },
  { id: "sorteos.schedule",      name: "Horario Sorteos",         category: "Sorteos",       description: "Ver horarios de sorteos" },
  // Zonas
  { id: "zones.view",            name: "Ver Zonas",               category: "Zonas",         description: "Ver zonas" },
  { id: "zones.create",          name: "Crear Zonas",             category: "Zonas",         description: "Crear zonas" },
  { id: "zones.manage",          name: "Manejar Zonas",           category: "Zonas",         description: "Administrar zonas" },
  // Entidades
  { id: "entities.view",         name: "Ver Entidades",           category: "Entidades",     description: "Ver entidades contables" },
  { id: "entities.create",       name: "Crear Entidades",         category: "Entidades",     description: "Crear entidades contables" },
  // Notificaciones
  { id: "notifications.view",    name: "Ver Notificaciones",      category: "Notificaciones",description: "Ver notificaciones" },
  { id: "notifications.send",    name: "Enviar Notificaciones",   category: "Notificaciones",description: "Enviar notificaciones push" },
  // Configuracion
  { id: "settings.view",         name: "Ver Configuracion",       category: "Configuracion", description: "Acceso a configuracion" },
  { id: "settings.password",     name: "Cambiar Contrasena",      category: "Configuracion", description: "Cambiar contrasena" },
  { id: "settings.language",     name: "Cambiar Idioma",          category: "Configuracion", description: "Cambiar idioma" },
];

// ─── Expense Categories ─────────────────────────────────────────────────────────

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  color: string;
}

export const expenseCategories: ExpenseCategory[] = [
  { id: "exp-001", name: "Premios",          description: "Pagos de premios a ganadores",  isActive: true, color: "#22C55E" },
  { id: "exp-002", name: "Gastos operativos",description: "Gastos de operacion diaria",    isActive: true, color: "#3B82F6" },
  { id: "exp-003", name: "Mantenimiento",    description: "Mantenimiento de equipos",      isActive: true, color: "#F59E0B" },
  { id: "exp-004", name: "Alquiler",         description: "Pago de alquiler de locales",   isActive: true, color: "#EF4444" },
  { id: "exp-005", name: "Servicios",        description: "Pago de servicios publicos",    isActive: true, color: "#8B5CF6" },
  { id: "exp-006", name: "Nomina",           description: "Pago de salarios",              isActive: true, color: "#EC4899" },
  { id: "exp-007", name: "Impuestos",        description: "Pago de impuestos",             isActive: true, color: "#14B8A6" },
  { id: "exp-008", name: "Otros",            description: "Otros gastos",                  isActive: true, color: "#6B7280" },
];

// ─── Accounting Entities ────────────────────────────────────────────────────────

export interface AccountingEntity {
  id: string;
  name: string;
  type: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  phone?: string;
  email?: string;
}

export const accountingEntities: AccountingEntity[] = [
  { id: "ent-001", name: "Entidad Principal NMV",  type: "Principal",  balance: 0.00, isActive: true, createdAt: "2024-01-01", phone: "", email: "admin@nmvlottery.com" },
  { id: "ent-002", name: "Entidad Secundaria NMV", type: "Secundaria", balance: 0.00, isActive: true, createdAt: "2024-01-01", phone: "", email: "operador@nmvlottery.com" },
];

// ─── Mail Receptors ─────────────────────────────────────────────────────────────

export interface MailReceptor {
  id: string;
  name: string;
  email: string;
  type: string;
  isActive: boolean;
  notifyOnResults: boolean;
  notifyOnSales: boolean;
  notifyOnAlerts: boolean;
}

export const mailReceptors: MailReceptor[] = [
  { id: "mail-001", name: "Administrador NMV", email: "duepostllc@gmail.com",    type: "Admin",   isActive: true, notifyOnResults: true,  notifyOnSales: true,  notifyOnAlerts: true },
  { id: "mail-002", name: "Soporte NMV",       email: "soporte@nmvlottery.com",  type: "Soporte", isActive: true, notifyOnResults: true,  notifyOnSales: false, notifyOnAlerts: true },
  { id: "mail-003", name: "Reportes NMV",      email: "reportes@nmvlottery.com", type: "Ventas",  isActive: true, notifyOnResults: false, notifyOnSales: true,  notifyOnAlerts: false },
];

// ─── Notifications ──────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export const notifications: Notification[] = [];

// ─── Sales Activity ─────────────────────────────────────────────────────────────

export interface SalesActivity {
  day: string;
  dayEn: string;
  date: string;
  count: number;
  totalAmount: number;
}

export const salesActivity: SalesActivity[] = [
  { day: "Lunes",     dayEn: "Monday",    date: "", count: 0, totalAmount: 0 },
  { day: "Martes",    dayEn: "Tuesday",   date: "", count: 0, totalAmount: 0 },
  { day: "Miercoles", dayEn: "Wednesday", date: "", count: 0, totalAmount: 0 },
  { day: "Jueves",    dayEn: "Thursday",  date: "", count: 0, totalAmount: 0 },
  { day: "Viernes",   dayEn: "Friday",    date: "", count: 0, totalAmount: 0 },
  { day: "Sabado",    dayEn: "Saturday",  date: "", count: 0, totalAmount: 0 },
  { day: "Domingo",   dayEn: "Sunday",    date: "", count: 0, totalAmount: 0 },
];

// ─── Quick Stats ────────────────────────────────────────────────────────────────

export interface QuickStat {
  label: string;
  labelEn: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: string;
  format?: "number" | "currency" | "percentage";
}

export const quickStats: QuickStat[] = [
  { label: "Total Bancas",       labelEn: "Total Pools",     value: 20, color: "#333333", icon: "Building2",  format: "number" },
  { label: "Bancas Activas Hoy", labelEn: "Active Today",    value: 0,  color: "#22C55E", icon: "Activity",   format: "number" },
  { label: "Total Ventas Hoy",   labelEn: "Today's Sales",   value: 0,  color: "#4ECDC4", icon: "TrendingUp", format: "currency", prefix: "$" },
  { label: "Balance General",    labelEn: "General Balance", value: 0,  color: "#6B7280", icon: "Wallet",     format: "currency", prefix: "$" },
];

// ─── Top Performing Pools ───────────────────────────────────────────────────────

export interface TopPool {
  id: string;
  name: string;
  mwrCode: string;
  salesAmount: number;
  ticketCount: number;
}

export const topPools: TopPool[] = [];

// ─── Session Logs ───────────────────────────────────────────────────────────────

export interface SessionLog {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  ipAddress: string;
  loginAt: string;
  logoutAt?: string;
  status: "active" | "closed" | "blocked";
  device?: string;
  browser?: string;
}

export const sessionLogs: SessionLog[] = [
  { id: "sess-001", userId: "u-000", username: "alex", fullName: "Alex — NMV Admin", ipAddress: "—", loginAt: new Date().toISOString(), status: "active", device: "—", browser: "—" },
];

// ─── Play Types ─────────────────────────────────────────────────────────────────

export interface PlayType {
  id: string;
  name: string;
  description: string;
  payoutMultiplier: number;
  isActive: boolean;
  color: string;
}

export const playTypes: PlayType[] = [
  { id: "pt-001", name: "Quiniela",   description: "Acierta 1 numero",              payoutMultiplier: 85,   isActive: true, color: "#4ECDC4" },
  { id: "pt-002", name: "Pale",       description: "Acierta 2 numeros en orden",    payoutMultiplier: 800,  isActive: true, color: "#45B7D1" },
  { id: "pt-003", name: "Tripleta",   description: "Acierta 3 numeros en orden",    payoutMultiplier: 2500, isActive: true, color: "#96CEB4" },
  { id: "pt-004", name: "Super Pale", description: "Pale de 2 loterias diferentes", payoutMultiplier: 600,  isActive: true, color: "#F9A826" },
  { id: "pt-005", name: "Combo",      description: "Combinacion de jugadas",        payoutMultiplier: 400,  isActive: true, color: "#DDA0DD" },
];
