'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

interface DayPerformanceProps {
    data: { day: string; pnl: number }[];
}

export function DayPerformance({ data }: DayPerformanceProps) {
    if (!data || data.length === 0) {
        return (
            <GlassCard className="h-[350px] flex items-center justify-center">
                <p className="text-white/20 font-mono uppercase tracking-widest">No Daily Data</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-8 h-[400px] flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold uppercase tracking-wide text-white">Daily Performance</h3>
                <p className="text-[10px] text-white/40 font-mono tracking-widest">Net PnL by Weekday</p>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #ffffff10',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            formatter={(value: number | undefined) => [`$${value?.toLocaleString()}`, 'Net PnL']}
                        />
                        <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
