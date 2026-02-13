import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlassCard({ children, className, intensity = 'medium', ...props }: GlassCardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300 border border-white/5 shadow-xl relative overflow-hidden backdrop-blur-xl translate-z-0";
  
  const intensityStyles = {
    low: "bg-black/40",
    medium: "bg-black/60",
    high: "bg-black/80"
  };

  return (
    <div 
      className={twMerge(clsx(baseStyles, intensityStyles[intensity], className))}
      {...props}
    >
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Content wrapper to ensure z-index above noise */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />
    </div>
  );
}
