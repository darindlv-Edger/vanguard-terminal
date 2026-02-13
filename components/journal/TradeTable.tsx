import { Trade } from '@/types';
import { calculatePnL } from '@/lib/utils';
import { Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TradeTableProps {
    trades: Trade[];
    onDelete: (id: string) => void;
}

export function TradeTable({ trades, onDelete }: TradeTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Date</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Symbol</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Side</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Size</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Entry</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Exit</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">PnL</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {trades.map((trade) => {
                            const pnl = calculatePnL(trade);
                            const isWin = pnl !== null && pnl >= 0;

                            return (
                                <tr key={trade.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-xs font-mono text-white/60">
                                        {new Date(trade.created_at).toLocaleDateString()}
                                        <br />
                                        <span className="text-[9px] text-white/20">{new Date(trade.created_at).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-sm tracking-tight">{trade.symbol}</span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={trade.side === 'BUY' ? 'success' : 'danger'} size="sm">
                                            {trade.side}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-xs font-mono text-white/60">
                                        {trade.contracts}
                                    </td>
                                    <td className="p-4 text-xs font-mono text-white/60">
                                        {trade.entry_price}
                                    </td>
                                    <td className="p-4 text-xs font-mono text-white/60">
                                        {trade.exit_price || '-'}
                                    </td>
                                    <td className={`p-4 font-mono font-bold text-sm ${isWin ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {pnl !== null ? `$${pnl.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => onDelete(trade.id)}
                                            className="p-2 rounded-lg hover:bg-rose-500/20 text-white/20 hover:text-rose-500 transition-all"
                                            title="Delete Trade"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {trades.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-white/20 text-sm font-mono uppercase tracking-widest">
                                    No trade data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
