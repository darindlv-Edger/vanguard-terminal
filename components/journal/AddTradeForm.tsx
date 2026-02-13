'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, UploadCloud } from 'lucide-react';
import { ContractType } from '@/types';

interface AddTradeFormProps {
    onSuccess: () => void;
    userId: string;
    accountId: string;
}

export function AddTradeForm({ onSuccess, userId, accountId }: AddTradeFormProps) {
    const [activeSymbol, setActiveSymbol] = useState('NQ');
    const [contractType, setContractType] = useState<ContractType>('MINI');
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [contracts, setContracts] = useState('1');
    const [entryPrice, setEntryPrice] = useState('');
    const [exitPrice, setExitPrice] = useState('');
    const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newUrls = [...images];

        try {
            for (const file of Array.from(files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('trade-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('trade-images')
                    .getPublicUrl(fileName);

                if (data?.publicUrl) {
                    newUrls.push(data.publicUrl);
                }
            }
            setImages(newUrls);
        } catch (err: any) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!entryPrice || !accountId) {
            setError('Missing required fields');
            setIsSubmitting(false);
            return;
        }

        try {
            // Determine actual symbol based on contract type
            let finalSymbol = activeSymbol;
            if (contractType === 'MICRO') {
                if (activeSymbol === 'NQ') finalSymbol = 'MNQ';
                else if (activeSymbol === 'ES') finalSymbol = 'MES';
            }

            const { error: insertError } = await supabase.from('trades').insert({
                user_id: userId,
                account_id: accountId,
                symbol: finalSymbol,
                side,
                entry_price: parseFloat(entryPrice),
                exit_price: exitPrice ? parseFloat(exitPrice) : null,
                contracts: parseInt(contracts),
                strategy: 'MANUAL',
                image_urls: images,
                created_at: new Date(tradeDate + 'T12:00:00').toISOString()
            });

            if (insertError) throw insertError;

            onSuccess();
        } catch (err: any) {
            console.error('Error saving trade:', err);
            setError(err.message || 'Failed to save trade');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Symbol & Side Selection */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex bg-white/5 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setSide('BUY')}
                        className={`flex-1 py-3 px-4 rounded-lg font-black text-xs tracking-widest transition-all ${side === 'BUY' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        LONG
                    </button>
                    <button
                        type="button"
                        onClick={() => setSide('SELL')}
                        className={`flex-1 py-3 px-4 rounded-lg font-black text-xs tracking-widest transition-all ${side === 'SELL' ? 'bg-rose-500 text-black shadow-lg shadow-rose-500/20' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        SHORT
                    </button>
                </div>

                <div className="col-span-2 flex gap-2">
                    {['NQ', 'ES', 'GC', 'CL', 'BTC'].map(sym => (
                        <button
                            key={sym}
                            type="button"
                            onClick={() => setActiveSymbol(sym)}
                            className={`flex-1 py-2 rounded-lg border text-[10px] font-bold transition-all ${activeSymbol === sym
                                    ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                                    : 'border-white/10 text-white/40 hover:border-white/30'
                                }`}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                        <button type="button" onClick={() => setContractType('MINI')} className={`flex-1 py-1.5 rounded text-[9px] font-bold ${contractType === 'MINI' ? 'bg-white/10 text-white' : 'text-white/20'}`}>MINI</button>
                        <button type="button" onClick={() => setContractType('MICRO')} className={`flex-1 py-1.5 rounded text-[9px] font-bold ${contractType === 'MICRO' ? 'bg-white/10 text-white' : 'text-white/20'}`}>MICRO</button>
                    </div>
                    <Input label="Contracts" type="number" min="1" value={contracts} onChange={(e: any) => setContracts(e.target.value)} />
                    <Input label="Date" type="date" value={tradeDate} onChange={(e: any) => setTradeDate(e.target.value)} />
                </div>
                <div className="space-y-4">
                    <Input label="Entry Price" type="number" step="0.25" value={entryPrice} onChange={(e: any) => setEntryPrice(e.target.value)} placeholder="0.00" />
                    <Input label="Exit Price" type="number" step="0.25" value={exitPrice} onChange={(e: any) => setExitPrice(e.target.value)} placeholder="0.00" />
                </div>
            </div>

            {/* Image Upload */}
            <div className="border border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative group">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                        <Loader2 className="animate-spin text-[#00f0ff]" size={24} />
                    ) : (
                        <UploadCloud className="text-white/20 group-hover:text-[#00f0ff] transition-colors" size={24} />
                    )}
                    <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                        {images.length > 0 ? `${images.length} Images Attached` : 'Upload Screenshots'}
                    </span>
                </div>
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

            <div className="pt-2">
                <QuantumButton
                    type="submit"
                    className="w-full justify-center"
                    disabled={isSubmitting || uploading}
                >
                    {isSubmitting ? 'Logging Trade...' : 'COMMIT TO LEDGER'}
                </QuantumButton>
            </div>
        </form>
    );
}
