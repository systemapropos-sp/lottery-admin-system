import React, { useEffect, useState } from "react";
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
import LimitesNumerosPage from "@/pages/limites/LimitesNumerosPage";
import LimitacionNumerosPage from "@/pages/limites/LimitacionNumerosPage";
import EliminarLimites from "@/pages/limites/EliminarLimites";
import MovilPage from "@/pages/movil/MovilPage";

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

// ─── SuperAdmin ──────────────────────────────────────────────────────────────────
import SuperAdminPage from "@/pages/SuperAdminPage";

// ─── Activity Log ─────────────────────────────────────────────────────────────
import ActivityLogPage from "@/pages/ActivityLogPage";

// ─── Contabilidad ───────────────────────────────────────────────────────────────
import ContabilidadPage from "@/pages/contabilidad/ContabilidadPage";

// ─── Préstamos ───────────────────────────────────────────────────────────────────
import PrestamosPage from "@/pages/prestamos/PrestamosPage";
import InstallPWA from "@/components/InstallPWA";

// ─── Cobradores ──────────────────────────────────────────────────────────────────
import CobraHub from "@/pages/cobradores/CobraHub";
import ListaCobradores from "@/pages/cobradores/ListaCobradores";
import CrearCobrador from "@/pages/cobradores/CrearCobrador";
import RutasZonas from "@/pages/cobradores/RutasZonas";
import CobrosDelDia from "@/pages/cobradores/CobrosDelDia";
import HistorialCobros from "@/pages/cobradores/HistorialCobros";
import BalanceCobrador from "@/pages/cobradores/BalanceCobrador";
import CapitalCaja from "@/pages/cobradores/CapitalCaja";

function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/sessions/new" replace />;
  }
  return <LayoutShell>{children}</LayoutShell>;
}

// ─── App ────────────────────────────────────────────────────────────────────────


// --- AutoLoginCheck (vendor-portal auto-login) --------------------
//
// Runs BEFORE any route guard, OUTSIDE <Routes>. Detects:
//   1. URL hash query param ?p=0587 (HashRouter: /#/?p=0587)
//   2. localStorage keys nmv_admin_auto_role + nmv_admin_auto_ts (<60s)
// A full-screen white overlay is shown during auto-login so the
// gradient login form is never visible (prevents the error flash).

function AutoLoginCheck() {
  const { login, isAuthenticated } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf("?");
    const hashSearch = qIdx !== -1 ? hash.slice(qIdx) : "";
    const hashParams = new URLSearchParams(hashSearch);
    const paramMatch = hashParams.get("p") === "0587";

    const storedRole = localStorage.getItem("nmv_admin_auto_role");
    const storedTs   = localStorage.getItem("nmv_admin_auto_ts");
    const tsValid =
      storedRole === "admin" &&
      storedTs !== null &&
      Date.now() - parseInt(storedTs, 10) < 60000;

    if ((paramMatch || tsValid) && !isAuthenticated) {
      localStorage.removeItem("nmv_admin_auto_role");
      localStorage.removeItem("nmv_admin_auto_ts");
      setIsAutoLogging(true);
      login("alex", "Producers0587@")
        .then(() => {
          setChecked(true);
          setIsAutoLogging(false);
        })
        .catch(() => {
          setIsAutoLogging(false);
          setChecked(true);
        });
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // White overlay covers the login form during auto-login.
  if (isAutoLogging || !checked) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#14b8a6',
            borderRadius: '50%',
            animation: 'nmv-spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#64748b', fontSize: '14px', fontFamily: 'sans-serif', margin: 0 }}>
          Cargando...
        </p>
        <style>{`
          @keyframes nmv-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <>
      {/* AutoLoginCheck runs outside Routes so it fires on EVERY path */}
      <AutoLoginCheck />
      {/* PWA install banner */}
      <InstallPWA />

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

      {/* ── CREAR TICKET — full screen (sin sidebar) ─────────── */}
      <Route path="/tickets/create" element={<CrearTicket />} />

      {/* ── TICKETS ────────────────────────────────────────────── */}
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

      {/* ── MÓVIL ──────────────────────────────────────────────── */}
      <Route path="/movil/crear-cliente"    element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/clientes"         element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/retiro"           element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/recargas"         element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/cancelar-recarga" element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/tickets"          element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/premios"          element={<Protected><MovilPage /></Protected>} />
      <Route path="/movil/reporte"          element={<Protected><MovilPage /></Protected>} />

      {/* ── LIMITES ────────────────────────────────────────────── */}
      <Route path="/limits" element={<Protected><ListaLimites /></Protected>} />
      <Route path="/limits/new" element={<Protected><CrearLimite /></Protected>} />
      <Route path="/limits/automatic" element={<Protected><LimitesAutomaticos /></Protected>} />
      <Route path="/limits/delete" element={<Protected><EliminarLimites /></Protected>} />
      <Route path="/limits/numeros" element={<Protected><LimitesNumerosPage /></Protected>} />
      <Route path="/limits/limitacion" element={<Protected><LimitacionNumerosPage /></Protected>} />

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
      <Route path="/accountable-entities/bancas" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/empleados" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/bancos" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/zonas" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/otros" element={<Protected><ListaEntidades /></Protected>} />
      <Route path="/accountable-entities/new" element={<Protected><Stub title="Crear Entidad Contable" /></Protected>} />

      {/* ── RECEPTORES DE CORREO ───────────────────────────────── */}
      <Route path="/mail-receptors" element={<Protected><ListaReceptores /></Protected>} />
      <Route path="/mail-receptors/new" element={<Protected><CrearReceptor /></Protected>} />

      {/* ── NOTIFICACIONES ─────────────────────────────────────── */}
      <Route path="/notifications/new" element={<Protected><Notificaciones /></Protected>} />

      {/* ── SETTINGS ───────────────────────────────────────────── */}
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />

      {/* ── SUPERADMIN ─────────────────────────────────────────── */}
      <Route path="/superadmin" element={<Protected><SuperAdminPage /></Protected>} />

      {/* ── CONTABILIDAD ───────────────────────────────────────── */}
      <Route path="/contabilidad"           element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/gastos"    element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/compras"   element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/rentas"    element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/empleados" element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/inversion" element={<Protected><ContabilidadPage /></Protected>} />
      <Route path="/contabilidad/resumen"   element={<Protected><ContabilidadPage /></Protected>} />

      {/* ── PRÉSTAMOS ──────────────────────────────────────────── */}
      <Route path="/prestamos"         element={<Protected><PrestamosPage /></Protected>} />

      {/* ── ACTIVITY LOG ───────────────────────────────────────── */}
      <Route path="/activity-log"      element={<Protected><ActivityLogPage /></Protected>} />

      {/* ── COBRADORES ─────────────────────────────────────────── */}
      <Route path="/cobradores"            element={<Protected><CobraHub /></Protected>} />
      <Route path="/cobradores/lista"      element={<Protected><ListaCobradores /></Protected>} />
      <Route path="/cobradores/crear"      element={<Protected><CrearCobrador /></Protected>} />
      <Route path="/cobradores/rutas"      element={<Protected><RutasZonas /></Protected>} />
      <Route path="/cobradores/cobros-dia" element={<Protected><CobrosDelDia /></Protected>} />
      <Route path="/cobradores/historial"  element={<Protected><HistorialCobros /></Protected>} />
      <Route path="/cobradores/balance"    element={<Protected><BalanceCobrador /></Protected>} />
      <Route path="/cobradores/capital"    element={<Protected><CapitalCaja /></Protected>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
