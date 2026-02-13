'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, BookOpen, Book, Settings, LogOut, Terminal, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { PageTransition } from '@/components/layout/PageTransition';

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: 'Command', path: '/', icon: <Terminal size={18} /> },
        { name: 'Journal', path: '/journal', icon: <BookOpen size={18} /> },
        { name: 'Playbook', path: '/playbook', icon: <Book size={18} /> },
        { name: 'Analytics', path: '/analytics', icon: <Activity size={18} /> },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-[#00f0ff]/30">
            {/* Sidebar - Desktop */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black/90 border-r border-white/5 backdrop-blur-xl z-50 hidden md:flex flex-col">
                {/* Brand */}
                <div className="p-8 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                            <LayoutGrid size={18} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-widest uppercase">Vanguard</h1>
                            <p className="text-[9px] text-white/40 font-mono tracking-widest">TERMINAL v2.0</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive ? 'text-[#00f0ff] bg-[#00f0ff]/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-[#00f0ff]/5 border-r-2 border-[#00f0ff]"
                                    />
                                )}
                                <span className="relative z-10">{item.icon}</span>
                                <span className="relative z-10 text-xs font-bold uppercase tracking-widest">{item.name}</span>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Disconnect</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
                {/* Mobile Header would go here */}

                {/* Content */}
                <div className="flex-1 w-full max-w-[1920px] mx-auto p-6 md:p-12 relative z-10">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>

                {/* Global Background Elements */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    {/* Ambient Glows */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00f0ff]/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7000ff]/5 blur-[150px] rounded-full" />
                </div>
            </main>
        </div>
    );
}
