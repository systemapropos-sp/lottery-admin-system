import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, Save } from "lucide-react";
import {
  useQuickAccessStore,
  DEFAULT_AVAILABLE_ITEMS,
  DEFAULT_ACTIVE_IDS,
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

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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

function SettingsIcon({ iconName, size = 18 }: { iconName: string; size?: number }) {
  const IconComponent = ICON_MAP[iconName];
  if (!IconComponent) return null;
  return <IconComponent size={size} className="text-white" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuickAccessSettings() {
  const { activeIds, toggleItem, setActiveIds } = useQuickAccessStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleReset = () => {
    setActiveIds(DEFAULT_ACTIVE_IDS);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl border border-[#E5E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6"
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-[#333333] mb-1">
        Accesos rapidos
      </h2>
      <p className="text-sm text-[#666666] mb-5">
        Seleccione los accesos rapidos que desea mostrar en el panel
      </p>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-[#D1FAE5] rounded-lg text-[#065F46] text-sm font-medium">
              <Check size={16} className="text-[#22C55E]" />
              Configuracion guardada exitosamente
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Toggle Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {DEFAULT_AVAILABLE_ITEMS.map((item) => {
          const isActive = activeIds.includes(item.id);
          return (
            <motion.button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "border-[#4ECDC4] bg-[#E8F8F5]"
                  : "border-[#E5E5E0] bg-white hover:border-[#CCCCCC]"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                }`}
              >
                <SettingsIcon
                  iconName={item.icon}
                  size={18}
                />
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium flex-1 ${
                  isActive ? "text-[#0F766E]" : "text-[#666666]"
                }`}
              >
                {item.label}
              </span>

              {/* Checkmark indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? "bg-[#4ECDC4]" : "bg-[#E5E5E0]"
                }`}
              >
                {isActive && <Check size={12} className="text-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0F0EB]">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4ECDC4] text-white text-sm font-medium rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)] cursor-pointer"
        >
          <Save size={16} />
          Guardar
        </button>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5F5F0] text-[#666666] text-sm font-medium rounded-full hover:bg-[#E5E5E0] hover:text-[#333333] active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
          Restablecer defaults
        </button>
      </div>
    </motion.div>
  );
}
