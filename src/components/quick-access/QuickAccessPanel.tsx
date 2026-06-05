import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  useQuickAccessStore,
  DEFAULT_AVAILABLE_ITEMS,
  type QuickAccessItem,
} from "@/store/quickAccessStore";

// ─── Dynamic Icon Mapping ─────────────────────────────────────────────────────

import {
  FileText,
  Wallet,
  BarChart3,
  Clock,
  Settings,
  Copy,
  Shuffle,
  HelpCircle,
  Ticket,
  Trophy,
  Store,
  Users,
  Banknote,
  Shield,
  Bell,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>> = {
  FileText,
  Wallet,
  BarChart3,
  Clock,
  Settings,
  Copy,
  Shuffle,
  HelpCircle,
  Ticket,
  Trophy,
  Store,
  Users,
  Banknote,
  Shield,
  Bell,
};

function QuickAccessIcon({ item, size = 24 }: { item: QuickAccessItem; size?: number }) {
  const IconComponent = ICON_MAP[item.icon];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={item.color} />;
}

// ─── Overlay Variants ─────────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ─── Panel Variants ───────────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 28, delay: 0.05 },
  },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
};

// ─── Card Variants ────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuickAccessPanel() {
  const { isOpen, setOpen, activeIds } = useQuickAccessStore();

  const activeItems = useMemo(
    () => DEFAULT_AVAILABLE_ITEMS.filter((item) => activeIds.includes(item.id)),
    [activeIds]
  );

  const handleNavigate = (route: string) => {
    setOpen(false);
    window.location.hash = route;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            variants={overlayVariants}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            variants={panelVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E0]">
              <h2 className="text-lg font-bold text-[#333333] uppercase tracking-wide">
                Accesos rapidos
              </h2>
              <motion.button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-[#F5F5F0] text-[#666666] hover:bg-[#E5E5E0] hover:text-[#333333] flex items-center justify-center transition-colors cursor-pointer"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                title="Cerrar"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeItems.length === 0 ? (
                <div className="text-center py-10 text-[#999999] text-sm">
                  No hay accesos rapidos configurados.
                  <br />
                  Configurelos desde la pagina de Configuracion.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {activeItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{
                        scale: 1.03,
                        borderColor: "#4ECDC4",
                        boxShadow: "0 4px 16px rgba(78,205,196,0.15)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate(item.route)}
                      className="flex flex-col items-center gap-2 p-3 bg-white border border-[#E5E5E0] rounded-xl transition-colors cursor-pointer aspect-square justify-center"
                    >
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-[#E8F8F5] flex items-center justify-center flex-shrink-0">
                        <QuickAccessIcon item={item} size={24} />
                      </div>
                      {/* Label */}
                      <span className="text-xs text-[#333333] text-center leading-tight line-clamp-2 font-medium">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
