'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Target, Settings, Trophy, RefreshCcw, ShieldCheck, Loader2, PlusCircle, History, ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Parser } from 'json2csv';
import 'react-calendar-heatmap/dist/styles.css';

export default function VanguardEliteJournal() {
  const router = useRouter()
  
  // Data States
  const [trades, setTrades] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [allSessions, setAllSessions] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<any>(null)
  
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
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Target Setting States
  const [firmName, setFirmName] = useState('TOPSTEP');
  const [profitTarget, setProfitTarget] = useState('3000');
  const [maxLoss, setMaxLoss] = useState('2000');
  const [isFunded, setIsFunded] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else {
        fetchSettings(user.id);
        fetchSessionHistory(user.id);
      }
    }
    checkUser()
  }, [])

  const fetchSettings = async (userId: string) => {
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle();
    if (data) {
      setSettings(data);
      setFirmName(data.firm_name || 'TOPSTEP');
      setProfitTarget(data.profit_target?.toString() || '3000');
      setMaxLoss(data.max_loss?.toString() || '2000');
      setIsFunded(data.is_funded || false);
      fetchActiveTrades(data.current_account_id);
    } else {
      setShowSettings(true); 
    }
  }

  const fetchSessionHistory = async (userId: string) => {
    const { data } = await supabase.from('trades').select('account_id').eq('user_id', userId);
    if (data) {
      const uniqueIds = Array.from(new Set(data.map(item => item.account_id))).filter(Boolean);
      setAllSessions(uniqueIds);
    }
  }

  const fetchActiveTrades = async (accountId: string) => {
    if (!accountId) return;
    const { data: t } = await supabase.from('trades').select('*').eq('account_id', accountId).order('created_at', { ascending: false });
    if (t) setTrades(t);
  }

  const switchAccount = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('user_settings').update({ current_account_id: id }).eq('user_id', user?.id);
    window.location.reload();
  }

  const saveSettings = async () => {
    setIsSavingSettings(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user?.id,
      firm_name: firmName,
      profit_target: parseFloat(profitTarget),
      max_loss: parseFloat(maxLoss),
      is_funded: isFunded
    }, { onConflict: 'user_id' });
    if (!error) { await fetchSettings(user!.id); setShowSettings(false); }
    setIsSavingSettings(false);
  };

  const createNewAccountSession = async () => {
    if(!confirm("Create a fresh account session?")) return;
    setIsSavingSettings(true);
    const { data: { user } } = await supabase.auth.getUser();
    const newId = crypto.randomUUID();
    await supabase.from('user_settings').upsert({
      user_id: user?.id,
      current_account_id: newId,
      firm_name: "NEW CHALLENGE",
      is_funded: false
    }, { onConflict: 'user_id' });
    window.location.reload();
  }

  const calculatePnL = (trade: any) => {
    if (!trade.exit_price || !trade.entry_price) return null;
    const diff = trade.side === 'SELL' ? parseFloat(trade.entry_price) - parseFloat(trade.exit_price) : parseFloat(trade.exit_price) - parseFloat(trade.entry_price);
    const isNQ = trade.symbol.includes('NQ');
    const isMicro = trade.symbol.startsWith('M');
    const pointValue = isNQ ? (isMicro ? 2 : 20) : (isMicro ? 5 : 50);
    return diff * pointValue * (trade.contracts || 1);
  };

  // EXPORT LOGIC
  const exportCSV = () => {
    try {
      const dataToExport = trades.map(t => ({
        Date: t.created_at.split('T')[0],
        Symbol: t.symbol,
        Side: t.side,
        Contracts: t.contracts,
        Entry: t.entry_price,
        Exit: t.exit_price,
        PnL: calculatePnL(t)
      }));
      const parser = new Parser();
      const csv = parser.parse(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Vanguard_Session_${firmName}_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  }

  const exportPDF = () => {
    window.print(); // Triggers the print-optimized view
  }

  const totalPnL = useMemo(() => trades.reduce((sum: number, t: any) => sum + (calculatePnL(t) || 0), 0), [trades]);
  const progressPercent = useMemo(() => {
    const target = parseFloat(profitTarget) || 1;
    return isFunded ? 0 : Math.min(Math.max((totalPnL / target) * 100, -100), 100);
  }, [totalPnL, profitTarget, isFunded]);

  const chartData = useMemo(() => {
    const sorted = [...trades].filter((t: any) => t.exit_price).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let runningPnL = 0;
    return sorted.map((t: any) => ({ name: t.created_at.split('T')[0], pnl: runningPnL += (calculatePnL(t) || 0) }));
  }, [trades]);

  const heatmapValues = useMemo(() => {
    const counts: any = {};
    trades.forEach((t: any) => {
      const date = t.created_at.split('T')[0];
      if (!counts[date]) counts[date] = { date, pnl: 0 };
      counts[date].pnl += (calculatePnL(t) || 0);
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
      user_id: user?.id, account_id: settings?.current_account_id, symbol: sym, side, 
      entry_price: parseFloat(entryPrice), exit_price: exitPrice ? parseFloat(exitPrice) : null,
      contracts: parseInt(contracts), strategy: 'MANUAL', image_urls: tempImages, created_at: new Date(tradeDate + 'T12:00:00').toISOString() 
    }]);
    if (!error) { setStatus('SUCCESS'); setEntryPrice(''); setExitPrice(''); setTempImages([]); fetchActiveTrades(settings.current_account_id); setTimeout(()=>setStatus(''), 2000); }
  }

  return (
    <main className="p-4 md:p-8 bg-[#050505] text-[#e0e0e0] min-h-screen pt-32 selection:bg-emerald-500/30">
      
      {/* PERSISTENT HEADER CONTROL PANEL */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-black/80 backdrop-blur-md border-b border-white/5 p-4 no-print">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.3em]">Active Session</span>
                <div className="flex items-center gap-2">
                   <h2 className="text-sm font-bold uppercase tracking-tighter">{firmName}</h2>
                   <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFunded ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
             </div>

             <div className="h-8 w-px bg-white/10" />

             {/* ACCOUNT DROPDOWN */}
             <div className="relative group">
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-all">
                   <History size={14} className="text-white/40"/>
                   <span className="text-[10px] font-black uppercase tracking-widest">Switch Account</span>
                   <ChevronDown size={12} className="text-white/20"/>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 hidden group-hover:block shadow-2xl">
                   <p className="p-3 text-[8px] font-black uppercase text-white/20 tracking-widest">Session History</p>
                   {allSessions.map((id, idx) => (
                      <button key={id} onClick={() => switchAccount(id)} className={`w-full text-left p-3 rounded-xl text-[10px] font-bold hover:bg-emerald-500 hover:text-black transition-all mb-1 ${settings?.current_account_id === id ? 'bg-emerald-500/20 text-emerald-500' : 'text-white/60'}`}>
                        SESSION #{allSessions.length - idx} {settings?.current_account_id === id && '(ACTIVE)'}
                      </button>
                   ))}
                   <button onClick={createNewAccountSession} className="w-full mt-2 p-3 rounded-xl text-[10px] font-black bg-white text-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-500">
                     <PlusCircle size={12}/> New Session
                   </button>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                <button onClick={exportCSV} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all title='Export CSV'"><FileSpreadsheet size={18}/></button>
                <button onClick={exportPDF} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all title='Save PDF'"><FileText size={18}/></button>
              </div>
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 bg-emerald-500 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                <Settings size={14}/> Config
              </button>
          </div>
        </div>
      </div>

      {/* PRINT ONLY HEADER */}
      <div className="hidden print:block mb-10 border-b-2 border-black pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Vanguard Executive Report</h1>
          <p className="text-sm font-mono mt-2">Account: {firmName} | Date: {new Date().toLocaleDateString()}</p>
          <p className="text-xl font-bold mt-4">Net PnL: ${totalPnL.toLocaleString()}</p>
      </div>

      <AnimatePresence>
        {activeImage && (
          <div onClick={() => setActiveImage(null)} className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out no-print">
            <img src={activeImage} className="max-w-full max-h-full rounded-lg shadow-2xl" />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full">
              <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase text-white">Target <span className="text-emerald-500">Config</span></h2>
              <div className="space-y-6">
                <Input label="Firm Name" value={firmName} onChange={setFirmName} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Target ($)" type="number" value={profitTarget} onChange={setProfitTarget} />
                  <Input label="Max Loss ($)" type="number" value={maxLoss} onChange={setMaxLoss} />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Funded Status</span>
                  <button onClick={() => setIsFunded(!isFunded)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${isFunded ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}`}>
                    {isFunded ? 'FUNDED' : 'EVALUATION'}
                  </button>
                </div>
                <button disabled={isSavingSettings} onClick={saveSettings} className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all">
                  {isSavingSettings ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Update Session'}
                </button>
                <button onClick={() => setShowSettings(false)} className="w-full text-[9px] font-black uppercase text-white/20 tracking-widest">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <h1 className="text-6xl font-light tracking-tighter text-white no-print">Session <span className="text-emerald-500 font-black">PNL</span></h1>
          <div className="text-right">
             <p className="text-[9px] font-black text-white/20 uppercase mb-1">Equity Curve</p>
             <p className={`text-6xl font-light tracking-tighter ${totalPnL >= 0 ? 'text-white' : 'text-rose-500'}`}>${totalPnL.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 print:border-black">
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

          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-6 space-y-4 no-print">
            <div className="flex gap-2 p-1 bg-black rounded-xl">
              <button onClick={()=>setSide('BUY')} className={`flex-1 py-4 rounded-lg text-[10px] font-black ${side === 'BUY' ? 'bg-emerald-500 text-black' : 'text-white/20'}`}>LONG</button>
              <button onClick={()=>setSide('SELL')} className={`flex-1 py-4 rounded-lg text-[10px] font-black ${side === 'SELL' ? 'bg-rose-500 text-black' : 'text-white/20'}`}>SHORT</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ToggleBtn active={baseSymbol === 'NQ'} label="NQ" onClick={()=>setBaseSymbol('NQ')} />
              <ToggleBtn active={baseSymbol === 'ES'} label="ES" onClick={()=>setBaseSymbol('ES')} />
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
            <button onClick={saveTrade} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-500 text-black">{status || 'Commit Trade'}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 no-print">
            <CalendarHeatmap startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))} endDate={new Date()} values={heatmapValues} classForValue={(v: any) => !v ? 'color-empty' : v.pnl > 0 ? 'color-green' : 'color-red'} />
          </div>
          <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center print:border-black">
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="text-2xl font-black uppercase tracking-tighter">{firmName}</h4>
                   {isFunded ? <ShieldCheck className="text-emerald-500" size={32}/> : <Trophy className={totalPnL >= parseFloat(profitTarget) ? 'text-emerald-500' : 'text-white/10'} />}
                </div>
                {!isFunded ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                      <span>Progress</span>
                      <span className={totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}>${totalPnL.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 print:border-black">
                      <motion.div animate={{ width: `${Math.abs(progressPercent)}%` }} className={`h-full ${totalPnL >= 0 ? 'bg-emerald-500' : 'bg-rose-500 ml-auto'}`} />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      <span>Max Loss: -${maxLoss}</span>
                      <span>Target: ${profitTarget}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl text-center">
                      <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-2">Funded Mode Active</p>
                      <p className="text-xs text-white/40 font-mono">Focus on risk, not profit.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto print:border-black print:text-black print:bg-white">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="text-[9px] uppercase tracking-widest text-white/20 bg-white/[0.01] border-b border-white/5 print:text-black print:border-black">
              <tr><th className="p-8">Timestamp</th><th className="p-8">Asset</th><th className="p-8">Size</th><th className="p-8">Net PnL</th><th className="p-8 no-print">Evidence</th><th className="p-8 text-right no-print">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-black">
              {trades.map((trade: any) => {
                const pnl = calculatePnL(trade);
                const imgs = Array.isArray(trade.image_urls) ? trade.image_urls : [];
                return (
                  <tr key={trade.id} className="group hover:bg-white/[0.01]">
                    <td className="p-8 font-mono text-[10px] text-white/40 print:text-black">{trade.created_at?.split('T')[0]}</td>
                    <td className="p-8"><span className="text-sm font-bold text-white uppercase print:text-black">{trade.symbol}</span><p className={`text-[9px] font-black ${trade.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>{trade.side}</p></td>
                    <td className="p-8 font-mono text-xs">{trade.contracts || 1}x</td>
                    <td className={`p-8 text-2xl font-mono tracking-tighter ${pnl && pnl >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{pnl ? `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString()}` : '---'}</td>
                    <td className="p-8 flex gap-2 no-print">{imgs.map((u: any, i: number) => <img key={i} onClick={()=>setActiveImage(u)} src={u} className="w-12 h-12 object-cover rounded-lg border border-white/5 cursor-pointer hover:opacity-50" />)}</td>
                    <td className="p-8 text-right no-print"><button onClick={async () => { if(confirm('Delete?')) await supabase.from('trades').delete().eq('id', trade.id).then(()=>fetchActiveTrades(settings.current_account_id)) }} className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-rose-500 uppercase">Purge</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        .color-empty { fill: #111; } .color-green { fill: #10b981; } .color-red { fill: #f43f5e; }
        rect { rx: 4; transition: 0.2s; } rect:hover { fill: #fff !important; }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; padding: 0 !important; }
          main { background: white !important; color: black !important; padding-top: 0 !important; }
          .bg-[#0a0a0a], .bg-[#0d0d0d] { background: white !important; border: 1px solid #eee !important; }
          .text-white { color: black !important; }
          .border-white\/5 { border-color: #eee !important; }
          * { -webkit-print-color-adjust: exact !important; printer-colors: exact !important; }
        }
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