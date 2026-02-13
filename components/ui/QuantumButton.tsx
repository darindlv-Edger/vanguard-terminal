'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface QuantumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export function QuantumButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    ...props
}: QuantumButtonProps) {

    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 rounded-lg overflow-hidden group";

    const variants = {
        primary: "bg-[#00f0ff] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] border border-[#00f0ff]",
        secondary: "bg-transparent border border-white/20 text-white hover:border-white/50 hover:bg-white/5",
        danger: "bg-[#ff003c] text-white shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_35px_rgba(255,0,60,0.5)] border border-[#ff003c]",
        ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "text-[10px] px-3 py-1.5 h-8 gap-2",
        md: "text-xs px-6 py-3 h-11 gap-2.5",
        lg: "text-sm px-8 py-4 h-14 gap-3"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {icon && <span className="opacity-80">{icon}</span>}
                    <span className="relative z-10">{children}</span>
                </>
            )}

            {/* Shine effect for primary/danger */}
            {(variant === 'primary' || variant === 'danger') && (
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            )}
        </motion.button>
    );
}
