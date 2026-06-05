import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useQuickAccessStore } from "@/store/quickAccessStore";

export default function QuickAccessButton() {
  const toggleOpen = useQuickAccessStore((s) => s.toggleOpen);

  return (
    <motion.button
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4ECDC4] text-white shadow-[0_4px_16px_rgba(78,205,196,0.4)] flex items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      title="Accesos rapidos"
    >
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-[#4ECDC4] animate-ping opacity-20" />
      <Zap size={24} fill="currentColor" />
    </motion.button>
  );
}
