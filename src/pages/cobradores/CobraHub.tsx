import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  UserPlus,
  MapPin,
  DollarSign,
  History,
  BarChart3,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronRight,
  Wallet,
} from "lucide-react";

// ─── Sub-sections ──────────────────────────────────────────────────────────────

const sections = [
  {
    id: "lista",
    title: "Lista de Cobradores",
    description: "Ver y gestionar todos los cobradores registrados en el sistema",
    icon: Users,
    route: "/cobradores/lista",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.12)",
    border: "rgba(20,184,166,0.25)",
    stats: "5 activos",
  },
  {
    id: "crear",
    title: "Crear Cobrador",
    description: "Registrar un nuevo cobrador con sus datos y zona asignada",
    icon: UserPlus,
    route: "/cobradores/crear",
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.12)",
    border: "rgba(14,165,233,0.25)",
    stats: "Nuevo registro",
  },
  {
    id: "rutas",
    title: "Rutas / Zonas",
    description: "Zonas, rutas y bancas asignadas a cada cobrador",
    icon: MapPin,
    route: "/cobradores/rutas",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    stats: "4 zonas",
  },
  {
    id: "cobros-dia",
    title: "Cobros del Día",
    description: "Resumen de todos los cobros realizados durante el día actual",
    icon: DollarSign,
    route: "/cobradores/cobros-dia",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    stats: "Hoy",
  },
  {
    id: "historial",
    title: "Historial de Cobros",
    description: "Registro histórico completo de todos los cobros con filtros",
    icon: History,
    route: "/cobradores/historial",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.25)",
    stats: "Todos los registros",
  },
  {
    id: "balance",
    title: "Balance",
    description: "Balance detallado desglosado por banca y zona de cobrador",
    icon: BarChart3,
    route: "/cobradores/balance",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    stats: "Por banca / zona",
  },
  {
    id: "capital",
    title: "Capital / Caja",
    description: "Entregar y recibir capital — controla la caja del admin en tiempo real",
    icon: Wallet,
    route: "/cobradores/capital",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.25)",
    stats: "Gestión de caja",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CobraHub() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  function handleClose() {
    navigate("/dashboard");
  }

  function handleSection(route: string) {
    navigate(route);
  }

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="cobra-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(15,23,42,0.72)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      >
        {/* ── Modal Card ── */}
        <motion.div
          key="cobra-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E0] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)" }}
              >
                <Wallet size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base tracking-wide">COBRADORES</h2>
                <p className="text-[#94A3B8] text-[11px] mt-0.5 flex items-center gap-1">
                  <ExternalLink size={10} />
                  cobrador.nmvapp.com — próximamente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Grid / List toggle */}
              <div className="flex items-center bg-white/[0.08] rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                    viewMode === "grid"
                      ? "bg-[#14B8A6] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                  title="Vista grid"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-8 h-7 rounded-md flex items-center justify-center transition-all ${
                    viewMode === "list"
                      ? "bg-[#14B8A6] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                  title="Vista lista"
                >
                  <List size={14} />
                </button>
              </div>

              {/* Close */}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.12] transition-colors ml-1"
                title="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Sections ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                /* ── GRID VIEW ── */
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => handleSection(section.route)}
                        className="group relative flex flex-col items-start gap-3 p-5 rounded-xl text-left transition-all duration-200 hover:shadow-md border"
                        style={{
                          background: section.bg,
                          borderColor: section.border,
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: section.color, opacity: 0.9 }}
                        >
                          <Icon size={20} className="text-white" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm leading-snug mb-1"
                            style={{ color: section.color }}
                          >
                            {section.title}
                          </h3>
                          <p className="text-[12px] text-[#64748B] leading-relaxed">
                            {section.description}
                          </p>
                        </div>

                        {/* Stats pill */}
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: section.color,
                            backgroundColor: section.bg,
                            border: `1px solid ${section.border}`,
                          }}
                        >
                          {section.stats}
                        </span>

                        {/* Arrow */}
                        <div
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: section.color }}
                        >
                          <ChevronRight size={16} />
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : (
                /* ── LIST VIEW ── */
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-2"
                >
                  {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => handleSection(section.route)}
                        className="group flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150 border hover:shadow-sm"
                        style={{
                          background: section.bg,
                          borderColor: section.border,
                        }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: section.color }}
                        >
                          <Icon size={18} className="text-white" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm leading-none mb-1"
                            style={{ color: section.color }}
                          >
                            {section.title}
                          </h3>
                          <p className="text-[12px] text-[#64748B] truncate">
                            {section.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{
                            color: section.color,
                            backgroundColor: "white",
                            border: `1px solid ${section.border}`,
                          }}
                        >
                          {section.stats}
                        </span>

                        {/* Arrow */}
                        <ChevronRight
                          size={16}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: section.color }}
                        />
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer ── */}
          <div className="flex-shrink-0 px-6 py-3 border-t border-[#E5E5E0] bg-[#F8FAFC] flex items-center justify-between">
            <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              Módulo en desarrollo — integración con cobrador.nmvapp.com próximamente
            </p>
            <button
              onClick={handleClose}
              className="text-[12px] text-[#64748B] hover:text-[#333333] font-medium transition-colors px-3 py-1 rounded-lg hover:bg-[#E5E5E0]"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
