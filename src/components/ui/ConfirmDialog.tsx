import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Confirmar accion",
  message = "Estas seguro de que deseas continuar?",
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmBg =
    variant === "danger"
      ? "bg-[#EF4444] hover:bg-[#DC2626]"
      : variant === "warning"
        ? "bg-[#F59E0B] hover:bg-[#D97706]"
        : "bg-[#4ECDC4] hover:bg-[#3DBDB5]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onCancel}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[520px] w-[calc(100%-2rem)] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    variant === "danger"
                      ? "bg-[#FEE2E2]"
                      : variant === "warning"
                        ? "bg-[#FEF3C7]"
                        : "bg-[#E0F7F5]"
                  }`}
                >
                  <AlertTriangle
                    size={20}
                    className={
                      variant === "danger"
                        ? "text-[#EF4444]"
                        : variant === "warning"
                          ? "text-[#F59E0B]"
                          : "text-[#4ECDC4]"
                    }
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#333333]">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 pt-3">
              {children ? (
                children
              ) : (
                <p className="text-sm text-[#666666] leading-relaxed">{message}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-full transition-colors ${confirmBg}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
