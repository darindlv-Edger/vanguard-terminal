'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Minus, ArrowUpRight, Zap, Shield, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-[#050505] text-[#e0e0e0] min-h-screen selection:bg-emerald-500/30 selection:text-white">
      
      {/* 1. HERO SECTION - NOISY & MINIMAL */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500">System v2.0 Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
          >
            MECHANICAL <br />
            <span className="text-emerald-500">DISCIPLINE.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg text-white/40 leading-relaxed mb-12"
          >
            Stop trading with your heart. Vanguard is a brutal, high-performance terminal designed to turn your strategy into a cold, hard execution machine.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/journal" className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 transition-colors">
              Open Terminal
            </Link>
            <Link href="#faq" className="px-8 py-4 border border-white/10 text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/5 transition-colors">
              The Playbook
            </Link>
          </motion.div>
        </div>

        {/* BACKGROUND DECOR */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
      </section>

      {/* 2. THE WALL OF PERFORMANCE (BENTO GRID) */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Main Feature */}
            <div className="md:col-span-8 p-10 bg-[#0a0a0a] border border-white/5 rounded-[2rem] flex flex-col justify-between">
              <div>
                <BarChart3 className="text-emerald-500 mb-6" size={32} />
                <h3 className="text-3xl font-bold tracking-tight mb-4">Precision Tracking</h3>
                <p className="text-white/40 max-w-sm">Automatic PnL calculation across Mini and Micro contracts. No spreadsheets. No math. Just data.</p>
              </div>
              <div className="mt-12 flex gap-4 overflow-hidden opacity-30">
                <div className="h-32 w-1 bg-emerald-500" />
                <div className="h-20 w-1 bg-emerald-500" />
                <div className="h-40 w-1 bg-emerald-500" />
                <div className="h-10 w-1 bg-emerald-500" />
              </div>
            </div>

            {/* Side Callout */}
            <div className="md:col-span-4 p-10 bg-emerald-500 text-black rounded-[2rem] flex flex-col justify-between">
              <Shield size={32} />
              <div>
                <h3 className="text-3xl font-black tracking-tight leading-none mb-4">RULE <br /> ENFORCER</h3>
                <p className="text-black/60 font-medium">Commit trades only when your playbook rules are satisfied.</p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="md:col-span-4 p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-4">Avg. Win Rate</p>
              <h4 className="text-5xl font-light">68.4%</h4>
            </div>
            <div className="md:col-span-4 p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem]">
               <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-4">Total Trades Logged</p>
               <h4 className="text-5xl font-light">12,842</h4>
            </div>
            <div className="md:col-span-4 p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem]">
               <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-4">Active Terminals</p>
               <h4 className="text-5xl font-light">24/7</h4>
            </div>

          </div>
        </div>
      </section>

      {/* 3. THE FAQ - CLEAN ACCORDION */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black tracking-tighter mb-12 uppercase">Frequently Asked <span className="text-emerald-500">Intel.</span></h2>
          <div className="space-y-4">
            <FaqItem 
              question="Is this only for NQ and ES traders?" 
              answer="Primarily optimized for CME Futures, but the manual entry allows you to log anything from Crypto to Forex if you know your point values."
            />
            <FaqItem 
              question="How do I connect my broker?" 
              answer="We don't connect. This is a Journal of record. Connecting brokers leads to emotional checking. You input the data, Vanguard keeps you honest."
            />
            <FaqItem 
              question="Can I export my data?" 
              answer="Yes. Your data is stored in Supabase and can be exported as a CSV at any time from your account settings."
            />
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 Vanguard Terminal</p>
          <div className="flex gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500">Twitter</a>
            <a href="#" className="hover:text-emerald-500">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-emerald-500 transition-colors"
      >
        <span className="text-lg font-bold tracking-tight">{question}</span>
        {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/40 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { AnimatePresence } from 'framer-motion'