'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { supabase } from '@/lib/supabaseClient';
import { UserSettings } from '@/types';
import { Save } from 'lucide-react';

interface SettingsFormProps {
    initialSettings: UserSettings | null;
    userId: string;
    onSave: () => void;
}

export function SettingsForm({ initialSettings, userId, onSave }: SettingsFormProps) {
    const [firmName, setFirmName] = useState(initialSettings?.firm_name || 'TOPSTEP');
    const [profitTarget, setProfitTarget] = useState(initialSettings?.profit_target?.toString() || '3000');
    const [maxLoss, setMaxLoss] = useState(initialSettings?.max_loss?.toString() || '2000');
    const [isFunded, setIsFunded] = useState(initialSettings?.is_funded || false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            user_id: userId,
            firm_name: firmName,
            profit_target: parseFloat(profitTarget),
            max_loss: parseFloat(maxLoss),
            is_funded: isFunded,
            // Create a new session ID if none exists, otherwise keep existing
            current_account_id: initialSettings?.current_account_id || crypto.randomUUID(),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('user_settings')
            .upsert(updates, { onConflict: 'user_id' });

        if (error) {
            console.error('Error saving settings:', error);
        } else {
            onSave();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Firm / Account Name"
                    value={firmName}
                    onChange={(e: any) => setFirmName(e.target.value)}
                    placeholder="e.g. APEX, TOPSTEP"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Profit Target ($)"
                        type="number"
                        value={profitTarget}
                        onChange={(e: any) => setProfitTarget(e.target.value)}
                    />
                    <Input
                        label="Max Loss Limit ($)"
                        type="number"
                        value={maxLoss}
                        onChange={(e: any) => setMaxLoss(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Account Status</span>
                    <button
                        type="button"
                        onClick={() => setIsFunded(!isFunded)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${isFunded
                                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-white/10 text-white/40 hover:bg-white/20'
                            }`}
                    >
                        {isFunded ? 'LIVE / FUNDED' : 'EVALUATION'}
                    </button>
                </div>
            </div>

            <div className="pt-4">
                <QuantumButton
                    type="submit"
                    className="w-full justify-center"
                    disabled={loading}
                    icon={<Save size={16} />}
                >
                    {loading ? 'Saving System Config...' : 'UPDATE CONFIGURATION'}
                </QuantumButton>
            </div>
        </form>
    );
}
