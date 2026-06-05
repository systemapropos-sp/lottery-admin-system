import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import LayoutShell from "@/components/layout/LayoutShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import StubPage from "@/pages/StubPage";

// Sorteos
import ListaSorteos from "@/pages/sorteos/ListaSorteos";
import HorarioSorteos from "@/pages/sorteos/HorarioSorteos";

// F8 Monitoreo
import F8Monitoreo from "@/pages/F8Monitoreo";

// Zonas
import ListaZonas from "@/pages/zonas/ListaZonas";
import CrearZona from "@/pages/zonas/CrearZona";
import ManejarZonas from "@/pages/zonas/ManejarZonas";

// ─── Stub Route Helper ──────────────────────────────────────────────────────────

function Stub({ title }: { title: string }) {
  return (
    <LayoutShell>
      <StubPage title={title} />
    </LayoutShell>
  );
}

// ─── Protected Route Wrapper ────────────────────────────────────────────────────

function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/sessions/new" replace />;
  }
  return <LayoutShell>{children}</LayoutShell>;
}

// ─── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/sessions/new" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── VENTAS ─────────────────────────────────────────────── */}
      <Route path="/sales/daily" element={<Stub title="Ventas del dia" />} />
      <Route path="/sales/historical" element={<Stub title="Ventas Historico" />} />
      <Route path="/sales/by-date" element={<Stub title="Ventas por fecha" />} />
      <Route path="/sales/zones" element={<Stub title="Ventas por Zonas" />} />
      <Route path="/play-type-prizes" element={<Stub title="Premios por jugada" />} />
      <Route path="/play-type-prizes-percentages" element={<Stub title="Porcentajes" />} />
      <Route path="/sales/betting-pool" element={<Stub title="Ventas por Banca" />} />

      {/* ── TICKETS ────────────────────────────────────────────── */}
      <Route path="/tickets/create" element={<Stub title="Crear Ticket" />} />
      <Route path="/tickets" element={<Stub title="Tickets" />} />
      <Route path="/play-amounts" element={<Stub title="Jugadas" />} />
      <Route path="/winning-plays" element={<Stub title="Jugadas ganadoras" />} />
      <Route path="/blackboard" element={<Stub title="Pizarra" />} />
      <Route path="/anomalies" element={<Stub title="Anomalias" />} />

      {/* ── RESULTADOS ─────────────────────────────────────────── */}
      <Route path="/results" element={<Stub title="Resultados" />} />

      {/* ── BANCAS ─────────────────────────────────────────────── */}
      <Route path="/betting-pools" element={<Stub title="Bancas" />} />
      <Route path="/betting-pools/new" element={<Stub title="Crear Banca" />} />
      <Route path="/betting-pools/mass-edit" element={<Stub title="Edicion masiva de Bancas" />} />
      <Route path="/betting-pool-access" element={<Stub title="Acceso a Bancas" />} />
      <Route path="/clean-pending-for-payment" element={<Stub title="Limpiar pendientes" />} />
      <Route path="/betting-pools-without-sales" element={<Stub title="Bancas sin ventas" />} />
      <Route path="/days-without-sales" element={<Stub title="Dias sin venta" />} />

      {/* ── BALANCES ───────────────────────────────────────────── */}
      <Route path="/balances/betting-pools" element={<Stub title="Balances de Bancas" />} />
      <Route path="/balances/banks" element={<Stub title="Balances de Bancos" />} />

      {/* ── USUARIOS ───────────────────────────────────────────── */}
      <Route path="/users" element={<Stub title="Usuarios" />} />
      <Route path="/pool-users" element={<Stub title="Usuarios de Banca" />} />
      <Route path="/users/administrators" element={<Stub title="Administradores" />} />
      <Route path="/users/new" element={<Stub title="Crear Usuario" />} />
      <Route path="/login-logs" element={<Stub title="Inicios de sesion" />} />
      <Route path="/group-security/blocked-logins" element={<Stub title="Sesiones bloqueadas" />} />

      {/* ── COBROS/PAGOS ───────────────────────────────────────── */}
      <Route path="/simplified-accountable-transaction-groups" element={<Stub title="Cobros y Pagos" />} />

      {/* ── TRANSACCIONES ──────────────────────────────────────── */}
      <Route path="/accountable-transactions" element={<Stub title="Transacciones" />} />
      <Route path="/accountable-transactions/groups" element={<Stub title="Transacciones por Grupos" />} />
      <Route path="/accountable-transactions/summary" element={<Stub title="Resumen de Transacciones" />} />
      <Route path="/accountable-transactions/pools" element={<Stub title="Transacciones por Banca" />} />
      <Route path="/accountable-transactions/categories" element={<Stub title="Categorias de Gastos" />} />

      {/* ── LIMITES ────────────────────────────────────────────── */}
      <Route path="/limits" element={<Stub title="Limites" />} />
      <Route path="/limits/new" element={<Stub title="Crear Limite" />} />
      <Route path="/limits/automatic" element={<Stub title="Limites automaticos" />} />

      {/* ── SORTEOS ────────────────────────────────────────────── */}
      <Route path="/sortition-informations" element={<Protected><ListaSorteos /></Protected>} />
      <Route path="/sortition-schedules" element={<Protected><HorarioSorteos /></Protected>} />

      {/* ── F8 MONITOREO ───────────────────────────────────────── */}
      <Route path="/betting-pool-play-monitor" element={<Protected><F8Monitoreo /></Protected>} />

      {/* ── ZONAS ──────────────────────────────────────────────── */}
      <Route path="/zones" element={<Protected><ListaZonas /></Protected>} />
      <Route path="/zones/new" element={<Protected><CrearZona /></Protected>} />
      <Route path="/zones/manage" element={<Protected><ManejarZonas /></Protected>} />

      {/* ── ENTIDADES ──────────────────────────────────────────── */}
      <Route path="/accountable-entities" element={<Stub title="Entidades Contables" />} />

      {/* ── RECEPTORES ─────────────────────────────────────────── */}
      <Route path="/mail-receptors" element={<Stub title="Receptores de Correo" />} />

      {/* ── NOTIFICACIONES ─────────────────────────────────────── */}
      <Route path="/notifications/new" element={<Stub title="Notificaciones" />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
