'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trade } from '@/types';
import { calculatePnL } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { EquityCurve } from '@/components/analytics/EquityCurve';
import { AssetDistribution } from '@/components/analytics/AssetDistribution';
import { DayPerformance } from '@/components/analytics/DayPerformance';
import { Activity, Target, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrades = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: settings } = await supabase
                .from('user_settings')
                .select('current_account_id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (settings?.current_account_id) {
                const { data } = await supabase
                    .from('trades')
                    .select('*')
                    .eq('account_id', settings.current_account_id)
                    .order('created_at', { ascending: true });

                if (data) setTrades(data as Trade[]);
            }
            setLoading(false);
        };
        fetchTrades();
    }, []);

    const analytics = useMemo(() => {
        let runningPnL = 0;
        const equityData = trades.map(t => {
            const pnl = calculatePnL(t) || 0;
            runningPnL += pnl;
            return { date: t.created_at.split('T')[0], pnl: runningPnL };
        });

        // Asset Distribution
        const assetCounts: Record<string, number> = {};
        trades.forEach(t => {
            const sym = t.symbol;
            assetCounts[sym] = (assetCounts[sym] || 0) + 1;
        });
        const assetData = Object.entries(assetCounts).map(([name, value]) => ({ name, value }));

        // Day Performance
        const dayPnL: Record<string, number> = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0 };
        trades.forEach(t => {
            const date = new Date(t.created_at);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (dayPnL[dayName] !== undefined) {
                dayPnL[dayName] += (calculatePnL(t) || 0);
            }
        });
        const dayData = Object.entries(dayPnL).map(([day, pnl]) => ({ day, pnl }));

        // Key Stats
        const wins = trades.filter(t => (calculatePnL(t) || 0) > 0).length;
        const losses = trades.filter(t => (calculatePnL(t) || 0) < 0).length;
        const total = wins + losses;
        const winRate = total > 0 ? (wins / total) * 100 : 0;

        const grossProfit = trades.reduce((sum, t) => {
            const pnl = calculatePnL(t) || 0;
            return pnl > 0 ? sum + pnl : sum;
        }, 0);

        const grossLoss = trades.reduce((sum, t) => {
            const pnl = calculatePnL(t) || 0;
            return pnl < 0 ? sum + Math.abs(pnl) : sum;
        }, 0);

        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
        const avgWin = wins > 0 ? grossProfit / wins : 0;
        const avgLoss = losses > 0 ? grossLoss / losses : 0;

        return { equityData, assetData, dayData, winRate, profitFactor, avgWin, avgLoss, totalTrades: total };
    }, [trades]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-[#00f0ff]" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20 pt-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#00f0ff]/10 rounded-lg">
                    <BarChart3 size={24} className="text-[#00f0ff]" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                    Performance <span className="text-white/40">Analytics</span>
                </h1>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Profit Factor" value={analytics.profitFactor.toFixed(2)} icon={<Activity size={20} />} />
                <KPICard title="Win Rate" value={`${analytics.winRate.toFixed(1)}%`} icon={<Target size={20} />} />
                <KPICard title="Avg Win" value={`$${analytics.avgWin.toFixed(0)}`} icon={<TrendingUp size={20} />} />
                <KPICard title="Avg Loss" value={`$${analytics.avgLoss.toFixed(0)}`} icon={<TrendingUp size={20} className="rotate-180" />} />
            </div>

            {/* Main Equity Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <EquityCurve data={analytics.equityData} />
            </motion.div>

            {/* Sub Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <AssetDistribution data={analytics.assetData} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <DayPerformance data={analytics.dayData} />
                </motion.div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon }: any) {
    return (
        <GlassCard className="p-6 flex items-center justify-between group">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{title}</p>
                <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
            </div>
            <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:text-[#00f0ff] group-hover:bg-[#00f0ff]/10 transition-colors">
                {icon}
            </div>
        </GlassCard>
    )
}
