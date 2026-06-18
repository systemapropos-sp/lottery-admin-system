import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadProps {
  onNumber: (num: string) => void;
  onDelete: () => void;
  onOK: () => void;
}

const keys = [['1','2','3'],['4','5','6'],['7','8','9']];

export function NumericKeypad({ onNumber, onDelete, onOK }: NumericKeypadProps) {
  return (
    <div className="shrink-0 px-2 pb-1">
      {keys.map((row, ri) => (
        <div key={ri} className="flex gap-1.5 mb-1.5">
          {row.map((num) => (
            <motion.button key={num} whileTap={{ scale: 0.92, y: 1 }}
              onClick={() => onNumber(num)}
              className="flex-1 h-[44px] bg-white border border-gray-300 rounded-lg text-lg font-bold text-gray-800 shadow-sm active:bg-gray-100 transition-colors flex items-center justify-center">
              {num}
            </motion.button>
          ))}
        </div>
      ))}
      <div className="flex gap-1.5">
        <motion.button whileTap={{ scale: 0.92, y: 1 }} onClick={onDelete}
          className="flex-1 h-[44px] bg-red-400 border border-red-500 rounded-lg text-white font-bold shadow-sm active:bg-red-500 transition-colors flex items-center justify-center gap-1">
          <Delete size={16} /><span className="text-xs">Borrar</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.92, y: 1 }} onClick={() => onNumber('0')}
          className="flex-1 h-[44px] bg-white border border-gray-300 rounded-lg text-lg font-bold text-gray-800 shadow-sm active:bg-gray-100 transition-colors flex items-center justify-center">
          0
        </motion.button>
        <motion.button whileTap={{ scale: 0.92, y: 1 }} onClick={onOK}
          className="flex-1 h-[44px] bg-green-500 border border-green-600 rounded-lg text-white font-bold shadow-sm active:bg-green-600 transition-colors flex items-center justify-center gap-1">
          <Check size={16} /><span className="text-xs">OK</span>
        </motion.button>
      </div>
    </div>
  );
}
