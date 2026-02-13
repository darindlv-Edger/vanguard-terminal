'use client';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Shield, Zap, BarChart3, ArrowRight, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 pb-20">

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-start pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge variant="info" size="md">Vanguard System v2.0 Online</Badge>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            MASTER YOUR <br />
            <span className="text-gradient-primary">PSYCHOLOGY.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed mb-10">
            The journal for traders who treat the market as a battlefield.
            Automated stats, rigorous rule enforcement, and brutal honesty.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link href="/journal">
              <QuantumButton size="lg" icon={<Terminal size={20} />}>
                Launch Terminal
              </QuantumButton>
            </Link>
            <Link href="#features">
              <QuantumButton variant="secondary" size="lg">
                System Specs
              </QuantumButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-50">
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[100px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-[#ff003c]/10 blur-[100px] rounded-full" />

          {/* Grid Graphic */}
          <svg className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      {/* STATS / FEATURES GRID */}
      <section id="features">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

          {/* Main Feature - 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <GlassCard className="h-full p-10 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-6">
                  <Activity className="text-[#00f0ff]" size={24} />
                </div>
                <h3 className="text-3xl font-bold uppercase tracking-wide mb-4">Precision Tracking</h3>
                <p className="text-white/40 max-w-lg text-lg">
                  Instant calculation of PnL across all instrument types.
                  Support for NQ, ES, CL, GC, and Crypto.
                  Separate 'Sim' and 'Live' environments.
                </p>
              </div>

              <div className="mt-12 relative h-32 w-full overflow-hidden rounded-xl border border-white/5 bg-black/20">
                {/* Fake Chart Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M0 100 Q 100 50 200 80 T 400 20 T 600 60 T 800 10" fill="none" stroke="#00f0ff" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                  <path d="M0 100 L 0 100 Q 100 50 200 80 T 400 20 T 600 60 T 800 10 L 800 130 L 0 130 Z" fill="url(#gradient-chart)" opacity="0.2" />
                  <defs>
                    <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </GlassCard>
          </motion.div>

          {/* Side Feature - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <GlassCard className="h-full p-10 flex flex-col justify-between bg-gradient-to-b from-[#ff003c]/20 to-black/60 border-[#ff003c]/30">
              <div>
                <Shield className="text-[#ff003c] mb-6" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-wide mb-2">Kill Switch</h3>
                <p className="text-white/60">
                  Enforced daily loss limits.
                  Breach your max loss? The terminal locks you out.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex items-center gap-3 text-[#ff003c] font-mono text-xs uppercase tracking-widest">
                  <Lock size={12} />
                  <span>Safety Protocols Active</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Bottom Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-8">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Total Volume Logged</p>
              <h4 className="text-5xl font-light tracking-tighter">$42.8M</h4>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-8">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Avg. Win Rate</p>
              <h4 className="text-5xl font-light tracking-tighter text-[#39ff14]">68.4%</h4>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-8 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">The Playbook</p>
                <h4 className="text-2xl font-bold tracking-tight">Strategy Database</h4>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00f0ff] group-hover:text-[#00f0ff] transition-colors">
                <ArrowRight size={16} />
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            © 2026 Vanguard Systems Inc. // All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-[#00f0ff] transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-[#00f0ff] transition-colors">Discord</a>
            <a href="#" className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-[#00f0ff] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}