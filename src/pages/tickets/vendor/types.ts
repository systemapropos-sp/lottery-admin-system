export type BetType = 'directo' | 'pale' | 'tripleta' | 'cash3' | 'play4' | 'pick5';

export interface Bet {
  id: string;
  numbers: string;
  type: BetType;
  lotteryId: string;
  lotteryName: string;
  amount: number;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  bancaId?: string;
  bancaName?: string;
  bets: Bet[];
  total: number;
  createdAt: Date;
  status: 'draft' | 'sent';
}

export interface Lottery {
  id: string;
  name: string;
  shortName: string;
  closingTime: string;
  schedule: string;
  color: string;
  closed: boolean;
}
