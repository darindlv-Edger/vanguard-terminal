'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

export default function Playbook() {
  const [strategies, setStrategies] = useState<any[]>([])
  const [name, setName] = useState('')
  const [newRule, setNewRule] = useState('')
  const [isCritical, setIsCritical] = useState(true) // Default to Critical
  const [rules, setRules] = useState<{text: string, critical: boolean}[]>([])
  const [loading, setLoading] = useState(false)

  const fetchStrategies = async () => {
    const { data } = await supabase.from('strategies').select('*').order('created_at', { ascending: false })
    if (data) setStrategies(data)
  }

  useEffect(() => { fetchStrategies() }, [])

  const addRule = () => {
    if (newRule) {
      setRules([...rules, { text: newRule, critical: isCritical }])
      setNewRule('')
    }
  }

  const deleteStrategy = async (id: string) => {
    if (!confirm('Delete this strategy?')) return;
    await supabase.from('strategies').delete().eq('id', id);
    fetchStrategies();
  };

  const saveStrategy = async () => {
    if (!name || rules.length === 0) return alert("Missing Info");
    setLoading(true)
    const { error } = await supabase.from('strategies').insert([
      { name: name.toUpperCase(), rules: rules }
    ])
    if (!error) { setName(''); setRules([]); fetchStrategies(); }
    setLoading(false)
  }

  return (
    <main className="p-8 bg-[#050505] min-h-screen text-white pt-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="border-b border-white/5 pb-8">
          <h1 className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase">Strategy Playbook</h1>
          <p className="text-4xl font-light tracking-tighter mt-2">Rule Importance Engine</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CREATION PANEL */}
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl h-fit shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Strategy Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-mono outline-none focus:border-emerald-500" />
              </div>
              
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Add Rules</label>
                <input value={newRule} onChange={(e)=>setNewRule(e.target.value)} placeholder="Rule description..." className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-mono outline-none focus:border-emerald-500" />
                
                <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/5">
                  <button onClick={()=>setIsCritical(true)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${isCritical ? 'bg-rose-500 text-white' : 'text-white/20'}`}>CRITICAL</button>
                  <button onClick={()=>setIsCritical(false)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${!isCritical ? 'bg-white/10 text-white' : 'text-white/20'}`}>BONUS</button>
                </div>
                
                <button onClick={addRule} className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors">Add to List</button>
              </div>

              <div className="space-y-2">
                {rules.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.critical ? 'border-rose-500/20 bg-rose-500/5' : 'border-white/5 bg-white/5'}`}>
                    <span className="text-[10px] font-mono">{r.text}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${r.critical ? 'bg-rose-500 text-white' : 'bg-white/20 text-white'}`}>
                      {r.critical ? 'Critical' : 'Bonus'}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={saveStrategy} disabled={loading} className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                {loading ? 'DEPLOYING...' : 'Save Strategy'}
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strat) => (
              <div key={strat.id} className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 group relative">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold tracking-tighter">{strat.name}</h3>
                  <button onClick={() => deleteStrategy(strat.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all">
                    Delete
                  </button>
                </div>
                <div className="space-y-3">
                  {strat.rules.map((rule: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <p className="text-[11px] text-white/50 font-mono">{rule.text}</p>
                      {rule.critical && <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}