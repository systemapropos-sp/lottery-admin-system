// ─── Betting Pools (Bancas) ───────────────────────────────────────────────────

export interface BettingPool {
  id: string;
  code: string;       // e.g. "mr01"
  name: string;       // e.g. "MATADOR-SPORT"
  mwrCode: string;    // e.g. "MWR-0001"
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
  { id: "bp-001", code: "mr01",  name: "MATADOR-SPORT",        mwrCode: "MWR-0001", balance: 1813456.00,  zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: true,  phone: "809-555-0101", address: "Calle Principal 123", city: "Santo Domingo", province: "Distrito Nacional", createdAt: "2023-01-15", percentage: 15, bankId: "bank-01" },
  { id: "bp-002", code: "mr02",  name: "MMW RD 02",            mwrCode: "MWR-0002", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0102", address: "Av. Duarte 456",      city: "Santiago",      province: "Santiago",          createdAt: "2023-02-01", percentage: 12, bankId: "bank-01" },
  { id: "bp-003", code: "mr03",  name: "MMW RD 03",            mwrCode: "MWR-0003", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0103", address: "Calle 27 de Febrero", city: "La Romana",     province: "La Romana",         createdAt: "2023-02-15", percentage: 10, bankId: "bank-01" },
  { id: "bp-004", code: "mr04",  name: "MMW RD 04",            mwrCode: "MWR-0004", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0104", address: "Av. Independencia",   city: "San Pedro",     province: "San Pedro de Macoris", createdAt: "2023-03-01", percentage: 10, bankId: "bank-01" },
  { id: "bp-005", code: "mr05",  name: "MMW RD 05",            mwrCode: "MWR-0005", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0105", address: "Calle del Sol 789",   city: "Puerto Plata",  province: "Puerto Plata",      createdAt: "2023-03-15", percentage: 8,  bankId: "bank-01" },
  { id: "bp-006", code: "mr06",  name: "MMW RD 06",            mwrCode: "MWR-0006", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0106", address: "Av. Las Americas",    city: "Higuey",        province: "La Altagracia",     createdAt: "2023-04-01", percentage: 8,  bankId: "bank-01" },
  { id: "bp-007", code: "mr07",  name: "MMW RD 07",            mwrCode: "MWR-0007", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0107", address: "Calle Sanchez 101",   city: "San Cristobal", province: "San Cristobal",     createdAt: "2023-04-15", percentage: 7,  bankId: "bank-01" },
  { id: "bp-008", code: "mr08",  name: "MMW RD 08",            mwrCode: "MWR-0008", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0108", address: "Av. Luperon 202",     city: "Moca",          province: "Espaillat",         createdAt: "2023-05-01", percentage: 5,  bankId: "bank-01" },
  { id: "bp-009", code: "mr09",  name: "MMW RD 09",            mwrCode: "MWR-0009", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0109", address: "Calle Pellerano 303", city: "La Vega",       province: "La Vega",           createdAt: "2023-05-15", percentage: 5,  bankId: "bank-01" },
  { id: "bp-010", code: "mr10",  name: "MMW RD 10",            mwrCode: "MWR-0010", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0110", address: "Av. Estrella 404",    city: "Bonao",         province: "Monsenor Nouel",    createdAt: "2023-06-01", percentage: 5,  bankId: "bank-01" },
  { id: "bp-011", code: "mr11",  name: "MMW RD 11",            mwrCode: "MWR-0011", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0111", address: "Calle Mella 505",     city: "San Juan",      province: "San Juan",          createdAt: "2023-06-15", percentage: 3,  bankId: "bank-01" },
  { id: "bp-012", code: "mr12",  name: "MMW RD 12",            mwrCode: "MWR-0012", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0112", address: "Av. Cibao 606",       city: "San Francisco", province: "Mocanos",           createdAt: "2023-07-01", percentage: 3,  bankId: "bank-01" },
  { id: "bp-013", code: "mr13",  name: "MMW RD 13",            mwrCode: "MWR-0013", balance: 0.00,          zoneId: "z-02", zoneName: "SFM",     isActive: true,  hasSalesToday: false, phone: "809-555-0113", address: "Calle Real 707",      city: "Nagua",         province: "Maria Trinidad",    createdAt: "2023-07-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-014", code: "mr14",  name: "MMW RD 14",            mwrCode: "MWR-0014", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0114", address: "Av. Circunvalar 808", city: "Cotui",         province: "Sanchez Ramirez",   createdAt: "2023-08-01", percentage: 2,  bankId: "bank-01" },
  { id: "bp-015", code: "mr15",  name: "MMW RD 15",            mwrCode: "MWR-0015", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0115", address: "Calle Colon 909",     city: "Barahona",      province: "Barahona",          createdAt: "2023-08-15", percentage: 2,  bankId: "bank-01" },
  { id: "bp-016", code: "mr16",  name: "MMW RD 16",            mwrCode: "MWR-0016", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: false, hasSalesToday: false, phone: "809-555-0116", address: "Av. Maritima 111",    city: "Bani",          province: "Peravia",           createdAt: "2023-09-01", percentage: 2,  bankId: "bank-01" },
  { id: "bp-017", code: "mr17",  name: "MMW RD 17",            mwrCode: "MWR-0017", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0117", address: "Calle Salcedo 222",   city: "Azua",          province: "Azua",              createdAt: "2023-09-15", percentage: 1,  bankId: "bank-01" },
  { id: "bp-018", code: "mr18",  name: "MMW RD 18",            mwrCode: "MWR-0018", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0118", address: "Av. Mexico 333",      city: "Dajabon",       province: "Dajabon",           createdAt: "2023-10-01", percentage: 1,  bankId: "bank-01" },
  { id: "bp-019", code: "mr19",  name: "MMW RD 19",            mwrCode: "MWR-0019", balance: 0.00,          zoneId: "z-02", zoneName: "SFM",     isActive: true,  hasSalesToday: false, phone: "809-555-0119", address: "Calle 30 de Marzo 444",city:"El Seibo",      province: "El Seibo",          createdAt: "2023-10-15", percentage: 1,  bankId: "bank-01" },
  { id: "bp-020", code: "mr20",  name: "MMW RD 20",            mwrCode: "MWR-0020", balance: 0.00,          zoneId: "z-01", zoneName: "Default", isActive: true,  hasSalesToday: false, phone: "809-555-0120", address: "Av. Progreso 555",    city: "Jimani",        province: "Independencia",     createdAt: "2023-11-01", percentage: 1,  bankId: "bank-01" },
];

// ─── Admin Users ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
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
  { id: "u-001", username: "mmwrduser", fullName: "MMW Administrador",   email: "admin@mmw.lot",     role: "superadmin", zoneId: "z-01", zoneName: "Default", isActive: true, lastLogin: "2024-05-15T08:30:00Z", createdAt: "2023-01-01", privileges: ["all"] },
  { id: "u-002", username: "sfm056",    fullName: "SFM Usuario",         email: "sfm@mmw.lot",       role: "admin",      zoneId: "z-02", zoneName: "SFM",     isActive: true, lastLogin: "2024-05-14T16:45:00Z", createdAt: "2023-03-15", privileges: ["sales.view", "tickets.view", "results.view", "pools.view", "limits.view"] },
  { id: "u-003", username: "vale",      fullName: "Valentina Rodriguez", email: "vale@mmw.lot",      role: "operator",   zoneId: "z-01", zoneName: "Default", isActive: true, lastLogin: "2024-05-15T06:15:00Z", createdAt: "2023-06-20", privileges: ["sales.view", "tickets.create", "tickets.view"] },
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
  { id: "z-01", name: "Default", description: "Zona predeterminada para todas las bancas", bettingPoolCount: 17, isActive: true, color: "#4ECDC4" },
  { id: "z-02", name: "SFM",     description: "Zona San Francisco de Macoris",            bettingPoolCount: 3,  isActive: true, color: "#F59E0B" },
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
  { id: "lot-001", name: "Anguila 10AM",    color: "#FF6B6B", drawTime: "10AM", isActive: true,  abbreviation: "A10" },
  { id: "lot-002", name: "LA PRIMERA",      color: "#DDA0DD", drawTime: "10AM", isActive: true,  abbreviation: "LPM" },
  { id: "lot-003", name: "Florida AM",      color: "#FD79A8", drawTime: "10AM", isActive: true,  abbreviation: "FAM" },
  { id: "lot-004", name: "New York AM",     color: "#0984E3", drawTime: "10AM", isActive: true,  abbreviation: "NYA" },
  { id: "lot-005", name: "King Lottery AM", color: "#F9A826", drawTime: "10AM", isActive: true,  abbreviation: "KAM" },
  { id: "lot-006", name: "NACIONAL",        color: "#D63031", drawTime: "10AM", isActive: false, abbreviation: "NAC" },
  // 1PM
  { id: "lot-007", name: "Anguila 1PM",     color: "#4ECDC4", drawTime: "1PM",  isActive: true,  abbreviation: "A1P" },
  { id: "lot-008", name: "LOTEDOM",         color: "#FFD93D", drawTime: "1PM",  isActive: true,  abbreviation: "LTD" },
  { id: "lot-009", name: "LA SUERTE",       color: "#6BCB77", drawTime: "1PM",  isActive: true,  abbreviation: "LST" },
  { id: "lot-010", name: "Florida PM",      color: "#E84393", drawTime: "1PM",  isActive: true,  abbreviation: "FPM" },
  { id: "lot-011", name: "New York PM",     color: "#6C5CE7", drawTime: "1PM",  isActive: true,  abbreviation: "NYP" },
  { id: "lot-012", name: "King Lottery PM", color: "#E17055", drawTime: "1PM",  isActive: true,  abbreviation: "KPM" },
  // 6PM
  { id: "lot-013", name: "Anguila 6PM",     color: "#45B7D1", drawTime: "6PM",  isActive: true,  abbreviation: "A6P" },
  { id: "lot-014", name: "QUINIELA REAL",   color: "#74B9FF", drawTime: "6PM",  isActive: true,  abbreviation: "QRL" },
  { id: "lot-015", name: "LOTEKA",          color: "#00CEC9", drawTime: "6PM",  isActive: true,  abbreviation: "LOK" },
  { id: "lot-016", name: "GANA MAS",        color: "#55EFC4", drawTime: "6PM",  isActive: true,  abbreviation: "GAM" },
  // 9PM
  { id: "lot-017", name: "Anguila 9PM",     color: "#96CEB4", drawTime: "9PM",  isActive: true,  abbreviation: "A9P" },
  { id: "lot-018", name: "NACIONAL NOCHE",  color: "#D63031", drawTime: "9PM",  isActive: true,  abbreviation: "NNC" },
  { id: "lot-019", name: "LOTeka NOCHE",    color: "#00CEC9", drawTime: "9PM",  isActive: true,  abbreviation: "LKN" },
  { id: "lot-020", name: "QUINIELA REAL NOCHE", color: "#74B9FF", drawTime: "9PM", isActive: true, abbreviation: "QRN" },
  { id: "lot-021", name: "LA PRIMERA NOCHE",    color: "#DDA0DD", drawTime: "9PM", isActive: true, abbreviation: "LPN" },
  { id: "lot-022", name: "New York NOCHE",      color: "#6C5CE7", drawTime: "9PM", isActive: true, abbreviation: "NYN" },
  { id: "lot-023", name: "Florida NOCHE",       color: "#E84393", drawTime: "9PM", isActive: true, abbreviation: "FLN" },
  { id: "lot-024", name: "LA SUERTE NOCHE",     color: "#6BCB77", drawTime: "9PM", isActive: true, abbreviation: "LSN" },
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
    name: "Banco Default",
    balance: -233415.00,
    accountNumber: "001-0001234-5",
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

export const transactions: Transaction[] = [
  { id: "txn-001", type: "COBRO", amount: 5000.00,  bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", mwrCode: "MWR-0001", createdBy: "mmwrduser", createdAt: "2024-05-15T08:30:00Z", category: "Recaudacion", notes: "Cobro diario" },
  { id: "txn-002", type: "PAGO",  amount: 3500.00,  bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", mwrCode: "MWR-0001", createdBy: "mmwrduser", createdAt: "2024-05-14T16:45:00Z", category: "Premios",     notes: "Pago de premios" },
  { id: "txn-003", type: "COBRO", amount: 2500.00,  bettingPoolId: "bp-002", bettingPoolName: "MMW RD 02",     mwrCode: "MWR-0002", createdBy: "sfm056",    createdAt: "2024-05-13T10:00:00Z", category: "Recaudacion", notes: "Cobro parcial" },
  { id: "txn-004", type: "PAGO",  amount: 12000.00, bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", mwrCode: "MWR-0001", createdBy: "mmwrduser", createdAt: "2024-05-12T14:20:00Z", category: "Premios",     notes: "Premio mayor" },
  { id: "txn-005", type: "COBRO", amount: 8000.00,  bettingPoolId: "bp-003", bettingPoolName: "MMW RD 03",     mwrCode: "MWR-0003", createdBy: "vale",      createdAt: "2024-05-11T09:15:00Z", category: "Recaudacion", notes: "" },
  { id: "txn-006", type: "PAGO",  amount: 4500.00,  bettingPoolId: "bp-004", bettingPoolName: "MMW RD 04",     mwrCode: "MWR-0004", createdBy: "mmwrduser", createdAt: "2024-05-10T11:30:00Z", category: "Gastos",      notes: "Mantenimiento" },
  { id: "txn-007", type: "COBRO", amount: 15000.00, bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", mwrCode: "MWR-0001", createdBy: "mmwrduser", createdAt: "2024-05-09T07:45:00Z", category: "Recaudacion", notes: "Cobro semanal" },
  { id: "txn-008", type: "PAGO",  amount: 2800.00,  bettingPoolId: "bp-005", bettingPoolName: "MMW RD 05",     mwrCode: "MWR-0005", createdBy: "sfm056",    createdAt: "2024-05-08T15:00:00Z", category: "Premios",     notes: "" },
];

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

export const tickets: Ticket[] = [
  { id: "tk-001", number: "TK-240515-0001", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryName: "Anguila 1PM",   playType: "Quiniela", numbers: "12-34-56", amount: 100.00, createdAt: "2024-05-15T10:30:00Z", status: "active",   userId: "u-001", userName: "mmwrduser" },
  { id: "tk-002", number: "TK-240515-0002", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryName: "Anguila 1PM",   playType: "Pale",      numbers: "12-34",    amount: 50.00,  createdAt: "2024-05-15T10:35:00Z", status: "active",   userId: "u-003", userName: "vale" },
  { id: "tk-003", number: "TK-240515-0003", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryName: "New York PM",   playType: "Quiniela", numbers: "78-90-12", amount: 200.00, createdAt: "2024-05-15T11:00:00Z", status: "pending",  userId: "u-001", userName: "mmwrduser" },
  { id: "tk-004", number: "TK-240514-0001", bettingPoolId: "bp-002", bettingPoolName: "MMW RD 02",     lotteryName: "Anguila 10AM",  playType: "Tripleta",  numbers: "01-02-03", amount: 25.00,  createdAt: "2024-05-14T09:15:00Z", status: "paid",     userId: "u-002", userName: "sfm056" },
  { id: "tk-005", number: "TK-240514-0002", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryName: "Florida AM",    playType: "Quiniela", numbers: "45-67-89", amount: 150.00, createdAt: "2024-05-14T08:45:00Z", status: "cancelled",userId: "u-003", userName: "vale" },
  { id: "tk-006", number: "TK-240513-0001", bettingPoolId: "bp-003", bettingPoolName: "MMW RD 03",     lotteryName: "LA PRIMERA",    playType: "Pale",      numbers: "23-45",    amount: 75.00,  createdAt: "2024-05-13T10:00:00Z", status: "active",   userId: "u-001", userName: "mmwrduser" },
];

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

export const limits: Limit[] = [
  { id: "lim-001", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryId: "lot-007", lotteryName: "Anguila 1PM",   playType: "Quiniela", maxAmount: 5000.00, currentUsage: 3200.00, isActive: true, createdAt: "2024-01-01" },
  { id: "lim-002", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryId: "lot-007", lotteryName: "Anguila 1PM",   playType: "Pale",      maxAmount: 3000.00, currentUsage: 1800.00, isActive: true, createdAt: "2024-01-01" },
  { id: "lim-003", bettingPoolId: "bp-001", bettingPoolName: "MATADOR-SPORT", lotteryId: "lot-012", lotteryName: "King Lottery PM", playType: "Quiniela", maxAmount: 4000.00, currentUsage: 900.00,  isActive: true, createdAt: "2024-01-01" },
  { id: "lim-004", bettingPoolId: "bp-002", bettingPoolName: "MMW RD 02",     lotteryId: "lot-001", lotteryName: "Anguila 10AM",  playType: "Quiniela", maxAmount: 2000.00, currentUsage: 1500.00, isActive: true, createdAt: "2024-02-01" },
  { id: "lim-005", bettingPoolId: "bp-002", bettingPoolName: "MMW RD 02",     lotteryId: "lot-001", lotteryName: "Anguila 10AM",  playType: "Pale",      maxAmount: 1500.00, currentUsage: 500.00,  isActive: true, createdAt: "2024-02-01" },
];

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

export const lotteryResults: LotteryResult[] = [
  { id: "res-001", lotteryId: "lot-001", lotteryName: "Anguila 10AM", color: "#FF6B6B", drawTime: "10AM", date: "2024-05-15", first: "12", second: "34", third: "56", status: "confirmed", createdAt: "2024-05-15T10:05:00Z" },
  { id: "res-002", lotteryId: "lot-007", lotteryName: "Anguila 1PM",  color: "#4ECDC4", drawTime: "1PM",  date: "2024-05-15", first: "78", second: "90", third: "23", status: "pending",   createdAt: "2024-05-15T13:05:00Z" },
  { id: "res-003", lotteryId: "lot-013", lotteryName: "Anguila 6PM",  color: "#45B7D1", drawTime: "6PM",  date: "2024-05-14", first: "45", second: "67", third: "89", status: "confirmed", createdAt: "2024-05-14T18:05:00Z" },
  { id: "res-004", lotteryId: "lot-017", lotteryName: "Anguila 9PM",  color: "#96CEB4", drawTime: "9PM",  date: "2024-05-14", first: "01", second: "02", third: "03", status: "confirmed", createdAt: "2024-05-14T21:05:00Z" },
  { id: "res-005", lotteryId: "lot-002", lotteryName: "LA PRIMERA",   color: "#DDA0DD", drawTime: "10AM", date: "2024-05-15", first: "11", second: "22", third: "33", status: "confirmed", createdAt: "2024-05-15T10:15:00Z" },
  { id: "res-006", lotteryId: "lot-008", lotteryName: "LOTEDOM",      color: "#FFD93D", drawTime: "1PM",  date: "2024-05-15", first: "44", second: "55", third: "66", status: "pending",   createdAt: "2024-05-15T13:15:00Z" },
  { id: "res-007", lotteryId: "lot-003", lotteryName: "Florida AM",   color: "#FD79A8", drawTime: "10AM", date: "2024-05-15", first: "77", second: "88", third: "99", status: "confirmed", createdAt: "2024-05-15T10:30:00Z" },
  { id: "res-008", lotteryId: "lot-004", lotteryName: "New York AM",  color: "#0984E3", drawTime: "10AM", date: "2024-05-15", first: "10", second: "20", third: "30", status: "confirmed", createdAt: "2024-05-15T10:45:00Z" },
];

// ─── Privileges ─────────────────────────────────────────────────────────────────

export interface Privilege {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const privileges: Privilege[] = [
  // Dashboard
  { id: "dashboard.view",      name: "Ver Dashboard",           category: "Dashboard",    description: "Acceso al panel principal" },
  { id: "dashboard.cobros",    name: "Crear Cobros/Pagos",      category: "Dashboard",    description: "Crear transacciones de cobro y pago" },
  // Ventas
  { id: "sales.view",          name: "Ver Ventas",              category: "Ventas",       description: "Ver reportes de ventas" },
  { id: "sales.daily",         name: "Ventas del Dia",          category: "Ventas",       description: "Acceso a ventas diarias" },
  { id: "sales.historical",    name: "Ventas Historicas",       category: "Ventas",       description: "Ver historial de ventas" },
  { id: "sales.by-date",       name: "Ventas por Fecha",        category: "Ventas",       description: "Filtrar ventas por fecha" },
  { id: "sales.prizes",        name: "Premios por Jugada",      category: "Ventas",       description: "Ver premios por tipo de jugada" },
  { id: "sales.percentages",   name: "Porcentajes",             category: "Ventas",       description: "Ver porcentajes de ventas" },
  { id: "sales.pools",         name: "Ventas por Banca",        category: "Ventas",       description: "Ver ventas por banca" },
  { id: "sales.zones",         name: "Ventas por Zona",         category: "Ventas",       description: "Ver ventas por zona" },
  // Tickets
  { id: "tickets.view",        name: "Ver Tickets",             category: "Tickets",      description: "Ver lista de tickets" },
  { id: "tickets.create",      name: "Crear Tickets",           category: "Tickets",      description: "Crear nuevos tickets" },
  { id: "tickets.monitor",     name: "Monitoreo de Jugadas",    category: "Tickets",      description: "Monitorear jugadas en tiempo real" },
  { id: "tickets.plays",       name: "Ver Jugadas",             category: "Tickets",      description: "Ver jugadas realizadas" },
  { id: "tickets.winners",     name: "Jugadas Ganadoras",       category: "Tickets",      description: "Ver jugadas ganadoras" },
  { id: "tickets.blackboard",  name: "Pizarra",                 category: "Tickets",      description: "Ver pizarra de resultados" },
  { id: "tickets.anomalies",   name: "Anomalias",               category: "Tickets",      description: "Ver anomalias en tickets" },
  // Resultados
  { id: "results.view",        name: "Ver Resultados",          category: "Resultados",   description: "Ver resultados de loterias" },
  { id: "results.manage",      name: "Gestionar Resultados",    category: "Resultados",   description: "Crear y editar resultados" },
  // Bancas
  { id: "pools.view",          name: "Ver Bancas",              category: "Bancas",       description: "Ver lista de bancas" },
  { id: "pools.create",        name: "Crear Bancas",            category: "Bancas",       description: "Crear nuevas bancas" },
  { id: "pools.edit",          name: "Editar Bancas",           category: "Bancas",       description: "Editar bancas existentes" },
  { id: "pools.mass-edit",     name: "Edicion Masiva",          category: "Bancas",       description: "Editar multiples bancas" },
  { id: "pools.access",        name: "Acceso a Bancas",         category: "Bancas",       description: "Gestionar acceso a bancas" },
  { id: "pools.clean",         name: "Limpiar Pendientes",      category: "Bancas",       description: "Limpiar pagos pendientes" },
  { id: "pools.no-sales",      name: "Bancas sin Ventas",       category: "Bancas",       description: "Ver bancas sin ventas" },
  // Balances
  { id: "balances.view",       name: "Ver Balances",            category: "Balances",     description: "Ver balances de bancas y bancos" },
  { id: "balances.pools",      name: "Balances Bancas",         category: "Balances",     description: "Ver balances por banca" },
  { id: "balances.banks",      name: "Balances Bancos",         category: "Balances",     description: "Ver balances por banco" },
  // Usuarios
  { id: "users.view",          name: "Ver Usuarios",            category: "Usuarios",     description: "Ver lista de usuarios" },
  { id: "users.create",        name: "Crear Usuarios",          category: "Usuarios",     description: "Crear nuevos usuarios" },
  { id: "users.edit",          name: "Editar Usuarios",         category: "Usuarios",     description: "Editar usuarios existentes" },
  { id: "users.delete",        name: "Eliminar Usuarios",       category: "Usuarios",     description: "Eliminar usuarios" },
  { id: "users.admins",        name: "Ver Administradores",     category: "Usuarios",     description: "Ver administradores" },
  { id: "users.login-logs",    name: "Ver Inicios de Sesion",   category: "Usuarios",     description: "Ver logs de inicio de sesion" },
  { id: "users.blocked",       name: "Ver Sesiones Bloqueadas", category: "Usuarios",     description: "Ver sesiones bloqueadas" },
  // Cobros/Pagos
  { id: "payments.view",       name: "Ver Cobros/Pagos",        category: "Cobros/Pagos", description: "Ver lista de cobros y pagos" },
  { id: "payments.create",     name: "Crear Cobros/Pagos",      category: "Cobros/Pagos", description: "Crear cobros y pagos" },
  // Transacciones
  { id: "transactions.view",   name: "Ver Transacciones",       category: "Transacciones",description: "Ver transacciones" },
  { id: "transactions.groups", name: "Transacciones por Grupo", category: "Transacciones",description: "Ver transacciones agrupadas" },
  { id: "transactions.summary",name: "Resumen Transacciones",   category: "Transacciones",description: "Ver resumen de transacciones" },
  { id: "transactions.categories",name:"Categorias de Gastos",   category: "Transacciones",description: "Gestionar categorias de gastos" },
  // Limites
  { id: "limits.view",         name: "Ver Limites",             category: "Limites",      description: "Ver limites configurados" },
  { id: "limits.create",       name: "Crear Limites",           category: "Limites",      description: "Crear nuevos limites" },
  { id: "limits.automatic",    name: "Limites Automaticos",     category: "Limites",      description: "Configurar limites automaticos" },
  // Sorteos
  { id: "sorteos.view",        name: "Ver Sorteos",             category: "Sorteos",      description: "Ver informacion de sorteos" },
  { id: "sorteos.schedule",    name: "Horario Sorteos",         category: "Sorteos",      description: "Ver horarios de sorteos" },
  // Zonas
  { id: "zones.view",          name: "Ver Zonas",               category: "Zonas",        description: "Ver zonas" },
  { id: "zones.create",        name: "Crear Zonas",             category: "Zonas",        description: "Crear zonas" },
  { id: "zones.manage",        name: "Manejar Zonas",           category: "Zonas",        description: "Administrar zonas" },
  // Entidades
  { id: "entities.view",       name: "Ver Entidades",           category: "Entidades",    description: "Ver entidades contables" },
  { id: "entities.create",     name: "Crear Entidades",         category: "Entidades",    description: "Crear entidades contables" },
  // Notificaciones
  { id: "notifications.view",  name: "Ver Notificaciones",      category: "Notificaciones",description:"Ver notificaciones" },
  { id: "notifications.send",  name: "Enviar Notificaciones",   category: "Notificaciones",description:"Enviar notificaciones push" },
  // Configuracion
  { id: "settings.view",       name: "Ver Configuracion",       category: "Configuracion",description: "Acceso a configuracion" },
  { id: "settings.password",   name: "Cambiar Contrasena",      category: "Configuracion",description: "Cambiar contrasena" },
  { id: "settings.language",   name: "Cambiar Idioma",          category: "Configuracion",description: "Cambiar idioma" },
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
  { id: "exp-001", name: "Premios",         description: "Pagos de premios a ganadores",   isActive: true, color: "#22C55E" },
  { id: "exp-002", name: "Gastos operativos",description: "Gastos de operacion diaria",    isActive: true, color: "#3B82F6" },
  { id: "exp-003", name: "Mantenimiento",   description: "Mantenimiento de equipos",       isActive: true, color: "#F59E0B" },
  { id: "exp-004", name: "Alquiler",        description: "Pago de alquiler de locales",    isActive: true, color: "#EF4444" },
  { id: "exp-005", name: "Servicios",       description: "Pago de servicios publicos",     isActive: true, color: "#8B5CF6" },
  { id: "exp-006", name: "Nomina",          description: "Pago de salarios",               isActive: true, color: "#EC4899" },
  { id: "exp-007", name: "Impuestos",       description: "Pago de impuestos",              isActive: true, color: "#14B8A6" },
  { id: "exp-008", name: "Otros",           description: "Otros gastos",                   isActive: true, color: "#6B7280" },
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
  { id: "ent-001", name: "Entidad Principal", type: "Principal", balance: 500000.00, isActive: true, createdAt: "2023-01-01", phone: "809-555-0001", email: "principal@lottery.com" },
  { id: "ent-002", name: "Entidad Secundaria",type: "Secundaria",balance: 250000.00, isActive: true, createdAt: "2023-02-01", phone: "809-555-0002", email: "secundaria@lottery.com" },
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
  { id: "mail-001", name: "Administrador", email: "admin@mmw.lot",     type: "Admin",    isActive: true, notifyOnResults: true, notifyOnSales: true, notifyOnAlerts: true },
  { id: "mail-002", name: "Soporte",       email: "soporte@mmw.lot",   type: "Soporte",  isActive: true, notifyOnResults: true, notifyOnSales: false, notifyOnAlerts: true },
  { id: "mail-003", name: "Ventas",        email: "ventas@mmw.lot",    type: "Ventas",   isActive: true, notifyOnResults: false, notifyOnSales: true, notifyOnAlerts: false },
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

export const notifications: Notification[] = [
  { id: "notif-001", title: "Resultado confirmado", message: "Anguila 10AM - 12-34-56", type: "success", isRead: false, createdAt: "2024-05-15T10:10:00Z", userId: "u-001" },
  { id: "notif-002", title: "Limite alcanzado",     message: "MATADOR-SPORT cerca del limite en Anguila 1PM", type: "warning", isRead: false, createdAt: "2024-05-15T09:30:00Z", userId: "u-001" },
  { id: "notif-003", title: "Nuevo usuario",        message: "Usuario vale ha iniciado sesion", type: "info", isRead: true, createdAt: "2024-05-15T06:20:00Z", userId: "u-001" },
  { id: "notif-004", title: "Error de sistema",     message: "Error al procesar ticket TK-240515-0003", type: "error", isRead: false, createdAt: "2024-05-14T22:00:00Z", userId: "u-001" },
  { id: "notif-005", title: "Cobro registrado",     message: "Cobro de $5,000.00 registrado para MATADOR-SPORT", type: "success", isRead: true, createdAt: "2024-05-14T08:35:00Z", userId: "u-001" },
];

// ─── Sales Activity ─────────────────────────────────────────────────────────────

export interface SalesActivity {
  day: string;
  dayEn: string;
  date: string;
  count: number;
  totalAmount: number;
}

export const salesActivity: SalesActivity[] = [
  { day: "Lunes",     dayEn: "Monday",    date: "2024-05-13", count: 1, totalAmount: 2500.00 },
  { day: "Martes",    dayEn: "Tuesday",   date: "2024-05-14", count: 3, totalAmount: 15750.00 },
  { day: "Miercoles", dayEn: "Wednesday", date: "2024-05-15", count: 2, totalAmount: 8900.00 },
  { day: "Jueves",    dayEn: "Thursday",  date: "2024-05-16", count: 0, totalAmount: 0.00 },
  { day: "Viernes",   dayEn: "Friday",    date: "2024-05-17", count: 0, totalAmount: 0.00 },
  { day: "Sabado",    dayEn: "Saturday",  date: "2024-05-18", count: 1, totalAmount: 4200.00 },
  { day: "Domingo",   dayEn: "Sunday",    date: "2024-05-19", count: 0, totalAmount: 0.00 },
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
  { label: "Total Bancas",       labelEn: "Total Pools",      value: 20,      color: "#333333",  icon: "Building2",   format: "number" },
  { label: "Bancas Activas Hoy", labelEn: "Active Today",     value: 2,       color: "#22C55E",  icon: "Activity",    format: "number" },
  { label: "Total Ventas Hoy",   labelEn: "Today's Sales",    value: 8900,    color: "#4ECDC4",  icon: "TrendingUp",  format: "currency", prefix: "$" },
  { label: "Balance General",    labelEn: "General Balance",  value: -233415, color: "#EF4444",  icon: "Wallet",      format: "currency", prefix: "$" },
];

// ─── Top Performing Pools ───────────────────────────────────────────────────────

export interface TopPool {
  id: string;
  name: string;
  mwrCode: string;
  salesAmount: number;
  ticketCount: number;
}

export const topPools: TopPool[] = [
  { id: "bp-001", name: "MATADOR-SPORT", mwrCode: "MWR-0001", salesAmount: 45230.00, ticketCount: 342 },
  { id: "bp-002", name: "MMW RD 02",     mwrCode: "MWR-0002", salesAmount: 28450.00, ticketCount: 198 },
  { id: "bp-003", name: "MMW RD 03",     mwrCode: "MWR-0003", salesAmount: 18760.00, ticketCount: 156 },
  { id: "bp-004", name: "MMW RD 04",     mwrCode: "MWR-0004", salesAmount: 12340.00, ticketCount: 98 },
  { id: "bp-005", name: "MMW RD 05",     mwrCode: "MWR-0005", salesAmount: 8920.00,  ticketCount: 67 },
  { id: "bp-006", name: "MMW RD 06",     mwrCode: "MWR-0006", salesAmount: 6540.00,  ticketCount: 45 },
  { id: "bp-007", name: "MMW RD 07",     mwrCode: "MWR-0007", salesAmount: 4320.00,  ticketCount: 34 },
  { id: "bp-008", name: "MMW RD 08",     mwrCode: "MWR-0008", salesAmount: 2100.00,  ticketCount: 18 },
];

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
  { id: "sess-001", userId: "u-001", username: "mmwrduser", fullName: "MMW Administrador", ipAddress: "192.168.1.100", loginAt: "2024-05-15T08:30:00Z", status: "active",  device: "Windows PC", browser: "Chrome 124" },
  { id: "sess-002", userId: "u-002", username: "sfm056",    fullName: "SFM Usuario",       ipAddress: "192.168.1.105", loginAt: "2024-05-14T16:45:00Z", logoutAt: "2024-05-14T23:30:00Z", status: "closed",  device: "Android",    browser: "Chrome Mobile" },
  { id: "sess-003", userId: "u-003", username: "vale",      fullName: "Valentina Rodriguez",ipAddress:"192.168.1.110", loginAt: "2024-05-15T06:15:00Z", status: "active",  device: "iPhone",     browser: "Safari" },
  { id: "sess-004", userId: "u-001", username: "mmwrduser", fullName: "MMW Administrador", ipAddress: "10.0.0.55",     loginAt: "2024-05-13T09:00:00Z", logoutAt: "2024-05-13T18:00:00Z", status: "closed",  device: "Windows PC", browser: "Firefox" },
  { id: "sess-005", userId: "u-002", username: "sfm056",    fullName: "SFM Usuario",       ipAddress: "192.168.1.200", loginAt: "2024-05-10T08:00:00Z", status: "blocked", device: "Tablet",     browser: "Chrome 123" },
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
  { id: "pt-001", name: "Quiniela",   description: "Acierta 1 numero",             payoutMultiplier: 85,   isActive: true,  color: "#4ECDC4" },
  { id: "pt-002", name: "Pale",       description: "Acierta 2 numeros en orden",   payoutMultiplier: 800,  isActive: true,  color: "#45B7D1" },
  { id: "pt-003", name: "Tripleta",   description: "Acierta 3 numeros en orden",   payoutMultiplier: 2500, isActive: true,  color: "#96CEB4" },
  { id: "pt-004", name: "Super Pale", description: "Pale de 2 loterias diferentes",payoutMultiplier: 600,  isActive: true,  color: "#F9A826" },
  { id: "pt-005", name: "Combo",      description: "Combinacion de jugadas",       payoutMultiplier: 400,  isActive: true,  color: "#DDA0DD" },
];
