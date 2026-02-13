'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

interface AssetDistributionProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#00f0ff', '#7000ff', '#ff003c', '#39ff14', '#ffff00'];

export function AssetDistribution({ data }: AssetDistributionProps) {
    if (!data || data.length === 0) {
        return (
            <GlassCard className="h-[350px] flex items-center justify-center">
                <p className="text-white/20 font-mono uppercase tracking-widest">No Asset Data</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-8 h-[400px] flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold uppercase tracking-wide text-white">Asset Allocation</h3>
                <p className="text-[10px] text-white/40 font-mono tracking-widest">Trades by Instrument</p>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #ffffff10',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
