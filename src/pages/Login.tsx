import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore, useTranslation } from "@/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Auto-focus username
  useEffect(() => {
    const el = document.getElementById("username-input");
    el?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim() || !password.trim()) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }
      const success = await login(username, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    },
    [username, password, login, navigate]
  );

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1a237e 0%, #0d47a1 25%, #b71c1c 75%, #3e2723 100%)",
      }}
    >
      {/* Animated background hue shift */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, #1a237e 0%, #0d47a1 25%, #b71c1c 75%, #3e2723 100%)",
          animation: "hueShift 20s ease-in-out infinite alternate",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="relative w-full max-w-[400px]"
      >
        {/* Login Card */}
        <div
          className="bg-white/[0.97] rounded-[20px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{
            animation: shake ? "shake 0.4s ease-in-out" : undefined,
          }}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-[0.15em] text-[#333333]">
              LOTTERY
            </h1>
            <p className="text-sm text-[#666666] mt-2 font-normal">
              {t("login.title")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username-input"
                className="block text-sm font-medium text-[#333333]"
              >
                {t("login.username")}
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
                />
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="usuario"
                  autoComplete="username"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-[#E5E5E0] rounded-lg bg-white text-[#333333] placeholder:text-[#CCCCCC] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password-input"
                className="block text-sm font-medium text-[#333333]"
              >
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
                />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="******"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 text-sm border border-[#E5E5E0] rounded-lg bg-white text-[#333333] placeholder:text-[#CCCCCC] focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#EF4444] text-center"
              >
                {t("login.error")}
              </motion.p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("login.submit")
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-1.5 text-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="block text-xs text-[#666666] underline-offset-2 hover:underline transition-colors"
            >
              {t("login.drivers")}
            </a>
            <p className="text-xs text-[#999999]">{t("login.firefox")}</p>
          </div>
        </div>
      </motion.div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          50% { transform: translateX(-4px); }
          70% { transform: translateX(4px); }
        }
        @keyframes hueShift {
          0% { filter: hue-rotate(-5deg); }
          100% { filter: hue-rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
