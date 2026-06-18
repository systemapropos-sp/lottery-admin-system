import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, CheckCircle } from 'lucide-react';
import type { Bet } from './types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bets: Bet[];
  bancaName?: string;
  onConfirm: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  directo: 'DIR', pale: 'PAL', tripleta: 'TRIP', cash3: 'C3', play4: 'P4', pick5: 'P5',
};

export function TicketModal({ isOpen, onClose, bets, bancaName, onConfirm }: TicketModalProps) {
  const total = bets.reduce((s, b) => s + b.amount, 0);
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}>
          <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-[380px] bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
              <div className="flex items-center gap-2 text-white">
                <Ticket size={20} />
                <div>
                  <p className="font-bold text-sm">Confirmar Ticket</p>
                  {bancaName && <p className="text-xs text-white/70">{bancaName}</p>}
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Info row */}
            <div className="flex items-center justify-between px-5 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
              <span>{dateStr} {timeStr}</span>
              <span>{bets.length} jugadas</span>
            </div>

            {/* Bets list */}
            <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
              {bets.map((bet, i) => (
                <div key={bet.id} className={`flex items-center gap-3 px-5 py-2.5 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 shrink-0 w-9 text-center">
                    {TYPE_LABELS[bet.type] ?? bet.type.toUpperCase()}
                  </span>
                  <span className="flex-1 text-sm font-bold text-gray-800 tabular-nums tracking-widest">
                    {bet.numbers.split('').join(' ')}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[80px]">{bet.lotteryName}</span>
                  <span className="text-sm font-bold text-gray-700 tabular-nums shrink-0">RD${bet.amount.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-5 py-3 bg-teal-50 border-t border-teal-100">
              <span className="text-sm font-semibold text-gray-600">Total</span>
              <span className="text-xl font-black text-teal-700 tabular-nums">RD${total.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-5 py-4 pb-6">
              <button onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
                className="flex-[2] h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
                <CheckCircle size={18} />
                Confirmar y Guardar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
