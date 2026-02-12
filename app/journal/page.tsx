'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Target, AlertTriangle, Settings, TrendingUp, Trophy, X, ChevronRight, ZoomIn } from 'lucide-react';
import 'react-calendar-heatmap/dist/styles.css';

export default function VanguardEliteJournal() {
  const router = useRouter()
  
  // Data States
  const [trades, setTrades] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [availableStrategies, setAvailableStrategies] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  
  // Custom Lightbox State
  const [activeImage, setActiveImage] = useState<string | null>(null)
  
  // Form States
  const [baseSymbol, setBaseSymbol] = useState('NQ'); 
  const [contractType, setContractType] = useState('MINI');
  const [side, setSide] = useState('BUY'); 
  const [contracts, setContracts] = useState('1'); 
  const [entryPrice, setEntryPrice] = useState(''); 
  const [exitPrice, setExitPrice] = useState('');
  const [tradeDate, setTradeDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [status, setStatus] = useState(''); 
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Target Setting States
  const [firmName, setFirmName] = useState('TOPSTEP');
  const [profitTarget, setProfitTarget] = useState('3000');
  const [maxLoss, setMaxLoss] = useState('2000');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else {
        fetchAll();
        fetchSettings(user.id);
      }
    }
    checkUser()
  }, [])

  const fetchSettings = async (userId: string) => {
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
    if (data) {
      setSettings(data);
      setFirmName(data.firm_name);
      setProfitTarget(data.profit_target.toString());
      setMaxLoss(data.max_loss.toString());
    } else {
      setShowSettings(true); 
    }
  }

  const saveSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user?.id,
      firm_name: firmName,
      profit_target: parseFloat(profitTarget),
      max_loss: parseFloat(maxLoss)
    });
    if (!error) {
      setShowSettings(false);
      fetchSettings(user!.id);
    }
  };

  const fetchAll = async () => {
    const { data: t } = await supabase.from('trades').select('*').order('created_at', { ascending: false })
    const { data: s } = await supabase.from('strategies').select('*').order('name', { ascending: true })
    if (t) setTrades(t);
    if (s) setAvailableStrategies(s);
  }

  // PnL ENGINE: (Price Diff * Point Value * Quantity)
  const calculatePnL = (trade: any) => {
    if (!trade.exit_price || !trade.entry_price) return null;
    const diff = trade.side === 'SELL' 
      ? parseFloat(trade.entry_price) - parseFloat(trade.exit_price) 
      : parseFloat(trade.exit_price) - parseFloat(trade.entry_price);
    
    const isNQ = trade.symbol.includes('NQ');
    const isMicro = trade.symbol.startsWith('M');
    const pointValue = isNQ ? (isMicro ? 2 : 20) : (isMicro ? 5 : 50);
    
    return diff * pointValue * (trade.contracts || 1);
  };

  const totalPnL = useMemo(() => trades.reduce((sum, t) => sum + (calculatePnL(t) || 0), 0), [trades]);

  const progressPercent = useMemo(() => {
    if (!settings) return 0;
    const percent = (totalPnL / settings.profit_target) * 100;
    return Math.min(Math.max(percent, -100), 100); 
  }, [totalPnL, settings]);

  const chartData = useMemo(() => {
    const sorted = [...trades].filter(t => t.exit_price).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let runningPnL = 0;
    return sorted.map((t) => {
      runningPnL += (calculatePnL(t) || 0);
      return { name: t.created_at.split('T')[0], pnl: runningPnL };
    });
  }, [trades]);

  const heatmapValues = useMemo(() => {
    const counts: any = {};
    trades.forEach(t => {
      const date = t.created_at.split('T')[0];
      const pnl = calculatePnL(t) || 0;
      if (!counts[date]) counts[date] = { date, pnl: 0, trades: [] };
      counts[date].pnl += pnl;
      counts[date].trades.push(t);
    });
    return Object.values(counts);
  }, [trades]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const newUrls = [...tempImages];
    for (let f of Array.from(files)) {
      const fileName = `${user?.id}/${Date.now()}.${f.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('trade-images').upload(fileName, f);
      if (!error) {
        const { data } = supabase.storage.from('trade-images').getPublicUrl(fileName);
        if (data?.publicUrl) newUrls.push(data.publicUrl);
      }
    }
    setTempImages(newUrls); setUploading(false);
  };

  const saveTrade = async () => {
    if(!entryPrice) return setStatus('MISSING ENTRY');
    setStatus('SYNCING...');
    const { data: { user } } = await supabase.auth.getUser();
    const sym = contractType === 'MICRO' ? (baseSymbol === 'NQ' ? 'MNQ' : 'MES') : baseSymbol;
    const { error } = await supabase.from('trades').insert([{ 
      user_id: user?.id, symbol: sym, side, 
      entry_price: parseFloat(entryPrice), exit_price: exitPrice ? parseFloat(exitPrice) : null,
      contracts: parseInt(contracts), strategy: 'MANUAL', 
      image_urls: tempImages, created_at: new Date(tradeDate + 'T12:00:00').toISOString() 
    }]);
    if (!error) { setStatus('SUCCESS'); setEntryPrice(''); setExitPrice(''); setTempImages([]); fetchAll(); setTimeout(()=>setStatus(''), 2000); }
  }

  return (
    <main className="p-4 md:p-8 bg-[#050505] text-[#e0e0e0] min-h-screen pt-32 selection:bg-emerald-500/30">
      
      {/* 1. CUSTOM IMAGE LIGHTBOX (NO EXTERNAL LIB) */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={activeImage} className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
            <button className="absolute top-8 right-8 text-white/40 hover:text-white"><X size={32}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TARGET CONFIG MODAL */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full">
              <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase">Establish <span className="text-emerald-500">Objective</span></h2>
              <div className="space-y-6">
                <Input label="Firm Name" value={firmName} onChange={setFirmName} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Target ($)" type="number" value={profitTarget} onChange={setProfitTarget} />
                  <Input label="Max Loss ($)" type="number" value={maxLoss} onChange={setMaxLoss} />
                </div>
                <button onClick={saveSettings} className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all">Initialize</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CALENDAR DAY DETAIL MODAL */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedDay(null)}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d0d0d] border border-white/10 p-8 rounded-[2rem] max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">{selectedDay.date}</p>
                    <h2 className="text-3xl font-black">${selectedDay.pnl.toLocaleString()}</h2>
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                {selectedDay.trades.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold">{t.symbol} <span className="text-white/20 font-mono text-[10px] ml-2">{t.contracts}x</span></span>
                        <span className={`text-[9px] font-black uppercase ${t.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.side}</span>
                    </div>
                    <span className={`font-mono text-sm ${calculatePnL(t)! >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ${(calculatePnL(t) || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-[9px] font-black tracking-[0.5em] text-emerald-500 uppercase mb-2">Vanguard // Executive</h1>
            <button onClick={() => setShowSettings(true)} className="text-[10px] font-mono text-white/20 hover:text-white uppercase tracking-widest flex items-center gap-2"> <Settings size={12}/> Config</button>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-white/20 uppercase mb-1">Total Equity</p>
             <p className={`text-6xl font-light tracking-tighter ${totalPnL >= 0 ? 'text-white' : 'text-rose-500'}`}>${totalPnL.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <ChartTooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="pnl" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-6 space-y-4">
            <div className="flex gap-2 p-1 bg-black rounded-xl">
              <button onClick={()=>setSide('BUY')} className={`flex-1 py-4 rounded-lg text-[10px] font-black ${side === 'BUY' ? 'bg-emerald-500 text-black' : 'text-white/20'}`}>LONG</button>
              <button onClick={()=>setSide('SELL')} className={`flex-1 py-4 rounded-lg text-[10px] font-black ${side === 'SELL' ? 'bg-rose-500 text-black' : 'text-white/20'}`}>SHORT</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ToggleBtn active={baseSymbol === 'NQ'} label="NQ" onClick={()=>setBaseSymbol('NQ')} />
              <ToggleBtn active={baseSymbol === 'ES'} label="ES" onClick={()=>setBaseSymbol('ES')} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-4">
              <ToggleBtn active={contractType === 'MINI'} label="MINI" onClick={()=>setContractType('MINI')} />
              <ToggleBtn active={contractType === 'MICRO'} label="MICRO" onClick={()=>setContractType('MICRO')} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Quantity" type="number" value={contracts} onChange={setContracts} />
              <Input label="Date" type="date" value={tradeDate} onChange={setTradeDate} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Entry" type="number" value={entryPrice} onChange={setEntryPrice} />
              <Input label="Exit" type="number" value={exitPrice} onChange={setExitPrice} />
            </div>
            <div className="p-4 border border-dashed border-white/10 rounded-2xl text-center">
                 <label className="text-[10px] text-emerald-500 font-bold cursor-pointer uppercase tracking-widest">
                    {uploading ? 'SYNCING...' : tempImages.length > 0 ? `${tempImages.length} ATTACHED` : '+ Add Image'}
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                 </label>
            </div>
            <button onClick={saveTrade} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-500 text-black">
              {status || 'Commit Trade'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10">
            <CalendarHeatmap 
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))} 
              endDate={new Date()} 
              values={heatmapValues} 
              classForValue={(v: any) => !v ? 'color-empty' : v.pnl > 0 ? 'color-green' : v.pnl < 0 ? 'color-red' : 'color-neutral'} 
              onClick={(v: any) => { if(v) setSelectedDay(v); }}
            />
          </div>

          <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between">
            {settings ? (
              <div className="space-y-8">
                <div className="flex justify-between">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">{settings.firm_name}</h4>
                  <Trophy className={totalPnL >= settings.profit_target ? 'text-emerald-500' : 'text-white/10'} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span>Performance</span>
                    <span className={totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}>${totalPnL.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${Math.abs(progressPercent)}%` }} className={`h-full ${totalPnL >= 0 ? 'bg-emerald-500' : 'bg-rose-500 ml-auto'}`} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase">
                    <span>Loss: -${settings.max_loss}</span>
                    <span>Target: ${settings.profit_target}</span>
                  </div>
                </div>
              </div>
            ) : <button onClick={()=>setShowSettings(true)} className="text-xs uppercase font-black text-emerald-500">Configure Firm</button>}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="text-[9px] uppercase tracking-widest text-white/20 bg-white/[0.01] border-b border-white/5">
              <tr><th className="p-8">Timestamp</th><th className="p-8">Asset</th><th className="p-8">Size</th><th className="p-8">Net PnL</th><th className="p-8">Evidence</th><th className="p-8 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trades.map((trade) => {
                const pnl = calculatePnL(trade);
                const imgs = Array.isArray(trade.image_urls) ? trade.image_urls : [];
                return (
                  <tr key={trade.id} className="group hover:bg-white/[0.01]">
                    <td className="p-8 font-mono text-[10px] text-white/40">{trade.created_at?.split('T')[0]}</td>
                    <td className="p-8">
                      <span className="text-sm font-bold text-white uppercase">{trade.symbol}</span>
                      <p className={`text-[9px] font-black ${trade.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>{trade.side}</p>
                    </td>
                    <td className="p-8 font-mono text-xs">{trade.contracts || 1}x</td>
                    <td className={`p-8 text-2xl font-mono tracking-tighter ${pnl && pnl >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {pnl ? `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString()}` : '---'}
                    </td>
                    <td className="p-8">
                       <div className="flex gap-2">
                         {imgs.map((u, i) => (
                           <div key={i} className="relative group/img cursor-zoom-in" onClick={() => setActiveImage(u)}>
                             <img src={u} className="w-12 h-12 object-cover rounded-lg border border-white/5 group-hover/img:opacity-50 transition-all" />
                             <ZoomIn className="absolute inset-0 m-auto opacity-0 group-hover/img:opacity-100 text-white" size={16} />
                           </div>
                         ))}
                       </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={async () => { if(confirm('Delete?')) await supabase.from('trades').delete().eq('id', trade.id).then(()=>fetchAll()) }} className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-rose-500 uppercase">Purge</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        .color-empty { fill: #111; } .color-green { fill: #10b981; } .color-red { fill: #f43f5e; } .color-neutral { fill: #222; }
        rect { rx: 4; ry: 4; transition: 0.2s; cursor: pointer; } rect:hover { fill: #fff !important; }
      `}</style>
    </main>
  )
}

function ToggleBtn({ active, label, onClick }: any) {
  return <button onClick={onClick} className={`py-4 rounded-2xl border text-[10px] font-black tracking-widest transition-all ${active ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/20'}`}>{label}</button>
}
function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">{label}</label>
      <input className="w-full bg-black border border-white/5 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500 text-white transition-all" {...props} onChange={(e)=>props.onChange(e.target.value)} />
    </div>
  )
}