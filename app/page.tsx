'use client';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { QuantumButton } from '@/components/ui/QuantumButton';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Shield, Zap, BarChart3, ArrowRight, Activity, Lock, ChevronRight } from 'lucide-react';
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
    <div className="space-y-24 pb-20 bg-[#050505] min-h-screen text-white overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-start pt-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge variant="info" size="md" className="bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/20 uppercase tracking-widest font-black">
              Vanguard System v2.4.0 Online
            </Badge>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
            Execute with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-white/20">Precision.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed mb-10 font-medium">
            The high-performance command center for professional traders. 
            Automated execution tracking, playbook enforcement, and behavioral analytics.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link href="/journal">
              <QuantumButton size="lg" icon={<Terminal size={20} />}>
                Launch Terminal
              </QuantumButton>
            </Link>
            <Link href="#specs">
              <QuantumButton variant="secondary" size="lg">
                View System Specs
              </QuantumButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* --- Hero Background Elements --- */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[-5%] w-[700px] h-[700px] bg-[#00f0ff]/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#ff003c]/5 blur-[120px] rounded-full" />
          
          {/* Cyber Grid */}
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '50px 50px' 
            }} 
          />
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="specs" className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">

          {/* Precision Analytics - 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <GlassCard className="h-full p-12 flex flex-col justify-between group border-white/5 bg-white/[0.02]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-8 border border-[#00f0ff]/20">
                  <Activity className="text-[#00f0ff]" size={28} />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tight mb-4">Tactical Analytics</h3>
                <p className="text-white/40 max-w-xl text-lg leading-relaxed">
                  Real-time PnL monitoring for NQ and ES. The terminal calculates your drawdown, 
                  burn rate, and expectancy with zero latency.
                </p>
              </div>

              <div className="mt-16 relative h-40 w-full overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00f0ff]/10 to-transparent" />
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0 120 Q 150 100 300 130 T 600 40 T 900 80 T 1200 20" 
                    fill="none" 
                    stroke="#00f0ff" 
                    strokeWidth="3" 
                    className="drop-shadow-[0_0_15px_#00f0ff]" 
                  />
                </svg>
              </div>
            </GlassCard>
          </motion.div>

          {/* Risk Mitigation - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <GlassCard className="h-full p-12 flex flex-col justify-between bg-gradient-to-br from-rose-600/10 via-black/40 to-black border-rose-500/20">
              <div>
                <Shield className="text-rose-500 mb-8" size={40} />
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Risk Shield</h3>
                <p className="text-white/40 leading-relaxed">
                  Enforced Max Daily Loss protocols. If you violate your risk parameters, 
                  the terminal flags the execution for audit.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                <Lock className="text-rose-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Auto-Liquidation Active</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-10 border-white/5 bg-white/[0.02]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Logged Volume</p>
              <h4 className="text-6xl font-black tracking-tighter">$84.2M</h4>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4"
          >
            <GlassCard className="p-10 border-white/5 bg-white/[0.02]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Avg Expectancy</p>
              <h4 className="text-6xl font-black tracking-tighter text-[#00f0ff]">+1.42R</h4>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <Link href="/journal" className="block h-full group">
              <GlassCard className="p-10 flex items-center justify-between hover:bg-white/5 transition-all border-[#00f0ff]/10 group-hover:border-[#00f0ff]/40">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Access Portal</p>
                  <h4 className="text-2xl font-black uppercase tracking-tight">Open Journal</h4>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00f0ff] group-hover:text-black transition-all">
                  <ChevronRight size={20} />
                </div>
              </GlassCard>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-32 pb-12 border-t border-white/5 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <Terminal size={14} className="text-white" />
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
              VANGUARD_ELITE_SYSTEMS // SECURE_UPLINK_STABLE
            </p>
          </div>
          <div className="flex gap-10">
            {['Twitter', 'Discord', 'Terminal'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#00f0ff] transition-all">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}