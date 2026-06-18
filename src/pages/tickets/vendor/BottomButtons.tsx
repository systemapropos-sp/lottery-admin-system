import { motion } from 'framer-motion';
import { Ticket, Printer } from 'lucide-react';
import type { Lottery } from './types';

interface BottomButtonsProps {
  selectedLottery: Lottery;
  betCount: number;
  onCreateTicket: () => void;
}

export function BottomButtons({ selectedLottery, betCount, onCreateTicket }: BottomButtonsProps) {
  return (
    <div className="shrink-0 flex gap-2 px-3 py-2 pb-4">
      <motion.button whileTap={{ scale: 0.97 }} onClick={onCreateTicket}
        className="flex-[7] h-12 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
        style={{ backgroundColor: selectedLottery.color, boxShadow: `0 4px 12px ${selectedLottery.color}66` }}>
        <Ticket size={18} /><span>CREAR TICKET</span>
        {betCount > 0 && (
          <span className="ml-1 bg-white/25 rounded-full px-2 py-0.5 text-xs font-bold">{betCount}</span>
        )}
      </motion.button>
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => window.print()}
        className="flex-[3] h-12 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors">
        <Printer size={16} /><span>Imprimir</span>
      </motion.button>
    </div>
  );
}
