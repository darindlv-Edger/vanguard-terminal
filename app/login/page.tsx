'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/journal');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Optionally auto-login or show success message for email verification
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) router.push('/journal');
        else setError('Account created. Please sign in.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f0ff]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#7000ff]/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00f0ff]/10 mb-6 border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <Terminal size={32} className="text-[#00f0ff]" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
            Vanguard <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Terminal</span>
          </h1>
          <p className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase">
            Restricted Access // Authorized Personnel Only
          </p>
        </div>

        <GlassCard className="p-10 border-white/10" intensity="high">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Identity"
                type="email"
                placeholder="operator@vanguard.sys"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />
              <Input
                label="Passcode"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={18} className="text-rose-500" />
                <p className="text-xs font-bold text-rose-500 uppercase tracking-wide">{error}</p>
              </motion.div>
            )}

            <QuantumButton
              type="submit"
              className="w-full justify-center py-4 text-sm"
              disabled={loading}
              icon={loading ? <ShieldCheck className="animate-pulse" /> : <ArrowRight />}
            >
              {loading ? 'Verifying Credentials...' : (mode === 'LOGIN' ? 'Initialize Session' : 'Create Identity')}
            </QuantumButton>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#00f0ff] transition-colors"
              >
                {mode === 'LOGIN' ? 'Need Access? Register' : 'Have Access? Login'}
              </button>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                Recover Access
              </a>
            </div>
          </form>
        </GlassCard>

        <p className="text-center mt-8 text-[9px] font-mono text-white/20 uppercase tracking-widest">
          Secure Connection Encrypted via SHA-256
        </p>
      </motion.div>
    </div>
  );
}