import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import LayoutShell from "@/components/layout/LayoutShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import StubPage from "@/pages/StubPage";

// ─── Ventas ─────────────────────────────────────────────────────────────────────
import VentasDelDia from "@/pages/ventas/VentasDelDia";
import VentasHistorico from "@/pages/ventas/VentasHistorico";
import VentasPorFecha from "@/pages/ventas/VentasPorFecha";
import PremiosPorJugada from "@/pages/ventas/PremiosPorJugada";
import Porcentajes from "@/pages/ventas/Porcentajes";
import VentasBancas from "@/pages/ventas/VentasBancas";
import VentasZonas from "@/pages/ventas/VentasZonas";

// ─── Tickets ────────────────────────────────────────────────────────────────────
import CrearTicket from "@/pages/tickets/CrearTicket";
import MonitoreoTickets from "@/pages/tickets/MonitoreoTickets";
import Jugadas from "@/pages/tickets/Jugadas";
import JugadasGanadoras from "@/pages/tickets/JugadasGanadoras";
import Pizarra from "@/pages/tickets/Pizarra";
import Anomalias from "@/pages/tickets/Anomalias";

// ─── Resultados ─────────────────────────────────────────────────────────────────
import Resultados from "@/pages/Resultados";

// ─── Bancas ─────────────────────────────────────────────────────────────────────
import ListaBancas from "@/pages/bancas/ListaBancas";
import CrearBanca from "@/pages/bancas/CrearBanca";
import EdicionMasiva from "@/pages/bancas/EdicionMasiva";
import AccesoBancas from "@/pages/bancas/AccesoBancas";
import LimpiarPendientes from "@/pages/bancas/LimpiarPendientes";
import ListaSinVentas from "@/pages/bancas/ListaSinVentas";
import ReporteDiasSinVenta from "@/pages/bancas/ReporteDiasSinVenta";

// ─── Balances ───────────────────────────────────────────────────────────────────
import BalanceBancas from "@/pages/balances/BalanceBancas";
import BalanceBancos from "@/pages/balances/BalanceBancos";

// ─── Usuarios ───────────────────────────────────────────────────────────────────
import ListaUsuarios from "@/pages/usuarios/ListaUsuarios";
import UsuariosBanca from "@/pages/usuarios/UsuariosBanca";
import Administradores from "@/pages/usuarios/Administradores";
import CrearUsuario from "@/pages/usuarios/CrearUsuario";
import IniciosSesion from "@/pages/usuarios/IniciosSesion";
import SesionesBloqueadas from "@/pages/usuarios/SesionesBloqueadas";

// ─── Cobros/Pagos ───────────────────────────────────────────────────────────────
import ListaCobros from "@/pages/cobros/ListaCobros";

// ─── Transacciones ──────────────────────────────────────────────────────────────
import ListaTransacciones from "@/pages/transacciones/ListaTransacciones";
import ListaPorGrupos from "@/pages/transacciones/ListaPorGrupos";
import ResumenTransacciones from "@/pages/transacciones/ResumenTransacciones";
import TransaccionesBancas from "@/pages/transacciones/TransaccionesBancas";
import CategoriasGastos from "@/pages/transacciones/CategoriasGastos";

// ─── Limites ────────────────────────────────────────────────────────────────────
import ListaLimites from "@/pages/limites/ListaLimites";
import CrearLimite from "@/pages/limites/CrearLimite";
import LimitesAutomaticos from "@/pages/limites/LimitesAutomaticos";

// ─── Sorteos ────────────────────────────────────────────────────────────────────
import ListaSorteos from "@/pages/sorteos/ListaSorteos";
import HorarioSorteos from "@/pages/sorteos/HorarioSorteos";

// ─── F8 Monitoreo ───────────────────────────────────────────────────────────────
import F8Monitoreo from "@/pages/F8Monitoreo";

// ─── Zonas ──────────────────────────────────────────────────────────────────────
import ListaZonas from "@/pages/zonas/ListaZonas";
import CrearZona from "@/pages/zonas/CrearZona";
import ManejarZonas from "@/pages/zonas/ManejarZonas";

// ─── Entidades Contables ────────────────────────────────────────────────────────
import ListaEntidades from "@/pages/entidades/ListaEntidades";

// ─── Receptores de Correo ───────────────────────────────────────────────────────
import ListaReceptores from "@/pages/receptores/ListaReceptores";
import CrearReceptor from "@/pages/receptores/CrearReceptor";

// ─── Notificaciones ─────────────────────────────────────────────────────────────
import Notificaciones from "@/pages/Notificaciones";

