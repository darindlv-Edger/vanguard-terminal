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
import { Loader2, Plus, Terminal, RefreshCw, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Middleware should handle redirect really
      setUserId(user.id);

      // Fetch Settings to get current account
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Settings error:', settingsError);
      }

      setSettings(settingsData);
      const accountId = settingsData?.current_account_id;

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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTradeAdded = () => {
    setIsModalOpen(false);
    handleRefresh();
  };

  const handleDeleteTrade = async (id: string) => {
    if (!confirm('Are you sure you want to purge this trade record?')) return;
    try {
      await supabase.from('trades').delete().eq('id', id);
      setTrades(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00f0ff]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00f0ff]/10 rounded-lg">
              <Terminal size={20} className="text-[#00f0ff]" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              Command <span className="text-white/40">Center</span>
            </h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">
            Session ID: <span className="text-[#00f0ff]">{settings?.current_account_id?.slice(0, 8) || 'NO_SESSION'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
            title="Configuration"
          >
            <Settings size={20} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </motion.button>

          <div onClick={() => setIsModalOpen(true)}>
            <QuantumButton
              icon={<Plus size={18} />}
            >
              Log Execution
            </QuantumButton>
          </div>
        </div>
      </div>

      {/* Stats */}
      {settings ? (
        <StatsOverview
          trades={trades}
          target={settings.profit_target || 3000}
        />
      ) : (
        <div className="p-6 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center">
          <p className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-4">System Alert: No Configuration Found</p>
          <QuantumButton
            size="sm"
            variant="secondary"
            onClick={() => setIsSettingsOpen(true)}
          >
            Initialize System
          </QuantumButton>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide">Recent Executions</h2>
        </div>

        <TradeTable trades={trades} onDelete={handleDeleteTrade} />
      </motion.div>

      {/* Log Trade Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start New Execution"
      >
        {settings?.current_account_id ? (
          <AddTradeForm
            onSuccess={handleTradeAdded}
            userId={userId!}
            accountId={settings.current_account_id}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-rose-500 font-bold text-lg mb-2">No Active Session Found</p>
            <p className="text-white/40 text-sm mb-6">Please create a session in settings first.</p>
            <QuantumButton onClick={() => { setIsModalOpen(false); setIsSettingsOpen(true); }}>
              Open Settings
            </QuantumButton>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="System Configuration"
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