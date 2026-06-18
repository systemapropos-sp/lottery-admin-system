import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Lottery } from './types';

interface LotteryListProps {
  lotteries: Lottery[];
  selectedLottery: Lottery;
  onSelect: (lottery: Lottery) => void;
}

function getOpenLotteries(lotteries: Lottery[]): Lottery[] {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return lotteries.filter(l => {
    const [h, m] = l.closingTime.split(':').map(Number);
    return h * 60 + m > currentMinutes;
  });
}

export function LotteryList({ lotteries, selectedLottery, onSelect }: LotteryListProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openLotteries, setOpenLotteries] = useState<Lottery[]>(() => getOpenLotteries(lotteries));

  useEffect(() => {
    const update = () => setOpenLotteries(getOpenLotteries(lotteries));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [lotteries]);

  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedLottery.id]);

  return (
    <div ref={containerRef} className="shrink-0 overflow-y-auto no-scrollbar" style={{ height: 'calc(44px * 3 + 10px)' }}>
      <div className="px-2 py-1 space-y-0.5">
        {openLotteries.map((lottery) => {
          const isSelected = lottery.id === selectedLottery.id;
          return (
            <motion.button key={lottery.id} ref={isSelected ? selectedRef : null}
              onClick={() => onSelect(lottery)} whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 min-h-[44px] ${
                isSelected ? 'text-white shadow-md' : 'bg-white/80 hover:bg-white text-gray-700 shadow-sm'
              }`}
              style={isSelected ? { backgroundColor: lottery.color } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : lottery.color + '22',
                    color: isSelected ? '#fff' : lottery.color,
                  }}>
                  {lottery.shortName.slice(0, 2)}
                </div>
                <p className={`text-sm font-semibold truncate leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {lottery.name}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Clock size={12} className={isSelected ? 'text-white/80' : 'text-gray-400'} />
                <span className={`text-[11px] font-medium tabular-nums ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                  {lottery.closingTime}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
