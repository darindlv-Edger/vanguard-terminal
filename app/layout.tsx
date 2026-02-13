import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VANGUARD // TERMINAL',
  description: 'Elite Trading Performance Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* This body tag is the 'Global Wrapper'. 
          If there was a <Navbar /> or <Sidebar /> here from Antigravity, 
          removing it fixes the layout.
      */}
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        {/* Background Grid - Global */}
        <div className="fixed inset-0 z-[-1] opacity-[0.02] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }} 
        />
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}