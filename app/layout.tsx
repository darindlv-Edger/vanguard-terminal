'use client'
import './globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <html lang="en">
      <body className="bg-[#050505] text-white min-h-screen flex flex-col">
        
        {/* THE "STUCK TO TOP" NAV */}
        <header className="w-full bg-[#0a0a0a] border-b border-white/10 py-4 px-6 z-[1000000] relative">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            <Link href="/" className="text-emerald-500 font-black tracking-tighter text-sm uppercase">
              Vanguard.Terminal
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/" className={`text-[10px] font-black uppercase tracking-widest ${pathname === '/' ? 'text-white' : 'text-white/40'}`}>Home</Link>
              <Link href="/journal" className={`text-[10px] font-black uppercase tracking-widest ${pathname === '/journal' ? 'text-white' : 'text-white/40'}`}>Journal</Link>
              <Link href="/playbook" className={`text-[10px] font-black uppercase tracking-widest ${pathname === '/playbook' ? 'text-white' : 'text-white/40'}`}>Playbook</Link>
              
              {user ? (
                <button 
                  onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                  className="text-[10px] font-black uppercase tracking-widest text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg">Login</Link>
              )}
            </nav>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 w-full relative">
          {children}
        </main>

      </body>
    </html>
  )
}