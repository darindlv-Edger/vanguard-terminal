'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

interface EquityCurveProps {
    data: { date: string; pnl: number }[];
}

export function EquityCurve({ data }: EquityCurveProps) {
    if (!data || data.length === 0) {
        return (
            <GlassCard className="h-[400px] flex items-center justify-center">
                <p className="text-white/20 font-mono uppercase tracking-widest">No data available for Equity Curve</p>
            </GlassCard>
        );
    }

    const isPositive = data[data.length - 1]?.pnl >= 0;

    return (
        <GlassCard className="p-8 h-[450px] w-full relative group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">Equity Curve</h3>
                    <p className="text-[10px] text-white/40 font-mono tracking-widest">Cumulative PnL Performance</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-black ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {isPositive ? 'PROFITABLE' : 'DRAWDOWN'}
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #ffffff10',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontFamily: 'monospace'
                            }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net PnL']}
                        />
                        <Area
                            type="monotone"
                            dataKey="pnl"
                            stroke={isPositive ? '#10b981' : '#f43f5e'}
                            fillOpacity={1}
                            fill="url(#colorPnl)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
