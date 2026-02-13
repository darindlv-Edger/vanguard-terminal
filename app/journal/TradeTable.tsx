'use client';

import { Trade } from '@/types';
import { Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
  onDelete: (id: string) => void;
}

export function TradeTable({ trades, onDelete }: TradeTableProps) {
  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price) return null;
    const diff = trade.side === 'SELL' 
      ? trade.entry_price - trade.exit_price 
      : trade.exit_price - trade.entry_price;
    
    const isNQ = trade.symbol.includes('NQ');
    const isMicro = trade.symbol.startsWith('M');
    
    // NQ: $20/pt, MNQ: $2/pt | ES: $50/pt, MES: $5/pt
    const multiplier = isNQ ? (isMicro ? 2 : 20) : (isMicro ? 5 : 50);
    
    return diff * multiplier * trade.contracts;
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto shadow-2xl">
      <table className="w-full text-left min-w-[1000px] border-collapse">
        <thead className="bg-white/[0.02] border-b border-white/5">
          <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            <th className="p-6 font-black">Timestamp</th>
            <th className="p-6 font-black">Asset</th>
            <th className="p-6 font-black">Action</th>
            <th className="p-6 font-black">Status</th>
            <th className="p-6 font-black">Net PnL</th>
            <th className="p-6 font-black text-right">Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trades.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-20 text-center text-white/10 uppercase font-black tracking-widest text-xs">No Executions Recorded</td>
            </tr>
          ) : (
            trades.map((trade) => {
              const pnl = calculatePnL(trade);
              // Safe check for the property that caused your error
              const isValid = trade.is_playbook_valid ?? true; 

              return (
                <tr key={trade.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="p-6 font-mono text-[10px] text-white/40">
                    {new Date(trade.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-tight">{trade.symbol}</span>
                      <span className="text-[10px] text-white/20 font-mono">{trade.contracts} Contracts</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="p-6">
                    {isValid ? (
                      <div className="flex items-center gap-2 text-emerald-500/60">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Valid Setup</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-500 bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10 w-fit">
                        <ShieldAlert size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Rule Violation</span>
                      </div>
                    )}
                  </td>
                  <td className={`p-6 text-xl font-mono tracking-tighter ${pnl !== null ? (pnl >= 0 ? 'text-emerald-400' : 'text-rose-500') : 'text-white/20'}`}>
                    {pnl !== null ? `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString()}` : '--'}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => onDelete(trade.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-500/40 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}