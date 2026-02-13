'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trade, UserSettings } from '@/types';
import { StatsOverview } from '@/components/journal/StatsOverview';
import { TradeTable } from '@/components/journal/TradeTable';
import { SettingsForm } from '@/components/journal/SettingsForm';
import { AddTradeForm } from '@/components/journal/AddTradeForm';
import { Modal } from '@/components/ui/Modal';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { 
  Loader2, 
  Plus, 
  Terminal, 
  RefreshCw, 
  Settings, 
  ShieldCheck, 
  FileText, 
  Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function JournalPage() {
  // --- STATE MANAGEMENT ---
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // --- DATA FETCHING ENGINE ---
  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch User Configuration & Active Account
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Core System Error (Settings):', settingsError);
      }

      setSettings(settingsData);
      const accountId = settingsData?.current_account_id;

      // Only fetch trades if an active session exists
      if (accountId) {
        const { data: tradesData, error } = await supabase
          .from('trades')
          .select('*')
          .eq('account_id', accountId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTrades(tradesData as Trade[]);
      }
    } catch (error) {
      console.error('Data Extraction Failure:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTradeAdded = () => {
    setIsModalOpen(false);
    handleRefresh();
  };

  const handleDeleteTrade = async (id: string) => {
    if (!confirm('PROTOCOL ALERT: Are you sure you want to purge this execution record?')) return;
    try {
      await supabase.from('trades').delete().eq('id', id);
      setTrades(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Purge Failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#00f0ff]" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Initialising Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f0ff]/30">
      <main className="max-w-[1600px] mx-auto px-6 py-10 space-y-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00f0ff]/10 rounded-xl border border-[#00f0ff]/20">
                <Terminal size={22} className="text-[#00f0ff]" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Vanguard <span className="text-white/20">Journal</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Session: <span className="text-[#00f0ff]">{settings?.current_account_id?.slice(0, 8) || 'OFFLINE'}</span>
              </p>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Firm: <span className="text-white">{settings?.firm_name || 'UNASSIGNED'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition-all"
              title="System Config"
            >
              <Settings size={20} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} />
            </motion.button>

            <div onClick={() => setIsModalOpen(true)}>
              <QuantumButton icon={<Plus size={18} />}>
                Log Execution
              </QuantumButton>
            </div>
          </div>
        </header>

        {/* --- ANALYTICS OVERVIEW --- */}
        {settings ? (
          <StatsOverview
            trades={trades}
            target={settings.profit_target || 3000}
          />
        ) : (
          <div className="p-12 border border-rose-500/20 bg-rose-500/5 rounded-[2.5rem] text-center space-y-6">
            <div className="flex justify-center">
              <ShieldCheck size={40} className="text-rose-500/20" />
            </div>
            <div>
              <h3 className="text-rose-500 font-black uppercase tracking-widest text-sm">System Conflict Detected</h3>
              <p className="text-white/40 text-xs mt-2">No active trading session found. Initialise account to begin logging.</p>
            </div>
            <QuantumButton
              size="sm"
              variant="secondary"
              onClick={() => setIsSettingsOpen(true)}
            >
              Start Session
            </QuantumButton>
          </div>
        )}

        {/* --- RECENT EXECUTIONS TABLE --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Tactical Feed // Recent Trades</h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase text-emerald-500/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Uplink
              </span>
            </div>
          </div>

          <TradeTable trades={trades} onDelete={handleDeleteTrade} />
        </motion.section>

        {/* --- LEGAL COMPLIANCE FOOTER --- */}
        <footer className="mt-32 border-t border-white/5 pt-12 pb-20 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <ShieldCheck size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Vanguard Executive Compliance</h3>
              </div>
              <p className="text-[9px] leading-relaxed text-white/20 font-mono uppercase max-w-xl">
                CFTC RULE 4.41 - HYPOTHETICAL OR SIMULATED PERFORMANCE RESULTS HAVE CERTAIN LIMITATIONS. UNLIKE AN ACTUAL PERFORMANCE RECORD, SIMULATED RESULTS DO NOT REPRESENT ACTUAL TRADING. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-6">
              <div className="flex gap-8">
                <Link href="/terms" className="text-[10px] font-black uppercase text-white/30 hover:text-[#00f0ff] transition-all tracking-widest flex items-center gap-2">
                  <FileText size={12} /> Terms of Service
                </Link>
                <Link href="/privacy" className="text-[10px] font-black uppercase text-white/30 hover:text-[#00f0ff] transition-all tracking-widest flex items-center gap-2">
                  <Lock size={12} /> Privacy Protocol
                </Link>
              </div>
              <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">© 2026 VANGUARD_ELITE_SYSTEMS // v2.4.0</p>
            </div>
          </div>
        </footer>

      </main>

      {/* --- MODALS --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Execute New Entry"
      >
        {settings?.current_account_id ? (
          <AddTradeForm
            onSuccess={handleTradeAdded}
            userId={userId!}
            accountId={settings.current_account_id}
          />
        ) : (
          <div className="text-center py-10 space-y-6">
            <p className="text-rose-500 font-black text-xs uppercase tracking-widest">Access Denied: No Session</p>
            <QuantumButton onClick={() => { setIsModalOpen(false); setIsSettingsOpen(true); }}>
              Open Configuration
            </QuantumButton>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="System Architecture"
      >
        {userId && (
          <SettingsForm
            initialSettings={settings}
            userId={userId}
            onSave={() => { setIsSettingsOpen(false); handleRefresh(); }}
          />
        )}
      </Modal>

    </div>
  );
}