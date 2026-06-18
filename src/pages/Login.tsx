// Login ÚNICO — igual al portal nmvapp.com
// PIN 0587 (y otros admin PINs) → dashboard admin
// Cualquier otro PIN → redirige al portal de bancas
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now;
}

const DAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
function fmtDate(d: Date) { return `${DAYS[d.getDay()]}, ${d.getDate()} De ${MONTHS[d.getMonth()]}`; }
function fmtTime(d: Date) {
  let h = d.getHours(); const m = d.getMinutes(); const ampm = h >= 12 ? "p. m." : "a. m.";
  h = h % 12 || 12;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} ${ampm}`;
}

// Admin PINs → map PIN to credentials
const ADMIN_PINS: Record<string, { user: string; pass: string }> = {
  "0587": { user: "alex",  pass: "Producers0587@" },
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const now = useClock();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

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
    setError(msg);
    setShake(true);
    setTimeout(() => { setShake(false); setPin(""); }, 500);
  };

  const handlePin = async (enteredPin: string) => {
    const adminCreds = ADMIN_PINS[enteredPin];
    if (adminCreds) {
      // Admin PIN → authenticate and go to dashboard
      const ok = await login(adminCreds.user, adminCreds.pass);
      if (ok) {
        navigate("/dashboard");
      } else {
        doShake("PIN incorrecto");
      }
    } else {
      // Vendor PIN → redirect to nmvapp.com vendor portal
      window.location.href = `https://nmvapp.com?pin=${enteredPin}`;
    }
  };

  const appendDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) {
      setTimeout(() => handlePin(next), 150); // small delay for visual feedback
    }
  };

  const delDigit = () => setPin(p => p.slice(0,-1));

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#E0F7F4 0%,#B2EBF2 100%)" }}>

      <motion.div
        initial={{ opacity:0, y:24, scale:0.96 }}
        animate={{ opacity:1, y:0, scale:1, x: shake ? [0,-10,10,-6,6,0] : 0 }}
        transition={{ duration: shake ? 0.4 : 0.4, ease:"easeOut" }}
        className="w-full max-w-[380px]"
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

          {/* Gradient Header */}
          <div className="px-8 pt-8 pb-7 text-center"
            style={{ background: "linear-gradient(135deg,#0D9488 0%,#0891B2 100%)" }}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl">🎰</div>
            <h1 className="text-2xl font-black tracking-wider text-white">NMV LOTTERY</h1>
            <p className="text-teal-100 text-sm mt-1">Sistema de Banca de Lotería</p>
            <p className="text-teal-200 text-xs mt-2">{fmtDate(now)}</p>
            <p className="text-white text-2xl font-bold mt-0.5">{fmtTime(now)}</p>
          </div>

          {/* PIN Body */}
          <div className="px-6 py-6">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Ingresa tu PIN de acceso
            </p>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-5">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition-all duration-150 ${
                  pin.length > i
                    ? "bg-[#0D9488] border-[#0D9488] text-white scale-105"
                    : "bg-[#F0FDFA] border-[#99F6E4]"
                }`}>
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-center text-sm text-red-500 font-medium mb-3 animate-pulse">{error}</p>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center mb-3">
                <div className="w-6 h-6 border-2 border-[#0D9488]/30 border-t-[#0D9488] rounded-full animate-spin"/>
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3">
              {keys.map((k, i) => (
                <button key={i}
                  onClick={() => k === "⌫" ? delDigit() : k ? appendDigit(k) : undefined}
                  disabled={isLoading}
                  className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 disabled:opacity-50 ${
                    !k ? "invisible" :
                    k === "⌫"
                      ? "bg-red-50 text-red-400 hover:bg-red-100"
                      : "bg-[#F0FDFA] text-[#0D9488] hover:bg-[#CCFBF1] hover:shadow-md"
                  }`}>
                  {k}
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Acceso restringido — Solo personal autorizado
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          © 2025 NMV Lottery · Sistema SaaS seguro · v2.0
        </p>
      </motion.div>
    </div>
  );
}
