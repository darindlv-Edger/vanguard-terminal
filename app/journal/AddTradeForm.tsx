'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { Loader2, ShieldCheck, ShieldAlert, UploadCloud } from 'lucide-react';
import { ContractType } from '@/types';

const PLAYBOOK_RULES = [
  { id: 'trend', label: 'HTF Trend Alignment', critical: true },
  { id: 'fvg', label: 'FVG / PD Array Tap', critical: true },
  { id: 'liq', label: 'Liquidity Swept', critical: true },
  { id: 'news', label: 'No High Impact News', critical: false },
];

interface AddTradeFormProps {
  onSuccess: () => void;
  userId: string;
  accountId: string;
}

export function AddTradeForm({ onSuccess, userId, accountId }: AddTradeFormProps) {
  const [loading, setLoading] = useState(false);
  const [baseSymbol, setBaseSymbol] = useState<'NQ' | 'ES'>('NQ');
  const [contractType, setContractType] = useState<ContractType>('MINI');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [contracts, setContracts] = useState('1');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [checkedRules, setCheckedRules] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryPrice) return;
    setLoading(true);

    const criticalRuleIds = PLAYBOOK_RULES.filter(r => r.critical).map(r => r.id);
    const isPlaybookValid = criticalRuleIds.every(id => checkedRules.includes(id));

    // Determine Final Symbol (e.g., NQ or MNQ)
    const finalSymbol = contractType === 'MICRO' ? `M${baseSymbol}` : baseSymbol;

    try {
      const { error } = await supabase.from('trades').insert([{
        user_id: userId,
        account_id: accountId,
        symbol: finalSymbol,
        side,
        contracts: parseInt(contracts),
        entry_price: parseFloat(entryPrice),
        exit_price: exitPrice ? parseFloat(exitPrice) : null,
        rules_checked: checkedRules,
        is_playbook_valid: isPlaybookValid,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error logging trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 ml-1">Asset Class</label>
          <div className="flex bg-black border border-white/10 rounded-xl p-1">
            <button 
              type="button" 
              onClick={() => setBaseSymbol('NQ')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${baseSymbol === 'NQ' ? 'bg-white text-black' : 'text-white/40'}`}
            >NASDAQ</button>
            <button 
              type="button" 
              onClick={() => setBaseSymbol('ES')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${baseSymbol === 'ES' ? 'bg-white text-black' : 'text-white/40'}`}
            >S&P 500</button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 ml-1">Instrument</label>
          <div className="flex bg-black border border-white/10 rounded-xl p-1">
            <button 
              type="button" 
              onClick={() => setContractType('MINI')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${contractType === 'MINI' ? 'bg-white text-black' : 'text-white/40'}`}
            >MINI</button>
            <button 
              type="button" 
              onClick={() => setContractType('MICRO')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${contractType === 'MICRO' ? 'bg-white text-black' : 'text-white/40'}`}
            >MICRO</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-black uppercase text-white/20 ml-1">Direction</label>
          <div className="flex bg-black border border-white/10 rounded-xl p-1">
            <button 
              type="button" 
              onClick={() => setSide('BUY')}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black transition-all ${side === 'BUY' ? 'bg-emerald-500 text-black' : 'text-white/40'}`}
            >LONG / BUY</button>
            <button 
              type="button" 
              onClick={() => setSide('SELL')}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black transition-all ${side === 'SELL' ? 'bg-rose-500 text-black' : 'text-white/40'}`}
            >SHORT / SELL</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Size" type="number" value={contracts} onChange={setContracts} />
        <Input label="Entry" type="number" step="0.25" value={entryPrice} onChange={setEntryPrice} required />
        <Input label="Exit" type="number" step="0.25" value={exitPrice} onChange={setExitPrice} />
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black uppercase text-[#00f0ff] tracking-widest">Execution Rules</p>
          <span className="text-[8px] text-white/20 uppercase font-mono">* Critical</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {PLAYBOOK_RULES.map(rule => (
            <label key={rule.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 cursor-pointer hover:border-white/20 transition-all">
              <span className={`text-[11px] font-bold uppercase tracking-tight ${rule.critical ? 'text-white' : 'text-white/40'}`}>
                {rule.label} {rule.critical && <span className="text-rose-500">*</span>}
              </span>
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-black text-[#00f0ff] focus:ring-0"
                checked={checkedRules.includes(rule.id)}
                onChange={(e) => {
                  if(e.target.checked) setCheckedRules([...checkedRules, rule.id]);
                  else setCheckedRules(checkedRules.filter(id => id !== rule.id));
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <QuantumButton className="w-full py-4" disabled={loading}>
        {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Sync Execution to Terminal'}
      </QuantumButton>
    </form>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-white/20 ml-1">{label}</label>
      <input 
        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-[#00f0ff] transition-all text-white" 
        {...props} 
        onChange={(e) => props.onChange(e.target.value)} 
      />
    </div>
  );
}