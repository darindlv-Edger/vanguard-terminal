'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // First, try to log in
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    
    if (signInError) {
      // If login fails, try to sign up as a new user
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        alert(signUpError.message)
      } else {
        alert('Account created! Logging you in...')
        router.push('/journal')
      }
    } else {
      router.push('/journal')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem]">
        <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Vanguard Access</h1>
        <form onSubmit={handleAuth} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="w-full py-4 bg-white text-black font-black rounded-xl uppercase hover:bg-emerald-500 transition-all">
            {loading ? 'Processing...' : 'Enter Terminal'}
          </button>
        </form>
      </div>
    </div>
  )
}