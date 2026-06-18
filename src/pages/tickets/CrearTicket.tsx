/**
 * CrearTicket — embeds matador-sport Dashboard (the real nmvapp.com vendor portal UI)
 * into the admin panel. Admin is always authenticated → no login needed.
 * Banca selector is shown in the admin header above the vendor UI.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, ChevronDown, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Dashboard from './matador/Dashboard';

// ─── Mock Bancas (será reemplazado con Supabase) ──────────────────────────────
const MOCK_BANCAS = [
  { id: 'b1', name: 'Banca Central',   code: 'BC-001' },
  { id: 'b2', name: 'Banca Norte',     code: 'BN-002' },
  { id: 'b3', name: 'Lotería Express', code: 'LE-003' },
  { id: 'b4', name: 'Banca Sur',       code: 'BS-004' },
];

export default function CrearTicket() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedBancaId, setSelectedBancaId] = useState(MOCK_BANCAS[0].id);
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedBanca = MOCK_BANCAS.find(b => b.id === selectedBancaId)!;

  if (!isAuthenticated) {
    navigate('/sessions/new');
    return null;
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#f3f4f6]">

      {/* ── Admin header bar ─────────────────────────────────────────── */}
      <header className="shrink-0 h-11 flex items-center gap-2 px-3 z-50 relative"
        style={{ background: 'linear-gradient(135deg,#0d9488 0%,#0f766e 100%)', boxShadow:'0 2px 6px rgba(0,0,0,0.12)' }}>
        <button onClick={() => navigate(-1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0">
          <ArrowLeft size={14} />
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider text-white leading-none">🎰 NMV LOTTERY</span>

        <div className="flex-1" />

        {/* Banca selector */}
        <div className="relative">
          <button onClick={() => setShowDropdown(v => !v)}
            className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 px-2.5 py-1 text-white transition-colors">
            <Building2 size={12} />
            <span className="text-[11px] font-semibold max-w-[110px] truncate">{selectedBanca.name}</span>
            <ChevronDown size={11} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-[100] overflow-hidden">
                {MOCK_BANCAS.map(b => (
                  <button key={b.id}
                    onClick={() => { setSelectedBancaId(b.id); setShowDropdown(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-colors border-b border-gray-50 last:border-b-0 ${
                      b.id === selectedBancaId
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <span>{b.name}</span>
                    {b.id === selectedBancaId && <Check size={12} className="text-teal-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Vendor Dashboard (full UI from matador-sport) ────────────── */}
      <div className="flex-1 overflow-hidden" onClick={() => showDropdown && setShowDropdown(false)}>
        <Dashboard />
      </div>
    </div>
  );
}
