import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  icon?: LucideIcon;
  format?: "number" | "currency" | "percentage";
  delay?: number;
}

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  color = "#4ECDC4",
  icon: Icon,
  format = "number",
  delay = 0,
}: StatCardProps) {
  const formattedValue = useMemo(() => {
    if (format === "currency") {
      return (
        prefix +
        value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        suffix
      );
    }
    if (format === "percentage") {
      return `${value}%`;
    }
    return value.toLocaleString("en-US") + suffix;
  }, [value, prefix, suffix, format]);

  const isNegative = value < 0;
  const displayColor = isNegative ? "#EF4444" : color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: "easeOut" }}
      className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-4"
    >
      {Icon && (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${displayColor}18` }}
        >
          <Icon size={20} style={{ color: displayColor }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#666666] font-normal truncate">{label}</p>
        <p
          className="text-2xl font-bold font-mono tracking-tight mt-0.5"
          style={{ color: displayColor }}
        >
          {formattedValue}
        </p>
      </div>
    </motion.div>
  );
}
