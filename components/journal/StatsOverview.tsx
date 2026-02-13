import { GlassCard } from '@/components/ui/GlassCard';
import { Trade } from '@/types';
import { calculatePnL } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { useMemo } from 'react';

interface StatsOverviewProps {
    trades: Trade[];
    target: number;
}

export function StatsOverview({ trades, target }: StatsOverviewProps) {
    const stats = useMemo(() => {
        let netPnL = 0;
        let wins = 0;
        let losses = 0;
        let grossProfit = 0;
        let grossLoss = 0;

        trades.forEach(trade => {
            const pnl = calculatePnL(trade);
            if (pnl === null) return;

            netPnL += pnl;
            if (pnl > 0) {
                wins++;
                grossProfit += pnl;
            } else if (pnl < 0) {
                losses++;
                grossLoss += Math.abs(pnl);
            }
        });

        const totalTrades = wins + losses;
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

        return { netPnL, winRate, profitFactor, totalTrades };
    }, [trades]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={48} />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Net PnL</p>
                <div className={`text-4xl font-black tracking-tighter ${stats.netPnL >= 0 ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'text-[#ff003c] drop-shadow-[0_0_10px_rgba(255,0,60,0.3)]'}`}>
                    ${stats.netPnL.toLocaleString()}
                </div>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={48} />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Win Rate</p>
                <div className={`text-4xl font-black tracking-tighter ${stats.winRate >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {stats.winRate.toFixed(1)}%
                </div>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp size={48} />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Profit Factor</p>
                <div className="text-4xl font-black tracking-tighter text-white">
                    {stats.profitFactor.toFixed(2)}
                </div>
            </GlassCard>

            <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={48} />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Trades</p>
                <div className="text-4xl font-black tracking-tighter text-white">
                    {stats.totalTrades}
                </div>
            </GlassCard>
        </div>
    );
}
