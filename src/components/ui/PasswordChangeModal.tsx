import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("La contrasena es requerida");
      return;
    }
    if (password.length < 4) {
      setError("La contrasena debe tener al menos 4 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setPassword("");
      setConfirm("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setError("");
    setPassword("");
    setConfirm("");
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-xl border border-[#E5E5E0] shadow-lg max-w-[420px] w-[calc(100%-2rem)] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <h3 className="text-lg font-semibold text-[#333333]">
                Cambiar contrasena
              </h3>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F0] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 pt-4">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 py-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M4 10L8 14L16 6"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#065F46]">
                    Contrasena actualizada!
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">
                      Contrasena <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contrasena"
                        className={`w-full px-4 py-2.5 pr-10 bg-white border rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none transition-all ${
                          error && !password
                            ? "border-[#EF4444] focus:ring-[0_0_0_3px_rgba(239,68,68,0.15)]"
                            : "border-[#E5E5E0] focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">
                      Confirmacion
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirmar contrasena"
                        className="w-full px-4 py-2.5 pr-10 bg-white border border-[#E5E5E0] rounded-lg text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 text-sm text-[#EF4444]"
                      >
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(78,205,196,0.3)]"
                    >
                      OK
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
