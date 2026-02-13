'use client'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen overflow-x-hidden antialiased">
        <div className="bg-noise" />
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}