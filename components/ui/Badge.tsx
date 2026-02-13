import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    className?: string;
    size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
    const styles = {
        success: "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20",
        warning: "bg-[#fff600]/10 text-[#fff600] border-[#fff600]/20",
        danger: "bg-[#ff003c]/10 text-[#ff003c] border-[#ff003c]/20",
        info: "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/20",
        neutral: "bg-white/5 text-white/50 border-white/10"
    };

    const sizeStyles = {
        sm: "text-[9px] px-2 py-0.5",
        md: "text-[10px] px-3 py-1"
    };

    return (
        <span className={twMerge(clsx(
            "inline-flex items-center justify-center font-bold tracking-widest uppercase rounded-full border backdrop-blur-md",
            styles[variant],
            sizeStyles[size],
            className
        ))}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 animate-pulse" />
            {children}
        </span>
    );
}
