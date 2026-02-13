'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft, Scale } from 'lucide-react'

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#e0e0e0] p-6 md:p-20 font-mono selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-10">
          <Link href="/journal" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-emerald-500 transition-all">
            <ArrowLeft size={14}/> Back to Terminal
          </Link>
          <div className="text-right">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Terms of <span className="text-emerald-500">Service</span></h1>
            <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">Vanguard Executive Protocol // REF-2026-001</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12 text-[12px] leading-relaxed text-white/60">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <ShieldAlert size={18} className="text-emerald-500"/>
              <h2 className="font-black uppercase tracking-widest text-sm">1.0 Risk Disclosure</h2>
            </div>
            <p>
              Trading futures, forex, and equities involves substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardizing ones’ financial security or life style. Only risk capital should be used for trading and only those with sufficient risk capital should consider trading. 
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Scale size={18} className="text-emerald-500"/>
              <h2 className="font-black uppercase tracking-widest text-sm">2.0 No Financial Advice</h2>
            </div>
            <p>
              Vanguard Elite Journal is a data logging and visualization tool. We do not provide trading signals, investment advice, or financial consulting. Any trade logged within this system is the sole responsibility of the user. Past performance is not indicative of future results.
            </p>
          </section>

          <section className="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/5">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3.0 Account Termination</h2>
            <p>
              We reserve the right to terminate access to the protocol for any user found to be attempting to reverse-engineer the system or exploit the Supabase architecture. Play fair, trade hard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-black uppercase tracking-widest text-sm">4.0 Limitation of Liability</h2>
            <p>
              In no event shall Vanguard Elite Systems, its developers, or affiliates be liable for any trading losses, data loss, or system downtime. By using this terminal, you accept all risks associated with manual data entry and algorithmic calculation.
            </p>
          </section>

        </div>

        {/* Footer Signature */}
        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center opacity-40">
           <div className="text-[10px] uppercase font-black tracking-widest">
              Authorized Signature Required
           </div>
           <div className="h-10 w-48 border-b border-white/20 italic font-serif text-emerald-500 text-xl">
              Vanguard Admin
           </div>
        </div>

      </div>
    </main>
  )
}