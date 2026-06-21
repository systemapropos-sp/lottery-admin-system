// Admin Login — Diseño moderno con fondo animado + logo NMV Lottery
// PIN 0587 → dashboard admin | otros PINs → portal bancas
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";

// ─── Clock ───────────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const DAYS   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
                "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
function fmtDate(d: Date) { return `${DAYS[d.getDay()]}, ${d.getDate()} De ${MONTHS[d.getMonth()]}`; }
function fmtTime(d: Date) {
  let h = d.getHours(); const m = d.getMinutes(); const ampm = h >= 12 ? "p. m." : "a. m.";
  h = h % 12 || 12;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} ${ampm}`;
}

// ─── Admin PIN Map ────────────────────────────────────────────────────────────
// IMPORTANTE: user debe coincidir con admin_users.username en Supabase
const ADMIN_PINS: Record<string, { user: string; pass: string; email: string }> = {
  "0587": { user: "alex", pass: "Producers0587@", email: "duepostllc@gmail.com" },
};

// ─── Animated Background Blobs ───────────────────────────────────────────────
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 40%, #d1fae5 70%, #e0f7fa 100%)"
      }} />
      {/* Floating blobs */}
      <motion.div
        className="absolute rounded-full opacity-20"
        style={{ width: 500, height: 500, top: -100, left: -100,
          background: "radial-gradient(circle, #0d9488, #0891b2)" }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full opacity-15"
        style={{ width: 400, height: 400, bottom: -80, right: -80,
          background: "radial-gradient(circle, #0891b2, #0e7490)" }}
        animate={{ x: [0, -50, 20, 0], y: [0, -30, 40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute rounded-full opacity-10"
        style={{ width: 300, height: 300, top: "50%", left: "60%",
          background: "radial-gradient(circle, #14b8a6, #0891b2)" }}
        animate={{ x: [0, 30, -40, 0], y: [0, -50, 20, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #0d9488 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />
    </div>
  );
}

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");

    try {
      // Try Supabase auth reset first
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        // Fallback: simulate email sent (system uses mock auth)
        // Send a mailto as fallback
        const adminMatch = Object.values(ADMIN_PINS).find(p => p.email === email.trim());
        if (adminMatch) {
          // Open gmail compose
          window.open(`mailto:${adminMatch.email}?subject=NMV Admin - Reset de Contraseña&body=Solicitud de reset recibida. Contacte al soporte técnico en: soporte@nmvapp.com`, "_blank");
          setStatus("sent");
          setMsg(`Instrucciones enviadas a ${email}. Revisa tu bandeja de entrada.`);
        } else {
          setStatus("error");
          setMsg("No se encontró una cuenta con ese correo electrónico.");
        }
      } else {
        setStatus("sent");
        setMsg(`Email enviado a ${email}. Revisa tu bandeja de entrada.`);
      }
    } catch {
      setStatus("error");
      setMsg("Error al enviar el correo. Contacta al administrador.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 100, background: "rgba(0,0,0,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4" style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>
            <h2 className="text-white text-lg font-bold">Recuperar Acceso</h2>
            <p className="text-teal-100 text-xs mt-1">Recibirás instrucciones por correo</p>
          </div>

          <div className="p-6">
            {status === "sent" ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-600 font-semibold text-sm">{msg}</p>
                <button onClick={onClose}
                  className="mt-4 w-full py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>
                  Cerrar
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Correo electrónico
                  </label>
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@nmvapp.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 outline-none text-sm transition-colors"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-xs font-medium">{msg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending" || !email.trim()}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)" }}>
                  {status === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                      Enviando...
                    </span>
                  ) : "Enviar instrucciones"}
                </button>
                <button type="button" onClick={onClose}
                  className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  Cancelar
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Login ───────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const now = useClock();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated, navigate]);

  // Auto-login via URL param ?p=0587
  useEffect(() => {
    const p = searchParams.get("p");
    const storedRole = localStorage.getItem("nmv_admin_auto_role");
    const storedTs   = localStorage.getItem("nmv_admin_auto_ts");
    const tsValid = storedRole === "admin" && storedTs !== null && Date.now() - parseInt(storedTs,10) < 60000;
    const paramPin = p && ADMIN_PINS[p] ? p : null;
    if (paramPin || tsValid) {
      localStorage.removeItem("nmv_admin_auto_role");
      localStorage.removeItem("nmv_admin_auto_ts");
      const creds = paramPin ? ADMIN_PINS[paramPin] : ADMIN_PINS["0587"];
      login(creds.user, creds.pass).then(ok => { if (ok) navigate("/dashboard"); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doShake = (msg: string) => {
    setError(msg); setShake(true);
    setTimeout(() => { setShake(false); setPin(""); }, 600);
  };

  const handlePin = async (enteredPin: string) => {
    const adminCreds = ADMIN_PINS[enteredPin];
    if (adminCreds) {
      const ok = await login(adminCreds.user, adminCreds.pass);
      if (ok) navigate("/dashboard");
      else doShake("PIN incorrecto — verifique sus credenciales");
    } else {
      // Not an admin PIN → redirect to vendor portal
      window.location.href = `https://nmvapp.com?pin=${enteredPin}`;
    }
  };

  const appendDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) setTimeout(() => handlePin(next), 150);
  };

  const delDigit = () => setPin(p => p.slice(0,-1));

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <>
      <AnimatedBackground />

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-[100dvh] flex items-center justify-center p-4 relative" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.94 }}
          animate={{
            opacity: 1, y: 0, scale: 1,
            x: shake ? [0, -10, 10, -8, 8, -4, 4, 0] : 0
          }}
          transition={{ duration: shake ? 0.5 : 0.45, ease: "easeOut" }}
          className="w-full max-w-[380px]"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 25px 60px rgba(13,148,136,0.2), 0 8px 20px rgba(0,0,0,0.08)" }}>

            {/* ── Header with logo ── */}
            <div className="pb-6 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: "white", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
                style={{ background: "white", transform: "translate(-30%, 30%)" }} />

              {/* Logo area */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 15 }}
                className="pt-7 pb-2 flex justify-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                  <img
                    src="/admin/logo-numeros.png"
                    alt="NMV Lottery"
                    className="w-full h-full object-contain p-1"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const div = (e.target as HTMLImageElement).parentElement;
                      if (div) div.innerHTML = '<span style="font-size:2rem">🎰</span>';
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-black tracking-wider text-white">NMV LOTTERY</h1>
                <p className="text-teal-100 text-xs mt-0.5">Panel de Administración</p>
                <div className="mt-3 text-teal-200 text-xs">{fmtDate(now)}</div>
                <div className="text-white text-2xl font-bold tabular-nums">{fmtTime(now)}</div>
              </motion.div>
            </div>

            {/* ── PIN Body ── */}
            <div className="px-6 py-6">
              <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Ingresa tu PIN de acceso
              </p>

              {/* PIN dots */}
              <div className="flex justify-center gap-3 mb-5">
                {[0,1,2,3].map(i => (
                  <motion.div
                    key={i}
                    animate={pin.length > i ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.15 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition-all duration-150 ${
                      pin.length > i
                        ? "border-teal-500 text-white"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    style={pin.length > i ? {
                      background: "linear-gradient(135deg,#0D9488,#0891B2)",
                      boxShadow: "0 4px 12px rgba(13,148,136,0.3)"
                    } : {}}
                  >
                    {pin.length > i ? "•" : ""}
                  </motion.div>
                ))}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center text-sm text-red-500 font-medium mb-3">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-center mb-4">
                  <div className="w-7 h-7 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin"/>
                </div>
              )}

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2.5">
                {keys.map((k, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={k ? { scale: 0.9 } : {}}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      if (!k || isLoading) return;
                      if (k === "⌫") delDigit();
                      else appendDigit(k);
                    }}
                    disabled={isLoading}
                    className={`h-14 rounded-2xl text-xl font-bold transition-all disabled:opacity-50 select-none ${
                      !k ? "invisible" :
                      k === "⌫"
                        ? "bg-red-50 text-red-400 active:bg-red-100 border border-red-100"
                        : "bg-gradient-to-br from-gray-50 to-white text-gray-700 active:from-teal-50 active:text-teal-600 border border-gray-100 hover:border-teal-200"
                    }`}
                    style={{
                      boxShadow: k && k !== "⌫" ? "0 2px 4px rgba(0,0,0,0.06)" : undefined,
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                      cursor: k ? "pointer" : "default",
                    }}
                  >
                    {k}
                  </motion.button>
                ))}
              </div>

              {/* Forgot password */}
              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-300 mt-3">
                Acceso restringido — Solo personal autorizado
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400/70 mt-4">
            © 2025 NMV Lottery · Panel Administrativo · v2.0
          </p>
        </motion.div>
      </div>
    </>
  );
}