// ─── Settings ───────────────────────────────────────────────────────────────────
import SettingsPage from "@/pages/SettingsPage";

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
      <Route path="/sales/daily" element={<Protected><VentasDelDia /></Protected>} />
      <Route path="/sales/historical" element={<Protected><VentasHistorico /></Protected>} />
      <Route path="/sales/by-date" element={<Protected><VentasPorFecha /></Protected>} />
      <Route path="/sales/zones" element={<Protected><VentasZonas /></Protected>} />
      <Route path="/play-type-prizes" element={<Protected><PremiosPorJugada /></Protected>} />
      <Route path="/play-type-prizes-percentages" element={<Protected><Porcentajes /></Protected>} />
      <Route path="/sales/betting-pool" element={<Protected><VentasBancas /></Protected>} />

      {/* ── TICKETS ────────────────────────────────────────────── */}
      <Route path="/tickets/create" element={<Protected><CrearTicket /></Protected>} />
      <Route path="/tickets" element={<Protected><MonitoreoTickets /></Protected>} />
      <Route path="/play-amounts" element={<Protected><Jugadas /></Protected>} />
      <Route path="/winning-plays" element={<Protected><JugadasGanadoras /></Protected>} />
      <Route path="/blackboard" element={<Protected><Pizarra /></Protected>} />
      <Route path="/anomalies" element={<Protected><Anomalias /></Protected>} />

      {/* ── RESULTADOS ─────────────────────────────────────────── */}
      <Route path="/results" element={<Protected><Resultados /></Protected>} />

      {/* ── BANCAS ─────────────────────────────────────────────── */}
      <Route path="/betting-pools" element={<Protected><ListaBancas /></Protected>} />
      <Route path="/betting-pools/new" element={<Protected><CrearBanca /></Protected>} />
      <Route path="/betting-pools/mass-edit" element={<Protected><EdicionMasiva /></Protected>} />
      <Route path="/betting-pool-access" element={<Protected><AccesoBancas /></Protected>} />
      <Route path="/clean-pending-for-payment" element={<Protected><LimpiarPendientes /></Protected>} />
      <Route path="/betting-pools-without-sales" element={<Protected><ListaSinVentas /></Protected>} />
      <Route path="/days-without-sales" element={<Protected><ReporteDiasSinVenta /></Protected>} />

      {/* ── BALANCES ───────────────────────────────────────────── */}
      <Route path="/balances/betting-pools" element={<Protected><BalanceBancas /></Protected>} />
      <Route path="/balances/banks" element={<Protected><BalanceBancos /></Protected>} />

      {/* ── USUARIOS ───────────────────────────────────────────── */}
      <Route path="/users" element={<Protected><ListaUsuarios /></Protected>} />
      <Route path="/pool-users" element={<Protected><UsuariosBanca /></Protected>} />
      <Route path="/users/administrators" element={<Protected><Administradores /></Protected>} />
      <Route path="/users/new" element={<Protected><CrearUsuario /></Protected>} />
      <Route path="/login-logs" element={<Protected><IniciosSesion /></Protected>} />
      <Route path="/group-security/blocked-logins" element={<Protected><SesionesBloqueadas /></Protected>} />

      {/* ── COBROS/PAGOS ───────────────────────────────────────── */}
      <Route path="/simplified-accountable-transaction-groups" element={<Protected><ListaCobros /></Protected>} />

      {/* ── TRANSACCIONES ──────────────────────────────────────── */}
      <Route path="/accountable-transactions" element={<Protected><ListaTransacciones /></Protected>} />
      <Route path="/accountable-transactions/groups" element={<Protected><ListaPorGrupos /></Protected>} />
      <Route path="/accountable-transactions/summary" element={<Protected><ResumenTransacciones /></Protected>} />
      <Route path="/accountable-transactions/pools" element={<Protected><TransaccionesBancas /></Protected>} />
      <Route path="/accountable-transactions/categories" element={<Protected><CategoriasGastos /></Protected>} />

      {/* ── LIMITES ────────────────────────────────────────────── */}
      <Route path="/limits" element={<Protected><ListaLimites /></Protected>} />
      <Route path="/limits/new" element={<Protected><CrearLimite /></Protected>} />
      <Route path="/limits/automatic" element={<Protected><LimitesAutomaticos /></Protected>} />

      {/* ── SORTEOS ────────────────────────────────────────────── */}
      <Route path="/sortition-informations" element={<Protected><ListaSorteos /></Protected>} />
      <Route path="/sortition-schedules" element={<Protected><HorarioSorteos /></Protected>} />

      {/* ── F8 MONITOREO ───────────────────────────────────────── */}
      <Route path="/betting-pool-play-monitor" element={<Protected><F8Monitoreo /></Protected>} />

      {/* ── ZONAS ──────────────────────────────────────────────── */}
      <Route path="/zones" element={<Protected><ListaZonas /></Protected>} />
      <Route path="/zones/new" element={<Protected><CrearZona /></Protected>} />
      <Route path="/zones/manage" element={<Protected><ManejarZonas /></Protected>} />

      {/* ── ENTIDADES CONTABLES ────────────────────────────────── */}
      <Route path="/accountable-entities" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/new" element={<Protected><Stub title="Crear Entidad Contable" /></Protected>} />

      {/* ── RECEPTORES DE CORREO ───────────────────────────────── */}
      <Route path="/mail-receptors" element={<Protected><ListaReceptores /></Protected>} />
      <Route path="/mail-receptors/new" element={<Protected><CrearReceptor /></Protected>} />

      {/* ── NOTIFICACIONES ─────────────────────────────────────── */}
      <Route path="/notifications/new" element={<Protected><Notificaciones /></Protected>} />

      {/* ── SETTINGS ───────────────────────────────────────────── */}
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
